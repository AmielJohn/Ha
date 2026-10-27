// Adoption page: tabs for each stage and a card for every pet

const ADOPTION_TABS = [
  { status: 'Available', color: 'green' },
  { status: 'Pending', color: 'yellow' },
  { status: 'Adopted', color: 'blue' },
];

function renderAdoption() {
  const search = state.search.toLowerCase();

  const pets = db.adoption
    .map((pet, index) => ({ ...pet, index }))
    .filter((pet) => {
      const matchesTab = pet.status === state.tab;
      const matchesSearch = !search || [pet.name, pet.breed, pet.species, pet.reason].join(' ').toLowerCase().includes(search);
      return matchesTab && matchesSearch;
    });

  const tabs = ADOPTION_TABS.map((tab) => {
    const count = db.adoption.filter((pet) => pet.status === tab.status).length;
    const active = state.tab === tab.status ? 'active' : '';
    return `
      <button class="tab ${active}" data-filter="tab" data-value="${tab.status}">
        <i class="tab-dot ${tab.color}"></i>${tab.status}<em>${count}</em>
      </button>`;
  }).join('');

  let results;
  if (pets.length > 0) {
    results = `<div class="pet-grid">${pets.map(adoptionCard).join('')}</div>`;
  } else if (db.adoption.length === 0) {
    results = `<div class="card">${emptyState('No pets for adoption yet.<br>Click "+ Add Pet for Adoption" to add one.')}</div>`;
  } else {
    results = `<div class="card">${emptyState(`No ${state.tab.toLowerCase()} pets found.`)}</div>`;
  }

  $('#content').innerHTML = `
    <div class="page-actions">
      ${searchBox('Search pets for adoption...')}
      <button class="btn" data-action="add" data-type="adoption">+ Add Pet for Adoption</button>
    </div>

    <div class="card tabs">${tabs}</div>

    ${results}`;
}

function adoptionCard(pet) {
  const emoji = SPECIES_EMOJI[pet.species] || '🐾';
  const genderSymbol = pet.gender === 'Male' ? '♂' : '♀';

  // the main button depends on where the pet is in the adoption process
  let mainButton;
  if (pet.status === 'Available') {
    mainButton = `<button class="btn" data-action="adopt" data-type="adoption" data-index="${pet.index}">Adopt</button>`;
  } else if (pet.status === 'Pending') {
    mainButton = `<button class="btn" data-action="complete-adoption" data-type="adoption" data-index="${pet.index}">Complete</button>`;
  } else {
    mainButton = `<button class="btn" disabled>Adopted ✓</button>`;
  }

  return `
    <article class="pet-card">
      <div class="pet-card-header header-${pet.index % 6}">
        <span class="pet-card-emoji">${emoji}</span>
        <h3>${esc(pet.name)}</h3>
        <small>${esc(pet.breed)}</small>
      </div>

      <div class="pet-card-body">
        <div class="info-grid">
          <div><small>SPECIES</small><b>${emoji} ${esc(pet.species)}</b></div>
          <div><small>AGE</small><b>${esc(pet.age)}</b></div>
          <div><small>GENDER</small><b>${genderSymbol} ${esc(pet.gender)}</b></div>
          <div><small>HEALTH</small><b>${esc(pet.health)}</b></div>
        </div>

        <div class="reason">📌 ${esc(pet.reason)}</div>

        <div class="pet-card-actions">
          <button class="btn outline" data-action="view" data-type="adoption" data-index="${pet.index}">View Details</button>
          ${mainButton}
        </div>
      </div>
    </article>`;
}
