# PROJECT.md — PDV OBA OBA

## Visão Geral
PDV (Ponto de Venda) para o estabelecimento Oba Oba Salgados, com integração de pagamento na maquininha Cielo LIO.

## Identidade
| Campo | Valor |
|-------|-------|
| Domínio | sf.oakia.com.br |
| Código na VPS | /root/pdv/ |
| Repo | github.com/felipesabores/PDV |
| Branch | v0/felipesabores-e4dade70 |
| Imagem Docker | pdv-sf:latest (build local) |

## Stack Técnica
- Next.js 15 + React 19 + Tailwind + shadcn/ui
- PWA (manifest.json + sw.js em /public)
- Docker Swarm + Traefik

## Infraestrutura
| Recurso | Detalhe |
|---------|---------|
| Rede | network_public |
| Banco | Não utiliza banco |
| TLS | Traefik + Let's Encrypt |

## Exceções às Convenções
| Convenção | Exceção | Justificativa |
|-----------|---------|---------------|
| Self-hosted | Cielo LIO Remote (API externa) | Necessário para integração com maquininha física |

## Integrações Externas
### Cielo LIO Remote — Sandbox
- Endpoint: `https://api.cielo.com.br/sandbox-lio/order-management/v1`
- API routes: `POST /api/cielo/order`, `POST /api/cielo/webhook`

## Deploy
```bash
docker build -t pdv-sf:latest /root/pdv/
docker service update --image pdv-sf:latest --force <service_name>
```
