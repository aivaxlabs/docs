---
{title: Orientações para Apresentação de Chat,linkTitle: Orientações para apresentação no chat,weight: 10,group: Response rendering,sourceHash: 77e6b1272e06eaab,aliases: [/docs/pt-br/inference/response-rendering/chat-presentation-guidance.html]}
---

# Orientações para apresentação do chat

Uma resposta de assistente transmitida em streaming pode conter raciocínio, atividade de ferramentas no lado do servidor, respostas parciais e a resposta final. Esta página explica como a AIVAX entrega cada um desses elementos e como apresentá-los em uma interface de chat. Consulte [Streaming](/docs/pt-br/inference/chat-completions/streaming.md) para o formato dos eventos e [Exemplo bruto de múltiplas rodadas](raw-multi-turn-example.md) para uma resposta completa.

## Modo de renderização da resposta

Defina `rendering_mode: "textual_blocks"` quando seu cliente deseja que a AIVAX coloque o raciocínio e a atividade de ferramentas no lado do servidor no mesmo fluxo de resposta textual que a interface do chat já renderiza. Isso é útil para clientes que constroem uma única linha do tempo de resposta e desejam transformar o raciocínio e a atividade das ferramentas em componentes visíveis, sem manter caminhos separados de manipulação de eventos para cada tipo de marcador.

```json
{
    "model": "@openai/gpt-5-mini",
    "messages": [
        {
            "role": "user",
            "content": "Search for recent product updates and summarize the important changes."
        }
    ],
    "stream": true,
    "builtin_tools": {
        "tools": ["WebSearch"]
    },
    "rendering_mode": "textual_blocks"
}
```

Neste modo, o raciocínio pode ser emitido como blocos `<thinking-group>` e `<think>`, o texto voltado para o assistente pode ser emitido como blocos `<assistant-answer>`, e os marcadores de ferramentas no lado do servidor podem aparecer como elementos de resultado da ferramenta, como `<div class="tool-result reason" data-tool-name="...">`. Trate esses blocos como marcadores de apresentação dentro do fluxo de resposta: analise-os em componentes da linha do tempo do chat, seções de raciocínio colapsáveis, fragmentos de resposta do assistente ou linhas de status da ferramenta, mas não concatene cegamente todos os marcadores na resposta final do assistente.

Clientes que não entendem essa marcação devem manter o modo de renderização padrão e lidar diretamente com os eventos de fluxo estruturados. No modo padrão, o raciocínio chega por meio de `delta.reasoning`, e a atividade de ferramentas no lado do servidor chega por meio de eventos `servertool`. Preserve a ordem em que os eventos de fluxo chegam para que o raciocínio, a atividade das ferramentas, o conteúdo parcial e a resposta final permaneçam na mesma linha do tempo de resposta.

## Orientações de apresentação

Durante a geração, o raciocínio é útil porque permite que o usuário acompanhe o que o modelo está fazendo antes de existir uma resposta final. O assistente pode "falar" enquanto raciocina, emitindo atualizações de processo visíveis ao usuário ou fragmentos de resposta provisórios. Essas atualizações podem estar intercaladas com blocos de raciocínio, chamadas de ferramentas e conteúdo de resposta parcial conforme a resposta se desenvolve.

Uma vez que a resposta final do assistente seja gerada, essa resposta torna-se o principal produto da inferência. O raciocínio intermediário ainda é útil para auditoria, orientação e depuração, mas geralmente deixa de ser o objetivo principal do usuário. Recolha ou minimize o raciocínio por padrão após a conclusão para que a resposta final receça o maior destaque visual, mantendo o processo disponível para usuários que desejam inspecioná-lo.

Use divulgação progressiva ao longo desse ciclo de vida. O raciocínio pode estar visível enquanto o modelo ainda está trabalhando, tornando-se depois um elemento secundário mais discreto após o aparecimento da resposta final. A atividade das ferramentas deve ser lida como status, não como fala: use rótulos concisos como "Pesquisando", "Abrindo fonte", "Executando ferramenta", "Concluído" ou "Falhou", e mantenha cada invocação de ferramenta agrupada como um único item na linha do tempo, mesmo que seu estado mude ao longo do tempo.

Uma boa hierarquia visual é:

- Resposta do assistente: maior proeminência, tipografia normal de leitura, parte da conversa principal.
- Raciocínio em andamento: visível o suficiente para mostrar o que o modelo está fazendo enquanto a resposta está sendo gerada.
- Raciocínio concluído: menor proeminência, cor ou recipiente mais discretos, recolhido ou minimizado por padrão.
- Blocos de ferramentas: linhas de status compactas com estados claros de carregamento, sucesso e erro.
- Detalhes brutos: ocultos por padrão, a menos que o cliente seja uma superfície de desenvolvedor, auditoria ou depuração.

Evite expor detalhes internos ruidosos diretamente aos usuários finais. Mostre nomes de ferramentas, estados, rótulos de origem ou resumos curtos quando eles ajudarem o usuário a entender o que aconteceu. Oculte argumentos brutos, grandes cargas úteis e detalhes de implementação, a menos que o usuário solicite explicitamente os detalhes ou a superfície do produto seja construída para inspeção técnica.

Para acessibilidade, torne cada bloco recolhido acionável via teclado, forneça um rótulo legível para cada linha de status, evite depender apenas da cor para indicar o estado e mantenha as animações sutis. Uma resposta em streaming deve parecer estável durante suas atualizações: novas linhas de raciocínio ou ferramentas podem aparecer na ordem correta, mas o conteúdo existente não deve pular ou fazer o usuário perder sua posição de leitura.
