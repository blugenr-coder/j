/* Engineering, discipline by discipline.

   The subject had three topics — design, electronics, robotics — which is a
   design-and-technology syllabus rather than engineering. These are the
   branches an engineering degree is actually divided into, each named for the
   thing it studies.

   Where a topic overlaps physics, the treatment is the engineering one: not
   what the law says, but what it forces you to size, choose or check. */

export const ENGINEERING_UNITS = {
  /* ============================== mechanical ============================== */
  mechanical: [
    {
      name: 'Statics: Forces, Moments and Free-Body Diagrams', from: 'Grade 10', to: 'Advanced',
      figures: ['forces'],
      facts: [
        ['statics', 'the study of bodies in equilibrium'],
        ['a free-body diagram', 'a sketch showing every force acting on one isolated body'],
        ['equilibrium', 'the state where net force and net moment are both zero'],
        ['a resultant', 'the single force equivalent to a set of forces'],
        ['a component', 'the part of a force along one axis'],
        ['a moment', 'the turning effect of a force, force times perpendicular distance'],
        ['a couple', 'two equal opposite forces producing rotation but no net force'],
        ['a reaction force', 'the force a support exerts on a body'],
        ['a pin joint', 'a support providing two reaction components and no moment'],
        ['a roller support', 'a support providing one reaction perpendicular to the surface'],
        ['a fixed support', 'a support providing two reactions and a moment'],
        ['a distributed load', 'a load spread over a length rather than acting at a point'],
        ['an equivalent point load', 'the resultant of a distributed load, at its centroid'],
        ['a centroid', 'the geometric centre of an area'],
        ['a centre of gravity', 'the point through which weight acts'],
        ['a truss', 'a framework of two-force members pinned at joints'],
        ['a two-force member', 'a member loaded only at its two ends, so in pure tension or compression'],
        ['the method of joints', 'solving a truss joint by joint'],
        ['the method of sections', 'cutting a truss to solve for chosen members directly'],
        ['static determinacy', 'whether equilibrium alone is enough to find the reactions']
      ],
      truths: [
        'Equilibrium requires the sum of forces and the sum of moments both to be zero.',
        'Moments can be taken about any point; a good choice eliminates unknowns.',
        'A distributed load can be replaced by its resultant acting at the centroid.',
        'A two-force member carries only axial load, never bending.',
        'A structure with more unknowns than equilibrium equations is statically indeterminate.'
      ],
      myths: [
        'A body at rest has no forces acting on it.',
        'Moments must be taken about a support.',
        'A roller support resists movement in every direction.',
        'The centroid and the centre of gravity are always the same point.',
        'Every truss can be solved by equilibrium alone.'
      ],
      applications: [
        ['A 200 N force acts 0.5 m from a pivot. What is the moment?', '100 Nm'],
        ['How many reaction components does a pin joint provide?', '2'],
        ['A uniformly distributed load acts at which point as a resultant?', 'the centroid'],
        ['A member loaded only at its ends carries what kind of load?', 'axial'],
        ['What two conditions define static equilibrium?', 'zero net force and zero net moment']
      ]
    },
    {
      name: 'Stress, Strain and Material Failure', from: 'Grade 11', to: 'Advanced',
      facts: [
        ['stress', 'force per unit area'],
        ['a pascal', 'the unit of stress, one newton per square metre'],
        ['tensile stress', 'stress from a pulling load'],
        ['compressive stress', 'stress from a pushing load'],
        ['shear stress', 'stress from forces acting across a section'],
        ['strain', 'the change in length divided by the original length'],
        ['Young’s modulus', 'the ratio of stress to strain in the elastic region'],
        ['Hooke’s law', 'stress is proportional to strain up to the limit of proportionality'],
        ['the elastic region', 'the range where a material returns to its original shape'],
        ['the plastic region', 'the range where deformation is permanent'],
        ['the yield point', 'where a material begins to deform plastically'],
        ['yield strength', 'the stress at which yielding begins'],
        ['ultimate tensile strength', 'the maximum stress a material can take'],
        ['necking', 'the local narrowing that precedes tensile failure'],
        ['ductility', 'the ability to deform plastically before failure'],
        ['brittleness', 'failure with little plastic deformation'],
        ['toughness', 'the energy absorbed before fracture'],
        ['fatigue', 'failure under repeated loading below the yield stress'],
        ['a stress concentration', 'a local rise in stress at a notch, hole or sharp corner'],
        ['a factor of safety', 'the ratio of the failure stress to the working stress']
      ],
      truths: [
        'Young’s modulus is the gradient of the elastic part of a stress-strain curve.',
        'Fatigue failure happens below the yield stress, given enough cycles.',
        'A sharp corner is a stress concentration and a common origin of a crack.',
        'A material can be strong and brittle at the same time.',
        'Strain is dimensionless, being a length divided by a length.'
      ],
      myths: [
        'A stronger material is always a tougher one.',
        'A component loaded below its yield stress can never fail.',
        'Strain is measured in pascals.',
        'Stress concentration only matters at very high loads.',
        'The ultimate tensile strength is the stress a part should be designed to.'
      ],
      applications: [
        ['A 10 kN load on a 100 mm² section gives what stress?', '100 MPa'],
        ['What is the gradient of the elastic region of a stress-strain curve?', 'Young’s modulus'],
        ['Failure under repeated loading below yield is called what?', 'fatigue'],
        ['A bar 2 m long stretches 4 mm. What is the strain?', '0.002'],
        ['Which feature at a hole or notch raises local stress?', 'a stress concentration']
      ]
    }
  ],
  /* ================================= civil ================================= */
  civil: [
    {
      name: 'Beams, Bending and Structural Analysis', from: 'Grade 11', to: 'Advanced',
      facts: [
        ['a beam', 'a member carrying load transverse to its length'],
        ['a simply supported beam', 'one on a pin at one end and a roller at the other'],
        ['a cantilever', 'a beam fixed at one end and free at the other'],
        ['a continuous beam', 'one spanning more than two supports'],
        ['a shear force', 'the internal force acting across a section'],
        ['a bending moment', 'the internal moment at a section'],
        ['a shear force diagram', 'the plot of shear along the beam'],
        ['a bending moment diagram', 'the plot of bending moment along the beam'],
        ['the point of maximum moment', 'where shear passes through zero'],
        ['the neutral axis', 'the line through a section where bending stress is zero'],
        ['the second moment of area', 'the geometric measure of a section’s resistance to bending'],
        ['the section modulus', 'the second moment of area divided by the distance to the extreme fibre'],
        ['the bending equation', 'stress over distance equals moment over second moment of area'],
        ['deflection', 'how far a beam moves under load'],
        ['stiffness', 'resistance to deflection, set by the material and the section'],
        ['a dead load', 'the permanent weight of the structure'],
        ['an imposed load', 'the variable load from occupancy and use'],
        ['a load combination', 'the factored set of loads a design must resist'],
        ['a limit state', 'a condition beyond which a structure no longer satisfies its criteria'],
        ['reinforced concrete', 'concrete with steel placed where tension occurs']
      ],
      truths: [
        'The maximum bending moment occurs where the shear force passes through zero.',
        'Bending stress is zero at the neutral axis and greatest at the extreme fibre.',
        'Depth matters far more than width: the second moment of area goes as depth cubed.',
        'Concrete is strong in compression and weak in tension, so steel goes where tension is.',
        'A deeper beam of the same material and weight deflects less.'
      ],
      myths: [
        'The maximum bending moment is always at midspan.',
        'Doubling the width of a beam is as good as doubling its depth.',
        'Bending stress is uniform across the section.',
        'Concrete is equally strong in tension and compression.',
        'A stiffer beam is automatically a stronger one.'
      ],
      applications: [
        ['Where does maximum bending moment occur?', 'where shear force is zero'],
        ['Where is bending stress zero in a section?', 'at the neutral axis'],
        ['Doubling the depth of a rectangular beam multiplies its second moment of area by what?', '8'],
        ['Where is steel placed in reinforced concrete?', 'where tension occurs'],
        ['A beam fixed at one end and free at the other is called what?', 'a cantilever']
      ]
    },
    {
      name: 'Soil Mechanics, Foundations and Geotechnics', from: 'College', to: 'Advanced',
      facts: [
        ['soil mechanics', 'the study of soil as an engineering material'],
        ['a cohesive soil', 'clay, whose strength comes from cohesion'],
        ['a granular soil', 'sand or gravel, whose strength comes from friction'],
        ['particle size distribution', 'the grading of a soil, found by sieving'],
        ['void ratio', 'the ratio of void volume to solid volume'],
        ['porosity', 'the proportion of a soil that is voids'],
        ['permeability', 'how readily water passes through soil'],
        ['effective stress', 'total stress minus pore water pressure'],
        ['pore water pressure', 'the pressure of water in the voids'],
        ['Terzaghi’s principle', 'that effective stress controls soil behaviour'],
        ['shear strength', 'the resistance of soil to sliding'],
        ['the angle of internal friction', 'the frictional component of shear strength'],
        ['cohesion', 'the component of strength independent of normal stress'],
        ['consolidation', 'the slow settlement as water is squeezed out of clay'],
        ['settlement', 'the downward movement of a foundation'],
        ['bearing capacity', 'the load per unit area the soil can safely carry'],
        ['a shallow foundation', 'a pad or strip footing near the surface'],
        ['a pile foundation', 'a deep foundation transferring load to lower strata'],
        ['a retaining wall', 'a structure holding back soil'],
        ['active earth pressure', 'the pressure soil exerts when a wall moves away from it']
      ],
      truths: [
        'Effective stress, not total stress, governs the strength and stiffness of soil.',
        'Clay settles slowly by consolidation as pore water is squeezed out.',
        'Granular soils get their strength from friction, clays largely from cohesion.',
        'A pile transfers load to deeper, stronger strata by end bearing, shaft friction or both.',
        'Active earth pressure is lower than at-rest pressure, and passive is higher.'
      ],
      myths: [
        'Settlement is a sign that a foundation has failed.',
        'Total stress is what controls how soil behaves.',
        'Sand and clay behave in essentially the same way.',
        'A deeper foundation is always the better choice.',
        'Consolidation happens as soon as the load is applied.'
      ],
      applications: [
        ['Total stress minus pore water pressure gives what?', 'effective stress'],
        ['Which soil type settles slowly by consolidation?', 'clay'],
        ['Where does a granular soil get its shear strength?', 'friction'],
        ['A foundation transferring load to deeper strata is called what?', 'a pile'],
        ['Whose principle governs effective stress?', 'Terzaghi']
      ]
    }
  ],
  /* =============================== electrical =============================== */
  electrical: [
    {
      name: 'AC Circuits, Impedance and Power Factor', from: 'Grade 12', to: 'Advanced',
      facts: [
        ['alternating current', 'current that reverses direction periodically'],
        ['frequency', 'cycles per second, measured in hertz'],
        ['a peak value', 'the maximum instantaneous value in a cycle'],
        ['an RMS value', 'the equivalent direct value for heating effect'],
        ['a phasor', 'a rotating vector representing a sinusoidal quantity'],
        ['reactance', 'opposition to alternating current from inductance or capacitance'],
        ['inductive reactance', 'reactance that rises with frequency'],
        ['capacitive reactance', 'reactance that falls with frequency'],
        ['impedance', 'the total opposition to alternating current'],
        ['a phase angle', 'the angle by which current leads or lags voltage'],
        ['a leading current', 'current ahead of voltage, in a capacitive circuit'],
        ['a lagging current', 'current behind voltage, in an inductive circuit'],
        ['real power', 'the power actually converted, measured in watts'],
        ['reactive power', 'the power exchanged with the field, in volt-amperes reactive'],
        ['apparent power', 'the product of RMS voltage and current, in volt-amperes'],
        ['power factor', 'the ratio of real to apparent power'],
        ['power factor correction', 'adding capacitance to offset an inductive load'],
        ['resonance', 'where inductive and capacitive reactance cancel'],
        ['a three-phase supply', 'three voltages separated by 120 degrees'],
        ['a transformer', 'a device changing voltage by electromagnetic induction']
      ],
      truths: [
        'The RMS value of a sine wave is the peak divided by the square root of two.',
        'Inductive reactance rises with frequency; capacitive reactance falls.',
        'At resonance the reactances cancel and the circuit looks purely resistive.',
        'A poor power factor means more current for the same real power, and greater losses.',
        'Reactive power does no net work but is real current in the cables.'
      ],
      myths: [
        'Reactive power is imaginary and can be ignored.',
        'Impedance and resistance mean the same thing.',
        'Power factor correction reduces the real power a load consumes.',
        'A transformer works on direct current.',
        'The RMS value is the average of the waveform.'
      ],
      applications: [
        ['A 325 V peak sine wave has what RMS value?', 'about 230 V'],
        ['What happens to inductive reactance as frequency rises?', 'it rises'],
        ['Real power divided by apparent power gives what?', 'power factor'],
        ['At resonance a circuit appears to be what?', 'purely resistive'],
        ['Adding capacitance to offset an inductive load is called what?', 'power factor correction']
      ]
    }
  ],
  /* ============================== chemical eng ============================== */
  'chemical-eng': [
    {
      name: 'Mass Balances and Process Flow', from: 'College', to: 'Advanced',
      facts: [
        ['a process', 'a set of operations converting feed into product'],
        ['a unit operation', 'a single physical step such as distillation or filtration'],
        ['a flowsheet', 'the diagram of a process and its streams'],
        ['a stream', 'a flow of material between units'],
        ['a mass balance', 'an accounting of mass in, out and accumulated'],
        ['the general balance equation', 'in minus out plus generation minus consumption equals accumulation'],
        ['steady state', 'where nothing accumulates and flows are constant'],
        ['a batch process', 'one where material is loaded, processed and removed'],
        ['a continuous process', 'one where material flows through steadily'],
        ['a control volume', 'the boundary drawn for a balance'],
        ['a basis of calculation', 'the quantity chosen to work from'],
        ['a recycle stream', 'material returned to an earlier point in the process'],
        ['a purge stream', 'a small bleed preventing build-up of an inert'],
        ['a bypass stream', 'material routed around a unit'],
        ['conversion', 'the fraction of a reactant consumed'],
        ['yield', 'the amount of product obtained relative to the theoretical'],
        ['selectivity', 'the proportion of the desired product among the products'],
        ['a limiting reactant', 'the one that runs out first'],
        ['an excess reactant', 'one supplied beyond the stoichiometric requirement'],
        ['a degree of freedom analysis', 'checking whether a problem has a unique solution']
      ],
      truths: [
        'At steady state, mass in equals mass out for every component with no reaction.',
        'A recycle raises overall conversion without raising single-pass conversion.',
        'A purge is needed whenever an inert enters and does not leave with the product.',
        'Choosing a sensible basis of calculation is usually the whole difficulty.',
        'Degree of freedom analysis tells you whether a flowsheet problem is solvable before you attempt it.'
      ],
      myths: [
        'Mass balances only apply where a reaction occurs.',
        'A recycle stream increases single-pass conversion.',
        'Conversion and yield mean the same thing.',
        'Accumulation is always zero.',
        'The limiting reactant is whichever is present in the smallest mass.'
      ],
      applications: [
        ['At steady state, what is the accumulation term?', 'zero'],
        ['A small bleed preventing inert build-up is called what?', 'a purge'],
        ['The fraction of a reactant consumed is called what?', 'conversion'],
        ['Which reactant runs out first?', 'the limiting reactant'],
        ['What does a recycle raise: overall or single-pass conversion?', 'overall']
      ]
    }
  ],
  /* ================================ aerospace ================================ */
  aerospace: [
    {
      name: 'Aerodynamics, Lift and Flight Mechanics', from: 'Grade 11', to: 'Advanced',
      facts: [
        ['an aerofoil', 'a shape designed to produce lift'],
        ['lift', 'the force perpendicular to the airflow'],
        ['drag', 'the force opposing motion through the air'],
        ['thrust', 'the force propelling the aircraft forward'],
        ['weight', 'the force of gravity on the aircraft'],
        ['the angle of attack', 'the angle between the chord line and the airflow'],
        ['the chord line', 'the straight line from leading to trailing edge'],
        ['camber', 'the curvature of an aerofoil'],
        ['a stall', 'the loss of lift when flow separates at high angle of attack'],
        ['the stall angle', 'the angle of attack beyond which lift falls'],
        ['the lift coefficient', 'the dimensionless measure of lift for a shape'],
        ['induced drag', 'drag arising as a by-product of lift'],
        ['parasitic drag', 'drag from form and skin friction'],
        ['a wingtip vortex', 'the swirl at the tip that causes induced drag'],
        ['aspect ratio', 'the ratio of span to mean chord'],
        ['the Reynolds number', 'the ratio of inertial to viscous forces'],
        ['the Mach number', 'speed as a fraction of the speed of sound'],
        ['subsonic flight', 'flight below the speed of sound'],
        ['transonic flight', 'flight where some flow is supersonic and some is not'],
        ['the boundary layer', 'the thin layer of slowed air next to a surface']
      ],
      truths: [
        'A stall is caused by exceeding the critical angle of attack, not by flying too slowly.',
        'Induced drag falls as speed rises; parasitic drag rises as the square of speed.',
        'A higher aspect ratio wing has lower induced drag.',
        'An aircraft can stall at any airspeed and any attitude.',
        'The Mach number, not the airspeed, determines compressibility effects.'
      ],
      myths: [
        'A wing produces lift because air travels further over the top and must arrive together.',
        'A stall happens when the aircraft runs out of speed.',
        'Drag always increases with speed.',
        'An aircraft cannot stall while pointing downwards.',
        'Lift acts vertically upwards at all times.'
      ],
      applications: [
        ['What causes a stall?', 'exceeding the critical angle of attack'],
        ['Which drag falls as speed rises?', 'induced drag'],
        ['A high aspect ratio wing reduces which drag?', 'induced drag'],
        ['Speed as a fraction of the speed of sound is called what?', 'the Mach number'],
        ['The thin layer of slowed air at a surface is called what?', 'the boundary layer']
      ]
    }
  ],
  /* ================================ materials ================================ */
  materials: [
    {
      name: 'Crystal Structure, Alloys and Phase Diagrams', from: 'College', to: 'Advanced',
      facts: [
        ['a crystal structure', 'the regular repeating arrangement of atoms in a solid'],
        ['a unit cell', 'the smallest repeating unit of a crystal'],
        ['body-centred cubic', 'a cell with an atom at each corner and one at the centre'],
        ['face-centred cubic', 'a cell with atoms at the corners and face centres'],
        ['hexagonal close-packed', 'a close-packed structure with hexagonal symmetry'],
        ['a grain', 'a region of uniform crystal orientation'],
        ['a grain boundary', 'the interface between grains, which impedes dislocations'],
        ['a dislocation', 'a line defect whose motion produces plastic deformation'],
        ['slip', 'the movement of dislocations along a plane'],
        ['work hardening', 'strengthening by deformation that tangles dislocations'],
        ['annealing', 'heating to relieve stress and allow recrystallisation'],
        ['an alloy', 'a metal combined with other elements'],
        ['a solid solution', 'an alloy where the added atoms sit within the lattice'],
        ['a substitutional solid solution', 'where solute atoms replace host atoms'],
        ['an interstitial solid solution', 'where small solute atoms sit between host atoms'],
        ['a phase', 'a physically distinct and chemically uniform portion'],
        ['a phase diagram', 'the map of stable phases against composition and temperature'],
        ['the eutectic point', 'the composition with the lowest melting temperature'],
        ['the lever rule', 'the method for finding the proportions of two phases'],
        ['quenching', 'rapid cooling to trap a non-equilibrium structure']
      ],
      truths: [
        'Plastic deformation in metals happens by dislocation motion, not by bonds breaking en masse.',
        'Smaller grains give a stronger metal, because grain boundaries impede dislocations.',
        'Carbon in iron forms an interstitial solid solution, because carbon atoms are small.',
        'The eutectic composition melts at a lower temperature than either pure component.',
        'Quenching traps a structure that equilibrium cooling would not produce.'
      ],
      myths: [
        'Metals deform because their atomic bonds break and reform randomly.',
        'A larger grain size makes a stronger metal.',
        'An alloy is a mixture in which the components stay chemically separate.',
        'A phase diagram tells you how fast a transformation happens.',
        'Annealing and quenching produce the same structure.'
      ],
      applications: [
        ['What line defect carries plastic deformation?', 'a dislocation'],
        ['Smaller grains make a metal what?', 'stronger'],
        ['Carbon in iron forms which kind of solid solution?', 'interstitial'],
        ['Which composition has the lowest melting point?', 'the eutectic'],
        ['Which rule gives the proportions of two phases?', 'the lever rule']
      ]
    }
  ],
  /* =============================== biomedical =============================== */
  biomedical: [
    {
      name: 'Biomaterials, Implants and Medical Devices', from: 'College', to: 'Advanced',
      facts: [
        ['a biomaterial', 'a material intended to interface with biological systems'],
        ['biocompatibility', 'the ability to perform without provoking an adverse response'],
        ['a bioinert material', 'one provoking minimal response from tissue'],
        ['a bioactive material', 'one that bonds chemically with tissue'],
        ['a biodegradable material', 'one designed to break down and be absorbed'],
        ['an implant', 'a device placed within the body'],
        ['a prosthesis', 'a device replacing a missing part'],
        ['osseointegration', 'the direct bonding of bone to an implant surface'],
        ['titanium', 'the metal favoured for implants for its biocompatibility'],
        ['stainless steel', 'a common implant metal for temporary fixation'],
        ['a polymer implant', 'one made of a long-chain organic material'],
        ['ultra-high molecular weight polyethylene', 'the bearing surface in many joint replacements'],
        ['wear debris', 'particles released by a bearing surface, which can provoke loosening'],
        ['stress shielding', 'bone loss where a stiff implant carries load the bone used to'],
        ['a stent', 'a tube holding a vessel open'],
        ['a catheter', 'a tube inserted to deliver or drain fluid'],
        ['sterilisation', 'the elimination of viable microorganisms from a device'],
        ['a class of device', 'the regulatory category set by the risk it carries'],
        ['a clinical trial', 'the staged human testing of a device or treatment'],
        ['a failure mode', 'a defined way in which a device can stop performing']
      ],
      truths: [
        'Biocompatibility is a property of a material in a particular application, not in the abstract.',
        'Stress shielding happens because a stiff implant carries load the bone previously took.',
        'Wear debris from a bearing surface can provoke the loosening of an otherwise sound implant.',
        'Titanium is favoured for its combination of biocompatibility and modulus closer to bone.',
        'A device is regulated according to the risk its class represents, not its complexity.'
      ],
      myths: [
        'A material is biocompatible or not, regardless of where it is used.',
        'A stiffer implant is always better because it is stronger.',
        'An implant that does not corrode cannot fail.',
        'Biodegradable means the material dissolves immediately.',
        'Sterilisation and disinfection are the same process.'
      ],
      applications: [
        ['Bone loss around a stiff implant is called what?', 'stress shielding'],
        ['The direct bonding of bone to an implant is called what?', 'osseointegration'],
        ['Which metal is favoured for permanent implants?', 'titanium'],
        ['Particles from a bearing surface are called what?', 'wear debris'],
        ['A material that bonds chemically with tissue is called what?', 'bioactive']
      ]
    }
  ],
  /* =============================== industrial =============================== */
  industrial: [
    {
      name: 'Manufacturing Processes and Lean Production', from: 'Grade 10', to: 'Advanced',
      facts: [
        ['casting', 'forming by pouring molten material into a mould'],
        ['forging', 'shaping metal by compressive force'],
        ['machining', 'removing material to reach a shape'],
        ['injection moulding', 'forcing molten polymer into a mould under pressure'],
        ['extrusion', 'forcing material through a die to make a continuous profile'],
        ['additive manufacturing', 'building a part layer by layer'],
        ['a tolerance', 'the permitted variation in a dimension'],
        ['a surface finish', 'the texture left by a process'],
        ['a jig', 'a device holding work and guiding the tool'],
        ['a fixture', 'a device holding work in position'],
        ['lean manufacturing', 'the approach that eliminates waste from a process'],
        ['muda', 'the Japanese term for waste'],
        ['just in time', 'producing only what is needed, when it is needed'],
        ['kanban', 'a signal that pulls production from the next stage'],
        ['a bottleneck', 'the step that limits the throughput of the whole line'],
        ['takt time', 'the rate at which product must be completed to meet demand'],
        ['cycle time', 'the time to complete one unit at a step'],
        ['work in progress', 'unfinished material held between steps'],
        ['statistical process control', 'monitoring a process with control charts'],
        ['six sigma', 'the methodology aimed at reducing variation and defects']
      ],
      truths: [
        'Improving a step that is not the bottleneck does not raise throughput.',
        'Takt time is set by customer demand; cycle time is set by the process.',
        'Just in time reduces work in progress but leaves less buffer against disruption.',
        'A tighter tolerance costs more, so it should be specified only where it is needed.',
        'Statistical process control distinguishes normal variation from a real change.'
      ],
      myths: [
        'Speeding up any step makes the line faster.',
        'Lean manufacturing means cutting staff.',
        'Tighter tolerances are always better engineering.',
        'A process is out of control whenever a measurement varies.',
        'Additive manufacturing is always cheaper than machining.'
      ],
      applications: [
        ['Improving which step raises throughput?', 'the bottleneck'],
        ['The rate needed to meet customer demand is called what?', 'takt time'],
        ['A signal that pulls production from the next stage is called what?', 'kanban'],
        ['Unfinished material between steps is called what?', 'work in progress'],
        ['Forcing molten polymer into a mould is which process?', 'injection moulding']
      ]
    }
  ],
  /* ================================= thermo ================================= */
  thermo: [
    {
      name: 'Thermodynamics: Laws, Cycles and Efficiency', from: 'Grade 11', to: 'Advanced',
      facts: [
        ['a system', 'the region under consideration'],
        ['the surroundings', 'everything outside the system'],
        ['a closed system', 'one exchanging energy but not mass'],
        ['an open system', 'one exchanging both energy and mass'],
        ['internal energy', 'the total energy contained within a system'],
        ['the zeroth law', 'that two systems in equilibrium with a third are in equilibrium with each other'],
        ['the first law', 'that energy is conserved: heat added equals work done plus internal energy change'],
        ['the second law', 'that entropy of an isolated system never decreases'],
        ['entropy', 'the measure of energy unavailable for work, and of disorder'],
        ['the third law', 'that entropy approaches a constant as temperature approaches absolute zero'],
        ['a reversible process', 'an idealised process that can be run backwards with no loss'],
        ['an isothermal process', 'one at constant temperature'],
        ['an adiabatic process', 'one with no heat transfer'],
        ['an isobaric process', 'one at constant pressure'],
        ['an isochoric process', 'one at constant volume'],
        ['a heat engine', 'a device converting heat into work'],
        ['thermal efficiency', 'work out divided by heat in'],
        ['the Carnot cycle', 'the most efficient cycle possible between two temperatures'],
        ['Carnot efficiency', 'one minus the ratio of cold to hot absolute temperature'],
        ['a heat pump', 'a device moving heat from cold to hot using work']
      ],
      truths: [
        'No heat engine between two temperatures can beat the Carnot efficiency.',
        'The second law is what forbids a perfectly efficient engine, not engineering limitations.',
        'An adiabatic process transfers no heat but can still change temperature.',
        'A heat pump can deliver more heat than the work put in, because it moves heat rather than making it.',
        'Entropy of the universe increases in every real process.'
      ],
      myths: [
        'A perfectly efficient engine is possible with good enough materials.',
        'Adiabatic means constant temperature.',
        'A heat pump delivering more heat than the work input breaks the first law.',
        'Entropy is simply another word for heat.',
        'The first law is what makes perpetual motion impossible.'
      ],
      applications: [
        ['An engine between 600 K and 300 K has what Carnot efficiency?', '50%'],
        ['A process with no heat transfer is called what?', 'adiabatic'],
        ['Which law forbids a perfectly efficient heat engine?', 'the second'],
        ['Work out divided by heat in gives what?', 'thermal efficiency'],
        ['A process at constant volume is called what?', 'isochoric']
      ]
    }
  ]
};
