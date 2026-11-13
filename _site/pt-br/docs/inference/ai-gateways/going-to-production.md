Source: https://docs.aivax.net/pt-br/docs/inference/ai-gateways/going-to-production.html

# Levando um Gateway de IA para produção

Comece com uma configuração conservadora: instruções de sistema claras, um modelo que suporte as modalidades e ferramentas necessárias, uma coleção RAG bem preparada e apenas as ferramentas realmente necessárias. Adicione recursos um por vez e meça seu impacto na qualidade, no custo e na latência.

## Instruções de sistema

Escreva as instruções de sistema de modo que o modelo entenda seu papel, o público-alvo, as fontes de verdade e os limites. Inclua quando usar RAG, quando usar ferramentas e como responder quando a informação estiver indisponível. Evite repetir configurações operacionais que já existem no gateway, como limites de truncamento ou listas de ferramentas.

Se seus prompts atualmente estão no OpenAI Prompt Objects ou Agent Builder, veja [o que você perde quando eles são encerrados e onde cada parte pode residir](https://aivax.net/blog/openai-prompt-objects-agent-builder-shutdown-what-you-lose/).

## Conhecimento

Vincule coleções a documentos curtos, autocontidos e bem nomeados, e escolha a estratégia de consulta conforme o tipo de conversa; veja [Conhecimento (RAG)](https://docs.aivax.net/pt-br/docs/inference/ai-gateways/concepts.md#knowledge-rag). Comece com uma contagem pequena de resultados e aumente-a apenas quando o modelo não tiver evidências suficientes, pois cada resultado adiciona tokens de entrada.

## Ferramentas

Ative apenas ferramentas com um papel claro. As ferramentas integradas cobrem capacidades comuns. O MCP externo é melhor quando você já possui um servidor MCP com ferramentas de negócios. Funções de protocolo são úteis quando você deseja expor callbacks HTTP específicos sem instalar um servidor MCP completo. Cada ferramenta adiciona seu nome, descrição e esquema a cada solicitação; veja [como medir e reduzir tokens de definição de ferramentas](https://aivax.net/blog/reduce-mcp-tool-definition-tokens-too-many-tools/).

Use um manipulador de ferramentas apenas quando o modelo selecionado precisar de ajuda para produzir chamadas de ferramenta.

## Memória

Ao ativar a [memória](https://docs.aivax.net/pt-br/docs/tools/builtin-tools.md#memory), defina o que o assistente pode reter e quando deve chamar `memory_search`: as memórias não são incluídas automaticamente nas instruções de sistema. Por padrão, as memórias são compartilhadas entre os gateways da conta para o mesmo usuário identificado; desative o compartilhamento de memórias para restringir um gateway às suas próprias memórias. As memórias expiram apenas quando salvas com `expiresInDays`. Planeje como seu aplicativo revisará e removerá documentos na coleção `@memories`. O [guia de envenenamento de memória](https://aivax.net/blog/persistent-memory-is-a-write-path/) detalha esses controles.

## Workers e moderação

Use workers quando um sistema externo precisar tomar uma decisão durante o fluxo de inferência. Como o worker é chamado no caminho crítico, mantenha-o rápido e determinístico.

Ao ativar a moderação, consulte [Moderação de entrada LLM: prompt de sistema ou etapa de moderação separada?](https://aivax.net/blog/aivax-gateway-moderation/) para saber o que ela cobre, seu comportamento em caso de falha e o que ainda precisa de verificações em nível de aplicação.

## Integração do cliente

- Mantenha as chaves privadas no servidor. Use uma chave pública ou um [cliente de chat](https://docs.aivax.net/pt-br/docs/inference/chat-clients/overview.md) para código executado em um navegador.
- Envie um único [`conversation_token`](https://docs.aivax.net/pt-br/docs/inference/chat-completions/session-reuse.md) por conversa e armazene os IDs de mensagem retornados pela AIVAX.
- Configure retentativas para respostas `429` e `503`; veja [Solução de problemas](https://docs.aivax.net/pt-br/docs/inference/chat-completions/troubleshooting.md).
- Use [streaming](https://docs.aivax.net/pt-br/docs/inference/chat-completions/streaming.md) para chats voltados ao usuário, ou o host de inferência direta para solicitações longas sem streaming.

## Valide antes do lançamento

Valide a configuração com um [cenário de usuário simulado e juiz LLM](https://docs.aivax.net/pt-br/docs/inference/agentic-tests.md) antes de confiá-la à produção, e execute os mesmos cenários novamente após alterar o modelo, as instruções ou as ferramentas.

Revise [Preços](https://docs.aivax.net/pt-br/docs/pricing.md) e [Planos e limites](https://docs.aivax.net/pt-br/docs/limits.md) antes de aumentar o tráfego.
