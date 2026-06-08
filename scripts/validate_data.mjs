import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const dataDir = path.join(rootDir, 'data');
const batchesDir = path.join(dataDir, 'batches');
const publicDir = path.join(rootDir, 'public');

const errors = [];
const warnings = [];
const alternateImageWarnings = [];

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (error) {
    errors.push(`Invalid JSON: ${path.relative(rootDir, filePath)} (${error.message})`);
    return null;
  }
}

function requireString(project, field, file) {
  if (typeof project[field] !== 'string' || project[field].trim() === '') {
    errors.push(`${file}: ${project.id || '<missing id>'} missing string field "${field}"`);
  }
}

const batches = readJson(path.join(dataDir, 'batches.json')) || [];
const seenBatchIds = new Set();
const seenProjectIds = new Set();
const actualCounts = new Map();

for (const batch of batches) {
  if (!batch.id) {
    errors.push('data/batches.json contains a batch without id');
    continue;
  }
  if (seenBatchIds.has(batch.id)) {
    errors.push(`Duplicate batch id: ${batch.id}`);
  }
  seenBatchIds.add(batch.id);
}

if (fs.existsSync(batchesDir)) {
  for (const filename of fs.readdirSync(batchesDir).filter((name) => name.endsWith('.json')).sort()) {
    const filePath = path.join(batchesDir, filename);
    const projects = readJson(filePath);
    if (!Array.isArray(projects)) {
      errors.push(`${path.relative(rootDir, filePath)} must be a JSON array`);
      continue;
    }

    const batchId = filename.replace(/\.json$/, '');
    actualCounts.set(batchId, projects.length);

    projects.forEach((project, index) => {
      const label = project?.id || `${batchId}[${index}]`;
      if (!project || typeof project !== 'object') {
        errors.push(`${filename}: project at index ${index} is not an object`);
        return;
      }

      requireString(project, 'id', filename);
      requireString(project, 'batch_id', filename);
      requireString(project, 'name', filename);
      requireString(project, 'one_liner', filename);
      requireString(project, 'description', filename);
      requireString(project, 'image_url', filename);

      if (project.batch_id && project.batch_id !== batchId) {
        errors.push(`${filename}: ${label} has batch_id "${project.batch_id}", expected "${batchId}"`);
      }

      if (project.id && seenProjectIds.has(project.id)) {
        errors.push(`Duplicate project id: ${project.id}`);
      }
      if (project.id) seenProjectIds.add(project.id);

      if (!Array.isArray(project.tags) || project.tags.length === 0) {
        errors.push(`${filename}: ${label} must have at least one tag`);
      }

      if (!Array.isArray(project.founders)) {
        errors.push(`${filename}: ${label} founders must be an array`);
      } else {
        project.founders.forEach((founder, founderIndex) => {
          if (!founder.name) {
            errors.push(`${filename}: ${label} founder ${founderIndex} missing name`);
          }
          if (!Array.isArray(founder.education)) {
            errors.push(`${filename}: ${label} founder ${founder.name || founderIndex} education must be an array`);
          }
          if (!Array.isArray(founder.work_history)) {
            errors.push(`${filename}: ${label} founder ${founder.name || founderIndex} work_history must be an array`);
          }
        });
      }

      if (typeof project.image_url === 'string' && project.image_url.startsWith('/')) {
        const imagePath = path.join(publicDir, project.image_url);
        if (!fs.existsSync(imagePath)) {
          const parsed = path.parse(imagePath);
          const siblings = fs.existsSync(parsed.dir)
            ? fs.readdirSync(parsed.dir).filter((entry) => path.parse(entry).name === parsed.name)
            : [];

          if (siblings.length > 0) {
            alternateImageWarnings.push(`${filename}: ${label} image path ${project.image_url} missing, found ${siblings.join(', ')}`);
          } else {
            errors.push(`${filename}: ${label} image does not exist: ${project.image_url}`);
          }
        }
      }
    });
  }
}

for (const batch of batches) {
  if (!batch.id || batch.disabled) continue;
  const actual = actualCounts.get(batch.id) || 0;
  const official = batch.stats?.project_count;
  if (typeof official === 'number' && official !== actual) {
    warnings.push(`${batch.id}: official project_count=${official}, extracted=${actual}`);
  }
}

warnings.forEach((warning) => console.warn(`WARN ${warning}`));

if (alternateImageWarnings.length > 0) {
  console.warn(`WARN ${alternateImageWarnings.length} image paths use a missing extension but have a same-basename asset`);
  alternateImageWarnings.slice(0, 5).forEach((warning) => console.warn(`WARN ${warning}`));
  if (alternateImageWarnings.length > 5) {
    console.warn(`WARN ... ${alternateImageWarnings.length - 5} more image extension warnings omitted`);
  }
}

if (errors.length > 0) {
  errors.forEach((error) => console.error(`ERROR ${error}`));
  process.exit(1);
}

console.log(`Data validation passed: ${seenBatchIds.size} batches, ${seenProjectIds.size} projects`);
