/* Pre-K themes: sixty-two worlds, each with its own pictures.

   A four-year-old cannot read the instruction, so the picture *is* the
   worksheet. That is also where the variety has to come from: a counting sheet
   set in the Zoo counts lions and elephants, and the same counting sheet set
   in the Bakery counts croissants and cupcakes. Same skill, same age, two
   sheets a child would never mistake for each other.

   The pictures are emoji. That is a decision worth stating: they are real
   colour pictures, they render on every device and every printer without a
   single asset to ship or a licence to buy, and they scale to any size because
   they are text. Where a theme has no emoji for one of its props the prop is
   left out rather than swapped for something that does not look like it.

   Each theme carries:
     name    what a teacher reads on the card
     scene   one picture that stands for the whole theme
     props   [word, picture] pairs — the things a sheet on this theme shows
     tint    a colour for the page furniture, so the sheet looks themed
*/

const T = (id, name, scene, tint, props) => ({ id, name, scene, tint, props });

export const PK_THEMES = [
  T('airport', 'Airport', '✈️', '#4a90d9', [
    ['airplanes', '✈️'], ['suitcases', '🧳'], ['pilots', '🧑‍✈️'], ['tickets', '🎫'], ['helicopters', '🚁']]),
  T('apples', 'Apples', '🍎', '#d64545', [
    ['apples', '🍎'], ['green apples', '🍏'], ['baskets', '🧺'], ['worms', '🐛'], ['trees', '🌳']]),
  T('arctic', 'Arctic', '🐧', '#4aa3d9', [
    ['penguins', '🐧'], ['polar bears', '🐻‍❄️'], ['seals', '🦭'], ['snowflakes', '❄️'], ['icebergs', '🧊']]),
  T('autumn', 'Autumn', '🍂', '#c97a2b', [
    ['leaves', '🍂'], ['acorns', '🌰'], ['pumpkins', '🎃'], ['squirrels', '🐿️'], ['mushrooms', '🍄']]),
  T('bakery', 'Bakery', '🥐', '#c98a3b', [
    ['croissants', '🥐'], ['cupcakes', '🧁'], ['cookies', '🍪'], ['bread', '🍞'], ['pies', '🥧']]),
  T('bathtime', 'Bath Time', '🛁', '#4ab8d9', [
    ['bathtubs', '🛁'], ['rubber ducks', '🦆'], ['soap', '🧼'], ['towels', '🧻'], ['sponges', '🧽']]),
  T('beach', 'Beach Summer', '🏖️', '#e0b040', [
    ['beach umbrellas', '🏖️'], ['shells', '🐚'], ['sunglasses', '🕶️'], ['ice creams', '🍦'], ['sandcastles', '🏰']]),
  T('bears', 'Bears', '🐻', '#a5713a', [
    ['bears', '🐻'], ['teddy bears', '🧸'], ['honey pots', '🍯'], ['berries', '🫐'], ['caves', '🏔️']]),
  T('bedtime', 'Bedtime', '🌙', '#5b5bd6', [
    ['moons', '🌙'], ['beds', '🛏️'], ['books', '📚'], ['stars', '⭐'], ['teddy bears', '🧸']]),
  T('bees', 'Bees', '🐝', '#e0b040', [
    ['bees', '🐝'], ['honey jars', '🍯'], ['flowers', '🌼'], ['hives', '🏠'], ['blossom', '🌸']]),
  T('birds', 'Birds', '🐦', '#4aa3d9', [
    ['birds', '🐦'], ['eggs', '🥚'], ['nests', '🪺'], ['feathers', '🪶'], ['chicks', '🐤']]),
  T('birthday', 'Birthday Party', '🎂', '#d94a8c', [
    ['cakes', '🎂'], ['balloons', '🎈'], ['presents', '🎁'], ['party hats', '🎉'], ['candles', '🕯️']]),
  T('boats', 'Boats & Harbor', '⛵', '#3a7fb5', [
    ['sailboats', '⛵'], ['anchors', '⚓'], ['lighthouses', '🗼'], ['ships', '🚢'], ['fish', '🐟']]),
  T('bugs', 'Bugs', '🐛', '#6aa84f', [
    ['caterpillars', '🐛'], ['ladybugs', '🐞'], ['ants', '🐜'], ['snails', '🐌'], ['beetles', '🪲']]),
  T('butterflies', 'Butterflies', '🦋', '#8c5bd6', [
    ['butterflies', '🦋'], ['flowers', '🌸'], ['leaves', '🍃'], ['caterpillars', '🐛'], ['blossom', '🌼']]),
  T('camping', 'Camping', '⛺', '#5a8a4a', [
    ['tents', '⛺'], ['campfires', '🔥'], ['backpacks', '🎒'], ['lanterns', '🏮'], ['trees', '🌲']]),
  T('cars', 'Cars & Roads', '🚗', '#d64545', [
    ['cars', '🚗'], ['buses', '🚌'], ['trucks', '🚚'], ['traffic lights', '🚦'], ['taxis', '🚕']]),
  T('circus', 'Circus', '🎪', '#d94a8c', [
    ['big tops', '🎪'], ['clowns', '🤡'], ['balloons', '🎈'], ['drums', '🥁'], ['juggling balls', '🤹']]),
  T('city', 'City', '🏙️', '#6b7a8f', [
    ['buildings', '🏢'], ['bridges', '🌉'], ['taxis', '🚕'], ['benches', '🪑'], ['street lights', '🚥']]),
  T('clothes', 'Clothes', '👕', '#4a90d9', [
    ['shirts', '👕'], ['shoes', '👟'], ['socks', '🧦'], ['hats', '🧢'], ['coats', '🧥']]),
  T('construction', 'Construction Site', '🚧', '#e0a040', [
    ['diggers', '🚜'], ['dump trucks', '🚚'], ['cranes', '🏗️'], ['helmets', '⛑️'], ['bricks', '🧱']]),
  T('desert', 'Desert', '🌵', '#c9a03b', [
    ['cacti', '🌵'], ['camels', '🐪'], ['lizards', '🦎'], ['scorpions', '🦂'], ['suns', '☀️']]),
  T('dinosaurs', 'Dinosaurs', '🦕', '#5a8a4a', [
    ['dinosaurs', '🦕'], ['t-rexes', '🦖'], ['eggs', '🥚'], ['volcanoes', '🌋'], ['bones', '🦴']]),
  T('doctor', "Doctor's Office", '🩺', '#4ab8d9', [
    ['stethoscopes', '🩺'], ['bandages', '🩹'], ['thermometers', '🌡️'], ['medicines', '💊'], ['teddy bears', '🧸']]),
  T('castle', 'Fairy-Tale Castle', '🏰', '#8c5bd6', [
    ['castles', '🏰'], ['crowns', '👑'], ['princesses', '👸'], ['knights', '🤴'], ['wands', '🪄']]),
  T('farm', 'Farm', '🚜', '#6aa84f', [
    ['cows', '🐄'], ['pigs', '🐖'], ['sheep', '🐑'], ['hens', '🐔'], ['tractors', '🚜']]),
  T('firestation', 'Fire Station', '🚒', '#d64545', [
    ['fire engines', '🚒'], ['helmets', '⛑️'], ['ladders', '🪜'], ['boots', '🥾'], ['fires', '🔥']]),
  T('forest', 'Forest', '🌲', '#4a7a3a', [
    ['trees', '🌲'], ['owls', '🦉'], ['deer', '🦌'], ['foxes', '🦊'], ['mushrooms', '🍄']]),
  T('monsters', 'Friendly Monsters', '👾', '#8c5bd6', [
    ['monsters', '👾'], ['ghosts', '👻'], ['aliens', '👽'], ['eyes', '👁️'], ['robots', '🤖']]),
  T('fruit', 'Fruit', '🍓', '#d64545', [
    ['strawberries', '🍓'], ['bananas', '🍌'], ['oranges', '🍊'], ['pears', '🍐'], ['cherries', '🍒']]),
  T('garden', 'Garden', '🌻', '#6aa84f', [
    ['sunflowers', '🌻'], ['watering cans', '🪣'], ['carrots', '🥕'], ['seeds', '🌱'], ['worms', '🐛']]),
  T('icecream', 'Ice Cream Parlor', '🍦', '#d94a8c', [
    ['ice creams', '🍦'], ['cones', '🍨'], ['popsicles', '🍡'], ['cherries', '🍒'], ['cupcakes', '🧁']]),
  T('jungle', 'Jungle', '🐒', '#4a7a3a', [
    ['monkeys', '🐒'], ['tigers', '🐯'], ['parrots', '🦜'], ['snakes', '🐍'], ['leaves', '🌿']]),
  T('kitchen', 'Kitchen', '🍳', '#c98a3b', [
    ['pans', '🍳'], ['spoons', '🥄'], ['plates', '🍽️'], ['cups', '🥤'], ['pots', '🫕']]),
  T('knights', 'Knights & Dragons', '🐉', '#7a5ad6', [
    ['dragons', '🐉'], ['swords', '⚔️'], ['shields', '🛡️'], ['castles', '🏰'], ['horses', '🐴']]),
  T('lantern', 'Lantern Festival', '🏮', '#d64545', [
    ['lanterns', '🏮'], ['dragons', '🐉'], ['kites', '🪁'], ['drums', '🥁'], ['moons', '🌕']]),
  T('mountains', 'Mountains', '⛰️', '#6b7a8f', [
    ['mountains', '⛰️'], ['eagles', '🦅'], ['goats', '🐐'], ['flags', '🚩'], ['snow peaks', '🏔️']]),
  T('musicband', 'Music Band', '🎸', '#d94a8c', [
    ['guitars', '🎸'], ['drums', '🥁'], ['trumpets', '🎺'], ['music notes', '🎵'], ['microphones', '🎤']]),
  T('ocean', 'Ocean', '🐠', '#3a7fb5', [
    ['fish', '🐠'], ['shells', '🐚'], ['starfish', '⭐'], ['crabs', '🦀'], ['whales', '🐳']]),
  T('space', 'Outer Space', '🚀', '#5b5bd6', [
    ['rockets', '🚀'], ['planets', '🪐'], ['stars', '⭐'], ['astronauts', '🧑‍🚀'], ['moons', '🌕']]),
  T('owls', 'Owls & Night', '🦉', '#5b5bd6', [
    ['owls', '🦉'], ['moons', '🌙'], ['stars', '⭐'], ['bats', '🦇'], ['trees', '🌳']]),
  T('pets', 'Pets', '🐶', '#c9863b', [
    ['puppies', '🐶'], ['kittens', '🐱'], ['bunnies', '🐰'], ['goldfish', '🐟'], ['hamsters', '🐹']]),
  T('picnic', 'Picnic', '🧺', '#6aa84f', [
    ['baskets', '🧺'], ['sandwiches', '🥪'], ['apples', '🍎'], ['ants', '🐜'], ['juice', '🧃']]),
  T('pirates', 'Pirates', '🏴‍☠️', '#6b5a4a', [
    ['pirate flags', '🏴‍☠️'], ['treasure chests', '🧰'], ['coins', '🪙'], ['parrots', '🦜'], ['maps', '🗺️']]),
  T('pizza', 'Pizza Shop', '🍕', '#d64545', [
    ['pizzas', '🍕'], ['mushrooms', '🍄'], ['tomatoes', '🍅'], ['cheese', '🧀'], ['ovens', '🔥']]),
  T('pond', 'Pond', '🦆', '#4aa3d9', [
    ['ducks', '🦆'], ['frogs', '🐸'], ['lily pads', '🍃'], ['dragonflies', '🦗'], ['fish', '🐟']]),
  T('postoffice', 'Post Office', '📮', '#d64545', [
    ['postboxes', '📮'], ['letters', '✉️'], ['parcels', '📦'], ['stamps', '🏷️'], ['pens', '🖊️']]),
  T('pumpkins', 'Pumpkins', '🎃', '#c97a2b', [
    ['pumpkins', '🎃'], ['hay bales', '🌾'], ['crows', '🐦‍⬛'], ['leaves', '🍂'], ['baskets', '🧺']]),
  T('rainbow', 'Rainbow', '🌈', '#8c5bd6', [
    ['rainbows', '🌈'], ['crayons', '🖍️'], ['clouds', '☁️'], ['paint pots', '🎨'], ['gems', '💎']]),
  T('rainyday', 'Rainy Day', '☔', '#4a90d9', [
    ['umbrellas', '☔'], ['rain boots', '🥾'], ['clouds', '🌧️'], ['puddles', '💧'], ['raincoats', '🧥']]),
  T('restaurant', 'Restaurant', '🍽️', '#c98a3b', [
    ['plates', '🍽️'], ['bowls', '🍜'], ['chefs', '🧑‍🍳'], ['menus', '📋'], ['teapots', '🫖']]),
  T('robots', 'Robots', '🤖', '#6b7a8f', [
    ['robots', '🤖'], ['batteries', '🔋'], ['bolts', '🔩'], ['gears', '⚙️'], ['lightbulbs', '💡']]),
  T('schoolsupplies', 'School Supplies', '✏️', '#e0a040', [
    ['pencils', '✏️'], ['crayons', '🖍️'], ['scissors', '✂️'], ['backpacks', '🎒'], ['rulers', '📏']]),
  T('sports', 'Sports', '⚽', '#4a90d9', [
    ['footballs', '⚽'], ['basketballs', '🏀'], ['medals', '🏅'], ['trophies', '🏆'], ['trainers', '👟']]),
  T('spring', 'Spring', '🌷', '#6aa84f', [
    ['tulips', '🌷'], ['butterflies', '🦋'], ['chicks', '🐤'], ['kites', '🪁'], ['blossom', '🌸']]),
  T('supermarket', 'Supermarket', '🛒', '#4a90d9', [
    ['trolleys', '🛒'], ['bags', '🛍️'], ['cans', '🥫'], ['bottles', '🍼'], ['boxes', '📦']]),
  T('toybox', 'Toy Box', '🧸', '#d94a8c', [
    ['teddy bears', '🧸'], ['blocks', '🧱'], ['toy cars', '🚗'], ['balls', '⚽'], ['puzzles', '🧩']]),
  T('trains', 'Trains', '🚂', '#6b5a4a', [
    ['trains', '🚂'], ['wagons', '🚃'], ['tickets', '🎫'], ['stations', '🚉'], ['trams', '🚊']]),
  T('unicorns', 'Unicorns', '🦄', '#d94a8c', [
    ['unicorns', '🦄'], ['rainbows', '🌈'], ['stars', '⭐'], ['hearts', '💖'], ['clouds', '☁️']]),
  T('vegetables', 'Vegetables', '🥕', '#6aa84f', [
    ['carrots', '🥕'], ['corn', '🌽'], ['tomatoes', '🍅'], ['broccoli', '🥦'], ['peppers', '🫑']]),
  T('winter', 'Winter', '⛄', '#4aa3d9', [
    ['snowmen', '⛄'], ['snowflakes', '❄️'], ['mittens', '🧤'], ['scarves', '🧣'], ['sledges', '🛷']]),
  T('zoo', 'Zoo', '🦁', '#e0a040', [
    ['lions', '🦁'], ['elephants', '🐘'], ['giraffes', '🦒'], ['zebras', '🦓'], ['monkeys', '🐵']])
];

export const PK_THEME_MAP = Object.fromEntries(PK_THEMES.map(t => [t.id, t]));
