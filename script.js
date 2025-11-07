// Simulated database
const DATA = {
  notes: {
    Physics: [
      { id: 'ch1', title: 'Chapter 1: Motion', pdf: 'motion.pdf', code: 'PHY123' },
      { id: 'ch2', title: 'Chapter 2: Energy', pdf: 'energy.pdf', code: 'PHY456' }
    ],
    Chemistry: [
      { id: 'ch1', title: 'Chapter 1: Atomic Structure', pdf: 'atomic.pdf', code: 'CHEM789' }
    ]
  },
  questions: {
    Physics: [{ id: 'q1', title: 'Motion Question Bank', pdf: 'motion_q.pdf', code: 'PQ001' }]
  },
  oneword: {
    Chemistry: [{ id: 'o1', title: 'One Word: Chemistry', pdf: 'oneword_chem.pdf', code: 'ONE111' }]
  }
};

let selectedType, selectedSubject, selectedChapter;

// Option selection
document.querySelectorAll('.option').forEach(btn => {
  btn.addEventListener('click', () => {
    selectedType = btn.dataset.type;
    showSubjects();
  });
});

function showSubjects() {
  const subjects = Object.keys(DATA[selectedType]);
  const container = document.getElementById('subject-container');
  container.innerHTML = `<h3>Select Subject</h3>`;
  subjects.forEach(sub => {
    const btn = document.createElement('button');
    btn.textContent = sub;
    btn.onclick = () => showChapters(sub);
    container.appendChild(btn);
  });
  container.classList.remove('hidden');
}

function showChapters(subject) {
  selectedSubject = subject;
  const container = document.getElementById('chapter-container');
  container.innerHTML = `<h3>Select Chapter</h3>`;
  DATA[selectedType][subject].forEach(ch => {
    const btn = document.createElement('button');
    btn.textContent = ch.title;
    btn.onclick = () => openLogin(ch);
    container.appendChild(btn);
  });
  container.classList.remove('hidden');
}

function openLogin(chapter) {
  selectedChapter = chapter;
  document.getElementById('login-container').classList.remove('hidden');
}

document.getElementById('loginBtn').addEventListener('click', () => {
  const user = document.getElementById('username').value;
  const pass = document.getElementById('password').value;
  if (user && pass) {
    document.getElementById('login-container').classList.add('hidden');
    document.getElementById('code-container').classList.remove('hidden');
  } else {
    alert('Please enter both username and password.');
  }
});

document.getElementById('codeSubmit').addEventListener('click', () => {
  const enteredCode = document.getElementById('codeInput').value.trim();
  if (enteredCode === selectedChapter.code) {
    showPDF(selectedChapter);
  } else {
    alert('Incorrect code ❌');
  }
});

function showPDF(chapter) {
  document.getElementById('code-container').classList.add('hidden');
  const container = document.getElementById('pdf-container');
  container.innerHTML = `
    <h3>Available PDFs</h3>
    <a href="${chapter.pdf}" target="_blank">📄 Preview ${chapter.title}</a>
    <a href="${chapter.pdf}" download>⬇️ Download ${chapter.title}</a>
  `;
  container.classList.remove('hidden');
}
