// Read-only release identity checks. Never invokes the assistant or an AWS API.
const sha = process.argv[2];
if (!/^[a-f0-9]{40}$/i.test(sha ?? '')) throw new Error('Usage: node scripts/verify-release.mjs <40-character GitHub SHA>');
const expected = sha.toLowerCase();
const origin = 'https://aws-developer-playground-phuc.pointykayak.chatgpt.site';
const repository = 'https://api.github.com/repos/thphuc06/aws_playground';
const backend = 'https://aws-playground-review.onrender.com';
const checks = [];
async function json(url, headers = {}) {
  const response = await fetch(url, {headers: {'User-Agent':'aws-playground-release-verification', ...headers}, redirect:'error', signal:AbortSignal.timeout(50000)});
  if (!response.ok) throw new Error(`HTTP ${response.status} from ${new URL(url).hostname}`);
  return response.json();
}
const results = await Promise.allSettled([
  (async () => {
    const head = await json(`${repository}/commits/main`);
    const runs = await json(`${repository}/actions/runs?head_sha=${expected}&per_page=10`);
    const run = runs.workflow_runs?.find(item => item.head_sha === expected && item.name === 'CI' && item.event === 'push');
    const jobs = run ? await json(`${repository}/actions/runs/${run.id}/jobs`) : null;
    const required = jobs?.jobs?.find(item => item.name === 'Required checks');
    return {check:'github', expected, head:head.sha, ci:run?.conclusion ?? run?.status ?? 'missing', required:required?.conclusion ?? required?.status ?? 'missing', url:run?.html_url, passed:head.sha === expected && run?.status === 'completed' && run?.conclusion === 'success' && required?.conclusion === 'success'};
  })(),
  (async () => {
    const status = await json(`${backend}/api/review/status`, {Origin:origin});
    return {check:'backend', expected, revision:status.buildRevision, enabled:status.enabled, capabilities:status.capabilities, passed:status.buildRevision === expected && status.enabled === true};
  })(),
]);
for (let index = 0; index < results.length; index++) {
  const result = results[index];
  checks.push(result.status === 'fulfilled' ? result.value : {check:index === 0 ? 'github' : 'backend', passed:false, error:result.reason instanceof Error ? result.reason.message : 'Verification failed'});
}
console.log(JSON.stringify({expected, checkedAt:new Date().toISOString(), checks, passed:checks.every(check => check.passed), sites:'Verify the native Sites deployment terminal status and source version separately.'},null,2));
if (!checks.every(check => check.passed)) process.exitCode = 1;
