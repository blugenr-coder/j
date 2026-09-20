/* Language drills: one form, one answer, twenty times.

   A language teacher's most-printed sheet is a conjugation table with the
   endings rubbed out, or twenty nouns waiting for their article. The library
   had broad "Spanish" worksheets and nothing that narrow.

   The shape here is different from the maths drills and from the English ones.
   Regular forms are *derived*: the generator takes a stem and the ending for
   that person, and tools/check-lang.mjs derives them again from the same rules
   without looking at the generator, which is a real second opinion on every
   regular verb in the file. Irregular forms are bank data — they cannot be
   derived, that is what makes them irregular — so the checker holds them to
   what can be checked: six persons, no blanks, no duplicates that should not
   be duplicates, and every infinitive ending in one of the language's own
   endings.

   Everything in these banks is standard textbook material. Where a form is
   contested or regional it is left out rather than guessed at.            */

import { int, pick, sample, choice, blankQ } from './gen-core.js';

const PERSONS_ES = ['yo', 'tú', 'él/ella', 'nosotros', 'vosotros', 'ellos/ellas'];
const PERSONS_FR = ['je', 'tu', 'il/elle', 'nous', 'vous', 'ils/elles'];
const PERSONS_DE = ['ich', 'du', 'er/sie/es', 'wir', 'ihr', 'sie/Sie'];
const PERSONS_IT = ['io', 'tu', 'lui/lei', 'noi', 'voi', 'loro'];

/* ------------------------------- Spanish ------------------------------- */
export const SPANISH = {
  id: 'spanish', name: 'Spanish', persons: PERSONS_ES,
  /* Infinitive ending → the six present-tense endings, in person order. */
  groups: {
    ar: ['o', 'as', 'a', 'amos', 'áis', 'an'],
    er: ['o', 'es', 'e', 'emos', 'éis', 'en'],
    ir: ['o', 'es', 'e', 'imos', 'ís', 'en']
  },
  regular: {
    ar: [['hablar', 'to speak'], ['cantar', 'to sing'], ['bailar', 'to dance'],
         ['estudiar', 'to study'], ['trabajar', 'to work'], ['caminar', 'to walk'],
         ['escuchar', 'to listen'], ['mirar', 'to look at'], ['comprar', 'to buy'],
         ['nadar', 'to swim'], ['viajar', 'to travel'], ['ayudar', 'to help'],
         ['cocinar', 'to cook'], ['preguntar', 'to ask'], ['contestar', 'to answer']],
    er: [['comer', 'to eat'], ['beber', 'to drink'], ['aprender', 'to learn'],
         ['correr', 'to run'], ['vender', 'to sell'], ['comprender', 'to understand'],
         ['romper', 'to break'], ['deber', 'to owe or must']],
    ir: [['vivir', 'to live'], ['escribir', 'to write'], ['abrir', 'to open'],
         ['subir', 'to go up'], ['recibir', 'to receive'], ['decidir', 'to decide'],
         ['permitir', 'to allow'], ['partir', 'to leave or divide']]
  },
  irregular: {
    ser: ['soy', 'eres', 'es', 'somos', 'sois', 'son'],
    estar: ['estoy', 'estás', 'está', 'estamos', 'estáis', 'están'],
    ir: ['voy', 'vas', 'va', 'vamos', 'vais', 'van'],
    tener: ['tengo', 'tienes', 'tiene', 'tenemos', 'tenéis', 'tienen'],
    hacer: ['hago', 'haces', 'hace', 'hacemos', 'hacéis', 'hacen'],
    poder: ['puedo', 'puedes', 'puede', 'podemos', 'podéis', 'pueden'],
    querer: ['quiero', 'quieres', 'quiere', 'queremos', 'queréis', 'quieren'],
    venir: ['vengo', 'vienes', 'viene', 'venimos', 'venís', 'vienen'],
    decir: ['digo', 'dices', 'dice', 'decimos', 'decís', 'dicen'],
    ver: ['veo', 'ves', 've', 'vemos', 'veis', 'ven'],
    dar: ['doy', 'das', 'da', 'damos', 'dais', 'dan'],
    saber: ['sé', 'sabes', 'sabe', 'sabemos', 'sabéis', 'saben']
  },
  /* noun, gender, English, plural */
  nouns: [
    ['libro', 'm', 'book', 'libros'], ['casa', 'f', 'house', 'casas'],
    ['coche', 'm', 'car', 'coches'], ['mesa', 'f', 'table', 'mesas'],
    ['perro', 'm', 'dog', 'perros'], ['silla', 'f', 'chair', 'sillas'],
    ['gato', 'm', 'cat', 'gatos'], ['ventana', 'f', 'window', 'ventanas'],
    ['árbol', 'm', 'tree', 'árboles'], ['puerta', 'f', 'door', 'puertas'],
    ['niño', 'm', 'boy', 'niños'], ['niña', 'f', 'girl', 'niñas'],
    ['hombre', 'm', 'man', 'hombres'], ['mujer', 'f', 'woman', 'mujeres'],
    ['jardín', 'm', 'garden', 'jardines'], ['ciudad', 'f', 'city', 'ciudades'],
    ['papel', 'm', 'paper', 'papeles'], ['flor', 'f', 'flower', 'flores'],
    ['profesor', 'm', 'teacher', 'profesores'], ['escuela', 'f', 'school', 'escuelas']
  ],
  articles: { definite: { m: 'el', f: 'la', mp: 'los', fp: 'las' },
              indefinite: { m: 'un', f: 'una', mp: 'unos', fp: 'unas' } },
  /* Adjectives that change for gender, given in the masculine singular. */
  adjectives: [['rojo', 'red'], ['alto', 'tall'], ['bajo', 'short'], ['pequeño', 'small'],
               ['nuevo', 'new'], ['viejo', 'old'], ['bonito', 'pretty'], ['delgado', 'thin'],
               ['blanco', 'white'], ['negro', 'black'], ['largo', 'long'], ['gordo', 'fat']],
  /* Adjectives with one form for both genders. */
  neutral: [['grande', 'big'], ['verde', 'green'], ['inteligente', 'clever'],
            ['fácil', 'easy'], ['difícil', 'difficult'], ['triste', 'sad'], ['feliz', 'happy']],
  numbers: { 1: 'uno', 2: 'dos', 3: 'tres', 4: 'cuatro', 5: 'cinco', 6: 'seis', 7: 'siete',
             8: 'ocho', 9: 'nueve', 10: 'diez', 11: 'once', 12: 'doce', 13: 'trece',
             14: 'catorce', 15: 'quince', 16: 'dieciséis', 17: 'diecisiete', 18: 'dieciocho',
             19: 'diecinueve', 20: 'veinte', 30: 'treinta', 40: 'cuarenta', 50: 'cincuenta',
             60: 'sesenta', 70: 'setenta', 80: 'ochenta', 90: 'noventa', 100: 'cien' },
  days: [['lunes', 'Monday'], ['martes', 'Tuesday'], ['miércoles', 'Wednesday'],
         ['jueves', 'Thursday'], ['viernes', 'Friday'], ['sábado', 'Saturday'], ['domingo', 'Sunday']],
  months: [['enero', 'January'], ['febrero', 'February'], ['marzo', 'March'], ['abril', 'April'],
           ['mayo', 'May'], ['junio', 'June'], ['julio', 'July'], ['agosto', 'August'],
           ['septiembre', 'September'], ['octubre', 'October'], ['noviembre', 'November'],
           ['diciembre', 'December']],
  phrases: [['¿Cómo te llamas?', 'What is your name?'], ['Me llamo…', 'My name is…'],
            ['¿Cómo estás?', 'How are you?'], ['Estoy bien', 'I am well'],
            ['Buenos días', 'Good morning'], ['Buenas tardes', 'Good afternoon'],
            ['Buenas noches', 'Good evening'], ['Por favor', 'Please'],
            ['Gracias', 'Thank you'], ['De nada', 'You are welcome'],
            ['Lo siento', 'I am sorry'], ['¿Dónde está…?', 'Where is…?'],
            ['¿Cuánto cuesta?', 'How much does it cost?'], ['No entiendo', 'I do not understand'],
            ['¿Hablas inglés?', 'Do you speak English?'], ['Hasta luego', 'See you later']]
};

/* -------------------------------- French -------------------------------- */
export const FRENCH = {
  id: 'french', name: 'French', persons: PERSONS_FR,
  groups: {
    er: ['e', 'es', 'e', 'ons', 'ez', 'ent'],
    ir: ['is', 'is', 'it', 'issons', 'issez', 'issent'],
    re: ['s', 's', '', 'ons', 'ez', 'ent']
  },
  regular: {
    er: [['parler', 'to speak'], ['chanter', 'to sing'], ['danser', 'to dance'],
         ['regarder', 'to watch'], ['travailler', 'to work'], ['écouter', 'to listen'],
         ['aimer', 'to like'], ['jouer', 'to play'], ['manger', 'to eat'],
         ['habiter', 'to live'], ['donner', 'to give'], ['porter', 'to wear'],
         ['trouver', 'to find'], ['chercher', 'to look for'], ['marcher', 'to walk']],
    ir: [['finir', 'to finish'], ['choisir', 'to choose'], ['grandir', 'to grow'],
         ['réussir', 'to succeed'], ['remplir', 'to fill'], ['punir', 'to punish'],
         ['bâtir', 'to build'], ['obéir', 'to obey']],
    re: [['vendre', 'to sell'], ['attendre', 'to wait'], ['répondre', 'to answer'],
         ['entendre', 'to hear'], ['perdre', 'to lose'], ['descendre', 'to go down'],
         ['rendre', 'to give back']]
  },
  irregular: {
    être: ['suis', 'es', 'est', 'sommes', 'êtes', 'sont'],
    avoir: ['ai', 'as', 'a', 'avons', 'avez', 'ont'],
    aller: ['vais', 'vas', 'va', 'allons', 'allez', 'vont'],
    faire: ['fais', 'fais', 'fait', 'faisons', 'faites', 'font'],
    pouvoir: ['peux', 'peux', 'peut', 'pouvons', 'pouvez', 'peuvent'],
    vouloir: ['veux', 'veux', 'veut', 'voulons', 'voulez', 'veulent'],
    venir: ['viens', 'viens', 'vient', 'venons', 'venez', 'viennent'],
    prendre: ['prends', 'prends', 'prend', 'prenons', 'prenez', 'prennent'],
    dire: ['dis', 'dis', 'dit', 'disons', 'dites', 'disent'],
    voir: ['vois', 'vois', 'voit', 'voyons', 'voyez', 'voient']
  },
  /* Nouns beginning with a vowel are left out on purpose: they take l' rather
     than le or la, and a table of two articles would teach the wrong thing. */
  nouns: [
    ['livre', 'm', 'book', 'livres'], ['maison', 'f', 'house', 'maisons'],
    ['voiture', 'f', 'car', 'voitures'], ['table', 'f', 'table', 'tables'],
    ['chien', 'm', 'dog', 'chiens'], ['chaise', 'f', 'chair', 'chaises'],
    ['chat', 'm', 'cat', 'chats'], ['fenêtre', 'f', 'window', 'fenêtres'],
    ['porte', 'f', 'door', 'portes'], ['stylo', 'm', 'pen', 'stylos'],
    ['garçon', 'm', 'boy', 'garçons'], ['fille', 'f', 'girl', 'filles'],
    ['femme', 'f', 'woman', 'femmes'], ['bureau', 'm', 'desk', 'bureaux'],
    ['jardin', 'm', 'garden', 'jardins'], ['ville', 'f', 'town', 'villes'],
    ['papier', 'm', 'paper', 'papiers'], ['fleur', 'f', 'flower', 'fleurs'],
    ['professeur', 'm', 'teacher', 'professeurs'], ['classe', 'f', 'class', 'classes']
  ],
  articles: { definite: { m: 'le', f: 'la', mp: 'les', fp: 'les' },
              indefinite: { m: 'un', f: 'une', mp: 'des', fp: 'des' } },
  adjectives: [['petit', 'small'], ['grand', 'big'], ['vert', 'green'], ['noir', 'black'],
               ['froid', 'cold'], ['chaud', 'hot'], ['lourd', 'heavy'], ['content', 'pleased'],
               ['fort', 'strong'], ['court', 'short']],
  neutral: [['rouge', 'red'], ['jaune', 'yellow'], ['facile', 'easy'], ['difficile', 'difficult'],
            ['jeune', 'young'], ['calme', 'calm'], ['triste', 'sad']],
  numbers: { 1: 'un', 2: 'deux', 3: 'trois', 4: 'quatre', 5: 'cinq', 6: 'six', 7: 'sept',
             8: 'huit', 9: 'neuf', 10: 'dix', 11: 'onze', 12: 'douze', 13: 'treize',
             14: 'quatorze', 15: 'quinze', 16: 'seize', 17: 'dix-sept', 18: 'dix-huit',
             19: 'dix-neuf', 20: 'vingt', 30: 'trente', 40: 'quarante', 50: 'cinquante',
             60: 'soixante', 70: 'soixante-dix', 80: 'quatre-vingts', 90: 'quatre-vingt-dix',
             100: 'cent' },
  days: [['lundi', 'Monday'], ['mardi', 'Tuesday'], ['mercredi', 'Wednesday'],
         ['jeudi', 'Thursday'], ['vendredi', 'Friday'], ['samedi', 'Saturday'], ['dimanche', 'Sunday']],
  months: [['janvier', 'January'], ['février', 'February'], ['mars', 'March'], ['avril', 'April'],
           ['mai', 'May'], ['juin', 'June'], ['juillet', 'July'], ['août', 'August'],
           ['septembre', 'September'], ['octobre', 'October'], ['novembre', 'November'],
           ['décembre', 'December']],
  phrases: [['Comment tu t\'appelles ?', 'What is your name?'], ['Je m\'appelle…', 'My name is…'],
            ['Comment ça va ?', 'How are you?'], ['Ça va bien', 'I am well'],
            ['Bonjour', 'Good morning'], ['Bonsoir', 'Good evening'],
            ['S\'il vous plaît', 'Please'], ['Merci', 'Thank you'], ['De rien', 'You are welcome'],
            ['Je suis désolé', 'I am sorry'], ['Où est…?', 'Where is…?'],
            ['Combien ça coûte ?', 'How much does it cost?'],
            ['Je ne comprends pas', 'I do not understand'],
            ['Tu parles anglais ?', 'Do you speak English?'], ['À bientôt', 'See you soon']]
};

/* -------------------------------- German -------------------------------- */
export const GERMAN = {
  id: 'german', name: 'German', persons: PERSONS_DE,
  groups: { en: ['e', 'st', 't', 'en', 't', 'en'] },
  regular: {
    en: [['spielen', 'to play'], ['machen', 'to do'], ['lernen', 'to learn'],
         ['wohnen', 'to live'], ['kaufen', 'to buy'], ['hören', 'to hear'],
         ['sagen', 'to say'], ['fragen', 'to ask'], ['kochen', 'to cook'],
         ['lachen', 'to laugh'], ['suchen', 'to look for'], ['brauchen', 'to need'],
         ['holen', 'to fetch'], ['legen', 'to lay'], ['stellen', 'to put']]
  },
  irregular: {
    sein: ['bin', 'bist', 'ist', 'sind', 'seid', 'sind'],
    haben: ['habe', 'hast', 'hat', 'haben', 'habt', 'haben'],
    werden: ['werde', 'wirst', 'wird', 'werden', 'werdet', 'werden'],
    können: ['kann', 'kannst', 'kann', 'können', 'könnt', 'können'],
    müssen: ['muss', 'musst', 'muss', 'müssen', 'müsst', 'müssen'],
    wollen: ['will', 'willst', 'will', 'wollen', 'wollt', 'wollen'],
    fahren: ['fahre', 'fährst', 'fährt', 'fahren', 'fahrt', 'fahren'],
    lesen: ['lese', 'liest', 'liest', 'lesen', 'lest', 'lesen'],
    sprechen: ['spreche', 'sprichst', 'spricht', 'sprechen', 'sprecht', 'sprechen'],
    geben: ['gebe', 'gibst', 'gibt', 'geben', 'gebt', 'geben']
  },
  nouns: [
    ['Buch', 'n', 'book', 'Bücher'], ['Haus', 'n', 'house', 'Häuser'],
    ['Auto', 'n', 'car', 'Autos'], ['Tisch', 'm', 'table', 'Tische'],
    ['Hund', 'm', 'dog', 'Hunde'], ['Stuhl', 'm', 'chair', 'Stühle'],
    ['Katze', 'f', 'cat', 'Katzen'], ['Fenster', 'n', 'window', 'Fenster'],
    ['Baum', 'm', 'tree', 'Bäume'], ['Tür', 'f', 'door', 'Türen'],
    ['Junge', 'm', 'boy', 'Jungen'], ['Mädchen', 'n', 'girl', 'Mädchen'],
    ['Mann', 'm', 'man', 'Männer'], ['Frau', 'f', 'woman', 'Frauen'],
    ['Garten', 'm', 'garden', 'Gärten'], ['Stadt', 'f', 'city', 'Städte'],
    ['Blume', 'f', 'flower', 'Blumen'], ['Schule', 'f', 'school', 'Schulen'],
    ['Lehrer', 'm', 'teacher', 'Lehrer'], ['Zimmer', 'n', 'room', 'Zimmer']
  ],
  articles: { definite: { m: 'der', f: 'die', n: 'das', p: 'die' },
              indefinite: { m: 'ein', f: 'eine', n: 'ein' },
              /* The accusative and dative forms, used only as distractors: a
                 learner choosing between ein and eine is not being tested. */
              others: ['einen', 'einem', 'einer'] },
  numbers: { 1: 'eins', 2: 'zwei', 3: 'drei', 4: 'vier', 5: 'fünf', 6: 'sechs', 7: 'sieben',
             8: 'acht', 9: 'neun', 10: 'zehn', 11: 'elf', 12: 'zwölf', 13: 'dreizehn',
             14: 'vierzehn', 15: 'fünfzehn', 16: 'sechzehn', 17: 'siebzehn', 18: 'achtzehn',
             19: 'neunzehn', 20: 'zwanzig', 30: 'dreißig', 40: 'vierzig', 50: 'fünfzig',
             60: 'sechzig', 70: 'siebzig', 80: 'achtzig', 90: 'neunzig', 100: 'hundert' },
  days: [['Montag', 'Monday'], ['Dienstag', 'Tuesday'], ['Mittwoch', 'Wednesday'],
         ['Donnerstag', 'Thursday'], ['Freitag', 'Friday'], ['Samstag', 'Saturday'],
         ['Sonntag', 'Sunday']],
  months: [['Januar', 'January'], ['Februar', 'February'], ['März', 'March'], ['April', 'April'],
           ['Mai', 'May'], ['Juni', 'June'], ['Juli', 'July'], ['August', 'August'],
           ['September', 'September'], ['Oktober', 'October'], ['November', 'November'],
           ['Dezember', 'December']],
  phrases: [['Wie heißt du?', 'What is your name?'], ['Ich heiße…', 'My name is…'],
            ['Wie geht es dir?', 'How are you?'], ['Mir geht es gut', 'I am well'],
            ['Guten Morgen', 'Good morning'], ['Guten Abend', 'Good evening'],
            ['Bitte', 'Please'], ['Danke', 'Thank you'], ['Gern geschehen', 'You are welcome'],
            ['Es tut mir leid', 'I am sorry'], ['Wo ist…?', 'Where is…?'],
            ['Wie viel kostet das?', 'How much does it cost?'],
            ['Ich verstehe nicht', 'I do not understand'],
            ['Sprichst du Englisch?', 'Do you speak English?'], ['Bis später', 'See you later']]
};

/* -------------------------------- Italian -------------------------------- */
export const ITALIAN = {
  id: 'italian', name: 'Italian', persons: PERSONS_IT,
  groups: {
    are: ['o', 'i', 'a', 'iamo', 'ate', 'ano'],
    ere: ['o', 'i', 'e', 'iamo', 'ete', 'ono'],
    ire: ['o', 'i', 'e', 'iamo', 'ite', 'ono']
  },
  regular: {
    are: [['parlare', 'to speak'], ['cantare', 'to sing'], ['guardare', 'to watch'],
          ['lavorare', 'to work'], ['ascoltare', 'to listen'], ['comprare', 'to buy'],
          ['abitare', 'to live'], ['portare', 'to carry'], ['trovare', 'to find'],
          ['giocare', 'to play']],
    ere: [['credere', 'to believe'], ['vendere', 'to sell'], ['prendere', 'to take'],
          ['scrivere', 'to write'], ['leggere', 'to read'], ['correre', 'to run'],
          ['perdere', 'to lose']],
    ire: [['dormire', 'to sleep'], ['aprire', 'to open'], ['partire', 'to leave'],
          ['sentire', 'to hear'], ['offrire', 'to offer'], ['seguire', 'to follow']]
  },
  irregular: {
    essere: ['sono', 'sei', 'è', 'siamo', 'siete', 'sono'],
    avere: ['ho', 'hai', 'ha', 'abbiamo', 'avete', 'hanno'],
    andare: ['vado', 'vai', 'va', 'andiamo', 'andate', 'vanno'],
    fare: ['faccio', 'fai', 'fa', 'facciamo', 'fate', 'fanno'],
    stare: ['sto', 'stai', 'sta', 'stiamo', 'state', 'stanno'],
    potere: ['posso', 'puoi', 'può', 'possiamo', 'potete', 'possono'],
    volere: ['voglio', 'vuoi', 'vuole', 'vogliamo', 'volete', 'vogliono'],
    venire: ['vengo', 'vieni', 'viene', 'veniamo', 'venite', 'vengono']
  },
  nouns: [
    ['libro', 'm', 'book', 'libri'], ['casa', 'f', 'house', 'case'],
    ['tavolo', 'm', 'table', 'tavoli'], ['sedia', 'f', 'chair', 'sedie'],
    ['cane', 'm', 'dog', 'cani'], ['gatto', 'm', 'cat', 'gatti'],
    ['finestra', 'f', 'window', 'finestre'], ['quaderno', 'm', 'notebook', 'quaderni'],
    ['porta', 'f', 'door', 'porte'], ['ragazzo', 'm', 'boy', 'ragazzi'],
    ['ragazza', 'f', 'girl', 'ragazze'], ['bambino', 'm', 'child', 'bambini'],
    ['donna', 'f', 'woman', 'donne'], ['giardino', 'm', 'garden', 'giardini'],
    ['città', 'f', 'city', 'città'], ['fiore', 'm', 'flower', 'fiori'],
    ['scuola', 'f', 'school', 'scuole'], ['strada', 'f', 'street', 'strade']
  ],
  articles: { definite: { m: 'il', f: 'la', mp: 'i', fp: 'le' },
              indefinite: { m: 'un', f: 'una', mp: 'dei', fp: 'delle' } },
  numbers: { 1: 'uno', 2: 'due', 3: 'tre', 4: 'quattro', 5: 'cinque', 6: 'sei', 7: 'sette',
             8: 'otto', 9: 'nove', 10: 'dieci', 11: 'undici', 12: 'dodici', 13: 'tredici',
             14: 'quattordici', 15: 'quindici', 16: 'sedici', 17: 'diciassette',
             18: 'diciotto', 19: 'diciannove', 20: 'venti', 30: 'trenta', 40: 'quaranta',
             50: 'cinquanta', 60: 'sessanta', 70: 'settanta', 80: 'ottanta', 90: 'novanta',
             100: 'cento' },
  days: [['lunedì', 'Monday'], ['martedì', 'Tuesday'], ['mercoledì', 'Wednesday'],
         ['giovedì', 'Thursday'], ['venerdì', 'Friday'], ['sabato', 'Saturday'],
         ['domenica', 'Sunday']],
  months: [['gennaio', 'January'], ['febbraio', 'February'], ['marzo', 'March'],
           ['aprile', 'April'], ['maggio', 'May'], ['giugno', 'June'], ['luglio', 'July'],
           ['agosto', 'August'], ['settembre', 'September'], ['ottobre', 'October'],
           ['novembre', 'November'], ['dicembre', 'December']],
  phrases: [['Come ti chiami?', 'What is your name?'], ['Mi chiamo…', 'My name is…'],
            ['Come stai?', 'How are you?'], ['Sto bene', 'I am well'],
            ['Buongiorno', 'Good morning'], ['Buonasera', 'Good evening'],
            ['Per favore', 'Please'], ['Grazie', 'Thank you'], ['Prego', 'You are welcome'],
            ['Mi dispiace', 'I am sorry'], ['Dov\'è…?', 'Where is…?'],
            ['Quanto costa?', 'How much does it cost?'], ['Non capisco', 'I do not understand'],
            ['Parli inglese?', 'Do you speak English?'], ['A presto', 'See you soon']]
};

export const LANGUAGES = [SPANISH, FRENCH, GERMAN, ITALIAN];

/* ------------------------------ the makers ------------------------------
   One factory per kind of drill, applied to each language's data. Writing
   them once means a fix to the question reaches four languages, and it means
   the regular forms are built from stem plus ending in exactly one place —
   which is the place tools/check-lang.mjs derives them again, independently,
   to see whether the two agree. */

const GENDER_NAME = { m: 'masculine', f: 'feminine', n: 'neuter' };
const cap = w => `${w[0].toUpperCase()}${w.slice(1)}`;

/** The definite article for a gender, singular or plural. */
const defArt = (cfg, g, plural) => {
  const d = cfg.articles.definite;
  if (!plural) return d[g];
  return d.p ?? (g === 'm' ? d.mp : d.fp);
};

/** Stem and ending of an infinitive, given the language's groups. */
function split(cfg, infinitive) {
  for (const ending of Object.keys(cfg.groups)) {
    if (infinitive.endsWith(ending)) return [infinitive.slice(0, -ending.length), ending];
  }
  return [infinitive, ''];
}

/** Every regular verb in the language, with its group. */
const allRegular = cfg => Object.entries(cfg.regular)
  .flatMap(([group, list]) => list.map(([inf, en]) => ({ inf, en, group })));

/** The present tense of a regular verb, built from stem plus ending. */
function conjugate(cfg, infinitive, group, person) {
  const [stem] = split(cfg, infinitive);
  return stem + cfg.groups[group][person];
}

export function makeVerbs(cfg) {
  const reg = allRegular(cfg);
  const irr = Object.entries(cfg.irregular);
  const groups = Object.keys(cfg.groups);

  return [
    (r) => { const v = pick(r, reg), p = int(r, 0, 5);
      return blankQ(`Write the present tense of “${v.inf}” (${v.en}) for ${cfg.persons[p]}.`,
        conjugate(cfg, v.inf, v.group, p),
        { hint: `Take the -${v.group} off and add the ending for ${cfg.persons[p]}.`,
          explanation: `${split(cfg, v.inf)[0]} + ${cfg.groups[v.group][p] || '(nothing)'} = ${conjugate(cfg, v.inf, v.group, p)}.` }); },

    (r) => { const v = pick(r, reg);
      const forms = cfg.persons.map((_, p) => conjugate(cfg, v.inf, v.group, p));
      return blankQ(`Write the full present tense of “${v.inf}” (${v.en}). Separate the six forms with commas.`,
        forms.join(', '),
        { accept: [forms.join(','), forms.join(' ')],
          hint: `It is a regular -${v.group} verb.`,
          explanation: forms.map((f, i) => `${cfg.persons[i]} ${f}`).join(', ') + '.' }); },

    (r) => { const v = pick(r, reg), p = int(r, 0, 5);
      const right = conjugate(cfg, v.inf, v.group, p);
      const wrong = [0, 1, 2, 3, 4, 5].filter(q => q !== p)
        .map(q => conjugate(cfg, v.inf, v.group, q)).filter(f => f !== right);
      return choice(r, {
        prompt: `Which is the ${cfg.persons[p]} form of “${v.inf}”?`,
        correct: right, distractors: sample(r, wrong, 3),
        hint: `Look at the ending, not the stem.`,
        explanation: `${cfg.persons[p]} ${right}.`
      }); },

    (r) => { const v = pick(r, reg);
      return blankQ(`What is the stem of “${v.inf}”?`, split(cfg, v.inf)[0],
        { hint: `Take off the -${v.group}.`,
          explanation: `${v.inf} − ${v.group} = ${split(cfg, v.inf)[0]}.` }); },

    /* German has one regular group, so there is nothing to tell apart; the
       maker declines rather than offering a choice with one option. */
    (r) => { if (groups.length < 2) return null;
      const v = pick(r, reg);
      return choice(r, {
        prompt: `Which group does “${v.inf}” belong to?`,
        correct: `-${v.group}`, distractors: groups.filter(g => g !== v.group).map(g => `-${g}`),
        hint: 'Look at the last two letters of the infinitive.',
        explanation: `${v.inf} ends in -${v.group}.`
      }); },

    (r) => { const v = pick(r, reg);
      return blankQ(`What does “${v.inf}” mean in English?`, v.en,
        { hint: 'It is an infinitive, so the English starts with "to".',
          explanation: `${v.inf} means ${v.en}.` }); },

    (r) => { const [inf, forms] = pick(r, irr), p = int(r, 0, 5);
      return blankQ(`“${inf}” is irregular. Write its ${cfg.persons[p]} form in the present tense.`,
        forms[p],
        { hint: 'This one does not follow the pattern; it has to be learned.',
          explanation: `${cfg.persons[p]} ${forms[p]}.` }); },

    (r) => { const [inf, forms] = pick(r, irr);
      return blankQ(`Write the full present tense of the irregular verb “${inf}”. Separate the six forms with commas.`,
        forms.join(', '),
        { accept: [forms.join(','), forms.join(' ')],
          hint: 'Say it through from the first person down.',
          explanation: forms.map((f, i) => `${cfg.persons[i]} ${f}`).join(', ') + '.' }); },

    (r) => { const [inf, forms] = pick(r, irr), p = int(r, 0, 5);
      const others = irr.filter(([i]) => i !== inf).map(([, f]) => f[p]);
      return choice(r, {
        prompt: `Which verb does “${forms[p]}” come from?`,
        correct: inf, distractors: sample(r, irr.filter(([i]) => i !== inf).map(([i]) => i), 3),
        hint: 'Irregular forms often keep one letter of their infinitive.',
        explanation: `${forms[p]} is the ${cfg.persons[p]} form of ${inf}.`
      }); },

    (r) => { const v = pick(r, reg);
      const we = cfg.persons[3];
      return blankQ(`Write the ${we} form of “${v.inf}” (${v.en}).`,
        conjugate(cfg, v.inf, v.group, 3),
        { hint: `The ${we} ending for -${v.group} verbs is -${cfg.groups[v.group][3]}.`,
          explanation: `${we} ${conjugate(cfg, v.inf, v.group, 3)}.` }); },

    (r) => { const group = pick(r, groups), p = int(r, 0, 5);
      return blankQ(`What ending does a regular -${group} verb take for ${cfg.persons[p]}?`,
        `-${cfg.groups[group][p]}` === '-' ? 'no ending' : `-${cfg.groups[group][p]}`,
        { accept: [cfg.groups[group][p]],
          hint: 'Say a verb you know in that group and listen to the end of it.',
          explanation: `-${group} verbs take -${cfg.groups[group][p]} for ${cfg.persons[p]}.` }); },

    (r) => { const v = pick(r, reg), p = int(r, 0, 5);
      const right = conjugate(cfg, v.inf, v.group, p);
      const otherGroup = pick(r, groups.filter(g => g !== v.group)) ?? v.group;
      const wrong = [split(cfg, v.inf)[0] + cfg.groups[otherGroup][p], v.inf, right + 's']
        .filter(w => w !== right);
      return choice(r, {
        prompt: `Which is correct? “${cfg.persons[p]} ___” from “${v.inf}”`,
        correct: right, distractors: wrong,
        hint: `It is a -${v.group} verb, so use the -${v.group} endings.`,
        explanation: `${cfg.persons[p]} ${right}.`
      }); }
  ];
}

export function makeArticles(cfg) {
  const nouns = cfg.nouns;
  const hasNeuter = nouns.some(n => n[1] === 'n');

  return [
    (r) => { const [noun, g] = pick(r, nouns);
      return choice(r, {
        prompt: `Which definite article goes with “${noun}”?`,
        correct: defArt(cfg, g, false),
        distractors: [...new Set(Object.values(cfg.articles.definite))]
          .filter(a => a !== defArt(cfg, g, false)),
        hint: `Decide the gender of the noun first.`,
        explanation: `${noun} is ${GENDER_NAME[g]}, so it takes ${defArt(cfg, g, false)}.`
      }); },

    (r) => { const [noun, g] = pick(r, nouns);
      const art = cfg.articles.indefinite[g];
      return choice(r, {
        prompt: `Which indefinite article goes with “${noun}”?`,
        correct: art,
        distractors: [...new Set([...Object.values(cfg.articles.indefinite).filter(a => typeof a === 'string'),
                                  ...(cfg.articles.indefinite.others ?? [])])].filter(a => a !== art),
        hint: 'The article follows the gender of the noun.',
        explanation: `${noun} is ${GENDER_NAME[g]}, so it takes ${art}.`
      }); },

    (r) => { const [noun, g] = pick(r, nouns);
      return choice(r, {
        prompt: `What gender is “${noun}”?`,
        correct: GENDER_NAME[g],
        distractors: (hasNeuter ? ['masculine', 'feminine', 'neuter'] : ['masculine', 'feminine'])
          .filter(x => x !== GENDER_NAME[g]),
        hint: 'The ending of the noun is a clue, though not always a safe one.',
        explanation: `${noun} is ${GENDER_NAME[g]}.`
      }); },

    (r) => { const [noun, , , plural] = pick(r, nouns);
      return blankQ(`Write the plural of “${noun}”.`, plural,
        { hint: 'Look at the last letter before you add anything.',
          explanation: `${noun} → ${plural}.` }); },

    (r) => { const [noun, , , plural] = pick(r, nouns);
      return blankQ(`Write the singular of “${plural}”.`, noun,
        { hint: 'Work backwards from the plural ending.',
          explanation: `${plural} → ${noun}.` }); },

    (r) => { const [noun, g, , plural] = pick(r, nouns);
      return blankQ(`Write “${plural}” with its definite article.`,
        `${defArt(cfg, g, true)} ${plural}`,
        { hint: 'The article goes plural too.',
          explanation: `${defArt(cfg, g, true)} ${plural}.` }); },

    (r) => { const [noun, , en] = pick(r, nouns);
      return blankQ(`What does “${noun}” mean in English?`, en,
        { hint: 'Say it aloud; several of these sound like their English word.',
          explanation: `${noun} means ${en}.` }); },

    (r) => { const [noun, g, en] = pick(r, nouns);
      return blankQ(`Write “the ${en}” in ${cfg.name}.`, `${defArt(cfg, g, false)} ${noun}`,
        { hint: `The noun is ${GENDER_NAME[g]}.`,
          explanation: `the ${en} = ${defArt(cfg, g, false)} ${noun}.` }); },

    (r) => { const [noun, g, en] = pick(r, nouns);
      const right = `${defArt(cfg, g, false)} ${noun}`;
      const wrong = [...new Set(Object.values(cfg.articles.definite))]
        .filter(a => a !== defArt(cfg, g, false)).map(a => `${a} ${noun}`);
      return choice(r, {
        prompt: `Which is correct for “the ${en}”?`,
        correct: right, distractors: wrong,
        hint: 'One article matches the gender; the others do not.',
        explanation: `${right}.`
      }); },

    (r) => { const n = int(r, 3, 5), chosen = sample(r, nouns, n);
      const fem = chosen.filter(x => x[1] === 'f').length;
      return blankQ(`How many of these nouns are feminine: ${chosen.map(x => x[0]).join(', ')}?`,
        fem,
        { hint: 'Take each one and recall its article.',
          explanation: fem === 0 ? 'None of them are feminine.'
            : `${chosen.filter(x => x[1] === 'f').map(x => x[0]).join(', ')} ${fem === 1 ? 'is' : 'are'} feminine.` }); }
  ];
}

export function makeNumbers(cfg) {
  const keys = Object.keys(cfg.numbers).map(Number).sort((a, b) => a - b);
  const tens = keys.filter(k => k >= 20);

  return [
    (r) => { const n = pick(r, keys);
      return blankQ(`Write ${n} in ${cfg.name}.`, cfg.numbers[n],
        { hint: 'Say it aloud first, then spell it.',
          explanation: `${n} = ${cfg.numbers[n]}.` }); },

    (r) => { const n = pick(r, keys);
      return blankQ(`Write “${cfg.numbers[n]}” as a numeral.`, n,
        { hint: 'Count up from a number you are sure of.',
          explanation: `${cfg.numbers[n]} = ${n}.` }); },

    (r) => { const n = pick(r, keys);
      return choice(r, {
        prompt: `Which is ${n} in ${cfg.name}?`,
        correct: cfg.numbers[n],
        distractors: sample(r, keys.filter(k => k !== n).map(k => cfg.numbers[k]), 3),
        hint: 'Two of these are close neighbours of the right one.',
        explanation: `${n} = ${cfg.numbers[n]}.`
      }); },

    (r) => { const a = int(r, 1, 9), b = int(r, 1, 10 - a);
      return blankQ(`Work it out and write the answer in ${cfg.name}: ${cfg.numbers[a]} + ${cfg.numbers[b]} = ?`,
        cfg.numbers[a + b],
        { hint: 'Work out the sum in figures first, then translate it back.',
          explanation: `${a} + ${b} = ${a + b} = ${cfg.numbers[a + b]}.` }); },

    (r) => { const i = int(r, 0, 6);
      return blankQ(`Write “${cfg.days[i][1]}” in ${cfg.name}.`, cfg.days[i][0],
        { hint: 'The days come round in the same order as in English.',
          explanation: `${cfg.days[i][1]} = ${cfg.days[i][0]}.` }); },

    (r) => { const i = int(r, 0, 6);
      return blankQ(`What does “${cfg.days[i][0]}” mean in English?`, cfg.days[i][1],
        { hint: 'Count along from the start of the week.',
          explanation: `${cfg.days[i][0]} = ${cfg.days[i][1]}.` }); },

    (r) => { const i = int(r, 0, 6);
      return blankQ(`Which day comes after “${cfg.days[i][0]}”? Write it in ${cfg.name}.`,
        cfg.days[(i + 1) % 7][0],
        { hint: 'The week runs in the same order as in English.',
          explanation: `After ${cfg.days[i][0]} comes ${cfg.days[(i + 1) % 7][0]}.` }); },

    (r) => { const i = int(r, 0, 11);
      return blankQ(`Write “${cfg.months[i][1]}” in ${cfg.name}.`, cfg.months[i][0],
        { hint: 'Most of the months look a great deal like their English names.',
          explanation: `${cfg.months[i][1]} = ${cfg.months[i][0]}.` }); },

    (r) => { const i = int(r, 0, 11);
      return blankQ(`Which month of the year is “${cfg.months[i][0]}”? Write the number.`, i + 1,
        { hint: 'Count from the start of the year.',
          explanation: `${cfg.months[i][0]} is month ${i + 1}.` }); },

    (r) => { const n = pick(r, tens);
      return blankQ(`Write ${n} in ${cfg.name}.`, cfg.numbers[n],
        { hint: 'The round numbers have their own words.',
          explanation: `${n} = ${cfg.numbers[n]}.` }); },

    (r) => { const n = int(r, 0, 5), i = int(r, 0, 11);
      return choice(r, {
        prompt: `Which of these is a month in ${cfg.name}?`,
        correct: cfg.months[i][0],
        distractors: sample(r, cfg.days.map(d => d[0]), 3),
        hint: 'Three of these come round every week, not every year.',
        explanation: `${cfg.months[i][0]} is a month; the rest are days.`
      }); }
  ];
}

export function makePhrases(cfg) {
  return [
    (r) => { const [phrase, en] = pick(r, cfg.phrases);
      return choice(r, {
        prompt: `What does “${phrase}” mean?`,
        correct: en,
        distractors: sample(r, cfg.phrases.filter(p => p[1] !== en).map(p => p[1]), 3),
        hint: 'Look for a word inside it you already know.',
        explanation: `${phrase} = ${en}.`
      }); },

    (r) => { const [phrase, en] = pick(r, cfg.phrases);
      return blankQ(`Write “${en}” in ${cfg.name}.`, phrase,
        { hint: 'This is one of the phrases worth knowing by heart.',
          explanation: `${en} = ${phrase}.` }); },

    (r) => { const [phrase, en] = pick(r, cfg.phrases);
      return blankQ(`What does “${phrase}” mean in English?`, en,
        { hint: 'Say it aloud and listen for a word you recognise.',
          explanation: `${phrase} = ${en}.` }); },

    (r) => { const [phrase, en] = pick(r, cfg.phrases);
      return choice(r, {
        prompt: `Which phrase means “${en}”?`,
        correct: phrase,
        distractors: sample(r, cfg.phrases.filter(p => p[0] !== phrase).map(p => p[0]), 3),
        hint: 'Rule out the ones you can already translate.',
        explanation: `“${phrase}” means ${en}.`
      }); }
  ];
}

/* Agreement, for the languages whose adjectives change with the noun. */
function feminine(cfg, adj) {
  return cfg.id === 'spanish' ? `${adj.slice(0, -1)}a` : `${adj}e`;
}
function plural(cfg, word) {
  if (cfg.id === 'spanish') {
    if (word.endsWith('z')) return `${word.slice(0, -1)}ces`;
    return /[aeiouáéíóú]$/.test(word) ? `${word}s` : `${word}es`;
  }
  return `${word}s`;
}

export function makeAdjectives(cfg) {
  return [
    (r) => { const [adj, en] = pick(r, cfg.adjectives);
      return blankQ(`Write the feminine singular of “${adj}” (${en}).`, feminine(cfg, adj),
        { hint: cfg.id === 'spanish' ? 'An -o ending becomes -a.' : 'Most adjectives add -e for the feminine.',
          explanation: `${adj} → ${feminine(cfg, adj)}.` }); },

    (r) => { const [adj, en] = pick(r, cfg.adjectives);
      return blankQ(`Write the masculine plural of “${adj}” (${en}).`, plural(cfg, adj),
        { hint: 'Add the plural ending to the masculine form.',
          explanation: `${adj} → ${plural(cfg, adj)}.` }); },

    (r) => { const [adj, en] = pick(r, cfg.adjectives);
      return blankQ(`Write the feminine plural of “${adj}” (${en}).`,
        plural(cfg, feminine(cfg, adj)),
        { hint: 'Make it feminine first, then plural.',
          explanation: `${adj} → ${feminine(cfg, adj)} → ${plural(cfg, feminine(cfg, adj))}.` }); },

    (r) => { const [adj, en] = pick(r, cfg.neutral);
      return blankQ(`Write the plural of “${adj}” (${en}).`, plural(cfg, adj),
        { hint: 'This one does not change for gender, only for number.',
          explanation: `${adj} → ${plural(cfg, adj)}.` }); },

    (r) => { const [noun, g] = pick(r, cfg.nouns), [adj, en] = pick(r, cfg.adjectives);
      const form = g === 'f' ? feminine(cfg, adj) : adj;
      return blankQ(`Make “${adj}” (${en}) agree with “${noun}”.`, form,
        { hint: `${cap(noun)} is ${GENDER_NAME[g]}.`,
          explanation: `${noun} is ${GENDER_NAME[g]}, so the adjective is ${form}.` }); },

    (r) => { const [noun, g, , nounPlural] = pick(r, cfg.nouns), [adj] = pick(r, cfg.adjectives);
      const form = plural(cfg, g === 'f' ? feminine(cfg, adj) : adj);
      return blankQ(`Make “${adj}” agree with “${nounPlural}”.`, form,
        { hint: `${cap(nounPlural)} is ${GENDER_NAME[g]} and plural.`,
          explanation: `${nounPlural} is ${GENDER_NAME[g]} plural, so the adjective is ${form}.` }); },

    (r) => { const [adj, en] = pick(r, cfg.adjectives);
      const forms = [adj, feminine(cfg, adj), plural(cfg, adj), plural(cfg, feminine(cfg, adj))];
      return blankQ(`Write all four forms of “${adj}” (${en}): masculine singular, feminine singular, masculine plural, feminine plural. Separate them with commas.`,
        forms.join(', '),
        { accept: [forms.join(',')],
          hint: 'Change the gender first, then add the plural to each.',
          explanation: forms.join(', ') + '.' }); },

    (r) => { const [noun, g] = pick(r, cfg.nouns), [adj] = pick(r, cfg.adjectives);
      const right = g === 'f' ? feminine(cfg, adj) : adj;
      const wrong = [adj, feminine(cfg, adj), plural(cfg, adj)].filter(w => w !== right);
      return choice(r, {
        prompt: `Which form agrees with “${noun}”?`,
        correct: right, distractors: wrong,
        hint: 'Match the gender and the number of the noun.',
        explanation: `${noun} is ${GENDER_NAME[g]} singular, so it takes ${right}.`
      }); },

    (r) => { const [adj, en] = pick(r, [...cfg.adjectives, ...cfg.neutral]);
      return blankQ(`What does “${adj}” mean in English?`, en,
        { hint: 'Several of these have an English cousin.',
          explanation: `${adj} means ${en}.` }); },

    (r) => { const [adj, en] = pick(r, cfg.neutral);
      return choice(r, {
        prompt: `Does “${adj}” change for the feminine?`,
        correct: 'no', distractors: ['yes'],
        hint: 'Look at its last letter.',
        explanation: `${adj} has one form for both genders; only the plural changes.`
      }); }
  ];
}

/* Every language drill family, keyed the way the generator table expects. */
export const LANG_DRILL_GENERATORS = (() => {
  const out = {};
  for (const cfg of LANGUAGES) {
    out[`${cfg.id}verbs`] = makeVerbs(cfg);
    out[`${cfg.id}articles`] = makeArticles(cfg);
    out[`${cfg.id}numbers`] = makeNumbers(cfg);
    out[`${cfg.id}phrases`] = makePhrases(cfg);
    if (cfg.adjectives && cfg.neutral) out[`${cfg.id}adjectives`] = makeAdjectives(cfg);
  }
  return out;
})();
