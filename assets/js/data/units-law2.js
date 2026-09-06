/* Law, years three and four: property, equity, and the specialist subjects.

   Land law and equity are the second-year subjects students find hardest,
   and for a reason worth naming: both turn on distinctions that sound like
   synonyms until you can state them — legal and equitable interests, a
   fixture and a chattel, a trust and a gift. The term banks are built round
   exactly those pairs.

   The final-year subjects here are the ones a qualifying degree covers plus
   the electives most syllabuses offer, ending with professional ethics,
   which is examined everywhere and revised by nobody. */

export const LAW2_UNITS = {
  /* ============================ property law ============================ */
  'property-law': [
    {
      name: 'Estates, Interests and Registered Land', from: 'College', to: 'Advanced',
      facts: [
        ['real property', 'land and things attached to it'],
        ['personal property', 'everything else that can be owned'],
        ['an estate in land', 'a right to possess land for a period'],
        ['a freehold', 'an estate of effectively unlimited duration'],
        ['a fee simple absolute in possession', 'the technical name for a freehold'],
        ['a leasehold', 'an estate for a fixed or periodic term'],
        ['a term of years absolute', 'the technical name for a lease'],
        ['a legal interest', 'a right in land binding the world'],
        ['an equitable interest', 'a right recognised in equity, binding a purchaser with notice'],
        ['an easement', 'a right over another’s land, such as a right of way'],
        ['Re Ellenborough Park', 'the case setting the requirements of an easement'],
        ['a restrictive covenant', 'a promise restricting the use of land'],
        ['a mortgage', 'a security interest in land for a debt'],
        ['a fixture', 'an object attached to land, which passes with it'],
        ['a chattel', 'an object resting on land by its own weight, which does not'],
        ['registered land', 'land whose title is recorded at the Land Registry'],
        ['the register', 'the record of title, in three parts'],
        ['an overriding interest', 'a right binding a purchaser despite not appearing on the register'],
        ['actual occupation', 'the commonest basis of an overriding interest'],
        ['a notice', 'an entry protecting a third-party interest on the register']
      ],
      truths: [
        'Only two estates in land can exist at law: the freehold and the leasehold.',
        'Whether an object is a fixture turns on the degree and purpose of annexation.',
        'An overriding interest binds a purchaser even though it is not on the register.',
        'Actual occupation must be obvious on a reasonably careful inspection to override.',
        'An easement requires a dominant and a servient tenement in different ownership.'
      ],
      myths: [
        'Registration of title makes the register a complete picture of every right.',
        'Anything physically attached to a house is automatically a fixture.',
        'An equitable interest is worth less than a legal one in every situation.',
        'A right of way can exist without any land benefiting from it.',
        'A freehold owner owns the land absolutely, without limitation.'
      ],
      applications: [
        ['Which two estates can exist at law?', 'freehold and leasehold'],
        ['A right of way over a neighbour’s land is what?', 'an easement'],
        ['Which case sets the requirements of an easement?', 'Re Ellenborough Park'],
        ['A right binding a purchaser without appearing on the register is called what?', 'an overriding interest'],
        ['An object resting by its own weight is a fixture or a chattel?', 'a chattel']
      ]
    },
    {
      name: 'Leases, Co-ownership and Adverse Possession', from: 'College', to: 'Advanced',
      facts: [
        ['a lease', 'exclusive possession for a certain term at a rent'],
        ['a licence', 'permission to be on land, conferring no estate'],
        ['exclusive possession', 'the hallmark distinguishing a lease from a licence'],
        ['Street v Mountford', 'the case holding substance prevails over the label used'],
        ['a periodic tenancy', 'a lease running from period to period until ended'],
        ['a covenant', 'a promise in a lease binding landlord or tenant'],
        ['forfeiture', 'the landlord’s right to end the lease for breach'],
        ['a joint tenancy', 'co-ownership with the right of survivorship'],
        ['a tenancy in common', 'co-ownership in distinct shares, with no survivorship'],
        ['the right of survivorship', 'that a joint tenant’s share passes to the survivors'],
        ['the four unities', 'possession, interest, title and time'],
        ['severance', 'converting a joint tenancy into a tenancy in common'],
        ['a trust of land', 'the mechanism through which co-ownership operates'],
        ['a beneficial interest', 'the share a co-owner actually holds'],
        ['a constructive trust', 'one imposed to reflect a common intention and reliance'],
        ['Stack v Dowden', 'the leading case on beneficial shares in a family home'],
        ['adverse possession', 'acquiring title by possessing land without permission'],
        ['factual possession', 'a sufficient degree of physical control'],
        ['an intention to possess', 'the mental element of adverse possession'],
        ['the ten-year rule', 'the registered-land period after which an application may be made']
      ],
      truths: [
        'Exclusive possession, not the label the parties used, determines whether there is a lease.',
        'The right of survivorship means a joint tenant cannot leave their share by will.',
        'A joint tenancy requires all four unities; a tenancy in common requires only possession.',
        'Adverse possession needs factual possession and an intention to possess.',
        'Since 2002 a squatter of registered land applies after ten years and the owner may object.'
      ],
      myths: [
        'Calling an agreement a licence prevents it being a lease.',
        'A joint tenant can leave their share to their children by will.',
        'Adverse possession requires the squatter to believe they own the land.',
        'Paying rent always means there is a lease.',
        'Twelve years of occupation automatically gives title to registered land.'
      ],
      applications: [
        ['Which case held substance prevails over the label?', 'Street v Mountford'],
        ['Which form of co-ownership carries the right of survivorship?', 'a joint tenancy'],
        ['What are the four unities?', 'possession, interest, title and time'],
        ['Converting a joint tenancy to a tenancy in common is called what?', 'severance'],
        ['Which case is leading on beneficial shares in a family home?', 'Stack v Dowden']
      ]
    }
  ],
  /* =============================== equity =============================== */
  equity: [
    {
      name: 'The Three Certainties and Express Trusts', from: 'College', to: 'Advanced',
      facts: [
        ['equity', 'the body of principles developed to mitigate the rigour of common law'],
        ['a trust', 'an obligation binding a trustee to hold property for a beneficiary'],
        ['a settlor', 'the person who creates the trust'],
        ['a trustee', 'the person who holds the legal title'],
        ['a beneficiary', 'the person entitled in equity'],
        ['legal title', 'ownership recognised at common law'],
        ['equitable title', 'the beneficial interest recognised in equity'],
        ['the three certainties', 'intention, subject matter and objects'],
        ['certainty of intention', 'that the settlor meant to impose a trust obligation'],
        ['certainty of subject matter', 'that the trust property is identifiable'],
        ['certainty of objects', 'that the beneficiaries can be ascertained'],
        ['Knight v Knight', 'the case setting out the three certainties'],
        ['precatory words', 'words of hope or wish, insufficient to create a trust'],
        ['a fixed trust', 'one where the shares are specified'],
        ['a discretionary trust', 'one where trustees choose among a class'],
        ['the complete list test', 'the objects test for a fixed trust'],
        ['the is or is not test', 'the objects test for a discretionary trust'],
        ['McPhail v Doulton', 'the case establishing the is or is not test'],
        ['the beneficiary principle', 'that a trust must have someone who can enforce it'],
        ['a purpose trust', 'one for an object rather than a person, generally void']
      ],
      truths: [
        'All three certainties must be present or the trust fails.',
        'Precatory words express a wish and do not create a trust.',
        'A fixed trust needs a complete list of beneficiaries; a discretionary trust does not.',
        'A trust must generally have a beneficiary who can enforce it.',
        'The settlor may also be a trustee, or a beneficiary, or both.'
      ],
      myths: [
        'Using the word "trust" is what creates a trust.',
        'A discretionary trust fails unless every beneficiary can be listed.',
        'A trustee owns the property and may do as they like with it.',
        'Equity and common law are separate court systems today.',
        'A trust for a purpose is as valid as a trust for a person.'
      ],
      applications: [
        ['What are the three certainties?', 'intention, subject matter and objects'],
        ['Which case sets out the three certainties?', 'Knight v Knight'],
        ['Words of hope rather than obligation are called what?', 'precatory words'],
        ['Which objects test applies to a discretionary trust?', 'the is or is not test'],
        ['Which case established that test?', 'McPhail v Doulton']
      ]
    },
    {
      name: 'Resulting and Constructive Trusts, and Fiduciary Duties', from: 'College', to: 'Advanced',
      facts: [
        ['a resulting trust', 'one arising where the beneficial interest returns to the provider'],
        ['a presumed resulting trust', 'arising from a contribution to the purchase price'],
        ['an automatic resulting trust', 'arising where an express trust fails'],
        ['the presumption of advancement', 'that a transfer to a child or spouse was a gift'],
        ['a constructive trust', 'one imposed by law regardless of intention'],
        ['a common intention constructive trust', 'imposed on the family home'],
        ['detrimental reliance', 'acting to one’s detriment on a shared understanding'],
        ['proprietary estoppel', 'an equitable claim from assurance, reliance and detriment'],
        ['a fiduciary', 'someone in a position of trust and confidence'],
        ['the no conflict rule', 'that a fiduciary must not put interest above duty'],
        ['the no profit rule', 'that a fiduciary must not profit from the position'],
        ['Boardman v Phipps', 'the case on unauthorised profit by a fiduciary'],
        ['Keech v Sandford', 'the case on a trustee renewing a lease for himself'],
        ['an account of profits', 'the remedy stripping a fiduciary of a gain'],
        ['a breach of trust', 'a failure to observe the terms or duties of a trust'],
        ['tracing', 'the process of identifying property in another form'],
        ['a mixed fund', 'one containing both trust and other money'],
        ['knowing receipt', 'liability for receiving trust property with knowledge'],
        ['dishonest assistance', 'liability for helping a breach dishonestly'],
        ['Royal Brunei v Tan', 'the case setting the standard of dishonesty']
      ],
      truths: [
        'A constructive trust is imposed by law, whatever the parties intended.',
        'The no profit rule applies even where the fiduciary acted in good faith and the trust gained.',
        'Proprietary estoppel requires assurance, reliance and detriment.',
        'Tracing follows value into substitute property, not the original thing.',
        'Dishonest assistance is judged by an objective standard of dishonesty.'
      ],
      myths: [
        'A fiduciary who acts honestly can keep a profit made from the position.',
        'A constructive trust requires proof of what the parties agreed.',
        'Contributing to the mortgage always gives a share in the home.',
        'Tracing is a remedy rather than a process.',
        'Knowing receipt and dishonest assistance are the same claim.'
      ],
      applications: [
        ['Which case concerned a trustee renewing a lease for himself?', 'Keech v Sandford'],
        ['A trust imposed by law regardless of intention is called what?', 'a constructive trust'],
        ['What three elements does proprietary estoppel require?', 'assurance, reliance and detriment'],
        ['Which remedy strips a fiduciary of an unauthorised gain?', 'an account of profits'],
        ['Which case set the standard of dishonesty in assistance?', 'Royal Brunei v Tan']
      ]
    }
  ],
  /* ============================== EU and international ============================== */
  'eu-intl': [
    {
      name: 'Sources and Supremacy of EU Law', from: 'College', to: 'Advanced',
      facts: [
        ['the European Union', 'the union of member states with its own legal order'],
        ['a treaty', 'the primary source of EU law'],
        ['a regulation', 'EU legislation directly applicable in every member state'],
        ['a directive', 'EU legislation binding as to result, requiring implementation'],
        ['a decision', 'EU legislation binding on those to whom it is addressed'],
        ['direct applicability', 'that a measure becomes law without national action'],
        ['direct effect', 'that an individual can rely on a provision in a national court'],
        ['Van Gend en Loos', 'the case establishing direct effect'],
        ['vertical direct effect', 'enforceability against the state'],
        ['horizontal direct effect', 'enforceability against another individual'],
        ['supremacy', 'that EU law prevails over conflicting national law'],
        ['Costa v ENEL', 'the case establishing supremacy'],
        ['indirect effect', 'the duty to interpret national law consistently with a directive'],
        ['state liability', 'a member state’s liability in damages for breach of EU law'],
        ['Francovich', 'the case establishing state liability'],
        ['the preliminary reference', 'a national court’s question to the Court of Justice'],
        ['the Court of Justice', 'the EU’s highest court on questions of EU law'],
        ['subsidiarity', 'that the Union acts only where objectives are better achieved at its level'],
        ['proportionality in EU law', 'that action goes no further than necessary'],
        ['retained EU law', 'EU law preserved in United Kingdom domestic law after withdrawal']
      ],
      truths: [
        'A regulation is directly applicable; a directive requires implementation.',
        'Directives have vertical but not horizontal direct effect.',
        'Supremacy means EU law prevails over conflicting national law, including later national law.',
        'A preliminary reference asks the Court of Justice a question; it does not decide the case.',
        'The United Kingdom retained much EU law domestically on withdrawal.'
      ],
      myths: [
        'A directive can be enforced directly against a private employer.',
        'A regulation must be implemented by national legislation to take effect.',
        'The Court of Justice decides the national case on a preliminary reference.',
        'EU law ceased to have any effect in the United Kingdom on withdrawal.',
        'Direct effect and direct applicability mean the same thing.'
      ],
      applications: [
        ['Which measure is directly applicable without implementation?', 'a regulation'],
        ['Which case established direct effect?', 'Van Gend en Loos'],
        ['Directives have which kind of direct effect?', 'vertical only'],
        ['Which case established state liability in damages?', 'Francovich'],
        ['Which case established supremacy?', 'Costa v ENEL']
      ]
    },
    {
      name: 'Public International Law: Sources, States and Treaties', from: 'College', to: 'Advanced',
      facts: [
        ['public international law', 'the law governing relations between states'],
        ['Article 38', 'the provision listing the sources of international law'],
        ['a treaty', 'a binding agreement between states'],
        ['customary international law', 'law from consistent state practice accepted as obligatory'],
        ['state practice', 'what states actually do, the objective element of custom'],
        ['opinio juris', 'the belief that the practice is legally required'],
        ['a general principle of law', 'a principle common to developed legal systems'],
        ['jus cogens', 'a peremptory norm from which no derogation is permitted'],
        ['a persistent objector', 'a state that consistently rejected an emerging custom'],
        ['statehood', 'requiring population, territory, government and capacity for relations'],
        ['the Montevideo criteria', 'the classic statement of the requirements of statehood'],
        ['recognition', 'acceptance by other states, declaratory rather than constitutive'],
        ['sovereignty', 'a state’s supreme authority within its territory'],
        ['non-intervention', 'the principle against interference in internal affairs'],
        ['the United Nations Charter', 'the treaty founding the United Nations'],
        ['the Security Council', 'the organ with primary responsibility for peace and security'],
        ['the International Court of Justice', 'the principal judicial organ of the United Nations'],
        ['the Vienna Convention', 'the treaty governing the law of treaties'],
        ['pacta sunt servanda', 'that treaties in force are binding and must be performed in good faith'],
        ['a reservation', 'a statement excluding or modifying a treaty provision for that state']
      ],
      truths: [
        'Custom requires both consistent state practice and opinio juris.',
        'No state may derogate from a rule of jus cogens, whatever it agrees.',
        'The International Court of Justice has jurisdiction only where states consent.',
        'Recognition of a state is declaratory of statehood rather than constitutive of it.',
        'A reservation incompatible with a treaty’s object and purpose is impermissible.'
      ],
      myths: [
        'International law is not really law because there is no world police force.',
        'A state can be brought before the International Court of Justice without its consent.',
        'A treaty binds a state that has signed but not ratified it.',
        'State practice alone is enough to make a rule customary.',
        'Security Council resolutions are merely recommendations in every case.'
      ],
      applications: [
        ['What two elements make customary international law?', 'state practice and opinio juris'],
        ['A norm allowing no derogation is called what?', 'jus cogens'],
        ['Which convention governs the law of treaties?', 'the Vienna Convention'],
        ['Which criteria set out the requirements of statehood?', 'the Montevideo criteria'],
        ['Treaties must be performed in good faith. Which maxim?', 'pacta sunt servanda']
      ]
    }
  ],
  /* ========================== company and commercial ========================== */
  'commercial-law': [
    {
      name: 'Company Formation, Separate Personality and the Veil', from: 'College', to: 'Advanced',
      facts: [
        ['a company', 'a legal person distinct from its members'],
        ['incorporation', 'the act of forming a company'],
        ['separate legal personality', 'that a company is a person in law in its own right'],
        ['Salomon v Salomon', 'the case establishing separate legal personality'],
        ['limited liability', 'that a member’s liability is limited to any unpaid share capital'],
        ['a private limited company', 'one that cannot offer shares to the public'],
        ['a public limited company', 'one that may offer shares to the public'],
        ['the articles of association', 'the company’s internal constitution'],
        ['a shareholder', 'a member of the company owning shares'],
        ['a director', 'an officer charged with managing the company'],
        ['the veil of incorporation', 'the separation between company and members'],
        ['piercing the veil', 'looking behind separate personality, permitted only narrowly'],
        ['Prest v Petrodel', 'the case restricting when the veil may be pierced'],
        ['a director’s duty', 'an obligation owed to the company, now largely codified'],
        ['the duty to promote the success of the company', 'the central statutory duty'],
        ['the duty to avoid conflicts of interest', 'a strict fiduciary duty owed by directors'],
        ['wrongful trading', 'continuing to trade with no reasonable prospect of avoiding insolvency'],
        ['fraudulent trading', 'carrying on business with intent to defraud creditors'],
        ['a derivative claim', 'a claim by a member on the company’s behalf'],
        ['unfair prejudice', 'a statutory remedy for conduct prejudicial to a member’s interests']
      ],
      truths: [
        'A company is a separate legal person from the moment of incorporation.',
        'Directors owe their duties to the company, not to individual shareholders.',
        'Piercing the veil is exceptional and, since Prest, very narrowly confined.',
        'Limited liability limits the member’s exposure, not the company’s.',
        'A director can be personally liable for wrongful trading despite separate personality.'
      ],
      myths: [
        'A one-person company is not really separate from that person.',
        'Directors owe their duties to the shareholders individually.',
        'The veil is pierced whenever a company is used unfairly.',
        'Limited liability means a company’s debts are capped.',
        'A shareholder can sue in their own name for a wrong done to the company.'
      ],
      applications: [
        ['Which case established separate legal personality?', 'Salomon v Salomon'],
        ['To whom do directors owe their duties?', 'the company'],
        ['Which case narrowed piercing the corporate veil?', 'Prest v Petrodel'],
        ['A claim brought by a member on the company’s behalf is called what?', 'a derivative claim'],
        ['Trading on with no prospect of avoiding insolvency is called what?', 'wrongful trading']
      ]
    }
  ],
  /* ============================== human rights ============================== */
  'human-rights': [
    {
      name: 'The Convention Rights and the Human Rights Act', from: 'Grade 12', to: 'Advanced',
      facts: [
        ['the European Convention on Human Rights', 'the treaty protecting rights in the member states'],
        ['the European Court of Human Rights', 'the court in Strasbourg that hears Convention claims'],
        ['the Human Rights Act 1998', 'the Act giving the Convention effect in domestic law'],
        ['an absolute right', 'one that may never be interfered with'],
        ['a limited right', 'one that may be restricted in defined circumstances'],
        ['a qualified right', 'one that may be restricted where necessary and proportionate'],
        ['Article 2', 'the right to life'],
        ['Article 3', 'the prohibition of torture and inhuman or degrading treatment'],
        ['Article 5', 'the right to liberty and security'],
        ['Article 6', 'the right to a fair trial'],
        ['Article 8', 'the right to respect for private and family life'],
        ['Article 10', 'freedom of expression'],
        ['Article 11', 'freedom of assembly and association'],
        ['Article 14', 'the prohibition of discrimination in the enjoyment of Convention rights'],
        ['a declaration of incompatibility', 'a court’s statement that an Act conflicts with the Convention'],
        ['section 3', 'the duty to read legislation compatibly so far as possible'],
        ['a public authority', 'a body bound to act compatibly with Convention rights'],
        ['the margin of appreciation', 'the latitude Strasbourg allows a state'],
        ['proportionality', 'the test of whether an interference goes further than necessary'],
        ['a victim', 'the person who may bring a claim under the Act']
      ],
      truths: [
        'Article 3 is absolute: no justification for torture is ever available.',
        'A declaration of incompatibility does not invalidate the Act it concerns.',
        'Section 3 requires legislation to be read compatibly so far as it is possible to do so.',
        'Qualified rights may be restricted where the interference is lawful, legitimate and proportionate.',
        'The Human Rights Act applies to public authorities, and to courts as public authorities.'
      ],
      myths: [
        'Every Convention right can be balanced against the public interest.',
        'A declaration of incompatibility strikes down the offending Act.',
        'The Human Rights Act lets anyone claim about anything they find unfair.',
        'Freedom of expression protects any statement whatever.',
        'The Convention only binds the state and never affects private disputes.'
      ],
      applications: [
        ['Which Article protects the right to a fair trial?', 'Article 6'],
        ['Is Article 3 absolute or qualified?', 'absolute'],
        ['What does a court issue where an Act conflicts with the Convention?', 'a declaration of incompatibility'],
        ['Which section requires compatible interpretation?', 'section 3'],
        ['The latitude Strasbourg allows a state is called what?', 'the margin of appreciation']
      ]
    }
  ],
  /* =============================== family law =============================== */
  'family-law': [
    {
      name: 'Marriage, Divorce and Financial Provision', from: 'College', to: 'Advanced',
      facts: [
        ['a marriage', 'a legal status with defined formalities and consequences'],
        ['a civil partnership', 'a legal status with substantially the same consequences'],
        ['a void marriage', 'one that never existed in law'],
        ['a voidable marriage', 'one valid until annulled'],
        ['nullity', 'a decree declaring a marriage void or annulling it'],
        ['no-fault divorce', 'the modern basis, requiring only a statement of irretrievable breakdown'],
        ['irretrievable breakdown', 'the sole ground for divorce'],
        ['a conditional order', 'the first divorce order, formerly the decree nisi'],
        ['a final order', 'the order ending the marriage, formerly the decree absolute'],
        ['financial remedies', 'the orders redistributing property and income on divorce'],
        ['section 25 factors', 'the statutory checklist guiding financial provision'],
        ['the welfare of children', 'the first consideration in financial provision'],
        ['the sharing principle', 'that matrimonial property is ordinarily shared equally'],
        ['White v White', 'the case introducing the yardstick of equality'],
        ['needs', 'the first call on the assets in most cases'],
        ['compensation', 'a principle addressing relationship-generated disadvantage'],
        ['a clean break', 'ending financial ties between the parties where possible'],
        ['matrimonial property', 'assets built up during the marriage'],
        ['non-matrimonial property', 'assets brought in or inherited, treated differently'],
        ['a prenuptial agreement', 'an agreement given weight but not automatically binding']
      ],
      truths: [
        'Irretrievable breakdown is the sole ground for divorce.',
        'The welfare of any child of the family is the first consideration in financial provision.',
        'White v White introduced equality as a yardstick, not a starting presumption of equal division.',
        'A prenuptial agreement is a factor the court weighs; it does not bind the court.',
        'A void marriage never existed; a voidable one is valid until annulled.'
      ],
      myths: [
        'Assets are always divided fifty-fifty on divorce.',
        'A prenuptial agreement is automatically binding on the court.',
        'Living together for years creates a common law marriage.',
        'Fault must still be proved to obtain a divorce.',
        'A void and a voidable marriage are the same thing.'
      ],
      applications: [
        ['What is the sole ground for divorce?', 'irretrievable breakdown'],
        ['What is the first consideration in financial provision?', 'the welfare of the children'],
        ['Which case introduced the yardstick of equality?', 'White v White'],
        ['Is a prenuptial agreement binding on the court?', 'no, it is a factor'],
        ['A marriage valid until annulled is called what?', 'voidable']
      ]
    }
  ],
  /* ============================= employment law ============================= */
  'employment-law': [
    {
      name: 'Employment Status, Dismissal and Discrimination', from: 'College', to: 'Advanced',
      facts: [
        ['an employee', 'someone working under a contract of employment'],
        ['a worker', 'an intermediate status with some but not all employment rights'],
        ['a self-employed contractor', 'someone in business on their own account'],
        ['the control test', 'an early test of employment status'],
        ['mutuality of obligation', 'the requirement to offer and accept work'],
        ['personal service', 'the requirement to do the work oneself'],
        ['the multiple factor test', 'the modern approach weighing all the circumstances'],
        ['unfair dismissal', 'a statutory claim for dismissal without a fair reason or procedure'],
        ['a potentially fair reason', 'conduct, capability, redundancy, illegality or some other substantial reason'],
        ['the band of reasonable responses', 'the standard by which a dismissal is judged'],
        ['wrongful dismissal', 'a contractual claim for dismissal in breach of notice'],
        ['constructive dismissal', 'resignation in response to a repudiatory breach by the employer'],
        ['redundancy', 'dismissal because the work has ceased or diminished'],
        ['the qualifying period', 'the service normally required to claim unfair dismissal'],
        ['a protected characteristic', 'a ground on which discrimination is unlawful'],
        ['direct discrimination', 'less favourable treatment because of a protected characteristic'],
        ['indirect discrimination', 'a neutral provision putting a group at a disadvantage'],
        ['a reasonable adjustment', 'the duty owed to a disabled worker'],
        ['harassment', 'unwanted conduct violating dignity or creating a hostile environment'],
        ['victimisation', 'detriment for doing a protected act']
      ],
      truths: [
        'Employment status is decided by the reality of the relationship, not the label in the contract.',
        'A dismissal is judged by whether it fell within the band of reasonable responses.',
        'Constructive dismissal requires a repudiatory breach by the employer, not merely unreasonableness.',
        'Direct discrimination cannot generally be justified; indirect discrimination can.',
        'The duty to make reasonable adjustments is owed to disabled workers specifically.'
      ],
      myths: [
        'A contract calling someone self-employed settles their status.',
        'An employer needs no reason to dismiss during any probation period.',
        'Any unreasonable behaviour by an employer amounts to constructive dismissal.',
        'Direct discrimination can be justified if the business reason is good enough.',
        'Unfair dismissal and wrongful dismissal are the same claim.'
      ],
      applications: [
        ['Which standard judges the fairness of a dismissal?', 'the band of reasonable responses'],
        ['Resigning in response to a repudiatory breach is called what?', 'constructive dismissal'],
        ['Can direct discrimination generally be justified?', 'no'],
        ['A neutral rule disadvantaging a group is which kind of discrimination?', 'indirect'],
        ['What duty is owed specifically to disabled workers?', 'reasonable adjustments']
      ]
    }
  ],
  /* ============================ evidence and procedure ============================ */
  evidence: [
    {
      name: 'Burden of Proof, Admissibility and Hearsay', from: 'College', to: 'Advanced',
      facts: [
        ['the legal burden', 'the obligation to prove a fact in issue'],
        ['the evidential burden', 'the obligation to raise an issue fit for consideration'],
        ['the standard of proof', 'the degree of certainty required'],
        ['beyond reasonable doubt', 'the criminal standard'],
        ['the balance of probabilities', 'the civil standard'],
        ['Woolmington v DPP', 'the case establishing that the prosecution bears the burden'],
        ['the golden thread', 'the principle that the prosecution must prove guilt'],
        ['a reverse burden', 'where the defendant must prove a matter'],
        ['relevance', 'the first requirement of admissibility'],
        ['admissibility', 'whether evidence may be put before the tribunal'],
        ['weight', 'how much the tribunal makes of admitted evidence'],
        ['hearsay', 'a statement made out of court offered for its truth'],
        ['an exception to hearsay', 'a category in which such a statement is admissible'],
        ['a res gestae statement', 'one so closely connected to the event as to be reliable'],
        ['a confession', 'an admission wholly or partly adverse to the maker'],
        ['an oppression', 'conduct rendering a confession inadmissible'],
        ['bad character evidence', 'evidence of misconduct outside the offence charged'],
        ['a gateway', 'a statutory route by which bad character becomes admissible'],
        ['a witness summons', 'the compulsion of a witness to attend'],
        ['privilege against self-incrimination', 'the right not to answer where the answer would incriminate']
      ],
      truths: [
        'The prosecution bears the burden of proving guilt beyond reasonable doubt.',
        'Relevance is necessary for admissibility but not sufficient.',
        'Hearsay is inadmissible unless it falls within an exception.',
        'A confession obtained by oppression is inadmissible however true it may be.',
        'The evidential burden can rest on a defendant without shifting the legal burden.'
      ],
      myths: [
        'The defendant must prove innocence.',
        'All relevant evidence is admissible.',
        'A confession is always admissible because nobody confesses falsely.',
        'Hearsay is banned absolutely with no exceptions.',
        'The civil and criminal standards of proof are the same.'
      ],
      applications: [
        ['Which case established the golden thread?', 'Woolmington v DPP'],
        ['What is the civil standard of proof?', 'the balance of probabilities'],
        ['An out-of-court statement offered for its truth is called what?', 'hearsay'],
        ['A confession obtained by oppression is what?', 'inadmissible'],
        ['Is all relevant evidence admissible?', 'no']
      ]
    }
  ],
  /* ============================== jurisprudence ============================== */
  jurisprudence: [
    {
      name: 'Natural Law, Positivism and Legal Theory', from: 'College', to: 'Advanced',
      facts: [
        ['jurisprudence', 'the theory and philosophy of law'],
        ['natural law', 'the view that law and morality are necessarily connected'],
        ['Thomas Aquinas', 'the classical natural law theorist'],
        ['lex iniusta non est lex', 'the natural law claim that an unjust law is not law'],
        ['John Finnis', 'the modern natural law theorist of basic goods'],
        ['legal positivism', 'the view that law and morality are separate questions'],
        ['the separation thesis', 'that what law is and what it ought to be are distinct'],
        ['John Austin', 'the positivist of the command theory'],
        ['the command theory', 'that law is the sovereign’s command backed by sanction'],
        ['H. L. A. Hart', 'the positivist of primary and secondary rules'],
        ['a primary rule', 'one imposing duties'],
        ['a secondary rule', 'one about the making and changing of rules'],
        ['the rule of recognition', 'the ultimate criterion of legal validity in a system'],
        ['the internal point of view', 'the attitude of accepting a rule as a standard'],
        ['Ronald Dworkin', 'the theorist of law as integrity'],
        ['a principle', 'a standard of justice or fairness, distinguished from a rule'],
        ['the one right answer thesis', 'Dworkin’s claim that hard cases have correct answers'],
        ['legal realism', 'the view that law is what officials actually do'],
        ['critical legal studies', 'the school arguing law is indeterminate and political'],
        ['the Hart-Fuller debate', 'the exchange on law and morality after the Second World War']
      ],
      truths: [
        'Positivism claims law and morality are separate questions, not that law should ignore morality.',
        'Hart’s rule of recognition is the ultimate test of validity within a legal system.',
        'Dworkin argued that principles as well as rules figure in legal reasoning.',
        'The internal point of view distinguishes accepting a rule from merely predicting a sanction.',
        'The Hart-Fuller debate concerned whether wicked laws were law at all.'
      ],
      myths: [
        'Positivists believe that law is always morally right.',
        'Natural lawyers think there is no such thing as unjust legislation.',
        'Hart accepted Austin’s command theory.',
        'Legal realism holds that legal rules do not exist.',
        'Dworkin was a positivist.'
      ],
      applications: [
        ['Which theorist proposed the rule of recognition?', 'H. L. A. Hart'],
        ['Whose theory is law as integrity?', 'Ronald Dworkin'],
        ['What does the separation thesis claim?', 'law and morality are separate questions'],
        ['Which theorist held law is the sovereign’s command?', 'John Austin'],
        ['A rule about making and changing rules is called what?', 'a secondary rule']
      ]
    }
  ],
  /* ============================== legal practice ============================== */
  'legal-practice': [
    {
      name: 'Professional Ethics, Conflicts and Confidentiality', from: 'College', to: 'Advanced',
      facts: [
        ['a solicitor', 'a lawyer who advises clients and conducts litigation'],
        ['a barrister', 'a lawyer specialising in advocacy and expert advice'],
        ['a regulator', 'the body setting and enforcing professional standards'],
        ['a professional principle', 'a fundamental obligation such as acting with integrity'],
        ['a duty to the court', 'the overriding obligation, taking precedence over the client'],
        ['a duty of confidentiality', 'the obligation not to disclose a client’s information'],
        ['legal professional privilege', 'the client’s right to withhold communications from disclosure'],
        ['legal advice privilege', 'privilege covering lawyer-client advice'],
        ['litigation privilege', 'privilege covering material for pending or contemplated litigation'],
        ['a conflict of interest', 'where duties to two clients, or a client and oneself, collide'],
        ['an own interest conflict', 'where the lawyer’s interest conflicts with the client’s'],
        ['informed consent', 'a client’s agreement given with the facts understood'],
        ['an information barrier', 'a measure separating teams to manage a conflict'],
        ['a client account', 'the separate account holding client money'],
        ['the cab rank rule', 'the barrister’s obligation to accept work within their field'],
        ['a duty of disclosure', 'the obligation to reveal relevant material to the court'],
        ['misleading the court', 'a fundamental breach, never justified by client instructions'],
        ['undertakings', 'binding promises a lawyer must honour personally'],
        ['money laundering regulations', 'the rules requiring client due diligence'],
        ['a complaint', 'a grievance a client may take to the regulator or ombudsman']
      ],
      truths: [
        'The duty to the court overrides the duty to the client where they conflict.',
        'A lawyer may never mislead the court, whatever the client instructs.',
        'Confidentiality survives the end of the retainer and the death of the client.',
        'Privilege belongs to the client, not to the lawyer, and only the client can waive it.',
        'An undertaking binds the lawyer personally and is enforceable against them.'
      ],
      myths: [
        'A lawyer must do whatever the client instructs.',
        'Confidentiality ends when the case does.',
        'A lawyer can waive privilege on the client’s behalf if it seems sensible.',
        'A conflict of interest can always be cured by telling both clients.',
        'Everything said to a lawyer is privileged, whatever it concerns.'
      ],
      applications: [
        ['Which duty takes precedence, to the court or to the client?', 'to the court'],
        ['Who owns legal professional privilege?', 'the client'],
        ['Does confidentiality end when the retainer does?', 'no'],
        ['A binding promise a lawyer must honour personally is called what?', 'an undertaking'],
        ['The barrister’s obligation to accept work in their field is called what?', 'the cab rank rule']
      ]
    }
  ]
};
