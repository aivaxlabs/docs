---
{title: Geração de mídia MCP,linkTitle: Geração de mídia MCP,weight: 50,group: MCP Utilities,sourceHash: 218a22f0fa7010ec,aliases: [/docs/pt-br/mcp-utilities/media-generation-mcp.html]}
---

# Geração de mídia MCP

O MCP de geração de mídia oferece a um cliente MCP hospedado geração de imagens e geração de fala (texto para fala). Use-o quando um agente, IDE, assistente de desktop ou ambiente de automação precisar criar imagens ou áudio falado sem chamar as APIs de geração diretamente ou executar inferência de modelo AIVAX.

A AIVAX hospeda este servidor MCP e realiza as gerações para a conta autenticada. As ferramentas usam os mesmos modelos, cobrança e limites aplicáveis que [Geração de Imagens](/docs/pt-br/generations/images) e [Geração de Fala](/docs/pt-br/generations/speech).

Com as ferramentas habilitadas, um cliente pode:

- listar modelos disponíveis de imagem ou fala;
- gerar de uma a quatro imagens a partir de um prompt;
- sintetizar fala e receber uma URL MP3.

## Endpoint

Este é o endereço HTTP Streamable para o MCP de geração de mídia. Aponte um cliente MCP confiável aqui quando ele deve criar imagens ou fala para uma conta AIVAX.

```text
https://inference.aivax.net/v1/mcp/media-generation
```

Autentique solicitações com uma chave de API da conta:

```text
Authorization: Bearer <AIVAX_API_KEY>
```

Para tipos de chave e opções de autenticação, consulte [Autenticação](/docs/pt-br/authentication).

## Exemplo de configuração

A configuração do cliente informa ao cliente MCP onde se conectar e quais ferramentas habilitar. A forma exata depende do cliente; para Claude Code, veja [como gerar imagens no Claude Code com este MCP](https://aivax.net/blog/generate-images-and-speech-from-claude-code-with-mcp/). Use o exemplo a seguir quando o cliente deve ver todas as ferramentas:

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

## Selecionar quais ferramentas são expostas

`X-Mcp-Enabled-Tools` é um cabeçalho de solicitação opcional. Use-o quando um cliente deve ver apenas geração de imagem, apenas geração de fala ou um conjunto menor de ferramentas.

Forneça uma lista permitida separada por vírgulas contendo qualquer um dos seguintes: `list_models`, `generate_image` e `generate_speech`.

Expor apenas geração de imagem:

```text
X-Mcp-Enabled-Tools: list_models, generate_image
```

Expor apenas geração de fala:

```text
X-Mcp-Enabled-Tools: list_models, generate_speech
```

Se o cabeçalho for omitido, todas as ferramentas serão expostas. Mantenha `list_models` habilitado junto a uma ferramenta de geração para que o agente possa descobrir nomes de modelos válidos. Clientes MCP podem armazenar em cache a descoberta de ferramentas, portanto, reconecte-se ou atualize o servidor após alterar este cabeçalho.

## Ferramentas

Estas são as operações que o servidor pode expor. Chame uma quando o cliente precisar de uma lista de modelos, uma imagem ou áudio falado.

### `list_models`

`list_models` lista os modelos disponíveis para geração de imagem ou geração de fala. Use-o antes de uma chamada de geração quando o agente precisar de um nome de modelo válido, uma descrição ou preços.

Cada resultado inclui a descrição e o preço do modelo. Modelos de imagem também indicam se aceitam imagens de referência.

Entrada:

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `type` | string | Sim | `image` para listar modelos de geração de imagem, ou `audio` para listar modelos de geração de fala. |

Exemplo de argumentos:

```json
{
  "type": "audio"
}
```

A ferramenta retorna a lista de modelos como texto MCP. Use o nome do modelo retornado como o argumento `model` da ferramenta de geração correspondente. Chamar esta ferramenta não tem custo.

### `generate_image`

`generate_image` cria de uma a quatro imagens a partir de um prompt e retorna suas URLs. Use-o quando o cliente precisar de imagens e já tiver um nome de modelo de imagem obtido em `list_models`.

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

Para orientação sobre prompts e comportamento de imagem de referência, consulte [Geração de Imagens](/docs/pt-br/generations/images).

### `generate_speech`

`generate_speech` sintetiza fala a partir de texto e retorna a URL do áudio MP3 gerado. Use-o quando o cliente precisar de áudio falado e já tiver um nome de modelo de fala obtido em `list_models`.

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

Diferentemente da API de Geração de Fala, a ferramenta retorna apenas uma URL MP3, não áudio embutido ou outros formatos. Converta o arquivo baixado se seu fluxo de trabalho precisar de WAV ou OGG.

As vozes diferem por modelo de fala. Para orientação sobre seleção de voz e preparação de texto, consulte [Geração de Fala](/docs/pt-br/generations/speech).

## Preços e limites

As chamadas de geração usam os mesmos preços e cotas das APIs de geração, e a AIVAX cobra a conta autenticada. Use as páginas de produto abaixo para essas taxas e cotas:

- [Geração de Imagens](/docs/pt-br/generations/images#pricing-limits-and-errors) para `generate_image`.
- [Geração de Fala](/docs/pt-br/generations/speech#pricing-limits-and-errors) para `generate_speech`.
- [Preços](/docs/pt-br/pricing/product-pricing.md) para regras gerais de faturamento.

É necessário um saldo positivo na conta para usar essas ferramentas.

## Orientações de segurança

Use estas orientações antes de conectar um cliente ou publicar um arquivo gerado. O MCP é executado com sua chave de API, e as URLs de mídia retornadas são públicas.

- Use o MCP apenas de clientes confiáveis.
- Mantenha a chave de API no armazenamento seguro de segredos do cliente.
- Não coloque a chave no controle de origem, código do lado do navegador, prompts compartilhados ou logs.

As URLs de mídia gerada são públicas. Não gere imagens ou áudio contendo informações pessoais, confidenciais ou sensíveis, a menos que o fluxo de trabalho leve em conta essa exposição. Revise os ativos gerados quanto à precisão e adequabilidade antes de publicá-los.
