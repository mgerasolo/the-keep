# Existing n8n Workflows for Image/Video Generation

Rather than building from scratch, use these battle-tested community workflows.

**Your n8n instance:** http://10.0.0.27:2750

## How to Import

1. Go to n8n → Workflows → Import from URL
2. Paste the workflow URL
3. Configure credentials
4. Activate

---

## IMAGE GENERATION WORKFLOWS

### 1. Flux AI Image Generator (Hugging Face)
**URL:** https://n8n.io/workflows/2417-flux-ai-image-generator/

| Feature | Details |
|---------|---------|
| Provider | Hugging Face Inference API |
| Model | Flux Text-to-Image |
| Input | Webform with prompts + style presets |
| Output | Generated images |
| Cost | Free (Hugging Face tier) |

**Best for:** Free image generation, customizable styles

---

### 2. Flux via Replicate
**URL:** https://n8n.io/workflows/7192-generate-images-with-replicate-and-flux/

| Feature | Details |
|---------|---------|
| Provider | Replicate |
| Model | Flux Pro/Dev |
| Output | WordPress + Twitter/X posting |
| Cost | ~$0.055/image |

**Best for:** High-quality images with social posting

---

### 3. Flux Dev via Fal.ai + Google Drive
**URL:** https://n8n.io/workflows/2644-flux-dev-image-generation-falai-to-google-drive/

| Feature | Details |
|---------|---------|
| Provider | Fal.ai |
| Model | Flux Dev |
| Output | Saved to Google Drive |
| Cost | Fal.ai pricing |

**Best for:** Batch generation with cloud storage

---

### 4. Free AI Image Generator (Gemini/ChatGPT)
**URL:** https://n8n.io/workflows/5626-free-ai-image-generator-n8n-automation-workflow-with-geminichatgpt/

| Feature | Details |
|---------|---------|
| Provider | Google Gemini / OpenAI |
| Models | Gemini image, GPT-4 |
| Cost | Free tier available |

**Best for:** Using your existing LiteLLM setup

---

### 5. Midjourney + Kling (PiAPI)
**URL:** https://n8n.io/workflows/3626-create-animated-illustrations-from-text-prompts-with-midjourney-and-kling-api/

| Feature | Details |
|---------|---------|
| Provider | PiAPI (Midjourney + Kling) |
| Output | Animated illustrations |
| Use Case | Content creators, social media |

**Best for:** Artistic animated content

---

### 6. KIE.AI Midjourney API
**URL:** https://n8n.io/workflows/7677-generate-ai-images-and-videos-with-kieai-midjourney-api/

| Feature | Details |
|---------|---------|
| Provider | KIE.AI |
| Modes | txt2img, img2img, img2video |
| Interface | Form-based |
| Features | Progress monitoring |

**Best for:** Multi-mode generation with UI

---

### 7. ComfyUI Integration (Self-Hosted)
**GitHub:** https://github.com/mason276752/n8n-nodes-comfyui

| Feature | Details |
|---------|---------|
| Type | n8n community node |
| Provider | Self-hosted ComfyUI |
| Models | Any SD/Flux model |
| Cost | Free (self-hosted) |

**Best for:** Full control, local generation on Jarvis

---

## VIDEO GENERATION WORKFLOWS

### 8. Luma AI Dream Machine + Airtable
**URL (Part 1):** https://n8n.io/workflows/3200-automate-video-creation-with-luma-ai-dream-machine-and-airtable-part-1/
**URL (Part 2):** https://n8n.io/workflows/3201-automate-video-creation-with-luma-ai-dream-machine-and-airtable-part-2/

| Feature | Details |
|---------|---------|
| Provider | Luma AI |
| Tracking | Airtable database |
| Steps | Two-part workflow |

**Best for:** Managed video queue with tracking

---

### 9. Flux + Runway Video Pipeline
**URL:** https://n8n.io/workflows/4056-generate-images-and-convert-to-video-using-flux-kraken-and-runway/

| Feature | Details |
|---------|---------|
| Pipeline | Flux → Kraken → Runway ML |
| Flow | Generate image → Upload → Animate |

**Best for:** Image-to-video transformation

---

### 10. AI YouTube Shorts Generator
**URL:** https://n8n.io/workflows/3416-generate-ai-youtube-shorts-with-flux-runway-eleven-labs-and-creatomate/

| Feature | Details |
|---------|---------|
| Pipeline | Flux + Runway + ElevenLabs + Creatomate |
| Output | Complete YouTube Shorts |
| Audio | AI voiceover included |

**Best for:** Automated short-form content

---

### 11. Full Video + Multi-Platform Publishing
**URL:** https://n8n.io/workflows/3442-fully-automated-ai-video-generation-and-multi-platform-publishing/

| Feature | Details |
|---------|---------|
| Input | Google Sheet ideas |
| Output | YouTube upload |
| Pipeline | Text → Image → Animation → Sound → Merge |

**Best for:** End-to-end video automation

---

### 12. DeepSeek + Runway + ElevenLabs Movies
**URL:** https://n8n.io/workflows/8222-turn-ideas-into-movies-with-deepseek-runwayml-elevenlabs-and-creatomate/

| Feature | Details |
|---------|---------|
| LLM | DeepSeek (script generation) |
| Video | Runway ML |
| Audio | ElevenLabs |
| Assembly | Creatomate |

**Best for:** AI-generated short films

---

### 13. Kling AI Social Videos
**URL:** https://n8n.io/workflows/3501-generate-and-auto-post-social-videos-to-multiple-platforms-with-gpt-4-and-kling-ai/

| Feature | Details |
|---------|---------|
| Provider | Kling AI |
| Output | Multi-platform posting |
| Platforms | Multiple social networks |

**Best for:** Social media video automation

---

## RECOMMENDED SETUP FOR THE KEEP

### Tier 1: Start Here (Easiest)
1. **#4 Free AI Generator** - Uses Gemini, works with your LiteLLM
2. **#1 Flux via Hugging Face** - Free tier available

### Tier 2: Higher Quality
3. **#2 Flux via Replicate** - Better quality, paid
4. **#6 KIE.AI Midjourney** - If you want Midjourney style

### Tier 3: Video
5. **#8 Luma AI + Airtable** - Managed video queue
6. **#9 Flux + Runway** - Image-to-video pipeline

### Tier 4: Full Automation
7. **#11 Full Video Pipeline** - Complete YouTube automation

---

## API Keys Needed

| Provider | Get Key At | Used By |
|----------|------------|---------|
| Hugging Face | https://huggingface.co/settings/tokens | Flux (#1) |
| Replicate | https://replicate.com/account/api-tokens | Flux (#2) |
| Fal.ai | https://fal.ai/dashboard | Flux (#3) |
| PiAPI | https://piapi.ai | Midjourney (#5) |
| KIE.AI | https://www.kie.ai | Midjourney (#6) |
| Luma AI | https://lumalabs.ai/dream-machine/api | Video (#8) |
| Runway | https://runwayml.com/api | Video (#9, #10) |
| ElevenLabs | https://elevenlabs.io | Audio (#10, #12) |

---

## Sources

- [n8n Workflow Templates](https://n8n.io/workflows/)
- [Flux AI Generator](https://n8n.io/workflows/2417-flux-ai-image-generator/)
- [Luma AI Workflow](https://n8n.io/workflows/3200-automate-video-creation-with-luma-ai-dream-machine-and-airtable-part-1/)
- [KIE.AI Midjourney](https://n8n.io/workflows/7677-generate-ai-images-and-videos-with-kieai-midjourney-api/)
- [ComfyUI n8n Node](https://github.com/mason276752/n8n-nodes-comfyui)
