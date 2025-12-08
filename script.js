/* Minimal / robust script.js for your index.html */
const BACKEND_URL = "https://script.google.com/macros/s/AKfycbyydVvtQesLYECTNOyP3UIeTUeJyxaw51SMyegrelp-T6ZDzjWDYMKmlJQVFcY70UmzEQ/exec";

/* Account dropdown */
function toggleAccountMenu() {
  const menu = document.getElementById("account-menu");
  if (menu) menu.classList.toggle("hidden");
}

/* Modals */
function openLogin() {
  closeAllModals();
  const m = document.getElementById("login-modal");
  if (m) m.classList.remove("hidden");
  // hide account menu
  const am = document.getElementById("account-menu");
  if (am) am.classList.add("hidden");
}

function openSignup() {
  closeAllModals();
  const m = document.getElementById("signup-modal");
  if (m) m.classList.remove("hidden");
  const am = document.getElementById("account-menu");
  if (am) am.classList.add("hidden");
}

function closeAllModals() {
  ["login-modal","signup-modal","change-password-modal"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add("hidden");
  });
}

/* Signup/login logic (localStorage) */
function signupUser() {
  const user = (document.getElementById("signup-username")?.value || "").trim().toLowerCase();
  const pass = (document.getElementById("signup-password")?.value || "").trim();
  if (!user || !pass) return alert("Please fill all fields.");
  if (localStorage.getItem(user)) return alert("User already exists.");
  localStorage.setItem(user, JSON.stringify({ password: pass, downloads: [] }));
  alert("Account created");
  closeAllModals();
}

function loginUser() {
  const user = (document.getElementById("login-username")?.value || "").trim().toLowerCase();
  const pass = (document.getElementById("login-password")?.value || "").trim();
  if (!user || !pass) return alert("Please fill all fields.");
  const raw = localStorage.getItem(user);
  if (!raw) return alert("User not found");
  const data = JSON.parse(raw);
  if (data.password !== pass) return alert("Wrong password");
  localStorage.setItem("loggedIn", user);
  window.location.href = "dashboard.html";
}

/* Change password helper shown inside login modal */
function showChangePass() {
  const box = document.getElementById("change-pass-box");
  if (box) box.classList.toggle("hidden");
}
function changePassword() {
  const user = (document.getElementById("login-username")?.value || "").trim().toLowerCase();
  const oldp = (document.getElementById("old-pass")?.value || "").trim();
  const newp = (document.getElementById("new-pass")?.value || "").trim();
  if (!user || !oldp || !newp) return alert("Please fill fields");
  const raw = localStorage.getItem(user);
  if (!raw) return alert("User not found");
  const data = JSON.parse(raw);
  if (data.password !== oldp) return alert("Old password wrong");
  data.password = newp;
  localStorage.setItem(user, JSON.stringify(data));
  alert("Password changed");
  closeAllModals();
}

/* Utility: ensure account button toggles if present */
document.addEventListener("DOMContentLoaded", () => {
  const acc = document.querySelector(".account-btn");
  if (acc) acc.addEventListener("click", toggleAccountMenu);

  document.querySelectorAll(".close-modal").forEach(btn =>
    btn.addEventListener("click", closeAllModals)
  );
});
