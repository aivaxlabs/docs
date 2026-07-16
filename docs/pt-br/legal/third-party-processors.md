# Processadores de Dados

AIVAX usa serviços de terceiros para operações específicas, como infraestrutura, armazenamento de objetos, entrega de e‑mail, processamento de pagamentos, busca na web, inferência de IA, reclassificação e geração de imagens. Os provedores envolvidos em uma solicitação dependem do modelo, gateway, ferramenta e integração selecionados.

Esta página é um inventário técnico, não um aconselhamento jurídico. As políticas dos provedores podem mudar, e os Gerentes de Conta devem revisar os termos do provedor que se aplicam aos seus modelos e ferramentas selecionados antes de enviar dados pessoais, confidenciais, regulados ou sensíveis.

A coluna de lei de proteção de dados resume os principais frameworks identificados na política de privacidade atual ou adendo de processamento de dados de cada provedor. A aplicabilidade pode variar conforme a entidade contratante, localização do sujeito dos dados e região de processamento.

## Operações, Serviços e Infraestrutura

| Provedor | Uso | Lei de proteção de dados |
| --- | --- | --- |
| [Cloudflare](https://www.cloudflare.com/) | Proxy reverso/segurança onde implantado, reclassificação Workers AI e serviços de incorporação | [EU/UK GDPR, Swiss FADP, and CCPA/CPRA](https://www.cloudflare.com/cloudflare-customer-dpa/) |
| [Hetzner](https://www.hetzner.com/) | Infraestrutura de computação e hospedagem | [GDPR and BDSG](https://docs.hetzner.com/general/company-and-policy/data-protection-at-hetzner/) |
| [netcup](https://www.netcup.com/) | Infraestrutura de computação e hospedagem | [GDPR and BDSG](https://www.netcup.com/en/contact/data-privacy) |
| [Backblaze](https://www.backblaze.com/) | Armazenamento de objetos e arquivos para mídia gerada, mídia carregada, documentos gerados, arquivos expostos e artefatos de erro | [EU/UK GDPR and CCPA/CPRA](https://www.backblaze.com/company/privacy) |
| [Brevo](https://www.brevo.com/) | E‑mail transacional e notificações | [GDPR, French Data Protection Act, CCPA/CPRA, PIPEDA, and LGPD](https://www.brevo.com/legal/privacypolicy/) |
| [InfinitePay](https://infinitepay.io/) | Criação de fatura de pagamento e confirmação de pagamento | [LGPD (Brazilian Law No. 13,709/2018)](https://www.infinitepay.io/legal/aviso-de-privacidade) |
| [Stripe](https://stripe.com/) | Processamento de eventos de pagamento onde o checkout Stripe está configurado | [EU/UK GDPR, Irish Data Protection Act 2018, and CCPA/CPRA](https://stripe.com/privacy) |
| [Twitter/X](https://developer.x.com/) | Ferramentas integradas de busca e leitura de postagens X/Twitter | [EU/UK GDPR, Swiss FADP, CCPA, and LGPD](https://x.com/en/privacy) |
| [Linkup](https://www.linkup.so/) | Busca na web para enriquecimento de contexto | [GDPR, French Data Protection Act, ePrivacy Directive, and CCPA/CPRA](https://www.linkup.so/privacy-policy) |
| [Tavily](https://www.tavily.com/) | Busca na web para enriquecimento de contexto | [GDPR, UK Data Protection Act 2018, and applicable U.S. state privacy laws](https://www.tavily.com/privacy) |
| [Sinkin AI](https://sinkin.ai/) | Geração de imagens para modelos de imagem selecionados | [EU/UK GDPR, CCPA, and Virginia CDPA](https://sinkin.ai/privacy) |
| [Pollinations](https://pollinations.ai/) | Geração de imagens para modelos de imagem selecionados | [GDPR](https://pollinations.ai/privacy) |

## Provedores de Inferência Direta, Incorporação e Reclassificação

| Provedor | Uso | Lei de proteção de dados |
| --- | --- | --- |
| [Groq](https://groq.com/) | Inferência de LLM através de um endpoint compatível com OpenAI | [EU/UK GDPR, Swiss FADP, CCPA/CPRA, and Saudi PDPL](https://console.groq.com/docs/legal/customer-data-processing-addendum) |
| [Jina AI](https://jina.ai/) | Embutimentos, reclassificação e pesquisa web | [GDPR and BDSG](https://jina.ai/legal/) |
| [OpenRouter](https://openrouter.ai/) | Roteamento de modelo e fallback para muitas famílias de modelo e TTS Grok Voice | [GDPR, CCPA/CPRA, and applicable U.S. state privacy laws](https://openrouter.ai/privacy/) |
| [Xiaomi MiMo](https://platform.xiaomimimo.com/) | Inferência de modelo Xiaomi | [PIPL, EU/UK GDPR, and Swiss FADP](https://privacy.mi.com/all/en_US) |
| [Inception Labs](https://www.inceptionlabs.ai/) | Inferência de modelo Mercury | [California Civil Code §§ 1798.83–1798.84 and Nevada Revised Statutes Chapter 603A](https://www.inceptionlabs.ai/docs/privacy-policy) |
| [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/) | Serviços inteligentes de reclassificação e incorporação | [EU/UK GDPR, Swiss FADP, and CCPA/CPRA](https://www.cloudflare.com/cloudflare-customer-dpa/) |

## Famílias de Modelo e Provedores Subjacentes

O catálogo de modelos também identifica famílias de modelo ou provedores subjacentes que podem ser selecionados diretamente ou acessados através de agregadores como o OpenRouter. Nem toda solicitação é enviada a todos os provedores.

| Provedor | Uso | Lei de proteção de dados |
| --- | --- | --- |
| [OpenAI](https://openai.com/) | Famílias de modelo OpenAI expostas no catálogo ou integrações compatíveis | [EU/UK GDPR, CCPA/CPRA, and applicable U.S. state privacy laws](https://openai.com/policies/privacy-policy/) |
| [Google Vertex AI](https://cloud.google.com/vertex-ai) | Famílias de modelo Gemini e outras da Google | [EU/UK GDPR, Swiss FADP, and CCPA/CPRA](https://cloud.google.com/terms/data-processing-addendum/) |
| [Anthropic](https://www.anthropic.com/) | Famílias de modelo Claude | [EU/UK GDPR, Swiss FADP, LGPD, and applicable U.S. state privacy laws](https://www.anthropic.com/legal/privacy) |
| [AWS](https://aws.amazon.com/) | Famílias de modelo hospedadas na AWS, como Amazon Nova ou provedores baseados em Bedrock | [EU/UK GDPR, Swiss FADP, and CCPA/CPRA](https://aws.amazon.com/privacy/) |
| [Cohere](https://cohere.com/) | Famílias de modelo Cohere | [PIPEDA, GDPR, and CCPA/CPRA](https://cohere.com/privacy) |
| [xAI](https://x.ai/) | Famílias de modelo Grok e Grok Voice através de rotas configuradas | [EU/UK GDPR, Swiss FADP, and CCPA/CPRA](https://x.ai/legal/data-processing-addendum) |
| [Mistral AI](https://mistral.ai/) | Famílias de modelo Mistral | [GDPR, French Data Protection Act, and CCPA/CPRA](https://legal.mistral.ai/terms/privacy-policy) |
| [DeepSeek](https://www.deepseek.com/) | Famílias de modelo DeepSeek | [PIPL, Data Security Law, and Cybersecurity Law of the People's Republic of China](https://cdn.deepseek.com/policies/en-US/deepseek-privacy-policy.html) |
| [Z.ai](https://z.ai/) | Famílias de modelo GLM/Z.ai | [Singapore PDPA and GDPR/UK GDPR where applicable](https://docs.z.ai/legal-agreement/privacy-policy) |
| [Alibaba Cloud](https://www.alibabacloud.com/product/modelstudio) | Famílias de modelo Qwen/Alibaba | [GDPR/UK GDPR and applicable regional laws, including PIPL](https://www.alibabacloud.com/help/en/legal/latest/alibaba-cloud-international-website-privacy-policy-history) |
| [Cerebras](https://www.cerebras.ai/) | Famílias de modelo Cerebras | [GDPR and CCPA/CPRA](https://trust.cerebras.ai/) |
| [Nebius](https://nebius.com/) | Famílias de modelo suportadas pela Nebius | [EU/UK GDPR, Dutch GDPR Implementation Act, and Swiss FADP](https://docs.nebius.com/legal/dpa) |
| [Fireworks AI](https://fireworks.ai/) | Famílias de modelo suportadas pela Fireworks | [EU/UK GDPR, CCPA/CPRA, and applicable U.S. state privacy laws](https://fireworks.ai/privacy-policy) |
| [Novita](https://novita.ai/) | Famílias de modelo suportadas pela Novita | [CCPA/CPRA](https://novita.ai/legal) |
| [Azure](https://azure.microsoft.com/) | Famílias de modelo suportadas pela Azure | [EU/UK GDPR, CCPA/CPRA, and PIPEDA](https://www.microsoft.com/licensing/docs/view/Microsoft-Products-and-Services-Data-Protection-Addendum-DPA) |
| [LongCat](https://longcat.chat/) | Metadados da família de modelo LongCat/Meituan | [PIPL, Data Security Law, and Cybersecurity Law of the People's Republic of China; GDPR and CCPA where applicable](https://longcat.chat/platform/private/) |

## Observações sobre Manipulação de Dados

AIVAX não usa Conteúdo de Entrada do Gerente de Conta, Conteúdo Gerado ou Conversas para treinar modelos proprietários da AIVAX.

Provedores e agregadores de terceiros podem ter suas próprias regras de processamento, retenção, monitoramento de abuso e melhoria de modelo. O modelo, provedor, ferramenta ou integração selecionados determinam qual terceiro recebe os dados para uma solicitação específica.

Evite enviar informações sensíveis, confidenciais, reguladas ou pessoais a um provedor a menos que você tenha revisado os termos atuais desse provedor e possua uma base legal adequada para o processamento.