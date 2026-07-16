import sys
import json
import re
import os
from typing import List, Dict, Any, Optional
from dataclasses import dataclass, field

import pandas as pd
import numpy as np
import networkx as nx


def normalize_text(text: Any) -> str:
    if text is None or (isinstance(text, float) and np.isnan(text)):
        return ""
    text = str(text).lower()
    text = re.sub(r"[^a-z0-9\s\-]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def parse_skill_list(raw: Any) -> List[str]:
    if raw is None or (isinstance(raw, float) and pd.isna(raw)):
        return []
    parts = [normalize_text(p) for p in str(raw).split(",")]
    return sorted({p for p in parts if p})


SAMPLE_DATA = [
    {"job_title": "Backend Developer I", "role_category": "backend_developer",
     "skills_str": "python, sql, docker, aws"},
    {"job_title": "Backend Developer II", "role_category": "backend_developer",
     "skills_str": "python, sql, docker, aws, kubernetes"},
    {"job_title": "Backend Developer III", "role_category": "backend_developer",
     "skills_str": "python, sql, aws"},
    {"job_title": "Data Analyst I", "role_category": "data_analyst",
     "skills_str": "python, sql, excel, statistics, tableau"},
    {"job_title": "Data Analyst II", "role_category": "data_analyst",
     "skills_str": "python, sql, excel, power bi"},
    {"job_title": "Data Analyst III", "role_category": "data_analyst",
     "skills_str": "sql, excel, statistics"},
    {"job_title": "Machine Learning Engineer I", "role_category": "ml_engineer",
     "skills_str": "python, machine learning, tensorflow, scikit-learn, statistics"},
    {"job_title": "Machine Learning Engineer II", "role_category": "ml_engineer",
     "skills_str": "python, machine learning, tensorflow, deep learning"},
    {"job_title": "Machine Learning Engineer III", "role_category": "ml_engineer",
     "skills_str": "python, machine learning, scikit-learn"},
    {"job_title": "Frontend Developer I", "role_category": "frontend_developer",
     "skills_str": "javascript, html, css, react"},
    {"job_title": "Frontend Developer II", "role_category": "frontend_developer",
     "skills_str": "javascript, html, css"},
]


def load_job_dataset(csv_path: str) -> pd.DataFrame:
    if os.path.exists(csv_path):
        df = pd.read_csv(csv_path)
    else:
        df = pd.DataFrame(SAMPLE_DATA)

    if "skills_str" not in df.columns:
        raise ValueError("Expected a 'skills_str' column in the dataset")
    if "role_category" not in df.columns:
        df["role_category"] = "general"
    df["role_category"] = df["role_category"].fillna("general")
    df["skills"] = df["skills_str"].apply(parse_skill_list)
    return df


@dataclass
class JobRole:
    role_id: str
    title: str
    required_skills: List[str]
    preferred_skills: List[str] = field(default_factory=list)
    recommendation_text: str = ""
    postings_analyzed: int = 0

    def match_against(self, user_skills: set) -> Dict[str, Any]:
        req = set(self.required_skills)
        pref = set(self.preferred_skills)

        req_missing = sorted(req - user_skills)
        pref_missing = sorted(pref - user_skills)
        req_matched = len(req) - len(req_missing)
        pref_matched = len(pref) - len(pref_missing)

        total_weight = (len(req) * 2) + len(pref)
        earned_weight = (req_matched * 2) + pref_matched
        match_score = round(earned_weight / total_weight, 3) if total_weight else 0.0

        return {
            "role": self.title,
            "match_score": match_score,
            "required_matched": req_matched,
            "required_total": len(req),
            "preferred_matched": pref_matched,
            "preferred_total": len(pref),
            "required_missing": req_missing,
            "preferred_missing": pref_missing,
            "recommendation": self.recommendation_text,
        }


class RuleEngine:
    def __init__(self, jobs_df: pd.DataFrame,
                 required_threshold: float = 0.5,
                 preferred_threshold: float = 0.2):
        self.required_threshold = required_threshold
        self.preferred_threshold = preferred_threshold
        self.roles: List[JobRole] = self._build_rules(jobs_df)

    def _build_rules(self, jobs_df: pd.DataFrame) -> List[JobRole]:
        roles = []
        for category, group in jobs_df.groupby("role_category"):
            n_postings = len(group)
            skill_counts: Dict[str, int] = {}
            for skills in group["skills"]:
                for s in skills:
                    skill_counts[s] = skill_counts.get(s, 0) + 1

            required, preferred = [], []
            for skill, count in skill_counts.items():
                freq = count / n_postings
                if freq >= self.required_threshold:
                    required.append(skill)
                elif freq >= self.preferred_threshold:
                    preferred.append(skill)

            if not required and not preferred:
                continue

            title = category.replace("_", " ").title()
            roles.append(JobRole(
                role_id=category,
                title=title,
                required_skills=sorted(required),
                preferred_skills=sorted(preferred),
                postings_analyzed=n_postings,
                recommendation_text=(
                    f"Derived from {n_postings} '{title}' postings \u2014 "
                    f"required: {', '.join(sorted(required)) or 'none identified'}; "
                    f"preferred: {', '.join(sorted(preferred)) or 'none identified'}."
                ),
            ))
        return roles

    def evaluate(self, user_skills: List[str]) -> Dict[str, Any]:
        user_set = {normalize_text(s) for s in user_skills}
        results = [role.match_against(user_set) for role in self.roles]
        results.sort(key=lambda r: (-r["match_score"], len(r["required_missing"])))
        return {"rules_evaluated": len(results), "rules": results}


class LearningPathGenerator:
    DEFAULT_DEPENDENCIES: Dict[str, List[str]] = {
        "data structures": ["python basics"],
        "algorithms": ["data structures"],
        "sql": ["data structures"],
        "web frameworks": ["sql"],
        "statistics": ["python basics"],
        "excel": ["python basics"],
        "tensorflow": ["python basics"],
        "scikit-learn": ["python basics"],
        "machine learning": ["python basics", "statistics"],
        "deep learning": ["machine learning", "tensorflow"],
        "data visualization": ["python basics", "excel"],
        "docker": ["python basics"],
        "aws": ["docker"],
        "kubernetes": ["docker"],
        "power bi": ["excel"],
        "tableau": ["excel"],
        "react": ["javascript"],
    }

    def __init__(self, dependencies: Optional[Dict[str, List[str]]] = None):
        self.dependencies = dependencies or self.DEFAULT_DEPENDENCIES
        self.graph = self._build_graph(self.dependencies)

    @staticmethod
    def _build_graph(dependencies: Dict[str, List[str]]) -> nx.DiGraph:
        graph = nx.DiGraph()
        for skill, prereqs in dependencies.items():
            graph.add_node(skill)
            for prereq in prereqs:
                graph.add_edge(prereq, skill)
        if not nx.is_directed_acyclic_graph(graph):
            raise ValueError("Skill dependency graph must be acyclic.")
        return graph

    def generate_path(self, user_skills: List[str],
                      target_skills: Optional[List[str]] = None) -> List[str]:
        known = {normalize_text(s) for s in user_skills}

        if target_skills is not None:
            missing = [normalize_text(s) for s in target_skills if normalize_text(s) not in known]
        else:
            missing = [n for n in self.graph.nodes if n not in known]

        in_graph = [m for m in missing if m in self.graph.nodes]

        if not in_graph:
            return []

        required_prereqs = set()
        for skill in in_graph:
            required_prereqs.update(
                p for p in nx.ancestors(self.graph, skill) if normalize_text(p) not in known
            )

        subgraph_nodes = required_prereqs.union(in_graph)
        subgraph = self.graph.subgraph(subgraph_nodes).copy()
        ordered = list(nx.topological_sort(subgraph))
        return [skill for skill in ordered if normalize_text(skill) not in known]


def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Usage: python rule_recommender.py --skills 'skill1, skill2, ...'"}))
        sys.exit(1)

    skills_input = ""
    csv_path = ""

    args = sys.argv[1:]
    i = 0
    while i < len(args):
        if args[i] == "--skills" and i + 1 < len(args):
            skills_input = args[i + 1]
            i += 2
        elif args[i] == "--csv" and i + 1 < len(args):
            csv_path = args[i + 1]
            i += 2
        else:
            i += 1

    if not skills_input:
        print(json.dumps({"error": "No skills provided. Use --skills 'skill1, skill2, ...'"}))
        sys.exit(1)

    user_skills = [s.strip() for s in skills_input.split(",") if s.strip()]

    jobs_df = load_job_dataset(csv_path)

    rule_engine = RuleEngine(jobs_df)
    rule_output = rule_engine.evaluate(user_skills)

    learning_path = []
    if rule_output["rules"]:
        top_role = rule_output["rules"][0]
        missing_for_top_role = top_role["required_missing"] + top_role["preferred_missing"]
        path_generator = LearningPathGenerator()
        learning_path = path_generator.generate_path(user_skills, missing_for_top_role)

    result = {
        "inputSkills": user_skills,
        "ruleRecommendations": rule_output["rules"][:5],
        "learningPath": learning_path,
    }

    print(json.dumps(result))


if __name__ == "__main__":
    main()
