import {chapters,sources} from '../content';
import {configurationKnowledgeChecks} from '../configurationKnowledgeChecks';
import {codePracticeCases} from '../configurationPractice';
import {adaptChapterQuestions,adaptConfigurationQuestion,adaptCodeQuestion} from './questionAdapters';
import type {StudyQuestion} from './questionTypes';
import {authoredDevelopmentSecurityQuestions} from './authoredQuestionsDevelopmentSecurity';
import {authoredDeliveryOperationsQuestions} from './authoredQuestionsDeliveryOperations';
export const questionBank:StudyQuestion[]=[
  ...chapters.flatMap(chapter=>adaptChapterQuestions(chapter,id=>sources.find(s=>s.id===id)?.url)),
  ...configurationKnowledgeChecks.map(adaptConfigurationQuestion),
  ...codePracticeCases.map(adaptCodeQuestion),
  ...authoredDevelopmentSecurityQuestions,
  ...authoredDeliveryOperationsQuestions,
];
export const findQuestion=(id:string)=>questionBank.find(q=>q.id===id);
