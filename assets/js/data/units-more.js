/* Later additions: life skills and careers, working scientifically, world
   cultures, and two more languages. */

const lex = (name, from, to, lang, facts, truths, myths) =>
  ({ name, from, to, kind: 'lexicon', lang, facts, truths, myths });

export const MORE_UNITS = {
  /* ======================== CAREERS AND EMPLOYABILITY ======================== */
  careers: [
    {
      name: 'Applying for Work', from: 'Grade 8', to: 'College',
      facts: [
        ['CV', 'a summary of your education, experience and skills'],
        ['résumé', 'the North American term for a CV'],
        ['cover letter', 'the letter explaining why you want this particular job'],
        ['job description', 'the document setting out what a role involves'],
        ['person specification', 'the list of skills and qualities a job needs'],
        ['referee', 'someone who will vouch for your work'],
        ['application form', 'the employer’s own form, used instead of a CV'],
        ['portfolio', 'a collection of work you can show'],
        ['transferable skill', 'a skill that carries from one job to another'],
        ['work experience', 'time spent in a workplace to learn what it is like'],
        ['internship', 'a fixed period of work, often for a student'],
        ['apprenticeship', 'paid work combined with formal training'],
        ['tailoring', 'rewriting an application to match one specific job'],
        ['keyword', 'a term from the advert that an employer scans for']
      ],
      truths: [
        'An application tailored to one job beats a generic one sent to fifty.',
        'The person specification tells you exactly what to write about.',
        'Ask a referee before you name them.',
        'Unpaid experience still counts as experience on a CV.'
      ],
      myths: [
        'One CV can be sent unchanged to every employer.',
        'The job description is just background reading.',
        'You can name anyone as a referee without telling them.',
        'Only paid work is worth putting on a CV.'
      ]
    },
    {
      name: 'Interviews', from: 'Grade 9', to: 'College',
      facts: [
        ['interview', 'a structured conversation to decide whether to hire you'],
        ['STAR method', 'situation, task, action, result — a way to answer'],
        ['competency question', 'a question asking for an example of a skill'],
        ['open question', 'a question that cannot be answered yes or no'],
        ['body language', 'what your posture and expression communicate'],
        ['preparation', 'researching the employer before you go'],
        ['question to ask', 'what you ask them at the end'],
        ['panel interview', 'an interview with several people at once'],
        ['follow-up', 'a short message after the interview'],
        ['strength', 'something you are genuinely good at, with evidence'],
        ['weakness', 'something you are working on, said honestly'],
        ['salary expectation', 'the pay range you are hoping for'],
        ['punctuality', 'arriving in good time'],
        ['first impression', 'the judgement formed in the first minute']
      ],
      truths: [
        'The STAR method gives a competency answer a beginning, middle and end.',
        'Having a question to ask shows you actually want the job.',
        'Researching the employer is the single cheapest way to stand out.',
        'A weakness answer works when it names something real and what you did about it.'
      ],
      myths: [
        'You should never admit to a weakness.',
        'Asking questions at the end looks like you were not listening.',
        'Preparation does not help because you cannot guess the questions.',
        'Arriving exactly on the minute is ideal.'
      ]
    },
    {
      name: 'Rights and Responsibilities at Work', from: 'Grade 9', to: 'College',
      facts: [
        ['contract of employment', 'the agreement setting out the terms of a job'],
        ['minimum wage', 'the lowest hourly rate an employer may legally pay'],
        ['payslip', 'the record of pay and deductions'],
        ['notice period', 'how long before leaving you must tell an employer'],
        ['holiday entitlement', 'paid time off you are legally due'],
        ['sick pay', 'money paid while you are unable to work'],
        ['health and safety', 'the duty to keep a workplace safe'],
        ['discrimination', 'unfair treatment because of who someone is'],
        ['trade union', 'an organisation that bargains for workers'],
        ['grievance', 'a formal complaint at work'],
        ['probation period', 'an initial period with shorter notice'],
        ['zero-hours contract', 'a contract with no guaranteed hours'],
        ['self-employed', 'working for yourself rather than an employer'],
        ['professional conduct', 'behaving in line with a workplace’s standards']
      ],
      truths: [
        'A contract can be spoken as well as written, but written is safer.',
        'Health and safety is a duty on both employer and employee.',
        'Holiday entitlement is a legal right, not a favour.',
        'Self-employed workers arrange their own tax and pension.'
      ],
      myths: [
        'Only written contracts count.',
        'Health and safety is entirely the employer’s problem.',
        'Holiday is granted at the employer’s discretion.',
        'Self-employment means paying no tax.'
      ]
    },
    {
      name: 'Money at Work', from: 'Grade 9', to: 'College',
      facts: [
        ['gross pay', 'what you earn before deductions'],
        ['net pay', 'what reaches your account'],
        ['overtime', 'hours worked beyond the contracted ones'],
        ['bonus', 'extra pay for performance or results'],
        ['commission', 'pay linked to what you sell'],
        ['salary', 'a fixed annual amount paid in instalments'],
        ['hourly rate', 'pay for each hour worked'],
        ['pension scheme', 'a workplace plan saving for retirement'],
        ['employer contribution', 'money the employer adds to your pension'],
        ['tax code', 'the code telling the employer what to deduct'],
        ['expenses', 'costs reimbursed by an employer'],
        ['benefit in kind', 'a non-cash benefit that may be taxed'],
        ['pay review', 'a scheduled look at what you are paid'],
        ['negotiation', 'agreeing terms rather than accepting the first offer']
      ],
      truths: [
        'An employer pension contribution is part of your pay.',
        'Overtime is not always paid at a higher rate — the contract decides.',
        'Net pay is always lower than gross pay.',
        'It is normal to ask what the pay range is before accepting.'
      ],
      myths: [
        'A pension contribution is money you never see again.',
        'Overtime is always paid at time-and-a-half by law.',
        'Gross pay is what arrives in your account.',
        'Asking about pay is rude and will lose you the job.'
      ]
    },
    {
      name: 'Planning a Career', from: 'Grade 8', to: 'College',
      facts: [
        ['qualification', 'a formal award showing what you have studied'],
        ['vocational course', 'training aimed at a particular kind of work'],
        ['degree', 'a university qualification, usually three or four years'],
        ['apprenticeship', 'earning while training in a real workplace'],
        ['entry requirement', 'what you need before you can start a course'],
        ['career path', 'the sequence of roles that lead somewhere'],
        ['networking', 'building useful working relationships'],
        ['mentor', 'someone more experienced who advises you'],
        ['job market', 'which jobs are actually available'],
        ['labour shortage', 'a field with more vacancies than applicants'],
        ['CPD', 'continuing professional development — learning while working'],
        ['portfolio career', 'earning from several kinds of work at once'],
        ['relocation', 'moving to where the work is'],
        ['work–life balance', 'how work fits with the rest of your life']
      ],
      truths: [
        'Most people change direction several times in a working life.',
        'An apprenticeship and a degree are different routes, not better and worse.',
        'Entry requirements are worth checking years before you apply.',
        'Skills that transfer between fields are worth building deliberately.'
      ],
      myths: [
        'You choose one career at sixteen and stay in it.',
        'A degree is always the better route.',
        'Entry requirements can be sorted out at the last minute.',
        'Only technical skills matter to employers.'
      ]
    }
  ],

  /* =========================== SAFETY AND FIRST AID =========================== */
  safety: [
    {
      name: 'Basic First Aid', from: 'Grade 6', to: 'College',
      facts: [
        ['DRABC', 'danger, response, airway, breathing, circulation'],
        ['recovery position', 'the position for an unconscious person who is breathing'],
        ['CPR', 'chest compressions and rescue breaths'],
        ['emergency number', 'the number to call for an ambulance'],
        ['bleeding', 'treated with firm pressure and elevation'],
        ['burn', 'cooled under running water for twenty minutes'],
        ['choking', 'treated with back blows and abdominal thrusts'],
        ['sprain', 'treated with rest, ice, compression and elevation'],
        ['shock', 'a dangerous drop in blood flow around the body'],
        ['anaphylaxis', 'a severe allergic reaction needing adrenaline'],
        ['fracture', 'a broken bone — immobilise and get help'],
        ['unconscious', 'not responding to voice or touch'],
        ['first aid kit', 'the supplies kept ready for an emergency'],
        ['bystander', 'anyone present who could help']
      ],
      truths: [
        'Check for danger to yourself before approaching a casualty.',
        'A burn should be cooled with running water, not ice.',
        'An unconscious person who is breathing goes in the recovery position.',
        'Doing something is almost always better than doing nothing.'
      ],
      myths: [
        'You should rush straight to a casualty without checking for danger.',
        'Butter or ice is the right treatment for a burn.',
        'An unconscious person should be left flat on their back.',
        'Only trained professionals may give first aid.'
      ]
    },
    {
      name: 'Road and Travel Safety', from: 'Grade 4', to: 'Grade 12',
      facts: [
        ['pedestrian crossing', 'a marked place to cross the road'],
        ['stop, look, listen', 'the sequence before stepping into a road'],
        ['blind spot', 'the area a driver cannot see'],
        ['high-visibility clothing', 'clothing that makes you easier to see'],
        ['seat belt', 'the restraint that must be worn in a vehicle'],
        ['helmet', 'head protection for cycling and riding'],
        ['stopping distance', 'thinking distance plus braking distance'],
        ['thinking distance', 'how far a vehicle travels before the brakes are applied'],
        ['braking distance', 'how far it travels while braking'],
        ['tailgating', 'driving too close to the vehicle in front'],
        ['distraction', 'anything taking attention off the road'],
        ['cycle lane', 'part of the road marked for bicycles'],
        ['zebra crossing', 'a crossing where pedestrians have priority'],
        ['reaction time', 'the delay before a driver responds']
      ],
      truths: [
        'Stopping distance is thinking distance plus braking distance.',
        'Wet roads roughly double the braking distance.',
        'A driver may not be able to see you even if you can see the vehicle.',
        'Being visible matters more than being right about who has priority.'
      ],
      myths: [
        'Stopping distance is just the distance while braking.',
        'Braking distance is the same in wet and dry conditions.',
        'If you can see a vehicle, its driver can see you.',
        'Having priority means you are safe to step out.'
      ]
    },
    {
      name: 'Fire and Home Safety', from: 'Grade 4', to: 'Grade 12',
      facts: [
        ['smoke alarm', 'the device that warns you of fire'],
        ['escape plan', 'the agreed route out of a building'],
        ['stop, drop and roll', 'what to do if clothing catches fire'],
        ['fire extinguisher', 'equipment for tackling a small fire'],
        ['fire blanket', 'used to smother a small fire, especially a pan fire'],
        ['carbon monoxide', 'a colourless, odourless poisonous gas'],
        ['CO detector', 'the alarm for carbon monoxide'],
        ['electrical overload', 'too many appliances on one socket'],
        ['assembly point', 'where to gather after evacuating'],
        ['fire door', 'a door that slows the spread of fire when closed'],
        ['flammable', 'able to catch fire easily'],
        ['emergency exit', 'the way out kept clear for emergencies'],
        ['chip pan fire', 'never to be put out with water'],
        ['drill', 'practising the escape before it is needed']
      ],
      truths: [
        'Never put water on a pan fire — use a fire blanket or turn off the heat.',
        'Smoke alarms need testing, because a flat battery is the same as no alarm.',
        'Carbon monoxide cannot be seen or smelled, which is why detectors exist.',
        'Closing doors behind you slows a fire down.'
      ],
      myths: [
        'Water is the right way to put out a pan fire.',
        'A smoke alarm on the wall is working by definition.',
        'You would smell carbon monoxide before it harmed you.',
        'You should collect your belongings before leaving a burning building.'
      ]
    },
    {
      name: 'Personal Safety and Wellbeing', from: 'Grade 6', to: 'College',
      facts: [
        ['boundary', 'a limit you set on what is acceptable to you'],
        ['consent', 'clear agreement, freely given and able to be withdrawn'],
        ['peer pressure', 'the push to do what a group is doing'],
        ['trusted adult', 'someone you can tell when something is wrong'],
        ['safeguarding', 'the systems that protect people from harm'],
        ['emergency contact', 'the person to reach if something happens'],
        ['risk assessment', 'thinking through what could go wrong beforehand'],
        ['assertiveness', 'saying what you need clearly and calmly'],
        ['bullying', 'repeated behaviour intended to hurt or intimidate'],
        ['reporting', 'telling someone with the power to act'],
        ['mental health', 'how you are doing emotionally and psychologically'],
        ['self-care', 'the routine things that keep you well'],
        ['helpline', 'a phone or text service offering confidential support'],
        ['bystander effect', 'the tendency not to act when others are present']
      ],
      truths: [
        'Consent can be withdrawn at any point, whatever was agreed before.',
        'Telling someone is not the same as getting someone into trouble.',
        'Saying no clearly is a skill that can be practised.',
        'Knowing the bystander effect exists makes you likelier to act.'
      ],
      myths: [
        'Once you have agreed to something you cannot change your mind.',
        'Reporting a problem always makes it worse.',
        'Being assertive is the same as being aggressive.',
        'Someone else will always step in if something is wrong.'
      ]
    }
  ],

  /* ======================== HOME AND PRACTICAL SKILLS ======================== */
  household: [
    {
      name: 'Cooking Basics', from: 'Grade 5', to: 'College',
      facts: [
        ['simmer', 'to cook just below boiling'],
        ['boil', 'to cook in bubbling liquid'],
        ['sauté', 'to fry quickly in a little fat'],
        ['roast', 'to cook in a hot oven with fat'],
        ['bake', 'to cook in an oven with dry heat'],
        ['whisk', 'to beat air into a mixture'],
        ['fold', 'to combine gently without knocking out air'],
        ['knead', 'to work dough to develop it'],
        ['marinate', 'to soak in a seasoned liquid before cooking'],
        ['seasoning', 'salt, pepper and other flavour added to taste'],
        ['mise en place', 'having everything prepared before you start'],
        ['core temperature', 'the temperature at the centre of cooked food'],
        ['cross-contamination', 'moving bacteria from raw food to ready food'],
        ['resting', 'letting cooked meat sit before cutting']
      ],
      truths: [
        'Preparing everything before you start is what makes cooking calm.',
        'Simmering is gentler than boiling and stops food breaking up.',
        'Raw and ready-to-eat foods need separate boards and knives.',
        'Tasting as you go is how seasoning gets right.'
      ],
      myths: [
        'A hotter pan always cooks food better.',
        'Simmering and boiling are the same thing.',
        'One chopping board is fine for everything if you rinse it.',
        'Seasoning should only be added at the end.'
      ]
    },
    {
      name: 'Running a Home', from: 'Grade 7', to: 'College',
      facts: [
        ['tenancy agreement', 'the contract between tenant and landlord'],
        ['deposit', 'money held against damage, returnable at the end'],
        ['rent', 'the regular payment for living somewhere'],
        ['utilities', 'gas, electricity, water and similar services'],
        ['meter reading', 'the number that tells a supplier what you used'],
        ['standing charge', 'a daily fee for being connected, whatever you use'],
        ['insurance excess', 'the part of a claim you pay yourself'],
        ['inventory', 'the record of a property’s condition at the start'],
        ['notice', 'how far ahead you must say you are leaving'],
        ['landlord', 'the owner who rents the property out'],
        ['maintenance', 'keeping things working before they break'],
        ['recycling', 'separating waste so materials can be reused'],
        ['damp', 'moisture in a building that can damage health'],
        ['fuse box', 'where the power to a home can be switched off']
      ],
      truths: [
        'Photograph the condition of a property when you move in.',
        'A standing charge is paid even if you use nothing.',
        'Knowing where the stopcock and fuse box are matters before you need them.',
        'A deposit is your money held in trust, not the landlord’s.'
      ],
      myths: [
        'A deposit belongs to the landlord once it is paid.',
        'You only pay for the energy you actually use.',
        'Reporting a small repair is not worth the bother.',
        'An inventory is just paperwork with no consequences.'
      ]
    },
    {
      name: 'Clothes, Repairs and Waste', from: 'Grade 5', to: 'College',
      facts: [
        ['care label', 'the tag saying how a garment should be washed'],
        ['delicate cycle', 'a gentler wash for fragile fabrics'],
        ['colour run', 'dye moving from one garment to another'],
        ['stain treatment', 'acting on a mark before it sets'],
        ['sewing on a button', 'a basic repair that saves a garment'],
        ['hem', 'the folded edge at the bottom of a garment'],
        ['darning', 'repairing a hole in knitted fabric'],
        ['fast fashion', 'clothes made cheaply to be replaced quickly'],
        ['natural fibre', 'cotton, wool or linen'],
        ['synthetic fibre', 'polyester, nylon or acrylic, made from oil'],
        ['microfibre', 'a tiny plastic thread shed in washing'],
        ['charity shop', 'where usable clothes get a second life'],
        ['textile recycling', 'reprocessing fabric that cannot be reused'],
        ['repair café', 'a place where people fix things together']
      ],
      truths: [
        'Washing at a lower temperature saves energy and makes clothes last.',
        'Synthetic fabrics shed microfibres into the water when washed.',
        'Treating a stain quickly is far more effective than treating it later.',
        'Most garments can be repaired more cheaply than replaced.'
      ],
      myths: [
        'Hotter washes are always better for clothes.',
        'Only visible plastic pollutes water.',
        'A stain is easier to shift once it has dried in.',
        'Repairing clothes costs more than buying new ones.'
      ]
    },
    {
      name: 'Digital Life Admin', from: 'Grade 7', to: 'College',
      facts: [
        ['password manager', 'software that stores strong unique passwords'],
        ['two-factor authentication', 'a second check beyond a password'],
        ['backup', 'a copy kept somewhere else'],
        ['cloud storage', 'files kept on a provider’s servers'],
        ['subscription', 'a recurring payment for a service'],
        ['free trial', 'a limited period before charging starts'],
        ['auto-renewal', 'a subscription that continues unless cancelled'],
        ['digital receipt', 'proof of purchase kept electronically'],
        ['terms of service', 'the rules you agree to when using a service'],
        ['data export', 'taking your own data out of a service'],
        ['account recovery', 'regaining access when you are locked out'],
        ['screen time', 'how long you spend on devices'],
        ['notification', 'an interruption a device chooses to send you'],
        ['digital declutter', 'deliberately removing apps and accounts you do not use']
      ],
      truths: [
        'A free trial that asks for card details usually auto-renews.',
        'A backup on the same device is not a backup.',
        'Turning off non-essential notifications is the cheapest attention win.',
        'You can usually export your own data before closing an account.'
      ],
      myths: [
        'A free trial always ends by itself with no charge.',
        'Saving a second copy on the same laptop counts as a backup.',
        'Notifications are set by you and cannot be changed.',
        'Closing an account always deletes everything immediately.'
      ]
    }
  ],

  /* ========================= SPEAKING AND LISTENING ========================= */
  communication: [
    {
      name: 'Speaking in Public', from: 'Grade 6', to: 'College',
      facts: [
        ['audience', 'the people you are speaking to'],
        ['purpose', 'what you want the talk to achieve'],
        ['structure', 'the order your points come in'],
        ['signposting', 'telling the audience where you are going'],
        ['pace', 'how fast you speak'],
        ['pause', 'a deliberate silence that gives a point weight'],
        ['projection', 'sending the voice so it carries'],
        ['eye contact', 'looking at the audience rather than your notes'],
        ['filler word', '“um” or “like”, used while thinking'],
        ['visual aid', 'a slide or object that supports the point'],
        ['rehearsal', 'practising aloud before the day'],
        ['nerves', 'the physical arousal that comes with speaking'],
        ['opening', 'the first line, which decides whether people listen'],
        ['call to action', 'what you want the audience to do next']
      ],
      truths: [
        'Rehearsing out loud is different from reading it through in your head.',
        'A pause feels much longer to the speaker than to the audience.',
        'Nerves are physical arousal and can be used rather than removed.',
        'Slides support a talk; they are not the talk.'
      ],
      myths: [
        'Reading a talk silently is enough preparation.',
        'Any silence makes you look unprepared.',
        'Good speakers feel no nerves.',
        'The more text on a slide the better.'
      ]
    },
    {
      name: 'Listening and Discussion', from: 'Grade 5', to: 'College',
      facts: [
        ['active listening', 'showing attention through response and question'],
        ['paraphrasing', 'saying back what you understood'],
        ['clarifying question', 'a question that checks meaning'],
        ['turn-taking', 'sharing the floor in a conversation'],
        ['interrupting', 'cutting across another speaker'],
        ['building on', 'adding to what someone else has said'],
        ['challenging respectfully', 'disagreeing with the idea, not the person'],
        ['summarising', 'pulling a discussion together'],
        ['ground rules', 'the agreed way a group will talk'],
        ['devil’s advocate', 'arguing a case to test it'],
        ['consensus', 'an agreement everyone can live with'],
        ['minutes', 'the written record of what was decided'],
        ['open question', 'one that cannot be answered yes or no'],
        ['body language', 'what posture and expression communicate']
      ],
      truths: [
        'Paraphrasing back is the quickest way to check you understood.',
        'Disagreeing with an idea is not the same as attacking a person.',
        'Silence in a discussion often means someone is thinking.',
        'A summary at the end is what makes a discussion useful afterwards.'
      ],
      myths: [
        'Listening means staying silent and nothing more.',
        'Disagreement always damages a discussion.',
        'The person who talks most contributes most.',
        'A discussion needs no record if everyone was there.'
      ]
    },
    {
      name: 'Debate and Persuasion', from: 'Grade 7', to: 'College',
      facts: [
        ['motion', 'the statement being debated'],
        ['proposition', 'the side arguing for the motion'],
        ['opposition', 'the side arguing against it'],
        ['rebuttal', 'answering the other side’s argument'],
        ['point of information', 'a brief interruption to ask a question'],
        ['burden of proof', 'the duty to make the case'],
        ['evidence', 'what supports a claim'],
        ['concession', 'admitting a point to the other side'],
        ['straw man', 'attacking a weaker version of the argument'],
        ['ad hominem', 'attacking the speaker instead of the argument'],
        ['summary speech', 'the final speech drawing the case together'],
        ['floor', 'the right to speak at that moment'],
        ['timing', 'keeping to the allotted minutes'],
        ['judging criteria', 'what a debate is actually marked on']
      ],
      truths: [
        'Rebuttal means answering what was actually said, not what you prepared for.',
        'Conceding a minor point can strengthen your case.',
        'Attacking the speaker rather than the argument is a fallacy.',
        'Debating a side you disagree with sharpens your own thinking.'
      ],
      myths: [
        'Rebuttal means repeating your own points more loudly.',
        'Conceding anything means losing.',
        'Personal attacks are a legitimate debating tactic.',
        'You should only ever argue for what you believe.'
      ]
    },
    {
      name: 'Writing to Communicate', from: 'Grade 6', to: 'College',
      facts: [
        ['email etiquette', 'the conventions of clear, polite email'],
        ['subject line', 'the line that decides whether an email is opened'],
        ['salutation', 'how a message opens'],
        ['sign-off', 'how a message closes'],
        ['tone', 'how a message sounds to the person reading it'],
        ['formal register', 'the style used with people you do not know'],
        ['bullet points', 'a way of making a list scannable'],
        ['call to action', 'the sentence saying what you need'],
        ['reply all', 'a button to use deliberately, not by reflex'],
        ['cc', 'copying someone in for information'],
        ['attachment', 'a file sent with a message'],
        ['proofreading', 'checking before sending'],
        ['deadline', 'the date by which a reply is needed'],
        ['follow-up', 'a short chase after no reply']
      ],
      truths: [
        'A specific subject line gets a faster reply than a vague one.',
        'Tone is easily misread in writing, so it needs choosing deliberately.',
        'Saying what you need and by when is the point of most messages.',
        'Reading a message aloud catches what the eye skips.'
      ],
      myths: [
        'The subject line does not matter if the message is good.',
        'Tone comes across the same in writing as in speech.',
        'A polite message should not mention deadlines.',
        'Spellcheck removes the need to proofread.'
      ]
    }
  ],

  /* ======================== WORKING SCIENTIFICALLY ======================== */
  method: [
    {
      name: 'Planning an Investigation', from: 'Grade 4', to: 'College',
      facts: [
        ['hypothesis', 'a testable prediction made before the experiment'],
        ['independent variable', 'the one thing you deliberately change'],
        ['dependent variable', 'the thing you measure'],
        ['control variable', 'something kept the same so the test is fair'],
        ['fair test', 'an investigation where only one thing changes'],
        ['prediction', 'what you expect to happen, and why'],
        ['method', 'the steps someone else could follow exactly'],
        ['apparatus', 'the equipment used'],
        ['risk assessment', 'identifying hazards before starting'],
        ['repeat reading', 'doing the measurement again to check it'],
        ['range', 'the spread of values you test across'],
        ['interval', 'the gap between the values you test'],
        ['trial run', 'a practice that shows whether the method works'],
        ['variable', 'anything in an experiment that could change']
      ],
      truths: [
        'A fair test changes one variable and keeps the rest the same.',
        'A hypothesis is written before the data, not after it.',
        'Repeating a measurement shows whether it can be trusted.',
        'A method is good when someone else could follow it and get your result.'
      ],
      myths: [
        'A fair test changes several variables at once to save time.',
        'A hypothesis is the conclusion you reach at the end.',
        'One reading is enough if you were careful.',
        'The method only has to make sense to the person who wrote it.'
      ]
    },
    {
      name: 'Measuring and Recording', from: 'Grade 4', to: 'College',
      facts: [
        ['accuracy', 'how close a measurement is to the true value'],
        ['precision', 'how close repeated measurements are to each other'],
        ['resolution', 'the smallest change an instrument can show'],
        ['anomaly', 'a result that does not fit the pattern'],
        ['mean', 'the average of repeated readings'],
        ['unit', 'what a measurement is expressed in'],
        ['significant figures', 'the digits that carry real information'],
        ['systematic error', 'an error that shifts every reading the same way'],
        ['random error', 'an error that varies unpredictably'],
        ['zero error', 'an instrument that does not read zero when it should'],
        ['calibration', 'checking an instrument against a known standard'],
        ['results table', 'the organised record of what was measured'],
        ['parallax', 'a reading error from looking at a scale at an angle'],
        ['uncertainty', 'the range a true value probably lies in']
      ],
      truths: [
        'Accuracy and precision are different: readings can be precise and wrong.',
        'Repeating a reading reduces random error but not systematic error.',
        'An anomaly should be investigated, not silently deleted.',
        'A measurement without a unit means nothing.'
      ],
      myths: [
        'Precise measurements are automatically accurate.',
        'Repeating a reading removes every kind of error.',
        'Anomalies should be quietly dropped from the table.',
        'Units can be left off if everyone knows what you mean.'
      ]
    },
    {
      name: 'Graphs and Conclusions', from: 'Grade 5', to: 'College',
      facts: [
        ['line graph', 'used when both variables are continuous'],
        ['bar chart', 'used when one variable is in categories'],
        ['scatter graph', 'used to look for a relationship between two measurements'],
        ['axis', 'the labelled line a graph is plotted against'],
        ['scale', 'the spacing of values along an axis'],
        ['line of best fit', 'the line showing the trend through the points'],
        ['correlation', 'two things changing together'],
        ['causation', 'one thing actually producing the change in another'],
        ['gradient', 'the steepness of a line, which often has a meaning'],
        ['intercept', 'where a line crosses an axis'],
        ['conclusion', 'what the data actually shows'],
        ['evaluation', 'how good the method was and what would improve it'],
        ['trend', 'the overall pattern in the results'],
        ['extrapolation', 'extending a trend beyond the data collected']
      ],
      truths: [
        'The independent variable goes on the horizontal axis.',
        'Correlation does not by itself show causation.',
        'A line of best fit does not have to pass through every point.',
        'A conclusion should refer back to the original hypothesis.'
      ],
      myths: [
        'The measured variable goes on the horizontal axis.',
        'A strong correlation proves one thing causes the other.',
        'A line of best fit must join up all the points.',
        'A conclusion is a summary of what you did.'
      ]
    },
    {
      name: 'Evidence and Scientific Thinking', from: 'Grade 6', to: 'College',
      facts: [
        ['peer review', 'expert checking before publication'],
        ['replication', 'another group getting the same result'],
        ['theory', 'a well-tested explanation supported by much evidence'],
        ['law', 'a description of what reliably happens'],
        ['model', 'a simplified representation used to explain or predict'],
        ['falsifiable', 'able to be shown wrong by evidence'],
        ['bias', 'anything that pushes a result in one direction'],
        ['sample size', 'how many were studied'],
        ['placebo', 'an inactive treatment used for comparison'],
        ['double-blind', 'neither participant nor researcher knows the group'],
        ['anecdote', 'a single story, which is not evidence of a pattern'],
        ['consensus', 'where the weight of evidence currently sits'],
        ['uncertainty', 'the honest statement of what is not yet known'],
        ['pseudoscience', 'a claim that borrows the look of science without the testing']
      ],
      truths: [
        'In science a theory is well-supported, not a guess.',
        'A claim that cannot be shown wrong by any evidence is not scientific.',
        'One study is a starting point, not a settled answer.',
        'Peer review checks work before publication; it does not guarantee it is right.'
      ],
      myths: [
        'A theory is just somebody’s opinion.',
        'A claim is stronger if no evidence could ever disprove it.',
        'One dramatic study settles a question.',
        'Peer review guarantees a paper is correct.'
      ]
    }
  ],

  /* ============================= WORLD CULTURES ============================= */
  cultures: [
    {
      name: 'Festivals Around the World', from: 'Grade 4', to: 'Grade 12',
      facts: [
        ['Diwali', 'the festival of lights celebrated by Hindus, Sikhs and Jains'],
        ['Eid al-Fitr', 'the Muslim festival marking the end of Ramadan'],
        ['Lunar New Year', 'the festival marked across much of East Asia'],
        ['Hanukkah', 'the Jewish winter festival of lights'],
        ['Día de los Muertos', 'the Mexican day of remembering the dead'],
        ['Holi', 'the Hindu spring festival of colour'],
        ['Thanksgiving', 'a North American harvest holiday'],
        ['Carnival', 'the celebration before Lent, famous in Brazil'],
        ['Nowruz', 'the Persian new year at the spring equinox'],
        ['Obon', 'the Japanese festival honouring ancestors'],
        ['Vesak', 'the Buddhist festival marking the Buddha’s birth'],
        ['Kwanzaa', 'a week-long celebration of African-American heritage']
      ],
      truths: [
        'Many festivals mark the turning of a season or a harvest.',
        'The same festival can be celebrated differently in different countries.',
        'Festivals on a lunar calendar move through the solar year.',
        'Learning about a festival is not the same as taking part in it.'
      ],
      myths: [
        'Every country celebrates the new year on 1 January.',
        'A festival is celebrated identically wherever it is held.',
        'All festivals fall on the same date each year.',
        'Festivals are only religious.'
      ]
    },
    {
      name: 'Food and Everyday Life', from: 'Grade 4', to: 'Grade 12',
      facts: [
        ['staple food', 'the main source of energy in a region’s diet'],
        ['rice', 'the staple across much of Asia'],
        ['maize', 'the staple across much of Central America'],
        ['wheat', 'the staple across much of Europe and West Asia'],
        ['cassava', 'a root staple across much of Africa'],
        ['tagine', 'a North African slow-cooked stew'],
        ['sushi', 'a Japanese dish of vinegared rice'],
        ['injera', 'the Ethiopian flatbread eaten with stews'],
        ['paella', 'a Spanish rice dish from Valencia'],
        ['dumpling', 'a filled parcel of dough found across many cuisines'],
        ['street food', 'food sold and eaten in public spaces'],
        ['hospitality', 'the custom of welcoming and feeding guests']
      ],
      truths: [
        'Staple foods usually reflect what grows well locally.',
        'Similar dishes appear independently in many cuisines.',
        'Food customs carry meaning beyond nutrition.',
        'Migration moves cuisines as well as people.'
      ],
      myths: [
        'Every country eats the same staple food.',
        'A dish belongs to exactly one country.',
        'Food customs are only about taste.',
        'Cuisines stay unchanged for centuries.'
      ]
    },
    {
      name: 'Language and Writing Systems', from: 'Grade 5', to: 'College',
      facts: [
        ['alphabet', 'a writing system where letters stand for sounds'],
        ['logogram', 'a character that stands for a whole word or idea'],
        ['abjad', 'a script that mainly writes consonants, as in Arabic'],
        ['syllabary', 'a script where each symbol is a syllable'],
        ['Latin script', 'the alphabet used for English and much of Europe'],
        ['Cyrillic', 'the script used for Russian and other languages'],
        ['Devanagari', 'the script used for Hindi and Sanskrit'],
        ['Hanzi', 'the Chinese characters, also used in Japanese as kanji'],
        ['bilingual', 'able to use two languages'],
        ['dialect', 'a regional variety of a language'],
        ['lingua franca', 'a shared language used between different groups'],
        ['endangered language', 'one with few remaining speakers']
      ],
      truths: [
        'Most people in the world speak more than one language.',
        'A dialect is a variety of a language, not a lesser form of it.',
        'Writing systems work in fundamentally different ways.',
        'A language dies when the last people who grew up with it stop using it.'
      ],
      myths: [
        'Most people speak only one language.',
        'A dialect is a broken version of a language.',
        'Every writing system is an alphabet.',
        'Languages last for ever once written down.'
      ]
    },
    {
      name: 'Landmarks and Places', from: 'Grade 4', to: 'Grade 12',
      facts: [
        ['Great Wall of China', 'the fortification running across northern China'],
        ['Taj Mahal', 'the marble mausoleum in Agra, India'],
        ['Machu Picchu', 'the Inca city high in the Peruvian Andes'],
        ['Pyramids of Giza', 'the Old Kingdom tombs outside Cairo'],
        ['Colosseum', 'the Roman amphitheatre in the centre of Rome'],
        ['Eiffel Tower', 'the iron tower built in Paris in 1889'],
        ['Petra', 'the city carved into rose-red rock in Jordan'],
        ['Angkor Wat', 'the temple complex in Cambodia'],
        ['Statue of Liberty', 'the gift from France standing in New York harbour'],
        ['Sydney Opera House', 'the shell-roofed building on Sydney Harbour'],
        ['Christ the Redeemer', 'the statue above Rio de Janeiro'],
        ['Stonehenge', 'the prehistoric stone circle in southern England']
      ],
      truths: [
        'Many landmarks were built for religious or ceremonial reasons.',
        'World Heritage status is intended to protect a site for everyone.',
        'Tourism can both fund and endanger a landmark.',
        'A landmark tells you about the society that built it.'
      ],
      myths: [
        'All famous landmarks were built as tourist attractions.',
        'World Heritage status guarantees a site is safe.',
        'Tourism only ever helps a site.',
        'Landmarks say nothing about the people who built them.'
      ]
    }
  ],

  /* ================================= ITALIAN ================================= */
  italian: [
    lex('Greetings and Introductions', 'Grade 5', 'College', 'Italian', [
      ['ciao', 'hello / bye (informal)'], ['buongiorno', 'good morning'],
      ['buonasera', 'good evening'], ['arrivederci', 'goodbye'],
      ['come stai?', 'how are you? (informal)'], ['sto bene', 'I am well'],
      ['mi chiamo…', 'my name is…'], ['come ti chiami?', 'what is your name?'],
      ['piacere', 'pleased to meet you'], ['per favore', 'please'],
      ['grazie', 'thank you'], ['prego', 'you’re welcome'],
      ['scusi', 'excuse me (formal)'], ['sì', 'yes'], ['no', 'no'],
      ['a domani', 'see you tomorrow']
    ], [
      'Italian nouns are either masculine or feminine.',
      '“Ciao” is informal and used with friends and family.',
      '“Prego” answers “grazie”.',
      'Italian has both a formal and an informal “you”.'
    ], [
      'Italian nouns have no gender.',
      '“Ciao” is the formal greeting for strangers.',
      '“Prego” means “goodbye”.',
      'Italian has only one word for “you”.'
    ]),
    lex('Family and People', 'Grade 5', 'College', 'Italian', [
      ['la madre', 'the mother'], ['il padre', 'the father'],
      ['la sorella', 'the sister'], ['il fratello', 'the brother'],
      ['la nonna', 'the grandmother'], ['il nonno', 'the grandfather'],
      ['la figlia', 'the daughter'], ['il figlio', 'the son'],
      ['la zia', 'the aunt'], ['lo zio', 'the uncle'],
      ['il cugino', 'the male cousin'], ['la famiglia', 'the family'],
      ['i genitori', 'the parents'], ['l’amico', 'the friend'],
      ['il bambino', 'the child'], ['la moglie', 'the wife']
    ], [
      'Italian uses “il”, “lo” and “la” depending on the noun.',
      '“Lo” is used before certain consonant sounds, as in “lo zio”.',
      'Adding -a often makes a family word feminine.',
      'The plural of “il” is “i”.'
    ], [
      'Italian uses only “il” for every noun.',
      '“Lo” and “la” mean the same thing.',
      'Italian family words never change for gender.',
      'Italian has no plural articles.'
    ]),
    lex('Numbers, Days and Time', 'Grade 5', 'College', 'Italian', [
      ['uno', 'one'], ['due', 'two'], ['tre', 'three'], ['quattro', 'four'],
      ['cinque', 'five'], ['dieci', 'ten'], ['venti', 'twenty'], ['cento', 'one hundred'],
      ['lunedì', 'Monday'], ['venerdì', 'Friday'], ['sabato', 'Saturday'],
      ['domenica', 'Sunday'], ['gennaio', 'January'], ['luglio', 'July'],
      ['oggi', 'today'], ['domani', 'tomorrow']
    ], [
      'Italian days and months are written in lower case.',
      'The Italian week begins on Monday.',
      '“Domani” means tomorrow.',
      'Italian numbers above twenty join together, as in “ventuno”.'
    ], [
      'Italian days take a capital letter.',
      'The Italian week begins on Sunday.',
      '“Domani” means yesterday.',
      'Italian numbers are always written as separate words.'
    ]),
    lex('Food and Eating Out', 'Grade 6', 'College', 'Italian', [
      ['il pane', 'the bread'], ['il formaggio', 'the cheese'],
      ['il latte', 'the milk'], ['la carne', 'the meat'],
      ['il pesce', 'the fish'], ['il pollo', 'the chicken'],
      ['la mela', 'the apple'], ['l’acqua', 'the water'],
      ['il riso', 'the rice'], ['la zuppa', 'the soup'],
      ['l’uovo', 'the egg'], ['l’insalata', 'the salad'],
      ['la colazione', 'the breakfast'], ['la cena', 'the dinner'],
      ['il conto', 'the bill'], ['ho fame', 'I am hungry']
    ], [
      'Italian says “ho fame”, literally “I have hunger”.',
      '“Il conto” is what you ask for at the end of a meal.',
      '“La colazione” is the first meal of the day.',
      'Italian uses “vorrei” to order politely.'
    ], [
      '“Ho fame” translates word for word as “I am hungry”.',
      '“Il conto” means the menu.',
      '“La cena” means breakfast.',
      '“Vorrei” means “I must have”.'
    ]),
    lex('Getting Around', 'Grade 6', 'College', 'Italian', [
      ['la stazione', 'the station'], ['l’aeroporto', 'the airport'],
      ['il biglietto', 'the ticket'], ['il treno', 'the train'],
      ['l’autobus', 'the bus'], ['la strada', 'the street'],
      ['a destra', 'to the right'], ['a sinistra', 'to the left'],
      ['sempre dritto', 'straight on'], ['dov’è… ?', 'where is…?'],
      ['vicino', 'near'], ['lontano', 'far'], ['l’albergo', 'the hotel'],
      ['la spiaggia', 'the beach'], ['la mappa', 'the map'], ['perso', 'lost']
    ], [
      '“Sempre dritto” means straight ahead.',
      '“Dov’è…?” asks where something is.',
      'Italian tickets must often be validated before boarding.',
      '“Vicino” and “lontano” are opposites.'
    ], [
      '“Sempre dritto” means turn right.',
      '“Dov’è…?” asks how much something costs.',
      '“Vicino” means far away.',
      '“La spiaggia” means the station.'
    ]),
    lex('School and Everyday Verbs', 'Grade 6', 'College', 'Italian', [
      ['la scuola', 'the school'], ['il libro', 'the book'],
      ['il quaderno', 'the exercise book'], ['la penna', 'the pen'],
      ['la matita', 'the pencil'], ['l’esame', 'the exam'],
      ['i compiti', 'the homework'], ['essere', 'to be'],
      ['avere', 'to have'], ['andare', 'to go'], ['fare', 'to do or make'],
      ['volere', 'to want'], ['potere', 'to be able to'],
      ['parlare', 'to speak'], ['mangiare', 'to eat'], ['vivere', 'to live']
    ], [
      'Italian verbs end in -are, -ere or -ire in the infinitive.',
      'The subject pronoun is usually left out.',
      '“I compiti” is plural for homework.',
      '“Essere” and “avere” are both irregular.'
    ], [
      'All Italian verbs end in -ar.',
      'The subject pronoun must always be stated.',
      '“I compiti” is a singular noun.',
      '“Essere” follows the regular pattern exactly.'
    ])
  ],

  /* ================================ MANDARIN ================================ */
  mandarin: [
    lex('Greetings and Introductions', 'Grade 5', 'College', 'Mandarin', [
      ['nǐ hǎo (你好)', 'hello'], ['zàijiàn (再见)', 'goodbye'],
      ['xièxie (谢谢)', 'thank you'], ['bú kèqi (不客气)', 'you’re welcome'],
      ['duìbuqǐ (对不起)', 'sorry'], ['qǐng (请)', 'please'],
      ['nǐ hǎo ma? (你好吗?)', 'how are you?'], ['wǒ hěn hǎo (我很好)', 'I am fine'],
      ['wǒ jiào… (我叫…)', 'my name is…'], ['nǐ jiào shénme? (你叫什么?)', 'what is your name?'],
      ['shì (是)', 'to be / yes it is'], ['bù (不)', 'not'],
      ['zǎoshang hǎo (早上好)', 'good morning'], ['wǎnshang hǎo (晚上好)', 'good evening'],
      ['lǎoshī (老师)', 'teacher'], ['tóngxué (同学)', 'classmate']
    ], [
      'Mandarin is a tonal language: the tone changes the meaning.',
      'Pinyin is the system for writing Mandarin sounds in Latin letters.',
      'Mandarin has four main tones plus a neutral tone.',
      'Characters carry meaning, and pinyin shows pronunciation.'
    ], [
      'Mandarin has no tones.',
      'Pinyin is a separate language from Mandarin.',
      'Mandarin has two tones.',
      'Chinese characters are an alphabet.'
    ]),
    lex('Numbers and Dates', 'Grade 5', 'College', 'Mandarin', [
      ['yī (一)', 'one'], ['èr (二)', 'two'], ['sān (三)', 'three'],
      ['sì (四)', 'four'], ['wǔ (五)', 'five'], ['liù (六)', 'six'],
      ['qī (七)', 'seven'], ['bā (八)', 'eight'], ['jiǔ (九)', 'nine'],
      ['shí (十)', 'ten'], ['èrshí (二十)', 'twenty'], ['bǎi (百)', 'hundred'],
      ['xīngqīyī (星期一)', 'Monday'], ['xīngqītiān (星期天)', 'Sunday'],
      ['jīntiān (今天)', 'today'], ['míngtiān (明天)', 'tomorrow']
    ], [
      'Mandarin builds numbers logically: eleven is “ten one”.',
      'Days of the week are numbered: Monday is “week one”.',
      'Dates are written year, then month, then day.',
      'Measure words are used between a number and a noun.'
    ], [
      'Mandarin has a separate word for every number up to a hundred.',
      'Days of the week are named after planets.',
      'Dates are written day, month, year.',
      'Numbers are used directly before nouns with no measure word.'
    ]),
    lex('Family and People', 'Grade 6', 'College', 'Mandarin', [
      ['māma (妈妈)', 'mother'], ['bàba (爸爸)', 'father'],
      ['jiějie (姐姐)', 'older sister'], ['mèimei (妹妹)', 'younger sister'],
      ['gēge (哥哥)', 'older brother'], ['dìdi (弟弟)', 'younger brother'],
      ['nǎinai (奶奶)', 'grandmother (father’s mother)'],
      ['yéye (爷爷)', 'grandfather (father’s father)'],
      ['érzi (儿子)', 'son'], ['nǚ’ér (女儿)', 'daughter'],
      ['péngyou (朋友)', 'friend'], ['jiā (家)', 'family or home'],
      ['rén (人)', 'person'], ['xiǎoháir (小孩儿)', 'child'],
      ['lǎobǎn (老板)', 'boss'], ['yīshēng (医生)', 'doctor']
    ], [
      'Mandarin distinguishes older and younger siblings with different words.',
      'Family terms differ depending on which side of the family someone is on.',
      '“Jiā” means both family and home.',
      'Chinese family vocabulary is more precise than the English equivalents.'
    ], [
      'Mandarin uses one word for brother regardless of age.',
      'Family terms are the same on both sides of the family.',
      '“Jiā” only means house.',
      'Chinese family terms are less precise than English ones.'
    ]),
    lex('Food and Everyday Life', 'Grade 6', 'College', 'Mandarin', [
      ['shuǐ (水)', 'water'], ['chá (茶)', 'tea'], ['fàn (饭)', 'rice or a meal'],
      ['miàn (面)', 'noodles'], ['ròu (肉)', 'meat'], ['yú (鱼)', 'fish'],
      ['jīdàn (鸡蛋)', 'egg'], ['shuǐguǒ (水果)', 'fruit'],
      ['shūcài (蔬菜)', 'vegetables'], ['chī (吃)', 'to eat'],
      ['hē (喝)', 'to drink'], ['hǎochī (好吃)', 'tasty'],
      ['càidān (菜单)', 'menu'], ['fúwùyuán (服务员)', 'waiter'],
      ['duōshao qián? (多少钱?)', 'how much does it cost?'],
      ['wǒ è le (我饿了)', 'I am hungry']
    ], [
      '“Fàn” can mean rice specifically or a meal in general.',
      'Mandarin uses separate verbs for eating and drinking.',
      '“Duōshao qián?” asks the price.',
      'Tea is central to Chinese hospitality.'
    ], [
      '“Fàn” only ever means rice.',
      'One verb covers both eating and drinking.',
      '“Duōshao qián?” asks where something is.',
      'Mandarin has no word for tea.'
    ])
  ]
};
