// 赛道分类体系 (Taxonomy)
// 用于归一化标签，并将标签分组到大类中以便筛选

export type Category = 
  | "AI" 
  | "Hardware" 
  | "Software" 
  | "Bio" 
  | "Consumer" 
  | "Future" 
  | "Other";

export interface TaxonomyNode {
  category: Category;
  label: string; // 显示名称 (e.g., "人工智能")
  tags: string[]; // 包含的具体 Tag (e.g., ["AI", "AIGC", "大模型"])
}

// 1. 标签别名映射 (Tag Aliases)
// 将不规范或重复的 Tag 映射到标准 Tag
export const TAG_ALIASES: Record<string, string> = {
  "Artificial Intelligence": "AI",
  "LLM": "大模型",
  "GenAI": "AIGC",
  "Generative AI": "AIGC",
  "Computer Vision": "CV",
  "NLP": "自然语言处理",
  "Robotics": "机器人",
  "MedTech": "医疗健康",
  "BioTech": "生物科技",
  "E-commerce": "电商",
  "Game": "游戏",
  "Metaverse": "元宇宙",
  "AR/VR": "XR",
  "Crypto": "Web3",
  "Blockchain": "Web3",
  "Semiconductor": "芯片",
  "Chip": "芯片",
  "Enterprise Service": "企业服务",
  "Ent Service": "企业服务",
  "DevTools": "开发者工具",
  "Open Source": "开源",
  "Smart Manufacturing": "智能制造",
};

// 2. 高校名称别名映射 (University Aliases)
export const UNI_ALIASES: Record<string, string> = {
  // 国内
  "Tsinghua": "清华大学",
  "Tsinghua University": "清华大学",
  "THU": "清华大学",
  "Peking University": "北京大学",
  "PKU": "北京大学",
  "SJTU": "上海交通大学",
  "Shanghai Jiao Tong University": "上海交通大学",
  "Fudan": "复旦大学",
  "Fudan University": "复旦大学",
  "ZJU": "浙江大学",
  "Zhejiang University": "浙江大学",
  "USTC": "中国科学技术大学",
  "NJU": "南京大学",
  "HUST": "华中科技大学",
  "WHU": "武汉大学",
  "Tongji": "同济大学",
  "HIT": "哈尔滨工业大学",
  "BIT": "北京理工大学",
  "BUAA": "北京航空航天大学",
  "Beihang": "北京航空航天大学",
  "UCAS": "中国科学院",
  "Chinese Academy of Sciences": "中国科学院",
  "HKU": "香港大学",
  "HKUST": "香港科技大学",
  "CUHK": "香港中文大学",
  
  // 海外
  "Massachusetts Institute of Technology": "MIT",
  "Stanford University": "Stanford",
  "Carnegie Mellon University": "CMU",
  "Carnegie Mellon": "CMU",
  "University of California, Berkeley": "UC Berkeley",
  "Berkeley": "UC Berkeley",
  "University of Oxford": "Oxford",
  "University of Cambridge": "Cambridge",
  "Harvard University": "Harvard",
  "Imperial": "Imperial College London",
  "ICL": "Imperial College London",
  "UCL": "UCL", // University College London
  "University College London": "UCL",
  "NUS": "NUS", // Singapore
  "National University of Singapore": "NUS",
  "NTU": "NTU", // Nanyang
  "Nanyang Technological University": "NTU",
  "UPenn": "UPenn",
  "University of Pennsylvania": "UPenn",
  "Columbia": "Columbia University",
  "Cornell": "Cornell University",
  "Yale": "Yale University",
  "UIUC": "UIUC",
  "University of Illinois at Urbana-Champaign": "UIUC",
  "UCLA": "UCLA",
  "UCSD": "UCSD",
  "Georgia Institute of Technology": "Georgia Tech",
  "ETH": "ETH Zurich",
  "Swiss Federal Institute of Technology": "ETH Zurich",
};

// 3. 赛道分类树 (Category Tree)
// 用于侧边栏筛选
export const TAXONOMY: TaxonomyNode[] = [
  {
    category: "AI",
    label: "AI & 数据",
    tags: ["AI", "大模型", "AIGC", "AI Agent", "AI Infra", "AI for Science", "CV", "多模态", "数据", "算力"]
  },
  {
    category: "Hardware",
    label: "机器人 & 硬科技",
    tags: ["机器人", "具身智能", "智能硬件", "芯片", "传感器", "自动驾驶", "智能制造", "商业航天", "半导体", "光电"]
  },
  {
    category: "Software",
    label: "软件 & SaaS",
    tags: ["SaaS", "企业服务", "开发者工具", "生产力工具", "开源", "工业软件", "安全", "云原生", "FinTech"]
  },
  {
    category: "Bio",
    label: "生物 & 科学",
    tags: ["生物科技", "医疗健康", "新材料", "能源", "碳中和", "合成生物", "脑机接口", "生命科学"]
  },
  {
    category: "Future",
    label: "前沿 & Web3",
    tags: ["元宇宙", "Web3", "3D", "空间计算", "XR", "量子计算"]
  },
  {
    category: "Consumer",
    label: "消费 & 应用",
    tags: ["消费应用", "社交", "游戏", "消费电子", "教育", "电商", "内容"]
  }
];

// 辅助函数：归一化 Tag
export function normalizeTag(tag: string): string {
  const t = tag.trim();
  return TAG_ALIASES[t] || t;
}

// 辅助函数：归一化 University
export function normalizeUniversity(uni: string): string {
  const u = uni.trim();
  // 1. 查表
  if (UNI_ALIASES[u]) return UNI_ALIASES[u];
  
  // 2. 简单规则 (包含匹配)
  // 注意：这里要小心误伤，比如 "北京大学" 和 "北京大学医学部"
  // 简单的策略是只对英文做一些处理，或者暂时只依靠字典
  return u;
}

// 辅助函数：获取 Tag 所属的大类
export function getCategoryForTag(tag: string): Category {
  const nTag = normalizeTag(tag);
  for (const node of TAXONOMY) {
    if (node.tags.includes(nTag)) {
      return node.category;
    }
  }
  return "Other";
}
