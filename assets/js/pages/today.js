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
  holder.replaceChildren();

  if (!items.length) {
    holder.append(create('p', 'start-empty', 'Nothing in this selection is waiting on anybody.'));
    return;
  }

  holder.append(create('b', 'start-lead', 'Where to start'));
  items.forEach((item) => {
    const link = create('a', `start-item ${item.tone}`);
    link.href = item.href;
    link.append(create('b', '', formatNumber(item.count)), create('span', '', item.count === 1 ? item.one : item.many));
    holder.append(link);
  });
}

function showTiles(rows) {
  const answered = replied(rows);
  const waiting = unanswered(rows);
  const sameDay = answered.filter((request) => request.reply <= 24).length;
  const middle = median(answered.map((request) => request.reply));

  const tiles = [
    {
      label: 'Requests', icon: ICONS.rows, tone: 'is-info',
      value: formatNumber(rows.length),
      note: `${plural(new Set(rows.map((request) => request.person)).size, 'person', 'people')} · ${plural(new Set(rows.map((request) => request.channel)).size, 'channel', 'channels')}`,
      spark: TRENDS.opened,
      sparkLabel: 'Requests opened in each of the last six weeks',
      about: 'One row per request, counted once. It is what the board holds, not what was sent — nothing here checks that every request arrived.'
    },
    {
      label: 'Answered within a day', icon: ICONS.check, tone: 'is-good',
      value: answered.length ? formatPercent(sameDay / answered.length) : '—',
      note: answered.length ? `${formatNumber(sameDay)} of ${formatNumber(answered.length)} with a reply recorded` : 'nothing recorded to measure',
      spark: TRENDS.answeredSameDay,
      sparkLabel: 'Share answered within a day, over the last six weeks',
      about: 'Counted only on requests that have a recorded reply. A request nobody wrote anything against cannot be measured at all, so it is left out rather than counted as slow.'
    },
    {
      label: 'Nothing recorded', icon: ICONS.alert, tone: 'is-warn',
      value: formatNumber(waiting.length),
      note: waiting.length ? `longest has waited ${waitingWords(Math.max(...waiting.map((request) => request.days))).toLowerCase()}` : 'everything has a reply recorded',
      spark: TRENDS.waiting,
      sparkLabel: 'Requests with nothing recorded, over the last six weeks',
      about: 'Requests with no reply written against them. It does not prove nobody replied — only that nobody wrote it down.'
    },
    {
      label: 'Hours to first reply', icon: ICONS.clock, tone: 'is-info',
      value: middle === null ? '—' : formatHours(middle),
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
  const points = ARRIVALS.map((value, index) => ({ label: `Day ${index + 1}`, value }));
  document.getElementById('arrivals-chart').replaceChildren(areaChart(points, { label: 'requests', key: 'Requests arriving' }));
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
render();
