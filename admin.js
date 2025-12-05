// admin.js — Complete CRUD functionality for portfolio management

document.addEventListener('DOMContentLoaded', function () {
  // ---------- Authentication check ----------
  const isAuth = localStorage.getItem('adminAuth') === 'true';
  if (!isAuth) {
    // Not authenticated — redirect to login page
    window.location.href = 'login.html';
    return;
  }
  // ---------- end auth check ----------
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

  // Load all data on page load
  loadAbout();
  loadResume();
  loadSocial();
  loadSettings();
  renderEducationList();
  renderExperienceList();
  renderProjectsList();
  refreshDataPreview();

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

  // Resume PDF upload listener (separate, not nested)
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

// ============ ABOUT ME ============
function saveAbout() {
  const data = {
    fullName: document.getElementById('fullName').value,
    title: document.getElementById('title').value,
    bio: document.getElementById('bio').value,
    location: document.getElementById('location').value,
    photo: window.photoData || JSON.parse(localStorage.getItem('aboutData') || '{}').photo || null,
  };
  localStorage.setItem('aboutData', JSON.stringify(data));
  alert('About Me saved!');
  refreshDataPreview();
}

function loadAbout() {
  const data = JSON.parse(localStorage.getItem('aboutData') || '{}');
  if (data.fullName) document.getElementById('fullName').value = data.fullName;
  if (data.title) document.getElementById('title').value = data.title;
  if (data.bio) document.getElementById('bio').value = data.bio;
  if (data.location) document.getElementById('location').value = data.location;
  if (data.photo) {
    const preview = document.getElementById('photoPreview');
    preview.innerHTML = `<img src="${data.photo}" alt="Profile" class="w-32 h-32 rounded object-cover border border-gray-700" />`;
  }
}

// ============ EDUCATION (CRUD) ============
function addEducation() {
  const degree = document.getElementById('eduDegree').value.trim();
  const institution = document.getElementById('eduInstitution').value.trim();
  const year = document.getElementById('eduYear').value.trim();
  const details = document.getElementById('eduDetails').value.trim();

  if (!degree || !institution) {
    alert('Please fill in degree and institution');
    return;
  }

  const educations = JSON.parse(localStorage.getItem('educations') || '[]');
  const newEntry = {
    id: Date.now(),
    degree,
    institution,
    year,
    details,
  };
  educations.push(newEntry);
  localStorage.setItem('educations', JSON.stringify(educations));

  // Clear form
  document.getElementById('eduDegree').value = '';
  document.getElementById('eduInstitution').value = '';
  document.getElementById('eduYear').value = '';
  document.getElementById('eduDetails').value = '';

  renderEducationList();
  refreshDataPreview();
  alert('Education added!');
}

function editEducation(id) {
  const educations = JSON.parse(localStorage.getItem('educations') || '[]');
  const entry = educations.find(e => e.id === id);
  if (entry) {
    document.getElementById('eduDegree').value = entry.degree;
    document.getElementById('eduInstitution').value = entry.institution;
    document.getElementById('eduYear').value = entry.year;
    document.getElementById('eduDetails').value = entry.details;
    deleteEducation(id);
    document.getElementById('eduDegree').focus();
  }
}

function deleteEducation(id) {
  if (confirm('Delete this education entry?')) {
    let educations = JSON.parse(localStorage.getItem('educations') || '[]');
    educations = educations.filter(e => e.id !== id);
    localStorage.setItem('educations', JSON.stringify(educations));
    renderEducationList();
    refreshDataPreview();
  }
}

function renderEducationList() {
  const educations = JSON.parse(localStorage.getItem('educations') || '[]');
  const list = document.getElementById('educationList');
  list.innerHTML = '';

  educations.forEach(edu => {
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
        <div class="flex gap-2 ml-2">
          <button onclick="editEducation(${edu.id})" class="px-2 py-1 bg-blue-600 rounded text-xs hover:bg-blue-500">Edit</button>
          <button onclick="deleteEducation(${edu.id})" class="px-2 py-1 bg-red-600 rounded text-xs hover:bg-red-500">Delete</button>
        </div>
      </div>
    `;
    list.appendChild(div);
  });
}

// ============ EXPERIENCE (CRUD) ============
function addExperience() {
  const title = document.getElementById('expTitle').value.trim();
  const company = document.getElementById('expCompany').value.trim();
  const duration = document.getElementById('expDuration').value.trim();
  const description = document.getElementById('expDescription').value.trim();

  if (!title || !company) {
    alert('Please fill in job title and company');
    return;
  }

  const experiences = JSON.parse(localStorage.getItem('experiences') || '[]');
  const newEntry = {
    id: Date.now(),
    title,
    company,
    duration,
    description,
  };
  experiences.push(newEntry);
  localStorage.setItem('experiences', JSON.stringify(experiences));

  // Clear form
  document.getElementById('expTitle').value = '';
  document.getElementById('expCompany').value = '';
  document.getElementById('expDuration').value = '';
  document.getElementById('expDescription').value = '';

  renderExperienceList();
  refreshDataPreview();
  alert('Experience added!');
}

function editExperience(id) {
  const experiences = JSON.parse(localStorage.getItem('experiences') || '[]');
  const entry = experiences.find(e => e.id === id);
  if (entry) {
    document.getElementById('expTitle').value = entry.title;
    document.getElementById('expCompany').value = entry.company;
    document.getElementById('expDuration').value = entry.duration;
    document.getElementById('expDescription').value = entry.description;
    deleteExperience(id);
    document.getElementById('expTitle').focus();
  }
}

function deleteExperience(id) {
  if (confirm('Delete this experience entry?')) {
    let experiences = JSON.parse(localStorage.getItem('experiences') || '[]');
    experiences = experiences.filter(e => e.id !== id);
    localStorage.setItem('experiences', JSON.stringify(experiences));
    renderExperienceList();
    refreshDataPreview();
  }
}

function renderExperienceList() {
  const experiences = JSON.parse(localStorage.getItem('experiences') || '[]');
  const list = document.getElementById('experienceList');
  list.innerHTML = '';

  experiences.forEach(exp => {
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
        <div class="flex gap-2 ml-2">
          <button onclick="editExperience(${exp.id})" class="px-2 py-1 bg-blue-600 rounded text-xs hover:bg-blue-500">Edit</button>
          <button onclick="deleteExperience(${exp.id})" class="px-2 py-1 bg-red-600 rounded text-xs hover:bg-red-500">Delete</button>
        </div>
      </div>
    `;
    list.appendChild(div);
  });
}

// ============ PROJECTS (CRUD) ============
function addProject() {
  const name = document.getElementById('projName').value.trim();
  const description = document.getElementById('projDescription').value.trim();
  const live = document.getElementById('projLive').value.trim();
  const github = document.getElementById('projGithub').value.trim();

  if (!name || !description) {
    alert('Please fill in project name and description');
    return;
  }

  const projects = JSON.parse(localStorage.getItem('projects') || '[]');
  const newEntry = {
    id: Date.now(),
    name,
    description,
    live,
    github,
  };
  projects.push(newEntry);
  localStorage.setItem('projects', JSON.stringify(projects));

  // Clear form
  document.getElementById('projName').value = '';
  document.getElementById('projDescription').value = '';
  document.getElementById('projLive').value = '';
  document.getElementById('projGithub').value = '';

  renderProjectsList();
  refreshDataPreview();
  alert('Project added!');
}

function editProject(id) {
  const projects = JSON.parse(localStorage.getItem('projects') || '[]');
  const entry = projects.find(p => p.id === id);
  if (entry) {
    document.getElementById('projName').value = entry.name;
    document.getElementById('projDescription').value = entry.description;
    document.getElementById('projLive').value = entry.live;
    document.getElementById('projGithub').value = entry.github;
    deleteProject(id);
    document.getElementById('projName').focus();
  }
}

function deleteProject(id) {
  if (confirm('Delete this project?')) {
    let projects = JSON.parse(localStorage.getItem('projects') || '[]');
    projects = projects.filter(p => p.id !== id);
    localStorage.setItem('projects', JSON.stringify(projects));
    renderProjectsList();
    refreshDataPreview();
  }
}

function renderProjectsList() {
  const projects = JSON.parse(localStorage.getItem('projects') || '[]');
  const list = document.getElementById('projectsList');
  list.innerHTML = '';

  projects.forEach(proj => {
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
        <div class="flex gap-2 ml-2">
          <button onclick="editProject(${proj.id})" class="px-2 py-1 bg-blue-600 rounded text-xs hover:bg-blue-500">Edit</button>
          <button onclick="deleteProject(${proj.id})" class="px-2 py-1 bg-red-600 rounded text-xs hover:bg-red-500">Delete</button>
        </div>
      </div>
    `;
    list.appendChild(div);
  });
}

// ============ SOCIAL LINKS ============
function saveSocial() {
  const data = {
    github: document.getElementById('github').value,
    linkedin: document.getElementById('linkedin').value,
    twitter: document.getElementById('twitter').value,
    instagram: document.getElementById('instagram').value,
    email: document.getElementById('email').value,
  };
  localStorage.setItem('socialData', JSON.stringify(data));
  alert('Social links saved!');
  refreshDataPreview();
}

function loadSocial() {
  const data = JSON.parse(localStorage.getItem('socialData') || '{}');
  if (data.github) document.getElementById('github').value = data.github;
  if (data.linkedin) document.getElementById('linkedin').value = data.linkedin;
  if (data.twitter) document.getElementById('twitter').value = data.twitter;
  if (data.instagram) document.getElementById('instagram').value = data.instagram;
  if (data.email) document.getElementById('email').value = data.email;
}

// ============ SETTINGS ============
function saveSettings() {
  const data = {
    siteTitle: document.getElementById('siteTitle').value,
    footerText: document.getElementById('footerText').value,
  };
  localStorage.setItem('settingsData', JSON.stringify(data));
  alert('Settings saved!');
  refreshDataPreview();
}

function loadSettings() {
  const data = JSON.parse(localStorage.getItem('settingsData') || '{}');
  if (data.siteTitle) document.getElementById('siteTitle').value = data.siteTitle;
  if (data.footerText) document.getElementById('footerText').value = data.footerText;
}

// ============ RESUME ============
function saveResume() {
  const text = document.getElementById('resumeText').value || '';
  const existing = JSON.parse(localStorage.getItem('resumeData') || '{}');
  const pdf = window.resumePdfData || existing.pdf || null;
  const filename = window.resumePdfName || existing.filename || null;
  const data = { text, pdf, filename };
  localStorage.setItem('resumeData', JSON.stringify(data));
  const preview = document.getElementById('resumePdfPreview');
  if (pdf) preview.innerHTML = `<div class="text-sm">Saved PDF: ${filename}</div>`;
  alert('Resume saved!');
  refreshDataPreview();
}

function loadResume() {
  const data = JSON.parse(localStorage.getItem('resumeData') || '{}');
  if (data.text && document.getElementById('resumeText')) document.getElementById('resumeText').value = data.text;
  if (data.pdf) {
    const preview = document.getElementById('resumePdfPreview');
    if (preview) preview.innerHTML = `<div class="text-sm">Saved PDF: ${data.filename || 'resume.pdf'}</div>`;
    window.resumePdfData = data.pdf;
    window.resumePdfName = data.filename || 'resume.pdf';
  }
}

function clearResume() {
  if (!confirm('Clear saved resume?')) return;
  localStorage.removeItem('resumeData');
  if (document.getElementById('resumeText')) document.getElementById('resumeText').value = '';
  const preview = document.getElementById('resumePdfPreview');
  if (preview) preview.innerHTML = '';
  window.resumePdfData = null;
  window.resumePdfName = null;
  refreshDataPreview();
  alert('Resume cleared');
}

// ============ UTILITIES ============
function refreshDataPreview() {
  const allData = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    allData[key] = JSON.parse(localStorage.getItem(key) || '{}');
  }
  document.getElementById('dataPreview').textContent = JSON.stringify(allData, null, 2) || 'No data stored yet.';
}

function clearAllData() {
  if (confirm('Are you sure you want to clear all stored data? This cannot be undone.')) {
    localStorage.clear();
    alert('All data cleared!');
    location.reload();
  }
}

// Logout helper used by admin UI
function logoutAdmin() {
  // Remove authentication flag and redirect to login
  localStorage.removeItem('adminAuth');
  window.location.href = 'login.html';
}
