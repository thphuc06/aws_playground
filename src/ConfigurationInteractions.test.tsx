// @vitest-environment jsdom
import React,{useState} from 'react';
import {afterEach,it,expect,vi} from 'vitest';
import {render,screen,fireEvent,cleanup} from '@testing-library/react';
import ConfigurationInspector from './ConfigurationInspector';
import {PolicyDocumentField} from './PolicyEditor';
import type {ArchitectureSettings} from './architectureRegistry';
vi.mock('./ConfigurationDocumentEditor',()=>({default:({value,onChange,label,readOnly}:{value:string;onChange:(v:string)=>void;label:string;readOnly?:boolean})=><textarea aria-label={label} value={value} readOnly={readOnly} onChange={e=>onChange(e.target.value)}/>}));
afterEach(cleanup);
it('keeps edits separate, blocks invalid saves, persists valid values and cancels back to the saved graph',()=>{
 const saved=vi.fn();function Harness(){const [values,setValues]=useState<ArchitectureSettings>({});return <ConfigurationInspector service="lambda" values={values} onChange={v=>{setValues(v);saved(v)}}/>}
 render(<Harness/>);fireEvent.click(screen.getByRole('tab',{name:'Configuration'}));const timeout=screen.getByRole('spinbutton',{name:/Timeout/});
 fireEvent.change(timeout,{target:{value:'901'}});expect(saved).not.toHaveBeenCalled();expect((screen.getByRole('button',{name:'Save configuration'}) as HTMLButtonElement).disabled).toBe(true);
 fireEvent.change(timeout,{target:{value:'30'}});fireEvent.click(screen.getByRole('button',{name:'Save configuration'}));expect(saved).toHaveBeenCalledOnce();expect((saved.mock.calls[0][0].values as any).timeoutSeconds).toBe(30);
 fireEvent.change(timeout,{target:{value:'60'}});fireEvent.click(screen.getByRole('button',{name:'Cancel edits'}));expect((screen.getByRole('spinbutton',{name:/Timeout/}) as HTMLInputElement).value).toBe('30');expect(saved).toHaveBeenCalledOnce();
});
it('keeps invalid JSON text available for correction instead of replacing it with a template',async()=>{
 function Harness(){const [value,setValue]=useState('{');return <PolicyDocumentField value={value} onChange={setValue}/>}
 render(<Harness/>);const editor=await screen.findByLabelText('identity policy JSON');expect((editor as HTMLTextAreaElement).value).toBe('{');fireEvent.change(editor,{target:{value:'{"Statement":[]}'}});expect((editor as HTMLTextAreaElement).value).toBe('{"Statement":[]}');
});
it('does not drop unsupported policy elements when switching editing modes',async()=>{
 const source=JSON.stringify({Version:'2012-10-17',Statement:[{Effect:'Deny',NotAction:'s3:GetObject',Resource:'*'}]});const onChange=vi.fn();render(<PolicyDocumentField value={source} onChange={onChange}/>);await screen.findByLabelText('identity policy JSON');expect((screen.getByRole('button',{name:'Visual'}) as HTMLButtonElement).disabled).toBe(true);expect((screen.getByLabelText('identity policy JSON') as HTMLTextAreaElement).value).toBe(source);expect(onChange).not.toHaveBeenCalled();
});
