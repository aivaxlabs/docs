Source: https://docs.aivax.net/learn/prompt-engineering/context-window-tokens-and-cost.html

An assistant can appear to read an entire conversation, yet miss something that was said earlier. It can also cost more to answer a short follow-up than a longer first question. Both behaviours become easier to understand when you distinguish the visible chat from the full input the application sends to the model.

Models work with **tokens**, small pieces of encoded content. Each request also has a **context window**, the amount of information the model can work with at once. Think of the context window as a desk: instructions, reference papers and conversation notes all compete for space, and there must still be room to write the answer. A larger desk helps, but it does not make every paper relevant.

## Tokens are not the same as words

A **tokenizer** is the component that divides text into tokens. Depending on the model, a token can represent a common word, part of a word, punctuation or another fragment. An unfamiliar product name may split into several pieces. Spaces, numbers and formatting also affect the count. Text in different languages can require different numbers of tokens for the same meaning.

This is why “keep the prompt under a certain number of words” is only a rough planning rule. The model's tokenizer and the service's reported usage give a more useful count. Images, audio and other non-text inputs can have additional processing and metering rules; do not assume their cost can be inferred from a visible caption.

> **Interactive demo: Try it: change the text, not just its length.** This interactive demo is available on the web page. Try a short everyday sentence, then replace one word with a long invented product name. This is a simplified illustration of token splitting, not the exact tokenizer or billing meter of any model. Do not enter confidential information into learning examples.

Counting tokens gives services a practical way to describe input size, output size and text-generation usage. It relates more closely to what the model processes than pages or chat bubbles do. A one-page document can contain dense tables; a short-looking chat may carry extensive instructions behind the scenes. Token counts make those hidden differences visible.

**Input tokens** are the content presented to the model. **Output tokens** are the content it generates. Different rates or rules can apply to each, and some reasoning models also account for internal reasoning tokens. Check the selected model's documented behaviour rather than assuming that the visible reply represents all generated usage.

## Divide the desk before you fill it

The context budget is shared, not a separate allowance for every component. For many models, input and generated output must fit within the model's overall context limit, with a separate maximum for output. Providers can expose these limits differently, so check both. Asking for a long answer does not automatically reserve enough room for it.

The following fictional allocation is deliberately small so that the arithmetic is easy to follow. These values are illustrative only: they are not AIVAX plan allowances, product limits or a recommended production configuration.

- **8,000** — illustrative total token budget

- **6,000** — illustrative input allocation

- **2,000** — illustrative answer reserve

Within that input allocation, include the standing instructions, descriptions of available tools, retrieved knowledge, relevant history and the new question. Reserve space for likely tool results too, if the assistant will request them before answering. A tool that returns a large document can unexpectedly consume more space than the customer's entire chat.

> **Interactive demo: Try it: a context budget fills up (illustrative).** This interactive demo is available on the web page. Change the available space and watch which blocks remain. This demonstration removes the oldest blocks first and always keeps the last one. It illustrates a possible trimming policy, not a universal model behaviour or a recommendation to discard system instructions. Real applications must protect essential rules and dependencies explicitly.

A useful context budget reflects the task. A policy assistant may need substantial reference material but little conversation history. A drafting assistant revising a proposal needs the current draft and recent editorial decisions, not every abandoned version. Supplying less irrelevant material can make the evidence easier to find as well as reduce input usage.

A large window is capacity, not a guarantee of attention. A model may still overlook a small exception buried inside a long document. Put critical instructions clearly, retrieve the sections that answer the question, and test whether the assistant finds the right evidence in realistic inputs. Do not solve every missed fact by attaching more material.

## Understand what happens at the limit

When a request is too large, the provider may reject it. Alternatively, the surrounding application may shorten, summarise or remove content before sending it. Some products expose configurable truncation, meaning that part of the input is cut off. None of these behaviours should be treated as the model deciding to remember the most important details.

If earlier context disappears, a follow-up such as “Use the second option” may become impossible to interpret. Removing half of a tool exchange can also leave an incomplete record of what was requested and returned. Preserve related messages together, and ask a clarifying question when the surviving context no longer supports a safe answer.

An **output limit** is a different boundary: it caps how much the model can generate. A reply that stops mid-sentence might have reached that limit even when the input fitted comfortably. Check the reported completion status before treating a cut-off JSON object or unfinished recommendation as a final result.

> [!WARNING]
> Silent context loss can change a decision. Protect the rules, evidence and customer constraints needed for the current task; if they cannot be retained, pause or narrow the task rather than pretending the briefing is complete.

## Use three different controls

**Trimming** means removing content that no longer serves the task. Good candidates include repeated greetings, superseded drafts and duplicate search results. Keep the latest confirmed requirement, the relevant source and enough recent conversation to understand references. Removal should follow a policy, not simply delete whatever is easiest to cut.

**Summarising** compresses useful history into a shorter account. For an internal assistant, a summary might retain the requested outcome, decisions already confirmed, unresolved questions and any constraints. Mark uncertainty as uncertainty. If the original message said “perhaps next month,” a summary must not transform it into a confirmed deadline. Keep important evidence available for checking.

**Short, but missing the constraint**

“Customer wants a replacement.”

The summary drops the customer's requirement that delivery must not occur before they return from travel.

**Short and decision-ready**

“Customer requests a replacement but has not confirmed a suitable delivery date. Ask before arranging delivery.”

The summary preserves the unresolved condition that changes the next action.

**Caching** reuses previous work rather than processing the same material in the same way every time. Input caching can reduce repeated processing for supported, unchanged content; response caching can reuse an answer when the request and relevant state genuinely match. These are different mechanisms with different freshness and privacy requirements.

Caching does not usually make the cached text disappear from the context window. It is primarily a processing or cost optimisation, not extra memory capacity. A reused answer can also become wrong when a policy or order status changes. Explore those trade-offs in [cost optimisation and caching](https://docs.aivax.net/learn/production/cost-optimization-and-caching.md).

## Estimate a workflow, not one chat bubble

For a simple text call, an estimate starts with input usage multiplied by its applicable rate, plus output usage multiplied by its applicable rate. A real business conversation may make several model calls: the first answer, a tool-related follow-up, a correction and a final response. Include those calls, any separately metered capabilities and retries when estimating the whole workflow.

> **Interactive demo: Try it: estimate text cost with illustrative assumptions.** This interactive demo is available on the web page. Treat all values in this calculator as illustrative assumptions, not current prices or a bill forecast. Compare a compact briefing with a long replayed history. This simplified estimate does not model every tool, cache, reasoning, retry or multi-call charge.

A practical first measurement is a representative set of completed tasks: how much input was sent, how much output was generated, how many calls occurred and whether the user actually got a correct answer. Reducing cost per call is not an improvement if customers must repeat the task. Compare cost per successful outcome as well as raw token totals.

Related: for AIVAX, [see current pricing](https://docs.aivax.net/docs/pricing.md) when turning measurements into a budget. Keep the measurements and the price assumptions separate so an estimate can be updated without rewriting the task design.

**What's next:** Explore [short-term and long-term memory](https://docs.aivax.net/learn/prompt-engineering/memory.md) to decide what belongs in the current conversation and what should be stored for later recall.

**Knowledge check.** Which statement is the safest basis for planning a model request?

1. Input caching automatically expands the context window
2. Instructions, knowledge, history and the answer need a shared budget
3. A token is always exactly one word
4. Every provider silently removes the oldest messages

Answer: option 2. The context window is a shared working space. Tokenisation, output limits and overflow handling vary, while caching primarily changes repeated processing rather than the amount of context the model can hold.
