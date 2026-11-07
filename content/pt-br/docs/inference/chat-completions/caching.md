---
{title: Cache,linkTitle: Cache,weight: 60,group: Inference,sourceHash: 9f5f70c06f11811e,aliases: [/docs/pt-br/inference/chat-completions/caching.html]}
---

# Caching

Vários caches afetam uma solicitação de inferência. O cache de prompt reduz o custo da entrada que o provedor já processou. Outros caches permitem que a AIVAX reutilize descrições de mídia e definições remotas em vez de buscá-las ou processá-las novamente.

## Cache de prompt

Provedores que suportam cache de prompt reutilizam o processamento de um prefixo de solicitação idêntico. Os tokens de entrada em cache são cobrados à taxa de cache do modelo, que é inferior à sua taxa de entrada. As taxas por modelo estão listadas na página **Models** (Modelos) do painel e em `GET /v1/models`.

A resposta relata a entrada em cache separadamente:

```json
{
    "usage": {
        "prompt_tokens": 412,
        "completion_tokens": 96,
        "total_tokens": 4604,
        "prompt_tokens_details": {
            "cached_tokens": 4096
        }
    }
}
```

`prompt_tokens` conta apenas a entrada não em cache. Adicione `prompt_tokens_details.cached_tokens` a ele para obter o tamanho total da entrada.

Envie `prompt_cache_key` para agrupar solicitações que compartilham um prefixo, como as solicitações de um gateway ou de um usuário; a AIVAX encaminha esse valor ao provedor. Provedores que não o suportam ignoram-no.

### Mantenha o prefixo estável

O cache corresponde apenas a um prefixo idêntico, portanto, coloque conteúdo estável no início e conteúdo variável no final:

- Mantenha as instruções do sistema, definições de ferramentas e listas de habilidades inalteradas entre as solicitações. As instruções do gateway são um prefixo estável por padrão; fontes de instrução remota alteram isso sempre que seu conteúdo muda.
- Não coloque carimbos de data/hora, IDs de solicitação ou valores específicos do usuário nas instruções do sistema. Envie-os na última mensagem do usuário ou em `metadata`.
- Anexe novas mensagens ao final do histórico em vez de reescrever as anteriores. O [truncamento de contexto](/docs/pt-br/inference/ai-gateways/concepts.md#context-window-and-truncation) e o [truncamento de mensagens de ferramenta](/docs/pt-br/inference/ai-gateways/concepts.md#tool-message-truncation) reescrevem mensagens anteriores e reduzem as acertos do cache.
- Documentos RAG recuperados são inseridos na última mensagem do usuário, portanto, eles não quebram o prefixo das mensagens anteriores.

Para verificar a taxa de acerto do cache no seu próprio uso, consulte [por que a taxa de acerto do cache de prompt é baixa](https://aivax.net/blog/low-prompt-cache-hit-rate-prefix-breakers-compaction/).

## Resultados de pré-processamento multimodal

Os resultados do [pré-processamento multimodal](multimodal-pre-processing.md) são armazenados em cache por conteúdo e mecanismo. Quando a mesma mídia é resolvida novamente com o mesmo mecanismo, a AIVAX reutiliza a descrição e não cobra por ela novamente. Alterar o mecanismo processa e cobra pelo conteúdo novamente.

Isso é importante quando você reenvia o histórico completo: uma imagem anexada na primeira interação não é descrita novamente em cada interação posterior.

## Definições remotas

A AIVAX armazena em cache recursos que um gateway busca em seus servidores:

| Recurso | Cache padrão | Configurável |
| --- | --- | --- |
| [Fontes de instrução remota](/docs/pt-br/inference/chat-completions/processing-pipeline.md#instructions) | 600 segundos | 0 a 86.400 segundos por fonte |
| Listas de ferramentas [MCP](/docs/pt-br/tools/mcp.md), instruções do servidor e habilidades remotas | 600 segundos | `cacheDuration`, 0 a 86.400 segundos |
| [Fontes de funções de protocolo](/docs/pt-br/tools/protocol-functions.md) | 10 minutos | Não |

Uma falha na busca de uma fonte de instrução remota é armazenada em cache por no máximo 30 segundos, para que uma interrupção temporária seja resolvida rapidamente. Chamadas de ferramentas nunca são armazenadas em cache: toda chamada de ferramenta MCP ou função de protocolo chega ao seu servidor.

Reduza a duração do cache enquanto desenvolve uma fonte e aumente-a em produção para reduzir as solicitações ao seu servidor e a latência da primeira chamada.

## Estado da ferramenta no lado do servidor

As chamadas de ferramentas e os resultados das interações recentes no lado do servidor são mantidos por uma hora após o último uso, para que uma solicitação com o mesmo `conversation_token` possa restaurá-los. Este é um estado de conversa, não um cache de resposta: a AIVAX nunca retorna uma resposta armazenada para uma solicitação repetida. Consulte [Reutilização de sessão](session-reuse.md).
