import React from 'react';
import {it,expect} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';
import CompletionSummary from './CompletionSummary';
import {auditCompletion} from '../backend/completion-audit';
import type {Graph} from './architectureReview';
it('shows legacy reports as unassessed rather than claiming completeness',()=>{expect(renderToStaticMarkup(<CompletionSummary graph={null}/>)).toContain('no requirement-by-requirement assessment')});
it('renders missing requirements, field inventory and stale evidence without changing the graph',()=>{const g:Graph={version:1,nodes:[{id:'app',service:'ec2',label:'App',position:{x:0,y:0}}],edges:[],configs:{}};const audit=auditCompletion(g,'Serve an application',[{requirementId:'requirement-1',status:'missing',explanation:'Workload configuration remains absent.',evidence:[]}],[]);const changed=structuredClone(g);changed.nodes[0].label='Changed';const html=renderToStaticMarkup(<CompletionSummary audit={audit} graph={changed}/>);expect(html).toContain('Draft saved with gaps');expect(html).toContain('Workload configuration remains absent.');expect(html).toContain('changed since this assessment');expect(html).toContain('Field inventory');expect(g.nodes[0].label).toBe('App')});
