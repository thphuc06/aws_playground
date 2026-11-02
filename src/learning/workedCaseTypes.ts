import type {LearningExamVersion} from './services/types';
export interface BilingualText {en:string;vi:string}
export interface WorkedCaseSource {title:string;url:string;verified:string;scope:string}
export interface ChapterWorkedCase {
 id:string;chapterId:string;serviceIds:string[];examVersions:LearningExamVersion[];
 executionStatus:'illustrative';title:BilingualText;assumptions:BilingualText[];
 input:{language:'json'|'text'|'python'|'yaml';code:string;description:BilingualText};
 expectedObservations:BilingualText[];failure:BilingualText;
 diagnosis:BilingualText[];repair:BilingualText[];verification:BilingualText[];
 transferQuestion:{question:BilingualText;answer:BilingualText};
 sources:WorkedCaseSource[];limitations:BilingualText[];
}
export const bi=(en:string,vi:string):BilingualText=>({en,vi});
export const evidence=(title:string,url:string,scope:string):WorkedCaseSource=>({title,url,scope,verified:'2026-11-03'});
export const illustrative=bi('Synthetic reasoning exercise. The records and expected outcomes are supplied fixtures, not observations from an AWS account.','Bài tập suy luận với dữ liệu giả lập. Các bản ghi và kết quả dự kiến là dữ liệu cho bài học, không phải quan sát từ tài khoản AWS.');
