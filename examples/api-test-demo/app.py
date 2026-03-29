"""Minimal FastAPI app: router, dependency, health — used by tests in this folder."""

from fastapi import APIRouter, Depends, FastAPI

router = APIRouter(prefix="/api/v1", tags=["items"])


def get_settings() -> dict[str, str]:
    return {"env": "test"}


@router.get("/items")
async def list_items(settings: dict[str, str] = Depends(get_settings)) -> dict:
    return {"items": [{"id": 1, "name": "a"}], "env": settings["env"]}


def create_app() -> FastAPI:
    app = FastAPI()
    app.include_router(router)

    @app.get("/health")
    async def health() -> dict[str, str]:
        return {"status": "ok"}

    return app


app = create_app()
