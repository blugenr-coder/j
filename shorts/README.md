# What-If Studio

A private tool for making animated "What if…?" YouTube Shorts. Nothing to install and no server: open `index.html` in Chrome or Edge on a computer.

## Making a video

1. Pick an idea on the left (search, filter by type, or use **Next new idea**).
2. **Preview** plays it with sound. Drag the slider to jump to any moment.
3. **RECORD** plays it once more and saves a 1080×1920, 60 fps video to your Downloads folder.
4. Copy the title and description from the right-hand panel into YouTube.

**Batch** records several new ideas one after another, each to its own file. Recording happens in real time (a 30-second short takes 30 seconds), and **the tab has to stay visible**: browsers slow down hidden tabs, and the video would stutter.

Ideas you've recorded get a ✓ and are hidden from the list. That list is kept in this browser only.

## What's inside

- 11 animation types: impacts, giants, zombie outbreaks, battles, gravity, Earth's spin, the Sun, black holes, "everyone vanished", floods and clones.
- 1,658 ideas, each a real combination of type × parameters × place. Ideas of the same type share the same animation structure, so a giant in Tokyo and one in Paris tell the same story with a different skyline.
- Everything is drawn and synthesised in the browser: the music and sound effects are generated live, so there's nothing to license.

| File | What it does |
|---|---|
| `js/core.js` | Seeded randomness, colour helpers, the music and sound-effect synth |
| `js/engine.js` | Camera, stick-figure rig, physics, particles, city builder, captions |
| `js/scenarios.js` | The 11 animation types, each a directed short with timed beats |
| `js/ideas.js` | Places and the idea catalogue, plus the YouTube title/description text |
| `js/app.js` | The page: idea list, preview, recorder |

The numbers in captions are rough and meant for entertainment. Check any that matter before using them as fact.
