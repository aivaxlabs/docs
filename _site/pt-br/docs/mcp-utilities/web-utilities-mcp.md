Source: https://docs.aivax.net/pt-br/docs/mcp-utilities/web-utilities-mcp.html

# Web Foundation MCP

O MCP de utilidades web expõe ferramentas de recuperação da AIVAX para qualquer cliente compatível com MCP. Use-o quando um agente, IDE, assistente de desktop ou ambiente de automação precisar de pesquisa na web e busca de URLs da AIVAX sem executar essas ferramentas por meio de inferência de modelo da AIVAX.

A AIVAX hospeda este servidor MCP e realiza as operações web para a conta autenticada. As ferramentas usam as mesmas respostas, cobrança e limites aplicáveis que suas contrapartes integradas.

Um cliente conectado pode:

- buscar conteúdo legível de URLs públicas;
- pesquisar na web por um termo de cada vez.

## Endpoint

Este é o endereço HTTP Streamable para o MCP de utilidades web. Aponte um cliente MCP confiável aqui quando ele deve pesquisar na web ou buscar páginas públicas para uma conta AIVAX.

```text
https://inference.aivax.net/v1/mcp/web-utilities
```

Autentique as solicitações com uma chave de API da conta:

```text
Authorization: Bearer <AIVAX_API_KEY>
```

Para tipos de chave e opções de autenticação, consulte [Authentication](https://docs.aivax.net/pt-br/docs/authentication.md).

## Exemplo de configuração

A configuração do cliente informa ao cliente MCP onde se conectar e quais ferramentas habilitar. O formato exato depende do cliente. O exemplo a seguir habilita ambas as ferramentas:

```json
{
  "servers": {
    "aivax-web": {
      "type": "http",
      "url": "https://inference.aivax.net/v1/mcp/web-utilities",
      "headers": {
        "Authorization": "Bearer <AIVAX_API_KEY>",
        "X-Mcp-Enabled-Tools": "fetch_url, web_search"
      }
    }
  }
}
```

Após a conexão do cliente, ele pode descobrir e chamar as ferramentas habilitadas por meio dos métodos padrão do MCP `tools/list` e `tools/call`.

## Selecione quais ferramentas são expostas

`X-Mcp-Enabled-Tools` é um cabeçalho de solicitação opcional. Use-o quando um cliente deve ver apenas a busca de URL, apenas a pesquisa na web ou ambas.

Forneça uma lista permitida separada por vírgulas contendo `fetch_url`, `web_search` ou ambos:

```text
X-Mcp-Enabled-Tools: fetch_url
```

```text
X-Mcp-Enabled-Tools: web_search
```

```text
X-Mcp-Enabled-Tools: fetch_url, web_search
```

Se o cabeçalho for omitido, ambas as ferramentas serão expostas. Clientes MCP podem armazenar em cache a descoberta de ferramentas, portanto, reconecte ou atualize o servidor após alterar este cabeçalho.

## Ferramentas

Estas são as operações que o servidor pode expor. Chame uma quando o cliente precisar de texto de página ou resultados atuais da web.

### `fetch_url`

`fetch_url` busca e extrai conteúdo legível de uma ou mais URLs públicas. Use-o quando o agente já tiver os endereços que precisa ler.

Entrada:

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `urls` | array de strings | Sim | Entre uma e cinco URLs públicas para buscar. |

Exemplo de argumentos:

```json
{
  "urls": [
    "https://example.com/article",
    "https://example.org/reference"
  ]
}
```

A ferramenta retorna o conteúdo extraído como texto MCP. Quando várias URLs são solicitadas, os resultados são separados na mesma resposta.

### `web_search`

`web_search` pesquisa na web por informações atuais, específicas de localização, de nicho ou de alto risco. Use-o quando o agente precisar de descoberta antes de buscar uma página. Envie um termo de pesquisa por chamada. Use chamadas separadas quando o agente precisar de múltiplas pesquisas.

Entrada:

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `search_term` | string | Sim | O termo de pesquisa na web. |

Exemplo de argumentos:

```json
{
  "search_term": "latest browser accessibility standards"
}
```

A ferramenta retorna os resultados da pesquisa como texto MCP usando o mesmo formato de resposta da ferramenta de pesquisa na web integrada.

## Preços e limites

As chamadas usam os mesmos preços e cotas das ferramentas integradas correspondentes, e a AIVAX cobra a conta autenticada. Use as páginas de produto abaixo para essas taxas e cotas:

- [Web Search](https://docs.aivax.net/pt-br/docs/web-foundation/web-search.md#pricing-and-limits) para `web_search`.
- [Fetch and OCR](https://docs.aivax.net/pt-br/docs/web-foundation/fetch-and-ocr.md#pricing-and-limits) para `fetch_url`.
- [Pricing](https://docs.aivax.net/pt-br/docs/pricing.md) para regras gerais de cobrança.

É necessário um saldo positivo na conta para usar essas ferramentas.

## Orientações de segurança

Use estas orientações antes de conectar um cliente. O MCP executa com sua chave de API, e o conteúdo que ele retorna vem da web pública.

- Use o MCP apenas de clientes confiáveis.
- Mantenha a chave de API no armazenamento seguro de segredos do cliente.
- Não coloque a chave no controle de origem, código do lado do navegador, prompts compartilhados ou logs.

Páginas buscadas e resultados de pesquisa são conteúdo externo e não confiável. Os agentes devem tratar seus conteúdos como dados, e não como instruções. Os agentes não devem divulgar credenciais ou realizar ações sensíveis apenas porque uma página buscada as solicita. Para manter URLs descobertas e texto buscado como um rastro de evidências, consulte [why search snippets are not enough for LLM research](https://aivax.net/blog/research-is-a-pipeline-search-discovers-fetch-reads/).
