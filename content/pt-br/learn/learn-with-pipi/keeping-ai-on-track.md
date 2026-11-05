---
{title: Mantendo a IA no caminho certo,linkTitle: "#5 Moderação e observabilidade",description: "Uma peneira na entrada, guarda-corpos na estrada e um livro de registro de cada conversa: Pipi apresenta três camadas que mantêm um assistente seguro e explicável.",weight: 50,duration: 5,objectives: ["Os filtros de moderação de entrada filtram conteúdo que viola as diretrizes da comunidade, incluindo discurso de ódio, assédio, violência gráfica, conteúdo sexualmente explícito, desinformação prejudicial e spam.",Descreva as diretrizes de segurança (guardrails) como suas regras de negócio aplicadas ao assistente.,"A observabilidade auxilia na investigação de reclamações ao fornecer visibilidade profunda e em tempo real sobre o comportamento interno de um sistema. Diferente da monitoração tradicional, que se concentra em métricas pré-definidas, a observabilidade permite explorar dados não previstos, como logs, métricas e rastros (traces), para entender o \"porquê\" de uma falha ou problema.\n\nAo investigar uma reclamação, a observabilidade ajuda das seguintes formas:\n\n1. **Correlação de Eventos:** Conecta sinais de diferentes partes do sistema (frontend, backend, banco de dados, serviços terceirizados) para identificar a raiz do problema rapidamente.\n2. **Contexto Rico:** Fornece detalhes contextuais sobre o estado do sistema no momento exato em que a reclamação ocorreu, incluindo variáveis de entrada, configurações e dependências.\n3. **Redução do MTTR (Mean Time to Resolution):** Permite aos engenheiros isolar rapidamente a causa raiz, acelerando a resolução e minimizando o impacto nos usuários.\n4. **Reprodução de Problemas:** Facilita a reprodução de cenários problemáticos com base nos dados coletados, ajudando a validar correções antes da implementação em produção.\n\nEm resumo, a observabilidade transforma dados brutos em insights acionáveis, permitindo que equipes respondam proativamente a reclamações e melhorem a experiência do usuário."],sourceHash: 8e4e131a95dc5834}
---

O cérebro responde a todos. Mas nem toda mensagem é bem-intencionada e, às vezes, o cérebro quer agradar demais. Este episódio adiciona três camadas de proteção.

{{< video src="https://public.aivax.net/file/aivax-public/learn/pipi/05-seguranca.mp4" poster="https://public.aivax.net/file/aivax-public/learn/pipi/05-seguranca.webp" title="AIVAX Learn #5 — Mantendo a IA no caminho certo" lang="pt-BR" caption="Episódio 5 · 1 minuto e 20 segundos" >}}

## O que o vídeo mostra

{{< cards >}}
{{< card title="Moderação: a peneira" icon="shield" >}}Verifica as mensagens na entrada. Mensagens perigosas ou ofensivas são retidas e nunca chegam ao cérebro.{{< /card >}}
{{< card title="Guardrails (barreiras de segurança): as barreiras da estrada" icon="lock" >}}Suas regras de negócio. Se o cérebro tentar oferecer um desconto de 90%, ele bate na barreira e volta para o caminho correto.{{< /card >}}
{{< card title="Observabilidade: o livro de registro" icon="eye" >}}Cada conversa é registrada: a pergunta, as ferramentas usadas, o custo e os erros.{{< /card >}}
{{< /cards >}}

{{< flow "Mensagem | Moderação | Modelo dentro dos guardrails | Resposta | Livro de registro" >}}

## Por que três camadas

Cada camada detecta um problema diferente. A **moderação** impede entradas prejudiciais antes que elas custem algo ou influenciem a resposta. Os **guardrails** impedem comportamentos bem-intencionados, mas incorretos, como um assistente inventando um desconto para agradar um cliente. Alguns guardrails ficam nas instruções; os firmes, como limites de desconto ou verificações de permissão, pertencem aos seus próprios sistemas, porque uma regra escrita apenas em um prompt ainda pode ser contornada.

A **observabilidade** é o que você usa quando algo já deu errado. Quando um cliente reclama, você abre a conversa, vê o que foi perguntado, quais ferramentas foram executadas, o que retornaram e qual foi o custo, encontrando o problema em vez de chutar.

> [!TIP]
> Nenhuma única camada é suficiente. A moderação não conhece seus preços, os guardrails não capturam usuários abusivos e os logs só ajudam depois do fato. Use os três.

## Aprofunde-se

- Em Learn: [Adicionando guardrails](../agents/adding-guardrails.md), [Moderação de conteúdo e políticas de uso](../safety/content-moderation-and-policies.md), [Injeção de prompts e jailbreaks](../safety/prompt-injection-and-jailbreaks.md) e [Logs, rastros e monitoramento](../quality/logs-traces-and-monitoring.md).
- Na Documentação: [AI gateways](../../docs/inference/ai-gateways/concepts.md) é onde a moderação é habilitada, com um link para o que ela cobre. [AI workers](../../docs/inference/workers.md) permitem que seu próprio serviço permita, interrompa ou altere uma solicitação em tempo de execução, um bom lugar para regras de negócio firmes. [Testes agênticos](../../docs/inference/agentic-tests.md) simulam conversas completas para detectar problemas antes que os clientes o façam.

O próximo episódio ensina o cérebro a ver e ouvir.

{{< quiz options="Moderação | Guardrails | Observabilidade" answer="3" explanation="A observabilidade é o livro de registro: ela registra a pergunta, as ferramentas, o custo e os erros de cada conversa para que você possa investigar." >}}
Um cliente reclama sobre uma resposta da semana passada. Qual camada ajuda você a descobrir o que aconteceu?
{{< /quiz >}}
