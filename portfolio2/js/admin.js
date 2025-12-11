// Admin JS: basic CRUD using localStorage
(function(){
  const KEY = 'portfolioData';

  function loadLocal(){
    console.log('Loading from localStorage');
    const raw = localStorage.getItem(KEY);
    if(!raw){
      console.log('No data in localStorage, using defaults');
      localStorage.setItem(KEY, JSON.stringify(window.DEFAULT_PORTFOLIO_DATA));
      return structuredClone(window.DEFAULT_PORTFOLIO_DATA);
    }
    try{ 
      const parsed = JSON.parse(raw);
      console.log('Loaded from localStorage');
      return parsed;
    }catch(e){ 
      console.error('Error parsing localStorage:', e);
      return structuredClone(window.DEFAULT_PORTFOLIO_DATA);
    }
  }

  function save(data){
    console.log('Saving to localStorage');
    localStorage.setItem(KEY, JSON.stringify(data));
    renderControls();
    alert('Saved ✓');
  }

  function el(id){ return document.getElementById(id); }

  // About
  function setupAbout(data){
    el('about_name').value = data.about.name || '';
    el('about_title').value = data.about.title || '';
    el('about_bio').value = data.about.bio || '';
    el('previewPic').src = data.about.profilePic || 'assets/profile.svg';
  }

  function bindAbout(){
    el('profileUpload').addEventListener('change', e=>{
      const f = e.target.files[0];
      if(!f) return;
      const reader = new FileReader();
      reader.onload = ()=>{ el('previewPic').src = reader.result; };
      reader.readAsDataURL(f);
    });

    el('saveAbout').addEventListener('click', ()=>{
      const data = loadLocal();
      data.about.name = el('about_name').value;
      data.about.title = el('about_title').value;
      data.about.bio = el('about_bio').value;
      if(el('previewPic').src) data.about.profilePic = el('previewPic').src;
      save(data);
    });
  }

  // Experience controls
  function renderArrayControls(containerId, arr, onAdd, itemRenderer){
    const container = el(containerId);
    container.innerHTML = '';
    (arr||[]).forEach((it, idx)=>{
      const wrap = document.createElement('div'); wrap.className='p-2 border rounded flex gap-2 items-start';
      wrap.innerHTML = `<div class="flex-1">
        <input class="input mb-1" data-idx="${idx}" data-field="title" value="${htmlEscape(it.title||it.role||'') || ''}" />
        <input class="input mb-1" data-idx="${idx}" data-field="company" value="${htmlEscape(it.company||'') || ''}" />
        <textarea class="input mb-1" data-idx="${idx}" data-field="description">${htmlEscape(it.description||'')}</textarea>
        <input class="input mb-1" data-idx="${idx}" data-field="date" value="${htmlEscape(it.date||'')||''}" />
      </div>
      <div class="flex flex-col gap-2">
        <button class="btn-outline btn-edit" data-idx="${idx}">Update</button>
        <button class="btn-outline btn-del" data-idx="${idx}">Delete</button>
      </div>`;

      container.appendChild(wrap);
    });

    // add handlers
    container.querySelectorAll('.btn-del').forEach(btn=>{
      btn.addEventListener('click', e=>{
        const idx = Number(btn.dataset.idx);
        const data = loadLocal(); data[containerId.replace('Controls','')] = data[containerId.replace('Controls','')] || [];
        data[containerId.replace('Controls','')].splice(idx,1);
        save(data);
      });
    });

    container.querySelectorAll('.btn-edit').forEach(btn=>{
      btn.addEventListener('click', e=>{
        const idx = Number(btn.dataset.idx);
        const data = loadLocal();
        const arrName = containerId.replace('Controls','');
        const base = data[arrName][idx];
        // pull values
        const inputs = container.querySelectorAll(`[data-idx="${idx}"]`);
        inputs.forEach(inp=>{
          const f = inp.dataset.field; base[f] = inp.value;
        });
        save(data);
      });
    });
  }

  function htmlEscape(s){ return (s||'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;'); }

  function initExperience(data){
    renderArrayControls('experienceControls', data.experience||[]);
    el('addExperience').onclick = ()=>{
      const data = loadLocal(); data.experience = data.experience||[];
      data.experience.unshift({title:'New Role', company:'Company', date:'', description:''});
      save(data);
    };
  }

  function initProjects(data){
    renderArrayControls('projectsControls', data.projects||[]);
    el('addProject').onclick = ()=>{
      const data = loadLocal(); data.projects = data.projects||[];
      data.projects.unshift({title:'New Project', description:'', link:'#', id:Date.now()});
      save(data);
    };
  }

  function initCertifications(data){
    renderArrayControls('certificationsControls', data.certifications||[]);
    el('addCertification').onclick = ()=>{
      const data = loadLocal(); data.certifications = data.certifications||[];
      data.certifications.unshift({id:Date.now(), name:'New Certification'});
      save(data);
    };
  }

  function initSkills(data){
    el('skillsInput').value = (data.skills||[]).join(', ');
    el('saveSkills').onclick = ()=>{
      const data = loadLocal();
      data.skills = el('skillsInput').value.split(',').map(s=>s.trim()).filter(Boolean);
      save(data);
    };
  }

  function initSocials(data){
    el('social_linkedin').value = data.socials.linkedin||'';
    el('social_github').value = data.socials.github||'';
    el('social_instagram').value = data.socials.instagram||'';
    el('social_twitter').value = data.socials.twitter||'';
    el('saveSocials').onclick = ()=>{
      const data = loadLocal(); data.socials = data.socials||{};
      data.socials.linkedin = el('social_linkedin').value;
      data.socials.github = el('social_github').value;
      data.socials.instagram = el('social_instagram').value;
      data.socials.twitter = el('social_twitter').value;
      save(data);
    };
  }

  function renderControls(){
    try {
      console.log('renderControls called');
      const data = loadLocal();
      console.log('Data loaded:', data ? 'success' : 'null');
      if (!data) {
        console.error('No data loaded, using defaults');
        return;
      }
      setupAbout(data);
      initExperience(data);
      initProjects(data);
      initCertifications(data);
      initSkills(data);
      initSocials(data);
      console.log('renderControls finished');
    } catch (err) {
      console.error('renderControls error:', err);
    }
  }

  // boot
  document.addEventListener('DOMContentLoaded', ()=>{
    try {
      console.log('Admin panel initializing...');
      renderControls();
      bindAbout();
      console.log('Admin panel initialized');
    } catch (err) {
      console.error('Admin initialization error:', err);
    }
  });

})();
