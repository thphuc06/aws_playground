import type {AssistantActivity} from '../src/assistantContract';
/** Observable tool execution only. Never forwards provider reasoning or request headers. */
export class ActivityLog {
 entries:AssistantActivity[]=[];
 constructor(private emit:(event:string,data:unknown)=>void){}
 start(title:string,details:string[]=[]){const item:AssistantActivity={id:'activity-'+(this.entries.length+1),title,status:'running',startedAt:Date.now(),details:details.slice(0,25).map(x=>x.slice(0,500))};this.entries.push(item);this.emit('activity',structuredClone(item));return item.id;}
 end(id:string,patch:Partial<Pick<AssistantActivity,'title'|'details'|'sources'|'graph'>>={},failed=false){const item=this.entries.find(x=>x.id===id);if(!item)return;Object.assign(item,patch,{status:failed?'failed':'completed',finishedAt:Date.now()});item.details=item.details.slice(0,25).map(x=>x.slice(0,500));this.emit('activity',structuredClone(item));}
 interrupt(reason:string){for(const item of this.entries.filter(x=>x.status==='running'))this.end(item.id,{details:[reason]},true)}
}
