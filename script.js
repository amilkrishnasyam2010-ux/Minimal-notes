// YOUR BACKEND URL
const BACKEND_URL = "https://script.google.com/macros/s/AKfycbyydVvtQesLYECTNOyP3UIeTUeJyxaw51SMyegrelp-T6ZDzjWDYMKmlJQVFcY70UmzEQ/exec";

// SHOW / HIDE MODALS
function openLogin() {
  document.getElementById("login-modal").classList.remove("hidden");
}

function openSignup() {
  document.getElementById("signup-modal").classList.remove("hidden");
}

function openChangePass() {
  closeModal("login-modal");
  document.getElementById("change-pass-modal").classList.remove("hidden");
}

function closeModal(id) {
  document.getElementById(id).classList.add("hidden");
}

function switchToSignup() {
  closeModal("login-modal");
  openSignup();
}

function switchToLogin() {
  closeModal("signup-modal");
  openLogin();
}

// SIGNUP USER
async function signupUser() {
  let username = document.getElementById("signup-username").value.trim().toLowerCase();
  let password = document.getElementById("signup-password").value.trim();

  if (!username || !password) return alert("Fill all fields!");

  const res = await fetch(BACKEND_URL + `?action=signup&username=${username}&password=${password}`);
  const result = await res.text();

  alert(result);
  if (result.includes("success")) closeModal("signup-modal");
}

// LOGIN USER
async function loginUser() {
  let username = document.getElementById("login-username").value.trim().toLowerCase();
  let password = document.getElementById("login-password").value.trim();

  const res = await fetch(BACKEND_URL + `?action=login&username=${username}&password=${password}`);
  const result = await res.text();

  if (result.includes("success")) {
    alert("Login successful!");
    localStorage.setItem("user", username);
    window.location.href = "dashboard.html";
  } else {
    alert("Incorrect username or password!");
  }
}

// CHANGE PASSWORD
async function changePassword() {
  let username = localStorage.getItem("user");
  let oldPass = document.getElementById("old-pass").value;
  let newPass = document.getElementById("new-pass").value;

  const res = await fetch(
    BACKEND_URL + `?action=changepassword&username=${username}&old=${oldPass}&new=${newPass}`
  );

  const result = await res.text();
  alert(result);

  if (result.includes("success")) closeModal("change-pass-modal");
}
function openAccountMenu() {
  document.getElementById("account-menu").classList.toggle("hidden");
}

function openLoginModal() {
  closeDropdown();
  document.getElementById("login-modal").classList.remove("hidden");
}

function openSignupModal() {
  closeDropdown();
  document.getElementById("signup-modal").classList.remove("hidden");
}

function closeDropdown() {
  document.getElementById("account-menu").classList.add("hidden");
}

document.addEventListener("click", function (event) {
  const dropdown = document.getElementById("account-menu");
  const button = document.querySelector(".nav-btn");

  if (!dropdown.contains(event.target) && !button.contains(event.target)) {
    dropdown.classList.add("hidden");
  }
});
function openLoginModal() {
  document.getElementById("login-modal").classList.remove("hidden");
}

function closeLoginModal() {
  document.getElementById("login-modal").classList.add("hidden");
}

function openSignupModal() {
  document.getElementById("signup-modal").classList.remove("hidden");
}

function closeSignupModal() {
  document.getElementById("signup-modal").classList.add("hidden");
}

function closeChangePassModal() {
  document.getElementById("change-password-modal").classList.add("hidden");
}

function openChangePassModal() {
  document.getElementById("change-password-modal").classList.remove("hidden");
}
function switchToSignup() {
  closeLoginModal();
  openSignupModal();
}

function switchToLogin() {
  closeSignupModal();
  closeChangePassModal();
  openLoginModal();
}

function switchToChangePass() {
  closeLoginModal();
  openChangePassModal();
}



