setUpShell();

// What needs somebody today, before any of the figures below.
function showStart(rows) {
  const waiting = unanswered(rows);
  const items = [
    {
      count: waiting.filter((request) => request.days >= 8).length,
      one: 'request has waited over a week with nothing recorded',
      many: 'requests have waited over a week with nothing recorded',
      tone: 'is-stop',
      href: 'requests.html#8-14'
    },
    {
      count: rows.filter((request) => request.reply !== null && noteGrade(request.note) === 'one-word').length,
      one: 'reply was recorded in a single word',
      many: 'replies were recorded in a single word',
      tone: 'is-hold',
      href: 'team.html'
    },
    {
      count: waiting.filter((request) => request.days < 1).length,
      one: 'request arrived today and has had no reply yet',
      many: 'requests arrived today and have had no reply yet',
      tone: 'is-hold',
      href: 'requests.html#same-day'
    }
  ].filter((item) => item.count);

  const holder = document.getElementById('start-here');
  holder.replaceChildren(buildBanner(items, {
    action: 'Open the waiting list',
    calmTitle: 'Nothing in this selection is waiting on anybody.',
    calmNote: 'Every request here has a reply recorded against it.'
  }));
}

function showTiles(rows) {
  const answered = replied(rows);
  const waiting = unanswered(rows);
  const sameDay = answeredWithinADay(rows).length;
  const middle = median(answered.map((request) => request.reply));

  // The same selection, one period earlier. On the longest period the board reaches
  // the start of its own data, so there is nothing honest to compare against and the
  // tiles simply go without a chip.
  const comparable = hasPrevious(filterState.range);
  const before = comparable ? previousRows() : [];
  const beforeAnswered = replied(before);
  const beforeSameDay = answeredWithinADay(before).length;
  const beforeMiddle = median(beforeAnswered.map((request) => request.reply));
  const since = ` on the previous ${rangeLabel().toLowerCase()}`;

  // A share has to be compared as a share, not as a count of the rows behind it.
  const shareNow = answered.length ? Math.round((sameDay / answered.length) * 100) : null;
  const shareBefore = beforeAnswered.length ? Math.round((beforeSameDay / beforeAnswered.length) * 100) : null;

  const tiles = [
    {
      label: 'Requests',
      value: formatNumber(rows.length),
      // More requests arriving is not better or worse, it is busier, so the chip
      // states the move and stops there.
      change: comparable ? movement(rows.length, before.length, { good: null, suffix: since }) : null,
      note: `${plural(new Set(rows.map((request) => request.person)).size, 'person', 'people')} · ${plural(new Set(rows.map((request) => request.channel)).size, 'channel', 'channels')}`,
      spark: TRENDS.opened,
      sparkLabel: 'Requests opened in each of the last six weeks',
      about: 'One row per request, counted once. It is what the board holds, not what was sent — nothing here checks that every request arrived. The change compares this period with the same length of time immediately before it.'
    },
    {
      label: 'Answered within a day',
      value: shareNow === null ? '—' : `${shareNow}%`,
      change: comparable && shareNow !== null && shareBefore !== null
        ? movement(shareNow, shareBefore, { good: 'up', suffix: since })
        : null,
      note: answered.length ? `${formatNumber(sameDay)} of ${formatNumber(answered.length)} with a reply recorded` : 'nothing recorded to measure',
      spark: TRENDS.answeredSameDay,
      sparkLabel: 'Share answered within a day, over the last six weeks',
      about: 'Counted only on requests that have a recorded reply. A request nobody wrote anything against cannot be measured at all, so it is left out rather than counted as slow.'
    },
    {
      label: 'Nothing recorded',
      value: formatNumber(waiting.length),
      change: comparable ? movement(waiting.length, unanswered(before).length, { good: 'down', suffix: since }) : null,
      note: waiting.length ? `longest has waited ${waitingWords(Math.max(...waiting.map((request) => request.days))).toLowerCase()}` : 'everything has a reply recorded',
      spark: TRENDS.waiting,
      sparkLabel: 'Requests with nothing recorded, over the last six weeks',
      about: 'Requests with no reply written against them. It does not prove nobody replied — only that nobody wrote it down. A recent period always looks worse, because there has been less time for anybody to write anything.'
    },
    {
      label: 'Hours to first reply',
      value: middle === null ? '—' : formatHours(middle),
      change: comparable && middle !== null && beforeMiddle !== null
        ? movement(middle, beforeMiddle, { good: 'down', suffix: since })
        : null,
      note: 'the middle value, not the average',
      spark: TRENDS.hoursToReply,
      sparkLabel: 'Middle hours to a first reply, over the last six weeks',
      about: 'The middle value, so one very old request cannot drag it. Only requests carrying a recorded reply can be measured.'
    }
  ];

  document.getElementById('tiles').replaceChildren(...tiles.map(statTile));
}

function showWaiting(rows) {
  const waiting = unanswered(rows);
  const bars = WAIT_BANDS.map(([key, label]) => ({
    label,
    value: waiting.filter((request) => bandOf(request.days) === key).length,
    note: key === '15-plus' ? 'oldest' : ''
  }));
  document.getElementById('waiting-chart').replaceChildren(columnChart(bars));
}

function showChannels(rows) {
  const slices = CHANNELS.map((channel) => ({
    label: channel,
    value: rows.filter((request) => request.channel === channel).length
  })).filter((slice) => slice.value);

  const holder = document.getElementById('channel-chart');
  if (!slices.length) {
    holder.replaceChildren(create('p', 'empty', 'Nothing in this selection.'));
    return;
  }
  holder.replaceChildren(donutChart(slices));
}

function showArrivals() {
  document.getElementById('arrivals-chart').replaceChildren(areaChart(ARRIVALS, { label: 'requests', key: 'Requests arriving' }));
}

function showNotes(rows) {
  const answered = replied(rows);
  const bars = Object.entries(NOTE_GRADES)
    .map(([key, label]) => ({
      label,
      value: answered.filter((request) => noteGrade(request.note) === key).length
    }))
    .filter((row) => row.value);

  const holder = document.getElementById('notes-chart');
  if (!bars.length) {
    holder.replaceChildren(create('p', 'empty', 'No replies recorded in this selection.'));
    return;
  }
  holder.replaceChildren(barList(bars));
}

function render() {
  const rows = currentRows();
  showFilterNote('filter-note', rows);
  showStart(rows);
  showTiles(rows);
  showWaiting(rows);
  showChannels(rows);
  showArrivals();
  showNotes(rows);
}

setUpFilters(render);
startPage(render);
