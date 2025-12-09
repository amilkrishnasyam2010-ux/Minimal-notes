/* script.js — Final working version for Option A (show only real subjects)
   Replace existing script.js in your repo root with this file.
*/

/* ---------- Config (Option A subjects + chapter counts) ---------- */
const SUBJECT_COUNTS = {
  Maths: 10,      // used for Question Bank earlier (if needed)
  Physics: 7,
  Chemistry: 7,
  Geography: 8,
  History: 9,
  Biology: 6 // kept for future; not shown under Option A if PDFs missing
};

// Subjects to show (Option A: only those you have PDFs for)
const VISIBLE_SUBJECTS = ["Maths", "Physics", "Chemistry", "Geography", "History"];

// QB free-access exceptions (requested)
const FREE_QB_FILES = new Set([
  "Maths_6_QB",
  "Maths_7_QB",
  "History_4_QB",
  "Physics_5_QB"
]);

/* ---------- Utility helpers ---------- */
function el(id) { return document.getElementById(id); }
function safeEncode(s) { return btoa(s).replace(/=+$/,"").toUpperCase(); }
function generateAccessCode(fileKey) { return "MN" + safeEncode(fileKey).slice(0,5); }

/* ---------- Account dropdown & modals ---------- */
function toggleAccountMenu() {
  const m = el("account-menu");
  if (m) m.classList.toggle("hidden");
}

function closeAllModals() {
  ["login-modal","signup-modal"].forEach(id => {
    const node = el(id);
    if (node) node.classList.add("hidden");
  });
}

function openLogin() {
  closeAllModals();
  if (el("login-modal")) el("login-modal").classList.remove("hidden");
  if (el("account-menu")) el("account-menu").classList.add("hidden");
}

function openSignup() {
  closeAllModals();
  if (el("signup-modal")) el("signup-modal").classList.remove("hidden");
  if (el("account-menu")) el("account-menu").classList.add("hidden");
}

/* ---------- Auth: signup / login / logout / change password ---------- */
function signupUser() {
  const user = (el("signup-username")?.value || "").trim().toLowerCase();
  const pass = (el("signup-password")?.value || "").trim();
  if (!user || !pass) return alert("Please fill both fields.");
  if (localStorage.getItem(user)) return alert("User already exists.");
  localStorage.setItem(user, JSON.stringify({ password: pass, downloads: [] }));
  alert("Account created.");
  closeAllModals();
}

function loginUser() {
  const user = (el("login-username")?.value || "").trim().toLowerCase();
  const pass = (el("login-password")?.value || "").trim();
  if (!user || !pass) return alert("Please fill both fields.");
  const raw = localStorage.getItem(user);
  if (!raw) return alert("User not found.");
  const data = JSON.parse(raw);
  if (data.password !== pass) return alert("Wrong password.");
  localStorage.setItem("loggedIn", user);
  window.location.href = "./dashboard.html";
}

function logoutUser() {
  localStorage.removeItem("loggedIn");
  window.location.href = "./index.html";
}

function showChangePass() {
  const box = el("change-pass-box");
  if (box) box.classList.toggle("hidden");
}

function changePassword() {
  const user = (el("login-username")?.value || "").trim().toLowerCase();
  const oldp = (el("old-pass")?.value || "").trim();
  const newp = (el("new-pass")?.value || "").trim();
  if (!user || !oldp || !newp) return alert("Please fill fields.");
  const raw = localStorage.getItem(user);
  if (!raw) return alert("User not found.");
  const data = JSON.parse(raw);
  if (data.password !== oldp) return alert("Old password incorrect.");
  data.password = newp;
  localStorage.setItem(user, JSON.stringify(data));
  alert("Password changed.");
  closeAllModals();
}

/* ---------- Dashboard ---------- */
function populateDashboard() {
  const user = localStorage.getItem("loggedIn");
  if (!user) { window.location.href = "./index.html"; return; }
  if (el("user-name")) el("user-name").innerText = user;
  const raw = localStorage.getItem(user) || "{}";
  const data = raw ? JSON.parse(raw) : { downloads: [] };
  const list = el("downloaded-list");
  if (!list) return;
  if (!data.downloads || data.downloads.length === 0) list.innerHTML = "<li>No notes downloaded yet.</li>";
  else list.innerHTML = data.downloads.map(f => `<li>${f}</li>`).join("");
}

/* ---------- Navigation helpers ---------- */
function goTo(section) {
  // section: "notes" | "questions" | "oneword"
  localStorage.setItem("section", section);
  window.location.href = "./notes.html";
}
function goBackDashboard() { window.location.href = "./dashboard.html"; }

/* ---------- Subjects / Chapters / File access ---------- */
function currentPage() {
  return window.location.pathname.split("/").pop();
}

function buildSubjectsForPage() {
  // Determine which flow: notes, questions, or oneword
  const page = currentPage();
  const section = localStorage.getItem("section") || "notes";
  if (page === "notes.html") {
    if (section === "questions") renderSubjects(VISIBLE_SUBJECTS, "questions");
    else if (section === "oneword") renderSubjects(VISIBLE_SUBJECTS, "oneword");
    else renderSubjects(VISIBLE_SUBJECTS, "notes");
  } else if (page === "questions.html") {
    renderSubjects(VISIBLE_SUBJECTS, "questions", "qb-subjects");
  } else if (page === "oneword.html") {
    renderSubjects(VISIBLE_SUBJECTS, "oneword", "oneword-subjects");
  }
}

function renderSubjects(subjectList, type, containerId) {
  const container = containerId ? el(containerId) : el("subject-container");
  if (!container) return;
  container.innerHTML = `<h2>Select a Subject</h2>`;
  const wrapper = document.createElement("div");
  wrapper.className = "subject-buttons";
  subjectList.forEach(sub => {
    const btn = document.createElement("button");
    btn.className = "subject-btn";
    btn.textContent = sub;
    btn.onclick = () => showChapters(sub, type);
    wrapper.appendChild(btn);
  });
  container.appendChild(wrapper);
}

function showChapters(subject, type) {
  const counts = (type === "questions") ? SUBJECT_COUNTS : SUBJECT_COUNTS;
  const total = counts[subject] || 6;
  if (el("subject-container")) el("subject-container").classList.add("hidden");
  const chapterDiv = el("chapter-container") || el("qb-chapters") || el("oneword-chapters");
  if (!chapterDiv) return;
  chapterDiv.innerHTML = `<h3>${subject} - Select Chapter</h3>`;
  for (let i = 1; i <= total; i++) {
    const b = document.createElement("button");
    b.className = "chapter-btn";
    b.textContent = `Chapter ${i}`;
    b.onclick = () => {
      const fileKey = buildFileKey(subject, i, type);
      askCode(fileKey, type);
    };
    chapterDiv.appendChild(b);
  }
  chapterDiv.classList.remove("hidden");
  chapterDiv.scrollIntoView({ behavior: "smooth" });
}

function buildFileKey(subject, chapter, type) {
  if (type === "questions") return `${subject}_${chapter}_QB`;
  if (type === "oneword") return `${subject}_${chapter}_OW`;
  return `${subject}_${chapter}`;
}

function askCode(fileKey, type) {
  localStorage.setItem("pendingFile", fileKey);
  localStorage.setItem("pendingType", type);
  if (el("chapter-container")) el("chapter-container").classList.add("hidden");
  if (el("code-container")) el("code-container").classList.remove("hidden");
  if (el("qb-code-box")) el("qb-code-box").classList.remove("hidden");
  // Helpful debug: expected code printed to console
  console.log("Expected access code for", fileKey, "->", generateAccessCode(fileKey));
}

function verifyCode() {
  const entered = (el("code-input")?.value || el("qb-code")?.value || el("oneword-code-input")?.value || "").trim();
  const fileKey = localStorage.getItem("pendingFile");
  const type = localStorage.getItem("pendingType") || "notes";
  if (!fileKey) return alert("No file selected.");
  if (type === "questions" && FREE_QB_FILES.has(fileKey)) {
    showPDF(fileKey, type);
    return;
  }
  const expected = generateAccessCode(fileKey);
  if (entered === expected) showPDF(fileKey, type);
  else alert("Invalid code. Check console for expected code (for testing).");
}

function showPDF(fileKey, type) {
  if (el("code-container")) el("code-container").classList.add("hidden");
  if (el("qb-code-box")) el("qb-code-box").classList.add("hidden");
  const pdfDiv = el("pdf-container") || el("qb-pdf-box") || el("oneword-pdf-box");
  if (!pdfDiv) return;
  const fname = `pdfs/${fileKey}.pdf`; // matches your repo naming convention
  pdfDiv.innerHTML = `
    <h3>Access Granted</h3>
    <p>${fileKey}</p>
    <p>
      <a href="./${fname}" target="_blank">📄 Preview</a>
      &nbsp;&nbsp;
      <a href="./${fname}" download>⬇️ Download</a>
    </p>
    <p><button onclick="goBackToSubjects()">Back to subjects</button></p>
  `;
  pdfDiv.classList.remove("hidden");
  // Save to user downloads (if logged in)
  const user = localStorage.getItem("loggedIn");
  if (user) {
    const raw = localStorage.getItem(user) || "{}";
    const data = raw ? JSON.parse(raw) : { password: "", downloads: [] };
    data.downloads = data.downloads || [];
    if (!data.downloads.includes(fileKey)) {
      data.downloads.push(fileKey);
      localStorage.setItem(user, JSON.stringify(data));
    }
  }
}

function goBackToSubjects() {
  if (el("pdf-container")) el("pdf-container").classList.add("hidden");
  if (el("qb-pdf-box")) el("qb-pdf-box").classList.add("hidden");
  if (el("oneword-pdf-box")) el("oneword-pdf-box").classList.add("hidden");
  if (el("subject-container")) el("subject-container").classList.remove("hidden");
  if (el("qb-chapters")) el("qb-chapters").classList.add("hidden");
  if (el("chapter-container")) el("chapter-container").classList.add("hidden");
  if (el("qb-code-box")) el("qb-code-box").classList.add("hidden");
}

/* ---------- Auto-init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  // Hook account button safety
  const acc = document.querySelector(".account-btn");
  if (acc) acc.addEventListener("click", toggleAccountMenu);

  // Close buttons (if any)
  document.querySelectorAll(".close-modal").forEach(btn => btn.addEventListener("click", closeAllModals));

  // Per-page init
  const page = currentPage();
  if (page === "dashboard.html") populateDashboard();
  if (["notes.html", "questions.html", "oneword.html"].includes(page)) buildSubjectsForPage();
});
