// @vitest-environment jsdom
import React from 'react';
import {render,screen,fireEvent,cleanup,within} from '@testing-library/react';
import {beforeEach,afterEach,it,expect,vi} from 'vitest';
import WorkedCasePanel,{workedCaseLanguageKey} from './WorkedCasePanel';
import ChapterReader from './ChapterReader';
import {chapters} from './content';
import {workedCases} from './learning/workedCases';
const text=(en:string,vi:string)=>({en,vi});
const entry={id:'fixture',chapterId:'dev-application',serviceIds:['lambda'],examVersions:['DVA-C03'] as const,executionStatus:'illustrative' as const,title:text('One request, two outcomes','Một yêu cầu, hai kết quả'),assumptions:[text('Supplied data only','Chỉ dùng dữ liệu cho sẵn')],input:{language:'json' as const,code:'{"request":"example"}',description:text('Inspect the input','Kiểm tra đầu vào')},expectedObservations:[text('The response is unknown','Chưa biết response')],failure:text('Repeated work','Công việc lặp lại'),diagnosis:[text('Inspect the key','Kiểm tra key')],repair:[text('Preserve the key','Giữ nguyên key')],verification:[text('Test a repeated request','Kiểm tra yêu cầu lặp lại')],transferQuestion:{question:text('What changes?','Điều gì thay đổi?'),answer:text('The waiting time','Thời gian chờ')},sources:[{title:'Example official reference',url:'https://docs.aws.amazon.com/lambda/latest/dg/invocation-retries.html',verified:'2026-11-03',scope:'Retry ownership'}],limitations:[text('Not executed against AWS','Chưa chạy trên AWS')]};
beforeEach(()=>{localStorage.clear();vi.stubGlobal('scrollTo',vi.fn());Element.prototype.scrollIntoView=vi.fn()});
afterEach(()=>{cleanup();vi.restoreAllMocks();vi.unstubAllGlobals()});
it('renders supplied evidence as illustrative and reveals reasoning on request',()=>{render(<WorkedCasePanel entry={{...entry,examVersions:[...entry.examVersions]}}/>);expect(screen.getByText('Illustrative fixture · no AWS calls')).toBeDefined();const reasoning=screen.getByText('Reveal reasoning').closest('details')!;expect(reasoning.open).toBe(false);fireEvent.click(reasoning.querySelector('summary')!);expect(reasoning.open).toBe(true);expect(within(reasoning).getByText('The waiting time')).toBeDefined();expect(screen.getByText('{"request":"example"}')).toBeDefined()});
it('switches case language while preserving code and official source links',()=>{render(<WorkedCasePanel entry={{...entry,examVersions:[...entry.examVersions]}}/>);fireEvent.change(screen.getByLabelText('Worked case language'),{target:{value:'vi'}});expect(screen.getByRole('heading',{name:'Một yêu cầu, hai kết quả'})).toBeDefined();expect(screen.getByText('Dữ liệu minh họa · không gọi AWS')).toBeDefined();expect(screen.getByText('{"request":"example"}')).toBeDefined();expect(screen.getByRole('link',{name:'Example official reference ↗',hidden:true}).getAttribute('href')).toContain('docs.aws.amazon.com')});
it('keeps every answer step closed until requested and never awards progress for opening it',()=>{
 localStorage.setItem('aws-playground-progress','existing-progress-fixture');render(<WorkedCasePanel entry={{...entry,examVersions:[...entry.examVersions]}}/>);
 for(const label of ['Reveal expected observations','Reveal what goes wrong','Reveal diagnosis','Reveal repair','Reveal verification plan','Reveal reasoning']){const summary=screen.getByText(label),details=summary.closest('details')!;expect(details.open).toBe(false);fireEvent.click(summary);expect(details.open).toBe(true)}
 expect(localStorage.getItem('aws-playground-progress')).toBe('existing-progress-fixture');
});
it('remembers the language across mounts and falls back to English for unknown preferences',()=>{
 const first=render(<WorkedCasePanel entry={{...entry,examVersions:[...entry.examVersions]}}/>);fireEvent.change(screen.getByLabelText('Worked case language'),{target:{value:'vi'}});expect(localStorage.getItem(workedCaseLanguageKey)).toBe('vi');first.unmount();const second=render(<WorkedCasePanel entry={{...entry,examVersions:[...entry.examVersions]}}/>);expect(screen.getByRole('heading',{name:'Một yêu cầu, hai kết quả'})).toBeDefined();second.unmount();localStorage.setItem(workedCaseLanguageKey,'unsupported');render(<WorkedCasePanel entry={{...entry,examVersions:[...entry.examVersions]}}/>);expect(screen.getByRole('heading',{name:'One request, two outcomes'})).toBeDefined();
});
it('keeps language selection usable when browser persistence fails',()=>{
 render(<WorkedCasePanel entry={{...entry,examVersions:[...entry.examVersions]}}/>);vi.spyOn(Storage.prototype,'setItem').mockImplementation(()=>{throw new Error('quota fixture')});fireEvent.change(screen.getByLabelText('Worked case language'),{target:{value:'vi'}});expect(screen.getByRole('heading',{name:'Một yêu cầu, hai kết quả'})).toBeDefined();expect(screen.getByRole('status').textContent).toContain('chưa lưu được');
});
it('integrates real cases without changing lesson anchors or marking the chapter read',()=>{
 const read=vi.fn(),chapter=chapters.find(c=>c.id==='dev-application')!,entry=workedCases.find(c=>c.chapterId===chapter.id)!;
 const {rerender}=render(<ChapterReader chapter={chapter} exam="DVA-C03" read={false} bookmarked={false} onBookmark={()=>{}} onRead={read} onOpen={()=>{}} onLibrary={()=>{}} onPractice={()=>{}} onService={()=>{}}/>);
 expect(screen.getByRole('heading',{name:entry.title.en})).toBeDefined();for(const section of chapter.sections)expect(document.getElementById(section.id)).not.toBeNull();
 fireEvent.change(screen.getByLabelText('Worked case language'),{target:{value:'vi'}});expect(screen.getByRole('heading',{level:1,name:chapter.title})).toBeDefined();fireEvent.click(screen.getByText('Xem cách sửa'));expect(screen.getByText('Xem cách sửa').closest('details')!.open).toBe(true);expect(read).not.toHaveBeenCalled();
 const next=chapters.find(c=>c.id==='dev-lambda')!;rerender(<ChapterReader chapter={next} exam="DVA-C03" read={false} bookmarked={false} onBookmark={()=>{}} onRead={read} onOpen={()=>{}} onLibrary={()=>{}} onPractice={()=>{}} onService={()=>{}}/>);expect(screen.getByText('Xem cách sửa').closest('details')!.open).toBe(false);expect(screen.getByLabelText('Worked case language').getAttribute('aria-describedby')).toContain(workedCases.find(c=>c.chapterId===next.id)!.id);
});
