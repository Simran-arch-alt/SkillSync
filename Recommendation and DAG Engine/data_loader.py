import json
import os
from typing import Any, Dict, Optional

import pandas as pd

from utils import parse_skill_list


def load_job_dataset(csv_path: str) -> pd.DataFrame:
    if os.path.exists(csv_path):
        df = pd.read_csv(csv_path)
    else:
        df = pd.DataFrame(
            [
                {
                    "job_title": "Backend Developer I",
                    "role_category": "backend_developer",
                    "skills_str": "python, sql, docker, aws",
                },
                {
                    "job_title": "Backend Developer II",
                    "role_category": "backend_developer",
                    "skills_str": "python, sql, docker, aws, kubernetes",
                },
                {
                    "job_title": "Backend Developer III",
                    "role_category": "backend_developer",
                    "skills_str": "python, sql, aws",
                },
                {
                    "job_title": "Data Analyst I",
                    "role_category": "data_analyst",
                    "skills_str": "python, sql, excel, statistics, tableau",
                },
                {
                    "job_title": "Data Analyst II",
                    "role_category": "data_analyst",
                    "skills_str": "python, sql, excel, power bi",
                },
                {
                    "job_title": "Data Analyst III",
                    "role_category": "data_analyst",
                    "skills_str": "sql, excel, statistics",
                },
                {
                    "job_title": "Machine Learning Engineer I",
                    "role_category": "ml_engineer",
                    "skills_str": "python, machine learning, tensorflow, scikit-learn, statistics",
                },
                {
                    "job_title": "Machine Learning Engineer II",
                    "role_category": "ml_engineer",
                    "skills_str": "python, machine learning, tensorflow, deep learning",
                },
                {
                    "job_title": "Machine Learning Engineer III",
                    "role_category": "ml_engineer",
                    "skills_str": "python, machine learning, scikit-learn",
                },
                {
                    "job_title": "Frontend Developer I",
                    "role_category": "frontend_developer",
                    "skills_str": "javascript, html, css, react",
                },
                {
                    "job_title": "Frontend Developer II",
                    "role_category": "frontend_developer",
                    "skills_str": "javascript, html, css",
                },
            ]
        )

    if "skills_str" not in df.columns:
        raise ValueError("Expected a 'skills_str' column in the dataset")
    if "role_category" not in df.columns:
        df["role_category"] = "general"
    df["role_category"] = df["role_category"].fillna("general")

    df["skills"] = df["skills_str"].apply(parse_skill_list)
    return df


def load_skill_curriculum(
    api_url: Optional[str] = None,
    fallback_path: str = "skill_curriculum.json",
) -> Dict[str, Any]:
    import urllib.request

    api_url = (
        api_url
        or os.environ.get("SKILL_CURRICULUM_API_URL")
        or os.environ.get("CURRICULUM_API_URL")
    )
    fallback_path = os.environ.get("SKILL_CURRICULUM_JSON_PATH", fallback_path)

    if api_url:
        try:
            req = urllib.request.Request(
                api_url, headers={"Accept": "application/json"}
            )
            with urllib.request.urlopen(req, timeout=15) as response:
                payload = json.load(response)

            if isinstance(payload, dict):
                if "skills" in payload:
                    return payload
                if "curriculum" in payload:
                    return payload["curriculum"]
                if "data" in payload and isinstance(payload["data"], dict):
                    return payload["data"]
            elif isinstance(payload, list):
                return {"skills": payload}
        except Exception:
            pass

    if os.path.exists(fallback_path):
        with open(fallback_path, encoding="utf-8") as handle:
            return json.load(handle)

    raise FileNotFoundError(
        f"Could not load skill curriculum from API or fallback path: {fallback_path}"
    )
