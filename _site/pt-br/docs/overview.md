Source: https://docs.aivax.net/pt-br/docs/overview.html

# Bem-vindo

A AIVAX é uma plataforma de orquestração de IA para criar, operar e avaliar aplicações de IA. Ela oferece uma conta, uma superfície de API única e uma carteira de cobrança unificada.

Ela combina:

- Modelos hospedados e com chave própria (BYOK).
- Configuração reutilizável de assistentes.
- Recuperação de conhecimento e ferramentas.
- Processamento de texto e mídia.
- Canais voltados ao usuário.
- Trabalhos em segundo plano.
- Avaliação conversacional.

Você não precisa de todos os produtos para cada aplicação. Comece com inferência direta quando precisar apenas de uma resposta. Adicione outros produtos quando precisar:

- Reutilizar configurações do assistente.
- Pesquisar seus documentos.
- Conectar ferramentas ou canais.
- Processar muitos registros.
- Avaliar o comportamento.

## Escolha o ponto de partida certo

Use esta tabela quando souber a tarefa e precisar do primeiro produto para iniciar. Cada linha é um ponto de partida, não uma arquitetura completa.

| Objetivo | Comece com | Por quê |
| --- | --- | --- |
| Gerar ou analisar texto em uma única solicitação | [Inferência](https://docs.aivax.net/pt-br/docs/inference/chat-completions/concepts.md) | Chame um modelo hospedado ou BYOK por meio da API compatível com OpenAI sem criar configuração de assistente reutilizável. |
| Reutilizar instruções, conhecimento, ferramentas e configurações do modelo | [AI Gateway](https://docs.aivax.net/pt-br/docs/inference/ai-gateways/concepts.md) | Forneça à sua aplicação um runtime de assistente estável que possa evoluir sem reconstruir cada solicitação. |
| Pesquisar seus próprios documentos ou gerar respostas fundamentadas | [Coleções RAG](https://docs.aivax.net/pt-br/docs/rag/collections.md) | Armazene e indexe conhecimento para recuperação semântica, citações e contexto do gateway. |
| Reordenar candidatos já recuperados pela sua aplicação | [Rerankers](https://docs.aivax.net/pt-br/docs/rag/reranking.md) | Melhore a relevância sem exigir uma coleção gerenciada da AIVAX. |
| Publicar um assistente para usuários finais | [Clientes de chat](https://docs.aivax.net/pt-br/docs/inference/chat-clients/overview.md) | Conecte um gateway ao chat web ou integrações de mensagens suportadas com controle de sessão e canal. |
| Processar muitos registros independentes | [Batch](https://docs.aivax.net/pt-br/docs/inference/batch.md) | Execute um fluxo de trabalho repetível assincronamente com estado por item, validação, retentativas, custo e exportação. |
| Testar uma conversa completa de assistente | [Testes Agênticos](https://docs.aivax.net/pt-br/docs/inference/agentic-tests.md) | Simule um usuário orientado a objetivos e julgue o gateway em múltiplas rodadas. |
| Criar uma experiência de voz bidirecional de baixa latência | [Sessões de Voz](https://docs.aivax.net/pt-br/docs/inference/voice-session.md) | Transmita áudio do usuário e do assistente em uma sessão interativa em vez de combinar trabalhos de áudio separados. |

## Construa o runtime do assistente

Este é o caminho principal para um assistente que responde aos usuários. Comece aqui quando a aplicação precisar de uma chamada de modelo, configurações reutilizáveis, conhecimento ou ferramentas.

### Inferência e AI Gateways

A AIVAX expõe endpoints de listagem de modelos e conclusão de chat compatíveis com OpenAI. Use esta camada quando a aplicação precisar de uma resposta gerada.

- Use uma **chamada direta ao modelo** para exploração, geração pontual ou configuração que não precise ser reutilizada.
- Use um **AI Gateway** quando o mesmo modelo, instruções, coleções RAG, habilidades, ferramentas, moderação ou comportamento de saída devem atender a várias chamadas ou usuários.

A maioria dos assistentes em produção usa um gateway. A aplicação pode continuar chamando um único identificador enquanto a configuração do assistente muda independentemente. Os gateways podem usar modelos integrados da AIVAX ou provedores externos compatíveis com OpenAI.

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

### Conhecimento, recuperação e reranking

Uma [coleção RAG](https://docs.aivax.net/pt-br/docs/rag/collections.md) é uma biblioteca de conhecimento semântico. Use-a quando as respostas devem vir de seus próprios documentos.

1. Adicione documentos.
2. Teste-os com [Pesquisa Semântica](https://docs.aivax.net/pt-br/docs/rag/semantic-search.md).
3. Anexe a coleção a um AI Gateway quando o assistente deve responder com base nesse conhecimento.

A AIVAX também pode gerar respostas fundamentadas diretamente das coleções e expor a pesquisa de coleções por meio do [Collections MCP](https://docs.aivax.net/pt-br/docs/mcp-utilities/collections-mcp.md).

O reranking é uma etapa separada. Ele recebe uma consulta e documentos candidatos, retornando os candidatos em uma ordem mais relevante.

- Use uma coleção para armazenamento e recuperação gerenciados.
- Use a geração standalone de [reranking](https://docs.aivax.net/pt-br/docs/rag/reranking.md) quando sua aplicação já possui os candidatos.

### Habilidades e ferramentas

As [Habilidades](https://docs.aivax.net/pt-br/docs/inference/skills.md) empacotam instruções reutilizáveis e conhecimento operacional. Use-as quando o mesmo procedimento se aplicar a várias solicitações.

- Use uma habilidade quando o assistente precisar saber **como** realizar uma tarefa.
- Use RAG quando ele precisar recuperar **fatos ou material fonte** que possam crescer ou mudar independentemente.
- Use uma ferramenta quando o assistente precisar executar uma ação ou recuperar informações em tempo real.

Escolha entre:

- [Ferramentas integradas](https://docs.aivax.net/pt-br/docs/tools/builtin-tools.md) para capacidades fornecidas pela AIVAX.
- [MCP](https://docs.aivax.net/pt-br/docs/tools/mcp.md) para servidores do Protocolo de Contexto do Modelo e ecossistemas de ferramentas reutilizáveis.
- [Funções de protocolo](https://docs.aivax.net/pt-br/docs/tools/protocol-functions.md) para funções HTTP definidas pela sua aplicação.
- [Shell](https://docs.aivax.net/pt-br/docs/tools/shell.md) para execução controlada de comandos quando o caso de uso exigir.

Mantenha a superfície de ferramentas tão pequena quanto o trabalho do assistente permitir. Cada ferramenta adicional expande custo, latência, permissões e caminhos de falha.

## Processe texto, documentos e mídia

Use estes produtos quando a tarefa for uma transformação focada e não precisar de uma conversa de chat completa:

- [Classificação de texto](https://docs.aivax.net/pt-br/docs/data-processing/classification.md) atribui rótulos a um ou mais documentos.
- [Segmentação de texto](https://docs.aivax.net/pt-br/docs/data-processing/text-segmentation.md) divide conteúdo longo em pedaços úteis para indexação ou processamento posterior.
- [Descrições de mídia](https://docs.aivax.net/pt-br/docs/data-processing/media-descriptions.md) convertem imagens, áudio, vídeo e arquivos em texto que outro modelo ou fluxo de trabalho pode usar.
- [Geração de imagens](https://docs.aivax.net/pt-br/docs/generations/images.md) cria ou edita imagens.
- [Geração de fala](https://docs.aivax.net/pt-br/docs/generations/speech.md) converte texto em áudio.
- [Transcrição de áudio](https://docs.aivax.net/pt-br/docs/generations/audio-transcriptions.md) converte áudio em texto.

Escolha o caminho pelo que você precisa receber de volta:

- Use inferência multimodal direta quando o modelo de chat selecionado suportar a entrada e deve raciocinar sobre ela na mesma solicitação.
- Use um endpoint de geração focado quando precisar de um artefato reutilizável, uma transcrição, uma descrição ou uma etapa de pré-processamento.
- Para conjuntos de entrada grandes e independentes, execute a operação apropriada por meio do [Batch](https://docs.aivax.net/pt-br/docs/inference/batch.md).

Para áudio bidirecional interativo, use [Sessões de Voz](https://docs.aivax.net/pt-br/docs/inference/voice-session.md) em vez de encadear manualmente transcrição, inferência de texto e geração de fala.

## Entregue, escale e avalie

Use estes produtos após o runtime do assistente funcionar. Eles o publicam para usuários, o executam em muitos registros ou verificam se ele se comporta conforme o pretendido.

### Clientes de chat

Um [cliente de chat](https://docs.aivax.net/pt-br/docs/inference/chat-clients/overview.md) conecta um AI Gateway a um canal de usuário final. Use-o para um widget de navegador ou uma integração de mensagens suportada. Use a API de inferência diretamente quando seu próprio backend ou interface já gerenciar usuários, estado da conversa e entrega.

Um cliente de chat é responsável pela apresentação, comportamento da sessão, origens permitidas, uploads, respostas de áudio, integrações de canal e limites voltados ao usuário. O gateway continua sendo responsável pelo comportamento do assistente, como o modelo, instruções, RAG e ferramentas.

### Batch

O [Batch](https://docs.aivax.net/pt-br/docs/inference/batch.md) aplica um único fluxo de trabalho a dezenas ou milhares de registros independentes. Use-o quando cada registro for independente e o chamador não precisar de uma resposta imediata.

Um fluxo de trabalho define a instrução, o modelo ou gateway, saída estruturada, validação, ferramentas e política de retentativa. Um job então:

1. Importa itens.
2. Processa-os em segundo plano.
3. Expõe progresso e custo por item.
4. Exporta resultados.

Não use o Batch quando um item depender de outro ou quando um usuário precisar de uma resposta imediata. Use inferência direta para um resultado síncrono único e RAG para conhecimento pesquisável.

### Testes Agênticos

Os [Testes Agênticos](https://docs.aivax.net/pt-br/docs/inference/agentic-tests.md) avaliam o comportamento configurado de um AI Gateway ao longo de uma conversa delimitada. Um usuário simulado persegue um objetivo enquanto um juiz independente avalia o progresso.

- Use testes persistidos para cobertura de regressão reutilizável e agendada.
- Use uma avaliação efêmera para uma execução imediata única.

Uma execução de teste concluída não é automaticamente um resultado de comportamento bem-sucedido. Revise-os juntos:

- Resultado da execução.
- Resultado do juiz.
- Conversa retida.
- Uso.
- Custo.

## Operar e conectar a AIVAX

Use esta seção para rastrear custos, conectar um agente compatível ou operar a conta por scripts.

A AIVAX registra conversas e uso para que você possa rastrear o comportamento, atribuir custos e diagnosticar falhas. O painel e as APIs da conta expõem:

- Saldo da conta.
- Uso.
- Conversas.
- Recursos do Gateway.
- Transações de coleção.
- Itens do Batch.
- Execuções de Testes Agênticos.

Comece com [Preços](https://docs.aivax.net/pt-br/docs/pricing.md) e [Planos e limites](https://docs.aivax.net/pt-br/docs/limits.md) antes de habilitar um fluxo de trabalho de alto volume ou pesado em mídia.

A AIVAX também fornece utilitários MCP para agentes compatíveis:

- [Utilitário MCP de gerenciamento de conta](https://docs.aivax.net/pt-br/docs/mcp-utilities/account-management-mcp.md)
- [Utilitário MCP de coleções](https://docs.aivax.net/pt-br/docs/mcp-utilities/collections-mcp.md)
- [Utilitário MCP de documentação](https://docs.aivax.net/pt-br/docs/mcp-utilities/documentation-mcp.md)
- [Utilitário MCP de utilitários web](https://docs.aivax.net/pt-br/docs/mcp-utilities/web-utilities-mcp.md)
- [Utilitário MCP de geração de mídia](https://docs.aivax.net/pt-br/docs/mcp-utilities/media-generation-mcp.md)
- [Utilitário MCP de inferência](https://docs.aivax.net/pt-br/docs/mcp-utilities/inference-mcp.md)

Esses utilitários expõem as capacidades existentes da AIVAX por meio do MCP. Eles não substituem os produtos subjacentes de conta, coleção ou inferência.

Para operar uma conta a partir do terminal ou de scripts, instale o [CLI da AIVAX](https://docs.aivax.net/pt-br/docs/cli.md) com `npm install -g @aivax/cli`.

## Faça sua primeira solicitação

Use este caminho para a primeira conclusão de chat bem-sucedida. Ela chama um modelo hospedado ou um AI Gateway por meio da API compatível com OpenAI.

1. Crie uma chave **privada** na área de Chaves de API no painel da AIVAX.
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
        {"role": "user", "content": "Escreva uma mensagem de boas-vindas de uma frase."}
    ],
)

print(response.choices[0].message.content)
```

Substitua `<MODEL_OR_GATEWAY_ID>` por um nome de modelo hospedado da listagem de modelos ou por um identificador de AI Gateway. Em seguida, execute `python quickstart.py`.

Uma solicitação bem-sucedida imprime uma frase gerada. Se falhar, consulte [Solucionar problemas de solicitações](https://docs.aivax.net/pt-br/docs/inference/chat-completions/troubleshooting.md).

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Model%20listing)

## Inferência de longa duração

Use o host de inferência direta quando uma solicitação terminar com HTTP `524` ou um timeout de proxy enquanto a AIVAX ainda estiver processando:

```text
https://direct.inference.aivax.net/v1
```

A solicitação permanece síncrona, não é um trabalho em segundo plano.

1. Mantenha a conexão do cliente aberta até que a conclusão termine.
2. Configure um timeout do cliente que cubra o tempo de processamento esperado.
3. Use a mesma chave de API privada, identificador de modelo ou AI Gateway, mensagens e parâmetros de solicitação.
4. Altere o URL base do SDK e o timeout:

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

Use esta lista para confirmar que o host direto atende à chamada que você precisa. Ele serve apenas os endpoints abaixo. Caminhos, autenticação, corpos de solicitação e respostas são os mesmos de `https://inference.aivax.net`; apenas o host muda.

| Método | Caminho | Endpoint |
|---|---|---|
| `POST` | `/v1/chat/completions` ou `/api/v1/chat/completions` | [Completions de chat](https://docs.aivax.net/pt-br/docs/inference/chat-completions/concepts.md) com um modelo integrado ou um AI Gateway |
| `GET` | `/v1/models` ou `/api/v1/models` | [Listagem de modelos](#faça-sua-primeira-solicitação) |
| `POST` | `/api/v1/public/chat-clients/<access-key>/prompt` | [Enviar um prompt para uma sessão de chat-client](https://docs.aivax.net/pt-br/docs/inference/chat-clients/web-client.md#sending-prompts-from-your-application) |
| `POST` | `/api/v2/query`, `/api/v2/query/similar` ou `/api/v2/query/browse` | [Pesquisa](https://docs.aivax.net/pt-br/docs/rag/semantic-search.md) |
| `POST` | `/api/v1/answer` | [Geração de resposta RAG](https://docs.aivax.net/pt-br/docs/rag/document-filters.md#where-filters-are-supported) |
| `POST` | `/api/v1/generations/images` | [Geração de imagens](https://docs.aivax.net/pt-br/docs/generations/images.md) |
| `POST` | `/api/v1/generations/speech` | [Síntese de fala](https://docs.aivax.net/pt-br/docs/generations/speech.md) |
| `POST` | `/api/v1/generations/audio/transcriptions` | [Transcrição de áudio](https://docs.aivax.net/pt-br/docs/generations/audio-transcriptions.md) |
| `POST` | `/api/v1/generations/descriptions` | [Descrições de mídia](https://docs.aivax.net/pt-br/docs/data-processing/media-descriptions.md) |
| `POST` | `/api/v1/generations/classify` | [Classificação](https://docs.aivax.net/pt-br/docs/data-processing/classification.md) |
| `POST` | `/api/v1/generations/segment` | [Segmentação de texto](https://docs.aivax.net/pt-br/docs/data-processing/text-segmentation.md) |
| `POST` | `/api/v1/generations/decisions` | [Decisões](https://docs.aivax.net/pt-br/docs/data-processing/decisions.md) |
| `POST` | `/api/v1/generations/rerank` | [Reranking](https://docs.aivax.net/pt-br/docs/rag/reranking.md) |
| `POST` | `/api/v1/generations/agentic-tests` | [Avaliação de teste agêntrico efêmero](https://docs.aivax.net/pt-br/docs/inference/agentic-tests.md) |
| `POST` | `/api/v1/generations/teach-skill` | Ensinar habilidade a partir de um vídeo tutorial |
| `POST` | `/api/v1/web/fetch` | [Busca web e OCR](https://docs.aivax.net/pt-br/docs/web-foundation/fetch-and-ocr.md) |

Aliases de compatibilidade desses endpoints de geração, como `/api/v1/generations/validations` e `/api/v1/generations/reflex/rerank`, também são servidos.

Qualquer outro caminho retorna `404 Not Found` no host direto. Gerenciamento de conta, AI Gateway, coleção, documento, batch e outras APIs administrativas, incluindo pesquisa web, permanecem disponíveis apenas em `https://inference.aivax.net`.

Os endpoints mais propensos a precisar do host direto são:

- Completions de chat sem streaming com raciocínio longo ou muitas chamadas de ferramenta.
- Geração de imagens em modelos mais lentos.
- Descrições e transcrições de mídia de arquivos grandes.
- Ensinar habilidade.
- Prompts de chat-client que executam cadeias longas de ferramentas.

Completions de chat com streaming enviam dados continuamente e raramente precisam dele.

## Próximos passos

Após o sucesso da primeira solicitação, continue nesta ordem:

1. Faça sua primeira solicitação com o exemplo acima, depois leia [Inferência](https://docs.aivax.net/pt-br/docs/inference/chat-completions/concepts.md) para o contrato completo de solicitação.
2. Leia [Autenticação](https://docs.aivax.net/pt-br/docs/authentication.md) antes de escolher chaves privadas, chaves públicas ou sessões de chat para um limite de aplicação.
3. Revise [Preços](https://docs.aivax.net/pt-br/docs/pricing.md) e [Planos e limites](https://docs.aivax.net/pt-br/docs/limits.md) antes de aumentar o tráfego ou processar grandes coleções, mídia, testes ou jobs de Batch.
4. Mova o comportamento reutilizável do assistente para um [AI Gateway](https://docs.aivax.net/pt-br/docs/inference/ai-gateways/concepts.md), depois adicione RAG, habilidades, ferramentas e um cliente de chat apenas quando o caso de uso exigir.
