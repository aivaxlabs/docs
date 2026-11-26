---
{title: Armazenamento em cache,linkTitle: Armazenamento em cache,weight: 60,group: Inference,sourceHash: 6d4014d078e0ce9a,aliases: [/docs/pt-br/inference/chat-completions/caching.html]}
---

# Caching

O caching de prompts reduz o custo das entradas que o provedor já processou. O AIVAX também armazena em cache descrições de mídia e definições remotas para que não sejam processadas ou buscadas novamente.

## Caching de prompts

Provedores que suportam caching de prompts reutilizam o processamento de um prefixo de solicitação idêntico. Os tokens de entrada em cache são cobrados à taxa de cache do modelo, que é inferior à sua taxa de entrada. As taxas por modelo estão listadas na página **Models** (Modelos) do painel e em `GET /v1/models`.

A resposta relata a parte em cache da entrada em `prompt_tokens_details.cached_tokens`:

```json
{
    "usage": {
        "prompt_tokens": 4508,
        "completion_tokens": 96,
        "total_tokens": 4604,
        "prompt_tokens_details": {
            "cached_tokens": 4096
        }
    }
}
```

`prompt_tokens` conta a entrada completa, incluindo a parte em cache relatada em `prompt_tokens_details.cached_tokens`. Subtraia `cached_tokens` dela para obter a entrada não em cache.

Envie `prompt_cache_key` para agrupar solicitações que compartilham um prefixo, como as solicitações de um gateway ou de um usuário; o AIVAX encaminha isso ao provedor. Provedores que não o suportam ignoram esse parâmetro.

### Mantenha o prefixo estável

O cache corresponde apenas a um prefixo idêntico, portanto, coloque conteúdo estável primeiro e conteúdo variável por último:

- Mantenha as instruções do sistema, definições de ferramentas e listas de habilidades inalteradas entre as solicitações. As instruções do gateway são um prefixo estável por padrão; fontes de instrução remota alteram isso sempre que seu conteúdo muda.
- Não coloque carimbos de data/hora, IDs de solicitação ou valores específicos do usuário nas instruções do sistema. Envie-os na última mensagem do usuário ou em `metadata`.
- Anexe novas mensagens ao final do histórico em vez de reescrever as anteriores. O [truncamento de contexto](/docs/pt-br/inference/ai-gateways/concepts.md#context-window-and-truncation) e o [truncamento de mensagens de ferramenta](/docs/pt-br/inference/ai-gateways/concepts.md#tool-message-truncation) reescrevem mensagens anteriores e reduzem as acertos no cache.
- Documentos RAG recuperados são inseridos na última mensagem do usuário, para que não quebrem o prefixo das mensagens anteriores.

Para entender uma baixa taxa de acerto no seu próprio uso, consulte [por que a taxa de acerto do cache de prompt é baixa](https://aivax.net/blog/low-prompt-cache-hit-rate-prefix-breakers-compaction/).

## Resultados do pré-processamento multimodal

Os resultados do [pré-processamento multimodal](multimodal-pre-processing.md) são armazenados em cache por conteúdo e mecanismo. Quando a mesma mídia é resolvida novamente com o mesmo mecanismo, o AIVAX reutiliza a descrição e não a cobra novamente. Alterar o mecanismo processa e cobra o conteúdo novamente.

Isso é importante quando você reenvia o histórico completo: uma imagem anexada na primeira interação não é descrita novamente em cada interação posterior.

## Definições remotas

O AIVAX armazena em cache os recursos que um gateway busca nos seus servidores:

| Recurso | Cache padrão | Configurável |
| --- | --- | --- |
| [Fontes de instrução remota](/docs/pt-br/inference/chat-completions/processing-pipeline.md#instructions) | 600 segundos | 0 a 86.400 segundos por fonte |
| Listas de ferramentas [MCP](/docs/pt-br/tools/mcp.md), instruções do servidor e habilidades remotas | 600 segundos | `cacheDuration`, 0 a 86.400 segundos |
| [Fontes de funções do protocolo](/docs/pt-br/tools/protocol-functions.md) | 10 minutos | Não |

Chamadas de ferramentas nunca são armazenadas em cache: toda chamada de ferramenta MCP ou função do protocolo chega ao seu servidor.

Reduza a duração do cache enquanto desenvolve uma fonte e aumente-a em produção para reduzir as solicitações ao seu servidor e a latência da primeira chamada.

## Estado da ferramenta no lado do servidor

As chamadas de ferramentas e os resultados das interações recentes no lado do servidor são mantidos por uma hora após o último uso, para que uma solicitação com o mesmo `conversation_token` possa restaurá-las. O AIVAX nunca retorna uma resposta armazenada para uma solicitação repetida. Consulte [Reutilização de sessão](session-reuse.md).
