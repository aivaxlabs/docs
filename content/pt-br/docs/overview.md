---
{title: Bem-vindo,linkTitle: Bem-vindo,weight: 10,group: Introduction,aliases: [/docs/pt-br/getting-started.html,/docs/pt-br/platform/basics.html,/docs/pt-br/platform/models.html,/docs/pt-br/overview.html],sourceHash: e0484b3b1336bb4d}
---

# Bem-vindo

AIVAX é uma plataforma de orquestração de IA para construir, operar e avaliar aplicações de IA através de uma conta, superfície de API e carteira de faturamento. Ela combina modelos hospedados e bring-your-own-key (BYOK) com configuração reutilizável de assistente, recuperação de conhecimento, ferramentas, processamento de texto e mídia, canais voltados ao usuário, trabalhos em segundo plano e avaliação conversacional.

Você não precisa de todo produto para cada aplicação. Comece com inferência direta quando precisar apenas de uma resposta. Adicione outros produtos quando precisar reutilizar configurações de assistente, buscar em seus documentos, conectar ferramentas ou canais, processar muitos registros ou avaliar comportamento.

## Escolha o ponto de partida correto

| Objetivo | Começar com | Por quê |
| --- | --- | --- |
| Gerar ou analisar texto em uma única solicitação | [Inferência](inference/inference.md) | Chame um modelo hospedado ou BYOK através da API compatível com OpenAI sem criar configuração reutilizável de assistente. |
| Reutilizar instruções, conhecimento, ferramentas e configurações de modelo | [gateway de IA](inference/ai-gateway.md) | Forneça à sua aplicação um runtime de assistente estável que pode evoluir sem reconstruir cada solicitação. |
| Buscar em seus próprios documentos ou gerar respostas fundamentadas | [coleções RAG](rag/collections.md) | Armazene e indexe conhecimento para recuperação semântica, citações e contexto de gateway. |
| Reordenar candidatos já recuperados pela sua aplicação | [Reclassificadores](rag/reranking.md) | Melhore a relevância sem exigir uma coleção RIVAX gerenciada. |
| Publicar um assistente para usuários finais | [Clientes de chat](inference/chat-clients.md) | Conecte um gateway a chat web ou integrações de mensagens suportadas com controles de sessão e canal. |
| Processar muitos registros independentes | [Lote](inference/batch.md) | Execute um fluxo de trabalho repetível de forma assíncrona com estado por item, validação, tentativas, custo e exportação. |
| Testar uma conversa completa de assistente | [Testes de Agente](inference/agentic-tests.md) | Simule um usuário orientado a objetivo e julgue o gateway em múltiplas interações. |
| Construir uma experiência de voz bidirecional de baixa latência | [Sessões de voz](inference/voice-session.md) | Transmita áudio de usuário e assistente em uma sessão interativa ao invés de combinar trabalhos de áudio separados. |

## Construa o runtime do assistente

### Inferência e gateways de IA

AIVAX expõe listagens de modelos compatíveis com OpenAI e endpoints de conclusão de chat. Use uma **chamada direta de modelo** para exploração, geração pontual ou configuração que não precisa ser reutilizada. Use um **gateway de IA** quando o mesmo modelo, instruções, coleções RAG, habilidades, ferramentas, moderação ou comportamento de saída devem atender a múltiplas chamadas ou usuários.

A maioria dos assistentes de produção usa um gateway porque a aplicação pode continuar chamando um identificador enquanto a configuração do assistente muda independentemente. Gateways podem usar modelos integrados da AIVAX ou provedores externos compatíveis com OpenAI.

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

### Conhecimento, recuperação e reclassificação

Uma [coleção RAG](rag/collections.md) é uma biblioteca de conhecimento semântico. Adicione documentos, teste-os com [Busca Semântica](rag/semantic-search.md) e, em seguida, anexe a coleção a um gateway de IA quando o assistente deve responder a partir desse conhecimento. AIVAX também pode gerar respostas fundamentadas diretamente de coleções e expor busca de coleção através do [Collections MCP](mcp-utilities/collections-mcp.md).

A reclassificação é uma etapa separada: ela recebe uma consulta e documentos candidatos, então devolve os candidatos em ordem mais relevante. Use uma coleção para armazenamento e recuperação gerenciados; use a geração autônoma de [reclassificação](rag/reranking.md) quando sua aplicação já possui os candidatos.

### Habilidades e ferramentas

[Habilidades](inference/skills.md) empacotam instruções reutilizáveis e conhecimento operacional. Use uma habilidade quando o assistente precisa saber **como** executar uma tarefa. Use RAG quando precisar recuperar **fatos ou material de origem** que podem crescer ou mudar independentemente.

Ferramentas permitem que o assistente tome ações ou recupere informações ao vivo. Escolha entre:

- [Ferramentas internas](tools/builtin-tools.md) para recursos fornecidos pela AIVAX.
- [MCP](tools/mcp.md) para servidores Model Context Protocol e ecossistemas de ferramentas reutilizáveis.
- [Funções de protocolo](tools/protocol-functions.md) para funções HTTP definidas pela sua aplicação.
- [Shell](tools/shell.md) para execução controlada de comandos quando o caso de uso exigir.

Mantenha a superfície de ferramentas tão pequena quanto o trabalho do assistente permitir. Cada ferramenta adicional aumenta custo, latência, permissões e caminhos de falha.

## Processar texto, documentos e mídia

AIVAX inclui produtos de geração focada para trabalhos que não precisam de uma conversa completa de chat:

- [Classificação de texto](data-processing/classification.md) atribui rótulos a um ou mais documentos.
- [Segmentação de texto](data-processing/text-segmentation.md) divide conteúdo longo em blocos úteis para indexação ou processamento subsequente.
- [Descrições de mídia](data-processing/media-descriptions.md) converte imagens, áudio, vídeo e arquivos em texto que outro modelo ou fluxo de trabalho pode usar.
- [Geração de imagens](generations/images.md) cria ou edita imagens.
- [Geração de fala](generations/speech.md) transforma texto em áudio.
- [Transcrição de áudio](generations/audio-transcriptions.md) transforma áudio em texto.

Use inferência multimodal direta quando o modelo de chat selecionado suportar a entrada e precisar raciocinar sobre ela na mesma solicitação. Use um endpoint de geração focada quando precisar de um artefato reutilizável, transcrição, descrição ou etapa de pré‑processamento. Para grandes conjuntos de entrada independentes, execute a operação apropriada através de [Lote](inference/batch.md).

Para áudio bidirecional interativo, use [Sessões de voz](inference/voice-session.md) ao invés de encadear manualmente transcrição, inferência de texto e geração de fala.

## Entregar, escalar e avaliar

### Clientes de chat

Um [cliente de chat](inference/chat-clients.md) conecta um gateway de IA a um canal de usuário final. Ele controla apresentação, comportamento de sessão, origens permitidas, uploads, respostas de áudio, integrações de canal e limites voltados ao usuário. O gateway continua a controlar o comportamento do assistente, como modelo, instruções, RAG e ferramentas.

Use um cliente de chat para um widget de navegador ou integração de mensagens suportada. Use a API de inferência diretamente quando seu próprio backend ou interface já gerencia usuários, estado de conversa e entrega.

### Lote

[Lote](inference/batch.md) aplica um fluxo de trabalho a dezenas ou milhares de registros independentes. Um fluxo de trabalho define a instrução, modelo ou gateway, saída estruturada, validação, ferramentas e política de tentativas. Um trabalho importa itens, processa‑os em segundo plano, expõe progresso e custo por item e exporta resultados.

Não use Lote quando um item depende de outro ou quando um usuário precisa de resposta imediata. Use inferência direta para um resultado síncrono e RAG para conhecimento pesquisável.

### Testes de Agente

[Testes de Agente](inference/agentic-tests.md) avaliam o comportamento configurado de um gateway de IA ao longo de uma conversa delimitada. Um usuário simulado persegue um objetivo enquanto um juiz independente avalia o progresso. Use testes persistentes para cobertura de regressão reutilizável e agendada ou avaliação efêmera para uma execução única.

Uma execução de teste concluída não é automaticamente um resultado de comportamento bem‑sucedido. Revise o resultado da execução, o julgamento, a conversa mantida, uso e custo em conjunto.

## Operar e conectar AIVAX

AIVAX registra conversas e uso para que você possa rastrear comportamento, atribuir custo e diagnosticar falhas. O painel e as APIs de conta exponham saldo da conta, uso, conversas, recursos de gateway, transações de coleção, itens de Lote e execuções de Testes de Agente. Comece com [Preços](pricing.md) e [Planos e limites](limits.md) antes de habilitar um fluxo de trabalho de alto volume ou pesado em mídia.

AIVAX também fornece utilitários MCP para agentes compatíveis:

- [MCP de gerenciamento de conta](mcp-utilities/account-management-mcp.md)
- [MCP de coleções](mcp-utilities/collections-mcp.md)
- [MCP de documentação](mcp-utilities/documentation-mcp.md)
- [MCP de utilitários web](mcp-utilities/web-utilities-mcp.md)
- [MCP de geração de mídia](mcp-utilities/media-generation-mcp.md)
- [MCP de inferência](mcp-utilities/inference-mcp.md)

Esses utilitários expõem capacidades existentes da AIVAX através do MCP; eles não substituem a conta, coleção ou produtos de inferência subjacentes.

## Faça sua primeira solicitação

Crie uma chave **privada** na área de Chaves de API do painel AIVAX e armazene‑a como um segredo, por exemplo em uma variável de ambiente chamada `AIVAX_API_KEY`. Em seguida, instale o SDK OpenAI com `python -m pip install openai` e crie `quickstart.py`:

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

Substitua `<MODEL_OR_GATEWAY_ID>` por um nome de modelo hospedado da listagem de modelos ou por um identificador de gateway de IA, então execute `python quickstart.py`. Uma solicitação bem‑sucedida imprime uma frase gerada. Se falhar, veja [Solucionar solicitações](inference/inference.md#troubleshoot-requests).

<script src="https://inference.aivax.net/apidocs?embed-target=Model%20listing&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Próximos passos

1. Faça sua primeira solicitação com o exemplo acima, então leia [Inferência](inference/inference.md) para o contrato completo de solicitação.  
2. Leia [Autenticação](authentication.md) antes de escolher chaves privadas, chaves públicas ou sessões de chat para um limite de aplicação.  
3. Revise [Preços](pricing.md) e [Planos e limites](limits.md) antes de aumentar tráfego ou processar grandes coleções, mídia, testes ou trabalhos de Lote.  
4. Mova o comportamento reutilizável do assistente para um [gateway de IA](inference/ai-gateway.md), então adicione RAG, habilidades, ferramentas e um cliente de chat somente quando o caso de uso exigir.
