/* ---------------- BACKEND URL ----------------
 Replace with your deployed Google Apps Script web app if needed.
*/
const BACKEND_URL = "https://script.google.com/macros/s/AKfycbwFEbrYyAoOIzQ0cIJBAFZRDWSM5HjD6I2_KcSVObupz8ER1O6mjllhqAEpH0Ohv0eKHQ/exec";

/* IIFE + DOMContentLoaded to ensure elements exist */
(function () {
  document.addEventListener("DOMContentLoaded", () => {
    /* Elements */
    const accountBtn = document.getElementById("accountBtn");
    const accountMenu = document.getElementById("accountMenu");
    const loginModal = document.getElementById("loginModal");
    const signupModal = document.getElementById("signupModal");
    const changePassModal = document.getElementById("changePassModal");

    /* Safety checks */
    if (!accountBtn || !accountMenu) {
      // nothing to wire (page might be notes.html/dashboard.html)
    } else {
      accountBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        accountMenu.classList.toggle("hidden");
        const expanded = accountMenu.classList.contains("hidden") ? "false" : "true";
        accountBtn.setAttribute("aria-expanded", expanded);
      });

      // menu -> modals
      const menuLogin = document.getElementById("menuLogin");
      const menuSignup = document.getElementById("menuSignup");
      const menuChangePass = document.getElementById("menuChangePass");

      if (menuLogin) menuLogin.addEventListener("click", () => openModal("loginModal"));
      if (menuSignup) menuSignup.addEventListener("click", () => openModal("signupModal"));
      if (menuChangePass) menuChangePass.addEventListener("click", () => openModal("changePassModal"));
    }

    // close when clicking outside menus/modals
    document.addEventListener("click", (e) => {
      const target = e.target;
      if (accountMenu && (accountBtn.contains(target) || accountMenu.contains(target))) {
        // clicked account area -> ignore (already handled)
      } else {
        if (accountMenu) accountMenu.classList.add("hidden");
      }
      // if clicked inside modal-content do nothing; otherwise hide modals
      if (!(target.closest && target.closest(".modal-content"))) {
        document.querySelectorAll(".modal").forEach(m => m.classList.add("hidden"));
      }
    });

    // wire close buttons
    document.querySelectorAll(".close-modal").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-close");
        if (id) {
          const modal = document.getElementById(id);
          if (modal) modal.classList.add("hidden");
        } else {
          const modal = btn.closest(".modal");
          if (modal) modal.classList.add("hidden");
        }
      });
    });

    // prevent Enter from submitting/refreshing (simple)
    document.querySelectorAll("input").forEach(inp => {
      inp.addEventListener("keydown", (e) => {
        if (e.key === "Enter") e.preventDefault();
      });
    });

    /* ---------- AUTH: Signup/Login/Change Password ---------- */

    const signupBtn = document.getElementById("signupSubmit");
    if (signupBtn) signupBtn.addEventListener("click", () => {
      const u = (document.getElementById("signup-username")?.value || "").trim().toLowerCase();
      const p = (document.getElementById("signup-password")?.value || "").trim();
      if (!u || !p) return alert("Please fill in all fields.");
      if (localStorage.getItem(u)) return alert("User already exists.");
      localStorage.setItem(u, JSON.stringify({ password: p, downloads: [] }));
      alert("Account created. You can now log in.");
      closeAllModals();
    });

    const loginBtn = document.getElementById("loginSubmit");
    if (loginBtn) loginBtn.addEventListener("click", () => {
      const u = (document.getElementById("login-username")?.value || "").trim().toLowerCase();
      const p = (document.getElementById("login-password")?.value || "").trim();
      if (!u || !p) return alert("Please fill in all fields.");
      const raw = localStorage.getItem(u);
      if (!raw) return alert("User not found.");
      const user = JSON.parse(raw);
      if (user.password !== p) return alert("Wrong password.");
      localStorage.setItem("loggedIn", u);
      closeAllModals();
      window.location.href = "dashboard.html";
    });

    const changePassBtn = document.getElementById("changePassSubmit");
    if (changePassBtn) changePassBtn.addEventListener("click", () => {
      const logged = localStorage.getItem("loggedIn");
      if (!logged) return alert("Please log in first.");
      const oldP = (document.getElementById("old-pass")?.value || "").trim();
      const newP = (document.getElementById("new-pass")?.value || "").trim();
      if (!oldP || !newP) return alert("Fill all fields.");
      const user = JSON.parse(localStorage.getItem(logged));
      if (user.password !== oldP) return alert("Old password incorrect.");
      user.password = newP;
      localStorage.setItem(logged, JSON.stringify(user));
      alert("Password updated.");
      closeAllModals();
    });

    /* ---------- Helper functions ---------- */

    window.openModal = function (id) {
      closeAllModals();
      accountMenu?.classList.add("hidden");
      const modal = document.getElementById(id);
      if (modal) modal.classList.remove("hidden");
    };

    window.closeModal = function (id) {
      const modal = document.getElementById(id);
      if (modal) modal.classList.add("hidden");
    };

    function closeAllModals() {
      document.querySelectorAll(".modal").forEach(m => m.classList.add("hidden"));
    }

    /* ---------- Page-specific logic (dashboard/notes) ---------- */

    // Dashboard page: show username and downloads
    if (window.location.pathname.endsWith("dashboard.html")) {
      const u = localStorage.getItem("loggedIn");
      if (!u) {
        window.location.href = "index.html";
      } else {
        // fill user-specific items if elements exist
        const nameEl = document.getElementById("user-name");
        if (nameEl) nameEl.innerText = u;

        const dataRaw = localStorage.getItem(u);
        if (dataRaw) {
          const data = JSON.parse(dataRaw);
          const listEl = document.getElementById("downloaded-list");
          if (listEl) {
            listEl.innerHTML = (data.downloads && data.downloads.length)
              ? data.downloads.map(x => `<li>${x}</li>`).join("")
              : "<li>No downloads yet.</li>";
          }
        }
      }
    }

    // Notes page: build subjects and chapters if elements exist
    if (window.location.pathname.endsWith("notes.html")) {
      const section = localStorage.getItem("section") || "notes";
      const sectionTitle = document.getElementById("section-title");
      if (sectionTitle) sectionTitle.innerText = section.charAt(0).toUpperCase() + section.slice(1);

      const subjectContainer = document.getElementById("subject-container");
      const subjects = {
        Physics: 7,
        Chemistry: 7,
        Biology: 6,
        Geography: 8,
        History: 9,
        Maths: 10 // will only be displayed when section === 'questions'
      };

      Object.keys(subject
