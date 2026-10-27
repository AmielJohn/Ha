// Starts the app and listens for clicks and typing.
// This file has to load last because it uses functions from all the others.

pageRenderers = {
  dashboard: renderDashboard,
  pets: renderPets,
  appointments: renderAppointments,
  vaccinations: renderVaccinations,
  adoption: renderAdoption,
  users: renderUsers,
  settings: renderSettings,
};

// One click listener for the whole app. Buttons say what they do with data-
// attributes, for example <button data-go="pets"> or <button data-action="add">.
app.addEventListener('click', (event) => {
  const target = event.target.closest(
    '[data-go], [data-action], button[data-filter], [data-page], [data-date], [data-month], [data-menu-toggle]'
  );
  if (!target) return;
  const data = target.dataset;

  if (data.menuToggle !== undefined) {
    // open or close the sidebar on small screens
    $('.app').classList.toggle('menu-open');
  } else if (data.go) {
    go(data.go);
  } else if (data.action) {
    handleAction(data.action, data.type, Number(data.index));
  } else if (data.filter) {
    // filter buttons: the chips, the Adoption tabs and the vaccine summary cards
    state[data.filter] = data.value;
    state.pageNumber = 1;
    refresh();
  } else if (data.page) {
    state.pageNumber = Number(data.page);
    refresh();
  } else if (data.date) {
    state.selectedDate = data.date;
    refresh();
  } else if (data.month) {
    changeMonth(Number(data.month));
  }
});

// Search boxes and dropdowns
app.addEventListener('input', (event) => {
  const filterName = event.target.dataset.filter;
  if (!filterName) return;

  state[filterName] = event.target.value;
  state.pageNumber = 1;
  refresh();
});

// Pressing Enter in the quick search box in the top bar opens Pet Records with that search
app.addEventListener('keydown', (event) => {
  const isQuickSearch = event.target.id === 'quick-search';
  if (isQuickSearch && event.key === 'Enter' && event.target.value.trim()) {
    go('pets', event.target.value.trim());
  }
});

render();
