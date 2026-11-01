import {it,expect} from 'vitest';
import {chapters} from './content';
import {configurationSkills} from './configurationSkills';
import {configurationTheoryLinks} from './configurationTheoryLinks';
it('connects every configuration skill to existing theory section IDs',()=>{for(const skill of configurationSkills){expect(configurationTheoryLinks[skill.id]?.length,skill.id).toBeGreaterThan(0);for(const ref of configurationTheoryLinks[skill.id]){const chapter=chapters.find(c=>c.id===ref.chapter);expect(chapter,skill.id+'/'+ref.chapter).toBeDefined();expect(chapter?.sections.some(s=>s.id===ref.section),ref.section).toBe(true)}}});
