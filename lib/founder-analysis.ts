import { Founder } from './types';

export interface FounderProfile {
  isPhD: boolean;
  isAdvancedDegree: boolean;
  isOverseas: boolean;
  isSerialEntrepreneur: boolean;
  isYoungFounder: boolean;
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
const REGEX_PHD = /\b(ph\.?d\.?|doctor|postdoc|博士|博士后)\b/i;
const REGEX_MASTER = /\b(master|m\.s\.?|m\.a\.?|m\.sc\.?|m\.eng\.?|m\.b\.a\.?|e?mba|硕士|研究生)\b/i;

// Enhanced Serial Regex: Catch "Former Founder", "Previously founded", "Continuous entrepreneur"
const REGEX_SERIAL_EXPLICIT = /(连续创业|serial entrepreneur|多次创业|previous startup)/i;
const REGEX_SERIAL_IMPLIED = /((曾|前|previous|former).{0,10}(创办|创立|founder|co-founder))|((创办|创立|founder|co-founder).{0,10}(之前|曾|前))/i;

// Enhanced Young Regex
const REGEX_YOUNG_KEYWORDS = /(00后|95后|在读|休学|辍学|dropout|undergraduate|student|gap year|30 under 30|30u30|姚班|智班|少年班)/i;
const REGEX_GRADE = /20[0-2][0-9]级/g; // 2000-2029级

export function analyzeFounderProfile(founder: Founder, batchId?: string): FounderProfile {
  const bio = (founder.bio || "").toLowerCase();
  const education = (founder.education || []); 
  const eduStr = education.join(" ").toLowerCase();

  // 1. PhD Check
  const isPhD = REGEX_PHD.test(bio) || REGEX_PHD.test(eduStr) || bio.includes("博士") || eduStr.includes("博士");

  // 2. Advanced Degree Check
  const isMaster = REGEX_MASTER.test(bio) || REGEX_MASTER.test(eduStr) || bio.includes("硕士") || eduStr.includes("硕士") || bio.includes("研究生") || eduStr.includes("研究生");
  const isAdvancedDegree = isPhD || isMaster;

  // 3. Overseas Check
  const isOverseas = education.some(edu => {
      const e = edu.toLowerCase();
      const hasEnglishKeyword = OVERSEAS_KEYWORDS.some(k => e.includes(k.toLowerCase()));
      const hasChineseKeyword = OVERSEAS_CHINESE_KEYWORDS.some(k => edu.includes(k));
      const hasKeyword = hasEnglishKeyword || hasChineseKeyword;
      const isChina = CHINA_KEYWORDS.some(k => e.includes(k));
      return hasKeyword && !isChina;
  });

  // 4. Serial Entrepreneur Check
  const isSerialEntrepreneur = REGEX_SERIAL_EXPLICIT.test(bio) || REGEX_SERIAL_IMPLIED.test(bio);

  // 5. Young Founder Check
  let isYoungFounder = REGEX_YOUNG_KEYWORDS.test(bio);
  
  // Smart Grade Detection (e.g., "2022级" in 2024 Batch -> likely student)
  if (!isYoungFounder && batchId) {
     const batchYear = parseInt(batchId.substring(0, 4));
     const grades = bio.match(REGEX_GRADE) || [];
     if (!Number.isNaN(batchYear)) {
       for (const g of grades) {
         const year = parseInt(g.replace("级", ""));
         if (!Number.isNaN(year)) {
           // If Grade is within 4 years of Batch Year -> Undergrad Student
           // If Grade is within 7 years -> Master/PhD Student (still counted as "Young/Student" context)
           // Let's be strict: if difference is <= 3, definitely student.
           if (batchYear - year <= 4 && batchYear - year >= 0) {
             isYoungFounder = true;
             break;
           }
         }
       }
     }
  }

  return {
    isPhD,
    isAdvancedDegree,
    isOverseas,
    isSerialEntrepreneur,
    isYoungFounder
  };
}

export const COMPANY_ALIASES: Record<string, string[]> = {
  "字节跳动": ["字节跳动", "bytedance", "tiktok", "今日头条", "抖音", "douyin", "朝夕光年", "feishu", "lark"],
  "腾讯": ["腾讯", "tencent", "wechat", "微信", "qq", "timi", "天美"],
  "阿里巴巴": ["阿里巴巴", "alibaba", "ali", "淘宝", "taobao", "天猫", "tmall", "蚂蚁", "ant group", "ant financial", "支付宝", "alipay", "达摩院", "damo"],
  "百度": ["百度", "baidu"],
  "美团": ["美团", "meituan", "点评", "dianping"],
  "京东": ["京东", "jd.com", "jd", "jingdong"],
  "华为": ["华为", "huawei", "hisilicon", "海思"],
  "Microsoft": ["微软", "microsoft", "msra", "azure"],
  "Google": ["谷歌", "google", "deepmind", "waymo", "youtube"],
  "Meta": ["facebook", "meta", "instagram", "whatsapp", "oculus"],
  "Amazon": ["亚马逊", "amazon", "aws"],
  "Apple": ["苹果", "apple"],
  "大疆": ["大疆", "dji"],
  "小米": ["小米", "xiaomi"],
  "NVIDIA": ["英伟达", "nvidia"],
  "Tesla": ["特斯拉", "tesla", "spacex"],
  "Uber": ["优步", "uber"],
  "滴滴": ["滴滴", "didi"],
  "小马智行": ["小马智行", "pony.ai", "pony"],
  "Momenta": ["momenta"],
  "商汤": ["商汤", "sensetime"],
  "旷视": ["旷视", "megvii", "face++"],
  "网易": ["网易", "netease"],
  "拼多多": ["拼多多", "pinduoduo", "temu"],
  "快手": ["快手", "kuaishou"],
  "Bilibili": ["bilibili", "b站"],
  "联想": ["联想", "lenovo"],
  "Intel": ["英特尔", "intel"],
  "IBM": ["ibm"],
  "Oracle": ["甲骨文", "oracle"],
  "Salesforce": ["salesforce"],
  "麦肯锡": ["麦肯锡", "mckinsey"],
  "波士顿咨询": ["波士顿咨询", "bcg"],
  "高盛": ["高盛", "goldman sachs"],
  "摩根士丹利": ["摩根士丹利", "morgan stanley"],
  "红杉": ["红杉", "sequoia"],
  "IDG": ["idg"],
  "真格": ["真格", "zhenfund"],
  "奇绩创坛": ["奇绩创坛", "miracleplus", "miracle plus", "yc china", "y combinator china"],
  "Y Combinator": ["y combinator", "yc"],
  "OpenAI": ["openai"],
  "Anthropic": ["anthropic"]
};

import { Project } from './types';

export function analyzeWorkHistory(projects: Project[]) {
  const companyCounts = new Map<string, Set<string>>(); // Company Name -> Set of Founder Names (to avoid double counting same founder in same company if listed twice)

  projects.forEach(p => {
    p.founders.forEach(f => {
      if (!f.work_history || f.work_history.length === 0) return;
      const founderName = f.name || "Unknown";

      f.work_history.forEach(company => {
        const lowerCompany = company.toLowerCase().trim();
        let normalizedName = company.trim(); // Default to original if no match

        // Check against aliases
        for (const [standardName, aliases] of Object.entries(COMPANY_ALIASES)) {
          if (aliases.some(alias => lowerCompany.includes(alias))) {
            normalizedName = standardName;
            break;
          }
        }

        // Only count if it matched a known big company OR if we want to count everything?
        // Let's count everything but aggregation is key.
        // If it didn't match an alias, we might get "Senior Engineer" as a company name if data is dirty.
        // For now, let's ONLY return the ones that matched our "Big Name" list to keep the chart clean and relevant.
        // OR: We can return everything, but the chart only shows Top 20.
        // Risk of returning "Co-founder" or "CTO" as a company name if data is messy.
        // Let's stick to the mapped ones for high quality insights.
        
        // Actually, let's try to capture matches only.
        let matched = false;
        for (const [standardName, aliases] of Object.entries(COMPANY_ALIASES)) {
            if (aliases.some(alias => lowerCompany.includes(alias))) {
              if (!companyCounts.has(standardName)) {
                companyCounts.set(standardName, new Set());
              }
              companyCounts.get(standardName)?.add(founderName);
              matched = true;
              break;
            }
        }
      });
    });
  });

  return Array.from(companyCounts.entries())
    .map(([name, founders]) => ({ name, value: founders.size }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 20);
}

