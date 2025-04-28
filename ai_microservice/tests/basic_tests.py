"""
Live-Gemini test-suite: **no mocks**.
The tests are auto-skipped when GEMINI_API_KEY is not present.
"""

import os, math, pytest
from dotenv import load_dotenv, find_dotenv
from fastapi.testclient import TestClient

from models.job_posting import JobPosting

load_dotenv(find_dotenv())
API_KEY = os.getenv("GEMINI_API_KEY")

skip_no_key = pytest.mark.skipif(
    not API_KEY, reason="GEMINI_API_KEY not configured – live-Gemini tests skipped"
)

# ── project imports ─────────────────────────────────────────────────────
from services.gemini_api_wrapper import GeminiAPIWrapper, get_embedding
from services.cv_scoring          import CVScoring
from services.embedding_service   import cosine_similarity
# ────────────────────────────────────────────────────────────────────────


class DummyJob:
    """Minimal stand-in for models.JobPosting (camelCase to match CVScoring)."""
    def __init__(self, industry, technicalSkills, description):
        self.industry = industry
        self.technicalSkills = technicalSkills
        self.description = description


# ────────────────── 1. SDK smoke-test ───────────────────────────────────
@skip_no_key
def test_wrapper_roundtrip_ok():
    """Simple ‘OK’ round-trip proves the model is reachable."""
    wrapper = GeminiAPIWrapper(API_KEY)
    reply   = wrapper.send_message("Respond with the single word OK.")
    assert reply.strip().upper().startswith("OK")


# ────────────────── 2. CVScoring stand-alone ────────────────────────────
@skip_no_key
def test_cv_scoring_unit_real():
    """End-to-end CVScoring using live Gemini + real embeddings."""
    wrap   = GeminiAPIWrapper(API_KEY)
    scorer = CVScoring(wrap)

    job = JobPosting()
    job.industry = "Software"
    job.technical_skills = {"Python": 1.0, "AWS": 1.0}
    job.description = "Developer with cloud experience"
    # DummyJob is a stand-in for models.JobPosting
    cv_text = "CV content with Python and AWS."

    result = scorer.calculate_score(cv_text, job)

    # 0-100 sanity for all numeric fields
    for field in ("industryScore", "techScore", "jdScore", "score"):
        val = getattr(result, field)
        assert 0 <= val <= 100, f"{field} out of range: {val}"

    # Explanation line should contain EXACT embedding % the scorer used
    emb_job = get_embedding(job.description)
    emb_cv  = get_embedding(cv_text)
    embed_pct = cosine_similarity(emb_job, emb_cv) * 100
    assert f"Embedding JD-CV similarity: {embed_pct:.2f}%" in result.explanation

    # Internal-math check: final score must equal the documented formula
    expected = (
        result.industryScore * 0.10
        + result.techScore   * 0.30
        + result.jdScore     * 0.60
    )
    assert math.isclose(result.score, expected)


# ────────────────── 3. FastAPI integration ──────────────────────────────
@skip_no_key
def test_api_match_cv_endpoint_live():
    """Hits /match_cv for the full stack (router ➜ CVScoring ➜ Gemini)."""
    from main import app   # ensure the FastAPI app is imported *after* env-vars
    client = TestClient(app)

    payload = {
        "cvText": "Experienced software engineer skilled in Python and AWS.",
        "job": {
            # ⚠ keep camelCase → matches CVScoring implementation
            "industry": "Software",
            "technicalSkills": {"Python": 1.0, "AWS": 1.0},
            "description": "Developer with cloud experience"
        }
    }

    resp = client.post("/match_cv", json=payload)
    assert resp.status_code == 200
    data = resp.json()

    # structural sanity
    for key in (
        "industryScore", "techScore", "jdScore",
        "score", "explanation", "jobSummary",
        "candidateSummary", "idealProfile"
    ):
        assert key in data, f"missing {key}"

    # ranges
    for k in ("industryScore", "techScore", "jdScore", "score"):
        assert 0 <= data[k] <= 100

    # internal-math consistency
    expected = (
        data["industryScore"] * 0.10
        + data["techScore"]   * 0.30
        + data["jdScore"]     * 0.60
    )
    assert math.isclose(data["score"], expected)

    # embed line present
    assert "Embedding JD-CV similarity:" in data["explanation"]
