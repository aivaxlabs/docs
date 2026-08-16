# Testes Agentes

Testes Agentes avaliam como um Gateway de IA se comporta ao longo de uma conversa completa e orientada a objetivo, em vez de pontuar uma única resposta isolada. O AIVAX simula a próxima mensagem do usuário, envia cada turno ao gateway selecionado e usa um juiz independente para determinar se a conversa atingiu seu objetivo, permanece recuperável ou se afastou persistentemente do resultado esperado.

Use Testes Agentes para criar verificações de regressão repetíveis para suporte, vendas, integração, uso de ferramentas, RAG e outros fluxos de agente de múltiplas interações. Como um teste roda através do Gateway de IA configurado, ele exercita o modelo, instruções, ferramentas, habilidades, conhecimento e configurações de inferência do gateway em conjunto.

## Testes persistentes no painel

Abra **Agentic Tests** no painel do AIVAX para criar e gerenciar casos de teste reutilizáveis. Um teste armazena:

- o gateway de IA em teste;
- um objetivo que descreve o resultado conversacional esperado e é compartilhado com o usuário simulado e o juiz;
- critérios de validação opcionais usados apenas pelo juiz;
- mensagens iniciais opcionais e um identificador de usuário externo;
- amostragem do usuário simulado, limites de turnos, comportamento de saída e limites de avaliação;
- um agendamento recorrente opcional;
- configurações de notificação de falha e recuperação.

A definição do teste é reutilizável. Cada execução cria uma corrida separada, de modo que alterar um teste mais tarde não substitui o histórico já coletado para corridas anteriores.

### Crie um teste útil

Escreva o objetivo como um resultado observável em vez de instruções para o assistente. O objetivo é compartilhado tanto com o usuário simulado, que o persegue, quanto com o juiz, que o avalia. Por exemplo:

> Identifique o tamanho da equipe do cliente, recomende o plano correto, explique por que ele se encaixa e forneça o próximo passo de inscrição.

Use **Validation criteria** para requisitos opcionais que devem afetar apenas a avaliação do juiz, não o comportamento do usuário simulado. Por exemplo:

> A recomendação deve nomear o plano selecionado e conectá‑lo ao tamanho de equipe declarado. A resposta final deve incluir um passo direto de inscrição.

Manter esses critérios separados impede que o usuário simulado direcione artificialmente a conversa para as verificações que o juiz aplicará.

Use **Start messages** quando o cenário exigir um contexto já estabelecido, como uma objeção do cliente, uma resposta anterior do assistente ou um ponto específico em um fluxo existente. Use `external_user_id` quando o comportamento do gateway depender de uma identidade da sua própria aplicação. O valor é encaminhado para a inferência do gateway em cada execução desse teste.

Um teste focado geralmente fornece resultados mais acionáveis do que um cenário amplo. Separe objetivos não relacionados em testes diferentes para que uma falha identifique o comportamento que regrediu.

### Execute e inspecione um teste

Selecione **Run test** para enfileirar uma execução. As corridas podem estar `pending`, `running`, `succeeded`, `failed` ou `cancelled`. A simultaneidade ao nível de conta depende do plano atual:

| Plano | Execuções simultâneas por conta |
| --- | --- |
| Free | 1 |
| Pro | 4 |
| Max | 8 |

Uma corrida processa sua conversa sequencialmente, enquanto corridas elegíveis da mesma conta podem ser executadas simultaneamente. Cada turno verifica se a conta pode continuar operando. Uma corrida pode falhar se o saldo for esgotado ou a inferência não puder continuar, e uma corrida pendente ou em execução pode ser cancelada pelo painel.

O inspetor de corrida retém:

- mensagens do usuário simulado, assistente e juiz em ordem cronológica;
- um timestamp preciso para cada mensagem retida;
- uso de tokens de prompt, prompt em cache e conclusão por mensagem;
- toda opinião do juiz, incluindo seu raciocínio, pontuação, estado e valores de trajetória;
- o resultado final da avaliação, informações de falha e custo total cobrado para a execução.

Use as opiniões do juiz para identificar o turno em que a conversa melhorou, ficou em risco, teve sucesso ou entrou em perda persistente. O detalhe da corrida também pode ser exportado como JSON para revisão offline.

### Agende testes recorrentes

Um teste pode ser executado automaticamente a partir de uma expressão cron padrão de cinco campos. O intervalo mínimo suportado é de cinco minutos. Por exemplo, `*/15 * * * *` executa a cada 15 minutos.

Desative o agendamento quando quiser preservar a definição do teste sem criar novas execuções agendadas. Execuções manuais permanecem disponíveis na página do teste.

### Notificações de falha e recuperação

Habilite notificações de falha quando falhas repetidas na execução devem alertar o proprietário da conta. **Notification threshold** controla quantas execuções consecutivas no estado `failed` são necessárias antes que o AIVAX envie um alerta. O padrão é `1`.

Quando **Recovery notification** está habilitada, o AIVAX também notifica a conta após uma corrida concluir com sucesso após falhas consecutivas suficientes para atingir o limiar configurado. Uma corrida concluída com sucesso reinicia o contador de falhas consecutivas.

### Retenção

Corridas bem‑sucedidas e falhas são retidas por um mês. Corridas canceladas são retidas por um dia. Exporte qualquer resultado que precise permanecer disponível além desses períodos.

## Configurações de avaliação

| Configuração | Padrão | Valores aceitos | Descrição |
| --- | ---: --- --- |
| `validation_criteria` | `null` | String, parte da mensagem ou lista de partes de mensagem | Requisitos opcionais fornecidos apenas ao juiz. Eles não orientam o usuário simulado nem o gateway em teste. |
| `profile` | `medium` | `low`, `medium`, `high` | Seleciona a capacidade e a faixa de preço usadas pelo usuário simulado e pelo juiz. Não substitui o modelo configurado no gateway em teste. |
| `max_turns` | `10` | `2`–`64` | Número máximo de turnos do usuário simulado antes que a corrida termine. |
| `minimum_turns` | `1` | `1`–`63`, menor que `max_turns` | Primeiro turno em que o usuário simulado pode receber a opção de encerrar a conversa. |
| `allow_user_exit` | `true` | Boolean | Quando habilitado, o prompt do usuário simulado expõe o token de saída da conversa a partir de `minimum_turns`. Quando desabilitado, essa opção é omitida de todo prompt do usuário simulado. |
| `judge_start_turn` | `1` | `1`–`63`, menor que `max_turns` | Primeiro turno avaliado pelo juiz. O último turno é sempre avaliado. |
| `loss_threshold` | `0.2` | `0.01`–`0.99` | Limite usado para identificar uma trajetória persistentemente malsucedida. |
| `base_threshold` | `0.9` | `0.01`–`0.99` | Pontuação igual ou superior à qual o objetivo é considerado alcançado. Deve ser maior que `loss_threshold`, com mais de `0.1` entre eles. |
| `user_sampling.top_k` | `0.4` | `0`–`2` | Controla quantas características de comunicação amostradas guiam o usuário simulado. Valores mais altos aumentam a variação. |
| `user_sampling.max_decay` | `0.02` | `0`–`1` | Controla como as características amostradas do usuário podem mudar entre turnos. |

Reduza `max_turns` para verificações de regressão rápidas e limitadas. Aumente para fluxos que naturalmente requerem descoberta ou várias chamadas de ferramenta. `minimum_turns` e `judge_start_turn` devem ser menores que `max_turns`; caso contrário, são independentes. Adie `judge_start_turn` quando se espera esclarecimento precoce e pontuações intermediárias não são úteis. Desative `allow_user_exit` quando apenas o juiz ou o orçamento de turnos deve encerrar o teste; `minimum_turns` controla apenas quando o usuário simulado vê sua opção de saída e não atrasa as decisões do juiz. Mantenha uma grande diferença entre os limites de perda e sucesso, a menos que a política tenha sido calibrada contra conversas representativas.

Testes Agentes cobram a inferência do gateway selecionado mais o uso do usuário simulado e do juiz nas taxas do perfil selecionado. Consulte [Pricing](../pricing.md#agentic-tests) para as taxas atuais.

## Execução direta da API

Use o endpoint de geração direta quando um aplicativo precisar executar um teste efêmero e consumir seus eventos imediatamente. Uma execução direta **não** cria um caso de teste persistente nem uma corrida no painel.

Autentique‑se com uma chave de API privada do AIVAX, envie `Accept: text/event-stream` e mantenha a chave em um backend confiável. Não exponha uma chave privada em código de navegador ou em um pacote de aplicativo distribuído.

<script src="https://inference.aivax.net/apidocs?embed-target=Evaluate%20Tests&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

A solicitação aceita as mesmas configurações principais de avaliação de um teste persistente. Use `model` para o slug do Gateway de IA, `goal` para o resultado desejado compartilhado com o usuário simulado e o juiz, `validation_criteria` para requisitos opcionais apenas do juiz, `minimum_turns` e `allow_user_exit` para controlar quando o usuário simulado vê sua opção de saída, `judge_start_turn` para agendar a avaliação do juiz, `start` para mensagens iniciais opcionais e `external_user_id` para uma identidade encaminhada à inferência do gateway.

Cada mensagem de Server‑Sent Events contém este envelope:

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

Roteie as mensagens por `event.type` e concatene os blocos de conteúdo transmitidos em ordem. Os exemplos abaixo mostram o objeto `event` dentro do envelope SSE.

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

- **`chat.user_message.start_generation`** — Marca o início da geração da mensagem do usuário simulado.

  ```json
  {
    "type": "chat.user_message.start_generation",
    "data": null
  }
  ```

- **`chat.user_message.reasoning`** — Transmite um bloco de raciocínio exposto pelo modelo do usuário simulado. Use apenas para depuração.

  ```json
  {
    "type": "chat.user_message.reasoning",
    "data": {
      "reasoning_content": "Okay, the user is"
    }
  }
  ```

- **`chat.user_message.content`** — Transmite um bloco de conteúdo da mensagem do usuário simulado. Concatene blocos consecutivos na ordem de chegada.

  ```json
  {
    "type": "chat.user_message.content",
    "data": {
      "content": "Can you explain the refund policy?"
    }
  }
  ```

- **`chat.user_message.end_generation`** — Marca o fim da geração da mensagem do usuário simulado.

  ```json
  {
    "type": "chat.user_message.end_generation",
    "data": null
  }
  ```

- **`chat.user_message.end_conversation`** — Relata uma saída permitida do usuário simulado após `minimum_turns`. Esse evento não é emitido quando `allow_user_exit` está desativado.

  ```json
  {
    "type": "chat.user_message.end_conversation",
    "data": {
      "reason": "simulated_user_ended_conversation"
    }
  }
  ```

- **`chat.assistant_message.start_generation`** — Marca o início da resposta do gateway selecionado.

  ```json
  {
    "type": "chat.assistant_message.start_generation",
    "data": null
  }
  ```

- **`chat.assistant_message.reasoning`** — Transmite um bloco de raciocínio exposto pelo modelo do gateway.

  ```json
  {
    "type": "chat.assistant_message.reasoning",
    "data": {
      "reasoning_content": "I should answer with the applicable policy and next steps."
    }
  }
  ```

- **`chat.assistant_message.content`** — Transmite um bloco de conteúdo da resposta do assistente. Concatene blocos consecutivos na ordem de chegada.

  ```json
  {
    "type": "chat.assistant_message.content",
    "data": {
      "content": "Refunds are available within 30 days."
    }
  }
  ```

- **`chat.assistant_message.end_generation`** — Marca o fim da resposta do gateway selecionado.

  ```json
  {
    "type": "chat.assistant_message.end_generation",
    "data": null
  }
  ```

- **`chat.judge.turn_analysis_start`** — Marca o início de uma avaliação contra o objetivo e quaisquer critérios de validação apenas do juiz.

  ```json
  {
    "type": "chat.judge.turn_analysis_start",
    "data": null
  }
  ```

- **`chat.judge.turn_analysis_result_ready`** — Retorna o raciocínio do juiz, pontuação normalizada, estado atual, medições de trajetória e decisão de continuação. `score` varia de `0.001` a `0.999`; `pass` é falso apenas após ser estabelecida uma perda persistente.

  ```json
  {
    "type": "chat.judge.turn_analysis_result_ready",
    "data": {
      "result": {
        "reasoning": "The response satisfied the requested outcome and validation criteria.",
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

- **`chat.judge.turn_analysis_end`** — Marca o fim da avaliação do turno atual.

  ```json
  {
    "type": "chat.judge.turn_analysis_end",
    "data": null
  }
  ```

- **`usage_updated`** — Relata uso de tokens de prompt, prompt em cache e conclusão. `role` é `user`, `assistant` ou `judge` dependendo da inferência que gerou o uso.

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

- **`unhandled_error`** — Relata um erro de inferência, seu escopo e se a operação será tentada novamente. `scope` é `user_inference`, `gateway_inference` ou `judge_analysis`.

  ```json
  {
    "type": "unhandled_error",
    "data": {
      "error": "The inference provider is temporarily unavailable.",
      "scope": "gateway_inference",
      "will_retry": true
    }
  }
  ```

- **`chat.validation.end`** — Relata o resultado final e encerra a avaliação. O nome legado do evento é mantido para compatibilidade. `score` é incluído quando o resultado final segue uma avaliação do juiz, mas pode estar ausente quando o orçamento de turnos se esgota.

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

O estado do juiz pode ser `active`, `at_risk`, `success` ou `loss`. Um turno fraco não falha imediatamente uma conversa recuperável: a pontuação baixa e a trajetória acumulada devem permanecer iguais ou abaixo do limite de perda configurado para as avaliações consecutivas exigidas.

Os resultados finais são:

| Resultado | Significado |
| --- | --- |
| `success` | O juiz alcançou `base_threshold`, ou o usuário simulado declarou o objetivo concluído. |
| `loss` | A pontuação e a trajetória acumulada permaneceram iguais ou abaixo de `loss_threshold` nas avaliações consecutivas exigidas. |
| `incomplete` | A conversa esgotou `max_turns` sem alcançar sucesso ou uma perda persistente. |

Uma chave ausente ou inválida devolve `401 Unauthorized`; uma chave de API pública devolve `403 Forbidden`; saldo insuficiente devolve `402 Payment Required`; e campos malformados, slugs de gateway indisponíveis ou combinações de limites inválidas devolvem `400 Bad Request`. Uma falha de inferência pode chegar como um evento SSE após o início da transmissão.