import sys
import json
import re
import numpy as np
import networkx as nx
from pymongo import MongoClient
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

MONGO_URI = 'mongodb://localhost:27017/'
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
    'scikit-learn': r'\bscikit-learn\b',
    'rest api': r'\brest api\b',
    'power bi': r'\bpower bi\b',
    'data visualization': r'\bdata visualization\b',
    'statistics': r'\bstatistics\b',
    'software engineering': r'\bsoftware engineering\b',
    'communication': r'\bcommunication\b',
    'data analysis': r'\bdata analysis\b',
    'nlp': r'\bnlp\b',
}

RULES = [
    {
        'role': 'Machine Learning Engineer',
        'required_skills': {'python', 'machine learning', 'tensorflow', 'scikit-learn'},
        'preferred_skills': {'deep learning', 'statistics', 'software engineering'},
        'recommendation': 'Consider machine learning engineering roles and strengthen model deployment experience.'
    },
    {
        'role': 'Data Analyst',
        'required_skills': {'python', 'sql', 'excel', 'data visualization'},
        'preferred_skills': {'tableau', 'power bi', 'statistics'},
        'recommendation': 'Data analyst is a good match; gain exposure to business reporting and dashboards.'
    },
]

SKILL_DEPENDENCIES = {
    'machine learning': ['python', 'statistics'],
    'deep learning': ['machine learning', 'tensorflow'],
    'data visualization': ['python', 'excel'],
    'tensorflow': ['python'],
    'scikit-learn': ['python'],
}


def normalize_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


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


def rule_based_recommendations(user_skills):
    skills_set = set(normalize_text(skill) for skill in user_skills)
    results = []
    for rule in RULES:
        required_missing = [skill for skill in rule['required_skills'] if normalize_text(skill) not in skills_set]
        preferred_missing = [skill for skill in rule['preferred_skills'] if normalize_text(skill) not in skills_set]
        match_score = 1 - len(required_missing) / max(1, len(rule['required_skills']))
        results.append({
            'role': rule['role'],
            'matchScore': round(match_score, 2),
            'requiredMissing': required_missing,
            'preferredMissing': preferred_missing,
            'recommendation': rule['recommendation']
        })
    return sorted(results, key=lambda r: (-r['matchScore'], len(r['requiredMissing'])))


def build_skill_dag(dependencies):
    graph = nx.DiGraph()
    for skill, prereqs in dependencies.items():
        graph.add_node(skill)
        for prereq in prereqs:
            graph.add_edge(prereq, skill)
    if not nx.is_directed_acyclic_graph(graph):
        raise ValueError('Skill dependency graph must be acyclic')
    return graph


def generate_learning_path(user_skills, graph):
    known = set(normalize_text(skill) for skill in user_skills)
    missing = [node for node in graph.nodes if normalize_text(node) not in known]
    required_prereqs = set()
    for skill in missing:
        for prereq in nx.ancestors(graph, skill):
            if normalize_text(prereq) not in known:
                required_prereqs.add(prereq)
    subgraph = graph.subgraph(required_prereqs.union(missing)).copy()
    try:
        path = list(nx.topological_sort(subgraph))
    except nx.NetworkXUnfeasible:
        path = []
    return [skill for skill in path if normalize_text(skill) not in known]


if __name__ == '__main__':
    resume_text = ''
    skills_input = None
    mongo_uri = 'mongodb://localhost:27017/'

    args = sys.argv[1:]
    i = 0
    while i < len(args):
        if args[i] == '--text' and i + 1 < len(args):
            resume_text = args[i + 1]
            i += 2
        elif args[i] == '--skills' and i + 1 < len(args):
            skills_input = [s.strip().lower() for s in args[i + 1].split(',') if s.strip()]
            i += 2
        elif args[i] == '--mongo-uri' and i + 1 < len(args):
            mongo_uri = args[i + 1]
            i += 2
        else:
            i += 1

    if not resume_text and skills_input is None:
        resume_text = sys.stdin.read()

    rows = load_jobs(mongo_uri)
    vectorizer, X = build_matcher(rows)

    if skills_input is not None:
        skills = skills_input
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
    else:
        results, skills = match(resume_text, vectorizer, X, rows)

    rule_results = rule_based_recommendations(skills)
    skill_graph = build_skill_dag(SKILL_DEPENDENCIES)
    learning_path = generate_learning_path(skills, skill_graph)

    output = {
        'extractedSkills': ', '.join(skills),
        'results': results,
        'ruleRecommendations': rule_results,
        'learningPath': learning_path,
    }
    print(json.dumps(output))
