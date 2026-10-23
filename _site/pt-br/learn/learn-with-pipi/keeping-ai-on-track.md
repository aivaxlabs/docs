Source: https://docs.aivax.net/pt-br/learn/learn-with-pipi/keeping-ai-on-track.html

O cérebro responde a todos. Mas nem toda mensagem tem boa intenção, e às vezes o cérebro quer agradar demais. Este episódio adiciona três camadas de proteção.

[Video: AIVAX Learn #5 — Mantendo a IA no caminho](https://public.aivax.net/file/aivax-public/learn/pipi/05-seguranca.mp4) — Os vídeos da Pipi estão disponíveis apenas em português no momento.

*Episódio 5 · 1 minuto e 20 segundos*


## O que o vídeo mostra


- **Moderação: a peneira** — Verifica mensagens na entrada. Mensagens perigosas ou ofensivas são retidas e nunca chegam ao cérebro.

- **Guardrails: as barreiras da estrada** — Suas regras de negócio. Se o cérebro tenta oferecer um desconto de 90 %, ele bate na barreira e volta para a estrada.

- **Observabilidade: o livro de registro** — Cada conversa é registrada: a pergunta, as ferramentas usadas, o custo e os erros.




Mensagem → Moderação → Modelo dentro das guardrails → Resposta → Livro de registro


## Por que três camadas

Cada camada captura um problema diferente. **Moderação** impede entradas nocivas antes que custem algo ou influenciem a resposta. **Guardrails** evitam comportamentos bem‑intencionados, porém errados, como um assistente inventar um desconto para agradar o cliente. Alguns guardrails vivem nas instruções; os firmes, como limites de desconto ou checagens de permissão, pertencem aos seus próprios sistemas, pois uma regra escrita apenas em um prompt ainda pode ser contornada.

**Observabilidade** é o que você usa quando algo já deu errado. Quando um cliente reclama, você abre a conversa, vê o que foi perguntado, quais ferramentas foram executadas, o que elas retornaram e o custo, e encontra o problema em vez de adivinhar.

> [!TIP]
> Nenhuma camada sozinha basta. A moderação não conhece seus preços, os guardrails não pegam usuários abusivos, e os logs só ajudam depois do fato. Use as três.

## Aprofunde‑se

- Na Learn: [Adicionando guardrails](https://docs.aivax.net/pt-br/learn/agents/adding-guardrails.md), [Moderação de conteúdo e políticas de uso](https://docs.aivax.net/pt-br/learn/safety/content-moderation-and-policies.md), [Injeção de prompts e jailbreaks](https://docs.aivax.net/pt-br/learn/safety/prompt-injection-and-jailbreaks.md) e [Logs, rastreamentos e monitoramento](https://docs.aivax.net/pt-br/learn/quality/logs-traces-and-monitoring.md).
- Na Documentação: [AI gateways](https://docs.aivax.net/pt-br/docs/inference/ai-gateway.md) é onde a moderação é habilitada, com um link para o que cobre. [AI workers](https://docs.aivax.net/pt-br/docs/inference/workers.md) permitem que seu próprio serviço permita, pare ou altere uma requisição em tempo de execução, um bom lugar para regras de negócio firmes. [Agentic tests](https://docs.aivax.net/pt-br/docs/inference/agentic-tests.md) simulam conversas completas para detectar problemas antes que os clientes os encontrem.

O próximo episódio ensina o cérebro a ver e ouvir.

**Verifique seu conhecimento.** Um cliente reclama de uma resposta da semana passada. Qual camada ajuda a descobrir o que aconteceu?

1. Moderação
2. Guardrails
3. Observabilidade

Answer: option 3. Observabilidade é o livro de registro: registra a pergunta, as ferramentas, o custo e os erros de cada conversa para que você possa investigar.
