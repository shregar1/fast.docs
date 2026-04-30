export const chaosEngineeringContent = {
  id: 'chaos-engineering',
  title: 'Chaos Engineering',
  icon: '⚡',
  content: `
# Chaos Engineering

Build confidence in system resilience through controlled fault injection.

## Overview

Chaos Engineering helps validate that your Fast application can withstand failures. By intentionally injecting faults in a controlled manner, you can identify weaknesses before they cause outages.

## Features

- **Automatic Failure Injection** - Latency, errors, resource pressure
- **Blast Radius Control** - Limit affected traffic percentage
- **SLO Monitoring** - Auto-abort on SLO breach
- **GameDay Automation** - Run complete chaos scenarios
- **Safety Controls** - Automatic rollback and cleanup

## Quick Start

\`\`\`python
from fastx_platform.chaos import chaos_experiment, FailureType, FailureConfig

@chaos_experiment(
    failures=[
        FailureConfig(
            failure_type=FailureType.LATENCY_SPIKE,
            probability=0.1,
            parameters={"min_ms": 100, "max_ms": 2000}
        ),
        FailureConfig(
            failure_type=FailureType.DB_CONNECTION_DROP,
            probability=0.05
        )
    ],
    blast_radius=0.1,  # Affect 10% of traffic
    duration_minutes=10
)
async def get_user_profile(user_id: UUID) -> UserProfile:
    """This endpoint will have chaos injected during experiments"""
    return await UserService.get(user_id)
\`\`\`

## Running Experiments

\`\`\`bash
# List all experiments
fast chaos list

# Start experiment
fast chaos start --experiment get_user_profile --target user-service

# Dry run (validate without injecting)
fast chaos start --experiment get_user_profile --dry-run

# Stop experiment
fast chaos stop --experiment get_user_profile

# View experiment status
fast chaos status --experiment get_user_profile
\`\`\`

## Failure Types

### Latency Failures

\`\`\`python
# Add random delays
FailureConfig(
    failure_type=FailureType.LATENCY_SPIKE,
    probability=0.2,
    parameters={"min_ms": 500, "max_ms": 5000}
)

# Gradually increase latency
FailureConfig(
    failure_type=FailureType.LATENCY_DEGRADATION,
    probability=0.3,
    parameters={"initial_ms": 100, "increment_ms": 100}
)
\`\`\`

### Network Failures

\`\`\`python
# Connection timeouts
FailureConfig(
    failure_type=FailureType.NETWORK_TIMEOUT,
    probability=0.1
)

# Packet loss
FailureConfig(
    failure_type=FailureType.NETWORK_PACKET_LOSS,
    probability=0.05,
    parameters={"loss_percent": 10}
)

# DNS failures
FailureConfig(
    failure_type=FailureType.DNS_FAILURE,
    probability=0.02
)
\`\`\`

### Database Failures

\`\`\`python
# Drop connections
FailureConfig(
    failure_type=FailureType.DB_CONNECTION_DROP,
    probability=0.1,
    parameters={"mode": "random_disconnect"}
)

# Slow queries
FailureConfig(
    failure_type=FailureType.DB_CONNECTION_DROP,
    probability=0.2,
    parameters={"mode": "slow_queries", "delay_ms": 2000}
)
\`\`\`

### Exception Injection

\`\`\`python
# Throw random exceptions
FailureConfig(
    failure_type=FailureType.EXCEPTION_INJECTION,
    probability=0.15,
    parameters={
        "exceptions": [ValueError, TimeoutError, ConnectionError]
    }
)
\`\`\`

## Programmatic Control

\`\`\`python
from fastx_platform.chaos import ChaosController, ChaosExperiment

# Create experiment programmatically
experiment = ChaosExperiment(
    name="db-failover-test",
    target="user-service",
    failures=[
        FailureConfig(
            failure_type=FailureType.DB_CONNECTION_DROP,
            probability=0.5
        )
    ],
    blast_radius=0.05,
    duration=timedelta(minutes=5)
)

# Register experiment
ChaosController.register_experiment(experiment)

# Start experiment
result = await ChaosController.start_experiment("db-failover-test")

print(f"Status: {result.status}")
print(f"Error Rate: {result.error_rate:.1%}")
print(f"P99 Latency: {result.p99_latency_ms}ms")
\`\`\`

## Safety Controls

\`\`\`python
from fastx_platform.chaos import chaos_experiment, FailureConfig, FailureType

# Define abort conditions
def error_rate_too_high():
    return metrics.error_rate > 0.5  # Abort if > 50% errors

def latency_too_high():
    return metrics.p99_latency > 5000  # Abort if > 5s

@chaos_experiment(
    failures=[
        FailureConfig(failure_type=FailureType.LATENCY_SPIKE, probability=0.3)
    ],
    abort_conditions=[error_rate_too_high, latency_too_high],
    blast_radius=0.1  # Never affect more than 10%
)
async def critical_endpoint():
    pass
\`\`\`

## GameDay Automation

\`\`\`python
from fastx_platform.chaos import GameDay, GameDayScenario

# Define a GameDay scenario
scenario = GameDayScenario(
    name="Production Readiness",
    description="Validate system is ready for production",
    experiments=[
        db_failover_experiment,
        cache_failure_experiment,
        high_latency_experiment
    ],
    pre_health_check=True,
    post_recovery_validation=True
)

# Run the GameDay
result = await GameDay().run_scenario(scenario)

print(f"Overall Success: {result.overall_success}")
for finding in result.findings:
    print(f"Finding: {finding}")
for rec in result.recommendations:
    print(f"Recommendation: {rec}")
\`\`\`

## Pre-built Scenarios

\`\`\`python
from fastx_platform.chaos.gameday import (
    PRODUCTION_READINESS,
    DISASTER_RECOVERY,
    REGION_FAILOVER
)

# Use pre-built scenarios
result = await GameDay().run_scenario(PRODUCTION_READINESS)
\`\`\`

## Scheduling Recurring Chaos

\`\`\`bash
# Schedule weekly chaos
fast chaos schedule \
  --experiment db-failover \
  --cron "0 2 * * 0"  # Every Sunday at 2 AM

# Schedule monthly GameDay
fast chaos gameday \
  --scenario production-readiness \
  --schedule "0 9 1 * *"  # First of month at 9 AM
\`\`\`

## Metrics and Results

\`\`\`python
# Experiment result includes:
result = ExperimentResult(
    experiment_id="db-failover-test",
    status=ExperimentStatus.COMPLETED,
    total_requests=10000,
    failed_requests=150,
    p50_latency_ms=45,
    p99_latency_ms=1200,
    error_rate=0.015,
    detection_time_ms=500,   # Time to detect failure
    recovery_time_ms=3000,   # Time to recover
    slo_violations=["p99_latency > 1000ms"],
    events=[...]  # Detailed event log
)
\`\`\`

## Best Practices

1. **Start Small** - Begin with low blast radius (1-5%)
2. **Production Safety** - Always have abort conditions
3. **Business Hours** - Run experiments when team is available
4. **Communicate** - Notify team before running experiments
5. **Measure** - Track recovery time and error rates
6. **Iterate** - Gradually increase failure intensity

## API Reference

### Decorators

| Decorator | Description |
|-----------|-------------|
| \`@chaos_experiment()\` | Enable chaos experiments |

### Classes

| Class | Description |
|-------|-------------|
| \`ChaosExperiment\` | Define chaos experiments |
| \`ChaosController\` | Control experiment execution |
| \`GameDay\` | Automated chaos scenarios |
| \`FailureConfig\` | Failure injection config |

### Failure Types

| Type | Description |
|------|-------------|
| \`LATENCY_SPIKE\` | Add random delays |
| \`NETWORK_TIMEOUT\` | Connection timeouts |
| \`DB_CONNECTION_DROP\` | Drop DB connections |
| \`EXCEPTION_INJECTION\` | Throw exceptions |
| \`CPU_PRESSURE\` | High CPU usage |
| \`MEMORY_PRESSURE\` | Memory exhaustion |
`
};
