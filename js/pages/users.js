// Users page

function renderUsers() {
  const search = state.search.toLowerCase();

  const users = db.users
    .map((user, index) => ({ ...user, index }))
    .filter((user) => {
      const matchesStatus = !state.status || user.status === state.status;
      const matchesSearch =
        !search || [user.name, user.role, user.username, user.email].join(' ').toLowerCase().includes(search);
      return matchesStatus && matchesSearch;
    });

  const { items, footer } = paginate(users, 8);

  const results = users.length
    ? buildTable({
        headings: ['Name', 'Role', 'Username', 'Email', 'Status', 'Actions'],
        rows: items.map(userRow).join(''),
        footer,
      })
    : `<div class="card">${emptyState('No users found.')}</div>`;

  $('#content').innerHTML = `
    <div class="page-actions">
      <p class="muted">${plural(db.users.length, 'system account')}</p>
      <button class="btn" data-action="add" data-type="users">+ Add User</button>
    </div>

    <div class="card filter-bar">
      ${searchBox('Search users...')}
      ${filterSelect('status', ['Active', 'Inactive'], 'All Statuses')}
    </div>

    ${results}`;
}

function userRow(user) {
  const words = user.name.split(/\s+/);
  const initials = (words.length > 1 ? words[0][0] + words[words.length - 1][0] : words[0].slice(0, 2)).toUpperCase();

  return `
    <tr>
      ${tableCell('Name', `<div class="pet-cell"><span class="avatar small">${initials}</span><b>${esc(user.name)}</b></div>`)}
      ${tableCell('Role', esc(user.role))}
      ${tableCell('Username', esc(user.username))}
      ${tableCell('Email', esc(user.email))}
      ${tableCell('Status', badge(user.status))}
      ${tableCell('Actions', rowActions('users', user.index))}
    </tr>`;
}
