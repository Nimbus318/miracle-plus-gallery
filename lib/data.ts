import fs from 'fs';
import path from 'path';
import { normalizeTag, normalizeUniversity } from './taxonomy';
import { Project, Batch, Founder, BatchStats } from './types';

export * from './types';

// --- 数据加载 ---

const DATA_DIR = path.join(process.cwd(), 'data');

export function getBatches(): Batch[] {
  try {
    const filePath = path.join(DATA_DIR, 'batches.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error reading batches.json:", error);
    return [];
  }
}

// Global cache to avoid re-reading/re-normalizing on every call in dev
let cachedProjects: Project[] | null = null;

export function getAllProjects(): Project[] {
  if (cachedProjects) return cachedProjects;

  try {
    const batchesDir = path.join(DATA_DIR, 'batches');
    if (!fs.existsSync(batchesDir)) return [];

    const files = fs.readdirSync(batchesDir);
    const allProjects: Project[] = [];

    files.forEach(file => {
      if (file.endsWith('.json')) {
        const filePath = path.join(batchesDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const projects = JSON.parse(content) as Project[];
        
        const batchIdFromFile = file.replace('.json', '');
        
        // --- Data Cleaning & Normalization ---
        const cleanedProjects = projects.map(p => ({
          ...p,
          batch_id: p.batch_id || batchIdFromFile,
          tags: p.tags ? p.tags.map(t => normalizeTag(t)) : [],
          founders: p.founders ? p.founders.map(f => ({
            ...f,
            education: f.education ? f.education.map(e => normalizeUniversity(e)) : []
          })) : []
        }));

        allProjects.push(...cleanedProjects);
      }
    });

    cachedProjects = allProjects;
    return allProjects;
  } catch (error) {
    console.error("Error reading project files:", error);
    return [];
  }
}

// --- 派生查询 (Derived Queries) ---

export function getProjectById(id: string): Project | undefined {
  const projects = getAllProjects();
  return projects.find((p) => p.id === id);
}

export function getProjectsByBatch(batchId: string): Project[] {
  const projects = getAllProjects();
  return projects.filter((p) => p.batch_id === batchId);
}

// 获取所有出现的 Tag（按频次排序）
export function getTopTags(limit = 20): { name: string; count: number }[] {
  const projects = getAllProjects();
  const tagCounts: Record<string, number> = {};

  projects.forEach((p) => {
    p.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  return Object.entries(tagCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

// 获取 Top 高校分布 (Now using normalized data)
export function getTopUniversities(limit = 10): { name: string; count: number }[] {
  const projects = getAllProjects();
  const uniCounts: Record<string, number> = {};

  projects.forEach((p) => {
    p.founders.forEach((f) => {
      f.education.forEach((uni) => {
        if (!uni) return;
        uniCounts[uni] = (uniCounts[uni] || 0) + 1;
      });
    });
  });

  return Object.entries(uniCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

// 关联推荐：根据当前项目，推荐相似项目
// 逻辑：优先匹配相同 Tag 数量最多的项目
export function getRelatedProjects(currentProject: Project, limit = 3): { project: Project; score: number; commonTags: string[] }[] {
  const allProjects = getAllProjects();
  
  const related = allProjects
    .filter(p => p.id !== currentProject.id) // 排除自己
    .map(p => {
      // 计算 Tag 重合度
      const intersection = p.tags.filter(t => currentProject.tags.includes(t));
      return { project: p, score: intersection.length, commonTags: intersection };
    })
    .filter(item => item.score > 0) // Only keep those with matches
    .sort((a, b) => b.score - a.score) // 降序排列
    .slice(0, limit);
    
  return related;
}

// 人脉网络推荐：基于 Founder 的学校和工作经历
export function getNetworkProjects(currentProject: Project, limit = 3): { project: Project; reason: string }[] {
  const allProjects = getAllProjects();
  
  const currentSchools = new Set(currentProject.founders.flatMap(f => f.education));
  const currentCompanies = new Set(currentProject.founders.flatMap(f => f.work_history));

  const network = allProjects
    .filter(p => p.id !== currentProject.id)
    .map(p => {
      let score = 0;
      let reasons: string[] = [];

      // 检查学校重合
      const pSchools = new Set(p.founders.flatMap(f => f.education));
      const sharedSchools = [...currentSchools].filter(s => pSchools.has(s));
      if (sharedSchools.length > 0) {
        score += 5 * sharedSchools.length;
        reasons.push(`校友: ${sharedSchools.join(", ")}`);
      }

      // 检查公司重合 (权重更高)
      const pCompanies = new Set(p.founders.flatMap(f => f.work_history));
      const sharedCompanies = [...currentCompanies].filter(c => pCompanies.has(c));
      if (sharedCompanies.length > 0) {
        score += 10 * sharedCompanies.length;
        reasons.push(`前同事: ${sharedCompanies.join(", ")}`);
      }

      // 同届加分 (如果是校友/同事且同届，关系更紧密)
      if (score > 0 && p.batch_id === currentProject.batch_id) {
        score += 2;
      }

      return { project: p, score, reason: reasons.join(" · ") };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return network;
}
