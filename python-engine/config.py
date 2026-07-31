import os
from pathlib import Path

BASE_DIR = os.path.dirname(os.path.abspath(__file__))


class Config:
    HOST = os.environ.get("PYENGINE_HOST", "0.0.0.0")
    PORT = int(os.environ.get("PYENGINE_PORT", "5001"))
    FLASK_DEBUG = os.environ.get("PYENGINE_DEBUG", "0") == "1"

    DATA_PATH = os.environ.get(
        "DATA_PATH", os.path.join(os.path.dirname(BASE_DIR), "backend", "dataset", "jobs.csv")
    )
    CURRICULUM_FILE = os.environ.get(
        "CURRICULUM_FILE", os.path.join(BASE_DIR, "skill_curriculum.json")
    )

    MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017/")
    MONGO_DB_NAME = os.environ.get("MONGO_DB_NAME", "skill_gap_db")
    JOBS_COLLECTION = os.environ.get("JOBS_COLLECTION", "jobs")

    CACHE_TTL = int(os.environ.get("CACHE_TTL", 3600))
