Source: https://docs.aivax.net/pt-br/learn/learn-with-pipi/keeping-ai-on-track.html

O cérebro responde a todos. Mas nem toda mensagem é bem-intencionada e, às vezes, o cérebro quer agradar demais. Este episódio adiciona três camadas de proteção.

[Video: AIVAX Learn #5 — Mantendo a IA no caminho certo](https://public.aivax.net/file/aivax-public/learn/pipi/05-seguranca.mp4) — Os vídeos da Pipi estão disponíveis apenas em português no momento.

*Episódio 5 · 1 minuto e 20 segundos*

## O que o vídeo mostra

- **Moderação: a peneira** — Verifica as mensagens na entrada. Mensagens perigosas ou ofensivas são retidas e nunca chegam ao cérebro.

- **Guardrails (barreiras de segurança): as barreiras da estrada** — Suas regras de negócio. Se o cérebro tentar oferecer um desconto de 90%, ele bate na barreira e volta para o caminho correto.

- **Observabilidade: o livro de registro** — Cada conversa é registrada: a pergunta, as ferramentas usadas, o custo e os erros.

Mensagem → Moderação → Modelo dentro dos guardrails → Resposta → Livro de registro

## Por que três camadas

Cada camada detecta um problema diferente. A **moderação** impede entradas prejudiciais antes que elas custem algo ou influenciem a resposta. Os **guardrails** impedem comportamentos bem-intencionados, mas incorretos, como um assistente inventando um desconto para agradar um cliente. Alguns guardrails ficam nas instruções; os firmes, como limites de desconto ou verificações de permissão, pertencem aos seus próprios sistemas, porque uma regra escrita apenas em um prompt ainda pode ser contornada.

A **observabilidade** é o que você usa quando algo já deu errado. Quando um cliente reclama, você abre a conversa, vê o que foi perguntado, quais ferramentas foram executadas, o que retornaram e qual foi o custo, encontrando o problema em vez de chutar.

> [!TIP]
> Nenhuma única camada é suficiente. A moderação não conhece seus preços, os guardrails não capturam usuários abusivos e os logs só ajudam depois do fato. Use os três.

## Aprofunde-se

- Em Learn: [Adicionando guardrails](https://docs.aivax.net/pt-br/learn/agents/adding-guardrails.md), [Moderação de conteúdo e políticas de uso](https://docs.aivax.net/pt-br/learn/safety/content-moderation-and-policies.md), [Injeção de prompts e jailbreaks](https://docs.aivax.net/pt-br/learn/safety/prompt-injection-and-jailbreaks.md) e [Logs, rastros e monitoramento](https://docs.aivax.net/pt-br/learn/quality/logs-traces-and-monitoring.md).
- Na Documentação: [AI gateways](https://docs.aivax.net/pt-br/docs/inference/ai-gateways/concepts.md) é onde a moderação é habilitada, com um link para o que ela cobre. [AI workers](https://docs.aivax.net/pt-br/docs/inference/workers.md) permitem que seu próprio serviço permita, interrompa ou altere uma solicitação em tempo de execução, um bom lugar para regras de negócio firmes. [Testes agênticos](https://docs.aivax.net/pt-br/docs/inference/agentic-tests.md) simulam conversas completas para detectar problemas antes que os clientes o façam.

O próximo episódio ensina o cérebro a ver e ouvir.

**Verifique seu conhecimento.** Um cliente reclama sobre uma resposta da semana passada. Qual camada ajuda você a descobrir o que aconteceu?

1. Moderação
2. Guardrails
3. Observabilidade

Answer: option 3. A observabilidade é o livro de registro: ela registra a pergunta, as ferramentas, o custo e os erros de cada conversa para que você possa investigar.
