# WorksheetHub

**Practice anything. Learn everything.**

A library of **1,033,046 worksheets** across **17 subjects**, for every grade from
Pre-K to college, where the same worksheet works online *and* on paper —
including multi-page packs of up to ten printed pages and 100 questions, and
labelled diagrams that work both on screen and in print. Search it, practise it
with instant marking, print it with a separate answer key, and track what you
are actually weak at. The interface is available in six languages.

The differentiator is the loop, not the download:

```
Search → Open → Practise online → Check → Print → Review → Track progress
```

---

## Running it

There is no build step and no dependencies. Any static file server works:

```bash
npm start                 # http://127.0.0.1:8099
# or
python3 -m http.server 8099
```

Opening `index.html` from the filesystem will **not** work — the pages load ES
modules, which browsers refuse over `file://`.

---

## What is here

### For students

| Page | What it does |
|---|---|
| `index.html` | Landing page: hero, natural-language search, grades, subjects, featured work, how it works, printables, teacher section, stats, CTA |
| `grades.html` | Grade selection — five bands, and every individual year |
| `subjects.html` | Subject index and per-subject topic breakdown |
| `library.html` | Browse and filter by grade, level, subject, topic, difficulty, question type, format and length; filters live in the URL so any view is shareable |
| `exercise.html` | The player: online/printable choice, then the full practice loop |
| `print.html` | A4 worksheet plus a separate answer key |
| `dashboard.html` | Continue where you left off, recent work, recommendations, subject progress |
| `progress.html` | Accuracy, streak, practice time, weak topics and full history |
| `favorites.html` | Starred exercises |
| `achievements.html` | Optional milestones, kept off the practice screens |
| `join.html` | Open an assignment from a six-character code |
| `signin.html`, `settings.html` | Local account, level, theme, and your stored data |

### For teachers

| Page | What it does |
|---|---|
| `teacher/index.html` | Classes, assignments, and the questions your classes struggled with |
| `teacher/classes.html` | Create a class, get its join code and link, see every class at a glance |
| `teacher/class.html` | One class: roster, assignments, and a grid of who has done what |
| `teacher/create.html` | Filter the library → tick several worksheets → set them with a due date |
| `teacher/analytics.html` | Class average, per-student results, and success rate for every question |
| `teacher/builder.html` | Write your own questions; they play and print through the same code paths |

### Classes

A teacher creates a class and gets two ways to share it: a six-character join
code, and a link. Students join, see the work on their dashboard with its due
date, complete it, and the result lands in the teacher's grid.

The honest boundary: **a code resolves only on the device the class was created
on; the link works anywhere**, because the class details travel inside the URL.
What no link can do is send results back without a server, so a student working
on their own laptop shows on the roster but their marks stay on their machine.
The interface says this rather than implying otherwise.

Teacher pages switch the interface into a denser, more sober visual mode
(`data-mode="teacher"`) using the same palette, so both audiences clearly see one product.

### The library

**1,033,046 worksheets** across 511 curriculum micro-units, 70 topics, 17
subjects and every level from Pre-K to college — from letter sounds to the
Krebs cycle, and from nutrition and personal finance to cyber security,
philosophy and world religions. Sheets run from 6 to 100 questions; 464,810 are
multi-page packs and 129,609 run to 40 questions or more. Together they hold
about 20 million questions.

| Subject | Worksheets | | Subject | Worksheets |
|---|--:|---|---|--:|
| Science | 147,554 | | Life Skills & Careers | 39,532 |
| Languages | 136,854 | | Art & Music | 36,958 |
| English / Language Arts | 119,338 | | Business & Finance | 33,164 |
| Social Studies | 119,231 | | Engineering & Design | 32,528 |
| Mathematics | 112,959 | | Study Skills | 24,518 |
| Computer Science | 64,073 | | Environment & Sustainability | 21,527 |
| Health & Physical Education | 52,870 | | Philosophy & Religion | 18,934 |
| Early Learning | 45,996 | | Psychology & Sociology | 16,306 |
| | | | Media & Film | 10,704 |

### Families, not worksheets

A million worksheets do not fit in a browser tab, and they do not need to. The
catalogue stores **80,785 families** — a topic-or-unit × level × format — each
of which knows how many distinct **sets** it can produce:

```js
class Blueprint { …  get sets() { … }   at(n) { /* materialise set n */ } }
```

Nothing is materialised until it is asked for. Counting, faceting, filtering and
sorting all run over the families and weight each by its `sets`, so the library
page can page through a million sheets without ever building more than the 24
cards on screen. The id index is built lazily too. That is what keeps first
paint under half a second.

### Micro-units: the grain that matters

A subject is not one thing you practise; it is thirty. Biology is *Cell
Structure*, *Photosynthesis*, *Cellular Respiration and the Krebs Cycle*,
*Homeostasis* — the units a scheme of work is actually built from, and the
units a student is actually weak at. So **511 curriculum micro-units** each
carry their own item bank and their own level range, in
`assets/js/data/units-*.js`:

```js
{ name: 'Photosynthesis', from: 'Grade 6', to: 'Grade 12',
  figures: ['leaf', 'plant-cell'],
  facts:  [['chlorophyll', 'the green pigment that absorbs light energy'], …],
  truths: ['Increasing light intensity raises the rate only until another factor limits it', …],
  myths:  ['Plants stop respiring during the day because they are photosynthesising', …] }
```

`facts` are the recall spine. **`truths` and `myths` are what turn a vocabulary
list into a quiz**: they test whether the idea is understood rather than whether
the label was memorised, and every myth is a misconception students actually
hold — that a heavier object falls faster, that medieval Europeans thought the
Earth was flat, that negative reinforcement means punishment. Units may also
declare `sequences` (steps to order), `applications` (the idea in an unfamiliar
situation), `figures` (diagrams to label) and `procedural` (composed fresh every
time, for domains like counting where that is honest).

`unit-engine.js` turns each unit into up to **nineteen named question makers** —
recognise the term, recognise the meaning, recall it unaided, recall with a
hint, fill the blank in a claim, match four pairs either way round, pick the
true claim, spot the myth, audit two or three statements at once, find the odd
one out, decide what belongs, order a sequence, apply the idea, label a diagram,
define, explain, correct the error. Distractors are drawn from inside the same
unit, or from a near-neighbour unit in the same subject, so a wrong answer is
always a near miss rather than an obviously foreign option. Each maker declares
the difficulty tier it refuses to run below, which is why the same unit reads
differently at Grade 6 and at college.

### Labelled diagrams

Twenty-six figures — animal and plant cells, the heart, the digestive and
respiratory systems, a neuron, a flower, a leaf cross-section, DNA, shell
diagrams for three atoms, ionic and covalent bonding, a wave, a circuit, a
free-body diagram, the Earth's layers, the water cycle, a volcano, a river, and
six geometry figures — are **inline SVG built from CSS custom properties**, so a
diagram inverts correctly in dark mode and prints as line art on white. No
binary assets, no network request per question, and the same drawing serves both
the online question and the printed one.

The interaction is a dropdown per marker rather than drag-and-drop. Dragging is
the obvious idea and the wrong one: it fails on touch without a lot of custom
pointer code, it is invisible to a screen reader, and it cannot be printed. A
native select is one tap on a phone and degrades to a blank line on paper, where
the sheet prints the figure, the numbered lines and a word bank — without the
bank a labelling question silently becomes an unaided recall question.

Parts that genuinely share a spot — a nucleolus inside a nucleus, a proton and a
neutron — are never asked for on the same diagram, because two markers there
would overlap and point at the same pixel.

### Twenty-one formats

The same unit at the same level produces genuinely different sheets depending on
what you asked for. Each **format** restricts which makers may run, and some
raise the difficulty floor:

`quiz` · `vocab` · `define` · `match` · `cloze` · `truefalse` · `myths` ·
`sorting` · `retrieval` · `starter` · `written` · `exam` · `homework` · `mixed` ·
`sequence` · `applied` · `diagram` · `annotated` · `practice` · `counting` ·
`numberwork`

A *Definitions Drill* and a *Misconception Check* on the same unit share no
questions at all.

### How many sheets a family holds

Most worksheets exist in several **sets** — the same unit at the same level and
format, seeded differently. How many a family gets is **measured, not
declared**: capacity is counted per format from what each maker can produce from
that unit's bank, with combinatorial shapes counted as such (a matching question
drawing 4 of 16 items is not 16 questions).

```js
const REPEATS_ALLOWED = 1;
const setsFrom = (capacity, count) => {
  const ceiling = Math.min(32, Math.max(6, Math.round(capacity / 12)));
  return Math.max(3, Math.min(ceiling, Math.round((capacity * REPEATS_ALLOWED) / Math.max(1, count))));
};
```

This constant was three, with a ceiling of 140, and it was the wrong trade. It
bought a very large number by putting a hundred and forty near-identical sheets
behind one unit — an alphabet of quizzes, differing in which twelve of the same
eighty questions each happened to deal. A teacher scrolling that list cannot
tell them apart, because there is nothing to tell apart. At one repeat the
sheets in a family are close to disjoint, the library is less than half the
size, and every sheet in it is worth opening.

Sets are named, not lettered. "Set B" next to "Set C" is not a distinction
anyone can act on, so each set takes a name from a pool per format — *Knowledge
Check*, *Spot the Error*, *Retrieval Starter*, *Six-Mark Practice*.

**The honest ceiling still holds: the library is as large as its content can
support, not as large as a number sounds.** Growth comes from writing units.

### Curriculum alignment

Every topic is mapped to the framework domains schools index their schemes of
work against — Common Core (maths and ELA), NGSS, C3, CEFR, CSTA and others — in
`assets/js/data/standards.js`. The library can be filtered by framework, and the
alignment appears on the worksheet page and on the printed header.

These are **domain codes, and labelled indicative**. A domain can be stated
accurately for a topic; pinning a generated worksheet to one lettered
sub-statement would be a claim this library cannot actually verify, so it does
not make it.

### Two sources, one shape

- **26 authored worksheets**, written by hand — the deepest content, and what
  sets the tone for everything else.
- **1,033,020 generated worksheets**, expanded from a curriculum plan and the
  micro-unit banks. These are deterministic (the same worksheet always contains
  the same questions) and their answers are *computed*, not transcribed, so a
  sheet cannot disagree with its own answer key. Questions materialise only when
  a worksheet is opened, and the id index is built only when something is looked
  up by id — which is what keeps a million-sheet library painting in
  under 500 ms.

Two rules keep the generated set honest, both added after the first pass broke them:

- A specific title is only allowed where it is pinned to matching question
  generators. Otherwise the worksheet is called *Core Practice* — a sheet titled
  "Loops" that asks about dictionaries is worse than an honestly generic one.
- A focus can declare the earliest level it belongs at, so quadratics stop turning
  up in Grade 7.

Every question carries a hint and a worked explanation; the explanation is also what
prints on the answer key.

Nine question types, each with its own interaction:

| Type | Interaction |
|---|---|
| Fill in the blank | Text entry |
| Math input | Text entry with a symbol keypad (x, ÷, √, ^, π, ±) |
| Multiple choice | One option |
| Multiple answers | Every correct option, and no wrong ones |
| Matching | Click a term, then its partner |
| Ordering | Move rows into sequence |
| Graph | Click a coordinate grid, or type the point |
| Label the diagram | A numbered marker per part, and a label for each |
| Written response | Saved and compared against a sample — never auto-marked |

---

## Search that finds what a worksheet teaches

Two bugs, both of which made a large library feel empty.

**Searching for "cells" returned one worksheet where "cell" returned 3,940.**
The match was a plain substring test, and no worksheet title contains the word
"cells" — so the plural of the thing you were looking for found nothing. Both
sides are now reduced to a stem before matching, with fallbacks tried in order
and scored below an exact hit, so an exact match still sorts first and the rest
only decide whether a worksheet appears at all: the stem (`cells` → `cell`), the
stem as a substring (which is what reaches *Cellular Respiration*), and a
truncated root for long words (`photosynthesise` finds photosynthesis).

The stemmer is deliberately small and conservative rather than linguistically
correct — it only has to be the *same* on both sides. It leaves short words
alone, where dropping a letter changes the word: gas, bus, is.

**And "mitosis", "apostrophe", "Roman numerals" and "SQL" returned nothing at
all** — while the worksheets covering every one of them sat in the library. The
index was built from a worksheet's title, summary, level, topic and subject,
plus its question text only if that sheet had already been opened. So a unit
called *Cell Structure and Function* was findable by its name and invisible by
every term it actually teaches. Each unit now contributes its own vocabulary —
terms, meanings, the true and false statements — as one string. "photosynthesis"
went from 1,988 worksheets to 10,334; the ones titled for it still rank first.

Three performance traps came with that, and all three are worth recording
because the obvious implementation of each was the slow one:

- Joining the keywords into each worksheet's index string copied a couple of
  kilobytes into all eighty thousand of them: **3.8 seconds and 740MB of heap**,
  for a string identical across every family of the same unit. Held by reference
  instead, it costs nothing.
- The rest of the index is built only when the cheaper fields all miss.
- The stem fallback built a set of word stems per worksheet, and it ran on every
  worksheet that did *not* match — three and a half seconds on a one-word
  search. Every stemming rule trims the end of a word, so the substring tests
  already cover them; the single exception is `-y` → `-ies`, which rewrites, and
  that one form is now spelled out and tested directly. The stem-set code is
  gone.

Searches now run in **90–290ms with a 97MB heap**, and singular and plural
return identical counts for every term tested.

Filters are multi-select: several values per group, OR inside a group and AND
between groups. Picking Biology and Chemistry widens the results; picking
Biology and Grade 8 narrows them. Each value gets its own chip so removing one
does not remove three, and the URL stays readable — `?subject=science,math`.

---

## Six languages, and an honest boundary

A selector in the header switches the interface between **English, Español,
Français, Deutsch, Português and Italiano**. The choice is remembered and applies
to every page.

There are no translation keys in the markup. `assets/js/core/i18n.js` matches on
the **source text**: a `TreeWalker` replaces text nodes and four attributes
(`placeholder`, `title`, `aria-label`, `alt`), and a `MutationObserver` catches
anything a page renders afterwards. Adding a language is one file —
`assets/js/i18n/<code>.js` — with a dictionary and a list of patterns:

```js
export const DICT = { "Browse worksheets": "Esplora le schede", … };
export const PATTERNS = [
  [String.raw`^(\d[\d.,]*) worksheets?$`, "$1 scheda", "$1 schede"],
  [String.raw`^(.+) on (.+) for (.+), with (\d+) questions and a separate answer key\.$`,
   "$1! su «$2» per $3!, con $4 domande e griglia di correzione a parte."],
];
```

Patterns cover the strings that carry a number, with a plural form where the
language needs one. `$1` inserts a captured group as-is; **`$1!` looks it up in
the dictionary first**, which is what lets one pattern translate a whole
worksheet summary whose subject is itself a translatable phrase.

Three deliberate boundaries:

- **The worksheet questions stay in English.** A Spanish reading of a chemistry
  question is a translation job with a right and a wrong answer, and a machine
  pass over an answer key would produce sheets that quietly disagree with their
  own marking. The interface, the taxonomy, the titles and the summaries are
  translated; the question text is not. The language units are the exception —
  they were already in their own language.
- **The brand name is not a word to look up.** `translate="no"` marks it, and the
  walker skips anything inside such an element. Without it, the Italian pass
  turned "WorksheetHub" into "SchedaHub".
- **Switching back to English reloads the page.** The dictionary only runs one
  way, so a translated page cannot be turned back by looking words up.

Layout is part of the translation. The filter panel picks one or two columns
from how long the *translated* option names are — "Grade 1" fits a half-width
column and "Scuola secondaria di primo grado" does not — so the library waits
for the language pack before its first render. The header tightens its own
spacing between 901px and 1100px, where the German nav labels used to run 50px
past the edge.

---

## How it is built

Plain HTML, CSS and ES modules. No framework, no bundler, no dependencies at
runtime. That is a deliberate choice for this stage: it deploys to any static host,
starts instantly, and nothing rots.

```
assets/css/     tokens → base → components → pages → print
assets/js/
  core/         store, marking, search, i18n, question renderers, app shell,
                cards, icons
  data/         taxonomy, authored content, 511 micro-unit banks, the figure
                library, the unit engine and the family catalogue
  i18n/         one dictionary per language
  pages/        one module per page
tools/          content validator, marking tests, syntax check, curriculum
                coverage, e2e, link check, render, spacing, contrast, mobile
                and header fit checks, icon contact sheet
```

A few decisions worth knowing about:

**`assets/js/core/marking.js` owns every "is this right?" decision.** The player, the
answer key and anything added later all mark identically. Marking is forgiving about
formatting — `0.5`, `1/2`, `50%` and `x = 5` are all understood — and strict about meaning.

**`assets/js/core/store.js` is the seam where a server goes.** Everything is read and
written through it, so replacing `load()`/`persist()` with API calls is the whole
migration for the client.

**Feedback never leaks the answer.** A wrong attempt offers another go and a hint;
the worked explanation appears only when the learner asks for it.

**Content is data, not markup.** Adding a worksheet means adding an object to
`assets/js/data/exercises-*.js`, or a line to the plan in `generated.js`.
`node tools/validate-content.mjs` checks metadata on every one of the 80,785
families and materialises a sample of about 67,000 sheets — some 1.46 million
questions — checking them for dangling answer indexes, unknown topics, levels
that do not belong to their band, duplicate questions on one sheet, and
worksheets that come up short of their declared length.

**No emoji anywhere.** All 77 icons are line SVGs on a 24px grid that inherit type
colour and weight. Emoji render differently on every platform, cannot be styled, and
read as toy-like — wrong for something a teacher puts in front of a class. Open
`/tools/icon-sheet.html` on a running server to see the whole set.

**A worksheet card shows its questions.** Cards render two real questions from the
sheet they describe rather than summarising it, which is also why results are paged
at 24 — a card that renders real content cannot be multiplied by a thousand.

---

## Checks

```bash
npm run check          # module syntax, content integrity, 33 marking tests,
                       # and 188 curriculum terms that must find worksheets
npm start              # then, in another shell:
npm run test:all       # everything below, in order
npm run test:render    # asserts every page actually renders its content
npm run test:contrast  # every text element against WCAG AA, in both themes
npm run test:mobile    # nine device widths, none may scroll sideways
npm run test:header    # 4 pages × 17 widths × 6 languages, nothing clipped
npm run test:links     # crawls every page for broken internal links
npm run test:e2e       # drives a real browser through every question type, the
                       # teacher flows (analytics, codes, joining, the builder)
                       # and all six languages
```

Each of these exists because of a bug it caught:

- `tools/check-syntax.sh` — `node --check` parses a `.js` file as CommonJS and
  silently misses syntax errors in these modules, so each is re-checked as ESM.
- `tools/check-render.mjs` — a page can load with no console errors and still
  render nothing, because `replaceChildren` takes varargs and quietly stringifies
  an array it is handed. This asserts the content is really on the page.
- `tools/check-mobile.mjs` — the subject list joined topic names with no
  whitespace between them, so the browser saw one unbreakable word and ran it
  eight hundred pixels off the side of a phone screen. This walks every page at
  two widths and fails anything that escapes the viewport, ignoring content
  inside a container that is deliberately scrollable.
- `tools/check-contrast.mjs` — a band styled `background: var(--text); color: #fff`
  inverted in dark mode and became white text on a white card. Nothing else could
  see it: the markup was correct, the page rendered, the links worked. This walks
  every element that paints text, works out the background actually behind it,
  and fails anything under WCAG AA. It found 1,307 more on its first run.
- `tools/check-header.mjs` — adding `white-space: nowrap` to the nav turned a
  visible wrap into invisible clipping: the bounding boxes still said there was
  no overlap, because a flex item with `min-width: 0` can be squeezed narrower
  than its own content and then paint over its neighbours. This walks four pages
  at seventeen widths in six languages and fails any element whose content is
  wider than the box it was given — the class of bug that bounding-box checks
  and screenshots both miss.
- `tools/check-coverage.mjs` — a library can be large and still be missing the
  thing a teacher types in. Searching for "mitosis", "apostrophe", "Roman
  numerals" or "the Tudors" once returned nothing, while worksheets covering all
  of them sat in the catalogue: the index could not see inside a unit, and a
  whole strand of school history had never been written. This is a list of 188
  terms taken from published curricula that must all find worksheets, plus a
  subject × level grid, so a hole in a year group is visible rather than
  inferred.

---

## What is not built yet

This is a complete front end with local persistence. Being precise about the gap:

- **No server and no real accounts.** "Signing in" is a name, a role and a level held
  in `localStorage`. There is no password, nothing is transmitted, and clearing site
  data erases everything. `settings.html` says so on the page and offers an export.
- **Classes are real but single-device for results.** Creating classes, rosters,
  multi-worksheet assignments, due dates, joining by code or link, and the
  who-has-done-what grid all work. Results only flow back to the teacher when
  the student worked in the same browser. This is the single highest-value thing
  a backend would unlock.
- **Teacher analytics runs on real submissions only.** There is no sample class and
  no generated data: a teacher who has set nothing sees an empty state that says so.
  Every number on the analytics view comes from work a student actually handed in
  in this browser, which is also why the per-question success rates are worth acting
  on.
- **The exercise builder covers five question types**, not all eight. Matching,
  ordering and graph questions need dedicated editing interfaces; shipping a
  half-working editor for them would produce broken exercises. What it does save
  joins the library on that device and plays and prints like anything else.
- **Generated worksheets are template-driven, not hand-written.** They are correct
  and level-appropriate, but a generated sheet on a knowledge topic draws from a
  bank of authored items rather than being composed for that exact worksheet. The
  26 authored sheets are noticeably richer. Growing the banks is the cheapest way
  to raise the quality of the whole library.
- **No AI generation.** Section 18 of the plan puts it deliberately late, and the
  library is the product.

### The order I would build the server in

1. Accounts and progress sync — makes everything else durable and multi-device.
2. Assignment codes — unlocks the whole teacher-to-student flow.
3. Real submissions and analytics — replaces the sample data with actual answers.
4. Teacher-authored exercises shared to a class.
5. AI-assisted authoring, as a tool inside the builder rather than a headline feature.
