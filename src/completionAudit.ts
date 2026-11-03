import {canonicalNetworkField} from './resourceMigration';
import {boundResourceForNode} from './resourceProjection';
import {canonicalFields} from './canonicalResourceSchema';
import type {Graph} from './architectureReview';
import {configurationFields,isConfigurationDocument} from './configurationRegistry';

export interface RequirementItem {id:string;text:string}
export interface DesignEvidence {kind:'node'|'edge'|'frame'|'resource'|'role'|'policy';id:string;fields:string[]}
export interface RequirementCheck {requirementId:string;status:'implemented'|'partial'|'missing'|'needs-verification';explanation:string;evidence:DesignEvidence[]}
export interface FrameCheck {frameId:string;disposition:'intentional'|'represented-by-service'|'missing';explanation:string;evidence:DesignEvidence[]}
export interface CompletionAudit {status:'gaps'|'needs-verification'|'addressed';requirements:RequirementItem[];checks:RequirementCheck[];emptyFrames:FrameCheck[];configuration:ConfigurationInventory[];graphFingerprint:string}
export interface ConfigurationInventory {nodeId:string;label:string;configuredFields:string[];unspecifiedFields:string[]}

// Stable, server-owned coverage units: the model cannot omit a sentence or replace the checklist.
// A sentence can contain multiple obligations; semantic assessment is still model-authored.
export function purposeRequirements(purpose:string):RequirementItem[]{return purpose.split(/\n+|(?<=[.!?;])\s+/).map(s=>s.trim()).filter(Boolean).map((text,i)=>({id:'requirement-'+(i+1),text}));}
export function specified(value:unknown):boolean {if(value===null||value===undefined)return false;if(typeof value==='string')return !!value.trim()&&!['unknown','unspecified'].includes(value.trim().toLowerCase());if(Array.isArray(value))return value.some(specified);if(typeof value==='object')return Object.values(value).some(specified);return true;}
export function nodeValues(graph:Graph,id:string):Record<string,unknown>{const raw=graph.architecture?.nodes[id],values=isConfigurationDocument(raw)?raw.values:raw??{},resource=boundResourceForNode(graph,id),binding=graph.network?.registry?.serviceBindings[id];const hasBindings=binding&&[binding.resource,binding.vpc,...binding.subnets,...binding.securityGroups,...binding.networkInterfaces].some(Boolean);return {...values,...resource?.values,...(hasBindings?{networkBindings:binding}:{})};}
export function configurationInventory(graph:Graph):ConfigurationInventory[]{return graph.nodes.map(n=>{const values=nodeValues(graph,n.id),identity=boundResourceForNode(graph,n.id),identityKeys=new Set(identity?canonicalFields(identity.kind).map(f=>f.key):[]);const fields=(configurationFields[n.service]??[]).filter(f=>(!graph.network?.registry||!canonicalNetworkField(n.service,f.key)||identityKeys.has(f.key))&&(!f.when||!specified(values[f.when.field])||f.when.values.includes(values[f.when.field] as string|number|boolean)));return {nodeId:n.id,label:n.label,configuredFields:[...fields.filter(f=>specified(values[f.key])).map(f=>f.key),...(values.networkBindings?['networkBindings']:[])],unspecifiedFields:fields.filter(f=>!specified(values[f.key])).map(f=>f.key)};});}
export function emptyFrames(graph:Graph){const t=graph.network;if(!t)return [];return t.frames.filter(frame=>{const descendants=new Set([frame.id]);for(let i=0;i<t.frames.length;i++)for(const f of t.frames)if(f.parentId&&descendants.has(f.parentId))descendants.add(f.id);return !graph.nodes.some(n=>descendants.has(t.membership[n.id]));}).map(f=>({id:f.id,name:f.name,kind:f.kind}));}
