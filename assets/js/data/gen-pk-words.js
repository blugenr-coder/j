/* The picture word bank: every word a pre-K sheet can show, with its picture.

   Almost every literacy skill in the catalogue reduces to "find the words that
   start with /b/", "match the picture to the letter", "which two rhyme". All of
   them need the same thing: words a four-year-old knows, each with a picture,
   each tagged with the sounds it actually makes.

   The tags are written out rather than derived from spelling, because spelling
   lies. "Circle" does not start with /k/, "phone" does not start with /p/, and
   a worksheet that says otherwise teaches the wrong thing to the one child who
   was paying attention.

   Each entry: [word, picture, initial sound, final sound, syllables, rhyme].
   The rhyme is the word family where the word belongs to one, or '' where it
   does not.                                                                  */

const W = (word, pic, start, end, syl, rhyme = '') => ({ word, pic, start, end, syl, rhyme });

export const PK_WORDS = [
  /* ------------------------------- animals ------------------------------- */
  W('ant', '🐜', 'a', 't', 1, 'ant'), W('apple', '🍎', 'a', 'e', 2),
  W('alligator', '🐊', 'a', 'r', 4), W('astronaut', '🧑‍🚀', 'a', 't', 3),
  W('bat', '🦇', 'b', 't', 1, 'at'), W('bear', '🐻', 'b', 'r', 1),
  W('bee', '🐝', 'b', 'e', 1), W('bird', '🐦', 'b', 'd', 1),
  W('bus', '🚌', 'b', 's', 1), W('ball', '⚽', 'b', 'l', 1),
  W('book', '📕', 'b', 'k', 1), W('banana', '🍌', 'b', 'a', 3),
  W('cat', '🐱', 'c', 't', 1, 'at'), W('cow', '🐄', 'c', 'w', 1),
  W('cake', '🎂', 'c', 'k', 1), W('car', '🚗', 'c', 'r', 1),
  W('crab', '🦀', 'c', 'b', 1), W('cup', '🥤', 'c', 'p', 1, 'up'),
  W('carrot', '🥕', 'c', 't', 2), W('candle', '🕯️', 'c', 'e', 2),
  W('dog', '🐶', 'd', 'g', 1, 'og'), W('duck', '🦆', 'd', 'k', 1),
  W('door', '🚪', 'd', 'r', 1), W('drum', '🥁', 'd', 'm', 1, 'um'),
  W('doll', '🪆', 'd', 'l', 1), W('dinosaur', '🦕', 'd', 'r', 3),
  W('egg', '🥚', 'e', 'g', 1, 'eg'), W('elephant', '🐘', 'e', 't', 3),
  W('envelope', '✉️', 'e', 'e', 3), W('engine', '🚂', 'e', 'e', 2),
  W('fish', '🐟', 'f', 'sh', 1), W('fox', '🦊', 'f', 'x', 1, 'ox'),
  W('frog', '🐸', 'f', 'g', 1, 'og'), W('flower', '🌸', 'f', 'r', 2),
  W('fan', '🪭', 'f', 'n', 1, 'an'), W('fire', '🔥', 'f', 'r', 1),
  W('goat', '🐐', 'g', 't', 1), W('gift', '🎁', 'g', 't', 1),
  W('grapes', '🍇', 'g', 's', 1), W('guitar', '🎸', 'g', 'r', 2),
  W('ghost', '👻', 'g', 't', 1), W('globe', '🌍', 'g', 'e', 1),
  W('hat', '🎩', 'h', 't', 1, 'at'), W('horse', '🐴', 'h', 'e', 1),
  W('house', '🏠', 'h', 'e', 1), W('hand', '✋', 'h', 'd', 1),
  W('heart', '❤️', 'h', 't', 1), W('honey', '🍯', 'h', 'y', 2),
  W('igloo', '🛖', 'i', 'o', 2), W('insect', '🐞', 'i', 't', 2),
  W('ink', '🖋️', 'i', 'k', 1), W('iguana', '🦎', 'i', 'a', 3),
  W('jam', '🍓', 'j', 'm', 1, 'am'), W('jug', '🏺', 'j', 'g', 1, 'ug'),
  W('jet', '✈️', 'j', 't', 1, 'et'), W('jacket', '🧥', 'j', 't', 2),
  W('juice', '🧃', 'j', 'e', 1), W('jigsaw', '🧩', 'j', 'w', 2),
  W('key', '🔑', 'k', 'y', 1), W('kite', '🪁', 'k', 'e', 1),
  W('king', '🤴', 'k', 'g', 1), W('kitten', '🐱', 'k', 'n', 2),
  W('koala', '🐨', 'k', 'a', 3), W('kettle', '🫖', 'k', 'e', 2),
  W('leaf', '🍃', 'l', 'f', 1), W('lion', '🦁', 'l', 'n', 2),
  W('lamp', '💡', 'l', 'p', 1), W('leg', '🦵', 'l', 'g', 1, 'eg'),
  W('lemon', '🍋', 'l', 'n', 2), W('ladder', '🪜', 'l', 'r', 2),
  W('map', '🗺️', 'm', 'p', 1, 'ap'), W('moon', '🌙', 'm', 'n', 1),
  W('mouse', '🐭', 'm', 'e', 1), W('milk', '🥛', 'm', 'k', 1),
  W('mug', '☕', 'm', 'g', 1, 'ug'), W('monkey', '🐵', 'm', 'y', 2),
  W('nest', '🪺', 'n', 't', 1), W('net', '🥅', 'n', 't', 1, 'et'),
  W('nose', '👃', 'n', 'e', 1), W('nut', '🌰', 'n', 't', 1, 'ut'),
  W('needle', '🪡', 'n', 'e', 2), W('nurse', '🧑‍⚕️', 'n', 'e', 1),
  W('owl', '🦉', 'o', 'l', 1), W('orange', '🍊', 'o', 'e', 2),
  W('otter', '🦦', 'o', 'r', 2), W('octopus', '🐙', 'o', 's', 3),
  W('pig', '🐖', 'p', 'g', 1, 'ig'), W('pen', '🖊️', 'p', 'n', 1, 'en'),
  W('pot', '🍲', 'p', 't', 1, 'ot'), W('pan', '🍳', 'p', 'n', 1, 'an'),
  W('pizza', '🍕', 'p', 'a', 2), W('pencil', '✏️', 'p', 'l', 2),
  W('queen', '👸', 'q', 'n', 1), W('quilt', '🛏️', 'q', 't', 1),
  W('question', '❓', 'q', 'n', 2), W('quarter', '🪙', 'q', 'r', 2),
  W('rat', '🐀', 'r', 't', 1, 'at'), W('rug', '🧶', 'r', 'g', 1, 'ug'),
  W('ring', '💍', 'r', 'g', 1), W('robot', '🤖', 'r', 't', 2),
  W('rocket', '🚀', 'r', 't', 2), W('rainbow', '🌈', 'r', 'w', 2),
  W('sun', '☀️', 's', 'n', 1, 'un'), W('sock', '🧦', 's', 'k', 1),
  W('star', '⭐', 's', 'r', 1), W('snake', '🐍', 's', 'e', 1),
  W('seed', '🌱', 's', 'd', 1), W('spoon', '🥄', 's', 'n', 1),
  W('top', '🔝', 't', 'p', 1, 'op'), W('ten', '🔟', 't', 'n', 1, 'en'),
  W('train', '🚂', 't', 'n', 1), W('tree', '🌳', 't', 'e', 1),
  W('tiger', '🐯', 't', 'r', 2), W('turtle', '🐢', 't', 'e', 2),
  W('umbrella', '☂️', 'u', 'a', 3), W('unicorn', '🦄', 'u', 'n', 3),
  W('up', '⬆️', 'u', 'p', 1, 'up'), W('under', '⬇️', 'u', 'r', 2),
  W('van', '🚐', 'v', 'n', 1, 'an'), W('vet', '🧑‍⚕️', 'v', 't', 1, 'et'),
  W('violin', '🎻', 'v', 'n', 3), W('volcano', '🌋', 'v', 'o', 3),
  W('web', '🕸️', 'w', 'b', 1), W('wig', '👱', 'w', 'g', 1, 'ig'),
  W('whale', '🐳', 'w', 'e', 1), W('window', '🪟', 'w', 'w', 2),
  W('watch', '⌚', 'w', 'ch', 1), W('wagon', '🛒', 'w', 'n', 2),
  W('box', '📦', 'b', 'x', 1, 'ox'), W('fix', '🔧', 'f', 'x', 1),
  W('six', '6️⃣', 's', 'x', 1), W('mix', '🥣', 'm', 'x', 1),
  W('yarn', '🧶', 'y', 'n', 1), W('yacht', '🛥️', 'y', 't', 1),
  W('yo-yo', '🪀', 'y', 'o', 2), W('yogurt', '🥣', 'y', 't', 2),
  W('zip', '🤐', 'z', 'p', 1), W('zebra', '🦓', 'z', 'a', 2),
  W('zoo', '🦁', 'z', 'o', 1), W('zigzag', '⚡', 'z', 'g', 2),

  /* ------------------------- more short-vowel words ------------------------- */
  W('bag', '👜', 'b', 'g', 1, 'ag'), W('bed', '🛏️', 'b', 'd', 1, 'ed'),
  W('bin', '🗑️', 'b', 'n', 1, 'in'), W('bun', '🍞', 'b', 'n', 1, 'un'),
  W('cap', '🧢', 'c', 'p', 1, 'ap'), W('can', '🥫', 'c', 'n', 1, 'an'),
  W('cot', '🛏️', 'c', 't', 1, 'ot'), W('cut', '✂️', 'c', 't', 1, 'ut'),
  W('dig', '⛏️', 'd', 'g', 1, 'ig'), W('dot', '🔴', 'd', 't', 1, 'ot'),
  W('fin', '🐟', 'f', 'n', 1, 'in'), W('gum', '🍬', 'g', 'm', 1, 'um'),
  W('hen', '🐔', 'h', 'n', 1, 'en'), W('hop', '🐇', 'h', 'p', 1, 'op'),
  W('hug', '🤗', 'h', 'g', 1, 'ug'), W('hut', '🛖', 'h', 't', 1, 'ut'),
  W('jar', '🫙', 'j', 'r', 1), W('log', '🪵', 'l', 'g', 1, 'og'),
  W('mat', '🧘', 'm', 't', 1, 'at'), W('mop', '🧹', 'm', 'p', 1, 'op'),
  W('nap', '😴', 'n', 'p', 1, 'ap'), W('pin', '📌', 'p', 'n', 1, 'in'),
  W('pup', '🐶', 'p', 'p', 1, 'up'), W('red', '🔴', 'r', 'd', 1, 'ed'),
  W('run', '🏃', 'r', 'n', 1, 'un'), W('sad', '😢', 's', 'd', 1, 'ad'),
  W('sit', '🪑', 's', 't', 1, 'it'), W('sun hat', '👒', 's', 't', 2),
  W('tap', '🚰', 't', 'p', 1, 'ap'), W('tin', '🥫', 't', 'n', 1, 'in'),
  W('wet', '💦', 'w', 't', 1, 'et'), W('win', '🏆', 'w', 'n', 1, 'in'),
  W('sled', '🛷', 's', 'd', 1, 'ed'), W('kit', '🧰', 'k', 't', 1, 'it'),
  W('pit', '🕳️', 'p', 't', 1, 'it'), W('cub', '🐻', 'c', 'b', 1, 'ub'),
  W('tub', '🛁', 't', 'b', 1, 'ub'), W('rub', '🤲', 'r', 'b', 1, 'ub'),
  W('ham', '🍖', 'h', 'm', 1, 'am'), W('ram', '🐏', 'r', 'm', 1, 'am'),
  W('peg', '🪝', 'p', 'g', 1, 'eg'), W('ox', '🐂', 'o', 'x', 1, 'ox'),
  W('flag', '🚩', 'f', 'g', 1, 'ag'), W('tag', '🏷️', 't', 'g', 1, 'ag'),
  W('hum', '🎵', 'h', 'm', 1, 'um'), W('mad', '😠', 'm', 'd', 1, 'ad'),
  W('pad', '📝', 'p', 'd', 1, 'ad'), W('brush', '🪥', 'b', 'sh', 1),
  W('scarf', '🧣', 's', 'f', 1), W('wolf', '🐺', 'w', 'f', 1),
  W('beach', '🏖️', 'b', 'ch', 1), W('plant', '🪴', 'p', 't', 1, 'ant'),
  W('giant', '🧌', 'j', 't', 2, 'ant'),

  /* ------------------------- everyday and two-syllable ------------------------- */
  W('rabbit', '🐰', 'r', 't', 2), W('pumpkin', '🎃', 'p', 'n', 2),
  W('basket', '🧺', 'b', 't', 2), W('button', '🔘', 'b', 'n', 2),
  W('camera', '📷', 'c', 'a', 3), W('computer', '💻', 'c', 'r', 3),
  W('telephone', '☎️', 't', 'e', 3), W('banana bread', '🍞', 'b', 'd', 4),
  W('butterfly', '🦋', 'b', 'y', 3), W('crocodile', '🐊', 'c', 'e', 3),
  W('kangaroo', '🦘', 'k', 'o', 3), W('helicopter', '🚁', 'h', 'r', 4),
  W('watermelon', '🍉', 'w', 'n', 4), W('strawberry', '🍓', 's', 'y', 3),
  W('pineapple', '🍍', 'p', 'e', 3), W('caterpillar', '🐛', 'c', 'r', 4),
  W('penguin', '🐧', 'p', 'n', 2), W('tractor', '🚜', 't', 'r', 2),
  W('candy', '🍬', 'c', 'y', 2), W('cookie', '🍪', 'c', 'e', 2),
  W('muffin', '🧁', 'm', 'n', 2), W('picnic', '🧺', 'p', 'k', 2),
  W('rainbow fish', '🐠', 'r', 'sh', 3), W('sandwich', '🥪', 's', 'ch', 2),
  W('scissors', '✂️', 's', 's', 2), W('teacher', '🧑‍🏫', 't', 'r', 2),
  W('tomato', '🍅', 't', 'o', 3), W('window box', '🪟', 'w', 'x', 3)
];

/* Indexes, built once. Every literacy maker reaches for one of these rather
   than scanning two hundred words on every question. */
export const PK_BY_START = {};
export const PK_BY_END = {};
export const PK_BY_RHYME = {};
export const PK_BY_SYL = {};
for (const w of PK_WORDS) {
  (PK_BY_START[w.start] ??= []).push(w);
  (PK_BY_END[w.end] ??= []).push(w);
  if (w.rhyme) (PK_BY_RHYME[w.rhyme] ??= []).push(w);
  (PK_BY_SYL[w.syl] ??= []).push(w);
}

/** Words that do not start with the given sound — the distractors. */
export const notStarting = sound => PK_WORDS.filter(w => w.start !== sound);
/** Words that do not end with the given sound. */
export const notEnding = sound => PK_WORDS.filter(w => w.end !== sound);
