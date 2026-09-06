# Pricing

Service usage prices are listed below in USD. **M** means one million tokens; **1k** means one thousand units. Approximate prices (`~`) vary with the model used and the work performed.

See [subscription pricing](https://aivax.net/pricing) for monthly plan prices and [Plans and limits](limits.md) for quotas. Usage rates are subject to the plan multiplier:
- Free: **+25%** on inference taxes;
- Pro: **+5%** on inference taxes;
- Max: **0%** on inference taxes.

BYOK are not affected by inference taxes.

## Inference and Moderation

Inference rates depend on the selected model, provider, input size, and media type. Moderation is charged separately in Processing Units (PUs), covering input, cached input, and output usage; its PU price varies with the model and provider used.

| Description | Pricing |
| --- | ---: |
| AI model and AI Gateway inference | Selected model and provider rates |
| Input moderation | Variable price per PU; separate from the main inference charge |

## Agentic Tests

Each test includes the selected model or AI Gateway's inference charges, plus simulated-user and judge usage at the selected profile's rates.

| Description | Pricing |
| --- | ---: |
| Model or AI Gateway under test | Regular inference rates |
| Low profile - simulated user | Input **$0.25/M tokens**; cache **$0.025/M tokens**; output **$1.50/M tokens** |
| Low profile - judge | Input **$0.30/M tokens**; cache **$0.03/M tokens**; output **$2.50/M tokens** |
| Medium profile - simulated user | Input **$0.75/M tokens**; cache **$0.075/M tokens**; output **$3.75/M tokens** |
| Medium profile - judge | Input **$0.75/M tokens**; cache **$0.075/M tokens**; output **$3.75/M tokens** |
| High profile - simulated user | Input **$0.75/M tokens**; cache **$0.075/M tokens**; output **$3.75/M tokens** |
| High profile - judge | Input **$1.25/M tokens**; cache **$0.15/M tokens**; output **$4.25/M tokens** |

## RAG and Collections

Indexing and search are billed by token usage. Generated RAG responses are charged separately from query embedding, and their price varies with the summarization model.

| Description | Pricing |
| --- | ---: |
| Collection text embedding | **$0.015/M tokens** |
| Semantic search - query cache miss | **$0.015/M tokens** |
| Semantic search - query cache hit | Zero |
| RAG response generation | **~$0.50/M tokens**, excluding query rates |
| Reflex - cache miss | **$0.015/M tokens** |
| Reflex - cache hit | **$0.003/M tokens** |

## Media Injector

Converting media into RAG documents is billed for input, cached input, output, and media usage. The source file, optional context, and generated content affect the total. Rates depend on media type and input-token volume.

| Description | Pricing |
| --- | ---: |
| PDFs and images - up to 272K input tokens | Input **$0.30/M tokens**; cache **$0.03/M tokens**; output **$1.80/M tokens** |
| PDFs and images - above 272K input tokens | Input **$0.60/M tokens**; cache **$0.06/M tokens**; output **$3.60/M tokens** |
| Audio - up to 256K input tokens | Input/media **$0.60/M tokens**; cache **$0.12/M tokens**; output **$3.00/M tokens** |
| Audio - above 256K input tokens | Input/media **$1.20/M tokens**; cache **$0.24/M tokens**; output **$6.00/M tokens** |
| Video | Input/media **$0.45/M tokens**; cache **$0.045/M tokens**; output **$3.75/M tokens** |

## Text Tools

Text segmentation and classification are billed by token usage.

| Description | Pricing |
| --- | ---: |
| Text segmentation | **$0.30/M tokens** |
| Text classification | **$0.015/M tokens** |

## Voice and Media

Generation and transcription rates depend on the selected model. Media description pricing is approximate and depends on the available processing model.

| Description | Pricing |
| --- | ---: |
| Voice Sessions | Selected realtime model rates |
| Speech-to-text | Varies by model |
| Text-to-speech | Varies by model |
| Image generation | Varies by model |
| Media descriptions | **~$1.50/M tokens** |

## Web Search, OCR and Fetch

Web and X searches are billed per search. Advanced web search is billed by token usage and varies with the model and number of interactions. Fetch and OCR extraction use Processing Units (PUs), with a daily free allowance by plan. These allowances and PU rates do not apply to moderation.

| Description | Pricing |
| --- | ---: |
| Web search | **$5/1k searches** |
| X (Twitter) search | **$5/1k searches** |
| Advanced web search | **~$0.75/M tokens** |
| Fetch and OCR extraction - Free | **1,000 PUs/day free**, then **$0.15/1k PUs** |
| Fetch and OCR extraction - Pro | **10,000 PUs/day free**, then **$0.05/1k PUs** |
| Fetch and OCR extraction - Max | **50,000 PUs/day free**, then **$0.02/1k PUs** |

## Storage

Each plan includes storage. Pro and Max overages are billed hourly at the monthly rates below; Free storage cannot be expanded.

| Description | Pricing |
| --- | ---: |
| Free storage | **30 MB included**; no expansion |
| Pro storage | **2 GB included**; excess **$0.50/GB/month** |
| Max storage | **20 GB included**; excess **$0.20/GB/month** |

## Other Tools

The following tools have no separate tool charge. Model inference used to invoke them is still billed at its regular rate.

| Description | Pricing |
| --- | ---: |
| Memory and calendar | No separate charge |
| Advanced requests | No separate charge |
| Document generation | No separate charge |
| Web page generation | No separate charge |
