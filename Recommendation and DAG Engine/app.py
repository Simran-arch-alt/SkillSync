from typing import Any, Dict, List

from flask import Flask, jsonify, request
from flask_cors import CORS

from config import Config
from data_loader import load_job_dataset, load_skill_curriculum
from external_data import fetch_books, fetch_youtube_videos
from learning_path import (
    LearningPathGenerator,
    estimate_difficulty,
)
from rule_engine import RuleEngine


def create_app() -> Flask:
    app = Flask(__name__)
    CORS(app)

    # ── Load data ──────────────────────────────────────────
    jobs_df = load_job_dataset(Config.DATA_PATH)
    rule_engine = RuleEngine(jobs_df)
    path_generator = LearningPathGenerator()
    curriculum = load_skill_curriculum(fallback_path=Config.CURRICULUM_FILE)
    curriculum_skills: Dict[str, Any] = curriculum.get("skills", {})

    # Dynamically add skills from curriculum to the DAG
    for skill_name in curriculum_skills:
        if skill_name not in path_generator.dependencies:
            path_generator.add_skill(skill_name, [])

    # ── Error handlers ─────────────────────────────────────
    @app.errorhandler(400)
    def bad_request(e):
        return jsonify({"error": "Bad request", "message": str(e)}), 400

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Not found"}), 404

    @app.errorhandler(500)
    def internal_error(e):
        return jsonify({"error": "Internal server error"}), 500

    # ── Health ──────────────────────────────────────────────
    @app.get("/health")
    def health():
        return jsonify({"status": "ok"})

    # ── Rules ───────────────────────────────────────────────
    @app.get("/rules")
    def list_rules():
        return jsonify({"rules": [role.__dict__ for role in rule_engine.roles]})

    # ── Curriculum ─────────────────────────────────────────
    @app.get("/curriculum")
    def get_curriculum():
        enrich = request.args.get("enrich", "false").lower() in ("1", "true", "yes")
        if enrich:
            merged = {}
            for name, entry in curriculum_skills.items():
                merged[name] = _enrich_entry(name, entry)
            return jsonify({"skills": merged})
        return jsonify(curriculum)

    @app.get("/curriculum/<skill_name>")
    def get_skill_curriculum(skill_name: str):
        entry = curriculum_skills.get(skill_name.lower())
        if not entry:
            return jsonify({"error": f"Skill '{skill_name}' not found in curriculum"}), 404
        enrich = request.args.get("enrich", "false").lower() in ("1", "true", "yes")
        if enrich:
            return jsonify(_enrich_entry(skill_name.lower(), entry))
        return jsonify(entry)

    # ── Skill graph ────────────────────────────────────────
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

    # ── External data ──────────────────────────────────────
    @app.get("/enrich/<skill_name>")
    def enrich_skill_endpoint(skill_name: str):
        from external_data import enrich_skill
        result = enrich_skill(skill_name)
        return jsonify(result)

    # ── Recommend ──────────────────────────────────────────
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

        enrich_flag = payload.get("enrich", False)
        target_role = payload.get("target_role")

        # 1. Rule engine evaluation
        rule_output = rule_engine.evaluate(user_skills)

        # 2. Determine missing skills
        missing_skills: List[str] = []
        if rule_output["rules"]:
            top_role = rule_output["rules"][0]
            missing_skills = top_role["required_missing"] + top_role["preferred_missing"]

        # If a specific target role is requested, use its missing skills
        if target_role:
            for r in rule_output["rules"]:
                if r["role"].lower().replace(" ", "_") == target_role.lower():
                    missing_skills = r["required_missing"] + r["preferred_missing"]
                    break

        # 3. Generate learning path (ordered by prerequisites)
        learning_path = path_generator.generate_path(user_skills, missing_skills)

        # 4. Enrich with curriculum + external data
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

            if enrich_flag:
                enriched = _enrich_entry(skill, entry)
                skill_entry["video_resources"] = enriched.get("video_resources", [])
                skill_entry["book_resources"] = enriched.get("book_resources", [])
                if enriched.get("esco"):
                    skill_entry["esco"] = enriched["esco"]
                if enriched.get("onet"):
                    skill_entry["onet"] = enriched["onet"]
                if enriched.get("roadmaps"):
                    skill_entry["roadmaps"] = enriched["roadmaps"]

            enriched_path.append(skill_entry)

        # 5. Build summary
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

    # ── Helpers ─────────────────────────────────────────────
    def _enrich_entry(name: str, entry: Dict[str, Any]) -> Dict[str, Any]:
        out = dict(entry)
        videos = fetch_youtube_videos(name)
        books = fetch_books(name)
        if videos:
            out["video_resources"] = videos
        if books:
            out["book_resources"] = books
        from external_data import fetch_esco_info, fetch_onet_info, fetch_roadmap_for_skill

        esco = fetch_esco_info(name)
        if esco:
            out["esco"] = esco
        onet = fetch_onet_info(name)
        if onet:
            out["onet"] = onet
        roadmap = fetch_roadmap_for_skill(name)
        if roadmap.get("roadmaps"):
            out["roadmaps"] = roadmap["roadmaps"]

        # Difficulty from subtopics
        sub_topics = entry.get("sub_topics", [])
        total_hours = sum(t.get("hours", 0) for t in sub_topics)
        out["difficulty"] = estimate_difficulty(total_hours)

        return out

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
