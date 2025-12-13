import fs from 'fs';
import path from 'path';

const batchesDir = path.join(process.cwd(), 'data/batches');
const files = fs.readdirSync(batchesDir).filter(f => f.endsWith('.json'));

let allFounders = [];

files.forEach(file => {
  const content = fs.readFileSync(path.join(batchesDir, file), 'utf-8');
  const projects = JSON.parse(content);
  projects.forEach(p => {
    p.founders.forEach(f => {
      allFounders.push({
        pid: p.id,
        name: f.name,
        bio: f.bio,
        edu: f.education,
        work: f.work_history
      });
    });
  });
});

console.log(JSON.stringify(allFounders, null, 2));
