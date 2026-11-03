/** Supplemental reading guidance; examples are illustrative and never execute AWS calls. */
export interface ServiceDeepDive {
  serviceId: string;
  mentalModel: string;
  decision: { useWhen: string; avoidWhen: string; alternativeIds: string[] };
  walkthrough: { title: string; steps: string[]; expectedOutcome: string; failureMode: string };
  costDrivers: string[];
  productionChecks: string[];
  sources: { title: string; url: string; verified: string }[];
}
