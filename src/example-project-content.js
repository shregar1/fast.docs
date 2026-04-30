/**
 * Example Projects - Real-world applications
 * 
 * Complete e-commerce and blog examples that demonstrate best practices.
 */

export const exampleProjectMarkdown = {
  'example-ecommerce': `
# 🛒 Example: E-Commerce API

A complete e-commerce API built with FastX, demonstrating:
- User authentication & authorization
- Product catalog with categories
- Shopping cart management
- Order processing with payment integration
- Inventory management

## Project Structure

\`\`\`
ecommerce/
├── main.py                  # Application entry point
├── config.py               # Configuration
├── requirements.txt        # Dependencies
├── controllers/
│   ├── __init__.py
│   ├── auth_controller.py      # Login, register, JWT
│   ├── product_controller.py   # Products, categories
│   ├── cart_controller.py      # Shopping cart
│   ├── order_controller.py     # Orders, checkout
│   └── user_controller.py      # User profile
├── services/
│   ├── __init__.py
│   ├── auth_service.py
│   ├── product_service.py
│   ├── cart_service.py
│   ├── order_service.py
│   ├── payment_service.py      # Stripe/PayPal integration
│   └── inventory_service.py    # Stock management
├── repositories/
│   ├── __init__.py
│   ├── user_repository.py
│   ├── product_repository.py
│   ├── category_repository.py
│   ├── cart_repository.py
│   └── order_repository.py
├── models/
│   ├── __init__.py
│   ├── user.py
│   ├── product.py
│   ├── category.py
│   ├── cart.py
│   ├── order.py
│   └── payment.py
├── dtos/
│   ├── __init__.py
│   ├── user_dto.py
│   ├── product_dto.py
│   ├── cart_dto.py
│   └── order_dto.py
├── middleware/
│   ├── __init__.py
│   └── auth_middleware.py
└── tests/
    └── ...
\`\`\`

## Key Features

### 1. User Authentication
\`\`\`python
# controllers/auth_controller.py
from fastx_mvc import IController
from services.auth_service import AuthService
from dtos.user_dto import UserLogin, UserRegister, TokenResponse

class AuthController(IController):
    def __init__(self, auth_service: AuthService):
        self.auth_service = auth_service
    
    async def register(self, user: UserRegister) -> TokenResponse:
        """Register a new user."""
        return await self.auth_service.register(user)
    
    async def login(self, credentials: UserLogin) -> TokenResponse:
        """Login and get JWT token."""
        return await self.auth_service.login(credentials)
    
    async def refresh_token(self, refresh_token: str) -> TokenResponse:
        """Refresh access token."""
        return await self.auth_service.refresh_token(refresh_token)
\`\`\`

### 2. Product Management
\`\`\`python
# services/product_service.py
from typing import List, Optional
from fastx_mvc import IService
from repositories.product_repository import ProductRepository
from dtos.product_dto import ProductCreate, ProductResponse

class ProductService(IService):
    def __init__(self, repository: ProductRepository):
        super().__init__()
        self.repository = repository
    
    async def create_product(self, product: ProductCreate) -> ProductResponse:
        # Validate category exists
        if not await self.repository.category_exists(product.category_id):
            raise ValueError("Category not found")
        
        # Check for duplicate SKU
        if await self.repository.get_by_sku(product.sku):
            raise ValueError("SKU already exists")
        
        return await self.repository.create(product)
    
    async def search_products(
        self,
        query: str,
        category: Optional[str] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        sort_by: str = "created_at"
    ) -> List[ProductResponse]:
        return await self.repository.search(
            query=query,
            category=category,
            price_range=(min_price, max_price),
            sort_by=sort_by
        )
    
    async def get_product_details(self, product_id: int) -> ProductResponse:
        product = await self.repository.get_by_id(product_id)
        if not product:
            raise ValueError("Product not found")
        return product
\`\`\`

### 3. Shopping Cart
\`\`\`python
# services/cart_service.py
from fastx_mvc import IService
from repositories.cart_repository import CartRepository
from repositories.product_repository import ProductRepository
from dtos.cart_dto import CartItemCreate, CartResponse

class CartService(IService):
    def __init__(
        self,
        cart_repository: CartRepository,
        product_repository: ProductRepository
    ):
        super().__init__()
        self.cart_repo = cart_repository
        self.product_repo = product_repository
    
    async def add_to_cart(self, user_id: int, item: CartItemCreate) -> CartResponse:
        # Validate product exists and has stock
        product = await self.product_repo.get_by_id(item.product_id)
        if not product:
            raise ValueError("Product not found")
        if product.stock < item.quantity:
            raise ValueError("Insufficient stock")
        
        # Add to cart
        cart = await self.cart_repo.get_or_create(user_id)
        cart.add_item(item)
        
        # Calculate totals
        cart.calculate_totals()
        
        await self.cart_repo.save(cart)
        return CartResponse.from_cart(cart)
    
    async def apply_discount(self, user_id: int, coupon_code: str) -> CartResponse:
        cart = await self.cart_repo.get_by_user(user_id)
        
        # Validate coupon
        discount = await self.validate_coupon(coupon_code, cart)
        
        cart.apply_discount(discount)
        await self.cart_repo.save(cart)
        
        return CartResponse.from_cart(cart)
\`\`\`

### 4. Order Processing
\`\`\`python
# services/order_service.py
from fastx_mvc import IService
from datetime import datetime

class OrderService(IService):
    def __init__(
        self,
        order_repository: OrderRepository,
        cart_repository: CartRepository,
        inventory_service: InventoryService,
        payment_service: PaymentService
    ):
        super().__init__()
        self.order_repo = order_repository
        self.cart_repo = cart_repository
        self.inventory = inventory_service
        self.payment = payment_service
    
    async def create_order(self, user_id: int, shipping_address: Address) -> Order:
        # Get cart
        cart = await self.cart_repo.get_by_user(user_id)
        if not cart or cart.is_empty():
            raise ValueError("Cart is empty")
        
        # Verify stock availability
        for item in cart.items:
            if not await self.inventory.check_availability(
                item.product_id, 
                item.quantity
            ):
                raise ValueError(f"Product {item.product_id} out of stock")
        
        # Create order
        order = Order(
            user_id=user_id,
            items=cart.items,
            total=cart.total,
            shipping_address=shipping_address,
            status="pending"
        )
        
        # Reserve inventory
        for item in cart.items:
            await self.inventory.reserve(item.product_id, item.quantity)
        
        # Save order
        order = await self.order_repo.create(order)
        
        # Clear cart
        await self.cart_repo.clear(user_id)
        
        return order
    
    async def process_payment(self, order_id: int, payment_method: PaymentMethod):
        order = await self.order_repo.get_by_id(order_id)
        
        try:
            # Process payment
            payment_result = await self.payment.process(
                amount=order.total,
                currency="USD",
                method=payment_method
            )
            
            if payment_result.success:
                order.status = "paid"
                order.payment_id = payment_result.transaction_id
                
                # Deduct inventory
                for item in order.items:
                    await self.inventory.deduct(item.product_id, item.quantity)
            else:
                order.status = "payment_failed"
                # Release inventory reservation
                for item in order.items:
                    await self.inventory.release(item.product_id, item.quantity)
            
            await self.order_repo.save(order)
            return order
            
        except Exception as e:
            self.logger.error(f"Payment failed for order {order_id}: {e}")
            order.status = "payment_error"
            await self.order_repo.save(order)
            raise
\`\`\`

## Running the Example

\`\`\`bash
# Clone the example
git clone https://github.com/fastmvc/examples
cd examples/ecommerce

# Install dependencies
pip install -r requirements.txt

# Set up database
alembic upgrade head

# Seed sample data
python scripts/seed.py

# Run the API
python main.py
\`\`\`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/register | Register new user |
| POST | /auth/login | Login user |
| GET | /products | List products |
| GET | /products/{id} | Get product details |
| POST | /cart/items | Add to cart |
| GET | /cart | View cart |
| POST | /orders | Create order |
| POST | /orders/{id}/pay | Process payment |

## Try It Online

[Live Demo](https://ecommerce-demo.fastmvc.io) | [Source Code](https://github.com/fastmvc/examples/ecommerce)

---
`,

  'example-blog': `
# 📝 Example: Blog API

A complete blog API built with FastX, featuring:
- User authentication & roles (admin, author, reader)
- Rich text content management
- Comments & moderation
- Tags & categories
- Search functionality
- RSS feeds

## Project Structure

\`\`\`
blog/
├── main.py
├── config/
│   └── settings.py
├── controllers/
│   ├── auth_controller.py
│   ├── post_controller.py
│   ├── comment_controller.py
│   ├── tag_controller.py
│   └── feed_controller.py
├── services/
│   ├── auth_service.py
│   ├── post_service.py
│   ├── comment_service.py
│   ├── search_service.py       # Full-text search
│   └── feed_service.py         # RSS/Atom generation
├── repositories/
│   ├── user_repository.py
│   ├── post_repository.py
│   ├── comment_repository.py
│   └── tag_repository.py
├── models/
│   ├── user.py
│   ├── post.py
│   ├── comment.py
│   └── tag.py
└── dtos/
    ├── user_dto.py
    ├── post_dto.py
    └── comment_dto.py
\`\`\`

## Key Features

### Rich Content Management
\`\`\`python
# services/post_service.py
from fastx_mvc import IService
from dtos.post_dto import PostCreate, PostResponse

class PostService(IService):
    def __init__(self, repository: PostRepository):
        super().__init__()
        self.repository = repository
    
    async def create_post(
        self, 
        author_id: int, 
        post: PostCreate
    ) -> PostResponse:
        # Generate slug from title
        slug = self.generate_slug(post.title)
        
        # Process content (markdown → HTML)
        html_content = self.render_markdown(post.content)
        
        # Extract excerpt
        excerpt = self.generate_excerpt(post.content, max_length=200)
        
        # Process tags
        tag_ids = await self.process_tags(post.tags)
        
        post_entity = Post(
            title=post.title,
            slug=slug,
            content=post.content,
            html_content=html_content,
            excerpt=excerpt,
            author_id=author_id,
            tag_ids=tag_ids,
            status="draft" if post.is_draft else "published",
            published_at=datetime.now() if not post.is_draft else None
        )
        
        return await self.repository.create(post_entity)
    
    async def search_posts(
        self, 
        query: str,
        tags: List[str] = None,
        author: str = None
    ) -> List[PostResponse]:
        # Full-text search
        return await self.repository.search(
            query=query,
            filters={
                "tags": tags,
                "author": author,
                "status": "published"
            }
        )
    
    def generate_slug(self, title: str) -> str:
        return slugify(title, max_length=100)
\`\`\`

### Comment System with Moderation
\`\`\`python
# services/comment_service.py
class CommentService(IService):
    async def add_comment(
        self,
        post_id: int,
        user_id: int,
        comment: CommentCreate
    ) -> CommentResponse:
        # Check if post allows comments
        post = await self.post_repo.get_by_id(post_id)
        if not post or not post.allow_comments:
            raise ValueError("Comments not allowed")
        
        # Spam detection
        spam_score = await self.spam_detector.check(comment.content)
        
        comment_entity = Comment(
            post_id=post_id,
            author_id=user_id,
            content=comment.content,
            parent_id=comment.parent_id,  # For threaded comments
            status="pending" if spam_score > 0.5 else "approved",
            spam_score=spam_score
        )
        
        return await self.repository.create(comment_entity)
    
    async def moderate_comment(
        self,
        comment_id: int,
        action: str,  # "approve", "reject", "spam"
        moderator_id: int
    ):
        comment = await self.repository.get_by_id(comment_id)
        
        if action == "approve":
            comment.status = "approved"
        elif action == "reject":
            comment.status = "rejected"
        elif action == "spam":
            comment.status = "spam"
            await self.spam_detector.report(comment.content)
        
        comment.moderated_by = moderator_id
        comment.moderated_at = datetime.now()
        
        await self.repository.save(comment)
\`\`\`

### RSS Feed Generation
\`\`\`python
# services/feed_service.py
from fastx_mvc import IService
from xml.etree.ElementTree import Element, SubElement, tostring

class FeedService(IService):
    def __init__(self, post_repository: PostRepository):
        self.post_repo = post_repository
    
    async def generate_rss(self, limit: int = 20) -> str:
        posts = await self.post_repo.get_recent_published(limit)
        
        rss = Element("rss", version="2.0")
        channel = SubElement(rss, "channel")
        
        SubElement(channel, "title").text = "My Blog"
        SubElement(channel, "link").text = "https://myblog.com"
        SubElement(channel, "description").text = "Latest posts"
        
        for post in posts:
            item = SubElement(channel, "item")
            SubElement(item, "title").text = post.title
            SubElement(item, "link").text = f"https://myblog.com/{post.slug}"
            SubElement(item, "pubDate").text = post.published_at.strftime(
                "%a, %d %b %Y %H:%M:%S GMT"
            )
            SubElement(item, "guid").text = str(post.id)
            SubElement(item, "description").text = post.excerpt
        
        return tostring(rss, encoding="unicode")
\`\`\`

## Try It Online

[Live Demo](https://blog-demo.fastmvc.io) | [Source Code](https://github.com/fastmvc/examples/blog)

## Next Steps

- [Build Your Own Blog](/tutorial-blog)
- [Add Authentication](/tutorial-authentication)
- [Deploy to Production](/tutorial-deployment)
`
};
