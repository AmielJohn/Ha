// Settings page

function renderSettings() {
  const settings = db.settings;

  $('#content').innerHTML = `
    <form class="card settings-form" id="settings-form">
      <h3>Clinic Information</h3>
      <p class="muted">These details appear on reports and printed records.</p>

      <label>Clinic Name <input name="name" value="${esc(settings.name)}" required></label>
      <label>Contact Email <input name="email" type="email" value="${esc(settings.email)}" required></label>
      <label>Phone <input name="phone" value="${esc(settings.phone)}" required></label>
      <label>Address <input name="address" value="${esc(settings.address)}"></label>

      <div class="form-actions">
        <button class="btn">Save Changes</button>
      </div>
    </form>`;

  $('#settings-form').onsubmit = (event) => {
    event.preventDefault();
    Object.assign(db.settings, Object.fromEntries(new FormData(event.target)));
    showToast('Settings saved.');
  };
}
