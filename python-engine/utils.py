import re
from typing import Any, List

import numpy as np
import pandas as pd


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
