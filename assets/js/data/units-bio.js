/* Human biology and cell biology, at the grain a syllabus is taught in.

   The existing biology units cover a first pass — one unit for circulation,
   one for the nervous system. That is the right grain for Grade 6 and far too
   coarse from Grade 9 up, where a term is spent on respiration alone and a
   student is expected to know the Krebs cycle by name, its location, and what
   goes in and out of it. These are the second-pass units: each is a fortnight
   of lessons, not a topic heading.

   Level ranges are where the unit is normally introduced through where it is
   last examined. Glycolysis is not a Grade 6 idea and is not offered there. */

export const BIO_UNITS = {
  biology: [
    {
      name: 'Cellular Respiration and the Krebs Cycle', from: 'Grade 9', to: 'College',
      figures: ['animal-cell'],
      facts: [
        ['glycolysis', 'the splitting of glucose into two pyruvate molecules in the cytoplasm'],
        ['the link reaction', 'the step converting pyruvate to acetyl-CoA, releasing carbon dioxide'],
        ['the Krebs cycle', 'the cycle of reactions in the mitochondrial matrix that releases carbon dioxide and reduced coenzymes'],
        ['oxidative phosphorylation', 'the stage where the electron transport chain and ATP synthase make most of the ATP'],
        ['ATP', 'the molecule cells use to move energy from where it is released to where it is needed'],
        ['ADP', 'the molecule left when ATP loses a phosphate group'],
        ['NAD', 'the coenzyme reduced during glycolysis and the Krebs cycle'],
        ['FAD', 'the coenzyme reduced once per turn of the Krebs cycle'],
        ['acetyl-CoA', 'the two-carbon molecule that enters the Krebs cycle'],
        ['citrate', 'the six-carbon molecule formed when acetyl-CoA joins oxaloacetate'],
        ['oxaloacetate', 'the four-carbon molecule regenerated at the end of each Krebs turn'],
        ['pyruvate', 'the three-carbon product of glycolysis'],
        ['the electron transport chain', 'the series of carriers in the inner mitochondrial membrane that pass electrons to oxygen'],
        ['ATP synthase', 'the enzyme that makes ATP as protons flow back through it'],
        ['the proton gradient', 'the difference in hydrogen ion concentration across the inner membrane that drives ATP synthase'],
        ['chemiosmosis', 'ATP synthesis driven by protons moving down their gradient'],
        ['the mitochondrial matrix', 'the fluid inside the inner membrane, where the Krebs cycle happens'],
        ['the cristae', 'the folds of the inner membrane that increase the area for the electron transport chain'],
        ['anaerobic respiration', 'respiration without oxygen, giving far less ATP per glucose'],
        ['lactate', 'the product of anaerobic respiration in human muscle'],
        ['ethanol', 'the product, with carbon dioxide, of anaerobic respiration in yeast'],
        ['oxygen debt', 'the extra oxygen needed after exercise to deal with accumulated lactate'],
        ['the final electron acceptor', 'oxygen, which combines with electrons and protons to form water'],
        ['decarboxylation', 'the removal of a carbon atom as carbon dioxide']
      ],
      truths: [
        'Glycolysis happens in the cytoplasm and does not require oxygen.',
        'The Krebs cycle takes place in the mitochondrial matrix.',
        'Most of the ATP from respiration is made during oxidative phosphorylation, not during glycolysis.',
        'Oxygen is the final electron acceptor at the end of the electron transport chain.',
        'Anaerobic respiration in human muscle produces lactate, not ethanol.',
        'Each turn of the Krebs cycle releases two molecules of carbon dioxide.',
        'The cristae increase the surface area available for the electron transport chain.',
        'ATP synthase is driven by protons moving down a concentration gradient.'
      ],
      myths: [
        'The Krebs cycle takes place in the cytoplasm.',
        'Glycolysis requires oxygen to proceed.',
        'Most of the ATP from respiration is produced during the Krebs cycle itself.',
        'Anaerobic respiration in human muscle produces ethanol and carbon dioxide.',
        'Carbon dioxide is the final electron acceptor in aerobic respiration.',
        'ATP is stored in large quantities in the cell, like a battery.',
        'The Krebs cycle produces no carbon dioxide.',
        'Mitochondria make glucose.'
      ],
      sequences: [
        ['The stages of aerobic respiration, in order', [
          'Glycolysis splits glucose into two pyruvate molecules in the cytoplasm',
          'Pyruvate enters the mitochondrion and the link reaction forms acetyl-CoA',
          'The Krebs cycle releases carbon dioxide and reduces NAD and FAD',
          'Electrons pass along the electron transport chain, pumping protons',
          'ATP synthase makes ATP as protons flow back into the matrix',
          'Oxygen accepts the electrons and protons, forming water'
        ]],
        ['One turn of the Krebs cycle', [
          'Acetyl-CoA joins oxaloacetate to form citrate',
          'Citrate is decarboxylated and oxidised, reducing NAD',
          'A second decarboxylation releases the other carbon dioxide',
          'FAD is reduced as the four-carbon molecule is rearranged',
          'Oxaloacetate is regenerated, ready for the next acetyl-CoA'
        ]]
      ],
      applications: [
        ['A cell is treated with a poison that blocks the electron transport chain. Which process stops first?', 'oxidative phosphorylation'],
        ['A sprinter’s muscles are working faster than oxygen can be delivered. Which product builds up?', 'lactate'],
        ['Yeast in a sealed vessel produces gas and alcohol. Which process is happening?', 'anaerobic respiration'],
        ['A cell type with unusually dense folded inner membranes is examined. Which structure is unusually developed?', 'the cristae'],
        ['A researcher measures carbon dioxide released inside the mitochondrial matrix. Which stage is she measuring?', 'the Krebs cycle'],
        ['Glucose is labelled with a radioactive carbon and the label appears in pyruvate within seconds. Which stage acted first?', 'glycolysis']
      ]
    },

    {
      name: 'Enzymes and Metabolism', from: 'Grade 8', to: 'College',
      facts: [
        ['enzyme', 'a protein that speeds up a reaction without being used up'],
        ['substrate', 'the molecule an enzyme acts on'],
        ['active site', 'the part of the enzyme the substrate binds to'],
        ['product', 'the molecule an enzyme reaction produces'],
        ['catalyst', 'a substance that lowers the activation energy of a reaction'],
        ['activation energy', 'the energy needed to start a reaction'],
        ['denaturation', 'the permanent change in an enzyme’s shape that stops it working'],
        ['the optimum temperature', 'the temperature at which an enzyme works fastest'],
        ['the optimum pH', 'the acidity at which an enzyme works fastest'],
        ['the induced fit model', 'the idea that the active site moulds slightly around the substrate'],
        ['the lock and key model', 'the simpler idea that the substrate fits an unchanging active site'],
        ['a competitive inhibitor', 'a molecule that blocks the active site by resembling the substrate'],
        ['a non-competitive inhibitor', 'a molecule that binds elsewhere and changes the active site’s shape'],
        ['amylase', 'the enzyme that breaks starch into maltose'],
        ['protease', 'the enzyme that breaks protein into amino acids'],
        ['lipase', 'the enzyme that breaks lipids into fatty acids and glycerol'],
        ['catalase', 'the enzyme that breaks hydrogen peroxide into water and oxygen'],
        ['specificity', 'the property that one enzyme acts on one substrate'],
        ['metabolism', 'all the chemical reactions taking place in an organism'],
        ['anabolic', 'describing reactions that build larger molecules from smaller ones'],
        ['catabolic', 'describing reactions that break larger molecules into smaller ones'],
        ['a cofactor', 'a non-protein helper an enzyme needs to work']
      ],
      truths: [
        'An enzyme is not used up in the reaction it catalyses.',
        'Denaturation is permanent: cooling a denatured enzyme does not restore its activity.',
        'Enzymes lower the activation energy rather than supplying energy to the reaction.',
        'A competitive inhibitor’s effect can be reduced by adding more substrate.',
        'Each enzyme works on one substrate or a small family of similar ones.',
        'Stomach protease works best at a pH of about 2, which would denature most other enzymes.'
      ],
      myths: [
        'Enzymes are used up in the reactions they catalyse.',
        'An enzyme that has been denatured will work again once it cools down.',
        'Enzymes supply the energy that makes a reaction happen.',
        'Raising the temperature always increases the rate of an enzyme reaction.',
        'One enzyme can break down any molecule it meets.',
        'Enzymes are made of carbohydrate.'
      ],
      applications: [
        ['A reaction slows to nothing after the mixture is boiled and does not recover on cooling. What has happened to the enzyme?', 'denaturation'],
        ['Adding more substrate restores the rate of an inhibited reaction. What kind of inhibitor is present?', 'a competitive inhibitor'],
        ['A washing powder removes egg stains but not butter. Which enzyme is missing?', 'lipase'],
        ['Liver added to hydrogen peroxide fizzes vigorously. Which enzyme is responsible?', 'catalase'],
        ['A reaction speeds up as the temperature rises to 40°C, then falls away sharply. What is happening above 40°C?', 'denaturation']
      ]
    },

    {
      name: 'DNA, Genes and Protein Synthesis', from: 'Grade 9', to: 'College',
      figures: ['dna'],
      facts: [
        ['DNA', 'the molecule carrying the genetic code, made of two strands in a double helix'],
        ['a gene', 'a length of DNA coding for one polypeptide'],
        ['a chromosome', 'a long DNA molecule wound around proteins'],
        ['a nucleotide', 'the unit of DNA: a sugar, a phosphate and a base'],
        ['a base pair', 'two bases held together across the helix by hydrogen bonds'],
        ['complementary base pairing', 'the rule that A pairs with T and C pairs with G'],
        ['transcription', 'copying a gene into messenger RNA in the nucleus'],
        ['translation', 'building a polypeptide from mRNA at a ribosome'],
        ['mRNA', 'the copy of a gene that carries the code out of the nucleus'],
        ['tRNA', 'the molecule that brings a specific amino acid to the ribosome'],
        ['a codon', 'three bases of mRNA coding for one amino acid'],
        ['an anticodon', 'the three bases of tRNA that pair with a codon'],
        ['the genetic code', 'the correspondence between codons and amino acids'],
        ['a polypeptide', 'a chain of amino acids joined by peptide bonds'],
        ['an amino acid', 'the unit a protein is built from'],
        ['a mutation', 'a change in the base sequence of DNA'],
        ['a substitution', 'a mutation replacing one base with another'],
        ['an insertion', 'a mutation adding a base and shifting every codon after it'],
        ['the double helix', 'the twisted-ladder shape of DNA'],
        ['a ribosome', 'the structure where translation takes place'],
        ['RNA polymerase', 'the enzyme that builds mRNA during transcription'],
        ['the template strand', 'the DNA strand copied during transcription']
      ],
      truths: [
        'Adenine pairs with thymine, and cytosine pairs with guanine.',
        'Transcription happens in the nucleus; translation happens at a ribosome.',
        'A codon is three bases long, so 64 codons code for 20 amino acids.',
        'An insertion shifts every codon after it, usually with a larger effect than a substitution.',
        'RNA contains uracil where DNA contains thymine.',
        'The genetic code is degenerate: several codons can code for the same amino acid.'
      ],
      myths: [
        'Adenine pairs with guanine in DNA.',
        'Translation takes place inside the nucleus.',
        'One gene codes for one chromosome.',
        'Every mutation changes the protein that a gene codes for.',
        'RNA is double-stranded like DNA.',
        'A codon is two bases long.'
      ],
      sequences: [
        ['Making a protein from a gene', [
          'RNA polymerase binds to the gene and unwinds the DNA',
          'mRNA is built against the template strand by complementary base pairing',
          'The mRNA leaves the nucleus through a pore',
          'The mRNA binds to a ribosome',
          'tRNA molecules bring amino acids matching each codon',
          'Peptide bonds join the amino acids into a polypeptide'
        ]]
      ],
      applications: [
        ['A single base is swapped and the protein is unchanged. Which property of the genetic code explains this?', 'the genetic code'],
        ['A base is added near the start of a gene and the protein is completely different. What kind of mutation is this?', 'an insertion'],
        ['A molecule carrying three unpaired bases delivers an amino acid to a ribosome. What is it?', 'tRNA'],
        ['A drug stops mRNA being built. Which enzyme has it blocked?', 'RNA polymerase'],
        ['A strand reads TACGGA. What does the corresponding mRNA read?', 'transcription']
      ]
    },

    {
      name: 'Homeostasis and Body Control', from: 'Grade 9', to: 'College',
      facts: [
        ['homeostasis', 'keeping internal conditions steady despite changes outside'],
        ['negative feedback', 'a response that reverses a change and restores the set point'],
        ['positive feedback', 'a response that amplifies a change rather than reversing it'],
        ['the set point', 'the value a control system works to maintain'],
        ['a receptor', 'a cell or organ that detects a change'],
        ['an effector', 'a muscle or gland that carries out the response'],
        ['the hypothalamus', 'the brain region monitoring blood temperature and water content'],
        ['thermoregulation', 'keeping body temperature within a narrow range'],
        ['vasodilation', 'the widening of skin blood vessels, increasing heat loss'],
        ['vasoconstriction', 'the narrowing of skin blood vessels, reducing heat loss'],
        ['shivering', 'rapid muscle contraction that releases heat'],
        ['insulin', 'the hormone that lowers blood glucose by promoting uptake and storage'],
        ['glucagon', 'the hormone that raises blood glucose by releasing it from glycogen'],
        ['glycogen', 'the storage carbohydrate of the liver and muscle'],
        ['the pancreas', 'the organ that monitors blood glucose and releases insulin and glucagon'],
        ['type 1 diabetes', 'the condition where the pancreas cannot produce enough insulin'],
        ['type 2 diabetes', 'the condition where cells stop responding properly to insulin'],
        ['ADH', 'the hormone that makes the kidney reabsorb more water'],
        ['osmoregulation', 'controlling the water content of the blood'],
        ['the nephron', 'the filtering unit of the kidney'],
        ['ultrafiltration', 'the pressure filtering of small molecules out of the blood in the kidney'],
        ['selective reabsorption', 'taking useful molecules back into the blood from the filtrate'],
        ['urea', 'the waste made in the liver from excess amino acids']
      ],
      truths: [
        'Most homeostatic control in the body works by negative feedback.',
        'Vasodilation increases heat loss from the skin; vasoconstriction reduces it.',
        'Insulin lowers blood glucose and glucagon raises it.',
        'ADH makes the kidney reabsorb more water, producing smaller volumes of more concentrated urine.',
        'Urea is made in the liver and removed by the kidneys.',
        'Type 1 diabetes is treated with insulin because the pancreas cannot make enough.'
      ],
      myths: [
        'Blood vessels in the skin move up and down to control heat loss.',
        'Insulin raises blood glucose.',
        'Urea is made in the kidneys.',
        'Homeostasis keeps conditions exactly constant rather than within a range.',
        'Sweating cools you because the sweat itself is cold.',
        'Type 2 diabetes is caused by the pancreas being unable to make any insulin.'
      ],
      sequences: [
        ['The response to a rise in blood glucose', [
          'The pancreas detects the rise in blood glucose',
          'The pancreas releases insulin into the blood',
          'Liver and muscle cells take up glucose from the blood',
          'Glucose is converted to glycogen for storage',
          'Blood glucose falls back towards the set point'
        ]],
        ['Cooling down when body temperature rises', [
          'The hypothalamus detects the rise in blood temperature',
          'Sweat glands release more sweat onto the skin',
          'Skin blood vessels dilate, bringing more blood to the surface',
          'Heat is lost by evaporation and radiation',
          'Body temperature returns to about 37°C'
        ]]
      ],
      applications: [
        ['A person drinks two litres of water quickly. Which hormone falls?', 'ADH'],
        ['After a large meal, glucose is moved out of the blood into the liver. Which hormone caused this?', 'insulin'],
        ['Someone stands in the cold and their skin goes pale. What has happened to the skin blood vessels?', 'vasoconstriction'],
        ['A patient produces large volumes of dilute urine even when dehydrated. Which hormone is likely lacking?', 'ADH'],
        ['Glucose appears in the urine of a patient. Which process has been overwhelmed?', 'selective reabsorption']
      ]
    },

    {
      name: 'The Immune System and Disease', from: 'Grade 8', to: 'College',
      facts: [
        ['a pathogen', 'a microorganism that causes disease'],
        ['a bacterium', 'a single-celled organism with no nucleus, which can cause disease by releasing toxins'],
        ['a virus', 'a non-living particle that reproduces inside host cells and destroys them'],
        ['an antigen', 'a molecule on a pathogen’s surface that the immune system recognises'],
        ['an antibody', 'a protein made by lymphocytes that binds to a specific antigen'],
        ['a lymphocyte', 'the white blood cell that makes antibodies'],
        ['a phagocyte', 'the white blood cell that engulfs and digests pathogens'],
        ['phagocytosis', 'engulfing and digesting a pathogen'],
        ['immunity', 'the ability to respond quickly to a pathogen met before'],
        ['a memory cell', 'the long-lived lymphocyte that allows a fast second response'],
        ['a vaccine', 'a preparation of dead or weakened pathogen that triggers immunity safely'],
        ['herd immunity', 'the protection of the unvaccinated when enough of a population is immune'],
        ['an antibiotic', 'a medicine that kills bacteria but has no effect on viruses'],
        ['antibiotic resistance', 'the survival and spread of bacteria that antibiotics no longer kill'],
        ['a non-specific defence', 'a barrier or response that acts against any pathogen'],
        ['the skin', 'the body’s largest physical barrier to infection'],
        ['stomach acid', 'the non-specific defence that kills most swallowed pathogens'],
        ['cilia and mucus', 'the airway defence that traps pathogens and sweeps them out'],
        ['a communicable disease', 'a disease that can be passed from one person to another'],
        ['a non-communicable disease', 'a disease that cannot be spread between people'],
        ['an epidemic', 'a sharp rise in cases of a disease in one area'],
        ['a pandemic', 'an epidemic that has spread across several countries']
      ],
      truths: [
        'Antibiotics kill bacteria and have no effect on viruses.',
        'A vaccine works by triggering the production of memory cells without causing the disease.',
        'Antibodies are specific: one antibody binds one antigen.',
        'Antibiotic resistance spreads because resistant bacteria survive and reproduce.',
        'Skin, stomach acid, and cilia and mucus act against any pathogen, not a particular one.',
        'The second response to a pathogen is faster and larger than the first.'
      ],
      myths: [
        'Antibiotics are an effective treatment for influenza.',
        'A vaccine gives you a mild version of the disease every time.',
        'Bacteria become resistant because individual bacteria decide to change.',
        'Antibodies attack any pathogen they meet.',
        'Viruses can be killed with antibiotics if the dose is high enough.',
        'All diseases can be passed from person to person.'
      ],
      sequences: [
        ['The immune response to a new pathogen', [
          'The pathogen enters the body and its antigens are detected',
          'Phagocytes engulf some pathogens and display their antigens',
          'Lymphocytes with the matching receptor divide rapidly',
          'Antibodies are produced and bind to the pathogen’s antigens',
          'The pathogen is destroyed and memory cells remain'
        ]]
      ],
      applications: [
        ['A patient with a viral infection is prescribed antibiotics and does not improve. Why?', 'a virus'],
        ['Someone who has had chickenpox does not catch it again. Which cells explain this?', 'a memory cell'],
        ['A bacterial population survives repeated antibiotic courses. What has developed?', 'antibiotic resistance'],
        ['Vaccinating 95% of a school protects the few who cannot be vaccinated. What is this called?', 'herd immunity'],
        ['A cut becomes infected only after the skin is broken. Which defence had been working?', 'the skin']
      ]
    },

    {
      name: 'The Endocrine System and Hormones', from: 'Grade 9', to: 'College',
      facts: [
        ['a hormone', 'a chemical messenger carried in the blood to a target organ'],
        ['an endocrine gland', 'a gland that releases hormones directly into the blood'],
        ['a target organ', 'the organ a hormone acts on'],
        ['the pituitary gland', 'the master gland that controls several other endocrine glands'],
        ['the thyroid gland', 'the gland producing thyroxine, which sets metabolic rate'],
        ['thyroxine', 'the hormone controlling the rate of metabolism'],
        ['adrenaline', 'the hormone preparing the body for action by raising heart rate and blood glucose'],
        ['the adrenal glands', 'the glands above the kidneys that release adrenaline'],
        ['insulin', 'the pancreatic hormone that lowers blood glucose'],
        ['glucagon', 'the pancreatic hormone that raises blood glucose'],
        ['oestrogen', 'the ovarian hormone that repairs the uterus lining'],
        ['progesterone', 'the hormone that maintains the uterus lining'],
        ['testosterone', 'the testicular hormone driving sperm production'],
        ['FSH', 'the pituitary hormone causing an egg to mature'],
        ['LH', 'the pituitary hormone triggering ovulation'],
        ['ovulation', 'the release of an egg from the ovary'],
        ['the menstrual cycle', 'the roughly monthly cycle of the uterus lining and egg release'],
        ['negative feedback', 'the control loop by which a rising hormone level suppresses its own release'],
        ['a nervous response', 'a fast, short-lived response carried by electrical impulses'],
        ['a hormonal response', 'a slower, longer-lasting response carried in the blood']
      ],
      truths: [
        'Hormones travel in the blood, so they reach every part of the body but act only on target organs.',
        'Nervous responses are faster and shorter-lived than hormonal ones.',
        'FSH causes an egg to mature; LH triggers its release.',
        'Adrenaline raises heart rate, breathing rate and blood glucose together.',
        'The pituitary is called the master gland because its hormones control other glands.',
        'Thyroxine levels are controlled by negative feedback through the pituitary.'
      ],
      myths: [
        'Hormones travel along nerves to reach their target organ.',
        'Hormonal responses are faster than nervous ones.',
        'LH causes an egg to mature and FSH releases it.',
        'A hormone acts on every cell it reaches in the blood.',
        'Adrenaline is produced by the pituitary gland.',
        'The thyroid gland controls blood glucose.'
      ],
      applications: [
        ['A person’s heart rate and blood glucose rise sharply when startled. Which hormone was released?', 'adrenaline'],
        ['A patient has an unusually low metabolic rate and feels cold. Which hormone is likely low?', 'thyroxine'],
        ['A treatment triggers the release of an egg. Which hormone is being given?', 'LH'],
        ['A response takes effect within milliseconds and stops as soon as the stimulus does. What kind of response is it?', 'a nervous response'],
        ['Damage to one small gland disrupts the thyroid, adrenal and reproductive systems at once. Which gland is it?', 'the pituitary gland']
      ]
    },

    {
      name: 'Muscles, Bones and Movement', from: 'Grade 7', to: 'Grade 12',
      facts: [
        ['the skeleton', 'the framework of bones supporting the body and protecting organs'],
        ['a joint', 'a place where two bones meet'],
        ['cartilage', 'the smooth tissue covering bone ends and reducing friction'],
        ['a ligament', 'the tough tissue joining bone to bone'],
        ['a tendon', 'the strong tissue joining muscle to bone'],
        ['synovial fluid', 'the liquid lubricating a movable joint'],
        ['a hinge joint', 'a joint allowing movement in one plane, such as the elbow'],
        ['a ball and socket joint', 'a joint allowing movement in every direction, such as the hip'],
        ['an antagonistic pair', 'two muscles that pull a joint in opposite directions'],
        ['the biceps', 'the muscle that contracts to bend the elbow'],
        ['the triceps', 'the muscle that contracts to straighten the elbow'],
        ['contraction', 'the shortening of a muscle, which pulls on a bone'],
        ['flexion', 'the movement that decreases the angle at a joint'],
        ['extension', 'the movement that increases the angle at a joint'],
        ['the femur', 'the thigh bone, the longest bone in the body'],
        ['the cranium', 'the part of the skull protecting the brain'],
        ['the ribcage', 'the bones protecting the heart and lungs'],
        ['the vertebral column', 'the chain of small bones protecting the spinal cord'],
        ['bone marrow', 'the tissue inside some bones where blood cells are made'],
        ['a lever', 'a rigid bar turning about a pivot, which is how a bone works']
      ],
      truths: [
        'Muscles can only pull, which is why they work in antagonistic pairs.',
        'Tendons join muscle to bone; ligaments join bone to bone.',
        'The elbow is a hinge joint and the hip is a ball and socket joint.',
        'Contracting the biceps bends the elbow; contracting the triceps straightens it.',
        'Cartilage and synovial fluid together reduce friction at a joint.',
        'Blood cells are made in the bone marrow.'
      ],
      myths: [
        'A muscle pushes a bone back into place when it relaxes.',
        'Tendons join one bone to another.',
        'The knee is a ball and socket joint.',
        'The biceps and triceps contract at the same time to move the arm.',
        'Bones are solid all the way through.',
        'Ligaments contract to move a joint.'
      ],
      applications: [
        ['A weight is lifted by bending the elbow. Which muscle contracted?', 'the biceps'],
        ['A joint that moves freely in every direction is examined. What kind of joint is it?', 'a ball and socket joint'],
        ['A torn tissue between two bones leaves a joint unstable. What was torn?', 'a ligament'],
        ['A patient cannot make new red blood cells after damage to a bone’s interior. Which tissue is affected?', 'bone marrow'],
        ['The angle at the knee decreases as someone crouches. What movement is this?', 'flexion']
      ]
    },

    {
      name: 'Transport in Plants', from: 'Grade 7', to: 'Grade 12',
      figures: ['leaf', 'plant-cell', 'flower'],
      facts: [
        ['xylem', 'the dead, hollow tissue carrying water and minerals upwards'],
        ['phloem', 'the living tissue carrying dissolved sugars in both directions'],
        ['transpiration', 'the loss of water vapour from a leaf'],
        ['the transpiration stream', 'the flow of water from roots to leaves that transpiration drives'],
        ['translocation', 'the movement of sugars through the phloem'],
        ['a root hair cell', 'the cell with a long extension that increases surface area for absorption'],
        ['a stoma', 'a pore in the leaf surface through which gases move'],
        ['a guard cell', 'the cell that opens and closes a stoma'],
        ['turgor', 'the firmness of a plant cell when its vacuole is full of water'],
        ['plasmolysis', 'the pulling away of the membrane from the wall when a cell loses water'],
        ['a flaccid cell', 'a cell that has lost water and is no longer firm'],
        ['cohesion', 'the attraction between water molecules that holds the column together'],
        ['adhesion', 'the attraction between water and the xylem wall'],
        ['a potometer', 'the apparatus used to measure the rate of water uptake'],
        ['humidity', 'the factor that slows transpiration as it rises'],
        ['wind speed', 'the factor that speeds transpiration by removing water vapour'],
        ['lignin', 'the substance that strengthens and waterproofs xylem walls'],
        ['a sieve plate', 'the perforated end wall between phloem cells']
      ],
      truths: [
        'Xylem carries water upwards only; phloem carries sugars in either direction.',
        'Transpiration increases in warm, dry, windy conditions.',
        'Guard cells close the stomata when the plant is short of water.',
        'Xylem vessels are made of dead cells with no end walls.',
        'Root hair cells increase the surface area available for absorbing water.',
        'A potometer measures water uptake, which is close to but not the same as transpiration.'
      ],
      myths: [
        'Phloem carries water and xylem carries sugars.',
        'Transpiration slows down in windy conditions.',
        'Xylem vessels are living cells with cytoplasm.',
        'Plants take in water through their leaves.',
        'Stomata are found mostly on the upper surface of a leaf.',
        'A potometer measures transpiration directly.'
      ],
      applications: [
        ['A plant wilts on a hot day even though the soil is wet. Which process has outpaced uptake?', 'transpiration'],
        ['A ring of bark is removed and sugars accumulate above the cut. Which tissue was removed?', 'phloem'],
        ['A cell placed in strong sugar solution shrinks away from its wall. What has happened?', 'plasmolysis'],
        ['Coating the underside of a leaf in petroleum jelly slows water loss sharply. Which structures were blocked?', 'a stoma'],
        ['Water rises in a tall tree without a pump. Which property of water makes this possible?', 'cohesion']
      ]
    },

    {
      name: 'Ecology, Energy Flow and Cycles', from: 'Grade 7', to: 'College',
      facts: [
        ['a producer', 'an organism that makes its own food by photosynthesis'],
        ['a primary consumer', 'the herbivore that eats a producer'],
        ['a secondary consumer', 'the animal that eats a primary consumer'],
        ['a decomposer', 'an organism that breaks down dead material and returns nutrients'],
        ['a trophic level', 'a feeding position in a food chain'],
        ['a food web', 'the interconnected food chains of a community'],
        ['biomass', 'the dry mass of living material at a trophic level'],
        ['a pyramid of biomass', 'the diagram showing how biomass falls at each level'],
        ['a habitat', 'the place where an organism lives'],
        ['a community', 'all the populations living in one habitat'],
        ['an ecosystem', 'a community together with the non-living parts of its surroundings'],
        ['a population', 'all the individuals of one species in one place'],
        ['interdependence', 'the reliance of species in a community on one another'],
        ['a biotic factor', 'a living factor affecting an organism, such as predation'],
        ['an abiotic factor', 'a non-living factor affecting an organism, such as light'],
        ['the carbon cycle', 'the movement of carbon between the air, living things and the ground'],
        ['the nitrogen cycle', 'the movement of nitrogen between the air, soil and living things'],
        ['nitrogen fixation', 'the conversion of nitrogen gas into compounds plants can use'],
        ['a quadrat', 'the square frame used to sample the abundance of a species'],
        ['a transect', 'the line along which samples are taken to show change across a habitat'],
        ['eutrophication', 'the oxygen loss in water caused by fertiliser runoff'],
        ['a keystone species', 'a species whose removal changes the whole community']
      ],
      truths: [
        'Only about ten per cent of the energy at one trophic level reaches the next.',
        'Decomposers return nutrients to the soil that producers can use again.',
        'Energy flows through an ecosystem once; nutrients cycle round it.',
        'A quadrat estimates abundance; a transect shows how it changes across a habitat.',
        'Eutrophication kills fish by removing oxygen, not by poisoning them directly.',
        'Removing a predator can reduce the number of plant species in a community.'
      ],
      myths: [
        'Energy is recycled through an ecosystem in the same way as nutrients.',
        'Most of the energy at one trophic level passes to the next.',
        'Decomposers are consumers that hunt for food.',
        'A habitat and an ecosystem are the same thing.',
        'Fertiliser in a river kills fish by poisoning them.',
        'Food chains normally have eight or nine levels.'
      ],
      sequences: [
        ['Energy through a food chain', [
          'Light energy is captured by producers in photosynthesis',
          'Primary consumers eat producers and take in some of that energy',
          'Secondary consumers eat primary consumers',
          'Energy is lost at each level as heat, movement and waste',
          'Decomposers break down dead material and return nutrients to the soil'
        ]]
      ],
      applications: [
        ['A pond loses its fish weeks after fertiliser runs off a nearby field. What has happened?', 'eutrophication'],
        ['A researcher throws a square frame at random points on a field to count daisies. What is she using?', 'a quadrat'],
        ['Removing one starfish species causes a rocky shore community to collapse. What kind of species was it?', 'a keystone species'],
        ['Bacteria in root nodules turn nitrogen gas into compounds a pea plant can use. What is this process?', 'nitrogen fixation'],
        ['A food chain supports far fewer top predators than herbivores. Which fact explains this?', 'a trophic level']
      ]
    }
  ],

  anatomy: [
    {
      name: 'The Circulatory System in Detail', from: 'Grade 8', to: 'College',
      figures: ['heart'],
      facts: [
        ['the right atrium', 'the chamber receiving deoxygenated blood from the body'],
        ['the right ventricle', 'the chamber pumping deoxygenated blood to the lungs'],
        ['the left atrium', 'the chamber receiving oxygenated blood from the lungs'],
        ['the left ventricle', 'the chamber with the thickest wall, pumping blood around the body'],
        ['the aorta', 'the artery carrying oxygenated blood from the heart to the body'],
        ['the vena cava', 'the vein returning deoxygenated blood from the body to the heart'],
        ['the pulmonary artery', 'the vessel carrying deoxygenated blood from the heart to the lungs'],
        ['the pulmonary vein', 'the vessel carrying oxygenated blood from the lungs to the heart'],
        ['the septum', 'the wall separating the two sides of the heart'],
        ['a valve', 'the structure preventing blood flowing backwards'],
        ['the coronary arteries', 'the vessels supplying the heart muscle itself'],
        ['an artery', 'a thick-walled vessel carrying blood away from the heart at high pressure'],
        ['a vein', 'a thin-walled vessel with valves, carrying blood back to the heart'],
        ['a capillary', 'a vessel one cell thick where exchange with tissues happens'],
        ['a red blood cell', 'the biconcave cell carrying oxygen, with no nucleus'],
        ['haemoglobin', 'the protein in red blood cells that binds oxygen'],
        ['oxyhaemoglobin', 'the compound formed when haemoglobin binds oxygen'],
        ['plasma', 'the liquid part of blood, carrying dissolved substances'],
        ['a platelet', 'the fragment involved in clotting'],
        ['double circulation', 'the arrangement in which blood passes through the heart twice per circuit'],
        ['the pacemaker', 'the group of cells in the right atrium setting the heart rate'],
        ['atherosclerosis', 'the narrowing of arteries by fatty deposits']
      ],
      truths: [
        'The left ventricle has a thicker wall because it pumps blood around the whole body.',
        'The pulmonary artery is the one artery that carries deoxygenated blood.',
        'Capillaries are one cell thick, which is what allows exchange with tissues.',
        'Mammals have a double circulation: blood passes through the heart twice per circuit.',
        'Red blood cells have no nucleus, leaving more room for haemoglobin.',
        'Valves in veins prevent blood flowing backwards on its way to the heart.'
      ],
      myths: [
        'All arteries carry oxygenated blood.',
        'The right ventricle has the thickest wall.',
        'Red blood cells contain a nucleus like other body cells.',
        'Blood passes through the heart once per circuit of the body.',
        'The heart is on the far left of the chest.',
        'Veins carry blood away from the heart.'
      ],
      sequences: [
        ['Blood through the heart, starting from the body', [
          'Deoxygenated blood enters the right atrium from the vena cava',
          'It passes into the right ventricle',
          'The right ventricle pumps it along the pulmonary artery to the lungs',
          'Oxygenated blood returns to the left atrium in the pulmonary vein',
          'It passes into the left ventricle',
          'The left ventricle pumps it into the aorta and around the body'
        ]]
      ],
      applications: [
        ['A vessel carries blood at high pressure away from the heart. What is it?', 'an artery'],
        ['Fatty deposits narrow the vessels supplying the heart muscle. Which vessels are affected?', 'the coronary arteries'],
        ['A hole in the wall between the ventricles lets blood mix. Which structure is damaged?', 'the septum'],
        ['A blood sample has cells with no nucleus and a dip on each side. What are they?', 'a red blood cell'],
        ['Exchange of oxygen with a muscle happens across a vessel one cell thick. What is it?', 'a capillary']
      ]
    },

    {
      name: 'Breathing and Gas Exchange', from: 'Grade 7', to: 'College',
      figures: ['respiratory'],
      facts: [
        ['the trachea', 'the airway held open by rings of cartilage'],
        ['a bronchus', 'one of the two tubes carrying air into a lung'],
        ['a bronchiole', 'a small airway branching from a bronchus'],
        ['an alveolus', 'the tiny air sac where gas exchange happens'],
        ['the diaphragm', 'the sheet of muscle below the lungs that flattens on inhalation'],
        ['the intercostal muscles', 'the muscles between the ribs that move the ribcage'],
        ['inhalation', 'breathing in, as the chest volume increases and pressure falls'],
        ['exhalation', 'breathing out, as the chest volume decreases and pressure rises'],
        ['gas exchange', 'the diffusion of oxygen into the blood and carbon dioxide out'],
        ['diffusion', 'the net movement of particles from high to low concentration'],
        ['a concentration gradient', 'the difference in concentration that drives diffusion'],
        ['ventilation', 'the movement of air in and out of the lungs'],
        ['tidal volume', 'the volume of air moved in one ordinary breath'],
        ['surface area', 'the feature of alveoli that makes exchange rapid'],
        ['a moist lining', 'the alveolar feature allowing gases to dissolve before diffusing'],
        ['cilia', 'the hair-like structures sweeping mucus out of the airways'],
        ['mucus', 'the sticky fluid trapping dust and pathogens in the airways'],
        ['emphysema', 'the disease in which alveolar walls break down, reducing surface area'],
        ['asthma', 'the condition in which airways narrow and produce extra mucus'],
        ['the pleural membrane', 'the lining that reduces friction as the lungs move']
      ],
      truths: [
        'The diaphragm flattens and moves down during inhalation.',
        'Alveoli are adapted for exchange by a large surface area, a thin wall, a moist lining and a good blood supply.',
        'Air moves into the lungs because the pressure inside falls below atmospheric pressure.',
        'Emphysema reduces gas exchange by destroying alveolar walls and so surface area.',
        'Cilia and mucus together keep the airways clear of dust and pathogens.',
        'Gas exchange happens by diffusion, which needs no energy from the cell.'
      ],
      myths: [
        'The lungs actively suck air in using their own muscles.',
        'The diaphragm moves upwards when you breathe in.',
        'Gas exchange takes place in the bronchi.',
        'Oxygen is pumped into the blood using energy.',
        'Alveoli are dry inside.',
        'Asthma is caused by the alveoli collapsing.'
      ],
      sequences: [
        ['What happens when you breathe in', [
          'The diaphragm contracts and flattens',
          'The intercostal muscles pull the ribcage up and out',
          'The volume of the chest increases',
          'The pressure inside the lungs falls below atmospheric pressure',
          'Air flows down the trachea into the lungs'
        ]]
      ],
      applications: [
        ['A smoker loses alveolar walls and becomes breathless. Which feature has been reduced?', 'surface area'],
        ['Air rushes into the lungs without the lungs doing any pulling. What caused the flow?', 'a concentration gradient'],
        ['Damaged cilia leave mucus sitting in the airways. Which defence has failed?', 'cilia'],
        ['A muscle sheet below the lungs contracts and moves down. What is it?', 'the diaphragm'],
        ['Oxygen moves from the alveolus into the blood with no energy used. What is the process?', 'diffusion']
      ]
    },

    {
      name: 'The Nervous System and Reflexes', from: 'Grade 8', to: 'College',
      figures: ['neuron'],
      facts: [
        ['a neuron', 'a cell that carries electrical impulses'],
        ['a sensory neuron', 'the neuron carrying impulses from a receptor to the central nervous system'],
        ['a motor neuron', 'the neuron carrying impulses from the central nervous system to an effector'],
        ['a relay neuron', 'the neuron connecting sensory and motor neurons inside the spinal cord'],
        ['the central nervous system', 'the brain and spinal cord'],
        ['a receptor', 'the cell that detects a stimulus'],
        ['an effector', 'the muscle or gland that carries out a response'],
        ['a synapse', 'the gap between two neurons'],
        ['a neurotransmitter', 'the chemical that carries a signal across a synapse'],
        ['a reflex arc', 'the pathway of a response that does not involve conscious thought'],
        ['a reflex action', 'a fast, automatic response that protects the body'],
        ['the axon', 'the long fibre carrying an impulse away from the cell body'],
        ['a dendrite', 'the branch carrying impulses towards the cell body'],
        ['the myelin sheath', 'the fatty layer that speeds an impulse along an axon'],
        ['the cerebrum', 'the brain region responsible for thought, memory and language'],
        ['the cerebellum', 'the brain region coordinating balance and fine movement'],
        ['the medulla', 'the brain region controlling heart rate and breathing'],
        ['the spinal cord', 'the nerve column carrying impulses to and from the brain'],
        ['reaction time', 'the delay between a stimulus and a response'],
        ['a stimulus', 'a change in the environment that a receptor detects']
      ],
      truths: [
        'A reflex action does not involve the conscious parts of the brain, which is why it is fast.',
        'A signal crosses a synapse chemically, not electrically.',
        'The myelin sheath speeds an impulse along the axon.',
        'Relay neurons sit inside the spinal cord and connect sensory to motor neurons.',
        'The cerebellum coordinates balance and fine movement.',
        'A reflex arc runs receptor, sensory neuron, relay neuron, motor neuron, effector.'
      ],
      myths: [
        'A reflex action is controlled by the cerebrum.',
        'An impulse jumps the synapse as an electrical spark.',
        'The myelin sheath slows impulses down.',
        'Motor neurons carry impulses from receptors to the brain.',
        'The medulla controls memory and language.',
        'Nerves are hollow tubes carrying fluid.'
      ],
      sequences: [
        ['A reflex arc, from stimulus to response', [
          'A receptor detects the stimulus',
          'A sensory neuron carries the impulse to the spinal cord',
          'A relay neuron passes the impulse across',
          'A motor neuron carries the impulse to the effector',
          'The effector contracts, producing the response'
        ]]
      ],
      applications: [
        ['A hand pulls away from a hot plate before the pain is felt. What kind of action is this?', 'a reflex action'],
        ['Damage to the base of the brain disrupts heart rate and breathing. Which region is affected?', 'the medulla'],
        ['An impulse slows dramatically when a fatty layer breaks down. Which structure is damaged?', 'the myelin sheath'],
        ['A chemical is released into a gap between two nerve cells. What is it?', 'a neurotransmitter'],
        ['A patient can think and speak normally but has lost their balance. Which region is affected?', 'the cerebellum']
      ]
    },

    {
      name: 'The Kidneys and Excretion', from: 'Grade 9', to: 'College',
      facts: [
        ['excretion', 'the removal of the waste products of metabolism'],
        ['the kidney', 'the organ that filters the blood and makes urine'],
        ['the nephron', 'the filtering unit of the kidney'],
        ['the glomerulus', 'the knot of capillaries where blood is filtered under pressure'],
        ['ultrafiltration', 'the filtering of small molecules out of the blood by pressure'],
        ['selective reabsorption', 'the return of useful molecules from the filtrate to the blood'],
        ['the loop of Henle', 'the part of the nephron that concentrates the urine'],
        ['urea', 'the nitrogenous waste made in the liver from excess amino acids'],
        ['deamination', 'the removal of the amino group from an amino acid in the liver'],
        ['the ureter', 'the tube carrying urine from a kidney to the bladder'],
        ['the bladder', 'the organ storing urine before it is released'],
        ['the urethra', 'the tube through which urine leaves the body'],
        ['ADH', 'the hormone increasing water reabsorption in the kidney'],
        ['osmoregulation', 'the control of the water content of the blood'],
        ['dialysis', 'the treatment that filters blood artificially when the kidneys fail'],
        ['a partially permeable membrane', 'the barrier used in dialysis, letting small molecules through'],
        ['a transplant', 'the treatment replacing a failed kidney with a donor organ'],
        ['rejection', 'the immune attack on transplanted tissue recognised as foreign'],
        ['glucose', 'the molecule normally reabsorbed completely from the filtrate'],
        ['protein', 'the molecule too large to be filtered out of the blood']
      ],
      truths: [
        'Ultrafiltration removes small molecules; proteins and blood cells are too large to pass.',
        'Glucose is normally reabsorbed completely, so healthy urine contains none.',
        'Urea is made in the liver and removed by the kidneys.',
        'ADH increases water reabsorption, making urine more concentrated.',
        'Dialysis fluid contains the same glucose and ion concentrations as healthy blood, so those are not lost.',
        'A transplant risks rejection because the immune system recognises the donor tissue as foreign.'
      ],
      myths: [
        'The kidneys make urea.',
        'Protein is filtered out of the blood in the glomerulus and reabsorbed later.',
        'Healthy urine contains a small amount of glucose.',
        'ADH makes the kidney produce more urine.',
        'Dialysis cures kidney failure permanently.',
        'The bladder filters the blood.'
      ],
      sequences: [
        ['Making urine in a nephron', [
          'Blood enters the glomerulus at high pressure',
          'Small molecules are forced out into the capsule by ultrafiltration',
          'Glucose and some ions are selectively reabsorbed into the blood',
          'The loop of Henle concentrates the remaining filtrate',
          'ADH sets how much more water is reabsorbed',
          'Urine passes down the ureter to the bladder'
        ]]
      ],
      applications: [
        ['Protein appears in a patient’s urine. Which structure is likely damaged?', 'the glomerulus'],
        ['A patient produces very concentrated urine after a day without water. Which hormone rose?', 'ADH'],
        ['Blood is passed across a partially permeable membrane against a fluid matching healthy plasma. What treatment is this?', 'dialysis'],
        ['Excess amino acids are broken down and the amino group removed. What is this process?', 'deamination'],
        ['A transplanted kidney fails weeks later as the immune system attacks it. What has happened?', 'rejection']
      ]
    }
  ]
};
