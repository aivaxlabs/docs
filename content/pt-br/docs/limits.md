---
{title: Planos e Limites,linkTitle: Planos e limites,weight: 40,group: Introduction,sourceHash: 6e9dcebe70869dca,aliases: [/docs/pt-br/limits.html]}
---

# Planos e Limites

A AIVAX possui quatro planos de conta: **Gratuito**, **Pro**, **Max** e **Ultimate**. O plano atual controla o acesso ao modelo, os limites de taxa da conta e do produto, a cota de armazenamento, os períodos de retenção e as cotas diárias de serviço incluídas. Todos os limites de cada plano estão listados nesta página; as páginas dos produtos linkam para cá em vez de repetir os valores.

Para preços de assinatura comercial e pacotes de planos, utilize a [página de preços da AIVAX](https://aivax.net/pricing). Os mesmos preços públicos da lista estão disponíveis em [Preços da lista de planos](pricing.md#plan-list-prices).

Um travessão (`—`) significa que o plano não impõe um limite, e `Não disponível` significa que o recurso não está disponível no plano. Limites específicos de modelo, gateway, provedor ou produto ainda podem se aplicar. Limites que são iguais em todos os planos, como tamanhos de arquivo ou resultados por solicitação, são documentados em cada página de produto.

## Limites da conta

| Limite | Gratuito | Pro | Max | Ultimate |
| --- | --- | --- | --- | --- |
| **Inferência** |  |  |  |  |
| Acesso ao modelo | Modelos de baixo preço | Todos os modelos | Todos os modelos | Todos os modelos |
| Multiplicador de comissão de inferência | 1,25x | 1,05x | 1,02x | 1,00x |
| Solicitações de modelo integrado | 20/min e 500/dia | 150/min | 1.000/min | — |
| Tokens de entrada de modelo integrado | 1.000.000/min | 15.000.000/min | 60.000.000/min | — |
| Solicitações BYOK | 30/min | 150/min | 1.000/min | — |
| Contexto máximo | 64.000 tokens de entrada | — | — | — |
| Cobertura de assinatura LLM | Atualmente desativado | Atualmente desativado | Atualmente desativado | Atualmente desativado |
| **Conta e suporte** |  |  |  |  |
| Cota de armazenamento | 30 MB | 2 GB | 10 GB | 20 GB |
| Custo por GB excedente | Não disponível | $0,50/GB/mês | $0,30/GB/mês | $0,20/GB/mês |
| Retenção de conversas | 2 horas | 2 dias | 14 dias | 30 dias |
| Retenção do histórico de pesquisa RAG | 2 horas | 3 dias | 14 dias | 30 dias |
| Nível de suporte | E-mail | Prioritário | Prioritário | Dedicado |

O texto do documento armazenado em uma coleção conta para a cota de armazenamento como bytes UTF-8. Texto com acentos ou caracteres não latinos pode usar mais dessa cota do que texto latino básico do mesmo comprimento. O histórico de pesquisa RAG é a lista de pesquisas exibidas em [Observabilidade RAG](rag/observability.md#search-history).

As solicitações de modelo integrado são limitadas tanto pela contagem de solicitações quanto pelos tokens de entrada. Os grupos de limite de taxa do modelo ajustam os limites de contagem de solicitações:

| Grupo de limite de taxa | Multiplicador de limite |
| --- | --- |
| Comum | 1,0x |
| Descontado | 0,5x |
| Baixo | 0,3x |
| Gratuito | 0,1x |

Por exemplo, uma conta Pro normalmente tem 150 solicitações de modelo integrado por minuto. Com um grupo de modelo `Descontado`, o limite ajustado é de 75 solicitações por minuto.

BYOK usa uma chave de provedor configurada no gateway em vez de um modelo integrado da AIVAX, mas as solicitações ainda passam pela infraestrutura da AIVAX e usam o limite BYOK do plano.

Os limites de taxa são compartilhados entre todas as chaves de API da mesma conta. Uma solicitação que excederia uma janela ativa retorna `429 Too Many Requests`; ajuste as solicitações e use retentativas limitadas com backoff.

Contas personalizadas usam os limites de taxa do plano Pro multiplicados por um fator acordado para a conta, ou não têm limites de taxa de plano quando nenhum fator é definido. Contas personalizadas suportam 8 execuções simultâneas de Testes Agentic.

## Limites do produto

Os limites do produto usam as mesmas regras dos limites da conta: eles são compartilhados entre as chaves de API da conta, e uma solicitação acima de uma janela ativa retorna `429 Too Many Requests`. Onde um limite conta itens em vez de solicitações HTTP, a nota abaixo da tabela indica isso.

### RAG e coleções

| Limite | Gratuito | Pro | Max | Ultimate |
| --- | --- | --- | --- | --- |
| Coleções | 5 | 100 | 1.000 | — |
| Pesquisas | 20/min | 300/min | 1.500/min | 3.000/min |
| Solicitações de reranking | 30/min | 500/min | 3.000/min | — |
| Tempo de processamento Reflex | 30 minutos/dia | 3 horas/dia | 12 horas/dia | — |
| Inserções de documentos | 500/dia | 5.000/dia | 50.000/dia | — |
| Documentos por importação multipart JSONL | 1.000 | 5.000 | 100.000 | 1.000.000 |
| Documentos por importação WebSocket JSONL | 10.000 | 50.000 | 1.000.000 | 10.000.000 |
| Arquivos do Media Injector | 2/dia | 20/dia | 250/dia | 1.000/dia |

O limite de solicitações de reranking aplica-se ao [endpoint de reranking](rag/reflex.md) e às pesquisas RAG que usam um reranker, incluindo pesquisas através de AI Gateways e ferramentas MCP. O limite de tempo de processamento Reflex conta o tempo gasto processando solicitações Reflex em ambos os caminhos; a entrada em cache não consome isso separadamente. Se uma importação exceder o limite por importação, divida-a em várias importações. Consulte [Coleções](rag/collections.md), [Documentos](rag/documents.md) e [Reflex](rag/reflex.md).

### Processamento de dados

| Limite | Gratuito | Pro | Max | Ultimate |
| --- | --- | --- | --- | --- |
| Documentos de classificação de texto | 30/min e 300/dia | 500/min | 2.500/min | 10.000/min |
| Documentos de extração e resumo | 10/min e 300/dia | 100/min | 1.000/min | 2.500/min |
| Documentos de segmentação de texto | 10/min e 100/dia | 300/min | 1.000/min | 2.500/min |
| Solicitações de tradução | 30/min e 300/dia | 100/min | 1.000/min | 2.500/min |
| Solicitações de descrição de mídia | 10/min e 40/hora | 40/min | 100/min | 200/min |
| Solicitações de decisão semântica | 10/min | 30/min | 200/min | — |

Os limites de classificação, extração, resumo e segmentação contam cada item na matriz `documents` da solicitação, não cada solicitação HTTP; extração e resumo compartilham uma cota. Os limites de tradução, descrição de mídia e decisão semântica contam solicitações HTTP. Uma solicitação de decisão semântica consome uma unidade independentemente de quantas perguntas ela contém ou qual modelo de decisão ela seleciona, e o uso de decisão incluído ainda consome unidades de solicitação. Consulte [Classificação](data-processing/classification.md), [Extração](data-processing/extraction.md), [Resumo](data-processing/summarization.md), [Segmentação de texto](data-processing/text-segmentation.md), [Traduções](data-processing/translations.md), [Descrições de mídia](data-processing/media-descriptions.md) e [Decisões Semânticas](data-processing/decisions.md).

### Fala

| Limite | Gratuito | Pro | Max | Ultimate |
| --- | --- | --- | --- | --- |
| Solicitações standalone de texto para fala | 3/min e 40/hora | 20/min | 100/min | 300/min |
| Solicitações standalone de transcrição de áudio | 3/min e 40/hora | 20/min | 100/min | 300/min |

Texto para fala e transcrição têm cotas separadas com os mesmos valores. [Sessões de Voz](inference/voice-session.md) não estão sujeitas a essas cotas standalone. Consulte [Texto para fala](generations/speech.md) e [Fala para texto](generations/audio-transcriptions.md).

### Ferramentas integradas e pesquisa na web

| Limite | Gratuito | Pro | Max | Ultimate |
| --- | --- | --- | --- | --- |
| Pesquisa na web | 15/dia | 500/dia | 4.000/dia | 10.000/dia |
| Pesquisa X/Twitter | Não disponível | 200/dia | 3.000/dia | 10.000/dia |
| Geração de documentos e páginas da web | 5/dia | 500/dia | 15.000/dia | 50.000/dia |
| Geração e edição de imagens | 5/dia | 150/dia | 1.500/dia | 5.000/dia |
| Ações gerais de serviço | 30/dia | 2.500/dia | 30.000/dia | 100.000/dia |
| Comandos Bash | 300/hora | 30.000/hora | 100.000/hora | — |

As ações gerais de serviço compartilham uma cota diária. O limite de geração de imagens aplica-se à ferramenta integrada, não à [API de geração de imagens](generations/images.md). Consulte [Ferramentas integradas](tools/builtin-tools.md), [Pesquisa na Web](web-foundation/web-search.md) e [Shell](tools/shell.md).

### Batch e Testes Agentic

| Limite | Gratuito | Pro | Max | Ultimate |
| --- | --- | --- | --- | --- |
| Itens de fluxo de trabalho Batch processados | 500/dia | 25.000/dia | 250.000/dia | — |
| Novas execuções de Teste Agentic | 5/min | 20/min | 100/min | — |
| Execuções simultâneas de Teste Agentic | 1 | 4 | 6 | 8 |

Se o processamento em lote for pausado devido à cota, ele será retomado após a reinicialização da janela. Execuções manuais, execuções agendadas e avaliações diretas compartilham uma nova cota de execução. Consulte [Batch](inference/batch.md#limits) e [Testes Agentic](inference/agentic-tests.md#pricing-and-limits).

## Cotar diárias de assinatura incluídas

Cada plano inclui cotas diárias separadas para os serviços abaixo. Cada comparação refere-se ao mesmo serviço no plano Gratuito, não a um saldo de crédito compartilhado ou a um número garantido de solicitações. A cota não utilizada de um serviço não pode cobrir outro. Contas personalizadas não recebem cotas de assinatura.

| Serviço incluído | Gratuito | Pro | Max | Ultimate |
| --- | --- | --- | --- | --- |
| Embeddings de pesquisa e inserção RAG | Cota base | 15× Gratuito | 50× Gratuito | 100× Gratuito |
| Reranking com Reflex | Cota base | 4× Gratuito | 20× Gratuito | 50× Gratuito |
| Decisões semânticas com modelos elegíveis | Cota base | 2× Gratuito | 3× Gratuito | 5× Gratuito |
| Busca e extração OCR | Cota base | 8× Gratuito | 25× Gratuito | 50× Gratuito |

Pesquisas RAG e inserções de documentos compartilham a cota de embedding. Ela não cobre geração de respostas, processamento de mídia, extração de documentos ou resumo, classificação de texto ou segmentação. Um embedding de consulta servido do cache não o consome. O Reflex usa uma cota de reranking separada que inclui entradas em cache e não em cache. A cota de decisão semântica cobre apenas modelos de decisão elegíveis; consulte [Decisões Semânticas](data-processing/decisions.md#usage-and-cost). A conversão JSON opcional Fetch é separada da cota de extração.

A cobertura é avaliada para cada item de serviço medido: o embedding de um documento, um embedding individual de termo de consulta, uma chamada de reranking, o uso de entrada de uma chamada de decisão ou uma operação de extração. Cada item é totalmente incluído ou cobrado integralmente nas taxas normais. Itens incluídos são rastreados no consumo da assinatura, não como entradas de custo zero no histórico de faturamento. As cotas atuais permitem uma margem de 10% acima de sua capacidade base. Um item que excederia essa margem deixa a cota inalterada e é cobrado normalmente. Uma solicitação pode conter vários itens, então alguns podem ser incluídos enquanto outros são cobrados.

As cotas diárias são redefinidas à meia-noite no horário local do servidor. Verifique os indicadores de uso da assinatura da conta para consumo e status de reinicialização; o uso pode exceder 100% dentro da margem. A cobertura de assinatura LLM está atualmente desativada, portanto, a inferência de modelo de texto e a geração de respostas RAG permanecem medidas separadamente. As cotas não contornam requisitos de saldo ou limites de taxa. Consulte [Preços](pricing.md) para saber como os itens não cobertos são faturados. Para um guia de teste de um pipeline de recuperação dentro dessas cotas, consulte [API RAG Gratuita: embeddings, reranking e limites OCR](https://aivax.net/blog/free-tier-for-rag-reflex-decisions-and-ocr/).

## Estimando PUs e tokens

O uso é medido em unidades de processamento (PUs) ou tokens, dependendo do serviço. Os exemplos abaixo ajudam você a estimar o tamanho de uma carga de trabalho. Eles são aproximações (`≈`), não valores garantidos: o valor exato é relatado nos campos de uso de cada resposta.

**Unidades de processamento Fetch e OCR**

| Conteúdo | PUs aproximadas |
| --- | --- |
| Arquivo de texto simples ou Markdown | 0 |
| PDF ou DOCX de texto nativo, 10 páginas | ≈ 1 (mínimo de 1 PU por item) |
| Página da web que renderiza em 1 a 3 segundos | ≈ 10–30 (10 PUs por segundo de renderização) |
| Foto ou captura de tela com texto | ≈ 40–50 |
| PDF digitalizado, 10 páginas | ≈ 400–500 |

Páginas nativas são convertidas a partir de sua camada de texto e custam quase nada; páginas digitalizadas, imagens e imagens embutidas em uma página passam por OCR e aumentam o total. Um PDF que mistura ambos é cobrado pelas páginas que realmente precisam de OCR.

**Tokens**

| Conteúdo | Tokens aproximados |
| --- | --- |
| Consulta de pesquisa RAG, como "como redefino minha senha se perdi acesso ao meu e-mail?" | ≈ 10–30 |
| Uma página de texto em inglês, cerca de 500 palavras | ≈ 650–750 |
| Chunk de documento RAG de 1.500 caracteres | ≈ 350–400 |
| Reranking Reflex de 50 candidatos com cerca de 300 tokens cada | ≈ 15.000–16.000, já que a consulta é pontuada com cada candidato |
| Um livro de 300 páginas, cerca de 300 palavras por página | ≈ 110.000–130.000 |

As estimativas de tokens assumem texto em inglês, onde um token é cerca de quatro caracteres ou três quartos de uma palavra. Português, espanhol e outros idiomas com acentos geralmente precisam de 20–50% mais tokens para o mesmo conteúdo; código, JSON e scripts não latinos podem precisar de mais. Um embedding de consulta servido do cache não é cobrado, e em conclusões de chat, o histórico de conversas e as instruções do sistema são enviados novamente a cada turno.

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

Chaves públicas podem ser usadas para conclusões de chat, endpoints `/api/v1/generations/*`, pesquisa semântica RAG e geração de respostas RAG. Para conclusões de chat, chaves públicas também exigem um UUID completo do AI Gateway, restringem parâmetros de solicitação e omitem superfícies de ferramentas do lado do servidor. Consulte [Autenticação](authentication.md).
