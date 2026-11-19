Source: https://docs.aivax.net/pt-br/docs/pricing.html

# Preços

A AIVAX cobra o uso do saldo da conta em USD. Cada produto documenta suas próprias tarifas em uma seção de preços dedicada, vinculada abaixo. Esta página aborda as regras compartilhadas por todos os produtos: cotas de assinatura, armazenamento, cabeçalho de custo de solicitação, desconto de compartilhamento de dados, multiplicadores de plano, taxas de recarga de crédito e impostos sobre pagamentos.

Veja [preços de assinatura](https://aivax.net/pricing) para os preços dos planos mensais e [Planos e limites](https://docs.aivax.net/pt-br/docs/limits.md) para as cotas em nível de conta. **M** significa um milhão de tokens; **1k** significa mil unidades. Preços aproximados (`~`) variam conforme o modelo utilizado e o trabalho realizado.

## Preços de lista dos planos

Use a página de preços ao escolher um plano em um navegador. Para ler os mesmos preços públicos de lista a partir de um aplicativo, chame `GET /api/v1/information/plans.json`. Nenhuma chave de API é necessária. A resposta lista Free, Pro, Max e Ultimate. Cada entrada possui `plan` e `monthlyPrice` em USD. Free é `0` porque esse plano não tem taxa de assinatura. Um preço Custom negociado ou o preço atualmente aplicado a uma conta não estão incluídos. Use a API de Assinaturas quando precisar do preço da conta autenticada.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Get%20Plans)

## Preços dos produtos

| Área | Onde encontrar as tarifas |
| --- | --- |
| Inferência e moderação | [Inferência](https://docs.aivax.net/pt-br/docs/inference/chat-completions/concepts.md#pricing) |
| Testes Agentic | [Testes Agentic](https://docs.aivax.net/pt-br/docs/inference/agentic-tests.md#pricing-and-limits) |
| Voz e Realtime | [Voz e Realtime](https://docs.aivax.net/pt-br/docs/inference/voice-session.md#billing-and-limits) |
| Coleções RAG, busca e respostas | [Coleções](https://docs.aivax.net/pt-br/docs/rag/collections.md#pricing-and-limits) |
| Media Injector | [Documentos](https://docs.aivax.net/pt-br/docs/rag/documents.md#pricing-and-limits) |
| Reflex | [Reflex](https://docs.aivax.net/pt-br/docs/rag/reflex.md#pricing-and-limits) |
| Busca na web e busca no X | [Busca na Web](https://docs.aivax.net/pt-br/docs/web-foundation/web-search.md) |
| Fetch e OCR | [Fetch e OCR](https://docs.aivax.net/pt-br/docs/web-foundation/fetch-and-ocr.md) |
| Geração de imagens | [Geração de imagens](https://docs.aivax.net/pt-br/docs/generations/images.md) |
| Texto para fala e fala para texto | [Texto para fala](https://docs.aivax.net/pt-br/docs/generations/speech.md) e [Fala para texto](https://docs.aivax.net/pt-br/docs/generations/audio-transcriptions.md) |
| Descrições de mídia, decisões, classificação e segmentação | Páginas de [Processamento de dados](https://docs.aivax.net/pt-br/docs/data-processing/media-descriptions.md) |
| Extração e resumo de documentos | [Extração](https://docs.aivax.net/pt-br/docs/data-processing/extraction.md) e [Resumo](https://docs.aivax.net/pt-br/docs/data-processing/summarization.md) |
| Traduções | [Traduções](https://docs.aivax.net/pt-br/docs/data-processing/translations.md) |
| Ferramentas integradas e memória | [Ferramentas integradas](https://docs.aivax.net/pt-br/docs/tools/builtin-tools.md) |

## Cotas diárias incluídas

Todos os planos incluem cotas diárias separadas para embeddings RAG elegíveis, reclassificação Reflex, decisões semânticas elegíveis e extração Fetch/OCR. As tarifas do produto se aplicam quando um item medido não está coberto. A cobertura é tudo ou nada por item, não necessariamente por solicitação completa: um item que não pode caber dentro da cota restante e sua margem permitida é cobrado integralmente. Compare as cotas e verifique as exclusões em [Planos e limites](https://docs.aivax.net/pt-br/docs/limits.md#included-daily-subscription-allowances). Essas cotas diárias não cobrem inferência de modelos de texto; veja [Modelos de assinatura](#modelos-de-assinatura). Para saber o que cada cota cobre, consulte [API RAG Gratuita na AIVAX Free](https://aivax.net/blog/free-tier-for-rag-reflex-decisions-and-ocr/).

## Modelos de assinatura

Pro, Max e Ultimate incluem uma cota de modelo de assinatura mensal, renovada no início de cada mês civil. Ela se aplica apenas aos modelos de assinatura, os modelos do catálogo cujos nomes começam com `@aivax-subscription/`. Usá-los nunca debita o saldo da conta e eles não têm preços por token; outros modelos são cobrados no saldo conforme suas tarifas. Planos Free e Custom não têm cota, portanto, solicitações a modelos de assinatura nesses planos retornam `429 Too Many Requests`, assim como ocorre quando a cota de um plano pago é esgotada. Uma cota esgotada nunca é cobrada no saldo nem roteada para outro modelo.

O uso incluído por cada plano é publicado como equivalente nos preços integrados do catálogo dos modelos, arredondado para cima para o múltiplo de $10 mais próximo. A taxa de consumo é dinâmica e pode mudar diariamente, então o mesmo modelo pode usar ligeiramente mais ou menos da cota ao longo do tempo. Veja [Modelos de assinatura](https://docs.aivax.net/pt-br/docs/inference/subscription-models/overview.md) e [Cota mensal de modelo de assinatura](https://docs.aivax.net/pt-br/docs/limits.md#monthly-subscription-model-quota).

## Armazenamento

Cada plano inclui armazenamento. Excedentes de Pro, Max e Ultimate são cobrados por hora nas tarifas mensais abaixo; o armazenamento Free não pode ser expandido. O texto do documento armazenado em uma coleção conta como bytes UTF-8. Texto com acentos ou caracteres não latinos pode usar mais da cota incluída do que texto latino básico do mesmo comprimento.

| Descrição | Preço |
| --- | ---: |
| Armazenamento Free | **30 MB incluídos**; sem expansão |
| Armazenamento Pro | **2 GB incluídos**; excesso **$0,50/GB/mês** |
| Armazenamento Max | **10 GB incluídos**; excesso **$0,30/GB/mês** |
| Armazenamento Ultimate | **20 GB incluídos**; excesso **$0,20/GB/mês** |

## Cabeçalho de custo de solicitação

As respostas da API incluem um cabeçalho `Consumed-Credits` quando a solicitação cobrou o uso do seu saldo da conta. Seu valor é o total cobrado por essa solicitação em USD, escrito como um número decimal com separador de ponto, por exemplo `Consumed-Credits: 0.000184`. Ele já inclui o multiplicador do plano e cobre todos os itens cobrados durante a solicitação, como inferência, embeddings, reclassificação e uso de ferramentas.

Respostas cross-origin expõem `Consumed-Credits` e `X-Request-ID`, então o JavaScript do navegador em outra origem pode lê-los quando presentes. `X-Request-ID` é o identificador atribuído pela AIVAX àquela solicitação.

O cabeçalho é omitido quando a solicitação não cobrou nada, incluindo solicitações rejeitadas por validação ou totalmente cobertas por uma cota diária de assinatura ou pela cota mensal do modelo de assinatura. Trate a ausência do cabeçalho como zero.

O valor cobre apenas os registros de cobrança antes do envio da resposta. O uso registrado posteriormente, como trabalho assíncrono [Batch](https://docs.aivax.net/pt-br/docs/inference/batch.md), não está incluído. Respostas streamadas nunca incluem este cabeçalho, pois ele é adicionado após a produção da resposta. Para uma solicitação streamada, leia o `cost` registrado com a conversa (disponível quando o registro de conversas está habilitado) ou calcule o custo a partir das contagens de tokens relatadas. Use os registros de uso da sua conta como fonte da verdade para faturamento.

Analise o valor como um número de ponto flutuante. Valores muito pequenos, como `1E-05`, podem ser escritos em notação científica, e a soma de várias cobranças pode ter ruído de ponto flutuante em seus dígitos finais.

## Desconto de Compartilhamento de Dados

Contas que habilitam o [Compartilhamento de Dados](https://docs.aivax.net/pt-br/docs/data-sharing.md) recebem um desconto de 10% no uso de embedding de consulta RAG elegível e nas operações de reclassificação elegíveis realizadas enquanto o compartilhamento estiver habilitado. Outros serviços mantêm seus preços regulares.

## Multiplicadores de plano

As tarifas de uso estão sujeitas ao imposto de inferência do plano:

| Plano | Imposto de inferência | Teto diário na inferência do modelo |
| --- | ---: | ---: |
| Free | +25% | $1,50 |
| Pro | +5% | $1,20 |
| Max | +2% | $1,00 |
| Ultimate | 0% | Não aplicável |

Para inferência de modelos integrados, o imposto é registrado como sua própria entrada de uso, `inference.commission`, sob o modelo que atendeu à solicitação, então as entradas de token mostram as tarifas do modelo. Assim que as entradas `inference.commission` do dia atingirem o teto, a inferência adicional do modelo será cobrada apenas nas tarifas do modelo. O dia vai da meia-noite à meia-noite no fuso horário America/Sao_Paulo, e a contagem reinicia à meia-noite.

Outros serviços sujeitos ao multiplicador de plano o incluem em suas próprias tarifas, e essas cobranças não contam para o teto.

O uso BYOK não é afetado pelos impostos de inferência. As páginas do produto indicam quando uma tarifa é isenta do multiplicador de plano, como na geração de imagens.

## Recargas de crédito

Adicionar créditos cobra o valor escolhido por você mais a taxa do processador de pagamento e os [impostos sobre pagamentos](#impostos-sobre-pagamentos). Apenas o valor escolhido é adicionado ao seu saldo; taxas e impostos não são. No Free, uma taxa de serviço da AIVAX de 5% do valor, com um mínimo de $0,20, também é adicionada. Pro, Max e Ultimate não pagam taxa de serviço da AIVAX. O painel mostra cada taxa, os impostos e o total antes de você confirmar o pagamento.

## Impostos sobre pagamentos

Todo pagamento inclui impostos brasileiros: recargas de crédito, pagamentos e renovações de assinatura, e contas emitidas pela equipe da AIVAX. Os impostos são adicionados acima do valor devido, então o total cobrado é o valor dividido por (1 - 0,1333). Eles correspondem a aproximadamente 11,33% do total em impostos sobre serviços e 2% em IOF.

Por exemplo, um pagamento de assinatura de $19,00 cobra $21,92, e adicionar $10,00 em créditos em um plano sem taxa de serviço cobra $11,54 antes da taxa do processador de pagamento. Os impostos não são adicionados ao seu saldo, e os preços listados dos planos não os incluem. O recibo de cada pagamento lista o valor e cada imposto.
