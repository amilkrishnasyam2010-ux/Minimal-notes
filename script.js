/* ───────── BACKEND URL FOR ACCESS CODE VALIDATION ───────── */
const BACKEND_URL =
  "https://script.google.com/macros/s/AKfycbyydVvtQesLYECTNOyP3UIeTUeJyxaw51SMyegrelp-T6ZDzjWDYMKmlJQVFcY70UmzEQ/exec";

/* ───────── TOP BAR MENU ───────── */
function toggleAccountMenu() {
  document.getElementById("account-menu").classList.toggle("hidden");
}

function openModal(id) {
  closeAllMenus();
  document.getElementById(id).classList.remove("hidden");
}

function closeModal(id) {
  document.getElementById(id).classList.add("hidden");
}

function closeAllMenus() {
  const menu = document.getElementById("account-menu");
  if (menu) menu.classList.add("hidden");
}

/* ───────── AUTH SYSTEM ───────── */
function signupUser() {
  const u = document.getElementById("signup-username").value.trim().toLowerCase();
  const p = document.getElementById("signup-password").value.trim();

  if (!u || !p) return alert("Fill all fields.");
  if (localStorage.getItem(u)) return alert("User already exists.");

  localStorage.setItem(u, JSON.stringify({ password: p, downloads: [] }));

  alert("Account created!");
  closeModal("signup-modal");
}

function loginUser() {
  const u = document.getElementById("login-username").value.trim().toLowerCase();
  const p = document.getElementById("login-password").value.trim();

  const data = localStorage.getItem(u);
  if (!data) return alert("User not found.");

  const user = JSON.parse(data);

  if (user.password !== p) return alert("Wrong password.");

  localStorage.setItem("loggedIn", u);
  window.location.href = "dashboard.html";
}

function changePassword() {
  const u = localStorage.getItem("loggedIn");
  if (!u) return alert("Login first.");

  const oldPass = document.getElementById("old-pass").value.trim();
  const newPass = document.getElementById("new-pass").value.trim();

  const user = JSON.parse(localStorage.getItem(u));

  if (oldPass !== user.password) return alert("Incorrect old password.");

  user.password = newPass;
  localStorage.setItem(u, JSON.stringify(user));

  alert("Password changed successfully!");
  closeModal("password-modal");
}

/* ───────── DASHBOARD ───────── */
if (window.location.pathname.endsWith("dashboard.html")) {
  const u = localStorage.getItem("loggedIn");
  if (!u) window.location.href = "index.html";

  document.getElementById("user-name").innerText = u;

  const info = JSON.parse(localStorage.getItem(u));
  const list = document.getElementById("downloaded-list");

  if (info.downloads.length === 0) list.innerHTML = "<li>No downloads yet.</li>";
  else list.innerHTML = info.downloads.map(f => `<li>${f}</li>`).join("");
}

function logoutUser() {
  localStorage.removeItem("loggedIn");
  window.location.href = "index.html";
}

function goTo(type) {
  localStorage.setItem("section", type);
  window.location.href = "notes.html";
}

/* ───────── NOTES PAGE ───────── */

const FREE_CHAPTERS = [
  "Maths_6_QB",
  "Maths_7_QB",
  "History_4_QB",
  "Physics_5_QB"
];

const subjects = {
  Notes: {
    Physics: 7,
    Chemistry: 7,
    Biology: 6,
    Geography: 8,
    History: 9
  },
  questions: {
    Physics: 7,
    Chemistry: 7,
    Biology: 6,
    Geography: 8,
    History: 9,
    Maths: 10
  }
};

if (window.location.pathname.endsWith("notes.html")) {
  const section = localStorage.getItem("section");
  document.getElementById("section-title").innerText = section.toUpperCase();

  const container = document.getElementById("subject-container");
  const list = subjects[section];

  Object.keys(list).forEach(sub => {
    let btn = document.createElement("button");
    btn.textContent = sub; // now clean, “Maths” not “Maths_QB”
    btn.onclick = () => showChapters(sub, list[sub], section);
    container.appendChild(btn);
  });
}

function showChapters(subject, count, section) {
  document.getElementById("subject-container").classList.add("hidden");
  const box = document.getElementById("chapter-container");

  box.innerHTML = `<h3>Select Chapter (${subject})</h3>`;

  for (let i = 1; i <= count; i++) {
    const file = `${subject}_${i}${section === "questions" ? "_QB" : ""}`;
    const btn = document.createElement("button");

    btn.textContent = FREE_CHAPTERS.includes(file)
      ? `Chapter ${i} (FREE)`
      : `Chapter ${i}`;

    btn.onclick = () => requestAccess(file);
    box.appendChild(btn);
  }

  box.classList.remove("hidden");
}

/* ───────── ACCESS CODE VALIDATION ───────── */
function requestAccess(file) {
  if (FREE_CHAPTERS.includes(file)) {
    showPDF(file);
    return;
  }

  localStorage.setItem("pendingFile", file);
  document.getElementById("chapter-container").classList.add("hidden");
  document.getElementById("code-container").classList.remove("hidden");
}

async function verifyCode() {
  const user = localStorage.getItem("loggedIn");
  const code = document.getElementById("code-input").value.trim();
  const file = localStorage.getItem("pendingFile");

  if (!user) return alert("Please log in.");

  const url = `${BACKEND_URL}?user=${user}&file=${file}&code=${code}`;

  let response = await fetch(url);
  let result = await response.json();

  if (result.status === "approved") {
    showPDF(file);
  } else {
    alert("Invalid Code!");
  }
}

/* ───────── SHOW PDF ───────── */
function showPDF(file) {
  document.getElementById("code-container").classList.add("hidden");

  const box = document.getElementById("pdf-container");
  box.innerHTML = `
    <h3>Access Granted</h3>
    <a href="pdfs/${file}.pdf" target="_blank">📄 View PDF</a><br><br>
    <a href="pdfs/${file}.pdf" download>⬇ Download PDF</a>
  `;
  box.classList.remove("hidden");

  const u = localStorage.getItem("loggedIn");
  const data = JSON.parse(localStorage.getItem(u));

  if (!data.downloads.includes(file)) {
    data.downloads.push(file);
    localStorage.setItem(u, JSON.stringify(data));
  }
}







