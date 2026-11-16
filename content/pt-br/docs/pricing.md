---
{title: Preços,linkTitle: Preços,weight: 30,group: Introduction,aliases: [/docs/pt-br/platform/account-balance.html,/docs/pt-br/pricing.html],sourceHash: 06d7965bf91f0df4}
---

# Preços

A AIVAX cobra o uso do saldo da conta em USD. Cada produto documenta suas próprias tarifas em uma seção de preços dedicada, vinculada abaixo. Esta página abrange as regras compartilhadas por todos os produtos: cotas de assinatura, armazenamento, cabeçalho de custo de solicitação, desconto por compartilhamento de dados, multiplicadores de plano, taxas de recarga de crédito e impostos sobre pagamentos.

Veja [preços de assinatura](https://aivax.net/pricing) para os preços dos planos mensais e [Planos e limites](limits.md) para as cotas de nível de conta. **M** significa um milhão de tokens; **1k** significa mil unidades. Os preços aproximados (`~`) variam conforme o modelo utilizado e o trabalho realizado.

## Preços de lista dos planos

Use a página de preços ao escolher um plano no navegador. Para ler os mesmos preços públicos de lista a partir de um aplicativo, chame `GET /api/v1/information/plans.json`. Nenhuma chave de API é necessária. A resposta lista Free, Pro, Max e Ultimate. Cada entrada possui `plan` e `monthlyPrice` em USD. Free é `0` porque esse plano não tem taxa de assinatura. Um preço Custom negociado ou o preço atualmente aplicado a uma conta não estão incluídos. Use a API Subscriptions quando precisar do preço da conta autenticada.

<script src="https://inference.aivax.net/apidocs?embed-target=Get%20Plans&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Preços dos produtos

| Área | Onde encontrar as tarifas |
| --- | --- |
| Inferência e moderação | [Inferência](/docs/pt-br/inference/chat-completions/concepts.md#pricing) |
| Testes Agentic | [Testes Agentic](inference/agentic-tests.md#pricing-and-limits) |
| Voz e Realtime | [Voz e Realtime](inference/voice-session.md#billing-and-limits) |
| Coleções RAG, busca e respostas | [Coleções](rag/collections.md#pricing-and-limits) |
| Media Injector | [Documentos](rag/documents.md#pricing-and-limits) |
| Reflex | [Reflex](rag/reflex.md#pricing-and-limits) |
| Busca na web e busca X | [Busca Web](web-foundation/web-search.md) |
| Fetch e OCR | [Fetch e OCR](web-foundation/fetch-and-ocr.md) |
| Geração de imagens | [Geração de imagens](generations/images.md) |
| Texto para fala e fala para texto | [Texto para fala](generations/speech.md) e [Fala para texto](generations/audio-transcriptions.md) |
| Descrições de mídia, decisões, classificação e segmentação | Páginas de [Processamento de dados](data-processing/media-descriptions.md) |
| Extração e resumo de documentos | [Extração](data-processing/extraction.md) e [Resumo](data-processing/summarization.md) |
| Traduções | [Traduções](data-processing/translations.md) |
| Ferramentas e memória integradas | [Ferramentas integradas](tools/builtin-tools.md) |

## Cotas diárias incluídas

Todos os planos incluem cotas diárias separadas para embeddings RAG elegíveis, reranking do Reflex, decisões semânticas elegíveis e extração Fetch/OCR. As tarifas do produto se aplicam quando um item medido não está coberto. A cobertura é tudo ou nada por item, não necessariamente por solicitação completa: um item que não pode caber dentro da cota restante e sua margem permitida é cobrado integralmente. Compare as cotas e verifique as exclusões em [Planos e limites](limits.md#included-daily-subscription-allowances). A cobertura de assinatura LLM está atualmente desativada. Para saber o que cada cota cobre, veja [Free RAG API on AIVAX Free](https://aivax.net/blog/free-tier-for-rag-reflex-decisions-and-ocr/).

## Armazenamento

Cada plano inclui armazenamento. Excedentes de Pro, Max e Ultimate são cobrados por hora nas mensalidades abaixo; o armazenamento Free não pode ser expandido. O texto do documento armazenado em uma coleção conta como bytes UTF-8. Texto com acentos ou caracteres não latinos pode usar mais da cota incluída do que texto latino básico do mesmo comprimento.

| Descrição | Preço |
| --- | ---: |
| Armazenamento Free | **30 MB incluídos**; sem expansão |
| Armazenamento Pro | **2 GB incluídos**; excesso **$0,50/GB/mês** |
| Armazenamento Max | **10 GB incluídos**; excesso **$0,30/GB/mês** |
| Armazenamento Ultimate | **20 GB incluídos**; excesso **$0,20/GB/mês** |

## Cabeçalho de custo de solicitação

As respostas da API incluem um cabeçalho `Consumed-Credits` quando a solicitação cobrou o uso do seu saldo da conta. Seu valor é o total cobrado por aquela solicitação em USD, escrito como um número decimal com separador de ponto, por exemplo `Consumed-Credits: 0.000184`. Ele já inclui o multiplicador do plano e cobre todos os itens cobrados durante a solicitação, como inferência, embeddings, reranking e uso de ferramentas.

Respostas cross-origin expõem `Consumed-Credits` e `X-Request-ID`, para que o JavaScript do navegador em outra origem possa lê-los quando presentes. `X-Request-ID` é o identificador atribuído pela AIVAX àquela solicitação.

O cabeçalho é omitido quando a solicitação não cobrou nada, incluindo solicitações rejeitadas pela validação ou totalmente cobertas por uma cota de assinatura diária. Trate a ausência do cabeçalho como zero.

O valor cobre apenas as cobranças registradas antes do envio da resposta. O uso registrado posteriormente, como trabalho assíncrono [Batch](inference/batch.md), não está incluído. Respostas streamadas nunca incluem este cabeçalho, pois ele é adicionado após a produção da resposta. Para uma solicitação streamada, leia o `cost` registrado com a conversa (disponível quando o registro de conversas está habilitado) ou calcule o custo a partir das contagens de tokens relatadas. Use os registros de uso da sua conta como fonte da verdade para faturamento.

Analise o valor como um número de ponto flutuante. Valores muito pequenos, como `1E-05`, podem ser escritos em notação científica, e a soma de várias cobranças pode ter ruído de ponto flutuante em seus últimos dígitos.

## Desconto por Compartilhamento de Dados

Contas que habilitam [Compartilhamento de Dados](data-sharing.md) recebem um desconto de 10% no uso de query-embedding RAG elegível e nas operações de reranking elegíveis realizadas enquanto o compartilhamento estiver habilitado. Outros serviços mantêm seus preços regulares.

## Multiplicadores de Plano

As tarifas de uso estão sujeitas ao imposto de inferência do plano:

| Plano | Imposto de inferência | Teto diário de inferência de modelo |
| --- | ---: | ---: |
| Free | +25% | $1,50 |
| Pro | +5% | $1,20 |
| Max | +2% | $1,00 |
| Ultimate | 0% | Não aplicável |

Para inferência de modelos integrados, o imposto é registrado como sua própria entrada de uso, `inference.commission`, sob o modelo que atendeu à solicitação, para que as entradas de token mostrem as taxas do modelo. Uma vez que as entradas `inference.commission` do dia atingem o teto, a inferência adicional do modelo é cobrada apenas pelas taxas do modelo. O dia vai da meia-noite à meia-noite no fuso horário America/Sao_Paulo, e a contagem recomeça à meia-noite.

Outros serviços sujeitos ao multiplicador do plano o incluem em suas próprias tarifas, e essas cobranças não contam para o teto.

O uso BYOK não é afetado pelos impostos de inferência. As páginas do produto indicam quando uma tarifa é isenta do multiplicador do plano, como na geração de imagens.

## Recargas de Crédito

Adicionar créditos cobra o valor escolhido por você mais a taxa do processador de pagamento e os [impostos sobre pagamentos](#taxes-on-payments). Apenas o valor escolhido é adicionado ao seu saldo; taxas e impostos não são. No Free, uma taxa de serviço da AIVAX de 5% do valor, com mínimo de $0,20, também é adicionada. Pro, Max e Ultimate não pagam taxa de serviço da AIVAX. O painel mostra cada taxa, os impostos e o total antes de você confirmar o pagamento.

## Impostos sobre Pagamentos

Todo pagamento inclui impostos brasileiros: recargas de crédito, pagamentos e renovações de assinatura, e contas emitidas pela equipe da AIVAX. Os impostos são adicionados acima do valor devido, então o total cobrado é o valor dividido por (1 - 0,1333). Eles correspondem a aproximadamente 11,33% em impostos sobre serviços e 2% em IOF.

Por exemplo, um pagamento de assinatura de $19,00 cobra $21,92, e adicionar $10,00 em créditos em um plano sem taxa de serviço cobra $11,54 antes da taxa do processador de pagamento. Os impostos não são adicionados ao seu saldo, e os preços listados dos planos não os incluem. O recibo de cada pagamento lista o valor e cada imposto.
