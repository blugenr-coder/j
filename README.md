# WorksheetHub

**Practice anything. Learn everything.**

An exercise library for every grade from Pre-K to college, where the same exercise
works online *and* on paper. Search it, practise it with instant marking, print it
with a separate answer key, and track what you are actually weak at.

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
| `teacher/create.html` | Filter the library → pick an exercise → get a code and a shareable link |
| `teacher/analytics.html` | Class average, per-student results, and success rate for every question |
| `teacher/builder.html` | Write your own questions; they play and print through the same code paths |

Teacher pages switch the interface into a denser, more sober visual mode
(`data-mode="teacher"`) using the same palette, so both audiences clearly see one product.

### The library

26 exercises / 204 questions, hand-written across all five grade bands and seven
subjects. Every question carries a hint and a worked explanation; the explanation is
also what prints on the answer key.

Eight question types, each with its own interaction:

| Type | Interaction |
|---|---|
| ✏️ Fill in the blank | Text entry |
| 🔢 Math input | Text entry with a symbol keypad (x, ÷, √, ^, π, ±) |
| 🔘 Multiple choice | One option |
| ☑️ Multiple answers | Every correct option, and no wrong ones |
| 🧩 Matching | Click a term, then its partner |
| 🔀 Ordering | Move rows into sequence |
| 📊 Graph | Click a coordinate grid, or type the point |
| ✍️ Written response | Saved and compared against a sample — never auto-marked |

---

## How it is built

Plain HTML, CSS and ES modules. No framework, no bundler, no dependencies at
runtime. That is a deliberate choice for this stage: it deploys to any static host,
starts instantly, and nothing rots.

```
assets/css/     tokens → base → components → pages → print
assets/js/
  core/         store, marking, search, question renderers, app shell, cards
  data/         taxonomy + exercise content
  pages/        one module per page
tools/          content validator, marking tests, syntax check, e2e, link check
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

**Content is data, not markup.** Adding an exercise means adding an object to
`assets/js/data/exercises-*.js`. `node tools/validate-content.mjs` then checks it for
dangling answer indexes, unknown topics, levels that do not belong to their band, and
missing explanations.

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
- **Assignment codes only resolve on the device that created them.** The generation,
  sharing and joining flows are real; the lookup is local. This is the single highest-
  value thing a backend would unlock.
- **Teacher analytics runs on sample classes.** Results are generated deterministically
  from student and question ids so the view is usable and reproducible before real
  students exist. Every sample class is labelled as such in the interface.
- **The exercise builder covers five question types**, not all eight. Matching,
  ordering and graph questions need dedicated editing interfaces; shipping a
  half-working editor for them would produce broken exercises. What it does save
  joins the library on that device and plays and prints like anything else.
- **No AI generation.** Section 18 of the plan puts it deliberately late, and the
  library is the product.

### The order I would build the server in

1. Accounts and progress sync — makes everything else durable and multi-device.
2. Assignment codes — unlocks the whole teacher-to-student flow.
3. Real submissions and analytics — replaces the sample data with actual answers.
4. Teacher-authored exercises shared to a class.
5. AI-assisted authoring, as a tool inside the builder rather than a headline feature.
