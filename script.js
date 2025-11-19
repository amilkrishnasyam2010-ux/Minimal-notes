// ---------- AUTH SYSTEM ----------
function signupUser() {
  const user = document.getElementById("signup-username").value.trim();
  const pass = document.getElementById("signup-password").value.trim();

  if (!user || !pass) return alert("Please fill in all fields!");

  if (localStorage.getItem(user)) return alert("User already exists!");

  localStorage.setItem(user, JSON.stringify({ password: pass, downloads: [] }));
  alert("Account created successfully!");
  showLogin();
}
// ---------- VISUAL EFFECTS ----------
function fadeIn(el) {
  el.style.opacity = 0;
  el.classList.remove('hidden');
  setTimeout(() => el.style.transition = 'opacity 0.6s', 10);
  setTimeout(() => el.style.opacity = 1, 50);
}

// ---------- AUTH SYSTEM ----------
function signupUser() {
  const user = document.getElementById("signup-username").value.trim();
  const pass = document.getElementById("signup-password").value.trim();

  if (!user || !pass) return alert("Please fill in all fields!");

  if (localStorage.getItem(user)) return alert("User already exists!");

  localStorage.setItem(user, JSON.stringify({ password: pass, downloads: [] }));
  alert("Account created successfully!");
  showLogin();
}

function loginUser() {
  const user = document.getElementById("login-username").value.trim();
  const pass = document.getElementById("login-password").value.trim();

  const saved = localStorage.getItem(user);
  if (!saved) return alert("User not found!");

  const data = JSON.parse(saved);
  if (data.password !== pass) return alert("Wrong password!");

  localStorage.setItem("loggedIn", user);
  window.location.href = "dashboard.html";
}

function logoutUser() {
  localStorage.removeItem("loggedIn");
  window.location.href = "index.html";
}

function showSignup() {
  document.getElementById("login-card").classList.add("hidden");
  document.getElementById("signup-card").classList.remove("hidden");
}

function showLogin() {
  document.getElementById("signup-card").classList.add("hidden");
  document.getElementById("login-card").classList.remove("hidden");
}

// ---------- DASHBOARD ----------
if (window.location.pathname.endsWith("dashboard.html")) {
  const user = localStorage.getItem("loggedIn");
  if (!user) window.location.href = "index.html";
  else {
    document.getElementById("user-name").innerText = user;
    const data = JSON.parse(localStorage.getItem(user));
    const list = document.getElementById("downloaded-list");

    if (data.downloads.length > 0)
      list.innerHTML = data.downloads.map(f => `<li>${f}</li>`).join("");
  }
}

function goTo(type) {
  localStorage.setItem("section", type);
  window.location.href = "notes.html";
}

// ---------- NOTES SYSTEM ----------
const subjects = {
  Physics: 7,
  Chemistry: 7,
  Biology: 6,
  Geography: 8,
  History: 9,
  Maths: 10   // Maths only for Question Bank (10 chapters — change number as needed)
};
// FREE Question Bank chapters (no code required)
const freeFiles = [
  "Maths_6_QB",
  "Maths_7_QB"
];

if (window.location.pathname.endsWith("notes.html")) {
  const section = localStorage.getItem("section");
  document.getElementById("section-title").innerText =
    section.charAt(0).toUpperCase() + section.slice(1);

  const subjectContainer = document.getElementById("subject-container");
  Object.keys(subjects).forEach(sub => {
    const btn = document.createElement("button");
    btn.textContent = sub;
    btn.onclick = () => showChapters(sub);
    subjectContainer.appendChild(btn);
  });
}

function showChapters(subject) {
  document.getElementById("subject-container").classList.add("hidden");
  const chapterDiv = document.getElementById("chapter-container");
  chapterDiv.innerHTML = `<h3>${subject} - Select Chapter</h3>`;
  for (let i = 1; i <= subjects[subject]; i++) {
    const btn = document.createElement("button");
    btn.textContent = `Chapter ${i}`;
    btn.onclick = () => askCode(`${subject}_${i}`);
    chapterDiv.appendChild(btn);
  }
  chapterDiv.classList.remove("hidden");
}

function askCode(file) {
  localStorage.setItem("pendingFile", file);

  // If file is free → skip code screen
  if (freeFiles.includes(file)) {
    showPDF(file);
    return;
  }

  // Otherwise show code entry
  document.getElementById("chapter-container").classList.add("hidden");
  document.getElementById("code-container").classList.remove("hidden");
}


function verifyCode() {
  const entered = document.getElementById("code-input").value.trim();
  const file = localStorage.getItem("pendingFile");
  const code = "MN" + btoa(file).slice(0, 4).toUpperCase(); // pseudo-code

  if (entered !== code) return alert("Invalid Code!");

  showPDF(file);
}

function showPDF(file) {
  document.getElementById("code-container").classList.add("hidden");
  const pdfDiv = document.getElementById("pdf-container");
  pdfDiv.innerHTML = `
    <h3>Access Granted!</h3>
    <a href="pdfs/${file}.pdf" target="_blank">📄 Preview PDF</a>
    <a href="pdfs/${file}.pdf" download>⬇️ Download PDF</a>
  `;
  pdfDiv.classList.remove("hidden");

  // Save to user downloads
  const user = localStorage.getItem("loggedIn");
  const data = JSON.parse(localStorage.getItem(user));
  if (!data.downloads.includes(file)) {
    data.downloads.push(file);
    localStorage.setItem(user, JSON.stringify(data));
  }
}

function goBackDashboard() {
  window.location.href = "dashboard.html";
}




