// Dashboard page

function renderDashboard() {
  const user = getCurrentUser();

  const todaysAppointments = db.appointments
    .filter((appointment) => appointment.date === TODAY_ISO)
    .sort(compareByDateTime);

  const vaccinations = db.vaccinations.map((v) => ({ ...v, status: getVaccineStatus(v) }));
  const dueSoon = vaccinations.filter((v) => v.status === 'Due Soon');
  const overdue = vaccinations.filter((v) => v.status === 'Overdue');

  const availableForAdoption = db.adoption.filter((p) => p.status === 'Available').length;
  const pendingAdoption = db.adoption.filter((p) => p.status === 'Pending').length;
  const addedThisMonth = db.pets.filter((p) => (TODAY - parseISODate(p.added)) / MS_PER_DAY <= 30).length;
  const fullyVaccinated = db.pets.filter((p) => getPetVaccineStatus(p) === 'Vaccinated').length;
  const inProgressToday = todaysAppointments.filter((a) => a.status === 'In Progress').length;
  const activeToday = todaysAppointments.filter((a) => a.status === 'Confirmed' || a.status === 'In Progress').length;

  // One entry per stat card. The bar at the bottom of each card shows "percent".
  const stats = [
    {
      color: 'green',
      icon: '🐾',
      value: db.pets.length,
      label: 'Total Pets',
      tag: `+${addedThisMonth} this month`,
      percent: percentOf(fullyVaccinated, db.pets.length),
    },
    {
      color: 'purple',
      icon: '📅',
      value: todaysAppointments.length,
      label: "Today's Appointments",
      tag: `${inProgressToday} in progress`,
      percent: percentOf(activeToday, todaysAppointments.length),
    },
    {
      color: 'orange',
      icon: '💉',
      value: dueSoon.length + overdue.length,
      label: 'Vaccinations Due',
      tag: `${overdue.length} overdue`,
      percent: percentOf(overdue.length, dueSoon.length + overdue.length),
    },
    {
      color: 'pink',
      icon: '🏠',
      value: availableForAdoption,
      label: 'Available for Adoption',
      tag: `${pendingAdoption} pending review`,
      percent: percentOf(availableForAdoption, db.adoption.length),
    },
  ];

  $('#content').innerHTML = `
    ${welcomeBanner(user, todaysAppointments.length, overdue.length)}

    <section class="stats-grid">
      ${stats.map(statCard).join('')}
    </section>

    <section class="panel-grid">
      ${todaysAppointmentsCard(todaysAppointments)}
      ${recentPetsCard()}
      ${vaccineRemindersCard(dueSoon, overdue, vaccinations)}
    </section>`;
}

function welcomeBanner(user, appointmentCount, overdueCount) {
  return `
    <section class="hero">
      <div>
        <small>Good Day,</small>
        <h2>${esc(user.shortName)} 👋</h2>
        <p>
          You have <b>${plural(appointmentCount, 'appointment')}</b> today and
          <b>${plural(overdueCount, 'overdue vaccination')}</b> to review.
        </p>
      </div>
      <div class="hero-right">
        <span class="hero-paws">🐾</span>
        <div class="hero-date">
          <b>${MONTH_NAMES[TODAY.getMonth()]} ${TODAY.getDate()}, ${TODAY.getFullYear()}</b>
          <span>${WEEKDAY_NAMES[TODAY.getDay()]}</span>
        </div>
      </div>
    </section>`;
}

function statCard(stat) {
  return `
    <div class="card stat-card">
      <div class="stat-top">
        <span class="stat-icon ${stat.color}">${stat.icon}</span>
        <em class="stat-tag ${stat.color}">${stat.tag}</em>
      </div>
      <b>${stat.value}</b>
      <small>${stat.label}</small>
      <div class="progress"><i class="${stat.color}" style="width: ${stat.percent}%"></i></div>
    </div>`;
}

// Card title with a button on the right
function cardHeader(title, page, buttonLabel) {
  return `
    <div class="card-header">
      <h3>${title}</h3>
      <button class="btn small" data-go="${page}">${buttonLabel}</button>
    </div>`;
}

function todaysAppointmentsCard(appointments) {
  const rows = appointments.slice(0, 5).map((appointment, index) => {
    const pet = findPet(appointment.pet);
    return `
      <div class="list-item">
        ${petTile(pet.species, index)}
        <div class="list-item-main">
          <span><b>${esc(appointment.pet)}</b> <em>· ${esc(pet.owner || '—')}</em></span>
          <small>${esc(appointment.purpose)}</small>
        </div>
        <div class="list-item-side">
          <b class="orange-text">${formatTime(appointment.time)}</b>
          <small>${esc(appointment.vet)}</small>
        </div>
      </div>`;
  });

  return `
    <div class="card">
      ${cardHeader("Today's Appointments", 'appointments', 'View All')}
      ${rows.length ? rows.join('') : emptyState('No appointments today.')}
    </div>`;
}

function recentPetsCard() {
  // newest first, show four
  const recentPets = [...db.pets].sort((a, b) => b.added.localeCompare(a.added)).slice(0, 4);

  const rows = recentPets.map((pet, index) => `
    <div class="list-item">
      ${petTile(pet.species, index)}
      <div class="list-item-main">
        <b>${esc(pet.name)}</b>
        <small>${esc(pet.breed)} · ${esc(pet.owner)}</small>
      </div>
      <div class="list-item-side"><small>${formatDate(pet.added)}</small></div>
    </div>`);

  const countOf = (species) => db.pets.filter((pet) => pet.species === species).length;
  const dogs = countOf('Dog');
  const cats = countOf('Cat');
  const others = db.pets.length - dogs - cats;

  return `
    <div class="card">
      ${cardHeader('Recently Added Pets', 'pets', 'View All')}
      ${rows.length ? rows.join('') : emptyState('No pets registered yet.')}
      <div class="species-summary">
        <div><b>${dogs}</b><small>Dogs</small></div>
        <div><b>${cats}</b><small>Cats</small></div>
        <div><b>${others}</b><small>Others</small></div>
      </div>
    </div>`;
}

function vaccineRemindersCard(dueSoon, overdue, vaccinations) {
  // the five that need attention first (oldest due date first)
  const needAttention = vaccinations
    .filter((v) => v.status !== 'Up-to-Date')
    .sort((a, b) => a.next.localeCompare(b.next))
    .slice(0, 5);

  const rows = needAttention.map((vaccination) => `
    <div class="list-item">
      <span class="pet-tile tint-4">💉</span>
      <div class="list-item-main">
        <b>${esc(vaccination.pet)}</b>
        <small>${esc(vaccination.vaccine)} · ${esc(findPet(vaccination.pet).owner || '—')}</small>
      </div>
      <div class="list-item-side">
        ${badge(vaccination.status)}
        <small>${formatDate(vaccination.next)}</small>
      </div>
    </div>`);

  return `
    <div class="card">
      ${cardHeader('Vaccination Reminders', 'vaccinations', 'Manage')}
      <div class="reminder-counts">
        <div class="count-box yellow"><b>${dueSoon.length}</b><small>Due Soon</small></div>
        <div class="count-box red"><b>${overdue.length}</b><small>Overdue</small></div>
      </div>
      ${rows.length ? rows.join('') : emptyState(vaccinations.length ? 'All vaccinations are up to date.' : 'No vaccinations recorded yet.')}
    </div>`;
}
