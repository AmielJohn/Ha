// Pet Records page

function renderPets() {
  const search = state.search.toLowerCase();

  // keep each pet's position in db.pets, the edit and delete buttons need it
  const pets = db.pets
    .map((pet, index) => ({ ...pet, index, vaccineStatus: getPetVaccineStatus(pet) }))
    .filter((pet) => {
      const matchesSpecies = !state.species || pet.species === state.species;
      const matchesStatus = !state.status || pet.vaccineStatus === state.status;
      const matchesSearch =
        !search || [pet.name, pet.owner, pet.breed].join(' ').toLowerCase().includes(search);
      return matchesSpecies && matchesStatus && matchesSearch;
    });

  const { items, footer } = paginate(pets, 6);

  let results;
  if (pets.length > 0) {
    results = buildTable({
      headings: ['Pet', 'Species', 'Breed', 'Owner', 'Age', 'Gender', 'Vax Status', 'Actions'],
      rows: items.map(petRow).join(''),
      footer,
    });
  } else if (db.pets.length === 0) {
    results = `<div class="card">${emptyState('No pets registered yet.<br>Click "+ Add New Pet" to add the first one.')}</div>`;
  } else {
    results = `<div class="card">${emptyState('No pets match your search.')}</div>`;
  }

  $('#content').innerHTML = `
    <div class="page-actions">
      <p class="muted">${plural(db.pets.length, 'pet')} registered</p>
      <button class="btn" data-action="add" data-type="pets">+ Add New Pet</button>
    </div>

    <div class="card filter-bar">
      ${searchBox('Search by pet name, owner, or breed...')}
      <div class="chip-group">
        ${filterChip('species', '', '🐾 All')}
        ${filterChip('species', 'Dog', '🐕 Dog')}
        ${filterChip('species', 'Cat', '🐈 Cat')}
        ${filterChip('species', 'Rabbit', '🐰 Rabbit')}
      </div>
      ${filterSelect('status', ['Vaccinated', 'Due Soon', 'Overdue', 'No Records'], 'All Statuses')}
    </div>

    ${results}`;
}

function petRow(pet) {
  const isMale = pet.gender === 'Male';
  const gender = `<span class="${isMale ? 'male' : 'female'}">${isMale ? '♂' : '♀'} ${esc(pet.gender)}</span>`;

  return `
    <tr>
      ${tableCell('Pet', `<div class="pet-cell">${petTile(pet.species, pet.index)}<b>${esc(pet.name)}</b></div>`)}
      ${tableCell('Species', esc(pet.species))}
      ${tableCell('Breed', esc(pet.breed))}
      ${tableCell('Owner', esc(pet.owner))}
      ${tableCell('Age', esc(pet.age))}
      ${tableCell('Gender', gender)}
      ${tableCell('Vax Status', badge(pet.vaccineStatus))}
      ${tableCell('Actions', rowActions('pets', pet.index))}
    </tr>`;
}
