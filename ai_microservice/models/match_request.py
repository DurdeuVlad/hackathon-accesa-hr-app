from pydantic import BaseModel, Field

from models.job_posting import JobPosting


class MatchRequest(BaseModel):
    cv_text: str = Field(..., alias="cvText")
    job: JobPosting