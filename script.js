/* ------------------ QUESTION BANK PAGE ------------------ */

const QB_SUBJECTS = ["Physics", "Chemistry", "Biology", "Maths"];

const QB_CHAPTERS = {
  Physics: ["Chapter 1", "Chapter 2", "Chapter 3"],
  Chemistry: ["Chapter 1", "Chapter 2"],
  Biology: ["Chapter 1", "Chapter 2"],
  Maths: ["Chapter 1", "Chapter 2"]
};

let selectedQBSubject = "";
let selectedQBChapter = "";

/* Load subjects */
function loadQBSubjects() {
  const div = document.getElementById("qb-subjects");
  if (!div) return;

  let html = "<h2>Select a Subject</h2>";
  QB_SUBJECTS.forEach(sub => {
    html += `<button class="note-btn" onclick="openQBChapters('${sub}')">${sub}</button>`;
  });
  div.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", loadQBSubjects);

/* Show chapters */
function openQBChapters(subject) {
  selectedQBSubject = subject;

  document.getElementById("qb-chapters").classList.remove("hidden");
  const div = document.getElementById("qb-chapters");

  let html = `<h2>${subject} Chapters</h2>`;
  QB_CHAPTERS[subject].forEach(ch => {
    html += `<button class="note-btn" onclick="openQBCode('${ch}')">${ch}</button>`;
  });

  div.innerHTML = html;
}

/* Show code input */
function openQBCode(chapter) {
  selectedQBChapter = chapter;

  document.getElementById("qb-code-box").classList.remove("hidden");
}

/* Verify code */
function verifyQBCode() {
  const code = document.getElementById("qb-code").value.trim();

  if (code !== "A1") return alert("Wrong code!");

  showQBPdf();
}

/* Show PDF */
function showQBPdf() {
  const div = document.getElementById("qb-pdf-box");
  div.classList.remove("hidden");

  const fileName = `${selectedQBSubject}_${selectedQBChapter}.pdf`
    .replace(/ /g, "_");

  div.innerHTML = `
    <h2>${selectedQBSubject} - ${selectedQBChapter}</h2>
    <iframe src="pdfs/${fileName}" width="100%" height="500px"></iframe>
    <a href="pdfs/${fileName}" download>
      <button class="note-btn">Download PDF</button>
    </a>
  `;
}

/* Return to dashboard */
function goBackDashboard() {
  window.location.href = "dashboard.html";
}
