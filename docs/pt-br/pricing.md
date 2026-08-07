# Preços

AIVAX usa um saldo de conta pré-pago. Faturas pagas adicionam crédito à conta, e registros de uso subtraem desse saldo.

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
- A criação de fatura de pagamento requer ao menos 3 USD e tem limite de taxa.

## Faturamento de uso

Cada operação faturável grava um ou mais registros de uso. Cada registro de uso contém:

- Descrição.
- Preço unitário.
- Quantidade.
- Nome do modelo opcional.
- Categoria de uso.
- Recursos como chave de API, gateway ou coleção.

O preço unitário final é multiplicado pelo multiplicador de imposto da conta e pelo multiplicador de comissão do plano atual.

| Plano | Multiplicador de comissão |
| --- | --- |
| Gratuito | 1.25x |
| Pro | 1.05x |
| Max | 1.00x |

## Lista de preços

| Serviço | Preço |
| ------- | ------------ |
| **Conta** |
| Armazenamento | - Plano Gratuito: **30 MB** incluídos, sem expansão<br>- Plano Pro: **2 GB** incluídos, **$0.50/GB/mês** para excedente, cobrado por hora<br>- Plano Max: **20 GB** incluídos, **$0.20/GB/mês** para excedente, cobrado por hora |
| **Inferência** |
| Moderação | - Entrada: **$0.10/M tokens**<br>- Cache: **$0.0375/M tokens**<br>- Saída: **$0.30/M tokens**<br>- Tamanho do contexto: 16K tokens |
| **RAG e coleções** |
| Coleções | Incorporação de texto: **$0.015/M tokens** |
| Busca semântica | Consulta: **$0.015/M tokens** |
| Respostas RAG | ~**$0.50/M tokens** (3) |
| Segmentação de texto | **$0.30/M tokens** |
| Classificação de texto | **$0.015/M tokens** |
| Reflex | - Falha de cache: **$0.015/M tokens**<br>- Acerto de cache: **$0.003/M tokens** |
| **Voz e fala** |
| Sessões de voz | **$0.05/minuto** |
| **Acesso à internet** |
| Busca na web | **$5/1k buscas** |
| Busca no X (Twitter) | **$5/1k buscas** |
| Busca avançada na web | ~**$0.75/M tokens** (1) |
| Busca e extração OCR | - Plano Gratuito: **1.000 PU/dia gratuito**, **$0.15/1k PUs**<br>- Plano Pro: **10.000 PU/dia gratuito**, **$0.05/1k PUs**<br>- Plano Max: **50.000 PU/dia gratuito**, **$0.02/1k PUs** (2) |
| **Geração de mídia** |
| Geração de imagem | Varia por modelo |
| Conversão fala‑texto | Varia por modelo |
| Conversão texto‑fala | Varia por modelo |
| Descrições de mídia | **~$1.50/mtokens** (2) |
| **Outras ferramentas** |
| Memória e calendário | Sem custo |
| Solicitações avançadas | Sem custo |
| Geração de documentos | Sem custo |
| Geração de página web | Sem custo |

- <small>(1) O preço da busca avançada na internet se aplica a um modelo externo conectado à internet e às ferramentas de busca; o preço varia com base no número de interações realizadas pelo agente.</small>
- <small>(2) O preço da extração de texto de mídia se aplica a um pequeno modelo omni‑modal, sujeito à disponibilidade.</small>
- <small>(3) O preço da geração de resposta RAG não inclui o custo da incorporação da consulta; o preço varia com base no modelo de sumarização.</small>
## Faturamento de inferência

O faturamento de modelo integrado usa a tabela de preços do modelo do backend. O preço pode variar por modelo e por limite de tokens de entrada. O uso pode incluir:

- Tokens de entrada de texto.
- Tokens de entrada em cache, quando o modelo selecionado tem preço de entrada em cache.
- Tokens de entrada de áudio, quando aplicável.
- Tokens de saída.

Chamadas BYOK (Bring-Your-Own-Key) usam sua chave de provedor externo, mas a AIVAX ainda impõe limites de solicitação BYOK porque a solicitação passa pela infraestrutura da AIVAX.

## Requisitos de saldo

Rotas faturáveis verificam o saldo antes de executar. O middleware genérico de saldo rejeita saldos abaixo do mínimo da rota; clientes de chat, integrações e processamento em lote também param quando o saldo é zero ou negativo. Algumas entradas multimodais de conclusão de chat exigem um saldo mínimo antes de iniciar a chamada ao modelo:

| Tipo de entrada | Saldo mínimo |
| --- | --- |
| Imagem ou áudio | $0.10 |
| Arquivo ou vídeo | $0.50 |

Se o saldo da conta for muito baixo, a API retorna `402 Payment Required`.

## Planos e limites

Os planos afetam tanto o preço quanto a operação:

- Acesso ao modelo.
- Multiplicador de comissão.
- Limites de taxa de solicitações e tokens.
- Limites de solicitações BYOK.
- Cotas RAG.
- Limites de ferramentas.
- Cota de armazenamento e preço de excedente.
- Retenção de conversas.
- Janelas de reserva do modelo de assinatura.

Consulte [Planos e limites](limits.md) para a matriz técnica de cotas.