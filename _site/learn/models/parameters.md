Source: http://localhost:1313/learn/models/parameters.html

Imagine asking a colleague to write an announcement. You can request a conventional version, invite unusual wording, or limit the response to a short paragraph. Model **parameters** are settings that influence similar aspects of generation. They do not supply missing company facts, grant permission to perform actions, or guarantee that an answer is true.

A language model writes using **tokens**, small pieces of text that can be words, parts of words, or punctuation. At each step it estimates possible next tokens. Some settings change how a token is selected; others limit how much the model can produce. Understanding that distinction helps you change the right control instead of adjusting every setting when an answer disappoints.

## Temperature controls variation

**Temperature** changes how strongly generation favours the most likely next tokens. A lower value concentrates the choice around likely continuations. A higher value gives less likely continuations more opportunity. Think of choosing lunch: low temperature favours familiar options; higher temperature makes unusual choices more likely. It does not make every unusual choice a good one.

For an assistant extracting delivery dates from messages, repeatable wording is useful. A low temperature is a sensible starting point. For a writer exploring campaign headlines, more variation can produce a wider range of drafts. Even then, approved product claims must stay fixed. Creativity should change expression, not invent features or promises.

> **Interactive demo: Try it: change the spread of possible words.** This interactive demo is available on the web page. Move the temperature control and sample several times. This simplified illustration uses invented candidates and probabilities; it does not contact a real model. Notice that widening the choices can produce variety without improving usefulness.

A temperature of zero, when supported, usually requests the most likely continuation rather than a random draw. Do not treat it as a guarantee of identical output. Provider implementation, model updates, and other execution details can still affect results. More importantly, an answer can be consistently wrong: low variation is not the same thing as high accuracy.

**Low-temperature style**

**Same prompt:** “Write one friendly opening for a message announcing our revised help centre.”

“The revised help centre is ready to help you find answers.”

This illustrative draft stays close to conventional wording.

**Higher-temperature style**

**Same prompt:** “Write one friendly opening for a message announcing our revised help centre.”

“A clearer route to answers starts with our revised help centre.”

This illustrative draft explores a different expression. A real run might still return conventional wording.

Notice what the comparison does not show: more factual knowledge or better policy compliance. If the help centre has not launched, neither style should announce that it has. Fix the instruction or source information before adjusting the sampling settings. **Sampling** is the process of selecting from the model's possible next tokens.

## Top-p limits the candidate pool

**Top-p**, also called nucleus sampling, selects a pool of likely next tokens whose combined probability reaches a chosen threshold. The model then samples from that pool. With a lower threshold, unlikely candidates tend to be excluded. With a threshold near one, more candidates remain eligible. The pool can contain different numbers of tokens at different positions in the answer.

Temperature and top-p are related controls, but they do different things. Temperature reshapes the distribution of probabilities; top-p trims the pool from which sampling happens. Top-p does not mean “use this percentage of the vocabulary,” and it is not a confidence score for the final answer. A value of 0.9 does not mean the answer is 90 percent correct.

For initial experiments, keep one control at its supported default while changing the other. If you lower both at once and the answer becomes repetitive, you will not know which change caused it. Many teams begin by adjusting only temperature. Some models restrict or do not support these controls, so check the chosen model rather than copying settings from an unrelated example.

## Max tokens sets a ceiling, not a writing brief

An **output token limit** caps the generation budget. Depending on the model and interface, the setting may be called `max_tokens` or `max_completion_tokens`. These names are not universally interchangeable. For some reasoning models, a completion budget covers internal reasoning as well as the visible reply, leaving fewer tokens for the text the user sees.

The limit is not a promise that the model will write exactly that amount. It can finish early, or hit the ceiling before finishing a sentence. A ceiling that is too small can cut off an important qualification or leave a machine-readable result incomplete. A very large ceiling permits longer generation; it does not force the model to use it.

Ask for the desired length in ordinary language, then set a budget with room for a complete answer. “Give a short summary followed by the action owner” describes the result better than a token limit alone. Measure typical outputs in your actual languages: a token is not a fixed number of characters or words, and different text can consume different amounts.

- **Instruction** — “Use a short paragraph and state what is missing.” This describes the shape and purpose of the answer.

- **Generation budget** — The output limit restricts how much the model may generate. Leave enough room for a complete response and any supported reasoning budget.

- **Completion check** — Your application checks whether generation ended normally and whether the required result is complete before using it.

For a back-office extractor, a shortened result should be treated as incomplete, not silently accepted because it contains some plausible fields. For a customer-facing answer, the application should avoid presenting a broken sentence as a finished recommendation. Increasing the ceiling may help with truncation, but it will not fix an unclear request that encourages unnecessary detail.

## Starting settings by use case

The following are qualitative starting points, not universal product defaults. Use the model's supported range and change one setting at a time. Where a model has fixed sampling behaviour, focus on instructions and evaluation rather than trying to force unsupported values.

| Use case | Temperature direction | Top-p starting approach | Output budget approach |
| --- | --- | --- | --- |
| Extract fields from an invoice | Low | Leave at the supported default | Enough for every required field |
| Answer from a policy document | Low | Leave at the supported default | Enough for answer, evidence, and uncertainty |
| Draft a customer reply | Low to moderate | Leave unchanged initially | Match the requested response format |
| Explore marketing headlines | Moderate to higher | Adjust only if testing justifies it | Enough for the requested alternatives |
| Analyse a multi-step problem | Follow the model's guidance | Follow the model's guidance | Allow for reasoning and the final answer |

Start with a saved baseline: a configuration you can return to. Keep the prompt, source material, and test cases fixed while comparing a change. Evaluate several outputs, including awkward cases. Otherwise a lucky answer can look like an improvement, or a source-document change can be mistaken for a benefit from temperature.

## Stop sequences and penalties

A **stop sequence** is a configured piece of text that tells generation to stop when it appears, where the model supports it. This can help in carefully designed text protocols. It can also cut a valid answer short if the same text occurs naturally. Using a common word or punctuation mark as the stop marker is especially risky.

**Presence penalties** generally discourage using tokens that have already appeared; **frequency penalties** generally discourage them more as they repeat. Exact behaviour and supported ranges vary. These controls can reduce repetitive prose, but legitimate repetition matters in names, legal language, and field-based output. Start with the supported defaults unless repetition is a measured problem.

**Should I raise penalties whenever the answer repeats itself?**

Not immediately. First check whether the prompt asks for the same point several times or whether duplicated source passages encourage repetition. A penalty can suppress necessary terms without solving the underlying instruction problem. Test the change on cases where a product name or field label must appear again.

On AIVAX, these settings are part of supported [inference parameters](http://localhost:1313/docs/inference/inference.md) and reusable [AI gateway configuration](http://localhost:1313/docs/inference/ai-gateway.md). Related: check those guides for model-specific restrictions rather than assuming every parameter works for every model.

What's next: explore [multimodality](http://localhost:1313/learn/models/multimodality.md), where the inputs and outputs extend beyond text.

**Knowledge check.** An assistant gives a confidently wrong refund rule. What is the most useful first response?

1. Raise temperature so the model knows more facts
2. Lower the token budget until the answer is short
3. Provide the correct policy and test accuracy, then adjust variation separately
4. Set top-p to the desired accuracy percentage

Answer: option 3. Sampling settings influence variation, not knowledge or truth. Correct source information and evaluation address factual errors; output limits and top-p are not accuracy controls.
