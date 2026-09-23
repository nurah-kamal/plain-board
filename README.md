# Plain Board

A starting point for building a small internal board — the kind of page a team actually reads on a Monday morning — in plain HTML, CSS and JavaScript.

No framework. No build step. No dependencies. No chart library. Copy the folder, replace one file of data, and you have a working board.

**Live demo:** https://nurah-kamal.github.io/plain-board/

The demo is a help desk board: ten pages across four menu groups, every chart in the kit drawn at least once, and 129 invented requests behind all of it. Choose **Look around as a manager** or **Look around as a team member** — no account needed, and nothing is saved beyond your own browser.

Sign in as a team member and the menu changes: their own name is locked into the person filter, and the manager-only page stays visible but shut, labelled rather than hidden.

## Why this exists

Most small internal boards do not need React, a bundler and forty dependencies. They need four pages, some honest figures, a filter bar and a chart that does not lie. That is what this is.

It is also opinionated about one thing: **a figure should say what it does not prove.** Every tile on the demo board carries an (i) that explains what it counts and what it cannot see, and the board has a whole page devoted to what it will not tell you. That is the part worth copying.

## What you get

| | |
| --- | --- |
| **The shell** | Left menu, phone bottom bar, page header, board-wide search, sign-out, toast, footer |
| **Charts** | Ring, donut, area with a key and a pointer reading, paired bars, bar list, column chart, sparkline — drawn in SVG, no library |
| **Tables** | Row ticking with export of only the ticked rows, and cells that carry their own heading on a phone |
| **Controls** | Segmented period picker, filter bar, drill-down tiles with the step kept in the address bar |
| **Tooling** | One script to build every page from a single shell, one to version assets before a commit |
| **Both themes** | Light and dark, defined once as tokens, with a switch in the menu — and a third setting that follows the device |

Every one of these is drawn on the demo's **Components** page, with the call that drew it underneath. That is the fastest way to see what is in the box.

## Try it on your own machine

Nothing to install. Open a terminal in the folder and run any static server, for example:

```bash
npx serve .
```

Then open the address it prints.

## Making it your own

Four files, in this order:

**1. `assets/js/shared/data.js`** — your rows, and the helpers that read them. This is the only file that knows what the board is about. Replace it entirely.

**2. `assets/js/shared/board.js`** — the board's name, its home page, the footer line, what the phone tab bar holds, and one search function. The shell reads this and follows it, so nothing else needs to know your subject.

**3. `tools/build-pages.js`** — the page list, the menu, and the markup of each page. Add a page here rather than writing a new HTML file by hand, then run:

```bash
node tools/build-pages.js
```

**4. `assets/js/pages/*.js`** — one script per page, which fills the markup in. Start from the demo's and work backwards.

Before every commit that touches anything in `assets/`:

```bash
node tools/stamp-assets.js
```

This appends a content hash to every asset link. GitHub Pages lets a browser keep a stylesheet or a script for ten minutes; without this step a visitor can load your new markup beside your old script, and a control that is on screen does nothing. It is the least obvious bug in the whole kit, so the tool exists to make it impossible.

## Things worth knowing

**Every script shares one scope.** There is no module system, so two files declaring the same `const` will silently kill a page. Keep names distinct across `shared/` and `pages/`.

**There is a content security policy on every page.** No inline scripts, and styles are set through the element from JavaScript rather than injected as text. It is why there is no chart library: nothing external loads except the two fonts.

**The demo sign-in is a demonstration.** It remembers a sample person in `localStorage` and nothing more. Replace `assets/js/shared/session.js` when you connect real accounts, and do not treat the manager/member split as a security boundary — it decides what is drawn, not what is allowed.

**Roles are drawn, not hidden.** A team member's person filter is set to their own name and locked, rather than removed, and a manager-only page stays in their menu labelled **Managers** rather than vanishing. Showing the rule reads better than quietly leaving a control out — and a link that silently bounces somebody is worse than either.

**A figure formatted for reading does not sort the way it reads.** `1d` is longer than `20h` but sorts before it on text, so a formatted cell carries its raw value: `numberCell('1d', 26)`. Then `sortableTable(table)` makes every heading clickable.

**A percentage off a tiny base is not information.** Two requests becoming eight is not a 300% improvement, it is six requests. Below a base of five, `movement()` prints `2 to 8` instead.

## Folders

```
index.html               sign in
pages/                   the signed-in pages, all generated
assets/css/styles.css    the whole design
assets/js/shared/        data.js, board.js, app.js (the shell), charts.js, filters.js, session.js, auth.js
assets/js/pages/         one script per page
tools/build-pages.js     builds every page from one shell
tools/stamp-assets.js    versions every asset link before a commit
```

## The design

Written down in [DESIGN.md](DESIGN.md): the colour tokens, the two typefaces, the three corner radii, and the rules about what a chart may and may not say.

## Licence

MIT. Use it for anything, including at work.
