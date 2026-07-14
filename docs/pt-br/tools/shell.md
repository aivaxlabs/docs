# Shell

AIVAX oferece um ambiente de shell virtual que pode ser usado por assistentes de agente para executar comandos de terminal durante a inferência. Esse recurso é especialmente útil para tarefas como manipulação de dados, chamadas de API, execução de scripts e fluxos de trabalho que são mais fáceis de expressar como operações de linha de comando.

O ambiente de shell permite mover ferramentas selecionadas do modelo para o lado do shell, transformando-as em comandos CLI. Isso é útil quando você tem muitas ferramentas e não deseja expor todas diretamente ao modelo, ou quando uma ferramenta é mais fácil de usar por meio de argumentos de linha de comando e pipes.

Quando habilitado em um AI Gateway, o modelo vê uma ferramenta `shell` com um argumento: `command`. Os comandos são executados em um shell sandboxed com módulos de rede, padrões de sistema de arquivos e um workspace montado em `/home/workspace`. Cada comando tem limite de 30 segundos e retorna até 4.096 caracteres de saída ao modelo.

## Adapting tools for shell

Na interface de shell virtual, utilitários padrão de linha de comando e módulos de shell registrados estão disponíveis. Dessa forma, você pode adaptar suas ferramentas para retornar saídas brutas ou longas, e o modelo pode usar as ferramentas de manipulação de texto do shell para extrair as informações relevantes, por exemplo:

```bash
get-users --filter active --format csv | grep "John Doe" | awk -F, '{print $1, $2}'
```

Na linha acima, `get-users` é uma ferramenta personalizada que retorna uma lista de usuários em formato CSV. O comando `grep` filtra os resultados para encontrar "John Doe", e o `awk` extrai e formata as colunas desejadas. Essa ferramenta pode ter sido definida por [MCP](/docs/pt-br/tools/mcp), [built-in tools](/docs/pt-br/tools/builtin-tools) ou ser uma [protocol tool](/docs/pt-br/tools/protocol-functions).

Ferramentas movidas para o shell não ficam mais expostas como funções diretas do modelo, exceto ferramentas reservadas como `shell` e `read_skill`. Configure a lista de ferramentas do shell como:

- `WhiteList`: apenas as ferramentas listadas são expostas como comandos de shell.
- `BlackList`: as ferramentas listadas permanecem como ferramentas diretas do modelo, e as outras ferramentas não reservadas são expostas como comandos de shell.

Use o nome da função em tempo de execução ao listar ferramentas, como `web_search`, `open_url`, `request`, ou um nome de função de protocolo/MCP. Cada comando de shell gerado a partir de uma ferramenta suporta `--help` e mapeia propriedades do JSON Schema para opções de linha de comando.

## Data persistence

É possível definir persistência de dados para o ambiente de shell. Quando `allowDataPersistence` está habilitado e o contexto de inferência possui um ID externo de usuário, a AIVAX monta um workspace persistente delimitado à conta e ao usuário. Isso permite que o agente mantenha arquivos entre conversas e sessões para esse usuário identificado.

Se a persistência estiver desativada, ou se o contexto de inferência não tiver um ID externo de usuário, o shell usa um sistema de arquivos em memória e o workspace é descartado após a iteração de inferência.

## Shell file API

A AIVAX também expõe endpoints de I/O do Shell em `/api/v1/shell/io` para contas autenticadas. Esses endpoints utilizam o cabeçalho obrigatório `X-Shell-User-Id` para delimitar o sandbox do sistema de arquivos e suportam listagem de diretórios, download de arquivos, inspeção de metadados de arquivos, criação de endereços públicos temporários, upload de arquivos, criação de diretórios e exclusão de arquivos ou diretórios. Uploads são documentados com um corpo de requisição máximo de 100 MB.