import {useState} from 'react';
import type {ChapterWorkedCase,BilingualText} from './learning/workedCaseTypes';
import './workedCase.css';
export const workedCaseLanguageKey='aws-playground-worked-case-language-v1';
export function readWorkedCaseLanguage():'en'|'vi'{try{return localStorage.getItem(workedCaseLanguageKey)==='vi'?'vi':'en'}catch{return 'en'}}
export default function WorkedCasePanel({entry}:{entry:ChapterWorkedCase}){
 const [language,setLanguage]=useState<'en'|'vi'>(readWorkedCaseLanguage),[saveFailed,setSaveFailed]=useState(false);
 const t=(text:BilingualText)=>text[language]||text.en;
 const labels=language==='en'?{heading:'Worked reasoning case',scope:'Illustrative fixture · no AWS calls',language:'Case language',languageScope:'Changes this case only. The main lesson keeps its original language.',saveFailed:'Your language choice works for this visit, but could not be saved in this browser.',assumptions:'Assumptions',input:'Input and evidence',predict:'Predict what happened from the supplied evidence, then reveal each step to compare your reasoning.',expected:'Reveal expected observations',failure:'Reveal what goes wrong',diagnose:'Reveal diagnosis',repair:'Reveal repair',verify:'Reveal verification plan',transfer:'Apply the idea elsewhere',answer:'Reveal reasoning',sources:'Sources and scope',limits:'Limits of this exercise'}:{heading:'Tình huống suy luận',scope:'Dữ liệu minh họa · không gọi AWS',language:'Ngôn ngữ tình huống',languageScope:'Chỉ đổi ngôn ngữ tình huống này. Bài học chính giữ nguyên ngôn ngữ.',saveFailed:'Lựa chọn ngôn ngữ có hiệu lực trong lần đọc này nhưng chưa lưu được vào trình duyệt.',assumptions:'Giả định',input:'Đầu vào và bằng chứng',predict:'Dự đoán điều đã xảy ra từ bằng chứng cho sẵn, rồi mở từng bước để đối chiếu lập luận.',expected:'Xem quan sát dự kiến',failure:'Xem điều gì xảy ra sai',diagnose:'Xem cách chẩn đoán',repair:'Xem cách sửa',verify:'Xem kế hoạch kiểm chứng',transfer:'Vận dụng sang tình huống khác',answer:'Xem lập luận',sources:'Nguồn và phạm vi',limits:'Giới hạn bài tập'};
 const list=(items:BilingualText[])=><ul>{items.map((item,index)=><li key={index}>{t(item)}</li>)}</ul>;
 const chooseLanguage=(value:'en'|'vi')=>{setLanguage(value);try{localStorage.setItem(workedCaseLanguageKey,value);setSaveFailed(false)}catch{setSaveFailed(true)}};
 return <section className="worked-case-panel" lang={language} aria-labelledby={'worked-case-'+entry.id}>
  <header><div><small>{labels.heading}</small><h2 id={'worked-case-'+entry.id}>{t(entry.title)}</h2><p>{labels.scope}</p></div><label>{labels.language}<select aria-label="Worked case language" aria-describedby={'worked-case-language-scope-'+entry.id} value={language} onChange={e=>chooseLanguage(e.target.value as 'en'|'vi')}><option value="en">English</option><option value="vi">Tiếng Việt</option></select></label></header>
  <p className="worked-case-language-scope" id={'worked-case-language-scope-'+entry.id}>{labels.languageScope}</p>{saveFailed&&<p role="status">{labels.saveFailed}</p>}
  <h3>{labels.assumptions}</h3>{list(entry.assumptions)}<h3>{labels.input}</h3><p>{t(entry.input.description)}</p><pre tabIndex={0} aria-label={labels.input+' · '+entry.input.language}><code>{entry.input.code}</code></pre>
  <p className="worked-case-prompt">{labels.predict}</p>
  <details><summary>{labels.expected}</summary>{list(entry.expectedObservations)}</details>
  <details className="worked-case-failure"><summary>{labels.failure}</summary><p>{t(entry.failure)}</p></details>
  <details><summary>{labels.diagnose}</summary>{list(entry.diagnosis)}</details>
  <details><summary>{labels.repair}</summary>{list(entry.repair)}</details>
  <details><summary>{labels.verify}</summary>{list(entry.verification)}</details>
  <div className="worked-case-transfer"><h3>{labels.transfer}</h3><p>{t(entry.transferQuestion.question)}</p><details><summary>{labels.answer}</summary><p>{t(entry.transferQuestion.answer)}</p></details></div>
  <details><summary>{labels.sources}</summary><ul>{entry.sources.map(source=><li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.title} ↗</a><small>{source.verified} · {source.scope}</small></li>)}</ul></details>
  <h3>{labels.limits}</h3>{list(entry.limitations)}
 </section>;
}
