# Data Processors

AIVAX uses third-party services for specific operations such as infrastructure, object storage, email delivery, payment processing, web search, AI inference, reranking, and image generation. The providers involved in a request depend on the selected model, gateway, tool, and integration.

This page is a technical inventory, not legal advice. Provider policies may change, and Account Managers should review the provider terms that apply to their selected models and tools before sending personal, confidential, regulated, or sensitive data.

The data protection law column summarizes the principal frameworks identified in each provider's current privacy policy or data processing addendum. Applicability may vary by contracting entity, data subject location, and processing region.

## Operations, Services, and Infrastructure

| Provider | Used for | Data protection law |
| --- | --- | --- |
| [Cloudflare](https://www.cloudflare.com/) | Reverse proxy/security where deployed, Workers AI reranking, and embedding services | [EU/UK GDPR, Swiss FADP, and CCPA/CPRA](https://www.cloudflare.com/cloudflare-customer-dpa/) |
| [Hetzner](https://www.hetzner.com/) | Compute infrastructure and hosting | [GDPR and BDSG](https://docs.hetzner.com/general/company-and-policy/data-protection-at-hetzner/) |
| [netcup](https://www.netcup.com/) | Compute infrastructure and hosting | [GDPR and BDSG](https://www.netcup.com/en/contact/data-privacy) |
| [Backblaze](https://www.backblaze.com/) | Object and file storage for generated media, uploaded media, generated documents, exposed files, and error artifacts | [EU/UK GDPR and CCPA/CPRA](https://www.backblaze.com/company/privacy) |
| [Brevo](https://www.brevo.com/) | Transactional email and notifications | [GDPR, French Data Protection Act, CCPA/CPRA, PIPEDA, and LGPD](https://www.brevo.com/legal/privacypolicy/) |
| [InfinitePay](https://infinitepay.io/) | Payment invoice creation and payment confirmation | [LGPD (Brazilian Law No. 13,709/2018)](https://www.infinitepay.io/legal/aviso-de-privacidade) |
| [Stripe](https://stripe.com/) | Payment event processing where Stripe checkout is configured | [EU/UK GDPR, Irish Data Protection Act 2018, and CCPA/CPRA](https://stripe.com/privacy) |
| [Twitter/X](https://developer.x.com/) | Built-in X/Twitter search and post reading tools | [EU/UK GDPR, Swiss FADP, CCPA, and LGPD](https://x.com/en/privacy) |
| [Linkup](https://www.linkup.so/) | Web search for context enrichment | [GDPR, French Data Protection Act, ePrivacy Directive, and CCPA/CPRA](https://www.linkup.so/privacy-policy) |
| [Tavily](https://www.tavily.com/) | Web search for context enrichment | [GDPR, UK Data Protection Act 2018, and applicable U.S. state privacy laws](https://www.tavily.com/privacy) |
| [Sinkin AI](https://sinkin.ai/) | Image generation for selected image models | [EU/UK GDPR, CCPA, and Virginia CDPA](https://sinkin.ai/privacy) |
| [Pollinations](https://pollinations.ai/) | Image generation for selected image models | [GDPR](https://pollinations.ai/privacy) |

## Direct Inference, Embedding, and Reranking Providers

| Provider | Used for | Data protection law |
| --- | --- | --- |
| [Groq](https://groq.com/) | LLM inference through an OpenAI-compatible endpoint | [EU/UK GDPR, Swiss FADP, CCPA/CPRA, and Saudi PDPL](https://console.groq.com/docs/legal/customer-data-processing-addendum) |
| [Jina AI](https://jina.ai/) | Embeddings, reranking, and web research | [GDPR and BDSG](https://jina.ai/legal/) |
| [OpenRouter](https://openrouter.ai/) | Model routing and fallback for many model families and Grok Voice TTS | [GDPR, CCPA/CPRA, and applicable U.S. state privacy laws](https://openrouter.ai/privacy/) |
| [Xiaomi MiMo](https://platform.xiaomimimo.com/) | Xiaomi model inference | [PIPL, EU/UK GDPR, and Swiss FADP](https://privacy.mi.com/all/en_US) |
| [Inception Labs](https://www.inceptionlabs.ai/) | Mercury model inference | [California Civil Code §§ 1798.83–1798.84 and Nevada Revised Statutes Chapter 603A](https://www.inceptionlabs.ai/docs/privacy-policy) |
| [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/) | Smart reranking and embedding services | [EU/UK GDPR, Swiss FADP, and CCPA/CPRA](https://www.cloudflare.com/cloudflare-customer-dpa/) |

## Model Families and Underlying Providers

The model catalog also identifies model families or underlying providers that may be selected directly or reached through aggregators such as OpenRouter. Not every request is sent to every provider.

| Provider | Used for | Data protection law |
| --- | --- | --- |
| [OpenAI](https://openai.com/) | OpenAI model families exposed in the catalog or compatible integrations | [EU/UK GDPR, CCPA/CPRA, and applicable U.S. state privacy laws](https://openai.com/policies/privacy-policy/) |
| [Google Vertex AI](https://cloud.google.com/vertex-ai) | Gemini and other Google model families | [EU/UK GDPR, Swiss FADP, and CCPA/CPRA](https://cloud.google.com/terms/data-processing-addendum/) |
| [Anthropic](https://www.anthropic.com/) | Claude model families | [EU/UK GDPR, Swiss FADP, LGPD, and applicable U.S. state privacy laws](https://www.anthropic.com/legal/privacy) |
| [AWS](https://aws.amazon.com/) | AWS-hosted model families such as Amazon Nova or Bedrock-backed providers | [EU/UK GDPR, Swiss FADP, and CCPA/CPRA](https://aws.amazon.com/privacy/) |
| [Cohere](https://cohere.com/) | Cohere model families | [PIPEDA, GDPR, and CCPA/CPRA](https://cohere.com/privacy) |
| [xAI](https://x.ai/) | Grok model families and Grok Voice through configured routes | [EU/UK GDPR, Swiss FADP, and CCPA/CPRA](https://x.ai/legal/data-processing-addendum) |
| [Mistral AI](https://mistral.ai/) | Mistral model families | [GDPR, French Data Protection Act, and CCPA/CPRA](https://legal.mistral.ai/terms/privacy-policy) |
| [DeepSeek](https://www.deepseek.com/) | DeepSeek model families | [PIPL, Data Security Law, and Cybersecurity Law of the People's Republic of China](https://cdn.deepseek.com/policies/en-US/deepseek-privacy-policy.html) |
| [Z.ai](https://z.ai/) | GLM/Z.ai model families | [Singapore PDPA and GDPR/UK GDPR where applicable](https://docs.z.ai/legal-agreement/privacy-policy) |
| [Alibaba Cloud](https://www.alibabacloud.com/product/modelstudio) | Qwen/Alibaba model families | [GDPR/UK GDPR and applicable regional laws, including PIPL](https://www.alibabacloud.com/help/en/legal/latest/alibaba-cloud-international-website-privacy-policy-history) |
| [Cerebras](https://www.cerebras.ai/) | Cerebras model families | [GDPR and CCPA/CPRA](https://trust.cerebras.ai/) |
| [Nebius](https://nebius.com/) | Nebius-backed model families | [EU/UK GDPR, Dutch GDPR Implementation Act, and Swiss FADP](https://docs.nebius.com/legal/dpa) |
| [Fireworks AI](https://fireworks.ai/) | Fireworks-backed model families | [EU/UK GDPR, CCPA/CPRA, and applicable U.S. state privacy laws](https://fireworks.ai/privacy-policy) |
| [Novita](https://novita.ai/) | Novita-backed model families | [CCPA/CPRA](https://novita.ai/legal) |
| [Azure](https://azure.microsoft.com/) | Azure-backed model families | [EU/UK GDPR, CCPA/CPRA, and PIPEDA](https://www.microsoft.com/licensing/docs/view/Microsoft-Products-and-Services-Data-Protection-Addendum-DPA) |
| [LongCat](https://longcat.chat/) | LongCat/Meituan model family metadata | [PIPL, Data Security Law, and Cybersecurity Law of the People's Republic of China; GDPR and CCPA where applicable](https://longcat.chat/platform/private/) |

## Data Handling Notes

AIVAX does not use Account Manager Input Content, Generated Content, or Conversations to train proprietary AIVAX models.

Third-party providers and aggregators may have their own processing, retention, abuse-monitoring, and model-improvement rules. The selected model, provider, tool, or integration determines which third party receives data for a specific request.

Avoid sending sensitive, confidential, regulated, or personal information to a provider unless you have reviewed that provider's current terms and have an appropriate legal basis for the processing.
