---
{title: Truncamento de Contexto,linkTitle: Truncamento de contexto,weight: 134,group: Inference,sourceHash: 71facffb1c40eef3,aliases: [/docs/pt-br/inference/chat-completions/context-truncation.html]}
---

# Truncamento de contexto

O truncamento de contexto mantém conversas longas dentro de um tamanho máximo de entrada. Um Gateway de IA pode limitar a entrada com `contextMaximumSize`, escolher o que acontece quando uma conversa excede esse limite com `contextOverflowAction` e encurtar resultados antigos de ferramentas com `toolContextCount`. Configure-os em **Gerenciamento da janela de contexto** no editor do gateway ou nos parâmetros do gateway.

Estas são configurações do gateway; as solicitações não podem substituí-las. Seu aplicativo ainda envia todo o histórico que armazena, e o truncamento apenas altera o que o modelo recebe para essa solicitação.

## Tamanho máximo do contexto

`contextMaximumSize` é o número aproximado máximo de tokens de entrada enviados ao modelo. Quando não está definido, o AIVAX não limita a entrada, e a solicitação falha apenas se exceder a própria janela de contexto do modelo.

O tamanho é uma estimativa das mensagens da conversa (incluindo documentos inseridos por [RAG](processing-pipeline.md#rag)), instruções do sistema, definições de ferramentas e esquema de resposta. Como pode diferir da contagem de tokens do provedor, defina `contextMaximumSize` abaixo da janela de contexto real do modelo para deixar uma margem, especialmente para conversas com muito conteúdo multimídia.

No plano Gratuito, o contexto de entrada é limitado, mesmo quando o modelo ou o gateway permitem mais. Consulte [Limites](limits.md#context-window) para saber o valor.

## Ações de transbordamento

Quando a entrada estimada excede o limite, o gateway segue `contextOverflowAction`:

| Ação | Comportamento | Quando usar |
| --- | --- | --- |
| `Throw` (padrão) | Retorna um erro em vez de chamar o modelo. | Cada mensagem importa, como em uma revisão de documento, para que o aplicativo decida o que remover. |
| `Truncate` | Remove as mensagens mais antigas da conversa até que caibam, e então continua. | Chats de longa duração em que as rodadas anteriores perdem relevância, como conversas de suporte. |
| `TruncateHard` | Trunca como `Truncate`, mas retorna um erro se a solicitação completa, incluindo instruções do sistema, documentos recuperados e definições de ferramentas, ainda exceder o limite. | Você quer truncamento, mas nunca uma solicitação maior que o limite. |

O editor do gateway oferece `Throw` e `Truncate`; defina `TruncateHard` por meio da API.

### Como o truncamento remove mensagens

`Truncate` e `TruncateHard` removem mensagens do início da conversa. Mensagens do sistema e a última mensagem do usuário nunca são removidas, para que o modelo sempre receba a solicitação atual. Resultados de ferramentas são removidos junto com sua chamada de ferramenta.

O truncamento não resume as mensagens removidas. Quando o modelo precisa de fatos das rodadas iniciais, mantenha-os nas instruções do sistema, em uma [coleção](/docs/pt-br/rag/collections.md) ou em [memórias](/docs/pt-br/tools/builtin-tools.md).

### Quando a verificação é executada

A verificação é executada antes de cada geração de modelo de uma solicitação. Em uma solicitação agêntica, um resultado grande de ferramenta pode fazer com que a conversa exceda o limite após algumas ferramentas já terem sido executadas. Com `Throw`, a solicitação falha nesse ponto; com `Truncate`, as mensagens mais antigas são removidas e o loop continua. Veja [Pipeline de processamento](processing-pipeline.md).

O conteúdo multimídia conta pelo seu tamanho original estimado, não pelo tamanho de sua descrição [pré-processada](multimodal-pre-processing.md).

## Truncamento de mensagens de ferramenta

`toolContextCount` controla quantas mensagens recentes de resposta de ferramenta mantêm seu conteúdo original. Quando definido com um valor maior que zero, as mensagens de ferramenta mais antigas permanecem na conversa, mas seu conteúdo é substituído por:

```text
[resposta da ferramenta truncada - chame esta ferramenta novamente]
```

Isso se aplica a resultados de [ferramentas do lado do cliente](tools.md) e ferramentas do lado do servidor. Isso reduz o uso de contexto em conversas agênticas longas cujas ferramentas retornam grandes cargas úteis que são relevantes apenas uma vez, como resultados de pesquisa. Evite isso quando um resultado de ferramenta inicial permanece importante mais tarde, e use-o apenas quando o modelo puder chamar a ferramenta novamente com segurança.

Reescrever mensagens de ferramenta mais antigas também altera o prefixo da solicitação, o que pode reduzir a taxa de acerto do [cache de prompt](caching.md).

## Exemplo

O seguinte fragmento de gateway mantém conversas de suporte sob 32.000 tokens estimados e mantém apenas os três últimos resultados de ferramentas:

```json
{
  "contextMaximumSize": 32000,
  "contextOverflowAction": "Truncate",
  "toolContextCount": 3
}
```
