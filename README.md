# WorksheetHub

**Practice anything. Learn everything.**

A library of **2,019,183 worksheets** across **17 subjects**, for every grade from
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

```bash
npm start                 # server + site on http://127.0.0.1:8099
```

That runs the backend, which also serves the site, so accounts and class
results work. There is still no build step and still nothing to install: the
server is Node's own `node:http` and `node:sqlite`, and the front end is plain
ES modules.

The site also still runs with no backend at all, which is how most of the test
suite drives it:

```bash
npm run start:static      # any static file server will do
python3 -m http.server 8099
```

In that mode an account is a name in `localStorage`, exactly as it was before
the backend existed, and the sign-in page says so.

Opening `index.html` from the filesystem will **not** work — the pages load ES
modules, which browsers refuse over `file://`.

### Configuration

| Variable | Default | What it does |
|---|---|---|
| `PORT` | `8099` | Port to listen on |
| `HOST` | `127.0.0.1` | Interface to bind |
| `DATABASE` | `data/worksheethub.db` | SQLite file; created on first run |
| `NODE_ENV` | — | `production` adds `Secure` to the session cookie |

Behind TLS in production, set `NODE_ENV=production` so the session cookie is
never sent over plain HTTP.

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
| `signin.html`, `settings.html` | Your account, level, theme, and your stored data |

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

**A teacher with no classes yet is not left at a dead end.** "Set work" opens
with a class dropdown, and on a fresh account that dropdown was simply empty —
no explanation, and nothing to click. Now it says *No classes yet*, explains
why, and carries a **Create class** button that takes a name and a level and
makes the class in place: the new class is selected, its join code appears
beside it with a copy-link button, and the level filters below reset to match.
The same code is put in front of the teacher the moment a class is created on
the class list page, because the join code is the whole point of having one.
Analytics does the same thing with its class picker rather than showing a blank
select, and the student join page offers the teacher route to anyone who landed
there without a code.

**With the backend running, a code resolves anywhere.** A student on their own
phone types the six characters, joins the class the teacher made on a laptop,
does the work, and the mark appears in the teacher's grid — see
[The backend](#the-backend). Started as a static site with no server, the old
boundary still holds and is still stated on the page: a code then resolves only
on the device the class was made on, the link works anywhere because the class
travels inside the URL, and nothing can carry a result home. The join page and
the class grid each say which of the two they are in rather than implying the
better one.

Teacher pages switch the interface into a denser, more sober visual mode
(`data-mode="teacher"`) using the same palette, so both audiences clearly see one product.

### The library

**2,019,183 worksheets** across 679 curriculum micro-units, 70 topics, 17
subjects and every level from Pre-K to college — from letter sounds to the
Krebs cycle, and from nutrition and personal finance to cyber security,
philosophy and world religions. Sheets run from 6 to 100 questions; 800,946 are
multi-page packs and 184,555 run to 40 questions or more. Together they hold
about 34.6 million questions.

| Subject | Worksheets | | Subject | Worksheets |
|---|--:|---|---|--:|
| Science | 268,231 | | Early Learning | 84,855 |
| Social Studies | 261,334 | | Engineering & Design | 70,497 |
| Languages | 193,782 | | Philosophy & Religion | 64,448 |
| Mathematics | 184,422 | | Business & Finance | 63,933 |
| English / Language Arts | 183,321 | | Environment & Sustainability | 63,521 |
| Computer Science | 132,582 | | Psychology & Sociology | 53,467 |
| Art & Music | 103,292 | | Study Skills | 52,545 |
| Health & Physical Education | 99,226 | | Media & Film | 45,633 |
| Life Skills & Careers | 94,068 | | | |

The subjects outside the core were the ones that needed this most. Media & Film
had two units and now has eight named ones — film language, genre and
narrative, news values, representation, algorithms and misinformation, sound,
documentary, games. Psychology, sociology, environment, philosophy, world
religions, engineering, business, life skills, the arts, health and computing
all got the same treatment: a unit per block a syllabus actually names, rather
than one broad unit per subject.

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
units a student is actually weak at. So **679 curriculum micro-units** each
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
- **2,019,157 generated worksheets**, expanded from a curriculum plan and the
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

## The backend

The site spent its whole life as a folder of static files, and the one thing
that cost it was stated in the interface rather than hidden: a join link could
carry a class to another device, and **nothing could carry a result back**. A
teacher saw only the students who had worked in their own browser.

That is what this is for. Everything else — accounts, saved answers, scores,
progress — follows from the same requirement.

### Still no dependencies

`node:http` for the server, `node:sqlite` for the database, `node:crypto` for
passwords. Nothing is installed, there is no build, and one process serves both
the API and the site, which means the page and its backend are the same origin
and there is no CORS configuration to get wrong.

```
server/
  index.mjs        config, request pipeline, error handling
  db.mjs           schema and migrations
  auth.mjs         scrypt, sessions, cookies, rate limiting
  http.mjs         router, JSON bodies, cross-site checks
  static.mjs       the site itself
  routes/
    auth.mjs       register, login, logout, me
    progress.mjs   answers, runs, scores, the personal document
    classes.mjs    classes, rosters, joining, assignments, results
```

### Authentication

Three decisions carry the weight, and each is the difference between
authentication and the appearance of it:

- **Passwords are scrypt with a per-user salt** (N=32768), compared with
  `timingSafeEqual`. A hash costs about 175ms, which is unnoticeable to a
  person signing in and ruinous to a wordlist.
- **The cookie holds a random token; the database holds only its SHA-256.**
  Somebody who reads the database cannot log in as anybody.
- **The cookie is HttpOnly and SameSite=Lax**, so page JavaScript can never
  read it and another site cannot make the browser send it on a form post.

Beyond that: a failed sign-in says the same thing whether the email is unknown
or the password is wrong — and takes the same time, because an unknown email
still pays for a scrypt comparison, or the response time answers the question
the message refuses to. Attempts are counted per email *and* per address, so
neither one account nor one attacker can be hammered.

**The cross-site rule took a correction.** The first version required every
mutation to declare `application/json`, which reads as thorough and broke every
`DELETE`: a delete has no body, so it has no content type. The rule that
actually matters is narrower. Only a POST can be a *simple* request — one the
browser sends cross-origin with no preflight — so only a POST needs the
content-type check to take it out of that set. `PUT`, `PATCH` and `DELETE` are
never simple, whatever they carry, and the server never answers a preflight.
Requiring it on them refused honest requests while guarding nothing.

### The schema

Everything a teacher needs to query *across* people is a real table:
`users`, `sessions`, `runs`, `answers`, `scores`, `classes`, `class_students`,
`assignments`, `submissions`, `custom_exercises`. The handful of things nobody
queries across users — theme, favourites, achievements, day totals, the
activity feed — live in one JSON document per user, because giving them tables
would buy nothing.

`answers` is a row per question, not a blob, and that is the point: the
question-level analytics has to be able to ask which students got question 7
wrong, and a JSON document cannot answer that.

Two pragmas matter. `foreign_keys = ON`, because every `ON DELETE CASCADE` is
load-bearing — deleting a class takes its roster, assignments and submissions
with it, and SQLite has foreign keys off by default. And `journal_mode = WAL`,
so a class of thirty submitting at once does not serialise into a queue.

### Finishing a worksheet files it

The write worth describing is `POST /api/me/scores`. In one transaction it
stamps the run complete, records the score, and then files a submission against
**every assignment that set this worksheet to a class this student is in**. The
student sends nothing to anybody; the teacher's grid fills in.

That is the whole feature, and it is why the answers are rows: the submission
carries the per-question detail, so "which question did the class find hardest"
is a real answer about real people rather than a chart of nothing.

### How the browser and the server meet

The store already had the seam. Its header comment used to say *"swap
read()/write() for fetch calls and the rest of the app is unchanged"* — which
was optimistic, but the shape was right.

- **Local write first, always.** A student who answers a question sees it saved
  whether or not the network is having a good day. The store writes to
  `localStorage`, emits an event, and `sync.js` turns that into an API call
  behind them. Nothing in a render path is awaited on the network.
- **A dropped write is not a lost write.** Failed calls go into an outbox that
  survives a reload, and are retried. A 401 empties it and signs the person
  out, because pretending to save work into a dead session is worse than saying
  so.
- **Classes and assignments go to the server first.** Everything else can be
  written locally and pushed after, because it belongs to one person. An id and
  a six-character join code cannot: two teachers on two devices would mint the
  same code soon enough, and a code has to reach exactly one class.
- **Merging is newer-wins, field by field.** A phone that answered five minutes
  ago must not be overwritten by a tab that has been open since this morning.
  The shared document carries its own timestamp and the server refuses a stale
  write, handing back the newer copy instead of taking it.
- **With no backend, none of this runs.** `api.js` probes once and every call
  returns `{ ok: false }` from then on. That is not a fallback bolted on; it is
  how the whole test suite still drives the site.

### Erasing it all had to change

Settings has always offered to erase everything, and it meant clearing
`localStorage`. On an account that is worse than doing nothing: the browser
empties, the page says it worked, and the next sync hands it all straight back.
It now calls `DELETE /api/me/data`, which drops the runs, answers, scores, the
state document, the custom worksheets, the class memberships and — for a
teacher — their classes, cascading to every assignment and submission under
them. The account keeps its name and password and nothing else. The button
signs the person out too, so nothing re-syncs into the empty browser, and the
confirmation says *on any device* rather than *from this browser*, because that
is now what it does.

### Two bugs this found

Both were already there and neither could happen until a backend existed.

- **A page held a stale class.** `teacher/class.html` captured its class object
  at module load. Sync then replaced the store's classes with the server's
  copies, and the captured reference kept pointing at the old one — a roster
  full of real students rendering as empty. It re-reads now, and "class not
  found" waits for the server to have its say, because a teacher signing in on
  a new laptop has an empty store for the first half-second.
- **A temporal dead zone on the progress page.** `progress.js` called `render()`
  from the top of the file, above a `const` that a function two hops down
  reaches for. The branch only runs when a student has practised topics and
  *none* are weak — which no test had ever produced until a full set of correct
  answers arrived. The entry point moved to the bottom of the file.

### The API

| | |
|---|---|
| `POST /api/auth/register` | Create an account; sets the session cookie |
| `POST /api/auth/login` | Sign in |
| `POST /api/auth/logout` | End the session |
| `GET /api/auth/me` | The signed-in user, or `null` — never a 401 |
| `PATCH /api/auth/me` | Change name, role or level |
| `GET /api/me/data` | The whole account in one call: state, runs, answers, scores |
| `PUT /api/me/state` | The personal document, with a timestamp that can lose |
| `PUT /api/me/answers/:exercise/:qid` | Save one answer |
| `PATCH /api/me/runs/:exercise` | Practice time, flags, reset |
| `POST /api/me/scores` | Finish a worksheet; files it against any assignment |
| `DELETE /api/me/data` | Erase everything this person has |
| `GET /api/classes` | A teacher's classes, rosters and assignments |
| `POST /api/classes` | Create a class; the server allocates the join code |
| `GET /api/classes/lookup/:code` | What class a code belongs to, without the roster |
| `POST /api/classes/join` | Join with a code |
| `GET /api/me/classes` | A student's classes, work set to them, work handed in |
| `POST /api/assignments` | Set worksheets to a class |
| `GET /api/classes/:id/results` | Every submission in a class, with per-question detail |

`GET /api/auth/me` answering `{ user: null }` rather than 401 is deliberate:
nobody being signed in is a normal state on a public page, and treating it as
an error fills the console with red on every visit.

### Testing it

`tools/test-api.mjs` runs the real server against an in-memory database on an
ephemeral port and drives it over HTTP with cookies — **87 assertions**, no
mocks. It covers what should work and, as carefully, what should not: another
teacher cannot read, rename or delete a class; a student account cannot create
one; a join code lookup does not leak the roster; an unknown email and a wrong
password are indistinguishable; ten wrong passwords lock the account; a stale
state document loses.

`tools/e2e-backend.mjs` runs the browser on **two separate contexts** — its own
cookies and its own storage, as different as a phone is from a laptop. The
teacher registers and sets work on one; the student registers on the other,
joins with the code, answers every question and finishes; the result appears in
the teacher's grid and analytics with the student named. Then the same student
signs in on a *third* context that has never seen them, and their progress and
their homework are both there. **28 assertions**, and the last three prove the
site still works with every API call blocked.

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

Two more problems appeared once the library passed two million sheets:

- **Accents.** Searching "mise-en-scene" found nothing while the library said
  "mise-en-scène" — and the same would go for café, Dalí and résumé. Both sides
  of every comparison are now folded to unaccented lower case at the point the
  index entry is built. `normalize()` is not cheap and almost every string here
  is plain ASCII, so a fast ASCII test runs first and the index build is the
  speed it was before accents were handled at all.
- **The keyword blob, scanned per family.** The unit vocabulary is one string
  per unit, shared by reference — a hundred and forty thousand families hold
  about seven hundred distinct strings between them, and every one was being
  scanned per family. Each distinct string is now tested once per search and
  the result cached on the query term, so the cost stops rising with the number
  of families. A one-word search went from 686ms back to **185ms**.

Searches run in **150–250ms with a 174MB heap** once the index is warm; the
first search of a session pays about 600ms to build it. Singular and plural
return identical counts for every term tested, and so now do accented and
unaccented spellings.

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
  data/         taxonomy, authored content, 679 micro-unit banks, the figure
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
                       # and 345 curriculum terms that must find worksheets
npm run test:api       # the backend over HTTP, 87 assertions, no browser
npm run test:backend   # two browser contexts: teacher sets work, student on
                       # another device joins and hands it in

npm run start:static   # then, in another shell:
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

`test:api` and `test:backend` start their own server, so they need nothing
running. Everything else is driven against the static site, which is the point:
the front end has to keep working with no backend behind it, and these prove it
does.

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
  whole strand of school history had never been written. This is a list of 345
  terms taken from published curricula that must all find worksheets, plus a
  subject × level grid, so a hole in a year group is visible rather than
  inferred.
- `tools/test-api.mjs` — the first cross-site rule refused every `DELETE`
  request, because it demanded a JSON content type from a verb that has no
  body. Nothing in the browser would have shown it: the calls simply came back
  403 and the interface would have looked as though the writes had gone
  through. Driving the API directly, with cookies, is what made it a two-line
  failure instead of a mystery.
- `tools/e2e-backend.mjs` — two browser contexts, because one cannot tell you
  whether a result actually crossed between devices. It caught a page holding a
  class object from before sync replaced it, which rendered a full roster as
  empty.

---

## What is not built yet

Being precise about the gap:

- **Teacher analytics runs on real submissions only.** There is no sample class and
  no generated data: a teacher who has set nothing sees an empty state that says so.
  Every number on the analytics view comes from work a student actually handed in,
  which is also why the per-question success rates are worth acting on.
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

### Still on the list

1. Password reset by email, which needs an email sender and therefore a decision
   about which one. Until then a forgotten password is a support request.
2. Teacher-authored exercises shared to a class — they sync to the author's own
   account today, not yet to their students.
3. AI-assisted authoring, as a tool inside the builder rather than a headline
   feature.
