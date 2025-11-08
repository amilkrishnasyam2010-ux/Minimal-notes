// ------------------------
// MINIMAL NOTES WEBSITE
// ------------------------

window.onload = () => showMainOptions(); // ✅ Show menu when site loads

// Data for all categories and subjects
const DATA = {
  notes: {},
  questions: {},
  oneword: {}
};

// Populate subjects dynamically (same structure reused)
const subjects = {
  Physics: 7,
  Chemistry: 7,
  Biology: 6,
  History: 9,
  Geography: 8
};

// Build content dynamically for each category
Object.keys(DATA).forEach(type => {
  Object.keys(subjects).forEach(sub => {
    DATA[type][sub] = [];
    for (let i = 1; i <= subjects[sub]; i++) {
      DATA[type][sub].push({
        id: `${sub.toLowerCase()}${i}`,
        title: `Chapter ${i}`,
        pdf: `${sub.toLowerCase()}_${type}_${i}.pdf`,
        code: `${sub.slice(0, 3).toUpperCase()}${i.toString().padStart(3, '0')}`
      });
    }
  });
});

// Track selections
let selectedType = null;
let selectedSubject = null;
let selectedChapter = null;

// Utility to hide all sections
function resetContainers() {
  document.querySelectorAll('.container').forEach(c => c.classList.add('hidden'));
}

// ------------------------
// Step 1 — Main Options
// ------------------------
function showMainOptions() {
  resetContainers();
  const container = document.getElementById('main-container');
  container.innerHTML = `
    <h2>Select Type</h2>
    <button onclick="selectType('notes')">🗒️ Notes</button>
    <button onclick="selectType('questions')">❓ Question Bank</button>
    <button onclick="selectType('oneword')">🧩 One Word</button>
  `;
  container.classList.remove('hidden');
}

// ------------------------
// Step 2 — Subject Selection
// ------------------------
function selectType(type) {
  selectedType = type;
  resetContainers();
  const container = document.getElementById('subject-container');
  container.innerHTML = `<h3>Select Subject</h3>`;
  Object.keys(DATA[selectedType]).forEach(sub => {
    const btn = document.createElement('button');
    btn.textContent = sub;
    btn.onclick = () => showChapters(sub);
    container.appendChild(btn);
  });

  // Back to main
  const backBtn = document.createElement('button');
  backBtn.textContent = '⬅️ Back';
  backBtn.onclick = () => showMainOptions();
  container.appendChild(backBtn);

  container.classList.remove('hidden');
}

// ------------------------
// Step 3 — Chapter Selection
// ------------------------
function showChapters(subject) {
  selectedSubject = subject;
  resetContainers();
  const container = document.getElementById('chapter-container');
  container.innerHTML = `<h3>${subject} - Select Chapter</h3>`;

  DATA[selectedType][subject].forEach(ch => {
    const btn = document.createElement('button');
    btn.textContent = ch.title;
    btn.onclick = () => openLogin(ch);
    container.appendChild(btn);
  });

  const backBtn = document.createElement('button');
  backBtn.textContent = '⬅️ Back';
  backBtn.onclick = () => selectType(selectedType);
  container.appendChild(backBtn);

  container.classList.remove('hidden');
}

// ------------------------
// Step 4 — Login
// ------------------------
function openLogin(chapter) {
  selectedChapter = chapter;
  resetContainers();
  document.getElementById('login-container').classList.remove('hidden');
}

document.getElementById('loginBtn').addEventListener('click', () => {
  const user = document.getElementById('username').value;
  const pass = document.getElementById('password').value;
  if (user && pass) {
    resetContainers();
    document.getElementById('code-container').classList.remove('hidden');
  } else {
    alert('Please enter both username and password.');
  }
});

// ------------------------
// Step 5 — Code Verification
// ------------------------
document.getElementById('codeSubmit').addEventListener('click', () => {
  const enteredCode = document.getElementById('codeInput').value.trim();
  if (enteredCode === selectedChapter.code) {
    showPDF(selectedChapter);
  } else {
    alert('❌ Incorrect code');
  }
});

// ------------------------
// Step 6 — PDF Display
// ------------------------
function showPDF(chapter) {
  resetContainers();
  const container = document.getElementById('pdf-container');
  container.innerHTML = `
    <h3>${selectedSubject} - ${chapter.title}</h3>
    <p>✅ Access Granted!</p>
    <a href="${chapter.pdf}" target="_blank">📄 Preview PDF</a>
    <a href="${chapter.pdf}" download>⬇️ Download PDF</a>
    <br><br>
    <button onclick="showMainOptions()">🏠 Back to Home</button>
  `;
  container.classList.remove('hidden');
}

