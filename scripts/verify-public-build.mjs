import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const output = 'dist';
const privatePath = /(^|[\\/])(?:\.env(?:\.[^\\/]+)?|\.git|\.github|\.claude|\.codex|node_modules|dist-ssr|stats\.html|AGENTS\.md|SKILL\.md)(?:[\\/]|$)|\.(?:map|pem|p12|key|tsx?)$/i;
const publicAgentSkill = /^\.well-known[\\/]agent-skills[\\/][\w-]+[\\/]SKILL\.md$/;
const textFile = /\.(?:html|m?js|css|json|txt|md|xml|svg)$/i;
const sensitiveContent = [
  ['source map reference', /[#@]\s*sourceMappingURL\s*=/],
  ['private key', /-----BEGIN (?:[A-Z]+ )*PRIVATE KEY-----/],
  ['credential signature', /\b(?:sk-ant-[A-Za-z0-9_-]{20,}|gh[pousr]_[A-Za-z0-9]{30,}|AKIA[A-Z0-9]{16})\b/],
  ['assistant instructions', /TrivianEdge assistant operating instructions|CONVERSATIONAL FLOW INSTRUCTIONS:/],
];

const issues = [];

async function scan(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  await Promise.all(entries.map(async entry => {
    const file = join(directory, entry.name);
    const path = relative(output, file);
    if (entry.isSymbolicLink() || (privatePath.test(path) && !publicAgentSkill.test(path))) {
      issues.push(`Unexpected public artifact: ${path}`);
    } else if (entry.isDirectory()) {
      await scan(file);
    } else if (textFile.test(path)) {
      const content = await readFile(file, 'utf8');
      for (const [label, pattern] of sensitiveContent) {
        if (pattern.test(content)) issues.push(`Unexpected ${label}: ${path}`);
      }
    }
  }));
}

await scan(output);
if (issues.length) {
  console.error(issues.sort().join('\n'));
  process.exitCode = 1;
} else {
  console.log('Public build artifact checks passed.');
}
