// Best Practices Guide

export const bestPracticesMarkdown = {
  'best-practices-overview': `# Best Practices

Recommended patterns and practices for building production applications with Fast.

## Repository Pattern Best Practices

### Keep Repositories Focused

\`\`\`python
# GOOD - One concern per method
class UserRepository:
    async def get_by_id(self, id: UUID) -> User | None:
        pass
    
    async def get_by_email(self, email: str) -> User | None:
        pass
    
    async def list_active(self, limit: int = 100) -> list[User]:
        pass

# BAD - Too many responsibilities
class UserRepository:
    async def get_user_and_send_email_and_update_cache(self, id: UUID):
        pass
\`\`\`

### Return Domain Models

\`\`\`python
# GOOD - Return model, let service convert
async def get_by_id(self, id: UUID) -> User | None:
    result = await self.session.execute(...)
    return result.scalar_one_or_none()

# BAD - Return dict from repository
async def get_by_id(self, id: UUID) -> dict:
    user = await self.session.get(User, id)
    return {"id": str(user.id), "email": user.email}
\`\`\`

## Service Layer Best Practices

### Transaction Boundaries

Services should own transactions:

\`\`\`python
class OrderService:
    async def create_order(self, data: OrderCreate) -> Order:
        async with self.session.begin():
            # All operations in one transaction
            order = await self.order_repo.create(data)
            await self.inventory_repo.reserve(order.items)
            await self.payment_repo.authorize(order.total)
            return order
\`\`\`

### Business Logic Only

\`\`\`python
class OrderService:
    async def process_order(self, order_id: UUID):
        order = await self.repo.get_by_id(order_id)
        
        # Business rules
        if order.status != OrderStatus.PENDING:
            raise InvalidOrderState("Order already processed")
        
        if not await self.inventory_service.check_availability(order.items):
            raise OutOfStock("Items not available")
        
        # Process...
\`\`\`

## API Design Best Practices

### Consistent Response Format

\`\`\`python
# Success
{
  "data": { ... },
  "meta": {
    "request_id": "req_123",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}

# Error
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [...]
  }
}
\`\`\`

### Use DTOs for All Endpoints

\`\`\`python
@router.post("/orders", response_model=OrderResponse)
async def create_order(data: OrderCreate):  # Always use DTOs
    pass
\`\`\`

## Testing Best Practices

### Test One Thing per Test

\`\`\`python
# GOOD
async def test_create_user_saves_to_database():
    pass

async def test_create_user_hashes_password():
    pass

async def test_create_user_sends_welcome_email():
    pass

# BAD - Too many assertions
async def test_create_user():
    # Tests database, hashing, and email in one
    pass
\`\`\`

### Use Factories, Not Fixtures for Data

\`\`\`python
# GOOD - Factory with variation
user = await UserFactory(db).create(email="specific@test.com")

# BAD - Complex fixture setup
@pytest.fixture
def user_with_team_and_project_and_tasks():
    # Too complex, hard to understand
\`\`\`

## Security Best Practices

### Never Trust Client Input

\`\`\`python
# GOOD - Validate and sanitize
@router.post("/search")
async def search(query: str = Query(..., max_length=100)):
    sanitized = bleach.clean(query)  # Remove HTML
    return await service.search(sanitized)

# BAD - Direct pass-through
@router.post("/search")
async def search(query: str):
    return await service.search(query)  # XSS risk!
\`\`\`

### Least Privilege

\`\`\`python
# GOOD - Check permission at every level
@router.delete("/projects/{id}")
async def delete_project(
    id: UUID,
    user: User = Depends(get_current_user)
):
    project = await service.get(id)
    
    if project.owner_id != user.id and not user.is_admin:
        raise Forbidden()
    
    await service.delete(project)
\`\`\``,
};

export const bestPracticesOverview = bestPracticesMarkdown['best-practices-overview'];
