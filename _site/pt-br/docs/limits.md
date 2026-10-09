Source: https://docs.aivax.net/pt-br/docs/limits.html

# Planos e Limites

AIVAX tem três planos de conta: **Free**, **Pro** e **Max**. O plano atual é armazenado na conta e controla o acesso ao modelo, comissões, limites de taxa, cotas de RAG, limites de ferramentas, cota de armazenamento, retenção de conversas e as alocações diárias de serviço incluídas.

Para preços de assinatura comercial e embalagem dos planos, use a [página de preços da AIVAX](https://aivax.net/pricing). Esta página documenta os limites técnicos da API.

## Como os limites são aplicados

- A autenticação rejeita chaves de API ausentes, expiradas ou desconhecidas.  
- Chaves de API públicas são restritas a rotas públicas e têm limites de solicitação e token por chave e por IP.  
- O middleware de saldo rejeita solicitações pagas quando o saldo da conta está abaixo do mínimo necessário.  
- O middleware de armazenamento rejeita solicitações quando o armazenamento da conta excede a cota do plano.  
- A inferência verifica o acesso ao modelo, taxa de solicitações, taxa de tokens de entrada, taxa BYOK e tamanho de contexto do plano Free.  
- RAG verifica contagem de coleções, taxa de busca, taxa de inserção e tamanho de importação JSONL.  
- Ferramentas integradas verificam limites diários de serviço.  
- Processamento em lote verifica quantos itens de fluxo de trabalho podem ser processados por dia.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Get%20Account%20Balance)

## Limites do Plano

Um travessão (`—`) indica que o plano não impõe um limite. Limites específicos de modelo, gateway, provedor ou endpoint ainda podem ser aplicados.

| Recurso | Free | Pro | Max |
| --- | --- | --- | --- |
| **Inferência** |  |  |  |
| Acesso ao modelo | Modelos de baixo custo | Todos os modelos | Todos os modelos |
| Multiplicador de comissão de inferência | 1.25x | 1.05x | 1.00x |
| Solicitações de modelo integrado | 20/min and 500/day | 200/min | — |
| Tokens de entrada de modelo integrado | 1,000,000/min | 20,000,000/min | — |
| Solicitações BYOK | 30/min | 200/min | — |
| Contexto máximo | 65,536 input tokens | — | — |
| Cobertura de assinatura LLM | Atualmente desativado | Atualmente desativado | Atualmente desativado |
| Solicitações autônomas de texto‑fala | 3/min and 40/hour | 30/min | 300/min |
| Solicitações autônomas de transcrição de áudio | 3/min and 40/hour | 30/min | 300/min |
| Solicitações de decisão semântica | 10/min | 50/min | — |
| **RAG e coleções** |  |  |  |
| Coleções | 5 | — | — |
| Buscas semânticas | 20/min | 500/min | 3,000/min |
| Documentos de classificação de texto | 30/min and 300/day | 1,000/min | 10,000/min |
| Documentos de segmentação de texto | 10/min and 100/day | 300/min | 2,500/min |
| Buscas de reclassificação | 30/min | 1,000/min | — |
| Tempo de processamento Reflex | 30 minutes/day | 6 hours/day | — |
| Inserções de documentos | 500/day | 10,000/day | — |
| Documentos JSONL por solicitação de importação | 1,000 | 10,000 | 1,000,000 |
| Injetor de mídia | 2 files/day | 30 files/day | 1,000 files/day |
| **Ferramentas integradas** |  |  |  |
| Busca na web | 15/day | 1,000/day | 10,000/day |
| Busca X/Twitter | Não disponível | 1,000/day | 10,000/day |
| Busca avançada na web | Não disponível | 100/day | 1,000/day |
| Geração de documentos e páginas da web | 5/day | 1,000/day | 50,000/day |
| Geração e edição de imagens | 5/day | 500/day | 5,000/day |
| Ações gerais de serviço | 30/day | 5,000/day | 100,000/day |
| Comandos Bash | 300/hour | 30,000/hour | — |
| **Testes de agente** |  |  |  |
| Novas execuções por conta | 5/min | 30/min | — |
| Execuções concorrentes por conta | 1 | 4 | 8 |
| **Processamento em lote** |  |  |  |
| Itens de fluxo de trabalho processados | 500/day | 100,000/day | — |
| Arquivos por solicitação de importação | 1,000 | 1,000 | 1,000 |
| Tamanho total de importação | 100 MiB/request | 100 MiB/request | 100 MiB/request |
| Tamanho de arquivo importado único | 10 MiB | 10 MiB | 10 MiB |
| **Conta e suporte** |  |  |  |
| Cota de armazenamento | 30 MB | 2 GB | 20 GB |
| Custo por GB excedente | — | $0.50/GB/month | $0.20/GB/month |
| Retenção de conversas | 2 horas | 2 dias | 30 dias |
| Nível de suporte | E‑mail | Prioridade | Dedicado |

### Limites de taxa de decisão semântica e Testes de agente

Esses limites por minuto são compartilhados entre chaves de API pertencentes à mesma conta. Eles são independentes das alocações de assinatura e da cobrança: o uso incluído ainda consome a cota de solicitação ou execução aplicável.

- **Decisões semânticas:** cada solicitação consome uma unidade, independentemente de quantas perguntas contém ou qual modelo de decisão é selecionado. Uma solicitação que excede o limite da conta retorna `429 Too Many Requests` antes da avaliação. Veja [Semantic decisions](https://docs.aivax.net/pt-br/docs/generations/decisions.md).
- **Testes de agente:** execuções manuais, execuções agendadas e avaliações diretas compartilham uma cota de novas execuções. Uma execução persistente consome sua unidade quando é enfileirada, não novamente quando a execução começa; turnos individuais de conversação não consomem unidades de execução adicionais. Solicitações de execuções manuais excessivas e avaliações diretas retornam `429 Too Many Requests`. Um teste agendado sem cota disponível aguarda uma verificação de agendamento posterior em vez de criar uma execução extra. Execuções existentes permanecem sujeitas aos seus limites separados de simultaneidade e inferência. Veja [Agentic Tests](https://docs.aivax.net/pt-br/docs/inference/agentic-tests.md).

Distribua as solicitações pela conta e use tentativas limitadas com backoff após um 429. Uma tentativa imediata ainda encontra a janela de limite de taxa ativa. Max não tem limite imposto pelo plano para essas duas cotas, mas outros limites aplicáveis permanecem em vigor.

### Limites de modelo de decisão semântica

Esses limites específicos de modelo se aplicam além das cotas de solicitação ao nível da conta acima. Um limite de contexto não especificado não implica entrada ilimitada.

| Modelo | Contexto |
| --- | --- |
| `@supersonic-labs/julia-1` | 1.024 tokens por pergunta |
| `@typesafe/jev-1.13` | 32.768 tokens |
| `@respan/span-01` | Não especificado no catálogo atual |
| `@respan/span-01-lite` | Não especificado no catálogo atual |
| `@jaredpalmer/kev-4b` | 8.192 tokens |
| `@upstage/solar-decide` | 524.288 tokens |
| `@cloudflare/clef` | 65.536 tokens |
| `@cloudflare/clef-flash` | 65.536 tokens |
| `@liquid/d1` | 65.536 tokens |
| `@perplexity/pplx-decider-v1-27b` | 262.144 tokens |
| `@openai/gpt-6-luna-decisions` | 1.050.000 tokens |

Julia-1 tem limites de serviço adicionais:

| Limite | Valor |
| --- | --- |
| Perguntas por solicitação | 1–32 |
| Opções ou níveis de pontuação por pergunta | 2–20 |
| Opções booleanas | Exatamente duas: false e true |
| Contexto combinado por pergunta | 1.024 tokens, incluindo estado, pergunta, opções e tokens especiais |
| Orçamento de pergunta e opções | 256 tokens dentro do contexto combinado |
| Descrição de uma opção individual | No máximo 48 tokens |
| Limite de payload de decisão | 256 KiB |

Esses limites interagem: vinte opções podem exceder o orçamento combinado de pergunta/opções mesmo que cada descrição se encaixe em seu limite individual. Os atuais limites de serviço Julia-1 da AIVAX se aplicam mesmo que um cartão de modelo upstream liste um contexto maior. Veja [Semantic decisions](https://docs.aivax.net/pt-br/docs/generations/decisions.md) para orientações de uso e erros.

### Limites de solicitação e payload

Esses limites se aplicam a todos os planos e são independentes dos limites de plano acima.

| Serviço | Limite |
| --- | --- |
| [Reflex](https://docs.aivax.net/pt-br/docs/rag/reflex.md) reranking | 10.000 documentos candidatos por solicitação; no máximo 200 resultados classificados retornados |
| [Audio transcription](https://docs.aivax.net/pt-br/docs/generations/audio-transcriptions.md) | 75 MB de áudio decodificado por solicitação |
| [Media descriptions](https://docs.aivax.net/pt-br/docs/generations/media-descriptions.md) | Arquivos remotos são baixados pela AIVAX até 5 MB cada sob o preset `auto` |
| [Fetch and OCR](https://docs.aivax.net/pt-br/docs/web-foundation/fetch-and-ocr.md) | 10 MB por item |
| [Web search](https://docs.aivax.net/pt-br/docs/web-foundation/web-search.md) | 1–25 resultados por solicitação direta de API (`topn`) |
| [Remote instruction sources](https://docs.aivax.net/pt-br/docs/inference/pipelines.md) | Tamanho máximo de resposta 10 MB |
| [Agentic Tests](https://docs.aivax.net/pt-br/docs/inference/agentic-tests.md) | Até 16 `resources` e 16 `hooks` por teste |

### Alocações diárias de assinatura incluídas

Free, Pro e Max incluem alocações diárias separadas para os serviços abaixo. Cada comparação refere‑se ao mesmo serviço no plano indicado, não a um saldo de crédito compartilhado ou a um número garantido de solicitações. Alocação não utilizada de um serviço não pode cobrir outro. Contas personalizadas não recebem alocações de assinatura.

| Serviço incluído | Free | Pro | Max |
| --- | --- | --- | --- |
| Incorporações de busca e inserção RAG | Alocação base | 25× Free | 4× Pro |
| Reclassificação com Reflex | Alocação base | 5× Free | 10× Pro |
| Decisões semânticas com Julia-1 | Alocação base | 2.5× Free | 2× Pro |
| Extração de buscar e OCR | Alocação base | 10× Free | 5× Pro |

Buscas RAG e inserções de documentos compartilham a alocação de incorporação. Ela não cobre geração de respostas, processamento de mídia, classificação de texto ou segmentação. Uma incorporação de consulta servida a partir do cache não a consome. Reflex usa uma alocação de reclassificação separada que inclui entradas em cache e sem cache. Julia-1 é atualmente o único modelo de decisão coberto pela alocação de decisão semântica; outros modelos de decisão são cobrados normalmente. A conversão opcional de JSON Fetch é separada da alocação de extração.

A cobertura é avaliada para cada item de serviço medido: a incorporação de um documento, uma incorporação de termo de consulta individual, uma chamada de reclassificação, o uso de entrada de uma chamada de decisão ou uma operação de extração. Cada item é totalmente incluído ou cobrado integralmente nas tarifas normais. Itens incluídos são rastreados no consumo da assinatura, não como entradas de custo zero no histórico de faturamento. As alocações atuais permitem uma margem de 10% acima de sua capacidade base. Um item que excederia essa margem deixa a alocação inalterada e é cobrado normalmente. Uma solicitação pode conter vários itens, de modo que alguns podem ser incluídos enquanto outros são cobrados.

As alocações diárias são redefinidas à meia‑noite no horário local do servidor. Verifique os indicadores de uso da assinatura da conta para consumo e status de redefinição; o uso pode exceder 100% enquanto estiver dentro da margem. A cobertura de assinatura LLM está atualmente desativada, portanto a inferência de modelo de texto e a geração de respostas RAG permanecem tarifadas separadamente. As alocações não contornam requisitos de saldo, limites de taxa ou o limite de tempo de processamento separado do Reflex. Veja [Pricing](https://docs.aivax.net/pt-br/docs/pricing.md) para cobranças quando um item não está coberto.

Contas personalizadas suportam 8 execuções de testes de agente simultâneas por conta. Seus limites de taxa são os limites do plano Pro multiplicados por um fator acordado para a conta, ou não têm limites de taxa do plano quando nenhum fator é definido.

Solicitações de modelo integrado são limitadas tanto pelo número de solicitações quanto pelos tokens de entrada. Grupos de limite de taxa de modelo ajustam os limites de contagem de solicitações:

| Grupo de limite de taxa | Multiplicador de limite |
| --- | --- |
| Comum | 1.0x |
| Descontado | 0.5x |
| Baixo | 0.3x |
| Gratuito | 0.1x |

Por exemplo, uma conta Pro normalmente tem 200 solicitações de modelo integrado por minuto. Com um grupo de modelo `Discounted`, o limite ajustado é 100 solicitações por minuto.

BYOK usa uma chave de provedor configurada no gateway em vez de um modelo AIVAX integrado, mas as solicitações ainda passam pela infraestrutura da AIVAX e utilizam o limite BYOK do plano.

As cotas de classificação de texto e segmentação de texto contam cada item no array `documents` da solicitação, não cada solicitação HTTP. Uma solicitação que excederia qualquer janela ativa retorna `429 Too Many Requests`. A classificação de texto usa o modelo de incorporação padrão e é cobrada pelo trabalho de incorporação realizado.

As solicitações autônomas de texto‑fala e transcrição de áudio cada uma usa sua própria cota de solicitações do plano. As sessões de voz usam o modelo em tempo real selecionado e estão sujeitas aos limites aplicáveis de acesso ao modelo, saldo e inferência, em vez dessas cotas de solicitação autônomas. A transcrição de entrada não é suportada atualmente dentro das sessões de voz.

O endpoint de importação JSONL rejeita uma solicitação quando atinge o limite de documentos por solicitação do plano. O limite de reclassificação aplica‑se ao endpoint de reclassificação autônomo e às buscas RAG que utilizam um reclassificador, incluindo buscas realizadas através de AI Gateways e ferramentas MCP.

O limite Reflex conta o tempo gasto processando solicitações Reflex. Aplica‑se ao endpoint de reclassificação autônomo e às buscas RAG que usam Reflex; entrada em cache não consome a cota separadamente. Solicitações que excedem o limite do plano retornam `429 Too Many Requests`. Veja [Reflex](https://docs.aivax.net/pt-br/docs/rag/reflex.md) para limites de solicitação, comportamento de cache e preços.

Ações gerais de serviço compartilham a cota de ação de serviço mostrada acima. O processamento em lote é assíncrono; se o processamento for pausado ou falhar por causa da cota, tente novamente após a janela de cota ser redefinida ou faça upgrade da conta. Para saber como a admissão em lote lida com pausas de cota e resultados parciais, veja [running thousands of LLM requests in batch](https://aivax.net/blog/batch-is-an-admission-control-problem-not-a-queue/).

## Chaves de API públicas

Chaves públicas têm limites adicionais independentes do plano da conta.

| Escopo | Limites de solicitação |
| --- | --- |
| Por endereço remoto | 3/5s, 20/min, 300/h, 1.000/dia |
| Global por chave | 10/5s, 60/min, 1.500/h, 10.000/dia |

| Escopo | Limites de token |
| --- | --- |
| Por endereço remoto | 100.000/5min, 500.000/30min, 2.000.000/6h, 5.000.000/dia |
| Global por chave | 500.000/5min, 2.000.000/30min, 10.000.000/6h, 25.000.000/dia |

Chaves públicas podem ser usadas para busca semântica RAG, geração de respostas RAG, geração de fala, descrições de mídia, geração de imagens e complementos de chat. Para complementos de chat, chaves públicas também requerem um UUID completo do AI Gateway, restringem parâmetros de solicitação e omitem superfícies de ferramentas do lado do servidor. Veja [Authentication](https://docs.aivax.net/pt-br/docs/authentication.md).
