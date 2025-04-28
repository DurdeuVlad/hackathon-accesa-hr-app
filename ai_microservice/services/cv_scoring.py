# cvmatch_backend/scoring.py

import json
from models.cv_match_result import CVMatchResult
from models.job_posting import JobPosting
from services.gemini_api_wrapper import GeminiAPIWrapper
from .embedding_service import cosine_similarity

class CVScoring:
    def __init__(self,
                 gemini: GeminiAPIWrapper):
        self.gemini = gemini

    def calculate_score(self, cv_text: str, job: JobPosting) -> CVMatchResult:
        # 1) Normalize technical‐skill weights
        self._normalize_skills(job)

        # 2) get the LLM breakdown
        prompt = self.build_prompt(cv_text, job)
        candidates = self.gemini.send_message_with_json_response(prompt)
        if not candidates:
            raise RuntimeError("Gemini returned no data")

        # parse out the fields
        data = candidates
        industry_score = data["industryScore"]
        tech_score     = data["techScore"]
        llm_jd_score   = data["jdScore"]
        explanation    = data["explanation"]

        # 3) compute an embedding-based JD match (0.0–1.0 → 0–100)
        embed_sim   = cosine_similarity(job.description, cv_text)
        embed_score = embed_sim * 100.0

        # 4) blend the two JD scores
        blended_jd_score = (llm_jd_score + embed_score) / 2.0

        # 5) compute final
        final_score = (
            industry_score * 0.10 +
            tech_score     * 0.30 +
            blended_jd_score * 0.60
        )

        # 6) append a note about the embedding match
        full_explanation = (
            explanation
            + f"\nEmbedding JD-CV similarity: {embed_score:.2f}%"
            + f"\nBlended JD Match: {blended_jd_score:.2f}%"
        )

        return CVMatchResult(
            industryScore=industry_score,
            techScore=tech_score,
            jdScore=blended_jd_score,
            score=final_score,
            explanation=full_explanation,
            jobSummary=data.get("jobSummary", ""),
            candidateSummary=data.get("candidateSummary", ""),
            idealProfile=data.get("idealProfile", []),
        )

    def _normalize_skills(self, job: JobPosting):
        total = sum(job.technicalSkills.values()) or 1.0
        job.technicalSkills = {k: v / total for k, v in job.technicalSkills.items()}

    def build_prompt(self, cv: str, job: JobPosting) -> str:
        tech_json = json.dumps(job.technicalSkills)
        return (
            "You are an expert recruiter and resume evaluator. Your task is to score the candidate’s CV against the given job posting.\n\n"
            "Evaluation Criteria (with weights):\n"
            "- Industry Knowledge (10%)\n"
            "- Technical Skills (30%)\n"
            "- Job Description Match (60%)\n\n"
            "Scoring Guidelines:\n"
            "1) Industry Knowledge (10% of final):\n"
            "   0%   – No relevant industry experience\n"
            "   25%  – Peripheral experience\n"
            "   50%  – Some direct experience\n"
            "   75%  – Strong experience\n"
            "   100% – Extensive senior-level experience\n\n"
            "2) Technical Skills (30% of final):\n"
            "   For each required skill:\n"
            "     0%   – Not found\n"
            "     50%  – Partial or implied\n"
            "     100% – Explicit mention\n"
            "   Then compute weighted average.\n\n"
            "3) Job Description Match (60% of final):\n"
            "   a) Responsibilities Coverage (30%):\n"
            "      0%   – None\n"
            "      25%  – Few shallow mentions\n"
            "      50%  – Several with detail\n"
            "      75%  – Most well covered\n"
            "      100% – All thoroughly covered\n\n"
            "   b) Qualifications Coverage (30%):\n"
            "      0%   – None\n"
            "      25%  – Some mentioned\n"
            "      50%  – Several with detail\n"
            "      75%  – Most with examples\n"
            "      100% – All with strong examples\n\n"
            "   jdScore = (responsibilitiesCoverage * 0.5 + qualificationsCoverage * 0.5)\n\n"
            "COMPUTATION:\n"
            " finalScore = (industryScore * 0.10) + (techScore * 0.30) + (jdScore * 0.60)\n\n"
            "EXPLANATION:\n"
            " Provide a brief rationale for Industry, Tech, JD Match, and final score, each on its own line.\n\n"
            "ADDITIONAL TASKS:\n"
            " 1) Generate a concise **Job Summary** (2–3 sentences).\n"
            " 2) Generate a concise **Candidate Summary** (2–3 sentences).\n"
            " 3) Generate an **Ideal Candidate Profile**: 3–5 bullet points.\n\n"
            "OUTPUT REQUIREMENTS:\n"
            " Return ONLY a single RAW JSON object with these fields:\n"
            "{\n"
            "  \"industryScore\":…, \n"
            "  \"techScore\":…, \n"
            "  \"jdScore\":…, \n"
            "  \"score\":…, \n"
            "  \"explanation\":\"…\",\n"
            "  \"jobSummary\":\"…\",\n"
            "  \"candidateSummary\":\"…\",\n"
            "  \"idealProfile\": [\"…\", …]\n"
            "}\n\n"
            "HINT: Use 0/25/50/75/100 as base checkpoints.\n\n"
            f"Job Posting:\n Industry: {job.industry}\n Required Skills and Weights: {tech_json}\n Description: {job.description}\n\n"
            "Candidate CV:\n"
            f"{cv}\n\n"
            "TASK: Evaluate and PRODUCE THE JSON RESULT."
        )
