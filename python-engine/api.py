import json
import os
import re
import sys
from typing import Any, Dict, List

import numpy as np
from flask import Flask, jsonify, request
from flask_cors import CORS
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from config import Config
from data_loader import load_job_dataset, load_jobs_from_mongo, load_skill_curriculum
from external_data import fetch_books, fetch_esco_info, fetch_onet_info, fetch_roadmap_for_skill, fetch_youtube_videos
from learning_path import LearningPathGenerator, estimate_difficulty
from rule_engine import RuleEngine

SKILL_PATTERNS = {
    'python': r'\bpython\b',
    'java': r'\bjava\b',
    'javascript': r'\bjavascript\b',
    'c++': r'\bc\+\+\b',
    'c#': r'\bc\#\b',
    'typescript': r'\btypescript\b',
    'go': r'\bgo\b',
    'rust': r'\brust\b',
    'sql': r'\bsql\b',
    'html': r'\bhtml\b',
    'css': r'\bcss\b',
    'react': r'\breact\b',
    'angular': r'\bangular\b',
    'node.js': r'\bnode\.?(js)?\b',
    'django': r'\bdjango\b',
    'flask': r'\bflask\b',
    'spring': r'\bspring\b',
    'aws': r'\baws\b',
    'azure': r'\bazure\b',
    'docker': r'\bdocker\b',
    'kubernetes': r'\bkubernetes\b',
    'git': r'\bgit\b',
    'linux': r'\blinux\b',
    'excel': r'\bexcel\b',
    'tableau': r'\btableau\b',
    'pandas': r'\bpandas\b',
    'machine learning': r'\bmachine learning\b',
    'deep learning': r'\bdeep learning\b',
    'tensorflow': r'\btensorflow\b',
    'rest api': r'\brest api\b',
    'power bi': r'\bpower bi\b',
}


def create_app() -> Flask:
    app = Flask(__name__)
    CORS(app)

    jobs_df = load_job_dataset(Config.DATA_PATH)
    rule_engine = RuleEngine(jobs_df)
    path_generator = LearningPathGenerator()
    curriculum = load_skill_curriculum(fallback_path=Config.CURRICULUM_FILE)
    curriculum_skills: Dict[str, Any] = curriculum.get("skills", {})

    for skill_name in curriculum_skills:
        if skill_name not in path_generator.dependencies:
            path_generator.add_skill(skill_name, [])

    @app.errorhandler(400)
    def bad_request(e):
        return jsonify({"error": "Bad request", "message": str(e)}), 400

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Not found"}), 404

    @app.errorhandler(500)
    def internal_error(e):
        return jsonify({"error": "Internal server error"}), 500

    @app.get("/health")
    def health():
        return jsonify({"status": "ok", "service": "python-engine"})

    @app.get("/rules")
    def list_rules():
        return jsonify({"rules": [role.__dict__ for role in rule_engine.roles]})

    @app.get("/curriculum")
    def get_curriculum():
        return jsonify(curriculum)

    @app.get("/curriculum/<skill_name>")
    def get_skill_curriculum(skill_name: str):
        entry = curriculum_skills.get(skill_name.lower())
        if not entry:
            return jsonify({"error": f"Skill '{skill_name}' not found in curriculum"}), 404
        topics = entry.get("sub_topics", [])
        total_hours = sum(t.get("hours", 0) for t in topics)
        return jsonify({
            "skill": skill_name.lower(),
            "sub_topics": topics,
            "total_hours": total_hours,
            "difficulty": estimate_difficulty(total_hours),
            "practice_projects": entry.get("practice_projects", []),
        })

    @app.get("/graph/skills")
    def get_skill_graph():
        nodes = sorted(path_generator.graph.nodes())
        edges = []
        for src, dst in path_generator.graph.edges():
            edges.append({"from": src, "to": dst})
        return jsonify({"nodes": nodes, "edges": edges})

    @app.get("/graph/prerequisites/<skill_name>")
    def get_prerequisites(skill_name: str):
        prereqs = path_generator.get_prerequisites(skill_name)
        return jsonify({"skill": skill_name, "prerequisites": prereqs})

    @app.get("/resources/<skill_name>")
    def get_skill_resources(skill_name: str):
        entry = curriculum_skills.get(skill_name.lower())
        curriculum = None
        if entry:
            topics = entry.get("sub_topics", [])
            total_hours = sum(t.get("hours", 0) for t in topics)
            curriculum = {
                "skill": skill_name.lower(),
                "sub_topics": topics,
                "total_hours": total_hours,
                "difficulty": estimate_difficulty(total_hours),
                "practice_projects": entry.get("practice_projects", []),
            }
        from external_data import fetch_youtube_videos, fetch_books
        youtube = fetch_youtube_videos(skill_name)
        books = fetch_books(skill_name)
        return jsonify({
            "skill": skill_name.lower(),
            "curriculum": curriculum,
            "youtube_videos": youtube,
            "books": books,
        })

    @app.post("/skill-match")
    def skill_match():
        payload = request.get_json(silent=True)
        if not isinstance(payload, dict):
            return jsonify({"error": "Request body must be a JSON object"}), 400

        skills = payload.get("skills", [])
        resume_text = payload.get("text", "")
        mongo_uri = payload.get("mongo_uri", Config.MONGO_URI)

        if not skills and not resume_text:
            return jsonify({"error": "Provide 'skills' list or 'text' for resume parsing"}), 400

        rows = load_jobs_from_mongo(mongo_uri, Config.MONGO_DB_NAME, Config.JOBS_COLLECTION)
        if not rows:
            return jsonify({"error": "No jobs found in MongoDB", "results": []})

        job_texts = []
        for r in rows:
            skills_str = r.get("skills_str", "") or ", ".join(r.get("skills", []))
            if skills_str:
                skills_str = skills_str.lower().replace(", ", "|").replace(",", "|")
                job_texts.append(skills_str)

        vectorizer = CountVectorizer(binary=True, token_pattern=r'[^|]+')
        X = vectorizer.fit_transform(job_texts)

        if skills:
            skills_text = ", ".join(skills)
        else:
            skills_text = resume_text

        extracted = []
        text_lower = skills_text.lower()
        for skill_name, pattern in SKILL_PATTERNS.items():
            if re.search(pattern, text_lower):
                extracted.append(skill_name)

        if not extracted:
            return jsonify({"results": [], "extractedSkills": []})

        processed = ", ".join(extracted).replace(", ", "|").replace(",", "|")
        vec = vectorizer.transform([processed])
        sims = cosine_similarity(vec, X).flatten()
        top_idx = np.argsort(sims)[::-1][:10]

        results = []
        for idx in top_idx:
            if sims[idx] > 0:
                results.append({
                    "title": rows[idx]["job_title"],
                    "company": rows[idx].get("company", ""),
                    "score": round(float(sims[idx]), 4),
                    "requiredSkills": rows[idx].get("skills_str", ", ".join(rows[idx].get("skills", []))),
                })

        return jsonify({"results": results, "extractedSkills": extracted})

    @app.post("/recommend")
    def recommend():
        payload = request.get_json(silent=True)
        if not isinstance(payload, dict):
            return jsonify({"error": "Request body must be a JSON object with a 'skills' field"}), 400

        user_skills: List[str] = payload.get("skills", [])
        if not isinstance(user_skills, list):
            return jsonify({"error": "'skills' must be a list of strings"}), 400
        if not all(isinstance(s, str) for s in user_skills):
            return jsonify({"error": "Each skill must be a string"}), 400

        target_role = payload.get("target_role")

        rule_output = rule_engine.evaluate(user_skills)

        missing_skills: List[str] = []
        if rule_output["rules"]:
            top_role = rule_output["rules"][0]
            missing_skills = top_role["required_missing"] + top_role["preferred_missing"]

        if target_role:
            for r in rule_output["rules"]:
                if r["role"].lower().replace(" ", "_") == target_role.lower():
                    missing_skills = r["required_missing"] + r["preferred_missing"]
                    break

        learning_path = path_generator.generate_path(user_skills, missing_skills)

        enriched_path = []
        for step in learning_path:
            skill = step["skill"]
            entry = curriculum_skills.get(skill, {})
            sub_topics = entry.get("sub_topics", [])
            total_hours = sum(t.get("hours", 0) for t in sub_topics)
            difficulty = estimate_difficulty(total_hours)

            skill_entry: Dict[str, Any] = {
                "skill": skill,
                "prerequisites": step.get("prerequisites", []),
                "sub_topics": sub_topics,
                "total_hours": total_hours,
                "difficulty": difficulty,
                "practice_projects": entry.get("practice_projects", []),
            }
            enriched_path.append(skill_entry)

        total_learning_hours = sum(s["total_hours"] for s in enriched_path)
        summary = {
            "total_skills": len(enriched_path),
            "total_hours": total_learning_hours,
            "average_difficulty": (
                _avg_difficulty([s["difficulty"] for s in enriched_path])
                if enriched_path
                else "unknown"
            ),
        }

        return jsonify({
            "rule_recommendations": rule_output,
            "learning_path": [s["skill"] for s in enriched_path],
            "learning_path_details": enriched_path,
            "summary": summary,
            "input_skills": user_skills,
        })

    return app


def _avg_difficulty(levels: List[str]) -> str:
    order = {"beginner": 1, "intermediate": 2, "advanced": 3, "expert": 4}
    valid = [order[l] for l in levels if l in order]
    if not valid:
        return "unknown"
    avg = sum(valid) / len(valid)
    rev = {1: "beginner", 2: "intermediate", 3: "advanced", 4: "expert"}
    return rev.get(round(avg), "intermediate")


if __name__ == "__main__":
    app = create_app()
    app.run(host=Config.HOST, port=Config.PORT, debug=Config.FLASK_DEBUG)
