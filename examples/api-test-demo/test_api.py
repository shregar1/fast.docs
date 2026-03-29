"""Pytest suite: sync TestClient + async httpx against the same ASGI app."""

import pytest
from fastapi.testclient import TestClient
from httpx import ASGITransport, AsyncClient

from app import create_app


@pytest.fixture
def app():
    return create_app()


@pytest.fixture
def client(app):
    return TestClient(app)


def test_health_sync(client: TestClient) -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_items_uses_dependency(client: TestClient) -> None:
    response = client.get("/api/v1/items")
    assert response.status_code == 200
    body = response.json()
    assert body["env"] == "test"
    assert len(body["items"]) == 1


@pytest.mark.asyncio
async def test_items_async(app) -> None:
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/api/v1/items")
    assert response.status_code == 200
    assert response.json()["env"] == "test"
