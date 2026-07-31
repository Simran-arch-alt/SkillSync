from typing import Any, Dict, List, Optional, Set

import networkx as nx

from utils import normalize_text

DIFFICULTY_LEVELS = ["beginner", "intermediate", "advanced", "expert"]


def estimate_difficulty(total_hours: int) -> str:
    if total_hours <= 8:
        return "beginner"
    elif total_hours <= 15:
        return "intermediate"
    elif total_hours <= 25:
        return "advanced"
    else:
        return "expert"


class LearningPathGenerator:
    BUILTIN_DEPENDENCIES: Dict[str, List[str]] = {
        "python": [],
        "data structures": ["python"],
        "algorithms": ["data structures"],
        "sql": ["data structures"],
        "web frameworks": ["sql"],
        "statistics": ["python"],
        "excel": [],
        "tensorflow": ["python"],
        "scikit-learn": ["python"],
        "machine learning": ["python", "statistics"],
        "deep learning": ["machine learning", "tensorflow"],
        "data visualization": ["python", "excel"],
        "docker": [],
        "aws": ["docker"],
        "kubernetes": ["docker"],
        "power bi": ["excel"],
        "tableau": ["excel"],
        "java": ["data structures"],
        "c": [],
        "cpp": ["c"],
        "go": ["data structures"],
        "rust": ["data structures"],
        "typescript": ["javascript"],
        "html": [],
        "css": ["html"],
        "javascript": [],
        "angular": ["javascript", "html", "css"],
        "node js": ["javascript"],
        "react": ["javascript"],
        "git": [],
        "linux": [],
        "azure": [],
        "mongodb": ["sql"],
        "redis": ["sql"],
        "kafka": ["docker"],
        "ci/cd": ["git", "docker"],
        "terraform": ["aws", "azure"],
        "ansible": ["linux"],
        "prometheus": ["docker"],
        "grafana": ["prometheus"],
        "elasticsearch": ["docker"],
        "pandas": ["python"],
        "numpy": ["python"],
        "flask": ["python", "web frameworks"],
        "django": ["python", "web frameworks"],
        "spring boot": ["java", "web frameworks"],
        "express": ["node js"],
        "next js": ["react", "node js"],
        "tailwind css": ["css"],
        "bootstrap": ["css"],
        "sass": ["css"],
        "webpack": ["javascript"],
        "jest": ["javascript"],
        "pytest": ["python"],
        "selenium": ["python"],
        "rest apis": ["web frameworks"],
        "graphql": ["rest apis"],
        "ci": ["git"],
        "cd": ["ci", "docker"],
        "bash": ["linux"],
        "powershell": [],
        "networking": [],
        "security": ["networking"],
        "penetration testing": ["security", "linux"],
        "snowflake": ["sql"],
        "airflow": ["python", "docker"],
        "spark": ["python", "scala"],
        "scala": ["java"],
        "kotlin": ["java"],
        "swift": [],
    }

    def __init__(self, dependencies: Optional[Dict[str, List[str]]] = None):
        self.dependencies = dependencies or self.BUILTIN_DEPENDENCIES
        self.graph = self._build_graph(self.dependencies)

    def merge_dependencies(self, extra: Dict[str, List[str]]):
        self.dependencies.update(extra)
        self.graph = self._build_graph(self.dependencies)

    def add_skill(self, skill: str, prereqs: List[str]):
        self.dependencies[skill] = prereqs
        self.graph = self._build_graph(self.dependencies)

    @staticmethod
    def _build_graph(dependencies: Dict[str, List[str]]) -> nx.DiGraph:
        graph = nx.DiGraph()
        for skill, prereqs in dependencies.items():
            graph.add_node(skill)
            for prereq in prereqs:
                graph.add_edge(prereq, skill)
        return graph

    def get_prerequisites(self, skill: str) -> List[str]:
        skill = normalize_text(skill)
        if skill not in self.graph:
            return []
        ancestors = list(nx.ancestors(self.graph, skill))
        return sorted(ancestors)

    def get_dependents(self, skill: str) -> List[str]:
        skill = normalize_text(skill)
        if skill not in self.graph:
            return []
        descendants = list(nx.descendants(self.graph, skill))
        return sorted(descendants)

    def is_valid_graph(self) -> bool:
        return nx.is_directed_acyclic_graph(self.graph)

    def generate_path(
        self,
        user_skills: List[str],
        target_skills: Optional[List[str]] = None,
    ) -> List[Dict[str, Any]]:
        known = {normalize_text(s) for s in user_skills if normalize_text(s)}

        if target_skills is not None:
            missing_targets = [
                normalize_text(s)
                for s in target_skills
                if normalize_text(s) not in known and normalize_text(s)
            ]
        else:
            missing_targets = [n for n in self.graph.nodes if n not in known]

        in_graph = [m for m in missing_targets if m in self.graph.nodes]
        if not in_graph:
            return []

        all_needed: Set[str] = set()
        for skill in in_graph:
            all_needed.add(skill)
            ancestors = {
                a
                for a in nx.ancestors(self.graph, skill)
                if a not in known
            }
            all_needed.update(ancestors)

        if not all_needed:
            return []

        subgraph = self.graph.subgraph(all_needed).copy()
        ordered = list(nx.topological_sort(subgraph))

        result = []
        for skill in ordered:
            if skill not in known:
                prereqs = [
                    p for p in nx.ancestors(self.graph, skill)
                    if p not in known
                ]
                result.append({
                    "skill": skill,
                    "prerequisites": sorted(prereqs),
                })

        return result

    def generate_path_flat(
        self,
        user_skills: List[str],
        target_skills: Optional[List[str]] = None,
    ) -> List[str]:
        return [
            item["skill"]
            for item in self.generate_path(user_skills, target_skills)
        ]
