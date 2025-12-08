/* script.js - full app logic (place at repo root) */

const BACKEND_URL = "https://script.google.com/macros/s/AKfycbyydVvtQesLYECTNOyP3UIeTUeJyxaw51SMyegrelp-T6ZDzjWDYMKmlJQVFcY70UmzEQ/exec";

/* ---------- Config ---------- */
const SUBJECTS = { Physics:7, Chemistry:7, Biology:6, Geography:8, History:9 };
const QB_SUBJECTS = { Physics:7, Chemistry:7, Biology:6, Geography:8, History:9, Maths:10 };
const ONEWORD_SUBJECTS = Object.assign({}, SUBJECTS);

// Set of QB files that are free
const FREE_QB_FILES = new Set(["Maths_6_QB","Maths_7_QB","History_4_QB","Physics_5_QB"]);

/* ---------- Helpers ---------- */
function el(id){ return document.getElementById(id); }
function safeEncode(str){ return btoa(str).replace(/=+$/,"").toUpperCase(); }
function generateAccessCode(key){ return "MN"+safeEncode(key).slice(0,5); }

/* ---------- Account dropdown & modals ---------- */
function toggleAccountMenu(){ const m = el("account-menu"); if(m) m.classList.toggle("hidden"); }
function closeAllModals(){ ["login-modal","signup-modal"].forEach(id=>{ const n=el(id); if(n) n.classList.add("hidden"); }); }
function openLogin(){ closeAllModals(); if(el("login-modal")) el("login-modal").classList.remove("hidden"); if(el("account-menu")) el("account-menu").classList.add("hidden"); }
function openSignup(){ closeAllModals(); if(el("signup-modal")) el("signup-modal").classList.remove("hidden"); if(el("account-menu")) el("account-menu").classList.add("hidden"); }

/* ---------- Auth (localStorage) ---------- */
function signupUser(){
  const u=(el("signup-username")?.value||"").trim().toLowerCase();
  const p=(el("signup-password")?.value||"").trim();
  if(!u||!p) return alert("Please fill all fields.");
  if(localStorage.getItem(u)) return alert("User exists.");
  localStorage.setItem(u, JSON.stringify({ password:p, downloads:[] }));
  alert("Account created.");
  closeAllModals();
}
function loginUser(){
  const u=(el("login-username")?.value||"").trim().toLowerCase();
  const p=(el("login-password")?.value||"").trim();
  if(!u||!p) return alert("Please fill all fields.");
  const raw = localStorage.getItem(u);
  if(!raw) return alert("User not found.");
  const data = JSON.parse(raw);
  if(data.password!==p) return alert("Wrong password.");
  localStorage.setItem("loggedIn", u);
  window.location.href = "./dashboard.html";
}
function logoutUser(){ localStorage.removeItem("loggedIn"); window.location.href="./index.html"; }

function showChangePass(){ const c=el("change-pass-box"); if(c) c.classList.toggle("hidden"); }
function changePassword(){
  const user=(el("login-username")?.value||"").trim().toLowerCase();
  const oldp=(el("old-pass")?.value||"").trim();
  const newp=(el("new-pass")?.value||"").trim();
  if(!user||!oldp||!newp) return alert("Fill fields.");
  const raw=localStorage.getItem(user); if(!raw) return alert("User not found");
  const data=JSON.parse(raw); if(data.password!==oldp) return alert("Old password wrong");
  data.password=newp; localStorage.setItem(user, JSON.stringify(data)); alert("Password changed."); closeAllModals();
}

/* ---------- Dashboard ---------- */
function populateDashboard(){
  const user = localStorage.getItem("loggedIn");
  if(!user) { window.location.href="./index.html"; return; }
  if(el("user-name")) el("user-name").innerText = user;
  const raw = localStorage.getItem(user);
  const list = el("downloaded-list");
  if(!list) return;
  if(!raw) { list.innerHTML="<li>No notes downloaded yet.</li>"; return; }
  const data = JSON.parse(raw);
  list.innerHTML = (data.downloads && data.downloads.length) ? data.downloads.map(d=>`<li>${d}</li>`).join("") : "<li>No notes downloaded yet.</li>";
}

/* ---------- Navigation ---------- */
function goTo(section){ localStorage.setItem("section", section); window.location.href = "./notes.html"; }
function goBackDashboard(){ window.location.href = "./dashboard.html"; }

/* ---------- Notes / Questions / OneWord flow ---------- */
function currentPage(){ return window.location.pathname.split("/").pop(); }

function buildSubjectsForPage(){
  const page = currentPage();
  const section = localStorage.getItem("section") || "notes";
  if(page==="notes.html"){
    if(section==="questions") renderSubjects(QB_SUBJECTS,"questions");
    else if(section==="oneword") renderSubjects(ONEWORD_SUBJECTS,"oneword");
    else renderSubjects(SUBJECTS,"notes");
  } else if(page==="questions.html"){ renderSubjects(QB_SUBJECTS,"questions","qb-subjects"); }
  else if(page==="oneword.html"){ renderSubjects(ONEWORD_SUBJECTS,"oneword","oneword-subjects"); }
}

function renderSubjects(map, type, containerId){
  const container = containerId ? el(containerId) : el("subject-container");
  if(!container) return;
  container.innerHTML = `<h2>Select a Subject</h2>`;
  const wrapper = document.createElement("div"); wrapper.className="subject-buttons";
  Object.keys(map).forEach(sub=>{
    const btn = document.createElement("button");
    btn.className="subject-btn";
    btn.textContent=sub;
    btn.onclick = ()=> showChapters(sub,type);
    wrapper.appendChild(btn);
  });
  container.appendChild(wrapper);
}

function showChapters(subject, type){
  const counts = (type==="questions")?QB_SUBJECTS:(type==="oneword"?ONEWORD_SUBJECTS:SUBJECTS);
  const chapterCount = counts[subject];
  if(el("subject-container")) el("subject-container").classList.add("hidden");
  const chapterDiv = el("chapter-container") || el("qb-chapters") || el("oneword-chapters");
  if(!chapterDiv) return;
  chapterDiv.innerHTML = `<h3>${subject} - Select Chapter</h3>`;
  for(let i=1;i<=chapterCount;i++){
    const b = document.createElement("button"); b.className="chapter-btn"; b.textContent=`Chapter ${i}`;
    b.onclick = ()=> { const fileKey = buildFileKey(subject,i,type); askCode(fileKey,type); };
    chapterDiv.appendChild(b);
  }
  chapterDiv.classList.remove("hidden");
  chapterDiv.scrollIntoView({behavior:"smooth"});
}

function buildFileKey(subject, chapter, type){
  if(type==="questions") return `${subject}_${chapter}_QB`;
  if(type==="oneword") return `${subject}_${chapter}_OW`;
  return `${subject}_${chapter}`;
}

function askCode(fileKey, type){
  localStorage.setItem("pendingFile", fileKey);
  localStorage.setItem("pendingType", type);
  if(el("chapter-container")) el("chapter-container").classList.add("hidden");
  if(el("code-container")) el("code-container").classList.remove("hidden");
  if(el("qb-code-box")) el("qb-code-box").classList.remove("hidden");
  console.log("Expected code:", generateAccessCode(fileKey));
}

function verifyCode(){
  const entered = (el("code-input")?.value || el("qb-code")?.value || "").trim();
  const fileKey = localStorage.getItem("pendingFile");
  const type = localStorage.getItem("pendingType") || "notes";
  if(!fileKey) return alert("No file selected.");
  if(type==="questions" && FREE_QB_FILES.has(fileKey)){ showPDF(fileKey,type); return; }
  const expected = generateAccessCode(fileKey);
  if(entered === expected) showPDF(fileKey,type);
  else alert("Invalid code");
}

function showPDF(fileKey, type){
  if(el("code-container")) el("code-container").classList.add("hidden");
  if(el("qb-code-box")) el("qb-code-box").classList.add("hidden");
  const pdfDiv = el("pdf-container") || el("qb-pdf-box") || el("oneword-pdf-box");
  if(!pdfDiv) return;
  const fname = `pdfs/${fileKey}.pdf`;
  pdfDiv.innerHTML = `<h3>Access Granted</h3><p>${fileKey}</p><p><a href="./${fname}" target="_blank">📄 Preview</a> &nbsp; <a href="./${fname}" download>⬇️ Download</a></p><p><button onclick="goBackToSubjects()">Back to subjects</button></p>`;
  pdfDiv.classList.remove("hidden");
  const user = localStorage.getItem("loggedIn");
  if(user) {
    const raw = localStorage.getItem(user) || "{}";
    const data = raw ? JSON.parse(raw) : { password:"", downloads:[] };
    data.downloads = data.downloads || [];
    if(!data.downloads.includes(fileKey)) { data.downloads.push(fileKey); localStorage.setItem(user, JSON.stringify(data)); }
  }
}

function goBackToSubjects(){
  if(el("pdf-container")) el("pdf-container").classList.add("hidden");
  if(el("qb-pdf-box")) el("qb-pdf-box").classList.add("hidden");
  if(el("oneword-pdf-box")) el("oneword-pdf-box").classList.add("hidden");
  if(el("subject-container")) el("subject-container").classList.remove("hidden");
  if(el("qb-chapters")) el("qb-chapters").classList.add("hidden");
  if(el("chapter-container")) el("chapter-container").classList.add("hidden");
  if(el("qb-code-box")) el("qb-code-box").classList.add("hidden");
}

/* ---------- Auto-init per page ---------- */
document.addEventListener("DOMContentLoaded", ()=>{
  document.querySelectorAll(".close-modal").forEach(btn=>btn.addEventListener("click", closeAllModals));
  const page = currentPage();
  if(page==="dashboard.html") populateDashboard();
  if(["notes.html","questions.html","oneword.html"].includes(page)) buildSubjectsForPage();
  const acc = document.querySelector(".account-btn"); if(acc) acc.addEventListener("click", toggleAccountMenu);
});
