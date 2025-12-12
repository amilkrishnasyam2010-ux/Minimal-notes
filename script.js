// ============================================
// CONFIGURATION
// ============================================

const SUBJECTS = [
  { id: 'Maths', name: 'Maths', chapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] },
  { id: 'Physics', name: 'Physics', chapters: [1, 2, 3, 4, 5, 6, 7] },
  { id: 'Chemistry', name: 'Chemistry', chapters: [1, 2, 3, 4, 5, 6, 7] },
  { id: 'Biology', name: 'Biology', chapters: [1, 2, 3, 4, 5, 6] },
  { id: 'Geography', name: 'Geography', chapters: [1, 2, 3, 4, 5, 6, 7, 8] },
  { id: 'History', name: 'History', chapters: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
  { id: 'SocialScience2', name: 'Social Science 2', chapters: [1, 2, 3, 4, 5, 6, 7, 8] }
];

const FREE_RESOURCES = ['Maths_6_QB', 'Maths_7_QB', 'Physics_5_QB', 'History_4_QB'];

const RESOURCE_TYPES = {
  notes: { suffix: '', name: 'Notes' },
  questions: { suffix: '_QB', name: 'Question Bank' },
  oneword: { suffix: '_OW', name: 'One Word' }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

function generateAccessCode(fileKey) {
  // Generate unique hash-based access code for each file
  let hash = 0;
  for (let i = 0; i < fileKey.length; i++) {
    const char = fileKey.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Convert to base36 and take first 5 characters
  const code = Math.abs(hash).toString(36).toUpperCase().substring(0, 5);
  return 'MN' + code.padEnd(5, '0');
}

function validateAccessCode(fileKey, inputCode) {
  if (isFreeResource(fileKey)) {
    return true;
  }
  const expectedCode = generateAccessCode(fileKey);
  console.log(`Expected access code for ${fileKey}: ${expectedCode}`);
  return inputCode.toUpperCase() === expectedCode.toUpperCase();
}

function isFreeResource(fileKey) {
  return FREE_RESOURCES.includes(fileKey);
}

function getFileKey(subject, chapter, resourceType) {
  const suffix = RESOURCE_TYPES[resourceType].suffix;
  return `${subject}_${chapter}${suffix}`;
}

function getPdfPath(fileKey) {
  return `pdfs/${fileKey}.pdf`;
}

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  
  setTimeout(() => {
    toast.className = 'toast';
  }, 3000);
}

// ============================================
// STORAGE FUNCTIONS
// ============================================

function getUsers() {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : {};
}

function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

function getCurrentUser() {
  return localStorage.getItem('currentUser');
}

function setCurrentUser(username) {
  localStorage.setItem('currentUser', username);
}

function clearCurrentUser() {
  localStorage.removeItem('currentUser');
}

function createUser(username, password) {
  const users = getUsers();
  if (users[username]) {
    return false;
  }
  users[username] = {
    password: password,
    downloads: []
  };
  saveUsers(users);
  return true;
}

function validateLogin(username, password) {
  const users = getUsers();
  const user = users[username];
  return user && user.password === password;
}

function updatePassword(username, newPassword) {
  const users = getUsers();
  if (!users[username]) {
    return false;
  }
  users[username].password = newPassword;
  saveUsers(users);
  return true;
}

function addDownload(fileKey) {
  const username = getCurrentUser();
  if (!username) return;
  
  const users = getUsers();
  const user = users[username];
  if (!user) return;
  
  const download = {
    fileKey: fileKey,
    date: new Date().toISOString()
  };
  
  if (!user.downloads) {
    user.downloads = [];
  }
  
  user.downloads.unshift(download);
  saveUsers(users);
}

function getDownloads() {
  const username = getCurrentUser();
  if (!username) return [];
  
  const users = getUsers();
  const user = users[username];
  return user && user.downloads ? user.downloads : [];
}

// ============================================
// AUTH FUNCTIONS
// ============================================

function checkAuth() {
  const currentUser = getCurrentUser();
  const currentPage = window.location.pathname.split('/').pop();
  
  if (!currentUser && currentPage !== 'index.html' && currentPage !== '') {
    window.location.href = 'index.html';
    return false;
  }
  
  if (currentUser && (currentPage === 'index.html' || currentPage === '')) {
    window.location.href = 'dashboard.html';
    return false;
  }
  
  return true;
}

function logout() {
  clearCurrentUser();
  window.location.href = 'index.html';
}

// ============================================
// MODAL FUNCTIONS
// ============================================

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('show');
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('show');
  }
}

function setupModalCloseButtons() {
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-modal');
      closeModal(modalId);
    });
  });
  
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('show');
      }
    });
  });
}

// ============================================
// INDEX PAGE
// ============================================

function initIndexPage() {
  // Account dropdown
  const accountBtn = document.getElementById('accountBtn');
  const accountMenu = document.getElementById('accountMenu');
  
  if (accountBtn && accountMenu) {
    accountBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      accountMenu.classList.toggle('show');
    });
    
    document.addEventListener('click', () => {
      accountMenu.classList.remove('show');
    });
  }
  
  // Login button
  const loginBtn = document.getElementById('loginBtn');
  const getStartedBtn = document.getElementById('getStartedBtn');
  
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      openModal('loginModal');
    });
  }
  
  if (getStartedBtn) {
    getStartedBtn.addEventListener('click', () => {
      openModal('loginModal');
    });
  }
  
  // Signup button
  const signupBtn = document.getElementById('signupBtn');
  const createAccountBtn = document.getElementById('createAccountBtn');
  
  if (signupBtn) {
    signupBtn.addEventListener('click', () => {
      openModal('signupModal');
    });
  }
  
  if (createAccountBtn) {
    createAccountBtn.addEventListener('click', () => {
      openModal('signupModal');
    });
  }
  
  // Switch between login and signup
  const switchToSignup = document.getElementById('switchToSignup');
  const switchToLogin = document.getElementById('switchToLogin');
  
  if (switchToSignup) {
    switchToSignup.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal('loginModal');
      openModal('signupModal');
    });
  }
  
  if (switchToLogin) {
    switchToLogin.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal('signupModal');
      openModal('loginModal');
    });
  }
  
  // Show change password
  const showChangePassword = document.getElementById('showChangePassword');
  if (showChangePassword) {
    showChangePassword.addEventListener('click', () => {
      closeModal('loginModal');
      openModal('changePasswordModal');
    });
  }
  
  // Login form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('loginUsername').value;
      const password = document.getElementById('loginPassword').value;
      
      if (validateLogin(username, password)) {
        setCurrentUser(username);
        showToast('Login successful!', 'success');
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 500);
      } else {
        showToast('Invalid username or password', 'error');
      }
    });
  }
  
  // Signup form
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('signupUsername').value;
      const password = document.getElementById('signupPassword').value;
      const confirmPassword = document.getElementById('signupConfirmPassword').value;
      
      if (username.length < 3) {
        showToast('Username must be at least 3 characters', 'error');
        return;
      }
      
      if (password.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
      }
      
      if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
      }
      
      if (createUser(username, password)) {
        showToast('Account created successfully! You can now login.', 'success');
        closeModal('signupModal');
        setTimeout(() => {
          openModal('loginModal');
        }, 500);
      } else {
        showToast('Username already exists', 'error');
      }
    });
  }
  
  // Change password form
  const changePasswordForm = document.getElementById('changePasswordForm');
  if (changePasswordForm) {
    changePasswordForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const currentPassword = document.getElementById('currentPassword').value;
      const newPassword = document.getElementById('newPassword').value;
      const confirmNewPassword = document.getElementById('confirmNewPassword').value;
      
      const username = document.getElementById('loginUsername').value;
      
      if (!username) {
        showToast('Please enter your username in the login form first', 'error');
        closeModal('changePasswordModal');
        openModal('loginModal');
        return;
      }
      
      const users = getUsers();
      const user = users[username];
      
      if (!user) {
        showToast('User not found', 'error');
        return;
      }
      
      if (user.password !== currentPassword) {
        showToast('Current password is incorrect', 'error');
        return;
      }
      
      if (newPassword.length < 6) {
        showToast('New password must be at least 6 characters', 'error');
        return;
      }
      
      if (newPassword !== confirmNewPassword) {
        showToast('New passwords do not match', 'error');
        return;
      }
      
      if (updatePassword(username, newPassword)) {
        showToast('Password changed successfully!', 'success');
        closeModal('changePasswordModal');
        setTimeout(() => {
          openModal('loginModal');
        }, 500);
      } else {
        showToast('Failed to change password', 'error');
      }
    });
  }
}

// ============================================
// DASHBOARD PAGE
// ============================================

function initDashboardPage() {
  const username = getCurrentUser();
  const usernameDisplay = document.getElementById('usernameDisplay');
  
  if (usernameDisplay) {
    usernameDisplay.textContent = username;
  }
  
  // Display download history
  const downloadHistory = document.getElementById('downloadHistory');
  if (downloadHistory) {
    const downloads = getDownloads();
    
    if (downloads.length === 0) {
      downloadHistory.innerHTML = '<p class="empty-state">No downloads yet. Start exploring resources!</p>';
    } else {
      downloadHistory.innerHTML = downloads.map(download => {
        const date = new Date(download.date);
        const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        return `
          <div class="history-item">
            <span class="history-item-name">${download.fileKey}</span>
            <span class="history-item-date">${formattedDate}</span>
          </div>
        `;
      }).join('');
    }
  }
  
  // Logout button
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }
}

// ============================================
// RESOURCE PAGES (Notes, Questions, OneWord)
// ============================================

let currentSubject = null;
let currentChapter = null;
let currentFileKey = null;

function initResourcePage() {
  const resourceType = window.currentResourceType;
  
  if (!resourceType) {
    console.error('Resource type not defined');
    return;
  }
  
  renderSubjects();
  
  // Back to subjects button
  const backToSubjects = document.getElementById('backToSubjects');
  if (backToSubjects) {
    backToSubjects.addEventListener('click', () => {
      showSubjectSection();
    });
  }
  
  // Close PDF button
  const closePdfBtn = document.getElementById('closePdfBtn');
  if (closePdfBtn) {
    closePdfBtn.addEventListener('click', () => {
      showChapterSection();
    });
  }
  
  // Download PDF button
  const downloadPdfBtn = document.getElementById('downloadPdfBtn');
  if (downloadPdfBtn) {
    downloadPdfBtn.addEventListener('click', () => {
      if (currentFileKey) {
        downloadPdf(currentFileKey);
      }
    });
  }
  
  // Access code form
  const accessCodeForm = document.getElementById('accessCodeForm');
  if (accessCodeForm) {
    accessCodeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const inputCode = document.getElementById('accessCodeInput').value;
      
      if (validateAccessCode(currentFileKey, inputCode)) {
        closeModal('accessCodeModal');
        showPdf(currentFileKey);
        document.getElementById('accessCodeInput').value = '';
      } else {
        showToast('Invalid access code', 'error');
      }
    });
  }
  
  // Logout button
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }
}

function renderSubjects() {
  const subjectButtons = document.getElementById('subjectButtons');
  if (!subjectButtons) return;
  
  subjectButtons.innerHTML = SUBJECTS.map(subject => {
    return `<button class="subject-btn" data-subject="${subject.id}">${subject.name}</button>`;
  }).join('');
  
  subjectButtons.querySelectorAll('.subject-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const subjectId = btn.getAttribute('data-subject');
      selectSubject(subjectId);
    });
  });
}

function selectSubject(subjectId) {
  currentSubject = SUBJECTS.find(s => s.id === subjectId);
  if (!currentSubject) return;
  
  renderChapters();
  showChapterSection();
}

function renderChapters() {
  const chapterButtons = document.getElementById('chapterButtons');
  if (!chapterButtons || !currentSubject) return;
  
  const resourceType = window.currentResourceType;
  
  chapterButtons.innerHTML = currentSubject.chapters.map(chapter => {
    const fileKey = getFileKey(currentSubject.id, chapter, resourceType);
    const isFree = isFreeResource(fileKey);
    const freeClass = isFree ? 'free' : '';
    const freeBadge = isFree ? '<span class="free-badge">FREE</span>' : '';
    
    return `<button class="chapter-btn ${freeClass}" data-chapter="${chapter}">Chapter ${chapter}${freeBadge}</button>`;
  }).join('');
  
  chapterButtons.querySelectorAll('.chapter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const chapter = parseInt(btn.getAttribute('data-chapter'));
      selectChapter(chapter);
    });
  });
}

function selectChapter(chapter) {
  currentChapter = chapter;
  const resourceType = window.currentResourceType;
  currentFileKey = getFileKey(currentSubject.id, chapter, resourceType);
  
  if (isFreeResource(currentFileKey)) {
    showPdf(currentFileKey);
  } else {
    openModal('accessCodeModal');
  }
}

function showPdf(fileKey) {
  const pdfPath = getPdfPath(fileKey);
  const pdfViewer = document.getElementById('pdfViewer');
  const pdfTitle = document.getElementById('pdfTitle');
  
  if (pdfViewer) {
    pdfViewer.src = pdfPath;
  }
  
  if (pdfTitle) {
    pdfTitle.textContent = fileKey.replace(/_/g, ' ');
  }
  
  showPdfSection();
}

function downloadPdf(fileKey) {
  const pdfPath = getPdfPath(fileKey);
  const link = document.createElement('a');
  link.href = pdfPath;
  link.download = `${fileKey}.pdf`;
  link.click();
  
  addDownload(fileKey);
  showToast('Download started! Check your downloads folder.', 'success');
}

function showSubjectSection() {
  document.getElementById('subjectSection').style.display = 'block';
  document.getElementById('chapterSection').style.display = 'none';
  document.getElementById('pdfSection').style.display = 'none';
  currentSubject = null;
  currentChapter = null;
  currentFileKey = null;
}

function showChapterSection() {
  document.getElementById('subjectSection').style.display = 'none';
  document.getElementById('chapterSection').style.display = 'block';
  document.getElementById('pdfSection').style.display = 'none';
  currentChapter = null;
  currentFileKey = null;
}

function showPdfSection() {
  document.getElementById('subjectSection').style.display = 'none';
  document.getElementById('chapterSection').style.display = 'none';
  document.getElementById('pdfSection').style.display = 'block';
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  setupModalCloseButtons();
  
  const currentPage = window.location.pathname.split('/').pop();
  
  if (currentPage === 'index.html' || currentPage === '') {
    initIndexPage();
  } else if (currentPage === 'dashboard.html') {
    initDashboardPage();
  } else if (currentPage === 'notes.html' || currentPage === 'questions.html' || currentPage === 'oneword.html') {
    initResourcePage();
  }
});
