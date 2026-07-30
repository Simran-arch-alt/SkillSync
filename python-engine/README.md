# Python Engine — Skill Matching & Learning Path Generator

Resume skill extraction, job matching via cosine similarity, rule-based recommendations, and DAG-based learning path generation.

## Files

| File | Description |
|------|-------------|
| `skill_matcher.py` | Standalone CLI: extracts skills from a resume, matches against MongoDB jobs using CountVectorizer + cosine similarity |
| `api.py` | Unified Flask API: returns top matches, rule-based recommendations (IF-THEN expert system), and NetworkX DAG learning path |

## Usage

### skill_matcher.py (CLI)

```bash
python skill_matcher.py --text "resume text here"
python skill_matcher.py --skills "python, sql, tensorflow"
```

### api.py (Flask API)

```bash
python api.py
# Endpoint: POST / with JSON body { "skills": ["python", "sql"], "text": "..." }
```

## Requirements

- Python 3.10+
- MongoDB running on `localhost:27017`
- `pip install -r requirements.txt`
