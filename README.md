# WorksheetHub

**Practice anything. Learn everything.**

A library of **24,857 worksheets** across **15 subjects**, for every grade from
Pre-K to college, where the same worksheet works online *and* on paper —
including multi-page packs of up to four printed pages and 40 questions. Search it, practise it with instant
marking, print it with a separate answer key, and track what you are actually
weak at.

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

**24,857 worksheets** across 57 topics, 15 subjects and every level from Pre-K to
college — from counting to calculus, and from nutrition and personal finance to
cyber security, philosophy and world religions. Sheets run from 6 to 40
questions; 3,084 are multi-page packs of 2, 3 or 4 printed pages.

### How a library gets to 24,857 without padding

Most worksheets exist in several **sets** — the same focus at the same level,
seeded differently, so Set A and Set K contain genuinely different questions.
The number of sets a topic gets is **measured, not declared**:

- At load, every generator is probed with five seeds. It counts as varying only
  if the *question itself* changes — reshuffling the options of a fixed item is
  not new content.
- Sets are then allocated in proportion to that measured variety, capped, so a
  topic that can compose fresh questions carries many and one that deals from a
  small fixed bank carries one.

This replaced a hand-written list of "procedural" topics that got it wrong and
gave Business & Finance more worksheets than Science.

Where a topic has a naturally large pool — vocabulary, spelling, three
languages, grammar, geography, chemistry, biology, history, anatomy, art
history — questions are **sampled from that pool** rather than drawn from a
fixed list, which is what makes hundreds of genuinely different sheets possible.

The honest ceiling: **the library is as large as its content can support, not as
large as a number sounds.** Going much beyond this would mean re-dealing the
same items, and the set allocation deliberately refuses to. They come from two sources behind one shape:

- **26 authored worksheets**, written by hand — the deepest content, and what sets
  the tone for everything else.
- **1,030 generated worksheets**, expanded from a curriculum plan. These are
  deterministic (the same worksheet always contains the same questions) and their
  answers are *computed*, not transcribed, so a sheet cannot disagree with its own
  answer key. Questions materialise only when a worksheet is opened, which is what
  lets the library list a thousand of them instantly.

Two rules keep the generated set honest, both added after the first pass broke them:

- A specific title is only allowed where it is pinned to matching question
  generators. Otherwise the worksheet is called *Core Practice* — a sheet titled
  "Loops" that asks about dictionaries is worse than an honestly generic one.
- A focus can declare the earliest level it belongs at, so quadratics stop turning
  up in Grade 7.

Every question carries a hint and a worked explanation; the explanation is also what
prints on the answer key.

Eight question types, each with its own interaction:

| Type | Interaction |
|---|---|
| Fill in the blank | Text entry |
| Math input | Text entry with a symbol keypad (x, ÷, √, ^, π, ±) |
| Multiple choice | One option |
| Multiple answers | Every correct option, and no wrong ones |
| Matching | Click a term, then its partner |
| Ordering | Move rows into sequence |
| Graph | Click a coordinate grid, or type the point |
| Written response | Saved and compared against a sample — never auto-marked |

---

## How it is built

Plain HTML, CSS and ES modules. No framework, no bundler, no dependencies at
runtime. That is a deliberate choice for this stage: it deploys to any static host,
starts instantly, and nothing rots.

```
assets/css/     tokens → base → components → pages → print
assets/js/
  core/         store, marking, search, question renderers, app shell, cards, icons
  data/         taxonomy, authored content, and the generator engine
  pages/        one module per page
tools/          content validator, marking tests, syntax check, e2e, link check,
                render check, icon contact sheet
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
`node tools/validate-content.mjs` materialises all 11,222 questions and checks them
for dangling answer indexes, unknown topics, levels that do not belong to their band,
and worksheets that come up short of their declared length.

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
npm run check        # module syntax, content integrity, 26 marking tests
npm start            # then, in another shell:
npm run test:all     # everything below, in order
npm run test:render  # asserts every page actually renders its content
npm run test:links   # crawls every page for broken internal links
npm run test:e2e     # drives a real browser through every question type, and
                     # the teacher flows: analytics, codes, joining, the builder
```

Two of these exist because of bugs they caught:

- `tools/check-syntax.sh` — `node --check` parses a `.js` file as CommonJS and
  silently misses syntax errors in these modules, so each is re-checked as ESM.
- `tools/check-render.mjs` — a page can load with no console errors and still
  render nothing, because `replaceChildren` takes varargs and quietly stringifies
  an array it is handed. This asserts the content is really on the page.

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
- **Teacher analytics runs on sample classes.** Results are generated deterministically
  from student and question ids so the view is usable and reproducible before real
  students exist. Every sample class is labelled as such in the interface.
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
