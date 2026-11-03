import {describe, expect, it} from 'vitest';
import {parseAllDocuments} from 'yaml';
import {canvasCatalog} from './serviceCatalog';
import {getServiceHandbook, serviceHandbooks} from './serviceHandbooks';

describe('practical service handbooks', () => {
  it('covers every service once, including the additional references', () => {
    expect(serviceHandbooks.map(item => item.serviceId).sort()).toEqual(canvasCatalog.map(item => item.id).sort());
    expect(new Set(serviceHandbooks.map(item => item.serviceId)).size).toBe(58);
    expect(getServiceHandbook('unknown-service')).toBeUndefined();
  });
  it('provides a complete implementation path and diagnostic evidence for each service', () => {
    for (const guide of serviceHandbooks) {
      expect(guide.operatingModel.length, guide.serviceId).toBeGreaterThanOrEqual(3);
      expect(guide.setup.length, guide.serviceId).toBeGreaterThanOrEqual(4);
      expect(guide.configuration.length, guide.serviceId).toBeGreaterThanOrEqual(3);
      expect(guide.security.length, guide.serviceId).toBeGreaterThanOrEqual(2);
      expect(guide.troubleshooting.length, guide.serviceId).toBeGreaterThanOrEqual(3);
      expect(guide.pitfalls.length, guide.serviceId).toBeGreaterThanOrEqual(2);
      expect(guide.example.checks.length, guide.serviceId).toBeGreaterThanOrEqual(2);
      for (const issue of guide.troubleshooting) for (const field of ['symptom', 'likelyCause', 'check', 'resolution'] as const) expect(issue[field].trim().length, guide.serviceId + ':' + field).toBeGreaterThan(10);
    }
  });
  it('resolves all section-level citations to dated primary references', () => {
    for (const guide of serviceHandbooks) {
      const ids = new Set(guide.sources.map(source => source.id));
      expect(ids.size, guide.serviceId).toBe(guide.sources.length);
      expect(new Set(guide.sources.map(source => source.url)).size, guide.serviceId).toBe(guide.sources.length);
      expect(ids.size, guide.serviceId).toBeGreaterThanOrEqual(4);
      const sections = [...guide.operatingModel, ...guide.setup, ...guide.configuration, ...guide.security, guide.example, ...guide.troubleshooting, ...guide.pitfalls];
      for (const section of sections) {
        expect(section.sourceIds.length, guide.serviceId).toBeGreaterThan(0);
        for (const id of section.sourceIds) expect(ids.has(id), guide.serviceId + ': missing ' + id).toBe(true);
      }
      for (const source of guide.sources) {
        const url = new URL(source.url);
        expect(url.protocol).toBe('https:');
        expect(url.hostname === 'aws.amazon.com' || url.hostname.endsWith('.aws.amazon.com') ||
          (guide.serviceId === 'kiro' && (url.hostname === 'kiro.dev' || url.hostname.endsWith('.kiro.dev'))) ||
          (guide.serviceId === 'opensearch' && url.hostname === 'docs.opensearch.org'), source.url).toBe(true);
        expect(source.verified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
    }
  });
  it('keeps JSON and YAML examples syntactically readable without claiming to deploy or validate AWS schemas', () => {
    for (const guide of serviceHandbooks) {
      if (guide.example.language === 'json') expect(() => JSON.parse(guide.example.code), guide.serviceId).not.toThrow();
      if (guide.example.language === 'yaml') for (const document of parseAllDocuments(guide.example.code)) expect(document.errors, guide.serviceId).toEqual([]);
    }
  });
});
