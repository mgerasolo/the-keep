# Routing Architecture

## How Domain Routing Works

```
User → AdGuard DNS → Helicarrier Traefik (10.0.0.27) → Banner Container (10.0.0.33:5010)
```

## Key Facts

| Fact | Detail |
|------|--------|
| **Traefik Location** | Helicarrier (10.0.0.27) - NOT on Banner |
| **DNS** | AdGuard on Helicarrier |
| **Docker Labels** | Do NOT work - Traefik is not on same Docker host |
| **To Add Routes** | Infrastructure handoff, not local config |

## Why Docker Labels Don't Work

Traefik docker labels like `traefik.http.routers.*` only work when:
- Traefik runs on the SAME Docker host as the container
- They share a Docker network

Since Traefik is on Helicarrier and containers are on Banner:
- They are on DIFFERENT hosts
- They cannot share Docker networks
- Labels are ignored

## To Add a Domain Route

1. Create Infrastructure handoff requesting the route
2. Infrastructure adds route to Helicarrier's `/opt/traefik/config/*.yml`
3. DNS (AdGuard or Cloudflare) points domain to Helicarrier
4. Traefik proxies to `Banner:port`

## DO NOT

- Add Traefik labels expecting them to work automatically
- Look for Traefik on Banner - it's not there
- Create local `traefik-public` networks on deployment targets
- Assume docker-compose Traefik config does anything

## Direct Access (Always Works)

While waiting for domain routing:
```
http://10.0.0.33:5010
```
