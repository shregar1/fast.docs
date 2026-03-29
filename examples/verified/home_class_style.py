"""Runnable FastAPI snippet: service + controller with Depends (home page, Classes tab)."""

from fastapi import APIRouter, Depends, FastAPI
from pydantic import BaseModel

router = APIRouter(prefix="/api/v1", tags=["users"])


class User(BaseModel):
    name: str


class UserService:
    async def get_user(self, user_id: str) -> User:
        return User(name=f"user-{user_id}")


class UserController:
    def __init__(self, service: UserService | None = None):
        self._service = service or UserService()

    async def get_user(self, user_id: str) -> User:
        return await self._service.get_user(user_id)


def get_controller() -> UserController:
    return UserController()


@router.get("/users/{user_id}", response_model=User)
async def get_user(user_id: str, ctrl: UserController = Depends(get_controller)) -> User:
    return await ctrl.get_user(user_id)


def create_app() -> FastAPI:
    app = FastAPI()
    app.include_router(router)
    return app


app = create_app()
