import os
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

dotenv_path = os.path.join(BASE_DIR, ".env")
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path)
else:
    load_dotenv()


class Config:
    HOST = os.environ.get("HOST", "0.0.0.0")
    PORT = int(os.environ.get("PORT", "8000"))
    FLASK_DEBUG = os.environ.get("FLASK_DEBUG", "0") == "1"

    DATA_PATH = os.environ.get(
        "DATA_PATH", os.path.join(BASE_DIR, "jobs_dataset_skills_final.csv")
    )
    CURRICULUM_FILE = os.environ.get(
        "CURRICULUM_FILE", os.path.join(BASE_DIR, "skill_curriculum.json")
    )
    CURRICULUM_API_URL = os.environ.get("SKILL_CURRICULUM_API_URL") or os.environ.get("CURRICULUM_API_URL")

    YOUTUBE_API_KEY = os.environ.get("YOUTUBE_API_KEY", "")
    GOOGLE_BOOKS_API_KEY = os.environ.get("GOOGLE_BOOKS_API_KEY", "")
    GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")

    MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017/")
    MONGO_DB_NAME = os.environ.get("MONGO_DB_NAME", "career_recommendation")

    CACHE_TTL = int(os.environ.get("CACHE_TTL", 3600))

    @classmethod
    def has_youtube_key(cls):
        return bool(cls.YOUTUBE_API_KEY)

    @classmethod
    def has_books_key(cls):
        return bool(cls.GOOGLE_BOOKS_API_KEY)
