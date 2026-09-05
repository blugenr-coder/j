/* Life Skills & Careers and Art & Music, by named topic.

   The practical subjects had the broadest titles in the library, which is
   exactly wrong for them: nobody looks for "life skills practice", they look
   for "CVs and interviews", "renting and bills", "colour theory", "scales and
   key signatures". Every unit here is named for the thing it teaches. */

export const LIFE_ARTS_UNITS = {
  /* ================================== life =================================== */
  careers: [
    {
      name: 'CVs, Applications and Interviews', from: 'Grade 8', to: 'College',
      facts: [
        ['a CV', 'a summary of education, experience and skills'],
        ['a résumé', 'the shorter, role-targeted equivalent of a CV'],
        ['a covering letter', 'the letter explaining why you fit this role'],
        ['a personal statement', 'the short paragraph summarising what you offer'],
        ['a job description', 'the document setting out what a role involves'],
        ['a person specification', 'the list of qualities a candidate needs'],
        ['an essential criterion', 'a requirement a candidate must meet'],
        ['a desirable criterion', 'a requirement that helps but is not required'],
        ['a referee', 'someone who can vouch for your work'],
        ['a transferable skill', 'a skill that carries from one role to another'],
        ['work experience', 'time spent in a workplace to learn from it'],
        ['a portfolio', 'a collection of work shown to an employer'],
        ['an application form', 'the employer’s own structured application'],
        ['a competency question', 'a question asking for an example of past behaviour'],
        ['the STAR method', 'situation, task, action, result'],
        ['an interview panel', 'the group conducting an interview'],
        ['an apprenticeship', 'paid work combined with formal training'],
        ['a probation period', 'the trial period at the start of a job'],
        ['a notice period', 'the time you must work after resigning'],
        ['networking', 'building contacts who know your work']
      ],
      truths: [
        'A CV should be targeted at the person specification, not sent out unchanged.',
        'STAR answers work because they give evidence rather than claims.',
        'Essential criteria are filters; desirable criteria are tie-breakers.',
        'Most competency questions ask what you did, not what you would do.',
        'A referee should be asked before being named.'
      ],
      myths: [
        'One CV is enough for every application.',
        'A longer CV is a stronger CV.',
        'Interviews test knowledge rather than evidence of behaviour.',
        'Work experience only counts if it was paid.',
        'Naming any referee is fine without asking them.'
      ],
      sequences: [
        ['Answering a competency question with STAR', [
          'Situation: set the scene in one sentence',
          'Task: say what you were responsible for',
          'Action: describe what you actually did',
          'Result: give the outcome, with a number if you have one',
          'Add briefly what you would do differently now'
        ]]
      ],
      applications: [
        ['What does the A in STAR stand for?', 'action'],
        ['Which document lists the qualities a candidate needs?', 'the person specification'],
        ['A skill that carries from one role to another is called what?', 'a transferable skill'],
        ['The trial period at the start of a job is called what?', 'a probation period'],
        ['Paid work combined with formal training is called what?', 'an apprenticeship']
      ]
    },
    {
      name: 'Workplace Rights, Contracts and Pay', from: 'Grade 9', to: 'College',
      facts: [
        ['an employment contract', 'the agreement setting out the terms of a job'],
        ['a permanent contract', 'a contract with no fixed end date'],
        ['a fixed-term contract', 'a contract ending on a stated date'],
        ['a zero-hours contract', 'a contract with no guaranteed hours'],
        ['a minimum wage', 'the lowest legal hourly rate'],
        ['a living wage', 'a voluntary rate based on the cost of living'],
        ['gross pay', 'pay before deductions'],
        ['net pay', 'pay after deductions'],
        ['a payslip', 'the statement of pay and deductions'],
        ['annual leave', 'paid holiday entitlement'],
        ['sick pay', 'payment while unable to work through illness'],
        ['parental leave', 'time off around the birth or adoption of a child'],
        ['a working time limit', 'the legal cap on average weekly hours'],
        ['a rest break', 'the break the law requires during a shift'],
        ['discrimination', 'unfair treatment because of a protected characteristic'],
        ['a protected characteristic', 'a ground on which discrimination is unlawful'],
        ['a grievance', 'a formal complaint raised by an employee'],
        ['unfair dismissal', 'being dismissed without a fair reason or process'],
        ['redundancy', 'dismissal because the job itself is no longer needed'],
        ['a trade union', 'an organisation representing workers collectively']
      ],
      truths: [
        'A contract exists once work is agreed, whether or not anything is signed.',
        'Redundancy applies to the job, not to the person’s performance.',
        'Deductions such as tax and national insurance come out of gross pay.',
        'Rest breaks and holiday entitlement are legal minimums, not employer favours.',
        'Discrimination law covers recruitment as well as employment.'
      ],
      myths: [
        'You have no rights until you have signed a contract.',
        'A zero-hours contract means no employment rights at all.',
        'Being made redundant means being sacked for poor work.',
        'An employer can change any term of a contract at will.',
        'Holiday pay is discretionary.'
      ],
      applications: [
        ['Pay before deductions is called what?', 'gross pay'],
        ['Dismissal because the job is no longer needed is called what?', 'redundancy'],
        ['A contract with no guaranteed hours is called what?', 'a zero-hours contract'],
        ['A formal complaint raised by an employee is called what?', 'a grievance'],
        ['An organisation representing workers collectively is called what?', 'a trade union']
      ]
    }
  ],
  safety: [
    {
      name: 'Online Safety and Digital Footprints', from: 'Grade 4', to: 'College',
      facts: [
        ['a digital footprint', 'the record left by everything you do online'],
        ['personal information', 'details that identify you'],
        ['a strong password', 'a long password not reused anywhere else'],
        ['two-factor authentication', 'a second check beyond a password'],
        ['a password manager', 'software that stores unique passwords securely'],
        ['phishing', 'a message designed to trick you into giving details'],
        ['smishing', 'phishing by text message'],
        ['a scam', 'a deception aimed at taking money or data'],
        ['a privacy setting', 'the control over who can see what you post'],
        ['oversharing', 'posting more personal detail than is safe'],
        ['a stranger contact', 'an approach online from someone you do not know'],
        ['grooming', 'building trust online in order to exploit someone'],
        ['cyberbullying', 'bullying carried out through digital means'],
        ['a screenshot', 'the saved image that makes a deleted post permanent'],
        ['a block', 'the control preventing someone contacting you'],
        ['a report', 'the process of telling a platform about harmful behaviour'],
        ['a trusted adult', 'the person to tell when something online is wrong'],
        ['location sharing', 'the setting that reveals where you are'],
        ['a public account', 'an account anybody can see'],
        ['a terms of service', 'the rules you agree to when you use a platform']
      ],
      truths: [
        'Deleting a post does not remove copies other people have taken.',
        'Reusing one password means one breach unlocks every account.',
        'Two-factor authentication stops most stolen-password attacks.',
        'Phishing messages create urgency so you act before thinking.',
        'Reporting and blocking are separate actions and both are worth doing.'
      ],
      myths: [
        'Deleting something removes it from the internet.',
        'A private account means nothing you post can spread.',
        'Only careless people fall for scams.',
        'A message from a known name is certainly from that person.',
        'Turning off location in one app turns it off everywhere.'
      ],
      applications: [
        ['A second check beyond a password is called what?', 'two-factor authentication'],
        ['A message designed to trick you into giving details is called what?', 'phishing'],
        ['The record left by everything you do online is called what?', 'a digital footprint'],
        ['Phishing sent by text message is called what?', 'smishing'],
        ['What makes a deleted post permanent?', 'a screenshot']
      ]
    },
    {
      name: 'Road, Water and Fire Safety', from: 'Grade 3', to: 'Grade 10',
      facts: [
        ['a pedestrian crossing', 'a marked place to cross the road'],
        ['a pelican crossing', 'a crossing controlled by lights the pedestrian requests'],
        ['a zebra crossing', 'a striped crossing where pedestrians have priority'],
        ['stopping distance', 'thinking distance plus braking distance'],
        ['thinking distance', 'the distance travelled before the brakes are applied'],
        ['braking distance', 'the distance travelled while braking'],
        ['a blind spot', 'the area a driver cannot see'],
        ['high visibility clothing', 'clothing that makes a person easier to see'],
        ['a cycle helmet', 'protective headwear for cycling'],
        ['a life jacket', 'a buoyancy aid that keeps a head above water'],
        ['a rip current', 'a strong flow of water heading away from shore'],
        ['cold water shock', 'the involuntary gasp and rapid breathing on sudden immersion'],
        ['a lifeguard', 'the trained person supervising swimmers'],
        ['a flag system', 'the beach flags marking where it is safe to swim'],
        ['a smoke alarm', 'the device that detects smoke and sounds a warning'],
        ['a fire triangle', 'fuel, oxygen and heat, the three needs of a fire'],
        ['an escape route', 'the planned way out of a building'],
        ['a fire door', 'a door that holds back fire and smoke'],
        ['stop, drop and roll', 'the action if clothing catches fire'],
        ['an assembly point', 'the place to gather after evacuating']
      ],
      truths: [
        'Stopping distance is thinking distance plus braking distance, and both grow with speed.',
        'A rip current is escaped by swimming across it, not against it.',
        'Cold water shock, not exhaustion, is what kills in the first minute of immersion.',
        'A fire needs fuel, oxygen and heat; removing any one puts it out.',
        'Smoke, not flame, is what makes most house fires deadly.'
      ],
      myths: [
        'A car can stop instantly if the driver reacts quickly.',
        'You should swim straight back to shore against a rip current.',
        'A strong swimmer is safe in cold water.',
        'Opening windows helps in a house fire.',
        'A driver can see everything around the vehicle.'
      ],
      applications: [
        ['Thinking distance plus braking distance gives what?', 'stopping distance'],
        ['How should you escape a rip current?', 'swim across it'],
        ['What are the three sides of the fire triangle?', 'fuel, oxygen and heat'],
        ['What should you do if clothing catches fire?', 'stop, drop and roll'],
        ['Where do you gather after evacuating a building?', 'the assembly point']
      ]
    }
  ],
  household: [
    {
      name: 'Cooking, Food Safety and Meal Planning', from: 'Grade 5', to: 'College',
      facts: [
        ['food hygiene', 'the practices that keep food safe to eat'],
        ['cross-contamination', 'the transfer of bacteria from one food to another'],
        ['a chopping board', 'the surface food is cut on, kept separate for raw meat'],
        ['a core temperature', 'the temperature at the centre of cooked food'],
        ['the danger zone', 'the temperature range in which bacteria multiply fastest'],
        ['a use-by date', 'the date after which food is unsafe'],
        ['a best-before date', 'the date after which quality declines but food may be safe'],
        ['defrosting', 'thawing frozen food safely, in a fridge'],
        ['reheating', 'heating cooked food thoroughly before eating again'],
        ['a marinade', 'a seasoned liquid food is soaked in'],
        ['searing', 'browning a surface quickly at high heat'],
        ['simmering', 'cooking just below boiling'],
        ['blanching', 'brief boiling followed by cooling'],
        ['a roux', 'the cooked flour and fat that thickens a sauce'],
        ['seasoning', 'the salt, pepper and other flavours added to taste'],
        ['a meal plan', 'the week’s meals decided in advance'],
        ['a batch cook', 'cooking several portions at once for later'],
        ['a store cupboard staple', 'a long-life ingredient kept in stock'],
        ['a unit price', 'the price per kilogram or litre, used to compare value'],
        ['food waste', 'edible food bought and not eaten']
      ],
      truths: [
        'Raw meat is kept and prepared separately to prevent cross-contamination.',
        'A use-by date is about safety; a best-before date is about quality.',
        'Food should be defrosted in a fridge, not on a worktop.',
        'Reheated food must be heated through, not just warmed.',
        'Unit price, not pack price, is what compares value between sizes.'
      ],
      myths: [
        'Food is safe as long as it looks and smells fine.',
        'Best-before means the food becomes dangerous that day.',
        'Rinsing raw chicken makes it safer.',
        'Hot food should be left out to cool completely before refrigerating.',
        'A bigger pack is always better value.'
      ],
      applications: [
        ['Which date is about safety rather than quality?', 'the use-by date'],
        ['The transfer of bacteria between foods is called what?', 'cross-contamination'],
        ['Where should frozen food be defrosted?', 'in a fridge'],
        ['Cooking just below boiling is called what?', 'simmering'],
        ['Which figure compares value between pack sizes?', 'the unit price']
      ]
    },
    {
      name: 'Renting, Bills and Household Admin', from: 'Grade 9', to: 'College',
      facts: [
        ['a tenancy agreement', 'the contract between landlord and tenant'],
        ['a landlord', 'the owner letting the property'],
        ['a tenant', 'the person renting the property'],
        ['a deposit', 'money held against damage or unpaid rent'],
        ['a deposit protection scheme', 'the arrangement that holds a deposit securely'],
        ['an inventory', 'the record of the property’s condition at the start'],
        ['rent', 'the regular payment for use of the property'],
        ['a break clause', 'the term allowing a tenancy to end early'],
        ['a notice period', 'the warning required before ending a tenancy'],
        ['a standing order', 'a fixed regular payment you set up'],
        ['a direct debit', 'a regular payment the supplier collects'],
        ['a utility', 'a supplied service such as gas, water or electricity'],
        ['a meter reading', 'the recorded figure a bill is calculated from'],
        ['an estimated bill', 'a bill calculated without a reading'],
        ['a standing charge', 'the daily fixed charge on a utility bill'],
        ['a unit rate', 'the price per unit of energy used'],
        ['council tax', 'the local charge on a household'],
        ['contents insurance', 'cover for possessions inside the home'],
        ['a guarantor', 'someone who agrees to pay if the tenant does not'],
        ['a repair obligation', 'the landlord’s duty to keep the property in repair']
      ],
      truths: [
        'A deposit must be held in a protection scheme in many jurisdictions.',
        'An inventory with photographs is what settles deposit disputes.',
        'An estimated bill is corrected once a real meter reading is given.',
        'A utility bill has a standing charge as well as a unit rate.',
        'Repairs to the structure are normally the landlord’s responsibility.'
      ],
      myths: [
        'The landlord can keep a deposit for normal wear and tear.',
        'A verbal tenancy has no legal standing at all.',
        'Submitting a meter reading makes no difference to the bill.',
        'A tenant can leave whenever they like without notice.',
        'Contents insurance is included in the rent.'
      ],
      applications: [
        ['What records the property’s condition at the start of a tenancy?', 'the inventory'],
        ['The daily fixed charge on a utility bill is called what?', 'the standing charge'],
        ['A bill calculated without a reading is called what?', 'an estimated bill'],
        ['Who agrees to pay if the tenant does not?', 'a guarantor'],
        ['Which term allows a tenancy to end early?', 'a break clause']
      ]
    }
  ],
  communication: [
    {
      name: 'Giving a Presentation', from: 'Grade 6', to: 'College',
      facts: [
        ['an audience', 'the people you are speaking to'],
        ['a purpose', 'what a talk is meant to achieve'],
        ['a structure', 'the order the material is arranged in'],
        ['a hook', 'the opening that earns attention'],
        ['a signpost', 'a phrase telling the audience where you are going'],
        ['a key message', 'the one thing you want remembered'],
        ['a visual aid', 'a slide, object or diagram supporting the talk'],
        ['a slide', 'one screen of a presentation'],
        ['cue cards', 'small cards holding prompts rather than a script'],
        ['pace', 'the speed of speaking'],
        ['projection', 'speaking loudly enough to be heard clearly'],
        ['articulation', 'shaping words clearly'],
        ['a pause', 'the deliberate silence that gives a point weight'],
        ['eye contact', 'looking at the audience rather than the screen'],
        ['body language', 'what posture and gesture communicate'],
        ['a filler word', 'a sound such as "um" that fills a gap'],
        ['a rehearsal', 'practising the talk aloud before delivering it'],
        ['timing', 'fitting the talk to the time allowed'],
        ['a question and answer', 'the part of a talk where the audience asks'],
        ['a takeaway', 'what the audience leaves with']
      ],
      truths: [
        'Slides support a talk; they are not the talk.',
        'A pause is more effective than a filler word for the same gap.',
        'Rehearsing aloud reveals problems that reading silently does not.',
        'A talk should be built around one key message.',
        'Eye contact matters more than knowing every word by heart.'
      ],
      myths: [
        'A good presentation means reading well-written slides.',
        'Nerves mean you are not ready.',
        'More slides make a talk more thorough.',
        'Memorising a script word for word is the safest approach.',
        'The question and answer section can be left to chance.'
      ],
      applications: [
        ['The opening that earns attention is called what?', 'a hook'],
        ['A phrase telling the audience where you are going is called what?', 'a signpost'],
        ['What is more effective than saying "um"?', 'a pause'],
        ['What should a talk be built around?', 'one key message'],
        ['Practising aloud before delivering is called what?', 'a rehearsal']
      ]
    },
    {
      name: 'Listening, Feedback and Disagreeing Well', from: 'Grade 6', to: 'College',
      facts: [
        ['active listening', 'listening in a way that shows and checks understanding'],
        ['paraphrasing', 'saying back what you heard in your own words'],
        ['a clarifying question', 'a question that checks what was meant'],
        ['an open question', 'a question that cannot be answered yes or no'],
        ['a closed question', 'a question with a short fixed answer'],
        ['empathy', 'recognising how another person sees a situation'],
        ['feedback', 'information given to help someone improve'],
        ['specific feedback', 'feedback naming what exactly was done'],
        ['actionable feedback', 'feedback the person can actually do something with'],
        ['praise', 'recognition of what was done well'],
        ['criticism', 'a judgement of what fell short'],
        ['a disagreement', 'a difference of view'],
        ['a position', 'what someone says they want'],
        ['an interest', 'the underlying reason they want it'],
        ['common ground', 'the part both sides already agree on'],
        ['a concession', 'something given up to reach agreement'],
        ['a compromise', 'an agreement where each side gives something up'],
        ['assertiveness', 'stating your view clearly without attacking'],
        ['an I-statement', 'a sentence stating your own view and feeling'],
        ['a tone', 'the attitude carried by how something is said']
      ],
      truths: [
        'Paraphrasing checks understanding and shows you were listening.',
        'Feedback works when it is specific and actionable, not when it is softened.',
        'Positions conflict more often than interests do.',
        'Assertiveness is different from aggression: it states, it does not attack.',
        'An I-statement describes your own view rather than accusing.'
      ],
      myths: [
        'Listening means staying quiet until it is your turn.',
        'Feedback should always be wrapped in praise to be acceptable.',
        'Disagreeing is rude.',
        'Compromise means both sides losing.',
        'Repeating your point louder makes it more persuasive.'
      ],
      applications: [
        ['Saying back what you heard in your own words is called what?', 'paraphrasing'],
        ['A question that cannot be answered yes or no is called what?', 'an open question'],
        ['Feedback the person can act on is called what?', 'actionable feedback'],
        ['The underlying reason someone wants something is called what?', 'an interest'],
        ['A sentence stating your own view and feeling is called what?', 'an I-statement']
      ]
    }
  ],
  /* ================================== arts =================================== */
  'art-history': [
    {
      name: 'Colour Theory and the Colour Wheel', from: 'Grade 3', to: 'College',
      facts: [
        ['a primary colour', 'a colour that cannot be mixed from others'],
        ['a secondary colour', 'a colour mixed from two primaries'],
        ['a tertiary colour', 'a colour mixed from a primary and a neighbouring secondary'],
        ['the colour wheel', 'the circular arrangement of hues'],
        ['a hue', 'the name of a colour'],
        ['a tint', 'a hue with white added'],
        ['a shade', 'a hue with black added'],
        ['a tone', 'a hue with grey added'],
        ['saturation', 'how intense a colour is'],
        ['value', 'how light or dark a colour is'],
        ['complementary colours', 'colours opposite on the wheel'],
        ['analogous colours', 'colours next to each other on the wheel'],
        ['a warm colour', 'a colour in the red to yellow range'],
        ['a cool colour', 'a colour in the green to blue range'],
        ['a monochrome scheme', 'a scheme using one hue at different values'],
        ['a triadic scheme', 'three colours evenly spaced on the wheel'],
        ['colour harmony', 'a combination that works together'],
        ['simultaneous contrast', 'the way a colour changes appearance beside another'],
        ['a neutral', 'a colour with very low saturation'],
        ['a palette', 'the set of colours chosen for a work']
      ],
      truths: [
        'Complementary colours placed side by side make each other look more intense.',
        'A tint adds white, a shade adds black and a tone adds grey.',
        'Value can be judged by imagining a picture in greyscale.',
        'Warm colours tend to advance and cool colours to recede.',
        'A colour looks different depending on what surrounds it.'
      ],
      myths: [
        'Mixing all the primaries gives white paint.',
        'Tint, shade and tone all mean the same thing.',
        'A bright colour is always high value.',
        'Colours look the same whatever they sit next to.',
        'Black and white are hues on the colour wheel.'
      ],
      applications: [
        ['Which colour is complementary to red?', 'green'],
        ['A hue with white added is called what?', 'a tint'],
        ['Three colours evenly spaced on the wheel make which scheme?', 'triadic'],
        ['How intense a colour is is called what?', 'saturation'],
        ['Colours next to each other on the wheel are called what?', 'analogous']
      ]
    },
    {
      name: 'Drawing: Line, Tone and Proportion', from: 'Grade 3', to: 'College',
      facts: [
        ['a contour line', 'a line following the edge of a form'],
        ['a gesture drawing', 'a fast drawing capturing movement and pose'],
        ['a construction line', 'a light line used to place a shape before refining it'],
        ['proportion', 'the relative size of parts to each other'],
        ['a sight measurement', 'measuring by holding a pencil at arm’s length'],
        ['a negative space', 'the shape of the space around an object'],
        ['tone', 'the lightness or darkness of an area'],
        ['a tonal range', 'the span from lightest light to darkest dark'],
        ['hatching', 'parallel lines used to build tone'],
        ['cross-hatching', 'crossed sets of lines used to darken tone'],
        ['blending', 'smoothing tone into a gradual change'],
        ['a highlight', 'the lightest point where light strikes'],
        ['a core shadow', 'the darkest band on the turning form'],
        ['a cast shadow', 'the shadow an object throws onto a surface'],
        ['reflected light', 'light bouncing back into a shadow'],
        ['a form', 'a three-dimensional shape'],
        ['foreshortening', 'the shortening of a form pointing towards the viewer'],
        ['a vanishing point', 'the point on the horizon where parallels converge'],
        ['a horizon line', 'the eye-level line in a perspective drawing'],
        ['a thumbnail sketch', 'a small quick study of a composition']
      ],
      truths: [
        'Drawing negative space is often more accurate than drawing the object.',
        'A cast shadow is usually darker at its edge nearest the object.',
        'Construction lines are meant to be drawn lightly and drawn over.',
        'A full tonal range makes a drawing read as three-dimensional.',
        'Proportion is checked by comparing measurements, not by eye alone.'
      ],
      myths: [
        'Good drawing means never using construction lines.',
        'Outlines alone can make a form look solid.',
        'Shadows are simply black.',
        'Erasing is a sign of a mistake rather than part of the process.',
        'Foreshortening can be avoided by choosing a better angle.'
      ],
      applications: [
        ['The shape of the space around an object is called what?', 'negative space'],
        ['Crossed sets of lines used to darken tone are called what?', 'cross-hatching'],
        ['The shadow an object throws onto a surface is called what?', 'a cast shadow'],
        ['Light bouncing back into a shadow is called what?', 'reflected light'],
        ['A small quick study of a composition is called what?', 'a thumbnail sketch']
      ]
    },
    {
      name: 'Modern Art: Cubism, Surrealism and Abstraction', from: 'Grade 7', to: 'College',
      facts: [
        ['modernism', 'the movement breaking with traditional representation'],
        ['Cubism', 'the movement showing a subject from several viewpoints at once'],
        ['Pablo Picasso', 'the co-founder of Cubism'],
        ['Georges Braque', 'the co-founder of Cubism with Picasso'],
        ['analytical cubism', 'the earlier phase, fragmenting form in muted colour'],
        ['synthetic cubism', 'the later phase, building images from pasted elements'],
        ['collage', 'a work made by pasting materials onto a surface'],
        ['Surrealism', 'the movement drawing on dreams and the unconscious'],
        ['Salvador Dalí', 'the Surrealist of precisely painted dream images'],
        ['René Magritte', 'the Surrealist of everyday objects made strange'],
        ['automatism', 'making without conscious control'],
        ['juxtaposition', 'placing unrelated things together for effect'],
        ['abstraction', 'art that does not depict recognisable objects'],
        ['Wassily Kandinsky', 'an early painter of pure abstraction'],
        ['Piet Mondrian', 'the painter of grids in primary colours'],
        ['Abstract Expressionism', 'the post-war movement of gesture and scale'],
        ['Jackson Pollock', 'the painter of poured and dripped canvases'],
        ['Expressionism', 'art distorting form to convey feeling'],
        ['a readymade', 'an ordinary object presented as art'],
        ['Marcel Duchamp', 'the artist who introduced the readymade']
      ],
      truths: [
        'Cubism shows several viewpoints in one image rather than one fixed view.',
        'Surrealism drew on dreams and the unconscious, not simply on strangeness.',
        'Abstraction and Expressionism are different ideas that can appear together.',
        'A readymade challenges what counts as art rather than how it is made.',
        'Analytical cubism came before synthetic cubism.'
      ],
      myths: [
        'Abstract art means the artist could not draw.',
        'Cubism is just distorted portraiture.',
        'Surrealism means anything odd or unsettling.',
        'Modern art has no technique behind it.',
        'Mondrian and Pollock belong to the same movement.'
      ],
      applications: [
        ['Who co-founded Cubism with Picasso?', 'Georges Braque'],
        ['An ordinary object presented as art is called what?', 'a readymade'],
        ['Which painter is known for poured and dripped canvases?', 'Jackson Pollock'],
        ['Making without conscious control is called what?', 'automatism'],
        ['Which cubist phase used pasted elements?', 'synthetic cubism']
      ]
    }
  ],
  'music-theory': [
    {
      name: 'Scales, Keys and Key Signatures', from: 'Grade 5', to: 'College',
      facts: [
        ['a scale', 'a set of notes in ascending order'],
        ['a major scale', 'the scale with the tone-tone-semitone pattern'],
        ['a minor scale', 'the scale with a flattened third'],
        ['a natural minor', 'the minor scale with no altered notes'],
        ['a harmonic minor', 'the minor scale with a raised seventh'],
        ['a melodic minor', 'the minor scale altered ascending and descending'],
        ['a tone', 'an interval of two semitones'],
        ['a semitone', 'the smallest interval on a keyboard'],
        ['a tonic', 'the first note of a scale, which gives it its name'],
        ['a dominant', 'the fifth note of a scale'],
        ['a leading note', 'the seventh note, a semitone below the tonic'],
        ['a key', 'the tonal centre a piece is built around'],
        ['a key signature', 'the sharps or flats written at the start of each line'],
        ['a relative minor', 'the minor key sharing a key signature with a major key'],
        ['a circle of fifths', 'the diagram ordering keys by their signatures'],
        ['a chromatic scale', 'the scale of all twelve semitones'],
        ['a pentatonic scale', 'a five-note scale'],
        ['a modulation', 'a change of key within a piece'],
        ['an accidental', 'a sharp, flat or natural not in the key signature'],
        ['an interval', 'the distance between two notes']
      ],
      truths: [
        'The major scale pattern is tone, tone, semitone, tone, tone, tone, semitone.',
        'A relative minor is three semitones below its major and shares its key signature.',
        'A harmonic minor raises the seventh, which creates the leading note.',
        'The circle of fifths adds one sharp or flat with each step.',
        'An accidental applies for the rest of the bar unless cancelled.'
      ],
      myths: [
        'Minor keys are simply major keys played more slowly.',
        'A key signature can be ignored once you have read it.',
        'Every scale has seven different notes.',
        'A relative minor starts on the same note as its major.',
        'An accidental applies only to the note it is written on.'
      ],
      applications: [
        ['How many semitones are in a tone?', '2'],
        ['Which note is the fifth of a scale called?', 'the dominant'],
        ['Which minor scale raises the seventh?', 'the harmonic minor'],
        ['What is the relative minor of C major?', 'A minor'],
        ['How many notes are in a pentatonic scale?', '5']
      ]
    },
    {
      name: 'Chords, Triads and Harmony', from: 'Grade 6', to: 'College',
      facts: [
        ['a chord', 'two or more notes sounded together'],
        ['a triad', 'a three-note chord built in thirds'],
        ['a root', 'the note a chord is built from'],
        ['a third', 'the note two steps above the root in a scale'],
        ['a fifth', 'the note four steps above the root in a scale'],
        ['a major triad', 'a triad with a major third'],
        ['a minor triad', 'a triad with a minor third'],
        ['a diminished triad', 'a triad with a minor third and a flattened fifth'],
        ['an augmented triad', 'a triad with a raised fifth'],
        ['an inversion', 'a chord with a note other than the root at the bottom'],
        ['a seventh chord', 'a triad with a seventh added'],
        ['a dominant seventh', 'the seventh chord built on the fifth degree'],
        ['harmony', 'the combination of simultaneous notes'],
        ['a chord progression', 'a sequence of chords'],
        ['a cadence', 'the chord pattern closing a phrase'],
        ['a perfect cadence', 'the closing pattern from dominant to tonic'],
        ['a plagal cadence', 'the closing pattern from subdominant to tonic'],
        ['an imperfect cadence', 'a phrase ending on the dominant'],
        ['consonance', 'a combination that sounds settled'],
        ['dissonance', 'a combination that sounds unsettled and seeks resolution']
      ],
      truths: [
        'A triad is built from a root, a third and a fifth.',
        'A perfect cadence moves from the dominant to the tonic.',
        'An inversion changes which note is lowest, not which notes are present.',
        'Dissonance is a tool, not a mistake: it creates the need to resolve.',
        'Major and minor triads differ by one semitone in the third.'
      ],
      myths: [
        'A minor chord is a major chord played lower.',
        'Inversions are different chords from their root positions.',
        'Dissonance means a wrong note.',
        'Every cadence ends a piece.',
        'A seventh chord is any chord with seven notes.'
      ],
      applications: [
        ['How many notes are in a triad?', '3'],
        ['Which cadence moves from dominant to tonic?', 'the perfect cadence'],
        ['A triad with a raised fifth is called what?', 'augmented'],
        ['A chord with a note other than the root at the bottom is called what?', 'an inversion'],
        ['What distinguishes a minor triad from a major one?', 'the third']
      ]
    },
    {
      name: 'Musical Styles Through History', from: 'Grade 6', to: 'College',
      facts: [
        ['the medieval period', 'the era of plainchant and early polyphony'],
        ['plainchant', 'unaccompanied single-line sacred song'],
        ['the Renaissance', 'the era of interwoven vocal polyphony'],
        ['polyphony', 'music with several independent melodic lines'],
        ['the Baroque period', 'the era of ornament, counterpoint and basso continuo'],
        ['a basso continuo', 'the continuous bass line with chords above it'],
        ['a fugue', 'a piece built on a subject stated in turn by each voice'],
        ['Johann Sebastian Bach', 'the Baroque composer of the fugues and the Passions'],
        ['the Classical period', 'the era of balance, clarity and sonata form'],
        ['sonata form', 'exposition, development and recapitulation'],
        ['Wolfgang Amadeus Mozart', 'the Classical composer of symphonies and operas'],
        ['the Romantic period', 'the era of expression, scale and programme music'],
        ['programme music', 'instrumental music telling a story or picture'],
        ['Ludwig van Beethoven', 'the composer whose work spans Classical into Romantic'],
        ['impressionism in music', 'the style of colour and blurred harmony'],
        ['Claude Debussy', 'the composer associated with musical impressionism'],
        ['atonality', 'music with no key centre'],
        ['minimalism', 'the style built on repeated short patterns'],
        ['jazz', 'the improvised style that grew from blues and ragtime'],
        ['popular music', 'the commercially recorded styles of the twentieth century onward']
      ],
      truths: [
        'Polyphony means several independent lines, not simply many notes.',
        'Sonata form is exposition, development and recapitulation.',
        'Basso continuo is a defining feature of Baroque texture.',
        'Beethoven’s output spans the Classical and Romantic periods.',
        'Atonality removes the key centre rather than the rules.'
      ],
      myths: [
        'Classical is a general word for all old music.',
        'Baroque and Classical are the same period.',
        'Programme music has words.',
        'Minimalism means music with very few notes.',
        'Jazz has no structure because it is improvised.'
      ],
      applications: [
        ['Which composer is associated with musical impressionism?', 'Claude Debussy'],
        ['What are the three sections of sonata form?', 'exposition, development, recapitulation'],
        ['The continuous bass line of Baroque music is called what?', 'basso continuo'],
        ['Music with several independent melodic lines is called what?', 'polyphony'],
        ['Music with no key centre is called what?', 'atonal']
      ]
    }
  ],
  drama: [
    {
      name: 'Stagecraft: Space, Lighting and Set', from: 'Grade 6', to: 'College',
      facts: [
        ['a proscenium arch', 'the frame separating a traditional stage from the audience'],
        ['theatre in the round', 'a staging with the audience on all sides'],
        ['a thrust stage', 'a stage projecting into the audience on three sides'],
        ['a traverse stage', 'a staging with the audience on two opposite sides'],
        ['a promenade performance', 'a performance the audience walks through'],
        ['upstage', 'the part of the stage furthest from the audience'],
        ['downstage', 'the part of the stage nearest the audience'],
        ['stage left', 'the actor’s left when facing the audience'],
        ['a blocking', 'the planned movement and positions of actors'],
        ['a set', 'the constructed environment of a scene'],
        ['a flat', 'a lightweight framed panel used to build scenery'],
        ['a backdrop', 'the painted cloth hung at the back of a set'],
        ['a prop', 'an object handled by an actor'],
        ['a lighting state', 'one set of lighting levels held for a moment of the play'],
        ['a spotlight', 'a narrow beam picking out one area'],
        ['a wash', 'broad even lighting across the stage'],
        ['a gel', 'the coloured filter placed over a lantern'],
        ['a blackout', 'the complete removal of stage light'],
        ['a cue', 'the signal for a lighting, sound or actor action'],
        ['a get-in', 'the process of bringing a production into a venue']
      ],
      truths: [
        'Stage left and right are given from the actor’s point of view.',
        'Theatre in the round removes the possibility of hiding anything behind a set.',
        'A lighting state can change the meaning of a scene without a word changing.',
        'Blocking is planned in rehearsal, not improvised at each performance.',
        'A gel colours light by filtering it, so it always reduces intensity.'
      ],
      myths: [
        'Stage left is the audience’s left.',
        'Lighting is only there so the audience can see.',
        'Theatre in the round is simply a smaller proscenium stage.',
        'A prop and a piece of set are the same thing.',
        'Blocking limits an actor’s performance.'
      ],
      applications: [
        ['Which part of the stage is nearest the audience?', 'downstage'],
        ['A staging with the audience on two opposite sides is called what?', 'traverse'],
        ['The coloured filter over a lantern is called what?', 'a gel'],
        ['Whose left is stage left?', 'the actor’s'],
        ['The planned movement of actors is called what?', 'blocking']
      ]
    },
    {
      name: 'Acting Technique and Building a Character', from: 'Grade 6', to: 'College',
      facts: [
        ['an objective', 'what a character wants in a scene'],
        ['a super-objective', 'what a character wants across the whole play'],
        ['an obstacle', 'what stands between a character and their objective'],
        ['a tactic', 'the means a character uses to pursue an objective'],
        ['a beat', 'a small unit of a scene with one intention'],
        ['a subtext', 'what is meant beneath what is said'],
        ['a backstory', 'the character’s life before the play begins'],
        ['a status', 'the relative power between characters in a moment'],
        ['physicality', 'how a character moves and holds themselves'],
        ['a vocal quality', 'the tone, pitch and pace of a character’s speech'],
        ['characterisation', 'the building of a distinct, consistent character'],
        ['naturalism', 'a style aiming at everyday truthfulness'],
        ['Stanislavski', 'the practitioner associated with psychological realism'],
        ['Brecht', 'the practitioner of epic theatre and the alienation effect'],
        ['the alienation effect', 'the deliberate reminder that this is a play'],
        ['a hot-seating exercise', 'answering questions in role to develop a character'],
        ['an improvisation', 'unscripted work used to explore character or situation'],
        ['a rehearsal', 'a working session preparing a performance'],
        ['a monologue', 'an extended speech by one character'],
        ['an ensemble', 'the company working as a whole']
      ],
      truths: [
        'An objective is what a character wants; a tactic is how they pursue it.',
        'Subtext is what makes a line mean more than its words.',
        'Brecht wanted the audience to stay aware they were watching a play.',
        'Status shifts within a scene, and playing those shifts is part of the work.',
        'Hot-seating develops a character by requiring answers the script never gave.'
      ],
      myths: [
        'Acting naturally means simply being yourself on stage.',
        'Stanislavski and Brecht wanted the same effect on an audience.',
        'A character’s backstory is only useful if the audience is told it.',
        'A monologue is spoken to nobody.',
        'Status is fixed by a character’s social position.'
      ],
      applications: [
        ['What a character wants in a scene is called what?', 'an objective'],
        ['What is meant beneath what is said is called what?', 'subtext'],
        ['Which practitioner developed the alienation effect?', 'Brecht'],
        ['Answering questions in role is which exercise?', 'hot-seating'],
        ['The means a character uses to pursue an objective is called what?', 'a tactic']
      ]
    }
  ]
};
