const BACKEND_URL =
  "https://script.google.com/macros/s/AKfycbyydVvtQesLYECTNOyP3UIeTUeJyxaw51SMyegrelp-T6ZDzjWDYMKmlJQVFcY70UmzEQ/exec";

/* ---------------- ACCOUNT DROPDOWN ---------------- */
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
  const user = document.getElementById("signup-username").value.trim();
  const pass = document.getElementById("signup-password").value.trim();

  if (!user || !pass) return alert("Please fill all fields.");

  const key = user.toLowerCase();

  localStorage.setItem(
    key,
    JSON.stringify({
      password: pass,
      downloads: []
    })
  );

  alert("Account created successfully!");
  closeModal();
}

/* ---------------- LOGIN ---------------- */
function loginUser() {
  const user = document.getElementById("login-username").value.trim().toLowerCase();
  const pass = document.getElementById("login-password").value.trim();

  if (!user || !pass) return alert("Please fill all fields.");

  const saved = localStorage.getItem(user);
  if (!saved) return alert("User not found");

  const data = JSON.parse(saved);

  if (data.password !== pass) return alert("Incorrect password");

  localStorage.setItem("loggedIn", user);
  window.location.href = "dashboard.html";
}

/* ---------------- CHANGE PASSWORD ---------------- */
function showChangePass() {
  document.getElementById("change-pass-box").classList.toggle("hidden");
}

function changePassword() {
  const user = document.getElementById("login-username").value.trim().toLowerCase();
  const oldPass = document.getElementById("old-pass").value.trim();
  const newPass = document.getElementById("new-pass").value.trim();

  const data = JSON.parse(localStorage.getItem(user));

  if (data.password !== oldPass) return alert("Wrong old password");

  data.password = newPass;
  localStorage.setItem(user, JSON.stringify(data));

  alert("Password updated!");
  closeModal();
}
