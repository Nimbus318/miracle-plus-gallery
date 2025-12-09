import fs from 'fs';
import path from 'path';

const BATCHES_DIR = path.join(process.cwd(), 'data/batches');

function getAllProjects() {
  if (!fs.existsSync(BATCHES_DIR)) return [];
  const files = fs.readdirSync(BATCHES_DIR).filter(f => f !== 'batches.json' && f.endsWith('.json'));
  const allProjects = [];

  files.forEach(file => {
    const filePath = path.join(BATCHES_DIR, file);
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const projects = JSON.parse(content);
        allProjects.push(...projects);
    } catch (e) {
        console.error(`Error reading ${file}:`, e);
    }
  });
  return allProjects;
}

const projects = getAllProjects();
let totalFounders = 0;
let overseasFounders = 0;

const overseasKeywords = ["University", "College", "Institute", "School", "Polytechnic", "MIT", "CMU", "Stanford", "Harvard", "Oxford", "Cambridge", "Yale", "Princeton", "Berkeley", "UCLA", "UCSD", "Cornell", "Columbia", "Imperial", "UCL", "NUS", "NTU", "ETH", "EPFL", "Toronto", "Waterloo"];
const excludeKeywords = ["Chinese", "Beijing", "Shanghai", "Fudan", "Zhejiang", "Nanjing", "Wuhan", "HUST", "Sun Yat-sen", "Harbin", "Xi'an", "Tongji", "Nankai", "Tianjin", "Xiamen", "Shandong", "Sichuan", "Jilin", "Dalian", "South China", "Beihang", "BIT", "USTC", "Renmin", "China", "Hong Kong", "HKU", "HKUST", "CUHK", "CityU", "PolyU"]; 
// 注意：香港通常被视为具有国际视野，但在统计“海外”时有时会分开。
// MiraclePlus 的语境里，"Global" 通常包含欧美名校。我们先按纯海外（不含港澳台）算一下，或者包含。
// 通常“海外背景”包含港澳台。

projects.forEach(p => {
  if (p.founders && Array.isArray(p.founders)) {
    p.founders.forEach(f => {
      totalFounders++;
      const education = (f.education || []);
      
      const isOverseas = education.some(edu => {
          // 必须包含英文关键词
          const hasEnglish = /[a-zA-Z]/.test(edu);
          if (!hasEnglish) return false;

          // 简单的规则：如果是纯中文，肯定不是；如果是英文，检查是否是中国高校的英文名
          // 这里简单判断：如果包含 University 等词，且不包含 China/Chinese/Beijing 等
          const isEnglishName = overseasKeywords.some(k => edu.includes(k));
          const isChina = excludeKeywords.some(k => edu.includes(k));
          
          return isEnglishName && !isChina;
      });

      if (isOverseas) {
          overseasFounders++;
      }
    });
  }
});

console.log(`Total Founders: ${totalFounders}`);
console.log(`Overseas Founders: ${overseasFounders}`);
console.log(`Ratio: ${(overseasFounders / totalFounders * 100).toFixed(2)}%`);

