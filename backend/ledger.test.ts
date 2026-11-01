import {describe,it,expect} from 'vitest';
import {mkdtemp,rm,readFile,writeFile,unlink} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {FileLedger,initializeLedger} from './ledger';
async function fixture(fn:(path:string)=>Promise<void>){const dir=await mkdtemp(join(tmpdir(),'review-ledger-test-'));try{await fn(join(dir,'budget.json'))}finally{await rm(dir,{recursive:true,force:true})}}
describe('durable conservative reservation ledger',()=>{
 it('never initializes implicitly and never overwrites existing ledger',()=>fixture(async p=>{await expect(FileLedger.connect(p,1000000)).rejects.toThrow();await initializeLedger(p,1000000);await expect(initializeLedger(p,1000000)).rejects.toThrow()}));
 it('persists reservation over restart without refund',()=>fixture(async p=>{await initializeLedger(p,1000000);let l=await FileLedger.connect(p,1000000);expect(await l.reserve(200000)).toBe(true);await l.close();l=await FileLedger.connect(p,1000000);expect(l.remaining()).toBe(800000);expect(await l.reserve(800001)).toBe(false);await l.close()}));
 it('serializes reservations and prevents a second process opening the ledger',()=>fixture(async p=>{await initializeLedger(p,1000000);const l=await FileLedger.connect(p,1000000);await expect(FileLedger.connect(p,1000000)).rejects.toThrow();expect(await Promise.all([l.reserve(600000),l.reserve(600000)])).toEqual([true,false]);await l.close()}));
 it('rejects budget changes, malformed or corrupt state',()=>fixture(async p=>{await initializeLedger(p,1000000);await expect(FileLedger.connect(p,500000)).rejects.toThrow();await writeFile(p,'bad');await expect(FileLedger.connect(p,1000000)).rejects.toThrow()}));
 it('fails closed on interrupted write and does not pretend to refund',()=>fixture(async p=>{await initializeLedger(p,1000000);const l=await FileLedger.connect(p,1000000);await writeFile(p+'.next','interrupted');await expect(l.reserve(100)).rejects.toThrow();expect(l.remaining()).toBe(0);expect(await l.reserve(1)).toBe(false);expect(JSON.parse(await readFile(p,'utf8')).reserved).toBe(0);await l.close();await unlink(p+'.next')}));
});
