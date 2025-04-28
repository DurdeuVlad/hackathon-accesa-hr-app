# Pydantic models
from pydantic import BaseModel, Field

class JobPosting(BaseModel):
    industry: str
    technical_skills: dict[str, float] = Field(..., alias="technicalSkills")
    description: str
