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
      a.className = 'text-sm text-gray-600 hover:text-indigo-600';
      a.textContent = k;
      socialLinks.appendChild(a);
    });

    // experience
    const expList = el('experienceList'); expList.innerHTML = '';
    (data.experience||[]).forEach(item=>{
      const d = document.createElement('div');
      d.className = 'p-3 border rounded';
      d.innerHTML = `<div class="font-semibold">${item.role||item.title||'Role'}</div><div class="text-sm text-gray-600">${item.company||''} • ${item.date||''}</div><p class="mt-2 text-sm">${item.description||''}</p>`;
      expList.appendChild(d);
    });

    // projects
    const projectsList = el('projectsList'); projectsList.innerHTML = '';
    (data.projects||[]).forEach(p=>{
      const card = document.createElement('div');
      card.className = 'p-4 border rounded bg-white';
      card.innerHTML = `<div class="font-semibold">${p.title}</div><div class="text-sm text-gray-700 mt-2">${p.description||''}</div><div class="mt-3"><a href="${p.link||'#'}" class="text-indigo-600 underline" target="_blank">View</a></div>`;
      projectsList.appendChild(card);
    });

    // skills
    const skillsList = el('skillsList'); skillsList.innerHTML = '';
    (data.skills||[]).forEach(s=>{
      const span = document.createElement('span');
      span.className = 'px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm';
      span.textContent = s;
      skillsList.appendChild(span);
    });

    // certifications
    const certList = el('certificationsList'); certList.innerHTML = '';
    (data.certifications||[]).forEach(c=>{
      const li = document.createElement('li'); li.textContent = c.name||c;
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
