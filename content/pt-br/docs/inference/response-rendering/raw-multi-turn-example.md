---
{title: Exemplo de múltiplas rodadas bruto,linkTitle: Exemplo bruto de múltiplas rodadas,weight: 20,group: Response rendering,sourceHash: 7b2a96944390c52b,aliases: [/docs/pt-br/inference/response-rendering/raw-multi-turn-example.html]}
---

# Exemplo bruto de múltiplas rodadas

O exemplo abaixo mostra a estrutura de uma resposta em streaming quando o raciocínio do lado do servidor é visível para o cliente, [`tool_invocation_explanations`](tool-explanations.md) está habilitado e [`textual_blocks`](chat-presentation-guidance.md#response-rendering-mode) é usado para manter a linha do tempo da resposta como texto. Os atributos exatos do resultado da ferramenta podem variar conforme o renderizador, mas o comportamento importante é a ordem: raciocínio, fragmentos da resposta do assistente, atividade da ferramenta, mais raciocínio e a resposta final podem todos pertencer à mesma rodada do assistente.

```json
{
    "model": "my-custom-model:abc4",
    "messages": [
        {
            "role": "user",
            "content": "Quais modelos multimodais baratos e rápidos devo usar para análise de câmeras de segurança?"
        }
    ],
    "stream": true,
    "builtin_tools": {
        "tools": ["WebSearch"]
    },
    "tool_invocation_explanations": true,
    "rendering_mode": "textual_blocks",
    "extra_body": {
        "reasoning": {
            "enabled": true
        }
    }
}
```

Linha do tempo bruta do assistente em streaming:

```text
<thinking-group>
<think>
O usuário está pedindo modelos multimodais baratos e rápidos para análise de câmeras de segurança.
Devo listar os modelos AIVAX disponíveis e pesquisar a documentação antes de recomendar opções.
</think>
</thinking-group>

<assistant-answer>
Vou verificar os modelos multimodais disponíveis e identificar as melhores opções para análise de câmeras de segurança.
</assistant-answer>

<thinking-group>
<div class="tool-result reason" data-tool-name="aivax_list_models"><b>aivax_list_models</b><span>Listando os modelos disponíveis no AIVAX</span></div>

<div class="tool-result reason" data-tool-name="aivax_search_context"><b>aivax_search_context</b><span>Pesquisando a documentação sobre modelos multimodais e análise de imagens no AIVAX</span></div>

<think>
Os modelos relevantes devem suportar VideoInput ou ImageInput, ter baixo custo de entrada e ser rápidos o suficiente para fluxos de trabalho de câmeras.
Encontrei vários candidatos e devo classificá-los por custo, velocidade e suporte a modalidades.
</think>
</thinking-group>

<assistant-answer>
Para análise de câmeras de segurança, priorize modelos com VideoInput, preço de entrada baixo e alta velocidade.

A disponibilidade dos modelos e os preços mudam ao longo do tempo; as escolhas abaixo são exemplos de saída — consulte [Preços](/docs/pt-br/pricing.md) para valores atuais.

Principais escolhas:

1. @google/gemini-3.5-flash-lite: rápido, econômico e suporta vídeo.
2. @qwen/qwen3.5-9b: baixo custo de entrada neste exemplo de saída com suporte a vídeo.
3. @amazon/nova-lite: baixo custo de entrada e grande janela de contexto.

Use VideoInput para clipes sempre que possível. Se um modelo suportar apenas ImageInput, extraia quadros do fluxo da câmera antes de enviá-los.
</assistant-answer>
```

Quando o usuário responde, mantenha o histórico da conversa focado no resultado visível do assistente. Armazene o raciocínio e os detalhes das ferramentas como metadados de linha do tempo ou auditoria se seu produto precisar deles, mas não os transforme em uma nova mensagem do usuário. A mensagem do assistente deve usar o conteúdo do bloco `<assistant-answer>` final, não a transcrição completa do raciocínio.

```json
{
    "model": "my-custom-model:abc4",
    "messages": [
        {
            "role": "user",
            "content": "Quais modelos multimodais baratos e rápidos devo usar para análise de câmeras de segurança?"
        },
        {
            "role": "assistant",
            "content": "Para análise de câmeras de segurança, priorize modelos com VideoInput, preço de entrada baixo e alta velocidade.\n\nA disponibilidade dos modelos e os preços mudam ao longo do tempo; as escolhas abaixo são exemplos de saída — consulte [Preços](/docs/pt-br/pricing.md) para valores atuais.\n\nPrincipais escolhas:\n\n1. @google/gemini-3.5-flash-lite: rápido, econômico e suporta vídeo.\n2. @qwen/qwen3.5-9b: baixo custo de entrada neste exemplo de saída com suporte a vídeo.\n3. @amazon/nova-lite: baixo custo de entrada e grande janela de contexto.\n\nUse VideoInput para clipes sempre que possível. Se um modelo suportar apenas ImageInput, extraia quadros do fluxo da câmera antes de enviá-los."
        },
        {
            "role": "user",
            "content": "Agora recomende um modelo para alertas em tempo real e outro para revisão mais detalhada."
        }
    ],
    "stream": true,
    "builtin_tools": {
        "tools": ["WebSearch"]
    },
    "tool_invocation_explanations": true,
    "rendering_mode": "textual_blocks",
    "extra_body": {
        "reasoning": {
            "enabled": true
        }
    }
}
```
