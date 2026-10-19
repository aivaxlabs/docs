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

## Data Handling Notes

By default, AIVAX does not use Account Manager Input Content, Generated Content, or Conversations to train proprietary AIVAX models. Eligible anonymized RAG and reranking records are used for model development only when an authorized Account Manager enables the optional program described in [Data Sharing](/docs/data-sharing). Document indexing and storage are excluded.

Third-party providers may have their own processing, retention, abuse-monitoring, and model-improvement rules. The selected model, provider, tool, or integration determines which third party receives data for a specific request.

Avoid sending sensitive, confidential, regulated, or personal information to a provider unless you have reviewed that provider's current terms and have an appropriate legal basis for the processing.
