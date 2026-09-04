/* Units written to close searches that came back empty.

   Probing the library term by term is the only reliable way to find what is
   missing: "glaciation", "herd immunity", "graphene", "Boyle's law", "Hooke's
   law", "the Doppler effect", "object-oriented", "compiler", "packet
   switching", "GDPR", "machine learning" and "anaphora" all returned nothing.
   Each of them names a unit a course teaches. */

export const GAP_UNITS = {
  /* ================================= science ================================= */
  earth: [
    {
      name: 'Glaciers and Glacial Landforms', from: 'Grade 7', to: 'College',
      facts: [
        ['a glacier', 'a mass of ice moving slowly downhill under its own weight'],
        ['glaciation', 'the shaping of land by ice'],
        ['an ice sheet', 'ice covering a continental area'],
        ['accumulation', 'the gain of snow and ice at the top of a glacier'],
        ['ablation', 'the loss of ice by melting and evaporation'],
        ['a glacial budget', 'the balance between accumulation and ablation'],
        ['plucking', 'ice freezing to rock and pulling pieces away'],
        ['abrasion', 'rock held in ice scraping the bed beneath'],
        ['a corrie', 'the armchair hollow where a glacier begins'],
        ['an arête', 'the sharp ridge between two corries'],
        ['a pyramidal peak', 'the sharp summit where three or more corries meet'],
        ['a U-shaped valley', 'the steep-sided flat-floored valley a glacier carves'],
        ['a hanging valley', 'a tributary valley left high above the main one'],
        ['a truncated spur', 'a ridge end cut off by the passing glacier'],
        ['moraine', 'the rock debris a glacier carries and dumps'],
        ['terminal moraine', 'the ridge of debris marking a glacier’s furthest advance'],
        ['a drumlin', 'the smooth elongated mound of deposited till'],
        ['an erratic', 'a boulder carried far from its source rock'],
        ['till', 'the unsorted material a glacier deposits directly'],
        ['a ribbon lake', 'the long lake filling an over-deepened glacial valley']
      ],
      truths: [
        'A glacier advances when accumulation exceeds ablation.',
        'Plucking and abrasion are the two main glacial erosion processes.',
        'A U-shaped valley is carved by ice; a V-shaped valley is cut by a river.',
        'Till is unsorted, while material deposited by meltwater is sorted by size.',
        'A drumlin’s steep end faces the direction the ice came from.'
      ],
      myths: [
        'Glaciers only existed in the distant past and none remain.',
        'A glacier retreating means the ice is flowing backwards.',
        'All glacial deposits are sorted neatly by size.',
        'A corrie and a drumlin are both erosion landforms.',
        'Glaciers move too slowly to shape rock at all.'
      ],
      sequences: [
        ['How a corrie forms', [
          'Snow collects in a hollow on a north-facing slope',
          'The snow compacts into ice year after year',
          'Freeze-thaw and plucking steepen the back wall',
          'Rotational movement and abrasion deepen the floor',
          'A rock lip is left at the front, holding a tarn when the ice goes'
        ]]
      ],
      applications: [
        ['Which valley shape is carved by a glacier?', 'a U-shaped valley'],
        ['Ice freezing to rock and pulling it away is called what?', 'plucking'],
        ['The sharp ridge between two corries is called what?', 'an arête'],
        ['A boulder carried far from its source rock is called what?', 'an erratic'],
        ['A glacier advances when accumulation exceeds what?', 'ablation']
      ]
    }
  ],
  biology: [
    {
      name: 'Vaccination, Immunity and Antibiotics', from: 'Grade 8', to: 'College',
      facts: [
        ['a pathogen', 'a microorganism that causes disease'],
        ['an antigen', 'the surface marker the immune system recognises'],
        ['an antibody', 'the protein made to bind a specific antigen'],
        ['a lymphocyte', 'the white blood cell that makes antibodies'],
        ['a phagocyte', 'the white blood cell that engulfs pathogens'],
        ['a vaccine', 'a preparation that trains immunity without causing the disease'],
        ['vaccination', 'the giving of a vaccine'],
        ['immunisation', 'the process of becoming protected against a disease'],
        ['active immunity', 'protection made by your own immune response'],
        ['passive immunity', 'protection from antibodies received from elsewhere'],
        ['a memory cell', 'the long-lived cell allowing a fast second response'],
        ['the secondary response', 'the faster, larger response on meeting a pathogen again'],
        ['herd immunity', 'the protection of a population once enough of it is immune'],
        ['an epidemic', 'a sharp rise in cases in one area'],
        ['a pandemic', 'an epidemic spread across countries'],
        ['an antibiotic', 'a medicine that kills or stops bacteria'],
        ['antibiotic resistance', 'the survival of bacteria that antibiotics no longer kill'],
        ['a booster', 'a repeat dose that raises immunity again'],
        ['an attenuated vaccine', 'a vaccine using a weakened form of the pathogen'],
        ['a clinical trial', 'the staged testing of a medicine for safety and effect']
      ],
      truths: [
        'Antibiotics work on bacteria and have no effect on viruses.',
        'Herd immunity protects people who cannot be vaccinated themselves.',
        'A vaccine causes memory cells to form, so a second exposure is met faster.',
        'Antibiotic resistance spreads when courses are not completed or are prescribed unnecessarily.',
        'Passive immunity is immediate but temporary.'
      ],
      myths: [
        'Antibiotics cure colds and flu.',
        'A vaccine gives you the disease it protects against.',
        'Herd immunity only matters to the people who are vaccinated.',
        'Resistance develops in the person rather than in the bacteria.',
        'Immunity from a vaccine is always lifelong without a booster.'
      ],
      sequences: [
        ['The immune response to a vaccine', [
          'A weakened or partial pathogen is introduced',
          'Phagocytes engulf it and display its antigens',
          'Lymphocytes that match the antigen multiply',
          'Antibodies are produced and the material is cleared',
          'Memory cells remain, ready for a faster second response'
        ]]
      ],
      applications: [
        ['Do antibiotics work against a virus?', 'no'],
        ['Which cells allow a fast second response?', 'memory cells'],
        ['Protection from antibodies received from elsewhere is called what?', 'passive immunity'],
        ['What protects a population once enough of it is immune?', 'herd immunity'],
        ['An epidemic spread across countries is called what?', 'a pandemic']
      ]
    }
  ],
  chemistry: [
    {
      name: 'Allotropes of Carbon and Nanoparticles', from: 'Grade 9', to: 'College',
      facts: [
        ['an allotrope', 'a different structural form of the same element'],
        ['diamond', 'the carbon allotrope with four bonds per atom in a rigid lattice'],
        ['graphite', 'the carbon allotrope of layers with three bonds per atom'],
        ['graphene', 'a single layer of graphite, one atom thick'],
        ['a fullerene', 'a hollow carbon molecule such as buckminsterfullerene'],
        ['buckminsterfullerene', 'the C60 molecule shaped like a football'],
        ['a carbon nanotube', 'a rolled cylinder of graphene'],
        ['a giant covalent structure', 'a lattice of atoms joined throughout by covalent bonds'],
        ['a delocalised electron', 'an electron free to move through a structure'],
        ['a weak intermolecular force', 'the force between layers or molecules, easily broken'],
        ['a lubricant', 'a substance that reduces friction, as graphite does'],
        ['an electrode', 'a conductor through which current enters a substance'],
        ['a nanoparticle', 'a particle between roughly 1 and 100 nanometres across'],
        ['a surface area to volume ratio', 'the surface per unit of volume, very high in nanoparticles'],
        ['a catalyst', 'a substance that speeds a reaction without being used up'],
        ['a coating', 'a thin surface layer, often made from nanoparticles'],
        ['tensile strength', 'resistance to being pulled apart'],
        ['a conductor', 'a material that lets charge flow through it'],
        ['an insulator', 'a material that does not let charge flow'],
        ['a lattice', 'a regular repeating arrangement of particles']
      ],
      truths: [
        'Graphite conducts electricity because each carbon atom has a delocalised electron.',
        'Diamond does not conduct electricity because every outer electron is in a bond.',
        'Graphite is soft because weak forces hold the layers together, not because its bonds are weak.',
        'Graphene is one layer of graphite, one atom thick.',
        'Nanoparticles have a very high surface area to volume ratio, which makes them effective catalysts.'
      ],
      myths: [
        'Diamond and graphite are made of different elements.',
        'Graphite is soft because its covalent bonds are weak.',
        'All giant covalent structures conduct electricity.',
        'A nanoparticle is simply a very small lump of ordinary material with identical properties.',
        'Fullerenes are giant covalent structures like diamond.'
      ],
      applications: [
        ['Why does graphite conduct electricity?', 'it has delocalised electrons'],
        ['How many bonds does each carbon atom form in diamond?', '4'],
        ['A single layer of graphite is called what?', 'graphene'],
        ['What is the formula of buckminsterfullerene?', 'C60'],
        ['What makes nanoparticles good catalysts?', 'a high surface area to volume ratio']
      ]
    }
  ],
  physics: [
    {
      name: 'Gas Laws and the Kinetic Model', from: 'Grade 9', to: 'College',
      facts: [
        ['the kinetic model', 'the picture of a gas as particles in constant random motion'],
        ['pressure', 'force per unit area, caused in a gas by particle collisions'],
        ['a pascal', 'the unit of pressure, one newton per square metre'],
        ['absolute zero', 'the lowest possible temperature, zero kelvin'],
        ['the kelvin scale', 'the temperature scale starting at absolute zero'],
        ['Boyle’s law', 'pressure times volume is constant at fixed temperature'],
        ['an isothermal change', 'a change at constant temperature'],
        ['Charles’s law', 'volume is proportional to absolute temperature at fixed pressure'],
        ['the pressure law', 'pressure is proportional to absolute temperature at fixed volume'],
        ['an ideal gas', 'a gas obeying the gas laws exactly'],
        ['internal energy', 'the total kinetic and potential energy of the particles'],
        ['a collision', 'a particle striking a wall or another particle'],
        ['a random motion', 'movement with no preferred direction'],
        ['work done on a gas', 'the energy transferred when a gas is compressed'],
        ['compression', 'a reduction in the volume of a gas'],
        ['a mean speed', 'the average speed of the particles in a gas'],
        ['a container wall', 'the surface gas particles collide with to exert pressure'],
        ['density', 'mass per unit volume'],
        ['a temperature in kelvin', 'the temperature that must be used in the gas laws'],
        ['a constant', 'the quantity that does not change during a described process']
      ],
      truths: [
        'Gas law calculations must use absolute temperature in kelvin.',
        'Boyle’s law holds only at constant temperature.',
        'Pressure arises from particle collisions with the container walls.',
        'Compressing a gas quickly does work on it and raises its temperature.',
        'Absolute zero is zero kelvin, about minus 273 degrees Celsius.'
      ],
      myths: [
        'Doubling the Celsius temperature doubles the volume of a gas.',
        'Gas particles push each other apart to create pressure.',
        'Boyle’s law applies whatever happens to the temperature.',
        'A gas has no internal energy when it is not moving as a whole.',
        'Absolute zero is zero degrees Celsius.'
      ],
      applications: [
        ['A gas at 200 kPa is squeezed to half its volume at constant temperature. New pressure?', '400 kPa'],
        ['Which temperature scale must be used in the gas laws?', 'kelvin'],
        ['What causes the pressure of a gas on its container?', 'particle collisions with the walls'],
        ['Which law relates volume to absolute temperature at fixed pressure?', 'Charles’s law'],
        ['What is absolute zero in kelvin?', '0']
      ]
    },
    {
      name: 'Hooke’s Law, Springs and Elastic Energy', from: 'Grade 8', to: 'College',
      facts: [
        ['Hooke’s law', 'extension is proportional to force, up to the limit of proportionality'],
        ['extension', 'the increase in length when a force is applied'],
        ['a spring constant', 'the force needed per unit extension'],
        ['the limit of proportionality', 'the point beyond which extension stops being proportional'],
        ['the elastic limit', 'the point beyond which a material will not return to its original shape'],
        ['elastic deformation', 'a change in shape that reverses when the force is removed'],
        ['inelastic deformation', 'a change in shape that does not fully reverse'],
        ['elastic potential energy', 'the energy stored in a stretched or compressed spring'],
        ['a newton', 'the unit of force'],
        ['a newton per metre', 'the unit of the spring constant'],
        ['a force-extension graph', 'the plot of force against extension'],
        ['a gradient', 'the slope of a graph, giving the spring constant here'],
        ['a linear region', 'the straight part of a force-extension graph'],
        ['compression', 'a squeezing that shortens a spring'],
        ['a natural length', 'the length of a spring with no force applied'],
        ['a load', 'the force applied to a spring'],
        ['a stiff spring', 'a spring with a large spring constant'],
        ['a series arrangement', 'springs joined end to end'],
        ['a parallel arrangement', 'springs side by side sharing a load'],
        ['work done stretching', 'the energy transferred to a spring as it extends']
      ],
      truths: [
        'The gradient of a force-extension graph gives the spring constant.',
        'Hooke’s law holds only up to the limit of proportionality.',
        'Elastic potential energy is the area under a force-extension graph.',
        'A stiffer spring has a larger spring constant.',
        'Extension is the increase in length, not the total length.'
      ],
      myths: [
        'Hooke’s law holds however far a spring is stretched.',
        'Extension means the whole length of the stretched spring.',
        'The limit of proportionality and the elastic limit are the same point.',
        'A spring with a large spring constant stretches more easily.',
        'Compressing a spring stores no energy.'
      ],
      applications: [
        ['A spring extends 0.2 m under 10 N. What is the spring constant?', '50 N/m'],
        ['What does the gradient of a force-extension graph give?', 'the spring constant'],
        ['Which area on the graph gives the stored elastic energy?', 'the area under the line'],
        ['Beyond which point does Hooke’s law stop applying?', 'the limit of proportionality'],
        ['A spring 12 cm long stretches to 15 cm. What is the extension?', '3 cm']
      ]
    },
    {
      name: 'The Doppler Effect and Red Shift', from: 'Grade 9', to: 'College',
      facts: [
        ['the Doppler effect', 'the change in observed frequency when source and observer move relative to each other'],
        ['frequency', 'the number of waves passing a point each second'],
        ['wavelength', 'the distance between one wave peak and the next'],
        ['a relative motion', 'movement of one object with respect to another'],
        ['an approaching source', 'a source moving towards the observer, raising the pitch'],
        ['a receding source', 'a source moving away, lowering the pitch'],
        ['red shift', 'the shift of light to longer wavelengths from a receding source'],
        ['blue shift', 'the shift to shorter wavelengths from an approaching source'],
        ['a spectrum', 'the spread of wavelengths a source emits'],
        ['an absorption line', 'the dark line in a spectrum used to measure a shift'],
        ['a galaxy', 'a vast system of stars, gas and dust'],
        ['Hubble’s law', 'the more distant a galaxy, the faster it recedes'],
        ['the expanding universe', 'the observed increase in distance between galaxies'],
        ['the Big Bang theory', 'the model of a universe expanding from a hot dense state'],
        ['cosmic microwave background radiation', 'the faint radiation left from the early universe'],
        ['a light year', 'the distance light travels in a year'],
        ['a radar speed gun', 'the everyday device using the Doppler effect'],
        ['an ultrasound scan', 'the medical use of reflected sound, including Doppler blood flow'],
        ['a siren', 'the familiar everyday example of a changing observed pitch'],
        ['a source', 'the object emitting the waves']
      ],
      truths: [
        'The Doppler effect changes the observed frequency, not the frequency the source emits.',
        'Light from almost all distant galaxies is red shifted.',
        'Hubble’s law states that more distant galaxies recede faster.',
        'Cosmic microwave background radiation is evidence for the Big Bang.',
        'A siren’s pitch drops as it passes because the source begins to recede.'
      ],
      myths: [
        'The siren itself changes its note as it passes.',
        'Red shift means the light has literally turned red to the eye.',
        'Galaxies are moving away through space into an empty region beyond.',
        'The Doppler effect applies to sound but not to light.',
        'Blue shift proves the universe is contracting.'
      ],
      applications: [
        ['A galaxy’s absorption lines are shifted to longer wavelengths. What is it doing?', 'receding'],
        ['Which law links a galaxy’s distance to its speed of recession?', 'Hubble’s law'],
        ['What radiation is left over from the early universe?', 'cosmic microwave background radiation'],
        ['Does the emitted frequency change when a source moves?', 'no'],
        ['A source moving towards you produces which shift?', 'a blue shift']
      ]
    }
  ],
  /* ================================ computing ================================ */
  programming: [
    {
      name: 'Object-Oriented Programming: Classes and Inheritance', from: 'Grade 9', to: 'College',
      facts: [
        ['a class', 'the template describing the data and behaviour of a kind of object'],
        ['an object', 'one instance created from a class'],
        ['an instance', 'a particular object made from a class'],
        ['an attribute', 'a piece of data belonging to an object'],
        ['a method', 'a function belonging to a class'],
        ['a constructor', 'the method that runs when an object is created'],
        ['encapsulation', 'keeping data and the methods that use it together, and hidden'],
        ['a private attribute', 'data not accessible from outside the class'],
        ['a getter', 'the method that returns a private attribute'],
        ['a setter', 'the method that changes a private attribute'],
        ['inheritance', 'a class taking the attributes and methods of another'],
        ['a superclass', 'the class being inherited from'],
        ['a subclass', 'the class that inherits'],
        ['overriding', 'a subclass replacing an inherited method with its own'],
        ['polymorphism', 'the same call behaving differently depending on the object'],
        ['abstraction', 'exposing only what a user of the class needs to know'],
        ['composition', 'building an object out of other objects rather than inheriting'],
        ['an interface', 'the set of methods a class promises to provide'],
        ['instantiation', 'the creation of an object from a class'],
        ['a class diagram', 'the drawing showing classes and their relationships']
      ],
      truths: [
        'A class is a template; an object is one instance of it.',
        'Encapsulation hides data behind methods so it cannot be changed unchecked.',
        'A subclass inherits from a superclass and may override its methods.',
        'Polymorphism lets the same method call behave differently for different objects.',
        'Composition is often a better fit than inheritance when the relationship is "has a" rather than "is a".'
      ],
      myths: [
        'A class and an object are the same thing.',
        'Inheritance is always the right way to share behaviour.',
        'Private attributes cannot be changed at all, ever.',
        'Every class must inherit from another class.',
        'Overriding a method deletes it from the superclass.'
      ],
      applications: [
        ['What runs automatically when an object is created?', 'the constructor'],
        ['A subclass replaces an inherited method. What is that called?', 'overriding'],
        ['Which principle keeps data and its methods together and hidden?', 'encapsulation'],
        ['A Car "has a" Engine. Inheritance or composition?', 'composition'],
        ['The class being inherited from is called what?', 'the superclass']
      ]
    },
    {
      name: 'Compilers, Interpreters and How Code Runs', from: 'Grade 9', to: 'College',
      facts: [
        ['source code', 'the program as a human writes it'],
        ['machine code', 'the binary instructions a processor executes'],
        ['a compiler', 'the translator that converts a whole program before it runs'],
        ['an interpreter', 'the translator that converts and runs a program line by line'],
        ['an assembler', 'the translator from assembly language to machine code'],
        ['assembly language', 'the low-level language with one instruction per machine operation'],
        ['a high-level language', 'a language written in terms close to human meaning'],
        ['a low-level language', 'a language close to the hardware'],
        ['a syntax error', 'a mistake in the rules of the language'],
        ['a runtime error', 'a failure that occurs while the program is running'],
        ['a logic error', 'a program that runs but gives the wrong answer'],
        ['an IDE', 'the integrated environment for writing, running and debugging code'],
        ['the von Neumann architecture', 'the design storing program and data in the same memory'],
        ['the fetch-decode-execute cycle', 'the repeated cycle a processor performs'],
        ['the program counter', 'the register holding the address of the next instruction'],
        ['the accumulator', 'the register holding intermediate results'],
        ['RAM', 'the volatile memory holding running programs and data'],
        ['a register', 'a tiny very fast store inside the processor'],
        ['a cache', 'the small fast memory holding recently used data'],
        ['bytecode', 'the intermediate form some languages compile to before running']
      ],
      truths: [
        'A compiler translates the whole program before it runs; an interpreter translates as it runs.',
        'The von Neumann architecture stores program instructions and data in the same memory.',
        'The program counter holds the address of the next instruction to fetch.',
        'A logic error produces a program that runs but gives the wrong result.',
        'Compiled code usually runs faster, while interpreted code is easier to test line by line.'
      ],
      myths: [
        'A compiler and an interpreter do exactly the same job at the same time.',
        'A program with no syntax errors must be correct.',
        'The processor executes high-level source code directly.',
        'Registers and RAM are the same kind of memory.',
        'An interpreter produces a machine code file you can keep and run later.'
      ],
      sequences: [
        ['The fetch-decode-execute cycle', [
          'The address in the program counter is placed on the address bus',
          'The instruction at that address is fetched into the processor',
          'The program counter is incremented',
          'The instruction is decoded',
          'The instruction is executed and any result stored'
        ]]
      ],
      applications: [
        ['Which translator converts the whole program before running it?', 'a compiler'],
        ['Which register holds the address of the next instruction?', 'the program counter'],
        ['A program runs but gives the wrong answer. What error is that?', 'a logic error'],
        ['Which architecture stores program and data in the same memory?', 'the von Neumann architecture'],
        ['Which language has one instruction per machine operation?', 'assembly language']
      ]
    }
  ],
  data: [
    {
      name: 'Machine Learning, Training Data and Bias', from: 'Grade 9', to: 'College',
      facts: [
        ['machine learning', 'building a model from data rather than writing rules by hand'],
        ['a model', 'the thing a learning process produces and then uses to predict'],
        ['training data', 'the examples a model learns from'],
        ['test data', 'the held-back examples used to check a model'],
        ['a feature', 'one measured input the model uses'],
        ['a label', 'the known answer attached to a training example'],
        ['supervised learning', 'learning from labelled examples'],
        ['unsupervised learning', 'finding structure in data with no labels'],
        ['classification', 'predicting which category something belongs to'],
        ['regression', 'predicting a numerical value'],
        ['overfitting', 'a model that has learned the training data rather than the pattern'],
        ['underfitting', 'a model too simple to capture the pattern'],
        ['accuracy', 'the share of predictions that are correct'],
        ['a false positive', 'a wrong prediction that something is present'],
        ['a false negative', 'a wrong prediction that something is absent'],
        ['bias in data', 'a pattern in the data that makes the model unfair or wrong'],
        ['a sampling bias', 'a training set that does not represent the real population'],
        ['a proxy variable', 'a feature that stands in for something it should not'],
        ['explainability', 'being able to say why a model made a prediction'],
        ['a training and test split', 'the division of data so a model is checked on unseen examples']
      ],
      truths: [
        'A model can only be as representative as the data it was trained on.',
        'Testing on the training data overstates how well a model performs.',
        'Overfitting shows up as high accuracy on training data and poor accuracy on test data.',
        'Removing a sensitive field does not remove bias if a proxy variable remains.',
        'High overall accuracy can hide poor performance on a small group.'
      ],
      myths: [
        'A model is objective because it is a computer program.',
        'More data always fixes bias.',
        'Accuracy is the only measure that matters.',
        'A model that fits the training data perfectly is the best model.',
        'Deleting the sensitive column makes a model fair.'
      ],
      applications: [
        ['A model scores 99% on training data and 60% on test data. What is wrong?', 'overfitting'],
        ['Learning from labelled examples is called what?', 'supervised learning'],
        ['Predicting a numerical value rather than a category is called what?', 'regression'],
        ['A feature that stands in for a sensitive attribute is called what?', 'a proxy variable'],
        ['A test wrongly says a disease is present. What kind of error?', 'a false positive']
      ]
    }
  ],
  web: [
    {
      name: 'Packet Switching and How the Internet Moves Data', from: 'Grade 8', to: 'College',
      facts: [
        ['a packet', 'a small block of data sent across a network'],
        ['packet switching', 'splitting data into packets routed independently'],
        ['circuit switching', 'reserving a whole path for the duration of a call'],
        ['a header', 'the part of a packet carrying addressing and ordering information'],
        ['a payload', 'the actual data inside a packet'],
        ['a router', 'the device that forwards packets towards their destination'],
        ['a hop', 'one step from router to router'],
        ['an IP address', 'the numeric address identifying a device on a network'],
        ['a MAC address', 'the hardware address of a network interface'],
        ['TCP', 'the protocol that orders packets and asks for missing ones again'],
        ['IP', 'the protocol that addresses and routes packets'],
        ['a protocol', 'an agreed set of rules for communication'],
        ['a DNS server', 'the service translating a domain name into an IP address'],
        ['a domain name', 'the readable name standing in for an address'],
        ['latency', 'the delay before data begins to arrive'],
        ['bandwidth', 'the amount of data a link can carry per second'],
        ['a checksum', 'the value used to detect a corrupted packet'],
        ['a retransmission', 'the resending of a packet that did not arrive'],
        ['congestion', 'the slowdown when a link carries more traffic than it can handle'],
        ['a route', 'the sequence of links a packet takes']
      ],
      truths: [
        'Packets from one message can travel by different routes and arrive out of order.',
        'TCP reassembles packets in order and requests any that are missing.',
        'DNS translates a domain name into an IP address before a connection is made.',
        'Latency and bandwidth are different: one is delay, the other is capacity.',
        'Packet switching uses a shared network efficiently; circuit switching reserves a path.'
      ],
      myths: [
        'All the packets of a message follow the same route.',
        'A faster connection always means lower latency.',
        'An IP address is fixed to a device for life.',
        'Packets arrive in the order they were sent, always.',
        'DNS stores the web pages themselves.'
      ],
      applications: [
        ['Which protocol puts packets back in order?', 'TCP'],
        ['What translates a domain name into an IP address?', 'DNS'],
        ['The delay before data starts arriving is called what?', 'latency'],
        ['What carries the addressing information in a packet?', 'the header'],
        ['Which switching method reserves a whole path for the call?', 'circuit switching']
      ]
    },
    {
      name: 'Cloud Computing and Virtualisation', from: 'Grade 9', to: 'College',
      facts: [
        ['cloud computing', 'using computing resources provided over a network as a service'],
        ['a data centre', 'the building full of servers that hosts cloud services'],
        ['a server', 'a computer providing a service to other machines'],
        ['a client', 'the machine requesting a service'],
        ['virtualisation', 'running several isolated machines on one physical computer'],
        ['a virtual machine', 'a complete simulated computer running on shared hardware'],
        ['a container', 'a lighter isolated environment sharing the host operating system'],
        ['scalability', 'the ability to add capacity as demand grows'],
        ['elasticity', 'the ability to add and remove capacity automatically'],
        ['on-demand provisioning', 'getting resources at the moment they are needed'],
        ['a service level agreement', 'the promised level of availability and support'],
        ['uptime', 'the share of time a service is available'],
        ['redundancy', 'spare capacity kept so a failure does not stop the service'],
        ['a backup', 'a stored copy that allows recovery after loss'],
        ['data sovereignty', 'the rule that data is subject to the laws of where it is stored'],
        ['a subscription cost', 'the recurring payment for a cloud service'],
        ['vendor lock-in', 'the difficulty of moving away from one provider'],
        ['software as a service', 'complete applications delivered over the network'],
        ['infrastructure as a service', 'raw servers and storage delivered over the network'],
        ['bandwidth dependence', 'the reliance of a cloud service on the network connection']
      ],
      truths: [
        'Cloud services run on physical servers in data centres owned by someone else.',
        'Virtualisation lets one physical machine host several isolated systems.',
        'Containers share the host operating system, so they start faster than virtual machines.',
        'Cloud use trades capital cost for a recurring subscription cost.',
        'A cloud service is unusable without a working network connection.'
      ],
      myths: [
        'Data in the cloud is not stored on any physical machine.',
        'Cloud storage removes the need for backups.',
        'Cloud computing is always cheaper than owning hardware.',
        'A container and a virtual machine are the same thing.',
        'Where data is physically stored has no legal consequences.'
      ],
      applications: [
        ['Which is lighter, a container or a virtual machine?', 'a container'],
        ['Adding and removing capacity automatically is called what?', 'elasticity'],
        ['What document sets out promised availability?', 'a service level agreement'],
        ['The difficulty of moving away from one provider is called what?', 'vendor lock-in'],
        ['Complete applications delivered over the network are called what?', 'software as a service']
      ]
    }
  ],
  cyber: [
    {
      name: 'Data Protection, GDPR and Privacy', from: 'Grade 8', to: 'College',
      facts: [
        ['personal data', 'information relating to an identifiable living person'],
        ['GDPR', 'the General Data Protection Regulation governing personal data in the EU and UK'],
        ['a data subject', 'the person the data is about'],
        ['a data controller', 'the organisation deciding why and how data is processed'],
        ['a data processor', 'the organisation processing data on a controller’s behalf'],
        ['consent', 'freely given, specific, informed agreement to processing'],
        ['a lawful basis', 'the legal ground an organisation relies on to process data'],
        ['data minimisation', 'collecting only what is needed for the stated purpose'],
        ['purpose limitation', 'using data only for the purpose it was collected for'],
        ['storage limitation', 'keeping data no longer than necessary'],
        ['the right of access', 'the right to obtain a copy of your data'],
        ['the right to erasure', 'the right to have data deleted in defined circumstances'],
        ['the right to rectification', 'the right to have inaccurate data corrected'],
        ['a subject access request', 'the formal request for a copy of your data'],
        ['a data breach', 'a security incident exposing or losing personal data'],
        ['pseudonymisation', 'replacing identifiers so data cannot be linked without extra information'],
        ['anonymisation', 'removing identifiers so a person can no longer be identified'],
        ['special category data', 'sensitive data such as health or biometrics with extra protection'],
        ['a privacy notice', 'the statement telling people how their data will be used'],
        ['a supervisory authority', 'the regulator that enforces data protection law']
      ],
      truths: [
        'Consent is only one of several lawful bases for processing personal data.',
        'Data minimisation means collecting no more than the stated purpose needs.',
        'A subject access request obliges an organisation to provide a copy of the data it holds.',
        'Anonymised data is outside the regulation; pseudonymised data is still personal data.',
        'A serious breach must be reported to the supervisory authority within a set time.'
      ],
      myths: [
        'GDPR bans organisations from holding personal data.',
        'Consent is always required before any processing.',
        'Deleting a record from one system satisfies the right to erasure everywhere.',
        'Pseudonymised data is no longer personal data.',
        'A privacy notice is optional if the data is not sensitive.'
      ],
      applications: [
        ['What is the formal request for a copy of your data called?', 'a subject access request'],
        ['Who decides why and how personal data is processed?', 'the data controller'],
        ['Collecting only what the purpose needs is which principle?', 'data minimisation'],
        ['Is pseudonymised data still personal data?', 'yes'],
        ['Health records fall into which category of data?', 'special category data']
      ]
    }
  ],
  /* =================================== ela =================================== */
  writing: [
    {
      name: 'Discursive and Persuasive Essays', from: 'Grade 8', to: 'College',
      facts: [
        ['a discursive essay', 'an essay setting out more than one view before reaching a judgement'],
        ['a persuasive essay', 'an essay arguing for one position throughout'],
        ['a thesis statement', 'the sentence stating the position the essay will defend'],
        ['a topic sentence', 'the sentence stating what a paragraph is about'],
        ['a counter-argument', 'the strongest case against your position'],
        ['a rebuttal', 'the answer to a counter-argument'],
        ['a concession', 'the admission that part of the other side has force'],
        ['evidence', 'the facts, data or quotations supporting a claim'],
        ['a citation', 'the reference identifying where evidence came from'],
        ['a hedge', 'a qualifier such as "often" that limits a claim honestly'],
        ['an overstatement', 'a claim pushed further than the evidence allows'],
        ['a discourse marker', 'a signpost such as "however" showing how ideas connect'],
        ['a formal register', 'the level of language expected in an essay'],
        ['the passive voice', 'a construction placing the action before the actor'],
        ['a conclusion', 'the final paragraph drawing the argument together'],
        ['an introduction', 'the opening paragraph framing the question'],
        ['a paragraph structure', 'the pattern of point, evidence and explanation'],
        ['rhetoric', 'the art of persuasive composition'],
        ['ethos', 'persuasion through the credibility of the writer'],
        ['pathos', 'persuasion through the feelings of the reader']
      ],
      truths: [
        'A discursive essay sets out opposing views; a persuasive essay argues one throughout.',
        'Answering the strongest counter-argument makes a case stronger, not weaker.',
        'A thesis statement tells the reader what the essay will argue.',
        'Evidence needs explaining; quoting alone does not make an argument.',
        'A hedge keeps a claim honest and defensible.'
      ],
      myths: [
        'Mentioning the other side weakens your argument.',
        'A conclusion should introduce a new piece of evidence.',
        'Longer sentences always sound more academic.',
        'A discursive essay must avoid reaching any judgement.',
        'Emotional appeal has no legitimate place in argument.'
      ],
      sequences: [
        ['Planning a discursive essay', [
          'Work out exactly what the question is asking',
          'List the strongest arguments on each side',
          'Decide the judgement the evidence supports',
          'Order the paragraphs so the argument builds',
          'Write the thesis statement, then the body, then the conclusion',
          'Check each paragraph has a point, evidence and explanation'
        ]]
      ],
      applications: [
        ['Which essay type sets out more than one view before judging?', 'a discursive essay'],
        ['What is the answer to a counter-argument called?', 'a rebuttal'],
        ['Which sentence states what a paragraph is about?', 'the topic sentence'],
        ['Persuasion through the writer’s credibility is called what?', 'ethos'],
        ['A qualifier that honestly limits a claim is called what?', 'a hedge']
      ]
    }
  ],
  literature: [
    {
      name: 'Rhetorical Devices: Anaphora, Antithesis and Repetition', from: 'Grade 8', to: 'College',
      facts: [
        ['rhetoric', 'the art of using language to persuade'],
        ['anaphora', 'the repetition of the same words at the start of successive clauses'],
        ['epistrophe', 'the repetition of the same words at the end of successive clauses'],
        ['antithesis', 'the balancing of opposed ideas in parallel structure'],
        ['a tricolon', 'a group of three parallel elements'],
        ['parallelism', 'matching grammatical structure across phrases'],
        ['a rhetorical question', 'a question asked for effect rather than answer'],
        ['hyperbole', 'deliberate exaggeration for effect'],
        ['litotes', 'understatement made by denying the opposite'],
        ['a chiasmus', 'a phrase repeated in reversed order'],
        ['asyndeton', 'the omission of conjunctions between items'],
        ['polysyndeton', 'the repeated use of conjunctions between items'],
        ['alliteration', 'the repetition of an initial consonant sound'],
        ['an apostrophe in rhetoric', 'a direct address to someone absent or to an idea'],
        ['a metaphor', 'a comparison stating one thing is another'],
        ['an analogy', 'an extended comparison used to explain'],
        ['juxtaposition', 'placing two things side by side for contrast'],
        ['a cadence', 'the rhythm and fall of a spoken sentence'],
        ['emotive language', 'wording chosen to produce a feeling'],
        ['a direct address', 'speaking to the audience as "you"']
      ],
      truths: [
        'Anaphora repeats at the beginning of clauses; epistrophe repeats at the end.',
        'Antithesis needs both opposed ideas and parallel structure.',
        'A tricolon groups three parallel elements, and is common in speeches.',
        'Asyndeton speeds a list; polysyndeton slows it.',
        'A rhetorical question shapes the audience’s thinking without expecting an answer.'
      ],
      myths: [
        'Any repetition counts as anaphora.',
        'Rhetorical devices are only found in poetry.',
        'Hyperbole is a lie the writer expects to be believed.',
        'A chiasmus and a parallelism are the same figure.',
        'Litotes is the same as hyperbole.'
      ],
      applications: [
        ['"We shall fight... we shall fight..." — which device?', 'anaphora'],
        ['Repetition at the end of successive clauses is called what?', 'epistrophe'],
        ['Balanced opposed ideas in parallel structure is which device?', 'antithesis'],
        ['Omitting conjunctions from a list is called what?', 'asyndeton'],
        ['Understatement made by denying the opposite is called what?', 'litotes']
      ]
    }
  ]
};
