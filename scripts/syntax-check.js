/* eslint-disable */
/**
 * Lightweight syntax verifier (no network / no install needed).
 * Transpiles every .ts/.tsx file under a target dir with sucrase and reports
 * syntax errors. Does NOT type-check — it catches parse-level mistakes only.
 *
 * Usage: node scripts/syntax-check.js <dir> <sucraseModulePath>
 */
const fs = require('fs');
const path = require('path');

const targetDir = process.argv[2] || path.join(__dirname, '..', 'src');
const sucrasePath = process.argv[3];
const { transform } = require(sucrasePath);

let checked = 0;
const failures = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules') continue;
      walk(full);
    } else if (/\.tsx?$/.test(entry.name)) {
      const code = fs.readFileSync(full, 'utf8');
      const transforms = entry.name.endsWith('.tsx')
        ? ['typescript', 'jsx']
        : ['typescript'];
      try {
        transform(code, { transforms, filePath: full });
        checked++;
      } catch (e) {
        failures.push({ file: full, message: e.message });
      }
    }
  }
}

walk(targetDir);

if (failures.length) {
  console.log(`\n❌ ${failures.length} file(s) with syntax errors:\n`);
  for (const f of failures) {
    console.log(`  ${f.file}\n    ${f.message}\n`);
  }
  process.exit(1);
} else {
  console.log(`✅ ${checked} files parsed cleanly (TS + JSX syntax).`);
}
