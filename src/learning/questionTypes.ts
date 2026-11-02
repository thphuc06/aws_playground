export type LearningExam = 'DVA-C02' | 'DVA-C03';
export type SkillRef = `${LearningExam}:${string}`;
export interface StudyQuestion {
  id: string;
  revision: number;
  examVersions: LearningExam[];
  skillRefs: SkillRef[];
  chapterIds: string[];
  serviceIds: string[];
  kind: 'single-choice' | 'multiple-response';
  prompt: string;
  options: {id: string; text: string; explanation?: string}[];
  correctOptionIds: string[];
  explanation: string;
  sourceUrls: string[];
  snippet?: string;
  origin: 'chapter' | 'configuration' | 'code' | 'authored';
}
export interface LearningAttempt {
  id: string;
  sessionId: string;
  exam: LearningExam;
  questionId: string;
  questionRevision: number;
  skillRefs: SkillRef[];
  selectedOptionIds: string[];
  optionOrder: string[];
  submittedAt: string;
  outcome: 'correct' | 'incorrect' | 'unanswered';
  assistance: 'none' | 'answer-revealed';
}
export interface FeedbackExposure {
  id: string;
  sessionId: string;
  questionId: string;
  questionRevision: number;
  revealedAt: string;
}
export type PracticeMode = 'learn' | 'mixed' | 'mistakes' | 'due-review';
export interface LearningSession {
  id: string;
  exam: LearningExam;
  mode: PracticeMode;
  startedAt: string;
  completedAt?: string;
  status: 'active' | 'completed' | 'abandoned';
  currentItem: number;
  // A frozen revision keeps a resumed session meaningful after a content update.
  items: {question: StudyQuestion; optionOrder: string[]}[];
}
export interface LearningProgress {
  schemaVersion: 2;
  read: string[];
  bookmarks: string[];
  missions: string[];
  legacyAcknowledgements: {legacyKey: string; questionId?: string; provenance: 'exam-and-time-unknown'}[];
  attempts: LearningAttempt[];
  sessions: LearningSession[];
  feedbackExposures: FeedbackExposure[];
  legacyRaw?: string;
}
export const emptyLearningProgress = (): LearningProgress => ({schemaVersion:2,read:[],bookmarks:[],missions:[],legacyAcknowledgements:[],attempts:[],sessions:[],feedbackExposures:[]});
export const isLearningExam = (v: unknown): v is LearningExam => v === 'DVA-C02' || v === 'DVA-C03';
