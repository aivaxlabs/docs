---
{title: Planos e Limites,linkTitle: Planos e limites,weight: 10,group: Pricing,aliases: [/docs/pt-br/limits.html,/docs/pt-br/pricing/plans-and-limits.html],sourceHash: ec856163ac45f864}
---

# Planos e Limites

AIVAX possui um plano **Gratuito** e três planos Empresariais: **Pro**, **Max** e **Ultimate**. Os [planos de codificação](coding-plans.md) são uma linha separada focada no uso do modelo de assinatura. O plano atual controla o acesso ao modelo, os limites de taxa da conta e do produto, a cota de armazenamento, os períodos de retenção e as cotas diárias de serviço incluídas. Todos os limites dos planos estão listados nesta página; as páginas dos produtos linkam para cá em vez de repetir os valores.

Para preços de assinatura, consulte a [página de preços da AIVAX](https://aivax.net/pricing); os preços dos planos de codificação estão listados em [Planos de codificação](coding-plans.md).

Um travessão (`—`) significa que o plano não impõe um limite, e `Não disponível` significa que o recurso não está disponível no plano. Podem ainda aplicar-se limites específicos de modelo, gateway, provedor ou produto. Limites que são iguais em todos os planos, como tamanhos de arquivo ou resultados por solicitação, são documentados em cada página de produto.

## Limites da conta

| Limite | Gratuito | Pro | Max | Ultimate |
| --- | --- | --- | --- | --- |
| **Inferência** |  |  |  |  |
| Acesso ao modelo | Modelos de baixo preço | Todos os modelos | Todos os modelos | Todos os modelos |
| Multiplicador de comissão de inferência | 1,25x | 1,05x | 1,02x | 1,00x |
| Teto diário de comissão de inferência | US$ 1,50 | US$ 1,20 | US$ 1,00 | Sem comissão |
| Solicitações de modelo integrado | 20/min e 500/dia | 150/min | 1.000/min | — |
| Tokens de entrada do modelo integrado | 1.000.000/min | 15.000.000/min | 60.000.000/min | — |
| Solicitações BYOK | 30/min | 150/min | 1.000/min | — |
| Contexto máximo | 64.000 tokens de entrada | — | — | — |
| Cota mensal de modelo de assinatura | Não disponível | Incluído | Incluído | Incluído |
| **Conta e suporte** |  |  |  |  |
| Cota de armazenamento | 30 MB | 2 GB | 10 GB | 20 GB |
| Custo por GB excedente | Não disponível | US$ 0,50/GB/mês | US$ 0,30/GB/mês | US$ 0,20/GB/mês |
| Retenção de conversas | 2 horas | 2 dias | 14 dias | 30 dias |
| Retenção do histórico de pesquisa RAG | 2 horas | 3 dias | 14 dias | 30 dias |
| Taxa de serviço nos recargas de crédito | 5% (mínimo US$ 0,20) | Nenhuma | Nenhuma | Nenhuma |
| Nível de suporte | E-mail | Prioritário | Prioritário | Dedicado |

Os valores do Gratuito nesta tabela aplicam-se a contas não verificadas; [contas verificadas](#contas-verificadas) obtêm limites de inferência mais altos.

O histórico de pesquisa RAG é a lista de pesquisas exibidas em [Observabilidade RAG](../rag/observability.md#search-history).

As solicitações de modelo integrado são limitadas tanto pela contagem de solicitações quanto pelos tokens de entrada. Os grupos de limite de taxa do modelo ajustam os limiares de contagem de solicitações:

| Grupo de limite de taxa | Multiplicador de limiar |
| --- | --- |
| Comum | 1,0x |
| Desconto | 0,5x |
| Baixo | 0,3x |
| Gratuito | 0,1x |

Por exemplo, uma conta Pro tem normalmente 150 solicitações de modelo integrado por minuto. Com um grupo de modelo `Desconto`, o limiar ajustado é de 75 solicitações por minuto.

As solicitações BYOK usam uma chave de provedor configurada no gateway e contam para o limite BYOK do plano.

Os limites de taxa são compartilhados entre todas as chaves de API da mesma conta. Uma solicitação que excederia uma janela ativa retorna `429 Too Many Requests`; ajuste as solicitações e use retentativas limitadas com backoff.

Contas personalizadas têm limites acordados com a equipe da AIVAX.

## Contas verificadas

Uma conta torna-se verificada quando possui ou teve um plano pago, ou quando tem pelo menos 30 dias de idade e adicionou pelo menos US$ 10 em créditos pagos. A verificação é aplicada automaticamente e mantida posteriormente. `GET /api/v1/accounts` relata isso em `isVerified`.

Contas verificadas no Gratuito obtêm limites de inferência mais altos. [Planos de codificação](coding-plans.md) baseiam-se nesses limites:

| Limite | Gratuito | Gratuito Verificado |
| --- | --- | --- |
| Solicitações de modelo integrado | 20/min e 500/dia | 30/min e 3.000/dia |
| Tokens de entrada do modelo integrado | 1.000.000/min | 3.000.000/min |
| Solicitações BYOK | 30/min | 50/min |
| Contexto máximo | 64.000 tokens de entrada | — |

Todos os outros limites do Gratuito permanecem os mesmos.

## Limites do produto

Os limites do produto usam as mesmas regras dos limites da conta: são compartilhados entre as chaves de API da conta, e uma solicitação acima de uma janela ativa retorna `429 Too Many Requests`. Onde um limite conta itens em vez de solicitações HTTP, a nota abaixo da tabela indica isso.

### RAG e coleções

| Limite | Gratuito | Pro | Max | Ultimate |
| --- | --- | --- | --- | --- |
| Coleções | 5 | 100 | 1.000 | — |
| Documentos por conta | 2.000 | 200.000 | — | — |
| Documentos por coleção | 1.000 | 50.000 | 250.000 | 500.000 |
| Pesquisas | 20/min | 300/min | 1.500/min | 3.000/min |
| Solicitações de reranking | 30/min | 500/min | 3.000/min | — |
| Tempo de processamento Reflex | 30 minutos/dia | 3 horas/dia | 12 horas/dia | — |
| Inserções de documentos | 500/dia | 5.000/dia | 50.000/dia | — |
| Documentos por importação multipart JSONL | 1.000 | 5.000 | 100.000 | 1.000.000 |
| Documentos por importação WebSocket JSONL | 10.000 | 50.000 | 1.000.000 | 10.000.000 |
| Arquivos do Media Injector | 2/dia | 20/dia | 250/dia | 1.000/dia |

O limite de solicitações de reranking aplica-se ao [endpoint de reranking](../rag/reflex.md) e às pesquisas RAG que usam um reranker. Se uma importação exceder o limite por importação, divida-a em várias importações. Os limites de documentos contam documentos armazenados; atualizar um documento existente não é afetado. Uma vez atingido um limite, criar um documento retorna `400 Bad Request`. Consulte [Coleções](../rag/collections.md), [Documentos](../rag/documents.md) e [Reflex](../rag/reflex.md).

### Processamento de dados

| Limite | Gratuito | Pro | Max | Ultimate |
| --- | --- | --- | --- | --- |
| Documentos de classificação de texto | 30/min e 300/dia | 500/min | 2.500/min | 10.000/min |
| Documentos de extração, resumo e refinamento de instrução | 10/min e 300/dia | 100/min | 1.000/min | 2.500/min |
| Documentos de segmentação de texto | 10/min e 100/dia | 300/min | 1.000/min | 2.500/min |
| Solicitações de tradução | 30/min e 300/dia | 100/min | 1.000/min | 2.500/min |
| Solicitações de descrição de mídia | 10/min e 40/hora | 40/min | 100/min | 200/min |
| Solicitações de decisão semântica | 10/min | 30/min | 200/min | — |

Os limites de classificação, extração, resumo e segmentação contam cada item na matriz `documents` da solicitação; extração, resumo e refinamento de instrução compartilham uma cota. Os limites de tradução, descrição de mídia e decisão semântica contam solicitações HTTP. Consulte [Classificação](../data-processing/classification.md), [Extração](../data-processing/extraction.md), [Resumo](../data-processing/summarization.md), [Refinamento de Instrução](../data-processing/instruction-refinement.md), [Segmentação de texto](../data-processing/text-segmentation.md), [Traduções](../data-processing/translations.md), [Descrições de mídia](../data-processing/media-descriptions.md) e [Decisões Semânticas](../data-processing/decisions.md).

### Fala

| Limite | Gratuito | Pro | Max | Ultimate |
| --- | --- | --- | --- | --- |
| Solicitações standalone de texto-para-fala | 3/min e 40/hora | 20/min | 100/min | 300/min |
| Solicitações standalone de transcrição de áudio | 3/min e 40/hora | 20/min | 100/min | 300/min |

Texto-para-fala e transcrição têm cotas separadas com os mesmos valores. [Sessões de Voz](../inference/voice-session.md) não estão sujeitas a essas cotas standalone. Consulte [Texto-para-fala](../generations/speech.md) e [Fala-para-texto](../generations/audio-transcriptions.md).

### Ferramentas integradas e pesquisa na web

| Limite | Gratuito | Pro | Max | Ultimate |
| --- | --- | --- | --- | --- |
| Pesquisa na web | 15/dia | 500/dia | 4.000/dia | 10.000/dia |
| Pesquisa X/Twitter | Não disponível | 200/dia | 3.000/dia | 10.000/dia |
| Geração de documentos e páginas da web | 5/dia | 500/dia | 15.000/dia | 50.000/dia |
| Geração e edição de imagens | 5/dia | 150/dia | 1.500/dia | 5.000/dia |
| Ações gerais de serviço | 30/dia | 2.500/dia | 30.000/dia | 100.000/dia |
| Comandos Bash | 300/hora | 30.000/hora | 100.000/hora | — |

O limite de geração de imagens é compartilhado pela ferramenta integrada, pela [API de geração de imagens](../generations/images.md) e pelo [Media generation MCP](../mcp-utilities/media-generation-mcp.md). Consulte [Ferramentas integradas](../tools/builtin-tools.md), [Pesquisa na Web](../web-foundation/web-search.md) e [Shell](../tools/shell.md).

### Batch e Testes Agentic

| Limite | Gratuito | Pro | Max | Ultimate |
| --- | --- | --- | --- | --- |
| Itens de fluxo de trabalho Batch processados | 500/dia | 25.000/dia | 250.000/dia | — |
| Novas execuções de Teste Agentic | 5/min | 20/min | 100/min | — |
| Execuções concorrentes de Teste Agentic | 1 | 4 | 6 | 8 |
| Gerações assíncronas enfileiradas | 1.000/hora | 50.000/hora | 250.000/hora | 750.000/hora |

O processamento Batch pausado pela cota diária retoma após a reinicialização da janela. Gerações assíncronas acima do limite horário são rejeitadas quando enfileiradas. Consulte [Batch](../inference/batch/workflows.md#limits), [Gerações assíncronas](../inference/batch/async-generations.md) e [Testes Agentic](../inference/agentic-tests.md#pricing-and-limits).

## Cotas diárias de assinatura incluídas

Cada plano inclui cotas diárias separadas para os serviços abaixo. Cada comparação refere-se ao mesmo serviço no plano Gratuito. A cota não utilizada de um serviço não pode cobrir outro.

| Serviço incluído | Gratuito | Pro | Max | Ultimate |
| --- | --- | --- | --- | --- |
| Embeddings de pesquisa e inserção RAG | 10.000 tokens | 25× Gratuito | 500× Gratuito | 2.500× Gratuito |
| Reranking com Reflex | 2.000 tokens de entrada | 4× Gratuito | 20× Gratuito | 50× Gratuito |
| Decisões semânticas com modelos elegíveis | 20.000 tokens de entrada | 2× Gratuito | 3× Gratuito | 5× Gratuito |
| Busca e extração OCR | 1.000 PUs | 8× Gratuito | 25× Gratuito | 50× Gratuito |

As pesquisas RAG e as inserções de documentos compartilham a cota de embedding. Ela não cobre geração de respostas, processamento de mídia, extração, resumo, classificação ou segmentação. A cota de decisão semântica cobre apenas modelos de decisão elegíveis; consulte [Decisões Semânticas](../data-processing/decisions.md#usage-and-cost).

O uso além de uma cota é cobrado nas taxas normais; consulte [Preços](product-pricing.md). As cotas são reiniciadas diariamente, e o painel mostra o consumo atual. Elas não cobrem a inferência de modelos de texto; os modelos de assinatura usam uma [cota mensal separada](#monthly-subscription-model-quota). Para um tutorial, consulte [Free RAG API on AIVAX Free](https://aivax.net/blog/free-tier-for-rag-reflex-decisions-and-ocr/).

## Cota mensal de modelo de assinatura

Pro, Max e Ultimate incluem uma cota mensal para modelos de assinatura. A cota é renovada um mês após seu primeiro uso em cada ciclo, e todos os modelos de assinatura a compartilham. Max inclui 5× a cota Pro, e Ultimate inclui 10× a cota Pro. [Planos de codificação](coding-plans.md) incluem cotas maiores. Para os modelos disponíveis e o uso que cada plano inclui, consulte [Modelos de assinatura](../inference/subscription-models/overview.md).

Os modelos de assinatura são os modelos do catálogo cujos nomes começam com `@aivax-subscription/`. Usá-los nunca debita o saldo da conta; todos os outros modelos são cobrados no saldo como de costume. Para identificá-los, verifique `flags.isSubscription` em `GET /api/v1/information/models.json` ou `_details.provider_model.subscription` em `GET /v1/models`.

Quando a cota se esgota, ou o plano não possui nenhuma, uma solicitação a um modelo de assinatura retorna `429 Too Many Requests`. Até que a cota seja renovada, selecione outro modelo ou faça upgrade do plano.

A resposta do saldo da conta relata a cota como uma porcentagem usada, em um consumo de assinatura do tipo `InferenceMonthly`. Consulte [Obter Saldo da Conta](https://inference.aivax.net/apidocs/llms.txt?endpoint=GET%20%2Fapi%2Fv1%2Finformation%2Fbalance).

## Estimando PUs e tokens

O uso é medido em unidades de processamento (PUs) ou tokens, dependendo do serviço. Os exemplos abaixo ajudam você a estimar o tamanho de uma carga de trabalho. Eles são aproximações (`≈`), não valores garantidos: a quantidade exata é relatada nos campos de uso de cada resposta.

**Unidades de processamento Fetch e OCR**

| Conteúdo | PUs Aproximados |
| --- | --- |
| Arquivo de texto puro ou Markdown | 0 |
| PDF ou DOCX de texto nativo, 10 páginas | ≈ 1 (mínimo de 1 PU por item) |
| Página da web que renderiza em 1 a 3 segundos | ≈ 10–30 (10 PUs por segundo de renderização) |
| Foto ou captura de tela com texto | ≈ 40–50 |
| PDF digitalizado, 10 páginas | ≈ 400–500 |

Páginas com uma camada de texto custam quase nada; páginas digitalizadas e imagens passam por OCR e aumentam o total.

**Tokens**

| Conteúdo | Tokens Aproximados |
| --- | --- |
| Consulta de pesquisa RAG, como "como redefino minha senha se perdi o acesso ao meu e-mail?" | ≈ 10–30 |
| Uma página de texto em inglês, cerca de 500 palavras | ≈ 650–750 |
| Chunk de documento RAG de 1.500 caracteres | ≈ 350–400 |
| Reranking Reflex de 50 candidatos com cerca de 300 tokens cada | ≈ 15.000–16.000, já que a consulta é pontuada com cada candidato |
| Um livro de 300 páginas, cerca de 300 palavras por página | ≈ 110.000–130.000 |

As estimativas de tokens assumem texto em inglês, onde um token é cerca de quatro caracteres. Outros idiomas, código e JSON geralmente precisam de mais tokens para o mesmo conteúdo. Em conclusões de chat, o histórico de conversas e as instruções do sistema são enviados novamente a cada turno.

## Chaves de API públicas

Chaves públicas têm limites adicionais independentes do plano da conta.

| Escopo | Limites de solicitação |
| --- | --- |
| Por endereço remoto | 3/5s, 20/min, 300/hora, 1.000/dia |
| Global por chave | 10/5s, 60/min, 1.500/hora, 10.000/dia |

| Escopo | Limites de token |
| --- | --- |
| Por endereço remoto | 100.000/5min, 500.000/30min, 2.000.000/6h, 5.000.000/dia |
| Global por chave | 500.000/5min, 2.000.000/30min, 10.000.000/6h, 25.000.000/dia |

Chaves públicas podem ser usadas para conclusões de chat, os endpoints `/api/v1/generations/*`, pesquisa semântica RAG e geração de respostas RAG. Para conclusões de chat, as chaves públicas também exigem um UUID completo do AI Gateway, restringem parâmetros de solicitação e omitem superfícies de ferramentas do lado do servidor. Consulte [Autenticação](../authentication.md).
