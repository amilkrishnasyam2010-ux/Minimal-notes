/*
  script.js — Minimal Notes demo logic
  - content types
  - subject/chapter listing
  - modal flow: credentials -> code entry -> resources
  - localStorage to remember unlocked chapters
*/

(() => {
  // Helper selectors
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));

  /* ---------- Demo data ----------
     Structure:
     types -> subjects -> chapters -> resource (pdf url) & access code
  */
  const DATA = {
    notes: {
      Math: [
        { id: 'm-ch1', title: 'Chapter 1: Algebra', pdf: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', code: 'MATH101' },
        { id: 'm-ch2', title: 'Chapter 2: Calculus', pdf: 'https://arxiv.org/pdf/quant-ph/0410100.pdf', code: 'MATH102' }
      ],
      Physics: [
        { id: 'p-ch1', title: 'Chapter 1: Mechanics', pdf: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf', code: 'PHYS201' },
        { id: 'p-ch2', title: 'Chapter 2: Optics', pdf: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', code: 'PHYS202' }
      ],
      Chemistry: [
        { id: 'c-ch1', title: 'Chapter 1: Organic Basics', pdf: 'https://www.orimi.com/pdf-test.pdf', code: 'CHEM301' }
      ]
    },

    qbanks: {
      Biology: [
        { id: 'b-ch1', title: 'Mock Paper 1', pdf: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', code: 'BIO101' }
      ],
      Math: [
        { id: 'mq-ch1', title: 'Short MCQs', pdf: 'https://arxiv.org/pdf/quant-ph/0410100.pdf', code: 'MQ201' }
      ]
    },

    oneword: {
      English: [
        { id: 'ow-ch1', title: 'One-Word Meanings A-D', pdf: 'https://www.orimi.com/pdf-test.pdf', code: 'OW001' },
        { id: 'ow-ch2', title: 'One-Word Meanings E-L', pdf: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', code: 'OW002' }
      ]
    }
  };

  /* ---------- State ----------
    - activeType = notes | qbanks | oneword
    - activeSubject = subject string
    - activeChapter = chapter object
  */
  let activeType = 'notes';
  let activeSubject = null;
  let activeChapter = null;

  // Elements
  const typeListEl = $('#typeList');
  const currentTypeLabel = $('#currentTypeLabel');
  const subjectsGrid = $('#subjectsGrid');
  const chaptersTitle = $('#chaptersTitle');
  const chaptersList = $('#chaptersList');
  const unlockedList = $('#unlockedList');

  // Modals / auth
  const authModal = $('#authModal');
  const resourceModal = $('#resourceModal');
  const modalBackdrop = $('#modalBackdrop');
  const modalClose = $('#modalClose');
  const modalCloseRes = $('#resourceClose');
  const modalTarget = $('#modalTarget');
  const authStep1 = $('#authStep1');
  const authStep2 = $('#authStep2');
  const mUsername = $('#mUsername');
  const mPassword = $('#mPassword');
  const accessCodeInput = $('#accessCodeInput');
  const toCodeBtn = $('#toCodeBtn');
  const verifyCodeBtn = $('#verifyCodeBtn');
  const codeMsg = $('#codeMsg');
  const resourceTitle = $('#resourceTitle');
  const pdfPreview = $('#pdfPreview');
  const downloadLinks = $('#downloadLinks');
  const resourceMeta = $('#resourceMeta');

  // small UI bits
  const usernameField = $('#username');
  const passwordField = $('#password');
  const selectionTitle = $('#selectionTitle');
  const currentTypeStrong = $('#currentTypeLabel strong');

  // localStorage key for unlocked chapters
  const LS_KEY = 'minimal-notes-unlocked';

  function getUnlocked() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }
  function setUnlocked(obj) {
    localStorage.setItem(LS_KEY, JSON.stringify(obj));
  }

  /* ---------- UI rendering ----------
     render types handled by HTML static list
  */

  function renderSubjects() {
    subjectsGrid.innerHTML = '';
    const subjects = DATA[activeType];
    Object.keys(subjects).forEach(sub => {
      const card = document.createElement('button');
      card.className = 'subject-card';
      card.setAttribute('type', 'button');
      card.tabIndex = 0;
      card.innerHTML = `<h4>${sub}</h4><p>${subjects[sub].length} chapter(s)</p>`;
      card.addEventListener('click', () => {
        activeSubject = sub;
        renderChapters();
      });
      subjectsGrid.appendChild(card);
    });
  }

  function renderChapters() {
    chaptersTitle.textContent = `Chapters — ${activeSubject}`;
    chaptersList.innerHTML = '';
    const chapters = DATA[activeType][activeSubject] || [];
    const unlocked = getUnlocked();

    chapters.forEach(ch => {
      const li = document.createElement('li');
      li.className = 'chapter-item';
      li.tabIndex = 0;
      li.innerHTML = `<div>
                        <strong>${ch.title}</strong>
                        <div class="muted">${ch.id}</div>
                      </div>
                      <div style="display:flex;gap:8px;align-items:center">
                        <span class="badge">${activeType}</span>
                        <button class="btn open-btn" data-id="${ch.id}">Open</button>
                      </div>`;
      const openBtn = li.querySelector('.open-btn');
      openBtn.addEventListener('click', () => openChapter(ch));
      li.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') openChapter(ch);
      });

      // show unlocked indicator
      const key = unlockKey(activeType, activeSubject, ch.id);
      if (unlocked[key]) {
        const tag = document.createElement('span');
        tag.className = 'badge';
        tag.style.background = 'linear-gradient(90deg,var(--success), color-mix(in srgb,var(--success) 20%))';
        tag.textContent = 'Unlocked';
        li.querySelector('div:last-child').insertBefore(tag, openBtn);
      }

      chaptersList.appendChild(li);
    });
  }

  function renderUnlockedList() {
    unlockedList.innerHTML = '';
    const unlocked = getUnlocked();
    const rows = Object.keys(unlocked).map(k => {
      // key format: type|subject|chapterId
      const [t, s, cId] = k.split('|');
      const chapter = findChapterById(t, cId);
      return { key: k, t, s, title: chapter?.title || cId };
    });
    if (rows.length === 0) {
      unlockedList.innerHTML = `<li class="muted">No chapters unlocked yet</li>`;
      return;
    }
    rows.forEach(r => {
      const li = document.createElement('li');
      li.textContent = `${r.t} • ${r.s} — ${r.title}`;
      unlockedList.appendChild(li);
    });
  }

  /* ---------- Helpers ---------- */
  function unlockKey(type, subject, chapterId) {
    return `${type}|${subject}|${chapterId}`;
  }

  function findChapterById(type, id) {
    const subjects = DATA[type] || {};
    for (const s of Object.keys(subjects)) {
      const ch = subjects[s].find(c => c.id === id);
      if (ch) return ch;
    }
    return null;
  }

  /* ---------- Chapter open flow ----------
     If chapter unlocked in localStorage -> show resources directly
     else -> open auth modal -> creds -> code -> verify -> unlock -> resources
  */
  function openChapter(chapter) {
    activeChapter = chapter;
    const key = unlockKey(activeType, activeSubject, chapter.id);
    const unlocked = getUnlocked();
    if (unlocked[key]) {
      // show resources immediately
      showResources(chapter);
      return;
    }
    // open auth modal and begin flow
    openAuthModal();
  }

  function openAuthModal() {
    authModal.setAttribute('aria-hidden', 'false');
    authStep1.classList.remove('hidden');
    authStep2.classList.add('hidden');
    modalTarget.textContent = `${activeType} • ${activeSubject} • ${activeChapter.title}`;
    mUsername.value = usernameField.value || ''; // prefill with right-hand form if present
    mPassword.value = passwordField.value || '';
    setTimeout(() => mUsername.focus(), 80);
    document.body.style.overflow = 'hidden';
  }

  function closeAuthModal() {
    authModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    // clear messages
    codeMsg.textContent = '';
    accessCodeInput.value = '';
  }

  // step actions
  toCodeBtn.addEventListener('click', () => {
    const user = mUsername.value.trim();
    const pass = mPassword.value.trim();
    if (!user || !pass) {
      codeMsg.textContent = 'Please provide both username and password to proceed.';
      return;
    }
    // proceed to code entry
    authStep1.classList.add('hidden');
    authStep2.classList.remove('hidden');
    accessCodeInput.focus();
    codeMsg.textContent = '';
  });

  document.getElementById('backToCreds').addEventListener('click', () => {
    authStep2.classList.add('hidden');
    authStep1.classList.remove('hidden');
    codeMsg.textContent = '';
    setTimeout(() => mUsername.focus(), 80);
  });

  verifyCodeBtn.addEventListener('click', () => {
    const input = accessCodeInput.value.trim();
    if (!input) {
      codeMsg.textContent = 'Please enter the access code.';
      return;
    }
    // check code
    if (input === activeChapter.code) {
      // unlock
      const key = unlockKey(activeType, activeSubject, activeChapter.id);
      const unlocked = getUnlocked();
      unlocked[key] = { time: Date.now(), user: mUsername.value.trim() || 'anonymous' };
      setUnlocked(unlocked);

      // also prefill right-hand user form so they won't type again
      if (usernameField && passwordField) {
        usernameField.value = mUsername.value.trim();
        passwordField.value = mPassword.value.trim();
      }

      closeAuthModal();
      renderChapters();
      renderUnlockedList();
      // open resource modal
      showResources(activeChapter);
    } else {
      codeMsg.textContent = 'Wrong code. Please check and try again.';
      // small shake effect (visual)
      accessCodeInput.animate([{ transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }], { duration: 220 });
    }
  });

  // modal close handlers
  modalClose.addEventListener('click', closeAuthModal);
  modalBackdrop.addEventListener('click', closeAuthModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (authModal.getAttribute('aria-hidden') === 'false') closeAuthModal();
      if (resourceModal.getAttribute('aria-hidden') === 'false') closeResourceModal();
    }
  });

  /* ---------- Resources modal ---------- */
  function showResources(chapter) {
    resourceModal.setAttribute('aria-hidden', 'false');
    resourceTitle.textContent = `${chapter.title}`;
    resourceMeta.innerHTML = `<div class="muted">Subject: <strong>${activeSubject}</strong> • Type: <strong>${activeType}</strong></div>`;
    const pdf = chapter.pdf;

    // set preview (use same URL; some servers block embedding — demo fallback below)
    pdfPreview.src = pdf;

    // download links (primary + secondary copies if desired)
    downloadLinks.innerHTML = `
      <a href="${pdf}" download="${chapter.id}.pdf">Download PDF</a>
      <a href="${pdf}" target="_blank" rel="noopener">Open in new tab</a>
    `;
    document.body.style.overflow = 'hidden';
  }

  function closeResourceModal() {
    resourceModal.setAttribute('aria-hidden', 'true');
    pdfPreview.src = '';
    document.body.style.overflow = '';
  }

  modalCloseRes.addEventListener('click', closeResourceModal);
  $('#resourceBackdrop').addEventListener('click', closeResourceModal);

  /* ---------- Type switching ---------- */
  function setActiveType(type) {
    activeType = type;
    currentTypeStrong.textContent = capitalize(type);
    // set aria-selected on tabs
    $$('.type-list li').forEach(li => {
      li.setAttribute('aria-selected', li.dataset.type === type ? 'true' : 'false');
    });
    // clear active subject & chapter
    activeSubject = null;
    activeChapter = null;
    chaptersTitle.textContent = 'Select a subject to view chapters';
    chaptersList.innerHTML = '';
    renderSubjects();
  }

  // add click handlers to type tabs
  $$('.type-list li').forEach(li => {
    li.addEventListener('click', () => {
      setActiveType(li.dataset.type);
    });
    li.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') setActiveType(li.dataset.type);
    });
  });

  /* ---------- Theme toggle ----------
     simple theme toggle persisted to localStorage
  */
  const themeToggle = $('#themeToggle');
  const THEME_KEY = 'minimal-notes-theme';
  const root = document.documentElement;
  function applyTheme(theme) {
    if (theme === 'light') root.classList.add('light');
    else root.classList.remove('light');
    themeToggle.textContent = theme === 'light' ? '🌞' : '🌙';
  }
  const storedTheme = localStorage.getItem(THEME_KEY) || 'dark';
  applyTheme(storedTheme);
  themeToggle.addEventListener('click', () => {
    const next = root.classList.contains('light') ? 'dark' : 'light';
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  });

  /* ---------- Utils ---------- */
  function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  /* ---------- Init ---------- */
  function init() {
    setActiveType('notes');
    renderUnlockedList();
    // pre-populate subjects
    renderSubjects();
    // accessible focus start
    document.querySelector('.type-list li[aria-selected="true"]')?.focus();
  }

  init();

})();
