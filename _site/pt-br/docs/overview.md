Source: http://localhost:1313/pt-br/docs/overview.html

# Visão geral

AIVAX é uma plataforma de orquestração de IA para construir, operar e avaliar aplicações de IA através de uma única conta, superfície de API e carteira de cobrança. Ela combina modelos hospedados e bring-your-own-key (BYOK) com configuração reutilizável de assistente, recuperação de conhecimento, ferramentas, processamento de texto e mídia, canais voltados ao usuário, jobs em segundo plano e avaliação conversacional.

Você não precisa de todos os produtos para cada aplicação. Comece com inferência direta quando precisar apenas de uma resposta. Adicione outros produtos quando precisar reutilizar configurações de assistente, pesquisar seus documentos, conectar ferramentas ou canais, processar muitos registros ou avaliar comportamento.

## Escolha o ponto de partida correto

| Objetivo | Comece com | Por quê |
| --- | --- | --- |
| Gerar ou analisar texto em uma solicitação | [Inferência](http://localhost:1313/pt-br/docs/inference/inference.md) | Chame um modelo hospedado ou BYOK através da API compatível com OpenAI sem criar configuração reutilizável de assistente. |
| Reutilizar instruções, conhecimento, ferramentas e configurações de modelo | [Gateway de IA](http://localhost:1313/pt-br/docs/inference/ai-gateway.md) | Forneça à sua aplicação um runtime estável de assistente que pode evoluir sem reconstruir cada requisição. |
| Pesquisar seus próprios documentos ou gerar respostas fundamentadas | [Coleções RAG](http://localhost:1313/pt-br/docs/rag/collections.md) | Armazene e indexe conhecimento para recuperação semântica, citações e contexto de gateway. |
| Reordenar candidatos que sua aplicação já recuperou | [Reclassificadores](http://localhost:1313/pt-br/docs/rag/reranking.md) | Melhore a relevância sem exigir uma coleção gerenciada da AIVAX. |
| Publicar um assistente para usuários finais | [Clientes de chat](http://localhost:1313/pt-br/docs/features/chat-clients.md) | Conecte um gateway a um chat web ou integrações de mensagens suportadas com controle de sessão e canal. |
| Processar muitos registros independentes | [Lote](http://localhost:1313/pt-br/docs/features/batch.md) | Execute um fluxo de trabalho repetível de forma assíncrona com estado por item, validação, tentativas, custo e exportação. |
| Testar uma conversa completa de assistente | [Testes Agentes](http://localhost:1313/pt-br/docs/inference/agentic-tests.md) | Simule um usuário orientado a objetivo e julgue o gateway em múltiplas interações. |
| Construir uma experiência de voz bidirecional de baixa latência | [Sessões de voz](http://localhost:1313/pt-br/docs/inference/voice-session.md) | Transmita áudio de usuário e assistente em uma sessão interativa ao invés de combinar jobs de áudio separados. |

## Construa o runtime do assistente

### Inferência e Gateways de IA

AIVAX expõe listagem de modelos e endpoints de conclusão de chat compatíveis com OpenAI. Use uma **chamada direta de modelo** para exploração, geração pontual ou configuração que não precise ser reutilizada. Use um **Gateway de IA** quando o mesmo modelo, instruções, coleções RAG, habilidades, ferramentas, moderação ou comportamento de saída devem atender a múltiplas chamadas ou usuários.

A maioria dos assistentes de produção usa um gateway porque a aplicação pode continuar chamando um identificador enquanto a configuração do assistente muda de forma independente. Gateways podem usar modelos integrados da AIVAX ou provedores externos compatíveis com OpenAI.

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

### Conhecimento, recuperação e reclassificação

Uma [Coleção RAG](http://localhost:1313/pt-br/docs/rag/collections.md) é uma biblioteca de conhecimento semântico. Adicione documentos, teste-os com [Pesquisa Semântica](http://localhost:1313/pt-br/docs/rag/semantic-search.md) e, em seguida, anexe a coleção a um Gateway de IA quando o assistente deve responder a partir desse conhecimento. AIVAX também pode gerar respostas fundamentadas diretamente de coleções e expor a busca de coleções através de [Collections MCP](http://localhost:1313/pt-br/docs/mcp-utilities/collections-mcp.md).

A reclassificação é uma etapa separada: ela recebe uma consulta e documentos candidatos, então devolve os candidatos em ordem mais relevante. Use uma coleção para armazenamento e recuperação gerenciados; use a geração independente de [reclassificação](http://localhost:1313/pt-br/docs/rag/reranking.md) quando sua aplicação já possui os candidatos.

### Habilidades e ferramentas

[Habilidades](http://localhost:1313/pt-br/docs/features/skills.md) empacotam instruções reutilizáveis e conhecimento operacional. Use uma habilidade quando o assistente precisa saber **como** executar uma tarefa. Use RAG quando precisar recuperar **fatos ou material de origem** que podem crescer ou mudar de forma independente.

Ferramentas permitem que o assistente execute ações ou recupere informações ao vivo. Escolha entre:

- [Ferramentas integradas](http://localhost:1313/pt-br/docs/tools/builtin-tools.md) para capacidades fornecidas pela AIVAX.
- [MCP](http://localhost:1313/pt-br/docs/tools/mcp.md) para servidores de Protocolo de Contexto de Modelo e ecossistemas de ferramentas reutilizáveis.
- [Funções de protocolo](http://localhost:1313/pt-br/docs/tools/protocol-functions.md) para funções HTTP definidas pela sua aplicação.
- [Shell](http://localhost:1313/pt-br/docs/tools/shell.md) para execução controlada de comandos quando o caso de uso requer isso.

Mantenha a superfície de ferramentas tão pequena quanto o trabalho do assistente permite. Cada ferramenta adicional aumenta custo, latência, permissões e caminhos de falha.

## Processar texto, documentos e mídia

AIVAX inclui produtos de geração focada para trabalhos que não precisam de uma conversa completa de chat:

- [Classificação de texto](http://localhost:1313/pt-br/docs/rag/classification.md) atribui rótulos a um ou mais documentos.
- [Segmentação de texto](http://localhost:1313/pt-br/docs/rag/text-segmentation.md) divide conteúdo longo em blocos úteis para indexação ou processamento subsequente.
- [Descrições de mídia](http://localhost:1313/pt-br/docs/generations/media-descriptions.md) convertem imagens, áudio, vídeo e arquivos em texto que outro modelo ou fluxo de trabalho pode usar.
- [Geração de imagens](http://localhost:1313/pt-br/docs/generations/images.md) cria ou edita imagens.
- [Geração de fala](http://localhost:1313/pt-br/docs/generations/speech.md) transforma texto em áudio.
- [Transcrição de áudio](http://localhost:1313/pt-br/docs/generations/audio-transcriptions.md) transforma áudio em texto.

Use inferência multimodal direta quando o modelo de chat selecionado suportar a entrada e precisar raciocinar sobre ela na mesma requisição. Use um endpoint de geração focada quando precisar de um artefato reutilizável, transcrição, descrição ou etapa de pré-processamento. Para grandes conjuntos de entrada independentes, execute a operação apropriada através de [Lote](http://localhost:1313/pt-br/docs/features/batch.md).

Para áudio bidirecional interativo, use [Sessões de voz](http://localhost:1313/pt-br/docs/inference/voice-session.md) ao invés de encadear manualmente transcrição, inferência de texto e geração de fala.

## Entregar, dimensionar e avaliar

### Clientes de chat

Um [cliente de chat](http://localhost:1313/pt-br/docs/features/chat-clients.md) conecta um Gateway de IA a um canal de usuário final. Ele controla apresentação, comportamento de sessão, origens permitidas, uploads, respostas de áudio, integrações de canal e limites voltados ao usuário. O gateway continua a controlar o comportamento do assistente, como modelo, instruções, RAG e ferramentas.

Use um cliente de chat para um widget de navegador ou integração de mensagens suportada. Use a API de inferência diretamente quando seu próprio backend ou interface já gerencia usuários, estado da conversa e entrega.

### Lote

[Lote](http://localhost:1313/pt-br/docs/features/batch.md) aplica um fluxo de trabalho a dezenas ou milhares de registros independentes. Um fluxo de trabalho define instrução, modelo ou gateway, saída estruturada, validação, ferramentas e política de tentativas. Um job importa itens, processa-os em segundo plano, expõe progresso e custo por item e exporta resultados.

Não use Lote quando um item depende de outro ou quando o usuário precisa de resposta imediata. Use inferência direta para um resultado síncrono e RAG para conhecimento pesquisável.

### Testes Agentes

[Testes Agentes](http://localhost:1313/pt-br/docs/inference/agentic-tests.md) avaliam o comportamento configurado de um Gateway de IA ao longo de uma conversa delimitada. Um usuário simulado persegue um objetivo enquanto um juiz independente avalia o progresso. Use testes persistentes para cobertura de regressão reutilizável e agendada ou uma avaliação efêmera para uma execução única.

Uma execução de teste concluída não é automaticamente um resultado de comportamento bem‑sucedido. Revise o resultado da execução, o julgamento, a conversa retida, o uso e o custo em conjunto.

## Operar e conectar AIVAX

AIVAX registra conversas e uso para que você possa rastrear comportamento, atribuir custo e diagnosticar falhas. O painel e as APIs de conta expõem saldo da conta, uso, conversas, recursos de gateway, transações de coleções, itens de lote e execuções de Testes Agentes. Comece com [Pricing](http://localhost:1313/pt-br/docs/pricing.md) e [Plans and limits](http://localhost:1313/pt-br/docs/limits.md) antes de habilitar um fluxo de trabalho de alto volume ou pesado em mídia.

AIVAX também fornece utilitários MCP para agentes compatíveis:

- [MCP de gerenciamento de conta](http://localhost:1313/pt-br/docs/mcp-utilities/account-management-mcp.md)
- [MCP de coleções](http://localhost:1313/pt-br/docs/mcp-utilities/collections-mcp.md)
- [MCP de documentação](http://localhost:1313/pt-br/docs/mcp-utilities/documentation-mcp.md)
- [MCP de utilitários web](http://localhost:1313/pt-br/docs/mcp-utilities/web-utilities-mcp.md)
- [MCP de geração de mídia](http://localhost:1313/pt-br/docs/mcp-utilities/media-generation-mcp.md)
- [MCP de inferência](http://localhost:1313/pt-br/docs/mcp-utilities/inference-mcp.md)

Esses utilitários expõem capacidades existentes da AIVAX através de MCP; eles não substituem os produtos subjacentes de conta, coleção ou inferência.

## Próximos passos

1. Siga o [Começando](http://localhost:1313/pt-br/docs/getting-started.md) para criar e verificar sua primeira conclusão de chat.  
2. Leia a [Autenticação](http://localhost:1313/pt-br/docs/authentication.md) antes de escolher chaves privadas, chaves públicas ou sessões de chat para o limite da aplicação.  
3. Revise os [Preços](http://localhost:1313/pt-br/docs/pricing.md) e [Planos e limites](http://localhost:1313/pt-br/docs/limits.md) antes de aumentar tráfego ou processar grandes coleções, mídia, testes ou jobs de Lote.  
4. Mova o comportamento reutilizável do assistente para um [Gateway de IA](http://localhost:1313/pt-br/docs/inference/ai-gateway.md), então adicione RAG, habilidades, ferramentas e um cliente de chat somente quando o caso de uso exigir.
