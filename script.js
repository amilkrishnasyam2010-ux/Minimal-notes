const BACKEND_URL =
  "https://script.google.com/macros/s/AKfycbyydVvtQesLYECTNOyP3UIeTUeJyxaw51SMyegrelp-T6ZDzjWDYMKmlJQVFcY70UmzEQ/exec";

/* ---------------- ACCOUNT MENU ---------------- */
function toggleAccountMenu() {
  document.getElementById("account-menu").classList.toggle("hidden");
}

/* ---------------- MODALS ---------------- */
function openLogin() {
  closeModal();
  document.getElementById("login-modal").classList.remove("hidden");
}

function openSignup() {
  closeModal();
  document.getElementById("signup-modal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("login-modal").classList.add("hidden");
  document.getElementById("signup-modal").classList.add("hidden");
}

/* ---------------- SIGNUP ---------------- */
function signupUser() {
  const user = document.getElementById("signup-username").value.trim().toLowerCase();
  const pass = document.getElementById("signup-password").value.trim();

  if (!user || !pass) return alert("Fill all fields");

  localStorage.setItem(user, JSON.stringify({ password: pass, downloads: [] }));
  alert("Account created!");
  closeModal();
}

/* ---------------- LOGIN ---------------- */
function loginUser() {
  const user = document.getElementById("login-username").value.trim().toLowerCase();
  const pass = document.getElementById("login-password").value.trim();

  const saved = localStorage.getItem(user);
  if (!saved) return alert("User not found");

  const data = JSON.parse(saved);
  if (data.password !== pass) return alert("Wrong password");

  localStorage.setItem("loggedIn", user);
  window.location.href = "dashboard.html";
}

/* ---------------- CHANGE PASSWORD ---------------- */
function showChangePass() {
  document.getElementById("change-pass-box").classList.toggle("hidden");
}

function changePassword() {
  const user = document.getElementById("login-username").value.trim().toLowerCase();
  const oldp = document.getElementById("old-pass").value.trim();
  const newp = document.getElementById("new-pass").value.trim();

  const saved = JSON.parse(localStorage.getItem(user));
  if (saved.password !== oldp) return alert("Old password incorrect");

  saved.password = newp;
  localStorage.setItem(user, JSON.stringify(saved));
  alert("Password changed");
  closeModal();
}

/* ---------------- DASHBOARD NAVIGATION ---------------- */
function goTo(page) {
  if (page === "notes") window.location.href = "notes.html";
  if (page === "questions") window.location.href = "questions.html";
  if (page === "oneword") window.location.href = "oneword.html";
}

function goBackDashboard() {
  window.location.href = "dashboard.html";
}
