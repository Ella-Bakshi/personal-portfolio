(function(){
  'use strict';

  /* ------- DD News video: click-to-load facade (no third-party / YouTube player until the
     visitor opts in, so the page loads with a clean console) ------- */
  var ddBtn = document.getElementById('ddnewsPlay');
  if(ddBtn){
    ddBtn.addEventListener('click', function(){
      var wrap = ddBtn.parentNode;
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/aLOZ5GwKGFs?start=796&end=998&autoplay=1';
      f.title = 'DD News Coverage';
      f.setAttribute('allow', 'autoplay; encrypted-media');
      f.setAttribute('allowfullscreen', '');
      f.setAttribute('loading', 'lazy');
      while(wrap.firstChild){ wrap.removeChild(wrap.firstChild); }
      wrap.appendChild(f);
    });
  }

  /* ------- section index spy ------- */
  var indexerLinks = document.querySelectorAll('.indexer a');
  var sections = Array.from(indexerLinks).map(function(a){
    return document.getElementById(a.dataset.target);
  }).filter(Boolean);

  function updateIndexer(){
    var pos = window.scrollY + window.innerHeight * 0.35;
    var current = sections[0];
    sections.forEach(function(s){
      if(s && s.offsetTop <= pos) current = s;
    });
    indexerLinks.forEach(function(a){
      a.classList.toggle('is-active', a.dataset.target === (current && current.id));
    });
  }
  window.addEventListener('scroll', updateIndexer, {passive:true});
  updateIndexer();

  /* ------- timeline filter ------- */
  var tlFilter = document.getElementById('tlFilter');
  var tlEvents = document.querySelectorAll('.tl-event');
  var tlYearBlocks = document.querySelectorAll('.tl-year-block');
  if(tlFilter){
    tlFilter.addEventListener('click', function(e){
      var b = e.target.closest('button');
      if(!b) return;
      var f = b.dataset.filter;
      tlFilter.querySelectorAll('button').forEach(function(x){x.classList.remove('is-active')});
      b.classList.add('is-active');
      tlEvents.forEach(function(ev){
        var match = (f === 'all' || ev.dataset.cat === f);
        ev.classList.toggle('hide', !match);
      });
      // hide year blocks with zero visible events
      tlYearBlocks.forEach(function(yb){
        var visible = yb.querySelectorAll('.tl-event:not(.hide)');
        var year = yb.querySelector('.tl-year');
        var ev   = yb.querySelector('.tl-events');
        if(year && ev){
          year.style.display = visible.length ? '' : 'none';
          ev.style.display   = visible.length ? '' : 'none';
        }
      });
    });
  }

  /* ------- gallery filter ------- */
  var galTabs = document.getElementById('galTabs');
  var plates = document.querySelectorAll('#gal .plate');
  if(galTabs){
    galTabs.addEventListener('click', function(e){
      var b = e.target.closest('button');
      if(!b) return;
      var f = b.dataset.filter;
      galTabs.querySelectorAll('button').forEach(function(x){x.classList.remove('is-active')});
      b.classList.add('is-active');
      plates.forEach(function(p){
        var match = (f === 'all' || p.dataset.cat === f);
        p.classList.toggle('hide', !match);
      });
    });
  }

  /* ------- scroll reveal ------- */
  (function setupReveal(){
    if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if(!('IntersectionObserver' in window)) return;

    // Auto-tag elements
    var heads = document.querySelectorAll('.section-head');
    heads.forEach(function(h){
      h.classList.add('reveal-head');
      var num = h.querySelector('.section-num');
      var title = h.querySelector('.section-title');
      if(num) num.classList.add('reveal');
      if(title) title.classList.add('reveal-title');
    });

    // Stagger containers per section body
    var staggerSelectors = [
      '.work-list',
      '.skills-grid',
      '.projects-grid',
      '.wins-grid',
      '.tl-events',
      '.media-grid',
      '.gallery-grid',
      '.vol-list',
      '.edu-list',
      '.contact-grid'
    ];
    staggerSelectors.forEach(function(sel){
      document.querySelectorAll(sel).forEach(function(el){
        el.classList.add('reveal-stagger');
      });
    });

    // Hero lede + meta — fade up on load
    var heroBits = document.querySelectorAll('.hero .lede, .hero .hero-meta, .hero h1, .portrait-wrap, .plate-caption');
    heroBits.forEach(function(el){ el.classList.add('reveal'); });

    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    document.querySelectorAll('.reveal, .reveal-title, .reveal-stagger, .section-head').forEach(function(el){
      io.observe(el);
    });

    // Hero items fire on load (they may already be above threshold)
    requestAnimationFrame(function(){
      document.querySelectorAll('.hero .reveal').forEach(function(el, i){
        setTimeout(function(){ el.classList.add('is-in'); }, 80 + i * 90);
      });
    });
  })();

  /* ------- lightbox ------- */
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  var lbTitle = document.getElementById('lbTitle');
  var lbSub = document.getElementById('lbSub');
  var lbClose = document.getElementById('lbClose');
  var lbPrev = document.getElementById('lbPrev');
  var lbNext = document.getElementById('lbNext');
  var lbIndex = 0;

  function openLb(i){
    var visible = Array.from(plates).filter(function(p){return !p.classList.contains('hide')});
    if(!visible.length) return;
    lbIndex = ((i % visible.length) + visible.length) % visible.length;
    var p = visible[lbIndex];
    lbImg.src = p.dataset.src;
    lbImg.alt = p.dataset.title || '';
    lbTitle.textContent = p.dataset.title || '';
    lbSub.textContent = p.dataset.caption || '';
    lb.classList.add('is-active');
    document.body.style.overflow = 'hidden';
    lb.dataset.visibleCount = visible.length;
  }
  function closeLb(){
    lb.classList.remove('is-active');
    document.body.style.overflow = '';
  }
  function navLb(dir){
    var visible = Array.from(plates).filter(function(p){return !p.classList.contains('hide')});
    openLb(lbIndex + dir);
  }
  plates.forEach(function(p, i){
    p.addEventListener('click', function(){
      var visible = Array.from(plates).filter(function(x){return !x.classList.contains('hide')});
      var idx = visible.indexOf(p);
      openLb(idx >= 0 ? idx : 0);
    });
  });
  lbClose.addEventListener('click', closeLb);
  lbPrev.addEventListener('click', function(){ navLb(-1); });
  lbNext.addEventListener('click', function(){ navLb(1); });
  lb.addEventListener('click', function(e){ if(e.target === lb) closeLb(); });
  document.addEventListener('keydown', function(e){
    if(!lb.classList.contains('is-active')) return;
    if(e.key === 'Escape') closeLb();
    if(e.key === 'ArrowLeft') navLb(-1);
    if(e.key === 'ArrowRight') navLb(1);
  });

  /* ------- contact form (mailto) ------- */
  var form = document.getElementById('contactForm');
  var msg = document.getElementById('formMsg');
  function sanitize(s){return (s||'').toString().replace(/[<>]/g,'').replace(/javascript:/gi,'').replace(/on\w+=/gi,'').trim();}
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var hp = form.querySelector('input[name="website"]');
      if(hp && hp.value !== ''){return false;}
      var n = sanitize(document.getElementById('name').value);
      var em = sanitize(document.getElementById('email').value);
      var m = sanitize(document.getElementById('message').value);
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)){msg.textContent='× Invalid email.';msg.style.color='var(--vermillion)';return;}
      if(!/^[A-Za-z\s\-']{2,100}$/.test(n)){msg.textContent='× Invalid name.';msg.style.color='var(--vermillion)';return;}
      if(m.length < 10 || m.length > 2000){msg.textContent='× Message 10–2000 chars.';msg.style.color='var(--vermillion)';return;}
      var subject = encodeURIComponent('Portfolio contact — ' + n);
      var body = encodeURIComponent('From: ' + n + '\nEmail: ' + em + '\n\n' + m);
      var to = atob('YW5tb2xiYWtzaGkyNEBnbWFpbC5jb20=');
      window.location.href = 'mailto:' + to + '?subject=' + subject + '&body=' + body;
      msg.textContent = '· Opening your mail client…';
      msg.style.color = 'var(--ink-2)';
    });
  }

  /* ------- theme toggle ------- */
  var themeBtn = document.getElementById('theme-toggle');
  if(themeBtn){
    var setTheme = function(t){
      document.documentElement.setAttribute('data-theme', t);
      try{ localStorage.setItem('theme', t); }catch(e){}
      themeBtn.setAttribute('aria-pressed', t === 'dark');
      themeBtn.setAttribute('title', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    };
    themeBtn.addEventListener('click', function(){
      var current = document.documentElement.getAttribute('data-theme') || 'light';
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
    setTheme(document.documentElement.getAttribute('data-theme') || 'light');

    /* Sync with OS preference if user hasn't explicitly chosen */
    if(window.matchMedia){
      var mq = window.matchMedia('(prefers-color-scheme: dark)');
      var listener = function(e){
        try{ if(localStorage.getItem('theme')) return; }catch(_){}
        setTheme(e.matches ? 'dark' : 'light');
      };
      if(mq.addEventListener) mq.addEventListener('change', listener);
      else if(mq.addListener) mq.addListener(listener);
    }
  }

  /* ------- email obfuscation: bind on demand, no plaintext in HTML ------- */
  document.querySelectorAll('[data-mail]').forEach(function(a){
    var addr = atob(a.getAttribute('data-mail'));
    a.setAttribute('href', 'mailto:' + addr);
    var t = a.querySelector('[data-mail-text]');
    if(t) t.textContent = addr;
    a.removeAttribute('data-mail');
  });
})();
