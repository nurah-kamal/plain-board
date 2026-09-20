# How this board is built

One design, written down so it can be followed rather than guessed at. If you copy the kit and add a page, this is the agreement you are keeping.

## Colour

Colours live as custom properties on `:root` in `assets/css/styles.css`, redefined once under `@media (prefers-color-scheme: dark)`. Nothing in the stylesheet uses a raw colour value. If you need a new colour, it becomes a token first.

| Token | Light | Dark | Used for |
| --- | --- | --- | --- |
| `--page` | `#F1F6F3` | `#0A130F` | The ground behind everything |
| `--card` | `#FFFFFF` | `#12201A` | Panels, tiles, the menu, raised surfaces |
| `--field` | `#E6EEE9` | `#1A2B24` | Inputs, chip backgrounds, tracks |
| `--ink` | `#11211B` | `#E7F0EB` | Body text |
| `--muted` | `#52665D` | `#96A9A0` | Second-line text, labels, captions |
| `--line` | `#D6E4DC` | `#26382F` | Hairlines and dividers |
| `--navy` / `--navy-deep` | `#14352C` / `#0C211A` | `#143027` / `#0C1F19` | The dark panel on the sign-in |
| `--accent` | `#17A57C` | `#3FBF95` | The one accent the board is known by |
| `--accent-ink` | `#0A6B50` | `#7FDCBB` | Links, and text on green |
| `--group-1` … `--group-5` | teal / red / navy / stone / grey | lighter versions | Whatever dimension your charts split by |
| `--focus` | `#0F766E` | `#6EE7C4` | The focus ring |

**A group colour is a label, not a verdict.** `--group-2` is red because a set of distinguishable colours needs a red in it, not because that group is in trouble. Every chart that splits by group names the colours in its key, and a *state* always lives in a chip or a tinted card — never in a bar or a slice.

**The three status colours** carry meaning and are used nowhere decorative: red for stop, yellow for hold, green for go.

**Contrast.** Every text colour measures at least 4.5:1 against the surface behind it, in both themes, measured against its own tint rather than against the page.

## Type

Two faces, from Google Fonts — the only external resource the content security policy allows:

- **Archivo** (500/600/700) for headings, figures and anything counted.
- **Nunito** (400/600/700) for running text.

Figures use `font-variant-numeric: tabular-nums` wherever they line up in a column, so a changing number does not shift the ones beside it.

## Space and shape

**Three shapes, and nothing else.**

| Token | Size | For |
| --- | --- | --- |
| `--radius` | 16px | Surfaces: panels, tiles, cards |
| `--radius-control` | 10px | Controls: buttons, inputs, selects, the menu, notices, the toast |
| `--radius-mark` | 4px | Marks: small bars and swatches |

Pills (`999px`) are for chips and counts only; `50%` is for avatars. Nothing else rounds its own corners.

**Depth instead of outlines.** A surface lifts off the page with `--shell` rather than drawing a border around itself. In dark mode `--shell` becomes a single hairline, because a shadow on a dark ground reads as dirt.

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

- **The menu** — a light column on `--card`, held off the page by a hairline. The page you are on is a soft green pill with a thin green ring; everything else is `--muted` until hovered. The gaps, padding and row height are sized against the window with `clamp()`, with two `max-height` steps for a short laptop screen, so the menu does not scroll. A finger still gets a 44px row through `@media (pointer: coarse)`.
- **The page header** — the page name, its one-line note, the board search and the refresh button, closed by a hairline. It is built in the script rather than read from the markup, so a browser holding an older copy of the HTML still gets the current header.
- **`.tile`** — a figure with its name, a note, a sparkline of the run behind it and an (i). On `--card` with `--shell`.
- **Where to start** — a row of counts at the top of the landing page, above the filters, each a link into the right group. It counts only what is true right now, and disappears when there is nothing to do.
- **The filter bar** — period, group, person and a search, shared through `assets/js/shared/filters.js` so no two pages can count the same selection differently. The state lives in the query string, so a view can be sent to somebody.
- **Drill-down tiles** — `.status-tile` for a state or a band. Opening one puts the step in the hash, so the browser's back button works and a link can be shared.
- **Tables** — `.results`, with an optional tick column. On a phone the heading row is dropped and every cell carries its own heading through `labelCells()`.

## The address bar

Two different things, kept apart:

- **Filters live in the query string** (`?range=week&product=billing`), set with `history.replaceState`, so typing in a search box does not fill the history with a hundred entries.
- **Where you are inside a page lives in the hash** (`#8-14`), set with `pushState`, so back means back.

## Accessibility

- Every page opens with a skip link, and `<main>` takes focus when a drill-down opens.
- The menu is `inert` when closed on a phone, so a keyboard and a screen reader skip it.
- Redrawing a list would drop focus to the top of the page, so buttons carry a `data-focus` key and focus lands back on the matching one.
- Motion respects `prefers-reduced-motion`.
- Colour is never the only carrier of meaning: a chip has words in it, and a chart has a key.
