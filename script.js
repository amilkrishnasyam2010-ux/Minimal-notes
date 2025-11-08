// ------------------------
// MINIMAL NOTES WEBSITE
// ------------------------

// ✅ Ensure UI builds only after full page load
window.addEventListener("DOMContentLoaded", () => {
  showMainOptions();
});

// ------------------------
// DATA STRUCTURE
// ------------------------

const subjects = {
  Physics: 7,
  Chemistry: 7,
  Biology: 6,
  History: 9,
  Geography: 8
};

const TYPES = ["notes", "questions", "oneword"];
const DATA = {};

// Auto-generate fake data (replace with real PDF links later)
TYPES.forEach(type => {
  DATA[type] = {};
  Object.keys(subjects).forEach(sub => {
    DATA[type][sub] = [];
    for (let i = 1; i <= subjects[sub]; i++) {
      DATA[type][sub].push({
        id: `${sub.toLowerCase()}_${type}_${i}`,
        title: `Chapter ${i}`,
        pdf: `${sub.toLowerCase()}_${type}_${i}.pdf`,
        code: `${sub.substring(0, 3).toUpperCase()}${i.toString().padStart(3, "0")}`
      });
    }
  });
});

// ------------------------
// STATE MANAGEMENT
// ------------------------
let selectedType = null;
let selectedSubject = null;
let selectedChapter = null;

// Hide all containers
function resetContainers() {
  document.querySelectorAll(".container").forEach(c => c.classList.add("hidden"));
}

// ------------------------
// STEP 1 - MAIN OPTIONS
// ------------------------
function showMainOptions() {
  resetContainers();
  const container = document.getElementById("main-container");

  container.innerHTML = `
    <h2>Choose a category</h2>
    <button onclick="selectType('notes')">🗒️ Notes</button>
    <button onclick="selectType('questions')">❓ Question Bank</button>
    <button onclick="selectType('oneword')">🧩 One Word</button>
  `;

  container.classList.remove("hidden");
}

// ------------------------
// STEP 2 - SUBJECT SELECTION
// ------------------------
function selectType(type) {
  selectedType = type;
  resetContainers();

  const container = document.getElementById("subject-container");
  container.innerHTML = `<h3>Select Subject</h3>`;

  Object.keys(DATA[selectedType]).forEach(sub => {
    const btn = document.createElement("button");
    btn.textContent = sub;
    btn.onclick = () => showChapters(sub);
    container.appendChild(btn);
  });

  const back = document.createElement("button");
  back.textContent = "⬅️ Back";
  back.onclick = showMainOptions;
  container.appendChild(back);

  container.classList.remove("hidden");
}

// ------------------------
// STEP 3 - CHAPTER SELECTION
// ------------------------
function showChapters(subject) {
  selectedSubject = subject;
  resetContainers();

  const container = document.getElementById("chapter-container");
  container.innerHTML = `<h3>${subject} - Select Chapter</h3>`;

  DATA[selectedType][subject].forEach(ch => {
    const btn = document.createElement("button");
    btn.textContent = ch.title;
    btn.onclick = () => openLogin(ch);
    container.appendChild(btn);
  });

  const back = document.createElement("button");
  back.textContent = "⬅️ Back";
  back.onclick = () => selectType(selectedType);
  container.appendChild(back);

  container.classList.remove("hidden");
}

// ------------------------
// STEP 4 - LOGIN
// ------------------------
function openLogin(chapter) {
  selectedChapter = chapter;
  resetContainers();
  document.getElementById("login-container").classList.remove("hidden");
}

document.getElementById("loginBtn").addEventListener("click", () => {
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();

  if (!user || !pass) {
    alert("⚠️ Please enter both username and password");
    return;
  }

  resetContainers();
  document.getElementById("code-container").classList.remove("hidden");
});

// ------------------------
// STEP 5 - CODE CHECK
// ------------------------
document.getElementById("codeSubmit").addEventListener("click", () => {
  const enteredCode = document.getElementById("codeInput").value.trim();
  if (enteredCode === selectedChapter.code) {
    showPDF(selectedChapter);
  } else {
    alert("❌ Incorrect code");
  }
});

// ------------------------
// STEP 6 - PDF PREVIEW
// ------------------------
function showPDF(chapter) {
  resetContainers();
  const container = document.getElementById("pdf-container");
  container.innerHTML = `
    <h3>${selectedSubject} - ${chapter.title}</h3>
    <p>✅ Access Granted!</p>
    <a href="${chapter.pdf}" target="_blank">📄 Preview PDF</a>
    <a href="${chapter.pdf}" download>⬇️ Download PDF</a>
    <br><br>
    <button onclick="showMainOptions()">🏠 Back to Home</button>
  `;
  container.classList.remove("hidden");
}
