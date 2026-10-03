Source: https://docs.aivax.net/pt-br/docs/authentication.html

# Autenticação

AIVAX autentica solicitações de API com chaves de API da conta. AIVAX aceita chaves de API via:

- `Authorization: Bearer <API_KEY>`
- `Authorization: Basic <BASE64_USERNAME_COLON_API_KEY>`
- `?api-key=<API_KEY>`

Prefira o cabeçalho `Authorization` para chamadas servidor‑para‑servidor. Use o parâmetro de consulta apenas quando um cliente ou integração não puder enviar cabeçalhos, pois URLs podem ser registradas por proxies, navegadores e ferramentas de monitoramento.

## Tipos de chave de API

AIVAX tem duas famílias de chaves porque casos de uso de navegador e de servidor têm perfis de risco diferentes. Se o seu código roda no seu servidor, use uma chave privada e mantenha‑a fora de bundles de cliente, logs e repositórios públicos. Se o seu código roda em um navegador ou outro ambiente onde a chave pode ser inspecionada pelo usuário final, use uma chave pública e limite o fluxo a rotas projetadas para acesso público.

| Tipo | Prefixo | Uso pretendido | Acesso |
| --- | --- | --- | --- |
| Chave privada | `sk-aiv-acc` | Integrações do lado do servidor e chamadas de API administrativas. | APIs de conta autenticadas e inferência compatível com OpenAI. |
| Chave pública | `pk-aiv-` | Chamadas restritas do lado do cliente para rotas explicitamente públicas. | Rotas públicas de consulta/resposta RAG e chamadas de conclusão de chat restritas. |

Chaves públicas podem ser usadas para busca semântica RAG, geração de respostas RAG, geração de fala, descrições de mídia, geração de imagens e conclusões de chat. Quando uma chave pública chama conclusões de chat:

- O `model` deve ser um UUID completo do AI Gateway; chamadas diretas de modelo integrado e busca de slug de gateway são desativadas.
- A busca de slug de gateway está desativada.
- Fontes MCP, funções de protocolo, ferramentas embutidas, Bash, habilidades e opções de sentinel são removidas da solicitação.
- Apenas esses parâmetros de solicitação são aceitos: `model`, `messages`, `prompt`, `temperature`, `top_p`, `top_k`, `seed`, `tools`, `reasoning_effort`, `max_completion_tokens`, `idempotency_key` e `stream`.
- Limites de taxa de solicitação e de token são aplicados tanto globalmente por chave quanto por endereço remoto.

Use chaves privadas para serviços de backend, gerenciamento de conta, listagem de modelos, gerenciamento de coleções, operações em lote e qualquer fluxo que precise da superfície completa de ferramentas do gateway.

Para a primeira solicitação do lado do servidor, continue com [Getting Started](https://docs.aivax.net/pt-br/docs/getting-started.md). Se você está expondo uma experiência de navegador ou widget para usuários finais, revise [Chat Clients](https://docs.aivax.net/pt-br/docs/features/chat-clients.md) antes de decidir se uma chave pública é o limite correto.

## Criar e listar chaves

Chaves de API pertencem a uma conta e podem ter um rótulo, expiração e tipo. Uma chave com duração negativa não expira; chaves expiradas são rejeitadas pela autenticação e removidas posteriormente por jobs de limpeza.

Crie chaves separadas para aplicações separadas. Isso torna a rotação mais segura: se uma integração for comprometida, você pode revogar apenas essa chave em vez de quebrar todos os serviços vinculados à conta. Rótulos e datas de expiração são ferramentas operacionais, não decoração; use-os para identificar quem é o proprietário da chave e quando ela deve ser revisada.

Referência:

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Create%20API%20Key)

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=List%20API%20Keys)

## Enviar uma chave com autenticação Bearer

Para SDKs compatíveis com OpenAI, passe a chave AIVAX como a chave de API do SDK e defina a URL base para `https://inference.aivax.net/v1`.

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://inference.aivax.net/v1",
    api_key="<AIVAX_API_KEY>"
)
```

## Autenticação de hook

AIVAX pode autenticar solicitações outbound para seus serviços, como workers do AI Gateway e funções de protocolo do lado do servidor.

Esta é a direção inversa da autenticação normal de API. Em uma chamada de API normal, sua aplicação prova que tem permissão para chamar AIVAX enviando uma chave de API. Em um callback de worker ou função de protocolo, AIVAX está chamando seu serviço, então seu serviço precisa de uma forma de verificar que a solicitação realmente veio da configuração de conta que você controla. É para isso que serve o `X-Request-Nonce`.

Se sua conta tem uma chave de hook, AIVAX envia:

```text
X-Request-Nonce: <BCrypt hash>
```

O nonce é um hash BCrypt derivado da chave de hook da conta. Valide o cabeçalho verificando a chave de hook em texto plano armazenada contra o hash. Se a conta não tem chave de hook, o cabeçalho não é enviado.

Rotacionar a chave de hook invalida os segredos de validação existentes de workers e integrações.

### Exemplo em C#

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

### Exemplo em Python

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

### Exemplo em JavaScript

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
