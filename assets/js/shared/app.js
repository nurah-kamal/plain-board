// The shell every signed-in page shares: the menu, the signed-in person, the search,
// and small formatting helpers. Nothing in here knows what the board is about —
// everything board-specific is read from BOARD, in shared/board.js.

function create(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

const initials = (name) => name.split(/\s+/).map((word) => word[0]).slice(0, 2).join('').toUpperCase();

// Page choices live in this tab only, so nothing ends up in the address bar
function remember(key, value) {
  try {
    sessionStorage.setItem(`${BOARD.storageKey}-${key}`, value);
  } catch {
    // The page still works, it just won't remember the choice.
  }
}

function recall(key) {
  try {
    return sessionStorage.getItem(`${BOARD.storageKey}-${key}`);
  } catch {
    return null;
  }
}

// Redrawing a list replaces its buttons, which would drop keyboard focus back to the top of the page.
// Buttons carry a data-focus key so focus can land on the matching one again.
function keepFocus(redraw, fallback) {
  const key = document.activeElement && document.activeElement.dataset ? document.activeElement.dataset.focus : null;
  redraw();
  if (!key) return;
  const match = [...document.querySelectorAll('[data-focus]')].find((node) => node.dataset.focus === key);
  const target = match || (fallback && document.querySelector(fallback));
  if (target) target.focus();
}

function buildSegmented(container, options, current, onChange) {
  container.replaceChildren();
  options.forEach(([value, label]) => {
    const button = create('button', '', label);
    button.type = 'button';
    button.dataset.focus = `${container.id}:${value}`;
    button.setAttribute('aria-pressed', String(value === current));
    // The pressed one moves here, so a caller that does not rebuild the control still shows the change
    button.addEventListener('click', () => keepFocus(() => {
      [...container.children].forEach((other) => other.setAttribute('aria-pressed', String(other === button)));
      onChange(value);
    }));
    container.append(button);
  });
}

function icon(paths, size = 18) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', size);
  svg.setAttribute('height', size);
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '2');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');
  paths.forEach((d) => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    svg.append(path);
  });
  return svg;
}

const ICONS = {
  sun: ['M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7', 'M12 2.5v2', 'M12 19.5v2', 'M4.2 4.2l1.4 1.4', 'M18.4 18.4l1.4 1.4', 'M2.5 12h2', 'M19.5 12h2', 'M4.2 19.8l1.4-1.4', 'M18.4 5.6l1.4-1.4'],
  moon: ['M20 14.5A8.5 8.5 0 1 1 9.5 4a6.6 6.6 0 0 0 10.5 10.5z'],
  auto: ['M3.5 5.5h17v11h-17z', 'M9 20h6', 'M12 16.5V20'],
  sort: ['M8 5.5v13', 'M5 9l3-3.5L11 9', 'M16 18.5v-13', 'M13 15l3 3.5 3-3.5'],
  check: ['M4 12.5l5 5L20 6.5'],
  back: ['M19 12H5', 'M11 18l-6-6 6-6'],
  refresh: ['M20 11a8 8 0 0 0-13.7-5.6L3 8', 'M4 13a8 8 0 0 0 13.7 5.6L21 16', 'M3 4v4h4', 'M21 20v-4h-4'],
  external: ['M14 4h6v6', 'M20 4l-8 8', 'M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5'],
  up: ['M12 19V5', 'M6 11l6-6 6 6'],
  down: ['M12 5v14', 'M6 13l6 6 6-6'],
  menu: ['M4 7h16', 'M4 12h16', 'M4 17h16'],
  download: ['M12 4v10', 'm7.5 10.5 4.5 4.5 4.5-4.5', 'M5 19h14'],
  about: ['M12 11v5.5', 'M12 7.6v.4', 'M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17z'],
  rows: ['M4 7h16', 'M4 12h16', 'M4 17h10'],
  alert: ['M12 8v5', 'M12 16.5v.5', 'M10.3 3.9 2.8 17a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z'],
  mail: ['M3 6.5h18v11H3z', 'm4 7.5 8 5.5 8-5.5'],
  click: ['M9 4v3', 'M4 9h3', 'M5.6 5.6 7.7 7.7', 'm10 10 9 3.4-3.9 1.7L13.4 19z'],
  clock: ['M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17z', 'M12 7.5V12l3 2'],
  person: ['M12 11.2a3.4 3.4 0 1 0 0-6.8 3.4 3.4 0 0 0 0 6.8z', 'M5 20a7 7 0 0 1 14 0'],
  note: ['M6 3.5h9l4 4V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1z', 'M14.5 3.5V8H19', 'M8.5 13h7M8.5 16.5h4']
};

// One message area per page. An action like Undo keeps the message up a little longer.
let toastTimer;
// A toast that cannot disappear while it is being read.
//
// The timer pauses whenever a pointer is over the toast or focus is inside it, and
// resumes on the way out — a message that vanishes mid-sentence is worse than no
// message. It can also be dismissed early: Escape, or a swipe downwards on touch.
// It enters and leaves rather than appearing and disappearing, because an element
// that pops out of existence reads as a glitch.
let toastLeft = 0;
let toastStarted = 0;
let toastHiding = null;

function hideToast(toast) {
  clearTimeout(toastTimer);
  if (toast.dataset.state !== 'open') return;
  toast.dataset.state = 'closed';
  // wait for the exit before hiding it from the tree, so it is not announced twice
  toastHiding = setTimeout(() => { toast.hidden = true; }, 180);
}

function runToastTimer(toast, ms) {
  clearTimeout(toastTimer);
  toastLeft = ms;
  toastStarted = Date.now();
  toastTimer = setTimeout(() => hideToast(toast), ms);
}

function showToast(message, action) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  clearTimeout(toastTimer);
  clearTimeout(toastHiding);

  toast.replaceChildren(create('span', '', message));
  if (action) {
    const button = create('button', 'toast-action', action.label);
    button.type = 'button';
    button.addEventListener('click', () => {
      hideToast(toast);
      action.onClick();
    });
    toast.append(button);
  }

  const full = action ? 7000 : 4000;
  toast.hidden = false;

  // Start closed, force the browser to lay it out, then open: the transition needs a
  // computed starting point. requestAnimationFrame would be the obvious way to get
  // one, but it does not fire in a background tab — a toast raised there would never
  // open, and would then be stuck invisible and undismissable. Reading offsetHeight
  // flushes layout synchronously and works everywhere.
  toast.dataset.state = 'closed';
  void toast.offsetHeight;
  toast.dataset.state = 'open';

  runToastTimer(toast, full);

  if (toast.dataset.wired) return;
  toast.dataset.wired = 'true';

  // Reading it should not race a timer.
  const hold = () => {
    clearTimeout(toastTimer);
    toastLeft = Math.max(1200, toastLeft - (Date.now() - toastStarted));
  };
  const resume = () => { if (toast.dataset.state === 'open') runToastTimer(toast, toastLeft); };
  toast.addEventListener('pointerenter', hold);
  toast.addEventListener('pointerleave', resume);
  toast.addEventListener('focusin', hold);
  toast.addEventListener('focusout', resume);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toast.dataset.state === 'open') hideToast(toast);
  });

  // Swipe it away, the direction it entered from.
  let from = null;
  toast.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse') return;
    from = event.clientY;
    toast.setPointerCapture(event.pointerId);
    toast.dataset.dragging = 'true';
  });
  toast.addEventListener('pointermove', (event) => {
    if (from === null) return;
    const moved = Math.max(0, event.clientY - from);
    toast.style.transform = `translate(-50%, ${moved}px)`;
    toast.style.opacity = String(Math.max(0, 1 - moved / 120));
  });
  const endDrag = (event) => {
    if (from === null) return;
    const moved = Math.max(0, event.clientY - from);
    from = null;
    delete toast.dataset.dragging;
    toast.style.transform = '';
    toast.style.opacity = '';
    if (toast.hasPointerCapture && toast.hasPointerCapture(event.pointerId)) toast.releasePointerCapture(event.pointerId);
    if (moved > 60) hideToast(toast);
    else resume();
  };
  // pointercancel matters: the browser takes the gesture to scroll and the toast
  // must not be left stuck mid-swipe
  toast.addEventListener('pointerup', endDrag);
  toast.addEventListener('pointercancel', endDrag);
  toast.addEventListener('lostpointercapture', endDrag);
}

// Phones get the most used pages along the bottom, within reach of a thumb
function buildTabBar(sidebar) {
  const nav = create('nav', 'tabbar');
  nav.setAttribute('aria-label', 'Quick menu');
  const current = location.pathname.split('/').pop() || BOARD.home;
  // A page named in BOARD.tabs but missing from the menu is skipped, rather than breaking the bar.
  const pages = BOARD.tabs.filter(([href]) => sidebar.querySelector('.menu-item[href="' + href + '"]'));

  pages.forEach(([href, label]) => {
    const item = sidebar.querySelector(`.menu-item[href="${href}"]`);
    const link = create('a', 'tab');
    link.href = href;
    if (href === current) link.setAttribute('aria-current', 'page');
    link.append(item.querySelector('svg').cloneNode(true), create('span', '', label));
    nav.append(link);
    item.classList.add('in-tabbar');
  });

  const more = create('button', 'tab');
  more.type = 'button';
  more.setAttribute('aria-controls', 'sidebar');
  more.setAttribute('aria-expanded', 'false');
  if (!pages.some(([href]) => href === current)) {
    more.classList.add('is-current');
    more.setAttribute('aria-current', 'page');
  }
  more.append(icon(ICONS.menu, 20), create('span', '', 'More'));
  nav.append(more);

  document.getElementById('app').append(nav);
  return more;
}

// Phones hide the heading row, so every cell takes its heading with it
function labelCells(table) {
  const headings = [...table.querySelectorAll('thead th')].map((cell) => cell.textContent);
  table.querySelectorAll('tbody tr').forEach((row) => {
    [...row.children].forEach((cell, index) => {
      if (cell.colSpan > 1 || cell.tagName !== 'TD' || cell.classList.contains('cell-pick')) return;
      if (headings[index]) cell.dataset.label = headings[index];
    });
  });
}

// A figure formatted for reading does not sort the way it reads: "1d" is longer than
// "20h" but sorts before it on text. Where a column is formatted, the cell carries the
// raw number in data-sort and the sorter uses that instead.
function numberCell(text, sortValue) {
  const cell = create('td', 'cell-number', text);
  if (sortValue !== undefined && sortValue !== null) cell.dataset.sort = String(sortValue);
  return cell;
}

function sortValueOf(cell) {
  if (!cell) return '';
  if (cell.dataset && cell.dataset.sort !== undefined) {
    const exact = Number(cell.dataset.sort);
    return Number.isNaN(exact) ? cell.dataset.sort.toLowerCase() : exact;
  }
  const text = cell.textContent.trim();
  const number = Number(text.replace(/[^0-9.-]/g, ''));
  return /[0-9]/.test(text) && !Number.isNaN(number) ? number : text.toLowerCase();
}

// Which column each table is sorted by, kept between redraws so changing a filter
// does not quietly throw the reader's chosen order away.
const tableSort = {};

function sortableTable(table) {
  const body = table.tBodies[0];
  if (!body || !body.rows.length || body.querySelector('.is-empty')) return;

  const state = tableSort[table.id] || (tableSort[table.id] = { index: null, direction: 1 });
  const heads = [...table.querySelectorAll('thead th')];

  const apply = () => {
    heads.forEach((head, index) => {
      if (head.classList.contains('cell-pick')) return;
      head.setAttribute('aria-sort', index === state.index ? (state.direction === 1 ? 'ascending' : 'descending') : 'none');
      head.classList.toggle('is-sorted', index === state.index);
    });
    if (state.index === null) return;

    const sorted = [...body.rows].sort((a, b) => {
      const left = sortValueOf(a.children[state.index]);
      const right = sortValueOf(b.children[state.index]);
      if (left === right) return 0;
      return (left > right ? 1 : -1) * state.direction;
    });
    body.append(...sorted);
  };

  heads.forEach((head, index) => {
    if (head.classList.contains('cell-pick') || !head.textContent.trim()) return;

    const label = head.textContent;
    const button = create('button', 'sort-button');
    button.type = 'button';
    button.dataset.focus = `sort:${table.id}:${index}`;
    button.append(create('span', '', label), icon(ICONS.sort, 11));
    head.replaceChildren(button);

    button.addEventListener('click', () => {
      if (state.index === index) state.direction = -state.direction;
      else {
        state.index = index;
        // A name reads best A to Z; a number reads best largest first.
        state.direction = typeof sortValueOf(body.rows[0].children[index]) === 'number' ? -1 : 1;
      }
      apply();
    });
  });

  apply();
}

// Where you are inside a page lives in the address bar, so the back button works and a link can be sent to someone.
// Tiles you open go in the hash; filters go in the query, where they do not fill the history with every keystroke.
const Trail = {
  pushes: 0,

  path() {
    return location.hash.slice(1).split('/').filter(Boolean).map(decodeURIComponent);
  },

  href(path) {
    return path.length ? `#${path.map(encodeURIComponent).join('/')}` : location.pathname + location.search;
  },

  go(path) {
    history.pushState(null, '', Trail.href(path));
    Trail.pushes += 1;
  },

  // The link on the page and the browser's own back button should do the same thing
  back(parent, redraw) {
    if (Trail.pushes > 0) {
      Trail.pushes -= 1;
      history.back();
      return;
    }
    history.replaceState(null, '', Trail.href(parent));
    redraw();
  },

  watch(redraw) {
    window.addEventListener('popstate', () => {
      Trail.pushes = Math.max(0, Trail.pushes - 1);
      redraw();
    });
  }
};

const Params = {
  get(key, fallback) {
    return new URLSearchParams(location.search).get(key) || fallback;
  },

  set(values) {
    const params = new URLSearchParams(location.search);
    Object.entries(values).forEach(([key, value]) => {
      if (!value || value === 'All') params.delete(key);
      else params.set(key, value);
    });
    const query = params.toString();
    history.replaceState(null, '', `${location.pathname}${query ? '?' + query : ''}${location.hash}`);
  }
};

// The same way back on every page that opens into tiles: the page, then each step you took
function buildTrail(container, steps, onStep) {
  container.replaceChildren();
  steps.forEach((step, index) => {
    if (index) {
      const mark = create('span', 'trail-mark', '›');
      mark.setAttribute('aria-hidden', 'true');
      container.append(mark);
    }
    const button = create('button', 'trail-step', step.label);
    button.type = 'button';
    if (!index) button.prepend(icon(ICONS.back, 15));
    button.addEventListener('click', () => onStep(step.path));
    container.append(button);
  });
}

// Downloads exactly the rows on screen, so a filtered view exports filtered
function downloadRows(name, headings, rows) {
  const quote = (value) => `"${String(value).replace(/"/g, '""')}"`;
  const lines = [headings, ...rows].map((row) => row.map(quote).join(','));
  const file = new Blob(['\ufeff' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(file);

  const link = create('a');
  link.href = url;
  link.download = `${name}.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);

  showToast(`${formatNumber(rows.length)} ${rows.length === 1 ? 'row' : 'rows'} saved to ${name}.csv`);
}

function rowPicker(onChange) {
  const chosen = new Set();
  let shownIds = [];
  let head = null;
  let boxes = 0;

  const syncHead = () => {
    if (!head) return;
    head.checked = shownIds.length > 0 && shownIds.every((id) => chosen.has(id));
    head.indeterminate = !head.checked && shownIds.some((id) => chosen.has(id));
  };

  const changed = () => {
    syncHead();
    onChange();
  };

  const box = (label) => {
    boxes += 1;
    const field = create('input');
    field.type = 'checkbox';
    field.id = `pick-${boxes}`;
    const wrap = create('label', 'pick');
    wrap.htmlFor = field.id;
    wrap.append(field, create('span', 'sr-only', label));
    return { field, wrap };
  };

  return {
    get size() { return chosen.size; },
    has(id) { return chosen.has(id); },
    clear() { chosen.clear(); changed(); },
    // Forget anything that has scrolled out of the current filter
    keepOnly(ids) {
      shownIds = ids;
      [...chosen].forEach((id) => { if (!ids.includes(id)) chosen.delete(id); });
    },
    headCell() {
      const cell = create('th', 'cell-pick');
      cell.scope = 'col';
      const { field, wrap } = box('Pick every row on screen');
      head = field;
      syncHead();
      field.addEventListener('change', () => {
        shownIds.forEach((id) => (field.checked ? chosen.add(id) : chosen.delete(id)));
        document.querySelectorAll('.cell-pick input').forEach((other) => {
          if (other !== field) other.checked = field.checked;
        });
        changed();
      });
      cell.append(wrap);
      return cell;
    },
    cell(id, label) {
      const cell = create('td', 'cell-pick');
      const { field, wrap } = box(`Pick ${label}`);
      field.checked = chosen.has(id);
      field.addEventListener('change', () => {
        if (field.checked) chosen.add(id); else chosen.delete(id);
        changed();
      });
      cell.append(wrap);
      return cell;
    }
  };
}

function exportButton(label, build) {
  const button = create('button', 'button button-secondary button-inline');
  button.type = 'button';
  button.append(icon(ICONS.download, 16), create('span', '', label));
  button.addEventListener('click', build);
  return button;
}

let tileCount = 0;
function statTile({ label, value, note, icon: paths, tone = '', change, spark, sparkLabel, sparkMark = 'newest', about }) {
  const tile = create('div', 'tile');
  const badge = create('div', 'tile-badge');
  const name = create('span', '', label);
  badge.append(name);

  if (about) {
    tileCount += 1;
    const id = `tile-about-${tileCount}`;
    const ask = create('button', 'tile-about-open');
    ask.type = 'button';
    ask.setAttribute('aria-expanded', 'false');
    ask.setAttribute('aria-controls', id);
    ask.setAttribute('aria-label', `What "${label}" counts`);
    ask.append(icon(ICONS.about, 15));
    name.append(ask);

    const explain = create('p', 'tile-about', about);
    explain.id = id;
    explain.hidden = true;
    ask.addEventListener('click', () => {
      explain.hidden = !explain.hidden;
      ask.setAttribute('aria-expanded', String(!explain.hidden));
    });
    tile.dataset.hasAbout = 'true';
    tile.append(badge);
    if (paths) {
      const mark = create('span', ('tile-icon ' + tone).trim());
      mark.append(icon(paths, 18));
      badge.append(mark);
    }
    const figure = create('div', 'tile-figure');
    figure.append(create('b', '', value));
    if (spark) figure.append(sparkline(spark, sparkLabel || label, sparkMark));
    const foot = create('div', 'tile-foot');
    if (change) foot.append(statusChip(change));
    if (note) foot.append(create('small', '', note));
    tile.append(figure, foot, explain);
    return tile;
  }

  if (paths) {
    const mark = create('span', ('tile-icon ' + tone).trim());
    mark.append(icon(paths, 18));
    badge.append(mark);
  }

  const figure = create('div', 'tile-figure');
  figure.append(create('b', '', value));
  if (spark) figure.append(sparkline(spark, sparkLabel || label, sparkMark));

  const foot = create('div', 'tile-foot');
  if (change) foot.append(statusChip(change));
  if (note) foot.append(create('small', '', note));

  tile.append(badge, figure, foot);
  return tile;
}

function statusChip(pace) {
  const chip = create('span', `status status-${pace.tone}`);
  if (pace.direction) chip.append(icon(ICONS[pace.direction], 13), create('span', 'sr-only', pace.direction === 'up' ? 'up ' : 'down '));
  chip.append(create('span', '', pace.text));
  return chip;
}

// The header is built here rather than read out of the page, so a browser holding an older
// copy of the HTML still gets the right header from the current script.
// One search across the whole board. What is searched is the board's business,
// so the work happens in BOARD.search and this only draws the answer.
function boardResults(term) {
  return BOARD.search(term);
}

function buildSearch() {
  const holder = create('div', 'board-search');

  const label = create('label', 'sr-only', 'Search the board');
  label.htmlFor = 'board-search-input';
  const field = create('input', 'search');
  field.id = 'board-search-input';
  field.type = 'search';
  field.placeholder = 'Search the board';
  field.autocomplete = 'off';
  field.setAttribute('role', 'combobox');
  field.setAttribute('aria-expanded', 'false');
  field.setAttribute('aria-controls', 'board-search-results');

  const list = create('ul', 'search-results');
  list.id = 'board-search-results';
  list.hidden = true;

  const close = () => {
    list.hidden = true;
    field.setAttribute('aria-expanded', 'false');
  };

  const draw = () => {
    const results = boardResults(field.value);
    list.replaceChildren();
    if (!field.value.trim() || field.value.trim().length < 2) return close();

    if (!results.length) {
      list.append(create('li', 'search-empty', 'Nothing on the board matches that.'));
    } else {
      results.slice(0, 8).forEach((result) => {
        const item = create('li');
        const link = create('a');
        link.href = result.href;
        link.append(create('span', 'search-group', result.group), create('b', '', result.label), create('small', '', result.detail));
        item.append(link);
        list.append(item);
      });
      if (results.length > 8) list.append(create('li', 'search-empty', `${results.length - 8} more match. Keep typing to narrow it.`));
    }
    list.hidden = false;
    field.setAttribute('aria-expanded', 'true');
  };

  field.addEventListener('input', draw);
  field.addEventListener('focus', draw);
  field.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') { field.value = ''; close(); }
    if (event.key === 'ArrowDown' && !list.hidden) {
      const first = list.querySelector('a');
      if (first) { event.preventDefault(); first.focus(); }
    }
  });
  document.addEventListener('click', (event) => {
    if (!holder.contains(event.target)) close();
  });

  holder.append(label, field, list);
  return holder;
}

function buildHeaderTools() {
  const header = document.querySelector('.page-header');
  if (!header) return;

  header.querySelectorAll('.board-state, .tag, .header-tools').forEach((old) => old.remove());

  const refresh = create('button', 'button button-secondary button-inline');
  refresh.type = 'button';
  refresh.append(icon(ICONS.refresh, 16), document.createTextNode(BOARD.refreshLabel));
  refresh.addEventListener('click', () => showToast(BOARD.refreshNote()));

  const tools = create('div', 'header-tools');
  tools.append(buildSearch(), refresh);
  header.append(tools);
}

// What state the board is in, at the foot of the menu where it stays out of the way
function buildStateCard(sidebar) {
  const state = BOARD.state();

  const read = create('span');
  read.id = 'board-read';
  read.textContent = state.value;
  read.title = state.title;

  const words = create('span');
  words.append(document.createTextNode(state.text), read);

  const line = create('p', 'board-line');
  const dot = create('span', 'board-dot');
  dot.setAttribute('aria-hidden', 'true');
  line.append(dot, words);
  sidebar.querySelector('.sidebar-user').before(line);
}

function buildRelatedLinks(sidebar) {
  if (!BOARD.related.length) return;

  const holder = create('div', 'sidebar-links');
  holder.append(create('p', 'menu-label', 'Other boards'));
  BOARD.related.forEach(([href, label]) => {
    const link = create(href === '#' ? 'span' : 'a', 'sidebar-link', label);
    if (href === '#') {
      link.append(create('span', 'tag', 'Soon'));
    } else {
      link.href = href;
      link.target = '_blank';
      link.rel = 'noreferrer';
      link.append(icon(ICONS.external, 14));
    }
    holder.append(link);
  });
  sidebar.querySelector('.sidebar-user').before(holder);
}

// One line at the foot of every page, saying what this board is and is not
function buildFooter() {
  const main = document.getElementById('main');
  if (!main || main.querySelector('.page-foot')) return;
  main.append(create('p', 'page-foot', BOARD.footer));
}

// Pages a viewer may not open stay in the menu, labelled, rather than quietly
// disappearing. Hiding them would leave somebody wondering what they are missing;
// the redirect in session.js is what actually enforces it.
function markClosedPages(sidebar, user) {
  if (user.manager) return;
  sidebar.querySelectorAll('.menu-item[data-access="manager"]').forEach((item) => {
    const shut = create('span', 'menu-item is-shut');
    shut.append(...item.childNodes);
    shut.append(create('span', 'tag', 'Managers'));
    shut.title = 'Only a manager can open this page.';
    item.replaceWith(shut);
  });
}

// Light and dark, with a third state that is the honest default: follow the machine.
// The chosen one is remembered in this browser only.
function buildThemeSwitch(sidebar) {
  const holder = create('div', 'theme-switch');
  holder.setAttribute('role', 'group');
  holder.setAttribute('aria-label', 'Theme');

  const options = [
    ['light', 'Light', ICONS.sun],
    ['dark', 'Dark', ICONS.moon],
    [null, 'Auto', ICONS.auto]
  ];

  const draw = () => {
    const current = readTheme();
    [...holder.children].forEach((button, index) => {
      button.setAttribute('aria-pressed', String(options[index][0] === current));
    });
  };

  options.forEach(([value, label, paths]) => {
    const button = create('button', '', '');
    button.type = 'button';
    button.append(icon(paths, 14), create('span', '', label));
    button.title = value ? `Always ${label.toLowerCase()}` : 'Follow this device';
    button.addEventListener('click', () => {
      setTheme(value);
      draw();
    });
    holder.append(button);
  });

  draw();
  sidebar.querySelector('.sidebar-user').before(holder);
}

function markCurrentPage(sidebar) {
  const here = location.pathname.split('/').pop() || BOARD.home;
  sidebar.querySelectorAll('.menu-item').forEach((item) => {
    if (item.getAttribute('href') === here) item.setAttribute('aria-current', 'page');
    else item.removeAttribute('aria-current');
  });
}

function setUpShell() {
  const user = readSession();
  document.getElementById('user-initials').textContent = initials(user.name);
  document.getElementById('user-name').textContent = user.name;
  document.getElementById('user-role').textContent = `${user.role} · ${user.team}`;

  const app = document.getElementById('app');
  const body = document.querySelector('.app-body');
  const sidebar = document.getElementById('sidebar');
  const menuButton = document.getElementById('menu-button');
  const moreButton = buildTabBar(sidebar);
  const smallScreen = window.matchMedia('(max-width: 900px)');
  let opener = menuButton;

  // On small screens the closed menu sits off to the side, so keyboards and screen readers must skip it
  const setMenuOpen = (open) => {
    app.classList.toggle('menu-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    moreButton.setAttribute('aria-expanded', String(open));
    sidebar.inert = smallScreen.matches && !open;
    body.inert = smallScreen.matches && open;
    if (smallScreen.matches) (open ? sidebar.querySelector('.menu-item') : opener).focus({ preventScroll: true });
  };
  sidebar.inert = smallScreen.matches;
  smallScreen.addEventListener('change', () => {
    app.classList.remove('menu-open');
    sidebar.inert = smallScreen.matches;
    body.inert = false;
  });

  const openFrom = (button) => {
    opener = button;
    setMenuOpen(!app.classList.contains('menu-open'));
  };
  menuButton.addEventListener('click', () => openFrom(menuButton));
  moreButton.addEventListener('click', () => openFrom(moreButton));
  document.getElementById('scrim').addEventListener('click', () => setMenuOpen(false));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && app.classList.contains('menu-open')) setMenuOpen(false);
  });

  markCurrentPage(sidebar);
  markClosedPages(sidebar, user);
  buildThemeSwitch(sidebar);
  buildRelatedLinks(sidebar);
  buildStateCard(sidebar);
  buildHeaderTools();
  buildFooter();

  document.getElementById('sign-out').addEventListener('click', () => {
    endSession();
    location.href = SIGN_IN_PAGE;
  });

  return user;
}
