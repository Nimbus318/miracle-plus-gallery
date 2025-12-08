// lib/analytics.ts (Update)

import { getAllProjects } from "./data";
import { getCategoryForTag } from "./taxonomy";

// ... existing code ...

// --- New Trend Data Logic ---
// 按“大类”统计每年的分布，生成河流图数据
export function getCategoryTrends() {
  const projects = getAllProjects();
  
  // 结构: { "2021": { "AI": 10, "Bio": 5 }, "2022": { ... } }
  // 注意：我们按"年"而不是"届"来聚合，为了让河流图更平滑
  const yearMap: Record<string, Record<string, number>> = {};
  
  // 初始化年份
  const years = [2021, 2022, 2023, 2024, 2025];
  years.forEach(y => yearMap[y] = {});

  projects.forEach(p => {
    // 解析年份：2025S -> 2025
    const year = parseInt(p.batch_id.substring(0, 4));
    if (!yearMap[year]) yearMap[year] = {};

    // 将项目归类到主要赛道
    // 一个项目可能有多个 Tag，我们取第一个能匹配到大类的 Tag，或者统计所有大类
    // 为了河流图的总数对得上项目数，我们这里采用"优先归类法"：
    // AI > Hardware > Bio > Future > Software > Consumer
    const categories = new Set(p.tags.map(t => getCategoryForTag(t)));
    
    let mainCat = "Other";
    if (categories.has("AI")) mainCat = "AI";
    else if (categories.has("Hardware")) mainCat = "Hardware";
    else if (categories.has("Bio")) mainCat = "Bio";
    else if (categories.has("Future")) mainCat = "Future";
    else if (categories.has("Software")) mainCat = "Software";
    else if (categories.has("Consumer")) mainCat = "Consumer";

    yearMap[year][mainCat] = (yearMap[year][mainCat] || 0) + 1;
  });

  // 转换为 Recharts 格式
  const chartData = years.map(year => {
    return {
      name: year.toString(),
      AI: yearMap[year]["AI"] || 0,
      Hardware: yearMap[year]["Hardware"] || 0,
      Bio: yearMap[year]["Bio"] || 0,
      Future: yearMap[year]["Future"] || 0,
      Software: yearMap[year]["Software"] || 0,
      Consumer: yearMap[year]["Consumer"] || 0,
      Other: yearMap[year]["Other"] || 0,
    };
  });

  return chartData;
}
