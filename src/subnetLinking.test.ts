import {it,expect} from 'vitest';
import {suggestSubnetCidr,linkSubnetsToVpc,owningVpcName} from './subnetLinking';
import type {Graph} from './architectureReview';
it('suggests the first free subnet block inside the VPC range',()=>{
 expect(suggestSubnetCidr('10.0.0.0/16',[])).toBe('10.0.0.0/24');
 expect(suggestSubnetCidr('10.0.0.0/16',['10.0.0.0/24','10.0.2.0/23'])).toBe('10.0.1.0/24');
 expect(suggestSubnetCidr('10.0.0.0/16',['10.0.0.0/23'])).toBe('10.0.2.0/24');
 expect(suggestSubnetCidr('192.168.1.0/24',[])).toBe('192.168.1.0/26');
 expect(suggestSubnetCidr('192.168.1.0/24',['192.168.1.0/25','192.168.1.128/25'])).toBeUndefined();
 expect(suggestSubnetCidr('2001:db8::/56',[])).toBeUndefined();expect(suggestSubnetCidr('not-a-cidr',[])).toBeUndefined();expect(suggestSubnetCidr(undefined,[])).toBeUndefined();
});
const graph=(subnet:Record<string,unknown>,extra:any[]=[]):Graph=>({version:1,nodes:[],edges:[],configs:{},network:{version:1,frames:[{id:'vpc',kind:'vpc',name:'Main VPC',x:0,y:0,width:900,height:600,cidr:'10.0.0.0/16'},...extra,{id:'s',kind:'subnet',name:'App subnet',x:50,y:60,width:300,height:200,...subnet}],membership:{},resources:[]}} as Graph);
it('links newly contained subnets, including through an AZ frame, without rewriting existing CIDRs',()=>{
 const before=graph({});
 const placed=linkSubnetsToVpc(before,graph({parentId:'vpc'}));expect(placed.graph.network!.frames.find(f=>f.id==='s')!.cidr).toBe('10.0.0.0/24');expect(placed.notes[0]).toContain('uses 10.0.0.0/24');
 const az={id:'az',kind:'availability-zone',name:'AZ a',x:20,y:40,width:500,height:400,parentId:'vpc'};
 expect(linkSubnetsToVpc(graph({},[az]),graph({parentId:'az'},[az])).graph.network!.frames.find(f=>f.id==='s')!.cidr).toBe('10.0.0.0/24');
 const kept=linkSubnetsToVpc(before,graph({parentId:'vpc',cidr:'172.16.0.0/24'}));expect(kept.graph.network!.frames.find(f=>f.id==='s')!.cidr).toBe('172.16.0.0/24');expect(kept.notes[0]).toContain('is now in Main VPC');
 const already=graph({parentId:'vpc'});expect(linkSubnetsToVpc(already,already)).toEqual({graph:already,notes:[]});
 expect(owningVpcName(graph({parentId:'vpc'}),'s')).toBe('Main VPC');expect(owningVpcName(graph({}),'s')).toBeUndefined();
});
it('leaves canonical registry workspaces to their explicit resource bindings',()=>{
 const after=graph({parentId:'vpc'});(after.network as any).registry={version:1,resources:[],serviceBindings:{},frameBindings:{}};
 expect(linkSubnetsToVpc(graph({}),after).graph).toBe(after);
});
