// @vitest-environment jsdom
import React,{lazy} from 'react';
import {cleanup,render,screen} from '@testing-library/react';
import {afterEach,expect,it,vi} from 'vitest';
import RouteContentBoundary from './RouteContentBoundary';
afterEach(()=>{cleanup();vi.restoreAllMocks()});
it('keeps a useful error on failed chunk load and recovers when another route is selected',async()=>{
 vi.spyOn(console,'error').mockImplementation(()=>{});
 const MissingRoute=lazy(()=>Promise.reject(new Error('Synthetic download failure')));
 const {rerender}=render(<><button>Home navigation</button><RouteContentBoundary resetKey="builder"><MissingRoute/></RouteContentBoundary></>);
 expect(screen.getByRole('status').textContent).toContain('Loading this page');
 expect((await screen.findByRole('alert')).textContent).toContain('This page could not open');
 expect(screen.getByRole('button',{name:'Home navigation'})).toBeDefined();
 rerender(<><button>Home navigation</button><RouteContentBoundary resetKey="home"><h1>Available home</h1></RouteContentBoundary></>);
 expect(await screen.findByRole('heading',{name:'Available home'})).toBeDefined();
 expect(screen.queryByRole('alert')).toBeNull();
});
