---
{title: Como a IA usa ferramentas,linkTitle: "#4 Ferramentas e MCP",description: "O cérebro pode falar, mas não tem mãos. A Pipi lhe dá botões rotulados para pressionar, então um socket padrão para que todo sistema possa conectar suas ferramentas da mesma forma.",weight: 40,duration: 5,objectives: [Explicar por que um modelo precisa de ferramentas para atuar em sistemas reais.,Acompanhar uma chamada de ferramenta desde a solicitação do modelo até a resposta.,Descrever o MCP como uma forma padrão de conectar ferramentas.],sourceHash: 1a124bbadf1c56b7}
---

O cérebro sabe como falar, mas não tem mãos. Não pode consultar seu pedido ou agendar uma consulta. Este episódio lhe dá botões.

{{< video src="https://public.aivax.net/file/aivax-public/learn/pipi/04-ferramentas-mcp.mp4" poster="https://public.aivax.net/file/aivax-public/learn/pipi/04-ferramentas-mcp.webp" title="AIVAX Learn #4 — Como a IA usa ferramentas" lang="pt-BR" caption="Episódio 4 · 1 minuto e 17 segundos" >}}

## O que o vídeo mostra

Uma **ferramenta** é como um botão com um rótulo: tem um nome e indica o que faz. O modelo nunca pressiona o botão diretamente. Ele solicita, e o sistema ao seu redor faz a pressão.

{{< steps >}}
{{< step title="O modelo pergunta" >}}
O cliente quer saber sobre um pedido, então o modelo solicita *"visualizar pedido, número 42"*.
{{< /step >}}
{{< step title="O sistema pressiona o botão" >}}
Seu sistema executa a ação, por exemplo uma consulta no banco de dados da loja.
{{< /step >}}
{{< step title="O resultado volta" >}}
O sistema devolve o resultado ao modelo como texto: *"enviado ontem"*.
{{< /step >}}
{{< step title="O modelo responde" >}}
Com dados reais em mãos, o modelo responde corretamente ao invés de adivinhar.
{{< /step >}}
{{< /steps >}}

Essa separação é o que mantém as ferramentas seguras: o modelo apenas escolhe qual botão e com quais valores; seu sistema decide o que o botão pode fazer.

## O emaranhado de fios e a tomada

Cada sistema se conecta à sua maneira: o calendário de uma forma, a loja de outra, a planilha de uma terceira. No vídeo isso se torna um emaranhado de fios ao redor do jarro.

**MCP** (*Model Context Protocol*) é a tomada padrão. Cada sistema chega com suas ferramentas já descritas no mesmo formato, então conectá‑las é apenas plugá‑las, e o cérebro pode usar essas ferramentas imediatamente.

{{< compare >}}
{{< side title="Sem um padrão" tone="bad" >}}Cada sistema precisa de sua própria conexão, escrita e mantida separadamente.{{< /side >}}
{{< side title="Com MCP" tone="good" >}}Sistemas que falam MCP expõem suas ferramentas da mesma forma, então um padrão de conexão serve a todos.{{< /side >}}
{{< /compare >}}

No AIVAX, um gateway pode usar vários tipos de ferramentas: ferramentas integradas ao AIVAX, servidores MCP que você conecta e funções de protocolo que chamam seu próprio endpoint HTTP quando o modelo as solicita.

## Aprofunde-se

- Na Learn: [Adicionando ferramentas](../agents/adding-tools.md), [Chamada de função passo a passo](../tools-and-integrations/function-calling.md), [MCP e padrões de ferramentas](../tools-and-integrations/model-context-protocol.md) e [Autenticação e permissões para ferramentas](../tools-and-integrations/authentication-and-permissions.md).
- Na Documentação: [Funções MCP](../../docs/tools/mcp.md) mostra como vincular um servidor MCP a um gateway, [Funções de protocolo](../../docs/tools/protocol-functions.md) cobrem ações do lado do servidor, como verificar um pedido, e [Ferramentas integradas](../../docs/tools/builtin-tools.md) lista o que está pronto para uso.

Quando o cérebro pode agir, ele também precisa de limites. Esse é o próximo episódio.

{{< quiz options="O modelo executa a ação diretamente no seu banco de dados | O modelo solicita a ação por nome, e seu sistema a executa e devolve o resultado | MCP responde ao cliente ao invés do modelo" answer="2" explanation="O modelo apenas solicita uma ferramenta com valores. O sistema ao redor a executa e envia o resultado de volta para o modelo usar." >}}
Quando o cérebro consulta o pedido 42, quem realmente executa a consulta?
{{< /quiz >}}
