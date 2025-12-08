"use client"

import { ChartBase } from "@/components/ui/chart-base";

interface FounderDNAChartProps {
  stats: {
    phdRatio: number;
    overseasRatio: number;
    totalFounders: number;
    totalProjects: number;
  };
}

export function FounderDNAChart({ stats }: FounderDNAChartProps) {
  
  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: 'bottom'
    },
    series: [
      {
        name: '学历分布',
        type: 'pie',
        radius: ['50%', '70%'],
        center: ['25%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold',
            formatter: '{b}\n{d}%'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: Math.round(stats.phdRatio * 100), name: '博士/PhD' },
          { value: 100 - Math.round(stats.phdRatio * 100), name: '其他' }
        ]
      },
      {
        name: '教育背景',
        type: 'pie',
        radius: ['50%', '70%'],
        center: ['75%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold',
            formatter: '{b}\n{d}%'
          }
        },
        data: [
          { value: Math.round(stats.overseasRatio * 100), name: '海外高校' },
          { value: 100 - Math.round(stats.overseasRatio * 100), name: '国内高校' }
        ]
      }
    ]
  };

  return (
    <ChartBase options={option} height={350} minimal={true} />
  );
}
