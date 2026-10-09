Source: https://docs.aivax.net/pt-br/docs/mcp-utilities/web-utilities-mcp.html

# Utilitários Web MCP

O utilitário Web MCP expõe as ferramentas de recuperação web da AIVAX para qualquer cliente compatível com MCP. Use-o quando um agente, IDE, assistente de desktop ou ambiente de automação precisar de busca web e obtenção de URLs da AIVAX sem executar essas ferramentas por meio de inferência de modelo da AIVAX.

A AIVAX hospeda este servidor MCP e realiza as operações web para a conta autenticada. As ferramentas utilizam as mesmas respostas, faturamento e limites aplicáveis que suas contrapartes integradas.

## Endpoint

```text
https://inference.aivax.net/v1/mcp/web-utilities
```

O servidor usa HTTP Streamable. Autentique solicitações com uma chave de API da conta:

```text
Authorization: Bearer <AIVAX_API_KEY>
```

Para tipos de chave e opções de autenticação, veja [Authentication](https://docs.aivax.net/pt-br/docs/authentication.md).

## Exemplo de configuração

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

Após o cliente conectar, ele pode descobrir e chamar as ferramentas habilitadas através dos métodos padrão MCP `tools/list` e `tools/call`.

## Selecione quais ferramentas são expostas

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

Os nomes das ferramentas não diferenciam maiúsculas de minúsculas, e espaços ao redor dos valores separados por vírgula são ignorados.

- Se o cabeçalho for omitido, ambas as ferramentas são expostas.  
- Se o cabeçalho contiver uma ferramenta reconhecida, somente essa ferramenta será exposta.  
- Se o cabeçalho estiver vazio ou não contiver nomes de ferramentas reconhecidas, nenhuma ferramenta será exposta.

Como a descoberta de ferramentas pode ser armazenada em cache pelo cliente MCP, reconecte ou atualize o servidor após alterar este cabeçalho.

## Ferramentas

### `fetch_url`

Busca e extrai conteúdo legível de uma ou mais URLs públicas.

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

A ferramenta retorna o conteúdo extraído como texto MCP. Quando múltiplas URLs são solicitadas, os resultados são separados na mesma resposta.

### `web_search`

Busca na web por informações atuais, específicas de localização, nicho ou de alto risco. Envie um termo de pesquisa por chamada; use chamadas separadas quando o agente precisar de múltiplas pesquisas.

Entrada:

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `search_term` | string | Sim | O termo de pesquisa web. |

Exemplo de argumentos:

```json
{
  "search_term": "latest browser accessibility standards"
}
```

A ferramenta retorna os resultados da pesquisa como texto MCP usando o mesmo formato de resposta da ferramenta de pesquisa web integrada.

## Preços e limites

As chamadas usam o mesmo preço das ferramentas integradas correspondentes da AIVAX e são cobradas na conta autenticada. Consulte [Preços](https://docs.aivax.net/pt-br/docs/pricing.md) para as cobranças atuais e regras de faturamento.

Operações web estão sujeitas às cotas de serviço e limites de taxa aplicáveis à conta. Consulte [Planos e Limites](https://docs.aivax.net/pt-br/docs/limits.md) para limites atuais e comportamento de aplicação.

É necessário um saldo positivo na conta para usar essas ferramentas.

## Orientação de segurança

Use o MCP apenas de clientes confiáveis e mantenha a chave API no armazenamento seguro de segredos do cliente. Não coloque a chave em controle de versão, código do lado do navegador, prompts compartilhados ou logs.

Páginas buscadas e resultados de pesquisa são conteúdo externo e não confiável. Os agentes devem tratar seus conteúdos como dados, não como instruções, e não devem divulgar credenciais ou realizar ações sensíveis apenas porque uma página buscada as solicita. Para manter URLs descobertas e texto buscado como trilha de evidência, veja [why search snippets are not enough for LLM research](https://aivax.net/blog/research-is-a-pipeline-search-discovers-fetch-reads/).
