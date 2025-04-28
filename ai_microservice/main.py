# main.py
import os
from pathlib import Path

from dotenv import load_dotenv, find_dotenv
from fastapi import FastAPI

from models.cv_match_result import CVMatchResult
from models.match_request import MatchRequest
from services.cv_scoring import CVScoring
from services.gemini_api_wrapper import GeminiAPIWrapper

# 1) Find and load your .env automatically (searches upward from cwd)
load_dotenv(find_dotenv())

def create_app() -> FastAPI:
    # 2) Now that .env is loaded, read the key
    gemini_api_key = os.getenv("GEMINI_API_KEY")
    if not gemini_api_key:
        raise RuntimeError("GEMINI_API_KEY not set in environment")

    client = GeminiAPIWrapper(gemini_api_key)
    scorer = CVScoring(client)

    app = FastAPI()
    @app.post("/match_cv", response_model=CVMatchResult)
    def match_cv(request: MatchRequest):
        return scorer.calculate_score(request.cv_text, request.job)

    return app

# 3) Export app for Uvicorn, FastAPI, or TestClient
app = create_app()
