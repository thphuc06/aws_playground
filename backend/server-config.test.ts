import {describe,it,expect} from 'vitest';
import {reviewConfig} from './server';
import {createReviewHandler} from './review';

const env={REVIEW_ENABLED:'true',OPENAI_API_KEY:'fixture-only',REVIEW_ACCESS_TOKEN:'fixture-only-access-token-1234567890',REVIEW_ALLOWED_ORIGINS:'https://study.example',REVIEW_BUDGET_USD:'1'};
const statusRequest=()=>new Request('http://backend.local/api/review/status',{headers:{Origin:env.REVIEW_ALLOWED_ORIGINS,Authorization:'Bearer '+env.REVIEW_ACCESS_TOKEN}});
describe('diskless backend configuration',()=>{
  it('enables reviews without any disk variables or files and discloses reset semantics',async()=>{
    const config=reviewConfig(env);
    const response=await createReviewHandler(config)(statusRequest());
    expect(await response.json()).toMatchObject({enabled:true,budget:{scope:'process',resetsOnRestart:true,remainingReservationUsd:1}});
  });
  it('ignores obsolete disk settings, even an inaccessible path',()=>{
    const config=reviewConfig({...env,REVIEW_LEDGER_PATH:'/does/not/exist',REVIEW_PERSISTENT_DISK_CONFIRMED:'false'});
    expect(config.ledger?.remaining()).toBe(1_000_000);
  });
  it('keeps invalid or missing budgets disabled',async()=>{
    for(const budget of [undefined,'','0','2','NaN']) {
      const config=reviewConfig({...env,REVIEW_BUDGET_USD:budget});
      const response=await createReviewHandler(config)(statusRequest());
      expect((await response.json()).enabled).toBe(false);
      expect(config.ledger).toBeUndefined();
    }
  });
  it('does not enable reviews with a missing API key',async()=>{
    const response=await createReviewHandler(reviewConfig({...env,OPENAI_API_KEY:''}))(statusRequest());
    expect((await response.json()).enabled).toBe(false);
  });
});
