// The frame around every page: sidebar, top bar and the content area.
// Also holds the app's state and the functions that switch pages.

const app = $('#app');

// Everything the screen currently depends on
const state = {
  user: null, // username typed on the login screen
  page: 'dashboard',

  // filters for the list pages
  search: '',
  species: '',
  status: '',
  vaccine: '',
  pageNumber: 1,
  tab: 'Available', // Adoption tabs

  // Appointments calendar
  selectedDate: TODAY_ISO,
  calendar: { year: TODAY.getFullYear(), month: TODAY.getMonth() },
};

const NAV_ITEMS = [
  { section: 'MAIN MENU' },
  { page: 'dashboard', icon: '📊', label: 'Dashboard' },
  { page: 'pets', icon: '🐾', label: 'Pet Records' },
  { page: 'appointments', icon: '📅', label: 'Appointments' },
  { page: 'vaccinations', icon: '💉', label: 'Vaccinations' },
  { page: 'adoption', icon: '🏠', label: 'Adoption' },
  { section: 'SYSTEM' },
  { page: 'users', icon: '👥', label: 'Users' },
  { page: 'settings', icon: '⚙️', label: 'Settings' },
];

// Which function draws which page (filled in by main.js after every script has loaded)
let pageRenderers = {};

// ---------- Logged-in user ----------

// There are no real accounts yet. If the username matches someone in the
// Users list we use their details, otherwise we make a name from what was typed.
function getCurrentUser() {
  const typed = state.user || 'user';
  const account = db.users.find((u) => u.username === typed.toLowerCase());

  const fullName = account ? account.name : typed[0].toUpperCase() + typed.slice(1);
  const role = account ? account.role : 'Administrator';
  const words = fullName.split(/\s+/);
  const lastWord = words[words.length - 1];

  return {
    name: fullName,
    role,
    // "Dr. Maria Rivera" -> "Dr. Rivera", "Admin" -> "Admin"
    shortName: words[0] === 'Dr.' ? `Dr. ${lastWord}` : words[0],
    // "Dr. Maria Rivera" -> "DR", "Admin" -> "AD"
    initials: (words.length > 1 ? words[0][0] + lastWord[0] : words[0].slice(0, 2)).toUpperCase(),
  };
}

// ---------- Drawing the frame ----------

function buildLayout() {
  const user = getCurrentUser();

  const navLinks = NAV_ITEMS.map((item) => {
    if (item.section) return `<div class="nav-label">${item.section}</div>`;
    return `<button class="nav-link" data-go="${item.page}"><i>${item.icon}</i>${item.label}</button>`;
  }).join('');

  app.innerHTML = `
    <div class="app">
      <aside class="sidebar">
        <div class="sidebar-brand">
          <span class="sidebar-logo">${pawIcon('#fff')}</span>
          <span>
            <b>Olongapo City</b>
            <small>Veterinary Office</small>
          </span>
        </div>

        <nav>${navLinks}</nav>

        <div class="sidebar-user">
          <span class="avatar">${esc(user.initials)}</span>
          <span class="sidebar-user-text">
            <b>${esc(user.shortName)}</b>
            <small>${esc(user.role)}</small>
          </span>
          <button data-action="logout" title="Log out" aria-label="Log out">🚪</button>
        </div>
      </aside>

      <div class="overlay" data-menu-toggle></div>

      <div class="main">
        <header class="topbar">
          <button class="menu-button" data-menu-toggle aria-label="Menu">☰</button>

          <div class="topbar-title">
            <h1 id="page-title"></h1>
            <small>${formatLongDate(TODAY)}</small>
          </div>

          <div class="topbar-right">
            <div class="quick-search">
              <span>🔍</span>
              <input id="quick-search" placeholder="Quick search..." aria-label="Quick search">
            </div>
            <button class="bell" data-action="notifications" aria-label="Notifications">🔔<i></i></button>
            <div class="current-user">
              <span class="avatar">${esc(user.initials)}</span>
              <span class="current-user-text">
                <b>${esc(user.shortName)}</b>
                <small>${esc(user.role)}</small>
              </span>
            </div>
          </div>
        </header>

        <main class="page" id="content"></main>
      </div>
    </div>`;
}

// Draw the current page (and the frame too if it isn't on screen yet)
function render() {
  if (!state.user) {
    showLogin();
    return;
  }
  if (!$('.app')) buildLayout();

  const currentItem = NAV_ITEMS.find((item) => item.page === state.page);
  $('#page-title').textContent = currentItem.label;
  $$('.nav-link').forEach((link) => link.classList.toggle('active', link.dataset.go === state.page));

  pageRenderers[state.page]();
}

// Switch to another page and clear the filters
function go(page, search = '') {
  state.page = page;
  state.search = search;
  state.species = '';
  state.status = '';
  state.vaccine = '';
  state.pageNumber = 1;
  state.tab = 'Available';
  state.selectedDate = TODAY_ISO;
  state.calendar = { year: TODAY.getFullYear(), month: TODAY.getMonth() };

  $('.app')?.classList.remove('menu-open');
  render();
  window.scrollTo(0, 0);
}

// Draw the current page again (after a filter or a record changed).
// Typing in the search box redraws the page, so put the cursor back afterwards.
function refresh() {
  const focused = document.activeElement;
  const focusedId = focused && focused.id;
  const cursor = focused && focused.selectionStart;

  pageRenderers[state.page]();

  if (!focusedId) return;
  const sameElement = document.getElementById(focusedId);
  if (!sameElement) return;
  sameElement.focus();
  try {
    sameElement.setSelectionRange(cursor, cursor);
  } catch (error) {
    // select boxes have no cursor
  }
}

// Small message that appears at the bottom of the screen for a moment
function showToast(message) {
  let toast = $('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.append(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 2800);
}
