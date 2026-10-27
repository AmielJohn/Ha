// The login screen

function showLogin() {
  // If "Remember me" was ticked last time, fill the username back in
  let savedUsername = '';
  try {
    savedUsername = localStorage.getItem('vet_username') || '';
  } catch (error) {
    // localStorage can be blocked (private window), that's fine
  }

  const smallLock = ICONS.lock.replace('width="17" height="17"', 'width="13" height="13"');

  app.innerHTML = `
    <div class="login">
      <section class="login-promo">
        <i class="bubble bubble-1"></i>
        <i class="bubble bubble-2"></i>

        <div class="promo-inner">
          <div class="promo-brand">
            <span class="promo-logo">${pawIcon('#3b2f5e')}</span>
            <span>
              <b>Olongapo City</b>
              <small>Veterinary Office</small>
            </span>
          </div>

          <div class="promo-art">${LOGIN_ANIMALS}</div>

          <h2>Caring for Every Companion</h2>
          <p>Professional veterinary care management for the animals of Olongapo City.</p>

          <div class="promo-stats">
            <div><b>1,240+</b><small>Pets Registered</small></div>
            <div><b>98%</b><small>Satisfaction</small></div>
            <div><b>12</b><small>Staff Members</small></div>
          </div>
        </div>
      </section>

      <section class="login-panel">
        <i class="bubble bubble-3"></i>

        <form id="login-form" novalidate>
          <div class="form-logo">${pawIcon('#3b2f5e')}</div>
          <h1>Welcome Back</h1>
          <p class="subtitle">Sign in to access the Veterinary Management System</p>

          <label>
            Username
            <span class="field">
              <i>${ICONS.user}</i>
              <input name="username" autocomplete="username" placeholder="Enter your username" value="${esc(savedUsername)}">
            </span>
          </label>

          <label>
            Password
            <span class="field">
              <i>${ICONS.lock}</i>
              <input name="password" type="password" autocomplete="current-password" placeholder="Enter your password">
              <button type="button" class="toggle-password" id="toggle-password" aria-label="Show password">${ICONS.eye}</button>
            </span>
          </label>

          <div class="form-options">
            <label class="remember">
              <input type="checkbox" name="remember" ${savedUsername ? 'checked' : ''}>
              Remember me
            </label>
            <a href="#" id="forgot-password">Forgot password?</a>
          </div>

          <div class="error-message" id="login-error" role="alert"></div>

          <button class="sign-in-button">${ICONS.signIn} Sign In</button>

          <div class="notice">
            ${smallLock} This system is for <b>authorized veterinary staff only.</b><br>
            Unauthorized access is strictly prohibited.
          </div>
        </form>
      </section>

      <button class="help-button" id="help-button" aria-label="Help">?</button>
    </div>`;

  const form = $('#login-form');
  const errorBox = $('#login-error');

  // Eye button: show or hide the password
  $('#toggle-password').onclick = () => {
    const isHidden = form.password.type === 'password';
    form.password.type = isHidden ? 'text' : 'password';
    $('#toggle-password').innerHTML = isHidden ? ICONS.eyeOff : ICONS.eye;
  };

  $('#forgot-password').onclick = (event) => {
    event.preventDefault();
    errorBox.textContent = 'Please contact the system administrator to reset your password.';
  };

  $('#help-button').onclick = () => {
    alert(`Need help? Contact the City Veterinary Office at ${db.settings.phone}.`);
  };

  form.onsubmit = (event) => {
    event.preventDefault();
    const username = form.username.value.trim();

    // There are no real accounts yet, so any username and password is accepted
    if (!username || !form.password.value) {
      errorBox.textContent = 'Please enter your username and password.';
      return;
    }

    try {
      if (form.remember.checked) localStorage.setItem('vet_username', username);
      else localStorage.removeItem('vet_username');
    } catch (error) {
      // ignore, see above
    }

    state.user = username;
    render();
  };
}
