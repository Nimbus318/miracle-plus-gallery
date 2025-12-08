"use client"

import { ChartBase } from "@/components/ui/chart-base";
import { useRouter } from "next/navigation";

interface SectorEvolutionChartProps {
  data: any[];
}

export function SectorEvolutionChart({ data }: SectorEvolutionChartProps) {
  const router = useRouter();

  // Extract categories from data keys (excluding "name")
  const categories = data.length > 0 
    ? Object.keys(data[0]).filter(k => k !== 'name')
    : [];

  const option = {
    title: {
      text: '赛道热度演变',
      subtext: '不同批次的项目分布趋势',
      left: 'left'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      data: categories,
      bottom: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: data.map(d => d.name)
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: categories.map(cat => ({
      name: cat,
      type: 'line',
      stack: 'Total',
      areaStyle: {},
      emphasis: {
        focus: 'series'
      },
      data: data.map(d => d[cat] || 0)
    }))
  };

  const handleChartClick = (params: any) => {
    // Navigate to Explore with filter
    // Series name is the Category
    if (params.seriesName) {
      router.push(`/explore?tag=${params.seriesName}`);
    }
  };

  return (
    <ChartBase 
      options={option} 
      height={400} 
      onEvents={{
        click: handleChartClick
      }}
    />
  );
}
