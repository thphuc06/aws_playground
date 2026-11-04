import type {CompletionAudit} from './completionAudit';
import type {Graph} from './architectureReview';
export const ASSISTANT_VERSION=1;
export type Priority='balanced'|'simplicity'|'cost'|'reliability';
export type PlannedChangeKind='add-service'|'remove-service'|'connect'|'configure'|'network'|'security'|'layout';
/** One reviewer-proposed change. Source IDs refer to the sources returned with the same result. */
export interface PlannedChange {id:string;title:string;rationale:string;kind:PlannedChangeKind;nodeIds:string[];serviceIds:string[];sourceIds:string[]}
/** The subset of a review plan the user approved, with the sources its changes cite. */
export interface ApprovedPlan {changes:PlannedChange[];sources:AssistantSource[]}
export interface AssistantSource {id:string;title:string;url:string;kind:'curated'|'live';verified:string}
export interface AssistantFinding {scope?:'current'|'proposal';nodeIds:string[];edgeIds:string[];severity:'info'|'warning'|'error';title:string;detail:string;sourceIds:string[]}
export interface AssistantActivity {id:string;title:string;status:'running'|'completed'|'failed'|'interrupted';startedAt:number;finishedAt?:number;details:string[];sources?:AssistantSource[];graph?:{nodes:number;edges:number}}
export interface ServiceExplanation {nodeId:string;role:string;reason:string;configurationNotes:string[];sourceIds:string[]}
export interface AssistantResult {completion?:CompletionAudit;requestContext?:{purpose:string;priority:Priority;protectedNodeIds:string[];completedAt:string};serviceExplanations?:ServiceExplanation[];proposalStatus?:'changed'|'unchanged'|'edit_failed';activity?:AssistantActivity[];mode:'review'|'design';baseFingerprint:string;summary:string;assumptions:string[];findings:AssistantFinding[];sources:AssistantSource[];draft:Graph|null;usage:{inputTokens:number;cachedInputTokens?:number;outputTokens:number;responses:number;toolCalls?:number;searches:number;estimatedUsd:number;incomplete:boolean};plan?:PlannedChange[]}
export interface AssistantRequest {approvedPlan?:ApprovedPlan;resumeDraft?:Graph;mode:'review'|'design';graph:Graph;baseFingerprint:string;purpose:string;priority:Priority;protectedNodeIds:string[];consent:true}

export interface AssistantCheckpoint {draft:Graph;baseFingerprint:string;purpose:string;priority:Priority;protectedNodeIds:string[];updatedAt:string;summary:string;usage:AssistantResult['usage'];plan?:ApprovedPlan}
