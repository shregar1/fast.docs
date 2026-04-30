export const costTrackingContent = {
  id: 'cost-tracking',
  title: 'Cost Tracking',
  icon: '💰',
  content: `
# Cost Tracking

Comprehensive cost visibility, per-tenant attribution, budget alerts, and optimization recommendations.

## Overview

Cost Tracking provides real-time visibility into your infrastructure costs with per-tenant attribution, budget management, and automated optimization recommendations.

## Features

- **Real-time Attribution** - Track costs by tenant, endpoint, resource
- **Budget Alerts** - Get notified before exceeding limits
- **Cost Controls** - Throttle or block when budgets exceeded
- **Optimization AI** - Automated cost-saving recommendations
- **Multi-cloud** - AWS, GCP, Azure cost aggregation

## Quick Start

\`\`\`python
from fastx_platform.cost import track_costs, ResourceType

@track_costs(
    resource_type=ResourceType.COMPUTE,
    model="per-request",
    tenant_extractor=lambda req: req.headers.get("x-tenant-id")
)
async def generate_report(request: Request) -> Report:
    """Cost automatically tracked per tenant"""
    return await ReportService.generate()
\`\`\`

## Budget Management

\`\`\`python
from fastx_platform.cost import Budget, BudgetAlert, BudgetManager

# Create tenant budget
budget = Budget(
    id="tenant-acme-2024",
    name="ACME Corp Budget",
    tenant_id="acme-corp",
    monthly_limit=Decimal("5000.00"),
    alert_thresholds=[
        BudgetAlert.at(50, notify="slack"),           # Alert at 50%
        BudgetAlert.at(80, notify="email", action="throttle"),  # Throttle at 80%
        BudgetAlert.at(100, notify="pagerduty", action="block"),  # Block at 100%
    ]
)

await BudgetManager.create_budget(budget)
\`\`\`

## Manual Cost Tracking

\`\`\`python
from fastx_platform.cost import CostTracker, ResourceType
from decimal import Decimal

async def process_job(job: Job):
    # Start tracking
    ctx = CostTracker.start_context(tenant_id=job.tenant_id)
    
    try:
        # Track database usage
        db_start = time.time()
        result = await db.query(job.query)
        CostTracker.record(
            resource_type=ResourceType.STORAGE,
            quantity=Decimal(time.time() - db_start),
            unit="seconds",
            resource_id="postgres-prod",
            query_type="analytics"
        )
        
        # Track ML inference
        CostTracker.record(
            resource_type=ResourceType.ML_INFERENCE,
            quantity=Decimal(len(result)),
            unit="tokens",
            resource_id="openai-gpt4"
        )
        
        # Track external API call
        CostTracker.record(
            resource_type=ResourceType.THIRD_PARTY_API,
            quantity=Decimal(1),
            unit="request",
            resource_id="stripe-api"
        )
        
    finally:
        # Flush to storage
        await CostTracker.flush()
\`\`\`

## Resource Types

\`\`\`python
from fastx_platform.cost import ResourceType

ResourceType.COMPUTE          # CPU/Memory
ResourceType.STORAGE          # Database, disk
ResourceType.NETWORK          # Data transfer
ResourceType.CACHE            # Redis/Memcached
ResourceType.QUEUE            # Message queues
ResourceType.SEARCH           # Elasticsearch
ResourceType.ML_INFERENCE     # ML model inference
ResourceType.THIRD_PARTY_API  # External APIs
\`\`\`

## Cost Dashboard

\`\`\`bash
# View cost dashboard
fast cost dashboard

# View breakdown by resource
fast cost breakdown --by resource --period 30d

# View breakdown by tenant
fast cost breakdown --by tenant --period 7d

# View breakdown by endpoint
fast cost breakdown --by endpoint --period 24h
\`\`\`

## Budget CLI

\`\`\`bash
# Create budget
fast cost budget create \
  --tenant acme \
  --limit 5000 \
  --alert 50,80,100

# List budgets
fast cost budget list

# Get budget status
fast cost budget status --tenant acme

# Update budget
fast cost budget update --tenant acme --limit 10000
\`\`\`

## Cost Optimization

\`\`\`python
from fastx_platform.cost import CostOptimizer

# Get optimization recommendations
optimizer = CostOptimizer()
recommendations = await optimizer.analyze(tenant_id="acme-corp")

for rec in recommendations:
    print(f"{rec.title}: Save \${rec.potential_savings}/month")
    print(f"  Confidence: {rec.confidence*100:.0f}%")
    print(f"  Effort: {rec.effort}")
    print(f"  Action: {rec.action}")
\`\`\`

### Optimization Examples

\`\`\`bash
# Get recommendations
fast cost optimize

# Apply recommendation
fast cost optimize apply --id compute-downsize-api-service

# Export recommendations
fast cost optimize export --format json
\`\`\`

## Common Recommendations

| Recommendation | Potential Savings | Effort |
|----------------|-------------------|--------|
| Downsize underutilized services | 30-50% | Low |
| Archive old data | 60-80% | Medium |
| Right-size cache clusters | 20-40% | Low |
| Optimize expensive queries | 10-30% | High |
| Reserved instances | 40-60% | Low |

## Cost Attribution

\`\`\`python
# Track by tenant
CostTracker.start_context(tenant_id="acme-corp")

# Track by user
CostTracker.record(
    resource_type=ResourceType.COMPUTE,
    quantity=Decimal(1),
    unit="request",
    resource_id="generate-report",
    user_id="user-123",
    endpoint="/api/reports"
)
\`\`\`

## Cloud Billing Integration

\`\`\`yaml
# Fast.yaml
cost_tracking:
  enabled: true
  
  cloud:
    aws:
      cost_explorer_role: arn:aws:iam::123456789:role/CostExplorer
      bucket: s3://billing-reports
    
    gcp:
      billing_account: 012345-678901-234567
      project_id: my-project
    
    azure:
      subscription_id: xxx
      resource_group: production
\`\`\`

## Cost Export

\`\`\`bash
# Export to CSV
fast cost export --format csv --period 30d --output costs.csv

# Export to BigQuery
fast cost export --format bigquery --dataset cost_analytics

# Export detailed breakdown
fast cost export --format csv --by tenant,resource,endpoint
\`\`\`

## Reconciliation

\`\`\`bash
# Reconcile tracked costs with cloud bills
fast cost reconcile --month 1 --year 2024

# View variance report
fast cost reconcile report --month 1 --year 2024
\`\`\`

## Per-Request Cost Headers

\`\`\`python
# Add cost headers to responses
@app.middleware("http")
async def add_cost_header(request, call_next):
    CostTracker.start_context()
    
    response = await call_next(request)
    
    cost = CostTracker.get_current_total()
    response.headers["x-request-cost"] = f"\${float(cost):.6f}"
    
    await CostTracker.flush()
    return response
\`\`\`

Response will include:
\`\`\`
HTTP/1.1 200 OK
X-Request-Cost: $0.001245
Content-Type: application/json
\`\`\`

## API Reference

### Decorators

| Decorator | Description |
|-----------|-------------|
| \`@track_costs()\` | Automatically track costs |

### Classes

| Class | Description |
|-------|-------------|
| \`CostTracker\` | Main cost tracking interface |
| \`CostContext\` | Per-request cost tracking |
| \`Budget\` | Budget configuration |
| \`BudgetManager\` | Manage budgets |
| \`CostOptimizer\` | Optimization recommendations |

### Resource Types

| Type | Description |
|------|-------------|
| \`COMPUTE\` | CPU/Memory |
| \`STORAGE\` | Database, disk |
| \`NETWORK\` | Data transfer |
| \`CACHE\` | Redis/Memcached |
| \`ML_INFERENCE\` | ML tokens |
| \`THIRD_PARTY_API\` | External APIs |

## Cost Breakdown Example

\`\`\`
Total Monthly Cost: $12,450

By Resource:
  - Compute: $5,200 (42%)
  - Storage: $3,100 (25%)
  - Network: $1,800 (14%)
  - Cache: $1,200 (10%)
  - ML Inference: $800 (6%)
  - Other: $350 (3%)

By Tenant:
  - acme-corp: $4,500
  - techstart-inc: $3,200
  - global-corp: $2,800
  - Others: $1,950

Top Endpoints by Cost:
  1. /api/reports/generate: $2,100
  2. /api/ml/predict: $1,800
  3. /api/search/query: $1,200
  4. /api/users/export: $950
  5. /api/analytics/dashboard: $800
\`\`\`
`
};
