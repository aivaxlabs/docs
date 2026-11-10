Source: https://docs.aivax.net/pt-br/docs/mcp-utilities/media-generation-mcp.html

# Geração de mídia MCP

O MCP de geração de mídia oferece a um cliente MCP hospedado geração de imagens e geração de fala (texto-para-fala). Utilize-o quando um agente, IDE, assistente de desktop ou ambiente de automação precisar criar imagens ou áudio falado sem chamar as APIs de geração diretamente ou executar inferência de modelo AIVAX.

A AIVAX hospeda este servidor MCP e realiza as gerações para a conta autenticada. As ferramentas utilizam os mesmos modelos, faturamento e limites aplicáveis que [Geração de Imagens](https://docs.aivax.net/pt-br/docs/generations/images.md) e [Geração de Fala](https://docs.aivax.net/pt-br/docs/generations/speech.md).

Com as ferramentas habilitadas, um cliente pode:

- listar modelos disponíveis de imagem ou fala;
- gerar de uma a quatro imagens a partir de um prompt;
- sintetizar fala e receber uma URL MP3.

## Endpoint

Este é o endereço HTTP Streamable para o MCP de geração de mídia. Aponte um cliente MCP confiável aqui quando ele precisar criar imagens ou fala para uma conta AIVAX.

```text
https://inference.aivax.net/v1/mcp/media-generation
```

Autentique as solicitações com uma chave de API da conta:

```text
Authorization: Bearer <AIVAX_API_KEY>
```

Para tipos de chave e opções de autenticação, consulte [Autenticação](https://docs.aivax.net/pt-br/docs/authentication.md).

## Exemplo de configuração

A configuração do cliente informa ao cliente MCP onde se conectar e quais ferramentas habilitar. A estrutura exata depende do cliente; para Claude Code, consulte [como gerar imagens no Claude Code com este MCP](https://aivax.net/blog/generate-images-and-speech-from-claude-code-with-mcp/). Use o exemplo a seguir quando o cliente deve ver todas as ferramentas:

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

Após a conexão do cliente, ele pode descobrir e chamar as ferramentas habilitadas por meio dos métodos padrão `tools/list` e `tools/call` do MCP.

## Selecionar quais ferramentas são expostas

`X-Mcp-Enabled-Tools` é um cabeçalho de solicitação opcional. Utilize-o quando um cliente deve ver apenas geração de imagens, apenas geração de fala ou um conjunto menor de ferramentas.

Forneça uma lista de permissão separada por vírgulas contendo qualquer uma das seguintes: `list_models`, `generate_image` e `generate_speech`.

Expor apenas geração de imagens:

```text
X-Mcp-Enabled-Tools: list_models, generate_image
```

Expor apenas geração de fala:

```text
X-Mcp-Enabled-Tools: list_models, generate_speech
```

O servidor lê o cabeçalho da seguinte forma:

- Os nomes das ferramentas não diferenciam maiúsculas de minúsculas.
- Espaços em torno dos valores separados por vírgula são ignorados.
- Se o cabeçalho for omitido, todas as ferramentas serão expostas.
- Se o cabeçalho listar ferramentas reconhecidas, apenas essas ferramentas serão expostas.
- Se o cabeçalho estiver vazio ou não contiver nomes de ferramentas reconhecidos, nenhuma ferramenta será exposta.

Mantenha `list_models` habilitado junto com uma ferramenta de geração. O agente pode então descobrir nomes de modelos válidos em vez de adivinhá-los. Clientes MCP podem armazenar em cache a descoberta de ferramentas, portanto, reconecte ou atualize o servidor após alterar este cabeçalho.

## Ferramentas

Estas são as operações que o servidor pode expor. Chame uma delas quando o cliente precisar de uma lista de modelos, uma imagem ou áudio falado.

### `list_models`

`list_models` lista os modelos disponíveis para geração de imagens ou geração de fala. Utilize-o antes de uma chamada de geração quando o agente precisar de um nome de modelo válido, uma descrição ou preços.

Cada resultado inclui a descrição e o preço do modelo. Modelos de imagem também indicam se aceitam imagens de referência. Modelos de imagem obsoletos não são listados.

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

A ferramenta retorna a lista de modelos como texto MCP. Use o nome do modelo retornado como argumento `model` da ferramenta de geração correspondente. Chamar esta ferramenta não tem custo.

### `generate_image`

`generate_image` cria de uma a quatro imagens a partir de um prompt e retorna suas URLs. Utilize-o quando o cliente precisar de imagens e já tiver um nome de modelo de imagem obtido em `list_models`.

Entrada:

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `prompt` | string | Sim | Uma descrição não vazia da imagem a ser gerada. |
| `model` | string | Sim | Um nome de modelo de imagem retornado por `list_models` com `type` definido como `image`. Não diferencia maiúsculas de minúsculas. |
| `count` | integer | Não | Quantas imagens gerar, de 1 a 4. O padrão é 1. |
| `reference_images` | array de strings | Não | Até quatro URLs públicas de imagem HTTP(S) que orientam o resultado. Aceitas apenas por modelos que suportam imagens de referência. |
| `size` | string | Não | Tamanho de saída como `<largura>x<altura>`, como `1024x1024`. Cada lado varia de 64 a 4096 pixels. O padrão é 1080x1920. |
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

A ferramenta retorna texto MCP com:

- a URL e o custo de cada imagem gerada;
- o erro de cada imagem com falha;
- o custo total.

Imagens com falha não são cobradas. As URLs são publicamente acessíveis, portanto, qualquer pessoa com uma URL pode abrir a imagem. Baixe e armazene as imagens se seu fluxo de trabalho precisar mantê-las sob seu próprio controle de acesso.

Para orientação sobre prompts e comportamento de imagem de referência, consulte [Geração de Imagens](https://docs.aivax.net/pt-br/docs/generations/images.md).

### `generate_speech`

`generate_speech` sintetiza fala a partir de texto e retorna a URL do áudio MP3 gerado. Utilize-o quando o cliente precisar de áudio falado e já tiver um nome de modelo de fala obtido em `list_models`.

Entrada:

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `input` | string | Sim | O texto não vazio a ser sintetizado. |
| `model` | string | Sim | Um nome de modelo de fala retornado por `list_models` com `type` definido como `audio`. Não diferencia maiúsculas de minúsculas. |
| `voice` | string | Não | Uma voz compatível com o modelo selecionado. A voz padrão do modelo é usada quando omitida. |
| `instructions` | string | Não | Orientações sobre tom, emoção ou ritmo para a fala gerada. |

Exemplo de argumentos:

```json
{
  "input": "Seu pedido foi enviado e deve chegar na quinta-feira.",
  "model": "<NOME_DO_MODELO_DE_FALA>",
  "instructions": "Amigável e calmo, ritmo moderado."
}
```

A ferramenta retorna a URL do áudio MP3 como texto MCP. A URL é publicamente acessível, portanto, qualquer pessoa com ela pode reproduzir o áudio.

Diferentemente da API de Geração de Fala:

- Ela não retorna o áudio inline.
- Ela não oferece outros formatos de saída.
- Converta o arquivo baixado se seu fluxo de trabalho precisar de WAV ou OGG.

As vozes diferem por modelo de fala. Para orientação sobre seleção de voz e preparação de texto, consulte [Geração de Fala](https://docs.aivax.net/pt-br/docs/generations/speech.md).

## Preços e limites

As chamadas de geração usam os mesmos preços e cotas das APIs de geração, e a AIVAX cobra a conta autenticada. Use as páginas de produto abaixo para essas taxas e cotas:

- [Geração de Imagens](https://docs.aivax.net/pt-br/docs/generations/images.md#pricing-limits-and-errors) para `generate_image`.
- [Geração de Fala](https://docs.aivax.net/pt-br/docs/generations/speech.md#pricing-limits-and-errors) para `generate_speech`.
- [Preços](https://docs.aivax.net/pt-br/docs/pricing.md) para regras gerais de faturamento.

É necessário um saldo positivo na conta para usar estas ferramentas.

## Orientações de segurança

Utilize estas orientações antes de conectar um cliente ou publicar um arquivo gerado. O MCP é executado com sua chave de API, e as URLs de mídia retornadas são públicas.

- Use o MCP apenas de clientes confiáveis.
- Mantenha a chave de API no armazenamento seguro de segredos do cliente.
- Não coloque a chave no controle de origem, código do lado do navegador, prompts compartilhados ou logs.

As URLs de mídia gerada são públicas. Não gere imagens ou áudio contendo informações pessoais, confidenciais ou sensíveis, a menos que o fluxo de trabalho leve essa exposição em consideração. Revise os ativos gerados quanto à precisão e adequação antes de publicá-los.
