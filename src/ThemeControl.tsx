import {useEffect,useState} from 'react';
import {Monitor,Moon,Sun} from 'lucide-react';
export type ThemePreference='light'|'dark'|'system';
export const themeStorageKey='aws-playground-theme';
export function readThemePreference():ThemePreference {
 try{const value=localStorage.getItem(themeStorageKey);if(value==='light'||value==='dark')return value;}catch{}
 return 'system';
}
export default function ThemeControl(){
 const [preference,setPreference]=useState<ThemePreference>(readThemePreference);
 useEffect(()=>{
  const media=window.matchMedia('(prefers-color-scheme: dark)');
  const apply=()=>{const resolved=preference==='system'?(media.matches?'dark':'light'):preference;document.documentElement.dataset.theme=resolved;document.documentElement.dataset.themePreference=preference;document.querySelector('meta[name="theme-color"]')?.setAttribute('content',resolved==='dark'?'#111820':'#f4f5f7');};
  apply();media.addEventListener('change',apply);return()=>media.removeEventListener('change',apply);
 },[preference]);
 useEffect(()=>{const sync=(event:StorageEvent)=>{if(event.key===themeStorageKey||event.key===null)setPreference(readThemePreference())};window.addEventListener('storage',sync);return()=>window.removeEventListener('storage',sync)},[]);
 const Icon=preference==='dark'?Moon:preference==='light'?Sun:Monitor;
 return <label className="theme-control"><Icon size={17} aria-hidden="true"/><span className="theme-label">Theme</span><select aria-label="Color theme" title="Color theme: Light, Dark or System" value={preference} onChange={event=>{const value=event.target.value as ThemePreference;setPreference(value);try{localStorage.setItem(themeStorageKey,value)}catch{}}}><option value="light">Light</option><option value="dark">Dark</option><option value="system">System</option></select></label>;
}
