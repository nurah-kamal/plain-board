setUpShell();

// Only a request with something recorded has a note to grade at all.
const gradedRows = () => replied(currentRows());

const inGrade = (grade) => gradedRows().filter((request) => noteGrade(request.note) === grade);

const state = { grade: null };

function showGrades() {
  const grid = document.getElementById('grade-grid');
  grid.replaceChildren();

  let drawn = 0;
  Object.entries(NOTE_GRADES).forEach(([key, label]) => {
    const group = inGrade(key);
    if (!group.length) return;
    drawn += 1;

    const tile = create('button', 'status-tile');
    tile.type = 'button';
    tile.dataset.focus = `grade:${key}`;

    const top = create('div', 'status-top');
    top.append(create('b', '', formatNumber(group.length)), create('span', '', group.length === 1 ? 'note' : 'notes'));

    const people = new Set(group.map((request) => request.person)).size;
    tile.append(top, statusChip({ tone: NOTE_GRADE_TONE[key], text: label }), create('p', '', plural(people, 'person', 'people')));
    tile.addEventListener('click', () => {
      Trail.go([key]);
      readUrl(true);
    });
    grid.append(tile);
  });

  if (!drawn) grid.append(create('p', 'empty', 'Nothing in this selection has a reply recorded against it.'));
}

function showGrade() {
  const rows = [...inGrade(state.grade)].sort((a, b) => a.days - b.days);

  document.getElementById('grade-panel').hidden = false;
  document.getElementById('grade-title').textContent = NOTE_GRADES[state.grade];

  const table = document.getElementById('grade-table');
  table.replaceChildren();

  const head = create('thead');
  const headRow = create('tr');
  ['Request', 'Product', 'Assigned to', 'Replied in', 'What was written'].forEach((label) => {
    const cell = create('th', '', label);
    cell.scope = 'col';
    headRow.append(cell);
  });
  head.append(headRow);

  const body = create('tbody');
  if (!rows.length) {
    const line = create('tr');
    const cell = create('td', 'is-empty', 'Nothing in this grade matches the filters above.');
    cell.colSpan = 5;
    line.append(cell);
    body.append(line);
  }

  rows.forEach((request) => {
    const line = create('tr');

    const first = create('th', 'cell-name');
    first.scope = 'row';
    first.append(create('b', '', request.id), create('small', '', waitingWords(request.days) + ' ago'));

    const written = create('td');
    written.append(request.note.trim()
      ? create('span', '', request.note)
      : create('span', 'is-empty', 'nothing written'));

    line.append(
      first,
      create('td', '', PRODUCTS[request.product]),
      create('td', '', request.person),
      create('td', 'cell-number', formatHours(request.reply)),
      written
    );
    body.append(line);
  });

  table.append(head, body);
  labelCells(table);
  sortableTable(table);
}

function render() {
  const graded = gradedRows();
  showFilterNote('filter-note', currentRows());

  document.getElementById('grade-panel').hidden = !state.grade;
  document.querySelector('.open-section').hidden = Boolean(state.grade);

  if (state.grade) {
    showGrade();
    return;
  }
  showGrades();

  const note = document.getElementById('filter-note');
  if (graded.length) {
    const thin = graded.filter((request) => ['thin', 'one-word', 'none'].includes(noteGrade(request.note))).length;
    note.textContent += ` · ${plural(thin, 'note', 'notes')} the next person could not pick up`;
  }
}

function readUrl(moveFocus) {
  const was = state.grade;
  const [key] = Trail.path();
  state.grade = Object.keys(NOTE_GRADES).includes(key) ? key : null;
  render();

  if (!moveFocus || state.grade === was) return;
  if (state.grade) {
    document.getElementById('grade-title').focus();
    return;
  }
  const tile = document.querySelector(`[data-focus="grade:${was}"]`);
  if (tile) tile.focus();
}

const exportRows = exportButton('Export these rows', () => {
  const rows = state.grade ? inGrade(state.grade) : gradedRows();
  downloadRows(
    'request-notes',
    ['Request', 'Product', 'Channel', 'Assigned to', 'Hours to reply', 'Grade', 'Note'],
    rows.map((request) => [
      request.id, PRODUCTS[request.product], request.channel, request.person,
      request.reply, NOTE_GRADES[noteGrade(request.note)], request.note
    ])
  );
});
document.getElementById('grade-panel').querySelector('.panel-head').append(exportRows);

setUpFilters(() => readUrl(false));
Trail.watch(() => readUrl(true));
readUrl(false);
