# How this board is built

> **This board follows the Service Board design system.** Its tokens, type, spacing,
> radii and component rules come from there, so any board built on the kit reads as
> the same thing. Where this file and the system disagree, the system wins — except
> for the one deviation recorded under Colour.

One design, written down so it can be followed rather than guessed at. If you copy the kit and add a page, this is the agreement you are keeping.

## Colour

Colours live as custom properties on `:root` in `assets/css/styles.css`. Nothing in the stylesheet uses a raw colour value; if you need a new colour, it becomes a token first.

The system is light only. These boards are read at a desk in office light and on meeting-room projectors, so there is no dark theme to keep in step.

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

**A movement chip only colours what the board can call better or worse.** `movement(now, before, { good })` names the direction worth having; passing `good: null` states the move in a neutral `.status-move` chip instead. Volume — how many rows arrived — gets that neutral chip, because more arriving is busier, not better. Standing still is neutral for the same reason.

**Navy is the identity; green is a verb.** The green is not the board's colour — it appears only where something moved against the period before, and it is paired with a red of the same weight for movement the other way. That is why the menu's current page and the avatar have their own `--current-*` and `--selected` tokens rather than borrowing the accent: if the accent shows up anywhere that is not movement, it stops meaning movement.

**A group colour is a label, not a verdict.** `--group-2` is red because a set of distinguishable colours needs a red in it, not because that group is in trouble. Every chart that splits by group names the colours in its key, and a *state* always lives in a chip or a tinted card — never in a bar or a slice.

**The three status colours** carry meaning and are used nowhere decorative: red for stop, yellow for hold, green for go. On a chip they are `.status-stop`, `.status-hold` and `.status-good`; on a banner item they are `.is-stop` and `.is-hold`. Both draw from the same tokens, so one severity reads the same wherever it appears. There is deliberately no second green class — `.status-good` already is it.

**Contrast.** Every text colour measures at least 4.5:1 against the surface behind it, measured against its own tint rather than against the page.

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
- **One visible search at a time.** A page that filters its own rows already has a field for it, so the board-wide search folds into a button carrying the key that opens it (`/`). Two fields side by side, doing different jobs and looking alike, told a first-time reader nothing. Escape shuts it, clears it and puts focus back on the button.
- **`.tile`** — a figure with its name, a note, a sparkline of the run behind it and an (i). On `--card`, edged with a hairline. No icon and no tone badge: the colour on a tile belongs to the movement chip, which is read from the figures, rather than to a mark that was fixed per tile and said the same thing whatever the number did.
- **The landing page reads as a summary.** The four figures come first and are set larger than figures anywhere else, because they are the answer. Then what needs somebody, then the controls to change the selection, then the detail. A reader who stops after two seconds has still had the point.
- **The banner** — one to a page, at the top of the landing page, above the figures. The loudest thing waiting becomes the figure and the sentence; whatever else is waiting becomes the line under it. Every count is true right now and the link goes to the group it names. With nothing waiting it says so on a calm green rather than disappearing, because "nothing is waiting" is an answer and a blank space is not.
- **The filter bar** — period, group, person and a search, shared through `assets/js/shared/filters.js` so no two pages can count the same selection differently. The state lives in the query string, so a view can be sent to somebody.
- **Saved views** — a picker and one button, at the end of the filter bar. The button's label is always what pressing it will do: **Save this view** when the selection on screen is not saved, **Remove this view** when it is. Naming takes the row to itself rather than sitting beside the picker, so the bar never offers two ways to do one thing. A view is the page's query string with its parameters sorted, so the same choices made in a different order are the same view. They belong to the page they were saved on, because the same query means different things on two pages with different filters. **They are kept in this browser only** — not shared, not synced, not backed up — and the board says so every time one is saved, along with the thing that does work: the page link already carries the selection.
- **Drill-down tiles** — `.status-tile` for a state or a band. Opening one puts the step in the hash, so the browser's back button works and a link can be shared.
- **Tables** — `.results`, with an optional tick column. On a phone the heading row is dropped and every cell carries its own heading through `labelCells()`.

**Saved views is the one component the components page does not demonstrate.** A working one there would let somebody save views of a page of examples, which is meaningless; a dead one on a page of live components is worse. It is described here instead.

## The three states

A board is always in one of three states, and all three are drawn:

- **Waiting** — a quiet stand-in with the shape of what is coming, so the page does not jump when the real content lands. No spinner: a spinner says "wait" without saying what for.
- **Ready** — the board.
- **Failed** — what went wrong, in the source's own words; a line saying what it does *not* mean; and a **Try again** that re-runs the same path rather than reloading the page. An empty board and a board that could not load are different things, and the second one says so.

The failure panel takes focus and is announced, because a page that silently stops is worse than one that says it stopped.

**A table caps at 200 rows and names what it capped.** Showing the first two hundred silently would be showing part of the answer and calling it the answer, which is the thing this board exists not to do. The export still saves everything.

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
