# Preços

AIVAX usa um saldo de conta pré-pago. Faturas pagas adicionam crédito à conta, e os registros de uso subtraem desse saldo.

O backend calcula o saldo como:

```text
balance = paid, unexpired invoice total - usage total
```

Use a [página de preços da AIVAX](https://aivax.net/pricing) para os preços atuais dos planos comerciais. Esta página documenta o comportamento de faturamento que é visível no código-fonte da API.

## Créditos e faturas

Créditos são representados como faturas.

- Faturas pagas aumentam o saldo utilizável da conta até a data de expiração.
- Faturas de pagamento não pagas são criadas com expiração de um ano.
- Faturas não pagas com mais de três dias são removidas pela limpeza.
- Faturas pagas expiradas não contam mais para o saldo.
- A criação de fatura de pagamento requer pelo menos 3 USD e tem limite de taxa.

## Faturamento de uso

Cada operação faturável grava um ou mais registros de uso. Cada registro de uso tem:

- Descrição.
- Preço unitário.
- Quantidade.
- Nome do modelo opcional.
- Categoria de uso.
- Recursos como chave de API, gateway ou coleção.

O preço unitário final é multiplicado pelo multiplicador de imposto da conta e pelo multiplicador de comissão do plano atual.

| Plano | Multiplicador de comissão |
| --- | --- |
| Free | 1.25x |
| Pro | 1.05x |
| Max | 1.00x |

## Faturamento de inferência

O faturamento de modelo integrado usa a tabela de preços do modelo do backend. O preço pode variar por modelo e por limite de tokens de entrada. O uso pode incluir:

- Tokens de entrada de texto.
- Tokens de entrada em cache, quando o modelo selecionado tem preço de entrada em cache.
- Tokens de entrada de áudio, quando aplicável.
- Tokens de saída.

Alguns modelos integrados podem ser cobertos por janelas de reserva de modelo de assinatura. Quando um modelo tem um multiplicador de uso por assinatura e a conta ainda tem reserva restante tanto nas janelas de seis horas quanto nas semanais, o uso registrado do modelo pode ser coberto em vez de ser cobrado do saldo.

As janelas de reserva atuais são:

| Plano | Reserva de seis horas | Reserva semanal |
| --- | --- | --- |
| Free | Nenhum | Nenhum |
| Pro | 250 unidades | 3.000 unidades |
| Max | 1.000 unidades | 15.000 unidades |

Chamadas BYOK usam sua chave de provedor externo, mas a AIVAX ainda impõe limites de requisição BYOK porque a requisição passa pela infraestrutura da AIVAX.

## Faturamento RAG

O modelo de incorporação padrão é `@aivax/data-embedding`. Seu preço no backend é:

```text
$0.015 per 1,000,000 input tokens
```

Isso se aplica ao indexamento de documentos e ao uso de incorporação de consultas que usa o modelo de incorporação padrão. Reordenação, quando habilitada, pode adicionar uso de reordenação separado.

### Reflex

Reflex tem dois preços de token de entrada:

| Tipo de entrada | Preço base |
| --- | ---: |
| Cache miss | US$0.015 per 1 million tokens |
| Cache hit | US$0.003 per 1 million tokens |

O preço de acerto em cache se aplica quando o processamento de entrada pode ser reutilizado. O preço de falha em cache se aplica quando a entrada deve ser processada. O [multiplicador de comissão do plano](#usage-billing) da conta é aplicado quando o uso é registrado. Veja [Reflex](rag/reflex.md) para limites de requisição e comportamento de cache.

## Faturamento de armazenamento

O armazenamento é verificado antes de operações limitadas por saldo. Se o uso de armazenamento exceder a cota do plano, a requisição pode falhar com `402 Payment Required`.

| Plano | Armazenamento incluído | Excesso |
| --- | --- | --- |
| Free | 30 MB | Sem excesso pago |
| Pro | 2 GB | $0.50/GB/month, cobrado por hora |
| Max | 20 GB | $0.20/GB/month, cobrado por hora |

O excesso de armazenamento é cobrado por hora. O trabalho cobra apenas o uso excessivo acima da cota incluída, e somente quando o excesso faturável for maior que 1 MB.

O armazenamento pode incluir conteúdo e vetores de documentos RAG, itens de memória de longo prazo, cache de descrição de mídia, conteúdo de sessões de chat na web e arquivos de shell.

## Requisitos de saldo

Rotas faturáveis verificam o saldo antes de executar. O middleware genérico de saldo rejeita saldos abaixo do mínimo da rota; clientes de chat, integrações e processamento em lote também param quando o saldo está zero ou negativo. Alguns inputs multimodais de conclusão de chat requerem um saldo mínimo antes que a chamada ao modelo inicie:

| Tipo de entrada | Saldo mínimo |
| --- | --- |
| Image or audio | $0.10 |
| File or video | $0.50 |

Se o saldo da conta for muito baixo, a API retorna `402 Payment Required`.

## Planos e limites

Planos afetam tanto preço quanto operação:

- Acesso ao modelo.
- Multiplicador de comissão.
- Limites de taxa de requisição e token.
- Limites de requisição BYOK.
- Cotas RAG.
- Limites de ferramentas.
- Cota de armazenamento e preço de excesso.
- Retenção de conversas.
- Janelas de reserva de modelo de assinatura.

Veja [Planos e limites](limits.md) para a matriz técnica de cotas.