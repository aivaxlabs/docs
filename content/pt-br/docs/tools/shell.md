---
{title: Sandboxing de Shell,linkTitle: Isolamento de shell,weight: 40,group: Tools,sourceHash: 473cb413b046777c,aliases: [/docs/pt-br/tools/shell.html]}
---

# Sandboxing de Shell

A AIVAX oferece um ambiente de shell virtual que pode ser utilizado por assistentes de agentes para executar comandos de terminal durante a inferência. Este recurso é especialmente útil para tarefas como manipulação de dados, chamadas de API, execução de scripts e fluxos de trabalho que são mais fáceis de expressar como operações de linha de comando.

O ambiente de shell permite mover ferramentas selecionadas do modelo para o lado do shell, transformando-as em comandos CLI. Isso é útil quando você possui muitas ferramentas e não deseja expor todas elas diretamente ao modelo, ou quando uma ferramenta é mais fácil de usar por meio de argumentos de linha de comando e pipes.

Quando habilitado em um AI Gateway, o modelo vê uma ferramenta `shell` com um argumento: `command`. Os comandos são executados em um shell isolado (sandboxed) com um espaço de trabalho montado em `/home/workspace`. Cada comando tem um limite de tempo e uma capacidade máxima de saída retornada ao modelo; consulte [Preços e limites](#pricing-and-limits).

## Design para os limites

O tempo limite do comando e a capacidade de saída moldam o comportamento das ferramentas de shell. Mantenha os comandos rápidos e sua saída restrita: filtre no lado do servidor com `grep`, `awk` ou flags de consulta antes de imprimir, e prefira ferramentas que retornem CSV ou linhas delimitadas que o modelo possa fatiar com pipes. Quando um resultado excede legítimamente a capacidade, divida o trabalho — um comando para listar ou contar, seguidos por buscas para buscar fatias — ou escreva a saída completa em um arquivo no espaço de trabalho e leia a parte relevante de volta por meio da API de arquivos do Shell abaixo.

Operações de longa duração não pertencem a um comando de inferência. Mova exportações, transformações em massa e loops de polling para [Batch](../inference/batch.md) ou um trabalho externo, e deixe o shell lidar com as fatias interativas.

## Adaptando ferramentas para shell

Na interface de shell virtual, utilitários padrão de linha de comando e módulos de shell registrados estão disponíveis. Dessa forma, você pode adaptar suas ferramentas para retornar saídas brutas ou longas, e o modelo pode usar as ferramentas de manipulação de texto do shell para extrair as informações relevantes, por exemplo:

```bash
get-users --filter active --format csv | grep "John Doe" | awk -F, '{print $1, $2}'
```

Na linha acima, `get-users` é uma ferramenta personalizada que retorna uma lista de usuários em formato CSV. O comando `grep` filtra os resultados para encontrar "John Doe", e `awk` extrai e formata as colunas desejadas. Esta ferramenta pode ter sido definida por [MCP](/docs/pt-br/tools/mcp), [ferramentas integradas](/docs/pt-br/tools/builtin-tools) ou ser uma [ferramenta de protocolo](/docs/pt-br/tools/protocol-functions).

As ferramentas movidas para o shell não são mais expostas como funções diretas do modelo, exceto ferramentas reservadas como `shell` e `read_skill`. Configure a lista de ferramentas do shell como:

- `WhiteList`: apenas as ferramentas listadas são expostas como comandos de shell.
- `BlackList`: as ferramentas listadas permanecem como ferramentas diretas do modelo, e as outras ferramentas não reservadas são expostas como comandos de shell.

Use o nome da função de runtime ao listar ferramentas, como `web_search`, `open_url`, `request`, ou um nome de função de protocolo/MCP. Cada comando de shell gerado a partir de uma ferramenta suporta `--help` e mapeia propriedades do JSON Schema para opções de linha de comando.

Prefira a whitelist quando o modelo precisar de um conjunto de comandos pequeno e previsível. Prefira a blacklist quando a maioria das ferramentas for compatível com shell e apenas algumas precisarem permanecer como funções diretas.

## Persistência de dados

É possível definir persistência de dados para o ambiente de shell. Quando `allowDataPersistence` está habilitado e o contexto de inferência possui um ID externo de usuário, a AIVAX monta um espaço de trabalho persistente escopoado para a conta e o usuário. Isso permite que o agente mantenha arquivos entre conversas e sessões para esse usuário identificado.

Se a persistência estiver desabilitada, ou se o contexto de inferência não tiver um ID externo de usuário, o shell usa um sistema de arquivos em memória e o espaço de trabalho é descartado após a iteração de inferência.

Habilite a persistência apenas para dados que o usuário espera que sobrevivam — documentos de trabalho, relatórios gerados, configurações que ele gerencia. Mantenha segredos, credenciais e dados de outros usuários fora do espaço de trabalho persistente: tudo o que é escrito lá perdura além da sessão que o criou.

## Acesso à internet

Por padrão, o shell tem acesso à internet por meio de `curl`, `wget` e `ping`. Defina `bashOptions.allowInternetAccess` como `false` para remover os comandos de rede e executar totalmente offline.

## Preços e limites

O número de comandos Bash por hora depende do plano; consulte [Limites de ferramentas integradas e pesquisa na web](../limits.md#built-in-tools-and-web-search). Esses limites se aplicam a todos os planos:

| Limite | Valor |
| --- | --- |
| Tempo por comando | 60 segundos |
| Saída retornada ao modelo | 4.096 caracteres |
| Upload da API de arquivos do Shell | Corpo da solicitação máximo de 100 MB |

## API de arquivos do Shell

A AIVAX também expõe endpoints de E/S do Shell em `/api/v1/shell/io` para contas autenticadas. Cada solicitação requer o cabeçalho `X-Shell-User-Id`, que escopa o sandbox do sistema de arquivos no qual o endpoint opera.

Com esses endpoints, você pode listar diretórios, baixar arquivos, inspecionar metadados de arquivos, criar endereços públicos temporários de arquivos, fazer upload de arquivos, criar diretórios e excluir arquivos ou diretórios. Os uploads têm um tamanho máximo de corpo de solicitação; consulte [Preços e limites](#pricing-and-limits).

Referência:

<script src="https://inference.aivax.net/apidocs?embed-target=List%20Directory&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>
<script src="https://inference.aivax.net/apidocs?embed-target=Download%20File&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>
<script src="https://inference.aivax.net/apidocs?embed-target=Get%20File%20Details&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>
<script src="https://inference.aivax.net/apidocs?embed-target=Get%20File%20Public%20Address&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>
<script src="https://inference.aivax.net/apidocs?embed-target=Upload%20File&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>
<script src="https://inference.aivax.net/apidocs?embed-target=Create%20Directory&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>
<script src="https://inference.aivax.net/apidocs?embed-target=Delete%20File&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>
<script src="https://inference.aivax.net/apidocs?embed-target=Delete%20Directory&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>
