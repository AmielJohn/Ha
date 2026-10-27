// Small helper functions used all over the app

// ---------- DOM ----------

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

// Escape text before putting it inside HTML so typed names can't break the page
function esc(value) {
  const replacements = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(value ?? '').replace(/[&<>"']/g, (char) => replacements[char]);
}

// ---------- Dates ----------
// Dates are stored as "2026-08-01" and times as "14:30".
// The functions below turn them into text people can read.

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MS_PER_DAY = 24 * 60 * 60 * 1000;

function toISODate(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function parseISODate(text) {
  const [year, month, day] = text.split('-').map(Number);
  return new Date(year, month - 1, day);
}

const TODAY_ISO = toISODate(TODAY);

// "2026-08-01" -> "Aug 1, 2026"
function formatDate(text) {
  if (!text) return '—';
  const date = parseISODate(text);
  return `${MONTH_NAMES[date.getMonth()].slice(0, 3)} ${date.getDate()}, ${date.getFullYear()}`;
}

// Date object -> "Saturday, August 1, 2026"
function formatLongDate(date) {
  return `${WEEKDAY_NAMES[date.getDay()]}, ${MONTH_NAMES[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

// "14:30" -> "2:30 PM"
function formatTime(text) {
  if (!text) return '—';
  const [hours, minutes] = text.split(':').map(Number);
  const hour12 = hours % 12 || 12;
  const suffix = hours < 12 ? 'AM' : 'PM';
  return `${hour12}:${String(minutes).padStart(2, '0')} ${suffix}`;
}

function plural(count, word) {
  return `${count} ${word}${count === 1 ? '' : 's'}`;
}

function percentOf(part, total) {
  return total ? Math.round((part / total) * 100) : 0;
}

function compareByDateTime(a, b) {
  return (a.date + a.time).localeCompare(b.date + b.time);
}

// ---------- Pets and vaccine status ----------

// Appointments and vaccinations only store the pet's name, so look the pet up here
function findPet(name) {
  return db.pets.find((pet) => pet.name === name) || {};
}

// Overdue once the due date has passed, "Due Soon" in the last 30 days before it
function getVaccineStatus(vaccination) {
  const daysLeft = Math.round((parseISODate(vaccination.next) - TODAY) / MS_PER_DAY);
  if (daysLeft < 0) return 'Overdue';
  if (daysLeft <= 30) return 'Due Soon';
  return 'Up-to-Date';
}

// A pet's status is the worst status of all of its vaccinations
function getPetVaccineStatus(pet) {
  const statuses = db.vaccinations.filter((v) => v.pet === pet.name).map(getVaccineStatus);
  if (statuses.length === 0) return 'No Records';
  if (statuses.includes('Overdue')) return 'Overdue';
  if (statuses.includes('Due Soon')) return 'Due Soon';
  return 'Vaccinated';
}

// ---------- Small pieces of HTML ----------

const BADGE_COLORS = {
  Vaccinated: 'green',
  'Up-to-Date': 'green',
  Confirmed: 'green',
  Active: 'green',
  Available: 'green',
  'Due Soon': 'yellow',
  Pending: 'yellow',
  'In Progress': 'blue',
  Adopted: 'blue',
  Overdue: 'red',
  Cancelled: 'red',
  Inactive: 'red',
  Completed: 'gray',
  'No Records': 'gray',
};
const VACCINE_STATUS_ICONS = { 'Up-to-Date': '✓ ', 'Due Soon': '⏰ ', Overdue: '🚨 ' };

function badge(status, showIcon = false) {
  const icon = showIcon ? VACCINE_STATUS_ICONS[status] || '' : '';
  return `<span class="badge ${BADGE_COLORS[status] || ''}">${icon}${esc(status)}</span>`;
}

// The little coloured square with the animal emoji
function petTile(species, index = 0) {
  const emoji = SPECIES_EMOJI[species] || '🐾';
  return `<span class="pet-tile tint-${index % 5}">${emoji}</span>`;
}

function emptyState(message) {
  return `<div class="empty-state">🐾<br>${message}</div>`;
}

// Cuts a list into pages and builds the "Showing 1-6 of 10" footer with page buttons
function paginate(rows, pageSize) {
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  state.pageNumber = Math.min(Math.max(1, state.pageNumber), pageCount);

  const start = (state.pageNumber - 1) * pageSize;
  const items = rows.slice(start, start + pageSize);

  const summary = rows.length
    ? `Showing ${start + 1}–${start + items.length} of ${rows.length} records`
    : 'No records';

  let pageButtons = '';
  for (let number = 1; number <= pageCount; number++) {
    const active = number === state.pageNumber ? 'active' : '';
    pageButtons += `<button class="${active}" data-page="${number}">${number}</button>`;
  }

  const onFirstPage = state.pageNumber <= 1;
  const onLastPage = state.pageNumber >= pageCount;
  const footer = `
    <div class="table-footer">
      <span>${summary}</span>
      <div class="pager">
        <button data-page="${state.pageNumber - 1}" ${onFirstPage ? 'disabled' : ''} aria-label="Previous page">‹</button>
        ${pageButtons}
        <button data-page="${state.pageNumber + 1}" ${onLastPage ? 'disabled' : ''} aria-label="Next page">›</button>
      </div>
    </div>`;

  return { items, footer };
}

// A table inside a white card. On phones each row turns into a small card,
// which is why every cell has a data-label.
function buildTable({ headings, rows, footer = '', className = '' }) {
  const headingCells = headings.map((text) => `<th>${text}</th>`).join('');
  return `
    <div class="card table-card">
      <div class="table-scroll">
        <table class="responsive-table ${className}">
          <thead><tr>${headingCells}</tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      ${footer}
    </div>`;
}

function tableCell(label, content, className = '') {
  return `<td data-label="${label}" class="${className}">${content}</td>`;
}

// The view / edit / delete buttons at the end of a table row
function rowActions(type, index) {
  return `
    <div class="row-actions">
      <button data-action="view" data-type="${type}" data-index="${index}" title="View">👁️</button>
      <button data-action="edit" data-type="${type}" data-index="${index}" title="Edit">✏️</button>
      <button class="danger" data-action="delete" data-type="${type}" data-index="${index}" title="Delete">🗑️</button>
    </div>`;
}

// ---------- Search and filter controls ----------
// Every control carries data-filter="<name of the state property>".
// main.js listens for them and updates state.

function searchBox(placeholder) {
  return `
    <div class="search-box">
      <span>🔍</span>
      <input id="search" data-filter="search" placeholder="${placeholder}" value="${esc(state.search)}" autocomplete="off">
    </div>`;
}

function filterChip(filterName, value, label) {
  const active = state[filterName] === value ? 'active' : '';
  return `<button class="chip ${active}" data-filter="${filterName}" data-value="${value}">${label}</button>`;
}

function filterSelect(filterName, options, allLabel) {
  const optionTags = options
    .map((option) => `<option ${state[filterName] === option ? 'selected' : ''}>${esc(option)}</option>`)
    .join('');
  return `
    <select class="filter-select" data-filter="${filterName}" aria-label="${allLabel}">
      <option value="">${allLabel}</option>
      ${optionTags}
    </select>`;
}
