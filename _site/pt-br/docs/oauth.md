Source: https://docs.aivax.net/pt-br/docs/oauth.html

# OAuth

O OAuth permite que seu aplicativo utilize a conta AIVAX de uma pessoa para seus recursos de IA. Em vez de criar seu próprio acesso ao modelo, faturamento e limites, seu aplicativo solicita permissão ao titular da conta, e a AIVAX fornece um token de acesso limitado ao que a pessoa aprovou.

Ele foi projetado para aplicativos que precisam de recursos de IA, mas não devem possuí-los: aplicativos de desktop e mobile, plugins de editores, extensões de navegador, ferramentas de automação e produtos SaaS onde cada usuário traz sua própria conta AIVAX. O titular da conta mantém o controle da mesma. As solicitações feitas com o token utilizam os modelos, gateways de IA, coleções e saldo dessa conta, e a pessoa pode revogar o acesso a qualquer momento.

## Quando usar

Use o OAuth quando a pessoa que possui a conta AIVAX não for o desenvolvedor do aplicativo. Ela nunca deve ter que copiar uma chave de API para um produto de terceiros, e o aplicativo deve receber apenas as permissões necessárias.

Use uma [chave de API privada ou pública](https://docs.aivax.net/pt-br/docs/authentication.md#api-key-types) quando o aplicativo e a conta AIVAX pertencerem a você. Por exemplo, um backend que atende seus próprios usuários com sua própria conta AIVAX deve usar uma chave privada.

## Como funciona

1. Seu aplicativo cria uma solicitação de autorização com seu nome, o motivo pelo qual precisa de acesso, as permissões desejadas e o endereço que recebe o resultado.
2. Seu aplicativo envia a pessoa para o endereço de autorização retornado pela AIVAX.
3. A pessoa faz login no console da AIVAX, se necessário, revisa a solicitação e escolhe por quanto tempo o acesso durará: 1 dia, 7 dias, 90 dias ou 1 ano.
4. A AIVAX redireciona a pessoa de volta ao seu aplicativo com um token de acesso, ou com um erro se o acesso foi negado.
5. Seu aplicativo chama a API da AIVAX com o token, como faria com qualquer outra chave de API.

Nenhum token de atualização é emitido. Quando o token expira ou é revogado, inicie uma nova autorização.

## Criar uma solicitação de autorização

Este endpoint não requer autenticação e tem limite de taxa por endereço remoto.

[API endpoint reference](https://inference.aivax.net/apidocs?embed=iframe&embed-endpoint=Create%20OAuth%20Authorization%20Request)

O corpo da solicitação contém:

- `clientName`: o nome exibido à pessoa, de 3 a 64 caracteres.
- `reason`: o motivo pelo qual seu aplicativo precisa de acesso, de 3 a 500 caracteres e no máximo 6 linhas. Seja específico, por exemplo "Resumir suas anotações de reunião com seus gateways de IA".
- `permissions`: as [permissões](#permissions) que seu aplicativo precisa.
- `returnUrl`: o endereço que recebe o resultado.

O `returnUrl` deve ser um endereço absoluto `http` ou `https` sem credenciais ou fragmento. Ele não pode apontar para o console da AIVAX, repetir parâmetros de consulta ou já conter `access_token`, `expires_in` ou `error` em sua query string.

A resposta contém `authorizationUrl`, o endereço do console onde a pessoa aprova a solicitação, e `expiresIn`, em segundos. A solicitação expira após uma hora e só pode ser aprovada ou negada uma vez.

## Enviar a pessoa para o console

Abra `authorizationUrl` no navegador da pessoa. O console pede para ela fazer login quando não estiver logada e retorna à solicitação posteriormente.

O console exibe o nome do seu aplicativo, o motivo, as permissões solicitadas e o endereço completo de retorno. O botão **Authorize** (Autorizar) permanece desativado por cinco segundos para que a solicitação possa ser lida, e a autorização requer uma verificação do navegador.

## Receber o token

Após a aprovação, a AIVAX redireciona a pessoa para `returnUrl` com estes parâmetros de consulta:

- `access_token`: a chave do aplicativo, começando com `sk-aiv-apk`.
- `expires_in`: a vida útil do token, em segundos.

Se a pessoa negar o acesso, a query terá `error=access_denied` em vez disso.

Os parâmetros de consulta já presentes em `returnUrl` são mantidos. Adicione seu próprio valor aleatório `state` ao criar a solicitação, armazene-o na sessão da pessoa e compare-o no callback, para que seu aplicativo aceite apenas resultados de solicitações que ele iniciou.

O token chega em uma URL. Leia-o no seu servidor, armazene-o como segredo e redirecione o navegador para um endereço sem ele. Não registre URLs de callback nem envie o token para o navegador.

```javascript
app.get("/oauth/callback", async (req, res) => {
  if (!req.query.state || req.query.state !== req.session.oauthState) {
    return res.status(400).send("Invalid state.");
  }

  if (req.query.error) {
    return res.redirect("/settings?aivax=denied");
  }

  if (!req.query.access_token) {
    return res.status(400).send("Missing token.");
  }

  await saveAivaxToken(req.session.userId, {
    token: req.query.access_token,
    expiresAt: Date.now() + Number(req.query.expires_in) * 1000
  });

  res.redirect("/settings?aivax=connected");
});
```

## Usar o token

Envie o token como qualquer outra chave de API, preferencialmente no cabeçalho `Authorization`. Para SDKs compatíveis com OpenAI, passe-o como a chave de API e defina a URL base como `https://inference.aivax.net/v1`.

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://inference.aivax.net/v1",
    api_key="<ACCESS_TOKEN>"
)
```

O uso feito com o token é cobrado na conta que autorizou seu aplicativo. Cada chave de aplicativo pode chamar `GET /api/v1/accounts` para ler o identificador da conta, o nome e o e-mail, para que seu aplicativo possa mostrar a qual conta está conectado.

Uma solicitação que precisa de uma permissão que o token não possui retorna `403 Forbidden`, e a mensagem de erro indica as permissões ausentes. Um token revogado ou expirado retorna `401 Unauthorized`; peça à pessoa para conectar novamente.

## Permissões

Solicite apenas o que seu aplicativo usa. O console mostra cada permissão à pessoa antes que ela a aprove.

- `InferenceText`: conclusões de chat com modelos e gateways de IA.
- `InferenceGenerations`: geração de imagens, fala, transcrição, decisão, extração e outras gerações.
- `InferenceRealtime`: sessões de voz em tempo real.
- `ResourcesRead`: leitura de gateways de IA, clientes de chat, lote, habilidades, arquivos de sandbox shell e outros recursos, e listagem de modelos.
- `ResourcesWrite`: criação, edição e exclusão desses recursos.
- `RagRead`: busca semântica e leitura de documentos de coleções RAG.
- `RagWrite`: criação, edição e exclusão de coleções e documentos RAG.
- `ManagementAnalytics`: leitura de saldo, consumo e informações de faturamento.
- `Account`: pagamentos, assinaturas, alterações de plano, notificações e outras operações em nível de conta.
- `WebUtilities`: busca na web e busca de URLs.

`ManagementKeys` não pode ser solicitado, portanto, as chaves de aplicativo nunca podem listar, criar ou excluir chaves de API ou gerenciar as credenciais da conta.

## Revogar acesso

O titular da conta pode ver todos os aplicativos autorizados, suas permissões, expiração e último uso em **Minha conta**, **Aplicativos autorizados**, e revogá-los lá. A revogação invalida o token imediatamente.
