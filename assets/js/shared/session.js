// There are no real accounts. The demo sign-in remembers a sample person in this browser
// and nothing else. Replace this file when you connect a real sign-in.
const SESSION_KEY = 'plain-board-session';

// Two sample accounts, because a manager and a member of the team are shown different things.
const DEMO_USERS = {
  manager: {
    name: 'Rowan Adeyemi',
    role: 'Service manager',
    team: 'Support',
    manager: true,
    person: null
  },
  member: {
    name: 'Ada Nkemelu',
    role: 'Service desk',
    team: 'Support',
    manager: false,
    person: 'Ada Nkemelu'
  }
};

function readSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
}

function startSession(user) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return true;
  } catch {
    return false;
  }
}

const startDemoSession = (kind) => startSession(DEMO_USERS[kind] || DEMO_USERS.member);

function endSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // Nothing to clear if storage is blocked.
  }
}

// Light or dark. No choice stored means the operating system decides, which is why
// this runs in the <head> — setting it later would flash the wrong theme first.
const THEME_KEY = 'plain-board-theme';

function readTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    return saved === 'light' || saved === 'dark' ? saved : null;
  } catch {
    return null;
  }
}

function applyTheme(theme) {
  if (theme) document.documentElement.dataset.theme = theme;
  else delete document.documentElement.dataset.theme;
}

function setTheme(theme) {
  try {
    if (theme) localStorage.setItem(THEME_KEY, theme);
    else localStorage.removeItem(THEME_KEY);
  } catch {
    // The page still works, it just will not remember the choice.
  }
  applyTheme(theme);
}

applyTheme(readTheme());

// Runs in the <head> so nobody sees a flash of the wrong page.
const pageType = document.documentElement.dataset.page;
const signedIn = readSession();
// The signed-in pages live in pages/, so the way back out is one level up.
const SIGN_IN_PAGE = '../index.html';
const HOME_PAGE = pageType === 'app' ? 'today.html' : 'pages/today.html';

if (pageType === 'app' && !signedIn) location.replace(SIGN_IN_PAGE);
if (pageType === 'auth' && signedIn) location.replace(HOME_PAGE);
// Pages marked manager-only send everybody else back to the landing page.
if (document.documentElement.dataset.access === 'manager' && signedIn && !signedIn.manager) location.replace('today.html');
