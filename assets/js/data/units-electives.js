/* Business, engineering, environment, arts and study-skills micro-units. */

export const ELECTIVE_UNITS = {
  /* ================================ FINANCE ================================ */
  finance: [
    {
      name: 'Budgeting and Saving', from: 'Grade 6', to: 'College',
      facts: [
        ['budget', 'a plan matching expected income to planned spending'],
        ['income', 'money coming in'],
        ['expenditure', 'money going out'],
        ['surplus', 'the amount left when income exceeds spending'],
        ['deficit', 'the shortfall when spending exceeds income'],
        ['fixed cost', 'a regular payment of the same amount'],
        ['variable cost', 'a cost that changes from month to month'],
        ['discretionary spending', 'spending on wants rather than needs'],
        ['emergency fund', 'savings held for unexpected costs'],
        ['savings goal', 'a target amount with a date attached'],
        ['interest', 'the reward for saving or the cost of borrowing'],
        ['compound interest', 'interest earned on interest already earned'],
        ['direct debit', 'an automatic regular payment from an account'],
        ['opportunity cost', 'what you give up when you choose one option']
      ],
      truths: [
        'Compound interest means earlier saving is worth disproportionately more.',
        'An emergency fund is what stops an unexpected bill becoming debt.',
        'A budget is only useful if it is compared against what actually happened.',
        'Fixed costs are the hardest part of a budget to change quickly.'
      ],
      myths: [
        'Simple and compound interest give the same result over many years.',
        'Budgeting only matters for people with low incomes.',
        'Saving is pointless unless you can save a large amount.',
        'A budget is a prediction that does not need reviewing.'
      ]
    },
    {
      name: 'Banking and Payments', from: 'Grade 6', to: 'College',
      facts: [
        ['current account', 'an account used for everyday payments'],
        ['savings account', 'an account paying interest on money left in it'],
        ['debit card', 'a card spending money you already have'],
        ['credit card', 'a card spending borrowed money to be repaid'],
        ['overdraft', 'permission to go below zero on an account'],
        ['direct debit', 'a payment the recipient collects on an agreed schedule'],
        ['standing order', 'a fixed payment you instruct the bank to send'],
        ['statement', 'the record of transactions over a period'],
        ['balance', 'the amount currently in an account'],
        ['clearing', 'the process of settling a payment between banks'],
        ['contactless', 'a card payment made by tapping'],
        ['deposit protection', 'the guarantee covering savings if a bank fails'],
        ['exchange rate', 'the price of one currency in another'],
        ['transaction fee', 'a charge for making a payment']
      ],
      truths: [
        'A debit card spends your own money; a credit card borrows.',
        'An unarranged overdraft is usually one of the most expensive ways to borrow.',
        'A standing order is set by you; a direct debit is collected by the recipient.',
        'Checking statements is how unauthorised transactions get spotted.'
      ],
      myths: [
        'A credit card and a debit card work in the same way.',
        'An overdraft is free money provided by the bank.',
        'A standing order and a direct debit are the same instruction.',
        'Contactless payments are not recorded on a statement.'
      ]
    },
    {
      name: 'Credit, Debt and Borrowing', from: 'Grade 8', to: 'College',
      facts: [
        ['credit', 'money borrowed to be repaid later'],
        ['APR', 'the annual percentage rate showing the true cost of borrowing'],
        ['principal', 'the original amount borrowed'],
        ['term', 'the length of time a loan runs for'],
        ['secured loan', 'a loan backed by an asset the lender can claim'],
        ['unsecured loan', 'a loan with no asset securing it'],
        ['minimum payment', 'the smallest amount a card issuer will accept'],
        ['credit score', 'a rating of how reliably someone repays'],
        ['credit report', 'the record of borrowing and repayment history'],
        ['default', 'failing to keep up repayments'],
        ['repossession', 'a lender taking back a secured asset'],
        ['payday loan', 'a short-term loan at a very high rate'],
        ['debt spiral', 'borrowing more to service existing debt'],
        ['consolidation', 'combining several debts into one']
      ],
      truths: [
        'Paying only the minimum on a credit card can take decades to clear the balance.',
        'A longer loan term usually means lower payments but more interest overall.',
        'Secured borrowing is cheaper because the lender carries less risk.',
        'A credit score is built from a record of actual repayment behaviour.'
      ],
      myths: [
        'Paying the minimum each month clears a credit card quickly.',
        'A longer loan term always costs less in total.',
        'Having no borrowing history guarantees a high credit score.',
        'Consolidating debt always reduces the total repaid.'
      ]
    },
    {
      name: 'Tax, Pay and Payslips', from: 'Grade 8', to: 'College',
      facts: [
        ['gross pay', 'earnings before deductions'],
        ['net pay', 'earnings after deductions'],
        ['income tax', 'tax deducted from earnings'],
        ['tax allowance', 'the amount that can be earned before tax'],
        ['tax band', 'a range of income taxed at one rate'],
        ['marginal rate', 'the rate paid on the next pound earned'],
        ['national insurance', 'a payroll contribution funding state benefits'],
        ['pension contribution', 'money set aside from pay for retirement'],
        ['payslip', 'the document showing pay and deductions'],
        ['tax code', 'the code telling an employer how much to deduct'],
        ['sales tax', 'a tax added to the price of goods'],
        ['self-assessment', 'declaring income and paying tax yourself'],
        ['deduction', 'an amount taken from gross pay'],
        ['taxable income', 'income above the allowance, on which tax is due']
      ],
      truths: [
        'Moving into a higher tax band only taxes the income above the threshold.',
        'Net pay is gross pay minus tax, contributions and other deductions.',
        'A pension contribution reduces take-home pay but is not lost money.',
        'The marginal rate applies to the next unit of income, not to all of it.'
      ],
      myths: [
        'Earning a pound into a higher band taxes your whole income at that rate.',
        'Gross pay is the amount that reaches your bank account.',
        'Pension contributions are a tax you never get back.',
        'Everyone pays exactly the same rate of income tax.'
      ]
    },
    {
      name: 'Insurance and Risk', from: 'Grade 9', to: 'College',
      facts: [
        ['insurance', 'a contract paying out if a specified loss occurs'],
        ['premium', 'the regular payment made for cover'],
        ['excess', 'the amount you pay yourself before cover applies'],
        ['claim', 'a request for payment under a policy'],
        ['policy', 'the contract setting out what is covered'],
        ['exclusion', 'something the policy specifically does not cover'],
        ['risk pooling', 'many people sharing the cost of rare losses'],
        ['underwriting', 'assessing risk to set a premium'],
        ['no-claims discount', 'a reduction earned by not claiming'],
        ['liability cover', 'cover for harm you cause to others'],
        ['contents insurance', 'cover for possessions inside a home'],
        ['travel insurance', 'cover for medical and trip costs abroad'],
        ['moral hazard', 'taking more risk because you are insured'],
        ['under-insurance', 'insuring for less than the true value']
      ],
      truths: [
        'Insurance works by pooling the risk of many people who mostly do not claim.',
        'A higher excess usually lowers the premium.',
        'Exclusions are the part of a policy people most often overlook.',
        'Insuring for less than the replacement value can reduce any payout.'
      ],
      myths: [
        'Insurance pays out for any loss whatsoever.',
        'A higher excess means a higher premium.',
        'Insurance is a savings product you get your money back from.',
        'Everyone pays the same premium for the same cover.'
      ]
    }
  ],

  /* ============================== ACCOUNTING ============================== */
  accounting: [
    {
      name: 'The Accounting Equation', from: 'Grade 9', to: 'College',
      facts: [
        ['asset', 'something the business owns or is owed'],
        ['liability', 'something the business owes'],
        ['equity', 'the owner’s stake, assets minus liabilities'],
        ['accounting equation', 'assets equal liabilities plus equity'],
        ['current asset', 'an asset expected to be used within a year'],
        ['non-current asset', 'an asset held for more than a year'],
        ['current liability', 'a debt due within a year'],
        ['capital', 'the money the owner has put into the business'],
        ['drawings', 'money the owner takes out for personal use'],
        ['double entry', 'recording every transaction twice, as debit and credit'],
        ['debit', 'the left-hand entry in double-entry bookkeeping'],
        ['credit', 'the right-hand entry in double-entry bookkeeping'],
        ['ledger', 'the book of accounts where entries are recorded'],
        ['trial balance', 'a check that total debits equal total credits']
      ],
      truths: [
        'Assets always equal liabilities plus equity.',
        'Every transaction affects at least two accounts.',
        'A trial balance that balances can still contain errors.',
        'Drawings reduce equity; they are not a business expense.'
      ],
      myths: [
        'Assets equal liabilities minus equity.',
        'A balanced trial balance proves the accounts are correct.',
        'Drawings are an expense of the business.',
        'A debit always means money coming in.'
      ]
    },
    {
      name: 'Income Statements', from: 'Grade 10', to: 'College',
      facts: [
        ['revenue', 'income from sales before costs'],
        ['cost of sales', 'the direct cost of the goods sold'],
        ['gross profit', 'revenue minus cost of sales'],
        ['expenses', 'the running costs of the business'],
        ['net profit', 'gross profit minus expenses'],
        ['depreciation', 'spreading an asset’s cost across its useful life'],
        ['gross profit margin', 'gross profit as a percentage of revenue'],
        ['net profit margin', 'net profit as a percentage of revenue'],
        ['mark-up', 'profit expressed as a percentage of cost'],
        ['break-even', 'the point where revenue exactly covers costs'],
        ['contribution', 'selling price minus variable cost per unit'],
        ['fixed cost', 'a cost that does not vary with output'],
        ['variable cost', 'a cost that rises with output'],
        ['accrual', 'recording a cost when incurred, not when paid']
      ],
      truths: [
        'Gross profit is revenue minus the direct cost of sales.',
        'Depreciation spreads a cost over time without moving cash.',
        'Margin is measured against revenue; mark-up against cost.',
        'A business can be profitable and still run out of cash.'
      ],
      myths: [
        'Gross profit and net profit are the same figure.',
        'Depreciation is a cash payment made each year.',
        'Mark-up and margin are two names for the same percentage.',
        'A profitable business can never run out of cash.'
      ]
    },
    {
      name: 'Cash Flow', from: 'Grade 10', to: 'College',
      facts: [
        ['cash flow', 'the movement of money into and out of a business'],
        ['cash inflow', 'money received'],
        ['cash outflow', 'money paid out'],
        ['net cash flow', 'inflows minus outflows for a period'],
        ['opening balance', 'the cash held at the start of a period'],
        ['closing balance', 'the cash held at the end of a period'],
        ['cash flow forecast', 'a projection of future receipts and payments'],
        ['liquidity', 'the ability to pay debts as they fall due'],
        ['working capital', 'current assets minus current liabilities'],
        ['credit terms', 'how long customers are given to pay'],
        ['receivables', 'money owed to the business by customers'],
        ['payables', 'money the business owes suppliers'],
        ['overtrading', 'expanding faster than cash allows'],
        ['insolvency', 'being unable to pay debts when due']
      ],
      truths: [
        'Profit and cash are different: a sale on credit is profit without cash.',
        'Most business failures are caused by running out of cash, not by losses.',
        'Shortening customer credit terms improves cash flow.',
        'A cash flow forecast is a plan, not a guarantee.'
      ],
      myths: [
        'Profit and cash flow measure the same thing.',
        'A business with a full order book cannot fail.',
        'Giving customers longer to pay improves cash flow.',
        'Cash flow only matters to small businesses.'
      ]
    },
    {
      name: 'Ratios and Analysis', from: 'Grade 11', to: 'College',
      facts: [
        ['ratio analysis', 'comparing figures to judge performance'],
        ['current ratio', 'current assets divided by current liabilities'],
        ['acid test', 'a liquidity ratio excluding inventory'],
        ['return on capital employed', 'profit as a percentage of capital used'],
        ['inventory turnover', 'how quickly stock is sold and replaced'],
        ['receivables days', 'the average time customers take to pay'],
        ['payables days', 'the average time taken to pay suppliers'],
        ['gearing', 'the proportion of finance that is borrowed'],
        ['benchmark', 'a comparison figure from another period or firm'],
        ['trend', 'the direction a ratio moves over several periods'],
        ['solvency', 'the ability to meet long-term obligations'],
        ['profitability', 'how effectively a business turns revenue into profit'],
        ['efficiency ratio', 'a measure of how well assets are used'],
        ['limitation', 'a reason a ratio can mislead if read alone']
      ],
      truths: [
        'A single ratio means little without a comparison or a trend.',
        'High gearing raises returns in good years and risk in bad ones.',
        'The acid test excludes inventory because stock may not sell quickly.',
        'Ratios use historical figures and say nothing directly about the future.'
      ],
      myths: [
        'A current ratio of exactly 2 is correct for every business.',
        'A single year’s ratio is enough to judge a company.',
        'High gearing is always a sign of a failing business.',
        'Ratios predict future performance reliably.'
      ]
    }
  ],

  /* =============================== MARKETING =============================== */
  marketing: [
    {
      name: 'The Marketing Mix', from: 'Grade 8', to: 'College',
      facts: [
        ['marketing mix', 'the combination of product, price, place and promotion'],
        ['product', 'what is offered to the customer'],
        ['price', 'what the customer pays'],
        ['place', 'how and where the product reaches the customer'],
        ['promotion', 'how the product is communicated'],
        ['USP', 'the unique selling point that sets a product apart'],
        ['brand', 'the identity that distinguishes one seller from another'],
        ['product life cycle', 'introduction, growth, maturity and decline'],
        ['penetration pricing', 'setting a low price to win market share'],
        ['skimming', 'launching at a high price and lowering it later'],
        ['distribution channel', 'the route a product takes to the customer'],
        ['point of sale', 'the place where a purchase is completed'],
        ['packaging', 'the wrapping that protects and sells a product'],
        ['extension strategy', 'an action taken to prolong maturity']
      ],
      truths: [
        'The elements of the marketing mix have to support each other.',
        'Penetration pricing sacrifices early margin to win market share.',
        'A brand is more than a logo; it is what customers expect.',
        'Extension strategies aim to delay the decline stage.'
      ],
      myths: [
        'Promotion is the whole of marketing.',
        'Skimming means launching at the lowest possible price.',
        'A brand is simply a company’s logo.',
        'The product life cycle has a fixed length for every product.'
      ]
    },
    {
      name: 'Market Research', from: 'Grade 8', to: 'College',
      facts: [
        ['market research', 'gathering information about customers and competitors'],
        ['primary research', 'data you collect yourself'],
        ['secondary research', 'data already collected by someone else'],
        ['quantitative data', 'data expressed as numbers'],
        ['qualitative data', 'data expressed as opinions and descriptions'],
        ['sample', 'the group actually surveyed'],
        ['sampling bias', 'a sample that does not represent the population'],
        ['focus group', 'a guided discussion with a small group'],
        ['survey', 'a set of questions asked of many people'],
        ['leading question', 'a question that pushes towards an answer'],
        ['market segment', 'a group of customers with shared characteristics'],
        ['target market', 'the segment a business aims at'],
        ['competitor analysis', 'studying rival offerings and prices'],
        ['market share', 'a firm’s sales as a proportion of the whole market']
      ],
      truths: [
        'Primary research is more specific but slower and dearer than secondary.',
        'A leading question produces answers that cannot be trusted.',
        'A large sample does not fix a biased sampling method.',
        'Qualitative data explains the “why” behind the numbers.'
      ],
      myths: [
        'Secondary research is always more accurate than primary research.',
        'A big enough sample removes any bias in how it was chosen.',
        'Qualitative data is worthless because it cannot be counted.',
        'Market research removes all risk from a launch.'
      ]
    },
    {
      name: 'Advertising and Promotion', from: 'Grade 8', to: 'College',
      facts: [
        ['advertising', 'paid communication to promote a product'],
        ['sales promotion', 'a short-term incentive to buy'],
        ['public relations', 'managing how an organisation is seen'],
        ['sponsorship', 'paying to associate a brand with an event'],
        ['influencer marketing', 'promotion through people with an audience'],
        ['viral marketing', 'promotion spread by the audience itself'],
        ['call to action', 'the instruction telling the audience what to do'],
        ['target audience', 'the people an advert is aimed at'],
        ['reach', 'how many people see a message'],
        ['frequency', 'how many times they see it'],
        ['conversion', 'a viewer becoming a customer'],
        ['brand awareness', 'how widely a brand is recognised'],
        ['advertising standards', 'the rules preventing misleading claims'],
        ['ROI', 'the return earned relative to what was spent']
      ],
      truths: [
        'Reach and frequency measure different things.',
        'Paid influencer content must be disclosed as advertising.',
        'A campaign can raise awareness without raising sales.',
        'Advertising standards prohibit claims that mislead.'
      ],
      myths: [
        'Reach and frequency are the same measurement.',
        'Influencers do not have to disclose paid promotion.',
        'Any advert that is widely seen must be increasing sales.',
        'Adverts can make any claim as long as it is entertaining.'
      ]
    },
    {
      name: 'Digital and Social Marketing', from: 'Grade 9', to: 'College',
      facts: [
        ['SEO', 'improving how a site ranks in search results'],
        ['pay per click', 'advertising charged when a link is clicked'],
        ['click-through rate', 'the share of viewers who click'],
        ['engagement', 'the interaction an audience has with content'],
        ['analytics', 'the data describing how people use a site'],
        ['A/B test', 'comparing two versions to see which performs better'],
        ['landing page', 'the page a campaign sends people to'],
        ['email marketing', 'promotion sent directly to subscribers'],
        ['retargeting', 'showing adverts to people who visited before'],
        ['organic reach', 'people reached without paying'],
        ['algorithm', 'the system deciding what a platform shows'],
        ['user-generated content', 'material created by customers'],
        ['conversion funnel', 'the stages from awareness to purchase'],
        ['bounce rate', 'the share of visitors who leave immediately']
      ],
      truths: [
        'An A/B test compares two versions under the same conditions.',
        'Organic reach is unpaid; paid reach is bought.',
        'A high click-through rate with no conversions signals a landing-page problem.',
        'Analytics describe behaviour; they do not explain motive.'
      ],
      myths: [
        'SEO means paying a search engine for a higher position.',
        'A high bounce rate always means the content is bad.',
        'Analytics tell you why people behaved as they did.',
        'Organic and paid reach are billed the same way.'
      ]
    }
  ],

  /* ================================= DESIGN ================================= */
  design: [
    {
      name: 'The Design Process', from: 'Grade 5', to: 'College',
      facts: [
        ['design brief', 'the statement of what a design must achieve'],
        ['specification', 'the measurable requirements a design must meet'],
        ['research', 'finding out about users, materials and existing products'],
        ['ideation', 'generating many possible ideas'],
        ['sketch', 'a quick drawing exploring an idea'],
        ['prototype', 'a working model made to test an idea'],
        ['iteration', 'improving a design through repeated cycles'],
        ['user testing', 'watching real people use a design'],
        ['constraint', 'a limit the design must work within'],
        ['trade-off', 'accepting less of one quality to gain another'],
        ['evaluation', 'judging a design against its specification'],
        ['CAD', 'computer-aided design software'],
        ['ergonomics', 'designing to fit the human body'],
        ['anthropometrics', 'the body measurement data used in design']
      ],
      truths: [
        'A prototype exists to be tested and changed, not admired.',
        'Constraints are what make a design problem solvable.',
        'Evaluation should be against the specification, not personal taste.',
        'User testing reveals problems designers cannot predict.'
      ],
      myths: [
        'A good designer gets the answer right on the first attempt.',
        'Constraints only get in the way of good design.',
        'A design should be evaluated by whether the designer likes it.',
        'Prototypes must look exactly like the finished product.'
      ]
    },
    {
      name: 'Materials and Properties', from: 'Grade 6', to: 'College',
      facts: [
        ['tensile strength', 'resistance to being pulled apart'],
        ['compressive strength', 'resistance to being crushed'],
        ['ductility', 'the ability to be drawn into a wire'],
        ['malleability', 'the ability to be hammered into shape'],
        ['hardness', 'resistance to scratching and wear'],
        ['toughness', 'the ability to absorb impact without fracturing'],
        ['elasticity', 'returning to shape after a force is removed'],
        ['thermoplastic', 'a plastic that can be softened and reshaped'],
        ['thermoset', 'a plastic that cannot be remelted once formed'],
        ['composite', 'a material combining two others for better properties'],
        ['ferrous metal', 'a metal containing iron'],
        ['non-ferrous metal', 'a metal without iron, so it does not rust'],
        ['hardwood', 'timber from a broadleaved tree'],
        ['softwood', 'timber from a coniferous tree']
      ],
      truths: [
        'Thermoplastics can be reheated and reshaped; thermosets cannot.',
        'Hardness and toughness are different properties.',
        'Softwood is not necessarily softer than hardwood.',
        'Composites combine materials to get properties neither has alone.'
      ],
      myths: [
        'All plastics can be melted down and reshaped.',
        'A harder material is always a tougher one.',
        'Hardwood always means physically hard timber.',
        'Non-ferrous metals rust in the same way as steel.'
      ]
    },
    {
      name: 'Visual Design Principles', from: 'Grade 6', to: 'College',
      facts: [
        ['contrast', 'a clear difference that draws attention'],
        ['alignment', 'lining elements up so the layout reads as intended'],
        ['hierarchy', 'making importance visible through size and weight'],
        ['balance', 'the distribution of visual weight in a layout'],
        ['white space', 'the empty area that gives a design room to breathe'],
        ['proximity', 'grouping related items close together'],
        ['repetition', 'reusing elements so a design feels unified'],
        ['grid', 'the underlying structure a layout is built on'],
        ['typeface', 'a family of letterforms'],
        ['legibility', 'how easily individual letters can be distinguished'],
        ['readability', 'how easily a block of text can be read'],
        ['colour palette', 'the limited set of colours a design uses'],
        ['accent colour', 'a colour used sparingly to draw the eye'],
        ['consistency', 'treating the same kind of thing the same way']
      ],
      truths: [
        'White space is an active design element, not wasted room.',
        'Legibility concerns letterforms; readability concerns whole passages.',
        'Hierarchy is what tells a reader where to look first.',
        'Consistency reduces the effort of using a design.'
      ],
      myths: [
        'A design should fill every available space.',
        'Legibility and readability are the same property.',
        'More colours make a design more attractive.',
        'Alignment is a matter of taste with no effect on comprehension.'
      ]
    },
    {
      name: 'Sustainable Design', from: 'Grade 7', to: 'College',
      facts: [
        ['life cycle assessment', 'measuring impact from raw material to disposal'],
        ['carbon footprint', 'the greenhouse gas emissions attributable to a product'],
        ['recyclable', 'able to be reprocessed into new material'],
        ['biodegradable', 'able to be broken down by living organisms'],
        ['circular economy', 'an economy designed to keep materials in use'],
        ['planned obsolescence', 'designing a product to be replaced sooner'],
        ['repairability', 'how easily a product can be fixed'],
        ['upcycling', 'reusing material to make something of higher value'],
        ['embodied energy', 'the energy used to make a product'],
        ['renewable material', 'a material that can be regrown'],
        ['six Rs', 'rethink, refuse, reduce, reuse, repair, recycle'],
        ['supply chain', 'the sequence of steps and suppliers behind a product'],
        ['ethical sourcing', 'buying materials under fair conditions'],
        ['disposal', 'the end-of-life stage of a product']
      ],
      truths: [
        'Recyclable and biodegradable mean different things.',
        'Most of a product’s environmental impact is decided at the design stage.',
        'Repairable products keep material in use for longer.',
        'Embodied energy is spent before a product is ever used.'
      ],
      myths: [
        'Biodegradable and recyclable are interchangeable labels.',
        'Recycling alone solves the environmental impact of a product.',
        'A product’s impact is decided mainly by how the customer uses it.',
        'Designing for repair has no effect on total resource use.'
      ]
    }
  ],

  /* ============================== ELECTRONICS ============================== */
  electronics: [
    {
      name: 'Circuit Components', from: 'Grade 7', to: 'College',
      facts: [
        ['resistor', 'a component limiting current'],
        ['capacitor', 'a component storing charge'],
        ['diode', 'a component allowing current one way only'],
        ['LED', 'a diode that emits light when current flows'],
        ['transistor', 'a component used to switch or amplify'],
        ['switch', 'a component making or breaking a circuit'],
        ['cell', 'a single source of electrical energy'],
        ['battery', 'two or more cells connected together'],
        ['fuse', 'a component that melts to break an overloaded circuit'],
        ['relay', 'a switch operated by an electromagnet'],
        ['potentiometer', 'a variable resistor used as a control'],
        ['LDR', 'a resistor whose resistance falls in bright light'],
        ['thermistor', 'a resistor whose resistance changes with temperature'],
        ['integrated circuit', 'many components fabricated on one chip']
      ],
      truths: [
        'An LED only works when connected the right way round.',
        'A resistor is usually needed in series with an LED to limit current.',
        'A relay lets a small current control a much larger one.',
        'A battery is technically a set of cells connected together.'
      ],
      myths: [
        'An LED works whichever way round it is connected.',
        'A capacitor stores current rather than charge.',
        'A fuse makes a circuit safe against every fault.',
        'A single cell is correctly called a battery.'
      ]
    },
    {
      name: 'Circuits and Ohm’s Law', from: 'Grade 8', to: 'College',
      facts: [
        ['Ohm’s law', 'voltage equals current times resistance'],
        ['voltage', 'the energy transferred per unit charge, in volts'],
        ['current', 'the rate of flow of charge, in amperes'],
        ['resistance', 'opposition to current, in ohms'],
        ['series circuit', 'components connected in a single loop'],
        ['parallel circuit', 'components connected across the same two points'],
        ['power', 'voltage multiplied by current, in watts'],
        ['short circuit', 'an unintended low-resistance path'],
        ['open circuit', 'a break stopping any current'],
        ['potential divider', 'two resistors splitting a voltage'],
        ['ammeter', 'the meter placed in series to read current'],
        ['voltmeter', 'the meter placed in parallel to read voltage'],
        ['earth', 'the safety connection to ground'],
        ['circuit diagram', 'a standard-symbol drawing of a circuit']
      ],
      truths: [
        'In a series circuit the current is the same everywhere.',
        'In a parallel circuit each branch has the same voltage across it.',
        'Power in watts equals voltage multiplied by current.',
        'Adding parallel branches lowers the total resistance.'
      ],
      myths: [
        'Current is used up as it flows through components in series.',
        'Voltage is the same across every component in a series circuit.',
        'Adding a resistor in parallel raises the total resistance.',
        'An ammeter should be connected in parallel with a component.'
      ]
    },
    {
      name: 'Logic and Control Systems', from: 'Grade 8', to: 'College',
      facts: [
        ['logic gate', 'a circuit producing an output from binary inputs'],
        ['AND gate', 'a gate whose output is 1 only when both inputs are 1'],
        ['OR gate', 'a gate whose output is 1 when either input is 1'],
        ['NOT gate', 'a gate that inverts its input'],
        ['NAND gate', 'an AND gate with an inverted output'],
        ['truth table', 'a table of every input combination and its output'],
        ['input', 'the signal entering a system'],
        ['process', 'the stage that acts on the input'],
        ['output', 'what the system produces'],
        ['feedback', 'output information fed back to control the input'],
        ['open loop', 'a control system with no feedback'],
        ['closed loop', 'a control system using feedback'],
        ['sensor', 'a device converting a physical quantity to a signal'],
        ['actuator', 'a device that produces movement or action']
      ],
      truths: [
        'An AND gate outputs 1 only when every input is 1.',
        'A closed-loop system uses feedback to correct itself.',
        'A truth table lists every possible combination of inputs.',
        'Any logic function can be built from NAND gates alone.'
      ],
      myths: [
        'An OR gate outputs 1 only when both inputs are 1.',
        'An open-loop system corrects its own errors.',
        'A truth table only lists the inputs that produce a 1.',
        'A sensor and an actuator do the same job.'
      ]
    },
    {
      name: 'Microcontrollers and Programming', from: 'Grade 8', to: 'College',
      facts: [
        ['microcontroller', 'a small computer on a single chip'],
        ['pin', 'a connection point for input or output'],
        ['digital signal', 'a signal with discrete values, usually 0 or 1'],
        ['analogue signal', 'a signal that varies continuously'],
        ['ADC', 'the converter turning an analogue signal into a number'],
        ['PWM', 'switching rapidly to control average power'],
        ['loop', 'the repeating main body of an embedded program'],
        ['setup', 'the code run once when a board starts'],
        ['library', 'reusable code for a component or task'],
        ['serial monitor', 'the console showing messages from the board'],
        ['pull-up resistor', 'a resistor holding an input at a known level'],
        ['debounce', 'filtering the noise from a mechanical switch'],
        ['breadboard', 'a solderless board for building test circuits'],
        ['firmware', 'the program stored on the device itself']
      ],
      truths: [
        'PWM controls average power by switching quickly on and off.',
        'An ADC is needed before a microcontroller can read an analogue sensor.',
        'A pull-up resistor stops an input floating between states.',
        'Switch bounce produces multiple readings from one press.'
      ],
      myths: [
        'A microcontroller can read an analogue voltage directly as a number.',
        'PWM changes the supply voltage itself.',
        'Floating inputs read reliably as zero.',
        'A mechanical switch produces exactly one clean transition.'
      ]
    }
  ],

  /* =============================== ROBOTICS =============================== */
  robotics: [
    {
      name: 'Sensors and Actuators', from: 'Grade 6', to: 'College',
      facts: [
        ['sensor', 'a device detecting a physical quantity'],
        ['actuator', 'a device that produces movement'],
        ['ultrasonic sensor', 'a sensor measuring distance using sound pulses'],
        ['infrared sensor', 'a sensor detecting reflected infrared light'],
        ['line follower', 'a robot using reflected light to track a line'],
        ['servo motor', 'a motor that moves to a commanded angle'],
        ['stepper motor', 'a motor moving in fixed increments'],
        ['DC motor', 'a motor whose speed varies with voltage'],
        ['encoder', 'a sensor reporting how far a motor has turned'],
        ['gyroscope', 'a sensor measuring rotation'],
        ['accelerometer', 'a sensor measuring acceleration'],
        ['calibration', 'adjusting a sensor so its readings are accurate'],
        ['noise', 'unwanted variation in a sensor reading'],
        ['threshold', 'the value at which a decision changes']
      ],
      truths: [
        'An ultrasonic sensor measures distance by timing a returning pulse.',
        'A servo moves to a commanded position; a DC motor simply turns.',
        'Sensor readings always contain some noise.',
        'Calibration is what makes readings comparable between sessions.'
      ],
      myths: [
        'Sensors give exact readings with no error.',
        'A servo and a plain DC motor are controlled the same way.',
        'An ultrasonic sensor works equally well on any surface.',
        'Calibration is only needed once when a robot is built.'
      ]
    },
    {
      name: 'Control and Autonomy', from: 'Grade 7', to: 'College',
      facts: [
        ['control loop', 'the repeated cycle of sensing, deciding and acting'],
        ['feedback', 'using the result of an action to adjust the next one'],
        ['open-loop control', 'acting without checking the result'],
        ['closed-loop control', 'acting and correcting from measurement'],
        ['proportional control', 'correcting in proportion to the error'],
        ['error', 'the difference between wanted and actual state'],
        ['setpoint', 'the value a control system aims at'],
        ['autonomy', 'the ability to act without human direction'],
        ['teleoperation', 'controlling a robot remotely'],
        ['obstacle avoidance', 'changing course to miss an object'],
        ['navigation', 'working out where to go and how to get there'],
        ['dead reckoning', 'estimating position from movement so far'],
        ['drift', 'the accumulation of small positional errors'],
        ['fail-safe', 'a design that reaches a safe state on failure']
      ],
      truths: [
        'Dead reckoning drifts because small errors accumulate.',
        'Proportional control corrects more strongly when the error is larger.',
        'Autonomy exists on a spectrum rather than being on or off.',
        'A fail-safe design ends in a safe state when something breaks.'
      ],
      myths: [
        'Dead reckoning stays accurate indefinitely.',
        'Open-loop control corrects its own errors.',
        'A robot is either fully autonomous or fully controlled.',
        'A fail-safe system never fails.'
      ]
    },
    {
      name: 'Robots, Work and Ethics', from: 'Grade 7', to: 'College',
      facts: [
        ['automation', 'replacing human work with machine work'],
        ['industrial robot', 'a programmable machine used in manufacturing'],
        ['cobot', 'a robot designed to work alongside people'],
        ['end effector', 'the tool at the end of a robot arm'],
        ['degrees of freedom', 'the number of independent ways a robot can move'],
        ['safety cage', 'a barrier separating people from a working robot'],
        ['risk assessment', 'identifying hazards before work begins'],
        ['displacement', 'the loss of jobs to automation'],
        ['reskilling', 'training workers for different roles'],
        ['liability', 'who is responsible when an autonomous system causes harm'],
        ['algorithmic accountability', 'being answerable for automated decisions'],
        ['surveillance', 'monitoring made possible by robotic systems'],
        ['assistive robot', 'a robot supporting people with daily tasks'],
        ['telepresence', 'being present somewhere through a remote machine']
      ],
      truths: [
        'Automation changes the mix of jobs as well as the number.',
        'A cobot is designed to share a workspace with people safely.',
        'Responsibility for an autonomous system’s harm is a legal question, not a technical one.',
        'Degrees of freedom describe how a robot can move, not how fast.'
      ],
      myths: [
        'Automation only ever destroys jobs and creates none.',
        'Any industrial robot is safe to stand next to while it works.',
        'Nobody can be held responsible for an autonomous system’s actions.',
        'More degrees of freedom always means a better robot.'
      ]
    }
  ],

  /* ================================ CLIMATE ================================ */
  climate: [
    {
      name: 'The Greenhouse Effect', from: 'Grade 4', to: 'College',
      facts: [
        ['greenhouse effect', 'the trapping of heat by gases in the atmosphere'],
        ['greenhouse gas', 'a gas that absorbs and re-emits infrared radiation'],
        ['carbon dioxide', 'the greenhouse gas released by burning fossil fuels'],
        ['methane', 'a powerful greenhouse gas from livestock and leaks'],
        ['fossil fuel', 'coal, oil or gas formed from ancient organisms'],
        ['global warming', 'the long-term rise in average surface temperature'],
        ['climate change', 'long-term shifts in temperature and weather patterns'],
        ['carbon footprint', 'the greenhouse gases attributable to an activity'],
        ['albedo', 'how much sunlight a surface reflects'],
        ['feedback loop', 'a process that amplifies or dampens a change'],
        ['ice–albedo feedback', 'melting ice absorbing more heat and melting more'],
        ['carbon sink', 'something that absorbs more carbon than it releases'],
        ['deforestation', 'clearing forest, releasing stored carbon'],
        ['net zero', 'balancing emissions released with emissions removed']
      ],
      truths: [
        'The natural greenhouse effect is what makes Earth habitable.',
        'Melting ice lowers albedo, which causes further warming.',
        'Oceans and forests act as carbon sinks.',
        'Net zero means balancing emissions, not emitting nothing.'
      ],
      myths: [
        'The greenhouse effect is entirely man-made and entirely harmful.',
        'Climate and weather are the same thing measured differently.',
        'Net zero means no greenhouse gases are emitted at all.',
        'Carbon dioxide is the only greenhouse gas that matters.'
      ]
    },
    {
      name: 'Energy Sources and Emissions', from: 'Grade 5', to: 'College',
      facts: [
        ['renewable energy', 'energy from a source that is replenished'],
        ['non-renewable energy', 'energy from a finite source'],
        ['solar power', 'electricity generated from sunlight'],
        ['wind power', 'electricity generated by turbines'],
        ['hydroelectric power', 'electricity generated from moving water'],
        ['geothermal energy', 'heat drawn from underground'],
        ['biomass', 'fuel made from recently living material'],
        ['nuclear power', 'electricity from splitting heavy nuclei'],
        ['intermittency', 'the problem of supply varying with weather'],
        ['energy storage', 'holding energy until it is needed'],
        ['grid', 'the network distributing electricity'],
        ['energy efficiency', 'getting the same result from less energy'],
        ['carbon intensity', 'emissions per unit of electricity generated'],
        ['transition', 'the shift from fossil fuels to low-carbon sources']
      ],
      truths: [
        'Nuclear power is low-carbon but not renewable.',
        'Intermittency is why storage matters for wind and solar.',
        'Energy efficiency reduces emissions without changing the source.',
        'Every energy source has some environmental cost.'
      ],
      myths: [
        'Nuclear power is a renewable energy source.',
        'Renewable energy has no environmental impact at all.',
        'Solar panels only work in hot countries.',
        'Efficiency improvements make no difference to emissions.'
      ]
    },
    {
      name: 'Impacts and Adaptation', from: 'Grade 6', to: 'College',
      facts: [
        ['sea level rise', 'the increase caused by melting ice and warming water'],
        ['thermal expansion', 'the swelling of water as it warms'],
        ['extreme weather', 'events at the far end of the normal range'],
        ['drought', 'a prolonged shortage of water'],
        ['flooding', 'water covering land that is normally dry'],
        ['ocean acidification', 'the fall in ocean pH as it absorbs carbon dioxide'],
        ['coral bleaching', 'coral expelling its algae under heat stress'],
        ['migration', 'the movement of species or people as conditions change'],
        ['adaptation', 'adjusting to the effects of climate change'],
        ['mitigation', 'reducing emissions to limit further change'],
        ['resilience', 'the ability to absorb a shock and recover'],
        ['flood defence', 'infrastructure protecting land from water'],
        ['heatwave', 'a prolonged period of unusually high temperature'],
        ['tipping point', 'a threshold beyond which change accelerates']
      ],
      truths: [
        'Sea level rises from both melting ice and the expansion of warming water.',
        'Adaptation and mitigation are different responses, and both are needed.',
        'Ocean acidification is caused by carbon dioxide dissolving in seawater.',
        'Climate change shifts the odds of extreme weather rather than causing single events alone.'
      ],
      myths: [
        'Sea level rise is caused only by melting sea ice.',
        'Adaptation and mitigation mean the same thing.',
        'A cold winter disproves long-term warming.',
        'Ocean acidification is caused by industrial acid being dumped at sea.'
      ]
    },
    {
      name: 'Policy and Action', from: 'Grade 7', to: 'College',
      facts: [
        ['Paris Agreement', 'the 2015 treaty on limiting global temperature rise'],
        ['emissions target', 'a commitment to cut emissions by a set amount'],
        ['carbon tax', 'a charge on the carbon content of fuels'],
        ['cap and trade', 'a limit on emissions with tradable permits'],
        ['subsidy', 'public money supporting a chosen technology'],
        ['carbon offset', 'paying for a reduction elsewhere to balance an emission'],
        ['greenwashing', 'claiming more environmental credit than is deserved'],
        ['COP', 'the annual UN climate conference'],
        ['IPCC', 'the body that assesses climate science for policymakers'],
        ['just transition', 'shifting to low carbon without abandoning workers'],
        ['individual action', 'changes made by a person or household'],
        ['systemic change', 'change to the rules and infrastructure everyone uses'],
        ['circular economy', 'an economy designed to keep materials in use'],
        ['climate finance', 'funding to help poorer countries cut and adapt']
      ],
      truths: [
        'The IPCC assesses existing research rather than doing its own experiments.',
        'Carbon offsets only work if the reduction would not have happened anyway.',
        'Both individual and systemic changes matter, on very different scales.',
        'A just transition is about who bears the cost of change.'
      ],
      myths: [
        'The IPCC carries out its own original climate experiments.',
        'Buying offsets is always equivalent to not emitting.',
        'Individual behaviour change alone is enough to reach net zero.',
        'Climate policy is purely a scientific question with no economic dimension.'
      ]
    }
  ],

  /* ============================== CONSERVATION ============================== */
  conservation: [
    {
      name: 'Biodiversity and Habitats', from: 'Grade 4', to: 'College',
      facts: [
        ['biodiversity', 'the variety of life in a place'],
        ['habitat', 'the place where an organism lives'],
        ['ecosystem', 'a community of organisms and their environment'],
        ['species richness', 'the number of different species present'],
        ['keystone species', 'a species with an outsized effect on its ecosystem'],
        ['endemic species', 'a species found nowhere else'],
        ['invasive species', 'a non-native species that spreads and causes harm'],
        ['habitat loss', 'the main cause of species decline worldwide'],
        ['fragmentation', 'breaking a habitat into isolated patches'],
        ['corridor', 'a strip of habitat connecting fragments'],
        ['endangered', 'at serious risk of extinction'],
        ['extinct', 'no longer existing anywhere'],
        ['protected area', 'land or sea managed for conservation'],
        ['rewilding', 'restoring natural processes to an area']
      ],
      truths: [
        'Habitat loss is the leading cause of species decline worldwide.',
        'Removing a keystone species can transform an entire ecosystem.',
        'Fragmentation harms species even when the total area is unchanged.',
        'An invasive species causes harm precisely because its controls are absent.'
      ],
      myths: [
        'Hunting is the main cause of species decline today.',
        'Every non-native species is invasive.',
        'A habitat split into pieces supports the same wildlife as one large area.',
        'Extinct and endangered mean the same thing.'
      ]
    },
    {
      name: 'Pollution and Waste', from: 'Grade 4', to: 'College',
      facts: [
        ['pollution', 'the introduction of harmful material into an environment'],
        ['microplastic', 'a plastic fragment under five millimetres'],
        ['eutrophication', 'nutrient enrichment causing algal blooms and oxygen loss'],
        ['acid rain', 'rain made acidic by sulfur and nitrogen oxides'],
        ['bioaccumulation', 'the build-up of a substance inside an organism'],
        ['biomagnification', 'the concentration of a substance up a food chain'],
        ['landfill', 'a site where waste is buried'],
        ['incineration', 'burning waste, sometimes to generate energy'],
        ['recycling', 'reprocessing material into new products'],
        ['composting', 'letting organic waste decay into soil improver'],
        ['single-use plastic', 'plastic designed to be thrown away after one use'],
        ['leachate', 'liquid draining from a landfill'],
        ['air quality', 'the concentration of pollutants in the air'],
        ['particulates', 'tiny airborne particles that harm the lungs']
      ],
      truths: [
        'Biomagnification means top predators carry the highest concentrations.',
        'Eutrophication kills fish by removing oxygen from the water.',
        'Recycling reduces waste but uses energy of its own.',
        'Microplastics are now found throughout the food chain.'
      ],
      myths: [
        'Pollutants become more dilute as they move up a food chain.',
        'Eutrophication is harmless because it only makes plants grow.',
        'Recycling is a completely energy-free process.',
        'Landfill waste decomposes quickly and harmlessly.'
      ]
    },
    {
      name: 'Conservation in Practice', from: 'Grade 5', to: 'College',
      facts: [
        ['captive breeding', 'breeding endangered animals in managed care'],
        ['reintroduction', 'returning a species to former habitat'],
        ['seed bank', 'a store of seeds preserved against loss'],
        ['sustainable harvesting', 'taking only what a population can replace'],
        ['quota', 'a legal limit on how much may be taken'],
        ['CITES', 'the treaty controlling trade in endangered species'],
        ['poaching', 'illegal hunting or collection'],
        ['ecotourism', 'tourism that funds and depends on conservation'],
        ['stakeholder', 'anyone affected by a conservation decision'],
        ['monitoring', 'tracking a population over time'],
        ['restoration', 'repairing a damaged ecosystem'],
        ['buffer zone', 'an area of limited use around a protected core'],
        ['community conservation', 'conservation led by local people'],
        ['conflict', 'the tension between human needs and wildlife protection']
      ],
      truths: [
        'Conservation that ignores local livelihoods usually fails.',
        'Reintroduction needs the original cause of decline to be removed first.',
        'Monitoring is what shows whether a conservation measure worked.',
        'Ecotourism can fund protection but brings pressures of its own.'
      ],
      myths: [
        'Captive breeding alone is enough to save a species.',
        'Conservation is simply a matter of fencing an area off.',
        'Local communities are an obstacle to conservation rather than part of it.',
        'A reintroduced species will thrive wherever it is released.'
      ]
    },
    {
      name: 'Resources and Sustainability', from: 'Grade 5', to: 'College',
      facts: [
        ['sustainability', 'meeting present needs without preventing future ones'],
        ['renewable resource', 'a resource replenished as it is used'],
        ['non-renewable resource', 'a resource that cannot be replaced'],
        ['overfishing', 'catching fish faster than they can reproduce'],
        ['deforestation', 'the permanent clearing of forest'],
        ['soil degradation', 'the loss of soil fertility and structure'],
        ['water scarcity', 'demand for water exceeding what is available'],
        ['ecological footprint', 'the land and sea needed to support consumption'],
        ['carrying capacity', 'the population an environment can support'],
        ['stewardship', 'the responsible management of a shared resource'],
        ['tragedy of the commons', 'the overuse of a shared resource by individuals'],
        ['certification', 'a label showing a product met a standard'],
        ['food miles', 'the distance food travels to reach the consumer'],
        ['local sourcing', 'buying from nearby producers']
      ],
      truths: [
        'The tragedy of the commons describes rational individuals depleting a shared resource.',
        'A renewable resource can still be exhausted if used faster than it regenerates.',
        'Food miles are only one part of a food’s environmental impact.',
        'Carrying capacity depends on how a population lives, not only its size.'
      ],
      myths: [
        'Renewable resources cannot be exhausted.',
        'Locally grown food always has the lowest environmental impact.',
        'The tragedy of the commons requires someone to act maliciously.',
        'Sustainability only concerns future generations, not the present.'
      ]
    }
  ],

  /* ================================= MEDIA ================================= */
  media: [
    {
      name: 'Reading the News', from: 'Grade 6', to: 'College',
      facts: [
        ['headline', 'the title designed to draw a reader in'],
        ['byline', 'the line naming who wrote a piece'],
        ['lede', 'the opening that carries the main news'],
        ['source', 'the person or document information came from'],
        ['attribution', 'naming where a claim came from'],
        ['anonymous source', 'a source whose identity is withheld'],
        ['bias', 'a consistent slant in coverage'],
        ['balance', 'giving weight to different sides of a story'],
        ['false balance', 'treating unequal evidence as equally strong'],
        ['fact-checking', 'verifying claims against evidence'],
        ['misinformation', 'false information spread without intent to deceive'],
        ['disinformation', 'false information spread deliberately'],
        ['clickbait', 'a headline written to attract clicks over accuracy'],
        ['op-ed', 'an opinion piece, distinct from a news report']
      ],
      truths: [
        'Misinformation is spread without intent; disinformation is deliberate.',
        'False balance can make a fringe claim look as strong as a consensus.',
        'A headline is often written by an editor, not the reporter.',
        'Opinion pieces and news reports have different standards.'
      ],
      myths: [
        'Misinformation and disinformation mean the same thing.',
        'Giving both sides equal space always makes coverage fair.',
        'The reporter always writes the headline.',
        'Anything in a newspaper is a news report.'
      ]
    },
    {
      name: 'Film and Moving Image Language', from: 'Grade 6', to: 'College',
      facts: [
        ['shot', 'a single continuous piece of film'],
        ['close-up', 'a shot filling the frame with a face or detail'],
        ['long shot', 'a shot showing a subject at a distance'],
        ['establishing shot', 'a shot setting the scene at the start'],
        ['high angle', 'a camera looking down, often diminishing the subject'],
        ['low angle', 'a camera looking up, often empowering the subject'],
        ['pan', 'a camera turning horizontally'],
        ['tilt', 'a camera turning vertically'],
        ['tracking shot', 'a camera moving with the subject'],
        ['cut', 'an instant change from one shot to another'],
        ['montage', 'a sequence of shots compressing time'],
        ['diegetic sound', 'sound that comes from within the story world'],
        ['non-diegetic sound', 'sound such as a score, outside the story world'],
        ['mise-en-scène', 'everything arranged within the frame']
      ],
      truths: [
        'A low-angle shot tends to make a subject look powerful.',
        'Non-diegetic sound is heard by the audience but not the characters.',
        'An establishing shot orients the viewer before the action.',
        'Editing choices shape meaning as much as what is filmed.'
      ],
      myths: [
        'A high-angle shot makes a character look powerful.',
        'All sound in a film is heard by the characters.',
        'Mise-en-scène refers only to the actors’ positions.',
        'Editing simply removes unwanted footage.'
      ]
    },
    {
      name: 'Advertising and Media Messages', from: 'Grade 6', to: 'College',
      facts: [
        ['target audience', 'the group a message is designed for'],
        ['demographic', 'a group defined by age, income or similar'],
        ['representation', 'how groups of people are portrayed'],
        ['stereotype', 'a simplified fixed portrayal of a group'],
        ['persuasive technique', 'a method used to influence an audience'],
        ['product placement', 'a brand shown within entertainment content'],
        ['sponsored content', 'paid material presented as editorial'],
        ['disclosure', 'stating that content is paid for'],
        ['aspiration', 'the appeal to who the audience would like to be'],
        ['scarcity appeal', 'suggesting an offer will not last'],
        ['social proof', 'suggesting that others already approve'],
        ['regulation', 'the rules limiting what adverts may claim'],
        ['media literacy', 'the ability to analyse and evaluate media'],
        ['audience response', 'the different ways viewers read the same text']
      ],
      truths: [
        'Sponsored content must be disclosed as advertising.',
        'The same advert can be read differently by different audiences.',
        'Scarcity and social proof are deliberate persuasive techniques.',
        'Representation shapes what audiences take to be normal.'
      ],
      myths: [
        'Product placement is not a form of advertising.',
        'Everyone interprets an advert the same way.',
        'Adverts are free to make any claim they like.',
        'Media literacy means distrusting everything.'
      ]
    },
    {
      name: 'Social Media and Platforms', from: 'Grade 6', to: 'College',
      facts: [
        ['algorithm', 'the system deciding what a platform shows you'],
        ['engagement', 'the interaction a post receives'],
        ['filter bubble', 'seeing mainly views you already agree with'],
        ['echo chamber', 'a space where the same views are repeated back'],
        ['virality', 'rapid spreading through sharing'],
        ['moderation', 'the removal of content that breaks the rules'],
        ['creator economy', 'people earning income from their own content'],
        ['monetisation', 'turning attention into revenue'],
        ['deepfake', 'synthetic media imitating a real person'],
        ['verification', 'checking whether something is genuine'],
        ['reverse image search', 'a technique for tracing where an image came from'],
        ['metadata', 'data describing a file, such as when it was created'],
        ['digital literacy', 'the skills needed to use and question digital media'],
        ['attention economy', 'the competition for people’s limited attention']
      ],
      truths: [
        'Platform algorithms are optimised for engagement, not accuracy.',
        'A reverse image search can reveal that a photo is older than claimed.',
        'Deepfakes make verification harder but not impossible.',
        'A filter bubble can form without anyone choosing it deliberately.'
      ],
      myths: [
        'Platform feeds show posts in simple chronological order.',
        'If an image looks real, it must be genuine.',
        'Moderation decisions are made entirely by humans.',
        'Everyone using a platform sees the same content.'
      ]
    }
  ],

  /* ============================== ART HISTORY ============================== */
  'art-history': [
    {
      name: 'Elements and Principles of Art', from: 'Grade 6', to: 'College',
      facts: [
        ['line', 'the mark that defines edges and direction'],
        ['shape', 'a two-dimensional enclosed area'],
        ['form', 'a three-dimensional volume'],
        ['tone', 'the lightness or darkness of an area'],
        ['texture', 'the surface quality of a work'],
        ['colour', 'the hue, saturation and value of an area'],
        ['space', 'the area around and between elements'],
        ['composition', 'the arrangement of elements in a work'],
        ['balance', 'the distribution of visual weight'],
        ['contrast', 'the difference that creates interest'],
        ['rhythm', 'repetition that creates movement in a work'],
        ['focal point', 'the area that draws the eye first'],
        ['perspective', 'the method of showing depth on a flat surface'],
        ['proportion', 'the size relationship between parts']
      ],
      truths: [
        'Tone is what creates the illusion of three dimensions.',
        'Composition is a set of decisions, not an accident.',
        'A focal point can be created with contrast, placement or colour.',
        'Shape is two-dimensional; form is three-dimensional.'
      ],
      myths: [
        'Colour is the only element that matters in a painting.',
        'Shape and form mean the same thing.',
        'A balanced composition must be perfectly symmetrical.',
        'Perspective was used consistently in every era of art.'
      ]
    },
    {
      name: 'Renaissance and Baroque', from: 'Grade 7', to: 'College',
      facts: [
        ['Leonardo da Vinci', 'painter of the Mona Lisa and the Last Supper'],
        ['Michelangelo', 'sculptor of David and painter of the Sistine ceiling'],
        ['Raphael', 'painter of the School of Athens'],
        ['linear perspective', 'the geometric system giving convincing depth'],
        ['chiaroscuro', 'strong contrast between light and dark'],
        ['sfumato', 'the soft blurring of edges in a painting'],
        ['fresco', 'painting onto wet plaster'],
        ['Caravaggio', 'the Baroque painter known for dramatic lighting'],
        ['Rembrandt', 'the Dutch master of light, shadow and self-portraits'],
        ['tenebrism', 'extreme contrast with figures emerging from darkness'],
        ['patron', 'the person or institution paying for a work'],
        ['Baroque', 'the 17th-century style of drama and movement'],
        ['still life', 'a painting of arranged inanimate objects'],
        ['commission', 'a work made to order for a client']
      ],
      truths: [
        'Linear perspective was formalised in the Italian Renaissance.',
        'Chiaroscuro uses strong light and dark contrast to model form.',
        'Most Renaissance works were made on commission for a patron.',
        'Fresco must be painted while the plaster is still wet.'
      ],
      myths: [
        'Renaissance artists worked without patrons or commissions.',
        'Sfumato means painting with hard, sharp outlines.',
        'Fresco is painted onto dry plaster.',
        'Baroque and Renaissance describe the same period and style.'
      ]
    },
    {
      name: 'Impressionism to Modernism', from: 'Grade 7', to: 'College',
      facts: [
        ['Impressionism', 'the movement capturing light and momentary effect'],
        ['Claude Monet', 'the Impressionist of water lilies and haystacks'],
        ['en plein air', 'painting outdoors, directly from the subject'],
        ['Post-Impressionism', 'the movements that followed and reacted to Impressionism'],
        ['Vincent van Gogh', 'the painter of thick expressive brushwork'],
        ['Paul Cézanne', 'the painter who reduced nature to underlying forms'],
        ['Cubism', 'the movement showing several viewpoints at once'],
        ['Pablo Picasso', 'the co-founder of Cubism'],
        ['Surrealism', 'the movement drawing on dreams and the unconscious'],
        ['Salvador Dalí', 'the Surrealist of melting clocks'],
        ['abstraction', 'art that does not depict recognisable subjects'],
        ['Expressionism', 'art distorting form to convey emotion'],
        ['avant-garde', 'work ahead of accepted taste'],
        ['modern art', 'the art of roughly 1860 to 1970']
      ],
      truths: [
        'Portable paint tubes helped make painting outdoors practical.',
        'Cubism shows several viewpoints of a subject at once.',
        'Impressionism was initially mocked by critics.',
        'Abstraction does not mean the absence of structure or planning.'
      ],
      myths: [
        'Impressionism was immediately celebrated by the art establishment.',
        'Cubism shows a subject from a single fixed viewpoint.',
        'Abstract art requires no skill or planning.',
        'Van Gogh was a leading Cubist painter.'
      ]
    },
    {
      name: 'Contemporary and Global Art', from: 'Grade 8', to: 'College',
      facts: [
        ['conceptual art', 'art in which the idea matters more than the object'],
        ['installation', 'a work made for and shaped by a particular space'],
        ['performance art', 'art in which the artist’s action is the work'],
        ['Pop Art', 'the movement drawing on advertising and mass media'],
        ['Andy Warhol', 'the Pop artist of repeated printed images'],
        ['street art', 'art made in public space, often unsanctioned'],
        ['digital art', 'work made or shown using digital tools'],
        ['curator', 'the person who selects and arranges works for display'],
        ['gallery', 'a space where art is exhibited'],
        ['provenance', 'the ownership history of a work'],
        ['repatriation', 'returning cultural objects to their place of origin'],
        ['cultural appropriation', 'taking from a culture without understanding or credit'],
        ['biennale', 'a large international exhibition held every two years'],
        ['art market', 'the buying and selling of works']
      ],
      truths: [
        'In conceptual art the idea can matter more than the finished object.',
        'Repatriation debates concern how museum collections were assembled.',
        'A curator shapes meaning through selection and arrangement.',
        'Provenance affects both the value and the legality of a work.'
      ],
      myths: [
        'Conceptual art is defined by how skilfully it is made.',
        'Museum collections were all assembled by straightforward purchase.',
        'A curator simply hangs works wherever they fit.',
        'Street art and vandalism are legally identical in every jurisdiction.'
      ]
    },
    {
      name: 'Analysing and Describing Art', from: 'Grade 6', to: 'College',
      facts: [
        ['formal analysis', 'describing how a work is made and arranged'],
        ['subject matter', 'what a work depicts'],
        ['context', 'the circumstances in which a work was made'],
        ['medium', 'the material a work is made from'],
        ['scale', 'the size of a work relative to the viewer'],
        ['iconography', 'the study of symbols and their meanings'],
        ['interpretation', 'a supported account of what a work means'],
        ['critique', 'a structured judgement of a work'],
        ['influence', 'the effect one artist or work has on another'],
        ['style', 'the characteristic way a work is made'],
        ['technique', 'the specific method used'],
        ['viewpoint', 'where the work positions the viewer'],
        ['intention', 'what the artist set out to do'],
        ['reception', 'how audiences have responded over time']
      ],
      truths: [
        'Formal analysis describes what is there before saying what it means.',
        'Scale changes how a viewer experiences a work.',
        'An interpretation should be supported by evidence in the work.',
        'A work’s meaning can shift as its audience changes.'
      ],
      myths: [
        'Analysing a work means guessing what the artist was feeling.',
        'The size of a work has no bearing on its effect.',
        'Only the artist’s stated intention counts as meaning.',
        'A work means exactly the same thing in every period.'
      ]
    }
  ],

  /* ============================== MUSIC THEORY ============================== */
  'music-theory': [
    {
      name: 'Notation and Rhythm', from: 'Grade 4', to: 'Grade 12',
      facts: [
        ['stave', 'the five lines music is written on'],
        ['treble clef', 'the clef used for higher-pitched parts'],
        ['bass clef', 'the clef used for lower-pitched parts'],
        ['semibreve', 'a note lasting four beats in common time'],
        ['minim', 'a note lasting two beats'],
        ['crotchet', 'a note lasting one beat'],
        ['quaver', 'a note lasting half a beat'],
        ['rest', 'a symbol showing a silence of set length'],
        ['time signature', 'the numbers showing beats per bar'],
        ['bar', 'a unit of music containing a set number of beats'],
        ['tie', 'a curved line joining two notes into one length'],
        ['dotted note', 'a note lengthened by half its own value'],
        ['tempo', 'the speed of the music'],
        ['syncopation', 'stress placed on a normally weak beat']
      ],
      truths: [
        'A dot after a note adds half of that note’s value.',
        'The top number of a time signature gives the beats per bar.',
        'A rest is as much part of the rhythm as a note.',
        'Syncopation places emphasis off the expected beat.'
      ],
      myths: [
        'A dot after a note doubles its length.',
        'The bottom number of a time signature gives the beats per bar.',
        'Rests can be ignored when counting a rhythm.',
        'Tempo and time signature mean the same thing.'
      ]
    },
    {
      name: 'Pitch, Scales and Keys', from: 'Grade 5', to: 'Grade 12',
      facts: [
        ['pitch', 'how high or low a note sounds'],
        ['semitone', 'the smallest standard interval in Western music'],
        ['tone', 'an interval of two semitones'],
        ['major scale', 'a scale with the pattern tone-tone-semitone-tone-tone-tone-semitone'],
        ['minor scale', 'a scale with a flattened third, sounding darker'],
        ['key signature', 'the sharps or flats shown at the start of a stave'],
        ['sharp', 'a symbol raising a note by a semitone'],
        ['flat', 'a symbol lowering a note by a semitone'],
        ['natural', 'a symbol cancelling a sharp or flat'],
        ['octave', 'the interval between a note and the next of the same name'],
        ['interval', 'the distance between two pitches'],
        ['tonic', 'the home note of a key'],
        ['chromatic scale', 'a scale moving entirely in semitones'],
        ['transposition', 'moving music up or down in pitch']
      ],
      truths: [
        'A major scale follows the pattern tone, tone, semitone, tone, tone, tone, semitone.',
        'A sharp raises a note by one semitone.',
        'The tonic is the note a key is centred on.',
        'Transposing music keeps the intervals and changes the pitch.'
      ],
      myths: [
        'A tone and a semitone are the same interval.',
        'A flat raises a note by a semitone.',
        'Every scale contains the same pattern of intervals.',
        'Transposing music changes the tune itself.'
      ]
    },
    {
      name: 'Chords and Harmony', from: 'Grade 6', to: 'Grade 12',
      facts: [
        ['chord', 'two or more notes sounded together'],
        ['triad', 'a three-note chord built in thirds'],
        ['major chord', 'a triad with a major third at the bottom'],
        ['minor chord', 'a triad with a minor third at the bottom'],
        ['root', 'the note a chord is built on'],
        ['inversion', 'a chord with a note other than the root at the bottom'],
        ['cadence', 'a chord progression that ends a phrase'],
        ['perfect cadence', 'a finished-sounding ending, chord V to I'],
        ['harmony', 'the combination of simultaneous pitches'],
        ['arpeggio', 'the notes of a chord played one after another'],
        ['dissonance', 'a combination that sounds unresolved'],
        ['consonance', 'a combination that sounds settled'],
        ['progression', 'a sequence of chords'],
        ['seventh chord', 'a triad with an added seventh above the root']
      ],
      truths: [
        'A triad is built from a root, a third and a fifth.',
        'A perfect cadence moves from chord V to chord I.',
        'An arpeggio is a chord played one note at a time.',
        'Dissonance is used deliberately to create tension.'
      ],
      myths: [
        'A triad is any group of three notes played together.',
        'A perfect cadence moves from chord I to chord V.',
        'Dissonance is always a mistake to be avoided.',
        'An inversion changes which notes are in a chord.'
      ]
    },
    {
      name: 'Instruments and Ensembles', from: 'Grade 4', to: 'Grade 12',
      facts: [
        ['strings', 'the orchestral family including violin and cello'],
        ['woodwind', 'the family including flute, clarinet and oboe'],
        ['brass', 'the family including trumpet, horn and trombone'],
        ['percussion', 'instruments played by striking or shaking'],
        ['violin', 'the highest-pitched orchestral string instrument'],
        ['cello', 'the string instrument played between the knees'],
        ['clarinet', 'a single-reed woodwind instrument'],
        ['oboe', 'a double-reed woodwind instrument'],
        ['timpani', 'tuned drums used in the orchestra'],
        ['conductor', 'the person who directs an ensemble'],
        ['orchestra', 'a large ensemble of the four families'],
        ['chamber music', 'music for a small group, one player per part'],
        ['ensemble', 'any group playing together'],
        ['section', 'a group of the same instruments within an ensemble']
      ],
      truths: [
        'The flute is a woodwind instrument even though it is made of metal.',
        'Timpani are tuned to specific pitches.',
        'Chamber music has one player per part.',
        'The conductor shapes tempo, balance and expression.'
      ],
      myths: [
        'The flute is a brass instrument because it is metal.',
        'All percussion instruments are untuned.',
        'Chamber music simply means quiet music.',
        'A conductor keeps time and nothing more.'
      ]
    },
    {
      name: 'Style, Form and Expression', from: 'Grade 5', to: 'Grade 12',
      facts: [
        ['dynamics', 'how loud or soft the music is'],
        ['forte', 'loud'],
        ['piano', 'soft'],
        ['crescendo', 'gradually getting louder'],
        ['diminuendo', 'gradually getting softer'],
        ['legato', 'played smoothly and connected'],
        ['staccato', 'played short and detached'],
        ['texture', 'how many layers of sound there are and how they relate'],
        ['melody', 'the main tune'],
        ['accompaniment', 'the parts supporting the melody'],
        ['binary form', 'a structure in two sections, AB'],
        ['ternary form', 'a structure in three sections, ABA'],
        ['ostinato', 'a short repeated pattern'],
        ['motif', 'a short musical idea developed through a piece']
      ],
      truths: [
        'Dynamics are relative, not fixed volume levels.',
        'Ternary form returns to its opening material.',
        'An ostinato is a pattern that repeats persistently.',
        'Staccato and legato describe articulation, not speed.'
      ],
      myths: [
        'Forte means fast and piano means slow.',
        'Binary form has three sections.',
        'Staccato means playing quietly.',
        'Texture describes the same thing as dynamics.'
      ]
    }
  ],

  /* ================================= DRAMA ================================= */
  drama: [
    {
      name: 'Acting and Performance Skills', from: 'Grade 4', to: 'Grade 12',
      facts: [
        ['characterisation', 'building a believable role'],
        ['objective', 'what a character wants in a scene'],
        ['motivation', 'why a character wants it'],
        ['subtext', 'what is meant beneath what is said'],
        ['projection', 'sending the voice so it carries'],
        ['diction', 'clarity of speech'],
        ['pace', 'the speed of delivery'],
        ['gesture', 'a movement of the body that carries meaning'],
        ['proxemics', 'the meaning created by distance between actors'],
        ['status', 'the power relationship between characters'],
        ['improvisation', 'performing without a script'],
        ['blocking', 'the planned movement of actors on stage'],
        ['ensemble', 'a company working as one unit'],
        ['cue', 'the signal to speak or act']
      ],
      truths: [
        'Subtext is what a character means rather than what they say.',
        'Proxemics uses physical distance to signal relationship.',
        'An objective is what the character wants in the scene.',
        'Projection is about support and clarity, not shouting.'
      ],
      myths: [
        'Projection simply means shouting louder.',
        'Subtext is anything an actor improvises.',
        'Blocking is decided by each actor during a performance.',
        'A character’s objective and motivation are the same thing.'
      ]
    },
    {
      name: 'Staging and Design', from: 'Grade 5', to: 'Grade 12',
      facts: [
        ['proscenium', 'a stage viewed through a frame from one side'],
        ['thrust stage', 'a stage extending into the audience on three sides'],
        ['theatre in the round', 'a stage surrounded by the audience'],
        ['traverse', 'a stage with audience on two opposite sides'],
        ['set', 'the constructed environment of a production'],
        ['props', 'objects handled by the actors'],
        ['lighting state', 'a particular arrangement of lighting'],
        ['gel', 'a coloured filter placed over a lantern'],
        ['spotlight', 'a focused beam picking out one area'],
        ['sound cue', 'a planned sound effect or music entry'],
        ['costume', 'what the performers wear'],
        ['stage left', 'the actor’s left when facing the audience'],
        ['upstage', 'the area furthest from the audience'],
        ['sightline', 'the audience’s view of the stage']
      ],
      truths: [
        'Stage directions are given from the actor’s point of view.',
        'Theatre in the round makes sightlines a central design problem.',
        'Lighting can change the meaning of a scene without a word.',
        'Upstage is the area furthest from the audience.'
      ],
      myths: [
        'Stage left means the audience’s left.',
        'Upstage means closest to the audience.',
        'Lighting only makes the stage visible.',
        'Every stage is a proscenium stage.'
      ]
    },
    {
      name: 'Genre, Text and Response', from: 'Grade 6', to: 'Grade 12',
      facts: [
        ['tragedy', 'drama ending in the downfall of its central figure'],
        ['comedy', 'drama ending in reconciliation or resolution'],
        ['naturalism', 'a style aiming for lifelike detail'],
        ['physical theatre', 'a style built primarily on the body'],
        ['epic theatre', 'Brecht’s style asking the audience to think, not identify'],
        ['fourth wall', 'the imaginary wall between stage and audience'],
        ['breaking the fourth wall', 'addressing the audience directly'],
        ['monologue', 'an extended speech by one character'],
        ['stage directions', 'the writer’s instructions in the script'],
        ['dramatic tension', 'the uncertainty that holds an audience'],
        ['catharsis', 'the release of emotion an audience experiences'],
        ['antagonist', 'the force opposing the protagonist'],
        ['audience response', 'the effect a performance has on those watching'],
        ['review', 'a written judgement of a production']
      ],
      truths: [
        'Brecht wanted audiences to think critically rather than lose themselves.',
        'Breaking the fourth wall means speaking directly to the audience.',
        'Stage directions are part of the playwright’s text.',
        'Dramatic tension comes from uncertainty about what happens next.'
      ],
      myths: [
        'Naturalism and epic theatre aim at the same audience experience.',
        'The fourth wall is a physical part of the set.',
        'Stage directions are added by the director, not the writer.',
        'Comedy simply means a play containing jokes.'
      ]
    }
  ],

  /* ============================== STUDY SKILLS ============================== */
  notes: [
    {
      name: 'Note-Taking Methods', from: 'Grade 6', to: 'College',
      facts: [
        ['Cornell method', 'a page split into cues, notes and a summary'],
        ['mind map', 'a branching diagram radiating from a central idea'],
        ['outline method', 'hierarchical notes using indentation'],
        ['flow notes', 'freeform notes connecting ideas as they come'],
        ['abbreviation', 'a shortened form used to write faster'],
        ['keyword', 'the word carrying the essential meaning'],
        ['summary', 'a condensed version written in your own words'],
        ['annotation', 'a note added to an existing text'],
        ['highlighting', 'marking text, best used sparingly'],
        ['review', 'returning to notes soon after making them'],
        ['legibility', 'whether notes can still be read later'],
        ['structure', 'the organisation that makes notes usable'],
        ['paraphrasing', 'restating an idea in your own words'],
        ['linking', 'connecting a new idea to something already known']
      ],
      truths: [
        'Notes written in your own words are recalled better than copied ones.',
        'Reviewing notes soon after making them sharply improves retention.',
        'Highlighting alone is one of the least effective study methods.',
        'The best note-taking method is the one you will actually review.'
      ],
      myths: [
        'Copying the board word for word is the most effective way to take notes.',
        'Highlighting a textbook is enough to learn its content.',
        'Notes only need to be read again just before an exam.',
        'One note-taking method suits every subject equally.'
      ]
    },
    {
      name: 'Organising Information', from: 'Grade 6', to: 'College',
      facts: [
        ['categorisation', 'grouping information into meaningful sets'],
        ['hierarchy', 'arranging ideas from general to specific'],
        ['chunking', 'grouping items so more can be held in mind'],
        ['concept map', 'a diagram showing how ideas relate'],
        ['index', 'a list showing where information can be found'],
        ['filing system', 'a consistent way of storing material'],
        ['naming convention', 'a consistent pattern for file names'],
        ['version', 'a numbered or dated iteration of a document'],
        ['backup', 'a second copy kept separately'],
        ['prioritisation', 'deciding what matters most'],
        ['checklist', 'a list ensuring nothing is missed'],
        ['glossary', 'a personal list of key terms and meanings'],
        ['cross-reference', 'a pointer from one place to related material'],
        ['retrieval', 'finding information again when it is needed']
      ],
      truths: [
        'Chunking increases how much can be held in working memory.',
        'A filing system is only useful if it is applied consistently.',
        'Making information easy to retrieve is the point of organising it.',
        'A concept map shows relationships, not just a list of topics.'
      ],
      myths: [
        'Working memory capacity can be increased by effort alone.',
        'Organising notes is wasted time better spent reading.',
        'A concept map is just a decorated list.',
        'One backup on the same device is enough.'
      ]
    },
    {
      name: 'Reading to Learn', from: 'Grade 6', to: 'College',
      facts: [
        ['skimming', 'reading quickly for the general idea'],
        ['scanning', 'searching for one specific detail'],
        ['active reading', 'reading with questions in mind'],
        ['SQ3R', 'survey, question, read, recite, review'],
        ['previewing', 'looking over a text before reading it properly'],
        ['annotation', 'marking up a text as you read'],
        ['self-explanation', 'putting what you have read into your own words'],
        ['comprehension check', 'testing whether you actually understood'],
        ['unfamiliar word', 'a word to work out from context or look up'],
        ['reading speed', 'how fast text can be read with understanding'],
        ['fluency', 'reading smoothly enough to focus on meaning'],
        ['purpose', 'the reason you are reading a particular text'],
        ['note in margin', 'a short comment recording a reaction'],
        ['re-reading', 'a weak strategy compared with self-testing']
      ],
      truths: [
        'Explaining a passage in your own words tests understanding better than re-reading.',
        'Previewing a text makes reading it faster and more effective.',
        'Skimming and scanning serve different purposes.',
        'Reading speed without comprehension is worthless.'
      ],
      myths: [
        'Re-reading is the most effective way to learn from a text.',
        'Skimming and scanning are the same technique.',
        'Faster reading always means better learning.',
        'Understanding is guaranteed if you have read every word.'
      ]
    }
  ],

  revision: [
    {
      name: 'How Memory and Revision Work', from: 'Grade 6', to: 'College',
      facts: [
        ['spacing effect', 'the finding that spread-out study beats cramming'],
        ['retrieval practice', 'testing yourself rather than reviewing'],
        ['interleaving', 'mixing topics rather than blocking them'],
        ['elaboration', 'explaining how and why something works'],
        ['dual coding', 'combining words with diagrams'],
        ['concrete example', 'a specific case illustrating an abstract idea'],
        ['forgetting curve', 'the way memory decays without review'],
        ['massed practice', 'cramming a subject into one long session'],
        ['desirable difficulty', 'effort during study that improves retention'],
        ['fluency illusion', 'mistaking familiarity for knowing'],
        ['flashcard', 'a prompt-and-answer card used for retrieval practice'],
        ['past paper', 'a previous exam used for realistic practice'],
        ['self-testing', 'checking recall without looking at notes'],
        ['revision timetable', 'a plan spreading topics across available time']
      ],
      truths: [
        'Retrieval practice beats re-reading for long-term retention.',
        'Spacing the same total study time improves what is retained.',
        'Feeling that material is familiar is not evidence that you can recall it.',
        'Interleaving feels harder but produces better transfer.'
      ],
      myths: [
        'Re-reading notes is the most efficient revision method.',
        'Cramming produces the same long-term result as spaced study.',
        'If material feels familiar, it has been learned.',
        'Studying one topic to completion before moving on is always best.'
      ]
    },
    {
      name: 'Planning and Time Management', from: 'Grade 6', to: 'College',
      facts: [
        ['revision timetable', 'a schedule allocating topics to sessions'],
        ['prioritisation', 'deciding which topics need most time'],
        ['session length', 'how long to study before a break'],
        ['break', 'the rest period that sustains concentration'],
        ['deadline', 'the date by which work must be finished'],
        ['backward planning', 'working back from a deadline to today'],
        ['procrastination', 'delaying work that needs doing'],
        ['distraction', 'anything pulling attention away from study'],
        ['single-tasking', 'working on one thing at a time'],
        ['goal', 'a specific outcome to aim for in a session'],
        ['progress tracking', 'recording what has actually been covered'],
        ['buffer', 'spare time left for things going wrong'],
        ['weak topic', 'a topic needing more time than the rest'],
        ['review slot', 'time set aside to revisit earlier material']
      ],
      truths: [
        'Planning backwards from a deadline exposes how little time there really is.',
        'Time should be weighted towards weak topics, not favourite ones.',
        'Switching between tasks costs time and accuracy.',
        'A plan without buffer time fails at the first disruption.'
      ],
      myths: [
        'Multitasking gets more work done in the same time.',
        'Every topic deserves exactly the same amount of revision.',
        'A revision plan should fill every available hour.',
        'Studying for six hours straight is more productive than shorter sessions.'
      ]
    },
    {
      name: 'Active Revision Techniques', from: 'Grade 7', to: 'College',
      facts: [
        ['flashcards', 'cards used for repeated self-testing'],
        ['mind map', 'a branching summary of a topic'],
        ['blurting', 'writing everything you remember, then checking'],
        ['teaching someone else', 'explaining a topic aloud to test it'],
        ['past paper practice', 'answering real questions under real conditions'],
        ['mark scheme', 'the document showing how marks are awarded'],
        ['exam technique', 'the skills of reading, timing and answering'],
        ['condensing notes', 'reducing notes to their essentials'],
        ['practice question', 'a question attempted before checking the answer'],
        ['error log', 'a record of mistakes and why they happened'],
        ['topic checklist', 'a list of everything that could be examined'],
        ['spaced repetition', 'reviewing at increasing intervals'],
        ['self-quizzing', 'writing questions for yourself'],
        ['feedback', 'the information that lets you correct a misunderstanding']
      ],
      truths: [
        'Attempting a question before seeing the answer improves learning.',
        'Reading the mark scheme shows what examiners actually reward.',
        'Keeping an error log turns mistakes into targeted revision.',
        'Explaining a topic aloud exposes gaps that reading hides.'
      ],
      myths: [
        'Looking at the answer first makes practice questions more efficient.',
        'Mark schemes are only useful to teachers.',
        'Mistakes in practice should be forgotten quickly.',
        'Copying out notes neatly counts as active revision.'
      ]
    }
  ],

  exams: [
    {
      name: 'Exam Technique', from: 'Grade 6', to: 'College',
      facts: [
        ['command word', 'the verb telling you what a question requires'],
        ['describe', 'to say what something is like'],
        ['explain', 'to say how or why'],
        ['evaluate', 'to weigh evidence and reach a judgement'],
        ['compare', 'to set out similarities and differences'],
        ['justify', 'to give reasons for a choice'],
        ['mark allocation', 'the number of marks showing expected depth'],
        ['timing', 'dividing time in proportion to marks'],
        ['planning', 'sketching an answer before writing it'],
        ['reading time', 'the period for surveying the paper'],
        ['rubric', 'the instructions at the top of a paper'],
        ['showing working', 'setting out method so partial credit is possible'],
        ['checking', 'reviewing answers before the end'],
        ['unanswered question', 'a guaranteed zero, unlike an attempt']
      ],
      truths: [
        'The command word tells you what kind of answer earns marks.',
        'Time should be divided roughly in proportion to marks available.',
        'Showing working can earn marks even when the final answer is wrong.',
        'An unanswered question scores zero; an attempt might not.'
      ],
      myths: [
        'Every question should be given the same amount of time.',
        'Explaining and describing ask for the same thing.',
        'Only the final answer earns marks in a calculation.',
        'Leaving a hard question blank is safer than guessing.'
      ]
    },
    {
      name: 'Managing Exam Stress', from: 'Grade 6', to: 'College',
      facts: [
        ['stress response', 'the body’s reaction to a perceived demand'],
        ['adrenaline', 'the hormone raising heart rate under pressure'],
        ['sleep', 'the factor most strongly linked to exam performance'],
        ['routine', 'a predictable pattern that reduces uncertainty'],
        ['preparation', 'the most reliable way to reduce exam anxiety'],
        ['breathing technique', 'slow breathing that lowers arousal'],
        ['perspective', 'keeping the importance of one exam in proportion'],
        ['catastrophising', 'imagining the worst possible outcome'],
        ['support', 'people who can help when things feel unmanageable'],
        ['exercise', 'physical activity that reduces stress hormones'],
        ['caffeine', 'a stimulant that can worsen anxiety and sleep'],
        ['all-nighter', 'a night without sleep, which harms performance'],
        ['self-talk', 'the way you speak to yourself about a task'],
        ['recovery', 'the rest that makes sustained work possible']
      ],
      truths: [
        'Sleep the night before matters more than one extra hour of cramming.',
        'Some stress improves performance; too much impairs it.',
        'Slow breathing measurably lowers physical arousal.',
        'Preparation is the most reliable way to reduce exam anxiety.'
      ],
      myths: [
        'An all-nighter before an exam improves results.',
        'Any amount of stress is harmful to performance.',
        'Feeling nervous means you are unprepared.',
        'Caffeine reliably improves exam performance.'
      ]
    },
    {
      name: 'Answering Different Question Types', from: 'Grade 7', to: 'College',
      facts: [
        ['multiple choice', 'a question with options, one of which is correct'],
        ['distractor', 'a wrong option designed to look plausible'],
        ['short answer', 'a question needing a sentence or two'],
        ['extended response', 'a question needing a structured argument'],
        ['calculation question', 'a question requiring worked numerical method'],
        ['source question', 'a question about a provided text or image'],
        ['data question', 'a question about a table or graph'],
        ['practical question', 'a question about experimental method'],
        ['essay plan', 'a brief structure written before an essay'],
        ['point–evidence–explain', 'a structure for a paragraph of argument'],
        ['conclusion', 'the paragraph delivering a judgement'],
        ['elimination', 'ruling out options to improve a guess'],
        ['units', 'the labels that must accompany a numerical answer'],
        ['significant figures', 'the precision an answer should be given to']
      ],
      truths: [
        'Eliminating options improves the odds on a multiple-choice question.',
        'A numerical answer without units is usually incomplete.',
        'An extended response needs a plan before it needs a first sentence.',
        'Distractors are designed around common misconceptions.'
      ],
      myths: [
        'Guessing at random is as good as eliminating options.',
        'Units are optional if the number is correct.',
        'Planning an essay wastes time you should spend writing.',
        'Wrong options in multiple-choice questions are chosen at random.'
      ]
    }
  ]
};
