Source: https://docs.aivax.net/pt-br/docs/inference/chat-completions/caching.html

# Caching

Vários caches afetam uma solicitação de inferência. O cache de prompt reduz o custo da entrada que o provedor já processou. Outros caches permitem que a AIVAX reutilize descrições de mídia e definições remotas em vez de buscá-las ou processá-las novamente.

## Cache de prompt

Provedores que suportam cache de prompt reutilizam o processamento de um prefixo de solicitação idêntico. Os tokens de entrada em cache são cobrados à taxa de cache do modelo, que é inferior à sua taxa de entrada. As taxas por modelo estão listadas na página **Models** do painel e em `GET /v1/models`.

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

Envie `prompt_cache_key` para agrupar solicitações que compartilham um prefixo, como as solicitações de um gateway ou de um usuário; a AIVAX o encaminha ao provedor. Provedores que não o suportam ignoram-no.

Quando a AIVAX chama um provedor por meio da API Responses, as mensagens do sistema e do desenvolvedor vão no início de `input`, portanto, permanecem em cache no GPT-6.2, onde `instructions` de nível superior nunca é armazenado em cache. Veja [por que a taxa de acerto do cache de prompt é baixa](https://aivax.net/blog/low-prompt-cache-hit-rate-prefix-breakers-compaction/).

### Mantenha o prefixo estável

O cache corresponde apenas a um prefixo idêntico, portanto, coloque conteúdo estável primeiro e conteúdo variável por último:

- Mantenha as instruções do sistema, definições de ferramentas e listas de habilidades inalteradas entre as solicitações. As instruções do gateway são um prefixo estável por padrão; fontes de instrução remota alteram-no sempre que seu conteúdo muda.
- Não coloque carimbos de data/hora, IDs de solicitação ou valores específicos do usuário nas instruções do sistema. Envie-os na mensagem mais recente do usuário ou em `metadata`.
- Anexe novas mensagens ao final do histórico em vez de reescrever as anteriores. [Truncamento de contexto](https://docs.aivax.net/pt-br/docs/inference/ai-gateways/concepts.md#context-window-and-truncation) e [truncamento de mensagens de ferramenta](https://docs.aivax.net/pt-br/docs/inference/ai-gateways/concepts.md#tool-message-truncation) reescrevem mensagens anteriores e reduzem os acertos do cache.
- Documentos RAG recuperados são inseridos na mensagem mais recente do usuário, portanto, eles não quebram o prefixo das mensagens anteriores.

Para verificar a taxa de acerto no seu próprio uso, consulte [por que a taxa de acerto do cache de prompt é baixa](https://aivax.net/blog/low-prompt-cache-hit-rate-prefix-breakers-compaction/).

## Resultados de pré-processamento multimodal

Os resultados do [pré-processamento multimodal](https://docs.aivax.net/pt-br/docs/inference/chat-completions/multimodal-pre-processing.md) são armazenados em cache por conteúdo e mecanismo. Quando a mesma mídia é resolvida novamente com o mesmo mecanismo, a AIVAX reutiliza a descrição e não a cobra novamente. Alterar o mecanismo processa e cobra o conteúdo novamente.

Isso importa quando você reenvia o histórico completo: uma imagem anexada na primeira interação não é descrita novamente em cada interação posterior.

## Definições remotas

A AIVAX armazena em cache recursos que um gateway busca em seus servidores:

| Recurso | Cache padrão | Configurável |
| --- | --- | --- |
| [Fontes de instrução remota](https://docs.aivax.net/pt-br/docs/inference/chat-completions/processing-pipeline.md#instructions) | 600 segundos | 0 a 86.400 segundos por fonte |
| Listas de ferramentas [MCP](https://docs.aivax.net/pt-br/docs/tools/mcp.md), instruções do servidor e habilidades remotas | 600 segundos | `cacheDuration`, 0 a 86.400 segundos |
| [Fontes de função de protocolo](https://docs.aivax.net/pt-br/docs/tools/protocol-functions.md) | 10 minutos | Não |

Uma falha na busca de uma fonte de instrução remota é armazenada em cache por no máximo 30 segundos, para que uma interrupção temporária seja resolvida rapidamente. Chamadas de ferramentas nunca são armazenadas em cache: toda chamada de ferramenta MCP ou função de protocolo atinge seu servidor.

Reduza a duração do cache enquanto desenvolve uma fonte e aumente-a em produção para reduzir as solicitações ao seu servidor e a latência da primeira chamada.

## Estado da ferramenta no lado do servidor

As chamadas de ferramentas e os resultados das interações recentes mantidos no lado do servidor são preservados por uma hora após seu último uso, para que uma solicitação com o mesmo `conversation_token` possa restaurá-los. Este é um estado de conversa, não um cache de resposta: a AIVAX nunca retorna uma resposta armazenada para uma solicitação repetida. Consulte [Reutilização de sessão](https://docs.aivax.net/pt-br/docs/inference/chat-completions/session-reuse.md).
