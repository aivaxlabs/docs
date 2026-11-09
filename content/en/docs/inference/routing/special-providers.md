---
{title: Special Providers,linkTitle: Special providers,weight: 40,group: Routing}
---

# Special providers

Some integrated models are also offered by special providers, which serve them at discounted prices under conditions that may be less transparent than those of regular providers. Special providers are never selected unless you opt in:

| Routing preference | Special providers |
|---|---|
| `Balanced` | Never used. |
| `Cheapest`, `Fastest`, `Quality` | Considered only when **Allow special providers** is enabled in the dashboard account privacy settings. It is disabled by default. |
| `Special` | Always considered, regardless of the account setting. Selects the lowest applicable combined input and output token price among eligible regular and special providers, breaking ties by reported uptime and then by recent failures. |

When a model is currently available only through special providers, requests that do not allow them fail. Use the `Special` preference, or enable **Allow special providers** and use a preference other than `Balanced`. [Zero data retention providers only](zdr.md) and `allowed_providers` still apply to special providers.
