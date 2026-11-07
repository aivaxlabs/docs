Source: https://docs.aivax.net/pt-br/docs/inference/chat-completions/moderation.html

# Moderação

A moderação aplica a política de segurança às solicitações dos usuários antes que o modelo principal as responda. Utilize-a para bloquear solicitações inseguras ou fora da política em assistentes voltados ao usuário. Configure-a na seção **Moderação de Conteúdo** do editor do gateway ou em `parameters.moderationParameters`.

A moderação é uma configuração do Gateway AI; chamadas diretas a `chat/completions` com um nome de modelo não a executam, e as solicitações não podem alterá-la.

## Escolha um modo

O campo `moderationParameters.mode` seleciona como a moderação é executada:

| | `LayeredGuardrail` (padrão) | `SelfAssessment` |
| --- | --- | --- |
| Quem decide | Um modelo de salvaguarda independente, antes do modelo principal | O próprio modelo principal |
| Inferência extra | Sim, cobrada como uso de moderação | Não |
| Latência adicionada | Uma inferência de salvaguarda | Nenhuma |
| Isolamento | Independente do modelo principal e de suas instruções | Depende do julgamento do modelo principal |
| Requisitos do modelo | Nenhum | O modelo principal deve suportar chamada de ferramentas |

- `LayeredGuardrail`: Um modelo de salvaguarda independente analisa o texto de entrada da conversa antes do modelo principal. As conversas sinalizadas são bloqueadas e o modelo principal responde com uma recusa. O uso de moderação é cobrado conforme descrito em [Preços de inferência](https://docs.aivax.net/pt-br/docs/inference/chat-completions/concepts.md#pricing).
- `SelfAssessment`: Nenhum modelo de salvaguarda separado é executado, portanto, não há cobrança por análise de moderação. O modelo principal recebe instruções de moderação construídas a partir dos mesmos níveis de sensibilidade das categorias e regras adicionais, além de uma ferramenta interna de recusa. Quando o modelo julga que a solicitação mais recente atinge o limite de uma categoria habilitada, ele chama a ferramenta com um motivo, as categorias violadas e uma mensagem final para o usuário. A inferência termina imediatamente, outras chamadas de ferramentas dessa rodada são ignoradas, a mensagem final é retornada como resposta do assistente e a resposta é marcada como recusa. A solicitação é rejeitada quando o modelo selecionado não suporta chamada de ferramentas.

Como o `SelfAssessment` depende do julgamento do modelo principal em vez de um classificador independente, ele troca latência e custo menores por isolamento mais fraco: não é uma camada independente e a qualidade da aplicação depende do modelo. Prefira `LayeredGuardrail` quando tentativas de jailbreak forem um risco real.

## Categorias

No modo `LayeredGuardrail`, quando pelo menos uma categoria de moderação está habilitada, o AIVAX envia o texto disponível da conversa para um modelo de salvaguarda. A salvaguarda avalia a solicitação mais recente do usuário no contexto estabelecido pela conversa e retorna uma pontuação de 0 a 10 para cada categoria.

| Categoria | Propriedade do Gateway | O que a salvaguarda avalia |
| --- | --- | --- |
| **Violência e discurso de ódio** | `violenceThreshold` | Violência, ódio, extremismo, ameaças ou incentivo à violência física. |
| **Conteúdo sexual e explícito** | `sexualExplicitThreshold` | Conteúdo sexualmente explícito ou adulto. |
| **Tópicos políticos** | `politicalThreshold` | Persuasão política, campanhas, manipulação ou conteúdo altamente político. |
| **Conteúdo perigoso** | `dangerousContentThreshold` | Armas, explosivos, abuso cibernético, autolesão ou outros atos e instruções perigosas. |
| **Tentativas de jailbreak** | `jailbreakThreshold` | Tentativas de anular instruções, revelar instruções protegidas, exfiltrar dados ou injetar prompts. |

## Entenda os níveis de sensibilidade

O valor configurado no gateway é um **nível de sensibilidade** de `0` a `10`, não a própria pontuação da salvaguarda. Um nível mais alto reduz a pontuação necessária para bloquear a entrada. Valores fora desse intervalo são rejeitados quando o gateway é salvo.

| Nível de sensibilidade | Pontuações da salvaguarda que bloqueiam |
| ---: | --- |
| `0` | Categoria desabilitada |
| `1` | `10` |
| `3` | `8`–`10` |
| `5` | `6`–`10` |
| `8` | `3`–`10` |
| `10` | `1`–`10` |

Para categorias habilitadas, o corte de bloqueio é `11 - nível de sensibilidade`. Uma pontuação de salvaguarda de `0` nunca bloqueia. Configure cada categoria independentemente; a solicitação é bloqueada quando qualquer categoria habilitada atinge seu corte.

No modo `SelfAssessment`, os mesmos níveis de sensibilidade definem o limite que o modelo principal deve aplicar, embora não haja uma pontuação numérica de salvaguarda.

## Adicionar regras específicas do gateway

As **regras adicionais de moderação** permitem que um administrador do gateway descreva políticas que não estão totalmente expressas pelas descrições das categorias integradas. A salvaguarda lê essas regras junto com a política integrada e as usa para calibrar todas as cinco pontuações. No modo `SelfAssessment`, o modelo principal recebe as mesmas regras com suas instruções de moderação.

Por exemplo:

```text
Permitir que os usuários descrevam acidentes e lesões ao solicitar cobertura ou assistência de seguro.
Trate solicitações de instruções para causar um acidente ou prejudicar alguém como conteúdo perigoso.
```

As regras adicionais orientam a classificação; elas não criam uma pontuação separada nem bloqueiam uma entrada diretamente. Pelo menos uma categoria deve ter um nível de sensibilidade acima de `0` para que a moderação seja executada. No exemplo acima, habilite **Conteúdo perigoso** para que a pontuação da salvaguarda possa produzir uma decisão de bloqueio.

Escreva as regras como declarações de política curtas com casos explícitos permitidos e proibidos. Não inclua segredos, credenciais ou dados operacionais privados, pois as regras são armazenadas com a configuração do gateway e enviadas ao modelo de salvaguarda durante a moderação.

O seguinte fragmento de gateway habilita diferentes níveis de sensibilidade e fornece orientação específica do domínio à salvaguarda. Os valores são um exemplo, não uma linha de base recomendada para produção:

```json
{
  "moderationParameters": {
    "mode": "LayeredGuardrail",
    "violenceThreshold": 4,
    "sexualExplicitThreshold": 4,
    "politicalThreshold": 2,
    "dangerousContentThreshold": 6,
    "jailbreakThreshold": 7,
    "additionalRules": "Allow descriptions of accidents and injuries for insurance support. Treat instructions to cause accidents or harm someone as dangerous content."
  }
}
```

## O que acontece quando uma entrada é bloqueada

Quando qualquer categoria habilitada atinge seu corte:

1. O AIVAX marca as mensagens originais da conversa como indisponíveis para a solicitação de inferência principal.
2. O AIVAX as substitui por uma instrução identificando as categorias que causaram o bloqueio.
3. O modelo principal gera uma recusa em vez de responder à solicitação original.

A recusa é gerada pelo modelo; a moderação não retorna um corpo de resposta fixo. No modo `SelfAssessment`, o modelo principal produz a recusa através da ferramenta de recusa, conforme descrito acima. Solicitações bloqueadas ainda são cobradas pela análise de moderação e pela geração da recusa.

No modo `LayeredGuardrail`, se todos os modelos de moderação falharem em produzir um resultado válido, a solicitação não será rejeitada. O modelo principal receberá instruções estritas derivadas das categorias configuradas, níveis de sensibilidade e regras adicionais, aplicando a política ele mesmo. Se seu aplicativo deve falhar de forma fechada (fail closed) quando a moderação estiver indisponível, imponha isso no seu aplicativo ou em um worker.

## Onde a moderação é executada no pipeline

A moderação é executada uma vez por solicitação, antes que o loop agêntico comece. Consulte [Pipeline de processamento](https://docs.aivax.net/pt-br/docs/inference/chat-completions/processing-pipeline.md) para a ordem completa. Como consequência:

- [Workers](https://docs.aivax.net/pt-br/docs/inference/workers.md) são executados primeiro. Um worker pode bloquear uma solicitação antes que a moderação seja executada, e a moderação avalia a conversa conforme alterada pelo worker.
- Documentos recuperados por estratégias de injeção [RAG](https://docs.aivax.net/pt-br/docs/inference/chat-completions/processing-pipeline.md#rag) já estão na última mensagem do usuário, então a salvaguarda os avalia junto com o texto do usuário.
- Resultados de ferramentas produzidos posteriormente na mesma solicitação, incluindo resultados de pesquisa `QueryFunction`, não são moderados.
- [Pré-processamento multimodal](https://docs.aivax.net/pt-br/docs/inference/chat-completions/multimodal-pre-processing.md) é executado depois, então as descrições de mídia não são moderadas.

## Contexto e limitações atuais

No modo `LayeredGuardrail`, a salvaguarda recebe o histórico de conversa disponível, não apenas a mensagem mais recente. Os papéis das mensagens e o texto são preservados como dados de conversa serializados não confiáveis para reduzir a chance de que instruções dentro da conversa anulem a política da salvaguarda. Se a conversa exceder a janela de contexto da salvaguarda, o contexto mais antigo pode ser truncado.

A moderação atualmente aplica-se apenas ao texto de entrada:

- A saída gerada não é moderada.
- Imagens, áudio, vídeo e conteúdos de arquivos não são analisados. A salvaguarda recebe apenas um marcador indicando que havia mídia presente.
- A autorização de ferramentas ou workers ainda requer política em nível de aplicativo; a moderação não é um mecanismo de autorização.
- No modo `LayeredGuardrail`, a moderação adiciona uma inferência de salvaguarda antes da inferência principal, o que adiciona latência e uso de moderação faturável (consulte [Preços de inferência](https://docs.aivax.net/pt-br/docs/inference/chat-completions/concepts.md#pricing)). O modo `SelfAssessment` não adiciona inferência separada.

Use a moderação para políticas amplas de segurança. Use workers quando a decisão depender de identidade externa, estado da conta ou política específica do negócio.

Para um guia de decisão sobre prompts de sistema, uma etapa de moderação separada e autorização, consulte [Moderação de entrada LLM: prompt de sistema ou etapa de moderação separada?](https://aivax.net/blog/aivax-gateway-moderation/).
