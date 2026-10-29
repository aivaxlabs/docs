---
{title: Bem-vindo,linkTitle: Bem-vindo,weight: 10,group: Introduction,aliases: [/docs/pt-br/getting-started.html,/docs/pt-br/platform/basics.html,/docs/pt-br/platform/models.html,/docs/pt-br/overview.html],sourceHash: 3a5afa12c82206ec}
---

# Bem-vindo

A AIVAX é uma plataforma de orquestração de IA para criar, operar e avaliar aplicativos de IA por meio de uma única conta, superfície de API e carteira de cobrança. Ela combina modelos hospedados e bring-your-own-key (BYOK) com configuração reutilizável de assistentes, recuperação de conhecimento, ferramentas, processamento de texto e mídia, canais voltados ao usuário, trabalhos em segundo plano e avaliação conversacional.

Você não precisa de todos os produtos para cada aplicativo. Comece com a inferência direta quando precisar apenas de uma resposta. Adicione outros produtos quando precisar reutilizar configurações de assistente, pesquisar seus documentos, conectar ferramentas ou canais, processar muitos registros ou avaliar o comportamento.

## Escolha o ponto de partida certo

| Objetivo | Comece com | Por quê |
| --- | --- | --- |
| Gerar ou analisar texto em uma única solicitação | [Inferência](inference/inference.md) | Chame um modelo hospedado ou BYOK por meio da API compatível com OpenAI sem criar configuração reutilizável de assistente. |
| Reutilizar instruções, conhecimento, ferramentas e configurações de modelo | [Gateway de IA](inference/ai-gateway.md) | Forneça ao seu aplicativo um único tempo de execução de assistente estável que possa evoluir sem reconstruir cada solicitação. |
| Pesquisar seus próprios documentos ou gerar respostas fundamentadas | [Coleções RAG](rag/collections.md) | Armazene e indexe conhecimento para recuperação semântica, citações e contexto do gateway. |
| Reordenar candidatos que seu aplicativo já recuperou | [Rerankers](rag/reranking.md) | Melhore a relevância sem exigir uma coleção gerenciada da AIVAX. |
| Publicar um assistente para usuários finais | [Clientes de chat](inference/chat-clients.md) | Conecte um gateway ao chat web ou integrações de mensagens suportadas com controles de sessão e canal. |
| Processar muitos registros independentes | [Batch](inference/batch.md) | Execute um fluxo de trabalho repetível de forma assíncrona com estado por item, validação, tentativas novamente, custo e exportação. |
| Testar uma conversa completa de assistente | [Testes Agênticos](inference/agentic-tests.md) | Simule um usuário orientado a objetivos e julgue o gateway em múltiplas rodadas. |
| Criar uma experiência de voz bidirecional de baixa latência | [Sessões de Voz](inference/voice-session.md) | Transmita áudio do usuário e do assistente em uma sessão interativa em vez de combinar trabalhos de áudio separados. |

## Construa o tempo de execução do assistente

### Inferência e Gateways de IA

A AIVAX expõe endpoints de listagem de modelos e conclusão de chat compatíveis com OpenAI. Use uma **chamada direta ao modelo** para exploração, geração única ou configuração que não precise ser reutilizada. Use um **Gateway de IA** quando o mesmo modelo, instruções, coleções RAG, habilidades, ferramentas, moderação ou comportamento de saída devem atender a várias chamadas ou usuários.

A maioria dos assistentes de produção usa um gateway porque o aplicativo pode continuar chamando um único identificador enquanto a configuração do assistente muda independentemente. Os gateways podem usar modelos integrados da AIVAX ou provedores externos compatíveis com OpenAI.

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

Uma [coleção RAG](rag/collections.md) é uma biblioteca de conhecimento semântico. Adicione documentos, teste-os com [Pesquisa Semântica](rag/semantic-search.md) e, em seguida, anexe a coleção a um Gateway de IA quando o assistente deve responder com base nesse conhecimento. A AIVAX também pode gerar respostas fundamentadas diretamente das coleções e expor a pesquisa de coleções por meio do [Collections MCP](mcp-utilities/collections-mcp.md).

O reranking é uma etapa separada: recebe uma consulta e documentos candidatos e retorna os candidatos em uma ordem mais relevante. Use uma coleção para armazenamento e recuperação gerenciados; use a geração de [reranking](rag/reranking.md) independente quando seu aplicativo já possui os candidatos.

### Habilidades e ferramentas

[Habilidades](inference/skills.md) empacotam instruções reutilizáveis e conhecimento operacional. Use uma habilidade quando o assistente precisar saber **como** realizar uma tarefa. Use RAG quando ele precisar recuperar **fatos ou material de origem** que possam crescer ou mudar independentemente.

As ferramentas permitem que o assistente tome ações ou recupere informações em tempo real. Escolha entre:

- [Ferramentas integradas](tools/builtin-tools.md) para capacidades fornecidas pela AIVAX.
- [MCP](tools/mcp.md) para servidores Model Context Protocol e ecossistemas de ferramentas reutilizáveis.
- [Funções de protocolo](tools/protocol-functions.md) para funções HTTP definidas pelo seu aplicativo.
- [Shell](tools/shell.md) para execução controlada de comandos quando o caso de uso exigir.

Mantenha a superfície de ferramentas tão pequena quanto o trabalho do assistente permitir. Cada ferramenta adicional expande custo, latência, permissões e caminhos de falha.

## Processe texto, documentos e mídia

A AIVAX inclui produtos de geração focados para trabalhos que não precisam de uma conversa completa de chat:

- [Classificação de texto](data-processing/classification.md) atribui rótulos a um ou mais documentos.
- [Segmentação de texto](data-processing/text-segmentation.md) divide conteúdo longo em pedaços úteis para indexação ou processamento posterior.
- [Descrições de mídia](data-processing/media-descriptions.md) convertem imagens, áudio, vídeo e arquivos em texto que outro modelo ou fluxo de trabalho pode usar.
- [Geração de imagens](generations/images.md) cria ou edita imagens.
- [Geração de fala](generations/speech.md) transforma texto em áudio.
- [Transcrição de áudio](generations/audio-transcriptions.md) transforma áudio em texto.

Use inferência multimodal direta quando o modelo de chat selecionado suportar a entrada e deve raciocinar sobre ela na mesma solicitação. Use um endpoint de geração focado quando você precisar de um artefato reutilizável, uma transcrição, uma descrição ou uma etapa de pré-processamento. Para conjuntos de entrada grandes e independentes, execute a operação apropriada por meio do [Batch](inference/batch.md).

Para áudio bidirecional interativo, use [Sessões de Voz](inference/voice-session.md) em vez de encadear manualmente transcrição, inferência de texto e geração de fala.

## Entregue, escale e avalie

### Clientes de chat

Um [cliente de chat](inference/chat-clients.md) conecta um Gateway de IA a um canal de usuário final. Ele é responsável pela apresentação, comportamento da sessão, origens permitidas, uploads, respostas de áudio, integrações de canal e limites voltados ao usuário. O gateway continua sendo responsável pelo comportamento do assistente, como o modelo, instruções, RAG e ferramentas.

Use um cliente de chat para um widget de navegador ou integração de mensagens suportada. Use a API de inferência diretamente quando seu próprio backend ou interface já gerenciar usuários, estado de conversa e entrega.

### Batch

[Batch](inference/batch.md) aplica um único fluxo de trabalho a dezenas ou milhares de registros independentes. Um fluxo de trabalho define a instrução, o modelo ou gateway, saída estruturada, validação, ferramentas e política de tentativa novamente. Um job importa itens, processa-os em segundo plano, expõe progresso e custo por item e exporta resultados.

Não use Batch quando um item depender de outro ou quando um usuário precisar de uma resposta imediata. Use inferência direta para um resultado síncrono único e RAG para conhecimento pesquisável.

### Testes Agênticos

[Testes Agênticos](inference/agentic-tests.md) avaliam o comportamento configurado de um Gateway de IA ao longo de uma conversa delimitada. Um usuário simulado persegue um objetivo enquanto um juiz independente avalia o progresso. Use testes persistidos para cobertura de regressão reutilizável e agendada ou uma avaliação efêmera para uma execução imediata única.

Uma execução de teste concluída não é automaticamente um resultado de comportamento bem-sucedido. Revise o resultado da execução, o resultado do juiz, a conversa retida, o uso e o custo juntos.

## Operar e conectar AIVAX

A AIVAX registra conversas e uso para que você possa rastrear o comportamento, atribuir custos e diagnosticar falhas. O painel e as APIs de conta expõem saldo da conta, uso, conversas, recursos do gateway, transações de coleção, itens do Batch e execuções de Testes Agênticos. Comece com [Preços](pricing.md) e [Planos e limites](limits.md) antes de habilitar um fluxo de trabalho de alto volume ou pesado em mídia.

A AIVAX também fornece utilitários MCP para agentes compatíveis:

- [Utilitário MCP de gerenciamento de conta](mcp-utilities/account-management-mcp.md)
- [Utilitário MCP de coleções](mcp-utilities/collections-mcp.md)
- [Utilitário MCP de documentação](mcp-utilities/documentation-mcp.md)
- [Utilitário MCP de utilitários web](mcp-utilities/web-utilities-mcp.md)
- [Utilitário MCP de geração de mídia](mcp-utilities/media-generation-mcp.md)
- [Utilitário MCP de inferência](mcp-utilities/inference-mcp.md)

Esses utilitários expõem capacidades existentes da AIVAX por meio do MCP; eles não substituem os produtos subjacentes de conta, coleção ou inferência.

Para operar uma conta a partir do terminal ou de scripts, instale a [CLI da AIVAX](cli.md) com `bun install -g @aivax/cli`.

## Faça sua primeira solicitação

Crie uma chave **privada** na área Chaves de API do painel da AIVAX e armazene-a como um segredo, por exemplo, em uma variável de ambiente chamada `AIVAX_API_KEY`. Em seguida, instale o SDK OpenAI com `python -m pip install openai` e crie `quickstart.py`:

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
        {"role": "user", "content": "Escreva uma mensagem de boas-vindas de uma frase."}
    ],
)

print(response.choices[0].message.content)
```

Substitua `<MODEL_OR_GATEWAY_ID>` por um nome de modelo hospedado da listagem de modelos ou por um identificador de Gateway de IA, então execute `python quickstart.py`. Uma solicitação bem-sucedida imprime uma frase gerada. Se falhar, consulte [Solucionar problemas de solicitações](inference/inference.md#troubleshoot-requests).

<script src="https://inference.aivax.net/apidocs?embed-target=Model%20listing&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

### Inferência de longa duração

Se uma solicitação terminar com HTTP `524` ou um timeout de proxy enquanto a AIVAX ainda estiver processando-a, use o host de inferência direta:

```text
https://direct.inference.aivax.net/v1
```

A solicitação permanece síncrona, não um job em segundo plano: mantenha a conexão do cliente aberta até que a conclusão seja finalizada e configure um timeout do cliente que cubra o tempo de processamento esperado.

Use a mesma chave de API privada, identificador de modelo ou Gateway de IA, mensagens e parâmetros de solicitação. Altere o URL base do SDK e o timeout:

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
            "content": "Analise este caso cuidadosamente e forneça uma recomendação detalhada.",
        }
    ],
)

print(response.choices[0].message.content)
```

### Endpoints disponíveis no host direto

O host direto serve apenas aos endpoints abaixo. Caminhos, autenticação, corpos de solicitação e respostas são os mesmos que em `https://inference.aivax.net`; apenas o host muda.

| Método | Caminho | Endpoint |
|---|---|---|
| `POST` | `/v1/chat/completions` ou `/api/v1/chat/completions` | [Completions de chat](inference/inference.md) com um modelo integrado ou um Gateway de IA |
| `GET` | `/v1/models` ou `/api/v1/models` | [Listagem de modelos](#faça-sua-primeira-solicitação) |
| `POST` | `/api/v1/public/chat-clients/<access-key>/prompt` | [Enviar uma prompt para uma sessão de chat-client](inference/chat-clients.md#sending-prompts-from-your-application) |
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
| `POST` | `/api/v1/generations/agentic-tests` | [Avaliação de teste agênico efêmero](inference/agentic-tests.md) |
| `POST` | `/api/v1/generations/teach-skill` | Ensine habilidade a partir de um vídeo tutorial |
| `POST` | `/api/v1/web/fetch` | [Busca web e OCR](web-foundation/fetch-and-ocr.md) |

Aliases de compatibilidade desses endpoints de geração, como `/api/v1/generations/validations` e `/api/v1/generations/reflex/rerank`, também são servidos.

Qualquer outro caminho retorna `404 Not Found` no host direto. Gerenciamento de conta, Gateway de IA, coleção, documento, batch e outras APIs administrativas, incluindo busca web, permanecem disponíveis apenas em `https://inference.aivax.net`.

Os endpoints mais propensos a precisar do host direto são completions de chat não streaming com raciocínio longo ou muitas chamadas de ferramentas, geração de imagem em modelos mais lentos, descrições de mídia e transcrições de arquivos grandes, teach skill e prompts de chat-client que executam longas cadeias de ferramentas. Completions de chat streaming enviam dados continuamente e raramente precisam dele.

## Próximos passos

1. Faça sua primeira solicitação com o exemplo acima, depois leia [Inferência](inference/inference.md) para o contrato completo de solicitação.
2. Leia [Autenticação](authentication.md) antes de escolher chaves privadas, chaves públicas ou sessões de chat para um limite de aplicativo.
3. Revise [Preços](pricing.md) e [Planos e limites](limits.md) antes de aumentar o tráfego ou processar grandes coleções, mídia, testes ou jobs de Batch.
4. Mova o comportamento reutilizável do assistente para um [Gateway de IA](inference/ai-gateway.md), depois adicione RAG, habilidades, ferramentas e um cliente de chat apenas quando o caso de uso exigir.
