/** One shared gate for both current and compatibility endpoints in a process. */
export class WorkflowGate {
 private active=false;
 private starts:number[]=[];
 acquire(now=Date.now()):boolean {this.starts=this.starts.filter(t=>t>now-60000);if(this.active||this.starts.length>=3)return false;this.active=true;this.starts.push(now);return true;}
 release(){this.active=false}
}
