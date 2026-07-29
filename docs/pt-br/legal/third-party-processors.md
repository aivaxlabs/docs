# Processadores de Dados

AIVAX usa serviços de terceiros para operações específicas, como infraestrutura, armazenamento de objetos, entrega de e‑mail, processamento de pagamentos, busca na web, inferência de IA, reranqueamento e geração de imagens. Os provedores envolvidos em uma solicitação dependem do modelo, gateway, ferramenta e integração escolhidos.

Esta página é um inventário técnico, não um aconselhamento jurídico. As políticas dos provedores podem mudar, e os Gerentes de Conta devem revisar os termos do provedor que se aplicam aos seus modelos e ferramentas selecionados antes de enviar dados pessoais, confidenciais, regulados ou sensíveis.

A coluna de lei de proteção de dados resume os principais marcos identificados na política de privacidade atual ou adendo de processamento de dados de cada provedor. A aplicabilidade pode variar conforme a entidade contratante, a localização do titular dos dados e a região de processamento.

## Operações, Serviços e Infraestrutura

| Provedor | Uso | Lei de proteção de dados |
| --- | --- | --- |
| [Cloudflare](https://www.cloudflare.com/) | Proxy reverso/segurança onde implantado e serviços de incorporação | [EU/UK GDPR, Swiss FADP e CCPA/CPRA](https://www.cloudflare.com/cloudflare-customer-dpa/) |
| [Hetzner](https://www.hetzner.com/) | Infraestrutura de computação e hospedagem | [GDPR e BDSG](https://docs.hetzner.com/general/company-and-policy/data-protection-at-hetzner/) |
| [netcup](https://www.netcup.com/) | Infraestrutura de computação e hospedagem | [GDPR e BDSG](https://www.netcup.com/en/contact/data-privacy) |
| [Backblaze](https://www.backblaze.com/) | Armazenamento de objetos e arquivos para mídia gerada, mídia enviada, documentos gerados, arquivos expostos e artefatos de erro | [EU/UK GDPR e CCPA/CPRA](https://www.backblaze.com/company/privacy) |
| [Brevo](https://www.brevo.com/) | E‑mail transacional e notificações | [GDPR, Lei Francesa de Proteção de Dados, CCPA/CPRA, PIPEDA e LGPD](https://www.brevo.com/legal/privacypolicy/) |
| [InfinitePay](https://infinitepay.io/) | Criação de fatura de pagamento e confirmação de pagamento | [LGPD (Lei Brasileira nº 13.709/2018)](https://www.infinitepay.io/legal/aviso-de-privacidade) |
| [Stripe](https://stripe.com/) | Processamento de eventos de pagamento onde o checkout Stripe está configurado | [EU/UK GDPR, Lei Irlandesa de Proteção de Dados 2018 e CCPA/CPRA](https://stripe.com/privacy) |
| [Twitter/X](https://developer.x.com/) | Ferramentas integradas de busca X/Twitter e leitura de publicações | [EU/UK GDPR, Swiss FADP, CCPA e LGPD](https://x.com/en/privacy) |
| [Linkup](https://www.linkup.so/) | Busca na web para enriquecimento de contexto | [GDPR, Lei Francesa de Proteção de Dados, Diretriz ePrivacy e CCPA/CPRA](https://www.linkup.so/privacy-policy) |
| [Tavily](https://www.tavily.com/) | Busca na web para enriquecimento de contexto | [GDPR, Lei Britânica de Proteção de Dados 2018 e leis estaduais de privacidade dos EUA aplicáveis](https://www.tavily.com/privacy) |
| [Sinkin AI](https://sinkin.ai/) | Geração de imagens para modelos de imagem selecionados | [EU/UK GDPR, CCPA e Virginia CDPA](https://sinkin.ai/privacy) |
| [Pollinations](https://pollinations.ai/) | Geração de imagens para modelos de imagem selecionados | [GDPR](https://pollinations.ai/privacy) |

## Provedores de Inferência Direta, Incorporação e Reranqueamento

| Provedor | Uso | Lei de proteção de dados |
| --- | --- | --- |
| [Groq](https://groq.com/) | Inferência de LLM através de endpoint compatível com OpenAI | [EU/UK GDPR, Swiss FADP, CCPA/CPRA e Saudi PDPL](https://console.groq.com/docs/legal/customer-data-processing-addendum) |
| [Jina AI](https://jina.ai/) | Incorporações, reranqueamento e pesquisa web | [GDPR e BDSG](https://jina.ai/legal/) |
| [OpenRouter](https://openrouter.ai/) | Roteamento de modelo, fallback e síntese de fala | [GDPR, CCPA/CPRA e leis estaduais de privacidade dos EUA aplicáveis](https://openrouter.ai/privacy/) |
| [DeepInfra](https://deepinfra.com/) | Inferência de IA | [GDPR e CCPA/CPRA](https://deepinfra.com/privacy) |
| [Xiaomi MiMo](https://platform.xiaomimimo.com/) | Inferência de modelo Xiaomi | [PIPL, EU/UK GDPR e Swiss FADP](https://privacy.mi.com/all/en_US) |
| [Inception Labs](https://www.inceptionlabs.ai/) | Inferência de modelo Mercury | [Código Civil da Califórnia §§ 1798.83–1798.84 e Código Revisado de Nevada Capítulo 603A](https://www.inceptionlabs.ai/docs/privacy-policy) |
| [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/) | Serviços de incorporação | [EU/UK GDPR, Swiss FADP e CCPA/CPRA](https://www.cloudflare.com/cloudflare-customer-dpa/) |

## Famílias de Modelos e Provedores Subjacentes

O catálogo de modelos também identifica famílias de modelos ou provedores subjacentes que podem ser selecionados diretamente ou alcançados através de agregadores como o OpenRouter. Nem toda solicitação é enviada a todos os provedores.

| Provedor | Uso | Lei de proteção de dados |
| --- | --- | --- |
| [OpenAI](https://openai.com/) | Famílias de modelos OpenAI expostas no catálogo ou integrações compatíveis | [EU/UK GDPR, CCPA/CPRA e leis estaduais de privacidade dos EUA aplicáveis](https://openai.com/policies/privacy-policy/) |
| [Google Vertex AI](https://cloud.google.com/vertex-ai) | Gemini e outras famílias de modelos Google | [EU/UK GDPR, Swiss FADP e CCPA/CPRA](https://cloud.google.com/terms/data-processing-addendum/) |
| [Anthropic](https://www.anthropic.com/) | Famílias de modelos Claude | [EU/UK GDPR, Swiss FADP, LGPD e leis estaduais de privacidade dos EUA aplicáveis](https://www.anthropic.com/legal/privacy) |
| [AWS](https://aws.amazon.com/) | Famílias de modelos hospedados na AWS, como Amazon Nova ou provedores baseados em Bedrock | [EU/UK GDPR, Swiss FADP e CCPA/CPRA](https://aws.amazon.com/privacy/) |
| [Cohere](https://cohere.com/) | Famílias de modelos Cohere | [PIPEDA, GDPR e CCPA/CPRA](https://cohere.com/privacy) |
| [xAI](https://x.ai/) | Famílias de modelos Grok e Grok Voice através de rotas configuradas | [EU/UK GDPR, Swiss FADP e CCPA/CPRA](https://x.ai/legal/data-processing-addendum) |
| [Mistral AI](https://mistral.ai/) | Famílias de modelos Mistral | [GDPR, Lei Francesa de Proteção de Dados e CCPA/CPRA](https://legal.mistral.ai/terms/privacy-policy) |
| [DeepSeek](https://www.deepseek.com/) | Famílias de modelos DeepSeek | [PIPL, Lei de Segurança de Dados e Lei de Cibersegurança da República Popular da China](https://cdn.deepseek.com/policies/en-US/deepseek-privacy-policy.html) |
| [Z.ai](https://z.ai/) | Famílias de modelos GLM/Z.ai | [PDPA de Cingapura e GDPR/UK GDPR quando aplicável](https://docs.z.ai/legal-agreement/privacy-policy) |
| [Alibaba Cloud](https://www.alibabacloud.com/product/modelstudio) | Famílias de modelos Qwen/Alibaba | [GDPR/UK GDPR e leis regionais aplicáveis, incluindo PIPL](https://www.alibabacloud.com/help/en/legal/latest/alibaba-cloud-international-website-privacy-policy-history) |
| [Cerebras](https://www.cerebras.ai/) | Famílias de modelos Cerebras | [GDPR e CCPA/CPRA](https://trust.cerebras.ai/) |
| [Nebius](https://nebius.com/) | Famílias de modelos suportadas pela Nebius | [EU/UK GDPR, Lei de Implementação do GDPR Holandês e Swiss FADP](https://docs.nebius.com/legal/dpa) |
| [Fireworks AI](https://fireworks.ai/) | Famílias de modelos suportadas pela Fireworks | [EU/UK GDPR, CCPA/CPRA e leis estaduais de privacidade dos EUA aplicáveis](https://fireworks.ai/privacy-policy) |
| [Novita](https://novita.ai/) | Famílias de modelos suportadas pela Novita | [CCPA/CPRA](https://novita.ai/legal) |
| [Azure](https://azure.microsoft.com/) | Famílias de modelos suportadas pela Azure | [EU/UK GDPR, CCPA/CPRA e PIPEDA](https://www.microsoft.com/licensing/docs/view/Microsoft-Products-and-Services-Data-Protection-Addendum-DPA) |
| [LongCat](https://longcat.chat/) | Metadados da família de modelos LongCat/Meituan | [PIPL, Lei de Segurança de Dados e Lei de Cibersegurança da República Popular da China; GDPR e CCPA quando aplicável](https://longcat.chat/platform/private/) |

## Observações sobre o Manuseio de Dados

Por padrão, a AIVAX não usa Conteúdo de Entrada do Gerente de Conta, Conteúdo Gerado ou Conversas para treinar modelos proprietários da AIVAX. Registros elegíveis de busca RAG e Reflex são usados para desenvolvimento de modelo apenas quando um Gerente de Conta autorizado habilita o programa opcional descrito em [Data Collecting](/docs/pt-br/data-collecting). Indexação e armazenamento de documentos são excluídos.

Provedores de terceiros e agregadores podem ter suas próprias regras de processamento, retenção, monitoramento de abuso e melhoria de modelo. O modelo, provedor, ferramenta ou integração selecionados determinam qual terceiro recebe os dados para uma solicitação específica.

Evite enviar informações sensíveis, confidenciais, reguladas ou pessoais a um provedor a menos que você tenha revisado os termos atuais desse provedor e possua uma base legal adequada para o processamento.