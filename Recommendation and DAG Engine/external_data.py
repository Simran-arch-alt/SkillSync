import json
import os
import re
import urllib.parse
import urllib.request
from typing import Any, Dict, List, Optional

from cache import cache_get, cache_set
from config import Config

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ──────────────────────────────────────────────
#  ESCO (European Skills, Competences, Occupations)
# ──────────────────────────────────────────────

ESCO_API_BASE = "https://ec.europa.eu/esco/api"


def fetch_esco_info(skill: str) -> Dict[str, Any]:
    key = f"esco:{skill}"
    cached = cache_get("esco", key)
    if cached is not None:
        return cached

    result = _fetch_esco_local(skill)
    if not result:
        result = _fetch_esco_api(skill)

    cache_set("esco", key, result)
    return result


def _fetch_esco_local(skill: str) -> Dict[str, Any]:
    path = os.path.join(BASE_DIR, "esco.json")
    if not os.path.exists(path):
        return {}
    try:
        with open(path, encoding="utf-8") as fh:
            data = json.load(fh)
        key = skill.lower().replace(" ", "_")
        return data.get("skills", {}).get(key, {}) or data.get(key, {})
    except Exception:
        return {}


def _fetch_esco_api(skill: str) -> Dict[str, Any]:
    try:
        q = urllib.parse.quote(skill.lower())
        url = f"{ESCO_API_BASE}/search?type=skill&q={q}&language=en&limit=3"
        req = urllib.request.Request(url, headers={"Accept": "application/json"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.load(resp)

        results = data.get("_embedded", {}).get("results", [])
        if not results:
            return {}

        info = results[0]
        return {
            "title": info.get("title", ""),
            "description": info.get("description", {}).get("en", ""),
            "uri": info.get("uri", ""),
            "skill_type": info.get("skillType", ""),
            "reuse_level": info.get("reuseLevel", ""),
            "source": "esco_api",
        }
    except Exception:
        return {}


def fetch_esco_related_skills(skill: str) -> List[str]:
    key = f"esco_related:{skill}"
    cached = cache_get("esco", key)
    if cached is not None:
        return cached

    related = []
    try:
        q = urllib.parse.quote(skill.lower())
        url = f"{ESCO_API_BASE}/search?type=skill&q={q}&language=en&limit=1"
        req = urllib.request.Request(url, headers={"Accept": "application/json"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.load(resp)

        results = data.get("_embedded", {}).get("results", [])
        if results:
            uri = results[0].get("uri", "")
            if uri:
                rel_url = f"{ESCO_API_BASE}/resource/skill?uri={urllib.parse.quote(uri, safe='')}&language=en"
                rel_req = urllib.request.Request(rel_url, headers={"Accept": "application/json"})
                with urllib.request.urlopen(rel_req, timeout=10) as rel_resp:
                    rel_data = json.load(rel_resp)
                for rel in rel_data.get("_links", {}).get("hasEssentialSkill", []):
                    related.append(rel.get("title", ""))
    except Exception:
        pass

    cache_set("esco", key, related)
    return related


# ──────────────────────────────────────────────
#  O*NET (occupational skills / technologies)
# ──────────────────────────────────────────────

ONET_API_BASE = "https://services.onetcenter.org/ws"


def fetch_onet_info(skill: str) -> Dict[str, Any]:
    key = f"onet:{skill}"
    cached = cache_get("onet", key)
    if cached is not None:
        return cached

    result = _fetch_onet_local(skill)
    if not result:
        result = _fetch_onet_api(skill)

    cache_set("onet", key, result)
    return result


def _fetch_onet_local(skill: str) -> Dict[str, Any]:
    path = os.path.join(BASE_DIR, "onet.json")
    if not os.path.exists(path):
        return {}
    try:
        with open(path, encoding="utf-8") as fh:
            data = json.load(fh)
        key = skill.lower().replace(" ", "_")
        return data.get("skills", {}).get(key, {}) or data.get(key, {})
    except Exception:
        return {}


def _fetch_onet_api(skill: str) -> Dict[str, Any]:
    try:
        q = urllib.parse.quote(skill.lower())
        url = f"{ONET_API_BASE}/mnm/search/keyword/{q}?start=1&end=10"
        req = urllib.request.Request(url, headers={"Accept": "application/json"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.load(resp)

        occupations = []
        for occ in data.get("occupations", [])[:3]:
            occupations.append({
                "title": occ.get("title", ""),
                "code": occ.get("code", ""),
            })

        return {
            "skill": skill,
            "related_occupations": occupations,
            "source": "onet_api",
        }
    except Exception:
        return {}


# ──────────────────────────────────────────────
#  roadmap.sh – learning path scraping
# ──────────────────────────────────────────────

ROADMAP_SH_BASE = "https://roadmap.sh"


def fetch_roadmap_paths() -> Dict[str, List[Dict[str, Any]]]:
    key = "roadmap:all_paths"
    cached = cache_get("roadmap", key)
    if cached is not None:
        return cached

    paths = {}
    try:
        import feedparser
        feed_url = f"{ROADMAP_SH_BASE}/rss/roadmaps.xml"
        feed = feedparser.parse(feed_url)
        for entry in feed.entries[:20]:
            title = entry.get("title", "")
            link = entry.get("link", "")
            if title and link:
                slug = link.rstrip("/").split("/")[-1]
                paths[slug] = {
                    "title": title,
                    "url": link,
                    "skills": _scrape_roadmap_skills(link),
                }
    except Exception:
        paths["error"] = "roadmap.sh feed unavailable"
    cache_set("roadmap", key, paths)
    return paths


def _scrape_roadmap_skills(url: str) -> List[str]:
    try:
        import feedparser
        resp_url = url.rstrip("/") + "/rss.xml"
        feed = feedparser.parse(resp_url)
        return [e.get("title", "").lower().strip() for e in feed.entries if e.get("title")]
    except Exception:
        return []


def fetch_roadmap_for_skill(skill: str) -> Dict[str, Any]:
    key = f"roadmap:{skill}"
    cached = cache_get("roadmap", key)
    if cached is not None:
        return cached

    result = {"skill": skill, "roadmaps": [], "prerequisites": [], "related": []}
    try:
        import feedparser
        feed_url = f"{ROADMAP_SH_BASE}/rss/roadmaps.xml"
        feed = feedparser.parse(feed_url)
        for entry in feed.entries:
            title = entry.get("title", "") or ""
            link = entry.get("link", "") or ""
            if skill.lower() in title.lower():
                result["roadmaps"].append({
                    "title": title.strip(),
                    "url": link,
                })
                slug = link.rstrip("/").split("/")[-1] if link else ""
                if slug:
                    rss_url = f"{ROADMAP_SH_BASE}/{slug}/rss.xml"
                    sub_feed = feedparser.parse(rss_url)
                    for sub_entry in sub_feed.entries:
                        st = (sub_entry.get("title") or "").lower().strip()
                        if st:
                            result["related"].append(st)
                    result["prerequisites"] = _extract_prereqs_from_roadmap(slug)
    except Exception:
        pass
    cache_set("roadmap", key, result)
    return result


def _extract_prereqs_from_roadmap(slug: str) -> List[str]:
    try:
        url = f"{ROADMAP_SH_BASE}/{slug}/rss.xml"
        import feedparser
        feed = feedparser.parse(url)
        return [e.get("title", "").lower().strip() for e in feed.entries if e.get("title")]
    except Exception:
        return []


# ──────────────────────────────────────────────
#  YouTube Data API
# ──────────────────────────────────────────────

def fetch_youtube_videos(skill: str, max_results: int = 3) -> List[Dict[str, str]]:
    key = f"yt:{skill}:{max_results}"
    cached = cache_get("youtube", key)
    if cached is not None:
        return cached

    if not Config.has_youtube_key():
        return []

    try:
        q = urllib.parse.quote_plus(skill)
        url = (
            f"https://www.googleapis.com/youtube/v3/search"
            f"?part=snippet&q={q}&maxResults={max_results}"
            f"&type=video&key={Config.YOUTUBE_API_KEY}"
        )
        with urllib.request.urlopen(url, timeout=10) as resp:
            data = json.load(resp)

        items = []
        for it in data.get("items", []):
            snip = it.get("snippet", {})
            video_id = (it.get("id") or {}).get("videoId")
            if not video_id:
                continue
            items.append({
                "title": snip.get("title"),
                "channel": snip.get("channelTitle"),
                "url": f"https://youtu.be/{video_id}",
                "type": "youtube",
            })
        cache_set("youtube", key, items)
        return items
    except Exception:
        return []


# ──────────────────────────────────────────────
#  Google Books API
# ──────────────────────────────────────────────

def fetch_books(skill: str, max_results: int = 3) -> List[Dict[str, Any]]:
    key = f"gb:{skill}:{max_results}"
    cached = cache_get("books", key)
    if cached is not None:
        return cached

    try:
        q = urllib.parse.quote_plus(skill)
        url = f"https://www.googleapis.com/books/v1/volumes?q={q}&maxResults={max_results}"
        if Config.GOOGLE_BOOKS_API_KEY:
            url += f"&key={Config.GOOGLE_BOOKS_API_KEY}"
        with urllib.request.urlopen(url, timeout=10) as resp:
            data = json.load(resp)

        items = []
        for it in data.get("items", []):
            info = it.get("volumeInfo", {})
            items.append({
                "title": info.get("title"),
                "authors": info.get("authors"),
                "publisher": info.get("publisher"),
                "infoLink": info.get("infoLink"),
                "type": "book",
            })
        cache_set("books", key, items)
        return items
    except Exception:
        return []


# ──────────────────────────────────────────────
#  Aggregate enrichment for a skill
# ──────────────────────────────────────────────

def enrich_skill(skill: str) -> Dict[str, Any]:
    result = {}

    videos = fetch_youtube_videos(skill)
    if videos:
        result["video_resources"] = videos

    books = fetch_books(skill)
    if books:
        result["book_resources"] = books

    esco = fetch_esco_info(skill)
    if esco:
        result["esco"] = esco

    onet = fetch_onet_info(skill)
    if onet:
        result["onet"] = onet

    roadmap = fetch_roadmap_for_skill(skill)
    if roadmap.get("roadmaps"):
        result["roadmaps"] = roadmap["roadmaps"]

    return result
