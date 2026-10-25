---
{title: Data Processors,linkTitle: Data Processors,weight: 30,group: Legal documents}
---

# Data Processors

AIVAX uses third-party services for specific operations such as infrastructure, object storage, email delivery, payment processing, and web search. The providers involved in a request depend on the selected model, gateway, tool, and integration.

This page is a disclosed technical inventory, not legal advice. Provider policies may change, and Account Managers should review the provider terms that apply to their selected models and tools before sending personal, confidential, regulated, or sensitive data.

The data protection law column summarizes the principal frameworks identified in each provider's current privacy policy or data processing addendum. Applicability may vary by contracting entity, data subject location, and processing region.

## Operations, Services, and Infrastructure

| Provider | Used for | Data protection law |
| --- | --- | --- |
| [Cloudflare](https://www.cloudflare.com/) | Reverse proxy and security where deployed | [EU/UK GDPR, Swiss FADP, and CCPA/CPRA](https://www.cloudflare.com/cloudflare-customer-dpa/) |
| [Hetzner](https://www.hetzner.com/) | Compute infrastructure and hosting | [GDPR and BDSG](https://docs.hetzner.com/general/company-and-policy/data-protection-at-hetzner/) |
| [netcup](https://www.netcup.com/) | Compute infrastructure and hosting | [GDPR and BDSG](https://www.netcup.com/en/contact/data-privacy) |
| [Backblaze](https://www.backblaze.com/) | Object and file storage for generated media, uploaded media, generated documents, exposed files, and error artifacts | [EU/UK GDPR and CCPA/CPRA](https://www.backblaze.com/company/privacy) |
| [Brevo](https://www.brevo.com/) | Transactional email and notifications | [GDPR, French Data Protection Act, CCPA/CPRA, PIPEDA, and LGPD](https://www.brevo.com/legal/privacypolicy/) |
| [Mixtic](https://mixtic.com.br/) | Payment links, saved payment methods, credit and subscription charges, and payment confirmation | [LGPD (Brazilian Law No. 13,709/2018)](https://mixtic.com.br/privacidade) |
| [Twitter/X](https://developer.x.com/) | Built-in X/Twitter search and post reading tools | [EU/UK GDPR, Swiss FADP, CCPA, and LGPD](https://x.com/en/privacy) |
| [Linkup](https://www.linkup.so/) | Web search for context enrichment | [GDPR, French Data Protection Act, ePrivacy Directive, and CCPA/CPRA](https://www.linkup.so/privacy-policy) |
| [Jina AI](https://jina.ai/) | Web research for context enrichment | [GDPR and BDSG](https://jina.ai/legal/) |
| [Tavily](https://www.tavily.com/) | Web search for context enrichment | [GDPR, UK Data Protection Act 2018, and applicable U.S. state privacy laws](https://www.tavily.com/privacy) |

## Collection Policies

The tables below describe what AIVAX itself retains for each service. Each service is classified into one of three levels:

| Level | Meaning |
| --- | --- |
| 🟢 **ZDR** | Zero data retention. AIVAX does not store the request input or output after the response is returned. |
| 🟡 **Partial** | AIVAX keeps logs, records, or metadata about the operation, but not its content, for an indefinite period. |
| 🔴 **Full** | AIVAX stores the content itself, which may include personal or sensitive data, for an indefinite period. |

When a setting changes the level, the Collection Policy column lists each condition and its level. Every service also produces the usage, billing, and technical records described in the [Privacy Policy](/docs/legal/privacy-policy.md), and stored account resources may be included in backups. Third-party providers that receive data for a request apply their own retention rules. MCP Utilities follow the policy of the service they call.

## RAG and Collections

| Description | Collection Policy | Details |
| --- | --- | --- |
| [Collections and documents](/docs/rag/collections.md) | 🔴 Full | Document text, embeddings, and metadata are stored until you delete the document or collection. |
| [Semantic search](/docs/rag/semantic-search.md) | **RAG logging enabled:** 🔴 Full<br>**RAG logging disabled:** 🟡 Partial | **RAG logging** in the account settings records query terms, returned documents, scores, processing time, and cost in the collection's [Transactions](/docs/rag/observability.md) tab. It is enabled by default. |
| [Reflex and rerankers](/docs/rag/reranking.md) | **Data Sharing disabled:** 🟢 ZDR<br>**Data Sharing enabled:** 🔴 Full | Candidate documents are not stored; Reflex uses a temporary in-memory cache to bill repeated input at the cache-hit rate. With [Data Sharing](/docs/data-sharing.md) enabled, the anonymized query, documents, and ranking results are kept for model development. Data Sharing is disabled by default and also covers the anonymized results of semantic searches. |
| [User memories](/docs/tools/builtin-tools.md#memory) | 🔴 Full | Memories saved by the Memory built-in tool are stored in the `@memories` collection until deleted or expired. |

## Inference

| Description | Collection Policy | Details |
| --- | --- | --- |
| [Chat completions and AI Gateways](/docs/inference/inference.md#response-and-conversation-records) | **Conversation logging enabled:** 🔴 Full<br>**Conversation logging disabled:** 🟡 Partial | **Conversations logging** in the account settings stores messages, tool calls, metadata, usage, and errors as conversations. It is enabled by default. Set `allow_logging: false` to exclude a single request. Enable [Zero data retention providers only](/docs/inference/inference.md#zero-data-retention-providers-only) to restrict integrated text models to providers that do not retain prompts. |
| [AI Gateway](/docs/inference/ai-gateway.md) and [skill](/docs/inference/skills.md) configuration | 🔴 Full | Instructions, skills, tools, and integration settings are stored until deleted. |
| Multimodal preprocessing | 🔴 Full | When attachments are converted to text through description, OCR, or transcription during inference, the resulting text is cached per account to avoid reprocessing the same content. Original files are not stored. |
| Provider error diagnostics | 🔴 Full | When a model provider returns an error, the request sent to the provider and its response may be stored for diagnosis, regardless of conversation logging. |
| [Chat Clients](/docs/inference/chat-clients.md) | 🔴 Full | Sessions store message history, extra context, and metadata until the session expires. Media sent as data URLs is uploaded to object storage and referenced by a public URL. Generated audio is cached when audio synthesis is enabled. Inference also follows the conversation logging condition. |
| [Voice and Realtime](/docs/inference/voice-session.md) | **Conversation logging enabled:** 🔴 Full<br>**Conversation logging disabled:** 🟡 Partial | Follows the account's **Conversations logging** setting. It cannot be disabled per session. |
| [Batch processing](/docs/inference/batch.md) | 🔴 Full | Workflows, jobs, and item inputs and outputs are stored until you delete them or clean the job items. |
| [Agentic Tests](/docs/inference/agentic-tests.md) | 🔴 Full | Test definitions, runs, simulated conversations, and judge results are stored. |
| [Shell sandboxing](/docs/tools/shell.md#data-persistence) | **Persistence disabled:** 🟢 ZDR<br>**Persistence enabled:** 🔴 Full | With `allowDataPersistence` enabled and a user external ID, files persist in a per-user workspace until deleted. Otherwise, the in-memory filesystem is discarded after the inference iteration. Persistence is disabled by default. |
| [Protocol functions](/docs/tools/protocol-functions.md) | 🟡 Partial | Function calls are sent to your callback and are not stored beyond conversation logging. Callback failures and their error messages are recorded in the account logs. |

## Web Foundation

| Description | Collection Policy | Details |
| --- | --- | --- |
| [Web Search](/docs/web-foundation/web-search.md) | 🟢 ZDR | Queries and results are not stored. Queries are sent to the web search providers listed above. |
| [Fetch and OCR](/docs/web-foundation/fetch-and-ocr.md) | 🟢 ZDR | Fetched pages, files, extracted text, and JSON output are not stored. Optional JSON conversion is processed by a language model provider. |
| [X posts search](/docs/tools/builtin-tools.md#x-posts-search) | 🟢 ZDR | Queries and posts are not stored. Queries are sent to X. |

## Media Generation

| Description | Collection Policy | Details |
| --- | --- | --- |
| [Image generation](/docs/generations/images.md) | 🔴 Full | Generated images are uploaded to object storage and served from a public URL. Anyone with the URL can open the image. Prompts and reference images are sent to the image model provider. |
| [Document](/docs/tools/builtin-tools.md#document-generation) and [web page](/docs/tools/builtin-tools.md#web-page-generation) generation | 🔴 Full | Files created by these built-in tools are hosted on AIVAX servers and served from a public URL. |
| [Text-to-speech](/docs/generations/speech.md) | **API:** 🟢 ZDR<br>**[Media generation MCP](/docs/mcp-utilities/media-generation-mcp.md):** 🔴 Full | The API returns audio in the response without storing it. The MCP speech tool uploads the MP3 to object storage and returns a public URL. |
| [Speech-to-text](/docs/generations/audio-transcriptions.md) | 🟢 ZDR | Audio and transcripts are not stored. |

## Data Processing

| Description | Collection Policy | Details |
| --- | --- | --- |
| [Media Descriptions](/docs/data-processing/media-descriptions.md) | 🟢 ZDR | Submitted media and generated descriptions are not stored by this endpoint. Attachments converted during inference follow the multimodal preprocessing policy. |
| [Text Classification](/docs/data-processing/classification.md) | 🟢 ZDR | Text is not stored. Embeddings use a temporary in-memory cache to reduce latency and cost for repeated text. |
| [Semantic Decisions](/docs/data-processing/decisions.md) | 🟢 ZDR | Inputs and results are not stored. |
| [Text Segmentation](/docs/data-processing/text-segmentation.md) | 🟢 ZDR | Source text and segments are not stored. Sanitization is processed by a language model provider. |

## Account Utilities

| Description | Collection Policy | Details |
| --- | --- | --- |
| Account and API keys | 🟡 Partial | Account data, settings, and API key metadata are kept while the account is active. |
| Billing and payments | 🟡 Partial | Invoices, credits, receipts, and payment records are kept according to legal, accounting, and contractual requirements. Payments are processed by Mixtic. |
| Usage and technical logs | 🟡 Partial | Usage records with model, quantity, cost, and linked resources, and inference and access logs with metadata such as IP addresses and user-agent strings. |
| Account logs | 🟡 Partial | Operational warnings and errors shown in the account logs. |
| Notifications | 🟡 Partial | Account notifications are stored for the dashboard. Email notifications are delivered through Brevo. |

## Data Handling Notes

By default, AIVAX does not use Account Manager Input Content, Generated Content, or Conversations to train proprietary AIVAX models. Eligible anonymized RAG and reranking records are used for model development only when an authorized Account Manager enables the optional program described in [Data Sharing](/docs/data-sharing). Document indexing and storage are excluded.

Third-party providers may have their own processing, retention, abuse-monitoring, and model-improvement rules. The selected model, provider, tool, or integration determines which third party receives data for a specific request.

Avoid sending sensitive, confidential, regulated, or personal information to a provider unless you have reviewed that provider's current terms and have an appropriate legal basis for the processing.
