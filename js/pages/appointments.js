// Appointments page: a month calendar on the left, the schedule of the
// selected day and a weekly summary on the right.

// Colour of the little dot for each appointment status
const STATUS_DOT_COLORS = {
  Confirmed: 'green',
  Pending: 'orange',
  'In Progress': 'blue',
  Cancelled: 'red',
  Completed: 'gray',
};

function renderAppointments() {
  const search = state.search.toLowerCase();

  // add the owner and address from the pet's record, then apply the search box
  const appointments = db.appointments
    .map((appointment, index) => {
      const pet = findPet(appointment.pet);
      return { ...appointment, index, owner: pet.owner || '—', address: pet.address || 'Olongapo City' };
    })
    .filter((a) => !search || [a.pet, a.owner, a.purpose, a.vet, a.status].join(' ').toLowerCase().includes(search));

  const selectedDay = appointments.filter((a) => a.date === state.selectedDate).sort(compareByDateTime);
  const scheduleTitle = state.selectedDate === TODAY_ISO ? "Today's Schedule" : 'Schedule';

  $('#content').innerHTML = `
    <div class="page-actions right">
      ${searchBox('Search appointments...')}
      <button class="btn" data-action="add" data-type="appointments">+ New Appointment</button>
    </div>

    <div class="calendar-layout">
      ${calendarCard(appointments)}

      <div class="schedule-side">
        <div class="card">
          <h3>${scheduleTitle}</h3>
          <small class="muted">${formatDate(state.selectedDate)} — ${plural(selectedDay.length, 'appointment')}</small>
          <div class="timeline">
            ${selectedDay.length ? selectedDay.map(timelineItem).join('') : emptyState('No appointments on this day.')}
          </div>
        </div>
        ${weekSummaryCard()}
      </div>
    </div>`;
}

function calendarCard(appointments) {
  const { year, month } = state.calendar;
  const firstWeekday = new Date(year, month, 1).getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // empty squares before the 1st so the day lands under the right weekday
  let dayCells = '<span class="day blank"></span>'.repeat(firstWeekday);

  for (let day = 1; day <= daysInMonth; day++) {
    const date = toISODate(new Date(year, month, day));
    const dayAppointments = appointments.filter((a) => a.date === date);
    const dots = dayAppointments
      .slice(0, 3)
      .map((a) => `<i class="dot ${STATUS_DOT_COLORS[a.status]}"></i>`)
      .join('');

    const classes = ['day'];
    if (dayAppointments.length) classes.push('has-appointments');
    if (date === state.selectedDate) classes.push('selected');
    if (date === TODAY_ISO) classes.push('today');

    dayCells += `
      <button class="${classes.join(' ')}" data-date="${date}" aria-label="${formatDate(date)}: ${plural(dayAppointments.length, 'appointment')}">
        <b>${day}</b>
        <span class="day-dots">${dots}</span>
      </button>`;
  }

  const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => `<span>${d}</span>`).join('');

  return `
    <div class="card calendar-card">
      <div class="card-header">
        <h3>${MONTH_NAMES[month]} ${year}</h3>
        <div class="month-nav">
          <button data-month="-1" aria-label="Previous month">‹</button>
          <button data-month="1" aria-label="Next month">›</button>
        </div>
      </div>

      <div class="weekday-row">${weekdayLabels}</div>
      <div class="day-grid">${dayCells}</div>

      <div class="legend">
        <span><i class="dot green"></i>Scheduled</span>
        <span><i class="dot blue"></i>In Progress</span>
        <span><i class="dot orange"></i>Pending</span>
        <span><i class="dot red"></i>Cancelled</span>
      </div>
    </div>`;
}

function timelineItem(appointment) {
  return `
    <div class="timeline-item">
      <i class="dot ${STATUS_DOT_COLORS[appointment.status]}"></i>
      <div class="appointment-card">
        <div class="appointment-card-top">
          <b>${formatTime(appointment.time)}</b>
          ${badge(appointment.status)}
        </div>
        <strong>${esc(appointment.pet)}</strong>
        <p><b>Owner:</b> ${esc(appointment.owner)}</p>
        <p><b>Address:</b> ${esc(appointment.address)}</p>
        <small>${esc(appointment.purpose)} • ${esc(appointment.vet)}</small>
        <div class="row-actions small">
          <button data-action="edit" data-type="appointments" data-index="${appointment.index}" title="Edit">✏️</button>
          <button class="danger" data-action="delete" data-type="appointments" data-index="${appointment.index}" title="Delete">🗑️</button>
        </div>
      </div>
    </div>`;
}

// Counts for the week (Sunday to Saturday) that contains the selected day
function weekSummaryCard() {
  const selected = parseISODate(state.selectedDate);
  const weekStart = new Date(selected);
  weekStart.setDate(selected.getDate() - selected.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const thisWeek = db.appointments.filter((a) => a.date >= toISODate(weekStart) && a.date <= toISODate(weekEnd));
  const countWithStatus = (status) => thisWeek.filter((a) => a.status === status).length;

  return `
    <div class="card">
      <h3>This Week Summary</h3>
      <div class="week-summary">
        <div class="week-row green"><span>Total Appointments</span><b>${thisWeek.length}</b></div>
        <div class="week-row green"><span>Completed</span><b>${countWithStatus('Completed')}</b></div>
        <div class="week-row yellow"><span>Pending</span><b>${countWithStatus('Pending')}</b></div>
        <div class="week-row red"><span>Cancelled</span><b>${countWithStatus('Cancelled')}</b></div>
      </div>
    </div>`;
}

// The ‹ › buttons above the calendar
function changeMonth(direction) {
  const target = new Date(state.calendar.year, state.calendar.month + direction, 1);
  state.calendar = { year: target.getFullYear(), month: target.getMonth() };

  // select today if it is in the new month, otherwise the 1st
  const showingThisMonth = target.getFullYear() === TODAY.getFullYear() && target.getMonth() === TODAY.getMonth();
  state.selectedDate = showingThisMonth ? TODAY_ISO : toISODate(target);

  refresh();
}
