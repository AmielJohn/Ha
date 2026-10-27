// Pop-up windows: add / edit form, details view, delete, and the
// handlers for every button that has a data-action.

// ---------- What each form asks for ----------
// type    -> which list in db the form belongs to
// key     -> property name on the record
// options -> makes it a dropdown
// wide    -> field takes the full width of the form

function field(key, label, extra = {}) {
  return { key, label, ...extra };
}

const petNames = () => db.pets.map((pet) => pet.name);

const FORM_FIELDS = {
  pets: () => [
    field('name', 'Pet Name'),
    field('species', 'Species', { options: SPECIES }),
    field('breed', 'Breed'),
    field('owner', 'Owner Name'),
    field('address', 'Owner Address', { wide: true, placeholder: 'Barangay, Olongapo City' }),
    field('age', 'Age', { placeholder: 'e.g. 3 yrs' }),
    field('gender', 'Gender', { options: ['Male', 'Female'] }),
  ],
  appointments: () => [
    field('pet', 'Pet', { options: petNames() }),
    field('vet', 'Veterinarian', { options: VETERINARIANS }),
    field('date', 'Date', { inputType: 'date' }),
    field('time', 'Time', { inputType: 'time' }),
    field('purpose', 'Purpose', { wide: true }),
    field('status', 'Status', { options: APPOINTMENT_STATUSES }),
  ],
  vaccinations: () => [
    field('pet', 'Pet', { options: petNames() }),
    field('vaccine', 'Vaccine', { options: VACCINE_TYPES }),
    field('given', 'Date Given', { inputType: 'date' }),
    field('next', 'Next Due', { inputType: 'date' }),
    field('vet', 'Veterinarian', { options: VETERINARIANS }),
  ],
  adoption: () => [
    field('name', 'Name'),
    field('species', 'Species', { options: SPECIES }),
    field('breed', 'Breed'),
    field('age', 'Age', { placeholder: 'e.g. 2 yrs' }),
    field('gender', 'Gender', { options: ['Male', 'Female'] }),
    field('health', 'Health', { options: ['Vaccinated', 'Not Vaccinated', 'Under Treatment'] }),
    field('status', 'Status', { options: ['Available', 'Pending', 'Adopted'] }),
    field('reason', 'Reason / Notes', { wide: true }),
  ],
  users: () => [
    field('name', 'Full Name'),
    field('role', 'Role', { options: ['Veterinarian', 'Veterinary Staff'] }),
    field('username', 'Username'),
    field('email', 'Email', { inputType: 'email' }),
    field('status', 'Status', { options: ['Active', 'Inactive'] }),
  ],
};

const RECORD_NAMES = {
  pets: 'Pet',
  appointments: 'Appointment',
  vaccinations: 'Vaccination',
  adoption: 'Adoption Pet',
  users: 'User',
};

const ADD_TITLES = {
  pets: 'Add New Pet',
  appointments: 'New Appointment',
  vaccinations: 'Add Vaccination',
  adoption: 'Add Pet for Adoption',
  users: 'Add User',
};

// Values the "add" form starts with
function getDefaultValues(type) {
  const nextYear = new Date(TODAY.getFullYear() + 1, TODAY.getMonth(), TODAY.getDate());

  const defaults = {
    pets: {},
    appointments: { date: state.selectedDate || TODAY_ISO, time: '09:00', status: 'Pending' },
    vaccinations: { given: TODAY_ISO, next: toISODate(nextYear) },
    adoption: { status: 'Available', health: 'Vaccinated' },
    users: { status: 'Active' },
  };
  return defaults[type];
}

// ---------- Modal window ----------

function openModal(html) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `<div class="modal-box" role="dialog" aria-modal="true">${html}</div>`;
  document.body.append(modal);

  // click on the dark background, or on anything marked data-close, closes it
  modal.onclick = (event) => {
    if (event.target === modal || event.target.closest('[data-close]')) modal.remove();
  };
  return modal;
}

function fieldHtml(fieldInfo, value) {
  const width = fieldInfo.wide ? 'wide' : '';

  if (fieldInfo.options) {
    const options = fieldInfo.options
      .map((option) => `<option ${option === value ? 'selected' : ''}>${esc(option)}</option>`)
      .join('');
    return `<label class="${width}">${fieldInfo.label}<select name="${fieldInfo.key}" required>${options}</select></label>`;
  }

  return `
    <label class="${width}">
      ${fieldInfo.label}
      <input name="${fieldInfo.key}" type="${fieldInfo.inputType || 'text'}" value="${esc(value)}" placeholder="${esc(fieldInfo.placeholder || '')}" required>
    </label>`;
}

// ---------- Add / edit ----------

// Open the form. Pass an index to edit an existing record, leave it out to add a new one.
function openForm(type, index) {
  const isEditing = index !== undefined;
  const fields = FORM_FIELDS[type]();
  const values = isEditing ? db[type][index] : getDefaultValues(type);

  const modal = openModal(`
    <form>
      <h2>${isEditing ? `Edit ${RECORD_NAMES[type]}` : ADD_TITLES[type]}</h2>
      <div class="form-grid">
        ${fields.map((f) => fieldHtml(f, values[f.key])).join('')}
      </div>
      <div class="error-message" id="form-error"></div>
      <div class="form-actions">
        <button type="button" class="btn ghost" data-close>Cancel</button>
        <button class="btn">${isEditing ? 'Save Changes' : 'Save'}</button>
      </div>
    </form>`);

  $('form', modal).onsubmit = (event) => {
    event.preventDefault();
    const record = Object.fromEntries(new FormData(event.target));
    const showError = (message) => ($('#form-error', modal).textContent = message);

    fields.forEach((f) => (record[f.key] = String(record[f.key] ?? '').trim()));

    const error = validateRecord(type, record, fields, index);
    if (error) {
      showError(error);
      return;
    }

    if (isEditing) {
      updateRecord(type, index, record);
    } else {
      if (type === 'pets') record.added = TODAY_ISO;
      db[type].unshift(record); // newest on top
    }

    modal.remove();
    showToast(isEditing ? 'Changes saved.' : 'Record added.');
    refresh();
  };

  $('input, select', modal)?.focus();
}

// Returns a message if something is wrong, or nothing if the record is fine
function validateRecord(type, record, fields, editingIndex) {
  if (fields.some((f) => !record[f.key])) {
    return 'Please fill in every field.';
  }

  const isDifferentRecord = (_, i) => i !== editingIndex;

  if (type === 'pets') {
    // appointments and vaccinations find the pet by name, so names must be unique
    const nameTaken = db.pets.some((p, i) => isDifferentRecord(p, i) && p.name.toLowerCase() === record.name.toLowerCase());
    if (nameTaken) return 'A pet with this name already exists.';
  }

  if (type === 'vaccinations' && record.next < record.given) {
    return 'Next due date must be after the date given.';
  }

  if (type === 'users') {
    const usernameTaken = db.users.some((u, i) => isDifferentRecord(u, i) && u.username.toLowerCase() === record.username.toLowerCase());
    if (usernameTaken) return 'That username is already taken.';
  }
}

function updateRecord(type, index, newValues) {
  const oldRecord = db[type][index];

  // If a pet is renamed, its appointments and vaccinations must follow
  if (type === 'pets' && oldRecord.name !== newValues.name) {
    db.appointments.forEach((a) => a.pet === oldRecord.name && (a.pet = newValues.name));
    db.vaccinations.forEach((v) => v.pet === oldRecord.name && (v.pet = newValues.name));
  }

  Object.assign(oldRecord, newValues);
}

// ---------- View details ----------

function openDetails(type, index) {
  const record = db[type][index];

  const rows = FORM_FIELDS[type]().map((f) => {
    let value = esc(record[f.key]);
    if (f.inputType === 'date') value = formatDate(record[f.key]);
    if (f.inputType === 'time') value = formatTime(record[f.key]);
    return [f.label, value];
  });

  // extra lines that are worked out, not typed in
  if (type === 'pets') {
    rows.push(['Registered', formatDate(record.added)]);
    rows.push(['Vax Status', badge(getPetVaccineStatus(record))]);
  }
  if (type === 'appointments') {
    rows.push(['Owner', esc(findPet(record.pet).owner || '—')]);
    rows.push(['Address', esc(findPet(record.pet).address || '—')]);
  }
  if (type === 'vaccinations') {
    rows.push(['Owner', esc(findPet(record.pet).owner || '—')]);
    rows.push(['Status', badge(getVaccineStatus(record), true)]);
  }

  const modal = openModal(`
    <h2>${esc(record.name || record.pet)}</h2>
    <dl class="details-list">
      ${rows.map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join('')}
    </dl>
    <div class="form-actions">
      <button class="btn red" data-close data-action="delete" data-type="${type}" data-index="${index}">Delete</button>
      <button class="btn ghost" data-close>Close</button>
      <button class="btn" data-close data-action="edit" data-type="${type}" data-index="${index}">Edit</button>
    </div>`);

  // the modal sits outside #app, so it needs its own listener for the buttons inside it
  modal.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action]');
    if (button) handleAction(button.dataset.action, button.dataset.type, Number(button.dataset.index));
  });
}

// ---------- Delete ----------

function deleteRecord(type, index) {
  const record = db[type][index];
  const label = record.name || record.pet;
  const warning = type === 'pets' ? ' Their appointments and vaccination records will also be removed.' : '';

  if (!confirm(`Delete "${label}"?${warning}`)) return;

  if (type === 'pets') {
    db.appointments = db.appointments.filter((a) => a.pet !== record.name);
    db.vaccinations = db.vaccinations.filter((v) => v.pet !== record.name);
  }

  db[type].splice(index, 1);
  showToast('Record deleted.');
  refresh();
}

// ---------- Button clicks ----------

function handleAction(action, type, index) {
  if (action === 'add') {
    // appointments and vaccinations need a pet to pick from
    const needsPet = type === 'appointments' || type === 'vaccinations';
    if (needsPet && db.pets.length === 0) {
      showToast('Add a pet in Pet Records first.');
      return;
    }
    openForm(type);
  } else if (action === 'edit') {
    openForm(type, index);
  } else if (action === 'view') {
    openDetails(type, index);
  } else if (action === 'delete') {
    deleteRecord(type, index);
  } else if (action === 'adopt') {
    db.adoption[index].status = 'Pending';
    state.tab = 'Pending';
    showToast(`${db.adoption[index].name} is now pending adoption.`);
    refresh();
  } else if (action === 'complete-adoption') {
    db.adoption[index].status = 'Adopted';
    state.tab = 'Adopted';
    showToast(`${db.adoption[index].name} has been adopted! 🎉`);
    refresh();
  } else if (action === 'notifications') {
    const overdue = db.vaccinations.filter((v) => getVaccineStatus(v) === 'Overdue').length;
    const today = db.appointments.filter((a) => a.date === TODAY_ISO).length;
    showToast(`${plural(overdue, 'overdue vaccination')} · ${plural(today, 'appointment')} today`);
  } else if (action === 'logout') {
    state.user = null;
    render();
  }
}
