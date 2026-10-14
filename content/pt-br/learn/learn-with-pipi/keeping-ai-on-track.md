---
{title: Mantendo a IA no caminho,linkTitle: "#5 Moderação e observabilidade",description: "Uma peneira na entrada, guardrails na estrada e um livro de registro de cada conversa: a Pipi mostra três camadas que mantêm um assistente seguro e explicável.",weight: 50,duration: 5,objectives: [Explicar o que a moderação de entrada filtra.,Descrever guardrails como suas regras de negócio aplicadas ao assistente.,Explicar como a observabilidade ajuda a investigar uma reclamação.],sourceHash: 31792b80b2f34ce9}
---

O cérebro responde a todos. Mas nem toda mensagem tem boa intenção, e às vezes o cérebro quer agradar demais. Este episódio adiciona três camadas de proteção.

{{< video src="https://public.aivax.net/file/aivax-public/learn/pipi/05-seguranca.mp4" poster="https://public.aivax.net/file/aivax-public/learn/pipi/05-seguranca.webp" title="AIVAX Learn #5 — Mantendo a IA no caminho" lang="pt-BR" caption="Episódio 5 · 1 minuto e 20 segundos" >}}

## O que o vídeo mostra

{{< cards >}}
{{< card title="Moderação: a peneira" icon="shield" >}}Verifica mensagens na entrada. Mensagens perigosas ou ofensivas são retidas e nunca chegam ao cérebro.{{< /card >}}
{{< card title="Guardrails: as barreiras da estrada" icon="lock" >}}Suas regras de negócio. Se o cérebro tenta oferecer um desconto de 90 %, ele bate na barreira e volta para a estrada.{{< /card >}}
{{< card title="Observabilidade: o livro de registro" icon="eye" >}}Cada conversa é registrada: a pergunta, as ferramentas usadas, o custo e os erros.{{< /card >}}
{{< /cards >}}

{{< flow "Mensagem | Moderação | Modelo dentro das guardrails | Resposta | Livro de registro" >}}

## Por que três camadas

Cada camada captura um problema diferente. **Moderação** impede entradas nocivas antes que custem algo ou influenciem a resposta. **Guardrails** evitam comportamentos bem‑intencionados, porém errados, como um assistente inventar um desconto para agradar o cliente. Alguns guardrails vivem nas instruções; os firmes, como limites de desconto ou checagens de permissão, pertencem aos seus próprios sistemas, pois uma regra escrita apenas em um prompt ainda pode ser contornada.

**Observabilidade** é o que você usa quando algo já deu errado. Quando um cliente reclama, você abre a conversa, vê o que foi perguntado, quais ferramentas foram executadas, o que elas retornaram e o custo, e encontra o problema em vez de adivinhar.

> [!TIP]
> Nenhuma camada sozinha basta. A moderação não conhece seus preços, os guardrails não pegam usuários abusivos, e os logs só ajudam depois do fato. Use as três.

## Aprofunde‑se

- Na Learn: [Adicionando guardrails](../agents/adding-guardrails.md), [Moderação de conteúdo e políticas de uso](../safety/content-moderation-and-policies.md), [Injeção de prompts e jailbreaks](../safety/prompt-injection-and-jailbreaks.md) e [Logs, rastreamentos e monitoramento](../quality/logs-traces-and-monitoring.md).
- Na Documentação: [AI gateways](../../docs/inference/ai-gateway.md) é onde a moderação é habilitada, com um link para o que cobre. [AI workers](../../docs/inference/workers.md) permitem que seu próprio serviço permita, pare ou altere uma requisição em tempo de execução, um bom lugar para regras de negócio firmes. [Agentic tests](../../docs/inference/agentic-tests.md) simulam conversas completas para detectar problemas antes que os clientes os encontrem.

O próximo episódio ensina o cérebro a ver e ouvir.

{{< quiz options="Moderação | Guardrails | Observabilidade" answer="3" explanation="Observabilidade é o livro de registro: registra a pergunta, as ferramentas, o custo e os erros de cada conversa para que você possa investigar." >}}
Um cliente reclama de uma resposta da semana passada. Qual camada ajuda a descobrir o que aconteceu?
{{< /quiz >}}
