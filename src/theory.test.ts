/// <reference types="vite/client" />
import {describe,it,expect} from 'vitest';
import {chapters,sources} from './content';
import {examVersions,c03AddedServiceReferences,c03AbsentFromNamedList} from './examVersions';
import {researchResources} from './theoryResearch';
const versions=['DVA-C02','DVA-C03'] as const;
describe('dual-version theory integrity',()=>{
 it('preserves explicit exam weights and nonmerged service scope',()=>{expect(examVersions.map(v=>v.domains.map(d=>d.weight))).toEqual([[32,26,24,18],[30,26,22,22]]);expect(c03AddedServiceReferences).toHaveLength(11);expect(c03AbsentFromNamedList).toHaveLength(2);for(const e of examVersions){expect(e.domains.reduce((n,d)=>n+d.weight,0)).toBe(100);expect(e.limitations.length).toBeGreaterThan(2)}});
 it('maps every task area separately by version',()=>{for(const version of versions){const ids=new Set(chapters.filter(c=>c.examVersions?.includes(version)).flatMap(c=>c.versionTaskIds?.[version]??c.taskIds??[]));const expected=version==='DVA-C02'?['1.1','1.2','1.3','2.1','2.2','2.3','3.1','3.2','3.3','3.4','4.1','4.2','4.3']:['1.1','1.2','1.3','2.1','2.2','2.3','3.1','3.2','3.3','4.1','4.2','4.3'];for(const id of expected)expect(ids.has(id),`${version} task ${id} lacks lesson mapping`).toBe(true)}});
 it('contains substantive worked lessons, not empty cards',()=>{for(const c of chapters.filter(c=>c.examVersions)){const words=c.sections.reduce((n,s)=>n+s.body.join(' ').split(/\s+/).length,0);expect(words,`${c.id} explanatory word count`).toBeGreaterThan(650);expect(c.sections.some(s=>s.code)).toBe(true);expect(c.coverageNotes?.length).toBeGreaterThan(0);expect(c.objectives.length).toBeGreaterThanOrEqual(3);expect(c.checks.length).toBeGreaterThanOrEqual(3)}});
 it('does not imply community material was bulk imported',()=>{expect(researchResources.length).toBeGreaterThanOrEqual(4);for(const r of researchResources){expect(r.decision).toMatch(/no|only/i);expect(r.license.length).toBeGreaterThan(5);expect(r.checked).toBe('2026-11-01')}});
 it('source references resolve for every new chapter',()=>{const ids=new Set(sources.map(s=>s.id));for(const c of chapters)for(const section of c.sections)for(const id of section.sourceIds)expect(ids.has(id),`${c.id}/${section.id}/${id}`).toBe(true)});
});

import coverageText from '../THEORY-COVERAGE.md?raw';
it('retains a traceable 173-skill editorial matrix with real section references',()=>{const text=coverageText;const rows=[...text.matchAll(/\| (\d\.\d\.\d+) —/g)];expect(rows).toHaveLength(173);const references=[...text.matchAll(/`([a-z0-9-]+)#([a-z0-9-]+)`/g)];expect(references.length).toBeGreaterThanOrEqual(173);for(const [,chapter,section] of references)expect(chapters.find(c=>c.id===chapter)?.sections.some(s=>s.id===section),`${chapter}#${section}`).toBe(true)});
