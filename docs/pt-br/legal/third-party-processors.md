# Processadores de Dados

AIVAX usa serviços de terceiros para operações específicas, como infraestrutura, armazenamento de objetos, entrega de e‑mail, processamento de pagamentos, busca na web, inferência de IA, reclassificação e geração de imagens. Os provedores envolvidos em uma solicitação dependem do modelo selecionado, gateway, ferramenta e integração.

Esta página é um inventário técnico, não um aconselhamento jurídico. As políticas dos provedores podem mudar, e os Gerentes de Conta devem revisar os termos do provedor que se aplicam aos seus modelos e ferramentas selecionados antes de enviar dados pessoais, confidenciais, regulados ou sensíveis.

## Operações, Serviços e Infraestrutura

| Provedor | Usado para |
| --- | --- |
| [Cloudflare](https://www.cloudflare.com/) | Proxy reverso/segurança onde implantado, reclassificação Workers AI e serviços de incorporação |
| [Backblaze](https://www.backblaze.com/) | Armazenamento de objetos e arquivos para mídia gerada, mídia enviada, documentos gerados, arquivos expostos e artefatos de erro |
| [Brevo](https://www.brevo.com/) | E‑mail transacional e notificações |
| [InfinitePay](https://infinitepay.io/) | Criação de faturas de pagamento e confirmação de pagamento |
| [Stripe](https://stripe.com/) | Processamento de eventos de pagamento onde o checkout Stripe está configurado |
| [Twitter/X](https://developer.x.com/) | Ferramentas integradas de busca X/Twitter e leitura de postagens |
| [Linkup](https://www.linkup.so/) | Busca na web para enriquecimento de contexto |
| [Tavily](https://www.tavily.com/) | Busca na web para enriquecimento de contexto |
| [Sinkin AI](https://sinkin.ai/) | Geração de imagens para modelos de imagem selecionados |
| [Pollinations](https://pollinations.ai/) | Geração de imagens para modelos de imagem selecionados |

## Provedores de Inferência Direta, Incorporação e Reclassificação

| Provedor | Usado para |
| --- | --- |
| [Groq](https://groq.com/) | Inferência de LLM através de um endpoint compatível com OpenAI |
| [DeepInfra](https://deepinfra.com/) | Inferência de LLM através de um endpoint compatível com OpenAI |
| [Vultr](https://www.vultr.com/) | Inferência de LLM através do Vultr Inference |
| [CrofAI](https://ai.nahcrof.com/) | Inferência de LLM através de um endpoint compatível com OpenAI |
| [OpenRouter](https://openrouter.ai/) | Roteamento de modelo e fallback para muitas famílias de modelos e Grok Voice TTS |
| [Xiaomi MiMo](https://platform.xiaomimimo.com/) | Inferência de modelo Xiaomi |
| [NagaAI](https://naga.ac/) | Inferência de LLM, incorporações, TTS e fluxos de pesquisa selecionados |
| [Inception Labs](https://www.inceptionlabs.ai/) | Inferência de modelo Mercury |
| [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/) | Serviços inteligentes de reclassificação e incorporação |

## Famílias de Modelos e Provedores Subjacentes

O catálogo de modelos também identifica famílias de modelos ou provedores subjacentes que podem ser selecionados diretamente ou alcançados por agregadores como OpenRouter ou NagaAI. Nem toda solicitação é enviada a todos os provedores.

| Provedor | Usado para |
| --- | --- |
| [OpenAI](https://openai.com/) | Famílias de modelos OpenAI expostas no catálogo ou integrações compatíveis |
| [Google Vertex AI](https://cloud.google.com/vertex-ai) | Famílias de modelos Gemini e outras da Google |
| [Anthropic](https://www.anthropic.com/) | Famílias de modelos Claude |
| [AWS](https://aws.amazon.com/) | Famílias de modelos hospedados na AWS, como Amazon Nova ou provedores baseados em Bedrock |
| [Cohere](https://cohere.com/) | Famílias de modelos Cohere |
| [xAI](https://x.ai/) | Famílias de modelos Grok e Grok Voice através de rotas configuradas |
| [Mistral AI](https://mistral.ai/) | Famílias de modelos Mistral |
| [DeepSeek](https://www.deepseek.com/) | Famílias de modelos DeepSeek |
| [Z.ai](https://z.ai/) | Famílias de modelos GLM/Z.ai |
| [Alibaba Cloud](https://www.alibabacloud.com/product/modelstudio) | Famílias de modelos Qwen/Alibaba |
| [Cerebras](https://www.cerebras.ai/) | Famílias de modelos Cerebras |
| [Nebius](https://nebius.com/) | Famílias de modelos suportados pela Nebius |
| [Fireworks AI](https://fireworks.ai/) | Famílias de modelos suportados pela Fireworks AI |
| [Novita](https://novita.ai/) | Famílias de modelos suportados pela Novita |
| [Azure](https://azure.microsoft.com/) | Famílias de modelos suportados pela Azure |
| [LongCat](https://longcat.chat/) | Metadados da família de modelos LongCat/Meituan |

## Observações sobre Manipulação de Dados

AIVAX não usa Conteúdo de Entrada do Gerente de Conta, Conteúdo Gerado ou Conversas para treinar modelos proprietários da AIVAX.

Provedores e agregadores de terceiros podem ter suas próprias regras de processamento, retenção, monitoramento de abuso e aprimoramento de modelo. O modelo selecionado, provedor, ferramenta ou integração determina qual terceiro recebe os dados para uma solicitação específica.

Evite enviar informações sensíveis, confidenciais, reguladas ou pessoais a um provedor a menos que você tenha revisado os termos atuais desse provedor e possua uma base legal adequada para o processamento.