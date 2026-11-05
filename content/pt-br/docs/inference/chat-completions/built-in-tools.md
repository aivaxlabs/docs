---
{title: Ferramentas Integradas sob Demanda,linkTitle: Ferramentas integradas,weight: 100,group: Inference,sourceHash: 299b457727ee539a,aliases: [/docs/pt-br/inference/chat-completions/built-in-tools.html]}
---

# Ferramentas integradas sob demanda

Use `builtin_tools` para habilitar as [ferramentas integradas](/docs/pt-br/tools/builtin-tools.md) do AIVAX em uma solicitação direta, sem criar um gateway:

```json
{
    "model": "@google/gemini-3.8-flash",
    "prompt": "Pesquise notícias recentes sobre veículos elétricos.",
    "stream": true,
    "builtin_tools": {
        "tools": [
            "WebSearch"
        ],
        "options": {
            "web_search_mode": "full",
            "web_search_max_results": 5
        }
    }
}
```

As ferramentas integradas incluem `DateTime`, `WebSearch`, `AdvancedWebUsage` (desativado; retorna uma resposta de indisponibilidade; consulte os [Registros de alterações](/docs/pt-br/legal/changelogs.md)), `OpenUrl`, `Code`, `Request`, `Remember`, `GenerateWebPage`, `GenerateDocument`, `XPostsSearch` e `ImageGeneration`.

O `DateTime` expõe `get_date_time`, uma ferramenta sem argumentos que retorna a data atual, hora, dia da semana em inglês, fuso horário, deslocamento UTC e carimbo de data/hora ISO 8601. Ele utiliza o fuso horário do gateway (padrão `America/Sao_Paulo`); envie `time_zone` com um identificador IANA para substituí-lo para uma única solicitação. Essa configuração é independente do fuso horário do navegador do usuário. Consulte [Data e Hora Atual](/docs/pt-br/tools/builtin-tools.md#current-date-and-time) para exemplos de configuração e saída.

Ferramentas sob demanda são adequadas para chamadas ocasionais, protótipos e integrações que não precisam de um gateway persistente. Se o mesmo aplicativo sempre usa as mesmas ferramentas, prefira configurá-las em um Gateway de IA para que a política seja centralizada.

## Combinar com um gateway

Quando `model` é um gateway, `builtin_tools` adiciona ferramentas às que o gateway já habilita; ele não remove as ferramentas do gateway. As `options` se aplicam às ferramentas desta solicitação. Chaves de API públicas não podem enviar `builtin_tools`.

As ferramentas integradas são ferramentas do lado do servidor: suas chamadas aparecem como eventos `servertool` durante o streaming e não são retornadas como mensagens. Reutilize o `conversation_token` para que as rodadas subsequentes mantenham seus resultados; consulte [Contexto do lado do servidor](server-side-context.md). Cada ferramenta é cobrada de acordo com suas próprias tarifas; consulte [Preços e limites das ferramentas integradas](/docs/pt-br/tools/builtin-tools.md#pricing-and-limits).
