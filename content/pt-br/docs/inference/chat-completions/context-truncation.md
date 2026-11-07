---
{title: Truncamento de Contexto,linkTitle: Truncamento de contexto,weight: 134,group: Inference,sourceHash: 9a1df6cc1a7f6f0f,aliases: [/docs/pt-br/inference/chat-completions/context-truncation.html]}
---

# Truncamento de contexto

O truncamento de contexto mantém conversas longas dentro de um tamanho máximo de entrada. Um Gateway de IA pode limitar a entrada com `contextMaximumSize`, escolher o que acontece quando uma conversa excede esse limite com `contextOverflowAction` e encurtar resultados antigos de ferramentas com `toolContextCount`. Configure-os em **Gerenciamento da janela de contexto** no editor do gateway ou nos parâmetros do gateway.

Estas são configurações do gateway; as solicitações não podem substituí-las. Seu aplicativo ainda envia todo o histórico que armazena, e o truncamento altera apenas o que o modelo recebe para essa solicitação.

## Tamanho máximo do contexto

`contextMaximumSize` é o número aproximado máximo de tokens de entrada enviados ao modelo. Quando não está definido, a AIVAX não limita a entrada, e a solicitação falha apenas se exceder a própria janela de contexto do modelo.

O tamanho é uma estimativa, não a contagem de tokens do provedor. Inclui:

- Mensagens da conversa, incluindo documentos inseridos por [RAG](processing-pipeline.md#rag).
- Instruções do sistema.
- Definições de ferramentas, incluindo ferramentas do lado do servidor.
- O esquema de resposta, quando um é solicitado.

Como a estimativa pode diferir do tokenizador do provedor, defina `contextMaximumSize` abaixo da janela de contexto real do modelo para deixar uma margem, especialmente para conversas com muitos recursos multimídia.

No plano Gratuito, o contexto de entrada é limitado a 64.000 tokens, mesmo quando o modelo ou o gateway permitem mais. Consulte [Limites](limits.md#context-window).

## Ações de estouro

Quando a entrada estimada excede o limite, o gateway segue `contextOverflowAction`:

| Ação | Comportamento | Quando usar |
| --- | --- | --- |
| `Throw` (padrão) | Retorna um erro em vez de chamar o modelo. | Cada mensagem é importante, como em uma revisão de documento, para que o aplicativo decida o que remover. |
| `Truncate` | Remove as mensagens mais antigas da conversa até que elas se encaixem, depois continua, mesmo que o prompt completo ainda exceda o limite. | Conversas de longa duração nas quais os turnos anteriores perdem relevância, como conversas de suporte. |
| `TruncateHard` | Trunca como `Truncate`, depois retorna um erro se o prompt completo ainda exceder o limite. | Você deseja o truncamento, mas nunca uma solicitação maior que o limite. |

O editor do gateway oferece `Throw` e `Truncate`; defina `TruncateHard` por meio da API.

### Como o truncamento remove mensagens

`Truncate` e `TruncateHard` removem mensagens do início da conversa, uma de cada vez:

- As mensagens do sistema nunca são removidas.
- A última mensagem restante do usuário nunca é removida, para que o modelo sempre receba a solicitação atual.
- Resultados de ferramentas cuja chamada de ferramenta foi removida também são removidos, para que a conversa permaneça válida para o provedor.
- As mensagens são removidas até que as mensagens da conversa se encaixem no limite. Instruções do sistema, documentos RAG recuperados e definições de ferramentas não são contados nesta etapa, portanto, com `Truncate`, o prompt completo ainda pode exceder o limite. `TruncateHard` mede o prompt completo novamente e falha se ele não se encaixar.

O truncamento não resume as mensagens removidas. Quando o modelo precisa de fatos dos turnos iniciais, mantenha-os nas instruções do sistema, em uma [coleção](/docs/pt-br/rag/collections.md) ou em [memórias](/docs/pt-br/tools/builtin-tools.md).

### Quando a verificação é executada

A verificação é executada antes de toda geração de modelo de uma solicitação, não apenas uma vez. Em uma solicitação agêntica, um resultado grande de ferramenta pode fazer com que a conversa exceda o limite após algumas ferramentas já terem sido executadas. Com `Throw`, a solicitação falha nesse ponto; com `Truncate`, as mensagens mais antigas são removidas e o loop continua. Consulte [Pipeline de processamento](processing-pipeline.md) para saber onde a verificação é executada em relação às outras etapas.

A verificação usa a conversa antes do [pré-processamento multimodal](multimodal-pre-processing.md), então a mídia conta pelo seu tamanho original estimado, não pelo tamanho de sua descrição textual.

## Truncamento de mensagens de ferramenta

`toolContextCount` controla quantas mensagens recentes de resposta de ferramenta mantêm seu conteúdo original. Quando definido com um valor maior que zero, as mensagens de ferramenta mais antigas permanecem na conversa, mas seu conteúdo é substituído por:

```text
[resposta da ferramenta truncada - chame esta ferramenta novamente]
```

Isso se aplica a todos os resultados de ferramentas enviados ao modelo, incluindo resultados de [ferramentas do lado do cliente](tools.md) e ferramentas do lado do servidor. Isso reduz o uso de contexto em conversas agênticas longas cujas ferramentas retornam grandes payloads que são relevantes apenas uma vez, como resultados de pesquisa. Evite isso quando um resultado de ferramenta inicial permanece importante posteriormente e use-o apenas quando o modelo puder chamar a ferramenta novamente com segurança.

Reescrever mensagens de ferramenta mais antigas também altera o prefixo da solicitação, o que pode reduzir a taxa de acerto do [cache de prompts](caching.md); para verificar isso no seu próprio uso, consulte [por que a taxa de acerto do cache de prompts é baixa](https://aivax.net/blog/low-prompt-cache-hit-rate-prefix-breakers-compaction/).

## Exemplo

O seguinte fragmento de gateway mantém conversas de suporte abaixo de 32.000 tokens estimados e mantém apenas os três últimos resultados de ferramentas:

```json
{
  "contextMaximumSize": 32000,
  "contextOverflowAction": "Truncate",
  "toolContextCount": 3
}
```
