/**
 * Simplified Guide - Making Abstractions Optional
 * 
 * Shows how to use FastX with minimal boilerplate.
 */

export const simplifiedGuideMarkdown = {
  'simplified-guide': `
# 🪶 Simplified FastX

FastX is designed to be **progressive** - use only what you need. Start simple and add abstractions as your project grows.

## Three Levels of Usage

### Level 1: Minimal (No Abstractions)

Just use FastAPI with FastX's utilities and auto-generated docs.

\`\`\`python
# main.py
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

app = FastAPI()

class Item(BaseModel):
    id: int
    name: str
    price: float

items = []

@app.get("/items", response_model=List[Item])
async def list_items():
    return items

@app.post("/items", response_model=Item)
async def create_item(item: Item):
    items.append(item)
    return item

@app.get("/items/{item_id}", response_model=Item)
async def get_item(item_id: int):
    for item in items:
        if item.id == item_id:
            return item
    raise HTTPException(status_code=404, detail="Item not found")
\`\`\`

**When to use:** Prototypes, simple APIs, learning FastAPI patterns.

---

### Level 2: Service Layer Only

Add business logic separation without full MVC.

\`\`\`python
# services/item_service.py
class ItemService:
    """Simple service without IService inheritance."""
    
    def __init__(self):
        self.items = []
        self.counter = 0
    
    def create(self, name: str, price: float):
        self.counter += 1
        item = {"id": self.counter, "name": name, "price": price}
        self.items.append(item)
        return item
    
    def get_all(self):
        return self.items
    
    def get_by_id(self, item_id: int):
        for item in self.items:
            if item["id"] == item_id:
                return item
        return None

# main.py
from fastapi import FastAPI, Depends
from services.item_service import ItemService

app = FastAPI()

# Simple dependency injection
def get_item_service():
    return ItemService()

@app.get("/items")
async def list_items(service: ItemService = Depends(get_item_service)):
    return service.get_all()

@app.post("/items")
async def create_item(
    name: str,
    price: float,
    service: ItemService = Depends(get_item_service)
):
    return service.create(name, price)
\`\`\`

**When to use:** Small to medium projects, business logic that needs testing.

---

### Level 3: Full MVC (All Abstractions)

Use the complete FastX stack with proper separation.

\`\`\`python
# Full example from Quickstart Guide
from fastx_mvc import FastX, IController, IService, IRepository
# ... full implementation
\`\`\`

**When to use:** Enterprise apps, large teams, complex business logic.

---

## Picking Your Level

| Project Size | Recommended Level |
|--------------|-------------------|
| Prototype / MVP | Level 1 (Minimal) |
| Small API (< 10 endpoints) | Level 1-2 |
| Medium API (10-50 endpoints) | Level 2-3 |
| Large API (50+ endpoints) | Level 3 (Full MVC) |
| Team of 1-2 developers | Level 1-2 |
| Team of 3+ developers | Level 2-3 |

---

## Gradual Adoption

You can **start simple and migrate** as needed:

### Step 1: Start with FastAPI

\`\`\`python
@app.post("/orders")
async def create_order(order: OrderCreate):
    # All logic inline
    if order.total < 0:
        raise HTTPException(status_code=400, detail="Invalid total")
    
    db_order = Order(**order.dict())
    db.add(db_order)
    db.commit()
    
    return db_order
\`\`\`

### Step 2: Extract Business Logic

\`\`\`python
# Extract validation to service
class OrderService:
    def validate_order(self, order: OrderCreate):
        if order.total < 0:
            raise ValueError("Invalid total")

@app.post("/orders")
async def create_order(
    order: OrderCreate,
    service: OrderService = Depends(get_order_service)
):
    service.validate_order(order)
    # ... rest of logic
\`\`\`

### Step 3: Add Full MVC

\`\`\`python
class OrderService(IService):
    def create(self, order: OrderCreate) -> Order:
        # Full business logic
        pass

class OrderController(IController):
    async def create(self, order: OrderCreate) -> OrderResponse:
        return await self.service.create(order)
\`\`\`

---

## Optional Features

### Skip Repository Pattern

For simple CRUD, use SQLAlchemy directly in services:

\`\`\`python
class ProductService:
    def __init__(self, db: Session):
        self.db = db
    
    def get_by_id(self, product_id: int):
        # Direct DB access, no repository
        return self.db.query(Product).filter(Product.id == product_id).first()
\`\`\`

### Skip Service Layer

For read-only endpoints, go straight from controller to repository:

\`\`\`python
class ProductController(IController):
    def __init__(self, repository: ProductRepository):
        self.repo = repository
    
    async def get(self, product_id: int):
        # Direct repository access
        return await self.repo.get_by_id(product_id)
\`\`\`

### Skip Context Tracking

Don't need request tracing? Disable it:

\`\`\`python
# config.py
ENABLE_REQUEST_TRACING = False
\`\`\`

---

## Minimal FastX Template

Here's the absolute minimum to get started:

\`\`\`python
# main.py
from fastx_mvc import FastX
from pydantic import BaseModel

app = FastX()

class Item(BaseModel):
    name: str

@app.post("/items")
async def create(item: Item):
    return {"created": item.name}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
\`\`\`

**That's it!** FastX works with plain FastAPI patterns. Add abstractions only when you need them.

---

## Feature Toggle Matrix

| Feature | Optional? | How to Disable |
|---------|-----------|----------------|
| Repository pattern | ✅ Yes | Use services directly |
| Service layer | ✅ Yes | Use controllers directly |
| Context tracking | ✅ Yes | \`ENABLE_REQUEST_TRACING=False\` |
| Auto-generated docs | ✅ Yes | Standard FastAPI config |
| Dependency injection | ✅ Yes | Use FastAPI's \`Depends\` |
| Middleware stack | ✅ Yes | Don't register middlewares |
| Request logging | ✅ Yes | Configure log level |
| Validation | ❌ No | Core feature |
| Type hints | ❌ No | Core feature |

---

## Quick Decision Tree

\`\`\`
Is this a quick prototype?
├── Yes → Use Level 1 (Plain FastAPI)
└── No → Is it a solo project?
    ├── Yes → Use Level 2 (Services)
    └── No → Use Level 3 (Full MVC)
\`\`\`

Remember: **You can always refactor later.** Start simple and add structure as your needs grow.
`
};
