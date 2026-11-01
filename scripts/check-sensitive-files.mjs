import {execFileSync} from 'node:child_process';

// Inspect the Git index, never print matching secret contents.
const files = execFileSync('git', ['ls-files', '-z'], {encoding: 'utf8'}).split('\0').filter(Boolean);
const failures = [];
for (const file of files) {
  const name = file.split('/').at(-1);
  const forbidden = (name === '.env' || name.startsWith('.env.')) && name !== '.env.example'
    || /(^|\/)(?:node_modules|\.aws|\.ssh|\.git|dist)(\/|$)/i.test(file)
    || /^backend\/data\//.test(file)
    || /(?:ledger.*\.json(?:\.lock|\.next)?|\.(?:pem|key|p12|pfx)|(?:^|\/)id_(?:rsa|ed25519))$/i.test(file);
  if (forbidden) { failures.push(`${file}: prohibited file`); continue; }
  const content = execFileSync('git', ['show', `:${file}`], {maxBuffer: 8 * 1024 * 1024}).toString('utf8');
  if (/\bsk-(?:proj-|svcacct-)?[A-Za-z0-9_-]{20,}\b/.test(content)
    || /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(content)
    || /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/.test(content)
    || /\bgh[pousr]_[A-Za-z0-9]{30,}\b/.test(content)) {
    failures.push(`${file}: possible credential (value redacted)`);
  }
}
if (!files.length) throw new Error('No indexed files to inspect; stage source before running this check.');
if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else console.log(`Sensitive-file check passed for ${files.length} indexed files; no contents printed.`);
