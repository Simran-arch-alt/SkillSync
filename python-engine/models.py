from dataclasses import dataclass, field
from typing import Any, Dict, List


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
