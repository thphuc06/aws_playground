import {Component,Suspense,type ReactNode} from 'react';

/** Keep navigation available while a route downloads or a chunk cannot be opened. */
export default class RouteContentBoundary extends Component<{resetKey:string;children:ReactNode},{failed:boolean}> {
 state={failed:false};
 static getDerivedStateFromError(){return {failed:true};}
 componentDidUpdate(previous:{resetKey:string}){if(this.state.failed&&previous.resetKey!==this.props.resetKey)this.setState({failed:false});}
 render(){
  if(this.state.failed)return <section role="alert"><h2>This page could not open</h2><p>Check your connection, reload, or choose another section from the navigation.</p><button onClick={()=>window.location.reload()}>Reload page</button></section>;
  return <Suspense fallback={<section role="status" aria-live="polite"><p>Loading this page…</p></section>}>{this.props.children}</Suspense>;
 }
}
