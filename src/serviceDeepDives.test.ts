import {describe, expect, it} from 'vitest';
import {canvasCatalog} from './serviceCatalog';
import {serviceDeepDives, getServiceDeepDive} from './serviceDeepDives';

describe('service field-note coverage and evidence contract', () => {
  const ids = new Set(canvasCatalog.map(service => service.id));

  it('provides exactly one supplemental guide for every current and legacy canvas service', () => {
    expect(serviceDeepDives).toHaveLength(58);
    expect(new Set(serviceDeepDives.map(guide => guide.serviceId)).size).toBe(58);
    expect(serviceDeepDives.map(guide => guide.serviceId).sort()).toEqual([...ids].sort());
    expect(getServiceDeepDive('unknown-service')).toBeUndefined();
  });

  it('links decisions to other real services and includes a complete illustrative recovery scenario', () => {
    for (const guide of serviceDeepDives) {
      const label = guide.serviceId;
      expect(guide.mentalModel.length, label).toBeGreaterThan(60);
      expect(guide.decision.useWhen.length, label).toBeGreaterThan(35);
      expect(guide.decision.avoidWhen.length, label).toBeGreaterThan(35);
      expect(new Set(guide.decision.alternativeIds).size, label).toBe(guide.decision.alternativeIds.length);
      for (const alternative of guide.decision.alternativeIds) {
        expect(ids.has(alternative), `${label}: unresolved alternative ${alternative}`).toBe(true);
        expect(alternative, label).not.toBe(label);
      }
      expect(guide.walkthrough.title.length, label).toBeGreaterThan(15);
      expect(guide.walkthrough.steps.length, label).toBeGreaterThanOrEqual(3);
      expect(guide.walkthrough.steps.length, label).toBeLessThanOrEqual(5);
      expect(guide.walkthrough.steps.every(step => step.length > 30), label).toBe(true);
      expect(guide.walkthrough.expectedOutcome.length, label).toBeGreaterThan(40);
      expect(guide.walkthrough.failureMode.length, label).toBeGreaterThan(40);
      expect(guide.costDrivers.length, label).toBeGreaterThanOrEqual(2);
      expect(guide.productionChecks.length, label).toBeGreaterThanOrEqual(2);
      expect([...guide.costDrivers, ...guide.productionChecks].every(note => note.length > 30), label).toBe(true);
    }
  });

  it('attributes each guide to distinct dated primary sources without treating link shape as factual verification', () => {
    for (const guide of serviceDeepDives) {
      expect(guide.sources.length, guide.serviceId).toBeGreaterThanOrEqual(2);
      expect(new Set(guide.sources.map(source => source.url)).size, guide.serviceId).toBe(guide.sources.length);
      for (const source of guide.sources) {
        const url = new URL(source.url);
        expect(url.protocol).toBe('https:');
        expect(url.username || url.password).toBe('');
        expect(url.hostname === 'aws.amazon.com' || url.hostname.endsWith('.aws.amazon.com') ||
          (guide.serviceId === 'kiro' && url.hostname === 'kiro.dev'), `${guide.serviceId}: ${source.url}`).toBe(true);
        expect(source.title.length).toBeGreaterThan(8);
        expect(source.verified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(Number.isFinite(Date.parse(source.verified))).toBe(true);
      }
    }
  });
});
