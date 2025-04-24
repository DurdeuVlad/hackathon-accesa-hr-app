# Backend Setup & .env

To run the backend locally, follow the steps below.

---

## 1. Prerequisites

- Java 17 or later
- Maven (or use the Maven wrapper)
- Firebase Project with Firestore
- Google Cloud API key (Gemini API)

---

## 2. Project Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-org>/cv-match
   cd cv-match/backend
   ```

2. Create `.env` file:
   ```dotenv
   gemini_api_key=YOUR_GEMINI_API_KEY
   gemini_model_id=gemini-2.0-flash        # optional
   gemini_embed_model_id=embedding-001     # optional
   ```

3. Place Firebase service account key:
   - Save your Firebase Admin SDK JSON file as:
     ```
     src/main/resources/firebase/serviceAccountKey.json
     ```

---

## 3. Run the Backend

Use Maven to build and run:
```bash
mvn spring-boot:run
```

Or, to package:
```bash
mvn clean install
java -jar target/backend-*.jar
```

---

## 4. Notes

- Your `.env` will be picked up by the `GenerativeLanguageClient` and FirebaseConfig.
- Do not commit `.env` or your service account file.
- Add `.env` to your `.gitignore` if not already listed.

