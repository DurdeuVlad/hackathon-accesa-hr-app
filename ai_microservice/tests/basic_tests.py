import os
from dotenv import load_dotenv, find_dotenv
from unittest.mock import Mock
import pytest
from fastapi.testclient import TestClient

# Ensure real GEMINI_API_KEY is loaded for tests
load_dotenv(find_dotenv())

# Real cosine from embedding_service
from services.embedding_service import cosine_similarity as real_cosine_similarity

# Dummy job for CVScoring
class DummyJob:
    def __init__(self, industry, technicalSkills, description):
        self.industry = industry
        self.technicalSkills = technicalSkills
        self.description = description

# ----------------
# UNIT TESTS: CVScoring
# ----------------

def test_cv_scoring_unit():
    """Unit test CVScoring with real cosine_similarity and mocked Gemini."""
    from services.cv_scoring import CVScoring

    # Mock Gemini API
    mock_gemini = Mock()
    mock_gemini.send_message_with_json_response.return_value = {
        "industryScore": 75,
        "techScore": 80,
        "jdScore": 85,
        "explanation": "Good match overall.",
        "jobSummary": "Job summary.",
        "candidateSummary": "Candidate summary.",
        "idealProfile": ["Skill 1", "Skill 2"]
    }

    # Instantiate with only Gemini client
    scorer = CVScoring(mock_gemini)

    job = DummyJob(
        industry="Software",
        technicalSkills={"Python": 1, "AWS": 1},
        description="Looking for Python developer with AWS experience."
    )
    cv_text = "CV content with Python and AWS."
    result = scorer.calculate_score(cv_text, job)

    # Validate scores from mocked data
    assert result.industryScore == 75
    assert result.techScore == 80

    # Compute expected embedding line using real cosine_similarity
    embed_val = real_cosine_similarity(job.description, cv_text) * 100
    expected_line = f"Embedding JD-CV similarity: {embed_val:.2f}%"
    assert expected_line in result.explanation

# ----------------
# UNIT TESTS: GeminiAPIWrapper
# ----------------

def test_gemini_api_wrapper_send_message_unit():
    from services.gemini_api_wrapper import GeminiAPIWrapper
    from unittest.mock import patch

    with patch("services.gemini_api_wrapper.gemini_api") as mock_api:
        mock_model = Mock()
        mock_model.generate_content.return_value.text = '{"key": "value"}'
        mock_api.GenerativeModel.return_value = mock_model

        wrapper = GeminiAPIWrapper("fake-api-key")
        result = wrapper.send_message("Hello")
        assert '{"key": "value"}' in result


def test_gemini_api_wrapper_invalid_json_handling():
    from services.gemini_api_wrapper import GeminiAPIWrapper
    from unittest.mock import patch

    with patch("services.gemini_api_wrapper.gemini_api") as mock_api:
        mock_model = Mock()
        mock_model.generate_content.return_value.text = "Not JSON"
        mock_api.GenerativeModel.return_value = mock_model

        wrapper = GeminiAPIWrapper("fake-api-key")
        output = wrapper.send_message_with_json_response("req")
        assert isinstance(output, dict)

# ----------------
# INTEGRATION TESTS: CVScoring + FastAPI
# ----------------

def test_cv_scoring_integration():
    from services.cv_scoring import CVScoring

    # Mock Gemini API
    mock_gemini = Mock()
    mock_gemini.send_message_with_json_response.return_value = {
        "industryScore": 90,
        "techScore": 85,
        "jdScore": 80,
        "explanation": "Strong profile.",
        "jobSummary": "Summary.",
        "candidateSummary": "Summary.",
        "idealProfile": ["Python", "AWS"]
    }

    scorer = CVScoring(mock_gemini)

    job = DummyJob(
        industry="Software",
        technicalSkills={"Python": 1, "AWS": 1},
        description="Developer with cloud experience"
    )
    cv_text = "Experience with Python and AWS."
    result = scorer.calculate_score(cv_text, job)

    # Check final score calculation
    embed_val = real_cosine_similarity(job.description, cv_text) * 100
    blended = (80 + embed_val) / 2
    expected_score = 90 * 0.1 + 85 * 0.3 + blended * 0.6
    assert result.score == pytest.approx(expected_score)

    expected_line = f"Embedding JD-CV similarity: {embed_val:.2f}%"
    assert expected_line in result.explanation


def test_api_match_cv_endpoint():
    from main import app
    from unittest.mock import patch
    client = TestClient(app)

    example = type("CR", (), {
        "industryScore": 80,
        "techScore": 85,
        "jdScore": 90,
        "score": 87,
        "explanation": "Great match!",
        "jobSummary": "Job summary.",
        "candidateSummary": "Candidate summary.",
        "idealProfile": ["Skill 1", "Skill 2"]
    })()

    with patch("services.cv_scoring.CVScoring.calculate_score", return_value=example):
        payload = {
            "cvText": "Experienced software engineer.",
            "job": {"industry": "Software", "technicalSkills": {"Python":1.0}, "description":"Desc"}
        }
        resp = client.post("/match_cv", json=payload)
        assert resp.status_code == 200
        data = resp.json()
        assert data["score"] == 87
        assert "Great match!" in data["explanation"]
