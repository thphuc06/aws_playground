import type {ComponentProps} from 'react';
import ChapterReader from './ChapterReader';
import {chapters} from './content';
import {supportsExam} from './appRoutes';

type Props=Omit<ComponentProps<typeof ChapterReader>,'chapter'>&{chapterId:string};
export default function ChapterRoute({chapterId,...props}:Props) {
 const chapter=chapters.find(item=>item.id===chapterId&&supportsExam(item,props.exam));
 if(!chapter)return <p role="alert">This lesson is unavailable for the selected exam. Open the lesson library to choose another.</p>;
 return <ChapterReader {...props} chapter={chapter}/>;
}
