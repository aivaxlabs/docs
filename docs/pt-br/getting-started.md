# Começando

Este guia leva você de uma conta AIVAX a uma conclusão de chat compatível com OpenAI verificada. O exemplo usa Python e uma chave de API privada de um ambiente do lado do servidor.

Até o final, você terá confirmado que sua chave e o modelo ou AI Gateway selecionado podem concluir uma solicitação.

## Antes de começar

Você precisa:

- Uma conta AIVAX com acesso ao painel e permissão para criar uma chave de API privada.
- Python 3.8 ou superior com `pip` disponível.

Para preços e limites operacionais, veja [Preços](pricing.md) e [Planos e limites](limits.md).

Production API base URL:

```text
https://inference.aivax.net
```

OpenAI-compatible SDK base URL:

```text
https://inference.aivax.net/v1
```

## 1. Crie uma chave de API privada

Crie uma chave **privada** a partir da área de Chaves de API do painel AIVAX. Copie a chave quando ela for exibida e armazene-a como um segredo; não cole o valor real no código abaixo.

Chaves privadas são destinadas a aplicações confiáveis do lado do servidor. Chaves públicas são credenciais restritas para rotas do lado do cliente intencionalmente expostas e não são substitutas de uma chave de backend.

Se você estiver construindo um widget web público ou experiência de mensagens, revise [Chat clients](features/chat-clients.md) antes de expor qualquer credencial. As sessões de chat fornecem um limite mais claro para a identidade do usuário, histórico de conversas e anexos.

Veja [Authentication](authentication.md) para esquemas de autenticação suportados, comportamento de chaves privadas e públicas, e orientações sobre manipulação de segredos.

## 2. Instale o SDK OpenAI

Instale o SDK no ambiente Python que você usará para este exemplo:

```bash
python -m pip install openai
```

Mantenha a chave fora do seu arquivo fonte. Por exemplo, defina uma variável de ambiente chamada `AIVAX_API_KEY` usando o método de gerenciamento de segredos adequado ao seu shell ou plataforma de implantação.

## 3. Escolha um modelo ou AI Gateway

O campo `model` pode identificar:

- Um modelo hospedado retornado pelo endpoint de listagem de modelos.
- Um AI Gateway disponível na sua conta.

Use um **modelo hospedado** para uma chamada direta, única ou experimento inicial. Use um **AI Gateway** quando quiser reutilizar o mesmo modelo, instruções, coleções RAG, habilidades, ferramentas, moderação e configurações de saída em várias solicitações ou usuários.

Slugs de gateway são suportados com chaves privadas. Compleções de chat com chave pública devem usar o UUID completo do gateway e não podem chamar modelos integrados diretamente.

<script src="https://inference.aivax.net/apidocs?embed-target=Model%20listing&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

Copie um nome de modelo ou identificador de gateway que esteja disponível na sua conta. Você o usará como `<MODEL_OR_GATEWAY_ID>` na próxima etapa.

## 4. Faça a primeira solicitação

Crie um arquivo chamado `quickstart.py` com o seguinte código:

```python
import os

from openai import OpenAI

client = OpenAI(
    base_url="https://inference.aivax.net/v1",
    api_key=os.environ["AIVAX_API_KEY"],
)

response = client.chat.completions.create(
    model="<MODEL_OR_GATEWAY_ID>",
    messages=[
        {"role": "user", "content": "Write a one-sentence welcome message."}
    ],
)

print(response.choices[0].message.content)
```

Substitua `<MODEL_OR_GATEWAY_ID>` pelo nome exato do modelo hospedado ou identificador de gateway selecionado na etapa anterior. Não substitua `AIVAX_API_KEY` pela própria chave; o código lê o segredo do ambiente.

Execute o arquivo:

```bash
python quickstart.py
```

Uma solicitação bem-sucedida imprime uma frase gerada e sai sem erro de API.

<script src="https://inference.aivax.net/apidocs?embed-target=Inference%20(chat%20completions)&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## 5. Confirme a integração

Confirme que a resposta gerada corresponde ao prompt e vem do modelo ou AI Gateway selecionado na etapa anterior. Isso verifica o endpoint, credencial e seleção de modelo usados pela sua aplicação.

Antes de aumentar o tráfego ou processar entradas grandes, revise [Preços](pricing.md) e [Planos e limites](limits.md).

## Solucionar problemas da primeira solicitação

AIVAX usa dois estilos de resposta:

- Endpoints compatíveis com OpenAI retornam um objeto `error` no estilo OpenAI.
- Endpoints de conta e administrativos retornam um envelope de resposta AIVAX com um erro ou um valor `data` bem-sucedido.

| Status | O que verificar |
| --- | --- |
| `400 Bad Request` | Confirme o identificador do modelo ou gateway e remova parâmetros não suportados da solicitação. |
| `401 Unauthorized` | Confirme que a chave privada está presente, completa, ativa e enviada através da configuração do SDK. |
| `402 Payment Required` | Revise [Preços](pricing.md) e confirme que a conta está pronta para uma solicitação paga. |
| `403 Forbidden` | Confirme que o tipo de chave, modelo ou recurso selecionado permite esta operação. |
| `429 Too Many Requests` | Tente novamente mais tarde e revise [Planos e limites](limits.md) antes de aumentar o volume de solicitações. |

Se a solicitação ainda falhar, verifique nesta ordem:

1. `base_url` é `https://inference.aivax.net/v1`.
2. `AIVAX_API_KEY` está disponível para o processo Python e contém uma chave privada.
3. O modelo ou gateway selecionado existe e está disponível para a conta.
4. Para um gateway, teste um prompt simples antes de adicionar RAG, ferramentas, mídia ou saída estruturada, para que você possa isolar problemas de configuração.

## Inferência de longa duração

A maioria das aplicações deve usar a URL base padrão do SDK, `https://inference.aivax.net/v1`. Contudo, uma solicitação que realiza raciocínio extendido, usa várias ferramentas, processa um contexto grande ou aguarda um modelo upstream lento pode permanecer aberta mais tempo que o proxy padrão permite. Se essa solicitação terminar com HTTP `524` enquanto a AIVAX ainda a processa, use o host de inferência direta:

```text
https://direct.inference.aivax.net/v1
```

O host direto contorna o caminho padrão do proxy enquanto preserva o mesmo contrato de solicitação e resposta síncrona compatível com OpenAI. Ele não transforma a solicitação em um trabalho em segundo plano: mantenha a conexão do cliente aberta até que a conclusão termine e configure um timeout do cliente que cubra o tempo de processamento esperado.

Use a mesma chave de API privada, identificador de modelo ou AI Gateway, mensagens e parâmetros de solicitação. Altere a URL base do SDK e o timeout:

```python
import os

from openai import OpenAI

client = OpenAI(
    base_url="https://direct.inference.aivax.net/v1",
    api_key=os.environ["AIVAX_API_KEY"],
    timeout=300.0,
)

response = client.chat.completions.create(
    model="<MODEL_OR_GATEWAY_ID>",
    messages=[
        {
            "role": "user",
            "content": "Analyze this case carefully and provide a detailed recommendation.",
        }
    ],
)

print(response.choices[0].message.content)
```

O host direto suporta listagem de modelos e completações de chat compatíveis com OpenAI em `/v1/models` e `/v1/chat/completions`, incluindo seus aliases `/api/v1`. Ele também suporta rotas de geração, consulta, resposta e classificação da AIVAX. O gerenciamento de contas, gerenciamento de AI Gateway e outras APIs administrativas não são expostas por este host; continue usando `https://inference.aivax.net` para elas.

Use o host direto especificamente para inferência que pode durar mais que o proxy padrão. Ele não é um fallback para respostas `400`, `401`, `402`, `403` ou `429`, e mudar de host não altera autenticação, faturamento, disponibilidade de modelo ou limites da conta. Para cargas de trabalho que não precisam de uma conexão síncrona aberta, considere [Batch](features/batch.md) em vez disso.

## Escolha o próximo produto

Depois que a solicitação mínima funcionar, adicione uma capacidade de cada vez:

- [AI Gateways](inference/ai-gateway.md) — torne a configuração do assistente reutilizável em solicitações e usuários.
- [Structured responses](inference/structured-responses.md) — exija que o JSON gerado siga um esquema de aplicação.
- [RAG collections](rag/collections.md) — indexe seus documentos, teste a recuperação e anexe conhecimento fundamentado a um gateway.
- [Built-in tools](tools/builtin-tools.md), [MCP](tools/mcp.md) ou [Protocol functions](tools/protocol-functions.md) — permita que o assistente recupere informações ao vivo ou execute ações.
- [Chat clients](features/chat-clients.md) — entregue um gateway via chat web ou canais de mensagem suportados.
- [Text and media products](overview.md#process-text-documents-and-media) — classifique ou segmente documentos, gere imagens ou fala, transcreva áudio e descreva mídia.
- [Batch](features/batch.md) — aplique o mesmo fluxo de trabalho a muitos registros independentes de forma assíncrona.
- [Agentic Tests](inference/agentic-tests.md) — avalie uma conversa completa de gateway antes e depois de mudanças de configuração.

Antes de aumentar o tráfego ou processar entradas grandes, revise [Preços](pricing.md) e [Planos e limites](limits.md).