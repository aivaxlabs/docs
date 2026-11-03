Source: https://docs.aivax.net/pt-br/docs/mcp-utilities/media-generation-mcp.html

# Geração de mídia MCP

O MCP de geração de mídia expõe a geração de imagens e a geração de fala (texto para fala) do AIVAX a qualquer cliente compatível com MCP. Utilize-o quando um agente, IDE, assistente de desktop ou ambiente de automação precisar criar imagens ou áudio falado sem chamar as APIs de geração diretamente ou executar inferência de modelos do AIVAX.

O AIVAX hospeda este servidor MCP e realiza as gerações para a conta autenticada. As ferramentas utilizam os mesmos modelos, cobrança e limites aplicáveis que [Geração de Imagens](https://docs.aivax.net/pt-br/docs/generations/images.md) e [Geração de Fala](https://docs.aivax.net/pt-br/docs/generations/speech.md).

## Endpoint

```text
https://inference.aivax.net/v1/mcp/media-generation
```

O servidor utiliza HTTP Streamable. Autentique as solicitações com uma chave de API da conta:

```text
Authorization: Bearer <AIVAX_API_KEY>
```

Para tipos de chaves e opções de autenticação, consulte [Autenticação](https://docs.aivax.net/pt-br/docs/authentication.md).

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

Após o cliente se conectar, ele pode descobrir e chamar as ferramentas habilitadas por meio dos métodos padrão `tools/list` e `tools/call` do MCP.

## Selecione quais ferramentas são expostas

Use o cabeçalho de solicitação opcional `X-Mcp-Enabled-Tools` para controlar quais ferramentas o servidor expõe ao cliente. Forneça uma lista de permissão separada por vírgulas contendo qualquer uma das seguintes: `list_models`, `generate_image` e `generate_speech`.

Expor apenas geração de imagens:

```text
X-Mcp-Enabled-Tools: list_models, generate_image
```

Expor apenas geração de fala:

```text
X-Mcp-Enabled-Tools: list_models, generate_speech
```

Os nomes das ferramentas não diferenciam maiúsculas de minúsculas, e os espaços ao redor dos valores separados por vírgula são ignorados.

- Se o cabeçalho for omitido, todas as ferramentas serão expostas.
- Se o cabeçalho listar ferramentas reconhecidas, apenas essas ferramentas serão expostas.
- Se o cabeçalho estiver vazio ou não contiver nomes de ferramentas reconhecidas, nenhuma ferramenta será exposta.

Mantenha `list_models` habilitado junto com uma ferramenta de geração para que o agente possa descobrir os nomes válidos dos modelos em vez de adivinhá-los. Como a descoberta de ferramentas pode ser armazenada em cache pelo cliente MCP, reconecte ou atualize o servidor após alterar este cabeçalho.

## Ferramentas

### `list_models`

Lista os modelos disponíveis para geração de imagens ou geração de fala, incluindo a descrição e o preço de cada modelo. Os modelos de imagem também indicam se aceitam imagens de referência. Modelos de imagem obsoletos não são listados.

Entrada:

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `type` | string | Sim | `image` para listar modelos de geração de imagens, ou `audio` para listar modelos de geração de fala. |

Exemplo de argumentos:

```json
{
  "type": "audio"
}
```

A ferramenta retorna a lista de modelos como texto MCP. Use o nome do modelo retornado como o argumento `model` da ferramenta de geração correspondente. Chamar esta ferramenta não tem custo.

### `generate_image`

Gera de uma a quatro imagens a partir de um prompt e retorna seus URLs.

Entrada:

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `prompt` | string | Sim | Uma descrição não vazia da imagem a ser gerada. |
| `model` | string | Sim | Um nome de modelo de imagem retornado por `list_models` com `type` definido como `image`. Não diferencia maiúsculas de minúsculas. |
| `count` | integer | Não | Quantas imagens gerar, de 1 a 4. O padrão é 1. |
| `reference_images` | array de strings | Não | Até quatro URLs de imagens públicas HTTP(S) que orientam o resultado. Aceitas apenas por modelos que suportam imagens de referência. |
| `size` | string | Não | Tamanho de saída no formato `<largura>x<altura>`, como `1024x1024`. Cada lado varia de 64 a 4096 pixels. O padrão é 1080x1920. |
| `format` | string | Não | `png`, `jpeg` ou `webp`. O padrão é o formato produzido pelo modelo. |
| `quality` | integer | Não | Qualidade de codificação de 1 a 100 para `jpeg` e `webp`. |

Exemplo de argumentos:

```json
{
  "prompt": "Uma ilustração plana de um farol ao entardecer, paleta quente, sem texto",
  "model": "<NOME_DO_MODELO_DE_IMAGEM>",
  "count": 2
}
```

A ferramenta retorna texto MCP com o URL e o custo de cada imagem gerada, o erro de cada imagem falhada e o custo total. Imagens falhas não são cobradas. Os URLs são publicamente acessíveis, portanto, qualquer pessoa com um URL pode abrir a imagem. Baixe e armazene as imagens se seu fluxo de trabalho precisar mantê-las sob seu próprio controle de acesso.

Para orientação sobre prompts e comportamento de imagens de referência, consulte [Geração de Imagens](https://docs.aivax.net/pt-br/docs/generations/images.md).

### `generate_speech`

Sintetiza fala a partir de texto e retorna o URL do áudio MP3 gerado.

Entrada:

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `input` | string | Sim | O texto não vazio a ser sintetizado. |
| `model` | string | Sim | Um nome de modelo de fala retornado por `list_models` com `type` definido como `audio`. Não diferencia maiúsculas de minúsculas. |
| `voice` | string | Não | Uma voz suportada pelo modelo selecionado. A voz padrão do modelo é usada quando omitida. |
| `instructions` | string | Não | Orientações sobre tom, emoção ou ritmo para a fala gerada. |

Exemplo de argumentos:

```json
{
  "input": "Seu pedido foi enviado e deve chegar na quinta-feira.",
  "model": "<NOME_DO_MODELO_DE_FALA>",
  "instructions": "Amigável e calmo, ritmo moderado."
}
```

A ferramenta retorna o URL do áudio MP3 como texto MCP. O URL é publicamente acessível, portanto, qualquer pessoa com ele pode reproduzir o áudio. Diferentemente da API de Geração de Fala, esta ferramenta não retorna o áudio inline e não oferece outros formatos de saída; converta o arquivo baixado se seu fluxo de trabalho precisar de WAV ou OGG.

As vozes variam por modelo de fala. Para orientação sobre seleção de vozes e preparação de texto, consulte [Geração de Fala](https://docs.aivax.net/pt-br/docs/generations/speech.md).

## Preços e limites

As chamadas de geração utilizam os mesmos preços e cotas que [Geração de Imagens](https://docs.aivax.net/pt-br/docs/generations/images.md#pricing-limits-and-errors) e [Geração de Fala](https://docs.aivax.net/pt-br/docs/generations/speech.md#pricing-limits-and-errors) e são cobradas na conta autenticada. Para regras gerais de faturamento, consulte [Preços](https://docs.aivax.net/pt-br/docs/pricing.md).

É necessário um saldo positivo na conta para usar essas ferramentas.

## Orientações de segurança

Utilize o MCP apenas de clientes confiáveis e mantenha a chave de API no armazenamento seguro de segredos do cliente. Não coloque a chave no controle de origem, código do lado do navegador, prompts compartilhados ou logs.

Os URLs de mídia gerada são públicos. Não gere imagens ou áudio contendo informações pessoais, confidenciais ou sensíveis, a menos que o fluxo de trabalho leve essa exposição em consideração. Revise os ativos gerados quanto à precisão e adequação antes de publicá-los.
