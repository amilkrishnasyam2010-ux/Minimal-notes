/**************** SETTINGS ****************/
const BACKEND_URL =
  "https://script.google.com/macros/s/AKfycbyydVvtQesLYECTNOyP3UIeTUeJyxaw51SMyegrelp-T6ZDzjWDYMKmlJQVFcY70UmzEQ/exec";

/**************** UI ELEMENTS ****************/
const accountBtn = document.getElementById("account-btn");
const dropdown = document.getElementById("account-dropdown");

const loginModal = document.getElementById("login-modal");
const signupModal = document.getElementById("signup-modal");
const changePassModal = document.getElementById("change-pass-modal");

/**************** DROPDOWN ****************/
accountBtn.addEventListener("click", () => {
  dropdown.classList.toggle("hidden");
});

/**************** OPEN MODALS ****************/
document.getElementById("open-login").onclick = () => {
  dropdown.classList.add("hidden");
  loginModal.classList.remove("hidden");
};

document.getElementById("open-signup").onclick = () => {
  dropdown.classList.add("hidden");
  signupModal.classList.remove("hidden");
};

document.getElementById("open-change-pass").onclick = () => {
  dropdown.classList.add("hidden");
  changePassModal.classList.remove("hidden");
};

/**************** CLOSE MODALS ****************/
document.querySelectorAll(".close-modal").forEach(close => {
  close.addEventListener("click", (e) => {
    const target = e.target.getAttribute("data-close");
    document.getElementById(target).classList.add("hidden");
  });
});

/**************** AUTH FUNCTIONS ****************/
async function signupUser() {
  let user = document.getElementById("signup-user").value.trim().toLowerCase();
  let pass = document.getElementById("signup-pass").value.trim();

  if (!user || !pass) return alert("Fill all fields.");

  const res = await fetch(BACKEND_URL + "?action=signup&user=" + user + "&pass=" + pass);
  const msg = await res.text();

  alert(msg);
}

async function loginUser() {
  let user = document.getElementById("login-user").value.trim().toLowerCase();
  let pass = document.getElementById("login-pass").value.trim();

  const res = await fetch(BACKEND_URL + "?action=login&user=" + user + "&pass=" + pass);
  const msg = await res.text();

  if (msg === "success") {
    localStorage.setItem("loggedIn", user);
    window.location.href = "dashboard.html";
  } else {
    alert(msg);
  }
}

async function changePassword() {
  let user = localStorage.getItem("loggedIn");
  if (!user) return alert("Please login first.");

  let oldp = document.getElementById("old-pass").value.trim();
  let newp = document.getElementById("new-pass").value.trim();

  const res = await fetch(
    BACKEND_URL + `?action=changePass&user=${user}&old=${oldp}&new=${newp}`
  );

  const msg = await res.text();
  alert(msg);
}
