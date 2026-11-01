import {describe,it,expect} from 'vitest';
import {MemoryLedger} from './ledger';

describe('per-process in-memory reservation guard (no disk)',()=>{
  it('rejects missing, invalid and excessive budgets',()=>{
    for (const budget of [0,-1,NaN,Infinity,0.5,1_000_001]) expect(()=>new MemoryLedger(budget)).toThrow();
  });
  it('retains reservations and rejects requests over the remaining allowance',async()=>{
    const ledger=new MemoryLedger(1_000_000);
    expect(await ledger.reserve(200_000)).toBe(true);
    expect(ledger.remaining()).toBe(800_000);
    expect(await ledger.reserve(800_001)).toBe(false);
    expect(ledger.remaining()).toBe(800_000);
    expect(await ledger.reserve(800_000)).toBe(true);
    expect(await ledger.reserve(1)).toBe(false);
  });
  it('cannot double-spend concurrent reservations',async()=>{
    const ledger=new MemoryLedger(1_000_000);
    expect(await Promise.all([ledger.reserve(600_000),ledger.reserve(600_000)])).toEqual([true,false]);
    expect(ledger.remaining()).toBe(400_000);
  });
  it('rejects invalid amounts without changing the balance',async()=>{
    const ledger=new MemoryLedger(100);
    for (const amount of [0,-1,NaN,Infinity,0.1,101]) expect(await ledger.reserve(amount)).toBe(false);
    expect(ledger.remaining()).toBe(100);
  });
  it('starts fresh in a new instance; it is not a cumulative cap',async()=>{
    const first=new MemoryLedger(100);
    await first.reserve(100);
    const restarted=new MemoryLedger(100);
    expect(first.remaining()).toBe(0);
    expect(restarted.remaining()).toBe(100);
  });
});
