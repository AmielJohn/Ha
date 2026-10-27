// Fixed lists used by the dropdowns and filters
const SPECIES = ['Dog', 'Cat', 'Rabbit'];
const VETERINARIANS = ['Dr. Rivera', 'Dr. Reyes', 'Dr. Lim'];
const VACCINE_TYPES = [
  'Rabies',
  'Distemper',
  'Parvo',
  'FVRCP',
  'Leptospirosis',
  'RHDV',
  'Myxomatosis',
  'Bordetella',
];
const APPOINTMENT_STATUSES = ['Confirmed', 'Pending', 'In Progress', 'Completed', 'Cancelled'];
const SPECIES_EMOJI = { Dog: '🐕', Cat: '🐈', Rabbit: '🐰' };

// Today's date at midnight. The calendar, the dashboard and the
// vaccine reminders are all worked out from this date.
const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);

// All the records live in this object. Nothing is saved yet, so the
// pets, appointments, vaccinations and adoption lists start empty and
// are cleared again when the page is refreshed.
const db = {
  pets: [],
  appointments: [],
  vaccinations: [],
  adoption: [],

  users: [
    { name: 'Dr. Maria Rivera', role: 'Veterinarian', username: 'dr.rivera', email: 'rivera@olongapovets.gov.ph', status: 'Active' },
    { name: 'Dr. Jose Reyes', role: 'Veterinarian', username: 'dr.reyes', email: 'reyes@olongapovets.gov.ph', status: 'Active' },
    { name: 'Ana Bautista', role: 'Veterinary Staff', username: 'ana.bautista', email: 'abautista@olongapovets.gov.ph', status: 'Active' },
    { name: 'Carlo Santos', role: 'Veterinary Staff', username: 'carlo.santos', email: 'csantos@olongapovets.gov.ph', status: 'Active' },
    { name: 'Grace Mendoza', role: 'Veterinary Staff', username: 'grace.mendoza', email: 'gmendoza@olongapovets.gov.ph', status: 'Inactive' },
    { name: 'Dr. Liza Lim', role: 'Veterinarian', username: 'dr.lim', email: 'llim@olongapovets.gov.ph', status: 'Active' },
  ],

  settings: {
    name: 'City Veterinary Office',
    email: 'clinic@olongapovets.gov.ph',
    phone: '(047) 222-0000',
    address: 'Olongapo City, Zambales',
  },
};
