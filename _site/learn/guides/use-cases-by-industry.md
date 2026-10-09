Source: https://docs.aivax.net/learn/guides/use-cases-by-industry.html

An agent that helps a retailer find a parcel and an agent that helps a school explain enrolment share much of the same structure. Both need clear instructions, approved information, appropriate access, and a route to a person. Their risks are different, however. A wrong shop opening time is inconvenient; a wrong clinical instruction can cause serious harm.

Use this guide as a menu of bounded projects, not a catalogue of promised returns. A **use case** describes a particular person trying to achieve a particular outcome. “AI for healthcare” is an industry label. “Help an authorised receptionist find the published appointment preparation leaflet” is a use case that can be designed and tested.

## Start with the work, not the industry label

Useful first projects usually involve repeated questions, an identifiable source of truth, and outcomes that someone can verify. A **source of truth** is the authoritative system or document for a fact. It might be an order system for shipment status or an approved policy for reimbursement rules. The model's general knowledge is not a substitute for either.


- **Find and explain** — Search approved information and explain it clearly. The main work is preparing sources, respecting permissions, and showing supporting evidence.

- **Prepare for review** — Draft a summary, form, or checklist for a person. The reviewer must have enough evidence and time to check it, rather than merely approve automatically.

- **Take a bounded action** — Use a tool, a defined software operation, to change a record or request a service. Permissions, confirmation, duplicate prevention, and recovery become essential.




**Risk** combines what could go wrong with how serious the consequences would be. “Only answering questions” can still be high risk if the answer influences treatment, credit, employment, or a legal deadline. Evaluate the consequence, not just whether the agent presses a button.

## Explore the industries

Each tab gives three possible uses, their usual information and tools, and a boundary for the first version. These examples are fictional design patterns, not statements that any specific organisation has deployed them.


**Retail and e-commerce**

**Use cases:** explain returns policies, look up an authenticated shopper's order, and prepare a support ticket for a damaged item. The needed knowledge includes current delivery terms, product instructions, and approved warranty rules. Typical tools read authorised orders and create confirmed tickets.

**Main risk:** exposing another customer's details or inventing a refund commitment. Keep refunds and payment changes outside the first version, and require identity checks for private orders. A product description does not prove that an item is currently in stock. The live inventory system owns that fact.


**Finance**

**Use cases:** explain published account-service procedures, help staff find compliance guidance, and prepare a document-completeness checklist. Knowledge includes approved product terms and current internal procedures. Tools may read permitted case status or submit a request for human review.

**Main risk:** misleading financial guidance or unauthorised disclosure. Keep the pilot away from autonomous credit, investment, and eligibility decisions. A checklist can identify missing paperwork without deciding whether a customer qualifies. Product suitability and regulated advice require the organisation's appropriate professional and compliance controls.


**Healthcare administration**

**Use cases:** explain clinic opening hours, locate published appointment instructions, and help an authorised user request a scheduling change. Knowledge includes approved administrative leaflets and service information. Tools may retrieve available appointments or submit a change for confirmation.

**Main risk:** drifting from administration into diagnosis or mishandling health information. Do not diagnose, interpret test results, or recommend treatment. Questions about symptoms need the service's clinician-approved route; urgent concerns need its appropriate urgent-care guidance. Even appointment details may reveal sensitive information and need careful access controls.


**Education**

**Use cases:** explain enrolment procedures, help students locate course resources, and draft practice questions for an educator to review. Knowledge includes current course materials, calendars, and student-service policies. Tools may retrieve an authorised timetable or create a support request.

**Main risk:** exposing student information or presenting inaccurate learning material as authoritative. A general assistant should not determine grades, discipline, or admissions. For minors, account for age-appropriate communication and applicable consent requirements. Give students a teacher or service-desk route when the material is confusing or incomplete.


**Real estate**

**Use cases:** answer questions from approved property listings, collect viewing preferences, and prepare a maintenance request. Knowledge includes current listing facts, viewing rules, and tenant-service procedures. Tools may check viewing availability or create a confirmed maintenance ticket.

**Main risk:** discriminatory steering or unsupported claims about a property. Do not infer suitability from protected characteristics or invent neighbourhood safety, legal status, or investment returns. Route legal and financing questions appropriately. Listing availability can change, so verify it before presenting a viewing as confirmed.


**Logistics**

**Use cases:** look up an authorised shipment, explain delivery-exception procedures, and prepare an incident summary for dispatch staff. Knowledge includes service terms and current operational instructions. Tools may retrieve tracking events and submit an exception case.

**Main risk:** confusing an estimate with a commitment or allowing a dangerous operational instruction. A missing scan does not establish that a shipment is lost. Keep routing changes, hazardous-goods decisions, and delivery-address changes under the relevant human and system controls. State the time of the latest reliable update.


**Professional services**

**Use cases:** prepare a client-intake summary, search approved working methods, and draft a project-status update for review. Knowledge includes service descriptions, templates, and authorised project documents. Tools may read permitted milestones or create a draft record.

**Main risk:** mixing confidential information between clients or presenting a draft as expert advice. Separate client access boundaries and check every supporting source. Lawyers, accountants, and other professionals remain responsible for advice within their remit. A well-written draft is still a draft until the designated person reviews it.


**Public sector**

**Use cases:** explain published application steps, help residents locate the right department, and provide an authenticated application-status update. Knowledge includes current forms, service criteria, and accessible guidance. Tools may retrieve authorised status or create a service request.

**Main risk:** misleading people about entitlements, deadlines, or rights. Preserve accessible non-chat channels and human review. Do not let the agent make binding eligibility or enforcement decisions in an introductory pilot. Clearly distinguish general guidance from an official determination and explain how to obtain authoritative assistance.





## Compare the boundaries before comparing benefits

The same technical action can carry very different consequences. Creating a draft maintenance ticket is not equivalent to approving a financial transaction. A **human review** must occur before the consequential action, with enough context to judge it; reading a log afterwards is monitoring, not approval.

| Pattern | Suitable first output | Boundary to test |
|---|---|---|
| Retail support | Supported policy answer | Customer-specific information stays private |
| Finance administration | Completeness checklist | No implied approval or personalised advice |
| Healthcare administration | Published service information | No diagnosis or treatment recommendation |
| Education support | Resource explanation | Student records and assessment decisions stay protected |
| Real estate service | Confirmed viewing request | No discriminatory filtering or invented listing facts |
| Logistics support | Evidence-based status summary | No guaranteed date without a valid commitment |
| Professional services | Labelled draft | No cross-client information leakage |
| Public service guidance | Clear next-step explanation | No false official determination |

For the underlying design, read [Adding guardrails](https://docs.aivax.net/learn/agents/adding-guardrails.md). For potentially consequential workflows, [Human in the loop](https://docs.aivax.net/learn/advanced-agents/human-in-the-loop.md) explains why approval must be an enforced stage rather than a polite suggestion in the prompt.

## Estimate value from local evidence

**Value** might mean shorter searches, fewer repeated questions, better completed forms, or less rework. Start with a baseline: observe the current process before introducing the agent. Include the time spent preparing documents, reviewing outputs, maintaining integrations, and handling mistakes.


**Illustrative weekly time recovered by use case type**

| Item | Value |
| --- | --- |
| Finding approved guidance | 12 hours |
| Preparing reviewable summaries | 9 hours |
| Completing routine intake | 6 hours |
| Routing service requests | 4 hours |

Invented planning example, not measured savings or an industry comparison. Real net savings must subtract review, maintenance, and rework.



The chart is deliberately organised by work type, not by sector. A small firm with poorly maintained documents might gain less from an assistant than from repairing its knowledge base first. Conversely, a modest retrieval assistant can be useful where staff repeatedly search a clear, reliable reference library.

## Questions to settle before a pilot

**Should we automate the highest-volume task first?**

Volume matters, but so do consequence and recoverability. Prefer a frequent task with reliable evidence, limited permissions, and an easy route back to a person. A high-volume task that changes legal or financial outcomes may need much more preparation than a lower-risk information service.


**Can we use the same agent across departments or clients?**

Shared instructions may be reusable, but access rights and information must remain correctly separated. Confirm the identity and permitted scope before searching or acting. Do not rely on the model to remember which confidential passages it should hide from each user.


**What if the sector is regulated?**

Involve the organisation's qualified legal, compliance, privacy, and domain specialists before launch. This guide is not a determination of applicable law. They should define permitted uses, required records, retention, disclosures, accessibility, and human oversight for the actual jurisdiction and service.



Select one use case, one accountable owner, and a small set of measurable outcomes. Use [Testing and evaluating agents](https://docs.aivax.net/learn/quality/testing-and-evaluating-agents.md) to turn the main risks into concrete test cases. Only expand after the first boundary works under ordinary mistakes and deliberate attempts to bypass it.

What's next: keep [the glossary and cheat sheet](https://docs.aivax.net/learn/guides/glossary-and-cheat-sheet.md) nearby while planning your own bounded project.

**Knowledge check.** Which characteristic most strongly supports choosing a first agent pilot?

1. It promises the largest savings regardless of consequences
2. It has reliable sources, clear ownership, limited permissions, and a useful measurable outcome
3. It removes every human from a complex decision

Answer: option 2. A good first project combines usefulness with boundaries that can be tested and operated safely; volume and ambition alone do not establish readiness.
