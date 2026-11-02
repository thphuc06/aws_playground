import type {ConfigurationFinding} from './configurationTypes';
/** Preserve visibility of existing issues without making unrelated drafts impossible to repair. */
export function introducedFindings(before:ConfigurationFinding[],after:ConfigurationFinding[]):ConfigurationFinding[]{
 const signature=(f:ConfigurationFinding)=>JSON.stringify([f.field,f.title,f.detail,f.level,f.category]);
 const previous=new Set(before.map(signature));return after.filter(f=>!previous.has(signature(f)));
}
