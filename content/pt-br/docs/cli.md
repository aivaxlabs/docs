---
{title: Ferramenta de linha de comando,linkTitle: Ferramenta de linha de comando,weight: 25,group: Introduction,sourceHash: c8ffc2cb2e103017,aliases: [/docs/pt-br/cli.html]}
---

# Ferramenta de linha de comando

O CLI do AIVAX gerencia uma conta do AIVAX diretamente no terminal. Ele oferece suporte aos mesmos produtos da API, incluindo Gateways de IA, coleções RAG, clientes de chat, Batch, Testes Agentic, busca na web, OCR, gerações, conversas, habilidades, logs e configurações da conta, sem a necessidade de escrever requisições HTTP.

O CLI é de código aberto sob a licença MIT e está publicado no npm como [`@aivax/cli`](https://www.npmjs.com/package/@aivax/cli).

## Quando usá-lo

Use o CLI quando uma pessoa ou um agente interage com uma conta de forma interativa ou por meio de scripts:

- inspecionando e ajustando gateways, coleções e clientes de chat sem abrir o painel;
- importando documentos para uma coleção ou transcrevendo as páginas de um PDF longo para Markdown ou JSONL pronto para RAG;
- criando, iniciando e exportando trabalhos do Batch a partir de arquivos locais;
- executando Testes Agentic, verificando o consumo ou lendo conversas e logs durante a depuração;
- fornecendo a um agente de codificação uma maneira compacta de operar o AIVAX, já que as respostas são otimizadas para agentes por padrão.

Para código de aplicativo que atende usuários finais, chame a [API](overview.md#make-your-first-request) ou um SDK compatível com OpenAI diretamente.

## Instalação

O CLI requer o [Bun](https://bun.sh) 1.3.14 ou versão mais recente.

```bash
bun install -g @aivax/cli
aivax auth login
```

`aivax auth login` salva um perfil de conta. A chave de acesso é mantida no armazenamento de credenciais do sistema operacional. Para scripts e CI, defina a variável de ambiente `AIVAX_API_KEY` em vez de fazer login.

## O que ele pode fazer

Perguntar a um gateway sobre um arquivo local:

```bash
aivax gateways chat -m <GATEWAY_ID> "Summarize this contract" -f contract.pdf --stream
```

Pesquisar em uma coleção ou transcrever um documento e indexá-lo:

```bash
aivax rag search --collection <COLLECTION_ID> -q "refund policy" -k 10
aivax ocr document manual.pdf --format jsonl -o manual.jsonl
aivax rag import -c <COLLECTION_ID> -f manual.jsonl
```

Executar um trabalho do Batch a partir de um arquivo JSONL e exportar os resultados:

```bash
aivax batch items import -w <WORKFLOW_ID> -j <JOB_ID> -f customers.jsonl
aivax batch jobs start -w <WORKFLOW_ID> -j <JOB_ID>
aivax batch jobs export -w <WORKFLOW_ID> -j <JOB_ID> -o results.jsonl
```

Gerar mídia, pesquisar na web ou verificar gastos:

```bash
aivax generate speech -m <MODEL_ID> -t @script.txt -o narration.mp3
aivax web search -q "AI regulation news" --country US
aivax analytics balance
```

Chamar qualquer endpoint que não tenha um comando dedicado:

```bash
aivax api get /api/v1/notifications/unread/count
```

Execute `aivax --help` para listar todos os grupos de comandos e adicione `--help` a qualquer comando para ver suas opções. `aivax docs reference <ENDPOINT_NAME>` exibe a referência da API para um endpoint sem sair do terminal.
