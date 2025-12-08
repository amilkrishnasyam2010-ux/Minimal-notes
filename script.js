function toggleAccountMenu() {
  document.getElementById("account-menu").classList.toggle("hidden");
}

function closeAllModals() {
  document.getElementById("login-modal").classList.add("hidden");
  document.getElementById("signup-modal").classList.add("hidden");
}

function openLogin() {
  closeAllModals();
  document.getElementById("login-modal").classList.remove("hidden");
}

function openSignup() {
  closeAllModals();
  document.getElementById("signup-modal").classList.remove("hidden");
}

function signupUser() {
  const u = document.getElementById("signup-username").value.trim().toLowerCase();
  const p = document.getElementById("signup-password").value.trim();

  if (!u || !p) return alert("Fill all fields");

  localStorage.setItem(u, JSON.stringify({ password: p, downloads: [] }));
  alert("Account created!");
  closeAllModals();
}

function loginUser() {
  const u = document.getElementById("login-username").value.trim().toLowerCase();
  const p = document.getElementById("login-password").value.trim();

  const saved = localStorage.getItem(u);
  if (!saved) return alert("User not found");

  const data = JSON.parse(saved);
  if (data.password !== p) return alert("Wrong password");

  localStorage.setItem("loggedIn", u);
  window.location.href = "dashboard.html";
}
