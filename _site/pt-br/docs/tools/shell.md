Source: https://docs.aivax.net/pt-br/docs/tools/shell.html

# Sandboxing de Shell

AIVAX oferece um ambiente de shell virtual que pode ser usado por assistentes de agente para executar comandos de terminal durante a inferência. Esse recurso é especialmente útil para tarefas como manipulação de dados, chamadas de API, execução de scripts e fluxos de trabalho que são mais fáceis de expressar como operações de linha de comando.

O ambiente de shell permite mover ferramentas selecionadas do modelo para o lado do shell, transformando-as em comandos CLI. Isso é útil quando você tem muitas ferramentas e não deseja expor todas elas diretamente ao modelo, ou quando uma ferramenta é mais fácil de usar através de argumentos e pipes de linha de comando.

Quando habilitado em um gateway de IA, o modelo vê uma ferramenta `shell` com um argumento: `command`. Os comandos são executados em um shell sandboxado com módulos de rede, padrões de sistema de arquivos e um workspace montado em `/home/workspace`. Cada comando tem um limite de tempo e um teto para a saída retornada ao modelo; veja [Pricing and limits](#pricing-and-limits).

## Design para os limites

O tempo limite e o teto de saída moldam o comportamento das ferramentas de shell. Mantenha os comandos rápidos e a saída estreita: filtre no servidor com `grep`, `awk` ou bandeiras de consulta antes de imprimir, e prefira ferramentas que retornem CSV ou linhas delimitadas que o modelo possa dividir com pipes. Quando um resultado excede legitimamente o teto, divida o trabalho — um comando para listar ou contar, subsequentes para buscar fatias — ou grave a saída completa em um arquivo de workspace e leia a parte relevante de volta através da API de arquivo Shell abaixo.

Operações de longa duração não pertencem a um comando de inferência. Mova exportações, transformações em lote e loops de polling para [Batch](https://docs.aivax.net/pt-br/docs/inference/batch.md) ou um job externo, e deixe o shell lidar com as fatias interativas.

## Adaptando ferramentas para o shell

Na interface de shell virtual, utilitários padrão de linha de comando e módulos de shell registrados estão disponíveis. Dessa forma, você pode adaptar suas ferramentas para retornar saídas brutas ou longas, e o modelo pode usar as ferramentas de manipulação de texto do shell para extrair as informações relevantes, por exemplo:

```bash
get-users --filter active --format csv | grep "John Doe" | awk -F, '{print $1, $2}'
```

Na linha acima, `get-users` é uma ferramenta personalizada que retorna uma lista de usuários em formato CSV. O comando `grep` filtra os resultados para encontrar "John Doe", e `awk` extrai e formata as colunas desejadas. Essa ferramenta pode ter sido definida por [MCP](https://docs.aivax.net/pt-br/docs/tools/mcp.md), [built-in tools](https://docs.aivax.net/pt-br/docs/tools/builtin-tools.md) ou ser uma [protocol tool](https://docs.aivax.net/pt-br/docs/tools/protocol-functions.md).

Ferramentas movidas para o shell não são mais expostas como funções diretas do modelo, exceto ferramentas reservadas como `shell` e `read_skill`. Configure a lista de ferramentas do shell como:

- `WhiteList`: apenas as ferramentas listadas são expostas como comandos de shell.
- `BlackList`: as ferramentas listadas permanecem como funções diretas do modelo, e as outras ferramentas não reservadas são expostas como comandos de shell.

Use o nome da função em tempo de execução ao listar ferramentas, como `web_search`, `open_url`, `request` ou um nome de função de protocolo/MCP. Cada comando de shell gerado a partir de uma ferramenta suporta `--help` e mapeia propriedades do JSON Schema para opções de linha de comando.

Prefira a lista branca quando o modelo precisar de um conjunto pequeno e previsível de comandos — toda nova ferramenta, caso contrário, vaza automaticamente para o shell. Prefira a lista negra quando a maioria das ferramentas for amigável ao shell e somente algumas precisem permanecer como funções diretas por motivos de latência ou confiabilidade.

## Persistência de dados

É possível definir persistência de dados para o ambiente de shell. Quando `allowDataPersistence` está habilitado e o contexto de inferência tem um ID externo de usuário, a AIVAX monta um workspace persistente escopo ao conta e ao usuário. Isso permite que o agente mantenha arquivos entre conversas e sessões para aquele usuário identificado.

Se a persistência estiver desativada, ou o contexto de inferência não possuir ID externo de usuário, o shell usa um sistema de arquivos em memória e o workspace é descartado após a iteração de inferência.

Habilite a persistência apenas para dados que o usuário espera que sobrevivam — documentos de trabalho, relatórios gerados, configurações que ele gerencia. Mantenha segredos, credenciais e dados de outros usuários fora do workspace persistente: tudo que for escrito lá persiste além da sessão que o criou.

## Preços e limites

Um travessão (`—`) indica que o plano não impõe um limite.

| Limite | Gratuito | Pro | Máximo |
| --- | --- | --- | --- |
| Comandos Bash | 300/hora | 30.000/hora | — |

Esses limites se aplicam a todos os planos:

| Limite | Valor |
| --- | --- |
| Tempo por comando | 60 segundos |
| Saída retornada ao modelo | 4.096 caracteres |
| Upload da API de arquivo Shell | Corpo de requisição máximo 100 MB |

## API de arquivo Shell

A AIVAX também expõe endpoints de I/O de Shell em `/api/v1/shell/io` para contas autenticadas. Cada requisição requer o cabeçalho `X-Shell-User-Id`, que delimita o sandbox de sistema de arquivos no qual o endpoint opera.

Com esses endpoints, você pode listar diretórios, baixar arquivos, inspecionar metadados de arquivos, criar endereços públicos temporários, fazer upload de arquivos, criar diretórios e excluir arquivos ou diretórios. Uploads têm um tamanho máximo de corpo de requisição; veja [Pricing and limits](#pricing-and-limits).

Reference:

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=List%20Directory)
[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Download%20File)
[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Get%20File%20Details)
[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Get%20File%20Public%20Address)
[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Upload%20File)
[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Create%20Directory)
[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Delete%20File)
[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Delete%20Directory)
