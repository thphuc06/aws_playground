import {LearningValues,ServiceLearningModel,safeLearningValues} from './learningModel';
export type SavedLearningConfigs=Record<string,{version:1;values:LearningValues}>;
export function cleanLearningConfigs(input:unknown,nodes:{id:string;service:string}[],getModel:(id:string)=>ServiceLearningModel|undefined):SavedLearningConfigs {
 const out:SavedLearningConfigs={};if(!input||typeof input!=='object'||Array.isArray(input))return out;
 for(const node of nodes){const model=getModel(node.service);const saved=(input as Record<string,unknown>)[node.id];if(!model||!saved||typeof saved!=='object'||Array.isArray(saved))continue;const record=saved as {version?:unknown;values?:unknown};if(record.version!==model.version)continue;out[node.id]={version:1,values:safeLearningValues(record.values,model)}}return out;
}
