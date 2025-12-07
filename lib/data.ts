import fs from 'fs';
import path from 'path';

// --- 类型定义 ---

export interface Founder {
  name: string;
  role: string;
  bio: string;
  education: string[];
  work_history: string[];
}

export interface Project {
  id: string;
  batch_id: string;
  name: string;
  one_liner: string;
  description: string;
  image_url: string;
  founders: Founder[];
  tags: string[];
}

export interface BatchStats {
  project_count: number;
  acceptance_rate: string;
  phd_ratio?: string;
  researcher_founder_ratio?: string;
  overseas_experience?: string;
  [key: string]: any;
}

export interface Batch {
  id: string;
  name: string;
  year: number;
  season: 'Spring' | 'Fall';
  date: string;
  location: string;
  stats: BatchStats;
  highlights: string[];
  description: string;
}

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

export function getAllProjects(): Project[] {
  try {
    const batchesDir = path.join(DATA_DIR, 'batches');
    if (!fs.existsSync(batchesDir)) return [];

    const files = fs.readdirSync(batchesDir);
    const allProjects: Project[] = [];

    files.forEach(file => {
      if (file.endsWith('.json')) {
        const filePath = path.join(batchesDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const projects = JSON.parse(content);
        allProjects.push(...projects);
      }
    });

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

// 高校名称归一化映射
const UNI_NORMALIZATION: Record<string, string> = {
  "清华": "清华大学",
  "Tsinghua": "清华大学",
  "Tsinghua University": "清华大学",
  "北大": "北京大学",
  "Peking University": "北京大学",
  "交大": "上海交通大学", // 通常指上交
  "上海交大": "上海交通大学",
  "SJTU": "上海交通大学",
  "复旦": "复旦大学",
  "Fudan": "复旦大学",
  "浙大": "浙江大学",
  "Zhejiang University": "浙江大学",
  "ZJU": "浙江大学",
  "中科大": "中国科学技术大学",
  "USTC": "中国科学技术大学",
  "南大": "南京大学",
  "NJU": "南京大学",
  "北航": "北京航空航天大学",
  "BUAA": "北京航空航天大学",
  "Beihang University": "北京航空航天大学",
  "同济": "同济大学",
  "武大": "武汉大学",
  "Wuhan University": "武汉大学",
  "华科": "华中科技大学",
  "HUST": "华中科技大学",
  "人大": "中国人民大学",
  "MIT": "麻省理工学院",
  "Massachusetts Institute of Technology": "麻省理工学院",
  "Stanford": "斯坦福大学",
  "Stanford University": "斯坦福大学",
  "Harvard": "哈佛大学",
  "Harvard University": "哈佛大学",
  "CMU": "卡耐基梅隆大学",
  "Carnegie Mellon University": "卡耐基梅隆大学",
  "Carnegie Mellon": "卡耐基梅隆大学",
  "UC Berkeley": "加州大学伯克利分校",
  "University of California, Berkeley": "加州大学伯克利分校",
  "Berkeley": "加州大学伯克利分校",
  "UCLA": "加州大学洛杉矶分校",
  "Oxford": "牛津大学",
  "University of Oxford": "牛津大学",
  "Cambridge": "剑桥大学",
  "University of Cambridge": "剑桥大学",
  "Imperial": "帝国理工学院",
  "Imperial College London": "帝国理工学院",
  "ICL": "帝国理工学院",
  "NUS": "新加坡国立大学",
  "National University of Singapore": "新加坡国立大学",
  "HKU": "香港大学",
  "The University of Hong Kong": "香港大学",
  "HKUST": "香港科技大学",
  "CUHK": "香港中文大学",
  "Chinese University of Hong Kong": "香港中文大学",
  "港中文": "香港中文大学",
  "UPenn": "宾夕法尼亚大学",
  "University of Pennsylvania": "宾夕法尼亚大学",
  "Cornell": "康奈尔大学",
  "Cornell University": "康奈尔大学",
  "Yale": "耶鲁大学",
  "Yale University": "耶鲁大学",
  "Columbia": "哥伦比亚大学",
  "Columbia University": "哥伦比亚大学",
  "NYU": "纽约大学",
  "New York University": "纽约大学",
  "UCL": "伦敦大学学院",
  "University College London": "伦敦大学学院"
};

// 获取 Top 高校分布
export function getTopUniversities(limit = 10): { name: string; count: number }[] {
  const projects = getAllProjects();
  const uniCounts: Record<string, number> = {};

  projects.forEach((p) => {
    p.founders.forEach((f) => {
      f.education.forEach((rawUni) => {
        if (!rawUni) return;
        
        // 1. 去除空白
        let uni = rawUni.trim();
        
        // 2. 查表归一化
        // 优先全匹配，其次尝试包含匹配（如 "清华大学计算机系" -> "清华大学"）
        if (UNI_NORMALIZATION[uni]) {
          uni = UNI_NORMALIZATION[uni];
        } else {
          // 简单的包含匹配策略
          for (const [key, val] of Object.entries(UNI_NORMALIZATION)) {
            if (uni.includes(key)) {
              uni = val;
              break;
            }
          }
        }
        
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
export function getRelatedProjects(currentProject: Project, limit = 3): Project[] {
  const allProjects = getAllProjects();
  
  const related = allProjects
    .filter(p => p.id !== currentProject.id) // 排除自己
    .map(p => {
      // 计算 Tag 重合度
      const intersection = p.tags.filter(t => currentProject.tags.includes(t));
      return { ...p, matchScore: intersection.length };
    })
    .sort((a, b) => b.matchScore - a.matchScore) // 降序排列
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
