# Preços

AIVAX usa um saldo de conta pré-pago. Faturas pagas adicionam crédito à conta e registros de uso subtraem desse saldo.

The backend calculates balance as:

```text
balance = paid, unexpired invoice total - usage total
```

Use a [página de preços da AIVAX](https://aivax.net/pricing) para os preços atuais dos planos comerciais. Esta página documenta o comportamento de faturamento que está visível no código-fonte da API.

## Créditos e faturas

Créditos são representados como faturas.

- Faturas pagas aumentam o saldo utilizável da conta até a data de expiração.
- Faturas de pagamento não pagas são criadas com expiração de um ano.
- Faturas não pagas com mais de três dias são removidas pela limpeza.
- Faturas pagas expiradas não contam mais para o saldo.
- A criação de fatura de pagamento requer pelo menos 3 USD e tem limite de taxa.

## Faturamento de uso

Cada operação faturável grava um ou mais registros de uso. Cada registro de uso contém:

- Descrição.
- Preço unitário.
- Quantidade.
- Nome opcional do modelo.
- Categoria de uso.
- Recursos como chave de API, gateway ou coleção.

O preço unitário final é multiplicado pelo multiplicador de imposto da conta e pelo multiplicador de comissão do plano atual.

| Plano | Multiplicador de comissão |
| --- | --- |
| Gratuito | 1.25x |
| Pro | 1.05x |
| Máximo | 1.00x |

## Faturamento de inferência

O faturamento de modelo integrado usa a tabela de preços do modelo fornecida pelo backend. O preço pode variar por modelo e por limite de tokens de entrada. O uso pode incluir:

- Tokens de texto de entrada.
- Tokens de entrada em cache, quando o modelo selecionado tem preço para entrada em cache.
- Tokens de áudio de entrada, quando aplicável.
- Tokens de saída.

Alguns modelos integrados podem ser cobertos por janelas de reserva de modelo de assinatura. Quando um modelo tem um multiplicador de uso de assinatura e a conta ainda tem reserva restante tanto na janela de seis horas quanto na semanal, o uso registrado do modelo pode ser coberto em vez de ser cobrado do saldo.

As janelas de reserva atuais são:

| Plano | Reserva de seis horas | Reserva semanal |
| --- | --- | --- |
| Gratuito | Nenhum | Nenhum |
| Pro | 250 unidades | 3.000 unidades |
| Máximo | 1.000 unidades | 15.000 unidades |

Chamadas BYOK usam sua chave de provedor externo, mas a AIVAX ainda aplica limites de requisições BYOK porque a requisição passa pela infraestrutura da AIVAX.

## Faturamento RAG

O modelo de incorporação padrão é `@aivax/data-embedding`. Seu preço no backend é:

```text
$0.015 per 1,000,000 input tokens
```

Isso se aplica ao indexamento de documentos e ao uso de incorporação de consultas que utilizam o modelo de incorporação padrão. Reordenação, quando ativada, pode adicionar uso separado de reordenação.

O endpoint lexical independente [Reranking](/docs/pt-br/rag/reranking) tem um preço base de $0.0001 por requisição, equivalente a $1 por 10.000 buscas. Esse preço de endpoint não é adicionado à reordenação feita dentro da Busca Semântica. O multiplicador de comissão do plano ainda se aplica quando o registro de uso independente é escrito.

## Faturamento de armazenamento

O armazenamento é verificado antes de operações limitadas por saldo. Se o uso de armazenamento exceder a cota do plano, a requisição pode falhar com `402 Payment Required`.

| Plano | Armazenamento incluído | Excesso |
| --- | --- | --- |
| Gratuito | 30 MB | Nenhum excesso pago |
| Pro | 2 GB | $0.50/GB/mês, cobrado por hora |
| Máximo | 20 GB | $0.20/GB/mês, cobrado por hora |

O excesso de armazenamento é cobrado por hora. O trabalho cobra apenas o uso excedente acima da cota incluída, e somente quando o excesso faturável é maior que 1 MB.

O armazenamento pode incluir conteúdo e vetores de documentos RAG, itens de memória de longo prazo, cache de descrição de mídia, conteúdo de sessão de chat web e arquivos de shell.

## Requisitos de saldo

Rotas faturáveis verificam o saldo antes de executar. O middleware genérico de saldo rejeita saldos abaixo do mínimo da rota; clientes de chat, integrações e processamento em lote também interrompem quando o saldo está zero ou negativo. Alguns inputs de conclusão de chat multimodais requerem um saldo mínimo antes de iniciar a chamada do modelo:

| Tipo de entrada | Saldo mínimo |
| --- | --- |
| Imagem ou áudio | $0.10 |
| Arquivo ou vídeo | $0.50 |

Se o saldo da conta for muito baixo, a API retorna `402 Payment Required`.

## Planos e limites

Os planos afetam tanto o preço quanto a operação:

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