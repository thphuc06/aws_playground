import {build} from 'esbuild';
import {mkdtempSync,readFileSync,writeFileSync,unlinkSync,rmdirSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve,dirname} from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const temp=mkdtempSync(join(tmpdir(),'aws-config-audit-')),bundle=join(temp,'registry.cjs');
try{
 await build({stdin:{contents:"export {configurationFields,configurationSources} from './src/configurationRegistry'; export {networkResourceFields} from './src/networkTopology';",resolveDir:root},bundle:true,platform:'node',format:'cjs',outfile:bundle,logLevel:'silent'});
 const {configurationFields,configurationSources,networkResourceFields}=createRequire(import.meta.url)(bundle);
 const flatten=(fields,parent='')=>fields.flatMap(f=>[{...f,path:parent+f.key,itemFields:undefined},...flatten(f.itemFields??[],parent+f.key+'.')]);
 const services=Object.entries(configurationFields).map(([service,fields])=>{
  const flat=flatten(fields);return {service,rootFields:fields.length,totalFields:flat.length,explicitAuditFields:flat.filter(f=>f.audit).length,numberFields:flat.filter(f=>f.kind==='number').length,numberFieldsWithoutMaximum:flat.filter(f=>f.kind==='number'&&f.max===undefined&&!f.allowedNumbers).map(f=>f.path),freeTextFields:flat.filter(f=>f.kind==='text').map(f=>f.path),sources:configurationSources(service),fields:flat};
 });
 const report={generated:'2026-11-02',meaning:'Inventory of metadata and implemented bounds; no inference that every field or source claim has been independently verified.',services,networkResources:Object.entries(networkResourceFields).map(([kind,fields])=>({kind,fields:flatten(fields)}))};
 writeFileSync(join(root,'CONFIG-FIELD-INVENTORY.json'),JSON.stringify(report,null,2)+'\n');
 const notes=JSON.parse(readFileSync(join(root,'scripts/configuration-audit-notes.json'),'utf8'));
 if(services.some(s=>!notes[s.service])||Object.keys(notes).some(s=>!configurationFields[s]))throw new Error('Audit notes do not match the service catalog.');
 const matrix=['# Ma trận audit configuration — 2026-11-02','','Đã rà inventory/schema của toàn bộ catalog. Cột audit là số field có hồ sơ kiểm chứng mới và phạm vi cụ thể trong metadata, **không phải phần trăm tương thích AWS**. Các quy tắc liên-field và kiểm tra cũ không được quy đổi thành tỷ lệ. Các khoảng trống là đề xuất cần điều tra/triển khai, không phải khẳng định cấu hình hiện tại bị AWS từ chối.','','| Service | Field chính / cả cột | Field có audit mới | Đánh giá và việc cần làm kỹ hơn |','|---|---:|---:|---|',...services.map(s=>`| ${s.service} | ${s.rootFields} / ${s.totalFields} | ${s.explicitAuditFields} | ${notes[s.service]} |`),'','## Field số cần đánh giá theo ngữ cảnh','','Không có maximum không đồng nghĩa bug: quota có thể điều chỉnh, giới hạn có thể phụ thuộc variant/account, hoặc đây là application setting. Danh sách này dùng làm hàng đợi rà soát; không được tự chuyển thành lỗi.','',...services.filter(s=>s.numberFieldsWithoutMaximum.length).map(s=>`- **${s.service}**: ${s.numberFieldsWithoutMaximum.map(x=>'`'+x+'`').join(', ')}`),'','Xem CONFIG-FIELD-INVENTORY.json để tra từng đường dẫn field, help, kind, min/max, nguồn, điều kiện áp dụng và scope audit.'];
 writeFileSync(join(root,'CONFIG-AUDIT-MATRIX.md'),matrix.join('\n')+'\n');
 console.log(JSON.stringify({services:services.length,rootFields:services.reduce((n,s)=>n+s.rootFields,0),totalFields:services.reduce((n,s)=>n+s.totalFields,0),explicitAuditFields:services.reduce((n,s)=>n+s.explicitAuditFields,0)}));
 console.log(services.map(s=>`${s.service}: ${s.rootFields}/${s.totalFields} fields; numeric gaps: ${s.numberFieldsWithoutMaximum.join(', ')||'none'}`).join('\n'));
}finally{try{unlinkSync(bundle);rmdirSync(temp)}catch{}}
