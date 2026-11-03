import {expect,it} from 'vitest';
import {chapters} from './content';
import {chapterNavigation} from './chapterNavigation';
import {parseAppRoute} from './appRoutes';

it('keeps lightweight route metadata in sync with every actual chapter, exam and section',()=>{
 expect(chapterNavigation).toEqual(chapters.map(chapter=>({id:chapter.id,examVersions:chapter.examVersions??['DVA-C02'],sections:chapter.sections.map(section=>({id:section.id}))})));
 for(const chapter of chapterNavigation)for(const exam of chapter.examVersions)for(const section of chapter.sections){
  const url=new URL('https://study.example/?view=learn');url.searchParams.set('exam',exam);url.searchParams.set('chapter',chapter.id);url.hash=section.id;
  expect(parseAppRoute(url)).toMatchObject({view:'learn',exam,chapter:chapter.id,section:section.id});
 }
});
