Source: https://docs.aivax.net/learn/safety/privacy-lgpd-gdpr.html

A customer asks a support assistant to reschedule a delivery. Their message includes a name, home address and an explanation involving a medical appointment. Only part of that information is needed to arrange the delivery. Copying the entire conversation into every connected system increases exposure without improving the service.

Privacy starts with this ordinary question: what does each part of the workflow actually need to know? It is not simply a checkbox on a model provider's settings page. Messages may pass through a chat channel, your application, a model provider, a business system and a support log. Each copy needs a purpose, appropriate protection and a planned lifetime.

> [!IMPORTANT]
> This unit is educational, not legal advice. LGPD and GDPR obligations depend on your organisation, users, purposes and jurisdiction. Consult a qualified privacy professional for decisions about your deployment.

## Know what information you handle

**Personal data** is information relating to an identified or identifiable person. A name is an obvious example, but an order history, device identifier or unusual job description can also identify someone when combined with other information. Removing a name does not necessarily remove the connection to a person.

Some personal information receives additional protection. Under Brazil's **LGPD**, the General Personal Data Protection Law, this includes categories such as health and biometric data in defined circumstances. The European Union's **GDPR**, the General Data Protection Regulation, has comparable **special categories** with its own definitions and conditions. Do not assume that the categories or exceptions are identical.

- **Visible information** — A message, photograph or attachment may contain personal details. Ask users for the minimum information needed instead of inviting them to upload everything.

- **Information around the message** — Account references, conversation histories and technical logs can reveal who a person is or what they did. Privacy controls must cover these records too.

- **Inferences about people** — An agent's summary may infer health, financial circumstances or personal preferences. Generated information can still be personal data and can also be wrong.

Business secrets and passwords also require protection, even when they are not personal data. A privacy review and a security review overlap, but neither replaces the other. For example, encrypting a record protects it against some unauthorised access; it does not establish a valid reason to collect the record in the first place.

## Start with purpose and a legal basis

A **legal basis** is the reason the law permits a particular use of personal data. In plain words, it answers “Why are we allowed to do this?” Depending on the law and circumstances, examples include fulfilling a contract, meeting a legal obligation, valid consent, or a properly assessed legitimate interest. These are not interchangeable labels to choose after collecting the data.

Consent means a person makes a valid, informed choice under the applicable requirements. It is not a universal shortcut, and a vague sentence such as “By chatting, you accept everything” does not settle the issue. Processing sensitive data can require additional conditions beyond the basis used for ordinary personal data.

A **controller** decides why and how personal data is processed. A **processor** handles it on the controller's instructions. A business deploying a customer assistant will commonly act as controller for that customer workflow, while service providers may act as processors for specified activities. Responsibilities depend on actual roles and agreements, not just the label in a sales brochure.

| Shared concern | LGPD, in plain words | GDPR, in plain words |
| --- | --- | --- |
| Purpose and necessity | Explain the purpose and limit processing to what is needed. | State a specific purpose and minimise the data used. |
| Legal justification | Identify an applicable legal basis and sensitive-data conditions. | Identify an applicable lawful basis and any additional special-category condition. |
| Individual rights | Provide ways to exercise applicable rights, including access and deletion where available. | Provide ways to exercise applicable rights, including access and erasure where available. |
| Accountability | Be able to demonstrate appropriate measures and responsibilities. | Be able to demonstrate compliance and appropriate safeguards. |
| International transfers | Assess applicable transfer rules and safeguards. | Assess applicable transfer rules and safeguards. |

These similarities help organise questions; the table does not mean the laws have identical scope, deadlines, exceptions or enforcement. Your privacy owner should document the details that apply to your service before it handles real conversations.

## Minimise before sending

**Data minimisation** means using only the personal data necessary for the stated purpose. A model asked to classify a delivery issue often needs the problem description, not the customer's full address. An authenticated business tool can use the address later, if the actual delivery change requires it.

**Masking** replaces identifying details with placeholders. **Pseudonymisation** replaces identifiers while preserving a way to reconnect the record to a person, such as a separate lookup table. That data generally remains personal data. **Anonymisation** aims to prevent identification under the applicable legal standard; replacing a name alone is not enough to claim it.

**Raw message: illustrative placeholders**

“My name is [FULL NAME], and I live at [HOME ADDRESS]. Please move my delivery because I have [MEDICAL DETAIL]. My order is [ORDER REFERENCE].” Sending all of this to a model for topic classification is unnecessary.

**Masked message for classification**

“The customer wants to reschedule a delivery for a personal reason.” The application retains the verified order reference separately for an authorised delivery tool. The model can identify the task without seeing the omitted details.

Perform masking before transmission, not only when displaying logs afterwards. Review attachments and conversation summaries too: either can reintroduce a detail removed from the newest message. If placeholders must be restored, keep that mapping in a protected system and restore only the fields needed for the authorised output.

Over-removal can also damage the task. A language preference may be needed to respond clearly, and an accessibility request may be essential to arrange suitable service. The goal is a justified minimum, not deleting context indiscriminately. Test whether the reduced message still supports a correct answer.

## Make a data-handling checklist

1. **Map the journey**

List where messages, attachments, model inputs, outputs and logs travel. Include external services and staff access, not only the chat interface.

2. **Justify each field**

Record the purpose, legal basis, required notice and responsible owner. Remove information that does not help complete the authorised task.

3. **Protect what remains**

Apply masking before transmission, restrict access and review provider settings. Avoid copying sensitive messages into broad debugging or analytics systems.

4. **Set retention and deletion**

Choose how long each category must be kept, document exceptions and implement deletion. Include backups, exports, search indexes and provider-held copies where applicable.

5. **Rehearse a rights request**

Verify the requester's identity proportionately, find the relevant records and route the request to its owner. Test access and deletion handling without exposing another person's data.

**Retention** is how long information is kept. Different purposes may justify different periods: an unresolved support case and a legal accounting record need not share one schedule. “Keep everything just in case” is not a useful policy. Neither is promising immediate deletion when a documented legal duty requires some records to remain.

## Check providers, locations and agreements

**Data residency** describes where data is stored or processed. It is not the same as a complete international-transfer assessment. A chosen storage region may not describe remote support access, model processing, backups or subcontractors. Ask which services touch the data and verify the current written commitments for the configuration you actually use.

A **data processing agreement**, or DPA, records responsibilities between a controller and processor. Review instructions, security measures, subprocessors, assistance with rights requests, incident handling and end-of-service deletion. A **subprocessor** is another service engaged to process data on a processor's behalf. A provider list is useful evidence, but does not replace the required contractual and operational checks.

**Does disabling training mean nothing is retained?**

No. Training, conversation storage, security logging and temporary processing are different activities. Review each separately. A setting that stops future collection may not delete past records or reverse completed model training. Promise users only the controls and rights your complete service can actually deliver.

Related on AIVAX: read the [Privacy Policy](https://docs.aivax.net/docs/legal/privacy-policy.md), [Third-Party Processors](https://docs.aivax.net/docs/legal/third-party-processors.md) and [Data Collecting](https://docs.aivax.net/docs/data-collecting.md) documentation together. The optional semantic data collection program has a specific scope and is disabled by default; review its conditions rather than treating it as a universal setting for all processing.

What's next: examine unequal outcomes in [Bias, fairness and responsible AI](https://docs.aivax.net/learn/safety/bias-fairness-responsible-ai.md).

**Knowledge check.** A model only needs to classify a delivery problem. Which approach best follows data minimisation?

1. Remove names and assume all remaining text is anonymous
2. Send the full message and hide details only in the dashboard
3. Send only the information needed for classification and keep authorised identifiers separate
4. Keep every conversation forever in case a customer returns

Answer: option 3. Minimisation reduces exposure before processing. Removing a name does not guarantee anonymity, and masking only the display leaves the original transmission unchanged.
