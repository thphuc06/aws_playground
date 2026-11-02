// @vitest-environment jsdom
import React from 'react';
import {createPortal} from 'react-dom';
import {it,expect,vi,afterEach} from 'vitest';
import {render,screen,fireEvent,cleanup} from '@testing-library/react';
vi.mock('@xyflow/react',()=>({BaseEdge:()=> <path data-testid="edge-hit" d="M 0 0 L 100 100"/>,EdgeLabelRenderer:({children}:any)=>createPortal(children,document.body),getSmoothStepPath:()=>['M 0 0 L 100 100',50,50],useViewport:()=>({zoom:.35,x:0,y:0}),useStore:(select:any)=>select({width:1000,height:600})}));
import InlineEdge from './InlineEdge';
afterEach(cleanup);
it('keeps labels hidden at overview zoom until hover or selection, with explicit all/hidden controls',()=>{const props:any={id:'e',source:'a',target:'b',selected:false,data:{text:'Publish notification',editing:false,onEdit:vi.fn(),onChange:vi.fn(),onCommit:vi.fn(),onCancel:vi.fn()}};const view=render(<svg><InlineEdge {...props}/></svg>);expect(screen.queryByRole('button')).toBeNull();fireEvent.mouseEnter(screen.getByTestId('edge-hit').parentElement!);expect(screen.getByRole('button',{name:/Publish notification/})).toBeDefined();fireEvent.mouseLeave(screen.getByTestId('edge-hit').parentElement!);expect(screen.queryByRole('button')).toBeNull();view.rerender(<svg><InlineEdge {...props} data={{...props.data,showLabel:true}}/></svg>);expect(screen.getByRole('button')).toBeDefined();view.rerender(<svg><InlineEdge {...props} selected data={{...props.data,hideLabel:true}}/></svg>);expect(screen.queryByRole('button')).toBeNull();view.rerender(<svg><InlineEdge {...props} data={{...props.data,hideLabel:true,editing:true}}/></svg>);expect(screen.getByLabelText('Edit connection label')).toBeDefined()});
