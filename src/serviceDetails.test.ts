import {describe,it,expect} from 'vitest';
import {serviceCatalog} from './serviceCatalog';
import {serviceDetails,getServiceDetail} from './serviceDetails';
describe('reviewed service-detail coverage',()=>{
 it('has exactly one researched entry for every official catalog service',()=>{expect(serviceDetails).toHaveLength(47);expect(new Set(serviceDetails.map(d=>d.serviceId)).size).toBe(47);expect(serviceDetails.map(d=>d.serviceId).sort()).toEqual(serviceCatalog.map(s=>s.id).sort())});
 it('provides all requested exam-scoped sections and explicit coverage notes',()=>{for(const d of serviceDetails){expect(['reviewed','partial']).toContain(d.reviewStatus);expect(d.summary.length).toBeGreaterThan(35);for(const key of ['useCases','examFocus','configuration','security','reliability','observability','misconceptions','caveats'] as const){expect(d[key].length).toBeGreaterThan(0);expect(d[key].every(p=>p.length>20)).toBe(true)}expect(d.example.length).toBeGreaterThan(40);expect(d.coverageNote.length).toBeGreaterThan(60)}});
 it('attributes every service to dated official AWS sources',()=>{for(const d of serviceDetails){expect(d.sources.length).toBeGreaterThan(0);for(const source of d.sources){expect(source.title.length).toBeGreaterThan(2);const url=new URL(source.url);expect(url.protocol).toBe('https:');expect(url.hostname==='aws.amazon.com'||url.hostname.endsWith('.aws.amazon.com')).toBe(true);expect(source.verified).toBe('2026-11-01')}}});
 it('keeps detail retrieval separate from validation coverage',()=>{expect(getServiceDetail('eventbridge')).toBeDefined();expect(serviceCatalog.find(s=>s.id==='eventbridge')?.modeled).toBe(false);expect(getServiceDetail('not-a-service')).toBeUndefined()});
});
