setUpShell();

// A board that cannot say where its figures came from is worth very little, so this
// page is part of the kit rather than an afterthought. Replace the three lists below
// with the truth about your own board.

const SOURCES = [
  {
    name: 'Request log',
    detail: 'One row per request, with the product, the channel, the person it was assigned to and anything they wrote.',
    read: `Read at ${SNAPSHOT.read}`,
    note: 'Sample data. Nothing is connected.'
  },
  {
    name: 'People list',
    detail: 'Who is on the service desk, so a request can be counted against somebody.',
    read: `Read at ${SNAPSHOT.read}`,
    note: 'Sample data. Nothing is connected.'
  },
  {
    name: 'Product list',
    detail: 'The three products a request can be about, and the colour each one keeps across every chart.',
    read: `Read at ${SNAPSHOT.read}`,
    note: 'Sample data. Nothing is connected.'
  }
];

const COUNTING = [
  {
    name: 'A request',
    detail: 'One row in the log, counted once, on the day it arrived.'
  },
  {
    name: 'Something recorded',
    detail: 'A status, a note or a recorded reply on the row. It does not prove the customer was reached, or that the reply helped.'
  },
  {
    name: 'Hours to first reply',
    detail: 'The middle value, not the average, so one very slow request cannot drag it. Only rows carrying a recorded reply can be measured at all.'
  },
  {
    name: 'Waiting',
    detail: 'From the day the request arrived to today, for rows with nothing recorded. It does not prove nobody replied — it proves nobody wrote it down.'
  },
  {
    name: 'Note quality',
    detail: 'Measured on length alone: whether the next person could pick the request up. Nothing here judges the work.'
  }
];

const GAPS = [
  {
    name: 'Whether every request arrived',
    detail: 'Nothing compares the number of requests a channel issued against the rows that reached the log, so a request that never arrived does not appear anywhere on this board.'
  },
  {
    name: 'Whether the customer was happy',
    detail: 'No satisfaction score is joined to a request. A row marked closed is what the person recorded, and nothing has checked it.'
  },
  {
    name: 'Whether the reply was any good',
    detail: 'The board counts what was written down. That is all it can see.'
  }
];

function showList(id, items, withRead) {
  const list = document.getElementById(id);
  list.replaceChildren(...items.map((item) => {
    const line = create('li');
    line.append(create('b', '', item.name), create('span', '', item.detail));
    if (withRead && item.read) line.append(create('small', '', `${item.read} · ${item.note}`));
    return line;
  }));
}

showList('source-list', SOURCES, true);
showList('counting-list', COUNTING, false);
showList('gap-list', GAPS, false);
