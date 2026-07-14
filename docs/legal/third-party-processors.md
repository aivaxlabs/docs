# Data Processors

AIVAX uses third-party services for specific operations such as infrastructure, object storage, email delivery, payment processing, web search, AI inference, reranking, and image generation. The providers involved in a request depend on the selected model, gateway, tool, and integration.

This page is a technical inventory, not legal advice. Provider policies may change, and Account Managers should review the provider terms that apply to their selected models and tools before sending personal, confidential, regulated, or sensitive data.

## Operations, Services, and Infrastructure

| Provider | Used for |
| --- | --- |
| [Cloudflare](https://www.cloudflare.com/) | Reverse proxy/security where deployed, Workers AI reranking, and embedding services |
| [Backblaze](https://www.backblaze.com/) | Object and file storage for generated media, uploaded media, generated documents, exposed files, and error artifacts |
| [Brevo](https://www.brevo.com/) | Transactional email and notifications |
| [InfinitePay](https://infinitepay.io/) | Payment invoice creation and payment confirmation |
| [Stripe](https://stripe.com/) | Payment event processing where Stripe checkout is configured |
| [Twitter/X](https://developer.x.com/) | Built-in X/Twitter search and post reading tools |
| [Linkup](https://www.linkup.so/) | Web search for context enrichment |
| [Tavily](https://www.tavily.com/) | Web search for context enrichment |
| [Sinkin AI](https://sinkin.ai/) | Image generation for selected image models |
| [Pollinations](https://pollinations.ai/) | Image generation for selected image models |

## Direct Inference, Embedding, and Reranking Providers

| Provider | Used for |
| --- | --- |
| [Groq](https://groq.com/) | LLM inference through an OpenAI-compatible endpoint |
| [DeepInfra](https://deepinfra.com/) | LLM inference through an OpenAI-compatible endpoint |
| [Vultr](https://www.vultr.com/) | LLM inference through Vultr Inference |
| [CrofAI](https://ai.nahcrof.com/) | LLM inference through an OpenAI-compatible endpoint |
| [OpenRouter](https://openrouter.ai/) | Model routing and fallback for many model families and Grok Voice TTS |
| [Xiaomi MiMo](https://platform.xiaomimimo.com/) | Xiaomi model inference |
| [NagaAI](https://naga.ac/) | LLM inference, embeddings, TTS, and selected research flows |
| [Inception Labs](https://www.inceptionlabs.ai/) | Mercury model inference |
| [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/) | Smart reranking and embedding services |

## Model Families and Underlying Providers

The model catalog also identifies model families or underlying providers that may be selected directly or reached through aggregators such as OpenRouter or NagaAI. Not every request is sent to every provider.

| Provider | Used for |
| --- | --- |
| [OpenAI](https://openai.com/) | OpenAI model families exposed in the catalog or compatible integrations |
| [Google Vertex AI](https://cloud.google.com/vertex-ai) | Gemini and other Google model families |
| [Anthropic](https://www.anthropic.com/) | Claude model families |
| [AWS](https://aws.amazon.com/) | AWS-hosted model families such as Amazon Nova or Bedrock-backed providers |
| [Cohere](https://cohere.com/) | Cohere model families |
| [xAI](https://x.ai/) | Grok model families and Grok Voice through configured routes |
| [Mistral AI](https://mistral.ai/) | Mistral model families |
| [DeepSeek](https://www.deepseek.com/) | DeepSeek model families |
| [Z.ai](https://z.ai/) | GLM/Z.ai model families |
| [Alibaba Cloud](https://www.alibabacloud.com/product/modelstudio) | Qwen/Alibaba model families |
| [Cerebras](https://www.cerebras.ai/) | Cerebras model families |
| [Nebius](https://nebius.com/) | Nebius-backed model families |
| [Fireworks AI](https://fireworks.ai/) | Fireworks-backed model families |
| [Novita](https://novita.ai/) | Novita-backed model families |
| [Azure](https://azure.microsoft.com/) | Azure-backed model families |
| [LongCat](https://longcat.chat/) | LongCat/Meituan model family metadata |

## Data Handling Notes

AIVAX does not use Account Manager Input Content, Generated Content, or Conversations to train proprietary AIVAX models.

Third-party providers and aggregators may have their own processing, retention, abuse-monitoring, and model-improvement rules. The selected model, provider, tool, or integration determines which third party receives data for a specific request.

Avoid sending sensitive, confidential, regulated, or personal information to a provider unless you have reviewed that provider's current terms and have an appropriate legal basis for the processing.
