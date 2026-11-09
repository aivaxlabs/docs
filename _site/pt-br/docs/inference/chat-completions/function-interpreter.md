Source: https://docs.aivax.net/pt-br/docs/inference/chat-completions/function-interpreter.html

# Interpretador de funções (descontinuado)

> **Descontinuado.** O interpretador de funções é mantido apenas para gateways existentes. Não o utilize em novos gateways. Escolha um modelo com chamada nativa de ferramentas; a página **Modelos** do painel lista quais modelos suportam esse recurso.

O interpretador de funções, também chamado de manipulador de ferramentas, adiciona a capacidade de chamar ferramentas a modelos que não geram chamadas nativas confiáveis. Em vez de enviar as definições das ferramentas para o provedor, o AIVAX solicita ao modelo que escolha uma ferramenta em formato de texto e converte sua resposta em uma chamada de ferramenta. Configure-o em **Manipulador de chamada de ferramentas** no editor do gateway ou em `parameters.knownToolHandlerName`.

## Valores

| Valor | Comportamento |
| --- | --- |
| `native` ou `null` | Utiliza a chamada nativa de ferramentas do modelo. Este é o valor padrão e recomendado. |
| `react.v1.selfcall` | Utiliza um interpretador estilo ReAct que executa no mesmo modelo do gateway. |

Qualquer outro valor fará com que as requisições ao gateway falhem com um erro indicando que o manipulador de ferramentas não é reconhecido.

## Como funciona o `react.v1.selfcall`

Em toda geração na qual há ferramentas disponíveis, o interpretador é executado antes da geração principal:

1. O AIVAX faz uma chamada extra ao mesmo modelo com a conversa, as definições das ferramentas como texto e instruções para escolher uma ferramenta e seus argumentos ou responder ao usuário.
2. Se o modelo escolher uma ferramenta, o AIVAX converte seu texto em uma chamada de ferramenta e a executa como qualquer outra chamada de ferramenta: ferramentas do lado do servidor são executadas dentro do AIVAX, e ferramentas do lado do cliente são retornadas à sua aplicação.
3. Se o modelo optar por responder, a geração principal é executada sem as definições das ferramentas.

Consulte [Pipeline de processamento](https://docs.aivax.net/pt-br/docs/inference/chat-completions/processing-pipeline.md) para saber onde essa etapa ocorre.

## Limitações

- **Uma ferramenta por etapa.** O interpretador seleciona no máximo uma ferramenta por geração, portanto, chamadas paralelas de ferramentas não são possíveis.
- **Maior custo e latência.** Cada geração com ferramentas adiciona uma chamada extra ao modelo, cobrada como qualquer outra inferência.
- **Confiabilidade reduzida.** Nomes de ferramentas e argumentos são analisados a partir do texto. O modelo pode gerar JSON inválido ou chamar uma ferramenta que não existe, e os argumentos não são restritos pelo provedor.
- **A chamada de ferramentas torna-se disponível para qualquer modelo.** Um gateway com um interpretador aceita ferramentas e recursos que exigem chamada de ferramentas, como RAG com `QueryFunction`, mesmo quando o modelo não tem suporte nativo. Sua qualidade depende de quão bem o modelo segue o formato do interpretador.

## Migre para fora do interpretador

1. Escolha um modelo com chamada nativa de ferramentas que atenda aos requisitos de custo e qualidade do gateway.
2. Altere o modelo do gateway e defina o manipulador de chamada de ferramentas como `native`, ou remova `knownToolHandlerName`.
3. Teste os fluxos de ferramentas do gateway, por exemplo, com [Testes Agênticos](https://docs.aivax.net/pt-br/docs/inference/agentic-tests.md), antes de direcionar o tráfego de produção.
