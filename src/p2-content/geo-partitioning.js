export const geoPartitioningContent = {
  id: 'geo-partitioning',
  title: 'Geo-Partitioning',
  icon: '🗺️',
  content: `
# Geo-Partitioning

Automatic geo-aware data sharding for global applications with GDPR compliance.

## Overview

Geo-Partitioning automatically shards data based on geographic location, ensuring data is stored closest to users while maintaining data residency compliance (GDPR, CCPA, etc.).

## Features

- **Automatic Sharding** - Data routed to nearest region
- **GDPR Compliance** - EU data stays in EU
- **Cross-Region Replication** - Optional replication for HA
- **Sub-50ms Reads** - Query data from nearest shard
- **Data Residency** - Enforce geographic data boundaries

## Quick Start

\`\`\`python
from fast_database.geo import geo_partition, GeoLocation, BaseGeoModel
from uuid import uuid4

@geo_partition(
    shard_key="location.country",
    strategy=GeoShardingStrategy.PROXIMITY,
    replicas={"us-west": 1, "eu-central": 1}
)
class UserData(BaseGeoModel):
    user_id: uuid4
    location: GeoLocation
    personal_data: dict

# Create user - automatically stored in correct region
user = await UserData.create_in_region(
    location=GeoLocation(country="DE", city="Berlin"),
    user_id=uuid4(),
    personal_data={"name": "John", "email": "john@example.de"}
)
# → Stored in EU-West shard (GDPR compliant)
\`\`\`

## GDPR Compliance

\`\`\`python
from fast_database.geo import GDPRCompliance

# Check if country requires EU residency
if GDPRCompliance.requires_eu_residency("DE"):
    print("Data must be stored in EU")

# Handle data deletion request (GDPR Article 17)
result = await GDPRCompliance.handle_data_deletion_request(user_id)
print(f"Deleted from {len(result['deleted_from'])} shards")

# Export user data (GDPR Article 20)
data = await GDPRCompliance.export_user_data(user_id)
# Returns all user data across all shards
\`\`\`

## Sharding Strategies

\`\`\`python
from fast_database.geo import GeoShardingStrategy

# PROXIMITY - Route to nearest shard (default)
@geo_partition(
    shard_key="location.country",
    strategy=GeoShardingStrategy.PROXIMITY
)
class EventLog(BaseGeoModel):
    pass

# RESIDENCY - Strict data residency (GDPR)
@geo_partition(
    shard_key="location.country",
    strategy=GeoShardingStrategy.RESIDENCY
)
class UserProfile(BaseGeoModel):
    pass

# REPLICATED - Full replication across all regions
@geo_partition(
    shard_key="location.country",
    strategy=GeoShardingStrategy.REPLICATED
)
class ProductCatalog(BaseGeoModel):
    pass
\`\`\`

## Cross-Region Replication

\`\`\`python
from fast_database.geo import geo_partition, GeoReplicationService

@geo_partition(
    shard_key="location.country",
    replicas={
        "us-west": 1,      # 1 replica in US-West
        "eu-central": 1,   # 1 replica in EU-Central
        "apac-singapore": 1
    },
    sync_replication=False  # Async replication for performance
)
class Order(BaseGeoModel):
    order_id: str
    amount: float

# Check replication lag
lag = await GeoReplicationService.get_replication_lag("us-west")
print(f"Replication lag: {lag}s")

# Check queue length
queue_size = GeoReplicationService.get_queue_length("us-west")
\`\`\`

## Querying Data

\`\`\`python
# Get by ID - queries appropriate shard
user = await UserData.get_by_id(user_id)

# Prefer specific region for read
user = await UserData.get_by_id(
    user_id,
    preferred_region="eu-west"  # Read from EU replica
)

# Query across all shards (for analytics)
all_events = await EventLog.query().where(
    EventLog.event_type == "purchase"
).fetch_all_shards()
\`\`\`

## Geo-Distributed Cache

\`\`\`python
from fast_database.geo.cache import GeoDistributedCache

cache = GeoDistributedCache()

# Cache in user's region
await cache.set(
    key=f"user:{user_id}:profile",
    value=user_profile,
    geo_hint=user_location,
    ttl=3600
)

# Read from nearest replica
profile = await cache.get(
    key=f"user:{user_id}:profile",
    prefer_region="eu-west"
)
\`\`\`

## Configuration

\`\`\`yaml
# fast.yaml
geo_sharding:
  enabled: true
  default_strategy: proximity
  
  shards:
    us-east:
      host: db-us-east.example.com
      database: fast
      replicas:
        us-west:
          count: 1
          sync: false
    
    eu-west:
      host: db-eu-west.example.com
      database: fast
      gdpr_compliant: true
      replicas:
        eu-central:
          count: 1
          sync: false
    
    apac-tokyo:
      host: db-tokyo.example.com
      database: fast
      replicas:
        apac-singapore:
          count: 1
          sync: false
\`\`\`

## Available Shards

| Shard ID | Region | GDPR Compliant |
|----------|--------|----------------|
| us-east | US East (N. Virginia) | No |
| us-west | US West (N. California) | No |
| eu-west | EU West (Ireland) | Yes |
| eu-central | EU Central (Frankfurt) | Yes |
| apac-tokyo | Asia Pacific (Tokyo) | No |
| apac-singapore | Asia Pacific (Singapore) | No |
| apac-sydney | Asia Pacific (Sydney) | No |

## Country to Shard Mapping

| Country | Primary Shard | Notes |
|---------|--------------|-------|
| US, CA, MX | us-east | North America |
| GB, DE, FR, IT, ES | eu-west | EU (GDPR) |
| JP, KR | apac-tokyo | East Asia |
| SG, IN, ID | apac-singapore | Southeast Asia |
| AU, NZ | apac-sydney | Oceania |

## API Reference

### Decorators

| Decorator | Description |
|-----------|-------------|
| \`@geo_partition()\` | Enable geo-partitioning for a model |

### Classes

| Class | Description |
|-------|-------------|
| \`BaseGeoModel\` | Base class for geo-partitioned models |
| \`GeoLocation\` | Geographic location with coordinates |
| \`GeoPoint\` | Lat/long coordinates |
| \`GeoShardingRouter\` | Routes operations to shards |
| \`GDPRCompliance\` | GDPR compliance helpers |

### Enums

| Enum | Values |
|------|--------|
| \`GeoShardingStrategy\` | \`PROXIMITY\`, \`RESIDENCY\`, \`REPLICATED\`, \`PARTITIONED\` |
`
};
