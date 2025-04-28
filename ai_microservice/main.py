import os
from dotenv import load_dotenv
from fastapi import FastAPI

from models.cv_match_result import CVMatchResult
from models.match_request import MatchRequest
from services.cv_scoring import CVScoring
from services.gemini_api_wrapper import GeminiAPIWrapper

# Load environment variables
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY not set in environment")





# FastAPI application
def create_app() -> FastAPI:
    app = FastAPI()
    client = GeminiAPIWrapper(GEMINI_API_KEY)
    scorer = CVScoring(client)

    @app.post("/match_cv", response_model=CVMatchResult)
    def match_cv(request: MatchRequest):
        return scorer.calculate_score(request.cv_text, request.job)

    return app

app = create_app()
