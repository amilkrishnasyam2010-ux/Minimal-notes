/* ---------- ACCESS BACKEND URL (if used elsewhere) ----------
  Add your BACKEND_URL constant above if your code verification needs it:
  const BACKEND_URL = "https://script.google.com/macros/s/xxxxx/exec";
*/

(function () {
  // elements
  const accountBtn = document.getElementById("accountBtn");
  const accountMenu = document.getElementById("accountMenu");
  const loginModal = document.getElementById("loginModal");
  const signupModal = document.getElementById("signupModal");
  const changePassModal = document.getElementById("changePassModal");

  // menu toggling
  window.toggleAccountMenu = function () {
    accountMenu.classList.toggle("hidden");
    accountBtn.setAttribute("aria-expanded", !accountMenu.classList.contains("hidden"));
  };

  // open modal by id
  window.openModal = function (id) {
    // hide all modals first
    [loginModal, signupModal, changePassModal].forEach(m => m.classList.add("hidden"));
    // close dropdown
    accountMenu.classList.add("hidden");
    // show requested
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove("hidden");
  };

  // close modal by id (used by close buttons)
  window.closeModal = function (id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add("hidden");
  };

  // close menus/modals when clicking outside
  document.addEventListener("click", (e) => {
    const target = e.target;
    // if clicked account button/menu -> do nothing (menu toggle handles it)
    if (target === accountBtn || accountBtn.contains(target) || accountMenu.contains(target)) return;

    // if clicked inside any modal content do nothing
    if (target.closest && (target.closest(".modal-content"))) return;

    // otherwise hide dropdown + modals
    accountMenu.classList.add("hidden");
  });

  // wire up menu buttons to open modals
  document.getElementById("menuLogin").addEventListener("click", () => openModal("loginModal"));
  document.getElementById("menuSignup").addEventListener("click", () => openModal("signupModal"));
  document.getElementById("menuChangePass").addEventListener("click", () => openModal("changePassModal"));

  // close buttons in modals
  document.querySelectorAll(".close-modal").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = btn.getAttribute("data-close");
      if (id) closeModal(id);
      else {
        // if data-close missing, traverse to parent modal id attribute
        let modal = btn.closest(".modal");
        if (modal && modal.id) modal.classList.add("hidden");
      }
    });
  });

  /* ---------- AUTH ACTIONS (localStorage simple) ---------- */
  // signup
  document.getElementById("signupSubmit").addEventListener("click", () => {
    const u = document.getElementById("signup-username").value.trim().toLowerCase();
    const p = document.getElementById("signup-password").value.trim();
    if (!u || !p) return alert("Please fill in all fields.");
    if (localStorage.getItem(u)) return alert("User already exists.");
    localStorage.setItem(u, JSON.stringify({ password: p, downloads: [] }));
    alert("Account created.");
    closeModal("signupModal");
  });

  // login
  document.getElementById("loginSubmit").addEventListener("click", () => {
    const u = document.getElementById("login-username").value.trim().toLowerCase();
    const p = document.getElementById("login-password").value.trim();
    const raw = localStorage.getItem(u);
    if (!raw) return alert("User not found.");
    const user = JSON.parse(raw);
    if (user.password !== p) return alert("Wrong password.");
    localStorage.setItem("loggedIn", u);
    // after login, close modal and optionally refresh or redirect
    closeModal("loginModal");
    // redirect to dashboard if that exists
    window.location.href = "dashboard.html";
  });

  // change password (modal)
  document.getElementById("changePassSubmit").addEventListener("click", () => {
    const logged = localStorage.getItem("loggedIn");
    if (!logged) return alert("Please login first.");
    const oldP = document.getElementById("old-pass").value.trim();
    const newP = document.getElementById("new-pass").value.trim();
    if (!oldP || !newP) return alert("Fill all fields.");
    const user = JSON.parse(localStorage.getItem(logged));
    if (user.password !== oldP) return alert("Old password incorrect.");
    user.password = newP;
    localStorage.setItem(logged, JSON.stringify(user));
    alert("Password updated.");
    closeModal("changePassModal");
  });

  // prevent double form submissions if user presses Enter in inputs
  document.querySelectorAll("input").forEach(input => {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") e.preventDefault();
    });
  });

})(); // end IIFE
