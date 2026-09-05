/* Engineering & Design and Business & Finance, by named topic.

   Both subjects were being served by a handful of broad units, so every
   worksheet in them looked like every other. These are the blocks a course
   actually lists — "Break-Even Analysis and Costs", "Gears, Levers and
   Mechanisms" — which is also what somebody types into a search box. */

export const WORK_UNITS = {
  /* =============================== engineering =============================== */
  design: [
    {
      name: 'Materials: Properties and Choosing One', from: 'Grade 6', to: 'College',
      facts: [
        ['a property', 'a measurable characteristic of a material'],
        ['strength', 'resistance to being broken by a force'],
        ['tensile strength', 'resistance to being pulled apart'],
        ['compressive strength', 'resistance to being crushed'],
        ['hardness', 'resistance to scratching and indentation'],
        ['toughness', 'the ability to absorb energy without fracturing'],
        ['brittleness', 'the tendency to break without bending first'],
        ['ductility', 'the ability to be drawn into a wire'],
        ['malleability', 'the ability to be hammered into sheet'],
        ['elasticity', 'the ability to return to shape after a force is removed'],
        ['plasticity', 'the tendency to keep a new shape after deforming'],
        ['density', 'mass per unit volume'],
        ['corrosion resistance', 'the ability to survive chemical attack'],
        ['a ferrous metal', 'a metal containing iron'],
        ['a non-ferrous metal', 'a metal containing no iron'],
        ['an alloy', 'a mixture of a metal with other elements'],
        ['a composite', 'a material combining two materials with different properties'],
        ['a thermoplastic', 'a plastic that softens on heating and can be reshaped'],
        ['a smart material', 'a material whose properties change with conditions'],
        ['a material specification', 'the written requirement a chosen material must meet']
      ],
      truths: [
        'Strength and hardness are different properties and are often confused.',
        'A tough material absorbs energy; a brittle one does not, however strong it is.',
        'Ferrous metals rust; most non-ferrous metals do not.',
        'A composite combines materials so the result beats either on its own.',
        'Material choice follows from the specification, not from preference.'
      ],
      myths: [
        'The hardest material is always the strongest.',
        'A strong material cannot break suddenly.',
        'All metals rust.',
        'Plastics are all the same family with the same properties.',
        'A heavier material is always stronger.'
      ],
      applications: [
        ['Resistance to being pulled apart is called what?', 'tensile strength'],
        ['A metal containing iron is called what?', 'ferrous'],
        ['Which property lets a metal be drawn into a wire?', 'ductility'],
        ['Glass fibre in resin is an example of what?', 'a composite'],
        ['A material that breaks without bending first is called what?', 'brittle']
      ]
    },
    {
      name: 'The Design Process and Prototyping', from: 'Grade 6', to: 'College',
      facts: [
        ['a design brief', 'the statement of what is to be designed and why'],
        ['a client', 'the person or organisation the design is for'],
        ['a user', 'the person who will actually use the product'],
        ['a specification', 'the measurable requirements a design must meet'],
        ['a constraint', 'a limit the design has to work within'],
        ['research', 'the investigation done before designing'],
        ['a product analysis', 'the study of an existing product to learn from it'],
        ['ideation', 'the generation of many possible ideas'],
        ['a concept sketch', 'a quick drawing of one idea'],
        ['iteration', 'the cycle of making, testing and improving'],
        ['a prototype', 'a working model made to test an idea'],
        ['a mock-up', 'a non-working model made to check form and size'],
        ['rapid prototyping', 'making test models quickly, often by 3D printing'],
        ['user testing', 'putting a design in front of real users'],
        ['feedback', 'what testing tells you about a design'],
        ['a tolerance', 'the allowable variation in a measurement'],
        ['a manufacturing method', 'the process by which a design is actually made'],
        ['sustainability', 'the consideration of a product’s impact over its life'],
        ['ergonomics', 'the fit between a product and the human body'],
        ['anthropometric data', 'measurements of the human body used in design']
      ],
      truths: [
        'The specification comes from the brief and the research, not from the first idea.',
        'A prototype exists to be tested, so a failed prototype is useful.',
        'Iteration means going round the cycle, not doing it once neatly.',
        'A mock-up checks form; a prototype checks function.',
        'Anthropometric data is what makes ergonomic decisions testable.'
      ],
      myths: [
        'The design process runs in a straight line from brief to product.',
        'A prototype should be as close to finished as possible.',
        'User testing is for the end of the project.',
        'Constraints are obstacles rather than part of the problem.',
        'A good designer gets it right first time.'
      ],
      sequences: [
        ['An iterative design cycle', [
          'Read the brief and identify the client and user',
          'Research existing products and user needs',
          'Write a measurable specification',
          'Generate several ideas and sketch them',
          'Build a prototype of the most promising one',
          'Test it with users, take the feedback and iterate'
        ]]
      ],
      applications: [
        ['A non-working model checking form and size is called what?', 'a mock-up'],
        ['The allowable variation in a measurement is called what?', 'a tolerance'],
        ['Measurements of the human body used in design are called what?', 'anthropometric data'],
        ['What states the measurable requirements of a design?', 'the specification'],
        ['The cycle of making, testing and improving is called what?', 'iteration']
      ]
    },
    {
      name: 'Technical Drawing and Orthographic Projection', from: 'Grade 7', to: 'College',
      figures: ['cube'],
      facts: [
        ['a technical drawing', 'a drawing made to communicate a design precisely'],
        ['orthographic projection', 'the set of flat views of an object from fixed directions'],
        ['a front elevation', 'the view looking straight at the front'],
        ['a side elevation', 'the view looking at the side'],
        ['a plan view', 'the view looking down from above'],
        ['first angle projection', 'the arrangement placing each view beyond the object'],
        ['third angle projection', 'the arrangement placing each view on the near side'],
        ['an isometric drawing', 'a 3D drawing with vertical lines and two at thirty degrees'],
        ['a perspective drawing', 'a drawing with lines converging to a vanishing point'],
        ['an exploded view', 'a drawing showing parts separated along assembly lines'],
        ['a section view', 'a drawing showing the object as if cut through'],
        ['hatching', 'the parallel lines marking a cut surface'],
        ['a hidden detail line', 'the dashed line showing an edge you cannot see'],
        ['a centre line', 'the chain line marking an axis of symmetry'],
        ['a dimension', 'a measurement marked on a drawing'],
        ['a leader line', 'the line pointing from a note to a feature'],
        ['a scale', 'the ratio between drawing size and real size'],
        ['a title block', 'the panel giving drawing name, scale and author'],
        ['a datum', 'the reference point measurements are taken from'],
        ['CAD', 'computer aided design']
      ],
      truths: [
        'Orthographic views are flat and show true measurements; isometric views do not.',
        'Hidden edges are drawn as dashed lines, not left out.',
        'First and third angle projection place the same views in different positions.',
        'A section view is hatched to show which surfaces were cut.',
        'Every dimension is measured from a datum, so the datum has to be chosen.'
      ],
      myths: [
        'An isometric drawing can be measured directly with a ruler and scale.',
        'First and third angle projection are the same arrangement.',
        'Hidden edges are left off a technical drawing.',
        'Scale only matters on large drawings.',
        'A drawing without a title block is complete.'
      ],
      applications: [
        ['The view looking down from above is called what?', 'the plan view'],
        ['What kind of line shows an edge you cannot see?', 'a dashed hidden detail line'],
        ['What are the parallel lines on a cut surface called?', 'hatching'],
        ['At what angle are the two base axes drawn in an isometric drawing?', 'thirty degrees'],
        ['Where are drawing name, scale and author recorded?', 'the title block']
      ]
    }
  ],
  electronics: [
    {
      name: 'Series and Parallel Circuits in Practice', from: 'Grade 7', to: 'College',
      figures: ['circuit'],
      facts: [
        ['a circuit', 'a complete path around which current can flow'],
        ['a series circuit', 'a circuit with one single path'],
        ['a parallel circuit', 'a circuit with more than one path'],
        ['current', 'the rate of flow of charge, measured in amperes'],
        ['voltage', 'the energy transferred per unit charge, measured in volts'],
        ['resistance', 'opposition to current, measured in ohms'],
        ['Ohm’s law', 'voltage equals current times resistance'],
        ['a resistor', 'a component with a set resistance'],
        ['an ammeter', 'the meter measuring current, connected in series'],
        ['a voltmeter', 'the meter measuring voltage, connected in parallel'],
        ['a cell', 'a single source of electrical energy'],
        ['a battery', 'two or more cells joined together'],
        ['a switch', 'a component that opens or closes a circuit'],
        ['a fuse', 'a component that melts to break a circuit at excess current'],
        ['a short circuit', 'an unintended low-resistance path'],
        ['a load', 'the component that uses the energy'],
        ['a diode', 'a component allowing current in one direction only'],
        ['an LED', 'a diode that emits light when current flows'],
        ['a potential divider', 'two resistors splitting a voltage in a set ratio'],
        ['a circuit diagram', 'the standard symbolic drawing of a circuit']
      ],
      truths: [
        'Current is the same everywhere in a series circuit.',
        'Voltage is the same across each branch of a parallel circuit.',
        'Adding resistors in series increases total resistance; adding them in parallel decreases it.',
        'An ammeter goes in series and a voltmeter in parallel.',
        'A fuse protects the circuit by breaking it, not by limiting the current gradually.'
      ],
      myths: [
        'Current is used up as it passes through a bulb.',
        'A voltmeter is connected in series with the component.',
        'Adding a second bulb in parallel dims the first.',
        'Resistance in parallel adds up the way it does in series.',
        'A short circuit is simply a shorter piece of wire.'
      ],
      applications: [
        ['A 12 V supply drives 3 A through a resistor. What is its resistance?', '4 ohms'],
        ['Where is an ammeter connected?', 'in series'],
        ['Two identical resistors in parallel give what compared with one?', 'half the resistance'],
        ['Which component allows current one way only?', 'a diode'],
        ['In a series circuit, what is the same at every point?', 'the current']
      ]
    },
    {
      name: 'Sensors, Inputs and Outputs', from: 'Grade 7', to: 'College',
      facts: [
        ['an input', 'a signal entering a system'],
        ['a process', 'the part of a system that decides what to do'],
        ['an output', 'the action a system produces'],
        ['a sensor', 'a component that converts a physical quantity into a signal'],
        ['a thermistor', 'a resistor whose resistance changes with temperature'],
        ['a light dependent resistor', 'a resistor whose resistance changes with light'],
        ['a switch', 'the simplest digital input'],
        ['a potentiometer', 'a variable resistor used as an adjustable input'],
        ['an analogue signal', 'a signal that varies continuously'],
        ['a digital signal', 'a signal with discrete values, usually on or off'],
        ['an analogue to digital converter', 'the circuit turning a varying signal into numbers'],
        ['a threshold', 'the value at which a system changes state'],
        ['a comparator', 'the circuit that compares a signal with a reference'],
        ['an actuator', 'a component that produces movement'],
        ['a motor', 'an actuator that turns'],
        ['a servo', 'a motor that moves to a commanded position'],
        ['a relay', 'a switch operated by an electromagnet'],
        ['a transistor', 'a component used to switch or amplify'],
        ['a buzzer', 'an audible output device'],
        ['a microcontroller', 'the small programmable chip running a system']
      ],
      truths: [
        'A system is input, process and output, in that order.',
        'A thermistor’s resistance changes with temperature; it does not measure temperature directly.',
        'A relay lets a small current control a much larger one.',
        'Analogue signals need converting before a microcontroller can use them as numbers.',
        'A threshold is what turns a continuous reading into a decision.'
      ],
      myths: [
        'A sensor produces a reading in the units you want without processing.',
        'Digital and analogue signals are interchangeable.',
        'A microcontroller can drive a motor directly from a pin.',
        'A relay and a transistor do completely unrelated jobs.',
        'Every input to a system must be a switch.'
      ],
      applications: [
        ['Which sensor changes resistance with light?', 'a light dependent resistor'],
        ['A component producing movement is called what?', 'an actuator'],
        ['What turns a varying signal into numbers?', 'an analogue to digital converter'],
        ['A switch operated by an electromagnet is called what?', 'a relay'],
        ['The value at which a system changes state is called what?', 'a threshold']
      ]
    }
  ],
  robotics: [
    {
      name: 'Control Systems, Feedback and Automation', from: 'Grade 8', to: 'College',
      facts: [
        ['a control system', 'a system that manages the behaviour of another system'],
        ['an open loop system', 'a system that acts without checking the result'],
        ['a closed loop system', 'a system that measures the result and corrects'],
        ['feedback', 'the return of output information to the input'],
        ['negative feedback', 'feedback that opposes a change and stabilises a system'],
        ['positive feedback', 'feedback that amplifies a change'],
        ['a set point', 'the value the system is trying to hold'],
        ['an error', 'the difference between set point and measured value'],
        ['a controller', 'the part that decides the correction'],
        ['a sensor', 'the part that measures the actual value'],
        ['an actuator', 'the part that changes the system'],
        ['a thermostat', 'the everyday closed loop temperature controller'],
        ['hysteresis', 'the deliberate gap between switching on and switching off'],
        ['overshoot', 'passing the set point before settling'],
        ['a settling time', 'how long a system takes to reach steady state'],
        ['automation', 'the running of a process with little human intervention'],
        ['a programmable logic controller', 'the industrial controller running a production process'],
        ['a subsystem', 'one part of a larger system with its own function'],
        ['calibration', 'setting a sensor so its readings are correct'],
        ['a fail-safe', 'the state a system falls to when something goes wrong']
      ],
      truths: [
        'A closed loop system measures its own output; an open loop system does not.',
        'Negative feedback stabilises; positive feedback amplifies.',
        'Hysteresis stops a controller switching rapidly on and off around the set point.',
        'A sensor that is not calibrated makes the whole loop wrong.',
        'A toaster on a timer is open loop; a thermostat is closed loop.'
      ],
      myths: [
        'All feedback makes a system more stable.',
        'An open loop system has no controller.',
        'Automation removes the need for any monitoring.',
        'Overshoot means the controller has failed.',
        'A closed loop system never needs a fail-safe.'
      ],
      applications: [
        ['A toaster on a timer is which kind of system?', 'open loop'],
        ['Feedback that opposes a change is called what?', 'negative feedback'],
        ['The difference between set point and measured value is called what?', 'the error'],
        ['The gap between switching on and off is called what?', 'hysteresis'],
        ['Setting a sensor so its readings are correct is called what?', 'calibration']
      ]
    },
    {
      name: 'Gears, Levers and Mechanisms', from: 'Grade 6', to: 'College',
      facts: [
        ['a mechanism', 'an arrangement of parts that changes motion or force'],
        ['a lever', 'a rigid bar turning about a pivot'],
        ['a fulcrum', 'the pivot of a lever'],
        ['an effort', 'the force applied to a mechanism'],
        ['a load', 'the force the mechanism has to move'],
        ['a first class lever', 'a lever with the fulcrum between effort and load'],
        ['a second class lever', 'a lever with the load between fulcrum and effort'],
        ['a third class lever', 'a lever with the effort between fulcrum and load'],
        ['mechanical advantage', 'load divided by effort'],
        ['a moment', 'the turning effect of a force, force times distance'],
        ['a gear', 'a toothed wheel that meshes with another'],
        ['a driver gear', 'the gear that is turned'],
        ['a driven gear', 'the gear that is turned by the driver'],
        ['a gear ratio', 'the ratio of teeth between driven and driver'],
        ['an idler gear', 'a gear that changes direction without changing ratio'],
        ['a pulley', 'a wheel carrying a belt or rope'],
        ['a cam', 'a shaped wheel converting rotation into up-and-down motion'],
        ['a follower', 'the part that rides on a cam'],
        ['a crank and slider', 'the mechanism converting rotation into straight-line motion'],
        ['a rack and pinion', 'the gear pair converting rotation into linear movement']
      ],
      truths: [
        'A gear ratio greater than one trades speed for turning force.',
        'Two meshed gears turn in opposite directions.',
        'An idler gear changes direction without changing the overall ratio.',
        'A moment is force multiplied by distance from the pivot.',
        'A wheelbarrow is a second class lever; scissors are first class.'
      ],
      myths: [
        'A bigger gear always turns faster.',
        'Gears give you extra energy.',
        'All levers make the load easier to lift.',
        'An idler gear changes the gear ratio.',
        'Mechanical advantage means the mechanism does the work for free.'
      ],
      applications: [
        ['A 10-tooth gear drives a 30-tooth gear. What is the ratio?', '3:1'],
        ['Which class of lever has the load between fulcrum and effort?', 'second class'],
        ['Which mechanism converts rotation into up-and-down motion?', 'a cam'],
        ['Two meshed gears turn which way relative to each other?', 'opposite directions'],
        ['Load divided by effort gives what?', 'mechanical advantage']
      ]
    }
  ],
  /* ================================ business ================================= */
  finance: [
    {
      name: 'Budgeting, Saving and Compound Interest', from: 'Grade 7', to: 'College',
      facts: [
        ['a budget', 'a plan matching income to spending'],
        ['income', 'money coming in'],
        ['expenditure', 'money going out'],
        ['a surplus', 'income greater than expenditure'],
        ['a deficit', 'expenditure greater than income'],
        ['a fixed cost', 'a cost that stays the same each period'],
        ['a variable cost', 'a cost that changes with use'],
        ['a discretionary spend', 'spending that could be cut'],
        ['an emergency fund', 'savings held against unexpected costs'],
        ['simple interest', 'interest calculated on the original amount only'],
        ['compound interest', 'interest calculated on the amount including past interest'],
        ['a principal', 'the original amount saved or borrowed'],
        ['an interest rate', 'the percentage charged or paid per period'],
        ['AER', 'the annual equivalent rate, used to compare savings accounts'],
        ['inflation', 'the general rise in prices over time'],
        ['a real return', 'a return after inflation is taken off'],
        ['a savings account', 'an account paying interest on a balance'],
        ['a standing order', 'a fixed regular payment you set up'],
        ['a direct debit', 'a regular payment the recipient collects'],
        ['a financial goal', 'a target amount with a date attached']
      ],
      truths: [
        'Compound interest grows faster than simple interest because interest earns interest.',
        'A return below the inflation rate is a loss in real terms.',
        'A budget is only useful if it is based on actual spending, not intended spending.',
        'An emergency fund is the thing that stops a surprise becoming debt.',
        'AER exists so accounts with different compounding can be compared.'
      ],
      myths: [
        'Saving is only worthwhile with large amounts.',
        'Interest rates on savings are always higher than inflation.',
        'Simple and compound interest give the same result over long periods.',
        'A budget means never spending on anything enjoyable.',
        'A standing order and a direct debit are the same arrangement.'
      ],
      applications: [
        ['£100 at 10% compound for two years gives what?', '£121'],
        ['Income greater than expenditure is called what?', 'a surplus'],
        ['A 3% return with 5% inflation is what in real terms?', 'a loss'],
        ['Which rate lets savings accounts be compared fairly?', 'AER'],
        ['Interest calculated on the original amount only is called what?', 'simple interest']
      ]
    },
    {
      name: 'Credit, Debt and Interest Rates', from: 'Grade 8', to: 'College',
      facts: [
        ['credit', 'the use of money now that will be repaid later'],
        ['debt', 'money owed'],
        ['a loan', 'a sum borrowed and repaid with interest'],
        ['a credit card', 'a card that borrows up to a set limit'],
        ['a debit card', 'a card that spends money you already hold'],
        ['an overdraft', 'an arrangement to spend beyond a zero balance'],
        ['APR', 'the annual percentage rate, the yearly cost of borrowing'],
        ['a repayment', 'a scheduled payment reducing a debt'],
        ['a minimum payment', 'the smallest payment that avoids a penalty'],
        ['a term', 'the period over which a debt is repaid'],
        ['a credit score', 'the rating lenders use to judge risk'],
        ['a credit report', 'the record of a person’s borrowing history'],
        ['a secured loan', 'a loan backed by an asset the lender can take'],
        ['an unsecured loan', 'a loan with no asset backing it'],
        ['a mortgage', 'a long-term loan secured on property'],
        ['a payday loan', 'a very short-term loan at a very high rate'],
        ['default', 'failing to make repayments as agreed'],
        ['a debt spiral', 'the pattern of borrowing to repay borrowing'],
        ['a guarantor', 'someone who agrees to repay if the borrower cannot'],
        ['a cooling-off period', 'the time in which a credit agreement can be cancelled']
      ],
      truths: [
        'Paying only the minimum on a credit card can take years and cost more than the purchase.',
        'APR includes fees as well as interest, which is why it allows comparison.',
        'A secured loan risks the asset it is secured on.',
        'A longer term lowers each payment and raises the total repaid.',
        'A credit score reflects borrowing history, not income.'
      ],
      myths: [
        'Having no credit history gives you the best credit score.',
        'The minimum payment is the recommended payment.',
        'A debit card and a credit card work the same way.',
        'A longer repayment term always costs less overall.',
        'Interest stops once you fall behind.'
      ],
      applications: [
        ['Which figure shows the yearly cost of borrowing including fees?', 'APR'],
        ['A loan backed by an asset is called what?', 'a secured loan'],
        ['Failing to make repayments as agreed is called what?', 'default'],
        ['Which card spends money you already hold?', 'a debit card'],
        ['Does a longer term raise or lower the total repaid?', 'raise']
      ]
    },
    {
      name: 'Insurance and Risk', from: 'Grade 9', to: 'College',
      facts: [
        ['insurance', 'a contract transferring the cost of a risk to an insurer'],
        ['a premium', 'the payment made for cover'],
        ['a policy', 'the contract setting out what is covered'],
        ['an excess', 'the amount you pay yourself on each claim'],
        ['a claim', 'a request for payment under a policy'],
        ['cover', 'what the policy will pay for'],
        ['an exclusion', 'something the policy will not pay for'],
        ['risk', 'the chance and size of a possible loss'],
        ['risk pooling', 'many people paying in so the few who suffer loss are covered'],
        ['an actuary', 'the specialist who prices risk'],
        ['underwriting', 'the process of deciding whether and how to insure'],
        ['a no-claims discount', 'a reduction earned by not claiming'],
        ['liability insurance', 'cover for harm you cause to others'],
        ['contents insurance', 'cover for possessions inside a home'],
        ['buildings insurance', 'cover for the structure of a property'],
        ['travel insurance', 'cover for medical and cancellation costs abroad'],
        ['moral hazard', 'the tendency to take more risk once insured'],
        ['adverse selection', 'the tendency for the highest risks to seek cover'],
        ['a compulsory insurance', 'cover required by law, such as motor liability'],
        ['a policy wording', 'the exact terms that decide whether a claim is paid']
      ],
      truths: [
        'Insurance works by pooling risk across many policyholders.',
        'A higher excess usually lowers the premium.',
        'Exclusions decide as much as cover does, and they are in the wording.',
        'Motor liability cover is compulsory in most countries.',
        'Premiums are priced from risk, which is why groups pay different amounts.'
      ],
      myths: [
        'Insurance pays out for anything unfortunate.',
        'A cheaper premium always means a better deal.',
        'An excess is a fee the insurer keeps whether or not you claim.',
        'Insurance is a way of making money from misfortune.',
        'Every policy of the same type covers the same things.'
      ],
      applications: [
        ['The amount you pay yourself on each claim is called what?', 'the excess'],
        ['Something a policy will not pay for is called what?', 'an exclusion'],
        ['Taking more risk once insured is called what?', 'moral hazard'],
        ['Which cover pays for harm you cause to others?', 'liability insurance'],
        ['Does a higher excess raise or lower the premium?', 'lower']
      ]
    }
  ],
  accounting: [
    {
      name: 'Profit and Loss, Balance Sheets and Cash Flow', from: 'Grade 9', to: 'College',
      facts: [
        ['revenue', 'the money a business earns from sales'],
        ['cost of sales', 'the direct cost of the goods sold'],
        ['gross profit', 'revenue minus cost of sales'],
        ['an overhead', 'an indirect running cost'],
        ['operating profit', 'gross profit minus overheads'],
        ['net profit', 'profit after interest and tax'],
        ['a profit and loss account', 'the statement of income and costs over a period'],
        ['a balance sheet', 'the statement of what a business owns and owes at a moment'],
        ['an asset', 'something a business owns that has value'],
        ['a current asset', 'an asset expected to become cash within a year'],
        ['a fixed asset', 'an asset kept and used over several years'],
        ['a liability', 'something a business owes'],
        ['a current liability', 'a debt due within a year'],
        ['equity', 'what is left for the owners after liabilities'],
        ['working capital', 'current assets minus current liabilities'],
        ['cash flow', 'the movement of money in and out over time'],
        ['a cash flow forecast', 'the projection of receipts and payments'],
        ['insolvency', 'being unable to pay debts as they fall due'],
        ['depreciation', 'the spreading of an asset’s cost over its useful life'],
        ['a gross profit margin', 'gross profit as a percentage of revenue']
      ],
      truths: [
        'A profitable business can still fail if it runs out of cash.',
        'A balance sheet is a snapshot; a profit and loss account covers a period.',
        'Assets equal liabilities plus equity.',
        'Depreciation is a cost with no cash payment attached to it.',
        'Working capital measures whether short-term debts can be met.'
      ],
      myths: [
        'Profit and cash are the same thing.',
        'A business with high revenue must be profitable.',
        'A balance sheet shows performance over the year.',
        'Depreciation means money leaves the business.',
        'Making a loss and being insolvent are the same condition.'
      ],
      applications: [
        ['Revenue 500, cost of sales 300. What is gross profit?', '200'],
        ['Current assets minus current liabilities gives what?', 'working capital'],
        ['Which statement is a snapshot at a moment in time?', 'the balance sheet'],
        ['Spreading an asset’s cost over its life is called what?', 'depreciation'],
        ['Can a profitable business run out of cash?', 'yes']
      ]
    },
    {
      name: 'Break-Even Analysis and Costs', from: 'Grade 9', to: 'College',
      facts: [
        ['a fixed cost', 'a cost that does not change with output'],
        ['a variable cost', 'a cost that changes directly with output'],
        ['a total cost', 'fixed costs plus total variable costs'],
        ['a semi-variable cost', 'a cost with a fixed part and a variable part'],
        ['a unit cost', 'the cost of producing one unit'],
        ['a selling price', 'the price charged for one unit'],
        ['contribution', 'selling price minus variable cost per unit'],
        ['total contribution', 'contribution per unit times units sold'],
        ['a break-even point', 'the output at which total revenue equals total cost'],
        ['a break-even chart', 'the graph of revenue and costs against output'],
        ['a margin of safety', 'how far current output exceeds break-even'],
        ['total revenue', 'selling price times units sold'],
        ['a loss', 'the amount by which costs exceed revenue'],
        ['economies of scale', 'the fall in unit cost as output rises'],
        ['a target profit', 'a stated profit a business plans to reach'],
        ['a mark-up', 'the amount added to cost to set a price'],
        ['a profit margin', 'profit as a percentage of revenue'],
        ['capacity', 'the maximum output a business can produce'],
        ['capacity utilisation', 'output as a percentage of capacity'],
        ['a sensitivity analysis', 'testing how a result changes if an assumption changes']
      ],
      truths: [
        'Break-even output equals fixed costs divided by contribution per unit.',
        'Contribution is per unit; profit is what is left after fixed costs.',
        'Raising the selling price lowers the break-even output, all else equal.',
        'The margin of safety measures how much sales can fall before a loss.',
        'Break-even analysis assumes costs and price stay constant, which is its main limitation.'
      ],
      myths: [
        'Break-even is the point at which a business starts to make good money.',
        'Fixed costs are costs that can never be changed.',
        'Contribution is the same as profit.',
        'Break-even analysis works whatever happens to prices.',
        'Selling more always reduces the break-even point.'
      ],
      applications: [
        ['Fixed costs 6,000, contribution 20 per unit. Break-even output?', '300'],
        ['Selling price 15, variable cost 9. What is contribution?', '6'],
        ['How far output exceeds break-even is called what?', 'the margin of safety'],
        ['Fixed costs plus total variable costs gives what?', 'total cost'],
        ['Output as a percentage of capacity is called what?', 'capacity utilisation']
      ]
    }
  ],
  marketing: [
    {
      name: 'Market Research and Segmentation', from: 'Grade 8', to: 'College',
      facts: [
        ['market research', 'the gathering of information about a market'],
        ['primary research', 'data a business collects itself'],
        ['secondary research', 'data already collected by someone else'],
        ['quantitative data', 'data in numbers'],
        ['qualitative data', 'data in words and opinions'],
        ['a focus group', 'a small discussion group used for qualitative research'],
        ['a survey', 'a set of questions put to a sample'],
        ['a sample', 'the people actually asked'],
        ['a sampling bias', 'a sample that does not represent the market'],
        ['a market', 'the buyers and sellers of a product'],
        ['market share', 'a firm’s sales as a percentage of the market'],
        ['market growth', 'the rate at which a market is expanding'],
        ['segmentation', 'the division of a market into groups with shared needs'],
        ['a demographic segment', 'a group defined by age, income or occupation'],
        ['a geographic segment', 'a group defined by where it is'],
        ['a behavioural segment', 'a group defined by how it buys'],
        ['a target market', 'the segment a business aims at'],
        ['positioning', 'where a product sits in buyers’ minds against rivals'],
        ['a market map', 'the chart placing products on two chosen dimensions'],
        ['a gap in the market', 'an unserved position on a market map']
      ],
      truths: [
        'Primary research is specific and expensive; secondary research is cheap and general.',
        'A gap in the market is only an opportunity if there is demand to fill it.',
        'Segmentation only helps if the segments actually behave differently.',
        'A biased sample gives confident answers that are still wrong.',
        'Market share and market growth are different measures and can move in opposite directions.'
      ],
      myths: [
        'A larger sample removes bias.',
        'Every gap on a market map is a business opportunity.',
        'Qualitative research is unscientific and therefore useless.',
        'Market share rising means the business is growing.',
        'Secondary research is always out of date.'
      ],
      applications: [
        ['Data a business collects itself is called what?', 'primary research'],
        ['A group defined by how it buys is which kind of segment?', 'behavioural'],
        ['A firm’s sales as a percentage of the market is called what?', 'market share'],
        ['Which chart places products on two chosen dimensions?', 'a market map'],
        ['A small discussion group used in research is called what?', 'a focus group']
      ]
    },
    {
      name: 'Branding, Pricing and the Marketing Mix', from: 'Grade 8', to: 'College',
      facts: [
        ['the marketing mix', 'product, price, place and promotion'],
        ['a product', 'what is being sold'],
        ['a brand', 'the identity a product is sold under'],
        ['brand loyalty', 'the tendency of buyers to keep choosing one brand'],
        ['a unique selling point', 'the one thing a product claims no rival has'],
        ['a product life cycle', 'introduction, growth, maturity and decline'],
        ['an extension strategy', 'an action taken to prolong maturity'],
        ['price skimming', 'launching high and lowering the price later'],
        ['penetration pricing', 'launching low to win market share'],
        ['competitive pricing', 'setting price by reference to rivals'],
        ['cost-plus pricing', 'setting price by adding a mark-up to cost'],
        ['psychological pricing', 'pricing at 9.99 rather than 10'],
        ['price elasticity', 'how much demand changes when price changes'],
        ['elastic demand', 'demand that changes a lot when price changes'],
        ['inelastic demand', 'demand that changes little when price changes'],
        ['place', 'how the product reaches the customer'],
        ['a distribution channel', 'the route from producer to customer'],
        ['promotion', 'how a product is communicated to buyers'],
        ['a sales promotion', 'a short-term offer to boost sales'],
        ['public relations', 'the management of a business’s public image']
      ],
      truths: [
        'The four elements of the mix have to support one another to work.',
        'Skimming starts high and falls; penetration starts low and rises.',
        'Inelastic demand lets a business raise price with little loss of sales.',
        'An extension strategy is used in maturity, not in decline.',
        'A brand is an asset because loyalty reduces sensitivity to price.'
      ],
      myths: [
        'Lowering the price always increases total revenue.',
        'The marketing mix is really just advertising.',
        'A product life cycle has fixed lengths for each stage.',
        'Penetration pricing means selling at a loss.',
        'Branding matters only for luxury products.'
      ],
      applications: [
        ['Launching high and lowering later is which strategy?', 'price skimming'],
        ['Demand that changes little when price changes is called what?', 'inelastic'],
        ['Which stage of the life cycle do extension strategies target?', 'maturity'],
        ['What are the four elements of the marketing mix?', 'product, price, place, promotion'],
        ['Setting price by adding a mark-up to cost is called what?', 'cost-plus pricing']
      ]
    },
    {
      name: 'Business Structures, Stakeholders and Growth', from: 'Grade 8', to: 'College',
      facts: [
        ['a sole trader', 'a business owned and run by one person'],
        ['a partnership', 'a business owned by two or more partners'],
        ['a private limited company', 'a company whose shares are not publicly traded'],
        ['a public limited company', 'a company whose shares are traded on an exchange'],
        ['limited liability', 'the protection restricting an owner’s loss to what they invested'],
        ['unlimited liability', 'personal responsibility for all the debts of a business'],
        ['a shareholder', 'an owner of shares in a company'],
        ['a dividend', 'a share of profit paid to shareholders'],
        ['a stakeholder', 'anyone affected by what a business does'],
        ['an employee', 'a stakeholder who works for the business'],
        ['a supplier', 'a stakeholder the business buys from'],
        ['a franchise', 'the right to trade under another business’s brand and system'],
        ['a social enterprise', 'a business trading for a social purpose'],
        ['organic growth', 'growth from a business’s own expansion'],
        ['external growth', 'growth by merger or takeover'],
        ['a merger', 'two businesses joining to form one'],
        ['a takeover', 'one business buying control of another'],
        ['economies of scale', 'the fall in unit cost as a business grows'],
        ['diseconomies of scale', 'the rise in unit cost when a business grows too large'],
        ['a business plan', 'the document setting out aims, finance and strategy']
      ],
      truths: [
        'A sole trader has unlimited liability; a limited company does not.',
        'Stakeholders include people who are not owners.',
        'Organic growth is slower than growth by takeover and usually less risky.',
        'Economies of scale can turn into diseconomies past a certain size.',
        'A franchisee runs their own business under someone else’s brand and rules.'
      ],
      myths: [
        'Every company’s shares can be bought on a stock exchange.',
        'Shareholders and stakeholders are the same group.',
        'Limited liability means the company cannot be sued.',
        'Bigger is always cheaper per unit.',
        'A partnership must be shared equally by law.'
      ],
      applications: [
        ['Which structure has unlimited liability?', 'a sole trader'],
        ['Two businesses joining to form one is called what?', 'a merger'],
        ['A share of profit paid to shareholders is called what?', 'a dividend'],
        ['The rise in unit cost when a business grows too large is called what?', 'diseconomies of scale'],
        ['The right to trade under another business’s brand is called what?', 'a franchise']
      ]
    }
  ]
};
