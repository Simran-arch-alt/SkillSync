"""Lightweight standalone curriculum API — reuses shared modules."""
from flask import Flask, jsonify, request
from flask_cors import CORS

from config import Config
from data_loader import load_skill_curriculum
from external_data import fetch_books, fetch_esco_info, fetch_onet_info, fetch_roadmap_for_skill, fetch_youtube_videos
from learning_path import estimate_difficulty

app = Flask(__name__)
CORS(app)

_curriculum_data = None


def _get_curriculum():
    global _curriculum_data
    if _curriculum_data is None:
        _curriculum_data = load_skill_curriculum(fallback_path=Config.CURRICULUM_FILE)
    return _curriculum_data


@app.get("/health")
def health():
    return jsonify({"status": "ok"})


@app.get("/curriculum")
def curriculum():
    data = _get_curriculum()
    skills = data.get("skills", {})
    enrich = request.args.get("enrich", "false").lower() in ("1", "true", "yes")
    if enrich:
        merged = {}
        for name, entry in skills.items():
            out = dict(entry)
            videos = fetch_youtube_videos(name)
            books = fetch_books(name)
            if videos:
                out["video_resources"] = videos
            if books:
                out["book_resources"] = books
            esco = fetch_esco_info(name)
            if esco:
                out["esco"] = esco
            onet = fetch_onet_info(name)
            if onet:
                out["onet"] = onet
            roadmap = fetch_roadmap_for_skill(name)
            if roadmap.get("roadmaps"):
                out["roadmaps"] = roadmap["roadmaps"]
            topics = entry.get("sub_topics", [])
            total = sum(t.get("hours", 0) for t in topics)
            out["difficulty"] = estimate_difficulty(total)
            merged[name] = out
        return jsonify({"skills": merged})
    return jsonify(data)


if __name__ == "__main__":
    app.run(host=Config.HOST, port=Config.PORT, debug=Config.FLASK_DEBUG)
