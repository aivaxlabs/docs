Source: https://docs.aivax.net/pt-br/docs/overview.html

# Visão geral

AIVAX é uma plataforma de orquestração de IA para construir, operar e avaliar aplicações de IA através de uma única conta, superfície de API e carteira de faturamento. Ela combina modelos hospedados e bring-your-own-key (BYOK) com configuração reutilizável de assistente, recuperação de conhecimento, ferramentas, processamento de texto e mídia, canais voltados ao usuário, jobs em segundo plano e avaliação conversacional.

Você não precisa de todos os produtos para cada aplicação. Comece com inferência direta para uma resposta, depois adicione os produtos que resolvem um requisito específico de reutilização, conhecimento, integração, escala ou qualidade.

## Escolha o ponto de partida adequado

| Goal | Start with | Why |
| --- | --- | --- |
| Gerar ou analisar texto em uma única requisição | [Inferência](https://docs.aivax.net/pt-br/docs/inference/inference.md) | Chame um modelo hospedado ou BYOK através da API compatível com OpenAI sem criar uma configuração reutilizável de assistente. |
| Reutilizar instruções, conhecimento, ferramentas e configurações de modelo | [Portal de IA](https://docs.aivax.net/pt-br/docs/inference/ai-gateway.md) | Forneça à sua aplicação um runtime de assistente estável que pode evoluir sem reconstruir cada requisição. |
| Pesquisar seus próprios documentos ou gerar respostas fundamentadas | [Coleções RAG](https://docs.aivax.net/pt-br/docs/rag/collections.md) | Armazene e indexe conhecimento para recuperação semântica, citações e contexto do portal. |
| Reordenar candidatos já recuperados pela sua aplicação | [Reordenadores](https://docs.aivax.net/pt-br/docs/rag/reranking.md) | Melhore a relevância sem exigir uma coleção AIVAX gerenciada. |
| Publicar um assistente para usuários finais | [Clientes de chat](https://docs.aivax.net/pt-br/docs/features/chat-clients.md) | Conecte um portal a chat web ou integrações de mensagens suportadas com controles de sessão e canal. |
| Processar muitos registros independentes | [Lote](https://docs.aivax.net/pt-br/docs/features/batch.md) | Execute um fluxo de trabalho repetível de forma assíncrona com estado por item, validação, tentativas, custo e exportação. |
| Testar uma conversa completa de assistente | [Testes Agentes](https://docs.aivax.net/pt-br/docs/inference/agentic-tests.md) | Simule um usuário orientado a objetivo e julgue o portal ao longo de múltiplas interações. |
| Construir uma experiência de voz bidirecional de baixa latência | [Sessões de voz](https://docs.aivax.net/pt-br/docs/inference/voice-session.md) | Transmita áudio do usuário e do assistente em uma sessão interativa ao invés de combinar jobs de áudio separados. |

## Construa o runtime do assistente

### Inferência e Portais de IA

AIVAX expõe listagem de modelos compatíveis com OpenAI e endpoints de conclusão de chat. Use uma **chamada direta de modelo** para exploração, geração única ou configuração que não precisa ser reutilizada. Use um **Portal de IA** quando o mesmo modelo, instruções, coleções RAG, habilidades, ferramentas, moderação ou comportamento de saída devem atender a múltiplas chamadas ou usuários.

A maioria dos assistentes de produção usa um portal porque a aplicação pode continuar chamando um identificador enquanto a configuração do assistente muda independentemente. Portais podem usar modelos AIVAX integrados ou provedores externos compatíveis com OpenAI.

Production API base URL:

```text
https://inference.aivax.net
```

OpenAI-compatible SDK base URL:

```text
https://inference.aivax.net/v1
```

Reference:

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Inference%20(chat%20completions))

### Conhecimento, recuperação e reordenação

Uma [coleção RAG](https://docs.aivax.net/pt-br/docs/rag/collections.md) é uma biblioteca de conhecimento semântico. Adicione documentos, teste-os com [Busca Semântica](https://docs.aivax.net/pt-br/docs/rag/semantic-search.md) e então anexe a coleção a um Portal de IA quando o assistente deve responder a partir desse conhecimento. AIVAX também pode gerar respostas fundamentadas diretamente das coleções e expor a busca de coleções através de [Collections MCP](https://docs.aivax.net/pt-br/docs/mcp-utilities/collections-mcp.md).

A reordenação é uma etapa separada: ela recebe uma consulta e documentos candidatos, então retorna os candidatos em ordem mais relevante. Use uma coleção para armazenamento e recuperação gerenciados; use a geração [reordenadora](https://docs.aivax.net/pt-br/docs/rag/reranking.md) independente quando sua aplicação já possui os candidatos.

### Habilidades e ferramentas

[Habilidades](https://docs.aivax.net/pt-br/docs/features/skills.md) empacotam instruções reutilizáveis e conhecimento operacional. Use uma habilidade quando o assistente precisa saber **como** executar uma tarefa. Use RAG quando ele precisa recuperar **fatos ou material de origem** que podem crescer ou mudar independentemente.

Ferramentas permitem que o assistente tome ações ou recupere informações em tempo real. Escolha entre:

- [Ferramentas embutidas](https://docs.aivax.net/pt-br/docs/tools/builtin-tools.md) para recursos fornecidos pela AIVAX.
- [MCP](https://docs.aivax.net/pt-br/docs/tools/mcp.md) para servidores de Protocolo de Contexto de Modelo e ecossistemas de ferramentas reutilizáveis.
- [Funções de protocolo](https://docs.aivax.net/pt-br/docs/tools/protocol-functions.md) para funções HTTP definidas pela sua aplicação.
- [Shell](https://docs.aivax.net/pt-br/docs/tools/shell.md) para execução controlada de comandos quando o caso de uso requer.

Mantenha a superfície de ferramentas tão pequena quanto o trabalho do assistente permite. Cada ferramenta adicional aumenta custo, latência, permissões e caminhos de falha.

## Processar texto, documentos e mídia

AIVAX inclui produtos de geração focada para trabalhos que não precisam de uma conversa completa de chat:

- [Classificação de texto](https://docs.aivax.net/pt-br/docs/rag/classification.md) atribui rótulos a um ou mais documentos.
- [Segmentação de texto](https://docs.aivax.net/pt-br/docs/rag/text-segmentation.md) divide conteúdo longo em blocos úteis para indexação ou processamento subsequente.
- [Descrições de mídia](https://docs.aivax.net/pt-br/docs/generations/media-descriptions.md) converte imagens, áudio, vídeo e arquivos em texto que outro modelo ou fluxo de trabalho pode usar.
- [Geração de imagens](https://docs.aivax.net/pt-br/docs/generations/images.md) cria ou edita imagens.
- [Geração de fala](https://docs.aivax.net/pt-br/docs/generations/speech.md) transforma texto em áudio.
- [Transcrição de áudio](https://docs.aivax.net/pt-br/docs/generations/audio-transcriptions.md) transforma áudio em texto.

Use inferência multimodal direta quando o modelo de chat selecionado suporta a entrada e deve raciocinar sobre ela na mesma requisição. Use um endpoint de geração focada quando precisar de um artefato reutilizável, uma transcrição, uma descrição ou uma etapa de pré-processamento. Para grandes conjuntos de entradas independentes, execute a operação adequada através de [Lote](https://docs.aivax.net/pt-br/docs/features/batch.md).

Para áudio interativo bidirecional, use [Sessões de voz](https://docs.aivax.net/pt-br/docs/inference/voice-session.md) ao invés de encadear manualmente transcrição, inferência de texto e geração de fala.

## Entregar, escalar e avaliar

### Clientes de chat

Um [cliente de chat](https://docs.aivax.net/pt-br/docs/features/chat-clients.md) conecta um Portal de IA a um canal de usuário final. Ele controla a apresentação, comportamento de sessão, origens permitidas, uploads, respostas de áudio, integrações de canal e limites voltados ao usuário. O portal continua a controlar o comportamento do assistente, como modelo, instruções, RAG e ferramentas.

Use um cliente de chat para um widget de navegador ou integração de mensagens suportada. Use a API de inferência diretamente quando seu próprio backend ou interface já gerencia usuários, estado da conversa e entrega.

### Lote

[Lote](https://docs.aivax.net/pt-br/docs/features/batch.md) aplica um fluxo de trabalho a dezenas ou milhares de registros independentes. Um fluxo de trabalho define a instrução, modelo ou portal, saída estruturada, validação, ferramentas e política de tentativa. Um job importa itens, processa-os em segundo plano, expõe progresso e custo por item e exporta resultados.

Não use Lote quando um item depende de outro ou quando um usuário precisa de uma resposta imediata. Use inferência direta para um resultado síncrono e RAG para conhecimento pesquisável.

### Testes Agentes

[Testes Agentes](https://docs.aivax.net/pt-br/docs/inference/agentic-tests.md) avaliam o comportamento configurado de um Portal de IA ao longo de uma conversa delimitada. Um usuário simulado persegue um objetivo enquanto um juiz independente avalia o progresso. Use testes persistentes para cobertura de regressão reutilizável e agendada ou uma avaliação efêmera para uma execução imediata.

Uma execução de teste concluída não é automaticamente um resultado de comportamento bem-sucedido. Revise o resultado da execução, o julgamento, a conversa retida, o uso e o custo em conjunto.

## Operar e conectar AIVAX

AIVAX registra conversas e uso para que você possa rastrear comportamento, atribuir custo e diagnosticar falhas. O painel e as APIs de conta expõem saldo da conta, uso, conversas, recursos de portal, transações de coleção, itens de Lote e execuções de Testes Agentes. Comece com [Preços](https://docs.aivax.net/pt-br/docs/pricing.md) e [Planos e limites](https://docs.aivax.net/pt-br/docs/limits.md) antes de habilitar um fluxo de trabalho de alto volume ou pesado em mídia.

AIVAX também fornece utilitários MCP para agentes compatíveis:

- [MCP de gerenciamento de conta](https://docs.aivax.net/pt-br/docs/mcp-utilities/account-management-mcp.md)
- [MCP de coleções](https://docs.aivax.net/pt-br/docs/mcp-utilities/collections-mcp.md)
- [MCP de documentação](https://docs.aivax.net/pt-br/docs/mcp-utilities/documentation-mcp.md)
- [MCP de utilitários web](https://docs.aivax.net/pt-br/docs/mcp-utilities/web-utilities-mcp.md)
- [MCP de geração de mídia](https://docs.aivax.net/pt-br/docs/mcp-utilities/media-generation-mcp.md)
- [MCP de inferência](https://docs.aivax.net/pt-br/docs/mcp-utilities/inference-mcp.md)

Esses utilitários expõem as capacidades existentes da AIVAX através de MCP; eles não substituem os produtos subjacentes de conta, coleção ou inferência.

## Próximos passos

1. Siga o [Começando](https://docs.aivax.net/pt-br/docs/getting-started.md) para fazer e verificar sua primeira conclusão de chat.  
2. Leia a [Autenticação](https://docs.aivax.net/pt-br/docs/authentication.md) antes de escolher chaves privadas, chaves públicas ou sessões de chat para um limite de aplicação.  
3. Revise [Preços](https://docs.aivax.net/pt-br/docs/pricing.md) e [Planos e limites](https://docs.aivax.net/pt-br/docs/limits.md) antes de aumentar o tráfego ou processar grandes coleções, mídia, testes ou jobs de Lote.  
4. Mova o comportamento reutilizável do assistente para um [Portal de IA](https://docs.aivax.net/pt-br/docs/inference/ai-gateway.md), então adicione RAG, habilidades, ferramentas e um cliente de chat somente quando o caso de uso exigir.
