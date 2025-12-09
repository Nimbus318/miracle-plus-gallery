"use client"

import { ChartBase } from "@/components/ui/chart-base";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { Project } from "@/lib/types";
import { Category, getCategoryForTag, TAXONOMY } from "@/lib/taxonomy";

interface SectorTrendChartProps {
  projects: Project[];
  height?: number; // Add optional height prop
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

export function SectorTrendChart({ projects, height = 400 }: SectorTrendChartProps) {
  const router = useRouter();

  // Create a map for Category ID -> Chinese Label
  const categoryLabelMap = useMemo(() => {
    const map = TAXONOMY.reduce((acc, curr) => {
      acc[curr.category] = curr.label;
      return acc;
    }, {} as Record<string, string>);
    map["Other"] = "其他";
    return map;
  }, []);

  const derivePrimaryCategory = (tags: string[]): Category => {
    const priority: Category[] = ["AI", "Hardware", "Software", "Bio", "Future", "Consumer", "Other"];
    const seen = new Set<Category>();
    tags.forEach(tag => {
      seen.add(getCategoryForTag(tag));
    });
    return priority.find(p => seen.has(p)) || "Other";
  };

  // Process Data: Calculate percentage of each category per batch
  const data = useMemo(() => {
    const batchMap: Record<string, Record<string, number>> = {};
    const batchTotals: Record<string, number> = {};
    
    // 1. Count categories per batch
    projects.forEach(p => {
      const batch = p.batch_id;
      const category = derivePrimaryCategory(p.tags || []);
      
      if (!batchMap[batch]) batchMap[batch] = {};
      batchMap[batch][category] = (batchMap[batch][category] || 0) + 1;
      
      batchTotals[batch] = (batchTotals[batch] || 0) + 1;
    });

    // 2. Sort batches chronologically
    const sortedBatches = Object.keys(batchMap).sort((a, b) => {
       const yA = parseInt(a.substring(0, 4));
       const yB = parseInt(b.substring(0, 4));
       if (yA !== yB) return yA - yB;
       return (a.endsWith('F') ? 2 : 1) - (b.endsWith('F') ? 2 : 1);
    });

    // 3. Transform to percentages
    const categories = ["AI", "Bio", "Hardware", "Software", "Future", "Consumer", "Other"];
    
    return {
       batches: sortedBatches,
       series: categories.map(cat => ({
         name: categoryLabelMap[cat] || cat, // Use Chinese Label
         originalKey: cat, // Keep original key for routing
         type: 'line',
         smooth: true,
         symbol: 'circle',
         symbolSize: 6,
         data: sortedBatches.map(batch => {
           const count = batchMap[batch][cat] || 0;
           const total = batchTotals[batch] || 1;
           return parseFloat(((count / total) * 100).toFixed(1));
         })
       }))
    };
  }, [projects, categoryLabelMap]);

  const option = {
    color: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6366f1', '#9ca3af'],
    title: {
      text: '赛道风向标',
      subtext: '核心赛道在各期项目中的占比趋势',
      left: 'left',
      show: false // Hide internal title to use external one
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
      top: 0,
      icon: 'circle'
    },
    grid: {
      left: '0%',
      right: '2%',
      bottom: '3%',
      top: '15%',
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
      // max: 100, // Removed fixed max
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    series: data.series
  };

  const handleChartClick = (params: ClickParams) => {
    // We need to map back from Chinese Label to Category Key for the URL
    // Or we can attach the key to the series data, but ECharts click event params are tricky.
    // Easiest way: Find the series object that matches the name.
    
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
