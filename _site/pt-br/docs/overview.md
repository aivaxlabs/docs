Source: https://docs.aivax.net/pt-br/docs/overview.html

# Bem-vindo

AIVAX é uma plataforma de orquestração de IA para construir, operar e avaliar aplicativos de IA através de uma conta, superfície de API e carteira de faturamento. Ela combina modelos hospedados e bring-your-own-key (BYOK) com configuração reutilizável de assistente, recuperação de conhecimento, ferramentas, processamento de texto e mídia, canais voltados ao usuário, trabalhos em segundo plano e avaliação conversacional.

Você não precisa de todo produto para cada aplicação. Comece com inferência direta quando precisar apenas de uma resposta. Adicione outros produtos quando precisar reutilizar configurações de assistente, pesquisar seus documentos, conectar ferramentas ou canais, processar muitos registros ou avaliar comportamento.

## Escolha o ponto de partida correto

| Objetivo | Comece com | Por quê |
| --- | --- | --- |
| Gerar ou analisar texto em uma única requisição | [Inferência](https://docs.aivax.net/pt-br/docs/inference/inference.md) | Chame um modelo hospedado ou BYOK através da API compatível com OpenAI sem criar configuração reutilizável de assistente. |
| Reutilizar instruções, conhecimento, ferramentas e configurações de modelo | [Gateway de IA](https://docs.aivax.net/pt-br/docs/inference/ai-gateway.md) | Forneça à sua aplicação um runtime de assistente estável que pode evoluir sem reconstruir cada requisição. |
| Pesquisar seus próprios documentos ou gerar respostas fundamentadas | [Coleções RAG](https://docs.aivax.net/pt-br/docs/rag/collections.md) | Armazene e indexe conhecimento para recuperação semântica, citações e contexto de gateway. |
| Reordenar candidatos já recuperados pela sua aplicação | [Reordenadores](https://docs.aivax.net/pt-br/docs/rag/reranking.md) | Melhore a relevância sem exigir uma coleção gerenciada da AIVAX. |
| Publicar um assistente para usuários finais | [Clientes de chat](https://docs.aivax.net/pt-br/docs/inference/chat-clients.md) | Conecte um gateway a um chat web ou integrações de mensagens suportadas com controles de sessão e canal. |
| Processar muitos registros independentes | [Lote](https://docs.aivax.net/pt-br/docs/inference/batch.md) | Execute um fluxo de trabalho repetível de forma assíncrona com estado por item, validação, tentativas, custo e exportação. |
| Testar uma conversa completa de assistente | [Testes Agentes](https://docs.aivax.net/pt-br/docs/inference/agentic-tests.md) | Simule um usuário orientado a objetivo e avalie o gateway em múltiplas voltas. |
| Construir uma experiência de voz bidirecional de baixa latência | [Sessões de voz](https://docs.aivax.net/pt-br/docs/inference/voice-session.md) | Transmita áudio do usuário e do assistente em uma sessão interativa em vez de combinar trabalhos de áudio separados. |

## Construa o runtime do assistente

### Inferência e Gateways de IA

AIVAX expõe listagem de modelos e endpoints de conclusão de chat compatíveis com OpenAI. Use uma **chamada direta ao modelo** para exploração, geração pontual ou configuração que não precise ser reutilizada. Use um **Gateway de IA** quando o mesmo modelo, instruções, coleções RAG, habilidades, ferramentas, moderação ou comportamento de saída devem atender a múltiplas chamadas ou usuários.

A maioria dos assistentes de produção usa um gateway porque a aplicação pode continuar chamando um único identificador enquanto a configuração do assistente muda independentemente. Gateways podem usar modelos integrados da AIVAX ou provedores externos compatíveis com OpenAI.

URL base da API de produção:

```text
https://inference.aivax.net
```

URL base do SDK compatível com OpenAI:

```text
https://inference.aivax.net/v1
```

Referência:

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Inference%20(chat%20completions))

### Conhecimento, recuperação e reordenação

Uma [coleção RAG](https://docs.aivax.net/pt-br/docs/rag/collections.md) é uma biblioteca de conhecimento semântico. Adicione documentos, teste-os com [Busca Semântica](https://docs.aivax.net/pt-br/docs/rag/semantic-search.md) e então anexe a coleção a um Gateway de IA quando o assistente deve responder a partir desse conhecimento. AIVAX também pode gerar respostas fundamentadas diretamente das coleções e expor a busca de coleção através de [Collections MCP](https://docs.aivax.net/pt-br/docs/mcp-utilities/collections-mcp.md).

A reordenação é um passo separado: ela recebe uma consulta e documentos candidatos, então devolve os candidatos em ordem mais relevante. Use uma coleção para armazenamento e recuperação gerenciados; use a geração independente de [reordenação](https://docs.aivax.net/pt-br/docs/rag/reranking.md) quando sua aplicação já possuir os candidatos.

### Habilidades e ferramentas

[Habilidades](https://docs.aivax.net/pt-br/docs/inference/skills.md) empacotam instruções reutilizáveis e conhecimento operacional. Use uma habilidade quando o assistente precisa saber **como** executar uma tarefa. Use RAG quando precisar recuperar **fatos ou material fonte** que podem crescer ou mudar independentemente.

Ferramentas permitem que o assistente tome ação ou recupere informações ao vivo. Escolha entre:

- [Ferramentas integradas](https://docs.aivax.net/pt-br/docs/tools/builtin-tools.md) para capacidades fornecidas pela AIVAX.
- [MCP](https://docs.aivax.net/pt-br/docs/tools/mcp.md) para servidores Model Context Protocol e ecossistemas de ferramentas reutilizáveis.
- [Funções de protocolo](https://docs.aivax.net/pt-br/docs/tools/protocol-functions.md) para funções HTTP definidas pela sua aplicação.
- [Shell](https://docs.aivax.net/pt-br/docs/tools/shell.md) para execução controlada de comandos quando o caso de uso exigir.

Mantenha a superfície de ferramentas tão pequena quanto o trabalho do assistente permitir. Cada ferramenta adicional aumenta custo, latência, permissões e caminhos de falha.

## Processar texto, documentos e mídia

AIVAX inclui produtos de geração focados para trabalhos que não necessitam de uma conversa completa de chat:

- [Classificação de texto](https://docs.aivax.net/pt-br/docs/data-processing/classification.md) atribui rótulos a um ou mais documentos.
- [Segmentação de texto](https://docs.aivax.net/pt-br/docs/data-processing/text-segmentation.md) divide conteúdo longo em trechos úteis para indexação ou processamento subsequente.
- [Descrições de mídia](https://docs.aivax.net/pt-br/docs/data-processing/media-descriptions.md) converte imagens, áudio, vídeo e arquivos em texto que outro modelo ou fluxo de trabalho pode usar.
- [Geração de imagens](https://docs.aivax.net/pt-br/docs/generations/images.md) cria ou edita imagens.
- [Geração de fala](https://docs.aivax.net/pt-br/docs/generations/speech.md) transforma texto em áudio.
- [Transcrição de áudio](https://docs.aivax.net/pt-br/docs/generations/audio-transcriptions.md) transforma áudio em texto.

Use inferência multimodal direta quando o modelo de chat selecionado suportar a entrada e precisar raciocinar sobre ela na mesma requisição. Use um endpoint de geração focado quando precisar de um artefato reutilizável, transcrição, descrição ou etapa de pré‑processamento. Para grandes conjuntos de entrada independentes, execute a operação apropriada através de [Lote](https://docs.aivax.net/pt-br/docs/inference/batch.md).

Para áudio bidirecional interativo, use [Sessões de voz](https://docs.aivax.net/pt-br/docs/inference/voice-session.md) em vez de encadear manualmente transcrição, inferência de texto e geração de fala.

## Entregar, escalar e avaliar

### Clientes de chat

Um [cliente de chat](https://docs.aivax.net/pt-br/docs/inference/chat-clients.md) conecta um Gateway de IA a um canal de usuário final. Ele controla apresentação, comportamento de sessão, origens permitidas, uploads, respostas de áudio, integrações de canal e limites voltados ao usuário. O gateway continua a ser o responsável pelo comportamento do assistente, como modelo, instruções, RAG e ferramentas.

Use um cliente de chat para um widget de navegador ou integração de mensagens suportada. Use a API de inferência diretamente quando seu próprio backend ou interface já gerencia usuários, estado de conversa e entrega.

### Lote

[Lote](https://docs.aivax.net/pt-br/docs/inference/batch.md) aplica um fluxo de trabalho a dezenas ou milhares de registros independentes. Um fluxo de trabalho define a instrução, modelo ou gateway, saída estruturada, validação, ferramentas e política de tentativas. Um trabalho importa itens, processa-os em segundo plano, expõe progresso e custo por item e exporta resultados.

Não use Lote quando um item depende de outro ou quando o usuário precisa de resposta imediata. Use inferência direta para um resultado síncrono e RAG para conhecimento pesquisável.

### Testes Agentes

[Testes Agentes](https://docs.aivax.net/pt-br/docs/inference/agentic-tests.md) avaliam o comportamento configurado de um Gateway de IA ao longo de uma conversa delimitada. Um usuário simulado persegue um objetivo enquanto um juiz independente avalia o progresso. Use testes persistentes para cobertura de regressão reutilizável e agendada ou avaliação efêmera para uma execução imediata.

Uma execução de teste concluída não é automaticamente um resultado de comportamento bem‑sucedido. Revise o resultado da execução, julgamento, conversa retida, uso e custo em conjunto.

## Operar e conectar AIVAX

AIVAX registra conversas e uso para que você possa rastrear comportamento, atribuir custos e diagnosticar falhas. O painel e as APIs de conta expõem saldo da conta, uso, conversas, recursos de gateway, transações de coleção, itens de Lote e execuções de Testes Agentes. Comece com [Pricing](https://docs.aivax.net/pt-br/docs/pricing.md) e [Plans and limits](https://docs.aivax.net/pt-br/docs/limits.md) antes de habilitar um fluxo de trabalho de alto volume ou pesado em mídia.

AIVAX também fornece utilitários MCP para agentes compatíveis:

- [Account management MCP](https://docs.aivax.net/pt-br/docs/mcp-utilities/account-management-mcp.md)
- [Collections MCP](https://docs.aivax.net/pt-br/docs/mcp-utilities/collections-mcp.md)
- [Documentation MCP](https://docs.aivax.net/pt-br/docs/mcp-utilities/documentation-mcp.md)
- [Web utilities MCP](https://docs.aivax.net/pt-br/docs/mcp-utilities/web-utilities-mcp.md)
- [Media generation MCP](https://docs.aivax.net/pt-br/docs/mcp-utilities/media-generation-mcp.md)
- [Inference MCP](https://docs.aivax.net/pt-br/docs/mcp-utilities/inference-mcp.md)

Esses utilitários expõem capacidades existentes da AIVAX através do MCP; eles não substituem a conta, coleção ou produtos de inferência subjacentes.

## Faça sua primeira requisição

Crie uma chave **privada** na área de API Keys do painel AIVAX e armazene-a como um segredo, por exemplo em uma variável de ambiente chamada `AIVAX_API_KEY`. Em instale o SDK OpenAI com `python -m pip install openai` e crie `quickstart.py`:

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

Substitua `<MODEL_OR_GATEWAY_ID>` por um nome de modelo hospedado da listagem de modelos ou por um identificador de Gateway de IA, então execute `python quickstart.py`. Uma requisição bem‑sucedida imprime uma frase gerada. Se falhar, veja [Troubleshoot requests](https://docs.aivax.net/pt-br/docs/inference/inference.md#troubleshoot-requests).

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Model%20listing)

## Inferência de longa duração

Se uma requisição termina com HTTP `524` ou um timeout de proxy enquanto a AIVAX ainda a processa, use o host de inferência direta:

```text
https://direct.inference.aivax.net/v1
```

A requisição permanece síncrona, não um trabalho em segundo plano: mantenha a conexão do cliente aberta até que a conclusão termine e configure um timeout de cliente que cubra o tempo de processamento esperado.

Use a mesma chave de API privada, modelo ou identificador de Gateway de IA, mensagens e parâmetros de requisição. Altere a URL base do SDK e o timeout:

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

O host direto serve apenas os endpoints abaixo. Caminhos, autenticação, corpos de requisição e respostas são os mesmos de `https://inference.aivax.net`; apenas o host muda.

| Método | Caminho | Endpoint |
|---|---|---|
| `POST` | `/v1/chat/completions` ou `/api/v1/chat/completions` | [Chat completions](https://docs.aivax.net/pt-br/docs/inference/inference.md) com modelo integrado ou Gateway de IA |
| `GET` | `/v1/models` ou `/api/v1/models` | [Model listing](#make-your-first-request) |
| `POST` | `/api/v1/public/chat-clients/<access-key>/prompt` | [Send a prompt to a chat-client session](https://docs.aivax.net/pt-br/docs/inference/chat-clients.md#sending-prompts-from-your-application) |
| `POST` | `/api/v2/query`, `/api/v2/query/similar` ou `/api/v2/query/browse` | [Search](https://docs.aivax.net/pt-br/docs/rag/semantic-search.md) |
| `POST` | `/api/v1/answer` | [RAG answer generation](https://docs.aivax.net/pt-br/docs/rag/document-filters.md#where-filters-are-supported) |
| `POST` | `/api/v1/generations/images` | [Image generation](https://docs.aivax.net/pt-br/docs/generations/images.md) |
| `POST` | `/api/v1/generations/speech` | [Speech synthesis](https://docs.aivax.net/pt-br/docs/generations/speech.md) |
| `POST` | `/api/v1/generations/audio/transcriptions` | [Audio transcription](https://docs.aivax.net/pt-br/docs/generations/audio-transcriptions.md) |
| `POST` | `/api/v1/generations/descriptions` | [Media descriptions](https://docs.aivax.net/pt-br/docs/data-processing/media-descriptions.md) |
| `POST` | `/api/v1/generations/classify` | [Classification](https://docs.aivax.net/pt-br/docs/data-processing/classification.md) |
| `POST` | `/api/v1/generations/segment` | [Text segmentation](https://docs.aivax.net/pt-br/docs/data-processing/text-segmentation.md) |
| `POST` | `/api/v1/generations/decisions` | [Decisions](https://docs.aivax.net/pt-br/docs/data-processing/decisions.md) |
| `POST` | `/api/v1/generations/rerank` | [Reranking](https://docs.aivax.net/pt-br/docs/rag/reranking.md) |
| `POST` | `/api/v1/generations/agentic-tests` | [Ephemeral agentic test evaluation](https://docs.aivax.net/pt-br/docs/inference/agentic-tests.md) |
| `POST` | `/api/v1/generations/teach-skill` | Teach skill from a tutorial video |
| `POST` | `/api/v1/web/fetch` | [Web fetch and OCR](https://docs.aivax.net/pt-br/docs/web-foundation/fetch-and-ocr.md) |

Aliases de compatibilidade desses endpoints de geração, como `/api/v1/generations/validations` e `/api/v1/generations/reflex/rerank`, também são atendidos.

Qualquer outro caminho retorna `404 Not Found` no host direto. Gerenciamento de conta, Gateway de IA, coleção, documento, lote e outras APIs administrativas, incluindo busca na web, permanecem disponíveis apenas em `https://inference.aivax.net`.

Os endpoints que mais provavelmente precisarão do host direto são conclusões de chat não‑streaming com raciocínio longo ou muitas chamadas de ferramenta, geração de imagens em modelos mais lentos, descrições de mídia e transcrições de arquivos grandes, teach skill e prompts de cliente de chat que executam cadeias de ferramentas longas. Conclusões de chat em streaming enviam dados continuamente e raramente necessitam disso.

## Próximos passos

1. Faça sua primeira requisição com o exemplo acima, depois leia [Inference](https://docs.aivax.net/pt-br/docs/inference/inference.md) para o contrato completo da requisição.  
2. Leia [Authentication](https://docs.aivax.net/pt-br/docs/authentication.md) antes de escolher chaves privadas, chaves públicas ou sessões de chat para o limite da aplicação.  
3. Revise [Pricing](https://docs.aivax.net/pt-br/docs/pricing.md) e [Plans and limits](https://docs.aivax.net/pt-br/docs/limits.md) antes de aumentar tráfego ou processar coleções, mídia, testes ou trabalhos de Lote grandes.  
4. Mova o comportamento reutilizável do assistente para um [Gateway de IA](https://docs.aivax.net/pt-br/docs/inference/ai-gateway.md), então adicione RAG, habilidades, ferramentas e um cliente de chat somente quando o caso de uso exigir.
