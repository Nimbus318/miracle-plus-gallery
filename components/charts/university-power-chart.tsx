"use client"

import { ChartBase } from "@/components/ui/chart-base";
import { useRouter } from "next/navigation";

interface UniversityPowerChartProps {
  data: { name: string; value: number }[];
}

export function UniversityPowerChart({ data }: UniversityPowerChartProps) {
  const router = useRouter();

  const option = {
    title: {
      text: '高校创业势力榜',
      subtext: 'Top 15 创始人来源院校',
      left: 'left'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      boundaryGap: [0, 0.01]
    },
    yAxis: {
      type: 'category',
      data: data.map(d => d.name).reverse() // Reverse to show top at top
    },
    series: [
      {
        name: '创始人数量',
        type: 'bar',
        data: data.map(d => d.value).reverse(),
        itemStyle: {
          color: '#3b82f6'
        },
        label: {
          show: true,
          position: 'right'
        }
      }
    ]
  };

  const handleChartClick = (params: any) => {
    // Navigate to Explore with filter
    if (params.name) {
      router.push(`/explore?uni=${encodeURIComponent(params.name)}`);
    }
  };

  return (
    <ChartBase 
      options={option} 
      height={500} 
      onEvents={{
        click: handleChartClick
      }}
    />
  );
}
