import { describe, it, expect } from 'vitest';
import { simulate, defaultConfig, type Config, type MissionId } from './engine';
const run = (mission: MissionId, config: Partial<Config> = {}) => simulate(mission, {...defaultConfig, ...config});
const final = (mission: MissionId, config: Partial<Config> = {}) => run(mission, config).at(-1)!;
describe('deterministic virtual engine', () => {
  it.each(['serverless', 'queue', 'deployment'] as MissionId[])('%s replays identically with strictly increasing IDs and nondecreasing time', mission => {
    const events = run(mission);
    expect(events).toEqual(run(mission));
    events.forEach((e, i) => { expect(e.id).toBe(i + 1); expect(e.time).toBeGreaterThanOrEqual(i ? events[i - 1].time : 0); });
  });
  it('does not mutate config', () => { const config = {...defaultConfig}; simulate('queue', config); expect(config).toEqual(defaultConfig); });
});
describe('serverless', () => {
  it('writes and returns created', () => { expect(final('serverless').title).toBe('Created response'); expect(final('serverless').metrics?.writes).toBe(1); });
  it('denied permission blocks every downstream write', () => { const events = run('serverless', {permission:false}); expect(events.some(e=>e.title==='Persist task')).toBe(false); expect(events.find(e=>e.title==='Write blocked')?.metrics?.writes).toBe(0); });
  it('timeout occurs before the modeled write', () => { const events = run('serverless', {timeout:true}); expect(events.some(e=>e.title==='Persist task')).toBe(false); expect(events.some(e=>e.title==='Function timed out')).toBe(true); });
});
describe('SQS worker', () => {
  it('retries a transient failure, deletes successes and drains the queue', () => { const events=run('queue'); expect(events.filter(e=>e.title==='Receive batch')).toHaveLength(2); expect(final('queue').metrics).toMatchObject({writes:2,deleted:3,dlq:0,visible:0,inFlight:0}); });
  it('idempotency guards both explicitly duplicated and whole-batch retried work', () => { expect(final('queue', {partialBatch:false}).metrics?.writes).toBe(2); expect(final('queue', {partialBatch:false,idempotent:false}).metrics?.writes).toBeGreaterThan(2); });
  it('only poison message retries with partial batch responses', () => { const events=run('queue', {poison:true,maxReceives:3}); const receives=events.filter(e=>e.title==='Receive batch'); expect(receives).toHaveLength(3); expect(JSON.parse(receives[1].payload!).messages).toEqual(['task-B']); expect(final('queue',{poison:true,maxReceives:3}).metrics).toMatchObject({writes:1,dlq:1}); });
  it('whole batch failure can redrive successfully processed but unacknowledged records too', () => { expect(final('queue',{poison:true,partialBatch:false,maxReceives:2}).metrics).toMatchObject({writes:1,dlq:2}); });
  it('visibility expiry does not happen before receive + configured duration', () => { const events=run('queue',{poison:true,visibility:60}); const receive=events.find(e=>e.title==='Receive batch')!; const expire=events.find(e=>e.title==='Visibility expires')!; expect(expire.time).toBeGreaterThanOrEqual(receive.time+60); });
  it('guards malformed numeric configuration', () => { const events=run('queue',{maxReceives:Infinity,visibility:NaN}); expect(events.length).toBeGreaterThan(0); expect(events.every(e=>Number.isFinite(e.time))).toBe(true); });
});
describe('safe deployment', () => {
  it('promotes a healthy canary',()=>{ expect(final('deployment').metrics).toMatchObject({v1Weight:0,v2Weight:100,errors:0}); });
  it('alarm triggers configured rollback and restores traffic',()=>{ const events=run('deployment',{faultyVersion:true,canary:20}); expect(events.some(e=>e.title==='Alarm enters ALARM')).toBe(true); expect(events.at(-1)?.metrics).toMatchObject({v1Weight:100,v2Weight:0,errors:20}); });
  it('disabled rollback holds weighted traffic and requires intervention',()=>{ expect(final('deployment',{faultyVersion:true,rollback:false,canary:20}).metrics).toMatchObject({v1Weight:80,v2Weight:20}); });
  it('does not pretend a 0% candidate has been tested',()=>{ expect(final('deployment',{canary:0}).title).toBe('No candidate evidence'); });
});
