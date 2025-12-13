"use client"

import { ChartBase } from "@/components/ui/chart-base";
import { Info } from "lucide-react";

interface FounderDNAChartProps {
  stats: {
    advancedDegreeRatio: number;
    phdRatio: number;
    overseasRatio: number;
    serialEntrepreneurRatio: number;
    youngFounderRatio: number;
    teamSizeDistribution: { name: string; value: number }[];
    totalFounders: number;
  };
}

export function FounderDNAChart({ stats }: FounderDNAChartProps) {
  
  const teamSizeOption = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center',
      itemWidth: 10,
      itemHeight: 10,
    },
    series: [
      {
        name: '创始人数量',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '60%'],
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
            fontSize: 20,
            fontWeight: 'bold',
            formatter: '{b}\n{c}'
          }
        },
        labelLine: {
          show: false
        },
        data: stats.teamSizeDistribution.map((d, i) => ({
            value: d.value,
            name: d.name,
            itemStyle: {
                color: ['#fed7aa', '#fb923c', '#ea580c', '#9a3412'][i % 4]
            }
        }))
      }
    ]
  };

  const metrics = [
    { label: "博士/PhD", value: stats.phdRatio, color: "text-purple-500" },
    { label: "海外背景", value: stats.overseasRatio, color: "text-blue-500" },
    { label: "连续创业", value: stats.serialEntrepreneurRatio, color: "text-emerald-500" },
    { 
      label: "00后/在读", 
      value: stats.youngFounderRatio, 
      color: "text-pink-500",
      tooltip: "包含简介中明确提及“00后”、“在读”、“休学”的创始人，或根据入学年份推算的本科/硕士在校生。"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full items-center">
       {/* Left: Key Metrics (2x2 Grid) */}
       <div className="grid grid-cols-2 gap-4">
          {metrics.map((m, i) => (
             <div key={i} className="flex flex-col justify-center p-4 bg-muted/30 rounded-lg border border-border/50 h-24 relative overflow-visible">
                <div className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                   {m.label}
                   {m.tooltip && (
                     <div className="group relative flex items-center">
                        <Info className="w-3 h-3 cursor-help opacity-70 hover:opacity-100" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2.5 bg-popover text-popover-foreground text-xs rounded-md shadow-lg border border-border hidden group-hover:block z-50 pointer-events-none text-left leading-relaxed">
                          {m.tooltip}
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-popover border-r border-b border-border rotate-45 transform"></div>
                        </div>
                     </div>
                   )}
                </div>
                <span className={`text-2xl font-bold font-mono ${m.color}`}>
                  {(m.value * 100).toFixed(1)}%
                </span>
             </div>
          ))}
       </div>

       {/* Right: Team Size Distribution */}
       <div className="h-[220px]">
          <h4 className="text-xs font-semibold text-muted-foreground mb-1 text-center">创始团队规模分布</h4>
          <ChartBase options={teamSizeOption} height={200} minimal={true} />
       </div>
    </div>
  );
}
