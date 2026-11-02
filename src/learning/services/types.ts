export type LearningExamVersion='DVA-C02'|'DVA-C03';
export interface LearningSource {title:string;url:string;verified:string}
export interface ServiceLearningMetadata {
 serviceId:string;name:string;category:string;examVersions:LearningExamVersion[];scope:'exam'|'legacy';
 focus:string;lessonIds:string[];prerequisiteLessonIds:string[];comparisonIds:string[];learningOutcomes:string[];
}
export interface LearningGlossaryEntry {
 id:string;term:string;en:string;vi:string;aliases:string[];serviceIds:string[];lessonIds:string[];
 sources?:LearningSource[];
}
export interface ServiceComparison {
 id:string;title:string;question:string;serviceIds:string[];
 criteria:{label:string;choices:{serviceId:string;guidance:string}[]}[];
 scenario:{requirement:string;recommendation:string;reasoning:string};caveats:string[];sources:LearningSource[];
}
export interface LearningPath {
 id:string;title:string;description:string;examVersions:LearningExamVersion[];steps:{lessonId:string;why:string}[];
}
