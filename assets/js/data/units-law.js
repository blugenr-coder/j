/* Law, years one and two: the foundations of legal knowledge.

   These are the subjects a qualifying law degree has to cover, and they are
   named the way a syllabus names them — "Offer and Acceptance", "Duty of Care
   and the Neighbour Principle", "Parliamentary Sovereignty" — rather than as
   slices of "law".

   Two things shape how these are written. The vocabulary is the discipline:
   a student who cannot distinguish an offer from an invitation to treat
   cannot do contract law at all, so the term banks are the heart of it. And
   the myths are real student errors rather than inventions — consideration
   must be sufficient but need not be adequate is the single most misstated
   rule in first-year contract.

   Jurisdiction: these follow the common law of England and Wales, which is
   what most LLB syllabuses outside the United States teach and what the
   leading cases named here belong to. */

export const LAW_UNITS = {
  /* ============================ legal system ============================ */
  'legal-system': [
    {
      name: 'Sources of Law and the Court Hierarchy', from: 'Grade 11', to: 'Advanced',
      facts: [
        ['a source of law', 'where a rule of law comes from'],
        ['legislation', 'law made by Parliament'],
        ['an Act of Parliament', 'a statute that has completed its passage and received Royal Assent'],
        ['a bill', 'a proposed Act, before it becomes law'],
        ['delegated legislation', 'law made under authority granted by an Act'],
        ['a statutory instrument', 'the commonest form of delegated legislation'],
        ['common law', 'law developed by judges through decided cases'],
        ['case law', 'the body of decisions the courts have made'],
        ['precedent', 'the principle that like cases are decided alike'],
        ['stare decisis', 'the doctrine that a court is bound by earlier decisions'],
        ['ratio decidendi', 'the legal reason for a decision, which binds'],
        ['obiter dictum', 'something said in passing, which persuades but does not bind'],
        ['to distinguish', 'to hold an earlier case inapplicable on its facts'],
        ['to overrule', 'to hold that an earlier decision was wrong in law'],
        ['a binding precedent', 'one a court must follow'],
        ['a persuasive precedent', 'one a court may follow but need not'],
        ['the Supreme Court', 'the final court of appeal in the United Kingdom'],
        ['the Court of Appeal', 'the court below the Supreme Court, in two divisions'],
        ['the High Court', 'the senior first-instance civil court, in three divisions'],
        ['a first-instance court', 'the court that hears a case first, finding the facts']
      ],
      truths: [
        'A court is bound by the ratio of a decision, not by everything the judge said.',
        'The Supreme Court can depart from its own previous decisions; it rarely does.',
        'Delegated legislation has the force of an Act but can be struck down as ultra vires.',
        'Distinguishing a case leaves the earlier decision standing; overruling does not.',
        'A decision of a court in another common law country is persuasive, never binding here.'
      ],
      myths: [
        'Everything a judge says in a judgment binds later courts.',
        'The Court of Appeal can overrule the Supreme Court.',
        'Common law and statute are alternatives, and a case is governed by one or the other.',
        'A dissenting judgment has no legal significance at all.',
        'Delegated legislation is not real law because Parliament did not vote on it.'
      ],
      sequences: [
        ['How a bill becomes an Act', [
          'First reading: the bill is formally introduced',
          'Second reading: the House debates the principle',
          'Committee stage: the bill is examined clause by clause',
          'Report stage: the House considers the committee amendments',
          'Third reading and passage to the other House',
          'Royal Assent, after which it is an Act of Parliament'
        ]]
      ],
      applications: [
        ['A judge explains what the outcome would have been on different facts. Binding?', 'no, it is obiter'],
        ['Which part of a judgment binds later courts?', 'the ratio decidendi'],
        ['A court holds an earlier case inapplicable on its facts. What has it done?', 'distinguished it'],
        ['Which is the final court of appeal in the United Kingdom?', 'the Supreme Court'],
        ['Regulations made by a minister under an Act are what kind of law?', 'delegated legislation']
      ]
    },
    {
      name: 'Statutory Interpretation and Legal Reasoning', from: 'Grade 12', to: 'Advanced',
      facts: [
        ['statutory interpretation', 'the process of deciding what an Act means'],
        ['the literal rule', 'giving words their ordinary, plain meaning'],
        ['the golden rule', 'departing from the literal meaning to avoid an absurd result'],
        ['the mischief rule', 'reading an Act to suppress the mischief it was passed to remedy'],
        ['the purposive approach', 'reading an Act to give effect to its purpose'],
        ['Heydon’s Case', 'the case that set out the mischief rule'],
        ['an intrinsic aid', 'help found inside the Act itself, such as its long title'],
        ['an extrinsic aid', 'help found outside the Act, such as a dictionary or report'],
        ['Hansard', 'the record of parliamentary debates, usable in limited circumstances'],
        ['Pepper v Hart', 'the case permitting reference to Hansard where an Act is ambiguous'],
        ['ejusdem generis', 'general words following a list take their colour from the list'],
        ['expressio unius', 'expressing one thing implies the exclusion of others'],
        ['noscitur a sociis', 'a word is known by the company it keeps'],
        ['a presumption', 'a starting assumption about what Parliament intended'],
        ['the presumption against retrospectivity', 'that an Act does not change the past'],
        ['a definition section', 'the part of an Act defining its own terms'],
        ['a preamble', 'an introductory statement of purpose'],
        ['a headnote', 'the summary at the top of a law report, which is not the judgment'],
        ['a legal syllogism', 'the rule, the facts and the conclusion that follows'],
        ['analogical reasoning', 'arguing that a case is relevantly like a decided one']
      ],
      truths: [
        'The purposive approach has largely displaced the literal rule in modern practice.',
        'Hansard may be used only where the Act is ambiguous and a minister made a clear statement.',
        'A headnote is written by the law reporter and is not part of the judgment.',
        'Ejusdem generis limits general words to the class the preceding list establishes.',
        'The rules of interpretation are approaches, not a hierarchy a judge must work through.'
      ],
      myths: [
        'A judge must try the literal rule first and only then move on.',
        'The mischief rule lets a court rewrite an Act it dislikes.',
        'Hansard can be cited freely to explain any statute.',
        'Every Act contains a preamble stating its purpose.',
        'The golden rule allows departure from plain words whenever the result seems unfair.'
      ],
      applications: [
        ['An Act says "cats, dogs and other animals". Does it cover a wasp?', 'probably not, under ejusdem generis'],
        ['Which case allowed limited reference to Hansard?', 'Pepper v Hart'],
        ['Reading an Act to suppress the wrong it was passed to fix is which rule?', 'the mischief rule'],
        ['A word is known by the company it keeps. Which maxim?', 'noscitur a sociis'],
        ['Is the headnote of a law report part of the judgment?', 'no']
      ]
    }
  ],
  /* ============================== contract ============================== */
  contract: [
    {
      name: 'Offer and Acceptance', from: 'Grade 11', to: 'Advanced',
      facts: [
        ['an offer', 'a definite promise to be bound on specified terms'],
        ['an invitation to treat', 'an invitation to others to make an offer'],
        ['an offeror', 'the person who makes the offer'],
        ['an offeree', 'the person to whom the offer is made'],
        ['acceptance', 'unqualified agreement to all the terms of the offer'],
        ['a counter-offer', 'a reply varying the terms, which destroys the original offer'],
        ['Hyde v Wrench', 'the case establishing that a counter-offer kills the offer'],
        ['a request for information', 'an enquiry that does not destroy the offer'],
        ['revocation', 'withdrawal of an offer before acceptance'],
        ['the postal rule', 'acceptance by post takes effect on posting'],
        ['Adams v Lindsell', 'the case establishing the postal rule'],
        ['instantaneous communication', 'acceptance by such means takes effect on receipt'],
        ['a unilateral contract', 'a promise in exchange for an act rather than a promise'],
        ['Carlill v Carbolic Smoke Ball Co', 'the leading case on unilateral offers to the world'],
        ['a bilateral contract', 'an exchange of promises'],
        ['a display of goods', 'ordinarily an invitation to treat, not an offer'],
        ['Fisher v Bell', 'the case holding a shop window display an invitation to treat'],
        ['an auction without reserve', 'where the auctioneer’s call for bids can bind'],
        ['a tender', 'an offer made in response to an invitation to tender'],
        ['lapse of an offer', 'the ending of an offer by time, death or rejection']
      ],
      truths: [
        'A counter-offer destroys the original offer, which cannot then be accepted.',
        'A request for information leaves the offer alive; a counter-offer does not.',
        'Acceptance by post takes effect when posted, even if it never arrives.',
        'The postal rule does not apply to instantaneous communication such as email or telex.',
        'An offer can be revoked at any time before acceptance, even if it was said to be open.'
      ],
      myths: [
        'Goods displayed in a shop window are an offer the customer accepts at the till.',
        'Silence can amount to acceptance if the offeror says it will.',
        'An offer stated to be open for a week cannot be withdrawn within that week.',
        'The postal rule applies to any acceptance sent electronically.',
        'A counter-offer keeps the original offer available as a fallback.'
      ],
      applications: [
        ['A shop displays a knife in its window. Offer or invitation to treat?', 'an invitation to treat'],
        ['A replies to an offer of £1,000 with "would you take £900?". What is this?', 'a counter-offer'],
        ['An acceptance is posted and lost. Is there a contract?', 'yes, under the postal rule'],
        ['Which case concerned an advertisement for a flu remedy?', 'Carlill v Carbolic Smoke Ball Co'],
        ['Which case established that a counter-offer destroys the offer?', 'Hyde v Wrench']
      ]
    },
    {
      name: 'Consideration and Intention to Create Legal Relations', from: 'Grade 11', to: 'Advanced',
      facts: [
        ['consideration', 'something of value given in exchange for a promise'],
        ['executed consideration', 'consideration already performed'],
        ['executory consideration', 'a promise of future performance'],
        ['past consideration', 'an act done before the promise, which is generally no consideration'],
        ['Re McArdle', 'the case on past consideration'],
        ['sufficiency', 'that consideration must have some value in the eyes of the law'],
        ['adequacy', 'whether the value is proportionate, which the law does not require'],
        ['Chappell v Nestlé', 'the case holding chocolate wrappers to be good consideration'],
        ['an existing duty', 'performance of what one is already bound to do'],
        ['Stilk v Myrick', 'the case that performing an existing contractual duty is not consideration'],
        ['Williams v Roffey Bros', 'the case allowing a practical benefit to count as consideration'],
        ['a practical benefit', 'a real advantage obtained, short of a new legal obligation'],
        ['part payment of a debt', 'which at common law does not discharge the whole debt'],
        ['Foakes v Beer', 'the case on part payment of a debt'],
        ['promissory estoppel', 'the equitable bar on going back on a promise relied upon'],
        ['High Trees', 'the case that revived promissory estoppel'],
        ['a shield not a sword', 'the rule that estoppel defends a claim but does not found one'],
        ['intention to create legal relations', 'the requirement that the parties meant to be legally bound'],
        ['a domestic agreement', 'presumed not to be intended to create legal relations'],
        ['Balfour v Balfour', 'the case on agreements between husband and wife']
      ],
      truths: [
        'Consideration must be sufficient but need not be adequate.',
        'Past consideration is generally not good consideration.',
        'Performing an existing contractual duty is not consideration, unless a practical benefit is conferred.',
        'Promissory estoppel is a shield, not a sword: it cannot found a cause of action.',
        'Domestic agreements are presumed not to be legally binding; commercial ones are presumed to be.'
      ],
      myths: [
        'Consideration must be of roughly equal value to the promise.',
        'A promise made in return for something already done is binding.',
        'Promissory estoppel can be used to bring a claim.',
        'An agreement between family members can never be a contract.',
        'Part payment of a debt always discharges the whole debt if the creditor agrees.'
      ],
      applications: [
        ['Is £1 good consideration for a house?', 'yes: sufficient though not adequate'],
        ['Which case held chocolate wrappers to be consideration?', 'Chappell v Nestlé'],
        ['A promise is made after the act it rewards. What is the problem?', 'past consideration'],
        ['Which presumption applies to an agreement between spouses?', 'no intention to create legal relations'],
        ['Which case allowed a practical benefit to count as consideration?', 'Williams v Roffey Bros']
      ]
    },
    {
      name: 'Terms, Breach and Remedies in Contract', from: 'Grade 12', to: 'Advanced',
      facts: [
        ['an express term', 'a term the parties actually stated'],
        ['an implied term', 'a term read into the contract by law, fact or custom'],
        ['a condition', 'a major term, breach of which allows termination'],
        ['a warranty', 'a minor term, breach of which sounds only in damages'],
        ['an innominate term', 'a term classified by the seriousness of the breach that occurs'],
        ['Hong Kong Fir', 'the case introducing innominate terms'],
        ['a representation', 'a statement inducing the contract but not part of it'],
        ['an exclusion clause', 'a term limiting or excluding liability'],
        ['incorporation', 'whether a clause became part of the contract at all'],
        ['the contra proferentem rule', 'ambiguity is read against the party relying on the clause'],
        ['a breach of contract', 'failure to perform an obligation without lawful excuse'],
        ['an anticipatory breach', 'a refusal to perform before performance falls due'],
        ['a repudiatory breach', 'a breach serious enough to allow the other party to terminate'],
        ['damages', 'a money award compensating the loss caused by the breach'],
        ['the expectation measure', 'putting the claimant in the position of performance'],
        ['the reliance measure', 'compensating wasted expenditure'],
        ['remoteness', 'the limit on recoverable loss'],
        ['Hadley v Baxendale', 'the case establishing the test of remoteness'],
        ['mitigation', 'the duty to take reasonable steps to reduce the loss'],
        ['specific performance', 'an equitable order to perform, granted where damages are inadequate']
      ],
      truths: [
        'Breach of a condition allows termination and damages; breach of a warranty allows damages only.',
        'Hadley v Baxendale limits damages to losses arising naturally or within the parties’ contemplation.',
        'A claimant must mitigate: loss that reasonable steps would have avoided is not recoverable.',
        'Specific performance is discretionary and refused where damages are an adequate remedy.',
        'An exclusion clause must be incorporated before its wording matters at all.'
      ],
      myths: [
        'Every breach of contract entitles the innocent party to terminate.',
        'Damages are meant to punish the party in breach.',
        'A signed contract means an exclusion clause in it is always effective.',
        'Specific performance is available whenever the claimant would prefer it.',
        'An innocent party can sit back and let the loss accumulate.'
      ],
      applications: [
        ['Breach of which type of term allows termination?', 'a condition'],
        ['Which case sets the test for remoteness of damage?', 'Hadley v Baxendale'],
        ['A party refuses to perform before the due date. What is this?', 'anticipatory breach'],
        ['Ambiguity in an exclusion clause is read against whom?', 'the party relying on it'],
        ['Which remedy orders actual performance rather than money?', 'specific performance']
      ]
    }
  ],
  /* ================================ tort ================================ */
  tort: [
    {
      name: 'Duty of Care and the Neighbour Principle', from: 'Grade 11', to: 'Advanced',
      facts: [
        ['a tort', 'a civil wrong other than a breach of contract'],
        ['negligence', 'a breach of a duty of care causing damage'],
        ['a duty of care', 'a legal obligation to take reasonable care'],
        ['the neighbour principle', 'the duty owed to those closely and directly affected'],
        ['Donoghue v Stevenson', 'the case establishing the modern law of negligence'],
        ['the Caparo test', 'foreseeability, proximity, and fairness of imposing a duty'],
        ['Caparo v Dickman', 'the case setting out the threefold test'],
        ['an incremental approach', 'developing duty by analogy with established categories'],
        ['a pure omission', 'a failure to act, which ordinarily attracts no duty'],
        ['an assumption of responsibility', 'a basis on which a duty can arise for an omission'],
        ['a public body', 'a defendant whose duty may be limited by policy considerations'],
        ['pure economic loss', 'financial loss unconnected to damage to person or property'],
        ['Hedley Byrne v Heller', 'the case allowing recovery for negligent misstatement'],
        ['a special relationship', 'the basis of a duty in negligent misstatement'],
        ['a primary victim', 'someone in the zone of physical danger'],
        ['a secondary victim', 'someone who suffers psychiatric harm witnessing an event'],
        ['Alcock', 'the case setting the control mechanisms for secondary victims'],
        ['a recognised psychiatric illness', 'the threshold for a psychiatric injury claim'],
        ['foreseeability', 'whether a reasonable person would anticipate the harm'],
        ['proximity', 'the closeness of the relationship between the parties']
      ],
      truths: [
        'Donoghue v Stevenson concerned a decomposed snail in a bottle of ginger beer.',
        'The Caparo test asks about foreseeability, proximity and whether a duty is fair, just and reasonable.',
        'Pure economic loss is generally not recoverable in negligence, with narrow exceptions.',
        'The law recognises no general duty to rescue a stranger.',
        'Grief and distress are not enough: a secondary victim must show a recognised psychiatric illness.'
      ],
      myths: [
        'A duty of care is owed to everybody who could conceivably be affected.',
        'Anyone who sees an accident can recover for the shock of it.',
        'A person who can easily rescue another is legally obliged to.',
        'Negligence requires an intention to cause harm.',
        'Financial loss caused carelessly is always recoverable.'
      ],
      applications: [
        ['Which case established the neighbour principle?', 'Donoghue v Stevenson'],
        ['What are the three limbs of the Caparo test?', 'foreseeability, proximity, fair just and reasonable'],
        ['Is there a general duty to rescue a stranger?', 'no'],
        ['Which case allowed recovery for negligent misstatement?', 'Hedley Byrne v Heller'],
        ['What must a secondary victim prove they suffered?', 'a recognised psychiatric illness']
      ]
    },
    {
      name: 'Breach, Causation and Remoteness in Negligence', from: 'Grade 12', to: 'Advanced',
      facts: [
        ['breach of duty', 'falling below the standard of the reasonable person'],
        ['the reasonable person', 'the objective standard against which conduct is measured'],
        ['the Bolam test', 'a professional is not negligent if acting per a responsible body of opinion'],
        ['Bolitho', 'the case requiring that body of opinion to withstand logical analysis'],
        ['the standard of a learner', 'the same as the qualified, not adjusted downwards'],
        ['Nettleship v Weston', 'the case on the standard applied to a learner driver'],
        ['the likelihood of harm', 'a factor in what reasonable care requires'],
        ['the seriousness of harm', 'another factor: greater risk demands greater precaution'],
        ['the cost of precautions', 'weighed against the risk in setting the standard'],
        ['the social utility of the conduct', 'which can justify a greater risk'],
        ['factual causation', 'whether the breach in fact caused the damage'],
        ['the but-for test', 'would the damage have occurred but for the breach'],
        ['Barnett v Chelsea Hospital', 'the case illustrating the but-for test'],
        ['a material contribution', 'a route to causation where but-for fails'],
        ['a novus actus interveniens', 'an intervening act breaking the chain of causation'],
        ['legal causation', 'whether the link is close enough for liability'],
        ['remoteness', 'whether the kind of damage was reasonably foreseeable'],
        ['The Wagon Mound', 'the case establishing foreseeability as the test of remoteness'],
        ['the eggshell skull rule', 'the defendant takes the victim as they find them'],
        ['contributory negligence', 'a partial defence reducing damages for the claimant’s own fault']
      ],
      truths: [
        'The standard of care is objective: inexperience is no defence.',
        'But-for causation asks whether the damage would have happened anyway.',
        'The kind of damage must be foreseeable; its extent need not be.',
        'The eggshell skull rule means an unusually vulnerable claimant recovers in full.',
        'Contributory negligence reduces damages rather than defeating the claim.'
      ],
      myths: [
        'A learner driver is judged by the standard of a learner.',
        'A doctor is negligent whenever another doctor would have acted differently.',
        'If the claimant was partly at fault the claim fails entirely.',
        'The precise extent of the injury must have been foreseeable.',
        'Causation is established simply by showing the defendant behaved badly.'
      ],
      applications: [
        ['A patient would have died anyway. Is causation established?', 'no, the but-for test fails'],
        ['Which case set the professional standard of care?', 'the Bolam test'],
        ['Which case established foreseeability as the test of remoteness?', 'The Wagon Mound'],
        ['A claimant has a rare condition making the injury far worse. Recoverable?', 'yes, the eggshell skull rule'],
        ['What is the effect of contributory negligence on a claim?', 'damages are reduced']
      ]
    },
    {
      name: 'Occupiers’ Liability, Nuisance and Vicarious Liability', from: 'College', to: 'Advanced',
      facts: [
        ['an occupier', 'a person with sufficient control over premises'],
        ['a lawful visitor', 'someone present with permission'],
        ['a trespasser', 'someone present without permission'],
        ['the 1957 Act', 'the statute governing liability to lawful visitors'],
        ['the 1984 Act', 'the statute governing limited liability to trespassers'],
        ['the common duty of care', 'to keep the visitor reasonably safe for the purpose of the visit'],
        ['a warning', 'which may discharge the duty if it enables the visitor to be safe'],
        ['an independent contractor', 'whose faulty work may not fix the occupier with liability'],
        ['private nuisance', 'an unlawful interference with the use or enjoyment of land'],
        ['public nuisance', 'an act materially affecting the comfort of a class of the public'],
        ['locality', 'a factor in whether an interference is unreasonable'],
        ['sensitivity', 'an abnormally sensitive claimant cannot raise the standard'],
        ['malice', 'which can make otherwise reasonable conduct a nuisance'],
        ['Rylands v Fletcher', 'strict liability for the escape of a dangerous thing'],
        ['a non-natural use of land', 'the requirement in Rylands v Fletcher'],
        ['vicarious liability', 'liability of one person for the tort of another'],
        ['an employee', 'whose torts the employer may answer for'],
        ['the close connection test', 'whether the tort was closely connected to the employment'],
        ['a frolic of his own', 'conduct outside the course of employment'],
        ['an independent tortfeasor', 'someone for whose torts no vicarious liability arises']
      ],
      truths: [
        'The occupier owes a duty to trespassers under the 1984 Act, but a narrower one.',
        'A warning discharges the duty only if it was enough to keep the visitor reasonably safe.',
        'An abnormally sensitive claimant cannot make reasonable conduct into a nuisance.',
        'Malice can turn otherwise lawful use of land into a nuisance.',
        'Vicarious liability is strict: the employer need not be at fault at all.'
      ],
      myths: [
        'An occupier owes nothing whatever to a trespasser.',
        'Putting up any warning sign discharges the duty of care.',
        'Nuisance requires the defendant to have been negligent.',
        'An employer is liable for everything an employee does during working hours.',
        'Rylands v Fletcher requires proof of fault.'
      ],
      applications: [
        ['Which Act governs liability to lawful visitors?', 'the Occupiers’ Liability Act 1957'],
        ['An interference affects only an unusually sensitive use. Nuisance?', 'no'],
        ['What test decides if a tort was in the course of employment?', 'the close connection test'],
        ['Which case imposes strict liability for an escape?', 'Rylands v Fletcher'],
        ['An employee detours for personal reasons and causes harm. What is this called?', 'a frolic of his own']
      ]
    }
  ],
  /* ============================= public law ============================= */
  'public-law': [
    {
      name: 'Parliamentary Sovereignty and the Rule of Law', from: 'Grade 11', to: 'Advanced',
      facts: [
        ['a constitution', 'the rules governing how a state is organised and power exercised'],
        ['an uncodified constitution', 'one not contained in a single document'],
        ['parliamentary sovereignty', 'the doctrine that Parliament can make or unmake any law'],
        ['A. V. Dicey', 'the constitutional theorist who articulated sovereignty and the rule of law'],
        ['the enrolled bill rule', 'that courts will not question the validity of an Act'],
        ['implied repeal', 'the rule that a later Act overrides an inconsistent earlier one'],
        ['a constitutional statute', 'one the courts hold not subject to implied repeal'],
        ['Thoburn', 'the case recognising constitutional statutes'],
        ['the rule of law', 'the principle that everyone is subject to law equally'],
        ['the separation of powers', 'the division between legislature, executive and judiciary'],
        ['the executive', 'the government, which administers the law'],
        ['the legislature', 'Parliament, which makes the law'],
        ['the judiciary', 'the courts, which apply and interpret the law'],
        ['a convention', 'a binding practice that is not legally enforceable'],
        ['royal prerogative', 'the residual common law powers of the Crown'],
        ['the Miller cases', 'the decisions on prerogative power and prorogation'],
        ['judicial independence', 'that judges decide free of executive pressure'],
        ['a constitutional monarchy', 'a monarchy whose powers are limited by the constitution'],
        ['devolution', 'the transfer of powers to national and regional legislatures'],
        ['the Human Rights Act 1998', 'the Act giving effect to the Convention in domestic law']
      ],
      truths: [
        'The United Kingdom has a constitution; it is simply not written in one document.',
        'Courts will not question the validity of an Act of Parliament properly passed.',
        'A convention is binding in practice but not enforceable in court.',
        'Constitutional statutes are not subject to implied repeal.',
        'The Human Rights Act lets courts declare an Act incompatible but not strike it down.'
      ],
      myths: [
        'The United Kingdom has no constitution.',
        'A court can strike down an Act of Parliament for being unfair.',
        'Conventions can be enforced by the courts like any other rule.',
        'Parliamentary sovereignty means the government can do whatever it wants.',
        'The separation of powers is complete in the United Kingdom system.'
      ],
      applications: [
        ['Can a court strike down an Act of Parliament?', 'no'],
        ['A binding practice not enforceable in court is called what?', 'a convention'],
        ['Which case recognised constitutional statutes?', 'Thoburn'],
        ['What remedy does the Human Rights Act give against an incompatible Act?', 'a declaration of incompatibility'],
        ['The residual common law powers of the Crown are called what?', 'the royal prerogative']
      ]
    },
    {
      name: 'Judicial Review: Grounds and Procedure', from: 'College', to: 'Advanced',
      facts: [
        ['judicial review', 'the court’s supervision of the legality of public decisions'],
        ['a claimant', 'the person bringing the review'],
        ['standing', 'the requirement of a sufficient interest in the matter'],
        ['a sufficient interest', 'the statutory test for standing'],
        ['a public law decision', 'the kind of decision amenable to review'],
        ['illegality', 'acting outside the powers conferred'],
        ['ultra vires', 'beyond the powers'],
        ['irrationality', 'a decision so unreasonable no reasonable body could reach it'],
        ['Wednesbury unreasonableness', 'the classic formulation of irrationality'],
        ['procedural impropriety', 'failure to follow required or fair procedure'],
        ['natural justice', 'the right to a fair hearing and an unbiased decision-maker'],
        ['the rule against bias', 'that a decision-maker must not be interested in the outcome'],
        ['a legitimate expectation', 'an expectation of a benefit or procedure the law will protect'],
        ['proportionality', 'whether the measure went further than necessary'],
        ['a quashing order', 'an order setting the decision aside'],
        ['a prohibiting order', 'an order preventing an unlawful act'],
        ['a mandatory order', 'an order requiring a duty to be performed'],
        ['a declaration', 'a statement of the legal position'],
        ['the ouster clause', 'a provision purporting to exclude review'],
        ['Anisminic', 'the case on ouster clauses and jurisdictional error']
      ],
      truths: [
        'Judicial review examines the legality of a decision, not whether it was the right one.',
        'A claimant must have a sufficient interest to bring a claim.',
        'Wednesbury unreasonableness is a high threshold, deliberately.',
        'Courts read ouster clauses very narrowly, as Anisminic shows.',
        'The remedies in judicial review are discretionary, even where a ground is made out.'
      ],
      myths: [
        'Judicial review is an appeal on the merits of the decision.',
        'Anyone at all can bring a judicial review claim.',
        'A successful claim guarantees the claimant gets a remedy.',
        'An ouster clause reliably prevents any review at all.',
        'A decision can be quashed simply because the judge disagrees with it.'
      ],
      applications: [
        ['Is judicial review an appeal on the merits?', 'no, it reviews legality'],
        ['What must a claimant show to have standing?', 'a sufficient interest'],
        ['A decision no reasonable body could reach is which ground?', 'irrationality'],
        ['Which order sets a decision aside?', 'a quashing order'],
        ['Which case read an ouster clause narrowly?', 'Anisminic']
      ]
    }
  ],
  /* ============================ criminal law ============================ */
  'criminal-law': [
    {
      name: 'Actus Reus, Mens Rea and Criminal Liability', from: 'Grade 11', to: 'Advanced',
      facts: [
        ['actus reus', 'the physical element of an offence'],
        ['mens rea', 'the mental element of an offence'],
        ['coincidence', 'the requirement that the two elements meet in time'],
        ['a conduct crime', 'an offence complete on the act alone'],
        ['a result crime', 'an offence requiring a consequence'],
        ['an omission', 'a failure to act, criminal only where a duty exists'],
        ['a duty to act', 'arising from statute, contract, relationship or assumption'],
        ['R v Miller', 'the case on liability for a dangerous situation one created'],
        ['causation in crime', 'that the defendant’s act must cause the result'],
        ['a substantial and operating cause', 'the test of legal causation'],
        ['intention', 'aim or purpose, or foresight of virtual certainty'],
        ['direct intention', 'where the result is the defendant’s aim'],
        ['oblique intention', 'where the result is a virtually certain side effect'],
        ['R v Woollin', 'the case on foresight of virtual certainty'],
        ['recklessness', 'conscious taking of an unjustified risk'],
        ['R v G', 'the case establishing subjective recklessness'],
        ['negligence', 'falling below the standard of the reasonable person'],
        ['strict liability', 'an offence requiring no mens rea as to an element'],
        ['transferred malice', 'mens rea directed at one victim transferring to another'],
        ['the burden of proof', 'on the prosecution, beyond reasonable doubt']
      ],
      truths: [
        'Actus reus and mens rea must coincide in time.',
        'Recklessness in criminal law is subjective: the defendant must have foreseen the risk.',
        'Foresight of virtual certainty is evidence from which intention may be found, not intention itself.',
        'An omission is criminal only where the law imposes a duty to act.',
        'Transferred malice does not operate between different types of offence.'
      ],
      myths: [
        'A bad motive is the same as mens rea.',
        'Recklessness is judged by what a reasonable person would have foreseen.',
        'Failing to help someone in danger is always a criminal offence.',
        'Strict liability offences require no proof of anything at all.',
        'Intention and desire mean the same thing in criminal law.'
      ],
      applications: [
        ['Which case established subjective recklessness?', 'R v G'],
        ['What is the standard of proof in a criminal trial?', 'beyond reasonable doubt'],
        ['Foresight of virtual certainty relates to which case?', 'R v Woollin'],
        ['A defendant creates a fire and does nothing. Which case?', 'R v Miller'],
        ['Mens rea aimed at A that harms B is covered by what?', 'transferred malice']
      ]
    },
    {
      name: 'Homicide, Assault and the Defences', from: 'College', to: 'Advanced',
      facts: [
        ['murder', 'the unlawful killing of a person with intent to kill or cause grievous bodily harm'],
        ['grievous bodily harm', 'really serious harm'],
        ['voluntary manslaughter', 'murder reduced by a partial defence'],
        ['diminished responsibility', 'a partial defence based on an abnormality of mental functioning'],
        ['loss of control', 'the partial defence that replaced provocation'],
        ['a qualifying trigger', 'the fear or anger required for loss of control'],
        ['involuntary manslaughter', 'unlawful killing without the mens rea for murder'],
        ['unlawful act manslaughter', 'death caused by a dangerous unlawful act'],
        ['gross negligence manslaughter', 'death caused by a grossly negligent breach of duty'],
        ['R v Adomako', 'the leading case on gross negligence manslaughter'],
        ['assault', 'causing another to apprehend immediate unlawful force'],
        ['battery', 'the infliction of unlawful force'],
        ['actual bodily harm', 'harm interfering with health or comfort, more than trifling'],
        ['wounding', 'a break in the continuity of the skin'],
        ['self-defence', 'the use of reasonable force to defend oneself or another'],
        ['reasonable force', 'force proportionate to the threat as the defendant believed it'],
        ['duress', 'a defence of acting under threat of death or serious injury'],
        ['duress of circumstances', 'duress arising from the situation rather than a threat'],
        ['necessity', 'a narrow defence of choosing the lesser evil'],
        ['intoxication', 'which may negate mens rea for a specific intent offence only']
      ],
      truths: [
        'Intention to cause grievous bodily harm is sufficient mens rea for murder.',
        'Diminished responsibility and loss of control reduce murder to manslaughter, not to acquittal.',
        'Duress is no defence to murder.',
        'Self-defence is judged on the facts as the defendant honestly believed them.',
        'Voluntary intoxication is no defence to a crime of basic intent.'
      ],
      myths: [
        'Murder requires an intention to kill.',
        'A successful plea of diminished responsibility results in acquittal.',
        'Duress is available for any offence if the threat was serious enough.',
        'Being drunk is a defence to assault.',
        'Self-defence requires the defendant to have been correct about the danger.'
      ],
      applications: [
        ['What mens rea suffices for murder besides intent to kill?', 'intent to cause grievous bodily harm'],
        ['Is duress a defence to murder?', 'no'],
        ['Which case governs gross negligence manslaughter?', 'R v Adomako'],
        ['Loss of control reduces murder to what?', 'voluntary manslaughter'],
        ['Voluntary intoxication can negate mens rea for which offences?', 'specific intent offences']
      ]
    }
  ]
};
