/**
 * New Features Documentation (v1.7.x / v1.8.x)
 *
 * Content for WebSocket Channels, Health Probes, Dev Server,
 * SDK Generation, Cloud Deployment, Email, Cron, API Keys,
 * Profiler, Webhooks, Pagination, Bulk Ops, Testing, OpenAPI Diff.
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
`,

  // ============================================================
  // v1.8.0 Features
  // ============================================================

  'email-providers': `
# Email Providers

FastX Platform includes a unified email abstraction with pluggable backends for SMTP, SendGrid, Amazon SES, and Mailgun.

## Quick Start

\`\`\`python
from fastx_platform.core.email import EmailService, EmailMessage, SMTPProvider

# Create a provider
provider = SMTPProvider()  # reads SMTP_HOST, SMTP_PORT, etc. from env

# Create the service
email = EmailService(provider=provider)

# Send an email
await email.send(
    to=["user@example.com"],
    subject="Welcome!",
    body="Thanks for signing up.",
    html_body="<h1>Thanks for signing up!</h1>"
)
\`\`\`

## Available Providers

| Provider | Env Vars | Install |
|---|---|---|
| \`SMTPProvider\` | \`SMTP_HOST\`, \`SMTP_PORT\`, \`SMTP_USER\`, \`SMTP_PASSWORD\` | \`pip install aiosmtplib\` |
| \`SendGridProvider\` | \`SENDGRID_API_KEY\` | \`pip install httpx\` |
| \`SESProvider\` | \`AWS_REGION\`, \`AWS_ACCESS_KEY_ID\`, \`AWS_SECRET_ACCESS_KEY\` | \`pip install boto3\` |
| \`MailgunProvider\` | \`MAILGUN_API_KEY\`, \`MAILGUN_DOMAIN\` | \`pip install httpx\` |

## Template Support

Use Jinja2 templates for rich HTML emails:

\`\`\`python
# templates/email/welcome.html
# <h1>Welcome, {{ name }}!</h1>
# <p>Your account is ready.</p>

await email.send_template(
    to=["user@example.com"],
    template_name="welcome",
    context={"name": "Alice"},
    subject="Welcome aboard!"
)
\`\`\`

## Bulk Sending

\`\`\`python
messages = [
    EmailMessage(to=["a@example.com"], subject="Hello A", body="..."),
    EmailMessage(to=["b@example.com"], subject="Hello B", body="..."),
]
results = await email.send_bulk(messages)
# [True, True]  -- per-message success/failure
\`\`\`

## Next Steps

- [Configuration](/configuration)
- [Production Guide](/production)
`,

  'cron-scheduler': `
# Cron Scheduler

Schedule recurring jobs with cron expressions. Supports distributed locking via Redis to prevent duplicate runs across workers.

## Quick Start

\`\`\`python
from fastx_platform.core.scheduler import cron, CronScheduler

@cron("*/5 * * * *")  # every 5 minutes
async def cleanup_expired_tokens():
    # your cleanup logic
    pass

@cron("0 9 * * 1")  # Monday at 9am
async def send_weekly_report():
    # your report logic
    pass

# Start the scheduler
scheduler = CronScheduler()
scheduler.discover()  # auto-find all @cron decorated functions
await scheduler.start()
\`\`\`

## Cron Expressions

Standard 5-field format: \`minute hour day_of_month month day_of_week\`

| Expression | Meaning |
|---|---|
| \`* * * * *\` | Every minute |
| \`*/5 * * * *\` | Every 5 minutes |
| \`0 * * * *\` | Every hour |
| \`0 9 * * 1-5\` | Weekdays at 9am |
| \`0 0 1 * *\` | First of each month |
| \`@hourly\` | Every hour |
| \`@daily\` | Midnight daily |
| \`@weekly\` | Sunday midnight |

## Distributed Locking

In multi-worker deployments, use the Redis backend to ensure jobs run on exactly one worker:

\`\`\`python
from fastx_platform.core.scheduler import CronScheduler, RedisCronBackend

backend = RedisCronBackend(redis_url="redis://localhost:6379/0")
scheduler = CronScheduler(backend=backend)
\`\`\`

## Manual Triggers

\`\`\`python
await scheduler.run_job("cleanup_expired_tokens")
\`\`\`

## Job Options

\`\`\`python
@cron("0 * * * *", max_retries=5, timeout_seconds=120)
async def fragile_job():
    pass  # retries up to 5 times with exponential backoff
\`\`\`

## Next Steps

- [API Key Management](/api-key-management)
- [Production Guide](/production)
`,

  'api-key-management': `
# API Key Management

Issue, validate, rotate, and revoke API keys with per-key rate limiting and scope-based authorization.

## Quick Start

\`\`\`python
from fastx_platform.core.api_keys import ApiKeyManager, InMemoryApiKeyBackend

manager = ApiKeyManager(backend=InMemoryApiKeyBackend())

# Create a key
raw_key, api_key = await manager.create_key(
    name="Production Client",
    scopes=["read", "write"],
    rate_limit=100,  # requests per minute
    expires_in_days=90
)
print(raw_key)  # fxk_live_abc123... (show once, stored as hash)

# Validate
key = await manager.validate_key(raw_key)
if key:
    print(f"Valid! Scopes: {key.scopes}")

# Rotate (new key, old one revoked)
new_raw, new_key = await manager.rotate_key(raw_key)

# Revoke
await manager.revoke_key(new_raw)
\`\`\`

## FastAPI Middleware

\`\`\`python
from fastx_platform.core.api_keys import ApiKeyMiddleware, ApiKeyManager, RedisApiKeyBackend

manager = ApiKeyManager(backend=RedisApiKeyBackend(redis))
app.add_middleware(
    ApiKeyMiddleware,
    manager=manager,
    required_scopes=["read"],  # minimum scopes for all routes
)

# Access the validated key in route handlers
@app.get("/data")
async def get_data(request: Request):
    api_key = request.state.api_key
    print(f"Request from: {api_key.name}, tenant: {api_key.tenant_id}")
\`\`\`

## Key Format

Keys are prefixed with \`fxk_live_\` followed by 32 bytes of URL-safe random data. Only the SHA-256 hash is stored — the raw key is shown once at creation time.

## Features

- **Scoped access**: Define scopes per key (\`read\`, \`write\`, \`admin\`)
- **Rate limiting**: Per-key sliding window rate limits with \`429 Retry-After\`
- **Expiration**: Auto-expire keys after N days
- **Rotation**: Seamless key rotation preserving scopes and settings
- **Multi-tenant**: Filter keys by \`tenant_id\`
- **Exempt paths**: \`/health\`, \`/docs\`, \`/openapi.json\` bypass auth by default

## Next Steps

- [Security](/security)
- [Request Profiler](/request-profiler)
`,

  'request-profiler': `
# Request Profiler

Automatically profile every request in development: track SQL queries, detect N+1 patterns, measure cache performance, and view results in a built-in dashboard.

## Setup

\`\`\`python
from fastx_platform.core.profiler import ProfilerMiddleware, profiler_router

# Add middleware (auto-disabled in production)
app.add_middleware(ProfilerMiddleware)

# Mount the dashboard
app.mount("/__profile__", profiler_router)
\`\`\`

The profiler only activates when \`APP_ENV=development\` or \`PROFILER_ENABLED=true\`.

## What It Tracks

| Metric | How |
|---|---|
| Total request time | High-resolution timer |
| SQL queries | SQLAlchemy event hooks (before/after cursor execute) |
| Slow queries | Queries > 100ms flagged |
| N+1 detection | Same query pattern repeated > 3 times |
| Cache hits/misses | Manual instrumentation |
| Memory delta | tracemalloc snapshots |

## Dashboard

Visit \`/__profile__\` in your browser to see:
- Recent requests with timing breakdown
- SQL query count and total DB time per request
- N+1 warnings highlighted in red
- Slow queries flagged
- Cache hit ratio

API endpoints:
- \`GET /__profile__/api\` — JSON list of recent profiles
- \`GET /__profile__/api/{request_id}\` — single profile detail

## Response Headers

Every profiled request includes:
- \`X-Profile-Time: 45.2ms\` — total request time
- \`X-DB-Query-Count: 7\` — number of SQL queries

## SQLAlchemy Integration

\`\`\`python
from fastx_platform.core.profiler import install_sqlalchemy_hooks

# Wire up query tracking to your engine
install_sqlalchemy_hooks(engine)
\`\`\`

## Next Steps

- [N+1 Detection](/nplus1-detection)
- [Performance Guide](/performance-guide)
`,

  'webhook-receiver': `
# Webhook Receiver

Securely receive and process inbound webhooks from Stripe, GitHub, Slack, and any HMAC-signed provider.

## Quick Start

\`\`\`python
from fastx_platform.core.webhook_receiver import (
    WebhookHandler, StripeVerifier, create_webhook_endpoint
)

# Create handler and register event processors
handler = WebhookHandler()

@handler.on("payment_intent.succeeded")
async def handle_payment(payload):
    print(f"Payment received: {payload['data']['object']['amount']}")

@handler.on("customer.created")
async def handle_new_customer(payload):
    print(f"New customer: {payload['data']['object']['email']}")

# Create the webhook endpoint
router = create_webhook_endpoint(
    path="/webhooks/stripe",
    verifier=StripeVerifier(secret="whsec_..."),
    handler=handler,
    event_type_field="type"  # where to find event type in payload
)

app.include_router(router)
\`\`\`

## Supported Verifiers

| Verifier | Provider | Header |
|---|---|---|
| \`StripeVerifier\` | Stripe | \`Stripe-Signature\` |
| \`GitHubVerifier\` | GitHub | \`X-Hub-Signature-256\` |
| \`SlackVerifier\` | Slack | \`X-Slack-Signature\` |
| \`GenericHMACVerifier\` | Any | Configurable |

### Generic HMAC for any provider

\`\`\`python
from fastx_platform.core.webhook_receiver import GenericHMACVerifier

verifier = GenericHMACVerifier(
    secret="my-secret",
    header_name="X-Webhook-Signature",
    algorithm="sha256",
    signature_prefix="sha256="
)
\`\`\`

## Multiple Event Handlers

Register multiple handlers for the same event — all are called:

\`\`\`python
@handler.on("order.completed")
async def update_inventory(payload):
    ...

@handler.on("order.completed")
async def send_confirmation_email(payload):
    ...

@handler.on("order.completed")
async def notify_analytics(payload):
    ...
\`\`\`

## Next Steps

- [Security](/security)
- [Email Providers](/email-providers)
`,

  'cursor-pagination': `
# Cursor Pagination

Built-in cursor-based and offset-based pagination mixins for SQLAlchemy repositories.

## Why Cursor Pagination?

| | Offset | Cursor |
|---|---|---|
| Performance on large tables | Degrades (OFFSET scans rows) | Constant (uses WHERE) |
| Consistent with inserts/deletes | No (rows shift) | Yes (cursor is stable) |
| Random page access | Yes | No (sequential only) |
| Best for | Admin panels, small datasets | APIs, infinite scroll, feeds |

## Cursor Pagination

\`\`\`python
from fastx_database import CursorPaginationMixin

class UserRepository(CursorPaginationMixin):
    def __init__(self, session):
        self.session = session

    async def list_users(self, cursor=None):
        query = select(User).order_by(User.id)
        return await self.paginate_cursor(
            query, limit=20, cursor=cursor, order_by="id"
        )

# Usage
page = await repo.list_users()
# CursorPage(items=[...], next_cursor="abc...", has_next=True)

next_page = await repo.list_users(cursor=page.next_cursor)
\`\`\`

## Offset Pagination

\`\`\`python
from fastx_database import OffsetPaginationMixin

class UserRepository(OffsetPaginationMixin):
    def __init__(self, session):
        self.session = session

    async def list_users(self, page=1):
        query = select(User)
        return await self.paginate_offset(query, page=page, page_size=20)

# Usage
page = await repo.list_users(page=2)
# OffsetPage(items=[...], total=150, page=2, total_pages=8, has_next=True)
\`\`\`

## Response Models

\`\`\`python
# CursorPage fields
items: list[Any]
next_cursor: str | None
prev_cursor: str | None
has_next: bool
has_prev: bool
total: int | None  # optional, set include_total=True

# OffsetPage fields
items: list[Any]
total: int
page: int
page_size: int
total_pages: int
has_next: bool
has_prev: bool
\`\`\`

## Next Steps

- [Bulk Operations](/bulk-operations)
- [Persistence](/persistence)
`,

  'bulk-operations': `
# Bulk Operations

Efficient batch database operations for SQLAlchemy: bulk insert, update, delete, and upsert.

## Quick Start

\`\`\`python
from fastx_database import BulkOperationsMixin

class UserRepository(BulkOperationsMixin):
    def __init__(self, session):
        self.session = session

# Bulk create
users = [
    {"name": "Alice", "email": "alice@example.com"},
    {"name": "Bob", "email": "bob@example.com"},
    # ... hundreds more
]
created = await repo.bulk_create(User, users, batch_size=500)

# Bulk update
updates = [
    {"id": 1, "name": "Alice Updated"},
    {"id": 2, "name": "Bob Updated"},
]
count = await repo.bulk_update(User, updates, key_field="id")

# Bulk delete
count = await repo.bulk_delete(User, ids=[3, 4, 5])

# Bulk upsert (insert or update on conflict)
count = await repo.bulk_upsert(
    User, users,
    key_fields=["email"],  # conflict detection columns
    batch_size=1000
)
\`\`\`

## BulkResult

The \`bulk_operation\` convenience method returns a detailed result:

\`\`\`python
result = await repo.bulk_operation(
    User,
    create=[{"name": "New"}],
    update=[{"id": 1, "name": "Changed"}],
    delete=[2, 3]
)
# BulkResult(created=1, updated=1, deleted=2, errors=0, duration_ms=45.2)
\`\`\`

## Features

- **Batching**: Automatically splits large operations into configurable batch sizes
- **Error resilience**: Failed batches don't stop the entire operation
- **Progress logging**: Logs progress for large operations
- **Upsert support**: INSERT ... ON CONFLICT DO UPDATE pattern

## Next Steps

- [Cursor Pagination](/cursor-pagination)
- [Persistence](/persistence)
`,

  'guide-testing': `
# Testing & Linting

FastX CLI includes built-in commands for running tests and linting your project.

## Running Tests

\`\`\`bash
# Run all tests
fastx test

# Verbose output
fastx test -v

# Stop on first failure
fastx test -x

# Watch mode (auto-rerun on file changes)
fastx test --watch

# With coverage report
fastx test --coverage

# Parallel execution
fastx test --parallel

# Filter by marker
fastx test -m "not slow"

# Filter by test name
fastx test -k "test_login"

# Specific test path
fastx test --path tests/unit
\`\`\`

### Watch Mode

Watch mode uses \`pytest-watch\` to automatically re-run tests when files change:

\`\`\`bash
pip install pytest-watch
fastx test --watch
\`\`\`

### Coverage Reports

\`\`\`bash
pip install pytest-cov
fastx test --coverage
# Generates HTML report in htmlcov/
\`\`\`

### Parallel Execution

\`\`\`bash
pip install pytest-xdist
fastx test --parallel
# Runs tests across all CPU cores
\`\`\`

## Linting & Formatting

\`\`\`bash
# Check for lint errors and formatting issues
fastx lint

# Auto-fix everything
fastx lint --fix

# Also run mypy type checking
fastx lint --type-check

# Strict mode (all ruff rules + strict mypy)
fastx lint --strict

# Lint specific directory
fastx lint --path src/
\`\`\`

### What It Runs

1. **ruff check** — fast Python linter (replaces flake8, isort, pyflakes)
2. **ruff format** — fast Python formatter (replaces black)
3. **mypy** (optional) — static type checker

## Environment Validation

\`\`\`bash
# Check .env against .env.example
fastx env check

# Strict mode (extra/empty vars are errors too)
fastx env check --strict

# Auto-sync missing vars from .env.example to .env
fastx env sync
\`\`\`

## Package Upgrades

\`\`\`bash
# Check for outdated fastx packages
fastx upgrade --check

# Upgrade all fastx packages
fastx upgrade

# Skip confirmation
fastx upgrade -y
\`\`\`

## Route Inspection

\`\`\`bash
# Print all registered routes
fastx routes

# Filter by path
fastx routes -f /api/v1

# Filter by method
fastx routes -m POST

# JSON output
fastx routes --json
\`\`\`

## Next Steps

- [CLI Reference](/cli-tool)
- [Best Practices](/best-practices)
`,

  'guide-openapi-diff': `
# OpenAPI Diff

Compare two versions of your OpenAPI spec to detect breaking changes, additions, and modifications. Ideal for CI pipelines and API changelog generation.

## Quick Start

\`\`\`bash
# Compare two spec files
fastx sdk diff -o v1.json -n v2.json

# Compare old file against running server
fastx sdk diff -o v1.json

# Only show breaking changes
fastx sdk diff -o v1.json -n v2.json --breaking-only

# Output as markdown (for changelogs)
fastx sdk diff -o v1.json -n v2.json -f markdown > CHANGELOG.md

# Output as JSON (for CI)
fastx sdk diff -o v1.json -n v2.json -f json
\`\`\`

## What It Detects

### Breaking Changes (exits with code 1)

- Removed endpoints
- Removed required request fields
- Changed field types (narrowing)
- Removed response fields
- Added new required request fields

### Non-Breaking Changes

- Added endpoints
- Added optional request fields
- Added response fields
- Deprecated endpoints
- Added parameters

### Modifications

- Changed descriptions
- Changed parameter locations
- Changed default values

## CI Integration

\`\`\`yaml
# GitHub Actions example
- name: Check for breaking API changes
  run: |
    fastx sdk diff \\
      -o openapi-main.json \\
      -n openapi-pr.json \\
      --breaking-only
    # Exits with code 1 if breaking changes found
\`\`\`

## Markdown Output

\`\`\`bash
fastx sdk diff -o v1.json -n v2.json -f markdown
\`\`\`

Produces:

\`\`\`markdown
## API Changes

### Breaking Changes
- **Removed endpoint**: DELETE /api/v1/users/{id}
- **Removed required field**: POST /api/v1/orders -> field "shipping_address"

### New Features
- **Added endpoint**: GET /api/v2/analytics
- **Added optional field**: POST /api/v1/users -> field "avatar_url"
\`\`\`

## Next Steps

- [SDK Generation](/guide-sdk-generation)
- [CLI Reference](/cli-tool)
`
};
