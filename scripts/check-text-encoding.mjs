import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';

// Windows editors must not silently turn learner-facing text into replacement glyphs.
const files=execFileSync('git',['ls-files','-z'],{encoding:'utf8'}).split('\0').filter(file=>/\.(?:tsx?|css|mjs|json|md)$/.test(file));
const decoder=new TextDecoder('utf-8',{fatal:true}),failures=[];
for(const file of files){
 try{const text=decoder.decode(readFileSync(file));if(text.includes('\uFFFD'))failures.push(file+': unexpected replacement character; use an explicit escape if intentional.');}
 catch{failures.push(file+': invalid UTF-8 text.');}
}
if(failures.length){console.error(failures.join('\n'));process.exitCode=1;}
else console.log(`UTF-8 check passed for ${files.length} tracked text files.`);
