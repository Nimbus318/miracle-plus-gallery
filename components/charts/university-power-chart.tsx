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
    const uniFounders: Record<string, Set<string>> = {};
    const overseasKeywords = ["University", "College", "Institute", "MIT", "CMU", "Stanford", "Harvard", "Oxford", "Cambridge", "Yale", "Princeton", "Berkeley", "UCLA", "UCSD", "Cornell", "Columbia", "Imperial", "UCL", "NUS", "NTU", "ETH", "EPFL", "Toronto", "Waterloo"];
    const overseasChineseKeywords = ["香港", "澳门", "新加坡", "斯坦福", "哈佛", "麻省理工", "剑桥", "牛津", "耶鲁", "普林斯顿", "伯克利", "哥伦比亚", "康奈尔", "帝国理工", "伦敦大学", "卡内基梅隆", "芝加哥", "宾夕法尼亚", "多伦多", "滑铁卢"];
    const chinaKeywords = ["china", "chinese", "beijing", "shanghai", "tsinghua", "peking", "fudan", "zhejiang", "nanjing", "wuhan", "hust", "harbin", "xi'an", "tongji", "nankai", "xiamen", "shandong", "sichuan", "jilin", "dalian", "beihang", "bit", "ustc", "renmin", "shenzhen", "guangzhou", "chengdu", "chongqing", "tianjin", "hangzhou", "suzhou", "ningbo", "kunshan", "westlake", "scut", "sustech"];

    projects.forEach(p => {
      p.founders.forEach(f => {
        const founderId = f.name || "Unknown"; // Use name as ID for deduplication
        f.education.forEach(edu => {
          if (!edu) return;
          if (!uniFounders[edu]) {
            uniFounders[edu] = new Set();
          }
          uniFounders[edu].add(founderId);
        });
      });
    });

    return Object.entries(uniFounders)
      .map(([name, foundersSet]) => {
        const value = foundersSet.size;
        
        // Improved overseas detection
        const n = name.toLowerCase();
        const hasEnglishKeyword = overseasKeywords.some(k => n.includes(k.toLowerCase()));
        const hasChineseKeyword = overseasChineseKeywords.some(k => name.includes(k));
        const isChina = chinaKeywords.some(k => n.includes(k.toLowerCase()));
        
        const isOverseas = (hasEnglishKeyword || hasChineseKeyword) && !isChina;
        
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
