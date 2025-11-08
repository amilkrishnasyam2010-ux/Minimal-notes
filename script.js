// Minimal Notes Data Configuration
const DATA = {
  notes: {
    Physics: [
      { id: 'phy1', title: 'Chapter 1', pdf: 'phy1.pdf', code: 'PHY001' },
      { id: 'phy2', title: 'Chapter 2', pdf: 'phy2.pdf', code: 'PHY002' },
      { id: 'phy3', title: 'Chapter 3', pdf: 'phy3.pdf', code: 'PHY003' },
      { id: 'phy4', title: 'Chapter 4', pdf: 'phy4.pdf', code: 'PHY004' },
      { id: 'phy5', title: 'Chapter 5', pdf: 'phy5.pdf', code: 'PHY005' },
      { id: 'phy6', title: 'Chapter 6', pdf: 'phy6.pdf', code: 'PHY006' },
      { id: 'phy7', title: 'Chapter 7', pdf: 'phy7.pdf', code: 'PHY007' }
    ],
    Chemistry: [
      { id: 'chem1', title: 'Chapter 1', pdf: 'chem1.pdf', code: 'CHEM001' },
      { id: 'chem2', title: 'Chapter 2', pdf: 'chem2.pdf', code: 'CHEM002' },
      { id: 'chem3', title: 'Chapter 3', pdf: 'chem3.pdf', code: 'CHEM003' },
      { id: 'chem4', title: 'Chapter 4', pdf: 'chem4.pdf', code: 'CHEM004' },
      { id: 'chem5', title: 'Chapter 5', pdf: 'chem5.pdf', code: 'CHEM005' },
      { id: 'chem6', title: 'Chapter 6', pdf: 'chem6.pdf', code: 'CHEM006' },
      { id: 'chem7', title: 'Chapter 7', pdf: 'chem7.pdf', code: 'CHEM007' }
    ],
    Biology: [
      { id: 'bio1', title: 'Chapter 1', pdf: 'bio1.pdf', code: 'BIO001' },
      { id: 'bio2', title: 'Chapter 2', pdf: 'bio2.pdf', code: 'BIO002' },
      { id: 'bio3', title: 'Chapter 3', pdf: 'bio3.pdf', code: 'BIO003' },
      { id: 'bio4', title: 'Chapter 4', pdf: 'bio4.pdf', code: 'BIO004' },
      { id: 'bio5', title: 'Chapter 5', pdf: 'bio5.pdf', code: 'BIO005' },
      { id: 'bio6', title: 'Chapter 6', pdf: 'bio6.pdf', code: 'BIO006' }
    ],
    History: [
      { id: 'his1', title: 'Chapter 1', pdf: 'his1.pdf', code: 'HIS001' },
      { id: 'his2', title: 'Chapter 2', pdf: 'his2.pdf', code: 'HIS002' },
      { id: 'his3', title: 'Chapter 3', pdf: 'his3.pdf', code: 'HIS003' },
      { id: 'his4', title: 'Chapter 4', pdf: 'his4.pdf', code: 'HIS004' },
      { id: 'his5', title: 'Chapter 5', pdf: 'his5.pdf', code: 'HIS005' },
      { id: 'his6', title: 'Chapter 6', pdf: 'his6.pdf', code: 'HIS006' },
      { id: 'his7', title: 'Chapter 7', pdf: 'HIS007.pdf', code: 'HIS007' },
      { id: 'his8', title: 'Chapter 8', pdf: 'his8.pdf', code: 'HIS008' },
      { id: 'his9', title: 'Chapter 9', pdf: 'his9.pdf', code: 'HIS009' }
    ],
    Geography: [
      { id: 'geo1', title: 'Chapter 1', pdf: 'geo1.pdf', code: 'GEO001' },
      { id: 'geo2', title: 'Chapter 2', pdf: 'geo2.pdf', code: 'GEO002' },
      { id: 'geo3', title: 'Chapter 3', pdf: 'geo3.pdf', code: 'GEO003' },
      { id: 'geo4', title: 'Chapter 4', pdf: 'geo4.pdf', code: 'GEO004' },
      { id: 'geo5', title: 'Chapter 5', pdf: 'geo5.pdf', code: 'GEO005' },
      { id: 'geo6', title: 'Chapter 6', pdf: 'geo6.pdf', code: 'GEO006' },
      { id: 'geo7', title: 'Chapter 7', pdf: 'geo7.pdf', code: 'GEO007' },
      { id: 'geo8', title: 'Chapter 8', pdf: 'geo8.pdf', code: 'GEO008' }
    ]
  }
};

let selectedType = 'notes';
let selectedSubject;
let selectedChapter;

// Show subjects when the page loads
window.onload = () => showSubjects();

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

