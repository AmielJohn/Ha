// Vaccinations page

// CSS class for the "Next Due" date colour
const DUE_DATE_CLASSES = { Overdue: 'due-overdue', 'Due Soon': 'due-soon', 'Up-to-Date': 'due-ok' };

function renderVaccinations() {
  const search = state.search.toLowerCase();

  const all = db.vaccinations.map((vaccination, index) => ({
    ...vaccination,
    index,
    status: getVaccineStatus(vaccination),
    owner: findPet(vaccination.pet).owner || '—',
  }));

  const filtered = all.filter((v) => {
    const matchesStatus = !state.status || v.status === state.status;
    const matchesVaccine = !state.vaccine || v.vaccine === state.vaccine;
    const matchesSearch = !search || [v.pet, v.owner, v.vaccine].join(' ').toLowerCase().includes(search);
    return matchesStatus && matchesVaccine && matchesSearch;
  });

  const countOf = (status) => all.filter((v) => v.status === status).length;
  const { items, footer } = paginate(filtered, 8);

  let results;
  if (filtered.length > 0) {
    results = buildTable({
      headings: ['Pet', 'Vaccine', 'Date Given', 'Next Due', 'Status', 'Veterinarian', 'Actions'],
      rows: items.map(vaccinationRow).join(''),
      footer,
      className: 'vaccine-table',
    });
  } else if (db.vaccinations.length === 0) {
    results = `<div class="card">${emptyState('No vaccination records yet.<br>Click "+ Add Vaccination" to record one.')}</div>`;
  } else {
    results = `<div class="card">${emptyState('No vaccination records found.')}</div>`;
  }

  $('#content').innerHTML = `
    <section class="panel-grid summary-row">
      ${summaryCard('Up-to-Date', 'green', '✅', countOf('Up-to-Date'))}
      ${summaryCard('Due Soon', 'yellow', '⏰', countOf('Due Soon'))}
      ${summaryCard('Overdue', 'red', '🚨', countOf('Overdue'))}
    </section>

    <div class="card filter-bar">
      ${searchBox('Search pet or owner...')}
      ${filterSelect('vaccine', VACCINE_TYPES, 'All Vaccines')}
      <div class="chip-group">
        ${filterChip('status', '', 'All')}
        ${filterChip('status', 'Up-to-Date', 'Up-to-Date')}
        ${filterChip('status', 'Due Soon', 'Due Soon')}
        ${filterChip('status', 'Overdue', 'Overdue')}
      </div>
      <button class="btn" data-action="add" data-type="vaccinations">+ Add Vaccination</button>
    </div>

    ${results}`;
}

// Big number card at the top. Clicking it filters the table (click again to clear).
function summaryCard(status, color, icon, count) {
  const isActive = state.status === status;
  const nextFilter = isActive ? '' : status;
  return `
    <button class="card summary-card ${color} ${isActive ? 'active' : ''}" data-filter="status" data-value="${nextFilter}">
      <span>
        <b>${count}</b>
        <strong>${status}</strong>
        <small>Click to filter</small>
      </span>
      <i>${icon}</i>
    </button>`;
}

function vaccinationRow(v) {
  const pet = findPet(v.pet);
  const petCell = `
    <div class="pet-cell">
      ${petTile(pet.species, v.index)}
      <span><b>${esc(v.pet)}</b><small>${esc(v.owner)}</small></span>
    </div>`;

  return `
    <tr>
      ${tableCell('Pet', petCell)}
      ${tableCell('Vaccine', `<span class="vaccine-chip">💉 ${esc(v.vaccine)}</span>`)}
      ${tableCell('Date Given', formatDate(v.given), 'center')}
      ${tableCell('Next Due', formatDate(v.next), `center ${DUE_DATE_CLASSES[v.status]}`)}
      ${tableCell('Status', badge(v.status, true), 'center')}
      ${tableCell('Veterinarian', esc(v.vet), 'center')}
      ${tableCell('Actions', rowActions('vaccinations', v.index), 'center')}
    </tr>`;
}
