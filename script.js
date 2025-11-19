// ---------- SUBJECTS ----------
const subjects = {
  Physics: 7,
  Chemistry: 7,
  Biology: 6,
  Geography: 8,
  History: 9,
  Maths_QB: 10    // Maths ONLY for Question Bank
};

// ---------- FREE ACCESS FILES ----------
const freeFiles = [
  "Maths_6_QB",
  "Maths_7_QB",
  "History_4_QB",
  "Physics_5_QB"
];

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
if (window.location.pathname.endsWith("notes.html")) {
  const section = localStorage.getItem("section");
  document.getElementById("section-title").innerText =
    section.charAt(0).toUpperCase() + section.slice(1);

  const subjectContainer = document.getElementById("subject-container");

  Object.keys(subjects).forEach(sub => {
    // Show Maths only in Question Bank
    if (sub === "Maths_QB" && section !== "questions") return;

    // Display name (Maths_QB → Maths)
    const displayName = sub === "Maths_QB" ? "Maths" : sub;

    const btn = document.createElement("button");
    btn.textContent = displayName;
    btn.onclick = () => showChapters(sub);
    subjectContainer.appendChild(btn);
  });
}

function showChapters(subject) {
  document.getElementById("subject-container").classList.add("hidden");
  const chapterDiv = document.getElementById("chapter-container");
  chapterDiv.innerHTML = `<h3>${subject === "Maths_QB" ? "Maths" : subject} - Select Chapter</h3>`;

  const section = localStorage.getItem("section");

  for (let i = 1; i <= subjects[subject]; i++) {
    const btn = document.createElement("button");

    // Build fileName
    let fileName;

    if (subject === "Maths_QB") {
      fileName = `Maths_${i}_QB`;        // Maths only QB
    } else {
      fileName = `${subject}_${i}`;
      if (section === "questions") fileName += "_QB";
      if (section === "oneword") fileName += "_OW";
    }

    btn.textContent = `Chapter ${i}`;
    btn.onclick = () => askCode(fileName);
    chapterDiv.appendChild(btn);
  }
  chapterDiv.classList.remove("hidden");
}

function askCode(file) {
  localStorage.setItem("pendingFile", file);

  // FREE CHAPTER → Skip code screen
  if (freeFiles.includes(file)) {
    showPDF(file);
    return;
  }

  document.getElementById("chapter-container").classList.add("hidden");
  document.getElementById("code-container").classList.remove("hidden");
}

function verifyCode() {
  const entered = document.getElementById("code-input").value.trim();
  const file = localStorage.getItem("pendingFile");
  const code = "MN" + btoa(file).slice(0, 4).toUpperCase(); // auto-code

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

  // Save to downloads
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
