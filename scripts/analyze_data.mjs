import fs from 'fs';
import path from 'path';

const BATCHES_DIR = path.join(process.cwd(), 'data/batches');

// Helper to get all projects
function getAllProjects() {
  if (!fs.existsSync(BATCHES_DIR)) return [];
  const files = fs.readdirSync(BATCHES_DIR);
  const allProjects = [];

  files.forEach(file => {
    if (file.endsWith('.json')) {
      const filePath = path.join(BATCHES_DIR, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const projects = JSON.parse(content);
      allProjects.push(...projects);
    }
  });
  return allProjects;
}

const projects = getAllProjects();

// 1. Tag Analysis
const tagCounts = {};
projects.forEach(p => {
  if (p.tags && Array.isArray(p.tags)) {
    p.tags.forEach(t => {
      const tag = t.trim();
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  }
});

console.log('--- Top 30 Tags ---');
const sortedTags = Object.entries(tagCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 30);

sortedTags.forEach(([tag, count]) => {
  console.log(`${tag}: ${count}`);
});

// 2. University Analysis
const uniCounts = {};
projects.forEach(p => {
  if (p.founders && Array.isArray(p.founders)) {
    p.founders.forEach(f => {
      if (f.education && Array.isArray(f.education)) {
        f.education.forEach(edu => {
          if (!edu) return;
          const u = edu.trim();
          uniCounts[u] = (uniCounts[u] || 0) + 1;
        });
      }
    });
  }
});

console.log('\n--- Top 30 Universities ---');
const sortedUnis = Object.entries(uniCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 30);

sortedUnis.forEach(([uni, count]) => {
  console.log(`${uni}: ${count}`);
});
