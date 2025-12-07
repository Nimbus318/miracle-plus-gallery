import { getAllProjects, Project } from "./data";

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
