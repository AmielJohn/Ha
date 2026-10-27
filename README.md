# Veterinary Clinic Management System

Capstone project for the Olongapo City Veterinary Office.
Plain HTML, CSS and JavaScript. There is nothing to install: open `index.html` in a browser.

## Folder layout

```
index.html          loads every file below
css/
  base.css          colours, fonts
  login.css         login screen
  layout.css        sidebar, top bar, buttons, cards
  dashboard.css     dashboard page
  tables.css        search / filter bars and tables
  pages.css         vaccination cards, calendar, adoption cards, settings
  modal.css         pop-up windows and messages
  responsive.css    smaller screens
js/
  data.js           lists for the dropdowns and the `db` object that holds all records
  helpers.js        dates, status calculations, small bits of HTML
  icons.js          SVG icons and the login picture
  login.js          login screen
  layout.js         sidebar + top bar, page switching, app state
  pages/            one file per page (dashboard, pets, appointments, ...)
  forms.js          add / edit / view / delete pop-ups
  main.js           click and typing listeners, starts the app
```

## Things to know

- Records are only kept in memory, so they disappear when the page is refreshed.
  Saving to localStorage or a database is the next step.
- Login accepts any username and password for now.
- The Users list has a few sample staff accounts. Pets, appointments, vaccinations
  and adoption start empty. Add a pet first, because appointments and
  vaccinations are picked from the pet list.
- Vaccination status (Up-to-Date / Due Soon / Overdue) is worked out from the
  "next due" date, see `getVaccineStatus` in `js/helpers.js`.
