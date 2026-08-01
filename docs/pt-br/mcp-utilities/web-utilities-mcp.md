# Utilitários da Web MCP

O utilitário da Web MCP expõe as ferramentas de recuperação web da AIVAX para qualquer cliente compatível com MCP. Use-o quando um agente, IDE, assistente de desktop ou ambiente de automação precisar de busca web e obtenção de URLs da AIVAX sem executar essas ferramentas por meio de inferência de modelo da AIVAX.

A AIVAX hospeda este servidor MCP e realiza as operações web para a conta autenticada. As ferramentas usam as mesmas respostas, faturamento e limites aplicáveis que suas contrapartes internas.

## Endpoint

```text
https://inference.aivax.net/v1/mcp/web-utilities
```

O servidor usa HTTP Streamable. Autentique as solicitações com uma chave de API da conta:

```text
Authorization: Bearer <AIVAX_API_KEY>
```

Para tipos de chave e opções de autenticação, veja [Autenticação](/docs/pt-br/authentication).

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

Depois que o cliente se conecta, ele pode descobrir e chamar as ferramentas habilitadas através dos métodos padrão do MCP `tools/list` e `tools/call`.

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

Os nomes das ferramentas não diferenciam maiúsculas de minúsculas, e os espaços ao redor dos valores separados por vírgulas são ignorados.

- Se o cabeçalho for omitido, ambas as ferramentas são expostas.
- Se o cabeçalho contiver uma ferramenta reconhecida, apenas essa ferramenta será exposta.
- Se o cabeçalho estiver vazio ou não contiver nomes de ferramentas reconhecidas, nenhuma ferramenta será exposta.

Como a descoberta de ferramentas pode ser armazenada em cache pelo cliente MCP, reconecte ou atualize o servidor após alterar este cabeçalho.

## Ferramentas

### `fetch_url`

Recupera e extrai conteúdo legível de uma ou mais URLs públicas.

Entrada:

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `urls` | array de strings | Sim | Entre uma e cinco URLs públicas para buscar. |

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

Busca na web por informações atuais, específicas de local, nicho ou de alto risco. Envie um termo de busca por chamada; use chamadas separadas quando o agente precisar de múltiplas buscas.

Entrada:

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `search_term` | string | Sim | O termo de busca na web. |

Argumentos de exemplo:

```json
{
  "search_term": "latest browser accessibility standards"
}
```

A ferramenta devolve os resultados da busca como texto MCP usando o mesmo formato de resposta da ferramenta de busca web interna.

## Preços e limites

As chamadas usam o mesmo preço das ferramentas internas correspondentes da AIVAX e são cobradas na conta autenticada. Veja [Preços](/docs/pt-br/pricing) para as tarifas atuais e regras de faturamento.

Operações web estão sujeitas aos cotas de serviço e limites de taxa aplicáveis à conta. Veja [Planos e Limites](/docs/pt-br/limits) para os limites atuais e comportamento de aplicação.

Um saldo de conta positivo é necessário para usar essas ferramentas.

## Orientações de segurança

Use o MCP apenas a partir de clientes confiáveis e mantenha a chave de API no armazenamento seguro de segredos do cliente. Não coloque a chave no controle de versão, código do lado do navegador, prompts compartilhados ou logs.

Páginas buscadas e resultados de busca são conteúdo externo e não confiável. Os agentes devem tratar seu conteúdo como dados, não como instruções, e não devem divulgar credenciais ou executar ações sensíveis apenas porque uma página buscada as solicita.