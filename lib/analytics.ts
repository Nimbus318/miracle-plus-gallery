import { getAllProjects, Project } from "./data";
import { getCategoryForTag } from "./taxonomy";

// --- Force Graph Data ---

interface GraphNode {
  id: string;
  name: string;
  type: 'project' | 'school' | 'company';
  val: number; // 节点大小权重
  color?: string;
}

interface GraphLink {
  source: string;
  target: string;
  type: 'alumni' | 'ex-employee';
}

export function getEcosystemGraphData() {
  const projects = getAllProjects();
  
  const nodes = new Map<string, GraphNode>();
  const links: GraphLink[] = [];

  projects.forEach(p => {
    // 1. Add Project Node
    if (!nodes.has(p.id)) {
      nodes.set(p.id, { 
        id: p.id, 
        name: p.name, 
        type: 'project', 
        val: 5,
        color: 'rgba(1, 123, 255, 0.8)' // Brand Blue
      });
    }

    p.founders.forEach(f => {
      // 2. Add School Nodes & Links
      f.education.forEach(edu => {
        if (!edu) return;
        // 归一化后的学校名作为 ID
        if (!nodes.has(edu)) {
          nodes.set(edu, { 
            id: edu, 
            name: edu, 
            type: 'school', 
            val: 3,
            color: '#10b981' // Green
          });
        } else {
          // 增加权重
          const node = nodes.get(edu)!;
          node.val += 1;
        }
        // 建立连接: Project -> School
        links.push({ source: p.id, target: edu, type: 'alumni' });
      });

      // 3. Add Company Nodes & Links
      f.work_history.forEach(company => {
        if (!company) return;
        if (!nodes.has(company)) {
          nodes.set(company, { 
            id: company, 
            name: company, 
            type: 'company', 
            val: 3,
            color: '#f59e0b' // Orange
          });
        } else {
          const node = nodes.get(company)!;
          node.val += 1;
        }
        // 建立连接: Project -> Company
        links.push({ source: p.id, target: company, type: 'ex-employee' });
      });
    });
  });

  // 过滤掉孤立的 School/Company 节点（只出现一次的可能意义不大，会导致图太乱？先保留，看效果）
  // 实际上，为了让图更聚合，我们可以只保留至少连接了 2 个项目的 School/Company
  // 但目前的样本量（100个），保留全部也没问题。

  return {
    nodes: Array.from(nodes.values()),
    links
  };
}

// --- Trend Chart Data ---

export function getTrackTrends() {
  const projects = getAllProjects();
  
  // 结构: { "2025S": { "AI": 10, "Hardware": 5 }, "2025F": { ... } }
  const batchMap: Record<string, Record<string, number>> = {};
  const allTags = new Set<string>();

  projects.forEach(p => {
    if (!batchMap[p.batch_id]) {
      batchMap[p.batch_id] = {};
    }
    p.tags.forEach(tag => {
      allTags.add(tag);
      batchMap[p.batch_id][tag] = (batchMap[p.batch_id][tag] || 0) + 1;
    });
  });

  // 筛选出 Top Tags (总数最多的前 5-8 个) 以免图表太乱
  const tagCounts = Array.from(allTags).map(tag => {
    let total = 0;
    Object.values(batchMap).forEach(counts => total += (counts[tag] || 0));
    return { tag, total };
  }).sort((a, b) => b.total - a.total).slice(0, 8);

  const topTags = tagCounts.map(t => t.tag);

  // 转换为 Recharts 需要的 Array 格式
  // [ { name: "2025S", "AI": 10, "Hardware": 5 }, ... ]
  const chartData = Object.keys(batchMap).sort().map(batchId => {
    const item: any = { name: batchId };
    topTags.forEach(tag => {
      item[tag] = batchMap[batchId][tag] || 0;
    });
    return item;
  });

  return { chartData, topTags };
}

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

  // 转换为 Recharts 需要的 Array 格式
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

  return { 
    chartData, 
    categories: ["AI", "Hardware", "Bio", "Future", "Software", "Consumer", "Other"] 
  };
}
