/* ------------------------------------
   BACKEND URL (Google Apps Script)
------------------------------------ */
const BACKEND_URL = "https://script.google.com/macros/s/AKfycbyydVvtQesLYECTNOyP3UIeTUeJyxaw51SMyegrelp-T6ZDzjWDYMKmlJQVFcY70UmzEQ/exec";

/* ------------ DROPDOWN ------------- */
function toggleAccountMenu() {
  document.getElementById("account-menu").classList.toggle("hidden");
}

/* ------------ MODAL CONTROL ------------- */
function closeModal() {
  document.getElementById("auth-modal").classList.add("hidden");
  document.getElementById("change-pass-section").classList.add("hidden");
}

function openModal() {
  document.getElementById("auth-modal").classList.remove("hidden");
  document.getElementById("account-menu").classList.add("hidden");
}

/* ------------ LOGIN MODAL ------------- */
function openLoginModal() {
  openModal();
  document.getElementById("modal-title").innerText = "Login";
  document.getElementById("modal-action-btn").innerText = "Login";
  document.getElementById("confirm-password-box").classList.add("hidden");
  document.getElementById("open-change-pass").classList.remove("hidden");

  document.getElementById("modal-action-btn").onclick = SigninUser;
}

/* ------------ SIGNUP MODAL ------------- */
function openSignupModal() {
  openModal();
  document.getElementById("modal-title").innerText = "Create Account";
  document.getElementById("modal-action-btn").innerText = "Sign Up";
  document.getElementById("confirm-password-box").classList.remove("hidden");
  document.getElementById("open-change-pass").classList.add("hidden");

  document.getElementById("modal-action-btn").onclick = signupUser;
}

/* ------------ CHANGE PASSWORD ------------- */
function showChangePass() {
  document.getElementById("change-pass-section").classList.toggle("hidden");
}

function submitPasswordChange() {
  const user = document.getElementById("modal-username").value;
  const oldPass = document.getElementById("old-pass").value;
  const newPass = document.getElementById("new-pass").value;

  fetch(BACKEND_URL + "?action=changePassword&username=" + user + "&old=" + oldPass + "&new=" + newPass)
    .then(res => res.text())
    .then(alert);
}

/* ------------ SIGN IN FUNCTION ------------- */
function sign inUser() {
  const user = document.getElementById("modal-username").value;
  const pass = document.getElementById("modal-password").value;

  fetch(BACKEND_URL + "?action=login&username=" + user + "&password=" + pass)
    .then(res => res.text())
    .then(result => {
      if (result === "success") {
        alert("Logged in!");
        closeModal();
      } else {
        alert("Incorrect sign in");
      }
    });
}

/* ------------ SIGNUP FUNCTION ------------- */
function signupUser() {
  const user = document.getElementById("modal-username").value;
  const pass = document.getElementById("modal-password").value;
  const confirm = document.getElementById("modal-confirm").value;

  if (pass !== confirm) {
    alert("Passwords do not match!");
    return;
  }

  fetch(BACKEND_URL + "?action=signup&username=" + user + "&password=" + pass)
    .then(res => res.text())
    .then(alert);
}
/* ---------- OPEN / CLOSE MODALS ---------- */

function openLogin() {
  document.getElementById("login-modal").classList.remove("hidden");
}

function openSignup() {
  document.getElementById("signup-modal").classList.remove("hidden");
}

function openChangePassword() {
  document.getElementById("password-modal").classList.remove("hidden");
}

function closeModal(id) {
  document.getElementById(id).classList.add("hidden");
}
/* ---------- OPEN / CLOSE MODALS ---------- */

function openLogin() {
  document.getElementById("login-modal").classList.remove("hidden");
}

function openSignup() {
  document.getElementById("signup-modal").classList.remove("hidden");
}

function openChangePassword() {
  document.getElementById("password-modal").classList.remove("hidden");
}

function closeModal(id) {
  document.getElementById(id).classList.add("hidden");
}
// --- FIX LOGIN POPUP ---
document.getElementById("account-btn").addEventListener("click", () => {
  document.getElementById("auth-popup").classList.toggle("hidden");
});

// Open Sign-up modal
function openSignup() {
  document.getElementById("auth-popup").classList.add("hidden");
  document.getElementById("signup-modal").classList.remove("hidden");
}

// Open Login modal
function openLogin() {
  document.getElementById("auth-popup").classList.add("hidden");
  document.getElementById("login-modal").classList.remove("hidden");
}

// Close modal
function closeModal(id) {
  document.getElementById(id).classList.add("hidden");
}




