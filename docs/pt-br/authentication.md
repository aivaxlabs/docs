# Autenticação

AIVAX autentica solicitações de API com chaves de API de conta. O middleware de autenticação aceita chaves de:

- `Authorization: Bearer <API_KEY>`
- `Authorization: Basic <BASE64_USERNAME_COLON_API_KEY>`
- `?api-key=<API_KEY>`

Prefira o cabeçalho `Authorization` para chamadas de servidor para servidor. Use o parâmetro de consulta apenas quando um cliente ou integração não puder enviar cabeçalhos, pois URLs podem ser registradas por proxies, navegadores e ferramentas de monitoramento.

## Tipos de chave de API

AIVAX tem duas famílias de chaves porque os casos de uso voltados para navegador e para servidor têm perfis de risco diferentes. Se o seu código roda no seu servidor, use uma chave privada e mantenha-a fora de bundles de cliente, logs e repositórios públicos. Se o seu código roda em um navegador ou outro ambiente onde a chave pode ser inspecionada pelo usuário final, use uma chave pública e limite o fluxo de trabalho a rotas projetadas para acesso público.

| Tipo | Prefixo | Uso pretendido | Acesso |
| --- | --- | --- | --- |
| Chave privada | `sk-aiv-acc` | Integrações do lado do servidor e chamadas de API administrativas. | APIs de conta autenticadas e inferência compatível com OpenAI. |
| Chave pública | `pk-aiv-` | Chamadas restritas do lado do cliente para rotas explicitamente públicas. | Rotas públicas de consulta/resposta RAG e chamadas restritas de conclusão de chat. |

Chaves públicas podem ser usadas para busca semântica RAG, geração de respostas RAG, reclassificação autônoma, geração de fala, descrições de mídia, geração de imagens e conclusões de chat. Quando uma chave pública chama conclusões de chat:

- O `model` deve ser um UUID completo do AI Gateway; chamadas diretas de modelo integrado e a pesquisa de slug do gateway são desativadas.
- A pesquisa de slug do gateway está desativada.
- Fontes MCP, funções de protocolo, ferramentas embutidas, Bash, habilidades e opções de sentinela são removidas da solicitação.
- Apenas estes parâmetros de solicitação são aceitos: `model`, `messages`, `prompt`, `temperature`, `top_p`, `top_k`, `seed`, `tools`, `reasoning_effort`, `max_completion_tokens` e `stream`.
- Limites de taxa de solicitação e token são aplicados globalmente por chave e por endereço remoto.

Use chaves privadas para serviços de backend, gerenciamento de contas, listagem de modelos, gerenciamento de coleções, operações em lote e qualquer fluxo de trabalho que precise da superfície completa de ferramentas do gateway.

Para a primeira solicitação do lado do servidor, continue com [Getting Started](getting-started.md). Se você está expondo uma experiência de navegador ou widget para usuários finais, revise [Chat Clients](/docs/pt-br/features/chat-clients) antes de decidir se uma chave pública é o limite correto.

## Criar e listar chaves

Chaves de API pertencem a uma conta e podem ter um rótulo, expiração e tipo. Uma chave com duração negativa não expira; chaves expiradas são rejeitadas pela autenticação e posteriormente removidas por jobs de limpeza.

Crie chaves separadas para aplicações separadas. Isso torna a rotação mais segura: se uma integração for comprometida, você pode revogar apenas essa chave em vez de quebrar todos os serviços vinculados à conta. Rótulos e datas de expiração são ferramentas operacionais, não decoração; use-os para identificar quem possui a chave e quando ela deve ser revisada.

Referência:

<script src="https://inference.aivax.net/apidocs?embed-target=Create%20API%20Key&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

<script src="https://inference.aivax.net/apidocs?embed-target=List%20API%20Keys&r=https%3A%2F%2Finference.aivax.net%2Fapidocs"></script>

## Enviar uma chave com autenticação Bearer

Para SDKs compatíveis com OpenAI, passe a chave AIVAX como a chave de API do SDK e defina a URL base para `https://inference.aivax.net/v1`.

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://inference.aivax.net/v1",
    api_key="sk-aiv-acc..."
)
```

## Enviar uma chave com autenticação Basic

Para autenticação Basic, AIVAX decodifica a credencial Basic e usa a parte da senha após os dois pontos como a chave de API.

```text
username:sk-aiv-acc...
```

O nome de usuário é ignorado pelo middleware de autenticação.

## Autenticação de hook

AIVAX pode autenticar solicitações de saída para seus serviços, como workers do AI Gateway e funções de protocolo do lado do servidor.

Esta é a direção reversa da autenticação normal de API. Em uma chamada de API normal, sua aplicação prova que está autorizada a chamar AIVAX enviando uma chave de API. Em um callback de worker ou função de protocolo, AIVAX está chamando seu serviço, então seu serviço precisa de um modo de verificar que a solicitação realmente veio da configuração de conta que você controla. É para isso que serve o `X-Request-Nonce`.

Se sua conta tem uma chave de hook, AIVAX envia:

```text
X-Request-Nonce: <BCrypt hash>
```

O nonce é um hash BCrypt derivado da chave de hook da conta. Valide o cabeçalho verificando a chave de hook em texto plano armazenada contra o hash. Se a conta não tem chave de hook, o cabeçalho não é enviado.

Rotacionar a chave de hook invalida segredos de validação existentes de workers e integrações.

### Exemplo C#

```csharp
using BCrypt.Net;

var nonce = request.Headers["X-Request-Nonce"];
var hookKey = Environment.GetEnvironmentVariable("AIVAX_HOOK_SECRET");

if (nonce is null || hookKey is null)
{
    return Results.Unauthorized();
}

if (!BCrypt.Net.BCrypt.Verify(hookKey, nonce, enhancedEntropy: false))
{
    return Results.Forbid();
}
```

### Exemplo Python

```python
import os
import bcrypt
from flask import abort, request

nonce = request.headers.get("X-Request-Nonce")
hook_key = os.getenv("AIVAX_HOOK_SECRET")

if nonce is None or hook_key is None:
    abort(401)

if not bcrypt.checkpw(hook_key.encode("utf-8"), nonce.encode("utf-8")):
    abort(403)
```

### Exemplo JavaScript

```javascript
import bcrypt from "bcrypt";

const nonce = req.header("X-Request-Nonce");
const hookKey = process.env.AIVAX_HOOK_SECRET;

if (!nonce || !hookKey) {
  return res.sendStatus(401);
}

if (!(await bcrypt.compare(hookKey, nonce))) {
  return res.sendStatus(403);
}
```