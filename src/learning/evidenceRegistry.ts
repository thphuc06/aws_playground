import type {ClaimEvidence} from './evidenceTypes';

/**
 * Start empty deliberately. Existing source URLs and audit.scope metadata are
 * inventoried separately; neither is silently promoted to an independent review.
 * Add a claim only with the bounded statement, context and evidence below.
 */
export const claimEvidenceRegistry: ClaimEvidence[] = [];

export function validateClaimEvidence(claims: ClaimEvidence[], fieldPaths: Map<string, Set<string>>): string[] {
  const issues: string[] = [], seen = new Set<string>();
  for (const claim of claims) {
    const prefix = claim.id || '(missing claim ID)';
    if (!claim.id || seen.has(claim.id)) issues.push(prefix + ': missing or duplicate claim ID');
    seen.add(claim.id);
    const paths = fieldPaths.get(claim.serviceId);
    if (!paths) issues.push(prefix + ': unknown service ' + claim.serviceId);
    if (!claim.fieldPaths.length) issues.push(prefix + ': no field paths');
    for (const path of claim.fieldPaths) if (!paths?.has(path)) issues.push(prefix + ': unknown field ' + path);
    if (!claim.statement.trim() || !claim.applicability.trim()) issues.push(prefix + ': statement and applicability required');
    if (claim.enforcement === 'local-rule' && !claim.ruleId?.trim()) issues.push(prefix + ': local rule requires stable rule ID');
    for (const source of claim.sources) {
      try {
        const url = new URL(source.url);
        if (url.protocol !== 'https:' || !['docs.aws.amazon.com', 'aws.amazon.com', 'kiro.dev'].includes(url.hostname) || url.username || url.password) throw new Error();
      } catch { issues.push(prefix + ': source must be an official HTTPS reference'); }
    }
    if (claim.review.status === 'reviewed') {
      const checked = claim.review.checked ?? '', date = new Date(checked);
      if (!claim.review.reviewer?.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(checked) || Number.isNaN(date.valueOf()) || date.toISOString().slice(0, 10) !== checked) issues.push(prefix + ': reviewer and review date required');
      if (!claim.sources.some(source => source.relationship === 'claim-support' && source.section?.trim())) issues.push(prefix + ': a reference link alone does not support the reviewed claim');
      if (claim.enforcement === 'local-rule') for (const kind of ['positive', 'negative', 'boundary', 'unknown-context'] as const) {
        if (!claim.tests.some(test => test.kind === kind && test.file.trim() && test.case.trim()) && !claim.testExemptions?.[kind]?.trim()) issues.push(prefix + ': missing test evidence or explicit exemption for ' + kind);
      }
    }
  }
  return issues;
}
