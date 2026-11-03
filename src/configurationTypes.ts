export type JsonValue=string|number|boolean|null|JsonValue[]|{[key:string]:JsonValue};
export type ConfigSection='configuration'|'permissions'|'networking'|'reliability'|'monitoring'|'deployment';
export interface ConfigSource {title:string;url:string;verified:string}
export interface ConfigField {
 documentationSource?:ConfigSource;
 /** Absence means unclassified; do not infer AWS configuration from a form control. */
 semantics?:'aws-setting'|'application-intent'|'exercise-input'|'observed-output';
 documentation?:{purpose?:string;whenToUse?:string;omission?:string;effects?:string[];examples?:{value:JsonValue;explanation:string;valid?:boolean}[];relatedLessons?:string[]};
 evidence?:{operation?:string;apiPath?:string;sourceIds?:string[];checked?:string;scope?:string;status:'reference-only'|'checked'|'needs-context'|'unsupported'};
 key:string;label:string;kind:'text'|'number'|'boolean'|'select'|'multi-select'|'key-value'|'table'|'json'|'yaml'|'resource';section:ConfigSection;help:string;
 options?:string[];min?:number;max?:number;integer?:boolean;allowedNumbers?:number[];maxLength?:number;unit?:string;defaultValue?:JsonValue;itemFields?:ConfigField[];
 /** Local network references retain string IDs for compatibility with saved documents. */
 referenceKind?:'subnet'|'security-group';
 audit?:{checked:string;scope:string};
 documentType?:'json'|'policy'|'trust-policy'|'resource-policy'|'kms-policy'|'yaml';resourceServices?:string[];
 when?:{field:string;values:(string|number|boolean)[]};objectives?:string[];tier?:'core'|'supporting'|'advanced';source?:ConfigSource;
 awsLimit?:{kind:'hard'|'adjustable'|'dependent';description:string;sourceUrl:string};
}
export interface ConfigurationFinding {
 /** Stable producer-owned identity, independent of translated/display text. */
 ruleId?:string;resourceId?:string;path?:string;
 /** Relevant rule inputs for detecting changed/worsened existing constraints, not display text. */
 context?:JsonValue;
 level:'error'|'warning'|'info';field?:string;title:string;detail:string;sourceUrl?:string;category:'structure'|'design'|'unknown'|'app-limit'}
export interface PolicyRecord {id:string;name:string;kind:'identity'|'trust'|'resource'|'kms'|'endpoint'|'session'|'boundary';document:string;attachment?:'inline'|'customer-managed'|'aws-managed';source?:ConfigSource;managedPolicyId?:string}
export interface RoleRecord {id:string;name:string;trustPolicyId?:string;policyIds:string[];boundaryPolicyId?:string;sessionPolicyIds?:string[]}
export interface SecurityLibrary {version:1;policies:PolicyRecord[];roles:RoleRecord[]}
export const emptySecurityLibrary=():SecurityLibrary=>({version:1,policies:[],roles:[]});
export interface ConfigurationDocument {schemaVersion:2;values:Record<string,JsonValue>;legacyNotes:Record<string,JsonValue>}
export const configTabs=['overview','configuration','permissions','networking','reliability','monitoring','deployment','practice'] as const;
export type ConfigTab=typeof configTabs[number];
