// Everything the demo board shows. All of it is invented.
//
// Swap this file for your own and the rest of the kit follows. The shapes below are
// the only contract: the pages read these names, and nothing else.

// When the sample figures were taken. Nothing here moves, so the board says so
// rather than pretending it refreshed.
const SNAPSHOT = {
  read: 'Friday 18 September, 17:40',
  readShort: '17:40'
};

// The dimension a board groups by. Three is the comfortable maximum for the
// colours below; add more and they start repeating.
const PRODUCTS = {
  delivery: 'Delivery',
  billing: 'Billing',
  accounts: 'Accounts'
};

const PRODUCT_COLOUR = {
  delivery: 'var(--group-1)',
  billing: 'var(--group-2)',
  accounts: 'var(--group-3)'
};

const CHANNELS = ['Email', 'Phone', 'Web form'];

const PEOPLE = ['Ada Nkemelu', 'Tomas Brandt', 'Priya Raghunathan', 'Joel Okonkwo', 'Mireille Dufour', 'Sam Whitlock'];

// One row per request.
//   days   how many days ago it arrived
//   reply  hours to the first recorded reply, or null when nothing was recorded
//   state  open | answered | closed
const REQUESTS = [
  { id: 'R-1088', product: 'delivery', channel: 'Phone',    person: 'Ada Nkemelu',        days: 0,  reply: 1,    state: 'answered', note: 'Parcel scanned at the depot. Customer told to expect it Tuesday.' },
  { id: 'R-1087', product: 'billing',  channel: 'Email',    person: 'Tomas Brandt',       days: 0,  reply: 3,    state: 'answered', note: 'Duplicate charge confirmed, refund raised with finance.' },
  { id: 'R-1086', product: 'accounts', channel: 'Web form', person: 'Priya Raghunathan',  days: 0,  reply: null, state: 'open',     note: '' },
  { id: 'R-1085', product: 'delivery', channel: 'Email',    person: 'Joel Okonkwo',       days: 0,  reply: 6,    state: 'answered', note: 'Asked for the tracking number.' },
  { id: 'R-1084', product: 'billing',  channel: 'Phone',    person: 'Ada Nkemelu',        days: 1,  reply: 2,    state: 'closed',   note: 'Explained the pro-rata line on the invoice. Customer happy.' },
  { id: 'R-1083', product: 'accounts', channel: 'Email',    person: 'Mireille Dufour',    days: 1,  reply: 4,    state: 'answered', note: 'Reset link sent.' },
  { id: 'R-1082', product: 'delivery', channel: 'Web form', person: 'Sam Whitlock',       days: 1,  reply: null, state: 'open',     note: '' },
  { id: 'R-1081', product: 'billing',  channel: 'Email',    person: 'Tomas Brandt',       days: 1,  reply: 9,    state: 'answered', note: 'ok' },
  { id: 'R-1080', product: 'delivery', channel: 'Phone',    person: 'Joel Okonkwo',       days: 2,  reply: 1,    state: 'closed',   note: 'Driver returned the parcel to the depot; redelivery booked for Thursday.' },
  { id: 'R-1079', product: 'accounts', channel: 'Web form', person: 'Priya Raghunathan',  days: 2,  reply: 5,    state: 'answered', note: 'Second address added to the account.' },
  { id: 'R-1078', product: 'billing',  channel: 'Email',    person: 'Ada Nkemelu',        days: 2,  reply: null, state: 'open',     note: '' },
  { id: 'R-1077', product: 'delivery', channel: 'Email',    person: 'Mireille Dufour',    days: 2,  reply: 2,    state: 'closed',   note: 'Wrong item shipped. Replacement sent and the original collected.' },
  { id: 'R-1076', product: 'accounts', channel: 'Phone',    person: 'Sam Whitlock',       days: 3,  reply: 7,    state: 'answered', note: 'done' },
  { id: 'R-1075', product: 'billing',  channel: 'Web form', person: 'Tomas Brandt',       days: 3,  reply: 3,    state: 'closed',   note: 'Card on file had expired. Customer updated it on the call.' },
  { id: 'R-1074', product: 'delivery', channel: 'Email',    person: 'Joel Okonkwo',       days: 3,  reply: null, state: 'open',     note: '' },
  { id: 'R-1073', product: 'accounts', channel: 'Email',    person: 'Ada Nkemelu',        days: 4,  reply: 11,   state: 'answered', note: 'Asked them to confirm the email on the account before we change anything.' },
  { id: 'R-1072', product: 'billing',  channel: 'Phone',    person: 'Priya Raghunathan',  days: 4,  reply: 1,    state: 'closed',   note: 'Refund already showing on their statement.' },
  { id: 'R-1071', product: 'delivery', channel: 'Web form', person: 'Mireille Dufour',    days: 4,  reply: null, state: 'open',     note: '' },
  { id: 'R-1070', product: 'accounts', channel: 'Email',    person: 'Sam Whitlock',       days: 5,  reply: 26,   state: 'answered', note: 'sorted' },
  { id: 'R-1069', product: 'billing',  channel: 'Email',    person: 'Tomas Brandt',       days: 5,  reply: 4,    state: 'closed',   note: 'Annual plan applied and the difference credited.' },
  { id: 'R-1068', product: 'delivery', channel: 'Phone',    person: 'Joel Okonkwo',       days: 5,  reply: 2,    state: 'closed',   note: 'Depot confirmed the parcel is on the Friday run.' },
  { id: 'R-1067', product: 'accounts', channel: 'Web form', person: 'Ada Nkemelu',        days: 6,  reply: null, state: 'open',     note: '' },
  { id: 'R-1066', product: 'billing',  channel: 'Email',    person: 'Priya Raghunathan',  days: 6,  reply: 8,    state: 'answered', note: 'Sent the itemised breakdown they asked for.' },
  { id: 'R-1065', product: 'delivery', channel: 'Email',    person: 'Mireille Dufour',    days: 6,  reply: 3,    state: 'closed',   note: 'Address corrected before dispatch.' },
  { id: 'R-1064', product: 'accounts', channel: 'Phone',    person: 'Sam Whitlock',       days: 7,  reply: 1,    state: 'closed',   note: 'Walked them through adding a second user.' },
  { id: 'R-1063', product: 'billing',  channel: 'Web form', person: 'Tomas Brandt',       days: 7,  reply: null, state: 'open',     note: '' },
  { id: 'R-1062', product: 'delivery', channel: 'Email',    person: 'Joel Okonkwo',       days: 8,  reply: 14,   state: 'answered', note: 'chased' },
  { id: 'R-1061', product: 'accounts', channel: 'Email',    person: 'Ada Nkemelu',        days: 8,  reply: 5,    state: 'closed',   note: 'Account merged with the older one and the duplicate closed.' },
  { id: 'R-1060', product: 'billing',  channel: 'Phone',    person: 'Priya Raghunathan',  days: 9,  reply: 2,    state: 'closed',   note: 'Explained why the first month is charged on signup.' },
  { id: 'R-1059', product: 'delivery', channel: 'Web form', person: 'Mireille Dufour',    days: 9,  reply: null, state: 'open',     note: '' },
  { id: 'R-1058', product: 'accounts', channel: 'Email',    person: 'Sam Whitlock',       days: 10, reply: 31,   state: 'answered', note: 'Two-step sign-in switched off at their request, with a note on the account.' },
  { id: 'R-1057', product: 'billing',  channel: 'Email',    person: 'Tomas Brandt',       days: 10, reply: 6,    state: 'closed',   note: 'Invoice reissued to the new company name.' },
  { id: 'R-1056', product: 'delivery', channel: 'Phone',    person: 'Joel Okonkwo',       days: 11, reply: 1,    state: 'closed',   note: 'Parcel found at the neighbour. Nothing further needed.' },
  { id: 'R-1055', product: 'accounts', channel: 'Web form', person: 'Ada Nkemelu',        days: 12, reply: null, state: 'open',     note: '' },
  { id: 'R-1054', product: 'billing',  channel: 'Email',    person: 'Priya Raghunathan',  days: 12, reply: 4,    state: 'closed',   note: 'Late fee waived once, and the customer told it is once.' },
  { id: 'R-1053', product: 'delivery', channel: 'Email',    person: 'Mireille Dufour',    days: 13, reply: 2,    state: 'closed',   note: 'Courier claim opened, reference passed to the customer.' },
  { id: 'R-1052', product: 'accounts', channel: 'Phone',    person: 'Sam Whitlock',       days: 14, reply: 12,   state: 'answered', note: 'no' },
  { id: 'R-1051', product: 'billing',  channel: 'Web form', person: 'Tomas Brandt',       days: 15, reply: null, state: 'open',     note: '' },
  { id: 'R-1050', product: 'delivery', channel: 'Email',    person: 'Joel Okonkwo',       days: 16, reply: 3,    state: 'closed',   note: 'Redelivery completed and confirmed with the customer.' },
  { id: 'R-1049', product: 'accounts', channel: 'Email',    person: 'Ada Nkemelu',        days: 17, reply: 9,    state: 'closed',   note: 'Old email removed from the account after they confirmed by phone.' },
  { id: 'R-1048', product: 'billing',  channel: 'Phone',    person: 'Priya Raghunathan',  days: 18, reply: 1,    state: 'closed',   note: 'Direct debit reinstated.' },
  { id: 'R-1047', product: 'delivery', channel: 'Web form', person: 'Mireille Dufour',    days: 19, reply: null, state: 'open',     note: '' },
  { id: 'R-1046', product: 'accounts', channel: 'Email',    person: 'Sam Whitlock',       days: 20, reply: 18,   state: 'answered', note: 'Told them the export will take a few days.' },
  { id: 'R-1045', product: 'billing',  channel: 'Email',    person: 'Tomas Brandt',       days: 21, reply: 7,    state: 'closed',   note: 'Refund confirmed as received.' },
  { id: 'R-1044', product: 'delivery', channel: 'Phone',    person: 'Joel Okonkwo',       days: 23, reply: null, state: 'open',     note: '' }
];

// How many arrived each day, oldest first. Used by the area chart.
const ARRIVALS = [
  14, 11, 9, 16, 18, 7, 4, 15, 13, 12, 19, 21, 8, 5, 17, 14, 11, 16, 23, 20,
  6, 4, 18, 15, 13, 17, 22, 19, 9, 12
];

// The last six weeks, used by the sparklines inside the figure tiles.
const TRENDS = {
  opened: [78, 84, 71, 92, 88, 96],
  answeredSameDay: [61, 66, 58, 69, 72, 74],
  waiting: [14, 11, 16, 12, 10, 11],
  hoursToReply: [6, 5, 7, 5, 4, 4]
};

// The periods the segmented control at the top of a page offers.
const RANGES = [['week', '7 days'], ['month', '30 days'], ['quarter', '90 days']];
const RANGE_DAYS = { week: 7, month: 30, quarter: 90 };

// ---------- formatting ----------

const formatNumber = (value) => new Intl.NumberFormat('en-GB').format(Math.round(value));

const formatPercent = (fraction) => `${Math.round(fraction * 100)}%`;

const formatHours = (hours) => (hours === null ? 'nothing recorded' : hours < 24 ? `${hours}h` : `${Math.round(hours / 24)}d`);

const plural = (count, one, many) => `${formatNumber(count)} ${count === 1 ? one : many}`;

// ---------- reading the rows ----------

// The middle value, not the average, so one very old request cannot drag it.
function median(values) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : Math.round((sorted[middle - 1] + sorted[middle]) / 2);
}

const inRange = (range) => REQUESTS.filter((request) => request.days < RANGE_DAYS[range]);

const matching = (range, product, person) => inRange(range).filter((request) =>
  (product === 'All' || request.product === product) &&
  (person === 'All' || request.person === person));

// Nothing recorded at all. Not the same as nobody having phoned — only that nobody wrote it down.
const unanswered = (rows) => rows.filter((request) => request.reply === null);

const replied = (rows) => rows.filter((request) => request.reply !== null);

// How long a request with nothing recorded has been waiting.
const WAIT_BANDS = [
  ['same-day', 'Arrived today', (days) => days < 1],
  ['1-3', '1 to 3 days', (days) => days >= 1 && days <= 3],
  ['4-7', '4 to 7 days', (days) => days >= 4 && days <= 7],
  ['8-14', '8 to 14 days', (days) => days >= 8 && days <= 14],
  ['15-plus', '15 days or more', (days) => days >= 15]
];

const bandOf = (days) => (WAIT_BANDS.find(([, , test]) => test(days)) || WAIT_BANDS[0])[0];

// A note is graded on length alone. Nothing here judges the work.
function noteGrade(note) {
  const words = note.trim().split(/\s+/).filter(Boolean).length;
  if (words === 0) return 'none';
  if (words === 1) return 'one-word';
  if (words < 6) return 'thin';
  return 'full';
}

const NOTE_GRADES = {
  full: 'Says what happened',
  thin: 'Barely a note',
  'one-word': 'One word',
  none: 'Nothing written'
};
