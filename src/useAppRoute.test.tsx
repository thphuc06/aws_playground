// @vitest-environment jsdom
import React,{useState} from 'react';
import {render,screen,fireEvent,cleanup,waitFor} from '@testing-library/react';
import {afterEach,it,expect,vi} from 'vitest';
import useAppRoute from './useAppRoute';
afterEach(()=>cleanup());
it('cancels browser Back without losing the page or the Forward history, then permits leaving after saving',async()=>{
 history.replaceState({},'','/?view=home&exam=DVA-C03');const confirm=vi.fn(()=>false);
 function Harness(){const [dirty,setDirty]=useState(false),[route,navigate]=useAppRoute((next,current)=>!dirty||current.view!=='builder'||confirm());return <><p>{route.view}</p><button onClick={()=>navigate({...route,view:'builder'})}>Builder</button><button onClick={()=>setDirty(d=>!d)}>Toggle draft</button><button onClick={()=>navigate({...route,view:'services'})}>Services</button></>}
 render(<Harness/>);fireEvent.click(screen.getByRole('button',{name:'Builder'}));fireEvent.click(screen.getByRole('button',{name:'Toggle draft'}));
 history.back();await waitFor(()=>expect(confirm).toHaveBeenCalledTimes(1));await waitFor(()=>expect(new URL(location.href).searchParams.get('view')).toBe('builder'));expect(screen.getByText('builder')).toBeDefined();
 fireEvent.click(screen.getByRole('button',{name:'Services'}));expect(confirm).toHaveBeenCalledTimes(2);expect(screen.getByText('builder')).toBeDefined();
 fireEvent.click(screen.getByRole('button',{name:'Toggle draft'}));history.back();await waitFor(()=>expect(screen.getByText('home')).toBeDefined());history.forward();await waitFor(()=>expect(screen.getByText('builder')).toBeDefined());expect(confirm).toHaveBeenCalledTimes(2);
});
