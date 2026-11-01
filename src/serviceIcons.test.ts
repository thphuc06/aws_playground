/// <reference types="vite/client" />
import {describe,it,expect} from 'vitest';
import {canvasCatalog as serviceCatalog} from './serviceCatalog';
import {serviceIcons,genericFallbackIcon,iconSource} from './serviceIcons';

const assets=import.meta.glob('../public/aws-icons/*.svg',{query:'?raw',import:'default',eager:true}) as Record<string,string>;

describe('local AWS architecture artwork',()=>{
 it('covers every current canvas catalog ID exactly once',()=>{expect(Object.keys(serviceIcons).sort()).toEqual(serviceCatalog.map(s=>s.id).sort());expect(Object.keys(serviceIcons)).toHaveLength(serviceCatalog.length);for(const icon of Object.values(serviceIcons)){if(icon.kind==='fallback')expect(icon.officialName).toContain('not an AWS icon')}});
 it('provides local original SVG artwork with matching hashes and no executable/external content',async()=>{
  for(const [id,icon] of Object.entries(serviceIcons)){
   expect(icon.path).toBe(`/aws-icons/${id}.svg`);
   const svg=assets[`../public${icon.path}`];expect(svg).toBeDefined();
   const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(svg));
   expect([...new Uint8Array(digest)].map(b=>b.toString(16).padStart(2,'0')).join('')).toBe(icon.sha256);
   expect(svg).toMatch(/<svg\b[^>]*xmlns=["']http:\/\/www\.w3\.org\/2000\/svg["']/);
   expect(svg).toMatch(/<\/svg>\s*$/);
   expect(svg).not.toMatch(/<\s*(script|foreignObject|iframe|object|embed)\b/i);
   expect(svg).not.toMatch(/\bon\w+\s*=/i);
   expect(svg).not.toMatch(/(?:href|src)\s*=\s*["'](?!#)[^"']+/i);
   expect(svg).not.toMatch(/url\(\s*["']?(?:https?:|\/\/|data:)/i);
   expect(svg).not.toMatch(/<!ENTITY|<!DOCTYPE/i);
  }
 });
 it('documents resource/family mappings without pretending there is a Q Developer-specific asset',()=>{expect(serviceIcons['q-developer'].officialName).toContain('family');expect(serviceIcons['q-developer'].sourceFile).toContain('Arch_Amazon-Q_48.svg');expect(serviceIcons.sts.sourceFile).toContain('Res_AWS-Identity-Access-Management_AWS-STS_48.svg')});
 it('keeps unknown-service fallback visibly nonofficial and attribution dated',()=>{expect(genericFallbackIcon.kind).toBe('fallback');expect(genericFallbackIcon.officialName).toContain('not an AWS icon');expect(assets[`../public${genericFallbackIcon.path}`]).toMatch(/<svg/);expect(iconSource.url).toBe('https://aws.amazon.com/architecture/icons/');expect(iconSource.verified).toBe('2026-11-01');expect(iconSource.release).toBe('2026-07-31')});
});
