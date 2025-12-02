/* ------------------ BACKEND URL ------------------
 Replace with your deployed Google Apps Script web app if different.
*/
const BACKEND_URL = "https://script.google.com/macros/s/AKfycbwFEbrYyAoOIzQ0cIJBAFZRDWSM5HjD6I2_KcSVObupz8ER1O6mjllhqAEpH0Ohv0eKHQ/exec";

/* IIFE to avoid polluting global scope too much */
(function () {
  // Elements
  const accountBtn = document.getElementById("accountBtn");
  const accountMenu = document.getElementById("accountMenu");
  const loginModal = document.getElementById("loginModal");
  const signupModal = document.getElementById("signupModal");
  const changePassModal = document.getElementById("changePassModal");

  // Toggle dropdown menu
  window.toggleAccountMenu = function () {
    if (!accountMenu) return;
    accountMenu.classList.toggle("hidden");
    const expanded = accountMenu.classList.contains("hidden") ? "false" : "true";
    accountBtn.setAttribute("aria-expanded", expanded);
  };

  // Open a modal by id (hides dropdown)
  window.openModal = function (id) {
    // Hide dropdown
    if (accountMenu) accountMenu.classList.add("hidden");

    // Hide all modals first
    [loginModal, signupModal, changePassModal].forEach(m => {
      if (m) m.classList.add("hidden");
    });

    const modal = document.getElementById(id);
    if (modal) modal.classList.remove("hidden");
  };

  // Close modal by id
  window.closeModal = function (id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add("hidden");
  };

  // Clicks outside: close dropdown and modals (unless clicking inside)
  document.addEventListener("click", (e) => {
    const target = e.target;
    if (!accountBtn || !accountMenu) return;

    // If clicked the account button or inside menu, ignore
    if (accountBtn.contains(target) || accountMenu.contains(target)) return;

    // If clicked inside a modal-content, ignore
    if (target.closest && target.closest(".modal-content")) return;

    // Otherwise close
    accountMenu.classList.add("hidden");
  });

  // Wire dropdown menu buttons -> open modals
  const menuLogin = document.getElementById("menuLogin");
  const menuSignup = document.getElementById("menuSignup");
  const menuChangePass = document.getElementById("menuChangePass");

  if (menuLogin) menuLogin.addEventListener("click", () => openModal("loginModal"));
  if (menuSignup) menuSignup.addEventListener("click", () => openModal("signupModal"));
  if (menuChangePass) menuChangePass.addEventListener("click", () => openModal("changePassModal"));

  // Close buttons in modals
  document.querySelectorAll(".close-modal").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-close");
      if (id) closeModal(id);
      else {
        const modal = btn.closest(".modal");
        if (modal && modal.id) modal.classList.add("hidden");
      }
    });
  });

  // Prevent Enter from submitting forms accidentally
  document.querySelectorAll("input").forEach(input => {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") e.preventDefault();
    });
  });

  /* -------------- AUTH: Signup/Login/Change Password -------------- */

  // Signup
  const signupSubmit = document.getElementById("signupSubmit");
  if (signupSubmit) {
    signupSubmit.addEventListener("click", () => {
      const uEl = document.getElementById("signup-username");
      const pEl = document.getElementById("signup-password");
      const u = uEl ? uEl.value.trim().toLowerCase() : "";
      const p = pEl ? pEl.value.trim() : "";
      if (!u || !p) return alert("Please fill in all fields.");
      if (localStorage.getItem(u)) return alert("User already exists.");
      localStorage.setItem(u, JSON.stringify({ password: p, downloads: [] }));
      alert("Account created. You can now log in.");
      closeModal("signupModal");
    });
  }

  // Login
  const loginSubmit = document.getElementById("loginSubmit");
  if (loginSubmit) {
    loginSubmit.addEventListener("click", () => {
      const uEl = document.getElementById("login-username");
      const pEl = document.getElementById("login-password");
      const u = uEl ? uEl.value.trim().toLowerCase() : "";
      const p = pEl ? pEl.value.trim() : "";
      if (!u || !p) return alert("Please fill in all fields.");
      const raw = localStorage.getItem(u);
      if (!raw) return alert("User not found.");
      const user = JSON.parse(raw);
      if (user.password !== p) return alert("Wrong password.");
      localStorage.setItem("loggedIn", u);
      closeModal("loginModal");
      // redirect to dashboard
      window.location.href = "dashboard.html";
    });
  }

  // Change Password (inside modal)
  const changePassSubmit = document.getElementById("changePassSubmit");
  if (changePassSubmit) {
    changePassSubmit.addEventListener("click", () => {
      const logged = localStorage.getItem("loggedIn");
      if (!logged) return alert("Please log in first.");
      const oldP = document.getElementById("old-pass").value.trim();
      const newP = document.getElementById("new-pass").value.trim();
      if (!oldP || !newP) return alert("Please fill in all fields.");
