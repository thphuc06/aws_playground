import type {ExamVersionId} from '../../examVersions';
export type LabValue=string|number|boolean;
export type LabValues=Record<string,LabValue>;
export interface LabField {key:string;label:string;kind:'choice'|'number'|'json'|'text';help:string;options?:{value:string;label:string}[]}
export interface LabArtifact {id:string;title:string;format:'json'|'text'|'yaml'|'python';body:string}
export interface LabSource {id:string;title:string;url:string;checked:string;scope:string}
export interface LabObjective {id:string;title:string;sourceIds:string[]}
export interface LabFixture {values:LabValues;artifacts:LabArtifact[]}
export interface LabDefinition {id:string;version:1;title:string;summary:string;examVersions:ExamVersionId[];serviceIds:string[];chapterIds:string[];assumptions:string[];limitations:string[];fields:LabField[];objectives:LabObjective[];fixture:LabFixture;sources:LabSource[]}
export type LabCheckStatus='pass'|'fail'|'needs-context'|'unsupported';
export interface LabObjectiveResult {id:string;status:LabCheckStatus;explanation:string;fields:string[]}
export interface LabTraceEntry {title:string;detail:string;status:'info'|'success'|'warning'|'error'}
export interface LabResult {status:'objectives-met'|'needs-repair'|'needs-context'|'unsupported';checks:LabObjectiveResult[];trace:LabTraceEntry[];scope:string}
export interface LabAttempt {id:string;at:string;values:LabValues;result:LabResult}
export interface LabSession {schemaVersion:1;id:string;labId:string;definitionVersion:number;startedAt:string;updatedAt:string;startingFixture:LabFixture;values:LabValues;attempts:LabAttempt[]}
