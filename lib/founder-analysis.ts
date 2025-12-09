import { Founder } from './types';

export interface FounderProfile {
  isPhD: boolean;
  isAdvancedDegree: boolean;
  isOverseas: boolean;
}

// 关键词常量
const OVERSEAS_KEYWORDS = ["University", "College", "Institute", "School", "Polytechnic", "MIT", "CMU", "Stanford", "Harvard", "Oxford", "Cambridge", "Yale", "Princeton", "Berkeley", "UCLA", "UCSD", "Cornell", "Columbia", "Imperial", "UCL", "NUS", "NTU", "ETH", "EPFL", "Toronto", "Waterloo"];
// 增加海外高校（中文/归一化后）识别
const OVERSEAS_CHINESE_KEYWORDS = ["香港", "澳门", "新加坡", "斯坦福", "哈佛", "麻省理工", "剑桥", "牛津", "耶鲁", "普林斯顿", "伯克利", "哥伦比亚", "康奈尔", "帝国理工", "伦敦大学", "卡内基梅隆", "芝加哥", "宾夕法尼亚", "多伦多", "滑铁卢"];

// 增加国内排除词：常见国内高校英文名关键词、城市名
const CHINA_KEYWORDS = [
  "china", "chinese", "beijing", "shanghai", "tsinghua", "peking", "fudan", "zhejiang", "nanjing", "wuhan", "hust", 
  "harbin", "xi'an", "tongji", "nankai", "xiamen", "shandong", "sichuan", "jilin", "dalian", "beihang", "bit", 
  "ustc", "renmin", "shenzhen", "guangzhou", "chengdu", "chongqing", "tianjin", "hangzhou", "suzhou", "ningbo", 
  "kunshan", "westlake", "scut", "sustech", "hkust(gz)", "nyu shanghai", "duke kunshan"
];

// 正则表达式
// \b 确保全字匹配
const REGEX_PHD = /\b(ph\.?d\.?|doctor|postdoc|博士|博士后)\b/i;
// master, m.s., m.a., m.sc, m.eng, m.b.a., mba, emba, 硕士, 研究生
const REGEX_MASTER = /\b(master|m\.s\.?|m\.a\.?|m\.sc\.?|m\.eng\.?|m\.b\.a\.?|e?mba|硕士|研究生)\b/i;

export function analyzeFounderProfile(founder: Founder): FounderProfile {
  const bio = (founder.bio || "").toLowerCase();
  const education = (founder.education || []); 
  const eduStr = education.join(" ").toLowerCase(); // 合并教育经历以便统一搜索

  // 1. PhD Check
  // 检查 bio 和 education 中是否包含博士相关词汇
  const isPhD = REGEX_PHD.test(bio) || REGEX_PHD.test(eduStr) || bio.includes("博士") || eduStr.includes("博士"); // 中文无需边界匹配

  // 2. Advanced Degree Check (PhD || Master || MBA)
  const isMaster = REGEX_MASTER.test(bio) || REGEX_MASTER.test(eduStr) || bio.includes("硕士") || eduStr.includes("硕士") || bio.includes("研究生") || eduStr.includes("研究生");
  const isAdvancedDegree = isPhD || isMaster;

  // 3. Overseas Check
  const isOverseas = education.some(edu => {
      const e = edu.toLowerCase();
      
      // A. 包含英文教育机构关键词
      const hasEnglishKeyword = OVERSEAS_KEYWORDS.some(k => e.includes(k.toLowerCase()));
      // B. 包含知名海外高校中文名/地区名
      const hasChineseKeyword = OVERSEAS_CHINESE_KEYWORDS.some(k => edu.includes(k));

      const hasKeyword = hasEnglishKeyword || hasChineseKeyword;

      // C. 必须排除中国高校 (英文名包含 China/Chinese/City 或特定校名)
      const isChina = CHINA_KEYWORDS.some(k => e.includes(k));
      
      return hasKeyword && !isChina;
  });

  return {
    isPhD,
    isAdvancedDegree,
    isOverseas
  };
}

