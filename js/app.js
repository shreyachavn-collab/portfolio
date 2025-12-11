// Public renderer: loads portfolioData from localStorage (or default) and renders the page
(function(){
  const KEY = 'portfolioData';

  function loadData(){
    let raw = localStorage.getItem(KEY);
    if(!raw){
      // seed
      const data = window.DEFAULT_PORTFOLIO_DATA;
      localStorage.setItem(KEY, JSON.stringify(data));
      return data;
    }
    try{ return JSON.parse(raw); }catch(e){ return window.DEFAULT_PORTFOLIO_DATA; }
  }

  function el(id){ return document.getElementById(id); }

  function render(){
    const data = loadData();
    el('name').textContent = data.about.name;
    el('title').textContent = data.about.title;
    el('bio').textContent = data.about.bio;
    el('profilePic').src = data.about.profilePic || 'assets/profile.svg';

    // socials
    const socials = data.socials || {};
    const socialLinks = el('socialLinks');
    socialLinks.innerHTML = '';
    Object.entries(socials).forEach(([k,v])=>{
      if(!v) return;
      const a = document.createElement('a');
      a.href = v; a.target = '_blank';
      a.className = 'inline-flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg';
      a.style.background = 'rgba(99, 102, 241, 0.2)';
      a.style.color = '#6366f1';
      
      const icons = {
        'linkedin': '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M16.338 16.338H13.67V12.16c0-.995-.017-2.292-1.194-2.292-1.195 0-1.38.932-1.38 1.893v4.038h-2.568V9.309h2.461v.956h.034c.345-.62 1.187-1.28 2.443-1.28 2.608 0 3.088 1.716 3.088 3.957v4.294zM5.337 8.059a1.482 1.482 0 01-1.482-1.482 1.482 1.482 0 111.482 1.482zm1.28 7.937H4.04V9.309h2.577v6.687zM17.262 1H2.744A1.745 1.745 0 001 2.744v14.512A1.745 1.745 0 002.744 19h14.518A1.746 1.746 0 0019 16.256V2.744A1.746 1.746 0 0017.262 1z"></path></svg>',
        'github': '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.603-3.369-1.343-3.369-1.343-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.544 2.914 1.194.092-.929.35-1.544.637-1.899-2.228-.253-4.579-1.114-4.579-4.947 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.817c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.378.203 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.354 4.689-4.592 4.934.36.31.68.923.68 1.86 0 1.342-.012 2.422-.012 2.753 0 .268.18.58.688.482C17.138 18.194 20 14.44 20 10.017 20 4.484 15.522 0 10 0z" clip-rule="evenodd"></path></svg>',
        'instagram': '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-8a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0zm.5-3.5a1 1 0 11-2 0 1 1 0 012 0z"></path></svg>',
        'twitter': '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 01.75 14.658a11.616 11.616 0 006.29 1.593"></path></svg>'
      };
      
      a.innerHTML = icons[k] || k;
      a.title = k.charAt(0).toUpperCase() + k.slice(1);
      socialLinks.appendChild(a);
    });

    // experience
    const expList = el('experienceList'); expList.innerHTML = '';
    (data.experience||[]).forEach((item, idx)=>{
      const d = document.createElement('div');
      d.className = 'p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate__animated animate__fadeInUp';
      d.style.setProperty('--animate-delay', (idx * 100) + 'ms');
      d.style.background = 'linear-gradient(135deg, #0f1724 0%, #1a2332 100%)';
      d.style.border = '1px solid rgba(99, 102, 241, 0.2)';
      d.innerHTML = `<div class="flex items-start justify-between">
        <div>
          <h3 class="text-xl font-bold text-indigo-400">${item.role||item.title||'Role'}</h3>
          <p class="text-base" style="color:var(--muted)">${item.company||''} • ${item.date||''}</p>
        </div>
      </div>
      <p class="mt-3 text-base leading-relaxed">${item.description||''}</p>`;
      expList.appendChild(d);
    });

    // projects
    const projectsList = el('projectsList'); projectsList.innerHTML = '';
    (data.projects||[]).forEach((p, idx)=>{
      const card = document.createElement('div');
      card.className = 'p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate__animated animate__fadeInUp';
      card.style.setProperty('--animate-delay', (idx * 100) + 'ms');
      card.style.background = 'linear-gradient(135deg, #0f1724 0%, #1a2332 100%)';
      card.style.border = '1px solid rgba(99, 102, 241, 0.2)';
      card.innerHTML = `<h3 class="text-xl font-bold text-indigo-400 mb-2">${p.title}</h3>
      <p class="text-base leading-relaxed mb-4">${p.description||''}</p>
      <a href="${p.link||'#'}" class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-300" target="_blank">
        View Project
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
      </a>`;
      projectsList.appendChild(card);
    });

    // skills
    const skillsList = el('skillsList'); skillsList.innerHTML = '';
    (data.skills||[]).forEach((s, idx)=>{
      const span = document.createElement('span');
      span.className = 'px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 hover:shadow-lg transform hover:scale-110 animate__animated animate__fadeInUp';
      span.style.setProperty('--animate-delay', (idx * 50) + 'ms');
      span.style.background = 'linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%)';
      span.style.color = '#6366f1';
      span.style.border = '1px solid rgba(99, 102, 241, 0.4)';
      span.textContent = s;
      skillsList.appendChild(span);
    });

    // certifications
    const certList = el('certificationsList'); certList.innerHTML = '';
    (data.certifications||[]).forEach((c, idx)=>{
      const li = document.createElement('li');
      li.className = 'p-4 rounded-lg transition-all duration-300 hover:translate-x-2 animate__animated animate__fadeInUp';
      li.style.setProperty('--animate-delay', (idx * 100) + 'ms');
      li.style.background = 'rgba(99, 102, 241, 0.1)';
      li.style.borderLeft = '4px solid #6366f1';
      li.innerHTML = `<span class="text-base font-semibold" style="color: #6366f1;">✓</span> ${c.name||c}`;
      certList.appendChild(li);
    });

    // resume
    el('resumeLink').href = data.resumeUrl || 'resume.html';
  }

  // Nav behavior: smooth scroll and active tab highlighting
  function setupNav(){
    const links = Array.from(document.querySelectorAll('.nav-link'));
    const sections = links.map(l=>{
      const href = l.getAttribute('href')||'';
      if(!href.startsWith('#')) return null;
      const id = href.slice(1);
      return document.getElementById(id);
    });

    // smooth scroll on click
    links.forEach(l=>{
      l.addEventListener('click', e=>{
        const href = l.getAttribute('href');
        if(!href || !href.startsWith('#')) return;
        e.preventDefault();
        const id = href.slice(1);
        const target = document.getElementById(id);
        if(target) target.scrollIntoView({behavior:'smooth',block:'start'});
      });
    });

    // active link on scroll
    let ticking = false;
    function onScroll(){
      if(ticking) return; ticking = true;
      requestAnimationFrame(()=>{
        const offset = 120; // consider top offset
        let activeIndex = -1;
        sections.forEach((sec, i)=>{
          if(!sec) return;
          const rect = sec.getBoundingClientRect();
          if(rect.top <= offset && rect.bottom > offset){ activeIndex = i; }
        });
        links.forEach((l,i)=>{
          if(i===activeIndex) l.classList.add('active'); else l.classList.remove('active');
        });
        ticking = false;
      });
    }
    document.addEventListener('scroll', onScroll, {passive:true});
    // initialize active state
    onScroll();
  }

  document.addEventListener('DOMContentLoaded', ()=>{ render(); setupNav(); });
})();
