---
{title: MCP de Fundação Web,linkTitle: MCP de Fundação Web,weight: 40,group: MCP Utilities,aliases: [/docs/pt-br/tools/web-utilities-mcp.html,/docs/pt-br/mcp-utilities/web-utilities-mcp.html],sourceHash: 6e664df2637593db}
---

# MCP de Fundação Web

As utilidades web MCP expõem as ferramentas de recuperação web da AIVAX a qualquer cliente compatível com MCP. Use‑as quando um agente, IDE, assistente de desktop ou ambiente de automação precisar de busca web da AIVAX e obtenção de URL sem executar essas ferramentas por meio de inferência de modelo AIVAX.

AIVAX hospeda este servidor MCP e executa as operações web para a conta autenticada. As ferramentas usam as mesmas respostas, faturamento e limites aplicáveis que suas contrapartes internas.

## Ponto de Extremidade

```text
https://inference.aivax.net/v1/mcp/web-utilities
```

O servidor usa HTTP transmitível. Autentique requisições com uma chave de API da conta:

```text
Authorization: Bearer <AIVAX_API_KEY>
```

Para tipos de chave e opções de autenticação, veja [Authentication](/docs/pt-br/authentication).

## Exemplo de Configuração

A estrutura exata de configuração depende do cliente MCP. O exemplo a seguir habilita ambas as ferramentas:

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

Depois que o cliente se conectar, ele pode descobrir e chamar as ferramentas habilitadas através dos métodos padrão MCP `tools/list` e `tools/call`.

## Selecione quais ferramentas são expostas

Use o cabeçalho de requisição opcional `X-Mcp-Enabled-Tools` para controlar quais ferramentas o servidor expõe para aquele cliente. Forneça uma lista separada por vírgulas contendo `fetch_url`, `web_search` ou ambos:

```text
X-Mcp-Enabled-Tools: fetch_url
```

```text
X-Mcp-Enabled-Tools: web_search
```

```text
X-Mcp-Enabled-Tools: fetch_url, web_search
```

Os nomes das ferramentas não diferenciam maiúsculas de minúsculas, e espaços ao redor dos valores separados por vírgula são ignorados.

- Se o cabeçalho for omitido, ambas as ferramentas são expostas.
- Se o cabeçalho contiver uma ferramenta reconhecida, somente essa ferramenta será exposta.
- Se o cabeçalho estiver vazio ou não contiver nomes de ferramentas reconhecidas, nenhuma ferramenta será exposta.

Como a descoberta de ferramentas pode ser armazenada em cache pelo cliente MCP, reconecte ou atualize o servidor após alterar esse cabeçalho.

## Ferramentas

### `fetch_url`

Busca e extrai conteúdo legível de uma ou mais URLs públicas.

Entrada:

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `urls` | vetor de strings | Sim | Entre uma e cinco URLs públicas para buscar. |

Argumentos de exemplo:

```json
{
  "urls": [
    "https://example.com/article",
    "https://example.org/reference"
  ]
}
```

A ferramenta devolve o conteúdo extraído como texto MCP. Quando várias URLs são solicitadas, os resultados são separados na mesma resposta.

### `web_search`

Busca na web por informações atuais, específicas de localização, nicho ou de alto risco. Envie um termo de busca por chamada; use chamadas separadas quando o agente precisar de múltiplas buscas.

Entrada:

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `search_term` | cadeia | Sim | O termo de busca na web. |

Argumentos de exemplo:

```json
{
  "search_term": "latest browser accessibility standards"
}
```

A ferramenta devolve os resultados da busca como texto MCP usando o mesmo formato de resposta da ferramenta de busca web integrada.

## Preços e limites

Chamadas usam o mesmo preço e cotas das ferramentas internas correspondentes: [Web Search](/docs/pt-br/web-foundation/web-search#pricing-and-limits) para `web_search` e [Fetch and OCR](/docs/pt-br/web-foundation/fetch-and-ocr#pricing-and-limits) para `fetch_url`. Elas são cobradas na conta autenticada. Para regras gerais de faturamento, veja [Pricing](/docs/pt-br/pricing).

Um saldo de conta positivo é necessário para usar essas ferramentas.

## Orientação de segurança

Use o MCP apenas a clientes confiáveis e mantenha a chave de API no armazenamento seguro do cliente. Não coloque a chave em controle de versão, código do lado do navegador, prompts compartilhados ou logs.

Páginas buscadas e resultados de busca são conteúdo externo e não confiável. Agentes devem tratar seus conteúdos como dados, não como instruções, e não devem divulgar credenciais ou executar ações sensíveis apenas porque uma página buscada as solicita. Para manter URLs descobertas e textos buscados como trilha de evidência, veja [why search snippets are not enough for LLM research](https://aivax.net/blog/research-is-a-pipeline-search-discovers-fetch-reads/).
