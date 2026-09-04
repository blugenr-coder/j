/* Named topics across the arts, health, media and the social sciences.

   These subjects were the ones still leaning on broad titles. A student
   revises "Memory: Models, Forgetting and Recall" or "The Impressionists" —
   not "psychology practice" — and a teacher searching the library types the
   topic, not the subject. Each unit here is named for the thing itself. */

export const CULTURE_UNITS = {
  /* =================================== arts ================================== */
  'art-history': [
    {
      name: 'The Impressionists', from: 'Grade 6', to: 'College',
      facts: [
        ['Impressionism', 'the movement that painted light and momentary effects'],
        ['Claude Monet', 'the painter of the Water Lilies and Rouen Cathedral series'],
        ['Edgar Degas', 'the Impressionist known for dancers and unusual viewpoints'],
        ['Berthe Morisot', 'a founding Impressionist who exhibited in the first show of 1874'],
        ['Pierre-Auguste Renoir', 'the Impressionist of crowded, sunlit social scenes'],
        ['en plein air', 'painting outdoors, in front of the subject'],
        ['a broken brushstroke', 'a short, visible dab of unblended colour'],
        ['a palette', 'the range of colours a painter works with'],
        ['complementary colours', 'opposite colours that intensify each other side by side'],
        ['the Salon', 'the official French exhibition the Impressionists were rejected from'],
        ['the Salon des Refusés', 'the 1863 exhibition of works the Salon turned down'],
        ['a series', 'the same subject painted repeatedly under different light'],
        ['Post-Impressionism', 'the movement that followed, pushing colour and form further'],
        ['Vincent van Gogh', 'the Post-Impressionist of thick, directional brushwork'],
        ['Paul Cézanne', 'the Post-Impressionist who built form from planes of colour'],
        ['a composition', 'the arrangement of elements within a picture'],
        ['a cropped edge', 'a subject cut off by the frame, borrowed from photography'],
        ['a Japanese print', 'the flat, cropped source that influenced the movement'],
        ['tonal contrast', 'the difference between light and dark areas'],
        ['a preparatory sketch', 'the quick study made before a finished painting']
      ],
      truths: [
        'The Impressionists were rejected by the official Salon and exhibited independently from 1874.',
        'Painting en plein air was made practical by paint sold in metal tubes.',
        'Monet painted the same subject repeatedly to record changing light, not to correct it.',
        'Berthe Morisot exhibited in the first Impressionist exhibition of 1874.',
        'Impressionist shadows are usually coloured rather than grey or black.'
      ],
      myths: [
        'The Impressionists worked only in a studio from memory.',
        'Impressionism and Post-Impressionism are two names for one movement.',
        'Visible brushstrokes mean a painting was unfinished.',
        'The Salon welcomed the Impressionists from the start.',
        'Van Gogh was a founding member of the Impressionist group.'
      ],
      applications: [
        ['A painter works outdoors in front of the subject. What is that called?', 'en plein air'],
        ['Which painter made repeated studies of Rouen Cathedral?', 'Claude Monet'],
        ['Which 1863 exhibition showed work the Salon rejected?', 'the Salon des Refusés'],
        ['Which movement followed Impressionism?', 'Post-Impressionism'],
        ['Which Impressionist is known above all for dancers?', 'Edgar Degas']
      ]
    },
    {
      name: 'Renaissance Art in Italy', from: 'Grade 6', to: 'College',
      facts: [
        ['the Renaissance', 'the rebirth of classical learning and art from the 1400s'],
        ['linear perspective', 'the system that makes parallel lines meet at a vanishing point'],
        ['a vanishing point', 'the point on the horizon where receding lines converge'],
        ['a horizon line', 'the eye-level line in a perspective drawing'],
        ['foreshortening', 'drawing an object shortened because it points towards the viewer'],
        ['chiaroscuro', 'strong contrast between light and shadow to model form'],
        ['sfumato', 'the soft, smoky blending of edges'],
        ['a fresco', 'a painting made into wet plaster on a wall'],
        ['tempera', 'paint bound with egg, used before oil became common'],
        ['Leonardo da Vinci', 'the painter of the Last Supper and the Mona Lisa'],
        ['Michelangelo', 'the sculptor of David and painter of the Sistine Chapel ceiling'],
        ['Raphael', 'the painter of the School of Athens'],
        ['Donatello', 'the sculptor who revived the free-standing nude in bronze'],
        ['Brunelleschi', 'the architect of the dome of Florence Cathedral'],
        ['a patron', 'the person or family who paid for a work'],
        ['the Medici', 'the Florentine banking family who funded much Renaissance art'],
        ['a commission', 'a work ordered and paid for in advance'],
        ['humanism', 'the movement placing human experience at the centre of study'],
        ['a contrapposto pose', 'a standing figure with weight on one leg, shoulders counter-turned'],
        ['an altarpiece', 'a painted panel made for the altar of a church']
      ],
      truths: [
        'Linear perspective gives a painting a single fixed viewpoint.',
        'Fresco paint is applied while the plaster is still wet, so the work must be planned in daily sections.',
        'Patrons shaped what was painted, and often appear inside the paintings.',
        'Brunelleschi is credited with demonstrating linear perspective in Florence.',
        'Michelangelo considered himself a sculptor even while painting the Sistine ceiling.'
      ],
      myths: [
        'Renaissance painters worked alone without workshops or assistants.',
        'Fresco is painted onto dry plaster.',
        'Perspective was invented by Leonardo da Vinci.',
        'Renaissance art was made for its own sake, without patrons.',
        'Sfumato and chiaroscuro mean the same thing.'
      ],
      applications: [
        ['Where do receding parallel lines meet in a perspective drawing?', 'the vanishing point'],
        ['Which technique blends edges into soft smoke?', 'sfumato'],
        ['Who designed the dome of Florence Cathedral?', 'Brunelleschi'],
        ['Which family were the great Florentine patrons?', 'the Medici'],
        ['A painting made into wet plaster is called what?', 'a fresco']
      ]
    }
  ],
  'music-theory': [
    {
      name: 'Reading Music: Notes, Rests and Rhythm', from: 'Grade 2', to: 'Grade 9',
      facts: [
        ['a stave', 'the five lines music is written on'],
        ['a treble clef', 'the sign fixing G on the second line'],
        ['a bass clef', 'the sign fixing F on the fourth line'],
        ['a bar', 'a group of beats between two barlines'],
        ['a barline', 'the vertical line dividing bars'],
        ['a time signature', 'the pair of numbers giving beats per bar and their value'],
        ['a semibreve', 'a note lasting four beats in common time'],
        ['a minim', 'a note lasting two beats'],
        ['a crotchet', 'a note lasting one beat'],
        ['a quaver', 'a note lasting half a beat'],
        ['a rest', 'a written silence'],
        ['a dotted note', 'a note lengthened by half its own value again'],
        ['a tie', 'a curve joining two notes of the same pitch into one longer sound'],
        ['a pitch', 'how high or low a note sounds'],
        ['a ledger line', 'a short extra line for notes above or below the stave'],
        ['a sharp', 'the sign raising a note by a semitone'],
        ['a flat', 'the sign lowering a note by a semitone'],
        ['a natural', 'the sign cancelling a sharp or flat'],
        ['a tempo marking', 'the instruction giving the speed of the music'],
        ['a dynamic marking', 'the instruction giving how loud to play']
      ],
      truths: [
        'A dot after a note adds half of that note’s value again.',
        'In 4/4 time there are four crotchet beats in every bar.',
        'A tie joins two notes of the same pitch; a slur joins different ones.',
        'Ledger lines extend the stave for notes that will not fit on it.',
        'A rest is counted just as carefully as a note.'
      ],
      myths: [
        'A rest means you can stop counting.',
        'A dot after a note makes it twice as long.',
        'The top number of a time signature tells you the tempo.',
        'A sharp raises a note by a whole tone.',
        'Treble and bass clef place the notes on the same lines.'
      ],
      applications: [
        ['How many beats is a dotted minim?', '3'],
        ['How many crotchet beats are in a bar of 3/4?', '3'],
        ['Which sign cancels a sharp?', 'a natural'],
        ['Two quavers last as long as which note?', 'a crotchet'],
        ['What are the short lines above the stave called?', 'ledger lines']
      ]
    },
    {
      name: 'The Orchestra and Its Instrument Families', from: 'Grade 2', to: 'Grade 9',
      facts: [
        ['the strings', 'the family played with a bow or plucked'],
        ['the woodwind', 'the family played by blowing through a tube with holes or keys'],
        ['the brass', 'the family played by buzzing the lips into a mouthpiece'],
        ['the percussion', 'the family played by striking, shaking or scraping'],
        ['a violin', 'the highest-pitched orchestral string instrument'],
        ['a viola', 'the string instrument pitched below the violin'],
        ['a cello', 'the string instrument played resting on the floor'],
        ['a double bass', 'the lowest of the orchestral strings'],
        ['a flute', 'the woodwind played by blowing across a hole'],
        ['a clarinet', 'the woodwind with a single reed'],
        ['an oboe', 'the woodwind with a double reed'],
        ['a bassoon', 'the lowest common double-reed woodwind'],
        ['a trumpet', 'the highest common brass instrument'],
        ['a trombone', 'the brass instrument with a sliding tube'],
        ['a French horn', 'the coiled brass instrument played with the hand in the bell'],
        ['a tuba', 'the lowest brass instrument'],
        ['a timpani', 'the tuned orchestral kettle drums'],
        ['a conductor', 'the musician who directs the orchestra'],
        ['a section leader', 'the principal player of a group of instruments'],
        ['a score', 'the book showing every instrument’s part at once']
      ],
      truths: [
        'A flute is woodwind even though modern flutes are made of metal.',
        'Brass instruments are sounded by the player’s buzzing lips, not a reed.',
        'Timpani are tuned to definite pitches; a snare drum is not.',
        'The double bass is the lowest of the string family.',
        'The conductor sets the tempo and balances the sections.'
      ],
      myths: [
        'Instruments are grouped by what they are made of.',
        'A saxophone is brass because it is made of brass.',
        'Every drum plays a definite pitch.',
        'The violin and viola are the same size and tuning.',
        'The conductor plays an instrument during the performance.'
      ],
      applications: [
        ['Which family does the flute belong to?', 'woodwind'],
        ['Which brass instrument has a slide?', 'the trombone'],
        ['Which orchestral drums are tuned?', 'the timpani'],
        ['Which is the lowest string instrument?', 'the double bass'],
        ['An oboe has how many reeds in its mouthpiece?', 'two']
      ]
    }
  ],
  /* ================================== health ================================= */
  nutrition: [
    {
      name: 'Food Groups and a Balanced Plate', from: 'Grade 2', to: 'Grade 8',
      facts: [
        ['a carbohydrate', 'the nutrient that supplies most everyday energy'],
        ['a protein', 'the nutrient used for growth and repair'],
        ['a fat', 'the nutrient that stores energy and insulates'],
        ['a vitamin', 'a nutrient needed in tiny amounts for health'],
        ['a mineral', 'an element such as iron or calcium the body needs'],
        ['fibre', 'the indigestible plant material that keeps digestion moving'],
        ['water', 'the substance making up most of the body'],
        ['vitamin C', 'the vitamin found in citrus fruit, needed for healthy skin'],
        ['vitamin D', 'the vitamin made in skin in sunlight, needed for bones'],
        ['calcium', 'the mineral that strengthens bones and teeth'],
        ['iron', 'the mineral needed to make haemoglobin'],
        ['a balanced diet', 'a diet with the right amounts of every nutrient'],
        ['a portion', 'the amount of a food eaten at one time'],
        ['a food label', 'the printed table of what a product contains'],
        ['a calorie', 'a unit of the energy a food provides'],
        ['a starchy food', 'bread, rice, pasta or potatoes'],
        ['a saturated fat', 'the fat found mostly in animal products'],
        ['an unsaturated fat', 'the fat found in oils, nuts and fish'],
        ['a deficiency', 'the illness caused by too little of a nutrient'],
        ['hydration', 'having enough water in the body']
      ],
      truths: [
        'A balanced diet needs every nutrient group, not the removal of one.',
        'Scurvy is caused by a lack of vitamin C.',
        'Fibre is not digested but is still needed.',
        'Fat is an essential nutrient, not simply something to avoid.',
        'Vitamin D is made in the skin in sunlight as well as eaten.'
      ],
      myths: [
        'All fat is unhealthy.',
        'Carbohydrates alone make people gain weight.',
        'Vitamins give the body energy.',
        'Fresh food is always more nutritious than frozen.',
        'Skipping meals is a reliable way to be healthier.'
      ],
      applications: [
        ['Which nutrient is used for growth and repair?', 'protein'],
        ['A lack of vitamin C causes which illness?', 'scurvy'],
        ['Which mineral is needed to make haemoglobin?', 'iron'],
        ['Which nutrient keeps digestion moving but is not digested?', 'fibre'],
        ['Which vitamin is made in the skin in sunlight?', 'vitamin D']
      ]
    }
  ],
  anatomy: [
    {
      name: 'The Skeleton, Joints and Muscles', from: 'Grade 2', to: 'Grade 9',
      facts: [
        ['a skeleton', 'the framework of bones supporting the body'],
        ['a skull', 'the bone case protecting the brain'],
        ['a rib cage', 'the bones protecting the heart and lungs'],
        ['a vertebra', 'one of the bones of the spine'],
        ['a femur', 'the thigh bone, the longest in the body'],
        ['a humerus', 'the upper arm bone'],
        ['a pelvis', 'the ring of bone at the base of the spine'],
        ['a joint', 'the place where two bones meet'],
        ['a hinge joint', 'a joint bending one way, like the elbow'],
        ['a ball and socket joint', 'a joint moving in many directions, like the shoulder'],
        ['a fixed joint', 'a joint that does not move, as in the skull'],
        ['cartilage', 'the smooth tissue cushioning the ends of bones'],
        ['a ligament', 'the tissue joining bone to bone'],
        ['a tendon', 'the tissue joining muscle to bone'],
        ['a muscle', 'the tissue that contracts to move the body'],
        ['to contract', 'to shorten and pull'],
        ['an antagonistic pair', 'two muscles working against each other'],
        ['the biceps', 'the muscle that bends the elbow'],
        ['the triceps', 'the muscle that straightens the elbow'],
        ['bone marrow', 'the tissue inside bones where blood cells are made']
      ],
      truths: [
        'Muscles can only pull, never push, so they work in antagonistic pairs.',
        'Tendons join muscle to bone; ligaments join bone to bone.',
        'The elbow is a hinge joint and the shoulder is a ball and socket joint.',
        'Red blood cells are made in bone marrow.',
        'When the biceps contracts, the triceps relaxes.'
      ],
      myths: [
        'Muscles push bones back into place.',
        'Bones are solid all the way through and not alive.',
        'Ligaments and tendons are two words for the same tissue.',
        'Every joint in the body moves.',
        'Cartilage is a kind of bone.'
      ],
      applications: [
        ['Which muscle straightens the elbow?', 'the triceps'],
        ['What joins a muscle to a bone?', 'a tendon'],
        ['What kind of joint is the shoulder?', 'a ball and socket joint'],
        ['Where are red blood cells made?', 'in bone marrow'],
        ['Which is the longest bone in the body?', 'the femur']
      ]
    }
  ],
  fitness: [
    {
      name: 'Warm-ups, Cool-downs and Sports Injury', from: 'Grade 5', to: 'College',
      facts: [
        ['a warm-up', 'the activity that prepares the body for exercise'],
        ['a pulse raiser', 'the gentle activity that lifts heart rate at the start'],
        ['a dynamic stretch', 'a stretch performed while moving'],
        ['a static stretch', 'a stretch held still'],
        ['a cool-down', 'the gradual activity that returns the body to rest'],
        ['a sprain', 'an injury to a ligament'],
        ['a strain', 'an injury to a muscle or tendon'],
        ['RICE', 'rest, ice, compression, elevation'],
        ['a fracture', 'a break in a bone'],
        ['a dislocation', 'a bone forced out of its joint'],
        ['a concussion', 'a brain injury caused by a blow to the head'],
        ['lactic acid', 'the substance building up in muscles during hard effort'],
        ['oxygen debt', 'the extra oxygen needed after intense exercise'],
        ['a heart rate', 'the number of beats a minute'],
        ['a target zone', 'the heart rate range that trains the body effectively'],
        ['overtraining', 'training too hard without enough recovery'],
        ['recovery', 'the rest that lets the body adapt to training'],
        ['a training principle', 'a rule such as overload or specificity'],
        ['overload', 'working harder than usual so the body adapts'],
        ['specificity', 'training in the way the sport actually demands']
      ],
      truths: [
        'A warm-up raises muscle temperature and reduces injury risk.',
        'A sprain affects a ligament; a strain affects a muscle or tendon.',
        'RICE stands for rest, ice, compression and elevation.',
        'Adaptation happens during recovery, not during the session itself.',
        'Static stretching is better suited to the cool-down than the warm-up.'
      ],
      myths: [
        'Stretching cold muscles is the safest way to start.',
        'Muscle soreness the next day means the session was wasted.',
        'You should train hard every day to improve fastest.',
        'A sprain and a strain are the same injury.',
        'Heat should be applied to a fresh sprain immediately.'
      ],
      sequences: [
        ['A safe warm-up', [
          'Start with a gentle pulse raiser such as jogging',
          'Add mobility work through the joints to be used',
          'Move into dynamic stretches',
          'Build to sport-specific movements at pace',
          'Begin the session while still warm'
        ]]
      ],
      applications: [
        ['A player twists an ankle ligament. Sprain or strain?', 'a sprain'],
        ['What does the C in RICE stand for?', 'compression'],
        ['Which stretch type suits a cool-down?', 'static'],
        ['Training harder than usual so the body adapts is which principle?', 'overload'],
        ['When does the body actually adapt to training?', 'during recovery']
      ]
    }
  ],
  /* ================================== media ================================== */
  media: [
    {
      name: 'Advertising: Persuasion, Audience and Ethics', from: 'Grade 6', to: 'College',
      facts: [
        ['a target audience', 'the group an advert is aimed at'],
        ['demographics', 'the measurable facts about an audience, such as age'],
        ['a slogan', 'the short memorable phrase attached to a brand'],
        ['a brand', 'the identity a product is sold under'],
        ['a call to action', 'the instruction telling the audience what to do next'],
        ['a testimonial', 'an endorsement from a user or celebrity'],
        ['a bandwagon appeal', 'the suggestion that everyone else is already buying'],
        ['an emotional appeal', 'persuasion aimed at feelings rather than facts'],
        ['a rational appeal', 'persuasion using evidence and figures'],
        ['a unique selling point', 'the one thing a product claims no rival has'],
        ['product placement', 'a paid appearance of a product inside other content'],
        ['sponsored content', 'advertising written to look like editorial'],
        ['an influencer', 'a person paid to promote a product to their following'],
        ['a disclosure', 'the required statement that content is paid for'],
        ['a weasel word', 'a vague qualifier such as "helps" that avoids a firm claim'],
        ['a small print claim', 'the qualification printed too small to be read easily'],
        ['a regulator', 'the body that rules on whether an advert is misleading'],
        ['a stereotype', 'a fixed oversimplified image of a group'],
        ['a media text', 'any produced item a media course analyses'],
        ['an impression', 'one recorded view of an online advert']
      ],
      truths: [
        'Paid content must be disclosed as such under advertising codes in most countries.',
        'A weasel word makes a claim feel stronger without making it testable.',
        'Adverts are made for a target audience, and analysis starts by identifying it.',
        'Product placement is paid for, whether or not the product is mentioned aloud.',
        'A regulator can require an advert to be withdrawn for being misleading.'
      ],
      myths: [
        'If a claim appears on television it must have been proved.',
        'Influencer posts are just personal opinions with no rules attached.',
        'Every advert is aimed at everybody.',
        'A slogan is legally a promise.',
        'Sponsored content is written by journalists independently.'
      ],
      applications: [
        ['"Nine out of ten owners said" — which appeal is this?', 'a rational appeal'],
        ['A shampoo "helps reduce" damage. What kind of word is "helps"?', 'a weasel word'],
        ['What is the instruction "Order today" called?', 'a call to action'],
        ['Who must state that a post is paid for?', 'the influencer'],
        ['The group an advert is aimed at is called what?', 'the target audience']
      ]
    }
  ],
  /* =============================== philosophy ================================ */
  philosophy: [
    {
      name: 'Logical Fallacies and Faulty Reasoning', from: 'Grade 8', to: 'College',
      facts: [
        ['a fallacy', 'a pattern of reasoning that does not support its conclusion'],
        ['an ad hominem', 'attacking the person instead of the argument'],
        ['a straw man', 'attacking a weakened version of the opponent’s claim'],
        ['a false dilemma', 'presenting two options when more exist'],
        ['a slippery slope', 'claiming one step must lead to an extreme outcome'],
        ['begging the question', 'assuming in the premises what the conclusion asserts'],
        ['circular reasoning', 'supporting a claim with a restatement of itself'],
        ['an appeal to authority', 'treating a source as decisive outside its expertise'],
        ['an appeal to popularity', 'treating wide belief as proof'],
        ['an appeal to ignorance', 'treating a lack of disproof as proof'],
        ['a hasty generalisation', 'drawing a general rule from too few cases'],
        ['a false cause', 'treating correlation as if it were causation'],
        ['equivocation', 'shifting the meaning of a word mid-argument'],
        ['a red herring', 'a distraction that changes the subject'],
        ['a premise', 'a statement offered in support of a conclusion'],
        ['a conclusion', 'the claim an argument is trying to establish'],
        ['validity', 'the property of a conclusion following from the premises'],
        ['soundness', 'validity plus true premises'],
        ['a counterexample', 'a case that shows a general claim to be false'],
        ['a burden of proof', 'the duty to support a claim you have made']
      ],
      truths: [
        'A valid argument can still have a false conclusion if a premise is false.',
        'The burden of proof sits with whoever makes the claim.',
        'Correlation is not causation; a third factor may explain both.',
        'One counterexample is enough to refute a universal claim.',
        'An argument can be fallacious and its conclusion still happen to be true.'
      ],
      myths: [
        'Spotting a fallacy proves the conclusion is false.',
        'A valid argument is automatically a true one.',
        'If nobody has disproved a claim, it stands.',
        'Attacking someone’s motives is a legitimate refutation.',
        'If many people believe something, that is evidence for it.'
      ],
      applications: [
        ['"You would say that, you work for them." Which fallacy?', 'an ad hominem'],
        ['"Either we ban it or society collapses." Which fallacy?', 'a false dilemma'],
        ['Ice cream sales and drownings rise together. What error is claiming one causes the other?', 'false cause'],
        ['A valid argument with true premises is called what?', 'sound'],
        ['Who carries the burden of proof?', 'whoever makes the claim']
      ]
    }
  ],
  religions: [
    {
      name: 'Festivals of the World Religions', from: 'Grade 4', to: 'College',
      facts: [
        ['Diwali', 'the Hindu, Jain and Sikh festival of lights'],
        ['Holi', 'the Hindu spring festival of colour'],
        ['Eid al-Fitr', 'the Muslim festival marking the end of Ramadan'],
        ['Ramadan', 'the Islamic month of fasting from dawn to sunset'],
        ['Eid al-Adha', 'the Muslim festival of sacrifice during the Hajj season'],
        ['Passover', 'the Jewish festival remembering the exodus from Egypt'],
        ['Yom Kippur', 'the Jewish day of atonement'],
        ['Rosh Hashanah', 'the Jewish new year'],
        ['Hanukkah', 'the Jewish festival of lights lasting eight nights'],
        ['Christmas', 'the Christian festival of the birth of Jesus'],
        ['Easter', 'the Christian festival of the resurrection'],
        ['Lent', 'the forty days of Christian preparation before Easter'],
        ['Vesak', 'the Buddhist festival of the Buddha’s birth, enlightenment and death'],
        ['Vaisakhi', 'the Sikh festival marking the founding of the Khalsa'],
        ['a lunar calendar', 'a calendar counted by months of the Moon'],
        ['a pilgrimage', 'a journey made to a sacred place'],
        ['the Hajj', 'the Muslim pilgrimage to Mecca'],
        ['a fast', 'a period of going without food for religious reasons'],
        ['a rite of passage', 'a ceremony marking a stage of life'],
        ['a scripture', 'the sacred writing of a tradition']
      ],
      truths: [
        'Ramadan moves through the seasons because the Islamic calendar is lunar.',
        'Diwali is celebrated by Hindus, Jains and Sikhs, for different reasons.',
        'Passover commemorates the exodus from Egypt.',
        'Vaisakhi marks the founding of the Khalsa in 1699.',
        'Easter falls on a different date each year because it is set by the lunar calendar.'
      ],
      myths: [
        'Every religion uses the same calendar for its festivals.',
        'Diwali belongs to one religion only.',
        'Ramadan is a single day of fasting.',
        'Christmas and Easter are fixed to the same date in every tradition.',
        'A pilgrimage and a festival are the same thing.'
      ],
      applications: [
        ['Which festival marks the end of Ramadan?', 'Eid al-Fitr'],
        ['Which Jewish festival remembers the exodus from Egypt?', 'Passover'],
        ['Which Sikh festival marks the founding of the Khalsa?', 'Vaisakhi'],
        ['Which Buddhist festival marks the Buddha’s birth and enlightenment?', 'Vesak'],
        ['Which pilgrimage is made to Mecca?', 'the Hajj']
      ]
    }
  ],
  /* ================================ psychology =============================== */
  psychology: [
    {
      name: 'Memory: Models, Forgetting and Recall', from: 'Grade 9', to: 'College',
      facts: [
        ['sensory memory', 'the very brief store holding raw sensory input'],
        ['short-term memory', 'the limited store holding information for seconds'],
        ['long-term memory', 'the store holding information indefinitely'],
        ['encoding', 'turning information into a form memory can store'],
        ['storage', 'holding information over time'],
        ['retrieval', 'getting stored information back out'],
        ['the multi-store model', 'the model of sensory, short-term and long-term stores'],
        ['working memory', 'the model of short-term memory as several active components'],
        ['the phonological loop', 'the working memory component handling sound'],
        ['the visuospatial sketchpad', 'the working memory component handling images'],
        ['episodic memory', 'memory for personally experienced events'],
        ['semantic memory', 'memory for facts and meanings'],
        ['procedural memory', 'memory for how to perform actions'],
        ['rehearsal', 'repeating information to keep or transfer it'],
        ['chunking', 'grouping items so more fit in short-term memory'],
        ['interference', 'forgetting caused by other memories competing'],
        ['a retrieval cue', 'a prompt that helps bring a memory back'],
        ['context-dependent forgetting', 'failing to recall because the setting has changed'],
        ['the serial position effect', 'better recall of the first and last items in a list'],
        ['a leading question', 'a question phrased so it shapes the answer']
      ],
      truths: [
        'Short-term memory has a limited capacity, often given as about seven items.',
        'Chunking increases how much can be held without increasing the number of items.',
        'The serial position effect gives better recall for the start and end of a list.',
        'Leading questions can alter what an eyewitness later reports.',
        'Retrieval failure is a different explanation of forgetting from interference.'
      ],
      myths: [
        'Memory records events like a video and plays them back unchanged.',
        'Long-term memory has a known, fixed capacity limit.',
        'Forgetting always means the memory has been erased.',
        'Confidence in a memory is a reliable guide to its accuracy.',
        'Rehearsing information once guarantees it moves to long-term memory.'
      ],
      applications: [
        ['Which memory store holds facts and meanings?', 'semantic memory'],
        ['Grouping digits into threes to remember a number is called what?', 'chunking'],
        ['Which effect explains better recall of the first list items?', 'the serial position effect'],
        ['Which working memory component handles sound?', 'the phonological loop'],
        ['A question phrased to shape the answer is called what?', 'a leading question']
      ]
    }
  ],
  sociology: [
    {
      name: 'Family, Household and Social Change', from: 'Grade 9', to: 'College',
      facts: [
        ['a nuclear family', 'two parents and their children in one household'],
        ['an extended family', 'a household including relatives beyond parents and children'],
        ['a household', 'the people living together at one address'],
        ['a lone-parent family', 'one parent raising children'],
        ['a reconstituted family', 'a family formed from parts of previous families'],
        ['a beanpole family', 'a family long in generations but narrow in each one'],
        ['socialisation', 'learning the norms and values of a society'],
        ['primary socialisation', 'the first learning of norms, within the family'],
        ['secondary socialisation', 'later learning through school, work and media'],
        ['a norm', 'an expected pattern of behaviour'],
        ['a value', 'a belief about what matters in a society'],
        ['a role', 'the behaviour expected of a position in society'],
        ['a conjugal role', 'the division of tasks between partners'],
        ['a symmetrical family', 'a family where partners share tasks more equally'],
        ['patriarchy', 'a social system organised around male authority'],
        ['a divorce rate', 'the number of divorces per thousand married people'],
        ['secularisation', 'the declining social influence of religion'],
        ['an ageing population', 'a population with a rising average age'],
        ['a birth rate', 'live births per thousand people per year'],
        ['a life expectancy', 'the average years a person is expected to live']
      ],
      truths: [
        'A household is not the same unit as a family.',
        'Primary socialisation happens in the family; secondary socialisation happens beyond it.',
        'A rising divorce rate can reflect changes in law as well as in relationships.',
        'An ageing population follows from lower birth rates and longer life expectancy together.',
        'Family structures vary between societies and across time.'
      ],
      myths: [
        'The nuclear family is the natural and universal family form.',
        'A rising divorce rate proves that marriages have become unhappier.',
        'Everyone living at one address is by definition a family.',
        'Socialisation stops when childhood ends.',
        'An ageing population is caused by people simply choosing to live longer.'
      ],
      applications: [
        ['Two parents and their children form which family type?', 'a nuclear family'],
        ['Learning norms first within the family is called what?', 'primary socialisation'],
        ['A family formed from parts of previous families is called what?', 'reconstituted'],
        ['Live births per thousand people per year is which measure?', 'the birth rate'],
        ['The declining social influence of religion is called what?', 'secularisation']
      ]
    }
  ],
  /* =============================== money and make ============================ */
  finance: [
    {
      name: 'Payslips, Tax and Take-Home Pay', from: 'Grade 8', to: 'College',
      facts: [
        ['gross pay', 'pay before any deductions'],
        ['net pay', 'pay after deductions, the amount actually received'],
        ['a deduction', 'an amount taken from gross pay'],
        ['income tax', 'the tax charged on earnings'],
        ['a tax allowance', 'the amount of income taxed at zero'],
        ['a tax band', 'a range of income taxed at one rate'],
        ['a marginal rate', 'the rate charged on the next unit of income'],
        ['national insurance', 'the contribution funding state benefits and pensions'],
        ['a pension contribution', 'money set aside from pay towards retirement'],
        ['a payslip', 'the statement of pay and deductions'],
        ['a tax code', 'the code telling an employer how much to leave untaxed'],
        ['an hourly rate', 'pay for each hour worked'],
        ['overtime', 'hours worked beyond the normal week, often paid at a higher rate'],
        ['a salary', 'a fixed annual amount paid in equal instalments'],
        ['a tax year', 'the twelve-month period tax is calculated over'],
        ['a tax return', 'the declaration of income made to the tax authority'],
        ['a student loan repayment', 'a deduction taken once earnings pass a threshold'],
        ['a threshold', 'the income level at which a charge begins'],
        ['a bonus', 'an extra payment on top of normal pay'],
        ['a benefit in kind', 'a non-cash perk that may still be taxed']
      ],
      truths: [
        'Net pay is gross pay minus every deduction.',
        'Only income above the allowance is taxed.',
        'A higher tax band applies to the income within it, not to all earnings.',
        'National insurance is a separate deduction from income tax.',
        'A pension contribution reduces take-home pay but is not lost money.'
      ],
      myths: [
        'Earning one pound into a higher band cuts your whole take-home pay.',
        'Gross pay is what lands in your bank account.',
        'Income tax and national insurance are the same deduction.',
        'A bonus is tax free.',
        'A student loan is repaid at the same rate regardless of earnings.'
      ],
      applications: [
        ['Gross pay is 2,000 and deductions are 450. What is net pay?', '1550'],
        ['Which deduction funds state pensions and benefits?', 'national insurance'],
        ['Income taxed at zero up to a limit is called what?', 'a tax allowance'],
        ['The rate charged on the next pound earned is called what?', 'the marginal rate'],
        ['What document shows pay and deductions each month?', 'a payslip']
      ]
    }
  ],
  design: [
    {
      name: 'Bridges, Beams and Structures', from: 'Grade 6', to: 'College',
      facts: [
        ['a beam', 'a horizontal member carrying a load across a span'],
        ['a span', 'the distance a structure crosses unsupported'],
        ['a support', 'the point a structure rests on'],
        ['compression', 'a squeezing force'],
        ['tension', 'a stretching force'],
        ['a truss', 'a framework of triangles carrying a load'],
        ['a triangle', 'the rigid shape a truss is built from'],
        ['a beam bridge', 'the simplest bridge, a deck on supports'],
        ['an arch bridge', 'a bridge carrying load in compression along a curve'],
        ['a suspension bridge', 'a bridge whose deck hangs from cables in tension'],
        ['a cable-stayed bridge', 'a bridge with cables running straight to the towers'],
        ['a cantilever', 'a beam fixed at one end and free at the other'],
        ['a load', 'the force a structure has to carry'],
        ['a dead load', 'the weight of the structure itself'],
        ['a live load', 'the changing weight of traffic, people or wind'],
        ['a foundation', 'the part transferring load into the ground'],
        ['a pier', 'an intermediate support between spans'],
        ['an abutment', 'the end support taking the thrust of an arch'],
        ['stiffness', 'resistance to bending under load'],
        ['a factor of safety', 'the margin between the load allowed and the load that would fail']
      ],
      truths: [
        'A triangle is rigid; a rectangle of the same members can rack.',
        'A suspension bridge carries its deck load mainly in tension.',
        'An arch carries load mainly in compression and pushes outwards at its ends.',
        'Dead load is the structure’s own weight; live load changes with use.',
        'Increasing the depth of a beam raises its stiffness far more than widening it.'
      ],
      myths: [
        'A stronger material always means a stronger structure whatever the shape.',
        'A suspension bridge holds its deck up by pushing from below.',
        'A rectangle is as rigid as a triangle if the joints are tight.',
        'The factor of safety is the load a bridge is expected to carry.',
        'An arch pushes only downwards on its supports.'
      ],
      applications: [
        ['Which bridge type carries the deck on cables in tension?', 'a suspension bridge'],
        ['Which shape makes a truss rigid?', 'the triangle'],
        ['A squeezing force is called what?', 'compression'],
        ['The weight of the structure itself is which load?', 'the dead load'],
        ['A beam fixed at one end and free at the other is called what?', 'a cantilever']
      ]
    }
  ],
  climate: [
    {
      name: 'Renewable and Non-renewable Energy', from: 'Grade 5', to: 'College',
      facts: [
        ['a renewable resource', 'an energy source that is replenished as it is used'],
        ['a non-renewable resource', 'an energy source that runs down as it is used'],
        ['a fossil fuel', 'coal, oil or natural gas, formed from ancient organisms'],
        ['coal', 'the solid fossil fuel formed from ancient plants'],
        ['natural gas', 'the fossil fuel burned in many power stations and homes'],
        ['nuclear power', 'electricity generated from the fission of uranium'],
        ['solar power', 'electricity or heat taken from sunlight'],
        ['a photovoltaic cell', 'the device converting light directly into electricity'],
        ['wind power', 'electricity generated by turbines driven by moving air'],
        ['hydroelectric power', 'electricity generated by falling or flowing water'],
        ['tidal power', 'electricity generated from the rise and fall of the sea'],
        ['geothermal power', 'energy taken from heat inside the Earth'],
        ['biomass', 'fuel made from recently living material'],
        ['a carbon footprint', 'the greenhouse gas emitted by an activity'],
        ['the greenhouse effect', 'the trapping of heat by gases in the atmosphere'],
        ['carbon dioxide', 'the main greenhouse gas released by burning fuels'],
        ['an emission', 'a gas released into the atmosphere'],
        ['an energy mix', 'the combination of sources a country generates from'],
        ['reliability', 'how dependably a source can supply when needed'],
        ['efficiency', 'the useful energy out as a share of the energy in']
      ],
      truths: [
        'Nuclear power is non-renewable but produces almost no carbon dioxide in generation.',
        'Wind and solar are renewable but intermittent, so supply varies.',
        'Fossil fuels formed over millions of years, so they cannot be replaced on a human timescale.',
        'Hydroelectric power is renewable and can be switched on quickly.',
        'A country’s energy mix trades cost, reliability and emissions against each other.'
      ],
      myths: [
        'Nuclear power is renewable because uranium lasts a long time.',
        'Renewable means the source has no environmental cost at all.',
        'Solar panels only work in hot countries.',
        'Burning biomass releases no carbon dioxide at all.',
        'A single renewable source could supply a grid with no storage or backup.'
      ],
      applications: [
        ['Is nuclear power renewable?', 'no'],
        ['Which device turns light directly into electricity?', 'a photovoltaic cell'],
        ['Which renewable source uses the rise and fall of the sea?', 'tidal power'],
        ['Which gas is the main product of burning fossil fuels?', 'carbon dioxide'],
        ['Which renewable source can be switched on quickly to meet demand?', 'hydroelectric power']
      ]
    }
  ],
  safety: [
    {
      name: 'First Aid: DRABC and the Recovery Position', from: 'Grade 6', to: 'College',
      facts: [
        ['DRABC', 'danger, response, airway, breathing, circulation'],
        ['danger', 'the first check: is the scene safe to approach'],
        ['a response', 'whether the casualty reacts to voice or touch'],
        ['an airway', 'the passage air travels to the lungs'],
        ['the recovery position', 'the position keeping an unconscious breathing casualty’s airway open'],
        ['CPR', 'chest compressions and rescue breaths'],
        ['a chest compression', 'the push on the breastbone that circulates blood'],
        ['a defibrillator', 'the device delivering a shock to restart a normal heart rhythm'],
        ['an emergency number', 'the number called for an ambulance'],
        ['a casualty', 'the injured or ill person'],
        ['bleeding', 'blood escaping from a wound'],
        ['direct pressure', 'pressing on a wound to slow bleeding'],
        ['a dressing', 'the covering placed over a wound'],
        ['shock', 'the dangerous fall in circulation after serious injury'],
        ['a burn', 'skin damage from heat, chemicals or electricity'],
        ['cool running water', 'the first treatment for a burn'],
        ['choking', 'a blocked airway preventing breathing'],
        ['a back blow', 'a sharp strike between the shoulder blades to clear choking'],
        ['an abdominal thrust', 'the inward and upward pull used if back blows fail'],
        ['an allergic reaction', 'the immune response that can close the airway']
      ],
      truths: [
        'Check for danger before approaching, or there may be two casualties.',
        'An unconscious casualty who is breathing goes in the recovery position.',
        'A burn is cooled with running water, not with ice or butter.',
        'Direct pressure is the first response to serious bleeding.',
        'A defibrillator gives spoken instructions and will not shock a heart that should not be shocked.'
      ],
      myths: [
        'You should move a casualty immediately to somewhere more comfortable.',
        'Only trained medical staff may use a defibrillator.',
        'A tilted-back head is the wrong thing for an unconscious casualty.',
        'Butter or ice is the right treatment for a burn.',
        'Someone who is choking and cannot speak should be left to cough it out.'
      ],
      sequences: [
        ['The primary survey', [
          'Check for danger to yourself and the casualty',
          'Check for a response to voice and touch',
          'Open and check the airway',
          'Check for normal breathing for up to ten seconds',
          'Check circulation and treat severe bleeding',
          'Call for help and begin CPR if the casualty is not breathing normally'
        ]]
      ],
      applications: [
        ['What does the D in DRABC stand for?', 'danger'],
        ['An unconscious casualty is breathing. What position?', 'the recovery position'],
        ['What is the first treatment for a burn?', 'cool running water'],
        ['What is the first response to severe bleeding?', 'direct pressure'],
        ['Back blows have failed on a choking adult. What comes next?', 'abdominal thrusts']
      ]
    }
  ]
};
