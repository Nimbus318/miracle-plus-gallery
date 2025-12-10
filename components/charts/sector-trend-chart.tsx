"use client"

import { ChartBase } from "@/components/ui/chart-base";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { Project } from "@/lib/types";
import { Category, getCategoryForTag, TAXONOMY } from "@/lib/taxonomy";

interface SectorTrendChartProps {
  projects: Project[];
  height?: number;
  selectedCategories?: Category[];
}

type TooltipPoint = {
  axisValue: string;
  value: number;
  color: string;
  seriesName: string;
};

type ClickParams = {
  seriesName: string;
};

export function SectorTrendChart({ projects, height = 400, selectedCategories = [] }: SectorTrendChartProps) {
  const router = useRouter();

  const categoryLabelMap = useMemo(() => {
    const map = TAXONOMY.reduce((acc, curr) => {
      acc[curr.category] = curr.label;
      return acc;
    }, {} as Record<string, string>);
    map["Other"] = "其他";
    return map;
  }, []);

  const chartMode = useMemo(() => {
    if (selectedCategories.length === 0) return 'overview';
    if (selectedCategories.length === 1) return 'drilldown';
    return 'comparison';
  }, [selectedCategories]);

  const data = useMemo(() => {
    const batchTotals: Record<string, number> = {};
    const allBatches = new Set<string>();

    // 1. Pre-process Projects & Batches
    // Map Project -> Set of Categories
    const projectCategoryMap = new Map<string, Set<Category>>();
    
    projects.forEach(p => {
      const batch = p.batch_id;
      allBatches.add(batch);
      batchTotals[batch] = (batchTotals[batch] || 0) + 1;

      const cats = new Set<Category>();
      p.tags.forEach(t => {
        const c = getCategoryForTag(t);
        // Only collect specific categories first
        if (c !== 'Other') {
          cats.add(c);
        }
      });
      
      // Implement "Exclusive Other": 
      // Only assign 'Other' if the project has NO specific categories
      if (cats.size === 0) {
        cats.add('Other');
      }
      
      projectCategoryMap.set(p.id, cats);
    });

    // Sort Batches
    const sortedBatches = Array.from(allBatches).sort((a, b) => {
       const yA = parseInt(a.substring(0, 4));
       const yB = parseInt(b.substring(0, 4));
       if (yA !== yB) return yA - yB;
       return (a.endsWith('F') ? 2 : 1) - (b.endsWith('F') ? 2 : 1);
    });

    // --- MODE: DRILL DOWN (Tags) ---
    if (chartMode === 'drilldown') {
       const targetCategory = selectedCategories[0];
       const taxonomyNode = TAXONOMY.find(n => n.category === targetCategory);
       const allowedTags = new Set(taxonomyNode?.tags || []);
       
       // Identify Top Tags
       const tagCounts: Record<string, number> = {};
       projects.forEach(p => {
          p.tags.forEach(t => {
             if (allowedTags.has(t)) {
                tagCounts[t] = (tagCounts[t] || 0) + 1;
             }
          });
       });
       
       const topTags = Object.entries(tagCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 7)
          .map(e => e[0]);

       // Build Series (Tag Level)
       const series = topTags.map(tag => {
         const batchCounts: Record<string, number> = {};
         projects.forEach(p => {
           if (p.tags.includes(tag)) {
             batchCounts[p.batch_id] = (batchCounts[p.batch_id] || 0) + 1;
           }
         });

         return {
             name: tag,
             originalKey: tag,
             type: 'line',
             smooth: true,
             symbol: 'circle',
             symbolSize: 6,
             data: sortedBatches.map(batch => {
                const count = batchCounts[batch] || 0;
                const total = batchTotals[batch] || 1;
                return parseFloat(((count / total) * 100).toFixed(1));
             })
         };
       });

       return {
          batches: sortedBatches,
          series,
          title: `${categoryLabelMap[targetCategory] || targetCategory} · 细分趋势`
       };
    } 
    
    // --- MODE: OVERVIEW or COMPARISON (Categories) ---
    else {
        let categoriesToShow: Category[] = [];
        if (chartMode === 'comparison') {
           categoriesToShow = selectedCategories;
        } else {
           categoriesToShow = ["AI", "Bio", "Hardware", "Software", "Future", "Consumer", "Other"];
        }

        const series = categoriesToShow.map(cat => {
           const batchCounts: Record<string, number> = {};
           
           projects.forEach(p => {
              const pCats = projectCategoryMap.get(p.id);
              if (pCats && pCats.has(cat)) {
                 batchCounts[p.batch_id] = (batchCounts[p.batch_id] || 0) + 1;
              }
           });

           return {
             name: categoryLabelMap[cat] || cat, 
             originalKey: cat,
             type: 'line',
             smooth: true,
             symbol: 'circle',
             symbolSize: 6,
             data: sortedBatches.map(batch => {
               const count = batchCounts[batch] || 0;
               const total = batchTotals[batch] || 1;
               return parseFloat(((count / total) * 100).toFixed(1));
             })
           };
        });

        return {
           batches: sortedBatches,
           series,
           title: chartMode === 'comparison' ? '赛道对比' : '赛道风向标'
        };
    }
  }, [projects, selectedCategories, chartMode, categoryLabelMap]);

  const option = {
    color: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6366f1', '#9ca3af'],
    title: {
      text: data.title,
      textStyle: { fontSize: 14, fontWeight: 'normal', color: '#666' },
      left: 'center',
      top: 0,
      show: true 
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params: TooltipPoint[]) => {
        if (!params.length) return "";
        const points = [...params].sort((a, b) => b.value - a.value);
        let res = `<div class="font-bold mb-1">${points[0].axisValue}</div>`;
        points.forEach(p => {
           res += `<div class="flex items-center justify-between gap-4 text-xs">
                    <span class="flex items-center gap-1">
                      <span class="w-2 h-2 rounded-full" style="background:${p.color}"></span>
                      ${p.seriesName}
                    </span>
                    <span class="font-mono font-bold">${p.value}%</span>
                  </div>`;
        });
        return res;
      }
    },
    legend: {
      data: data.series.map(s => s.name),
      top: 25,
      icon: 'circle'
    },
    grid: {
      left: '0%',
      right: '2%',
      bottom: '3%',
      top: '20%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.batches,
      axisLine: { show: false },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      },
      axisLabel: {
        formatter: '{value}%'
      }
    },
    series: data.series
  };

  const handleChartClick = (params: ClickParams) => {
    const clickedSeriesName = params.seriesName;
    const seriesItem = data.series.find(s => s.name === clickedSeriesName);
    
    if (seriesItem && seriesItem.originalKey) {
      router.push(`/explore?tag=${seriesItem.originalKey}`);
    }
  };

  return (
    <ChartBase 
      options={option} 
      height={height} 
      minimal={true}
      onEvents={{ click: handleChartClick }}
    />
  );
}
