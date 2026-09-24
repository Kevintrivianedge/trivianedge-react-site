// Generates dist/.well-known/agent-skills/index.json (Agent Skills Discovery
// RFC v0.2.0) from the SKILL.md files copied out of public/. Runs after
// `vite build` so each digest is computed from the exact bytes being served.
import { createHash } from 'crypto';
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist', '.well-known', 'agent-skills');
const base = 'https://www.trivianedge.com/.well-known/agent-skills';

if (!existsSync(root)) throw new Error(`Missing ${root}; is public/.well-known/agent-skills present?`);

const skills = readdirSync(root, { withFileTypes: true })
  .filter(d => d.isDirectory() && existsSync(join(root, d.name, 'SKILL.md')))
  .map(d => {
    const bytes = readFileSync(join(root, d.name, 'SKILL.md'));
    const description = /^description:\s*(.+)$/m.exec(bytes.toString('utf-8'))?.[1]?.trim();
    if (!/^[a-z0-9-]+$/.test(d.name)) throw new Error(`Invalid skill name: ${d.name}`);
    if (!description) throw new Error(`${d.name}/SKILL.md has no description in its frontmatter`);
    return {
      name: d.name,
      type: 'skill-md',
      description,
      url: `${base}/${d.name}/SKILL.md`,
      digest: `sha256:${createHash('sha256').update(bytes).digest('hex')}`,
    };
  });

const index = { $schema: 'https://schemas.agentskills.io/discovery/0.2.0/schema.json', skills };
writeFileSync(join(root, 'index.json'), JSON.stringify(index, null, 2) + '\n');
console.log(`✓ Agent skills index: ${skills.map(s => s.name).join(', ')}`);
