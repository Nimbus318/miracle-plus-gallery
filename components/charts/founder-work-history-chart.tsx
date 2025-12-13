"use client"

import { ChartBase } from "@/components/ui/chart-base";
import { useRouter } from "next/navigation";

interface FounderWorkHistoryChartProps {
  stats: { name: string; value: number }[];
  height?: number;
}

export function FounderWorkHistoryChart({ stats, height = 500 }: FounderWorkHistoryChartProps) {
  const router = useRouter();

  const option = {
    legend: { show: false },
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
      data: stats.map(d => d.name).reverse(),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        width: 100,
        overflow: 'truncate',
        interval: 0
      }
    },
    series: [
      {
        name: '创始人数量',
        type: 'bar',
        barWidth: '60%',
        data: stats.map(d => {
          const isDomestic = /[\u4e00-\u9fa5]/.test(d.name);
          return {
            value: d.value,
            itemStyle: {
              borderRadius: [0, 4, 4, 0],
              color: isDomestic ? '#3b82f6' : '#8b5cf6' // Blue for Domestic, Purple for Int'l
            }
          };
        }).reverse(),
        label: {
          show: true,
          position: 'right'
        }
      }
    ]
  };

  const handleChartClick = (params: any) => {
    // Future: Link to explore page filtered by company?
    // Current explore page might not support work history filtering yet.
    // console.log(params.name);
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
