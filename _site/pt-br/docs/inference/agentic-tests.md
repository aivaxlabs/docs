Source: https://docs.aivax.net/pt-br/docs/inference/agentic-tests.html

# Testes Agênicos

Testes Agênicos avaliam como um AI Gateway se comporta ao longo de uma conversa completa e orientada a um objetivo, em vez de pontuar uma resposta isolada. O AIVAX simula a próxima mensagem do usuário, envia cada turno ao gateway selecionado e usa um juiz independente para determinar se a conversa alcançou seu objetivo, permanece recuperável ou se afastou persistentemente do resultado esperado.

Use Testes Agênicos para criar verificações de regressão repetíveis para suporte, vendas, integração, uso de ferramentas, RAG e outros fluxos de agente de múltiplas interações. Como um teste passa pelo AI Gateway configurado, ele exercita o modelo, instruções, ferramentas, habilidades, conhecimento e configurações de inferência do gateway em conjunto.

## Testes persistentes no painel

Abra **Testes Agênicos** no painel do AIVAX para criar e gerenciar casos de teste reutilizáveis. Um teste armazena:

- o AI Gateway em teste;
- um objetivo que descreve o resultado conversacional esperado e é compartilhado com o usuário simulado e o juiz;
- critérios de validação opcionais usados apenas pelo juiz;
- mensagens iniciais opcionais, recursos externos e um identificador de usuário externo;
- amostragem do usuário simulado, limites de turno, comportamento de saída e limites de avaliação;
- um agendamento recorrente opcional;
- configurações de notificação de falha e recuperação.

A definição do teste é reutilizável. Cada execução cria uma corrida separada, de modo que alterar um teste depois não substitui o histórico já coletado para execuções anteriores.

### Crie um teste útil

Escreva o objetivo da perspectiva do usuário simulado: descreva quem ele é, o que ele deseja e como ele deve avançar na conversa. Não o escreva como instruções para o assistente. O objetivo é compartilhado tanto com o usuário simulado, que o persegue, quanto com o juiz, que o avalia. Por exemplo:

> Você está escolhendo um plano para sua equipe. Explique o tamanho e as necessidades da sua equipe quando solicitado, pergunte qual plano se adequa e continue até entender a recomendação e como se inscrever.

Use **Critérios de validação** para requisitos opcionais que devem afetar apenas a avaliação do juiz, não o comportamento do usuário simulado. Por exemplo:

> A recomendação deve nomear o plano selecionado e conectá‑lo ao tamanho de equipe declarado. A resposta final deve incluir um passo direto de inscrição.

Manter esses critérios separados impede que o usuário simulado conduza artificialmente a conversa em direção às verificações que o juiz aplicará.

Use **Mensagens iniciais** quando o cenário exigir um contexto já estabelecido, como uma objeção do cliente, uma resposta anterior do assistente ou um ponto específico em um fluxo existente. Use `external_user_id` quando o comportamento do gateway depender de uma identidade da sua própria aplicação. O valor é repassado para a inferência do gateway em cada execução desse teste.

Use `resources` para fornecer ao usuário simulado e ao juiz um contexto compartilhado que não pertence à conversa inicial. Forneça até 16 objetos com um `type` e um valor `data` não vazio. `Text` usa `data` como contexto literal; `RemoteResource` recupera o conteúdo da URL em `data`. Por exemplo:

```json
{
  "resources": [
    {
      "type": "Text",
      "data": "O cliente tem uma janela de reembolso de 14 dias."
    },
    {
      "type": "RemoteResource",
      "data": "https://example.com/refund-policy"
    }
  ]
}
```

Os recursos são visíveis ao usuário simulado e ao juiz; eles não são enviados ao gateway em teste como histórico de conversa. Eles não adicionam conhecimento ao gateway. Se o assistente precisar recuperar o mesmo material, disponibilize‑o através do próprio conhecimento ou ferramentas do gateway. O usuário simulado ainda pode revelar naturalmente as informações do recurso em suas mensagens, portanto não trate os recursos como critérios ocultos apenas para o juiz.

Conteúdo remoto pode mudar entre execuções de teste e contribui para o uso. Use apenas URLs públicas e confiáveis cujo conteúdo seja adequado ao teste.

Um teste focado geralmente fornece resultados mais acionáveis do que um cenário amplo. Separe objetivos não relacionados em testes diferentes para que uma falha identifique o comportamento que regressou.

Siga o [tutorial de teste de conversa de múltiplas interações](https://aivax.net/blog/introducing-agentic-tests/) para definir objetivos observáveis, executar uma conversa simulada e inspecionar a recuperação.

### Ganchos de validação

Testes Agênicos persistentes podem chamar ganchos de validação externos durante uma execução. Configure o array `hooks` ao criar ou atualizar um teste:

```json
{
  "hooks": [
    {
      "event": "before-test",
      "url": "https://validator.example/hooks/agentic-tests"
    },
    {
      "event": "after-test",
      "url": "https://validator.example/hooks/agentic-tests"
    },
    {
      "event": "before-inference",
      "url": "https://validator.example/hooks/gateway"
    },
    {
      "event": "after-inference",
      "url": "https://validator.example/hooks/gateway"
    },
    {
      "event": "context-changed",
      "url": "https://validator.example/hooks/agentic-tests"
    }
  ]
}
```

Os eventos suportados são:

| Evento | Quando é enviado | Dados do evento |
|---|---|---|
| `before-test` | Antes do primeiro turno simulado. | `gateway`, `goal` e `metadata`. |
| `after-test` | Depois que o teste atinge um resultado terminal normal e antes de o evento final ser emitido. | O resultado final, motivo, estado, número do turno, pontuação, delta da conversa e sequência de perdas. |
| `before-inference` | Uma vez, antes da inferência principal do gateway em cada turno. | `turn_number` e o array atual `messages`. |
| `after-inference` | Uma vez, depois da inferência principal do gateway em cada turno. | `turn_number` e o array atual `messages`. |
| `context-changed` | Uma vez por turno, depois que a resposta do gateway foi concluída. | `turn_number` e o array atual `messages`. |

`before-inference` e `after-inference` estão disponíveis apenas quando o teste tem como alvo um AI Gateway. Ganchos são suportados para testes persistentes no painel e execuções agendadas; o endpoint direto de validação SSE não aceita `hooks`.

Cada gancho recebe um envelope JSON compatível com worker:

```json
{
  "testId": "<AGENTIC_TEST_ID>",
  "runId": "<AGENTIC_TEST_RUN_ID>",
  "gatewayId": "<GATEWAY_ID>",
  "moment": "2026-08-16T03:00:00Z",
  "event": {
    "name": "before-inference",
    "data": {
      "turn_number": 1,
      "messages": []
    }
  }
}
```

A URL do gancho deve ser um URL HTTP ou HTTPS absoluto, sem credenciais embutidas, e não pode resolver para localhost, loopback, privado, link‑local ou outros endereços locais bloqueados. Quando a conta tem uma chave de gancho, o AIVAX também envia `X-Request-Nonce`; valide‑a antes de confiar no payload. As requisições de gancho usam `POST` com `Content-Type: application/json`.

As respostas dos ganchos seguem a convenção de worker: qualquer resposta `2xx` continua a execução; uma resposta não‑`2xx` ou falha na requisição HTTP a interrompe imediatamente. O corpo da resposta não seleciona outra ação. A execução interrompida é armazenada como `failed`, emite um resultado terminal com `reason: "validation_hook_interrupted"` e inclui entradas de auditoria da chamada de gancho no array `result.hooks` da execução. As entradas de auditoria contêm o evento, URL, timestamp, status ou erro, se a execução continuou e até 4 000 caracteres do corpo da resposta.

### Executar e inspecionar um teste

Selecione **Run test** para colocar uma execução na fila. As execuções podem estar `pending`, `running`, `succeeded`, `failed` ou `cancelled`. Tanto a taxa de novas execuções quanto a simultaneidade ao nível da conta dependem do plano atual. Consulte [Planos e limites](https://docs.aivax.net/pt-br/docs/limits.md#plan-limits) para valores atuais.

Execuções manuais, execuções agendadas e avaliações diretas via API compartilham um quota de novas execuções entre as chaves de API da conta. Uma execução persistente conta quando é enfileirada e não conta novamente quando a execução começa. Turnos de conversa não consomem unidades de execução adicionais, embora limites de inferência aplicáveis ainda se apliquem. Uma solicitação de execução manual acima da quota retorna HTTP 429 sem criar uma execução; aguarde a janela de limite de taxa limpar antes de tentar novamente.

Uma execução processa sua conversa sequencialmente, enquanto execuções elegíveis da mesma conta podem ser executadas simultaneamente. Cada turno verifica se a conta pode continuar operando. Uma execução pode falhar se o saldo for esgotado ou a inferência não puder continuar, e uma execução pendente ou em andamento pode ser cancelada pelo painel.

O inspetor de execução retém:

- mensagens do usuário simulado, assistente e juiz em ordem cronológica;
- timestamp preciso para cada mensagem retida;
- uso de tokens de prompt, prompt em cache e conclusão por mensagem;
- cada opinião do juiz, incluindo seu raciocínio, pontuação, estado e valores de trajetória;
- o resultado final da avaliação, informações de falha e custo total cobrado pela execução.

Use as opiniões do juiz para identificar o turno em que a conversa melhorou, ficou em risco, teve sucesso ou entrou em perda persistente. O detalhe da execução também pode ser exportado como JSON para revisão offline.

### Agendar testes recorrentes

Um teste pode ser executado automaticamente a partir de uma expressão cron padrão de cinco campos. O intervalo mínimo suportado é de cinco minutos. Por exemplo, `*/15 * * * *` executa a cada 15 minutos.

Se a quota de novas execuções da conta estiver esgotada, um teste agendado pendente aguarda a próxima verificação de agendamento sem criar uma execução. O agendamento não contorna a quota nem reserva capacidade separadamente das execuções manuais e avaliações diretas.

Desative o agendamento quando quiser preservar a definição do teste sem criar novas execuções agendadas. Execuções manuais permanecem disponíveis a partir da página do teste.

### Notificações de falha e recuperação

Habilite notificações de falha quando execuções repetidas falharem e devem alertar o proprietário da conta. O **Notification threshold** controla quantas execuções consecutivas no estado `failed` são necessárias antes que o AIVAX envie um alerta. O padrão é `1`.

Essas notificações acompanham erros de execução, não falhas de teste comportamental. Uma execução no estado `succeeded` concluiu sem erro de execução, mas seu resultado comportamental ainda pode ser `loss` ou `incomplete`. Esses resultados não contam para o limite de notificação de falha.

Quando a **Recovery notification** está habilitada, o AIVAX também notifica a conta após uma execução concluir com sucesso seguindo falhas de execução consecutivas suficientes para alcançar o limite configurado. Uma execução bem‑sucedida redefine o contador de falhas consecutivas, mesmo que seu resultado comportamental seja `loss` ou `incomplete`. Portanto, recuperação significa que a execução se recuperou, não que o assistente passou nas verificações comportamentais.

### Retenção

Execuções com sucesso e falhas são retidas por um mês. Execuções canceladas são retidas por um dia. Exporte qualquer resultado que precise permanecer disponível além desses períodos.

## Configurações de avaliação

| Configuração | Padrão | Valores aceitos | Descrição |
| --- | --- | --- | --- |
| `validation_criteria` | `null` | String, parte da mensagem ou lista de partes de mensagem | Requisitos opcionais fornecidos apenas ao juiz. Não orientam o usuário simulado nem o gateway em teste. |
| `resources` | `[]` | Até 16 objetos `{ "type", "data" }` | Contexto adicional fornecido ao usuário simulado e ao juiz. Use `Text` para `data` literal ou `RemoteResource` para conteúdo recuperado da URL em `data`. |
| `hooks` | `[]` | Até 16 objetos `{ "event", "url" }` | Callbacks externos para execuções persistentes. Eventos suportados: `before-test`, `after-test`, `before-inference`, `after-inference` e `context-changed`; `before-inference` e `after-inference` requerem um AI Gateway. |
| `profile` | `medium` | `low`, `medium`, `high` | Seleciona o nível de capacidade e preço usado pelo usuário simulado e pelo juiz. Não substitui o modelo configurado no gateway em teste. |
| `max_turns` | `10` | `2`–`64` | Número máximo de turnos do usuário simulado antes que a execução termine. |
| `minimum_turns` | `1` | `1`–`63`, menor que `max_turns` | Primeiro turno em que o usuário simulado pode receber a opção de encerrar a conversa. |
| `allow_user_exit` | `true` | Boolean | Quando habilitado, o prompt do usuário simulado expõe o token de saída da conversa a partir de `minimum_turns`. Quando desabilitado, essa opção é omitida em todos os prompts do usuário simulado. |
| `judge_start_turn` | `1` | `1`–`63`, menor que `max_turns` | Primeiro turno avaliado pelo juiz. O turno final é sempre avaliado. |
| `loss_threshold` | `0.2` | `0.01`–`0.99` | Limite usado para identificar uma trajetória persistentemente malsucedida. |
| `base_threshold` | `0.9` | `0.01`–`0.99` | Pontuação igual ou superior à qual o objetivo é considerado alcançado. Deve ser maior que `loss_threshold`, com pelo menos `0.1` de diferença entre eles. |
| `user_sampling.top_k` | `0.4` | `0`–`2` | Controla quantas características de comunicação amostradas orientam o usuário simulado. Valores maiores aumentam a variação. |
| `user_sampling.max_decay` | `0.02` | `0`–`1` | Controla o quanto as características amostradas do usuário podem mudar entre turnos. |

Reduza `max_turns` para verificações de regressão rápidas e limitadas. Aumente para fluxos que naturalmente exigem descoberta ou várias chamadas de ferramenta. `minimum_turns` e `judge_start_turn` devem ser menores que `max_turns`; são independentes. Adie `judge_start_turn` quando se espera esclarecimento precoce e pontuações intermediárias não são úteis. Desative `allow_user_exit` quando apenas o juiz ou o orçamento de turnos devem encerrar o teste; `minimum_turns` controla apenas quando o usuário simulado vê sua opção de saída e não atrasa as decisões do juiz. Mantenha uma grande diferença entre os limites de perda e sucesso, a menos que a política tenha sido calibrada contra conversas representativas.

Testes Agênicos cobram a inferência do gateway selecionado mais o uso do usuário simulado e do juiz nas taxas do perfil selecionado. Consulte [Preços](https://docs.aivax.net/pt-br/docs/pricing.md#agentic-tests) para as taxas atuais.

## Execução direta via API

Cada avaliação direta consome uma unidade da mesma quota de conta que as execuções persistentes. Se essa quota for excedida, a solicitação retorna HTTP 429 antes de abrir o stream SSE. Verifique o status HTTP antes de processar eventos e use tentativas limitadas com backoff. Consulte [Planos e limites](https://docs.aivax.net/pt-br/docs/limits.md#semantic-decision-and-agentic-test-rate-limits).

Use o endpoint de geração direta quando uma aplicação precisar executar um teste efêmero e consumir seus eventos imediatamente. Uma execução direta **não** cria um caso de teste persistente nem uma execução no painel.

Autentique‑se com uma chave de API privada do AIVAX, envie `Accept: text/event-stream` e mantenha a chave em um backend confiável. Não exponha uma chave privada em código de navegador ou em um bundle de aplicação distribuída.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Evaluate%20Agentic%20Test)

A solicitação aceita as mesmas configurações principais de avaliação de um teste persistente. Use `model` para o slug do AI Gateway, `goal` para o resultado desejado compartilhado com o usuário simulado e o juiz, `validation_criteria` para requisitos opcionais apenas do juiz, `minimum_turns` e `allow_user_exit` para controlar quando o usuário simulado vê sua opção de saída, `judge_start_turn` para agendar a avaliação do juiz, `start` para mensagens iniciais opcionais, `resources` para contexto adicional `Text` ou `RemoteResource`, e `external_user_id` para uma identidade repassada à inferência do gateway.

Cada mensagem Server‑Sent Events contém este envelope:

```json
{
  "timestamp": 1786329000000,
  "event": {
    "type": "chat.start",
    "data": {
      "turn_number": 1,
      "max_remaining_turns": 10
    }
  }
}
```

Roteie as mensagens por `event.type` e concatene os blocos de conteúdo transmitidos em ordem. Os exemplos abaixo mostram o objeto `event` dentro do envelope SSE. Marcadores de ciclo de vida (`start_generation`, `end_generation`, `turn_analysis_start`, `turn_analysis_end`) carregam um objeto vazio (`data: {}`); blocos de raciocínio compartilham a forma `{ "reasoning_content": "..." }`. Apenas eventos que carregam conteúdo são mostrados integralmente.

- **`chat.start`** — Inicia um turno e relata seu número e o orçamento de turnos restante.

  ```json
  {
    "type": "chat.start",
    "data": {
      "turn_number": 1,
      "max_remaining_turns": 10
    }
  }
  ```

- **`chat.user_message.start_generation`** — Marca o início da geração da mensagem do usuário simulado (`data: {}`).

- **`chat.user_message.reasoning`** — Transmite um bloco de raciocínio exposto pelo modelo do usuário simulado. Use apenas para depuração.

- **`chat.user_message.content`** — Transmite um bloco de conteúdo da mensagem do usuário simulado. Concatene blocos consecutivos na ordem de chegada.

  ```json
  {
    "type": "chat.user_message.content",
    "data": {
      "content": "Você pode explicar a política de reembolso?"
    }
  }
  ```

- **`chat.user_message.end_generation`** — Marca o fim da geração da mensagem do usuário simulado (`data: {}`).

- **`chat.user_message.end_conversation`** — Relata uma saída permitida do usuário simulado após `minimum_turns`. Esse evento não é emitido quando `allow_user_exit` está desativado.

  ```json
  {
    "type": "chat.user_message.end_conversation",
    "data": {
      "reason": "simulated_user_ended_conversation"
    }
  }
  ```

- **`chat.assistant_message.start_generation`** — Marca o início da resposta do gateway selecionado (`data: {}`).

- **`chat.assistant_message.reasoning`** — Transmite um bloco de raciocínio exposto pelo modelo do gateway (mesma forma `reasoning_content`).

- **`chat.assistant_message.refusal`** — Relata uma recusa retornada pelo modelo do gateway.

- **`chat.assistant_message.tool_call`** — Relata uma chamada de ferramenta do assistente, incluindo seu ID, nome e argumentos.

- **`chat.assistant_message.tool_result`** — Relata o resultado de uma ferramenta, incluindo o ID da chamada associada, nome e conteúdo.

- **`chat.assistant_message.content`** — Transmite um bloco de conteúdo da resposta do assistente. Concatene blocos consecutivos na ordem de chegada.

  ```json
  {
    "type": "chat.assistant_message.content",
    "data": {
      "content": "Os reembolsos estão disponíveis dentro de 30 dias."
    }
  }
  ```

- **`chat.assistant_message.end_generation`** — Marca o fim da resposta do gateway selecionado (`data: {}`).

- **`chat.judge.turn_analysis_start`** — Marca o início de uma avaliação contra o objetivo e quaisquer critérios de validação apenas do juiz (`data: {}`).

- **`chat.judge.turn_analysis_result_ready`** — Retorna o raciocínio do juiz, pontuação normalizada, estado atual, medições de trajetória e decisão de continuação. `score` varia de `0.001` a `0.999`; `pass` é falso somente após uma perda persistente ser estabelecida.

  ```json
  {
    "type": "chat.judge.turn_analysis_result_ready",
    "data": {
      "result": {
        "reasoning": "A resposta atendeu ao resultado solicitado e aos critérios de validação.",
        "score": 0.92,
        "pass": true,
        "should_continue": false,
        "state": "success",
        "turn_delta": 0.84,
        "conversation_delta": 1.0,
        "loss_streak": 0,
        "required_loss_streak": 2
      }
    }
  }
  ```

- **`chat.judge.turn_analysis_end`** — Marca o fim da avaliação do turno atual (`data: {}`).

- **`usage_updated`** — Relata o uso de tokens de prompt, prompt em cache e conclusão. `role` pode ser `user`, `assistant` ou `judge`, dependendo da inferência que gerou o uso.

  ```json
  {
    "type": "usage_updated",
    "data": {
      "role": "judge",
      "usage": {
        "prompt_tokens": 1240,
        "cached_prompt_tokens": 320,
        "completion_tokens": 180
      }
    }
  }
  ```

- **`unhandled_error`** — Relata um erro de inferência, seu escopo e se a operação será reexecutada. `scope` pode ser `user_inference`, `gateway_inference` ou `judge_analysis`.

  ```json
  {
    "type": "unhandled_error",
    "data": {
      "error": "O provedor de inferência está temporariamente indisponível.",
      "scope": "gateway_inference",
      "will_retry": true
    }
  }
  ```

- **`chat.validation.end`** — Relata o resultado final e encerra a avaliação. O nome legado do evento é preservado para compatibilidade. `score` é incluído quando o resultado final segue uma avaliação do juiz, mas pode estar ausente quando o orçamento de turnos é esgotado.

  ```json
  {
    "type": "chat.validation.end",
    "data": {
      "outcome": "success",
      "reason": "baseline_reached",
      "state": "success",
      "turn_number": 3,
      "score": 0.92,
      "conversation_delta": 1.0,
      "loss_streak": 0
    }
  }
  ```

O estado do juiz pode ser `active`, `at_risk`, `success` ou `loss`. Um turno fraco não falha imediatamente uma conversa recuperável: a pontuação baixa e a trajetória cumulativa devem permanecer iguais ou abaixo do limite de perda configurado para as avaliações consecutivas exigidas.

Os resultados finais são:

| Resultado | Significado |
| --- | --- |
| `success` | O juiz alcançou `base_threshold`. Uma saída permitida do usuário simulado dispara a avaliação, mas não passa o teste por si só; sem o limite, o resultado seria `incomplete`. |
| `loss` | A pontuação e a trajetória cumulativa permaneceram iguais ou abaixo de `loss_threshold` durante os turnos avaliados consecutivamente exigidos. |
| `incomplete` | A conversa esgotou `max_turns` sem alcançar sucesso ou uma perda persistente. |
| `interrupted` | Uma regra de validação interrompeu a avaliação antes de concluí‑la. |

Uma chave ausente ou inválida retorna `401 Unauthorized`; uma chave de API pública retorna `403 Forbidden`; saldo insuficiente retorna `402 Payment Required`; campos malformados, slugs de gateway indisponíveis ou combinações de limites inválidas retornam `400 Bad Request`. Uma falha de inferência pode chegar como um evento SSE após o início da transmissão.

Para investigar uma falha de inferência, revise a [configuração do AI Gateway](https://docs.aivax.net/pt-br/docs/inference/ai-gateway.md) usada pelo teste.
