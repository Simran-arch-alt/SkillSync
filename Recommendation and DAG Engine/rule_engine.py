from typing import Any, Dict, List

import pandas as pd

from models import JobRole
from utils import normalize_text


class RuleEngine:
    def __init__(
        self,
        jobs_df: pd.DataFrame,
        required_threshold: float = 0.5,
        preferred_threshold: float = 0.2,
    ):
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
            roles.append(
                JobRole(
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
                )
            )
        return roles

    def evaluate(self, user_skills: List[str]) -> Dict[str, Any]:
        user_set = {normalize_text(s) for s in user_skills}
        results = [role.match_against(user_set) for role in self.roles]
        results.sort(
            key=lambda r: (-r["match_score"], len(r["required_missing"]))
        )
        return {"rules_evaluated": len(results), "rules": results}
