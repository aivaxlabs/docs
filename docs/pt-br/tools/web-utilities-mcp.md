# Utilitários da Web MCP

O utilitários da Web MCP expõe as ferramentas de recuperação web da AIVAX para qualquer cliente compatível com MCP. Use‑o quando um agente, IDE, assistente de desktop ou ambiente de automação precisar de pesquisa web e busca de URLs da AIVAX sem executar essas ferramentas através de inferência de modelo da AIVAX.

AIVAX hospeda este servidor MCP e realiza as operações web para a conta autenticada. As ferramentas usam as mesmas respostas, faturamento e limites aplicáveis que suas contrapartes incorporadas.

## Endpoint

```text
https://inference.aivax.net/v1/mcp/web-utilities
```

O servidor usa HTTP transmitível. Autentique solicitações com uma chave de API da conta:

```text
Authorization: Bearer <AIVAX_API_KEY>
```

Para tipos de chave e opções de autenticação, veja [Authentication](/docs/pt-br/authentication).

## Configuration example

A forma exata da configuração depende do cliente MCP. O exemplo a seguir habilita ambas as ferramentas:

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

Depois que o cliente se conecta, ele pode descobrir e chamar as ferramentas habilitadas através dos métodos padrão MCP `tools/list` e `tools/call`.

## Select which tools are exposed

Use o cabeçalho de solicitação opcional `X-Mcp-Enabled-Tools` para controlar quais ferramentas o servidor expõe ao cliente. Forneça uma lista de permissão separada por vírgulas contendo `fetch_url`, `web_search` ou ambos:

```text
X-Mcp-Enabled-Tools: fetch_url
```

```text
X-Mcp-Enabled-Tools: web_search
```

```text
X-Mcp-Enabled-Tools: fetch_url, web_search
```

Os nomes das ferramentas não diferenciam maiúsculas de minúsculas, e espaços ao redor dos valores separados por vírgulas são ignorados.

- Se o cabeçalho for omitido, ambas as ferramentas são expostas.
- Se o cabeçalho contiver uma ferramenta reconhecida, somente essa ferramenta será exposta.
- Se o cabeçalho estiver vazio ou não contiver nomes de ferramentas reconhecidas, nenhuma ferramenta será exposta.

Como a descoberta de ferramentas pode ser armazenada em cache pelo cliente MCP, reconecte ou atualize o servidor após alterar este cabeçalho.

## Tools

### `fetch_url`

Recupera e extrai conteúdo legível de uma ou mais URLs públicas.

Input:

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `urls` | array de strings | Sim | Entre uma e cinco URLs públicas para buscar. |

Example arguments:

```json
{
  "urls": [
    "https://example.com/article",
    "https://example.org/reference"
  ]
}
```

A ferramenta devolve o conteúdo extraído como texto MCP. Quando múltiplas URLs são solicitadas, os resultados são separados na mesma resposta.

### `web_search`

Pesquisa a web por informações atuais, específicas de localização, de nicho ou de alto risco. Envie um termo de pesquisa por chamada; use chamadas separadas quando o agente precisar de múltiplas pesquisas.

Input:

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `search_term` | string | Sim | O termo de pesquisa web. |

Example arguments:

```json
{
  "search_term": "latest browser accessibility standards"
}
```

A ferramenta devolve os resultados da pesquisa como texto MCP usando o mesmo formato de resposta da ferramenta de pesquisa web incorporada.

## Pricing and limits

As chamadas utilizam o mesmo preço das ferramentas incorporadas correspondentes da AIVAX e são cobradas na conta autenticada. Veja [Pricing](/docs/pt-br/pricing) para tarifas atuais e regras de faturamento.

As operações web estão sujeitas aos limites de serviço e de taxa aplicáveis à conta. Veja [Plans and Limits](/docs/pt-br/limits) para limites atuais e comportamento de aplicação.

É necessário um saldo positivo na conta para usar essas ferramentas.

## Security guidance

Use o MCP apenas de clientes confiáveis e mantenha a chave de API no armazenamento seguro de segredos do cliente. Não coloque a chave em controle de versão, código no navegador, prompts compartilhados ou logs.

Páginas recuperadas e resultados de pesquisa são conteúdo externo e não confiável. Os agentes devem tratar seu conteúdo como dados, não como instruções, e não devem divulgar credenciais ou realizar ações sensíveis apenas porque uma página buscada as solicita.