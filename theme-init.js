/* Clickjacking guard: CSP frame-ancestors is ignored in a <meta> tag (GitHub Pages can't emit HTTP
   headers), so bust out of frames here as a fallback. Scoped to the production host so it never blanks
   legitimate dev/preview embeds. The real fix is the X-Frame-Options / frame-ancestors HTTP header
   in _headers when fronted by Cloudflare Pages / Netlify. */
(function(){
  try{
    if (location.hostname === 'anmolbakshi.com' && window.top !== window.self) {
      window.top.location = window.self.location;
    }
  }catch(e){ document.documentElement.style.display = 'none'; }
})();

(function(){
  try{
    var stored = localStorage.getItem('theme');
    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = stored || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  }catch(e){}
})();
