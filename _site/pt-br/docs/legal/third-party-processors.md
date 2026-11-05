Source: https://docs.aivax.net/pt-br/docs/legal/third-party-processors.html

# Processadores de Dados

A AIVAX utiliza serviços de terceiros para operações específicas, como infraestrutura, armazenamento de objetos, entrega de e-mails, processamento de pagamentos e pesquisa na web. Os provedores envolvidos em uma solicitação dependem do modelo, gateway, ferramenta e integração selecionados.

Esta página é um inventário técnico divulgado, não aconselhamento jurídico. As políticas dos provedores podem mudar, e os Gerentes de Conta devem revisar os termos dos provedores aplicáveis aos seus modelos e ferramentas selecionados antes de enviar dados pessoais, confidenciais, regulamentados ou sensíveis.

A coluna "Lei de Proteção de Dados" resume as principais estruturas identificadas na política de privacidade atual ou no adendo de processamento de dados de cada provedor. A aplicabilidade pode variar conforme a entidade contratante, a localização do titular dos dados e a região de processamento.

## Operações, Serviços e Infraestrutura

| Provedor | Utilizado para | Lei de Proteção de Dados |
| --- | --- | --- |
| [Cloudflare](https://www.cloudflare.com/) | Proxy reverso e segurança onde implantado | [EU/UK GDPR, Swiss FADP e CCPA/CPRA](https://www.cloudflare.com/cloudflare-customer-dpa/) |
| [Hetzner](https://www.hetzner.com/) | Infraestrutura de computação e hospedagem | [GDPR e BDSG](https://docs.hetzner.com/general/company-and-policy/data-protection-at-hetzner/) |
| [netcup](https://www.netcup.com/) | Infraestrutura de computação e hospedagem | [GDPR e BDSG](https://www.netcup.com/en/contact/data-privacy) |
| [Backblaze](https://www.backblaze.com/) | Armazenamento de objetos e arquivos para mídia gerada, mídia enviada, documentos gerados, arquivos expostos e artefatos de erro | [EU/UK GDPR e CCPA/CPRA](https://www.backblaze.com/company/privacy) |
| [Brevo](https://www.brevo.com/) | E-mail transacional e notificações | [GDPR, Lei Francesa de Proteção de Dados, CCPA/CPRA, PIPEDA e LGPD](https://www.brevo.com/legal/privacypolicy/) |
| [Mixtic](https://mixtic.com.br/) | Links de pagamento, métodos de pagamento salvos, cobranças de crédito e assinatura, e confirmação de pagamento | [LGPD (Lei Brasileira nº 13.709/2018)](https://mixtic.com.br/privacidade) |
| [Twitter/X](https://developer.x.com/) | Ferramentas integradas de pesquisa e leitura de posts do X/Twitter | [EU/UK GDPR, Swiss FADP, CCPA e LGPD](https://x.com/en/privacy) |
| [Linkup](https://www.linkup.so/) | Pesquisa na web para enriquecimento de contexto | [GDPR, Lei Francesa de Proteção de Dados, Diretiva ePrivacy e CCPA/CPRA](https://www.linkup.so/privacy-policy) |
| [Jina AI](https://jina.ai/) | Pesquisa na web para enriquecimento de contexto | [GDPR e BDSG](https://jina.ai/legal/) |
| [Tavily](https://www.tavily.com/) | Pesquisa na web para enriquecimento de contexto | [GDPR, UK Data Protection Act 2018 e leis de privacidade estaduais dos EUA aplicáveis](https://www.tavily.com/privacy) |

## Políticas de Coleta

As tabelas abaixo descrevem o que a própria AIVAX retém para cada serviço. Cada serviço é classificado em um de três níveis:

| Nível | Significado |
| --- | --- |
| 🟢 **ZDR** | Retenção zero de dados. A AIVAX não armazena a entrada ou saída da solicitação após a resposta ser retornada. |
| 🟡 **Parcial** | A AIVAX mantém logs, registros ou metadados sobre a operação, mas não seu conteúdo, por um período indeterminado. |
| 🔴 **Completo** | A AIVAX armazena o próprio conteúdo, que pode incluir dados pessoais ou sensíveis, por um período indeterminado. |

Quando uma configuração altera o nível, a coluna "Política de Coleta" lista cada condição e seu nível. Todo serviço também produz os registros de uso, faturamento e técnicos descritos na [Política de Privacidade](https://docs.aivax.net/pt-br/docs/legal/privacy-policy.md), e os recursos de conta armazenados podem estar incluídos em backups. Provedores de terceiros que recebem dados para uma solicitação aplicam suas próprias regras de retenção. As utilidades MCP seguem a política do serviço que elas chamam.

## RAG e Coleções

| Descrição | Política de Coleta | Detalhes |
| --- | --- | --- |
| [Coleções e documentos](https://docs.aivax.net/pt-br/docs/rag/collections.md) | 🔴 Completo | O texto do documento, embeddings e metadados são armazenados até que você exclua o documento ou a coleção. |
| [Pesquisa semântica](https://docs.aivax.net/pt-br/docs/rag/semantic-search.md) | **Registro de RAG habilitado:** 🔴 Completo<br>**Registro de RAG desabilitado:** 🟡 Parcial | O **registro de RAG** nas configurações da conta registra os termos de consulta, documentos retornados, pontuações, tempo de processamento e custo na aba [Transações](https://docs.aivax.net/pt-br/docs/rag/observability.md) da coleção. Ele está habilitado por padrão. |
| [Reflex e rerankers](https://docs.aivax.net/pt-br/docs/rag/reranking.md) | **Compartilhamento de Dados desabilitado:** 🟢 ZDR<br>**Compartilhamento de Dados habilitado:** 🔴 Completo | Documentos candidatos não são armazenados; o Reflex usa um cache temporário na memória para cobrar entradas repetidas à taxa de acerto no cache. Com o [Compartilhamento de Dados](https://docs.aivax.net/pt-br/docs/data-sharing.md) habilitado, a consulta anonimizada, os documentos e os resultados de classificação são mantidos para o desenvolvimento do modelo. O Compartilhamento de Dados está desabilitado por padrão e também cobre os resultados anonimizados das pesquisas semânticas. |
| [Memórias do usuário](https://docs.aivax.net/pt-br/docs/tools/builtin-tools.md#memory) | 🔴 Completo | Memórias salvas pela ferramenta integrada Memory são armazenadas na coleção `@memories` até serem excluídas ou expirarem. |

## Inferência

| Descrição | Política de Coleta | Detalhes |
| --- | --- | --- |
| [Completions de chat e Gateways de IA](https://docs.aivax.net/pt-br/docs/inference/chat-completions/concepts.md#response-and-conversation-records) | **Registro de conversas habilitado:** 🔴 Completo<br>**Registro de conversas desabilitado:** 🟡 Parcial | O **registro de conversas** nas configurações da conta armazena mensagens, chamadas de ferramentas, metadados, uso e erros como conversas. Ele está habilitado por padrão. Defina `allow_logging: false` para excluir uma única solicitação. Habilite [Apenas provedores com retenção zero de dados](https://docs.aivax.net/pt-br/docs/inference/routing/zdr.md) para restringir os modelos de texto integrados a provedores que não retêm prompts. |
| Configuração do [Gateway de IA](https://docs.aivax.net/pt-br/docs/inference/ai-gateways/concepts.md) e [skill](https://docs.aivax.net/pt-br/docs/inference/skills.md) | 🔴 Completo | Instruções, skills, ferramentas e configurações de integração são armazenadas até serem excluídas. |
| Pré-processamento multimodal | 🔴 Completo | Quando anexos são convertidos em texto por meio de descrição, OCR ou transcrição durante a inferência, o texto resultante é armazenado em cache por conta para evitar o reprocessamento do mesmo conteúdo. Arquivos originais não são armazenados. |
| Diagnósticos de erro do provedor | 🔴 Completo | Quando um provedor de modelo retorna um erro, a solicitação enviada ao provedor e sua resposta podem ser armazenadas para diagnóstico, independentemente do registro de conversas. |
| [Clientes de Chat](https://docs.aivax.net/pt-br/docs/inference/chat-clients.md) | 🔴 Completo | Sessões armazenam histórico de mensagens, contexto extra e metadados até que a sessão expire. Mídia enviada como URLs de dados é carregada no armazenamento de objetos e referenciada por uma URL pública. Áudio gerado é armazenado em cache quando a síntese de áudio está habilitada. A inferência segue também a condição de registro de conversas. |
| [Voz e Realtime](https://docs.aivax.net/pt-br/docs/inference/voice-session.md) | **Registro de conversas habilitado:** 🔴 Completo<br>**Registro de conversas desabilitado:** 🟡 Parcial | Segue a configuração de **Registro de Conversas** da conta. Não pode ser desabilitado por sessão. |
| [Processamento em lote](https://docs.aivax.net/pt-br/docs/inference/batch.md) | 🔴 Completo | Fluxos de trabalho, jobs e entradas e saídas de itens são armazenados até que você os exclua ou limpe os itens do job. |
| [Testes Agênticos](https://docs.aivax.net/pt-br/docs/inference/agentic-tests.md) | 🔴 Completo | Definições de teste, execuções, conversas simuladas e resultados de julgamento são armazenados. |
| [Sandboxing de shell](https://docs.aivax.net/pt-br/docs/tools/shell.md#data-persistence) | **Persistência desabilitada:** 🟢 ZDR<br>**Persistência habilitada:** 🔴 Completo | Com `allowDataPersistence` habilitado e um ID externo de usuário, os arquivos persistem em um espaço de trabalho por usuário até serem excluídos. Caso contrário, o sistema de arquivos na memória é descartado após a iteração de inferência. A persistência está desabilitada por padrão. |
| [Funções de protocolo](https://docs.aivax.net/pt-br/docs/tools/protocol-functions.md) | 🟡 Parcial | Chamadas de função são enviadas ao seu callback e não são armazenadas além do registro de conversas. Falhas de callback e suas mensagens de erro são registradas nos logs da conta. |

## Fundação Web

| Descrição | Política de Coleta | Detalhes |
| --- | --- | --- |
| [Pesquisa na Web](https://docs.aivax.net/pt-br/docs/web-foundation/web-search.md) | 🟢 ZDR | Consultas e resultados não são armazenados. As consultas são enviadas aos provedores de pesquisa na web listados acima. |
| [Busca e OCR](https://docs.aivax.net/pt-br/docs/web-foundation/fetch-and-ocr.md) | 🟢 ZDR | Páginas buscadas, arquivos, texto extraído e saída JSON não são armazenados. A conversão opcional para JSON é processada por um provedor de modelo de linguagem. |
| [Pesquisa de posts do X](https://docs.aivax.net/pt-br/docs/tools/builtin-tools.md#x-posts-search) | 🟢 ZDR | Consultas e posts não são armazenados. As consultas são enviadas ao X. |

## Geração de Mídia

| Descrição | Política de Coleta | Detalhes |
| --- | --- | --- |
| [Geração de imagens](https://docs.aivax.net/pt-br/docs/generations/images.md) | 🔴 Completo | Imagens geradas são carregadas no armazenamento de objetos e servidas a partir de uma URL pública. Qualquer pessoa com a URL pode abrir a imagem. Prompts e imagens de referência são enviados ao provedor do modelo de imagem. |
| Geração de [Documento](https://docs.aivax.net/pt-br/docs/tools/builtin-tools.md#document-generation) e [página da web](https://docs.aivax.net/pt-br/docs/tools/builtin-tools.md#web-page-generation) | 🔴 Completo | Arquivos criados por essas ferramentas integradas são hospedados nos servidores da AIVAX e servidos a partir de uma URL pública. |
| [Texto para fala](https://docs.aivax.net/pt-br/docs/generations/speech.md) | **API:** 🟢 ZDR<br>**[MCP de geração de mídia](https://docs.aivax.net/pt-br/docs/mcp-utilities/media-generation-mcp.md):** 🔴 Completo | A API retorna o áudio na resposta sem armazená-lo. A ferramenta de fala do MCP carrega o MP3 no armazenamento de objetos e retorna uma URL pública. |
| [Fala para texto](https://docs.aivax.net/pt-br/docs/generations/audio-transcriptions.md) | 🟢 ZDR | Áudio e transcrições não são armazenados. |

## Processamento de Dados

| Descrição | Política de Coleta | Detalhes |
| --- | --- | --- |
| [Descrições de Mídia](https://docs.aivax.net/pt-br/docs/data-processing/media-descriptions.md) | 🟢 ZDR | Mídia submetida e descrições geradas não são armazenadas por este endpoint. Anexos convertidos durante a inferência seguem a política de pré-processamento multimodal. |
| [Classificação de Texto](https://docs.aivax.net/pt-br/docs/data-processing/classification.md) | 🟢 ZDR | O texto não é armazenado. Embeddings usam um cache temporário na memória para reduzir latência e custo para texto repetido. |
| [Decisões Semânticas](https://docs.aivax.net/pt-br/docs/data-processing/decisions.md) | 🟢 ZDR | Entradas e resultados não são armazenados. |
| [Segmentação de Texto](https://docs.aivax.net/pt-br/docs/data-processing/text-segmentation.md) | 🟢 ZDR | Texto fonte e segmentos não são armazenados. A sanitização é processada por um provedor de modelo de linguagem. |

## Utilitários de Conta

| Descrição | Política de Coleta | Detalhes |
| --- | --- | --- |
| Contas e chaves de API | 🟡 Parcial | Dados da conta, configurações e metadados da chave de API são mantidos enquanto a conta estiver ativa. |
| Faturamento e pagamentos | 🟡 Parcial | Faturas, créditos, recibos e registros de pagamento são mantidos de acordo com requisitos legais, contábeis e contratuais. Os pagamentos são processados pela Mixtic. |
| Logs de uso e técnicos | 🟡 Parcial | Registros de uso com modelo, quantidade, custo e recursos vinculados, e logs de inferência e acesso com metadados como endereços IP e strings de user-agent. |
| Logs da conta | 🟡 Parcial | Avisos operacionais e erros mostrados nos logs da conta. |
| Notificações | 🟡 Parcial | Notificações da conta são armazenadas para o painel. Notificações por e-mail são entregues através da Brevo. |

## Notas sobre Manipulação de Dados

Por padrão, a AIVAX não utiliza Conteúdo de Entrada do Gerente de Conta, Conteúdo Gerado ou Conversas para treinar modelos proprietários da AIVAX. Registros de RAG e reranking anonimizados elegíveis são usados apenas para desenvolvimento de modelo quando um Gerente de Conta autorizado habilita o programa opcional descrito em [Compartilhamento de Dados](https://docs.aivax.net/pt-br/docs/data-sharing.md). A indexação e o armazenamento de documentos estão excluídos.

Provedores de terceiros podem ter suas próprias regras de processamento, retenção, monitoramento de abuso e melhoria de modelo. O modelo, provedor, ferramenta ou integração selecionados determinam qual terceiro recebe dados para uma solicitação específica.

Evite enviar informações sensíveis, confidenciais, regulamentadas ou pessoais para um provedor, a menos que você tenha revisado os termos atuais desse provedor e tenha uma base legal adequada para o processamento.
