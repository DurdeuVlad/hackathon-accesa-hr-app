# API Reference

All endpoints live under your backend’s base URL.

---

## Endpoints

| Method | Path                      | Description                                                                               |
| ------ | ------------------------- | ----------------------------------------------------------------------------------------- |
| `GET`  | `/ping`                   | Health check (returns "pong").                                                           |
| `POST` | `/processcv`              | Process an uploaded CV against a job posting.                                             |
|        |                           | **Params:** `jobId` (query), `file` (multipart).                                          |
| `GET`  | `/cvs/user/{userId}`      | List all CVs uploaded by a specific user.                                                 |
| `POST` | `/scorecvs`               | Score a CV vs. a job and save both CV→Job and Job→CV matches.                             |
|        |                           | **Params:** `jobId`, `cvId` (query); body: raw `cvText`.                                  |
| `POST` | `/searchjobsforcv/find`   | Find matching jobs for an uploaded CV.                                                    |
|        |                           | **Params:** `file` (multipart).                                                           |
| `GET`  | `/statistics`             | Compute and return global statistics on users, CVs, jobs, and match scores.               |

---

## Response Structures

### `GET /ping`
- **200 OK**
```txt
pong
```

---

### `POST /processcv`
- **200 OK**
```json
"✅ CV processed. Score: <number>"
```
- **500 Internal Server Error**
```json
{
  "success": false,
  "error": "Failed to process CV",
  "details": "<error message>"
}
```

---

### `GET /cvs/user/{userId}`
- **200 OK**
```json
[
  {
    "id": "cvId",
    "userId": "userId",
    "fileName": "john_smith_cv.pdf",
    "contentText": "...parsed CV content...",
    "uploadedAt": "2025-04-22T14:35:00Z",
    "industryTags": ["banking", "finance"],
    "techSkills": ["Java", "Spring"]
  }
]
```
- **500 Internal Server Error**
```json
[]
```

---

### `POST /scorecvs`
- **200 OK**
```json
{
  "fileName": "cvId",
  "score": 95.0,
  "industryScore": 10.0,
  "techScore": 30.0,
  "jdScore": 55.0,
  "explanation": "Reasoning...",
  "uploadedAt": "2025-04-22T14:40:00Z"
}
```
- **500 Internal Server Error**
```json
"<error message>"
```

---

### `POST /searchjobsforcv/find`
- **200 OK**
```json
[
  {
    "jobTitle": "Software Engineer",
    "industry": "banking",
    "matchScore": 85.0,
    "explanation": "Reasoning..."
  }
]
```
- **500 Internal Server Error**
```json
"<error message>"
```

---

### `GET /statistics`
- **200 OK**
```json
{
  "totalUsers": 123,
  "rolesDistribution": {
    "admin": 5,
    "user": 118
  },
  "totalCVs": 456,
  "totalJobs": 78,
  "avgMatchScore": 76.2,
  "topJobsByAvgScore": [
    { "jobId": "abc123", "title": "Java Backend",    "avgScore": 92.5 },
    { "jobId": "def456", "title": "React Developer",  "avgScore": 89.1 },
    { "jobId": "ghi789", "title": "Data Engineer",   "avgScore": 88.0 },
    { "jobId": "jkl012", "title": "QA Analyst",      "avgScore": 87.3 },
    { "jobId": "mno345", "title": "DevOps Engineer", "avgScore": 86.9 }
  ],
  "scoreDistribution": {
    "0-50":   10,
    "51-75":  30,
    "76-100": 83
  },
  "avgScoreComponents": {
    "industry": 63.4,
    "tech":     75.2,
    "jd":       80.5
  }
}
```
- **500 Internal Server Error**
```json
{
  "success": false,
  "error": "Internal server error"
}
```
```

