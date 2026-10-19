Source: https://docs.aivax.net/pt-br/docs/mcp-utilities/media-generation-mcp.html

# Geração de mídia MCP

O MCP de geração de mídia expõe a geração de imagens e a geração de fala (texto‑para‑fala) da AIVAX a qualquer cliente compatível com MCP. Use‑o quando um agente, IDE, assistente de desktop ou ambiente de automação precisar criar imagens ou áudio falado sem chamar as APIs de geração diretamente ou executar uma inferência de modelo AIVAX.

A AIVAX hospeda este servidor MCP e realiza as gerações para a conta autenticada. As ferramentas usam os mesmos modelos, faturamento e limites aplicáveis que [Image Generation](https://docs.aivax.net/pt-br/docs/generations/images.md) e [Speech Generation](https://docs.aivax.net/pt-br/docs/generations/speech.md).

## Endpoint

```text
https://inference.aivax.net/v1/mcp/media-generation
```

O servidor usa HTTP transmissível. Autentique as solicitações com uma chave de API da conta:

```text
Authorization: Bearer <AIVAX_API_KEY>
```

Para tipos de chave e opções de autenticação, veja [Authentication](https://docs.aivax.net/pt-br/docs/authentication.md).

## Configuration example

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

Após o cliente conectar, ele pode descobrir e chamar as ferramentas habilitadas através dos métodos padrão MCP `tools/list` e `tools/call`.

## Select which tools are exposed

Use o cabeçalho de solicitação opcional `X-Mcp-Enabled-Tools` para controlar quais ferramentas o servidor expõe a esse cliente. Forneça uma lista de permissões separada por vírgulas contendo qualquer um de `list_models`, `generate_image` e `generate_speech`.

Expor apenas geração de imagem:

```text
X-Mcp-Enabled-Tools: list_models, generate_image
```

Expor apenas geração de fala:

```text
X-Mcp-Enabled-Tools: list_models, generate_speech
```

Os nomes das ferramentas não diferenciam maiúsculas de minúsculas, e espaços ao redor de valores separados por vírgulas são ignorados.

- Se o cabeçalho for omitido, todas as ferramentas são expostas.
- Se o cabeçalho listar ferramentas reconhecidas, apenas essas ferramentas são expostas.
- Se o cabeçalho estiver vazio ou não contiver nomes de ferramentas reconhecidas, nenhuma ferramenta será exposta.

Mantenha `list_models` habilitado junto com uma ferramenta de geração para que o agente possa descobrir nomes de modelo válidos em vez de adivinhá‑los. Como a descoberta de ferramentas pode ser armazenada em cache pelo cliente MCP, reconecte ou atualize o servidor após alterar este cabeçalho.

## Tools

### `list_models`

Lista os modelos disponíveis para geração de imagem ou geração de fala, incluindo a descrição e o preço de cada modelo. Modelos de imagem também indicam se aceitam imagens de referência. Modelos de imagem depreciados não são listados.

| Campo   | Tipo   | Obrigatório | Descrição |
| ------- | ------ | ----------- | --------- |
| `type`  | string | Sim         | `image` para listar modelos de geração de imagem, ou `audio` para listar modelos de geração de fala. |

Exemplo de argumentos:

```json
{
  "type": "audio"
}
```

A ferramenta retorna a lista de modelos como texto MCP. Use o nome do modelo retornado como argumento `model` da ferramenta de geração correspondente. Chamar esta ferramenta não tem custo.

### `generate_image`

Gera de uma a quatro imagens a partir de um prompt e retorna seus URLs.

| Campo            | Tipo            | Obrigatório | Descrição |
| ---------------- | --------------- | ----------- | --------- |
| `prompt`         | string          | Sim         | Descrição não vazia da imagem a ser gerada. |
| `model`          | string          | Sim         | Um nome de modelo de imagem retornado por `list_models` com `type` definido como `image`. Não diferencia maiúsculas de minúsculas. |
| `count`          | integer         | Não         | Quantas imagens gerar, de 1 a 4. O padrão é 1. |
| `reference_images` | array of strings | Não     | Até quatro URLs de imagens HTTP(S) públicas que orientam o resultado. Aceito apenas por modelos que suportam imagens de referência. |

Exemplo de argumentos:

```json
{
  "prompt": "A flat illustration of a lighthouse at dusk, warm palette, no text",
  "model": "<IMAGE_MODEL_NAME>",
  "count": 2
}
```

A ferramenta retorna as URLs das imagens geradas como texto MCP. As URLs são publicamente acessíveis, portanto qualquer pessoa com a URL pode abrir a imagem. Baixe e armazene as imagens se seu fluxo de trabalho precisar mantê‑las sob seu próprio controle de acesso.

Para orientação de prompt e comportamento de imagem de referência, veja [Image Generation](https://docs.aivax.net/pt-br/docs/generations/images.md).

### `generate_speech`

Sintetiza fala a partir de texto e retorna a URL do áudio MP3 gerado.

| Campo          | Tipo   | Obrigatório | Descrição |
|  | ------ | ----------- | --------- |
| `input`        | string | Sim         | O texto não vazio a ser sintetizado. |
| `model`        | string | Sim         | Um nome de modelo de fala retornado por `list_models` com `type` definido como `audio`. Não diferencia maiúsculas de minúsculas. |
| `voice`        | string | Não         | Uma voz suportada pelo modelo selecionado. A voz padrão do modelo é usada quando omitida. |
| `instructions` | string | Não         | Orientação sobre tom, emoção ou ritmo para a fala gerada. |

Exemplo de argumentos:

```json
{
  "input": "Your order has shipped and should arrive on Thursday.",
  "model": "<SPEECH_MODEL_NAME>",
  "instructions": "Friendly and calm, moderate pace."
}
```

A ferramenta retorna a URL do áudio MP3 como texto MCP. A URL é publicamente acessível, portanto quem a possuir pode reproduzir o áudio. Diferente da API de geração de fala, esta ferramenta não retorna o áudio embutido e não oferece outros formatos de saída; converta o arquivo baixado se seu fluxo de trabalho precisar de WAV ou OGG.

As vozes variam por modelo de fala. Para seleção de voz e orientação de preparação de texto, veja [Speech Generation](https://docs.aivax.net/pt-br/docs/generations/speech.md).

## Pricing and limits

Chamadas de geração utilizam o mesmo preço e cotas que [Image Generation](https://docs.aivax.net/pt-br/docs/generations/images.md#pricing-limits-and-errors) e [Speech Generation](https://docs.aivax.net/pt-br/docs/generations/speech.md#pricing-limits-and-errors) e são cobradas na conta autenticada. Para regras gerais de faturamento, veja [Pricing](https://docs.aivax.net/pt-br/docs/pricing.md).

É necessário saldo positivo na conta para usar essas ferramentas.

## Security guidance

Use o MCP apenas de clientes confiáveis e mantenha a chave de API no armazenamento seguro de segredos do cliente. Não coloque a chave no controle de versão, código do lado do navegador, prompts compartilhados ou logs.

As URLs de mídia geradas são públicas. Não gere imagens ou áudios contendo informações pessoais, confidenciais ou sensíveis, a menos que o fluxo de trabalho leve isso em conta. Revise os ativos gerados quanto à precisão e adequação antes de publicá‑los.
