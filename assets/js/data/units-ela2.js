/* English and Language Arts, at the grain a scheme of work uses.

   The existing units cover grammar and vocabulary at a first pass. These are
   the rest of a secondary English course: the sentence-level work that has to
   be secure before essay writing, the reading skills that get examined
   separately from comprehension, the writing forms students are asked to
   produce, and the literature vocabulary an exam actually rewards. */

export const ELA2_UNITS = {
  grammar: [
    {
      name: 'Clauses, Phrases and Sentence Types', from: 'Grade 6', to: 'Grade 12',
      facts: [
        ['a clause', 'a group of words containing a verb'],
        ['a main clause', 'a clause that makes sense on its own'],
        ['a subordinate clause', 'a clause that depends on a main clause'],
        ['a relative clause', 'a clause beginning who, which or that, adding information about a noun'],
        ['a phrase', 'a group of words with no verb of its own'],
        ['a simple sentence', 'a sentence with one main clause'],
        ['a compound sentence', 'two main clauses joined by a coordinating conjunction'],
        ['a complex sentence', 'a main clause with at least one subordinate clause'],
        ['a coordinating conjunction', 'and, but, or, so — joining clauses of equal weight'],
        ['a subordinating conjunction', 'because, although, while — introducing a subordinate clause'],
        ['the subject', 'the person or thing doing the verb'],
        ['the object', 'the person or thing the verb is done to'],
        ['a fragment', 'a group of words punctuated as a sentence but missing a main clause'],
        ['a run-on sentence', 'two sentences joined with no punctuation'],
        ['a comma splice', 'two main clauses joined by a comma alone'],
        ['a semicolon', 'the mark that joins two closely related main clauses'],
        ['an appositive', 'a noun phrase renaming the noun beside it'],
        ['a participle phrase', 'a phrase beginning with an -ing or -ed verb form'],
        ['a dangling modifier', 'a modifier with nothing sensible to attach to'],
        ['the active voice', 'the form where the subject does the action'],
        ['the passive voice', 'the form where the subject receives the action']
      ],
      truths: [
        'A main clause makes sense on its own; a subordinate clause does not.',
        'Two main clauses joined by only a comma is a comma splice.',
        'A semicolon can join two main clauses where a comma cannot.',
        'A phrase has no verb of its own; a clause does.',
        'The passive voice moves the doer out of the subject position, and sometimes out of the sentence.',
        'A complex sentence needs at least one subordinate clause, not just extra length.'
      ],
      myths: [
        'A complex sentence is just a long sentence.',
        'A comma can join two complete sentences.',
        'Every clause needs a subject and a verb, so a phrase is a short clause.',
        'The passive voice is always wrong.',
        'A semicolon and a colon do the same job.',
        'Starting a sentence with "because" is always an error.'
      ],
      applications: [
        ['"Although it was raining" cannot stand alone. What kind of clause is it?', 'a subordinate clause'],
        ['"I was tired, I went to bed." What error is this?', 'a comma splice'],
        ['"The window was broken." Who broke it is not stated. Which voice is this?', 'the passive voice'],
        ['"Walking to school, the rain started." What is wrong with the opening?', 'a dangling modifier'],
        ['"My sister, a doctor, arrived." What is "a doctor" doing?', 'an appositive']
      ]
    },
    {
      name: 'Punctuation That Changes Meaning', from: 'Grade 5', to: 'Grade 12',
      facts: [
        ['a full stop', 'the mark ending a statement'],
        ['a comma', 'the mark separating items or marking off a clause'],
        ['an apostrophe', 'the mark showing possession or a missing letter'],
        ['a possessive apostrophe', 'the apostrophe showing something belongs to someone'],
        ['a contraction', 'a shortened form with an apostrophe for the missing letters'],
        ['a colon', 'the mark introducing a list, an explanation or a quotation'],
        ['a semicolon', 'the mark joining two closely related main clauses'],
        ['a dash', 'the mark setting off an aside more sharply than a comma'],
        ['brackets', 'the marks enclosing an aside that could be removed'],
        ['inverted commas', 'the marks around direct speech or a quotation'],
        ['a question mark', 'the mark ending a direct question'],
        ['an exclamation mark', 'the mark showing surprise or command'],
        ['the Oxford comma', 'the comma before the final "and" in a list'],
        ['an ellipsis', 'the three dots marking an omission or a trailing off'],
        ['a hyphen', 'the mark joining words into one idea, as in well-known'],
        ['direct speech', 'the exact words someone said, in inverted commas'],
        ['reported speech', 'what someone said, retold without inverted commas'],
        ['its', 'the possessive form, with no apostrophe'],
        ["it's", 'the contraction of it is or it has']
      ],
      truths: [
        '"Its" is possessive and takes no apostrophe; "it’s" means it is.',
        'A colon introduces; a semicolon joins.',
        'The apostrophe in "don’t" stands for the missing o of not.',
        'Punctuation can change meaning entirely: "Let’s eat, Grandma" is not "Let’s eat Grandma".',
        'Direct speech goes inside inverted commas; reported speech does not.',
        'A hyphen joins words into a single idea; a dash separates.'
      ],
      myths: [
        '"Its" always takes an apostrophe because it shows possession.',
        'A semicolon is a stronger comma and can be used anywhere a comma can.',
        'An apostrophe is used to make a word plural.',
        'A colon and a semicolon are interchangeable.',
        'Exclamation marks make writing more powerful the more you use.',
        'Reported speech needs inverted commas too.'
      ],
      applications: [
        ['"The dog wagged it’s tail." What is the error?', 'its'],
        ['"Let’s eat, Grandma" and "Let’s eat Grandma" differ by one mark. Which?', 'a comma'],
        ['A list is introduced after a complete clause. Which mark is used?', 'a colon'],
        ['"He said, “I am leaving.”" What kind of speech is this?', 'direct speech'],
        ['"Well known" becomes one idea before a noun. Which mark joins it?', 'a hyphen']
      ]
    },
    {
      name: 'Tense, Agreement and Common Errors', from: 'Grade 5', to: 'Grade 12',
      facts: [
        ['tense', 'the form of a verb showing when something happens'],
        ['the present tense', 'the form for what happens now or generally'],
        ['the past tense', 'the form for what has already happened'],
        ['the future', 'what will happen, formed with will or going to'],
        ['the present perfect', 'the form joining a past action to now, as in "has finished"'],
        ['the past perfect', 'the form for an action before another past action'],
        ['the continuous form', 'the form with -ing, for an action in progress'],
        ['subject–verb agreement', 'the rule that a singular subject takes a singular verb'],
        ['a collective noun', 'a noun naming a group, such as team or family'],
        ['an irregular verb', 'a verb that does not form its past tense with -ed'],
        ['a modal verb', 'can, should, must and others, showing possibility or obligation'],
        ['tense consistency', 'staying in the same tense unless there is a reason to change'],
        ['there', 'the word for a place or to start a sentence'],
        ['their', 'the possessive form belonging to them'],
        ["they're", 'the contraction of they are'],
        ['affect', 'the verb meaning to influence'],
        ['effect', 'the noun meaning a result'],
        ['fewer', 'the word for things you can count'],
        ['less', 'the word for quantities you cannot count'],
        ['who', 'the form used for the subject'],
        ['whom', 'the form used for the object']
      ],
      truths: [
        '"Fewer" is used for countable things and "less" for uncountable ones.',
        '"Affect" is usually the verb and "effect" usually the noun.',
        'A singular subject takes a singular verb, however many words come between them.',
        'The past perfect places one past action before another.',
        'Irregular verbs do not form the past tense with -ed.',
        'Changing tense mid-paragraph without reason confuses the reader.'
      ],
      myths: [
        '"Less" and "fewer" are interchangeable.',
        '"Affect" is always the noun.',
        'The verb agrees with whichever noun is nearest to it.',
        'Every verb forms the past tense by adding -ed.',
        '"Their", "there" and "they’re" can be used however they sound right.',
        'The present perfect is just a longer way of saying the past tense.'
      ],
      applications: [
        ['"There are less people here." What should "less" be?', 'fewer'],
        ['"The rain will affect the match." Which word is the verb?', 'affect'],
        ['"The box of books were heavy." Which rule is broken?', 'subject–verb agreement'],
        ['"He had left before she arrived." Which tense is "had left"?', 'the past perfect'],
        ['"Go" becomes "went", not "goed". What kind of verb is it?', 'an irregular verb']
      ]
    }
  ],

  reading: [
    {
      name: 'Inference, Evidence and Analysis', from: 'Grade 6', to: 'College',
      facts: [
        ['inference', 'a conclusion drawn from evidence rather than stated outright'],
        ['evidence', 'the words from a text that support a point'],
        ['a quotation', 'the exact words taken from a text'],
        ['analysis', 'explaining how a writer creates an effect'],
        ['explicit information', 'what a text states directly'],
        ['implicit information', 'what a text suggests without stating'],
        ['tone', 'the writer’s attitude to the subject'],
        ['mood', 'the feeling a text creates in the reader'],
        ['purpose', 'what a text is trying to do'],
        ['audience', 'who a text is written for'],
        ['register', 'how formal or informal the language is'],
        ['connotation', 'the associations a word carries beyond its meaning'],
        ['denotation', 'the literal dictionary meaning of a word'],
        ['a topic sentence', 'the sentence stating a paragraph’s main point'],
        ['skimming', 'reading quickly for the general idea'],
        ['scanning', 'reading to find one specific piece of information'],
        ['close reading', 'reading slowly to examine word choice and structure'],
        ['bias', 'a slant in how a subject is presented'],
        ['a summary', 'the main points of a text in fewer words'],
        ['a counterargument', 'a point made against the position being argued']
      ],
      truths: [
        'An inference is supported by evidence in the text, not invented from outside it.',
        'Tone belongs to the writer; mood belongs to the reader.',
        'Analysis explains how an effect is created; retelling the plot does not.',
        'Connotation is what a word suggests; denotation is what it means.',
        'Skimming and scanning are different techniques for different purposes.',
        'A summary keeps the main points and drops the detail, without adding opinion.'
      ],
      myths: [
        'An inference is a guess.',
        'Quoting a text is the same as analysing it.',
        'Tone and mood are two words for the same thing.',
        'A summary should include your opinion of the text.',
        'Skimming means reading every word quickly.',
        'A longer quotation is always stronger evidence.'
      ],
      applications: [
        ['A character slams a door and says nothing. The reader concludes they are angry. What is this?', 'inference'],
        ['"Home" and "house" mean the same thing but feel different. Which difference is this?', 'connotation'],
        ['A reader looks through a page for one date. Which technique is this?', 'scanning'],
        ['A student retells what happens instead of explaining how it is written. What is missing?', 'analysis'],
        ['A text presents only one side of a debate. What is present?', 'bias']
      ]
    },
    {
      name: 'Non-Fiction and Comparing Texts', from: 'Grade 7', to: 'College',
      facts: [
        ['non-fiction', 'writing about real people, places and events'],
        ['an article', 'a piece of writing in a newspaper or magazine'],
        ['a report', 'a factual account organised under headings'],
        ['a review', 'a piece giving an opinion on a work'],
        ['an editorial', 'a piece giving a publication’s own view'],
        ['a memoir', 'a personal account of remembered events'],
        ['a travel writing', 'a personal account of a place'],
        ['a headline', 'the title designed to attract a reader'],
        ['a subheading', 'a heading dividing a text into sections'],
        ['a caption', 'the text explaining an image'],
        ['rhetoric', 'the art of persuasive language'],
        ['a rhetorical question', 'a question asked for effect, not for an answer'],
        ['a triplet', 'three items listed for rhythmic effect'],
        ['direct address', 'speaking to the reader as "you"'],
        ['an anecdote', 'a short personal story used to make a point'],
        ['a statistic', 'a number used as evidence'],
        ['an expert opinion', 'a quotation from someone qualified to judge'],
        ['emotive language', 'wording chosen to produce a feeling'],
        ['a comparison', 'setting two texts against each other to show similarity or difference'],
        ['a synthesis', 'combining information from more than one text']
      ],
      truths: [
        'A rhetorical question is asked for effect, not for an answer.',
        'An editorial gives a publication’s view; a report aims to inform.',
        'Statistics can be accurate and still be used selectively.',
        'Comparing texts means examining both, not describing one and then the other.',
        'Emotive language influences the reader without stating an argument.',
        'A headline is written to attract, so it may overstate what the article says.'
      ],
      myths: [
        'A rhetorical question expects an answer from the reader.',
        'Non-fiction is always objective.',
        'A statistic in a text proves the writer’s point.',
        'Comparing two texts means writing about each in turn.',
        'A headline always summarises the article accurately.',
        'An anecdote is evidence.'
      ],
      applications: [
        ['"Do we really want this?" is asked with no answer expected. What is it?', 'a rhetorical question'],
        ['A writer speaks to the reader as "you". Which technique is this?', 'direct address'],
        ['Two accounts of the same event are set against each other. What is being written?', 'a comparison'],
        ['A short personal story is used to open an argument. What is it?', 'an anecdote'],
        ['A newspaper states its own view on an issue. What kind of piece is it?', 'an editorial']
      ]
    }
  ],

  writing: [
    {
      name: 'Structuring an Argument', from: 'Grade 7', to: 'College',
      facts: [
        ['a thesis', 'the central claim an essay argues'],
        ['a topic sentence', 'the sentence stating a paragraph’s point'],
        ['evidence', 'the material supporting a claim'],
        ['analysis', 'the explanation of how the evidence supports the claim'],
        ['a counterargument', 'the strongest point against your position'],
        ['a rebuttal', 'the response to a counterargument'],
        ['a conclusion', 'the ending that draws the argument together'],
        ['an introduction', 'the opening that sets out the question and the position'],
        ['a discourse marker', 'a word or phrase signposting the next step, such as however'],
        ['cohesion', 'the way sentences link together'],
        ['coherence', 'the way a whole text makes sense as one argument'],
        ['a paragraph', 'a unit of writing developing one point'],
        ['signposting', 'telling the reader where the argument is going'],
        ['a concession', 'admitting something to the other side before answering it'],
        ['hedging', 'softening a claim to the strength the evidence supports'],
        ['overgeneralisation', 'claiming more than the evidence allows'],
        ['a topic shift', 'moving to a new point, which needs a new paragraph'],
        ['redrafting', 'rewriting to improve structure and argument'],
        ['proofreading', 'the final check for errors of spelling and punctuation'],
        ['register', 'the level of formality suited to the reader']
      ],
      truths: [
        'A paragraph develops one point; a new point needs a new paragraph.',
        'A counterargument makes an essay stronger, not weaker.',
        'Evidence without analysis leaves the reader to make your argument for you.',
        'Redrafting changes the argument; proofreading only corrects the surface.',
        'Hedging a claim to what the evidence supports is more persuasive than overstating it.',
        'A conclusion draws the argument together rather than introducing new points.'
      ],
      myths: [
        'Mentioning the other side weakens your argument.',
        'A paragraph should be a set number of sentences long.',
        'Proofreading and redrafting are the same stage.',
        'The strongest writing states everything with total certainty.',
        'A conclusion should introduce your best new point.',
        'Longer words always make writing more formal and better.'
      ],
      applications: [
        ['An essay admits a point to the other side before answering it. What is this?', 'a concession'],
        ['A paragraph opens by stating the point it will make. What is that sentence?', 'a topic sentence'],
        ['A writer claims "everyone believes" without support. What has happened?', 'overgeneralisation'],
        ['A whole draft is restructured after the argument is found weak. What stage is this?', 'redrafting'],
        ['"However" tells the reader a contrast is coming. What kind of word is it?', 'a discourse marker']
      ]
    },
    {
      name: 'Creative Writing: Craft and Technique', from: 'Grade 6', to: 'College',
      facts: [
        ['a narrative', 'a piece of writing that tells a story'],
        ['a narrator', 'the voice telling the story'],
        ['first person', 'narration using "I"'],
        ['third person', 'narration using "he", "she" or "they"'],
        ['an omniscient narrator', 'a narrator who knows every character’s thoughts'],
        ['an unreliable narrator', 'a narrator the reader cannot fully trust'],
        ['exposition', 'the opening that establishes situation and character'],
        ['rising action', 'the build-up of complication'],
        ['a climax', 'the point of greatest tension'],
        ['resolution', 'the settling of the story after the climax'],
        ['a cliffhanger', 'an ending that leaves the outcome unresolved'],
        ['characterisation', 'the way a character is built for the reader'],
        ['dialogue', 'the words characters speak'],
        ['show not tell', 'revealing through action and detail rather than stating'],
        ['imagery', 'language that appeals to the senses'],
        ['a motif', 'a detail that recurs and gathers meaning'],
        ['pathetic fallacy', 'weather or setting reflecting a mood'],
        ['foreshadowing', 'an early hint of something later'],
        ['pace', 'how quickly a narrative moves'],
        ['a flashback', 'a scene from before the main action']
      ],
      truths: [
        '"Show not tell" means revealing character through action rather than naming the feeling.',
        'A first-person narrator can only report what that character knows.',
        'Pathetic fallacy uses setting to reflect mood.',
        'Foreshadowing plants something early that pays off later.',
        'Short sentences speed a passage up; longer ones slow it down.',
        'An unreliable narrator is a deliberate choice, not a mistake.'
      ],
      myths: [
        '"Show not tell" means using more adjectives.',
        'A first-person narrator can describe what other characters are thinking.',
        'More description always makes writing better.',
        'A story must be told in the order events happened.',
        'Dialogue should reproduce exactly how people really speak.',
        'An unreliable narrator means the writer has made an error.'
      ],
      applications: [
        ['A story is told by a character who lies to the reader. What kind of narrator is this?', 'an unreliable narrator'],
        ['Rain begins as the character receives bad news. Which technique is this?', 'pathetic fallacy'],
        ['"Her hands shook" replaces "she was frightened". What has the writer done?', 'show not tell'],
        ['A detail in chapter one turns out to matter in chapter ten. What was it?', 'foreshadowing'],
        ['A scene from ten years earlier interrupts the story. What is it?', 'a flashback']
      ]
    }
  ],

  literature: [
    {
      name: 'Poetry: Form, Sound and Meaning', from: 'Grade 7', to: 'College',
      facts: [
        ['a stanza', 'a group of lines in a poem'],
        ['a line', 'one row of a poem'],
        ['rhyme', 'matching sounds at the ends of lines'],
        ['a rhyme scheme', 'the pattern of rhymes, written ABAB and so on'],
        ['rhythm', 'the pattern of stressed and unstressed syllables'],
        ['metre', 'the measured rhythm of a line'],
        ['iambic pentameter', 'a line of five unstressed–stressed pairs'],
        ['a sonnet', 'a fourteen-line poem in a set form'],
        ['a volta', 'the turn in a sonnet where the argument shifts'],
        ['free verse', 'poetry with no fixed metre or rhyme'],
        ['enjambment', 'a sentence running over the end of a line'],
        ['a caesura', 'a pause within a line'],
        ['alliteration', 'repeated consonant sounds at the start of words'],
        ['sibilance', 'repeated s sounds'],
        ['assonance', 'repeated vowel sounds'],
        ['onomatopoeia', 'a word that sounds like what it describes'],
        ['a metaphor', 'a comparison stating one thing is another'],
        ['a simile', 'a comparison using like or as'],
        ['personification', 'giving human qualities to something not human'],
        ['a refrain', 'a repeated line or phrase'],
        ['imagery', 'language appealing to the senses'],
        ['tone', 'the attitude the poem takes to its subject']
      ],
      truths: [
        'Enjambment runs a sentence over a line break without a pause.',
        'A simile uses "like" or "as"; a metaphor does not.',
        'A sonnet has fourteen lines.',
        'Free verse has no fixed metre, which is not the same as having no structure.',
        'A volta is the turn in the argument of a sonnet.',
        'A caesura is a pause inside a line, not at its end.'
      ],
      myths: [
        'All poetry has to rhyme.',
        'A metaphor and a simile are the same thing.',
        'Free verse means the poet made no structural choices.',
        'Enjambment is a pause at the end of a line.',
        'A sonnet can be any length as long as it rhymes.',
        'Alliteration is any repeated letter, wherever it appears.'
      ],
      applications: [
        ['"The sea was a hungry dog." Which technique is this?', 'a metaphor'],
        ['A sentence runs from one line into the next with no pause. What is this?', 'enjambment'],
        ['A poem of fourteen lines turns its argument at line nine. What is that turn?', 'a volta'],
        ['"The silent snake slid slowly." Which sound technique is this?', 'sibilance'],
        ['The wind "whispers" through the trees. Which technique is this?', 'personification']
      ]
    },
    {
      name: 'Drama and Shakespeare: Reading a Play', from: 'Grade 8', to: 'College',
      facts: [
        ['a soliloquy', 'a speech in which a character alone shares their thoughts'],
        ['an aside', 'a remark to the audience the other characters do not hear'],
        ['a monologue', 'a long speech to other characters on stage'],
        ['a stage direction', 'an instruction in the script about action or setting'],
        ['an act', 'a major division of a play'],
        ['a scene', 'a division within an act'],
        ['dramatic irony', 'when the audience knows something a character does not'],
        ['a tragedy', 'a play ending in the downfall of the central character'],
        ['a comedy', 'a play ending in resolution, often marriage'],
        ['a tragic hero', 'the central figure of a tragedy, brought down partly by their own flaw'],
        ['a fatal flaw', 'the weakness that contributes to a tragic hero’s downfall'],
        ['catharsis', 'the release of feeling an audience experiences at the end of a tragedy'],
        ['a protagonist', 'the central character'],
        ['an antagonist', 'the character opposing the protagonist'],
        ['a foil', 'a character whose contrast highlights another'],
        ['blank verse', 'unrhymed iambic pentameter'],
        ['prose', 'ordinary writing without metre, often given to lower-status characters'],
        ['a chorus', 'a voice that comments on the action'],
        ['exposition', 'the establishing of situation at the start'],
        ['a subplot', 'a secondary storyline running alongside the main one']
      ],
      truths: [
        'A soliloquy is spoken alone; a monologue is spoken to others.',
        'Dramatic irony depends on the audience knowing more than a character.',
        'Shakespeare often gives blank verse to high-status characters and prose to others.',
        'A tragic hero’s downfall comes partly from their own choices.',
        'A stage direction is an instruction, not a line to be spoken.',
        'A foil exists to show something about another character by contrast.'
      ],
      myths: [
        'A soliloquy and a monologue are the same thing.',
        'Dramatic irony means a character says something sarcastic.',
        'All of Shakespeare is written in rhyme.',
        'A tragedy is any play with a sad ending and nothing more.',
        'Stage directions are read aloud in performance.',
        'The protagonist is always the hero in the moral sense.'
      ],
      applications: [
        ['The audience knows the drink is poisoned and the character does not. What is this?', 'dramatic irony'],
        ['A character alone on stage tells the audience their private thoughts. What is this?', 'a soliloquy'],
        ['A quiet, cautious character stands beside a reckless one. What is the quiet one?', 'a foil'],
        ['A speech is unrhymed but in five-beat lines. What form is it?', 'blank verse'],
        ['The central character’s ambition brings about their downfall. What is the ambition?', 'a fatal flaw']
      ]
    }
  ],

  vocabulary: [
    {
      name: 'Roots, Prefixes and Suffixes', from: 'Grade 5', to: 'College',
      facts: [
        ['a root', 'the core part of a word that carries its meaning'],
        ['a prefix', 'a part added to the start of a word'],
        ['a suffix', 'a part added to the end of a word'],
        ['un-', 'the prefix meaning not'],
        ['re-', 'the prefix meaning again'],
        ['pre-', 'the prefix meaning before'],
        ['sub-', 'the prefix meaning under'],
        ['trans-', 'the prefix meaning across'],
        ['inter-', 'the prefix meaning between'],
        ['-ology', 'the suffix meaning the study of'],
        ['-able', 'the suffix meaning able to be'],
        ['-ness', 'the suffix turning an adjective into a noun'],
        ['-ist', 'the suffix meaning a person who does something'],
        ['aqua', 'the root meaning water'],
        ['bio', 'the root meaning life'],
        ['geo', 'the root meaning earth'],
        ['photo', 'the root meaning light'],
        ['graph', 'the root meaning write or draw'],
        ['scrib', 'the root meaning write'],
        ['port', 'the root meaning carry'],
        ['dict', 'the root meaning say'],
        ['spect', 'the root meaning look']
      ],
      truths: [
        'A prefix changes meaning; a suffix often changes word class.',
        '"Bio" means life, so biology is the study of living things.',
        'Knowing a root lets you work out an unfamiliar word.',
        '"Trans-" means across, as in transport and translate.',
        '"Un-" and "in-" can both mean not.',
        'The same root appears across subjects: "graph" is in photograph and geography.'
      ],
      myths: [
        'A prefix always changes a word into its opposite.',
        'Every English word has a Latin or Greek root.',
        'A suffix never changes what part of speech a word is.',
        'Knowing a root always tells you a word’s exact meaning.',
        '"Re-" always means again in every word it appears in.',
        'Prefixes and suffixes can be swapped around freely.'
      ],
      applications: [
        ['"Transport" carries something across. Which root means carry?', 'port'],
        ['"Predict" is to say beforehand. Which prefix means before?', 'pre-'],
        ['"Kindness" is a noun formed from an adjective. Which suffix did that?', '-ness'],
        ['"Aquarium" holds water. Which root is this?', 'aqua'],
        ['"Inspect" means to look into. Which root means look?', 'spect']
      ]
    }
  ],

  spelling: [
    {
      name: 'Spelling Rules and Exceptions', from: 'Grade 4', to: 'Grade 10',
      facts: [
        ['i before e', 'the rule for words like believe, except after c'],
        ['doubling', 'doubling a final consonant before adding -ing or -ed'],
        ['dropping the e', 'removing a silent e before a suffix beginning with a vowel'],
        ['changing y to i', 'the rule for words like happy becoming happiness'],
        ['a plural', 'the form for more than one'],
        ['adding -es', 'the plural for words ending in s, x, ch or sh'],
        ['an irregular plural', 'a plural that does not add -s, such as children'],
        ['a homophone', 'a word that sounds the same as another but is spelled differently'],
        ['a silent letter', 'a letter that is written but not sounded'],
        ['a schwa', 'the unstressed vowel sound that makes spelling unpredictable'],
        ['a syllable', 'one beat of a word'],
        ['a mnemonic', 'a memory trick for a spelling'],
        ['necessary', 'a word often misspelled: one c, two s'],
        ['separate', 'a word often misspelled: there is a rat in separate'],
        ['definitely', 'a word often misspelled: it contains finite'],
        ['accommodate', 'a word often misspelled: two c, two m'],
        ['rhythm', 'a word often misspelled: no ordinary vowels'],
        ['embarrass', 'a word often misspelled: two r, two s']
      ],
      truths: [
        '"I before e except after c" has many exceptions, so it is a guide rather than a rule.',
        'A silent e is dropped before a suffix that starts with a vowel.',
        'Words ending in a consonant and y change the y to i before most suffixes.',
        'Homophones sound identical and are spelled differently.',
        'Some plurals do not add -s at all.',
        '"Separate" contains the word "rat" in the middle, which is a useful mnemonic.'
      ],
      myths: [
        '"I before e except after c" has no exceptions.',
        'Every plural is formed by adding -s.',
        'If a word sounds right it is spelled right.',
        'Silent letters can always be left out.',
        'Spelling rules in English have no exceptions.',
        'A homophone is a word with two meanings.'
      ],
      applications: [
        ['"Hope" becomes "hoping", losing a letter. Which rule applies?', 'dropping the e'],
        ['"Happy" becomes "happiness". Which rule applies?', 'changing y to i'],
        ['"There", "their" and "they’re" sound identical. What are they?', 'a homophone'],
        ['"Box" becomes "boxes" rather than "boxs". Which rule applies?', 'adding -es'],
        ['The k in "knee" is written but not said. What is it?', 'a silent letter']
      ]
    }
  ]
};
