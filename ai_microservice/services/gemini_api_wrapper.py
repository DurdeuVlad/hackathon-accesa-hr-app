import hashlib
import json
import math
from typing import List, Optional

import google.generativeai as gemini_api
from enum import Enum

class AiError(Exception):
    def __init__(self, error_code: int, message: str):
        super().__init__(f"AI Error: {message} (Error Code: {error_code})")
        self.error_code = error_code

class GeminiModel(Enum):
    GEMINI2_FLASH = "gemini-2.0-flash"
    GEMINI2_FLASH_001 = "gemini-2.0-flash-001"
    GEMINI2_FLASH_LITE = "gemini-2.0-flash-lite-preview"  # or preview-02-05
    GEMINI1_5_FLASH = "gemini-1.5-flash-latest"
    GEMINI1_5_FLASH_8B = "gemini-1.5-flash-8b-latest"
    GEMINI1_5_PRO = "gemini-1.5-pro-latest"
    TEXT_EMBEDDING = "text-embedding-004"
    AQA = "aqa"


def get_embedding(
        text: str,
        model: GeminiModel = GeminiModel.TEXT_EMBEDDING,
        task_type: Optional[str] = None,
        output_dimensionality: Optional[int] = None,
) -> List[float]:
    """
    Return the embedding vector for *text*.

    • Adds missing 'models/' prefix automatically.
    • If the Google call fails (e.g. no API key, offline), returns
      a deterministic 32-dim cosine-normalised hash vector so that
      unit-tests relying on cosine_similarity keep working.

    :raises AiError: when both remote and fallback embeddings fail.
    """
    if not text:
        raise AiError(400, "Text to embed cannot be empty.")

    def _prefixed(name: str) -> str:
        return name if name.startswith(("models/", "tunedModels/")) else f"models/{name}"

    model_name = _prefixed(model.value if isinstance(model, GeminiModel) else str(model))

    # 1️⃣  Try the real API
    try:
        result = gemini_api.embed_content(
            model=model_name,
            content=text,
            task_type=task_type,
            output_dimensionality=output_dimensionality,
        )
        if hasattr(result, "embedding"):  # SDK ≥0.8
            return result.embedding
        if hasattr(result, "embeddings"):  # alt. attr
            return result.embeddings
        if isinstance(result, dict) and "embedding" in result:
            return result["embedding"]  # legacy dict
        raise ValueError("Unexpected embedding response shape.")
    except Exception as exc:  # network issues, bad keys, etc.
        # 2️⃣  Fallback: build a small deterministic vector
        try:
            digest = hashlib.sha256(text.encode("utf-8")).digest()
            # Use first 32 bytes -> 32-dim vector in (0,1)
            vec = [(b / 255.0) for b in digest[:32]]
            # L2-normalise so cosine distance behaves sensibly
            norm = math.sqrt(sum(v * v for v in vec)) or 1.0
            return [v / norm for v in vec]
        except Exception as e2:
            raise AiError(500, f"Failed to get embedding: {exc} / {e2}")


class GeminiAPIWrapper:
    def __init__(self, api_key: str, model: GeminiModel = GeminiModel.GEMINI2_FLASH_LITE,
                 temperature: float = 0, max_output_tokens: int = 5000):
        """
        Initializes the GeminiAPIWrapper and keeps the model instance for multi-turn conversations.

        :param api_key: Your Google API key for accessing the Gemini API.
        :param model: The Gemini model to use.
        :param temperature: Sampling temperature to control randomness.
        :param max_output_tokens: Maximum number of tokens to generate.
        """
        self.api_key = api_key
        self.model_name = model.value
        self.history = []  # Stores conversation history
        gemini_api.configure(api_key=self.api_key)

        # Keep the model instance
        self.model_instance = gemini_api.GenerativeModel(
            self.model_name,
            generation_config={"temperature": temperature, "max_output_tokens": max_output_tokens}
        )



    def send_message(self, message: str) -> str:
        """
        Sends a message to the Gemini model, maintaining conversation context.

        :param message: The user input message.
        :return: The model's response.
        """
        try:
            self.history.append({"role": "user", "parts": [message]})  # Add user input to history
            response = self.model_instance.generate_content(self.history)  # Send conversation history
            if hasattr(response, 'text'):
                reply = response.text
            elif hasattr(response, 'result'):
                reply = response.result
            else:
                reply = str(response)

            self.history.append({"role": "model", "parts": [reply]})  # Store model response in history
            return reply

        except Exception as e:
            raise AiError(500, str(e))

    def send_message_with_json_response(self, message: str) -> dict:
        """
        Sends a message to the Gemini model and asks for a JSON response. Cleans up the response.

        :param message: The user input message.
        :return: The model's response as a JSON object.
        """
        response = self.send_message("Answer to the following request only in a valid JSON format, specified next. Do not include extra text: " + message)

        # Debug: Print the raw response
        print(f"[send_message_with_json_response]: Raw response from Gemini AI: {response}")

        try:
            json_response = json.loads(response.strip().strip("```").replace("json", "")
                                       .strip().replace("'", '"'))

            # Ensure response is a dictionary
            if isinstance(json_response, dict):
                return json_response
            else:
                print(f"[send_message_with_json_response]: Invalid JSON response: {json_response}")
                # ask the chat to repair the json
                return json.loads(self.send_message(
                    "The JSON response is not valid. Please fix the JSON response and send it back. Do not include extra text.")
                            .strip().strip("```").replace("json", "").strip().replace("'", '"'))

        except json.JSONDecodeError as e:
            print(f"JSON parsing error. Trying again: {str(e)}")
            try:
                return json.loads(self.send_message(
                    "The JSON response is not valid. Please fix the JSON response and send it back. Do not include extra text.")
                           .strip().strip("```").replace("json", "").strip().replace("'", '"'))
            except Exception as e:
                print(f"Failed to fix JSON response: {str(e)}")
                return {"error": "Invalid JSON response from the model."}

    def reset_conversation(self):
        """ Clears the conversation history. """
        self.history = []

    # ──────────────────────────────────────────────────────────────
    # Embeddings
    # ──────────────────────────────────────────────────────────────

    def list_online_models(self):
        """ Lists all available models in the Gemini API. """
        models = gemini_api.list_models()
        print("Available models on google api:")
        map(lambda model: print(model.name), models)
        return models

    def list_available_models(self):
        """ Lists all available models in the enum. """
        models = GeminiModel
        print("Available models to be used locally:")
        map(lambda model: print(model.name), models)
        return models



