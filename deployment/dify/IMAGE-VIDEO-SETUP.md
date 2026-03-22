# Dify Image & Video Generation Setup

Guide for configuring image and video generation in Dify for The Keep.

## RECOMMENDED: Use Existing n8n Workflows First

Before building custom Dify workflows, **use battle-tested n8n community workflows**.

Your n8n: http://10.0.0.27:2750

See: [../n8n/EXISTING-WORKFLOWS.md](../n8n/EXISTING-WORKFLOWS.md) for 13+ ready-to-import workflows.

### Quick Start (Import These)

| Workflow | URL | What It Does |
|----------|-----|--------------|
| **Flux Free** | [n8n #2417](https://n8n.io/workflows/2417-flux-ai-image-generator/) | Free image gen via Hugging Face |
| **Gemini/ChatGPT** | [n8n #5626](https://n8n.io/workflows/5626-free-ai-image-generator-n8n-automation-workflow-with-geminichatgpt/) | Uses your LiteLLM! |
| **Luma Video** | [n8n #3200](https://n8n.io/workflows/3200-automate-video-creation-with-luma-ai-dream-machine-and-airtable-part-1/) | Luma AI + Airtable tracking |
| **Full Video Pipeline** | [n8n #3442](https://n8n.io/workflows/3442-fully-automated-ai-video-generation-and-multi-platform-publishing/) | Text → Image → Video → YouTube |

---

## Available Dify Marketplace Plugins

### 1. ComfyUI (Recommended for Local)

**Best for:** Self-hosted, maximum control, Flux/SD models

| Feature | Supported |
|---------|-----------|
| Text-to-Image | Yes (with HiresFix) |
| Image-to-Image | Yes |
| Video Generation | Yes |
| Audio Generation | Yes |
| Models | Flux, Stable Diffusion, Pony |

**Setup:**
1. Deploy ComfyUI server (can run on Jarvis GPU)
2. Install plugin from Dify Marketplace
3. Configure server URL in Dify

### 2. CometAPI (Recommended for Multi-Provider)

**Best for:** Access to 500+ AI models through one API

| Feature | Supported |
|---------|-----------|
| Text-to-Image | Yes |
| Video Generation | Yes |
| Audio | Yes |
| Providers | Multiple (see cometapi.com) |

**Setup:**
1. Get API key from cometapi.com
2. Install plugin from Marketplace
3. Configure credentials in Dify

### 3. OpenRouter

**Best for:** Unified API access to multiple providers

| Feature | Supported |
|---------|-----------|
| Image Generation | Yes |
| Text Generation | Yes |
| Audio | Yes |

### 4. Doubao (Volcengine)

**Best for:** Volcengine's Doubao models

| Feature | Supported |
|---------|-----------|
| Text-to-Image | Yes |
| Image-to-Video | Yes |

---

## Midjourney Integration

Midjourney has no official API. Use a proxy service:

### Option A: GoAPI (Recommended)

**URL:** https://goapi.ai/midjourney-api

| Plan | Price | Generations |
|------|-------|-------------|
| Starter | ~$10/mo | Limited |
| Pro | ~$30/mo | More |

**Dify Integration:**
1. Sign up at goapi.ai
2. Get API key
3. Create Custom HTTP Tool in Dify with GoAPI endpoints

### Option B: PiAPI

**URL:** https://piapi.ai/midjourney-api

Similar to GoAPI with different pricing.

---

## Google (Nano Banana / Veo)

### Nano Banana (Image)
- **Model:** `gemini-2.5-flash-image` or `gemini-3.1-flash-image-preview`
- **Access:** Via Gemini API or Vertex AI
- **Integration:** Configure as LLM provider in Dify with image modality

### Veo (Video)
- **Model:** `veo-3.1`
- **Access:** Via Vertex AI
- **Integration:** Custom HTTP tool or wait for native plugin

---

## Recommended Setup for The Keep

### Tier 1: Native (No Extra Cost)
1. **Nano Banana** via LiteLLM (already configuring)
2. **DALL-E 3** via LiteLLM (already available)

### Tier 2: Extended Capabilities
3. **ComfyUI** for local Flux/SD generation
4. **GoAPI** for Midjourney access

### Tier 3: Video
5. **Veo** via Gemini API
6. **Runway** via custom HTTP tool (has API)

---

## Plugin Installation in Dify

1. Go to Dify: http://10.0.0.33:5012
2. Navigate to **Plugins** → **Marketplace**
3. Search for plugin name
4. Click **Install**
5. Configure credentials in **Plugin Settings**

---

## Creating Custom HTTP Tool (for GoAPI/Midjourney)

1. In Dify, go to **Tools** → **Create Tool**
2. Select **HTTP Request**
3. Configure:

```yaml
name: Midjourney
description: Generate images with Midjourney via GoAPI
endpoint: https://api.goapi.ai/mj/v2/imagine
method: POST
headers:
  X-API-Key: ${GOAPI_API_KEY}
  Content-Type: application/json
body:
  prompt: ${prompt}
  aspect_ratio: ${aspect_ratio}
  process_mode: relax
```

4. Save and use in workflows

---

## References

- [Dify Marketplace](https://marketplace.dify.ai/)
- [ComfyUI Plugin](https://marketplace.dify.ai/plugin/langgenius/comfyui)
- [CometAPI Plugin](https://marketplace.dify.ai/plugin/langgenius/cometapi)
- [GoAPI Midjourney](https://goapi.ai/midjourney-api)
- [Nano Banana Docs](https://ai.google.dev/gemini-api/docs/image-generation)
- [Veo Docs](https://cloud.google.com/vertex-ai/generative-ai/docs/video/overview)
