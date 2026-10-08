Source: http://localhost:1313/pt-br/docs/legal/third-party-processors.html

# Processadores de Dados

AIVAX utiliza serviços de terceiros para operações específicas, como infraestrutura, armazenamento de objetos, entrega de e‑mail, processamento de pagamentos, busca na web, inferência de IA, reclassificação e geração de imagens. Os provedores envolvidos em uma solicitação dependem do modelo, gateway, ferramenta e integração selecionados.

Esta página é um inventário técnico divulgado, não um aconselhamento jurídico. Ela não lista todos os provedores que podem estar disponíveis por meio de catálogos de modelos ou agregadores. As políticas dos provedores podem mudar, e os Gerentes de Conta devem revisar os termos do provedor que se aplicam aos seus modelos e ferramentas selecionados antes de enviar dados pessoais, confidenciais, regulados ou sensíveis.

A coluna de lei de proteção de dados resume as principais estruturas identificadas na política de privacidade atual ou adendo de processamento de dados de cada provedor. A aplicabilidade pode variar de acordo com a entidade contratante, localização do titular dos dados e região de processamento.

## Operações, Serviços e Infraestrutura

| Provedor | Uso | Lei de proteção de dados |
| --- | --- | --- |
| [Cloudflare](https://www.cloudflare.com/) | Proxy reverso/segurança onde implantado e serviços de incorporação | UE/UK GDPR, Swiss FADP e CCPA/CPRA |
| [Hetzner](https://www.hetzner.com/) | Infraestrutura de computação e hospedagem | GDPR e BDSG |
| [netcup](https://www.netcup.com/) | Infraestrutura de computação e hospedagem | GDPR e BDSG |
| [Backblaze](https://www.backblaze.com/) | Armazenamento de objetos e arquivos para mídia gerada, mídia enviada, documentos gerados, arquivos expostos e artefatos de erro | UE/UK GDPR e CCPA/CPRA |
| [Brevo](https://www.brevo.com/) | E‑mail transacional e notificações | GDPR, Lei Francesa de Proteção de Dados, CCPA/CPRA, PIPEDA e LGPD |
| [InfinitePay](https://infinitepay.io/) | Criação de fatura de pagamento e confirmação de pagamento | LGPD (Lei Brasileira nº 13.709/2018) |
| [Stripe](https://stripe.com/) | Processamento de eventos de pagamento onde o checkout Stripe está configurado | UE/UK GDPR, Lei Irlandesa de Proteção de Dados de 2018 e CCPA/CPRA |
| [Twitter/X](https://developer.x.com/) | Ferramentas integradas de busca e leitura de posts do X/Twitter | UE/UK GDPR, Swiss FADP, CCPA e LGPD |
| [Linkup](https://www.linkup.so/) | Busca na web para enriquecimento de contexto | GDPR, Lei Francesa de Proteção de Dados, Diretiva ePrivacy e CCPA/CPRA |
| [Tavily](https://www.tavily.com/) | Busca na web para enriquecimento de contexto | GDPR, Lei Britânica de Proteção de Dados de 2018 e leis de privacidade estaduais dos EUA aplicáveis |
| [Sinkin AI](https://sinkin.ai/) | Geração de imagens para modelos de imagem selecionados | UE/UK GDPR, CCPA e Virginia CDPA |
| [Pollinations](https://pollinations.ai/) | Geração de imagens para modelos de imagem selecionados | GDPR |

## Provedores de Inferência Direta, Incorporação e Reclassificação

| Provedor | Uso | Lei de proteção de dados |
| --- | --- | --- |
| [Groq](https://groq.com/) | Inferência de LLM através de um endpoint compatível com OpenAI | UE/UK GDPR, Swiss FADP, CCPA/CPRA e Saudi PDPL |
| [Jina AI](https://jina.ai/) | Incorporações, reclassificação e pesquisa na web | GDPR e BDSG |
| [OpenRouter](https://openrouter.ai/) | Roteamento de modelo, fallback e síntese de fala | GDPR, CCPA/CPRA e leis de privacidade estaduais dos EUA aplicáveis |
| [DeepInfra](https://deepinfra.com/) | Inferência de IA | GDPR e CCPA/CPRA |
| [Xiaomi MiMo](https://platform.xiaomimimo.com/) | Inferência de modelo Xiaomi | PIPL, UE/UK GDPR e Swiss FADP |
| [Inception Labs](https://www.inceptionlabs.ai/) | Inferência de modelo Mercury | Código Civil da Califórnia §§ 1798.83–1798.84 e Estatutos Revisados de Nevada Capítulo 603A |
| [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/) | Serviços de incorporação | UE/UK GDPR, Swiss FADP e CCPA/CPRA |

## Famílias de Modelos e Provedores Subjacentes

| Provedor | Uso | Lei de proteção de dados |
| --- | --- | --- |
| [OpenAI](https://openai.com/) | Famílias de modelos OpenAI expostas no catálogo ou integrações compatíveis | UE/UK GDPR, CCPA/CPRA e leis de privacidade estaduais dos EUA aplicáveis |
| [Google Vertex AI](https://cloud.google.com/vertex-ai) | Famílias de modelos Gemini e outros da Google | UE/UK GDPR, Swiss FADP e CCPA/CPRA |
| [Anthropic](https://www.anthropic.com/) | Famílias de modelos Claude | UE/UK GDPR, Swiss FADP, LGPD e leis de privacidade estaduais dos EUA aplicáveis |
| [AWS](https://aws.amazon.com/) | Famílias de modelos hospedados na AWS, como Amazon Nova ou provedores baseados em Bedrock | UE/UK GDPR, Swiss FADP e CCPA/CPRA |
| [Cohere](https://cohere.com/) | Famílias de modelos Cohere | PIPEDA, GDPR e CCPA/CPRA |
| [xAI](https://x.ai/) | Famílias de modelos Grok e Grok Voice através de rotas configuradas | UE/UK GDPR, Swiss FADP e CCPA/CPRA |
| [Mistral AI](https://mistral.ai/) | Famílias de modelos Mistral | GDPR, Lei Francesa de Proteção de Dados e CCPA/CPRA |
| [DeepSeek](https://www.deepseek.com/) | Famílias de modelos DeepSeek | PIPL, Lei de Segurança de Dados e Lei de Cibersegurança da República Popular da China |
| [Z.ai](https://z.ai/) | Famílias de modelos GLM/Z.ai | PDPA de Cingapura e GDPR/UK GDPR quando aplicável |
| [Alibaba Cloud](https://www.alibabacloud.com/product/modelstudio) | Famílias de modelos Qwen/Alibaba | GDPR/UK GDPR e leis regionais aplicáveis, incluindo PIPL |
| [Cerebras](https://www.cerebras.ai/) | Famílias de modelos Cerebras | GDPR e CCPA/CPRA |
| [Nebius](https://nebius.com/) | Famílias de modelos suportados pela Nebius | UE/UK GDPR, Lei de Implementação do GDPR Holandês e Swiss FADP |
| [Fireworks AI](https://fireworks.ai/) | Famílias de modelos suportados pela Fireworks | UE/UK GDPR, CCPA/CPRA e leis de privacidade estaduais dos EUA aplicáveis |
| [Novita](https://novita.ai/) | Famílias de modelos suportados pela Novita | CCPA/CPRA |
| [Azure](https://azure.microsoft.com/) | Famílias de modelos suportados pela Azure | UE/UK GDPR, CCPA/CPRA e PIPEDA |
| [LongCat](https://longcat.chat/) | Metadados da família de modelos LongCat/Meituan | PIPL, Lei de Segurança de Dados e Lei de Cibersegurança da República Popular da China; GDPR e CCPA quando aplicável |

## Observações sobre o Manuseio de Dados

Por padrão, a AIVAX não utiliza o Conteúdo de Entrada do Gerente de Conta, Conteúdo Gerado ou Conversas para treinar modelos proprietários da AIVAX. Registros elegíveis anonimidados de RAG e reclassificação são usados apenas para desenvolvimento de modelo quando um Gerente de Conta autorizado habilita o programa opcional descrito em [Data Collecting](http://localhost:1313/pt-br/docs/data-collecting.md). Indexação e armazenamento de documentos são excluídos.

Provedores de terceiros e agregadores podem ter suas próprias regras de processamento, retenção, monitoramento de abusos e melhoria de modelo. O modelo, provedor, ferramenta ou integração selecionados determinam qual terceiro recebe os dados para uma solicitação específica.

Evite enviar informações sensíveis, confidenciais, reguladas ou pessoais a um provedor a menos que você tenha revisado os termos atuais desse provedor e possua uma base legal adequada para o processamento.
