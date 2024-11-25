# -*- coding: utf-8 -*-

import logging
import time
from typing import List, Union, Annotated
import jwt

from fastapi import (
    FastAPI,
    Header,
    WebSocket,
    WebSocketDisconnect,
)
from fastapi.middleware.cors import CORSMiddleware
from pydantic import AnyHttpUrl
from pydantic_settings import BaseSettings, SettingsConfigDict
from starlette.middleware.sessions import SessionMiddleware
from sample import SAMPLE_RESPONSE



class Settings(BaseSettings):
    BACKEND_CORS_ORIGINS: List[Union[str, AnyHttpUrl]] = [
        "http://localhost:8000",
        "http://localhost:8005",
    ]
    TENANT_NAME: str = ""
    APP_CLIENT_ID: str = ""
    OPENAPI_CLIENT_ID: str = ""
    AUTH_POLICY_NAME: str = ""
    SCOPE_DESCRIPTION: str = "user_impersonation"
    CERNER_CLIENT_ID: str = ""
    CERNER_CLIENT_SECRET: str = ""
    JWT_SECRET: str = ""
    JWT_ALGORITHM: str = "HS256"
    MIDDLEWARE_SECRET: str = ""

    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", case_sensitive=True, extra="allow"
    )


settings = Settings()


app = FastAPI()

app.add_middleware(SessionMiddleware, secret_key=settings.MIDDLEWARE_SECRET)

if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


async def get_user_from_token(
    token: Annotated[str, Header()]
) -> str:
    try:
        payload = jwt.decode(
            token.strip(), settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM]
        )
        return payload.get("sub")
    except:
        return None


@app.websocket("/ws/distill")
async def ws_distill(
    websocket: WebSocket,
):
    await websocket.accept()
    try:
        token = await websocket.receive_text()
        if await get_user_from_token(token) is not None:
            while True:
                data = await websocket.receive_json()
                for i, _ in enumerate(data["rows"]):
                    # Fake delay
                    time.sleep(1)
                    await websocket.send_json({"progress": (i + 1) / len(data["rows"])})
                res = SAMPLE_RESPONSE
                await websocket.send_json(res)
        else:
            await websocket.close()
    except WebSocketDisconnect:
        pass



if __name__ == "__main__":
    import uvicorn

    logging.basicConfig(level=logging.DEBUG)
    uvicorn.run(app, host="localhost", port=3000)