// @vitest-environment jsdom
import React from 'react';
import {it,expect,vi,afterEach} from 'vitest';
import {render,screen,fireEvent,cleanup} from '@testing-library/react';
import AssistantReport from './AssistantReport';
import type {AssistantResult} from './assistantContract';
import type {Graph} from './architectureReview';
afterEach(cleanup);
it('links a finding to its edge endpoints and a service explanation to the proposal node',()=>{const graph:Graph={version:1,nodes:[{id:'api',service:'api',label:'API',position:{x:0,y:0}},{id:'fn',service:'lambda',label:'Worker',position:{x:300,y:0}}],edges:[{id:'call',source:'api',target:'fn'}],configs:{}};const report:AssistantResult={mode:'design',baseFingerprint:'fixture',summary:'Review',assumptions:[],sources:[],draft:graph,findings:[{scope:'current',nodeIds:[],edgeIds:['call'],severity:'warning',title:'Review call',detail:'Inspect these components.',sourceIds:[]}],serviceExplanations:[{nodeId:'fn',role:'Worker',reason:'Process',configurationNotes:[],sourceIds:[]}],usage:{inputTokens:0,outputTokens:0,responses:0,searches:0,estimatedUsd:0,incomplete:false}};const focus=vi.fn();render(<AssistantReport report={report} original={graph} draft={graph} onFocus={focus} availableNodeIds={['api','fn']}/>);const buttons=screen.getAllByRole('button',{name:'Show on diagram'});fireEvent.click(buttons[0]);expect(focus).toHaveBeenLastCalledWith(['api','fn'],['call'],'current');fireEvent.click(buttons[1]);expect(focus).toHaveBeenLastCalledWith(['fn'],[],'proposal')});
