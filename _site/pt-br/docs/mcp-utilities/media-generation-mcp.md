Source: http://localhost:1313/pt-br/docs/mcp-utilities/media-generation-mcp.html

# Geração de mídia MCP

O MCP de geração de mídia expõe a geração de imagens e de fala (texto‑para‑fala) da AIVAX para qualquer cliente compatível com MCP. Use‑o quando um agente, IDE, assistente de desktop ou ambiente de automação precisar criar imagens ou áudio falado sem chamar as APIs de geração diretamente ou executar uma inferência de modelo AIVAX.

A AIVAX hospeda este servidor MCP e realiza as gerações para a conta autenticada. As ferramentas usam os mesmos modelos, faturamento e limites aplicáveis que a [Image Generation](http://localhost:1313/pt-br/docs/generations/images.md) e a [Speech Generation](http://localhost:1313/pt-br/docs/generations/speech.md).

## Endpoint

```text
https://inference.aivax.net/v1/mcp/media-generation
```

O servidor usa HTTP Streamable. Autentique as requisições com uma chave de API da conta:

```text
Authorization: Bearer <AIVAX_API_KEY>
```

Para tipos de chave e opções de autenticação, veja [Authentication](http://localhost:1313/pt-br/docs/authentication.md).

## Exemplo de configuração

A forma exata da configuração depende do cliente MCP. O exemplo a seguir habilita todas as ferramentas:

```json
{
  "servers": {
    "aivax-media": {
      "type": "http",
      "url": "https://inference.aivax.net/v1/mcp/media-generation",
      "headers": {
        "Authorization": "Bearer <AIVAX_API_KEY>",
        "X-Mcp-Enabled-Tools": "list_models, generate_image, generate_speech"
      }
    }
  }
}
```

Após a conexão do cliente, ele pode descobrir e chamar as ferramentas habilitadas através dos métodos padrão `tools/list` e `tools/call` do MCP.

## Selecione quais ferramentas são expostas

Use o cabeçalho de requisição opcional `X-Mcp-Enabled-Tools` para controlar quais ferramentas o servidor expõe a esse cliente. Forneça uma lista separada por vírgulas contendo qualquer um dos valores `list_models`, `generate_image` e `generate_speech`.

Expose apenas geração de imagens:

```text
X-Mcp-Enabled-Tools: list_models, generate_image
```

Expose apenas geração de fala:

```text
X-Mcp-Enabled-Tools: list_models, generate_speech
```

Os nomes das ferramentas não diferenciam maiúsculas de minúsculas, e espaços ao redor dos valores separados por vírgula são ignorados.

- Se o cabeçalho for omitido, todas as ferramentas são expostas.
- Se o cabeçalho listar ferramentas reconhecidas, somente essas ferramentas são expostas.
- Se o cabeçalho estiver vazio ou não conter nomes de ferramentas reconhecidas, nenhuma ferramenta será exposta.

Mantenha `list_models` habilitado junto com uma ferramenta de geração para que o agente possa descobrir nomes de modelos válidos em vez de adivinhá‑los. Como a descoberta de ferramentas pode ser armazenada em cache pelo cliente MCP, reconecte ou atualize o servidor após alterar esse cabeçalho.

## Ferramentas

### `list_models`

Lista os modelos disponíveis para geração de imagens ou fala, incluindo a descrição e o preço de cada modelo. Modelos de imagem também indicam se aceitam imagens de referência. Modelos de imagem obsoletos não são listados.

Entrada:

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `type` | string | Sim | `image` para listar modelos de geração de imagens, ou `audio` para listar modelos de geração de fala. |

Argumentos de exemplo:

```json
{
  "type": "audio"
}
```

A ferramenta devolve a lista de modelos como texto MCP. Use o nome do modelo retornado como argumento `model` da ferramenta de geração correspondente. Chamar esta ferramenta não tem custo.

### `generate_image`

Gera de uma a quatro imagens a partir de um prompt e devolve suas URLs.

Entrada:

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `prompt` | string | Sim | Descrição não vazia da imagem a ser gerada. |
| `model` | string | Sim | Nome de um modelo de imagem retornado por `list_models` com `type` definido como `image`. Não diferencia maiúsculas de minúsculas. |
| `count` | integer | Não | Quantas imagens gerar, de 1 a 4. O padrão é 1. |
| `reference_images` | array de strings | Não | Até quatro URLs públicas HTTP(S) de imagens que guiam o resultado. Aceito apenas por modelos que suportam imagens de referência. |

Argumentos de exemplo:

```json
{
  "prompt": "A flat illustration of a lighthouse at dusk, warm palette, no text",
  "model": "<IMAGE_MODEL_NAME>",
  "count": 2
}
```

A ferramenta devolve as URLs das imagens geradas como texto MCP. As URLs são de acesso público, portanto quem as tem pode abrir a imagem. Baixe e armazene as imagens se seu fluxo de trabalho precisar mantê‑las sob seu próprio controle de acesso.

Para orientação de prompt e comportamento de imagens de referência, veja [Image Generation](http://localhost:1313/pt-br/docs/generations/images.md).

### `generate_speech`

Sintetiza fala a partir de texto e devolve a URL do áudio MP3 gerado.

Entrada:

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `input` | string | Sim | Texto não vazio a ser sintetizado. |
| `model` | string | Sim | Nome de um modelo de fala retornado por `list_models` com `type` definido como `audio`. Não diferencia maiúsculas de minúsculas. |
| `voice` | string | Não | Uma voz suportada pelo modelo selecionado. A voz padrão do modelo é usada quando omitida. |
| `instructions` | string | Não | Orientação sobre tom, emoção ou ritmo para a fala gerada. |

Argumentos de exemplo:

```json
{
  "input": "Your order has shipped and should arrive on Thursday.",
  "model": "<SPEECH_MODEL_NAME>",
  "instructions": "Friendly and calm, moderate pace."
}
```

A ferramenta devolve a URL do áudio MP3 como texto MCP. A URL é pública, então quem a possui pode reproduzir o áudio. Ao contrário da API de geração de fala, esta ferramenta não devolve o áudio embutido nem oferece outros formatos de saída; converta o arquivo baixado se seu fluxo de trabalho precisar de WAV ou OGG.

As vozes variam por modelo de fala. Para seleção de voz e orientação de preparação de texto, veja [Speech Generation](http://localhost:1313/pt-br/docs/generations/speech.md).

## Preços e limites

Chamadas de geração usam o mesmo preço da [Image Generation](http://localhost:1313/pt-br/docs/generations/images.md) e da [Speech Generation](http://localhost:1313/pt-br/docs/generations/speech.md) e são cobradas na conta autenticada. Consulte [Pricing](http://localhost:1313/pt-br/docs/pricing.md) para taxas atuais e regras de faturamento.

As gerações estão sujeitas aos limites de serviço e taxas de conta da conta. Consulte [Plans and Limits](http://localhost:1313/pt-br/docs/limits.md) para limites atuais e comportamento de aplicação.

Um saldo de conta positivo é necessário para usar essas ferramentas.

## Orientações de segurança

Use o MCP apenas a partir de clientes confiáveis e mantenha a chave de API no armazenamento seguro do cliente. Não coloque a chave em controle de versão, código do lado do navegador, prompts compartilhados ou logs.

As URLs de mídia gerada são públicas. Não gere imagens ou áudios contendo informações pessoais, confidenciais ou sensíveis, a menos que o fluxo de trabalho leve em conta essa exposição. Revise os ativos gerados quanto à precisão e adequação antes de publicá‑los.
