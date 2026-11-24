---
{title: Orientações para Apresentação no Chat,linkTitle: Orientações para apresentação no chat,weight: 10,group: Response rendering,sourceHash: c805417517318e4a,aliases: [/docs/pt-br/inference/response-rendering/chat-presentation-guidance.html]}
---

# Orientações para apresentação de chat

Uma resposta assistida transmitida em streaming pode conter raciocínio, atividade de ferramentas no lado do servidor, respostas parciais e a resposta final. Esta página explica como a AIVAX entrega cada um desses elementos e como apresentá-los em uma interface de chat. Consulte [Streaming](/docs/pt-br/inference/chat-completions/streaming.md) para o formato dos eventos e [Exemplo bruto de múltiplas rodadas](raw-multi-turn-example.md) para uma resposta completa.

## Modo de renderização da resposta

Defina `rendering_mode: "textual_blocks"` quando seu cliente quiser que a AIVAX coloque o raciocínio e a atividade das ferramentas no lado do servidor no mesmo fluxo de resposta textual que a interface do chat já renderiza. Isso é adequado para clientes que constroem uma única linha do tempo de resposta.

```json
{
    "model": "@openai/gpt-5-mini",
    "messages": [
        {
            "role": "user",
            "content": "Procure atualizações recentes de produtos e resuma as alterações importantes."
        }
    ],
    "stream": true,
    "builtin_tools": {
        "tools": ["WebSearch"]
    },
    "rendering_mode": "textual_blocks"
}
```

Neste modo, o raciocínio pode ser emitido como blocos `<thinking-group>` e `<think>`, o texto voltado para o assistente pode ser emitido como blocos `<assistant-answer>`, e os marcadores de ferramentas no lado do servidor podem aparecer como elementos de resultado da ferramenta, como `<div class="tool-result reason" data-tool-name="...">`. Analise esses blocos em componentes de linha do tempo, seções de raciocínio colapsáveis, fragmentos de resposta ou linhas de status da ferramenta; não concatene todos os marcadores na resposta final do assistente.

Clientes que não entendem essa marcação devem manter o modo de renderização padrão e lidar diretamente com os eventos de stream estruturados. No modo padrão, o raciocínio chega por meio de `delta.reasoning`, e a atividade das ferramentas no lado do servidor chega por meio de eventos `servertool`. Mantenha os eventos na ordem de chegada para que o raciocínio, a atividade da ferramenta e a resposta permaneçam em uma única linha do tempo.

## Orientações de apresentação

Durante a geração, o raciocínio é útil porque permite que o usuário acompanhe o que o modelo está fazendo antes de existir uma resposta final. O assistente pode "falar" enquanto raciocina emitindo atualizações de processo visíveis ao usuário ou fragmentos de resposta provisórios. Essas atualizações podem ser intercaladas com blocos de raciocínio, chamadas de ferramentas e conteúdo de resposta parcial conforme a resposta se desenvolve.

Depois que a resposta final do assistente for gerada, essa resposta se torna o principal produto da inferência. Recolha o raciocínio por padrão após a conclusão para que a resposta final receça o maior destaque e mantenha-o disponível para usuários que desejam inspecioná-lo.

A atividade das ferramentas deve ser lida como status, não como fala: use rótulos concisos como "Pesquisando", "Abrindo fonte", "Executando ferramenta", "Concluído" ou "Falhou", e mantenha cada invocação de ferramenta agrupada como um único item de linha do tempo, mesmo que seu estado mude ao longo do tempo.

Uma boa hierarquia visual é:

- Resposta do assistente: maior proeminência, tipografia normal de leitura, parte da conversa principal.
- Raciocínio em andamento: visível o suficiente para mostrar o que o modelo está fazendo enquanto a resposta está sendo gerada.
- Raciocínio concluído: menor proeminência, cor ou contêiner mais suave, recolhido ou minimizado por padrão.
- Blocos de ferramentas: linhas de status compactas com estados claros de carregamento, sucesso e erro.
- Detalhes brutos: ocultos por padrão, a menos que o cliente seja uma superfície para desenvolvedores, auditoria ou depuração.

Mostre nomes de ferramentas, estados, rótulos de origem ou resumos curtos. Oculte argumentos brutos e grandes payloads a menos que o usuário solicite detalhes ou a superfície seja construída para inspeção técnica.

Para acessibilidade, torne cada bloco recolhível alternável via teclado, forneça um rótulo legível para cada linha de status, evite depender apenas da cor para indicar o estado e mantenha as animações sutis. Uma resposta em streaming deve parecer estável enquanto é atualizada: novos blocos de raciocínio ou linhas de ferramentas podem aparecer em ordem, mas o conteúdo existente não deve pular ou forçar o usuário a perder sua posição de leitura.
