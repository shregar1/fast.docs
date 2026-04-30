/**
 * New Features Documentation (v1.7.x)
 *
 * Content for WebSocket Channels, Health Probes, Dev Server,
 * SDK Generation, and Cloud Deployment guides.
 */

export const newFeaturesMarkdown = {

  'websocket-channels': `
# WebSocket Channels

**fastx-channels** provides real-time pub/sub messaging with presence tracking for your FastX applications.

## Installation

\`\`\`bash
pip install fastx-channels
# With Redis backend
pip install fastx-channels[redis]
\`\`\`

## Quick Start

\`\`\`python
from fastx_channels import Channel, ChannelManager, InMemoryBackend, Message

# Create a channel manager with in-memory backend
backend = InMemoryBackend()
manager = ChannelManager(backend=backend)

# Get or create a channel
channel = await manager.get_or_create("chat-room")

# Subscribe a WebSocket connection
await channel.subscribe(websocket)

# Publish a message
msg = Message(event="new_message", data={"text": "Hello!", "user": "alice"})
await manager.publish("chat-room", msg)

# Broadcast to all channels
await manager.broadcast(msg)
\`\`\`

## Backends

### InMemoryBackend

Default backend for development. No external dependencies.

\`\`\`python
from fastx_channels import InMemoryBackend

backend = InMemoryBackend()
\`\`\`

### RedisBackend

Production-grade backend using Redis pub/sub for multi-process/multi-server support.

\`\`\`python
import redis.asyncio as aioredis
from fastx_channels import RedisBackend

redis = aioredis.from_url("redis://localhost:6379/0")
backend = RedisBackend(redis)
\`\`\`

## Presence Tracking

Track who is online in a channel with presence services.

\`\`\`python
from fastx_channels import PresenceService, InMemoryPresenceBackend

presence = PresenceService(backend=InMemoryPresenceBackend())

# Track a user joining
await presence.track("chat-room", user_id="alice", metadata={"name": "Alice"})

# Get who's online
members = await presence.list("chat-room")
# [PresenceMember(user_id="alice", metadata={"name": "Alice"}, ...)]

# User leaves
await presence.untrack("chat-room", user_id="alice")
\`\`\`

## FastAPI Integration

\`\`\`python
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastx_channels import ChannelManager, InMemoryBackend, Message

app = FastAPI()
manager = ChannelManager(backend=InMemoryBackend())

@app.websocket("/ws/{room}")
async def websocket_endpoint(websocket: WebSocket, room: str):
    await websocket.accept()
    channel = await manager.get_or_create(room)
    await channel.subscribe(websocket)

    try:
        while True:
            data = await websocket.receive_json()
            msg = Message(event="message", data=data)
            await manager.publish(room, msg)
    except WebSocketDisconnect:
        await channel.unsubscribe(websocket)
\`\`\`

## Channel Manager API

| Method | Description |
|---|---|
| \`get_or_create(name)\` | Get existing or create new channel |
| \`publish(channel, message)\` | Send message to a channel |
| \`broadcast(message)\` | Send message to all channels |
| \`close_channel(name)\` | Close and remove a channel |

## Configuration

Set \`FASTX_CHANNELS_CONFIG_PATH\` env var or place config at \`config/channels/config.json\`:

\`\`\`json
{
  "backend": "redis",
  "redis_url": "redis://localhost:6379/0",
  "presence_ttl": 300
}
\`\`\`

## Next Steps

- [Real-time & GraphQL Tutorial](/tutorial-part-8)
- [Health Probes](/health-probes)
`,

  'health-probes': `
# Health Probes

FastX includes built-in health check endpoints that verify real dependency connectivity — not just "is the process alive" but "can it actually serve requests."

## Endpoints

| Endpoint | Purpose | Checks |
|---|---|---|
| \`GET /health\` | Full health check | DB + Redis + app status |
| \`GET /health/live\` | Liveness probe | App is running (Kubernetes liveness) |
| \`GET /health/ready\` | Readiness probe | DB + Redis connected (Kubernetes readiness) |

## Response Format

\`\`\`json
// GET /health
{
  "status": "healthy",
  "timestamp": "2026-05-01T00:00:00Z",
  "checks": {
    "database": { "status": "healthy", "latency_ms": 2.1 },
    "redis": { "status": "healthy", "latency_ms": 0.8 }
  }
}
\`\`\`

\`\`\`json
// GET /health/ready (when DB is down)
{
  "status": "unhealthy",
  "checks": {
    "database": { "status": "unhealthy", "error": "connection refused" },
    "redis": { "status": "healthy" }
  }
}
\`\`\`

## What Gets Checked

### Database
Runs \`SELECT 1\` against your configured database to verify the connection pool is alive and queries execute.

### Redis
Sends a \`PING\` to your Redis instance (if configured) to verify the cache/session backend is reachable.

## Kubernetes Integration

\`\`\`yaml
# deployment.yaml
spec:
  containers:
    - name: api
      livenessProbe:
        httpGet:
          path: /health/live
          port: 8000
        periodSeconds: 15
      readinessProbe:
        httpGet:
          path: /health/ready
          port: 8000
        periodSeconds: 10
      startupProbe:
        httpGet:
          path: /health/live
          port: 8000
        failureThreshold: 3
        periodSeconds: 10
\`\`\`

## Docker HEALTHCHECK

All generated Dockerfiles (\`fastx deploy dockerfile\`) include a health check automatically:

\`\`\`dockerfile
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \\
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health/live')" || exit 1
\`\`\`

## Next Steps

- [Cloud Deployment](/guide-deployment)
- [Production Guide](/production)
`,

  'guide-dev-server': `
# Dev Server & Tunnels

The \`fastx dev\` command starts a development server with auto-reload, optional browser launch, and tunnel support for sharing your local server externally.

## Basic Usage

\`\`\`bash
# Start with auto-reload on 0.0.0.0:8000
fastx dev

# Custom port + auto-open browser
fastx dev -p 3000 --open

# Multiple workers (disables auto-reload)
fastx dev -w 4
\`\`\`

## Tunnel Support

Share your local dev server with teammates or test webhooks using ngrok or Cloudflare tunnels.

\`\`\`bash
# Start with ngrok tunnel (default)
fastx dev --tunnel

# Use Cloudflare tunnel instead
fastx dev --tunnel --tunnel-provider cloudflare
\`\`\`

The tunnel URL is printed to the console — share it for external access to your local server.

### Prerequisites

| Provider | Install |
|---|---|
| ngrok | \`brew install ngrok\` + \`ngrok authtoken <token>\` |
| Cloudflare | \`brew install cloudflared\` |

## Options Reference

| Option | Default | Description |
|---|---|---|
| \`--host\` | \`0.0.0.0\` | Bind address |
| \`-p, --port\` | \`8000\` | Bind port |
| \`--open\` | off | Open browser to \`/docs\` on start |
| \`--tunnel\` | off | Start external tunnel |
| \`--tunnel-provider\` | \`ngrok\` | Tunnel provider (\`ngrok\` or \`cloudflare\`) |
| \`-w, --workers\` | \`1\` | Worker count (>1 disables reload) |

## How It Works

Under the hood, \`fastx dev\` runs \`uvicorn app:app\` with:
- \`--reload\` for file watching (single worker mode)
- Automatic \`.env\` loading
- Optional browser launch via \`webbrowser.open\`
- Subprocess management for tunnel providers

## Next Steps

- [SDK Generation](/guide-sdk-generation)
- [Cloud Deployment](/guide-deployment)
`,

  'guide-sdk-generation': `
# SDK Generation

Generate fully typed client SDKs from your FastX app's OpenAPI specification. Supports TypeScript (fetch-based) and Python (httpx-based) clients.

## Quick Start

\`\`\`bash
# Generate TypeScript SDK from running server
fastx dev &                    # Start your server
fastx sdk generate             # Generate TypeScript client

# Generate Python SDK
fastx sdk generate -l python

# From a file
fastx sdk generate -i openapi.json -o ./sdk
\`\`\`

## TypeScript SDK

The generated TypeScript client uses the native \`fetch\` API with full type safety.

\`\`\`bash
fastx sdk generate -l typescript -o ./client -n my-api-client
\`\`\`

**Generated structure:**

\`\`\`
client/
├── index.ts          # Main client class
├── types.ts          # All request/response types
└── package.json      # Ready to publish
\`\`\`

**Usage:**

\`\`\`typescript
import { MyApiClient } from './client';

const api = new MyApiClient({ baseUrl: 'http://localhost:8000' });

// Fully typed - IDE autocomplete works
const users = await api.getUsers();
const user = await api.createUser({ name: 'Alice', email: 'alice@example.com' });
\`\`\`

## Python SDK

The Python client uses \`httpx\` with full type annotations.

\`\`\`bash
fastx sdk generate -l python -o ./sdk -n my_api_sdk
\`\`\`

**Usage:**

\`\`\`python
from my_api_sdk import Client

client = Client(base_url="http://localhost:8000")

users = client.get_users()
user = client.create_user(name="Alice", email="alice@example.com")
\`\`\`

## Options Reference

| Option | Default | Description |
|---|---|---|
| \`-l, --lang\` | \`typescript\` | Target language (\`typescript\` or \`python\`) |
| \`-i, --input\` | — | Path to local \`openapi.json\` |
| \`-u, --url\` | \`http://localhost:8000/openapi.json\` | URL to fetch spec from |
| \`-o, --output-dir\` | \`./sdk\` | Output directory |
| \`-n, --name\` | project name | Package/module name |

## Tips

- **Run against a live server** for the most accurate spec (includes all middleware-injected headers)
- **Regenerate after API changes** to keep the SDK in sync
- **Commit the SDK** to your frontend repo or publish to a private registry
- The generator reads your OpenAPI spec's \`operationId\` fields to name methods

## Next Steps

- [Cloud Deployment](/guide-deployment)
- [CLI Reference](/cli-tool)
`,

  'guide-deployment': `
# Cloud Deployment

Deploy your FastX application to any major cloud platform with a single command. FastX generates production-ready deployment configurations with health checks, auto-scaling, and best-practice defaults.

## Supported Platforms

| Platform | Command | Best For |
|---|---|---|
| Fly.io | \`fastx deploy fly\` | Quick deploys, hobby projects, edge locations |
| Railway | \`fastx deploy railway\` | Simplest setup, managed databases |
| AWS ECS/Fargate | \`fastx deploy aws\` | Enterprise, full AWS ecosystem |
| GCP Cloud Run | \`fastx deploy gcp\` | Serverless, scale-to-zero, Google ecosystem |
| Azure Container Apps | \`fastx deploy azure\` | Enterprise, Microsoft ecosystem |

## Step 1: Generate Dockerfile

All deploy commands auto-generate a Dockerfile if needed. You can also generate one standalone:

\`\`\`bash
fastx deploy dockerfile
\`\`\`

The generated Dockerfile:
- Uses \`python:3.13-slim\` base image
- Installs system dependencies (\`gcc\`, \`libpq-dev\`)
- Copies and installs Python dependencies
- Includes a \`HEALTHCHECK\` hitting \`/health/live\`
- Runs uvicorn with 4 workers

## Fly.io

\`\`\`bash
# Prerequisites
brew install flyctl
fly auth login

# Deploy
fastx deploy fly --app-name my-api --region lhr
\`\`\`

Generates \`fly.toml\` with health checks, auto-start/stop machines, and force HTTPS. First deploy creates the app automatically.

## Railway

\`\`\`bash
# Prerequisites
npm install -g @railway/cli
railway login

# Deploy
fastx deploy railway
\`\`\`

The simplest deploy — Railway auto-detects the Dockerfile and provisions infrastructure.

## AWS ECS/Fargate

\`\`\`bash
# Prerequisites
brew install awscli
aws configure

# Generate deployment files
fastx deploy aws --app-name my-api --region us-east-1 \\
  --ecr-repo 123456789.dkr.ecr.us-east-1.amazonaws.com/my-api

# Then run the generated script
./deploy/aws/deploy.sh
\`\`\`

**Generated files:**
- \`deploy/aws/task-definition.json\` — ECS task definition with health checks, logging
- \`deploy/aws/deploy.sh\` — Build, push to ECR, update ECS service

**Options:**

| Option | Default | Description |
|---|---|---|
| \`--app-name\` | project name | ECS service/task name |
| \`--region\` | \`us-east-1\` | AWS region |
| \`--ecr-repo\` | — | ECR repository URI |
| \`--cpu\` | \`256\` | Task CPU units |
| \`--memory\` | \`512\` | Task memory (MB) |

## Google Cloud Run

\`\`\`bash
# Prerequisites
brew install google-cloud-sdk
gcloud auth login
gcloud config set project my-project

# Deploy
fastx deploy gcp --app-name my-api --project my-project --region us-central1
\`\`\`

**Generated files:**
- \`deploy/gcp/service.yaml\` — Cloud Run service with probes, auto-scaling
- \`deploy/gcp/deploy.sh\` — Build via Cloud Build, deploy to Cloud Run

**Options:**

| Option | Default | Description |
|---|---|---|
| \`--app-name\` | project name | Cloud Run service name |
| \`--project\` | — | GCP project ID |
| \`--region\` | \`us-central1\` | GCP region |
| \`--memory\` | \`512Mi\` | Memory limit |
| \`--cpu\` | \`1\` | CPU limit |
| \`--min-instances\` | \`0\` | Min instances (0 = scale to zero) |
| \`--max-instances\` | \`10\` | Max instances |

## Azure Container Apps

\`\`\`bash
# Prerequisites
brew install azure-cli
az login
az extension add --name containerapp

# Deploy
fastx deploy azure --app-name my-api --resource-group my-rg \\
  --registry myregistry.azurecr.io
\`\`\`

**Generated files:**
- \`deploy/azure/container-app.yaml\` — Container App config with probes, scaling
- \`deploy/azure/deploy.sh\` — Build via ACR, deploy Container App

**Options:**

| Option | Default | Description |
|---|---|---|
| \`--app-name\` | project name | Container App name |
| \`--resource-group\` | \`{name}-rg\` | Azure resource group |
| \`--registry\` | — | ACR server (e.g. \`myregistry.azurecr.io\`) |
| \`--region\` | \`eastus\` | Azure region |
| \`--cpu\` | \`0.5\` | CPU cores |
| \`--memory\` | \`1.0Gi\` | Memory |
| \`--min-replicas\` | \`0\` | Min replicas (0 = scale to zero) |
| \`--max-replicas\` | \`10\` | Max replicas |

## Platform Comparison

| Feature | Fly.io | Railway | AWS ECS | GCP Cloud Run | Azure Container Apps |
|---|---|---|---|---|---|
| Scale to zero | Yes | Yes | No | Yes | Yes |
| Built-in SSL | Yes | Yes | Via ALB | Yes | Yes |
| Managed DB | Postgres add-on | Postgres/Redis | RDS | Cloud SQL | Azure DB |
| Pricing | Pay per use | Pay per use | Per resource | Per request | Per resource |
| Regions | 30+ | Limited | 25+ | 35+ | 60+ |
| Cold start | <1s | <2s | N/A | <1s | <2s |
| Setup complexity | Low | Lowest | High | Medium | Medium |

## Health Checks

All generated deployment configs include health checks that hit FastX's built-in health probe endpoints:

- **Liveness:** \`GET /health/live\` — is the process alive?
- **Readiness:** \`GET /health/ready\` — are DB and Redis connected?
- **Startup:** \`GET /health/live\` — has the app finished starting?

## Next Steps

- [Health Probes](/health-probes)
- [Production Guide](/production)
- [CLI Reference](/cli-tool)
`,

  'pkg-fast-channels': `
# fastx-channels

Real-time WebSocket pub/sub messaging for FastX applications.

## Installation

\`\`\`bash
pip install fastx-channels

# With Redis support
pip install fastx-channels[redis]
\`\`\`

## Overview

\`fastx-channels\` provides a simple, backend-agnostic channel system for WebSocket communication:

- **Channel** — A named room that clients can subscribe to
- **ChannelManager** — Registry of channels with publish/broadcast
- **Backend** — Pluggable message transport (InMemory or Redis)
- **Presence** — Track who is online in each channel

## Architecture

\`\`\`
Client A ──┐                        ┌── Client X
Client B ──┤── Channel "chat" ──────┤── Client Y
Client C ──┘    (via Backend)       └── Client Z
                    │
              ┌─────┴─────┐
              │ InMemory   │  (dev)
              │ Redis Pub/Sub │ (prod)
              └────────────┘
\`\`\`

## Key Classes

| Class | Description |
|---|---|
| \`Channel\` | Named pub/sub room wrapping a backend |
| \`ChannelManager\` | Registry with \`get_or_create\`, \`publish\`, \`broadcast\` |
| \`InMemoryBackend\` | Development backend using in-process sets |
| \`RedisBackend\` | Production backend using Redis pub/sub |
| \`PresenceService\` | Track online users per channel |
| \`InMemoryPresenceBackend\` | Development presence storage |
| \`Message\` | Dataclass with \`event\`, \`data\`, JSON serialization |

## Automatic Integration

When \`fastx-channels\` is installed, FastX automatically:
1. Detects the package on startup
2. Initializes a Redis backend if Redis is configured
3. Falls back to InMemory backend otherwise
4. Makes the channel backend available application-wide

## Next Steps

- [WebSocket Channels Guide](/websocket-channels)
- [Real-time Tutorial](/tutorial-part-8)
- [Ecosystem Overview](/ecosystem)
`
};
