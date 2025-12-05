// admin.js — Backend API version for portfolio management

const API_BASE = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api/portfolio'
  : 'https://portfolio-backend-roql.onrender.com/api/portfolio'; // Render backend URL

let currentData = {};

document.addEventListener('DOMContentLoaded', function () {
  // ---------- Authentication check ----------
  const isAuth = localStorage.getItem('adminAuth') === 'true';
  if (!isAuth) {
    window.location.href = 'login.html';
    return;
  }

  // Load all data from backend on page load
  loadAllData();

  // Tab switching
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const tabName = this.getAttribute('data-tab');
      tabContents.forEach(tab => tab.classList.add('hidden'));
      document.getElementById(tabName).classList.remove('hidden');
      tabBtns.forEach(b => b.classList.remove('bg-indigo-600'));
      this.classList.add('bg-indigo-600');
    });
  });

  // Photo upload listener
  const photoUpload = document.getElementById('photoUpload');
  if (photoUpload) {
    photoUpload.addEventListener('change', function (e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
          const base64 = event.target.result;
          const preview = document.getElementById('photoPreview');
          preview.innerHTML = `<img src="${base64}" alt="Preview" class="w-32 h-32 rounded object-cover border border-gray-700" />`;
          window.photoData = base64;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Resume PDF upload listener
  const resumeUpload = document.getElementById('resumePdfUpload');
  if (resumeUpload) {
    resumeUpload.addEventListener('change', function (e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
          const base64 = event.target.result;
          const preview = document.getElementById('resumePdfPreview');
          preview.innerHTML = `<div class="text-sm">Uploaded: ${file.name} (${Math.round(file.size/1024)} KB)</div>`;
          window.resumePdfData = base64;
          window.resumePdfName = file.name;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Highlight first tab
  if (tabBtns.length > 0) tabBtns[0].click();
});

// ============ FETCH ALL DATA FROM BACKEND ============
async function loadAllData() {
  try {
    const response = await fetch(API_BASE);
    if (!response.ok) throw new Error('Failed to fetch data');
    currentData = await response.json();
    
    loadAbout();
    loadResume();
    loadSocial();
    loadSettings();
    renderEducationList();
    renderExperienceList();
    renderProjectsList();
    refreshDataPreview();
  } catch (error) {
    console.error('Error loading data:', error);
    console.warn('Backend not connected. Using localStorage fallback.');
    // Fallback to localStorage
    loadAboutLocal();
    loadResumeLocal();
    loadSocialLocal();
    loadSettingsLocal();
    renderEducationListLocal();
    renderExperienceListLocal();
    renderProjectsListLocal();
  }
}

// ============ ABOUT ME ============
async function saveAbout() {
  const data = {
    fullName: document.getElementById('fullName').value,
    title: document.getElementById('title').value,
    bio: document.getElementById('bio').value,
    location: document.getElementById('location').value,
    photo: window.photoData || currentData.aboutData?.photo || null,
  };

  try {
    const response = await fetch(`${API_BASE}/about`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to save');
    alert('✅ About Me saved to backend!');
    currentData.aboutData = data;
    refreshDataPreview();
  } catch (error) {
    console.error('Error saving about:', error);
    // Fallback to localStorage
    localStorage.setItem('aboutData', JSON.stringify(data));
    alert('⚠️ Saved to browser storage (backend unavailable)');
    currentData.aboutData = data;
  }
}

function loadAbout() {
  const data = currentData.aboutData || {};
  if (data.fullName) document.getElementById('fullName').value = data.fullName;
  if (data.title) document.getElementById('title').value = data.title;
  if (data.bio) document.getElementById('bio').value = data.bio;
  if (data.location) document.getElementById('location').value = data.location;
  if (data.photo) {
    const preview = document.getElementById('photoPreview');
    preview.innerHTML = `<img src="${data.photo}" alt="Profile" class="w-32 h-32 rounded object-cover border border-gray-700" />`;
  }
}

function loadAboutLocal() {
  const data = JSON.parse(localStorage.getItem('aboutData') || '{}');
  currentData.aboutData = data;
  loadAbout();
}

// ============ EDUCATION ============
async function addEducation() {
  const degree = document.getElementById('eduDegree').value.trim();
  const institution = document.getElementById('eduInstitution').value.trim();
  const year = document.getElementById('eduYear').value.trim();
  const details = document.getElementById('eduDetails').value.trim();

  if (!degree || !institution) {
    alert('Please fill in degree and institution');
    return;
  }

  const newEntry = { degree, institution, year, details };
  const educations = [...(currentData.educations || []), newEntry];

  try {
    const response = await fetch(`${API_BASE}/education`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(educations)
    });
    if (!response.ok) throw new Error('Failed to save');
    currentData.educations = educations;
    document.getElementById('eduDegree').value = '';
    document.getElementById('eduInstitution').value = '';
    document.getElementById('eduYear').value = '';
    document.getElementById('eduDetails').value = '';
    renderEducationList();
    refreshDataPreview();
    alert('✅ Education added!');
  } catch (error) {
    console.error('Error adding education:', error);
    localStorage.setItem('educations', JSON.stringify(educations));
    alert('⚠️ Saved to browser (backend unavailable)');
    currentData.educations = educations;
    renderEducationList();
  }
}

function deleteEducation(index) {
  if (confirm('Delete this education entry?')) {
    const educations = (currentData.educations || []).filter((_, i) => i !== index);
    currentData.educations = educations;
    
    fetch(`${API_BASE}/education`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(educations)
    }).catch(() => {
      localStorage.setItem('educations', JSON.stringify(educations));
    });
    
    renderEducationList();
    refreshDataPreview();
  }
}

function renderEducationList() {
  const educations = currentData.educations || [];
  const list = document.getElementById('educationList');
  list.innerHTML = '';

  educations.forEach((edu, idx) => {
    const div = document.createElement('div');
    div.className = 'entry-item p-3 bg-gray-800 rounded border border-gray-700';
    div.innerHTML = `
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <h4 class="font-semibold text-indigo-400">${edu.degree}</h4>
          <p class="text-sm text-gray-400">${edu.institution}</p>
          <p class="text-xs text-gray-500">${edu.year}</p>
          <p class="text-sm text-gray-300 mt-1">${edu.details}</p>
        </div>
        <button onclick="deleteEducation(${idx})" class="px-2 py-1 bg-red-600 rounded text-xs hover:bg-red-500">Delete</button>
      </div>
    `;
    list.appendChild(div);
  });
}

function renderEducationListLocal() {
  const educations = JSON.parse(localStorage.getItem('educations') || '[]');
  currentData.educations = educations;
  renderEducationList();
}

// ============ EXPERIENCE ============
async function addExperience() {
  const title = document.getElementById('expTitle').value.trim();
  const company = document.getElementById('expCompany').value.trim();
  const duration = document.getElementById('expDuration').value.trim();
  const description = document.getElementById('expDescription').value.trim();

  if (!title || !company) {
    alert('Please fill in job title and company');
    return;
  }

  const newEntry = { title, company, duration, description };
  const experiences = [...(currentData.experiences || []), newEntry];

  try {
    const response = await fetch(`${API_BASE}/experience`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(experiences)
    });
    if (!response.ok) throw new Error('Failed to save');
    currentData.experiences = experiences;
    document.getElementById('expTitle').value = '';
    document.getElementById('expCompany').value = '';
    document.getElementById('expDuration').value = '';
    document.getElementById('expDescription').value = '';
    renderExperienceList();
    refreshDataPreview();
    alert('✅ Experience added!');
  } catch (error) {
    console.error('Error adding experience:', error);
    localStorage.setItem('experiences', JSON.stringify(experiences));
    alert('⚠️ Saved to browser (backend unavailable)');
    currentData.experiences = experiences;
    renderExperienceList();
  }
}

function deleteExperience(index) {
  if (confirm('Delete this experience entry?')) {
    const experiences = (currentData.experiences || []).filter((_, i) => i !== index);
    currentData.experiences = experiences;
    
    fetch(`${API_BASE}/experience`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(experiences)
    }).catch(() => {
      localStorage.setItem('experiences', JSON.stringify(experiences));
    });
    
    renderExperienceList();
    refreshDataPreview();
  }
}

function renderExperienceList() {
  const experiences = currentData.experiences || [];
  const list = document.getElementById('experienceList');
  list.innerHTML = '';

  experiences.forEach((exp, idx) => {
    const div = document.createElement('div');
    div.className = 'entry-item p-3 bg-gray-800 rounded border border-gray-700';
    div.innerHTML = `
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <h4 class="font-semibold text-indigo-400">${exp.title}</h4>
          <p class="text-sm text-gray-400">${exp.company}</p>
          <p class="text-xs text-gray-500">${exp.duration}</p>
          <p class="text-sm text-gray-300 mt-1">${exp.description}</p>
        </div>
        <button onclick="deleteExperience(${idx})" class="px-2 py-1 bg-red-600 rounded text-xs hover:bg-red-500">Delete</button>
      </div>
    `;
    list.appendChild(div);
  });
}

function renderExperienceListLocal() {
  const experiences = JSON.parse(localStorage.getItem('experiences') || '[]');
  currentData.experiences = experiences;
  renderExperienceList();
}

// ============ PROJECTS ============
async function addProject() {
  const name = document.getElementById('projName').value.trim();
  const description = document.getElementById('projDescription').value.trim();
  const live = document.getElementById('projLive').value.trim();
  const github = document.getElementById('projGithub').value.trim();

  if (!name || !description) {
    alert('Please fill in project name and description');
    return;
  }

  const newEntry = { name, description, live, github };
  const projects = [...(currentData.projects || []), newEntry];

  try {
    const response = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projects)
    });
    if (!response.ok) throw new Error('Failed to save');
    currentData.projects = projects;
    document.getElementById('projName').value = '';
    document.getElementById('projDescription').value = '';
    document.getElementById('projLive').value = '';
    document.getElementById('projGithub').value = '';
    renderProjectsList();
    refreshDataPreview();
    alert('✅ Project added!');
  } catch (error) {
    console.error('Error adding project:', error);
    localStorage.setItem('projects', JSON.stringify(projects));
    alert('⚠️ Saved to browser (backend unavailable)');
    currentData.projects = projects;
    renderProjectsList();
  }
}

function deleteProject(index) {
  if (confirm('Delete this project?')) {
    const projects = (currentData.projects || []).filter((_, i) => i !== index);
    currentData.projects = projects;
    
    fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projects)
    }).catch(() => {
      localStorage.setItem('projects', JSON.stringify(projects));
    });
    
    renderProjectsList();
    refreshDataPreview();
  }
}

function renderProjectsList() {
  const projects = currentData.projects || [];
  const list = document.getElementById('projectsList');
  list.innerHTML = '';

  projects.forEach((proj, idx) => {
    const div = document.createElement('div');
    div.className = 'entry-item p-3 bg-gray-800 rounded border border-gray-700';
    div.innerHTML = `
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <h4 class="font-semibold text-indigo-400">${proj.name}</h4>
          <p class="text-sm text-gray-300 mt-1">${proj.description}</p>
          <div class="text-xs text-gray-500 mt-1 space-y-1">
            ${proj.live ? `<p>Live: <a href="${proj.live}" target="_blank" class="text-blue-400 hover:underline">${proj.live}</a></p>` : ''}
            ${proj.github ? `<p>Code: <a href="${proj.github}" target="_blank" class="text-blue-400 hover:underline">${proj.github}</a></p>` : ''}
          </div>
        </div>
        <button onclick="deleteProject(${idx})" class="px-2 py-1 bg-red-600 rounded text-xs hover:bg-red-500">Delete</button>
      </div>
    `;
    list.appendChild(div);
  });
}

function renderProjectsListLocal() {
  const projects = JSON.parse(localStorage.getItem('projects') || '[]');
  currentData.projects = projects;
  renderProjectsList();
}

// ============ SOCIAL LINKS ============
async function saveSocial() {
  const data = {
    github: document.getElementById('github').value,
    linkedin: document.getElementById('linkedin').value,
    twitter: document.getElementById('twitter').value,
    instagram: document.getElementById('instagram').value,
    email: document.getElementById('email').value,
  };

  try {
    const response = await fetch(`${API_BASE}/social`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to save');
    alert('✅ Social links saved!');
    currentData.socialData = data;
    refreshDataPreview();
  } catch (error) {
    console.error('Error saving social:', error);
    localStorage.setItem('socialData', JSON.stringify(data));
    alert('⚠️ Saved to browser (backend unavailable)');
    currentData.socialData = data;
  }
}

function loadSocial() {
  const data = currentData.socialData || {};
  if (data.github) document.getElementById('github').value = data.github;
  if (data.linkedin) document.getElementById('linkedin').value = data.linkedin;
  if (data.twitter) document.getElementById('twitter').value = data.twitter;
  if (data.instagram) document.getElementById('instagram').value = data.instagram;
  if (data.email) document.getElementById('email').value = data.email;
}

function loadSocialLocal() {
  const data = JSON.parse(localStorage.getItem('socialData') || '{}');
  currentData.socialData = data;
  loadSocial();
}

// ============ SETTINGS ============
async function saveSettings() {
  const data = {
    siteTitle: document.getElementById('siteTitle').value,
    footerText: document.getElementById('footerText').value,
  };

  try {
    const response = await fetch(`${API_BASE}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to save');
    alert('✅ Settings saved!');
    currentData.siteSettings = data;
    refreshDataPreview();
  } catch (error) {
    console.error('Error saving settings:', error);
    localStorage.setItem('settingsData', JSON.stringify(data));
    alert('⚠️ Saved to browser (backend unavailable)');
    currentData.siteSettings = data;
  }
}

function loadSettings() {
  const data = currentData.siteSettings || {};
  if (data.siteTitle) document.getElementById('siteTitle').value = data.siteTitle;
  if (data.footerText) document.getElementById('footerText').value = data.footerText;
}

function loadSettingsLocal() {
  const data = JSON.parse(localStorage.getItem('settingsData') || '{}');
  currentData.siteSettings = data;
  loadSettings();
}

// ============ RESUME ============
async function saveResume() {
  const text = document.getElementById('resumeText').value || '';
  const pdf = window.resumePdfData || currentData.resumeData?.pdf || null;
  const filename = window.resumePdfName || currentData.resumeData?.filename || null;
  const data = { text, pdf, filename };

  try {
    const response = await fetch(`${API_BASE}/resume`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to save');
    alert('✅ Resume saved!');
    currentData.resumeData = data;
    refreshDataPreview();
  } catch (error) {
    console.error('Error saving resume:', error);
    localStorage.setItem('resumeData', JSON.stringify(data));
    alert('⚠️ Saved to browser (backend unavailable)');
    currentData.resumeData = data;
  }
}

function loadResume() {
  const data = currentData.resumeData || {};
  if (data.text && document.getElementById('resumeText')) document.getElementById('resumeText').value = data.text;
  if (data.pdf) {
    const preview = document.getElementById('resumePdfPreview');
    if (preview) preview.innerHTML = `<div class="text-sm">Saved PDF: ${data.filename || 'resume.pdf'}</div>`;
    window.resumePdfData = data.pdf;
    window.resumePdfName = data.filename || 'resume.pdf';
  }
}

function loadResumeLocal() {
  const data = JSON.parse(localStorage.getItem('resumeData') || '{}');
  currentData.resumeData = data;
  loadResume();
}

function clearResume() {
  if (!confirm('Clear saved resume?')) return;
  const data = { text: '', pdf: null, filename: null };
  
  fetch(`${API_BASE}/resume`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).catch(() => {
    localStorage.removeItem('resumeData');
  });
  
  if (document.getElementById('resumeText')) document.getElementById('resumeText').value = '';
  const preview = document.getElementById('resumePdfPreview');
  if (preview) preview.innerHTML = '';
  window.resumePdfData = null;
  window.resumePdfName = null;
  currentData.resumeData = {};
  refreshDataPreview();
  alert('Resume cleared');
}

// ============ UTILITIES ============
function refreshDataPreview() {
  document.getElementById('dataPreview').textContent = JSON.stringify(currentData, null, 2) || 'No data stored yet.';
}

function clearAllData() {
  if (confirm('Are you sure you want to clear all stored data? This cannot be undone.')) {
    fetch(`${API_BASE}`, { method: 'DELETE' }).catch(() => {
      localStorage.clear();
    });
    alert('All data cleared!');
    location.reload();
  }
}

function logoutAdmin() {
  localStorage.removeItem('adminAuth');
  window.location.href = 'login.html';
}
