/** Original learning guidance with section-level primary references; examples never execute. */
export interface HandbookNote {
  title: string;
  detail: string;
  sourceIds: string[];
}

export interface ServiceHandbook {
  serviceId: string;
  operatingModel: HandbookNote[];
  setup: HandbookNote[];
  configuration: {name: string; choice: string; tradeoff: string; sourceIds: string[]}[];
  security: HandbookNote[];
  example: {
    title: string;
    language: 'json' | 'yaml' | 'bash' | 'text' | 'javascript' | 'python';
    code: string;
    explanation: string;
    checks: string[];
    sourceIds: string[];
  };
  troubleshooting: {symptom: string; likelyCause: string; check: string; resolution: string; sourceIds: string[]}[];
  pitfalls: HandbookNote[];
  sources: {id: string; title: string; url: string; verified: string}[];
}
