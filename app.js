const $ = (s, r = document) => r.querySelector(s);
const app = $('#app');
const E = { Dog: '🐕', Cat: '🐈', Rabbit: '🐰' };
const BADGE = { Vaccinated: 'g', 'Up-to-Date': 'g', Confirmed: 'g', Active: 'g', Available: 'g', Healthy: 'g', 'Due Soon': 'y', Pending: 'y', 'In Progress': 'b', Overdue: 'r', Inactive: 'r', Adopted: 'b' };
const badge = v => `<span class="badge ${BADGE[v] || ''}">${v}</span>`;
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const SPECIES = ['Dog', 'Cat', 'Rabbit'], VETS = ['Dr. Rivera', 'Dr. Reyes', 'Dr. Lim'];
const D = {
  pets: [
    ['Max','Dog','Labrador Retriever','Juan Dela Cruz','3 yrs','Male','Vaccinated'],['Luna','Cat','Persian','Maria Santos','2 yrs','Female','Vaccinated'],
    ['Brownie','Dog','Aspin','Pedro Bautista','5 yrs','Male','Due Soon'],['Snowball','Rabbit','Holland Lop','Ana Gonzales','1 yr','Female','Vaccinated'],
    ['Rex','Dog','German Shepherd','Carlo Mendoza','4 yrs','Male','Overdue'],['Mittens','Cat','Siamese','Jose Ramos','6 yrs','Female','Vaccinated'],
    ['Goldie','Dog','Golden Retriever','Carlos Reyes','2 yrs','Female','Vaccinated'],['Coco','Dog','Shih Tzu','Liza Tan','3 yrs','Male','Due Soon'],
    ['Kitty','Cat','Domestic Shorthair','Tony Lim','4 yrs','Female','Overdue'],['Fluffy','Rabbit','Angora','Grace Uy','2 yrs','Female','Vaccinated']
  ].map(([name, species, breed, owner, age, gender, status]) => ({ name, species, breed, owner, age, gender, status })),
  appointments: [
    ['Max','Juan Dela Cruz','Dr. Rivera','Aug 1, 2026','9:00 AM','Annual Check-up','Confirmed'],['Luna','Maria Santos','Dr. Reyes','Aug 1, 2026','10:30 AM','Vaccination','In Progress'],
    ['Brownie','Pedro Bautista','Dr. Rivera','Aug 1, 2026','11:00 AM','Deworming','Confirmed'],['Snowball','Ana Gonzales','Dr. Reyes','Aug 1, 2026','2:00 PM','Health Screening','Pending'],
    ['Rex','Carlo Mendoza','Dr. Rivera','Aug 2, 2026','9:30 AM','Vaccination','Confirmed'],['Mittens','Jose Ramos','Dr. Reyes','Aug 2, 2026','11:30 AM','Neutering Follow-up','Confirmed'],
    ['Goldie','Carlos Reyes','Dr. Rivera','Aug 3, 2026','10:00 AM','Skin Condition','Pending'],['Coco','Liza Tan','Dr. Reyes','Aug 4, 2026','1:00 PM','Deworming','Confirmed']
  ].map(([pet, owner, vet, date, time, purpose, status]) => ({ pet, owner, vet, date, time, purpose, status })),
  vaccinations: [
    ['Max','Rabies','Aug 1, 2025','Aug 1, 2026','Due Soon','Dr. Rivera'],['Luna','FVRCP','Jul 15, 2026','Jul 15, 2027','Up-to-Date','Dr. Reyes'],
    ['Brownie','Distemper','Jun 1, 2025','Jun 1, 2026','Overdue','Dr. Rivera'],['Snowball','RHDV','May 20, 2026','Nov 20, 2026','Up-to-Date','Dr. Reyes'],
    ['Rex','Parvo','May 10, 2025','May 10, 2026','Overdue','Dr. Rivera'],['Mittens','Rabies','Jul 1, 2026','Jul 1, 2027','Up-to-Date','Dr. Reyes'],
    ['Goldie','Leptospirosis','Jul 20, 2026','Jul 20, 2027','Up-to-Date','Dr. Rivera'],['Coco','Rabies','Jul 5, 2025','Aug 5, 2026','Due Soon','Dr. Reyes'],
    ['Kitty','FVRCP','Jun 30, 2025','Jun 30, 2026','Overdue','Dr. Rivera'],['Fluffy','Myxomatosis','Jul 28, 2026','Aug 8, 2026','Due Soon','Dr. Reyes']
  ].map(([pet, vaccine, given, next, status, vet]) => ({ pet, vaccine, given, next, status, vet })),
  adoption: [
    ['Buddy','Dog','Beagle Mix','2 yrs','Male','Available','Owner relocated'],['Nala','Cat','Domestic Shorthair','1 yr','Female','Available','Stray rescued'],
    ['Peanut','Rabbit','Dutch Rabbit','8 mos','Male','Pending','Surrendered'],['Shadow','Dog','Aspin','3 yrs','Male','Available','Stray rescued'],
    ['Daisy','Cat','Persian Mix','4 yrs','Female','Adopted','Owner allergic'],['Mochi','Dog','Shih Tzu','1.5 yrs','Female','Available','Owner moved abroad'],
    ['Thumper','Rabbit','Mini Lop','6 mos','Male','Pending','Rescue'],['Whiskers','Cat','Siamese Mix','2 yrs','Male','Adopted','Surrendered']
  ].map(([name, species, breed, age, gender, status, reason]) => ({ name, species, breed, age, gender, status, reason })),
  users: [
    ['Dr. Maria Rivera','Veterinarian','dr.rivera','rivera@olongapovets.gov.ph','Active'],['Dr. Jose Reyes','Veterinarian','dr.reyes','reyes@olongapovets.gov.ph','Active'],
    ['Ana Bautista','Veterinary Staff','ana.bautista','abautista@olongapovets.gov.ph','Active'],['Carlo Santos','Veterinary Staff','carlo.santos','csantos@olongapovets.gov.ph','Active'],
    ['Grace Mendoza','Veterinary Staff','grace.mendoza','gmendoza@olongapovets.gov.ph','Inactive'],['Dr. Liza Lim','Veterinarian','dr.lim','llim@olongapovets.gov.ph','Active']
  ].map(([name, role, username, email, status]) => ({ name, role, username, email, status }))
};

const T = (label, key, o = {}) => ({ label, key, ...o });
const PAGES = {
  pets: { icon: '🐾', title: 'Pet Records', sub: 'All registered pets', add: 'Add Pet', status: ['Vaccinated', 'Due Soon', 'Overdue'], cols: [T('Pet', 'name', { pet: 1 }), T('Species', 'species', { sel: SPECIES }), T('Breed', 'breed'), T('Owner', 'owner'), T('Age', 'age'), T('Gender', 'gender', { sel: ['Male', 'Female'] }), T('Status', 'status', { badge: 1, sel: ['Vaccinated', 'Due Soon', 'Overdue'] })] },
  appointments: { icon: '📅', title: 'Appointments', sub: 'Scheduled veterinary visits', add: 'New Appointment', status: ['Confirmed', 'Pending', 'In Progress'], cols: [T('Pet', 'pet'), T('Owner', 'owner'), T('Vet', 'vet', { sel: VETS }), T('Date', 'date', { ph: 'Aug 5, 2026' }), T('Time', 'time', { ph: '9:00 AM' }), T('Purpose', 'purpose'), T('Status', 'status', { badge: 1, sel: ['Confirmed', 'Pending', 'In Progress'] })] },
  vaccinations: { icon: '💉', title: 'Vaccinations', sub: 'Vaccination records and due dates', add: 'Record Vaccination', status: ['Up-to-Date', 'Due Soon', 'Overdue'], cols: [T('Pet', 'pet'), T('Vaccine', 'vaccine'), T('Given', 'given', { ph: 'Aug 1, 2026' }), T('Next Due', 'next', { ph: 'Aug 1, 2027' }), T('Vet', 'vet', { sel: VETS }), T('Status', 'status', { badge: 1, sel: ['Up-to-Date', 'Due Soon', 'Overdue'] })] },
  adoption: { icon: '🏠', title: 'Adoption', sub: 'Pets available for adoption', add: 'Add Pet for Adoption', status: ['Available', 'Pending', 'Adopted'], cards: 1, cols: [T('Name', 'name'), T('Species', 'species', { sel: SPECIES }), T('Breed', 'breed'), T('Age', 'age'), T('Gender', 'gender', { sel: ['Male', 'Female'] }), T('Status', 'status', { sel: ['Available', 'Pending', 'Adopted'] }), T('Reason', 'reason')] },
  users: { icon: '👥', title: 'Users', sub: 'System accounts', add: 'Add User', status: ['Active', 'Inactive'], cols: [T('Name', 'name'), T('Role', 'role', { sel: ['Veterinarian', 'Veterinary Staff'] }), T('Username', 'username'), T('Email', 'email'), T('Status', 'status', { badge: 1, sel: ['Active', 'Inactive'] })] }
};
const NAV = [['dashboard', '📊', 'Dashboard'], ...Object.entries(PAGES).map(([k, p]) => [k, p.icon, p.title]), ['settings', '⚙️', 'Settings']];
let state = { user: null, page: 'dashboard', q: '', st: '' };

function login() {
  app.innerHTML = `<div class="login"><form id="lf"><div class="logo">🐾</div><h1>Veterinary Clinic</h1><p>Management System — sign in to continue</p>
    <label>Username<input name="u" autocomplete="username" placeholder="Enter your username"></label>
    <label>Password<input name="p" type="password" autocomplete="current-password" placeholder="Enter your password"></label>
    <div class="err" id="err"></div><button class="btn">Sign In</button></form></div>`;
  $('#lf').onsubmit = e => {
    e.preventDefault();
    const f = e.target;
    if (!f.u.value.trim() || !f.p.value) return ($('#err').textContent = 'Please enter your username and password.');
    state.user = f.u.value.trim(); render();
  };
}

function shell(html) {
  app.innerHTML = `<div class="shell"><aside class="side"><div class="brand">🐾 Vet Clinic</div>
    ${NAV.map(([k, i, l]) => `<button class="nav ${state.page === k ? 'on' : ''}" data-p="${k}">${i} ${l}</button>`).join('')}
    <div class="spacer"></div><button class="nav" id="out">🚪 Log out (${esc(state.user)})</button></aside><main class="main">${html}</main></div>`;
  app.querySelectorAll('[data-p]').forEach(b => b.onclick = () => go(b.dataset.p));
  $('#out').onclick = () => { state.user = null; render(); };
}
function go(p) { state.page = p; state.q = ''; state.st = ''; render(); }

function dashboard() {
  const due = D.vaccinations.filter(v => v.status !== 'Up-to-Date').length;
  const stats = [['🐾', 'Total Pets', D.pets.length], ['📅', 'Appointments', D.appointments.length], ['💉', 'Vaccines Due / Overdue', due], ['🏠', 'Available for Adoption', D.adoption.filter(a => a.status === 'Available').length]];
  shell(`<div class="top"><div><h1>Dashboard</h1><p>Welcome back, ${esc(state.user)}</p></div></div>
    <div class="stats">${stats.map(s => `<div class="card stat"><span>${s[0]} ${s[1]}</span><b>${s[2]}</b></div>`).join('')}</div>
    <div class="two"><div class="card"><h3>Upcoming Appointments</h3>${D.appointments.slice(0, 5).map(a => `<div class="row"><span><b>${esc(a.pet)}</b> — ${esc(a.purpose)}<br><small>${esc(a.date)} · ${esc(a.time)} · ${esc(a.vet)}</small></span>${badge(a.status)}</div>`).join('')}</div>
    <div class="card"><h3>Needs Attention</h3>${D.vaccinations.filter(v => v.status !== 'Up-to-Date').map(v => `<div class="row"><span>${esc(v.pet)} — ${esc(v.vaccine)}</span>${badge(v.status)}</div>`).join('')}</div></div>`);
}

function list(key) {
  const P = PAGES[key], q = state.q.toLowerCase();
  const rows = D[key].map((r, i) => ({ r, i })).filter(({ r }) => (!state.st || r.status === state.st) && (!q || Object.values(r).join(' ').toLowerCase().includes(q)));
  const del = i => `<button class="btn red sm" data-del="${i}">Delete</button>`;
  const body = !rows.length ? '<div class="empty">No records found.</div>' : P.cards
    ? `<div class="grid">${rows.map(({ r, i }) => `<div class="card pet"><div class="em">${E[r.species] || '🐾'}</div><h3>${esc(r.name)}</h3><p>${esc(r.breed)} · ${esc(r.age)} · ${esc(r.gender)}</p><p>${esc(r.reason)}</p><p>${badge(r.status)}</p>${del(i)}</div>`).join('')}</div>`
    : `<div class="wrap"><table><thead><tr>${P.cols.map(c => `<th>${c.label}</th>`).join('')}<th></th></tr></thead><tbody>${rows.map(({ r, i }) => `<tr>${P.cols.map(c => `<td>${c.badge ? badge(r[c.key]) : c.pet ? `${E[r.species] || ''} <b>${esc(r[c.key])}</b>` : esc(r[c.key])}</td>`).join('')}<td>${del(i)}</td></tr>`).join('')}</tbody></table></div>`;
  shell(`<div class="top"><div><h1>${P.title}</h1><p>${P.sub} · ${D[key].length} total</p></div><button class="btn" id="add">+ ${P.add}</button></div>
    <div class="bar"><input id="q" placeholder="Search..." value="${esc(state.q)}"><select id="st"><option value="">All statuses</option>${P.status.map(s => `<option ${state.st === s ? 'selected' : ''}>${s}</option>`).join('')}</select></div>
    <div class="card">${body}</div>`);
  $('#q').oninput = e => { state.q = e.target.value; const p = e.target.selectionStart; list(key); const n = $('#q'); n.focus(); n.setSelectionRange(p, p); };
  $('#st').onchange = e => { state.st = e.target.value; list(key); };
  $('#add').onclick = () => form(key);
  app.querySelectorAll('[data-del]').forEach(b => b.onclick = () => { if (confirm('Delete this record?')) { D[key].splice(+b.dataset.del, 1); list(key); } });
}

function form(key) {
  const P = PAGES[key], m = document.createElement('div');
  m.className = 'modal';
  m.innerHTML = `<form><h2>${P.add}</h2>${P.cols.map(c => `<label>${c.label}${c.sel ? `<select name="${c.key}">${c.sel.map(o => `<option>${o}</option>`).join('')}</select>` : `<input name="${c.key}" placeholder="${c.ph || ''}" required>`}</label>`).join('')}
    <div class="acts"><button type="button" class="btn ghost" id="x">Cancel</button><button class="btn">Save</button></div></form>`;
  document.body.append(m);
  m.onclick = e => { if (e.target === m) m.remove(); };
  $('#x', m).onclick = () => m.remove();
  $('form', m).onsubmit = e => {
    e.preventDefault();
    D[key].unshift(Object.fromEntries(new FormData(e.target)));
    m.remove(); list(key);
  };
}

function settings() {
  shell(`<div class="top"><div><h1>Settings</h1><p>Clinic information</p></div></div>
    <form class="card" id="sf" style="max-width:560px;display:grid;gap:14px">
    <label>Clinic Name<input value="City Veterinary Office"></label><label>Contact Email<input type="email" value="clinic@olongapovets.gov.ph"></label>
    <label>Phone<input value="(047) 222-0000"></label><div class="acts"><button class="btn">Save Changes</button></div><div class="err" id="ok" style="color:var(--ok)"></div></form>`);
  $('#sf').onsubmit = e => { e.preventDefault(); $('#ok').textContent = 'Settings saved.'; };
}

function render() {
  if (!state.user) return login();
  if (state.page === 'dashboard') dashboard();
  else if (state.page === 'settings') settings();
  else list(state.page);
}
render();
