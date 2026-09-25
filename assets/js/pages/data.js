setUpShell();

// This page is the one place the board talks about where its rows come from. Everything
// it says has to be checkable against the file the reader just handed it, which is why
// it counts what it refused as carefully as what it took.

const COLUMN_HELP = [
  ['id', 'ref, reference, ticket, number, case', 'Needed. What a row is called, so it can be pointed at.'],
  ['arrived', 'date, opened, created, received, raised', 'Needed, unless days is given. A day-first date, or an ISO one.'],
  ['days', 'days ago, age', 'Instead of arrived: whole days back from today.'],
  ['product', 'group, category, type, service, queue', 'What the board splits by. Missing rows are grouped as Ungrouped.'],
  ['person', 'owner, assignee, assigned to, handler, agent', 'Who it sits with. Missing reads as Nobody recorded.'],
  ['channel', 'source, via, received by', 'How it arrived. Missing reads as Not recorded.'],
  ['reply', 'reply hours, hours to reply, response hours', 'Hours to the first reply. Blank means nothing was recorded, which is not the same as no reply.'],
  ['replied', 'first reply, responded, answered at', 'Instead of reply: the board works the hours out from arrived.'],
  ['state', 'status', 'open, answered or closed. Worked out from reply when it is missing.'],
  ['note', 'notes, comment, summary, detail, description', 'What was written down. The board measures its length, never its content.']
];

function showColumns() {
  const body = document.querySelector('#columns tbody');
  body.replaceChildren(...COLUMN_HELP.map(([name, aliases, what]) => {
    const row = create('tr');
    const first = create('td');
    first.append(create('b', '', name));
    const second = create('td', 'cell-name', aliases);
    const third = create('td', '', what);
    row.append(first, second, third);
    return row;
  }));
}

// ---------- what is on the board right now ----------

function showWhatIsShowing() {
  const holder = document.getElementById('showing');
  holder.replaceChildren();

  if (!LOADED) {
    holder.append(create('p', '', 'The demo: 129 invented requests over twelve weeks, six invented people, three products and three channels.'));
    holder.append(create('p', 'panel-note', 'Every figure on this board is computed from those rows. Nothing here describes anything real, and nothing on this board is connected to a live system.'));
    return;
  }

  const line = create('p');
  line.append(
    document.createTextNode('Your file, '),
    create('b', '', LOADED.name || 'unnamed'),
    document.createTextNode(`: ${plural(LOADED.rows.length, 'row', 'rows')}, ${plural(Object.keys(LOADED.groups || {}).length, 'group', 'groups')}, read ${SNAPSHOT.read}.`)
  );
  holder.append(line);

  const age = LOADED.newest === 0
    ? 'The newest row arrived today.'
    : `The newest row is ${plural(LOADED.newest, 'day', 'days')} old, so anything this board says about "today" is as old as that.`;
  holder.append(create('p', 'panel-note', `${age} The oldest is ${plural(LOADED.oldest, 'day', 'days')} back, and the board reads the last twelve weeks of whatever it is given.`));

  const tools = create('div', 'state-actions');
  const back = create('button', 'button button-secondary button-inline');
  back.type = 'button';
  back.textContent = 'Go back to the demo';
  back.addEventListener('click', () => {
    BoardSource.forget();
    showToast('Forgotten. The board is loading the demo again.');
    setTimeout(() => location.reload(), 700);
  });
  tools.append(back);
  holder.append(tools);
}

// ---------- what happened to the file ----------

function report(source, kept) {
  const holder = document.getElementById('outcome');
  holder.replaceChildren();

  const said = [];
  said.push(`${plural(source.rows.length, 'row', 'rows')} read from ${source.name}.`);

  if (source.problems.length) {
    const why = {};
    source.problems.forEach((problem) => { why[problem.why] = (why[problem.why] || 0) + 1; });
    const parts = Object.entries(why).map(([reason, count]) => `${formatNumber(count)} because ${reason}`);
    said.push(`${plural(source.problems.length, 'line was', 'lines were')} refused: ${parts.join(', ')}.`);
  }

  const summary = create('p', '', said.join(' '));
  holder.append(summary);

  if (source.problems.length) {
    const first = source.problems.slice(0, 5).map((problem) => `line ${problem.line} (${problem.why})`).join(', ');
    holder.append(create('p', 'panel-note', `The first of them: ${first}${source.problems.length > 5 ? `, and ${formatNumber(source.problems.length - 5)} more` : ''}. A refused line is left out of every figure on this board rather than counted as a zero.`));
  }

  if (source.ignored && source.ignored.length) {
    holder.append(create('p', 'panel-note', `Columns the board does not read, left alone: ${source.ignored.join(', ')}.`));
  }

  const groups = Object.keys(source.groups || {}).length;
  if (groups > 5) {
    holder.append(create('p', 'panel-note', `${formatNumber(groups)} groups, and the colour ramp has five steps, so colours repeat after the fifth. Every chart that splits by group names its colours in a key, so a repeat can be read — but it is worth knowing before you look at one.`));
  }

  if (!kept.kept) {
    holder.append(create('p', 'panel-note is-warn', kept.why));
    return;
  }

  const tools = create('div', 'state-actions');
  const open = create('button', 'button button-inline');
  open.type = 'button';
  open.textContent = 'Show the board';
  open.addEventListener('click', () => { location.href = BOARD.home; });
  tools.append(open);
  holder.append(tools);
  open.focus();
}

function refuse(message) {
  const holder = document.getElementById('outcome');
  holder.replaceChildren();
  const panel = create('p', 'is-warn');
  panel.setAttribute('role', 'alert');
  panel.textContent = message;
  holder.append(panel);
  holder.append(create('p', 'panel-note', 'Nothing was changed. The board is still showing what it was showing before.'));
}

function take(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onerror = () => refuse('That file could not be opened.');
  reader.onload = () => {
    const source = readSource(String(reader.result), file.name);
    if (source.error) return refuse(source.error);
    const kept = BoardSource.keep(source);
    report(source, kept);
  };
  reader.readAsText(file);
}

// ---------- choosing one ----------

function setUpDrop() {
  const drop = document.getElementById('drop');
  const field = document.getElementById('file');

  field.addEventListener('change', () => take(field.files[0]));

  ['dragenter', 'dragover'].forEach((name) => drop.addEventListener(name, (event) => {
    event.preventDefault();
    drop.dataset.over = 'true';
  }));
  ['dragleave', 'drop'].forEach((name) => drop.addEventListener(name, (event) => {
    event.preventDefault();
    delete drop.dataset.over;
  }));
  drop.addEventListener('drop', (event) => take(event.dataTransfer.files[0]));
}

function render() {
  showWhatIsShowing();
  showColumns();
  setUpDrop();
}

startPage(render);
