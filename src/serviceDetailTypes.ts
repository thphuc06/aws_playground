export interface ServiceDetail {
 serviceId:string; reviewStatus:'reviewed'|'partial'; summary:string;
 useCases:string[]; examFocus:string[]; configuration:string[]; security:string[];
 reliability:string[]; observability:string[]; example:string; misconceptions:string[];
 caveats:string[]; coverageNote:string;
 sources:{title:string;url:string;verified:string}[];
 /** What the dated review actually checked; it is not a full AWS-service certification. */
 reviewedScope?:string[];
 exampleStatus?:'illustrative'|'locally-tested';
}
