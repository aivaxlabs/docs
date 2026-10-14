Source: https://docs.aivax.net/pt-br/learn/learn-with-pipi/how-ai-uses-tools.html

O cérebro sabe como falar, mas não tem mãos. Não pode consultar seu pedido ou agendar uma consulta. Este episódio lhe dá botões.

[Video: AIVAX Learn #4 — Como a IA usa ferramentas](https://public.aivax.net/file/aivax-public/learn/pipi/04-ferramentas-mcp.mp4) — Os vídeos da Pipi estão disponíveis apenas em português no momento.

*Episódio 4 · 1 minuto e 17 segundos*

## O que o vídeo mostra

Uma **ferramenta** é como um botão com um rótulo: tem um nome e indica o que faz. O modelo nunca pressiona o botão diretamente. Ele solicita, e o sistema ao seu redor faz a pressão.

1. **O modelo pergunta**

O cliente quer saber sobre um pedido, então o modelo solicita *"visualizar pedido, número 42"*.

2. **O sistema pressiona o botão**

Seu sistema executa a ação, por exemplo uma consulta no banco de dados da loja.

3. **O resultado volta**

O sistema devolve o resultado ao modelo como texto: *"enviado ontem"*.

4. **O modelo responde**

Com dados reais em mãos, o modelo responde corretamente ao invés de adivinhar.

Essa separação é o que mantém as ferramentas seguras: o modelo apenas escolhe qual botão e com quais valores; seu sistema decide o que o botão pode fazer.

## O emaranhado de fios e a tomada

Cada sistema se conecta à sua maneira: o calendário de uma forma, a loja de outra, a planilha de uma terceira. No vídeo isso se torna um emaranhado de fios ao redor do jarro.

**MCP** (*Model Context Protocol*) é a tomada padrão. Cada sistema chega com suas ferramentas já descritas no mesmo formato, então conectá‑las é apenas plugá‑las, e o cérebro pode usar essas ferramentas imediatamente.

**Sem um padrão**

Cada sistema precisa de sua própria conexão, escrita e mantida separadamente.

**Com MCP**

Sistemas que falam MCP expõem suas ferramentas da mesma forma, então um padrão de conexão serve a todos.

No AIVAX, um gateway pode usar vários tipos de ferramentas: ferramentas integradas ao AIVAX, servidores MCP que você conecta e funções de protocolo que chamam seu próprio endpoint HTTP quando o modelo as solicita.

## Aprofunde-se

- Na Learn: [Adicionando ferramentas](https://docs.aivax.net/pt-br/learn/agents/adding-tools.md), [Chamada de função passo a passo](https://docs.aivax.net/pt-br/learn/tools-and-integrations/function-calling.md), [MCP e padrões de ferramentas](https://docs.aivax.net/pt-br/learn/tools-and-integrations/model-context-protocol.md) e [Autenticação e permissões para ferramentas](https://docs.aivax.net/pt-br/learn/tools-and-integrations/authentication-and-permissions.md).
- Na Documentação: [Funções MCP](https://docs.aivax.net/pt-br/docs/tools/mcp.md) mostra como vincular um servidor MCP a um gateway, [Funções de protocolo](https://docs.aivax.net/pt-br/docs/tools/protocol-functions.md) cobrem ações do lado do servidor, como verificar um pedido, e [Ferramentas integradas](https://docs.aivax.net/pt-br/docs/tools/builtin-tools.md) lista o que está pronto para uso.

Quando o cérebro pode agir, ele também precisa de limites. Esse é o próximo episódio.

**Verifique seu conhecimento.** Quando o cérebro consulta o pedido 42, quem realmente executa a consulta?

1. O modelo executa a ação diretamente no seu banco de dados
2. O modelo solicita a ação por nome, e seu sistema a executa e devolve o resultado
3. MCP responde ao cliente ao invés do modelo

Answer: option 2. O modelo apenas solicita uma ferramenta com valores. O sistema ao redor a executa e envia o resultado de volta para o modelo usar.
