---
{title: Levando um Gateway de IA para Produção,linkTitle: Ir para produção,weight: 50,group: AI Gateways,sourceHash: 18d67e56c19da49b,aliases: [/docs/pt-br/inference/ai-gateways/going-to-production.html]}
---

# Levando um Gateway de IA para produção

Comece com uma configuração conservadora: instruções de sistema claras, um modelo que suporte as modalidades e ferramentas necessárias, uma coleção RAG bem preparada e apenas as ferramentas realmente necessárias. Adicione recursos um por vez e meça seu impacto na qualidade, custo e latência.

## Instruções do sistema

Escreva as instruções do sistema de modo que o modelo entenda seu papel, o público-alvo, as fontes da verdade e os limites. Inclua quando usar RAG, quando usar ferramentas e como responder quando as informações estão indisponíveis. Evite repetir configurações operacionais que já existem no gateway, como limites de truncamento ou listas de ferramentas.

Se seus prompts atualmente residem em OpenAI Prompt Objects ou Agent Builder, consulte [o que você perde quando eles são descontinuados e onde cada peça pode viver](https://aivax.net/blog/openai-prompt-objects-agent-builder-shutdown-what-you-lose/).

## Conhecimento

Vincule coleções a documentos curtos, autocontidos e bem nomeados, e escolha a estratégia de consulta com base no tipo de conversa; veja [Conhecimento (RAG)](concepts.md#knowledge-rag). Comece com uma contagem pequena de resultados e aumente-a apenas quando o modelo não tiver evidências suficientes, pois cada resultado adiciona tokens de entrada.

## Ferramentas

Ative apenas ferramentas com um papel claro. As ferramentas integradas cobrem capacidades comuns. O MCP externo é melhor quando você já possui um servidor MCP com ferramentas de negócios. Funções de protocolo são úteis quando deseja expor callbacks HTTP específicos sem instalar um servidor MCP completo. Cada ferramenta adiciona seu nome, descrição e esquema a cada solicitação; veja [como medir e reduzir tokens de definição de ferramentas](https://aivax.net/blog/reduce-mcp-tool-definition-tokens-too-many-tools/).

Use um manipulador de ferramentas apenas quando o modelo selecionado precisar de ajuda para produzir chamadas de ferramenta.

## Memória

Ao ativar a [memória](/docs/pt-br/tools/builtin-tools.md#memory), defina o que o assistente pode reter e quando deve chamar `memory_search`: as memórias não são incluídas automaticamente nas instruções do sistema. Por padrão, as memórias são compartilhadas entre os gateways da conta para o mesmo usuário identificado; desative o compartilhamento de memórias para restringir um gateway às suas próprias memórias. As memórias expiram apenas quando salvas com `expiresInDays`. Planeje como seu aplicativo revisará e removerá documentos na coleção `@memories`. O [guia de envenenamento de memória](https://aivax.net/blog/persistent-memory-is-a-write-path/) detalha esses controles.

## Workers e moderação

Use workers quando um sistema externo precisar tomar uma decisão durante o fluxo de inferência. Como o worker é chamado no caminho crítico, mantenha-o rápido e determinístico.

Quando você habilita a moderação, consulte [Moderação de entrada LLM: prompt do sistema ou etapa de moderação separada?](https://aivax.net/blog/aivax-gateway-moderation/) para saber o que ela cobre, seu comportamento em caso de falha e o que ainda requer verificações em nível de aplicação.

## Integração do cliente

- Mantenha as chaves privadas no servidor. Use uma chave pública ou um [cliente de chat](/docs/pt-br/inference/chat-clients.md) para código executado em um navegador.
- Envie um único [`conversation_token`](/docs/pt-br/inference/chat-completions/session-reuse.md) por conversa e armazene os IDs de mensagem retornados pelo AIVAX.
- Configure retentativas para respostas `429` e `503`; veja [Solução de problemas](/docs/pt-br/inference/chat-completions/troubleshooting.md).
- Use [streaming](/docs/pt-br/inference/chat-completions/streaming.md) para chats voltados ao usuário, ou o host de inferência direta para solicitações longas sem streaming.

## Valide antes do lançamento

Valide a configuração com um [cenário de usuário simulado e juiz LLM](/docs/pt-br/inference/agentic-tests.md) antes de confiá-la à produção, e execute os mesmos cenários novamente após alterar o modelo, as instruções ou as ferramentas.

Revise [Preços](/docs/pt-br/pricing.md) e [Planos e limites](/docs/pt-br/limits.md) antes de aumentar o tráfego.
