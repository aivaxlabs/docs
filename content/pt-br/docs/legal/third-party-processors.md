---
{title: Processadores de Dados,linkTitle: Processadores de Dados,weight: 30,group: Legal documents,sourceHash: a713f15d5124dcd7,aliases: [/docs/pt-br/legal/third-party-processors.html]}
---

# Processadores de Dados

AIVAX usa serviços de terceiros para operações específicas, como infraestrutura, armazenamento de objetos, entrega de e‑mail, processamento de pagamentos e busca na web. Os provedores envolvidos em uma solicitação dependem do modelo selecionado, gateway, ferramenta e integração.

Esta página é um inventário técnico divulgado, não um aconselhamento jurídico. As políticas dos provedores podem mudar, e os Gerentes de Conta devem revisar os termos do provedor que se aplicam aos seus modelos e ferramentas selecionados antes de enviar dados pessoais, confidenciais, regulados ou sensíveis.

A coluna de Lei de proteção de dados resume os principais marcos identificados na política de privacidade atual ou adendo de processamento de dados de cada provedor. A aplicabilidade pode variar conforme a entidade contratante, a localização do titular dos dados e a região de processamento.

## Operações, Serviços e Infraestrutura

| Provedor | Usado para | Lei de proteção de dados |
| --- | --- | --- |
| [Cloudflare](https://www.cloudflare.com/) | Proxy reverso e segurança onde está implantado | [EU/UK GDPR, Swiss FADP, and CCPA/CPRA](https://www.cloudflare.com/cloudflare-customer-dpa/) |
| [Hetzner](https://www.hetzner.com/) | Infraestrutura de computação e hospedagem | [GDPR and BDSG](https://docs.hetzner.com/general/company-and-policy/data-protection-at-hetzner/) |
| [netcup](https://www.netcup.com/) | Infraestrutura de computação e hospedagem | [GDPR and BDSG](https://www.netcup.com/en/contact/data-privacy) |
| [Backblaze](https://www.backblaze.com/) | Armazenamento de objetos e arquivos para mídia gerada, mídia enviada, documentos gerados, arquivos expostos e artefatos de erro | [EU/UK GDPR and CCPA/CPRA](https://www.backblaze.com/company/privacy) |
| [Brevo](https://www.brevo.com/) | E‑mail transacional e notificações | [GDPR, French Data Protection Act, CCPA/CPRA, PIPEDA, and LGPD](https://www.brevo.com/legal/privacypolicy/) |
| [Mixtic](https://mixtic.com.br/) | Links de pagamento, métodos de pagamento salvos, cobranças de crédito e assinatura, e confirmação de pagamento | [LGPD (Brazilian Law No. 13,709/2018)](https://mixtic.com.br/privacidade) |
| [Twitter/X](https://developer.x.com/) | Ferramentas integradas de busca e leitura de posts do X/Twitter | [EU/UK GDPR, Swiss FADP, CCPA, and LGPD](https://x.com/en/privacy) |
| [Linkup](https://www.linkup.so/) | Busca na web para enriquecimento de contexto | [GDPR, French Data Protection Act, ePrivacy Directive, and CCPA/CPRA](https://www.linkup.so/privacy-policy) |
| [Jina AI](https://jina.ai/) | Busca na web para enriquecimento de contexto | [GDPR and BDSG](https://jina.ai/legal/) |
| [Tavily](https://www.tavily.com/) | Busca na web para enriquecimento de contexto | [GDPR, UK Data Protection Act 2018, and applicable U.S. state privacy laws](https://www.tavily.com/privacy) |

## Políticas de Coleta

As tabelas abaixo descrevem o que a própria AIVAX retém para cada serviço. Cada serviço é classificado em um dos três níveis:

| Nível | Significado |
| --- | --- |
| 🟢 **ZDR** | Retenção zero de dados. AIVAX não armazena a entrada ou saída da solicitação após a resposta ser retornada. |
| 🟡 **Parcial** | AIVAX mantém logs, registros ou metadados sobre a operação, mas não seu conteúdo, por período indefinido. |
| 🔴 **Completo** | AIVAX armazena o próprio conteúdo, que pode incluir dados pessoais ou sensíveis, por período indefinido. |

Quando uma configuração altera o nível, a coluna Política de Coleta lista cada condição e seu nível. Cada serviço também produz os registros de uso, faturamento e técnicos descritos na [Privacy Policy](/docs/pt-br/legal/privacy-policy.md), e recursos de conta armazenados podem ser incluídos em backups. Provedores de terceiros que recebem dados para uma solicitação aplicam suas próprias regras de retenção. As utilidades MCP seguem a política do serviço que chamam.

## RAG e Coleções

| Descrição | Política de Coleta | Detalhes |
| --- | --- | --- |
| [Collections and documents](/docs/pt-br/rag/collections.md) | 🔴 Completo | Texto do documento, embeddings e metadados são armazenados até que você exclua o documento ou a coleção. |
| [Semantic search](/docs/pt-br/rag/semantic-search.md) | **Registro de RAG habilitado:** 🔴 Completo<br>**Registro de RAG desativado:** 🟡 Parcial | **Registro de RAG** nas configurações da conta registra termos de consulta, documentos retornados, pontuações, tempo de processamento e custo na aba [Transactions](/docs/pt-br/rag/observability.md) da coleção. Está habilitado por padrão. |
| [Reflex and rerankers](/docs/pt-br/rag/reranking.md) | **Compartilhamento de Dados desativado:** 🟢 ZDR<br>**Compartilhamento de Dados habilitado:** 🔴 Completo | Documentos candidatos não são armazenados; o Reflex usa um cache temporário na memória para cobrar entradas repetidas na taxa de acerto de cache. Com o [Data Sharing](/docs/pt-br/data-sharing.md) habilitado, a consulta anonimizada, documentos e resultados de classificação são mantidos para desenvolvimento do modelo. O Compartilhamento de Dados está desativado por padrão e também cobre os resultados anonimados de buscas semânticas. |
| [User memories](/docs/pt-br/tools/builtin-tools.md#memory) | 🔴 Completo | Memórias salvas pela ferramenta interna de Memória são armazenadas na coleção `@memories` até serem excluídas ou expirarem. |

## Inferência

| Descrição | Política de Coleta | Detalhes |
| --- | --- | --- |
| [Chat completions and AI Gateways](/docs/pt-br/inference/inference.md#response-and-conversation-records) | **Registro de conversas habilitado:** 🔴 Completo<br>**Registro de conversas desativado:** 🟡 Parcial | **Registro de conversas** nas configurações da conta armazena mensagens, chamadas de ferramentas, metadados, uso e erros como conversas. Está habilitado por padrão. Defina `allow_logging: false` para excluir uma única solicitação. Habilite [Zero data retention providers only](/docs/pt-br/inference/inference.md#zero-data-retention-providers-only) para restringir modelos de texto integrados a provedores que não retêm prompts. |
| [gateway de IA](/docs/pt-br/inference/ai-gateway.md) e [habilidade](/docs/pt-br/inference/skills.md) configuration | 🔴 Completo | Instruções, habilidades, ferramentas e configurações de integração são armazenadas até serem excluídas. |
| Pré‑processamento multimodal | 🔴 Completo | Quando anexos são convertidos em texto por descrição, OCR ou transcrição durante a inferência, o texto resultante é armazenado em cache por conta para evitar reprocessamento do mesmo conteúdo. Arquivos originais não são armazenados. |
| Diagnóstico de erros do provedor | 🔴 Completo | Quando um provedor de modelo retorna um erro, a solicitação enviada ao provedor e sua resposta podem ser armazenadas para diagnóstico, independentemente do registro de conversas. |
| [Chat Clients](/docs/pt-br/inference/chat-clients.md) | 🔴 Completo | As sessões armazenam histórico de mensagens, contexto extra e metadados até que a sessão expire. Mídia enviada como URLs de dados é carregada no armazenamento de objetos e referenciada por uma URL pública. Áudio gerado é armazenado em cache quando a síntese de áudio está habilitada. A inferência também segue a condição de registro de conversas. |
| [Voice and Realtime](/docs/pt-br/inference/voice-session.md) | **Registro de conversas habilitado:** 🔴 Completo<br>**Registro de conversas desativado:** 🟡 Parcial | Segue a configuração de **Registro de conversas** da conta. Não pode ser desativado por sessão. |
| [Batch processing](/docs/pt-br/inference/batch.md) | 🔴 Completo | Fluxos de trabalho, tarefas e entradas/saídas de itens são armazenados até que você os exclua ou limpe os itens da tarefa. |
| [Agentic Tests](/docs/pt-br/inference/agentic-tests.md) | 🔴 Completo | Definições de teste, execuções, conversas simuladas e resultados de avaliadores são armazenados. |
| [Shell sandboxing](/docs/pt-br/tools/shell.md#data-persistence) | **Persistência desativada:** 🟢 ZDR<br>**Persistência habilitada:** 🔴 Completo | Com `allowDataPersistence` habilitado e um ID externo de usuário, arquivos permanecem em um workspace por usuário até serem excluídos. Caso contrário, o sistema de arquivos em memória é descartado após a iteração de inferência. A persistência está desativada por padrão. |
| [Protocol functions](/docs/pt-br/tools/protocol-functions.md) | 🟡 Parcial | Chamadas de função são enviadas ao seu callback e não são armazenadas além do registro de conversas. Falhas de callback e suas mensagens de erro são registradas nos logs da conta. |

## Fundação Web

| Descrição | Política de Coleta | Detalhes |
| --- | --- | --- |
| [Web Search](/docs/pt-br/web-foundation/web-search.md) | 🟢 ZDR | Consultas e resultados não são armazenados. As consultas são enviadas aos provedores de busca na web listados acima. |
| [Fetch and OCR](/docs/pt-br/web-foundation/fetch-and-ocr.md) | 🟢 ZDR | Páginas buscadas, arquivos, texto extraído e saída JSON não são armazenados. Conversão opcional para JSON é processada por um provedor de modelo de linguagem. |
| [X posts search](/docs/pt-br/tools/builtin-tools.md#x-posts-search) | 🟢 ZDR | Consultas e posts não são armazenados. As consultas são enviadas ao X. |

## Geração de Mídia

| Descrição | Política de Coleta | Detalhes |
| --- | --- | --- |
| [Image generation](/docs/pt-br/generations/images.md) | 🔴 Completo | Imagens geradas são enviadas ao armazenamento de objetos e servidas a partir de uma URL pública. Qualquer pessoa com a URL pode abrir a imagem. Prompts e imagens de referência são enviados ao provedor do modelo de imagem. |
| [Document](/docs/pt-br/tools/builtin-tools.md#document-generation) e [web page](/docs/pt-br/tools/builtin-tools.md#web-page-generation) generation | 🔴 Completo | Arquivos criados por essas ferramentas internas são hospedados nos servidores da AIVAX e servidos a partir de uma URL pública. |
| [Text-to-speech](/docs/pt-br/generations/speech.md) | **API:** 🟢 ZDR<br>**[Media generation MCP](/docs/pt-br/mcp-utilities/media-generation-mcp.md):** 🔴 Completo | A API devolve áudio na resposta sem armazená‑lo. A ferramenta de fala do MCP envia o MP3 ao armazenamento de objetos e devolve uma URL pública. |
| [Speech-to-text](/docs/pt-br/generations/audio-transcriptions.md) | 🟢 ZDR | Áudio e transcrições não são armazenados. |

## Processamento de Dados

| Descrição | Política de Coleta | Detalhes |
| --- | --- | --- |
| [Media Descriptions](/docs/pt-br/data-processing/media-descriptions.md) | 🟢 ZDR | Mídia enviada e descrições geradas não são armazenadas por este endpoint. Anexos convertidos durante a inferência seguem a política de pré‑processamento multimodal. |
| [Text Classification](/docs/pt-br/data-processing/classification.md) | 🟢 ZDR | Texto não é armazenado. Embeddings usam um cache temporário em memória para reduzir latência e custo para texto repetido. |
| [Semantic Decisions](/docs/pt-br/data-processing/decisions.md) | 🟢 ZDR | Entradas e resultados não são armazenados. |
| [Text Segmentation](/docs/pt-br/data-processing/text-segmentation.md) | 🟢 ZDR | Texto fonte e segmentos não são armazenados. A sanitização é processada por um provedor de modelo de linguagem. |

## Utilitários de Conta

| Descrição | Política de Coleta | Detalhes |
| --- | --- | --- |
| Conta e chaves de API | 🟡 Parcial | Dados da conta, configurações e metadados das chaves de API são mantidos enquanto a conta está ativa. |
| Faturamento e pagamentos | 🟡 Parcial | Faturas, créditos, recibos e registros de pagamento são mantidos de acordo com requisitos legais, contábeis e contratuais. Pagamentos são processados pela Mixtic. |
| Uso e logs técnicos | 🟡 Parcial | Registros de uso com modelo, quantidade, custo e recursos vinculados, e logs de inferência e acesso com metadados como endereços IP e strings de agente de usuário. |
| Logs de conta | 🟡 Parcial | Avisos operacionais e erros mostrados nos logs da conta. |
| Notificações | 🟡 Parcial | Notificações da conta são armazenadas para o painel. Notificações por e‑mail são entregues via Brevo. |

## Notas de Manipulação de Dados

Por padrão, a AIVAX não utiliza o Conteúdo de Entrada do Gerente de Conta, Conteúdo Gerado ou Conversas para treinar modelos proprietários da AIVAX. Registros elegíveis de RAG anonimizado e reclassificação são usados para desenvolvimento de modelo somente quando um Gerente de Conta autorizado habilita o programa opcional descrito em [Data Sharing](/docs/pt-br/data-sharing). Indexação e armazenamento de documentos são excluídos.

Provedores de terceiros podem ter suas próprias regras de processamento, retenção, monitoramento de abuso e melhoria de modelo. O modelo, provedor, ferramenta ou integração selecionados determinam qual terceiro recebe os dados para uma solicitação específica.

Evite enviar informações sensíveis, confidenciais, reguladas ou pessoais a um provedor a menos que você tenha revisado os termos atuais desse provedor e possua uma base legal apropriada para o processamento.
