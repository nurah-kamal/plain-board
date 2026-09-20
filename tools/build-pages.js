// The signed-in pages share one shell: the same head, the same menu, the same footer.
// Keeping it in one place means a menu entry can never be right on three pages and
// wrong on the fourth.
//
// Run it after changing the shell or adding a page:
//
//   node tools/build-pages.js
//
// Then run tools/stamp-assets.js before committing.

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

// The board's name, as it appears in the browser tab and at the top of the menu.
// Keep it the same as BOARD.name in assets/js/shared/board.js.
const BOARD_NAME = 'Help desk';
const BOARD_TEAM = 'Support';

const ICONS = {
  today: '<path d="M4 12.5l5 5L20 6.5"/>',
  requests: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  team: '<circle cx="9" cy="8" r="3.2"/><path d="M3.5 19.5a5.5 5.5 0 0 1 11 0"/><path d="M16.5 6.2a3 3 0 0 1 0 5.8M17.5 19.5a5.4 5.4 0 0 0-2.2-4.3"/>',
  sources: '<ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>'
};

const svg = (paths, size = 20) =>
  `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;

// group: where the entry sits in the menu. null means it sits above the first heading.
const PAGES = [
  { file: 'today.html', script: 'today', name: 'Today', icon: 'today', group: null,
    title: 'Today', note: 'What the requests show today, and what is waiting on somebody.',
    description: 'What the support requests show today.' },
  { file: 'requests.html', script: 'requests', name: 'Waiting for a reply', icon: 'requests', group: 'Requests',
    title: 'Waiting for a reply', note: 'Requests with nothing recorded against them, longest wait first.',
    description: 'Requests with nothing recorded against them yet.' },
  { file: 'team.html', script: 'team', name: 'By person', icon: 'team', group: 'Requests',
    title: 'By person', note: 'How many requests each person was given, and what came back on them.',
    description: 'Requests and recorded replies for each person.' },
  { file: 'sources.html', script: 'sources', name: 'Sources and coverage', icon: 'sources', group: 'Evidence',
    title: 'Sources and coverage', note: 'What this board reads, when it was read, and what it cannot see.',
    description: 'What this board reads and what it cannot see.' }
];

function menu(current) {
  const lines = [];
  let group = null;
  PAGES.forEach((page) => {
    if (page.group !== group) {
      group = page.group;
      if (group) lines.push(`        <p class="menu-label">${group}</p>`);
    }
    const here = page.file === current ? ' aria-current="page"' : '';
    lines.push(`        <a class="menu-item" href="${page.file}"${here}>`);
    lines.push(`          ${svg(ICONS[page.icon])}`);
    lines.push(`          <span>${page.name}</span>`);
    lines.push('        </a>');
  });
  return lines.join('\n');
}

function filters(withoutRange) {
  const range = withoutRange ? '' : `          <div class="segmented segmented-three" id="range-picker" role="group" aria-label="Period"></div>
`;
  return `        <div class="controls">
${range}          <label class="sr-only" for="product-filter">Product</label>
          <select class="select" id="product-filter"></select>
          <label class="sr-only" for="person-filter">Person</label>
          <select class="select" id="person-filter"></select>
          <label class="sr-only" for="row-search">Search the requests</label>
          <input class="search" id="row-search" type="search" placeholder="Search a person, a product or a request" autocomplete="off">
          <button class="button button-secondary button-inline" id="filters-clear" type="button" hidden>Show everything</button>
        </div>`;
}

const shell = (page, body) => `<!doctype html>
<html lang="en" data-page="app">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; form-action 'self'; base-uri 'self'; object-src 'none'">
  <meta name="theme-color" content="#F1F6F3" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#0A130F" media="(prefers-color-scheme: dark)">
  <meta name="referrer" content="strict-origin-when-cross-origin">
  <meta name="description" content="${page.description}">
  <title>${page.title} · ${BOARD_NAME}</title>
  <link rel="icon" href="../assets/img/logo.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700&family=Nunito:wght@400;600;700&display=swap">
  <link rel="stylesheet" href="../assets/css/styles.css">
  <script src="../assets/js/shared/session.js"></script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <div class="app" id="app">
    <aside class="sidebar" id="sidebar" aria-label="Main menu">
      <a class="brand" href="today.html"><img src="../assets/img/logo.svg" width="36" height="36" alt=""><span class="brand-text"><b>${BOARD_NAME}</b><small>${BOARD_TEAM}</small></span></a>

      <nav class="menu" aria-label="Pages">
${menu(page.file)}
      </nav>

      <div class="sidebar-user">
        <span class="avatar" id="user-initials" aria-hidden="true"></span>
        <div><b id="user-name"></b><small id="user-role"></small></div>
        <button class="icon-button" id="sign-out" type="button" aria-label="Sign out" title="Sign out">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/></svg>
        </button>
      </div>
    </aside>

    <div class="scrim" id="scrim"></div>

    <div class="app-body">
      <header class="topbar">
        <button class="icon-button" id="menu-button" type="button" aria-label="Open menu" aria-controls="sidebar" aria-expanded="false">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
        </button>
        <a class="brand" href="today.html"><img src="../assets/img/logo.svg" width="30" height="30" alt=""><span>${BOARD_NAME}</span></a>
      </header>

      <main class="app-main" id="main" tabindex="-1">
        <div class="page-header">
          <div>
            <h1>${page.title}</h1>
            <p class="page-note">${page.note}</p>
          </div>
        </div>

${body}
      </main>
    </div>
  </div>

  <div class="toast" id="toast" role="status" hidden></div>

  <script src="../assets/js/shared/data.js"></script>
  <script src="../assets/js/shared/board.js"></script>
  <script src="../assets/js/shared/app.js"></script>
  <script src="../assets/js/shared/charts.js"></script>
  <script src="../assets/js/shared/filters.js"></script>
  <script src="../assets/js/pages/${page.script}.js"></script>
</body>
</html>
`;

// The body of each page: the markup its script fills in.
const BODIES = {
  today: `        <nav class="start-here" id="start-here" aria-label="Where to start"></nav>

${filters()}

        <p class="panel-note" id="filter-note"></p>

        <section class="tiles tiles-four" id="tiles" aria-label="Totals"></section>

        <div class="grid">
          <section class="panel span-7" aria-labelledby="waiting-title">
            <div class="panel-head">
              <h2 id="waiting-title">How long requests have been waiting</h2>
              <a class="text-link" href="requests.html">Open the waiting list</a>
            </div>
            <div id="waiting-chart"></div>
            <p class="panel-note">Counted from the day the request arrived to today, for requests with nothing recorded against them.</p>
          </section>

          <section class="panel span-5" aria-labelledby="channels-title" id="channels">
            <div class="panel-head">
              <h2 id="channels-title">Where requests come from</h2>
            </div>
            <div id="channel-chart"></div>
            <p class="panel-note">Every request in this selection, counted once against the channel it arrived on.</p>
          </section>

          <section class="panel span-7" aria-labelledby="arrivals-title">
            <div class="panel-head">
              <h2 id="arrivals-title">Requests arriving by day</h2>
            </div>
            <div id="arrivals-chart"></div>
            <p class="panel-note">Every request the board holds, counted on the day it came in.</p>
          </section>

          <section class="panel span-5" aria-labelledby="notes-title">
            <div class="panel-head">
              <h2 id="notes-title">What people wrote down</h2>
            </div>
            <div id="notes-chart"></div>
            <p class="panel-note">Measured on length alone: whether the next person could pick the request up. Nothing here judges the work.</p>
          </section>
        </div>`,

  requests: `${filters(true)}

        <p class="panel-note" id="filter-note"></p>

        <section class="open-section" aria-labelledby="band-grid-title">
          <h2 class="sr-only" id="band-grid-title">Choose how long they have waited</h2>
          <div class="status-grid" id="band-grid"></div>
        </section>

        <section class="panel" aria-labelledby="waiting-title" id="waiting-panel" hidden>
          <div class="panel-head">
            <h2 id="waiting-title">Requests with nothing recorded</h2>
          </div>
          <div class="table-wrap">
            <table class="results" id="waiting-table"></table>
          </div>
          <p class="panel-note">Longest wait first. Waiting is counted from the day the request arrived to today; it does not prove nobody replied, only that nobody wrote it down.</p>
        </section>`,

  team: `${filters(true)}

        <p class="panel-note" id="filter-note"></p>

        <section class="tiles tiles-four" id="tiles" aria-label="Totals"></section>

        <section class="panel" aria-labelledby="team-title">
          <div class="panel-head">
            <h2 id="team-title">Everyone in this selection</h2>
          </div>
          <div class="table-wrap">
            <table class="results" id="team-table"></table>
          </div>
          <p class="panel-note">A request counts against the person it was assigned to, once. Nothing here measures how good the reply was.</p>
        </section>`,

  sources: `        <div class="grid">
          <section class="panel span-7" aria-labelledby="reads-title">
            <div class="panel-head">
              <h2 id="reads-title">What this board reads</h2>
            </div>
            <ul class="source-list" id="source-list"></ul>
          </section>

          <section class="panel span-5" aria-labelledby="counting-title">
            <div class="panel-head">
              <h2 id="counting-title">How each figure is counted</h2>
            </div>
            <ul class="source-list" id="counting-list"></ul>
          </section>

          <section class="panel span-12" aria-labelledby="gaps-title">
            <div class="panel-head">
              <h2 id="gaps-title">What it will not tell you</h2>
            </div>
            <ul class="gap-list" id="gap-list"></ul>
          </section>
        </div>`
};

PAGES.forEach((page) => {
  const body = BODIES[page.script];
  if (!body) throw new Error('no body for ' + page.script);
  fs.writeFileSync(path.join(root, 'pages', page.file), shell(page, body));
});

console.log(`built ${PAGES.length} pages`);
