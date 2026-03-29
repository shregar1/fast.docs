"""Runnable FastAPI snippet: class-based handler via add_api_route (home page, Classes tab)."""

from fastapi import APIRouter, FastAPI
from pydantic import BaseModel

router = APIRouter(prefix="/api/v1", tags=["users"])


class User(BaseModel):
    name: str


class UserService:
    async def get_user(self, user_id: str) -> User:
        return User(name=f"user-{user_id}")


class FetchUserController:
    def __init__(self, service: UserService | None = None):
        self._service = service or UserService()

    async def get(self, user_id: str) -> User:
        return await self._service.get_user(user_id)


_fetch = FetchUserController()
# Programmatic registration: bind the controller instance method as the HTTP handler.
router.add_api_route(
    "/users/{user_id}",
    _fetch.get,
    methods=["GET"],
    response_model=User,
)


def create_app() -> FastAPI:
    app = FastAPI()
    app.include_router(router)
    return app


app = create_app()
