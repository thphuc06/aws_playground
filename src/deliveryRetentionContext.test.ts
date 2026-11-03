import {it,expect} from 'vitest';
import {configurationDocument,configurationGraphFindings} from './configurationRegistry';
const findings=(values:Record<string,string|number>)=>configurationGraphFindings('cloudwatch-logs',configurationDocument(values));
it('separates conflicting fixed-duration sources from the unsupported retention override',()=>{
 const result=findings({logClass:'DELIVERY',retentionDays:1});
 expect(result.some(f=>f.level==='error'&&f.ruleId==='semantic.041')).toBe(false);
 // Delivery has fixed retention; the ordinary editable override stays inapplicable.
 expect(result).toContainEqual(expect.objectContaining({ruleId:'shape.006',field:'retentionDays'}));
 expect(result).toContainEqual(expect.objectContaining({ruleId:'semantic.logs-delivery-retention-context',category:'unknown',level:'warning',field:'retentionDays'}));
 expect(findings({logClass:'DELIVERY'}).some(f=>f.ruleId==='semantic.logs-delivery-retention-context')).toBe(false);
});
it('keeps the supported query restriction and ordinary retention API enum',()=>{
 expect(findings({logClass:'DELIVERY',query:'fields @message'}).some(f=>f.level==='error'&&f.ruleId==='semantic.041')).toBe(true);
 expect(findings({logClass:'STANDARD',retentionDays:2}).some(f=>f.level==='error')).toBe(true);
 expect(findings({logClass:'STANDARD',retentionDays:1}).filter(f=>f.level==='error')).toEqual([]);
});
