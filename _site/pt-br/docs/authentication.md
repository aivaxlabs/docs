Source: https://docs.aivax.net/pt-br/docs/authentication.html

# Autenticação

A AIVAX autentica solicitações de API com chaves de API da conta. Uma chave de login é uma credencial separada e serve apenas para abrir o console.

A AIVAX aceita chaves de API por meio de:

- `Authorization: Bearer <API_KEY>` (recomendado para chamadas de servidor para servidor)
- `Authorization: Basic <BASE64_USERNAME_COLON_API_KEY>`
- `?api-key=<API_KEY>` (use apenas quando um cliente ou integração não puder enviar cabeçalhos, pois URLs podem ser registradas por proxies, navegadores e ferramentas de monitoramento)

## Tipos de chave de API

O tipo de chave determina quais rotas o chamador pode usar. Escolha-a com base em onde o código é executado e em quem é titular da conta.

Se seu código for executado no seu servidor, use uma chave privada e mantenha-a fora dos pacotes do cliente, registros (logs) e repositórios públicos. Se seu código for executado em um navegador ou em outro ambiente onde o usuário final possa inspecionar a chave, use uma chave pública, que é limitada às rotas projetadas para acesso público. As chaves de aplicativo são um terceiro tipo: o titular da conta as aprova para um aplicativo de terceiros por meio do [OAuth](https://docs.aivax.net/pt-br/docs/oauth.md).

| Tipo | Prefixo | Uso pretendido | Acesso |
| --- | --- | --- | --- |
| Chave privada | `sk-aiv-acc` | Integrações lado do servidor e chamadas administrativas de API. | Todas as APIs autenticadas da conta, exceto gerenciamento de chaves de API e credenciais. |
| Chave pública | `pk-aiv-` | Chamadas restritas ao lado do cliente. | Inferência de texto, gerações e recuperação RAG. |
| Chave de aplicativo | `sk-aiv-apk` | Aplicativos de terceiros autorizados pelo titular da conta. | As permissões aprovadas por meio do [OAuth](https://docs.aivax.net/pt-br/docs/oauth.md), além da identidade da conta. |

Cada tipo de chave concede um conjunto fixo de permissões, e cada rota exige algumas delas. Uma solicitação cuja chave não possui uma permissão exigida pela rota retorna `403 Forbidden`, e a mensagem de erro indica as permissões ausentes.

### Chaves privadas

Use uma chave privada para serviços backend, gerenciamento de conta, listagem de modelos, gerenciamento de coleções, operações em lote e qualquer fluxo de trabalho que precise da superfície completa de ferramentas do gateway.

Chaves privadas não podem listar, criar ou excluir chaves de API, rodar o sal da conta, gerenciar autenticadores ou redefinir a chave de login. Use o painel para essas operações.

Para uma primeira solicitação do lado do servidor, continue com [Faça sua primeira solicitação](https://docs.aivax.net/pt-br/docs/overview.md#make-your-first-request).

### Chaves públicas

Use uma chave pública apenas para rotas projetadas para acesso público. Uma chave pública pode chamar:

- conclusões de chat;
- os endpoints `/api/v1/generations/*`;
- busca semântica RAG;
- geração de respostas RAG.

Uma chave pública não pode:

- ler ou alterar recursos da conta;
- abrir sessões de voz;
- usar os endpoints de busca na web e fetch.

Quando uma chave pública chama conclusões de chat:

- O `model` deve ser um UUID completo do AI Gateway; chamadas diretas de modelos integrados e pesquisa por slug do gateway não estão disponíveis.
- Fontes MCP, funções de protocolo, ferramentas integradas, Bash, habilidades e outras opções avançadas são removidas da solicitação.
- Apenas estes parâmetros de solicitação são aceitos: `model`, `messages`, `prompt`, `temperature`, `top_p`, `top_k`, `seed`, `tools`, `reasoning_effort`, `max_completion_tokens`, `conversation_token`, `idempotency_key` e `stream`.
- Limites de taxa de solicitação e tokens são aplicados globalmente por chave e por endereço remoto. Consulte [Chaves de API públicas](https://docs.aivax.net/pt-br/docs/limits.md#public-api-keys) para os valores atuais.

Se você estiver expondo uma experiência de navegador ou widget aos usuários finais, revise [Clientes de Chat](https://docs.aivax.net/pt-br/docs/inference/chat-clients/overview.md) antes de decidir se uma chave pública é o limite adequado.

### Chaves de aplicativo

Use uma chave de aplicativo quando um aplicativo de terceiros deve chamar a AIVAX com a permissão do titular da conta. A chave recebe as permissões aprovadas por meio do [OAuth](https://docs.aivax.net/pt-br/docs/oauth.md), além da identidade da conta. Consulte [Autorização OAuth](#oauth-authorization) para a versão resumida e [OAuth](https://docs.aivax.net/pt-br/docs/oauth.md) para o fluxo completo.

## Gerenciar chaves

Crie e revogue chaves de API na área Chaves de API do painel da AIVAX. Use esta área quando precisar de uma nova chave, um rótulo, uma data de expiração ou uma revogação.

As chaves pertencem a uma conta e podem ter um rótulo, expiração e tipo. Chaves expiradas são rejeitadas.

Crie chaves separadas para aplicativos separados. Se uma integração for comprometida, você poderá revogar apenas essa chave sem afetar outros serviços. Use rótulos para identificar o proprietário e o aplicativo de cada chave, e datas de expiração para planejar renovações.

## Autorização OAuth

O OAuth permite que um aplicativo de terceiros solicite ao titular de uma conta AIVAX uma chave de aplicativo em vez de pedir que ele copie uma chave de API. Use-o quando a pessoa que é titular da conta não for o desenvolvedor do aplicativo.

O titular da conta revisa a solicitação no console, escolhe por quanto tempo o acesso durará e pode revogá-la a qualquer momento. Consulte [OAuth](https://docs.aivax.net/pt-br/docs/oauth.md) para o fluxo completo, permissões e tratamento de callback.

## Enviar uma chave com autenticação Bearer

Use este padrão quando um SDK compatível com OpenAI deve chamar a AIVAX. Passe a chave AIVAX como a chave de API do SDK e defina a URL base como `https://inference.aivax.net/v1`.

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://inference.aivax.net/v1",
    api_key="<AIVAX_API_KEY>"
)
```

## Autenticação de Hook

A autenticação de hook permite que seu serviço verifique solicitações de saída da AIVAX. Use-a para trabalhadores do AI Gateway e funções de protocolo do lado do servidor.

Esta é a direção inversa da autenticação normal de API: a AIVAX chama seu serviço, e seu serviço verifica se a solicitação vem da configuração da sua conta usando `X-Request-Nonce`.

Se sua conta tiver uma chave de hook, a AIVAX envia:

```text
X-Request-Nonce: <BCrypt hash>
```

O nonce é um hash BCrypt derivado da chave de hook da conta. Valide o cabeçalho verificando a chave de hook em texto puro armazenada contra o hash. Se a conta não tiver uma chave de hook, o cabeçalho não será enviado.

A rotação da chave de hook invalida os segredos de validação existentes de trabalhadores e integrações.

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

## Login no console

O console em `console.aivax.net` faz login com a chave de login enviada por e-mail quando a conta foi criada. Use esta seção quando precisar abrir o console, adicionar um autenticador ou recuperar uma chave de login.

Uma chave de login não é uma chave de API. Ela apenas abre uma sessão de console. As chaves de API continuam a chamar a API sem uma chave de login ou código de autenticador.

### Autenticação de dois fatores

Os titulares da conta podem adicionar um ou mais aplicativos autenticadores em **Minha conta**, **Segurança**. Use um autenticador quando o login no console exigir um código atual além da chave de login.

1. Adicione um ou mais aplicativos autenticadores em **Minha conta**, **Segurança**.
2. Confirme o código de seis dígitos desse aplicativo. O código QR e o segredo são mostrados apenas enquanto esse código é confirmado.
3. Após a confirmação, o segredo não pode ser visualizado novamente.

Quando pelo menos um autenticador é confirmado:

- O login no console solicita um código atual de seis dígitos.
- A alternância para essa conta salva solicita um código atual de seis dígitos.
- `POST /api/v1/auth/login` aceita um `totpCode` opcional.
- Se a chave de login for válida e o código estiver ausente, a resposta terá `requiresTwoFactor: true` e não criará uma sessão.
- Envie a mesma chave de login novamente com `totpCode`.

Remover o último autenticador desativa o prompt. Desativar a autenticação de dois fatores sem um código atual é tratado pelo [Suporte AIVAX](https://aivax.net/contact/).

### Recuperar acesso

A página de login tem links para o suporte da conta. Use esses caminhos quando o titular da conta não conseguir fazer login.

#### Recuperar chave de login

**Recuperar chave de login** solicita o e-mail de registro. Quando o e-mail pertence a uma conta, a mensagem contém:

- um link de login único;
- um link para redefinir a chave de login.

Ambos os links expiram em uma hora.

- O link de login ainda solicita um código de autenticador quando a autenticação de dois fatores está habilitada.
- O link de redefinição cria uma nova chave de login, envia-a por e-mail e desconecta a conta de todas as sessões do console.
- O link de redefinição não desativa a autenticação de dois fatores nem revoga chaves de API.

#### Desativar autenticação de dois fatores ou e-mail de registro indisponível

Se você precisar desativar a autenticação de dois fatores ou se o e-mail de registro não estiver mais disponível, entre em contato com o [Suporte AIVAX](https://aivax.net/contact/).

#### Redefinir a chave de login em Segurança

Redefinir a chave de login em **Segurança** solicita confirmação e, em seguida, realiza a mesma rotação:

- Uma nova chave é enviada por e-mail.
- As sessões do console são encerradas.
- O login salvo no navegador é limpo.

As chaves de API continuam funcionando.
