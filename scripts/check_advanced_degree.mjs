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
let advancedFounders = 0; // PhD or Master

projects.forEach(p => {
  if (p.founders && Array.isArray(p.founders)) {
    p.founders.forEach(f => {
      totalFounders++;
      const bio = (f.bio || "").toLowerCase();
      const education = (f.education || []).join(" ").toLowerCase();
      
      const hasPhD = bio.includes("phd") || bio.includes("博士") || education.includes("phd") || education.includes("博士");
      const hasMaster = bio.includes("master") || bio.includes("硕士") || education.includes("master") || education.includes("硕士") || bio.includes("mba") || education.includes("mba");
      
      if (hasPhD || hasMaster) {
          advancedFounders++;
      }
    });
  }
});

console.log(`Total Founders: ${totalFounders}`);
console.log(`Advanced Degree Founders (PhD || Master || MBA): ${advancedFounders}`);
console.log(`Ratio: ${(advancedFounders / totalFounders * 100).toFixed(2)}%`);

