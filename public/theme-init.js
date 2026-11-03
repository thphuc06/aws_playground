// Apply the saved appearance before the first paint, independently of app startup.
(()=>{
 let preference='system';
 try{const saved=localStorage.getItem('aws-playground-theme');if(saved==='light'||saved==='dark')preference=saved;}catch{}
 const dark=preference==='dark'||preference==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches;
 document.documentElement.dataset.theme=dark?'dark':'light';
 document.documentElement.dataset.themePreference=preference;
 document.querySelector('meta[name="theme-color"]')?.setAttribute('content',dark?'#111b18':'#f3f0e7');
})();
