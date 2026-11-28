---
{title: Bem-vindo,linkTitle: Bem-vindo,weight: 10,group: Introduction,aliases: [/docs/pt-br/getting-started.html,/docs/pt-br/platform/basics.html,/docs/pt-br/platform/models.html,/docs/pt-br/overview.html],sourceHash: 7e707dffa0641e21}
---

# Bem-vindo

AIVAX é uma plataforma de orquestração de IA para criar, operar e avaliar aplicativos de IA. Ela oferece uma conta, uma superfície de API única e uma carteira de cobrança unificada.

Ela combina:

- Modelos hospedados e bring-your-own-key (BYOK).
- Configuração reutilizável de assistentes.
- Recuperação de conhecimento e ferramentas.
- Processamento de texto e mídia.
- Canais voltados ao usuário.
- Trabalhos em segundo plano.
- Avaliação conversacional.

Você não precisa de todos os produtos para cada aplicativo. Comece com inferência direta quando precisar apenas de uma resposta. Adicione outros produtos conforme necessário:

- Reutilizar configurações do assistente.
- Pesquisar seus documentos.
- Conectar ferramentas ou canais.
- Processar muitos registros.
- Avaliar o comportamento.

## Escolha o ponto de partida certo

Use esta tabela quando souber a tarefa e precisar do primeiro produto para iniciar. Cada linha é um ponto de partida, não uma arquitetura completa.

| Objetivo | Comece com | Por quê |
| --- | --- | --- |
| Gerar ou analisar texto em uma única solicitação | [Inferência](/docs/pt-br/inference/chat-completions/concepts.md) | Chame um modelo hospedado ou BYOK por meio da API compatível com OpenAI sem criar configuração de assistente reutilizável. |
| Reutilizar instruções, conhecimento, ferramentas e configurações do modelo | [AI Gateway](/docs/pt-br/inference/ai-gateways/concepts.md) | Forneça ao seu aplicativo um runtime de assistente estável que possa evoluir sem reconstruir cada solicitação. |
| Pesquisar seus próprios documentos ou gerar respostas fundamentadas | [Coleções RAG](rag/collections.md) | Armazene e indexe conhecimento para recuperação semântica, citações e contexto do gateway. |
| Reordenar candidatos que seu aplicativo já recuperou | [Rerankers](rag/reranking.md) | Melhore a relevância sem exigir uma coleção AIVAX gerenciada. |
| Publicar um assistente para usuários finais | [Clientes de chat](inference/chat-clients/overview.md) | Conecte um gateway ao chat web ou integrações de mensagens suportadas com controle de sessão e canal. |
| Processar muitos registros independentes | [Batch](inference/batch/workflows.md) | Execute um fluxo de trabalho repetível de forma assíncrona com estado por item, validação, retentativas, custo e exportação. |
| Testar uma conversa completa de assistente | [Agentic Tests](inference/agentic-tests.md) | Simule um usuário orientado a objetivos e avalie o gateway em múltiplas rodadas. |
| Criar uma experiência de voz bidirecional de baixa latência | [Voice Sessions](inference/voice-session.md) | Transmita áudio do usuário e do assistente em uma sessão interativa em vez de combinar trabalhos de áudio separados. |

## Construa o runtime do assistente

Este é o caminho principal para um assistente que responde aos usuários. Comece aqui quando o aplicativo precisar de uma chamada de modelo, configurações reutilizáveis, conhecimento ou ferramentas.

### Inferência e AI Gateways

AIVAX expõe listagem de modelos e endpoints de conclusão de chat compatíveis com OpenAI. Use esta camada quando o aplicativo precisar de uma resposta gerada.

- Use uma **chamada direta ao modelo** para exploração, geração pontual ou configuração que não precise ser reutilizada.
- Use um **AI Gateway** quando o mesmo modelo, instruções, coleções RAG, habilidades, ferramentas, moderação ou comportamento de saída devem atender a várias chamadas ou usuários.

A maioria dos assistentes de produção usa um gateway. O aplicativo pode continuar chamando um identificador único enquanto a configuração do assistente muda independentemente. Os gateways podem usar modelos integrados da AIVAX ou provedores externos compatíveis com OpenAI.

URL base da API de produção:

```text
https://inference.aivax.net
```

URL base do SDK compatível com OpenAI:

```text
https://inference.aivax.net/v1
```

Referência:

<script src="https://inference.aivax.net/apidocs?embed-target=Inference%20(chat%20completions)&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

### Conhecimento, recuperação e reranking

Uma [coleção RAG](rag/collections.md) é uma biblioteca de conhecimento semântico. Use-a quando as respostas devem vir de seus próprios documentos.

1. Adicione documentos.
2. Teste-os com [Pesquisa Semântica](rag/semantic-search.md).
3. Anexe a coleção a um AI Gateway quando o assistente deve responder com base nesse conhecimento.

A AIVAX também pode gerar respostas fundamentadas diretamente das coleções e expor a pesquisa de coleções por meio do [Collections MCP](mcp-utilities/collections-mcp.md).

O reranking é uma etapa separada. Ele recebe uma consulta e documentos candidatos e retorna os candidatos em uma ordem mais relevante.

- Use uma coleção para armazenamento e recuperação gerenciados.
- Use a geração standalone de [reranking](rag/reranking.md) quando seu aplicativo já possui os candidatos.

### Habilidades e ferramentas

As [Skills](inference/skills.md) agrupam instruções reutilizáveis e conhecimento operacional. Use-as quando o mesmo procedimento se aplicar a várias solicitações.

- Use uma skill quando o assistente precisar saber **como** realizar uma tarefa.
- Use RAG quando ele precisar recuperar **fatos ou material de origem** que possam crescer ou mudar independentemente.
- Use uma ferramenta quando o assistente precisar executar uma ação ou recuperar informações em tempo real.

Escolha entre:

- [Ferramentas integradas](tools/builtin-tools.md) para capacidades fornecidas pela AIVAX.
- [MCP](tools/mcp.md) para servidores do Model Context Protocol e ecossistemas de ferramentas reutilizáveis.
- [Funções de protocolo](tools/protocol-functions.md) para funções HTTP definidas pelo seu aplicativo.
- [Shell](tools/shell.md) para execução controlada de comandos quando o caso de uso exigir.

Mantenha a superfície de ferramentas tão pequena quanto o trabalho do assistente permitir. Cada ferramenta adicional expande custo, latência, permissões e caminhos de falha.

## Processe texto, documentos e mídia

Use estes produtos quando a tarefa for uma transformação focada e não precisar de uma conversa completa de chat:

- [Classificação de texto](data-processing/classification.md) atribui rótulos a um ou mais documentos.
- [Segmentação de texto](data-processing/text-segmentation.md) divide conteúdo longo em pedaços úteis para indexação ou processamento posterior.
- [Descrições de mídia](data-processing/media-descriptions.md) convertem imagens, áudio, vídeo e arquivos em texto que outro modelo ou fluxo de trabalho pode usar.
- [Geração de imagens](generations/images.md) cria ou edita imagens.
- [Geração de fala](generations/speech.md) transforma texto em áudio.
- [Transcrição de áudio](generations/audio-transcriptions.md) transforma áudio em texto.

Escolha o caminho com base no que você precisa receber de volta:

- Use inferência multimodal direta quando o modelo de chat selecionado suportar a entrada e deve raciocinar sobre ela na mesma solicitação.
- Use um endpoint de geração focado quando precisar de um artefato reutilizável, uma transcrição, uma descrição ou uma etapa de pré-processamento.
- Para grandes conjuntos de entrada independentes, execute a operação apropriada por meio do [Batch](inference/batch/workflows.md).

Para áudio bidirecional interativo, use [Voice Sessions](inference/voice-session.md) em vez de encadear manualmente transcrição, inferência de texto e geração de fala.

## Entregue, escale e avalie

Use estes produtos depois que o runtime do assistente estiver funcionando. Eles o publicam para usuários, o executam em muitos registros ou verificam se ele se comporta como pretendido.

### Clientes de chat

Um [cliente de chat](inference/chat-clients/overview.md) conecta um AI Gateway a um canal de usuário final. Use-o para um widget de navegador ou uma integração de mensagens suportada. Use a API de inferência diretamente quando seu próprio backend ou interface já gerenciar usuários, estado de conversa e entrega.

Um cliente de chat é responsável pela apresentação, comportamento da sessão, origens permitidas, uploads, respostas de áudio, integrações de canal e limites voltados ao usuário. O gateway continua sendo responsável pelo comportamento do assistente, como o modelo, instruções, RAG e ferramentas.

### Batch

[Batch](inference/batch/workflows.md) aplica um fluxo de trabalho a dezenas ou milhares de registros independentes. Use-o quando cada registro for independente e o chamador não precisar de uma resposta imediata.

Um fluxo de trabalho define a instrução, o modelo ou gateway, saída estruturada, validação, ferramentas e política de retentativa. Um job então:

1. Importa itens.
2. Processa-os em segundo plano.
3. Expõe progresso e custo por item.
4. Exporta resultados.

Não use Batch quando um item depender de outro ou quando um usuário precisar de uma resposta imediata. Use inferência direta para um resultado síncrono único e RAG para conhecimento pesquisável.

### Agentic Tests

[Agentic Tests](inference/agentic-tests.md) avaliam o comportamento configurado de um AI Gateway ao longo de uma conversa delimitada. Um usuário simulado persegue um objetivo enquanto um juiz independente avalia o progresso.

- Use testes persistidos para cobertura de regressão reutilizável e agendada.
- Use uma avaliação efêmera para uma execução imediata única.

Uma execução de teste concluída não é automaticamente um resultado de comportamento bem-sucedido. Revise-os juntos:

- Resultado da execução.
- Resultado do juiz.
- Conversa retida.
- Uso.
- Custo.

## Operar e conectar AIVAX

Use esta seção para rastrear custos, conectar um agente compatível ou operar a conta por meio de scripts.

A AIVAX rastreia o uso e as conversas quando o log está habilitado, permitindo rastrear o comportamento, atribuir custos e diagnosticar falhas. O painel e as APIs da conta expõem:

- Saldo da conta.
- Uso.
- Conversas.
- Recursos do Gateway.
- Transações de coleção.
- Itens do Batch.
- Execuções de Agentic Test.

Comece com [Preços](pricing/product-pricing.md) e [Planos e limites](pricing/plans-and-limits.md) antes de habilitar um fluxo de trabalho de alto volume ou pesado em mídia.

A AIVAX também fornece utilitários MCP para agentes compatíveis:

- [Account management MCP](mcp-utilities/account-management-mcp.md)
- [Collections MCP](mcp-utilities/collections-mcp.md)
- [Documentation MCP](mcp-utilities/documentation-mcp.md)
- [Web utilities MCP](mcp-utilities/web-utilities-mcp.md)
- [Media generation MCP](mcp-utilities/media-generation-mcp.md)
- [Inference MCP](mcp-utilities/inference-mcp.md)

Esses utilitários expõem as capacidades existentes da AIVAX por meio do MCP. Eles não substituem os produtos subjacentes de conta, coleção ou inferência.

Para operar uma conta a partir do terminal ou de scripts, instale o [AIVAX CLI](cli.md) com `npm install -g @aivax/cli`.

## Faça sua primeira solicitação

Use este caminho para a primeira conclusão de chat bem-sucedida. Ela chama um modelo hospedado ou um AI Gateway por meio da API compatível com OpenAI.

1. Crie uma chave **privada** na área de Chaves de API do painel da AIVAX.
2. Armazene-a como um segredo, por exemplo, em uma variável de ambiente chamada `AIVAX_API_KEY`.
3. Instale o SDK do OpenAI com `python -m pip install openai`.
4. Crie `quickstart.py`:

```python
import os

from openai import OpenAI

client = OpenAI(
    base_url="https://inference.aivax.net/v1",
    api_key=os.environ["AIVAX_API_KEY"],
)

response = client.chat.completions.create(
    model="<MODEL_OR_GATEWAY_ID>",
    messages=[
        {"role": "user", "content": "Write a one-sentence welcome message."}
    ],
)

print(response.choices[0].message.content)
```

Substitua `<MODEL_OR_GATEWAY_ID>` por um nome de modelo hospedado da listagem de modelos ou por um identificador de AI Gateway. Em seguida, execute `python quickstart.py`.

Uma solicitação bem-sucedida imprime uma frase gerada. Se falhar, consulte [Solução de problemas de solicitações](/docs/pt-br/inference/chat-completions/troubleshooting.md).

<script src="https://inference.aivax.net/apidocs?embed-target=Model%20listing&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Inferência de longa duração

Use o host de inferência direta quando uma solicitação terminar com HTTP `524` ou um timeout de proxy enquanto a AIVAX ainda estiver processando:

```text
https://direct.inference.aivax.net/v1
```

A solicitação permanece síncrona, não é um trabalho em segundo plano.

1. Mantenha a conexão do cliente aberta até que a conclusão seja finalizada.
2. Configure um timeout do cliente que cubra o tempo de processamento esperado.
3. Use a mesma chave de API privada, identificador de modelo ou AI Gateway, mensagens e parâmetros de solicitação.
4. Altere a URL base do SDK e o timeout:

```python
import os

from openai import OpenAI

client = OpenAI(
    base_url="https://direct.inference.aivax.net/v1",
    api_key=os.environ["AIVAX_API_KEY"],
    timeout=300.0,
)

response = client.chat.completions.create(
    model="<MODEL_OR_GATEWAY_ID>",
    messages=[
        {
            "role": "user",
            "content": "Analyze this case carefully and provide a detailed recommendation.",
        }
    ],
)

print(response.choices[0].message.content)
```

### Endpoints disponíveis no host direto

Use esta lista para confirmar que o host direto atende à chamada que você precisa. Ele serve apenas os endpoints abaixo. Caminhos, autenticação, corpos de solicitação e respostas são os mesmos de `https://inference.aivax.net`; apenas o host muda.

| Método | Caminho | Endpoint |
|---|---|---|
| `POST` | `/v1/chat/completions` ou `/api/v1/chat/completions` | [Chat completions](/docs/pt-br/inference/chat-completions/concepts.md) com um modelo integrado ou um AI Gateway |
| `GET` | `/v1/models` ou `/api/v1/models` | [Listagem de modelos](#make-your-first-request) |
| `POST` | `/api/v1/public/chat-clients/<access-key>/prompt` | [Enviar um prompt para uma sessão de chat-client](inference/chat-clients/web-client.md#sending-prompts-from-your-application) |
| `POST` | `/api/v2/query`, `/api/v2/query/similar` ou `/api/v2/query/browse` | [Pesquisa](rag/semantic-search.md) |
| `POST` | `/api/v1/answer` | [Geração de resposta RAG](rag/document-filters.md#where-filters-are-supported) |
| `POST` | `/api/v1/generations/images` | [Geração de imagens](generations/images.md) |
| `POST` | `/api/v1/generations/speech` | [Síntese de fala](generations/speech.md) |
| `POST` | `/api/v1/generations/audio/transcriptions` | [Transcrição de áudio](generations/audio-transcriptions.md) |
| `POST` | `/api/v1/generations/descriptions` | [Descrições de mídia](data-processing/media-descriptions.md) |
| `POST` | `/api/v1/generations/classify` | [Classificação](data-processing/classification.md) |
| `POST` | `/api/v1/generations/segment` | [Segmentação de texto](data-processing/text-segmentation.md) |
| `POST` | `/api/v1/generations/decisions` | [Decisões](data-processing/decisions.md) |
| `POST` | `/api/v1/generations/rerank` | [Reranking](rag/reranking.md) |
| `POST` | `/api/v1/generations/agentic-tests` | [Avaliação de teste agêntico efêmero](inference/agentic-tests.md) |
| `POST` | `/api/v1/generations/teach-skill` | Ensine uma habilidade a partir de um vídeo tutorial |
| `POST` | `/api/v1/web/fetch` | [Busca web e OCR](web-foundation/fetch-and-ocr.md) |

Qualquer outro caminho retornará `404 Not Found` no host direto. Gerenciamento de conta, AI Gateway, coleção, documento, batch e outras APIs administrativas, incluindo pesquisa na web, estão disponíveis apenas em `https://inference.aivax.net`.

Os endpoints mais propensos a precisar do host direto são:

- Chat completions sem streaming com raciocínio longo ou muitas chamadas de ferramenta.
- Geração de imagens em modelos mais lentos.
- Descrições e transcrições de mídia de arquivos grandes.
- Teach skill.
- Prompts de chat-client que executam cadeias longas de ferramentas.

Chat completions com envio contínuo de dados raramente precisam dele.

## Próximos passos

Após o sucesso da primeira solicitação, continue nesta ordem:

1. Faça sua primeira solicitação com o exemplo acima, depois leia [Inferência](/docs/pt-br/inference/chat-completions/concepts.md) para o contrato completo de solicitação.
2. Leia [Autenticação](authentication.md) antes de escolher chaves privadas, chaves públicas ou sessões de chat para um limite de aplicativo.
3. Revise [Preços](pricing/product-pricing.md) e [Planos e limites](pricing/plans-and-limits.md) antes de aumentar o tráfego ou processar grandes coleções, mídias, testes ou jobs do Batch.
4. Mova o comportamento reutilizável do assistente para um [AI Gateway](/docs/pt-br/inference/ai-gateways/concepts.md), depois adicione RAG, skills, ferramentas e um cliente de chat apenas quando o caso de uso exigir.
