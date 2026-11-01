import React from 'react';
import {describe,it,expect} from 'vitest';
import {createHash} from 'node:crypto';
import {renderToStaticMarkup} from 'react-dom/server';
import {chapters,sources} from './content';
import baseline from './theoryPdfBaseline.fixture.json';
import {pdfTheorySupplements} from './theoryPdfUpdates';
import PdfReadingGuide,{pdfReadingInventory,pdfCorrectionNotes} from './PdfReadingGuide';
import TheoryIndex from './TheoryIndex';

describe('PDF-informed theory update',()=>{
 it('preserves original chapter/section order and all existing question positions',()=>{
  expect(chapters.slice(0,baseline.length).map(c=>c.id)).toEqual(baseline.map(c=>c.id));
  for(const old of baseline){const c=chapters.find(c=>c.id===old.id)!;expect(c.sections.slice(0,old.sectionIds.length).map(s=>s.id)).toEqual(old.sectionIds);expect(createHash('sha256').update(JSON.stringify(c.checks.slice(0,old.questionCount))).digest('hex')).toBe(old.checksSha256)}
 });
 it('accounts for all actual40 PDF pages without treating the contents as full chapters',()=>{
  const pages=pdfReadingInventory.ranges.flatMap(r=>{const [a,b]=r.physical.split('–').map(Number);return Array.from({length:(b??a)-a+1},(_,i)=>a+i)});expect(pages).toEqual(Array.from({length:40},(_,i)=>i+1));expect(pdfReadingInventory.textPagesReviewed).toBe(40);expect(pdfReadingInventory.renderedPagesReviewed).toBe(40);expect(pdfReadingInventory.ocrRequired).toBe(false);
  for(const update of pdfTheorySupplements){expect(chapters.some(c=>c.id===update.chapterId)).toBe(true);for(const page of update.pdfPages)expect(page>=1&&page<=40).toBe(true);for(const section of update.sections){expect(section.body.some(p=>p.startsWith('Preview reading note:'))).toBe(true);for(const id of section.sourceIds)expect(sources.some(s=>s.id===id)).toBe(true)}}
 });
 it('adds substantive targeted material without replacing the existing C03 AI lessons',()=>{expect(pdfTheorySupplements.reduce((n,x)=>n+x.sections.length,0)).toBe(13);expect(chapters.find(c=>c.id==='dev-ai-integration')?.sections.length).toBe(baseline.find(c=>c.id==='dev-ai-integration')?.sectionIds.length);expect(chapters.find(c=>c.id==='security-ai-controls')?.checks.length).toBe(baseline.find(c=>c.id==='security-ai-controls')?.questionCount);expect(chapters.find(c=>c.id==='study-source-judgment')?.examVersions).toContain('DVA-C03')});
 it('makes source boundaries and physical/printed locators visible without a private path or PDF download',()=>{const html=renderToStaticMarkup(<PdfReadingGuide selected="security-iam-sts" onOpen={()=>{}}/>);expect(html).toContain('40 / 40 PDF pages reviewed');expect(html).toContain('Printed 7–10');expect(html).toContain('printed 20–35');expect(html).toContain('clipped code');expect(html).not.toContain('C:\\');expect(html).not.toContain('<iframe');expect(html).not.toContain('.pdf"');expect(pdfCorrectionNotes.every(n=>sources.some(s=>s.id===n.source))).toBe(true)});
 it('keeps progress/read state controlled by the existing library props',()=>{const html=renderToStaticMarkup(<TheoryIndex chapters={chapters} selected="security-iam-sts" read={['security-iam-sts']} exam="DVA-C03" onOpen={()=>{}}/>);expect(html).toContain('✓ Read');expect(html).toContain('Use an older study guide without learning outdated rules');expect(html).toContain('C02 SOURCE / C03 REVIEW')});
});
