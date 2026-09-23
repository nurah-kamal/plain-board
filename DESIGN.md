# How this board is built

One design, written down so it can be followed rather than guessed at. If you copy the kit and add a page, this is the agreement you are keeping.

## Colour

Colours live as custom properties on `:root` in `assets/css/styles.css`. Nothing in the stylesheet uses a raw colour value; if you need a new colour, it becomes a token first.

Because the theme can be chosen as well as inherited, the dark values are declared **twice**: once inside `@media (prefers-color-scheme: dark)`, guarded as `:root:not([data-theme="light"])` so a chosen light theme beats a dark machine, and once as `:root[data-theme="dark"]` so a chosen dark theme beats a light one. Three states have to work — light chosen, dark chosen, and nothing chosen. A token added to only one of those blocks is the bug this arrangement invites, so add it to both.

The two `theme-color` meta tags in every page head carry the same two grounds, so the browser's own bar matches the page it sits above.

| Token | Light | Dark | Used for |
| --- | --- | --- | --- |
| `--page` | `#F4F6F8` | `#0B1017` | The ground behind everything |
| `--card` | `#FFFFFF` | `#131A24` | Panels, tiles, the menu, raised surfaces |
| `--field` | `#EDF0F4` | `#1B2430` | Inputs, chip backgrounds, tracks |
| `--ink` | `#0F1826` | `#E8EDF4` | Body text |
| `--muted` | `#56637A` | `#9BA8BA` | Second-line text, labels, captions |
| `--line` | `#DCE2EA` | `#26303D` | Hairlines, dividers, and every surface edge |
| `--navy` / `--navy-deep` | `#16243C` / `#0C1524` | same | The identity: the sign-in panel and the dark art |
| `--selected` | `#16243C` | `#2E4A75` | A chosen segment, the avatar |
| `--current-soft` / `--current-ink` | `#E4EEF7` / `#1B3A63` | `#1B2C44` / `#A7C3E2` | The page you are on, in the menu |
| `--accent` | `#1B7F5F` | `#46C79B` | **Movement, and nothing else** |
| `--bar` / `--chart-line` | `#2E4A75` | `#6E97D0` | The charts |
| `--group-1` … `--group-5` | navy / red / slate / stone / grey | lighter versions | Whatever dimension your charts split by |
| `--focus` | `#1B3A63` | `#8FB8EE` | The focus ring |

**Navy is the identity; green is a verb.** The green is not the board's colour — it appears only where something moved against the period before, and it is paired with a red of the same weight for movement the other way. That is why the menu's current page and the avatar have their own `--current-*` and `--selected` tokens rather than borrowing the accent: if the accent shows up anywhere that is not movement, it stops meaning movement.

**A group colour is a label, not a verdict.** `--group-2` is red because a set of distinguishable colours needs a red in it, not because that group is in trouble. Every chart that splits by group names the colours in its key, and a *state* always lives in a chip or a tinted card — never in a bar or a slice.

**The three status colours** carry meaning and are used nowhere decorative: red for stop, yellow for hold, green for go.

**Contrast.** Every text colour measures at least 4.5:1 against the surface behind it, in both themes, measured against its own tint rather than against the page.

## Type

Two faces, from Google Fonts — the only external resource the content security policy allows:

- **Archivo** (500/600/700) for headings, figures and anything counted.
- **IBM Plex Sans** (400/500/600/700) for running text and every control.

Figures use `font-variant-numeric: tabular-nums` wherever they line up in a column, so a changing number does not shift the ones beside it.

**Labels are small, spaced and quiet.** A tile's name and a menu group heading are set at 11px, 600 weight, uppercase, `letter-spacing: .09em`, in `--muted`. The label recedes so the figure beside it carries the weight — the single cheapest way to make a board read as a considered document rather than a web page.

The body face matters more here than any colour. An earlier version of this kit used Nunito, a rounded humanist sans, and it undercut everything else on the page.

## Space and shape

**Three shapes, and nothing else.**

| Token | Size | For |
| --- | --- | --- |
| `--radius` | 12px | Surfaces: panels, tiles, cards |
| `--radius-control` | 7px | Controls: buttons, inputs, selects, the menu, notices, the toast |
| `--radius-mark` | 3px | Marks: small bars and swatches |

Pills (`999px`) are for chips and counts only; `50%` is for avatars. Nothing else rounds its own corners.

**Elevation is declared once: a hairline, never both.** Every surface — panel, tile, drill-down tile, the menu column — is defined by a 1px `--line` border and carries no shadow at all. A 1px border sitting under a soft shadow is the ghost-card look, and it is the difference between a page that was designed and one that was assembled. A tile that is also a button shows its hover by moving its border and fill, not by lifting.

**The page rhythm is 22px.** `.app-main` spaces its children by 22px and `.grid` uses the same gap. Cards in a row stretch to the same depth, so nothing floats above a gap.

## What a figure has to do

These are design decisions, not missing work. They are the reason the kit exists.

- **A figure says what it does not prove.** Every tile carries an (i) with the counting rule and the limit. A tile without one is not finished.
- **Blank is not proof.** A row with nothing recorded means nobody wrote anything down — not that nothing happened. Every figure that counts blanks says so beside itself.
- **Keep separate things separate.** Supply, speed and quality are three measures. Averaging them into one score produces a number that means nothing.
- **Use the middle value, not the average,** wherever one very old row could drag it.
- **Do not invent a rate you cannot support.** If two things are not joined in the data, the board says they are not joined rather than dividing one by the other.
- **Nothing here judges a person.** Note quality is measured on length alone, because length is the only thing the text can honestly be read for.

## Components

- **The menu** — a light column on `--card`, held off the page by a hairline. The page you are on is a soft navy pill with a thin navy ring, drawn from `--current-soft`; everything else is `--muted` until hovered. A page the viewer may not open stays in the list, greyed, with a **Managers** tag. The gaps, padding and row height are sized against the window with `clamp()`, with two `max-height` steps for a short laptop screen, so the menu does not scroll. A finger still gets a 44px row through `@media (pointer: coarse)`.
- **The page header** — the page name, its one-line note, the board search and the refresh button, closed by a hairline. It is built in the script rather than read from the markup, so a browser holding an older copy of the HTML still gets the current header.
- **`.tile`** — a figure with its name, a note, a sparkline of the run behind it and an (i). On `--card`, edged with a hairline.
- **The landing page reads as a summary.** The four figures come first and are set larger than figures anywhere else, because they are the answer. Then what needs somebody, then the controls to change the selection, then the detail. A reader who stops after two seconds has still had the point.
- **Where to start** — a row of counts under the figures, above the filters, each a link into the right group. It counts only what is true right now, and disappears when there is nothing to do.
- **The filter bar** — period, group, person and a search, shared through `assets/js/shared/filters.js` so no two pages can count the same selection differently. The state lives in the query string, so a view can be sent to somebody.
- **Drill-down tiles** — `.status-tile` for a state or a band. Opening one puts the step in the hash, so the browser's back button works and a link can be shared.
- **Tables** — `.results`, with an optional tick column. On a phone the heading row is dropped and every cell carries its own heading through `labelCells()`.

## The address bar

Two different things, kept apart:

- **Filters live in the query string** (`?range=week&product=billing`), set with `history.replaceState`, so typing in a search box does not fill the history with a hundred entries.
- **Where you are inside a page lives in the hash** (`#8-14`), set with `pushState`, so back means back.

## The parts the browser draws

Text selection, the caret, the checkbox tick and the scrollbar all ship with defaults that belong to no design system, so they are themed from the palette like anything else. It costs four declarations and it is the clearest signal that a page was built rather than assembled.

## Accessibility

- Every page opens with a skip link, and `<main>` takes focus when a drill-down opens.
- The menu is `inert` when closed on a phone, so a keyboard and a screen reader skip it.
- Redrawing a list would drop focus to the top of the page, so buttons carry a `data-focus` key and focus lands back on the matching one.
- Motion respects `prefers-reduced-motion`.
- Colour is never the only carrier of meaning: a chip has words in it, and a chart has a key.
