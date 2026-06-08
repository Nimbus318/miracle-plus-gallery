// 核心赛道标签的中英对照表
export const TAG_TRANSLATIONS: Record<string, string> = {
  // AI
  "AI": "AI",
  "大模型": "LLM",
  "AIGC": "GenAI",
  "AI Agent": "AI Agent",
  "AI Infra": "AI Infra",
  "AI for Science": "AI for Science",
  "CV": "CV",
  "多模态": "Multimodal",
  "数据": "Data",
  "算力": "Compute",
  
  // Hardware
  "机器人": "Robotics",
  "具身智能": "Embodied AI",
  "智能硬件": "Smart Hardware",
  "芯片": "Chips",
  "传感器": "Sensors",
  "自动驾驶": "Autonomous Driving",
  "智能制造": "Smart Mfg",
  "商业航天": "Commercial Space",
  "半导体": "Semiconductor",
  "光电": "Photonics",
  
  // Software
  "SaaS": "SaaS",
  "企业服务": "Enterprise Service",
  "开发者工具": "DevTools",
  "生产力工具": "Productivity",
  "开源": "Open Source",
  "工业软件": "Industrial Software",
  "安全": "Security",
  "云原生": "Cloud Native",
  "FinTech": "FinTech",
  
  // Bio
  "生物科技": "BioTech",
  "医疗健康": "MedTech",
  "新材料": "New Materials",
  "能源": "Energy",
  "碳中和": "Carbon Neutrality",
  "合成生物": "SynBio",
  "脑机接口": "BCI",
  "生命科学": "Life Sciences",
  
  // Future
  "元宇宙": "Metaverse",
  "Web3": "Web3",
  "3D": "3D",
  "空间计算": "Spatial Computing",
  "XR": "XR",
  "量子计算": "Quantum Computing",
  
  // Consumer
  "消费应用": "Consumer Apps",
  "社交": "Social",
  "游戏": "Gaming",
  "消费电子": "Consumer Electronics",
  "教育": "EdTech",
  "电商": "E-commerce",
  "内容": "Content",
  
  // Other
  "出海": "Global/Cross-border",
  "社区": "Community",
  "硬件": "Hardware",
  "软件": "Software",
  "平台": "Platform",

  // Batch Highlights Specific
  "硕士及以上": "Master's+",
  "100% 技术驱动": "100% Tech-Driven",
  "具身 & 智能硬件": "Embodied AI & HW",
  "场景智能": "Scene Intelligence",
  "认知智能": "Cognitive Intelligence",
  "科学智能": "Scientific AI",
  "空间/具身智能": "Spatial/Embodied AI",
  "开源与基础软件": "Open Source & Infra",
  "人工智能": "AI"
};

export function getTranslatedTag(tag: string, lang: 'zh' | 'en'): string {
  if (lang === 'zh') return tag;
  
  // 1. Direct match
  if (TAG_TRANSLATIONS[tag]) return TAG_TRANSLATIONS[tag];

  // 2. Handle "Tag (N家)" pattern -> "Tag (N)"
  const countMatch = tag.match(/^(.+?)\s*\((\d+)家\)$/);
  if (countMatch) {
    const coreTag = countMatch[1];
    const count = countMatch[2];
    const translatedCore = TAG_TRANSLATIONS[coreTag] || coreTag;
    return `${translatedCore} (${count})`;
  }

  return tag;
}

// 辅助函数：翻译统计数据中的文本（部分匹配）
export function getTranslatedStat(text: string, lang: 'zh' | 'en'): string {
  if (lang === 'zh' || !text) return text;
  
  return text
    .replace('硕士及以上', "Master's+")
    .replace('博士及以上', "PhD+")
    .replace('博士/博士后', "PhD/Postdoc")
    .replace('公开履历估算', "public-profile estimate")
    .replace('平均', 'Avg ')
    .replace('岁', ' yo');
}
