/* -----------------------------------------
   script.js  — Full app logic
   Place at repo root: ./script.js
------------------------------------------*/

const BACKEND_URL = "https://script.google.com/macros/s/AKfycbyydVvtQesLYECTNOyP3UIeTUeJyxaw51SMyegrelp-T6ZDzjWDYMKmlJQVFcY70UmzEQ/exec";

/* ------------------------
   App data / config
   ------------------------*/
const SUBJECTS = {
  Physics: 7,
  Chemistry: 7,
  Biology: 6,
  Geography: 8,
  History: 9
};

// Question bank has Maths in addition to other subjects
const QB_SUBJECTS = {
  Physics: 7,
  Chemistry: 7,
  Biology: 6,
  Geography: 8,
  History: 9,
  Maths: 10
};

// One-word uses same subjects as NOTES (no Maths)
const ONEWORD_SUBJECTS = Object.assign({}, SUBJECTS);

// Files naming conventions:
// Notes:    pdfs/<Subject>_<chapter>.pdf
// QB:       pdfs/<Subject>_<chapter>_QB.pdf   (user earlier used History_4_QB etc.)
// OneWord:  pdfs/<Subject>_<chapter>_OW.pdf

// Free access for particular QB files (user request)
const FREE_QB_FILES = new Set([
  "Maths_6_QB",
  "Maths_7_QB",
  "History_4_QB",
  "Physics_5_QB"
]);

/* ------------------------
   Utilities
   ------------------------*/
function el(id) { return document.getElementById(id); }

function safeEncodeFileKey(fileKey) {
  // deterministic compact code suffix
  // remove equals from btoa and uppercase
  return btoa(fileKey).replace(/=+$/, "").toUpperCase();
}

function generateAccessCode(fileKey) {
  // simple deterministic access code => MN + first 5 chars of b64
  return "MN" + safeEncodeFileKey(fileKey).slice(0, 5);
}

/* ------------------------
   Account dropdown & modals
   ------------------------*/
function toggleAccountMenu() {
  const menu = el("account-menu");
  if (!menu) return;
  menu.classList.toggle("hidden");
}

document.addEventListener("click", (e) => {
  // close account menu when clicking outside
  const menu = el("account-menu");
  const accountBtn = document.querySelector(".account-btn");
  if (!menu || !accountBtn) return;
  if (!menu.contains(e.target) && !accountBtn.contains(e.target)) {
    menu.classList.add("hidden");
  }
});

// Modal helpers
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

function openChangePasswordModalFromDashboard() {
  closeAllModals();
  if (el("change-password-modal")) el("change-password-modal").classList.remove("hidden");
}

function closeAllModals() {
  ["login-modal", "signup-modal", "change-password-modal"].forEach(id => {
    if (el(id)) el(id).classList.add("hidden");
  });
}

/* ------------------------
   Auth: signup / login / logout / changePass
   Uses localStorage for simplicity (as earlier)
   ------------------------*/
function signupUser() {
  const u = (el("signup-username")?.value || "").trim().toLowerCase();
  const p = (el("signup-password")?.value || "").trim();
  if (!u || !p) return alert("Please fill username and password.");
  if (localStorage.getItem(u)) return alert("User already exists.");
  localStorage.setItem(u, JSON.stringify({ password: p, downloads: [] }));
  alert("Account created successfully.");
  closeAllModals();
}

function loginUser() {
  const u = (el("login-username")?.value || "").trim().toLowerCase();
  const p = (el("login-password")?.value || "").trim();
  if (!u || !p) return alert("Please fill username and password.");
  const raw = localStorage.getItem(u);
  if (!raw) return alert("User not found.");
  const data = JSON.parse(raw);
  if (data.password !== p) return alert("Wrong password.");
  localStorage.setItem("loggedIn", u);
  // redirect to dashboard
  window.location.href = "./dashboard.html";
}

function logoutUser() {
  localStorage.removeItem("loggedIn");
  window.location.href = "./index.html";
}

function changePassword() {
  // supports change via change-password-modal (top) or login modal change area
  const user = (localStorage.getItem("loggedIn") || "").toLowerCase();
  // if not logged in, allow change via fields (username provided)
  let targetUser = user;
  if (!targetUser) {
    targetUser = (el("cp-username")?.value || "").trim().toLowerCase();
    if (!targetUser) return alert("Please enter username to change password.");
  }
  const oldp = (el("cp-old")?.value || el("old-pass")?.value || "").trim();
  const newp = (el("cp-new")?.value || el("new-pass")?.value || "").trim();
  if (!oldp || !newp) return alert("Please fill both old and new password.");
  const raw = localStorage.getItem(targetUser);
  if (!raw) return alert("User not found.");
  const data = JSON.parse(raw);
  if (data.password !== oldp) return alert("Old password incorrect.");
  data.password = newp;
  localStorage.setItem(targetUser, JSON.stringify(data));
  alert("Password changed.");
  closeAllModals();
}

/* ------------------------
   Dashboard logic
   ------------------------*/
function populateDashboard() {
  const user = localStorage.getItem("loggedIn");
  if (!user) {
    // Not logged in -> redirect to home
    window.location.href = "./index.html";
    return;
  }

  const span = el("user-name");
  if (span) span.innerText = user;

  const raw = localStorage.getItem(user);
  if (!raw) return;
  const data = JSON.parse(raw);
  const list = el("downloaded-list");
  if (!list) return;
  if (!data.downloads || data.downloads.length === 0) {
    list.innerHTML = "<li>No notes downloaded yet.</li>";
  } else {
    list.innerHTML = data.downloads.map(f => `<li>${f}</li>`).join("");
  }
}

/* ------------------------
   Navigation helper
   ------------------------*/
function goTo(section) {
  // section: 'notes' | 'questions' | 'oneword'
  localStorage.setItem("section", section);
  window.location.href = "./notes.html";
}

function goBackDashboard() {
  window.location.href = "./dashboard.html";
}

/* ------------------------
   Notes / Questions / OneWord pages: build UI
   ------------------------*/
function currentPage() {
  return window.location.pathname.split("/").pop();
}

function buildSubjectsForPage() {
  const page = currentPage(); // notes.html or others
  const section = localStorage.getItem("section") || "notes"; // which flow was requested
  // For notes.html we need to check what section user wanted:
  // If section === 'questions' then render QB subjects else render notes/oneword subjects
  if (page === "notes.html") {
    // Render based on section stored
    if (section === "questions") renderSubjects(QB_SUBJECTS, "questions");
    else if (section === "oneword") renderSubjects(ONEWORD_SUBJECTS, "oneword");
    else renderSubjects(SUBJECTS, "notes");
  } else if (page === "questions.html") {
    renderSubjects(QB_SUBJECTS, "questions", "qb-subjects");
  } else if (page === "oneword.html") {
    renderSubjects(ONEWORD_SUBJECTS, "oneword", "oneword-subjects");
  }
}

function renderSubjects(obj, type, containerId) {
  // containerId optional
  const container = containerId ? el(containerId) : el("subject-container");
  if (!container) return;
  container.innerHTML = `<h2>Select a Subject</h2>`;
  const wrapper = document.createElement("div");
  wrapper.className = "subject-buttons";
  Object.keys(obj).forEach(sub => {
    const btn = document.createElement("button");
    btn.className = "subject-btn";
    btn.textContent = sub;
    btn.onclick = () => showChapters(sub, type);
    wrapper.appendChild(btn);
  });
  container.appendChild(wrapper);
}

/* Show chapters for the chosen subject and type (notes/questions/oneword) */
function showChapters(subject, type) {
  // type: "notes" | "questions" | "oneword"
  const counts = (type === "questions") ? QB_SUBJECTS : (type === "oneword" ? ONEWORD_SUBJECTS : SUBJECTS);
  const chapterCount = counts[subject];
  // hide subject area
  if (el("subject-container")) el("subject-container").classList.add("hidden");
  const chapterDiv = el("chapter-container");
  if (!chapterDiv) return;
  chapterDiv.innerHTML = `<h3>${subject} - Select Chapter</h3>`;
  for (let i = 1; i <= chapterCount; i++) {
    const b = document.createElement("button");
    b.className = "chapter-btn";
    b.textContent = `Chapter ${i}`;
    // build file key depending on type
    b.onclick = () => {
      const fileKey = buildFileKey(subject, i, type);
      askCode(fileKey, type);
    };
    chapterDiv.appendChild(b);
  }
  chapterDiv.classList.remove("hidden");
  // scroll into view
  chapterDiv.scrollIntoView({behavior: "smooth"});
}

function buildFileKey(subject, chapter, type) {
  // returns the "file key" used to name the pdf file (without extension)
  if (type === "questions") return `${subject}_${chapter}_QB`;
  if (type === "oneword") return `${subject}_${chapter}_OW`;
  return `${subject}_${chapter}`;
}

/* Show code entry UI */
function askCode(fileKey, type) {
  // store pending info
  localStorage.setItem("pendingFile", fileKey);
  localStorage.setItem("pendingType", type);
  if (el("chapter-container")) el("chapter-container").classList.add("hidden");
  if (el("code-container")) el("code-container").classList.remove("hidden");
  // prefill hint? (for testing you may want to show generated code in console)
  console.log("Expected code (debug):", generateAccessCode(fileKey));
}

/* Verify code (or allow free access) */
function verifyCode() {
  const entered = (el("code-input")?.value || "").trim();
  const fileKey = localStorage.getItem("pendingFile");
  const type = localStorage.getItem("pendingType") || "notes";
  if (!fileKey) return alert("No file selected.");
  // free access for special QB files
  if (type === "questions" && FREE_QB_FILES.has(fileKey)) {
    showPDF(fileKey, type);
    return;
  }
  const expected = generateAccessCode(fileKey);
  if (entered === expected) {
    showPDF(fileKey, type);
  } else {
    alert("Invalid code. Please check and try again.");
  }
}

/* Show PDF preview / download & save to user's downloads */
function showPDF(fileKey, type) {
  if (el("code-container")) el("code-container").classList.add("hidden");
  const pdfDiv = el("pdf-container");
  if (!pdfDiv) return;
  // choose filename pattern
  let fname = "";
  if (type === "questions") fname = `pdfs/${fileKey}.pdf`; // e.g. History_4_QB.pdf
  else if (type === "oneword") fname = `pdfs/${fileKey}.pdf`;
  else fname = `pdfs/${fileKey}.pdf`;
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

  // Save to user downloads if logged in
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

/* Return to subject list (from pdf view) */
function goBackToSubjects() {
  if (el("pdf-container")) el("pdf-container").classList.add("hidden");
  if (el("subject-container")) el("subject-container").classList.remove("hidden");
  if (el("chapter-container")) el("chapter-container").classList.add("hidden");
  if (el("code-container")) el("code-container").classList.add("hidden");
}

/* ------------------------
   Auto-initialize per page
   ------------------------*/
document.addEventListener("DOMContentLoaded", () => {
  // Attach close-modal buttons to hide their modal by walking dataset or parent
  document.querySelectorAll(".close-modal").forEach(btn => {
    btn.addEventListener("click", () => {
      closeAllModals();
    });
  });

  const page = currentPage();

  // If on dashboard, populate username & downloads
  if (page === "dashboard.html") {
    populateDashboard();
  }

  // If on notes/questions/oneword pages: build subjects
  if (["notes.html", "questions.html", "oneword.html"].includes(page)) {
    buildSubjectsForPage();
  }

  // Ensure account menu button works (if present)
  const accBtn = document.querySelector(".account-btn");
  if (accBtn) accBtn.addEventListener("click", toggleAccountMenu);
});
