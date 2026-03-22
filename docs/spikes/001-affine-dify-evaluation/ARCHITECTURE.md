# Spike 001: Architecture Details

## Current Deployment

```
                        ┌──────────────────────────────────┐
                        │         Banner (10.0.0.33)        │
                        │         The Keep Host             │
                        └──────────────────────────────────┘
                                        │
        ┌───────────────────────────────┼───────────────────────────────┐
        │                               │                               │
        ▼                               ▼                               ▼
┌───────────────┐               ┌───────────────┐               ┌───────────────┐
│    AFFiNE     │               │     Dify      │               │   LobeChat    │
│   Port 5013   │               │   Port 5012   │               │   Port 5011   │
│               │               │               │               │               │
│ • Docs/Wiki   │               │ • Workflows   │               │ • Chat UI     │
│ • Whiteboard  │               │ • RAG/KB      │               │ • Agents      │
│ • AI Copilot  │               │ • AI Apps     │               │ • Plugins     │
└───────┬───────┘               └───────┬───────┘               └───────┬───────┘
        │                               │                               │
        │ PostgreSQL                    │ PostgreSQL                    │ PostgreSQL
        │ Redis                         │ Redis                         │ Redis
        │                               │ Weaviate                      │ RustFS (S3)
        │                               │ Sandbox                       │
        │                               │ Plugin Daemon                 │
        └───────────────────────────────┴───────────────────────────────┘
                                        │
                                        ▼
                        ┌──────────────────────────────────┐
                        │         Jarvis (10.0.0.27)        │
                        │         AI/Automation Host        │
                        ├──────────────────────────────────┤
                        │ LiteLLM (2764)                   │
                        │   • jarvis-chat (14B)            │
                        │   • jarvis-qwen72b (72B)         │
                        │   • External APIs (OpenAI, etc)  │
                        ├──────────────────────────────────┤
                        │ n8n (2750)                       │
                        │   • 13+ image/video workflows    │
                        │   • Automation pipelines         │
                        └──────────────────────────────────┘
```

## Proposed Information Flow

### Scenario A: AFFiNE-Primary (Testing)

```
User                    AFFiNE                  LiteLLM
  │                        │                        │
  │  1. Edit document      │                        │
  │───────────────────────>│                        │
  │                        │                        │
  │  2. Ask AI about doc   │                        │
  │───────────────────────>│                        │
  │                        │  3. Send context+query │
  │                        │───────────────────────>│
  │                        │                        │
  │                        │  4. AI response        │
  │                        │<───────────────────────│
  │                        │                        │
  │  5. Display response   │                        │
  │<───────────────────────│                        │
```

### Scenario B: AFFiNE + Dify Backend

```
User                AFFiNE              Dify                LiteLLM
  │                    │                   │                    │
  │  1. Upload doc     │                   │                    │
  │───────────────────>│                   │                    │
  │                    │  2. Webhook/API   │                    │
  │                    │──────────────────>│                    │
  │                    │                   │  3. Process doc    │
  │                    │                   │───────────────────>│
  │                    │                   │                    │
  │                    │                   │  4. Summary/Index  │
  │                    │                   │<───────────────────│
  │                    │                   │                    │
  │                    │  5. Store result  │                    │
  │                    │<──────────────────│                    │
  │                    │                   │                    │
  │  6. View summary   │                   │                    │
  │<───────────────────│                   │                    │
  │                    │                   │                    │
  │  7. Deep query     │                   │                    │
  │───────────────────>│                   │                    │
  │                    │  8. RAG query     │                    │
  │                    │──────────────────>│                    │
  │                    │                   │  9. Retrieve+Gen   │
  │                    │                   │───────────────────>│
  │                    │                   │                    │
  │                    │  10. Response     │                    │
  │                    │<──────────────────│                    │
  │ 11. Display        │                   │                    │
  │<───────────────────│                   │                    │
```

## Service Configurations

### AFFiNE

```yaml
# Environment
COPILOT_OPENAI_API_KEY: sk-4r10-PRI0MrnIccaOFyFfQ
# Note: Need to verify if COPILOT_OPENAI_BASE_URL is supported
# May need to configure via admin panel

# Database
PostgreSQL: the-keep-affine-db
Redis: the-keep-affine-redis

# Storage
Volumes: affine-storage, affine-config
```

### Dify

```yaml
# LiteLLM Integration
PLUGIN_DAEMON_URL: http://plugin_daemon:5002
CODE_EXECUTION_ENDPOINT: http://sandbox:8194

# To configure via UI:
# Settings → Model Provider → OpenAI-API-compatible
#   API Base: http://10.0.0.27:2764/v1
#   API Key: sk-4r10-PRI0MrnIccaOFyFfQ
#   Models: jarvis-chat, jarvis-qwen72b

# Database
PostgreSQL: the-keep-dify-db (dify, dify_plugin)
Redis: the-keep-dify-redis
Weaviate: the-keep-dify-weaviate
```

### LiteLLM

```yaml
# Endpoint
URL: http://10.0.0.27:2764/v1
Key: sk-4r10-PRI0MrnIccaOFyFfQ

# Available Models
Local:
  - jarvis-chat (qwen 14B, fast)
  - jarvis-qwen72b (qwen 72B, quality)

External (via proxy):
  - gpt-4o, gpt-4o-mini
  - claude-3-5-sonnet, claude-3-opus
  - gemini-2.0-flash
```

## Network Topology

```
┌─────────────────────────────────────────────────────────────┐
│                    Internal Network                          │
│                                                              │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐  │
│  │ Banner  │    │ Jarvis  │    │  Hulk   │    │ Coulson │  │
│  │10.0.0.33│    │10.0.0.27│    │10.0.0.32│    │10.0.0.28│  │
│  │         │    │         │    │         │    │         │  │
│  │ AFFiNE  │    │ LiteLLM │    │ (Prod)  │    │ Grafana │  │
│  │ Dify    │◄──►│ n8n     │    │         │    │ Loki    │  │
│  │ LobeChat│    │ Ollama  │    │         │    │         │  │
│  └─────────┘    └─────────┘    └─────────┘    └─────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Pending: Traefik Routing

```yaml
# Requested routes (pending infrastructure)
routes:
  - domain: keep-docs.nextlevelguild.com
    target: 10.0.0.33:5013
    service: AFFiNE

  - domain: keep-dify.nextlevelguild.com
    target: 10.0.0.33:5012
    service: Dify

  - domain: keep-chat.nextlevelguild.com
    target: 10.0.0.33:5011
    service: LobeChat
```

## Fallback Architecture (If AFFiNE Fails)

If AFFiNE doesn't meet requirements, the fallback is:

```
┌─────────────────────────────────────────────────────────────┐
│                CUSTOM FRONTEND (Next.js)                     │
│  • Monaco editor for files                                  │
│  • Chat panel with AI                                       │
│  • File browser sidebar                                     │
│  • Custom RAG integration                                   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Dify (BACKEND ONLY)                       │
│  • Workflows via API                                        │
│  • Knowledge bases                                          │
│  • Document processing                                      │
└─────────────────────────────────────────────────────────────┘
```

This would require significantly more development time (weeks vs hours).
