/** Local contract integration, not a browser E2E or live-provider test. */
import {describe,it,expect,vi} from 'vitest';
import {createReviewHandler,MODEL} from './review';
import {applyProposal,fingerprintGraph,previewProposal,undoProposal,validateReviewGraph,type Graph,type UndoToken} from '../src/architectureReview';
const initial=():Graph=>({version:1,nodes:[{id:'worker',service:'lambda',label:'Synthetic worker',position:{x:10,y:20}}],edges:[],configs:{}});
const access='fixture-access-token-not-real-1234567890';
const addNode={op:'add-node',id:null,target:null,node:{id:'store',service:'s3',label:'Synthetic storage',position:{x:200,y:20}},edge:null,valueJson:null};
function system(operations:unknown[]){let reserved=0;const reserve=vi.fn(async(amount:number)=>{reserved+=amount;return true});const provider=vi.fn(async()=>new Response(JSON.stringify({status:'completed',output:[{type:'message',content:[{type:'output_text',text:JSON.stringify({summary:'Review this optional illustrative addition.',findings:['Disconnected storage is a learning example, not an AWS-verified design.'],operations})}]}]})));return {provider,reserve,handler:createReviewHandler({enabled:true,accessToken:access,apiKey:'fixture-no-real-key',origins:['https://study.example'],model:MODEL,ledger:{reserve,remaining:()=>1000000-reserved}},provider)}}
function request(graph:Graph,fingerprint=fingerprintGraph(graph)){return new Request('https://backend.example/api/review',{method:'POST',headers:{Origin:'https://study.example',Authorization:'Bearer '+access,'Content-Type':'application/json','X-Architecture-Review':'1'},body:JSON.stringify({graph,baseFingerprint:fingerprint,consent:true})})}
describe('fixture backend-to-local-graph integration (no paid calls)',()=>{
 it('reviews, previews without mutation, applies explicitly, restores serialized graph and undoes within the same session',async()=>{
  const graph=initial(),before=JSON.stringify(graph),s=system([addNode]);
  const response=await s.handler(request(graph));expect(response.status).toBe(200);const payload=await response.json();
  expect(s.provider).toHaveBeenCalledOnce();expect(s.reserve).toHaveBeenCalledOnce();expect(JSON.stringify(graph)).toBe(before);
  const proposal=payload.review.proposal;expect(proposal.baseFingerprint).toBe(fingerprintGraph(graph));
  const preview=previewProposal(graph,proposal);expect(preview.ok).toBe(true);expect(JSON.stringify(graph)).toBe(before);
  const applied=applyProposal(graph,proposal);if(!applied.ok)throw new Error(applied.error);
  expect(applied.after.nodes.map(n=>n.id)).toEqual(['worker','store']);expect(JSON.stringify(graph)).toBe(before);
  // Equivalent to persisting/re-reading graph JSON, not recreating the browser session.
  const persisted=JSON.stringify(applied.after),restored=validateReviewGraph(JSON.parse(persisted));if(!restored.ok)throw new Error(restored.error);
  expect(fingerprintGraph(restored.graph)).toBe(fingerprintGraph(applied.after));
  const undone=undoProposal(restored.graph,applied.undoToken);if(!undone.ok)throw new Error(undone.error);
  expect(undone.graph).toEqual(graph);expect(undoProposal(restored.graph,applied.undoToken).ok).toBe(false);
 });
 it('rejects invalid provider edits without exposing a usable proposal or mutating the graph',async()=>{
  const graph=initial(),before=JSON.stringify(graph),s=system([{...addNode,node:{...addNode.node,service:'invented-cloud-service'}}]);
  const response=await s.handler(request(graph));expect(response.status).toBe(502);const payload=await response.json();
  expect(payload.error).toBe('invalid_proposal');expect(payload.review).toBeUndefined();expect(JSON.stringify(graph)).toBe(before);
  expect(s.reserve).toHaveBeenCalledOnce();expect(s.provider).toHaveBeenCalledOnce();
 });
 it('blocks stale returned proposals after a newer graph edit without overwriting that edit',async()=>{
  const graph=initial(),s=system([addNode]);const response=await s.handler(request(graph));const payload=await response.json();
  const newer=structuredClone(graph);newer.nodes[0].label='My newer local edit';const before=JSON.stringify(newer);
  expect(previewProposal(newer,payload.review.proposal).ok).toBe(false);expect(applyProposal(newer,payload.review.proposal).ok).toBe(false);expect(JSON.stringify(newer)).toBe(before);
 });
 it('rejects stale request snapshots before any reservation/provider call',async()=>{
  const graph=initial(),s=system([addNode]);const response=await s.handler(request(graph,'graph-v1:stale'));
  expect(response.status).toBe(409);expect(s.reserve).not.toHaveBeenCalled();expect(s.provider).not.toHaveBeenCalled();
 });
 it('keeps persisted graph but cannot resurrect an undo capability by serializing its token',async()=>{
  const graph=initial(),s=system([addNode]);const payload=await(await s.handler(request(graph))).json();const applied=applyProposal(graph,payload.review.proposal);if(!applied.ok)throw new Error(applied.error);
  const reloaded=JSON.parse(JSON.stringify(applied.after)) as Graph;
  const counterfeit=JSON.parse(JSON.stringify(applied.undoToken)) as UndoToken;
  expect(undoProposal(reloaded,counterfeit).ok).toBe(false);expect(reloaded).toEqual(applied.after);
 });
});
