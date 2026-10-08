---
title: Authentication and permissions for tools
linkTitle: Authentication and permissions
description: "Give an agent enough access to help a user without handing it the unrestricted authority of the whole organisation."
weight: 30
duration: 12
objectives:
  - Distinguish authentication from permission to perform an action.
  - Compare application API keys with delegated per-user tokens.
  - Apply least privilege and read-only access to a tool design.
  - Identify when approval, audit records and secret protection are required.
---

An assistant that can explain a refund policy is useful. An assistant that can issue refunds is acting inside your business. Before connecting that tool, you need to answer a more important question than “Can the model call it?”: “Whose authority is being used, and what does that authority allow?”

Think of an agent as a temporary employee working on someone's behalf. A badge may let the employee enter the building, but it should not unlock every filing cabinet, approve every invoice or sign every contract. Good tool security keeps identity, permitted access and approval separate, even when the conversation makes them feel like one step.

## Establish who is acting

**Authentication** checks identity: it is the digital equivalent of verifying a badge. **Authorisation** checks permission: it decides which doors that badge opens. Passing authentication does not mean that every requested action is allowed. A recognised customer may read their own orders but not another customer's orders, and an authenticated employee may still lack permission to change payroll.

There are often several identities in an agent interaction. The application has its own technical identity, the person has a user identity, and a tool request has a business purpose. The system needs to preserve the relationship between them. “The support application made this request” is not enough to establish which customer's record it should access.

A chat message is not proof of identity. “I am the account owner” is just text until the application verifies it through an appropriate sign-in or account verification process. Similarly, a tool argument supplied by the model must not determine access on its own. The business system should derive the allowed account from trusted application context, then check the requested record against it.

{{< cards >}}
{{< card title="Identity" icon="user" >}}
Who is the application acting for? Use verified user context, not a name or account claim written in the conversation.
{{< /card >}}
{{< card title="Permission" icon="lock" >}}
What may that identity do? Enforce access to both the operation and the particular records involved.
{{< /card >}}
{{< card title="Approval" icon="check" >}}
Has an authorised person agreed to this specific consequential action? Approval does not replace identity or permission checks.
{{< /card >}}
{{< card title="Audit record" icon="list-check" >}}
What happened, under whose authority, and with what result? Keep enough evidence for investigation without copying unnecessary private content.
{{< /card >}}
{{< /cards >}}

## API keys and per-user tokens

An **API key** is a credential a program presents when calling a service. A **credential** is evidence used to obtain access, such as a password or access token. Many API keys identify an application or account rather than an individual end user. That makes them convenient for server-to-server work, but dangerous if the application treats every user as entitled to everything the key can reach.

A **per-user token** is a credential associated with a particular user's delegated access. **Delegation** means allowing an application to perform a defined set of actions on that user's behalf. A calendar assistant, for example, might receive permission to read one person's calendar without receiving the organisation's administrative credentials. Tokens can have expiration times and mechanisms for withdrawing access; the details depend on the service.

{{< compare >}}
{{< side title="Application API key" >}}
Often suits background operations owned by a service account. Your application must still enforce which users and records may use that authority. A shared key does not create per-user boundaries automatically.
{{< /side >}}
{{< side title="Delegated per-user token" >}}
Can preserve the user's access boundary in the connected service. It requires a sign-in and consent flow, secure storage, and handling for expiry or withdrawn permission.
{{< /side >}}
{{< /compare >}}

Neither credential type is automatically safe. A broadly privileged user token can be excessive, and a narrowly restricted service credential can be appropriate. Choose according to who owns the task. An overnight inventory report may belong to a service account; a personal calendar change should normally preserve the requesting person's identity and permissions.

When access expires, do not quietly switch to a more powerful shared account. Ask the user to reconnect or route the task to the responsible operator. Otherwise a routine authentication failure can become an unexpected expansion of authority. Make loss of access an understandable product state, not an invitation for the model to improvise.

## Give the smallest useful permission

**Least privilege** means granting only the access required for the task, for only as long as it is needed. A **scope** is a named boundary on that access, such as reading tickets or creating drafts. Some services offer fine-grained scopes; others require your application to enforce additional restrictions. Do not assume a scope exists just because its name would be convenient.

Start with **read-only** access: the assistant may inspect permitted information but cannot change it. Reading is not risk-free, because it can expose confidential information. However, it separates mistakes in interpretation from mistakes that alter the business. Once reading works reliably, add the smallest needed write capability and test it independently.

| Permission level | Example | Boundary to enforce |
| --- | --- | --- |
| Read permitted records | Check the current user's order status | Restrict records and fields to that user |
| Prepare a draft | Draft a customer reply | Do not send or publish it automatically |
| Make a limited change | Add a note to an assigned ticket | Restrict eligible tickets and allowed fields |
| Perform a consequential action | Send a refund or remove access | Check policy and require appropriate approval |
| Administer the service | Manage organisation-wide access | Keep separate from routine assistant work |

The levels are a design aid, not a universal permission system. A draft saved to a shared workspace may already disclose information, and a small-looking edit may have legal consequences. Judge the actual effect, including who can see the result, whether money moves and whether reversal is possible. Avoid bundling reading, editing and deleting into one vaguely named tool.

## Put approval at the right point

Approval should happen after the proposed action is clear and before the consequential operation executes. Asking “May I help you?” at the start of a conversation does not authorise an unspecified later payment. Show the relevant record, recipient, amount where applicable, and expected effect in language the approver can verify.

{{< steps >}}
{{< step title="Verify the user and permitted task" >}}
Establish identity outside the model's free-form text. Confirm that both the operation and the target record fall within the user's access.
{{< /step >}}
{{< step title="Prepare a concrete proposal" >}}
Gather the required facts and describe exactly what would change. Keep preparation separate from execution wherever practical.
{{< /step >}}
{{< step title="Obtain meaningful approval" >}}
Ask an appropriately authorised person to confirm the specific proposal. If the target or effect changes, the old approval should not silently cover the new action.
{{< /step >}}
{{< step title="Execute and record the outcome" >}}
Recheck material conditions, perform the approved action and report the actual result. Preserve a record linking the request, authority, approval and outcome.
{{< /step >}}
{{< /steps >}}

These controls belong in application logic, not only in prompts. A prompt can tell the model to ask before sending a message; the sending tool should still reject a request that lacks the required approval. For more on choosing review points, see [human-in-the-loop](../advanced-agents/human-in-the-loop.md).

## Keep secrets out of conversations

Never put private API keys, passwords or access tokens in prompts, tool descriptions or ordinary tool results. The model does not need to read the credential to use a properly connected service. The application attaches the credential during the authorised request, outside the conversational content.

Store secrets in a protected configuration or secret-storage service with access limited to the components that need them. Keep them out of browser code, screenshots and routine logs. If a secret is disclosed, removing the visible text is not enough: withdraw or replace the credential and investigate its use. Avoid asking customers to paste passwords into chat as a shortcut around a missing sign-in flow.

{{< accordion title="Should every tool call require a person to click Approve?" >}}
Not necessarily. Repeated approval for harmless, well-bounded reads can train people to click without thinking. Match the control to the real consequences. An approval policy should identify the actions, circumstances and people that require intervention, rather than relying on the model to decide what feels risky.
{{< /accordion >}}

{{< accordion title="What should an audit record contain?" >}}
Record the acting identity, operation, relevant record reference, decision, time and outcome, with enough connection information to follow the request. Avoid logging credentials or entire conversations by default. Protect access to audit records and define how long they are retained.
{{< /accordion >}}

An **audit log** is a record used to reconstruct actions and decisions. It helps answer whether a failure came from the model's request, a permission decision or the connected service. Design this evidence before an incident; [logs, traces and monitoring](../quality/logs-traces-and-monitoring.md) explain how to connect the pieces.

**Related:** On AIVAX, account access uses API keys, with different intended uses for public and private keys. The [authentication guide](../../docs/authentication.md) documents those boundaries. Do not assume that the general delegated-token patterns in this unit are automatically provided by every integration.

What's next: apply these identity boundaries when [integrating channels](integrating-channels.md) such as web chat, messaging, e-mail and voice.

{{< quiz options="Let the model decide which customer account to access from the user's message | Use one unrestricted key because the assistant has a careful prompt | Verify the user, enforce narrow access in software and obtain specific approval for consequential actions" answer="3" explanation="Prompts can guide behaviour, but trusted application and business-system checks must enforce identity, record access and approval requirements." >}}
Which design best protects a customer-support tool?
{{< /quiz >}}
