/* Media & Film, Psychology and Sociology, by named topic.

   These were the three thinnest strands in the library: a subject with two
   units is a subject a student exhausts in a week. Each unit here is a block a
   syllabus lists by name — "Conformity, Obedience and Social Influence",
   "News Values and Bias in Reporting" — so it can be found by searching for
   what it teaches. */

export const MEDIA_MIND_UNITS = {
  /* ================================== media ================================== */
  media: [
    {
      name: 'Film Language: Shots, Angles and Editing', from: 'Grade 7', to: 'College',
      facts: [
        ['a shot', 'a single unbroken run of camera footage'],
        ['a frame', 'one still image of a film, and the boundary of what is seen'],
        ['an establishing shot', 'the wide shot that sets the place'],
        ['a long shot', 'a shot showing the whole figure and its surroundings'],
        ['a mid shot', 'a shot framing a figure from the waist up'],
        ['a close-up', 'a shot filling the frame with a face or detail'],
        ['an extreme close-up', 'a shot of a very small detail, such as an eye'],
        ['a high angle', 'a camera above the subject, often making it look small'],
        ['a low angle', 'a camera below the subject, often making it look powerful'],
        ['a point of view shot', 'a shot showing what a character sees'],
        ['a pan', 'a camera turning horizontally on its axis'],
        ['a tilt', 'a camera turning vertically on its axis'],
        ['a tracking shot', 'a camera moving with the subject'],
        ['a cut', 'an instant change from one shot to another'],
        ['a dissolve', 'one shot fading into the next'],
        ['continuity editing', 'cutting that hides itself so the action reads as unbroken'],
        ['a jump cut', 'a cut that visibly breaks the flow of time'],
        ['a montage', 'a sequence of short shots compressing time or ideas'],
        ['mise-en-scène', 'everything arranged in front of the camera'],
        ['a shot reverse shot', 'the alternating pattern used to film a conversation']
      ],
      truths: [
        'Mise-en-scène is what is in front of the camera; cinematography is how it is filmed.',
        'A low angle tends to make a subject look powerful, and a high angle small.',
        'Continuity editing is designed not to be noticed.',
        'A cut is instant; a dissolve overlaps two shots.',
        'A montage compresses time by leaving most of it out.'
      ],
      myths: [
        'A shot and a scene are the same thing.',
        'Camera angles have fixed meanings that never depend on context.',
        'Zooming and tracking produce identical images.',
        'Editing only removes mistakes.',
        'Mise-en-scène refers to the editing.'
      ],
      applications: [
        ['A shot fills the frame with a character’s face. What is it?', 'a close-up'],
        ['The camera is below a character, looking up. What angle?', 'a low angle'],
        ['Which shot opens a scene by showing where it is set?', 'an establishing shot'],
        ['A camera turns left to right on its tripod. What move?', 'a pan'],
        ['Everything arranged in front of the camera is called what?', 'mise-en-scène']
      ]
    },
    {
      name: 'Genre and Narrative in Film', from: 'Grade 7', to: 'College',
      facts: [
        ['a genre', 'a type of film recognised by its shared conventions'],
        ['a convention', 'an expected feature of a genre'],
        ['an iconography', 'the recurring objects and images of a genre'],
        ['a subgenre', 'a narrower type within a genre'],
        ['a hybrid genre', 'a film combining the conventions of two genres'],
        ['a narrative', 'the way a story is told'],
        ['a plot', 'the events as the film arranges them'],
        ['a story', 'the events in the order they happened'],
        ['exposition', 'the opening that sets up character and situation'],
        ['an inciting incident', 'the event that starts the story moving'],
        ['rising action', 'the build of complications towards the climax'],
        ['a climax', 'the point of greatest tension'],
        ['a resolution', 'the settling of the story after the climax'],
        ['a protagonist', 'the character whose goal drives the story'],
        ['an antagonist', 'the force opposing the protagonist'],
        ['an equilibrium', 'the settled state a narrative begins and ends in'],
        ['a flashback', 'a scene showing earlier events'],
        ['a non-linear narrative', 'a story told out of chronological order'],
        ['an open ending', 'an ending that leaves questions unresolved'],
        ['a subversion', 'a deliberate break with what the genre leads you to expect']
      ],
      truths: [
        'Genres change over time as films subvert their own conventions.',
        'Story is what happened; plot is the order the film reveals it in.',
        'A film can belong to more than one genre at once.',
        'Todorov’s pattern moves from equilibrium through disruption to a new equilibrium.',
        'An antagonist need not be a person.'
      ],
      myths: [
        'A film belongs to exactly one genre.',
        'Genre conventions are fixed and never change.',
        'The protagonist is always the hero.',
        'A non-linear narrative means the story has no order.',
        'Plot and story mean the same thing.'
      ],
      applications: [
        ['The event that sets the story moving is called what?', 'the inciting incident'],
        ['A film mixing horror and comedy is called what?', 'a hybrid genre'],
        ['The recurring objects and images of a genre are called what?', 'its iconography'],
        ['A scene showing earlier events is called what?', 'a flashback'],
        ['The point of greatest tension is called what?', 'the climax']
      ]
    },
    {
      name: 'News Values and Bias in Reporting', from: 'Grade 7', to: 'College',
      facts: [
        ['a news value', 'a quality that makes an event likely to be reported'],
        ['immediacy', 'the news value of an event having just happened'],
        ['proximity', 'the news value of an event being close to the audience'],
        ['prominence', 'the news value of well-known people being involved'],
        ['negativity', 'the news value of bad news travelling further'],
        ['a gatekeeper', 'the editor who decides what is published'],
        ['an agenda', 'the set of issues a publication chooses to keep in view'],
        ['agenda setting', 'shaping what an audience thinks about, rather than what it thinks'],
        ['framing', 'the angle a story is told from'],
        ['a headline', 'the line that sets expectations before the article is read'],
        ['a source', 'the person or document a claim comes from'],
        ['an anonymous source', 'a source whose name is withheld'],
        ['a correction', 'the published admission that a report was wrong'],
        ['balance', 'giving space to more than one position'],
        ['false balance', 'giving equal weight to positions the evidence does not support equally'],
        ['bias', 'a slant that favours one side'],
        ['a loaded word', 'a word carrying judgement as well as meaning'],
        ['an editorial', 'an article stating the publication’s own opinion'],
        ['a primary source', 'evidence from the event itself'],
        ['fact checking', 'the process of verifying claims before publication']
      ],
      truths: [
        'What gets reported is a selection, and the selection is itself a choice.',
        'Framing can change how a story reads without a single false statement in it.',
        'False balance can mislead by treating unequal evidence as equal.',
        'A headline is often written by an editor, not the reporter.',
        'An editorial is meant to be opinion; a news report is not.'
      ],
      myths: [
        'A report with no false statements cannot be biased.',
        'Anything printed in a newspaper has been fact checked.',
        'Balance always means giving both sides equal space.',
        'The reporter always writes the headline.',
        'Bias only exists in publications you disagree with.'
      ],
      applications: [
        ['Deciding which stories reach the audience is whose role?', 'the gatekeeper'],
        ['Shaping what an audience thinks about is called what?', 'agenda setting'],
        ['Which news value covers events happening near the audience?', 'proximity'],
        ['Giving equal weight to unequal evidence is called what?', 'false balance'],
        ['An article stating the publication’s own opinion is called what?', 'an editorial']
      ]
    },
    {
      name: 'Representation and Stereotypes in Media', from: 'Grade 7', to: 'College',
      facts: [
        ['representation', 'the way media portrays people, places and ideas'],
        ['a stereotype', 'a fixed oversimplified image of a group'],
        ['a countertype', 'a portrayal that works against the usual stereotype'],
        ['a trope', 'a familiar recurring device or character type'],
        ['tokenism', 'the inclusion of one member of a group as a gesture'],
        ['the male gaze', 'the framing of women as the object of a male viewer'],
        ['an archetype', 'a recurring character pattern found across stories'],
        ['a protagonist of colour', 'a lead role written for a character who is not white'],
        ['whitewashing', 'casting a white actor in a role written as a person of colour'],
        ['under-representation', 'a group appearing far less often than in the population'],
        ['a positive representation', 'a portrayal showing a group with range and agency'],
        ['a negative representation', 'a portrayal limiting a group to one narrow role'],
        ['audience positioning', 'the way a text invites a viewer to sympathise'],
        ['a preferred reading', 'the interpretation the text encourages'],
        ['an oppositional reading', 'an interpretation that rejects the text’s position'],
        ['a negotiated reading', 'an interpretation that accepts some of the text and not the rest'],
        ['diversity', 'the range of groups represented'],
        ['inclusion', 'the presence of groups behind the camera as well as in front of it'],
        ['a gatekeeping decision', 'a choice about who gets to make media'],
        ['a case study', 'the named text a course analyses in detail']
      ],
      truths: [
        'Repeated representation shapes what an audience takes to be normal.',
        'A viewer can accept, negotiate or reject the reading a text prefers.',
        'Who makes a text affects how groups appear in it.',
        'Tokenism can leave representation looking diverse while changing little.',
        'A stereotype can be positive in tone and still be limiting.'
      ],
      myths: [
        'A positive stereotype is harmless.',
        'Every viewer takes the meaning a text intends.',
        'Representation matters only in front of the camera.',
        'Counting characters is enough to measure representation.',
        'A single well-written character solves under-representation.'
      ],
      applications: [
        ['A portrayal that works against the usual stereotype is called what?', 'a countertype'],
        ['An interpretation rejecting the text’s position is called what?', 'an oppositional reading'],
        ['Including one member of a group as a gesture is called what?', 'tokenism'],
        ['The interpretation a text encourages is called what?', 'the preferred reading'],
        ['A group appearing far less often than in the population shows what?', 'under-representation']
      ]
    },
    {
      name: 'Social Media, Algorithms and Misinformation', from: 'Grade 7', to: 'College',
      facts: [
        ['an algorithm', 'the rules deciding what a feed shows and in what order'],
        ['a recommendation system', 'the system that chooses the next thing you are shown'],
        ['engagement', 'the clicks, likes, shares and time a post attracts'],
        ['a filter bubble', 'the narrowed view produced by personalised content'],
        ['an echo chamber', 'a space where the same views are repeated back'],
        ['misinformation', 'false information spread without intent to deceive'],
        ['disinformation', 'false information spread deliberately'],
        ['a deepfake', 'synthetic video or audio made to look genuine'],
        ['a bot account', 'an automated account posing as a person'],
        ['virality', 'the rapid spread of content through sharing'],
        ['clickbait', 'a headline written to be clicked rather than to inform'],
        ['a reverse image search', 'the check that finds where a picture came from'],
        ['lateral reading', 'checking a claim by leaving the page and looking elsewhere'],
        ['a primary source', 'the original document or footage behind a claim'],
        ['a fact checker', 'a person or organisation that verifies claims'],
        ['a moderation policy', 'the rules a platform enforces on what may be posted'],
        ['a community note', 'a reader-added correction attached to a post'],
        ['a digital footprint', 'the record a person leaves through their online activity'],
        ['targeted advertising', 'advertising matched to a person’s data profile'],
        ['data harvesting', 'the collection of personal data at scale']
      ],
      truths: [
        'A feed is ranked by a system optimising for engagement, not for accuracy.',
        'Lateral reading — leaving the page to check elsewhere — beats reading the page harder.',
        'Misinformation and disinformation differ by intent, not by content.',
        'A reverse image search often shows a photo is older than the post claims.',
        'Content that provokes strong feeling spreads faster than content that does not.'
      ],
      myths: [
        'A feed shows everything, in the order it was posted.',
        'A photograph proves an event happened as described.',
        'Popular posts are popular because they are accurate.',
        'Only careless people are fooled by disinformation.',
        'Deleting a post removes it from the internet.'
      ],
      applications: [
        ['False information spread deliberately is called what?', 'disinformation'],
        ['Checking a claim by leaving the page is called what?', 'lateral reading'],
        ['Which check finds where a photograph first appeared?', 'a reverse image search'],
        ['What do feed algorithms mainly optimise for?', 'engagement'],
        ['Synthetic video made to look genuine is called what?', 'a deepfake']
      ]
    },
    {
      name: 'Sound and Music in Film', from: 'Grade 8', to: 'College',
      facts: [
        ['diegetic sound', 'sound the characters can hear'],
        ['non-diegetic sound', 'sound only the audience hears'],
        ['a score', 'music written for a film'],
        ['a soundtrack', 'the complete sound of a film, or its released music'],
        ['a leitmotif', 'a recurring musical phrase tied to a character or idea'],
        ['a sound bridge', 'sound carrying across a cut between scenes'],
        ['a voiceover', 'narration laid over the picture'],
        ['ambient sound', 'the background sound of a place'],
        ['a foley effect', 'an everyday sound recorded and added afterwards'],
        ['a sound effect', 'a sound added for a specific action'],
        ['dialogue', 'the words characters speak'],
        ['a mix', 'the balance of dialogue, effects and music'],
        ['silence', 'the deliberate absence of sound, used for effect'],
        ['a crescendo', 'a gradual increase in loudness'],
        ['a stinger', 'a sudden loud chord used to startle'],
        ['synchronous sound', 'sound matching the action on screen'],
        ['asynchronous sound', 'sound that does not match what is seen'],
        ['a theme', 'the main musical idea of a film'],
        ['an underscore', 'quiet music under dialogue'],
        ['a source cue', 'music playing from something within the scene']
      ],
      truths: [
        'Diegetic sound belongs to the world of the film; non-diegetic sound does not.',
        'A leitmotif can tell the audience a character is near before they appear.',
        'Foley effects are recorded after filming, not captured on set.',
        'Silence is an effect, chosen as deliberately as a loud cue.',
        'A sound bridge can join two scenes before the picture catches up.'
      ],
      myths: [
        'All the sound in a film was recorded while it was being filmed.',
        'Music in a film is only there to fill silence.',
        'Characters can hear the score.',
        'A soundtrack means only the songs.',
        'Sound is added last and changes nothing about the meaning.'
      ],
      applications: [
        ['Music the characters cannot hear is called what?', 'non-diegetic'],
        ['A recurring musical phrase tied to a character is called what?', 'a leitmotif'],
        ['Everyday sounds recorded afterwards are called what?', 'foley effects'],
        ['Sound carrying across a cut is called what?', 'a sound bridge'],
        ['A car radio playing in a scene is which kind of sound?', 'diegetic']
      ]
    },
    {
      name: 'Documentary and the Claim to Truth', from: 'Grade 8', to: 'College',
      facts: [
        ['a documentary', 'a film presenting itself as an account of the real world'],
        ['an observational documentary', 'a film that watches without intervening'],
        ['an expository documentary', 'a film that explains, often with narration'],
        ['a participatory documentary', 'a film where the maker appears and takes part'],
        ['a reflexive documentary', 'a film that draws attention to its own making'],
        ['a talking head', 'an interviewee filmed speaking to camera'],
        ['archive footage', 'existing film reused in a new documentary'],
        ['a reconstruction', 'a staged re-enactment of an event'],
        ['a voice of God narration', 'an unseen authoritative narrator'],
        ['a fly-on-the-wall style', 'filming that tries to be unnoticed'],
        ['an observer effect', 'the change in behaviour caused by being filmed'],
        ['selective editing', 'shaping meaning by choosing what to include'],
        ['a shooting ratio', 'how much footage was filmed for each minute used'],
        ['informed consent', 'a contributor’s agreement, knowing how the footage will be used'],
        ['a duty of care', 'the responsibility a maker owes a contributor'],
        ['a docudrama', 'a dramatised film based on real events'],
        ['a mockumentary', 'a fiction filmed in documentary style'],
        ['an agenda', 'the position a documentary is arguing for'],
        ['a contributor', 'a person who takes part in a documentary'],
        ['a caption', 'on-screen text identifying a person or place']
      ],
      truths: [
        'A documentary is constructed: what is filmed, kept and ordered are all choices.',
        'Being filmed changes how people behave.',
        'A reconstruction is staged, and honest documentaries label it as one.',
        'A documentary can be truthful and still argue a position.',
        'A mockumentary uses documentary conventions to tell a fiction.'
      ],
      myths: [
        'A documentary shows events exactly as they happened.',
        'Editing does not affect the truth of a documentary.',
        'A camera in the room makes no difference to behaviour.',
        'Narration is neutral because it states facts.',
        'Archive footage always shows what the narration says it shows.'
      ],
      applications: [
        ['A film where the maker appears and takes part is which mode?', 'participatory'],
        ['A staged re-enactment of an event is called what?', 'a reconstruction'],
        ['The change in behaviour caused by being filmed is called what?', 'the observer effect'],
        ['A fiction filmed in documentary style is called what?', 'a mockumentary'],
        ['An unseen authoritative narrator is called what?', 'voice of God narration']
      ]
    },
    {
      name: 'Video Games as Media Texts', from: 'Grade 8', to: 'College',
      facts: [
        ['interactivity', 'the player’s ability to affect what happens'],
        ['agency', 'the sense that a player’s choices matter'],
        ['a game mechanic', 'a rule governing what a player can do'],
        ['a level', 'one bounded section of a game'],
        ['an open world', 'a game space the player can explore freely'],
        ['a linear game', 'a game following one fixed path'],
        ['a narrative branch', 'a point where a story splits according to a choice'],
        ['a cut scene', 'a non-interactive sequence telling story'],
        ['an avatar', 'the figure a player controls'],
        ['a first-person view', 'a camera showing the world through the character’s eyes'],
        ['a third-person view', 'a camera showing the character from outside'],
        ['a heads-up display', 'the on-screen information overlaid on play'],
        ['a difficulty curve', 'the way challenge increases through a game'],
        ['a reward loop', 'the cycle of action, reward and repetition'],
        ['a microtransaction', 'a small in-game purchase'],
        ['a loot box', 'a paid randomised reward'],
        ['an age rating', 'the classification advising who a game is suitable for'],
        ['a franchise', 'a series of games sharing a name and world'],
        ['a player community', 'the audience that plays, discusses and modifies a game'],
        ['a modification', 'a player-made change to a game']
      ],
      truths: [
        'Interactivity makes a game audience a participant as well as a viewer.',
        'Game mechanics carry meaning: what a game lets you do is part of what it says.',
        'Age ratings advise on content; they are not a measure of quality.',
        'Loot boxes are regulated as gambling in some countries and not in others.',
        'A branching narrative gives real agency only where the branches differ.'
      ],
      myths: [
        'A game with a story is just a film you press buttons during.',
        'Every choice offered in a game changes the outcome.',
        'An age rating tells you how hard a game is.',
        'Players only consume games; they never make anything.',
        'Interactivity means a game cannot have a fixed point of view.'
      ],
      applications: [
        ['A rule governing what a player can do is called what?', 'a game mechanic'],
        ['A non-interactive story sequence is called what?', 'a cut scene'],
        ['A paid randomised reward is called what?', 'a loot box'],
        ['The on-screen information overlaid on play is called what?', 'a heads-up display'],
        ['A player-made change to a game is called what?', 'a modification']
      ]
    }
  ],
  /* =============================== psychology ================================ */
  psychology: [
    {
      name: 'Attachment and Early Development', from: 'Grade 9', to: 'College',
      facts: [
        ['attachment', 'a close emotional bond between an infant and a caregiver'],
        ['a caregiver', 'the adult who responds to an infant’s needs'],
        ['reciprocity', 'the back-and-forth responding between infant and caregiver'],
        ['interactional synchrony', 'infant and caregiver mirroring each other’s actions'],
        ['the strange situation', 'Ainsworth’s controlled observation of attachment type'],
        ['secure attachment', 'the type showing distress at separation and comfort at reunion'],
        ['insecure-avoidant attachment', 'the type showing little distress and little reunion behaviour'],
        ['insecure-resistant attachment', 'the type showing high distress and resistance at reunion'],
        ['separation anxiety', 'distress when a caregiver leaves'],
        ['stranger anxiety', 'distress in the presence of an unfamiliar adult'],
        ['a critical period', 'a window in which attachment must form, on Bowlby’s account'],
        ['monotropy', 'Bowlby’s claim of one primary attachment figure'],
        ['an internal working model', 'the template for relationships formed in infancy'],
        ['maternal deprivation', 'Bowlby’s account of the effect of losing early care'],
        ['privation', 'never having formed an attachment at all'],
        ['institutionalisation', 'the effects of being raised in an institution'],
        ['a longitudinal study', 'research following the same people over years'],
        ['a controlled observation', 'observation in a set-up situation with fixed procedure'],
        ['an imprinting study', 'Lorenz’s work on early following in geese'],
        ['contact comfort', 'Harlow’s finding that infant monkeys chose softness over food']
      ],
      truths: [
        'Ainsworth’s strange situation is a controlled observation, not an experiment on the child.',
        'Harlow found infant monkeys preferred a cloth mother to a wire one that fed them.',
        'Attachment type in infancy is associated with later relationships, not fixed by them.',
        'Deprivation is losing an attachment; privation is never forming one.',
        'Cross-cultural findings show attachment type proportions vary between societies.'
      ],
      myths: [
        'Attachment is formed only with the mother.',
        'An insecure attachment guarantees problems in adult life.',
        'Feeding is what creates attachment.',
        'The strange situation measures how much a child loves a parent.',
        'Attachment research findings apply identically in every culture.'
      ],
      applications: [
        ['Whose study used the strange situation?', 'Ainsworth'],
        ['Infant and caregiver mirroring each other is called what?', 'interactional synchrony'],
        ['Never having formed an attachment at all is called what?', 'privation'],
        ['Which researcher studied contact comfort in monkeys?', 'Harlow'],
        ['Bowlby’s claim of one primary attachment figure is called what?', 'monotropy']
      ]
    },
    {
      name: 'Conformity, Obedience and Social Influence', from: 'Grade 9', to: 'College',
      facts: [
        ['conformity', 'changing behaviour to match a group'],
        ['compliance', 'going along publicly while privately disagreeing'],
        ['identification', 'conforming to a group you value, while in it'],
        ['internalisation', 'genuinely accepting a group’s view as your own'],
        ['normative social influence', 'conforming to be accepted'],
        ['informational social influence', 'conforming because you believe others know better'],
        ['a confederate', 'an actor working with the researcher'],
        ['the Asch study', 'the line-judgement study of conformity to a wrong majority'],
        ['group size', 'a variable Asch found affected conformity up to a point'],
        ['unanimity', 'the absence of any dissenter, which raises conformity'],
        ['task difficulty', 'the variable that raises informational influence'],
        ['obedience', 'following a direct instruction from an authority'],
        ['the Milgram study', 'the obedience study using a fake shock generator'],
        ['legitimate authority', 'the perceived right of someone to give orders'],
        ['proximity', 'how close the authority or the victim is, which changes obedience'],
        ['an agentic state', 'acting as an instrument of an authority rather than as oneself'],
        ['social roles', 'the behaviour expected of a position, as in the Zimbardo study'],
        ['minority influence', 'the process by which a small group changes the majority'],
        ['consistency', 'the quality that makes a minority persuasive'],
        ['ethical guidelines', 'the rules protecting participants in research']
      ],
      truths: [
        'Asch found conformity fell sharply when a single dissenter was present.',
        'Normative influence changes behaviour; informational influence can change belief.',
        'Milgram found obedience dropped as the authority figure became less proximate.',
        'A consistent minority is more persuasive than an inconsistent one.',
        'Both Asch and Milgram raise ethical problems about deception and distress.'
      ],
      myths: [
        'People who obeyed in Milgram’s study were unusually cruel.',
        'Conformity always means changing what you believe.',
        'A larger majority always produces more conformity.',
        'The Milgram participants actually administered electric shocks.',
        'Minority influence works by shouting loudest.'
      ],
      applications: [
        ['Conforming to be accepted is which type of influence?', 'normative'],
        ['An actor working with the researcher is called what?', 'a confederate'],
        ['What happened to conformity in Asch’s study when one dissenter appeared?', 'it fell'],
        ['Acting as an instrument of authority is called what?', 'an agentic state'],
        ['Which quality makes a minority persuasive?', 'consistency']
      ]
    },
    {
      name: 'Learning: Classical and Operant Conditioning', from: 'Grade 9', to: 'College',
      facts: [
        ['classical conditioning', 'learning by association between two stimuli'],
        ['an unconditioned stimulus', 'something that produces a response naturally'],
        ['an unconditioned response', 'the natural reaction to that stimulus'],
        ['a neutral stimulus', 'something producing no relevant response at first'],
        ['a conditioned stimulus', 'a once-neutral stimulus that now produces the response'],
        ['a conditioned response', 'the learned reaction to the conditioned stimulus'],
        ['extinction', 'the fading of a learned response when it stops being paired'],
        ['spontaneous recovery', 'a learned response returning after apparent extinction'],
        ['generalisation', 'responding to stimuli similar to the conditioned one'],
        ['discrimination', 'responding only to the exact conditioned stimulus'],
        ['operant conditioning', 'learning from the consequences of behaviour'],
        ['positive reinforcement', 'adding something pleasant to increase a behaviour'],
        ['negative reinforcement', 'removing something unpleasant to increase a behaviour'],
        ['punishment', 'a consequence that decreases a behaviour'],
        ['a primary reinforcer', 'something rewarding in itself, such as food'],
        ['a secondary reinforcer', 'something rewarding by association, such as money'],
        ['a schedule of reinforcement', 'the pattern by which a reward is given'],
        ['continuous reinforcement', 'rewarding every occurrence of a behaviour'],
        ['partial reinforcement', 'rewarding some occurrences, which resists extinction'],
        ['social learning', 'learning by observing and imitating a model']
      ],
      truths: [
        'Negative reinforcement increases a behaviour; punishment decreases it.',
        'Partial reinforcement produces behaviour that is harder to extinguish.',
        'Classical conditioning links two stimuli; operant conditioning links behaviour to consequence.',
        'Extinction is the fading of a learned response, not its erasure — it can spontaneously recover.',
        'Social learning requires attention, retention, reproduction and motivation.'
      ],
      myths: [
        'Negative reinforcement is another name for punishment.',
        'Rewarding every single time is the most durable way to train a behaviour.',
        'Extinction permanently removes a conditioned response.',
        'All learning requires a reward.',
        'Pavlov’s dogs learned to salivate at food through conditioning.'
      ],
      applications: [
        ['Removing something unpleasant to increase a behaviour is called what?', 'negative reinforcement'],
        ['Money rewarding by association makes it which kind of reinforcer?', 'a secondary reinforcer'],
        ['Responding to stimuli similar to the conditioned one is called what?', 'generalisation'],
        ['Which reinforcement schedule resists extinction best?', 'partial reinforcement'],
        ['Learning by watching and imitating a model is called what?', 'social learning']
      ]
    },
    {
      name: 'Stress, Coping and Mental Health', from: 'Grade 9', to: 'College',
      facts: [
        ['a stressor', 'anything that places demand on a person'],
        ['stress', 'the response when demands exceed perceived resources'],
        ['acute stress', 'a short-lived stress response'],
        ['chronic stress', 'stress sustained over a long period'],
        ['the fight or flight response', 'the immediate physiological reaction to threat'],
        ['adrenaline', 'the hormone released in the immediate stress response'],
        ['cortisol', 'the hormone released in sustained stress'],
        ['the general adaptation syndrome', 'Selye’s alarm, resistance and exhaustion model'],
        ['a daily hassle', 'a small recurring stressor'],
        ['a life event', 'a major change requiring readjustment'],
        ['problem-focused coping', 'coping by acting on the source of the stress'],
        ['emotion-focused coping', 'coping by managing the feelings the stress produces'],
        ['social support', 'help and reassurance from other people'],
        ['resilience', 'the capacity to recover from difficulty'],
        ['a coping strategy', 'a deliberate way of handling a stressor'],
        ['anxiety', 'a persistent state of worry and physical tension'],
        ['depression', 'a persistent low mood with loss of interest'],
        ['a stigma', 'the social disapproval attached to a condition'],
        ['a therapy', 'a structured treatment for a psychological difficulty'],
        ['cognitive behavioural therapy', 'therapy working on the link between thought and behaviour']
      ],
      truths: [
        'The stress response is normal and useful in the short term.',
        'Chronic stress is associated with raised cortisol and physical health effects.',
        'Problem-focused coping suits controllable stressors; emotion-focused coping suits uncontrollable ones.',
        'Social support is one of the strongest protective factors against stress.',
        'Selye’s model runs alarm, then resistance, then exhaustion.'
      ],
      myths: [
        'All stress is harmful.',
        'Emotion-focused coping is always the weaker strategy.',
        'Depression is the same as feeling sad for a day.',
        'Talking about a problem makes it worse.',
        'Resilience means never being affected by anything.'
      ],
      sequences: [
        ['The general adaptation syndrome', [
          'A stressor is encountered',
          'The alarm stage triggers fight or flight and adrenaline release',
          'The resistance stage sustains coping with raised cortisol',
          'Resources run down if the stressor continues',
          'The exhaustion stage brings falling performance and health effects'
        ]]
      ],
      applications: [
        ['Which hormone is released in sustained stress?', 'cortisol'],
        ['Coping by acting on the source of stress is called what?', 'problem-focused coping'],
        ['What are the three stages of Selye’s model?', 'alarm, resistance, exhaustion'],
        ['A small recurring stressor is called what?', 'a daily hassle'],
        ['Which therapy works on the link between thought and behaviour?', 'cognitive behavioural therapy']
      ]
    },
    {
      name: 'Sleep, Dreams and Biological Rhythms', from: 'Grade 9', to: 'College',
      facts: [
        ['a circadian rhythm', 'a biological cycle of about twenty-four hours'],
        ['an infradian rhythm', 'a cycle longer than a day'],
        ['an ultradian rhythm', 'a cycle shorter than a day'],
        ['an endogenous pacemaker', 'an internal body clock'],
        ['the suprachiasmatic nucleus', 'the brain structure acting as the main body clock'],
        ['an exogenous zeitgeber', 'an external cue such as light that sets the clock'],
        ['melatonin', 'the hormone released as darkness falls'],
        ['REM sleep', 'the stage with rapid eye movement and vivid dreaming'],
        ['NREM sleep', 'the stages of sleep without rapid eye movement'],
        ['slow wave sleep', 'the deepest NREM stage, important for physical recovery'],
        ['a sleep cycle', 'the roughly ninety-minute run through the sleep stages'],
        ['sleep latency', 'the time taken to fall asleep'],
        ['sleep debt', 'the accumulated shortfall from too little sleep'],
        ['insomnia', 'persistent difficulty falling or staying asleep'],
        ['jet lag', 'the mismatch between body clock and local time after travel'],
        ['shift work disorder', 'the disruption caused by working against the body clock'],
        ['sleep hygiene', 'the habits that make good sleep more likely'],
        ['blue light', 'the wavelength that suppresses melatonin release'],
        ['consolidation', 'the strengthening of memories during sleep'],
        ['a sleep diary', 'the record used to study a person’s sleep pattern']
      ],
      truths: [
        'A sleep cycle lasts roughly ninety minutes and repeats through the night.',
        'Light is the main external cue setting the circadian rhythm.',
        'Memory consolidation happens during sleep, which is why sleep affects learning.',
        'Teenagers’ body clocks genuinely shift later in adolescence.',
        'Slow wave sleep dominates early in the night and REM later.'
      ],
      myths: [
        'Everybody needs exactly eight hours.',
        'Sleep lost during the week can be fully repaid at the weekend.',
        'The brain shuts down during sleep.',
        'Dreaming happens only in REM sleep and nowhere else.',
        'Alcohol improves the quality of sleep.'
      ],
      applications: [
        ['Which brain structure is the main body clock?', 'the suprachiasmatic nucleus'],
        ['A cycle longer than a day is called what?', 'an infradian rhythm'],
        ['Which hormone is released as darkness falls?', 'melatonin'],
        ['Roughly how long is one sleep cycle?', 'ninety minutes'],
        ['An external cue that sets the body clock is called what?', 'an exogenous zeitgeber']
      ]
    },
    {
      name: 'Perception, Attention and Optical Illusions', from: 'Grade 8', to: 'College',
      facts: [
        ['sensation', 'the detection of a stimulus by a sense organ'],
        ['perception', 'the interpretation of sensory information'],
        ['bottom-up processing', 'perception driven by the incoming data'],
        ['top-down processing', 'perception shaped by expectation and knowledge'],
        ['a perceptual set', 'a readiness to perceive in a particular way'],
        ['a depth cue', 'a feature the brain uses to judge distance'],
        ['linear perspective', 'the depth cue of converging parallel lines'],
        ['relative size', 'the depth cue of nearer objects appearing larger'],
        ['occlusion', 'the depth cue of one object blocking another'],
        ['binocular disparity', 'the small difference between the two eyes’ images'],
        ['size constancy', 'seeing an object as one size despite changing image size'],
        ['a visual illusion', 'a stimulus that produces a systematically wrong perception'],
        ['the Müller-Lyer illusion', 'the arrow-ended lines that appear unequal'],
        ['the Ponzo illusion', 'the converging lines that make equal bars look different'],
        ['an ambiguous figure', 'an image that can be seen in more than one way'],
        ['selective attention', 'focusing on one input and filtering others'],
        ['divided attention', 'attending to more than one thing at once'],
        ['inattentional blindness', 'failing to notice something clearly visible while attending elsewhere'],
        ['change blindness', 'failing to notice a change between two views'],
        ['the cocktail party effect', 'noticing your own name in a conversation you were not attending to']
      ],
      truths: [
        'Perception is an interpretation, not a recording.',
        'Illusions are informative because they show the rules perception normally uses.',
        'Inattentional blindness happens to attentive people, not careless ones.',
        'Size constancy means a receding object is not perceived as shrinking.',
        'Top-down and bottom-up processing operate together, not in turn.'
      ],
      myths: [
        'The eye works like a camera and the brain simply plays back the picture.',
        'People who fall for illusions have poor eyesight.',
        'Attention can be divided across tasks with no cost.',
        'Anything in front of your eyes is something you see.',
        'Depth perception requires two eyes.'
      ],
      applications: [
        ['Perception shaped by expectation is called what?', 'top-down processing'],
        ['One object blocking another is which depth cue?', 'occlusion'],
        ['Failing to notice something visible while attending elsewhere is called what?', 'inattentional blindness'],
        ['Which illusion uses arrow-ended lines?', 'the Müller-Lyer illusion'],
        ['The small difference between the two eyes’ images is called what?', 'binocular disparity']
      ]
    },
    {
      name: 'Research Methods in Psychology', from: 'Grade 9', to: 'College',
      facts: [
        ['a hypothesis', 'a testable statement predicting a result'],
        ['a null hypothesis', 'the statement that there is no effect'],
        ['an independent variable', 'the variable the researcher changes'],
        ['a dependent variable', 'the variable that is measured'],
        ['an extraneous variable', 'anything else that could affect the result'],
        ['a confounding variable', 'an extraneous variable that varies with the independent variable'],
        ['an operationalised variable', 'a variable defined so it can be measured'],
        ['a laboratory experiment', 'an experiment in a controlled setting'],
        ['a field experiment', 'an experiment in a natural setting'],
        ['a natural experiment', 'a study using a change the researcher did not cause'],
        ['a correlation', 'a relationship between two measured variables'],
        ['a randomised allocation', 'assigning participants to conditions by chance'],
        ['a repeated measures design', 'the same participants in every condition'],
        ['an independent groups design', 'different participants in each condition'],
        ['a matched pairs design', 'participants paired on a relevant characteristic'],
        ['order effects', 'the influence of doing one condition before another'],
        ['counterbalancing', 'varying the order of conditions to cancel order effects'],
        ['demand characteristics', 'cues that let participants guess the aim'],
        ['reliability', 'the consistency of a measure'],
        ['validity', 'whether a study measures what it claims to measure']
      ],
      truths: [
        'A correlation shows a relationship, not a cause.',
        'Repeated measures designs risk order effects; counterbalancing addresses them.',
        'Operationalising a variable is what makes a hypothesis testable.',
        'A study can be reliable and still not be valid.',
        'Random allocation controls for participant differences; random sampling controls who takes part.'
      ],
      myths: [
        'A strong correlation proves one variable causes the other.',
        'A large sample makes a badly designed study valid.',
        'Reliability and validity mean the same thing.',
        'Laboratory experiments are always the best method.',
        'The null hypothesis is what the researcher hopes to prove.'
      ],
      applications: [
        ['Which variable does the researcher change?', 'the independent variable'],
        ['Varying the order of conditions is called what?', 'counterbalancing'],
        ['Cues letting participants guess the aim are called what?', 'demand characteristics'],
        ['Does correlation establish causation?', 'no'],
        ['The consistency of a measure is called what?', 'reliability']
      ]
    }
  ],
  sociology: [
    {
      name: 'Education, Achievement and Social Class', from: 'Grade 9', to: 'College',
      facts: [
        ['cultural capital', 'the knowledge and habits that schools reward'],
        ['material deprivation', 'lacking the money and resources education assumes'],
        ['cultural deprivation', 'the claim that some homes lack the skills schools expect'],
        ['the hidden curriculum', 'what school teaches without setting out to'],
        ['a meritocracy', 'a system where position depends on ability and effort'],
        ['streaming', 'placing pupils in ranked groups across subjects'],
        ['setting', 'placing pupils in ranked groups by subject'],
        ['labelling', 'attaching an expectation to a pupil'],
        ['a self-fulfilling prophecy', 'a label that becomes true because it was applied'],
        ['a pupil subculture', 'a group of pupils sharing an attitude to school'],
        ['an anti-school subculture', 'a group that gains status by rejecting school values'],
        ['the correspondence principle', 'the claim that school mirrors the workplace'],
        ['compensatory education', 'extra provision aimed at closing gaps'],
        ['an attainment gap', 'the measured difference in results between groups'],
        ['marketisation', 'the introduction of competition between schools'],
        ['parentocracy', 'the idea that parental choice drives the system'],
        ['a league table', 'the published ranking of schools by results'],
        ['social mobility', 'movement between social positions across a life or generations'],
        ['a functionalist view', 'the view that education serves shared social needs'],
        ['a Marxist view', 'the view that education reproduces class inequality']
      ],
      truths: [
        'Material and cultural explanations of achievement are different claims and are often confused.',
        'A label can raise attainment as well as lower it.',
        'Marketisation gives schools an incentive to compete for the pupils likely to score well.',
        'The hidden curriculum operates through routine, not through lessons.',
        'Attainment gaps appear before school begins as well as within it.'
      ],
      myths: [
        'Educational outcomes are explained by ability alone.',
        'Cultural deprivation and material deprivation are the same argument.',
        'A meritocracy is a description of how school systems actually work.',
        'League tables measure how much a school added.',
        'Labelling only ever harms.'
      ],
      applications: [
        ['The knowledge and habits schools reward are called what?', 'cultural capital'],
        ['A label that becomes true because it was applied is called what?', 'a self-fulfilling prophecy'],
        ['What school teaches without meaning to is called what?', 'the hidden curriculum'],
        ['Placing pupils in ranked groups by subject is called what?', 'setting'],
        ['The introduction of competition between schools is called what?', 'marketisation']
      ]
    },
    {
      name: 'Crime, Deviance and Social Control', from: 'Grade 9', to: 'College',
      facts: [
        ['crime', 'behaviour that breaks the law'],
        ['deviance', 'behaviour that breaks a social norm'],
        ['social control', 'the ways a society keeps behaviour within norms'],
        ['formal social control', 'control through law, police and courts'],
        ['informal social control', 'control through family, peers and disapproval'],
        ['a sanction', 'a reward or punishment attached to behaviour'],
        ['anomie', 'a state of weak or unclear norms'],
        ['strain theory', 'the account of crime as a gap between goals and legitimate means'],
        ['a subcultural theory', 'the account of crime as learned group behaviour'],
        ['labelling theory', 'the account of deviance as created by the reaction to it'],
        ['a master status', 'a label that overrides every other identity'],
        ['a deviant career', 'the path taken once a label has been applied'],
        ['a moral panic', 'an exaggerated public reaction to a perceived threat'],
        ['a folk devil', 'the group cast as the villain in a moral panic'],
        ['the dark figure of crime', 'crime that never appears in official statistics'],
        ['a victim survey', 'a survey asking people what has happened to them'],
        ['a self-report study', 'a survey asking people what they have done'],
        ['recidivism', 'reoffending after a punishment'],
        ['restorative justice', 'an approach bringing offender and victim together'],
        ['white collar crime', 'crime committed in the course of professional work']
      ],
      truths: [
        'All crime is deviant in law, but not all deviance is criminal.',
        'Official statistics undercount crime, which is why victim surveys exist.',
        'Labelling theory holds that the reaction to an act helps create the deviance.',
        'Moral panics are driven by media reaction as much as by behaviour.',
        'White collar crime is under-represented in official statistics.'
      ],
      myths: [
        'Crime statistics record every crime committed.',
        'Deviance and crime are the same thing.',
        'Crime is concentrated only among the poor.',
        'Longer sentences reliably reduce reoffending.',
        'A moral panic is simply an accurate report of a rising problem.'
      ],
      applications: [
        ['Crime that never reaches official statistics is called what?', 'the dark figure of crime'],
        ['A label that overrides every other identity is called what?', 'a master status'],
        ['The group cast as the villain in a moral panic is called what?', 'a folk devil'],
        ['Control through family and peer disapproval is which kind?', 'informal social control'],
        ['Reoffending after punishment is called what?', 'recidivism']
      ]
    },
    {
      name: 'Media, Identity and Culture', from: 'Grade 9', to: 'College',
      facts: [
        ['culture', 'the shared way of life of a group'],
        ['high culture', 'the forms given the greatest social prestige'],
        ['popular culture', 'the forms consumed most widely'],
        ['a subculture', 'a group with its own norms within a larger culture'],
        ['globalisation', 'the increasing interconnection of societies'],
        ['cultural homogenisation', 'the claim that cultures become more alike'],
        ['cultural hybridity', 'the mixing of cultural forms into something new'],
        ['identity', 'a person’s sense of who they are'],
        ['a social identity', 'identity drawn from group membership'],
        ['socialisation', 'learning the norms and values of a society'],
        ['a role model', 'a figure whose behaviour is copied'],
        ['a moral panic', 'an exaggerated public reaction to a perceived threat'],
        ['the hypodermic model', 'the discredited idea that media injects its message directly'],
        ['the uses and gratifications model', 'the account of audiences choosing media for their own purposes'],
        ['an active audience', 'an audience that interprets rather than absorbs'],
        ['representation', 'the way a group is portrayed in media'],
        ['a stereotype', 'a fixed oversimplified image of a group'],
        ['the digital divide', 'unequal access to technology and the internet'],
        ['a consumer culture', 'a culture organised around buying and displaying goods'],
        ['a gatekeeper', 'the person deciding what content reaches an audience']
      ],
      truths: [
        'The hypodermic model is rejected because audiences interpret rather than absorb.',
        'Globalisation produces both homogenisation and hybridity, not only one.',
        'Identity is shaped by socialisation across a life, not fixed at birth.',
        'The digital divide is about skills and connection quality as well as devices.',
        'Media representation is a selection, and selection is a choice.'
      ],
      myths: [
        'Media effects are direct, immediate and identical for everybody.',
        'Popular culture is simply culture of lower quality.',
        'Globalisation makes every culture the same.',
        'Audiences are passive.',
        'Identity is fixed by the group a person is born into.'
      ],
      applications: [
        ['The discredited direct-effects model is called what?', 'the hypodermic model'],
        ['The mixing of cultural forms into something new is called what?', 'cultural hybridity'],
        ['Unequal access to technology is called what?', 'the digital divide'],
        ['An audience that interprets rather than absorbs is called what?', 'an active audience'],
        ['A group with its own norms inside a larger culture is called what?', 'a subculture']
      ]
    },
    {
      name: 'Research Methods in Sociology', from: 'Grade 9', to: 'College',
      facts: [
        ['primary data', 'data the researcher collects themselves'],
        ['secondary data', 'data collected by someone else'],
        ['quantitative data', 'data in the form of numbers'],
        ['qualitative data', 'data in the form of words, images or meaning'],
        ['a questionnaire', 'a set of written questions given to respondents'],
        ['a closed question', 'a question with fixed answer options'],
        ['an open question', 'a question the respondent answers in their own words'],
        ['a structured interview', 'an interview following a fixed schedule'],
        ['an unstructured interview', 'an interview following the respondent’s answers'],
        ['participant observation', 'research where the sociologist joins the group'],
        ['covert research', 'research where participants do not know they are studied'],
        ['overt research', 'research where participants know they are studied'],
        ['a sample', 'the people actually studied'],
        ['a sampling frame', 'the list a sample is drawn from'],
        ['random sampling', 'drawing a sample by chance'],
        ['stratified sampling', 'sampling in proportion to groups in the population'],
        ['snowball sampling', 'building a sample through participants’ contacts'],
        ['representativeness', 'how far a sample reflects the population'],
        ['the Hawthorne effect', 'the change in behaviour caused by being studied'],
        ['triangulation', 'combining methods to check findings against each other']
      ],
      truths: [
        'Questionnaires produce comparable data but can miss meaning.',
        'Covert observation raises consent problems that overt observation does not.',
        'A sample can be large and still be unrepresentative.',
        'Being studied changes behaviour, which is the Hawthorne effect.',
        'Triangulation uses the strengths of one method to offset the weaknesses of another.'
      ],
      myths: [
        'Qualitative data is just opinion and cannot be analysed.',
        'A big sample is automatically representative.',
        'Official statistics are neutral facts with no decisions behind them.',
        'Participant observation gives the researcher no influence on the group.',
        'Structured and unstructured interviews collect the same kind of data.'
      ],
      applications: [
        ['Data collected by someone else is called what?', 'secondary data'],
        ['Sampling in proportion to groups in the population is called what?', 'stratified sampling'],
        ['Research where participants do not know they are studied is called what?', 'covert research'],
        ['The change in behaviour caused by being studied is called what?', 'the Hawthorne effect'],
        ['Combining methods to check findings is called what?', 'triangulation']
      ]
    }
  ]
};
