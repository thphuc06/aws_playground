import {open,readFile,rename,unlink} from 'node:fs/promises';
import {dirname,isAbsolute} from 'node:path';
export interface SpendLedger {reserve(microDollars:number):Promise<boolean>;remaining():number}
/** Single-instance local durable ledger. Never releases reservations: ambiguous provider outcomes stay charged. */
export class FileLedger implements SpendLedger {
 private used=0;private queue:Promise<unknown>=Promise.resolve();private failed=false;
 private constructor(private path:string,private budget:number,private lock:Awaited<ReturnType<typeof open>>){}
 static async connect(path:string,budget:number):Promise<FileLedger>{
  if(!isAbsolute(path)||!Number.isSafeInteger(budget)||budget<=0||budget>1000000)throw new Error('Invalid ledger configuration.');
  const lock=await open(path+'.lock','wx',0o600);
  try {const data=JSON.parse(await readFile(path,'utf8'));if(data.version!==1||data.budget!==budget||!Number.isSafeInteger(data.reserved)||data.reserved<0||data.reserved>budget||Object.keys(data).sort().join(',')!=='budget,reserved,version')throw new Error('Invalid or mismatched ledger.');const result=new FileLedger(path,budget,lock);result.used=data.reserved;return result}
  catch(e){await lock.close();await unlink(path+'.lock');throw e}
 }
 remaining(){return this.failed?0:this.budget-this.used}
 reserve(amount:number):Promise<boolean>{
  const run=this.queue.then(async()=>{if(this.failed||!Number.isSafeInteger(amount)||amount<=0||amount>this.remaining())return false;
   // Move in-memory balance first. Any write uncertainty disables the process.
   this.used+=amount;let temp:Awaited<ReturnType<typeof open>>|undefined;
   try{temp=await open(this.path+'.next','wx',0o600);await temp.writeFile(JSON.stringify({version:1,budget:this.budget,reserved:this.used}));await temp.sync();await temp.close();temp=undefined;await rename(this.path+'.next',this.path);const dir=await open(dirname(this.path),'r');try{await dir.sync()}finally{await dir.close()}return true}
   catch{this.failed=true;if(temp)await temp.close().catch(()=>{});throw new Error('Ledger persistence failed; review disabled.');}
  });this.queue=run.catch(()=>{});return run;
 }
 async close(){await this.queue;await this.lock.close();await unlink(this.path+'.lock')}
}
export async function initializeLedger(path:string,budget:number){if(!isAbsolute(path)||!Number.isSafeInteger(budget)||budget<=0||budget>1000000)throw new Error('Use an absolute ledger path and explicit budget >0 and <=1 USD.');const file=await open(path,'wx',0o600);try{await file.writeFile(JSON.stringify({version:1,budget,reserved:0}));await file.sync()}finally{await file.close()}const dir=await open(dirname(path),'r');try{await dir.sync()}finally{await dir.close()}}
