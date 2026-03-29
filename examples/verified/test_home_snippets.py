"""Smoke tests for home-page example modules (same deps as api-test-demo)."""

import pytest
from fastapi.testclient import TestClient
from httpx import ASGITransport, AsyncClient

from home_class_style import create_app as create_class_app
from home_function_style import create_app as create_fn_app


def test_function_style_route() -> None:
    client = TestClient(create_fn_app())
    response = client.get("/api/v1/users/42")
    assert response.status_code == 200
    assert response.json() == {"name": "demo-42"}


def test_class_style_route() -> None:
    client = TestClient(create_class_app())
    response = client.get("/api/v1/users/42")
    assert response.status_code == 200
    assert response.json() == {"name": "user-42"}


@pytest.mark.asyncio
async def test_class_style_async_client() -> None:
    app = create_class_app()
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/api/v1/users/1")
    assert response.status_code == 200
    assert response.json()["name"] == "user-1"
