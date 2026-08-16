# Preços

AIVAX usa um saldo de conta pré-pago. Faturas pagas adicionam crédito à conta, e registros de uso subtraem desse saldo.

O backend calcula o saldo como:

```text
balance = paid, unexpired invoice total - usage total
```

Use a [página de preços da AIVAX](https://aivax.net/pricing) para preços atuais dos planos comerciais. Esta página documenta o comportamento de faturamento que é visível no código‑fonte da API.

## Créditos e faturas

Créditos são representados como faturas.

- Faturas pagas aumentam o saldo utilizável da conta até a data de expiração.
- Faturas de pagamento não pagas são criadas com expiração de um ano.
- Faturas não pagas com mais de três dias são removidas pela limpeza.
- Faturas pagas expiradas não contam mais para o saldo.
- A criação de fatura de pagamento requer pelo menos 3 USD e tem limite de taxa.

## Faturamento de uso

Cada operação faturável grava um ou mais registros de uso. Cada registro de uso contém:

- Descrição.
- Preço unitário.
- Quantidade.
- Nome do modelo opcional.
- Categoria de uso.
- Recursos como chave de API, gateway ou coleção.

O preço unitário final é multiplicado pelo multiplicador de imposto da conta e pelo multiplicador de comissão do plano atual.

### Créditos consumidos por solicitação

Quando uma solicitação relata uso, a AIVAX inclui o total de créditos cobrados por aquela solicitação no cabeçalho da resposta:

```text
Consumed-Credits: 0.005
```

O valor é um número decimal de créditos, formatado com ponto como separador decimal. É o total da solicitação completa, incluindo todas as operações faturáveis realizadas durante o seu processamento. Uma operação rastreada que não tem custo pode retornar `Consumed-Credits: 0`.

Se o cabeçalho estiver ausente, a solicitação não relatou um total de uso. Não trate um cabeçalho ausente como `0`. Este cabeçalho relata apenas o consumo da solicitação atual; use as APIs de saldo da conta para obter o saldo disponível ou o histórico de faturamento mais amplo.

| Plano | Multiplicador de comissão |
| --- | --- |
| Gratuito | 1,25x |
| Pro | 1,05x |
| Max | 1,00x |

## Lista de preços

| Serviço | Preço |
| ------- | ------------ |
| **Conta** |
| Armazenamento | - Plano Gratuito: **30 MB** incluídos, sem expansão<br>- Plano Pro: **2 GB** incluídos, **$0,50/GB/mês** para excesso, cobrado por hora<br>- Plano Max: **20 GB** incluídos, **$0,20/GB/mês** para excesso, cobrado por hora |
| **Inferência** |
| Moderação | - Entrada: **$0,10/M tokens**<br>- Cache: **$0,0375/M tokens**<br>- Saída: **$0,30/M tokens**<br>- Tamanho do contexto: 16 K tokens |
| <a id="agentic-tests"></a><a id="agentic-validations"></a>Testes Agentes | - Modelo selecionado ou Gateway de IA: suas taxas de inferência regulares<br>- Perfil `low` — usuário simulado: entrada **$0,25/M tokens**, entrada em cache **$0,025/M tokens**, saída **$1,50/M tokens**; juiz: entrada **$0,30/M tokens**, entrada em cache **$0,03/M tokens**, saída **$2,50/M tokens**<br>- Perfil `medium` (padrão) — usuário e juiz simulados, cada um: entrada **$0,75/M tokens**, entrada em cache **$0,075/M tokens**, saída **$3,75/M tokens**<br>- Perfil `high` — usuário simulado: entrada **$0,75/M tokens**, entrada em cache **$0,075/M tokens**, saída **$3,75/M tokens**; juiz: entrada **$1,25/M tokens**, entrada em cache **$0,15/M tokens**, saída **$4,25/M tokens** |
| **RAG e coleções** |
| Coleções | Incorporação de texto: **$0,015/M tokens** |
| Injetor de mídia | - PDFs e imagens, até 272 K tokens de entrada: entrada **$0,30/M tokens**, entrada em cache **$0,03/M tokens**, saída **$1,80/M tokens**<br>- PDFs e imagens, acima de 272 K tokens de entrada: entrada **$0,60/M tokens**, entrada em cache **$0,06/M tokens**, saída **$3,60/M tokens**<br>- Áudio, até 256 K tokens de entrada: entrada/mídia **$0,60/M tokens**, entrada em cache **$0,12/M tokens**, saída **$3,00/M tokens**<br>- Áudio, acima de 256 K tokens de entrada: entrada/mídia **$1,20/M tokens**, entrada em cache **$0,24/M tokens**, saída **$6,00/M tokens**<br>- Vídeo: entrada/mídia **$0,45/M tokens**, entrada em cache **$0,045/M tokens**, saída **$3,75/M tokens** (4) |
| Busca semântica | Consulta: **$0,015/M tokens** |
| Respostas RAG | ~**$0,50/M tokens** (3) |
| Segmentação de texto | **$0,30/M tokens** |
| Classificação de texto | **$0,015/M tokens** |
| Reflexão | - Falha de cache: **$0,015/M tokens**<br>- Acerto de cache: **$0,003/M tokens** |
| **Voz e fala** |
| Sessões de voz | Taxas do modelo em tempo real selecionado |
| **Acesso à Internet** |
| Busca na web | **$5/1k buscas** |
| Busca no X (Twitter) | **$5/1k buscas** |
| Busca avançada na web | ~**$0,75/M tokens** (1) |
| Busca e extração OCR | - Plano Gratuito: **1 000 PU/dia gratuitos**, **$0,15/1k PUs**<br>- Plano Pro: **10 000 PU/dia gratuitos**, **$0,05/1k PUs**<br>- Plano Max: **50 000 PU/dia gratuitos**, **$0,02/1k PUs** (2) |
| **Geração de mídia** |
| Geração de imagens | Varia por modelo |
| Conversão de fala para texto | Varia por modelo |
| Conversão de texto para fala | Varia por modelo |
| Descrições de mídia | **~$1,50/mtokens** (2) |
| **Outras ferramentas** |
| Memória e calendário | Sem custo |
| Solicitações avançadas | Sem custo |
| Geração de documentos | Sem custo |
| Geração de páginas web | Sem custo |

- <small>(1) O preço de busca avançada na Internet aplica‑se a um modelo externo conectado à Internet e às ferramentas de busca; o preço varia conforme o número de interações realizadas pelo agente.</small>
- <small>(2) O preço para extração de texto a partir de mídia aplica‑se a um pequeno modelo omni‑modal, sujeito à disponibilidade.</small>
- <small>(3) O preço para geração de resposta RAG não inclui o custo da incorporação da consulta; o preço varia conforme o modelo de sumarização.</small>
- <small>(4) O Injetor de mídia é cobrado pelo total de entrada, entrada em cache, saída e uso de mídia produzidos ao criar documentos RAG. O arquivo fonte, o contexto opcional e o conteúdo gerado podem afetar o uso de tokens. Os multiplicadores de imposto da conta e de comissão do plano ainda se aplicam.</small>

## Faturamento de inferência

O faturamento de modelo integrado usa a tabela de preços do modelo do backend. O preço pode variar por modelo e por limite de tokens de entrada. O uso pode incluir:

- Tokens de entrada de texto.
- Tokens de entrada em cache, quando o modelo selecionado tem preço de entrada em cache.
- Tokens de entrada de áudio, quando aplicável.
- Tokens de entrada de imagem, quando aplicável.
- Tokens de saída, incluindo tokens de saída de áudio quando aplicável.

Chamadas BYOK (Bring-Your-Own-Key) usam sua chave de provedor externo, mas a AIVAX ainda impõe limites de solicitações BYOK porque a requisição passa pela infraestrutura da AIVAX.

## Requisitos de saldo

Rotas faturáveis verificam o saldo antes de executar. O middleware genérico de saldo rejeita saldos abaixo do mínimo da rota; clientes de chat, integrações e processamento em lote também interrompem quando o saldo está zero ou negativo. Algumas entradas de chat‑completação multimodais exigem um saldo mínimo antes que a chamada ao modelo comece:

| Tipo de entrada | Saldo mínimo |
| --- | --- |
| Imagem ou áudio | $0,10 |
| Arquivo ou vídeo | $0,50 |

Se o saldo da conta for muito baixo, a API retorna `402 Payment Required`.

## Planos e limites

Os planos afetam tanto preço quanto operação:

- Acesso ao modelo.
- Multiplicador de comissão.
- Limites de taxa de solicitações e tokens.
- Limites de solicitações BYOK.
- Cotas RAG.
- Limites de ferramentas.
- Cota de armazenamento e preço de excesso.
- Retenção de conversas.
- Janelas de reserva do modelo de assinatura.

Consulte [Planos e limites](limits.md) para a matriz técnica de cotas.