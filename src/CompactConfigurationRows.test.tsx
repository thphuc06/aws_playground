// @vitest-environment jsdom
import React,{useState} from 'react';
import {afterEach,it,expect,vi} from 'vitest';
import {render,screen,fireEvent,cleanup,within,waitFor} from '@testing-library/react';
import ConfigurationField from './ConfigurationField';
import {configurationFields} from './configurationRegistry';
import type {ConfigField,JsonValue} from './configurationTypes';
import {configurationRowSummary} from './CompactConfigurationRows';
vi.mock('./ConfigurationDocumentEditor',()=>({default:({value,label,onChange}:{value:string;label:string;onChange:(value:string)=>void})=>{
 // A document editor may hold an unfinished local draft/history beyond its committed value.
 const [raw,setRaw]=useState(value);return <textarea aria-label={label} value={raw} onChange={e=>{setRaw(e.target.value);try{JSON.parse(e.target.value);onChange(e.target.value)}catch{}}}/>;
}}));
afterEach(cleanup);
const toggle=(row:HTMLDetailsElement,open:boolean)=>{row.open=open;fireEvent(row,new Event('toggle',{bubbles:false}))};
const sg=configurationFields.ec2.find(f=>f.key==='securityRules')!;
const field=(key:string,label:string,kind:ConfigField['kind'],extra:Partial<ConfigField>={}):ConfigField=>({key,label,kind,section:'configuration',help:'Teaching fixture.',...extra});
it('uses the prerequisite display label and distinguishes absent inapplicable values',()=>{
 const runtime=configurationFields.lambda.find(f=>f.key==='runtime')!,jump=vi.fn();
 const {rerender}=render(<ConfigurationField field={runtime} value={undefined} values={{}} service="lambda" onChange={()=>{}} onJumpField={jump}/>);
 fireEvent.click(screen.getByRole('button',{name:'Set Deployment package'}));expect(jump).toHaveBeenLastCalledWith('packageType');
 rerender(<ConfigurationField field={runtime} value={undefined} values={{packageType:'Image'}} service="lambda" onChange={()=>{}} onJumpField={jump}/>);
 expect(screen.getByText(/No value is required for this variant/)).toBeTruthy();expect(screen.queryByRole('button',{name:'Clear Runtime'})).toBeNull();expect(screen.queryByText(/Clear its declared value/)).toBeNull();
 rerender(<ConfigurationField field={runtime} value="python3.12" values={{packageType:'Image'}} service="lambda" onChange={()=>{}} onJumpField={jump}/>);
 expect(screen.getByText(/Clear its declared value before saving/)).toBeTruthy();
});
it('resolves a row prerequisite to that row instead of an unrelated root field',()=>{
 const methods=field('methods','Authentication methods','table',{itemFields:[field('mode','Authentication method','select',{options:['iam','jwt']}),field('audience','Token audience','text',{when:{field:'mode',values:['jwt']}})]}),jump=vi.fn();
 const {container}=render(<ConfigurationField field={methods} value={[{mode:'iam'},{}]} values={{}} service="lambda" onChange={()=>{}} onJumpField={jump}/>);
 const second=container.querySelector<HTMLDetailsElement>('[data-field-path="methods-1"]')!;expect(second.open).toBe(true);
 fireEvent.click(within(second).getByRole('button',{name:'Set Authentication method'}));expect(jump).toHaveBeenLastCalledWith('methods.1.mode');
});
it('inherits ancestor-row prerequisite locations through a nested table',()=>{
 const nested=field('groups','Groups','table',{itemFields:[field('mode','Group authentication','select',{options:['jwt']}),field('targets','Targets','table',{itemFields:[field('audience','Audience','text',{when:{field:'mode',values:['jwt']}})]})]}),jump=vi.fn();
 const {container}=render(<ConfigurationField field={nested} value={[{targets:[{}]}]} values={{}} onChange={()=>{}} onJumpField={jump}/>);
 const row=container.querySelector<HTMLDetailsElement>('[data-field-path="groups-0"]')!;toggle(row,true);
 fireEvent.click(screen.getByRole('button',{name:'Set Group authentication'}));expect(jump).toHaveBeenLastCalledWith('groups.0.mode');
});
it('starts populated rows compact with protocol-aware summaries and mounted controls',()=>{
 const {container}=render(<ConfigurationField field={sg} value={[{direction:'ingress',protocol:'tcp',fromPort:443,toPort:443,peer:'frontend-sg'}]} values={{}} onChange={()=>{}}/>);
 const row=container.querySelector<HTMLDetailsElement>('.compact-configuration-row')!;expect(row.open).toBe(false);expect(row.querySelector('summary')?.textContent).toContain('Ingress TCP 443 from frontend-sg');expect(row.querySelectorAll('input,select').length).toBeGreaterThan(0);
 expect(configurationRowSummary(sg,{protocol:'icmp',fromPort:8,toPort:0,peer:'10.0.0.0/24'})).toContain('ICMP type 8 / code 0');
 expect(configurationRowSummary(sg,{protocol:'all',fromPort:443,toPort:443,peer:'frontend-sg'})).toBe('ALL protocols from frontend-sg');
});
it('opens a new empty row and does not collapse it while typing or adding another row',async()=>{
 let latest:JsonValue|undefined;function Harness(){const [value,setValue]=useState<JsonValue>([]);latest=value;return <ConfigurationField field={sg} value={value} values={{}} onChange={next=>setValue(next??[])}/>}
 const {container}=render(<Harness/>);fireEvent.click(screen.getByRole('button',{name:'Add security-group rules row'}));const row=container.querySelector<HTMLDetailsElement>('.compact-configuration-row')!;expect(row.open).toBe(true);
 fireEvent.change(within(row).getByLabelText('Protocol'),{target:{value:'icmp'}});fireEvent.change(within(row).getByLabelText('ICMP type'),{target:{value:'8'}});fireEvent.change(within(row).getByLabelText('ICMP code'),{target:{value:'0'}});
 await waitFor(()=>expect(row.open).toBe(true));expect(row.querySelector('summary')?.textContent).toContain('type 8 / code 0');
 fireEvent.click(screen.getByRole('button',{name:'Add security-group rules row'}));expect(row.open).toBe(true);expect(container.querySelectorAll<HTMLDetailsElement>('.compact-configuration-row')[1].open).toBe(true);
 expect(latest).toEqual([{protocol:'icmp',fromPort:8,toPort:0},{}]);
});
it('keeps unfinished raw editor state mounted through collapse and surviving-row deletion',async()=>{
 const policies=field('policies','Policies','table',{itemFields:[field('name','Policy name','text'),field('document','Policy document','json',{documentType:'policy'})]});
 const initial=[{name:'first',document:'{}'},{name:'second',document:'{}'}];let latest:JsonValue|undefined;
 function Harness(){const [value,setValue]=useState<JsonValue>(initial);latest=value;return <ConfigurationField field={policies} value={value} values={{}} onChange={next=>setValue(next??[])}/>}
 const {container}=render(<Harness/>);const rows=container.querySelectorAll<HTMLDetailsElement>('.compact-configuration-row');toggle(rows[0],true);toggle(rows[1],true);
 const input=await within(rows[1]).findByLabelText('Policy document JSON');fireEvent.change(input,{target:{value:'{unfinished second policy'}});
 toggle(rows[1],false);expect(input.isConnected).toBe(true);toggle(rows[1],true);expect((input as HTMLTextAreaElement).value).toBe('{unfinished second policy');
 fireEvent.click(within(rows[0]).getByRole('button',{name:'Remove Policies row 1'}));expect(input.isConnected).toBe(true);expect((input as HTMLTextAreaElement).value).toBe('{unfinished second policy');expect(input.closest('[data-field-path]')?.getAttribute('data-field-path')).toBe('policies-0-document');
 expect(latest).toEqual([{name:'second',document:'{}'}]);
});
