---
{title: Limites de Inferência,linkTitle: Limites,weight: 140,group: Inference,sourceHash: d094183edcd91e31,aliases: [/docs/pt-br/inference/chat-completions/limits.html]}
---

# Limites de inferência

Esta página lista os limites aplicáveis às solicitações `chat/completions`. As taxas de solicitação e os limites do plano, em nível de conta, estão documentados em [Planos e limites](/docs/pt-br/limits.md).

## Limites de taxa

As solicitações contam para os limites do plano da conta para modelos integrados ou BYOK (Bring Your Own Key) e retornam `429 Too Many Requests` quando um limite é atingido. Consulte [Planos e limites](/docs/pt-br/limits.md).

## Janela de contexto

A janela de contexto é o tamanho máximo de entrada do modelo. Um gateway pode definir um limite inferior com `contextMaximumSize` e escolher o que acontece quando uma conversa excede esse limite; consulte [Truncamento de contexto](context-truncation.md).

No plano Gratuito, o contexto de entrada é limitado a 64.000 tokens, mesmo quando o modelo ou o gateway permite mais. As contagens de tokens para essa verificação são aproximadas e incluem instruções do sistema e definições de ferramentas.

## Fontes de instrução remotas

Cada resposta de fonte de instrução remota pode ter no máximo 5 MB. Consulte [Pipeline de processamento](processing-pipeline.md#instructions).

## Comprimento da saída

`max_completion_tokens` limita a saída gerada. `max_tokens` é aceito como um alias. Quando omitido, aplica-se o padrão do modelo.

## Token de conversa

- `conversation_token` aceita qualquer string não vazia com 128 caracteres ou menos.
- O estado das ferramentas no lado do servidor é mantido por uma hora após seu último uso.
- `idempotency_key` é um alias obsoleto; quando ambos são enviados, devem ter o mesmo valor.

Consulte [Reutilização de sessão](session-reuse.md).

## Saída estruturada

O JSON Healing faz 3 tentativas por padrão. `healing_options.max_attempts` aceita valores de 1 a 10. Consulte [JSON Healing](/docs/pt-br/inference/structured-responses/json-healing.md).

## Mídia

- Solicitações com arquivos ou vídeos exigem um saldo mínimo de conta mais alto do que solicitações com imagens ou áudio.
- URLs de mídia externa devem ser acessíveis sem autenticação. Aplicam-se limites de tamanho específicos do provedor.
- Vídeos grandes devem ser enviados por URL em vez de base64.

Consulte [Entrada e multimodalidade](input-and-multimodality.md#media-requirements).

## Duração da solicitação

Uma solicitação pode executar várias gerações e chamadas de ferramenta. Em `https://inference.aivax.net`, uma solicitação não streaming que excede o tempo limite do proxy retorna `524`. Use streaming ou envie solicitações longas para o host de inferência direto; consulte [Inferência de longa duração](concepts.md#long-running-inference).

## Chaves de API públicas

Chaves públicas são projetadas para código executado em um navegador. Com uma chave pública, `chat/completions`:

- aceita apenas o ID completo de um gateway em `model`, não slugs ou nomes de modelos integrados;
- aceita apenas estes campos de solicitação: `model`, `messages`, `prompt`, `temperature`, `top_p`, `top_k`, `seed`, `tools`, `reasoning_effort`, `max_completion_tokens`, `stream`, `conversation_token` e `idempotency_key`. Qualquer outro campo retorna `400 Bad Request`;
- não utiliza as fontes MCP do gateway, funções de protocolo, ferramentas embutidas, shell ou habilidades;
- aplica limites de taxa de solicitação e tokens por chave e por endereço remoto. Consulte [Chaves de API públicas](/docs/pt-br/limits.md#public-api-keys) para os valores.

Consulte [Autenticação](/docs/pt-br/authentication.md) antes de expor uma chave pública.
