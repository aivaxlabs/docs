Source: https://docs.aivax.net/learn/models/model-families-and-choosing.html

Choosing an AI model is like assigning work to a colleague. You would not send every short customer message to your most experienced specialist, nor ask a receptionist to approve a complicated contract. The useful question is not “Which model is most powerful?” but “Which model can do this job reliably, within the time and budget available?”

A **model** is a trained system that transforms an input, such as a question or image, into an output. A **model family** is a related group of models, often offered in different sizes or with different capabilities. Family names are convenient labels, not proof that every member behaves alike. Test the particular version you intend to use.

## Size is a starting point, not a verdict

People often describe models as small, medium, or large. These are relative categories rather than an industry-wide measurement. The labels usually reflect the scale of the model and the resources needed to run it. New training techniques can make a newer small model more effective on a task than an older large one.

- **Small** — A useful starting point for narrow, repetitive work: classify messages, extract a date, or rewrite a short reply. Check its handling of unusual cases.

- **Medium** — A candidate for broader conversation and instructions with several conditions. It may provide enough flexibility without the overhead of a larger model.

- **Large** — A candidate for difficult interpretation and tasks involving several interacting requirements. Its additional capacity matters only if your tests show a benefit.

Size alone does not tell you whether a model can read images, call a business tool, or follow an output format. A large text-only model cannot inspect a photograph simply because it is large. Likewise, a model that writes elegant sales copy may extract invoice fields less reliably than a smaller model selected for that task.

Consider the consequences of a mistake as well as difficulty. Sorting incoming messages into broad topics is easy to correct. Misreading a cancellation deadline can cause a financial loss. High-impact work needs verification and clear authority limits regardless of model size; buying more capability does not replace those controls.

## Open-weight and hosted describe different choices

**Weights** are the numerical values learned during training. An **open-weight** model makes those values available under a licence, potentially allowing an organisation to run it on its own infrastructure. The licence still needs checking: availability of weights does not automatically mean unrestricted commercial use or access to all training materials.

A **hosted** model runs on infrastructure operated by a service provider. You send requests and receive results rather than maintain the computers that execute the model. Hosted services can offer open-weight models as well as models whose weights are not distributed. “Open-weight versus hosted” is therefore not a clean either-or distinction: one describes access to the model, the other describes how you operate it.

Running a model yourself can provide control over deployment and data handling, but brings responsibility for hardware, security, updates, capacity, and outages. A hosted service reduces that operational work, but its data policies, location, availability, and supported features still need review. Neither choice is automatically cheaper or more private in every situation. Compare the complete operating arrangement, not just a model download or a request price.

## General-purpose or specialised?

A **general-purpose model** handles a broad range of tasks, such as conversation, summarisation, and drafting. A **specialised model** focuses on particular work or a particular kind of input. Specialisation can change both the quality of the result and the form of the output.

Code-focused models help create or interpret software. Vision-capable models interpret images. Speech models turn audio into words or words into audio. An **embedding model** converts content into numerical representations used to find similar material; it is not a substitute for a conversational answer writer. A service may combine several of these systems while presenting one assistant to the user.

Before comparing writing quality, eliminate candidates that cannot perform the required operation. Does the workflow require photographs? Must the model request actions through tools? Does it need to return fields that software can read? Does it understand your customers' languages? A missing capability is not something to solve by raising a creativity setting.

## The quality–latency–cost triangle

**Quality** means meeting the task's requirements, not merely sounding polished. **Latency** means how long a user waits for a response. **Cost** includes the model's usage and any surrounding work, such as document search, retries, and human review. These factors interact: a cheap answer that repeatedly needs correction may cost more overall than a stronger first attempt.

**Illustrative relative processing cost by tier**

| Item | Value |
| --- | --- |
| Small candidate | 1 cost units |
| Medium candidate | 3 cost units |
| Large candidate | 7 cost units |

Invented teaching values, not prices or a universal relationship. Actual cost depends on the model, hosting, input length, output length, and workload.

The triangle is a decision aid, not a law that says improvement always costs more. A well-matched specialist can improve both speed and quality. Shorter inputs, clearer instructions, or better source documents can help without changing models. Measure the whole workflow before assuming that the model itself is the bottleneck.

A live voice assistant has little room for long pauses. An overnight report can tolerate more waiting if the result is better. A back-office queue handling many similar records may value predictable operating cost. Write these needs down before testing so that an impressive demonstration does not quietly change the acceptance criteria.

## A repeatable selection procedure

1. **Define an acceptable result**

Describe the job, required evidence, format, languages, and unacceptable mistakes. Decide which actions still require a person.

2. **Filter for capability and policy**

Check media support, tools, data handling, and practical input limits. Remove incompatible options before comparing their prose.

3. **Start with a modest candidate**

Try a small or medium model that fits the requirements. Add a more capable candidate when the task or observed failures justify it.

4. **Test the same work**

Use the same questions, source documents, and scoring rules for each candidate. Record correctness, waiting time, and total work required.

5. **Choose and keep checking**

Select the least costly arrangement that meets the quality and timing requirements. Recheck after changing models, instructions, or business policies.

Use examples from actual work, with private information removed or replaced. Include ordinary requests, unclear requests, missing information, conflicting instructions, and cases that should be handed to a person. Reserve some examples for the final comparison instead of repeatedly adjusting the prompt to the entire test set. Otherwise you may learn how to pass the examples rather than serve new customers.

Score the result before looking at which model produced it when practical. For support, check whether the answer follows the current policy and avoids invented promises. For extraction, compare each required field with the source. For drafting, have an editor judge whether the text is usable. Repeat important cases because one successful answer does not establish reliability.

## Match the recommendation to the task

**Support triage**

Start with a small candidate for assigning messages to a fixed list of teams. Test mixed-topic messages and provide an “unclear” route instead of forcing a confident category.

**Sales drafting**

Try a general-purpose candidate with approved product facts and a clear audience. Compare editing effort, not just how enthusiastic the first draft sounds.

**Complex internal advice**

Compare stronger candidates using the same source documents and review process. Require evidence and escalation when the documents do not settle the question.

On AIVAX, reusable model choices and instructions can be managed through an [AI gateway](https://docs.aivax.net/docs/inference/ai-gateway.md). Related: the [inference guide](https://docs.aivax.net/docs/inference/inference.md) describes direct model requests and supported options. Treat configuration as part of the tested system: changing the model behind a stable assistant name can still change its behaviour.

What's next: learn how [parameters](https://docs.aivax.net/learn/models/parameters.md) adjust the behaviour of the model you selected.

**Knowledge check.** A support team needs to classify messages reliably without making customers wait. How should it choose a model?

1. Choose the largest model for every request
2. Choose the candidate that meets your task's quality, timing, and policy requirements in representative tests
3. Choose the model with the most polished demonstration
4. Choose solely by whether its weights are available

Answer: option 2. Model selection is a task-specific comparison. Capability, reliability, latency, operating cost, and policy requirements matter more than size or a single impressive answer.
