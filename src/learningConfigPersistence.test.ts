import {describe,it,expect} from 'vitest';
import {ServiceLearningModel} from './learningModel';
import {cleanLearningConfigs} from './learningConfigPersistence';
const model:ServiceLearningModel={serviceId:'test',version:1,title:'Test',scope:'Local',examSkills:[],sources:[],fields:[{key:'count',label:'Count',kind:'number',help:'Count',min:1},{key:'name',label:'Name',kind:'text',help:'Name'}],defaults:{count:1,name:'default'},examples:[],evaluate:()=>({findings:[],trace:[]}),limitations:[]};const get=(id:string)=>id==='test'?model:undefined;
describe('instance learning configuration persistence',()=>{
 it('preserves invalid editable drafts while pruning unknown keys',()=>{const result=cleanLearningConfigs({a:{version:1,values:{count:'',name:'draft',unknown:'drop'}}},[{id:'a',service:'test'}],get);expect(result.a.values).toEqual({count:'',name:'draft'})});
 it('keeps same-service instances independent',()=>{const result=cleanLearningConfigs({a:{version:1,values:{count:2}},b:{version:1,values:{count:8}}},[{id:'a',service:'test'},{id:'b',service:'test'}],get);expect(result.a.values.count).toBe(2);expect(result.b.values.count).toBe(8)});
 it('removes deleted, unsupported and incompatible-version configs',()=>{expect(cleanLearningConfigs({gone:{version:1,values:{}},a:{version:2,values:{}},b:{version:1,values:{}}},[{id:'a',service:'test'},{id:'b',service:'unknown'}],get)).toEqual({})});
 it('rejects malformed maps and bounds values using model defaults',()=>{expect(cleanLearningConfigs([],[],get)).toEqual({});const result=cleanLearningConfigs({a:{version:1,values:{count:Infinity,name:'x'.repeat(10001)}}},[{id:'a',service:'test'}],get);expect(result.a.values).toEqual(model.defaults)});
});
