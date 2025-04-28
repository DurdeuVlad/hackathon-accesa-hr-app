from pydantic import BaseModel


class CVMatchResult(BaseModel):
    industryScore: float
    techScore: float
    jdScore: float
    score: float
    explanation: str
    jobSummary: str
    candidateSummary: str
    idealProfile: list[str]