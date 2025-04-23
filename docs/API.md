# API Reference

All endpoints live under your backend’s base URL.

---

## Endpoints

| Method | Path         | Description                                   |
| ------ | ------------ | --------------------------------------------- |
| `GET`  | `/ping`      | Health check (returns "pong").                |
| `POST` | `/processcv` | Process an uploaded CV against a job posting. |
|        |              |                                               |

| **Params:** `jobId` (query), `file` (multipart). |                         |                                                               |
| ------------------------------------------------ | ----------------------- | ------------------------------------------------------------- |
| `GET`                                            | `/cvs/user/{userId}`    | List all CVs uploaded by a specific user.                     |
| `POST`                                           | `/scorecvs`             | Score a CV vs. a job and save both CV→Job and Job→CV matches. |
|                                                  |                         | **Params:** `jobId`, `cvId` (query); body: raw `cvText`.      |
| `POST`                                           | `/searchjobsforcv/find` | Find matching jobs for an uploaded CV.                        |
|                                                  |                         | **Params:** `file` (multipart).                               |

---

## Response Structures

### `GET /ping`

- **200 OK**
  ```txt
  pong
  ```

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

