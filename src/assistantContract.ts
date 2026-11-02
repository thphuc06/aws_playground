import type {Graph} from './architectureReview';
export const ASSISTANT_VERSION=1;
export type Priority='balanced'|'simplicity'|'cost'|'reliability';
export interface AssistantSource {id:string;title:string;url:string;kind:'curated'|'live';verified:string}
export interface AssistantFinding {scope?:'current'|'proposal';nodeIds:string[];edgeIds:string[];severity:'info'|'warning'|'error';title:string;detail:string;sourceIds:string[]}
export interface AssistantActivity {id:string;title:string;status:'running'|'completed'|'failed'|'interrupted';startedAt:number;finishedAt?:number;details:string[];sources?:AssistantSource[];graph?:{nodes:number;edges:number}}
export interface ServiceExplanation {nodeId:string;role:string;reason:string;configurationNotes:string[];sourceIds:string[]}
export interface AssistantResult {requestContext?:{purpose:string;priority:Priority;protectedNodeIds:string[];completedAt:string};serviceExplanations?:ServiceExplanation[];proposalStatus?:'changed'|'unchanged'|'edit_failed';activity?:AssistantActivity[];mode:'review'|'design';baseFingerprint:string;summary:string;assumptions:string[];findings:AssistantFinding[];sources:AssistantSource[];draft:Graph|null;usage:{inputTokens:number;outputTokens:number;responses:number;searches:number;estimatedUsd:number;incomplete:boolean}}
export interface AssistantRequest {resumeDraft?:Graph;mode:'review'|'design';graph:Graph;baseFingerprint:string;purpose:string;priority:Priority;protectedNodeIds:string[];consent:true}

export interface AssistantCheckpoint {draft:Graph;baseFingerprint:string;purpose:string;priority:Priority;protectedNodeIds:string[];updatedAt:string;summary:string;usage:AssistantResult['usage']}
