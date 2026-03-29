"""Runnable FastAPI snippet: function-style route with Depends (home page, Functions tab)."""

from fastapi import APIRouter, Depends, FastAPI
from pydantic import BaseModel

router = APIRouter(prefix="/api/v1", tags=["users"])


class User(BaseModel):
    name: str


def get_tenant() -> str:
    return "demo"


@router.get("/users/{user_id}", response_model=User)
async def get_user(user_id: str, tenant: str = Depends(get_tenant)) -> User:
    return User(name=f"{tenant}-{user_id}")


def create_app() -> FastAPI:
    app = FastAPI()
    app.include_router(router)
    return app


app = create_app()
