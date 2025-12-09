import fs from 'fs';
import path from 'path';

const BATCHES_DIR = path.join(process.cwd(), 'data/batches');

// Helper to get all projects
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
let phdFounders = 0;
let masterFounders = 0;
let potentialFalsePositives = [];

console.log(`Total Projects: ${projects.length}`);

projects.forEach(p => {
  if (p.founders && Array.isArray(p.founders)) {
    p.founders.forEach(f => {
      totalFounders++;
      const bio = (f.bio || "").toLowerCase();
      const education = (f.education || []).join(" ").toLowerCase();
      
      // 宽松匹配
      const hasPhD = bio.includes("phd") || bio.includes("博士") || education.includes("phd") || education.includes("博士");
      const hasMaster = bio.includes("master") || bio.includes("硕士") || education.includes("master") || education.includes("硕士");
      
      if (hasMaster) masterFounders++;
      
      if (hasPhD) {
        phdFounders++;
        
        // 提取关键词附近的上下文，帮助人工判断
        const idx = bio.indexOf("博士") !== -1 ? bio.indexOf("博士") : bio.indexOf("phd");
        if (idx !== -1) {
            const start = Math.max(0, idx - 10);
            const end = Math.min(bio.length, idx + 20);
            const context = bio.substring(start, end);
            
            // 简单的“疑点”检查
            if (bio.includes("退学") || bio.includes("肄业") || bio.includes("辍学") || bio.includes("候选人") || bio.includes("candidate")) {
                potentialFalsePositives.push(`[${f.name}] ${context}`);
            }
        }
      }
    });
  }
});

console.log(`Total Founders: ${totalFounders}`);
console.log(`PhD Founders (Loose Match): ${phdFounders}`);
console.log(`Master Founders (Loose Match): ${masterFounders}`);
console.log(`PhD Ratio: ${(phdFounders / totalFounders * 100).toFixed(2)}%`);
console.log(`Advanced Degree (PhD+Master, overlap possible): ${phdFounders + masterFounders} (Simple Sum, overlap exists)`);

console.log("\n--- Potential False Positives (Dropout/Candidate) ---");
potentialFalsePositives.forEach(p => console.log(p));

