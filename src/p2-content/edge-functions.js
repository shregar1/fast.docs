export const edgeFunctionsContent = {
  id: 'edge-functions',
  title: 'Edge Functions',
  icon: '🌍',
  content: `
# Edge Functions

Deploy and run Python code at the edge across 200+ global locations for sub-50ms response times.

## Overview

Edge Functions bring your Fast application closer to users by deploying code to CDN edge locations worldwide. This reduces latency, improves user experience, and enables geo-aware routing.

## Features

- **Global Deployment** - Deploy to 200+ edge locations
- **Geo-Aware Routing** - Route users to nearest edge node
- **Edge KV Store** - Key-value storage replicated at edge
- **Edge Caching** - Programmable cache with TTL and tags
- **Multiple Runtimes** - V8, Python WASM, or Native Python

## Quick Start

\`\`\`python
from fast_platform.edge import edge_function, EdgeRequest, EdgeResponse

@edge_function(
    runtime=EdgeRuntime.V8,
    regions=["us-east", "eu-west", "apac-tokyo"],
    ttl=300  # Cache for 5 minutes
)
async def get_user_profile(request: EdgeRequest) -> EdgeResponse:
    """Serve user profiles from the edge"""
    user_id = request.headers.get("x-user-id")
    
    # Check edge KV cache
    kv = EdgeKV("user-profiles")
    profile = await kv.get(f"user:{user_id}")
    
    if profile:
        return EdgeResponse.json(profile)
    
    # Fetch from origin
    profile = await fetch_from_origin(f"/api/users/{user_id}")
    
    # Cache at edge
    await kv.put(f"user:{user_id}", profile, ttl=3600)
    
    return EdgeResponse.json(profile)
\`\`\`

## Geo-Redirect Example

\`\`\`python
@edge_function()
async def geo_redirect(request: EdgeRequest) -> EdgeResponse:
    """Redirect users to country-specific site"""
    country = request.geo.country_code
    
    redirects = {
        "JP": "https://jp.example.com",
        "DE": "https://de.example.com",
        "FR": "https://fr.example.com",
    }
    
    target = redirects.get(country, "https://www.example.com")
    return EdgeResponse.redirect(target)
\`\`\`

## A/B Testing at Edge

\`\`\`python
import hashlib

@edge_function(ttl=0)  # No cache
async def ab_test(request: EdgeRequest) -> EdgeResponse:
    """A/B test at the edge with consistent bucketing"""
    user_id = request.headers.get("x-user-id", request.client_ip)
    
    # Consistent hashing for bucketing
    bucket = int(hashlib.md5(user_id.encode()).hexdigest(), 16) % 100
    variant = "A" if bucket < 50 else "B"
    
    # Add variant header for origin
    request.headers["x-ab-variant"] = variant
    
    # Fetch from origin with variant
    response = await fetch_origin(request)
    response.headers["x-ab-variant"] = variant
    
    return response
\`\`\`

## Edge KV Store

\`\`\`python
from fast_platform.edge import EdgeKV

# Create namespace
kv = EdgeKV("user-sessions")

# Store with TTL
await kv.put(f"session:{user_id}", session_data, ttl=3600)

# Retrieve
session = await kv.get(f"session:{user_id}")

# Atomic operations
count = await kv.increment(f"counter:{key}")

# List keys
keys = await kv.list_keys(prefix="session:")
\`\`\`

## Edge Cache API

\`\`\`python
from fast_platform.edge import EdgeCache

cache = EdgeCache()

# Check cache
cached = await cache.match(request)
if cached:
    return cached

# Fetch from origin
response = await fetch_origin(request)

# Cache with tags
response.cache_ttl = 300
response.cache_tags = ["users", f"user:{user_id}"]
await cache.put(request, response)

# Later: invalidate by tag
await cache.purge_by_tag(f"user:{user_id}")
\`\`\`

## Authentication at Edge

\`\`\`python
import jwt

@edge_function()
async def edge_auth(request: EdgeRequest) -> EdgeResponse:
    """Validate JWT at the edge before hitting origin"""
    auth_header = request.headers.get("authorization", "")
    
    if not auth_header.startswith("Bearer "):
        return EdgeResponse.json({"error": "Unauthorized"}, status=401)
    
    token = auth_header[7:]
    
    try:
        payload = jwt.decode(
            token,
            key=EDGE_JWT_PUBLIC_KEY,
            algorithms=["RS256"]
        )
        
        # Add user info to headers
        request.headers["x-user-id"] = payload["sub"]
        request.headers["x-user-role"] = payload["role"]
        
        # Continue to origin
        return await fetch_origin(request)
        
    except jwt.ExpiredSignatureError:
        return EdgeResponse.json({"error": "Token expired"}, status=401)
    except jwt.InvalidTokenError:
        return EdgeResponse.json({"error": "Invalid token"}, status=401)
\`\`\`

## Rate Limiting at Edge

\`\`\`python
@edge_function()
async def rate_limit(request: EdgeRequest) -> EdgeResponse:
    """Rate limit at the edge"""
    client_ip = request.client_ip
    kv = EdgeKV("rate-limits")
    
    key = f"rate:{client_ip}"
    current = await kv.get(key) or 0
    limit = 100  # requests per minute
    
    if current >= limit:
        return EdgeResponse.json(
            {"error": "Rate limit exceeded"},
            status=429,
            headers={"retry-after": "60"}
        )
    
    # Increment counter
    await kv.increment(key)
    await kv.put(key, current + 1, ttl=60)
    
    response = await fetch_origin(request)
    response.headers["x-ratelimit-remaining"] = str(limit - current - 1)
    
    return response
\`\`\`

## Deployment

\`\`\`bash
# Deploy to Cloudflare Workers
fast edge deploy --function get_user_profile --target cloudflare

# Deploy to multiple providers
fast edge deploy --function geo_redirect --target cloudflare,fastly

# View logs
fast edge logs --function get_user_profile --tail

# Get metrics
fast edge metrics --function get_user_profile
\`\`\`

## Configuration

\`\`\`yaml
# fast.yaml
edge:
  provider: cloudflare
  account_id: your-account-id
  api_token: \${CF_API_TOKEN}
  
  functions:
    get_user_profile:
      regions: ["all"]
      memory_limit: 128
      timeout: 5000
\`\`\`

## API Reference

### Decorators

| Decorator | Description |
|-----------|-------------|
| \`@edge_function()\` | Define an edge-deployable function |

### Classes

| Class | Description |
|-------|-------------|
| \`EdgeRequest\` | Request object with geo info |
| \`EdgeResponse\` | Response object with cache control |
| \`EdgeKV\` | Edge key-value store |
| \`EdgeCache\` | Programmatic edge caching |

### EdgeRequest Properties

| Property | Description |
|----------|-------------|
| \`geo\` | GeoLocation object |
| \`geo.country_code\` | User's country (e.g., "US") |
| \`geo.city\` | User's city |
| \`edge_region\` | Edge node region |
| \`client_ip\` | Client IP address |

## Performance

| Metric | Target |
|--------|--------|
| Cold Start | < 10ms |
| Cache Hit | < 1ms |
| Origin Fetch | < 50ms (p95) |
| Global Coverage | 200+ locations |
`
};
