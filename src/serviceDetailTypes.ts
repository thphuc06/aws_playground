export interface ServiceDetail {
 serviceId:string; reviewStatus:'reviewed'|'partial'; summary:string;
 useCases:string[]; examFocus:string[]; configuration:string[]; security:string[];
 reliability:string[]; observability:string[]; example:string; misconceptions:string[];
 caveats:string[]; coverageNote:string;
 sources:{title:string;url:string;verified:string}[];
}
