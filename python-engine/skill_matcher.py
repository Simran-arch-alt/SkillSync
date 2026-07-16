import sys
import json
import re
import numpy as np
from pymongo import MongoClient
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

MONGO_URI = sys.argv[1] if len(sys.argv) > 2 else 'mongodb://localhost:27017/'
DB_NAME = 'capstone_db'
COLLECTION = 'jobs'

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


def load_jobs(mongo_uri):
    client = MongoClient(mongo_uri)
    db = client[DB_NAME]
    return list(db[COLLECTION].find({}, {
        '_id': 0, 'job_title': 1, 'company': 1, 'skills_str': 1
    }))


def build_matcher(rows):
    job_texts = []
    for r in rows:
        skills = r['skills_str'].strip().lower()
        if skills:
            skills = skills.replace(', ', '|').replace(',', '|')
            job_texts.append(skills)

    vectorizer = CountVectorizer(binary=True, token_pattern=r'[^|]+')
    X = vectorizer.fit_transform(job_texts)
    return vectorizer, X


def extract_skills(text):
    text_lower = text.lower()
    found = []
    for skill_name, pattern in SKILL_PATTERNS.items():
        if re.search(pattern, text_lower):
            found.append(skill_name)
    return found


def match(resume_text, vectorizer, X, rows):
    skills = extract_skills(resume_text)
    if not skills:
        return [], skills

    processed = ', '.join(skills).replace(', ', '|').replace(',', '|')
    vec = vectorizer.transform([processed])
    sims = cosine_similarity(vec, X).flatten()
    top_idx = np.argsort(sims)[::-1][:10]

    results = []
    for idx in top_idx:
        if sims[idx] > 0:
            results.append({
                'title': rows[idx]['job_title'],
                'company': rows[idx]['company'],
                'score': round(float(sims[idx]), 4),
                'requiredSkills': rows[idx]['skills_str'],
            })
    return results, skills


if __name__ == '__main__':
    resume_text = ''
    mongo_uri = 'mongodb://localhost:27017/'

    args = sys.argv[1:]
    i = 0
    while i < len(args):
        if args[i] == '--text' and i + 1 < len(args):
            resume_text = args[i + 1]
            i += 2
        elif args[i] == '--mongo-uri' and i + 1 < len(args):
            mongo_uri = args[i + 1]
            i += 2
        else:
            i += 1

    if not resume_text:
        resume_text = sys.stdin.read()

    rows = load_jobs(mongo_uri)
    vectorizer, X = build_matcher(rows)
    results, skills = match(resume_text, vectorizer, X, rows)

    output = {
        'extractedSkills': ', '.join(skills),
        'results': results,
    }
    print(json.dumps(output))
