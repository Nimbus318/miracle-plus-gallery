"use client"

import { ChartBase } from "@/components/ui/chart-base";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { Project } from "@/lib/types";

interface UniversityPowerChartProps {
  projects: Project[];
  limit?: number;
  height?: number;
}

export function UniversityPowerChart({ projects, limit = 15, height = 600 }: UniversityPowerChartProps) {
  const router = useRouter();

  // Compute stats: Top unis overall
  const data = useMemo(() => {
    const uniCounts: Record<string, number> = {};
    const overseasKeywords = ["University", "College", "Institute", "MIT", "CMU", "Stanford", "Harvard", "Oxford", "Cambridge"];

    projects.forEach(p => {
      p.founders.forEach(f => {
        f.education.forEach(edu => {
          if (!edu) return;
          // Normalize done in lib/data, assume clean here for now or re-clean if needed
          uniCounts[edu] = (uniCounts[edu] || 0) + 1;
        });
      });
    });

    return Object.entries(uniCounts)
      .map(([name, value]) => {
        // Simple heuristic for color coding
        const isOverseas = overseasKeywords.some(k => name.includes(k) && !name.includes("Chinese") && !name.includes("Beijing"));
        return { name, value, isOverseas };
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, limit);
  }, [projects, limit]);

  const option = {
    legend: { show: false }, // Hide legend
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    grid: {
      left: '0%',
      right: '4%',
      bottom: '3%',
      top: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      boundaryGap: [0, 0.01],
      splitLine: { show: false }
    },
    yAxis: {
      type: 'category',
      data: data.map(d => d.name).reverse(),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        width: 90, // Limit label width
        overflow: 'truncate', // Truncate long names
        interval: 0
      }
    },
    series: [
      {
        name: '创始人数量',
        type: 'bar',
        barWidth: '60%',
        data: data.map(d => ({
          value: d.value,
          itemStyle: {
            borderRadius: [0, 4, 4, 0],
            // Highlight overseas universities with a different color
            color: d.isOverseas ? '#8b5cf6' : '#3b82f6'
          }
        })).reverse(),
        label: {
          show: true,
          position: 'right'
        }
      }
    ]
  };

  const handleChartClick = (params: any) => {
    if (params.name) {
      router.push(`/explore?uni=${encodeURIComponent(params.name)}`);
    }
  };

  return (
    <div className="h-full">
      <ChartBase 
        options={option} 
        height={height} 
        minimal={true}
        onEvents={{ click: handleChartClick }}
      />
    </div>
  );
}
