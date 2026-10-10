---
{title: Planos e Limites,linkTitle: Planos e limites,weight: 50,group: Introduction,sourceHash: "5513642e07912518",aliases: [/docs/pt-br/limits.html]}
---

# Planos e Limites

AIVAX tem três planos de conta: **Free**, **Pro** e **Max**. O plano atual é armazenado na conta e controla o acesso ao modelo, comissões, limites de taxa, cotas de RAG, limites de ferramentas, cota de armazenamento, retenção de conversas e permissões diárias de serviço incluídas.

Para preços de assinatura comercial e pacotes de plano, use a [página de preços da AIVAX](https://aivax.net/pricing). Esta página documenta os limites técnicos da API.

## Como os limites são aplicados

Os limites são aplicados em diferentes camadas:

- A autenticação rejeita chaves de API ausentes, expiradas ou desconhecidas.
- Chaves de API públicas são restritas a rotas públicas e têm limites de requisição e token por chave e por IP.
- O middleware de saldo rejeita requisições cobráveis quando o saldo da conta está abaixo do mínimo exigido.
- O middleware de armazenamento rejeita requisições quando o armazenamento da conta ultrapassa a cota do plano.
- As verificações de inferência analisam acesso ao modelo, taxa de requisição, taxa de tokens de entrada, taxa BYOK e tamanho de contexto do plano Free.
- As verificações de RAG analisam contagem de coleções, taxa de busca, taxa de inserção e tamanho de importação JSONL.
- As ferramentas integradas verificam limites de serviço diário.
- O processamento em lote verifica quantos itens de fluxo de trabalho podem ser processados por dia.

Referência:

<script src="https://inference.aivax.net/apidocs?embed-target=Get%20Account%20Balance&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Limites dos planos

Um travessão longo (`—`) indica que o plano não impõe um limite. Limites específicos de modelo, gateway, provedor ou endpoint ainda podem ser aplicados.

| Recurso | Free | Pro | Max |
| --- | --- | --- | --- |
| **Inferência** |  |  |  |
| Acesso ao modelo | Modelos de baixo custo | Todos os modelos | Todos os modelos |
| Multiplicador de comissão de inferência | 1,25x | 1,05x | 1,00x |
| Requisições ao modelo integrado | 20/min e 500/dia | 200/min | — |
| Tokens de entrada do modelo integrado | 1.000.000/min | 20.000.000/min | — |
| Requisições BYOK | 30/min | 200/min | — |
| Contexto máximo | 65.536 tokens de entrada | — | — |
| Cobertura de assinatura LLM | Atualmente desativado | Atualmente desativado | Atualmente desativado |
| Requisições de texto‑para‑fala independentes | 3/min e 40/hora | 30/min | 300/min |
| Requisições de transcrição de áudio independentes | 3/min e 40/hora | 30/min | 300/min |
| Requisições de decisão semântica | 10/min | 50/min | — |
| **RAG e coleções** |  |  |  |
| Coleções | 5 | — | — |
| Buscas semânticas | 20/min | 500/min | 3.000/min |
| Documentos de classificação de texto | 30/min e 300/dia | 1.000/min | 10.000/min |
| Documentos de segmentação de texto | 10/min e 100/dia | 300/min | 2.500/min |
| Reordenação de buscas | 30/min | 1.000/min | — |
| Tempo de processamento Reflex | 30 minutos/dia | 6 horas/dia | — |
| Inserções de documentos | 500/dia | 10.000/dia | — |
| Documentos JSONL por requisição de importação | 1.000 | 10.000 | 1.000.000 |
| Media Injector | 2 arquivos/dia | 30 arquivos/dia | 1.000 arquivos/dia |
| **Ferramentas integradas** |  |  |  |
| Busca na web | 15/dia | 1.000/dia | 10.000/dia |
| Busca X/Twitter | Não disponível | 1.000/dia | 10.000/dia |
| Busca avançada na web | Não disponível | 100/dia | 1.000/dia |
| Geração de documentos e páginas web | 5/dia | 1.000/dia | 50.000/dia |
| Geração e edição de imagens | 5/dia | 500/dia | 5.000/dia |
| Ações gerais de serviço | 30/dia | 5.000/dia | 100.000/dia |
| Comandos Bash | 300/hora | 30.000/hora | — |
| **Testes agenteicos** |  |  |  |
| Novas execuções por conta | 5/min | 30/min | — |
| Execuções simultâneas por conta | 1 | 4 | 8 |
| **Processamento em lote** |  |  |  |
| Itens de fluxo de trabalho processados | 500/dia | 100.000/dia | — |
| Arquivos por requisição de importação | 1.000 | 1.000 | 1.000 |
| Tamanho total de importação | 100 MiB/requisição | 100 MiB/requisição | 100 MiB/requisição |
| Tamanho máximo de arquivo importado | 10 MiB | 10 MiB | 10 MiB |
| **Conta e suporte** |  |  |  |
| Cota de armazenamento | 30 MB | 2 GB | 20 GB |
| Custo por GB excedente | — | $0,50/GB/mês | $0,20/GB/mês |
| Retenção de conversas | 2 horas | 2 dias | 30 dias |
| Nível de suporte | Email | Prioritário | Dedicado |

### Limites de taxa de decisão semântica e teste agente

Esses limites por minuto são compartilhados entre chaves de API pertencentes à mesma conta. Eles são independentes das permissões de assinatura e faturamento: o uso incluído ainda consome a cota de requisição ou execução aplicável.

- **Decisões semânticas:** cada requisição consome uma unidade, independentemente de quantas perguntas contém ou qual modelo de decisão seleciona. Uma requisição que excede o limite da conta retorna `429 Too Many Requests` antes da avaliação. Veja [Decisões semânticas](generations/decisions.md).
- **Testes agenteicos:** execuções manuais, agendadas e avaliações diretas compartilham uma cota de novas execuções. Uma execução persistente consome sua unidade quando é enfileirada, não novamente quando a execução começa; turnos individuais de conversação não consomem unidades adicionais. Requisições manuais excedentes e avaliações diretas retornam `429 Too Many Requests`. Um teste agendado sem cota disponível aguarda a próxima verificação de agendamento ao invés de criar uma execução extra. Execuções existentes permanecem sujeitas aos seus limites de simultaneidade e inferência separados. Veja [Testes agenteicos](inference/agentic-tests.md).

Rateie as requisições pela conta e use tentativas limitadas com backoff após um 429. Uma nova tentativa imediata ainda encontra a janela de limite de taxa ativa. Max não tem limite imposto pelo plano para essas duas cotas, mas outros limites aplicáveis permanecem em vigor.

### Limites do modelo de decisão semântica

Esses limites específicos de modelo se aplicam além das cotas de requisição ao nível da conta acima. Um limite de contexto não especificado não implica entrada ilimitada.

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
| `@microsoft/microsoft-decision-1` | 32.768 tokens |
| `@nace-ai/drex-v1.5` | 131.072 tokens |
| `@cloudflare/clef-omni` | 65.536 tokens |

Entrada de imagem por requisição: `@cloudflare/clef`, `@cloudflare/clef-flash` e `@cloudflare/clef-omni` aceitam até 4 imagens; `@openai/gpt-6-luna-decisions` aceita até 128. Outros modelos de decisão são apenas texto.

Julia-1 tem limites de serviço adicionais:

| Limite | Valor |
| --- | --- |
| Perguntas por requisição | 1–32 |
| Opções ou níveis de pontuação por pergunta | 2–20 |
| Opções booleanas | Exatamente duas: false e true |
| Contexto combinado por pergunta | 1.024 tokens, incluindo estado, pergunta, opções e tokens especiais |
| Orçamento de pergunta e opções | 256 tokens dentro do contexto combinado |
| Descrição de uma opção individual | No máximo 48 tokens |
| Limite de payload de decisão | 256 KiB |

Esses limites interagem: vinte opções podem exceder o orçamento combinado de pergunta/opções mesmo que cada descrição caiba em seu limite individual. Os atuais limites de serviço Julia-1 da AIVAX se aplicam mesmo que um cartão de modelo upstream liste um contexto maior. Consulte [Decisões semânticas](generations/decisions.md) para orientações de uso e erros.

### Limites de requisição e payload

Esses limites se aplicam a todos os planos e são independentes dos limites de plano acima.

| Serviço | Limite |
| --- | --- |
| [Reflex](rag/reflex.md) reranking | 10.000 documentos candidatos por requisição; no máximo 200 resultados classificados retornados |
| [Transcrição de áudio](generations/audio-transcriptions.md) | 75 MB de áudio decodificado por requisição |
| [Descrições de mídia](generations/media-descriptions.md) | Arquivos remotos são baixados pelo AIVAX até 5 MB cada sob o preset `auto` |
| [Busca e OCR](web-foundation/fetch-and-ocr.md) | 10 MB por item |
| [Busca na web](web-foundation/web-search.md) | 1–25 resultados por requisição de API direta (`topn`) |
| [Fontes de instrução remotas](inference/pipelines.md) | Tamanho máximo de resposta de 10 MB |
| [Testes agenteicos](inference/agentic-tests.md) | Até 16 `resources` e 16 `hooks` por teste |

### Vouchers diários incluídos na assinatura

Free, Pro e Max incluem vouchers diários separados para os serviços abaixo. Cada comparação refere‑se ao mesmo serviço no plano nomeado, não a um crédito compartilhado ou a um número garantido de requisições. Vouchers não utilizados de um serviço não podem cobrir outro. Contas personalizadas não recebem vouchers de assinatura.

| Serviço incluído | Free | Pro | Max |
| --- | --- | --- | --- |
| Embeddings de busca e inserção RAG | Voucher base | 25× Free | 4× Pro |
| Reordenação com Reflex | Voucher base | 5× Free | 10× Pro |
| Decisões semânticas com Julia-1 | Voucher base | 2,5× Free | 2× Pro |
| Extração de busca e OCR | Voucher base | 10× Free | 5× Pro |

Buscas RAG e inserções de documentos compartilham o voucher de embedding. Ele não cobre geração de respostas, processamento de mídia, classificação de texto ou segmentação. Um embedding de consulta servido a partir do cache não o consome. Reflex usa um voucher de reranking separado que inclui entrada em cache e não em cache. Julia-1 é atualmente o único modelo de decisão coberto pelo voucher de decisão semântica; outros modelos de decisão são cobrados normalmente. A conversão opcional de JSON Fetch é separada da cota de extração.

A cobertura é avaliada para cada item de serviço medido: o embedding de um documento, o embedding de um termo de consulta individual, uma chamada de reranking, o uso de entrada de uma chamada de decisão ou uma operação de extração. Cada item é totalmente incluído ou cobrado integralmente nas tarifas normais. Itens incluídos são rastreados no consumo da assinatura, não como entradas de custo zero no histórico de faturamento. As atuais vouchers permitem uma margem de 10 % acima de sua capacidade base. Um item que excederia essa margem deixa o voucher inalterado e é cobrado normalmente. Uma requisição pode conter vários itens, portanto alguns podem ser incluídos enquanto outros são cobrados.

Os vouchers diários são redefinidos à meia‑noite no horário local do servidor. Verifique os indicadores de consumo de assinatura da conta para consumo e status de redefinição; o uso pode exceder 100 % dentro da margem. A cobertura da assinatura LLM está atualmente desativada, portanto a inferência de texto‑modelo e a geração de respostas RAG permanecem medidas separadamente. Os vouchers não ignoram requisitos de saldo, limites de taxa ou o teto separado de tempo de processamento do Reflex. Consulte [Preços](pricing.md) para cobranças quando um item não está coberto.

Contas personalizadas suportam 8 execuções de teste agenteicas simultâneas por conta. Seus limites de taxa são os limites do plano Pro multiplicados por um fator acordado para a conta, ou não têm limites de taxa de plano quando nenhum fator está definido.

Requisições ao modelo integrado são limitadas tanto por contagem de requisições quanto por tokens de entrada. Grupos de limite de taxa de modelo ajustam os limites de contagem de requisições:

| Grupo de limite de taxa | Multiplicador de limite |
| --- | --- |
| Comum | 1.0x |
| Descontado | 0.5x |
| Baixo | 0.3x |
| Free | 0.1x |

Por exemplo, uma conta Pro normalmente tem 200 requisições ao modelo integrado por minuto. Com um grupo de modelo `Discounted`, o limite ajustado é 100 requisições por minuto.

BYOK usa uma chave de provedor configurada no gateway em vez de um modelo AIVAX integrado, mas as requisições ainda passam pela infraestrutura AIVAX e usam o limite BYOK do plano.

As cotas de classificação de texto e segmentação de texto contam cada item no array `documents` da requisição, não cada requisição HTTP. Uma requisição que excederia qualquer janela ativa retorna `429 Too Many Requests`. A classificação de texto usa o modelo de embedding padrão e é cobrada pelo trabalho de embedding realizado.

Texto‑para‑fala independente e transcrição de áudio cada um usa sua própria cota de requisição do plano. Sessões de voz usam o modelo em tempo real selecionado e estão sujeitas aos limites de acesso ao modelo, saldo e inferência aplicáveis, em vez dessas cotas de requisição independentes. A transcrição de entrada não é suportada atualmente dentro das Sessões de voz.

O endpoint de importação JSONL rejeita uma requisição quando atinge o limite de documentos por requisição do plano. O limite de reranking se aplica ao endpoint autônomo de reranking e às buscas RAG que usam um reranker, incluindo buscas realizadas através de Gateways de IA e ferramentas MCP.

O limite Reflex conta o tempo gasto processando requisições Reflex. Ele se aplica ao endpoint autônomo de reranking e às buscas RAG que usam Reflex; entrada em cache não consome a cota separadamente. Requisições que excedem o limite do plano retornam `429 Too Many Requests`. Consulte [Reflex](rag/reflex.md) para limites de requisição, comportamento de cache e preços.

Ações gerais de serviço compartilham a cota de ação de serviço mostrada acima. O processamento em lote é assíncrono; se o processamento for pausado ou falhar por causa de cota, tente novamente após a janela de cota ser redefinida ou faça upgrade da conta. Para saber como a admissão em lote lida com pausas de cota e resultados parciais, veja [executando milhares de requisições LLM em lote](https://aivax.net/blog/batch-is-an-admission-control-problem-not-a-queue/).

## Chaves de API públicas

Chaves públicas têm limites adicionais independentes do plano da conta.

| Escopo | Limites de requisição |
| --- | --- |
| Por endereço remoto | 3/5s, 20/min, 300/hora, 1.000/dia |
| Global por chave | 10/5s, 60/min, 1.500/hora, 10.000/dia |

| Escopo | Limites de token |
| --- | --- |
| Por endereço remoto | 100.000/5min, 500.000/30min, 2.000.000/6h, 5.000.000/dia |
| Global por chave | 500.000/5min, 2.000.000/30min, 10.000.000/6h, 25.000.000/dia |

Chaves públicas podem ser usadas para busca semântica RAG, geração de respostas RAG, geração de fala, descrições de mídia, geração de imagens e complementos de chat. Para complementos de chat, chaves públicas também exigem um UUID completo de AI Gateway, restringem parâmetros de requisição e omitem superfícies de ferramenta do lado do servidor. Consulte [Autenticação](authentication.md).
