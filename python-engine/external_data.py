import requests
from typing import Any, Dict, List


YOUTUBE_API = "https://inv.nadeko.net/api/v1/search"
OPENLIBRARY_API = "https://openlibrary.org/search.json"


YOUTUBE_INVIDIOUS_INSTANCES = [
    "https://inv.nadeko.net",
    "https://yewtu.be",
    "https://invidious.projectsegfau.lt",
]


def fetch_youtube_videos(skill: str, max_results: int = 5) -> List[Dict[str, str]]:
    for instance in YOUTUBE_INVIDIOUS_INSTANCES:
        try:
            resp = requests.get(
                f"{instance}/api/v1/search",
                params={"q": f"{skill} tutorial", "type": "video"},
                timeout=5,
            )
            if resp.status_code == 200:
                data = resp.json()
                videos = []
                for item in data[:max_results]:
                    video_id = item.get("videoId")
                    if video_id:
                        videos.append({
                            "title": item.get("title", ""),
                            "videoId": video_id,
                            "url": f"https://www.youtube.com/watch?v={video_id}",
                            "author": item.get("author", ""),
                            "length": item.get("lengthSeconds", 0),
                        })
                if videos:
                    return videos
        except Exception:
            continue
    return [
        {
            "title": f"Search YouTube for {skill} tutorials",
            "videoId": "",
            "url": f"https://www.youtube.com/results?search_query={skill}+tutorial",
            "author": "YouTube",
            "length": 0,
        }
    ]


def fetch_books(skill: str, max_results: int = 5) -> List[Dict[str, Any]]:
    try:
        resp = requests.get(
            OPENLIBRARY_API,
            params={"q": f"learn {skill} programming", "limit": max_results},
            timeout=8,
        )
        if resp.status_code == 200:
            data = resp.json()
            books = []
            for doc in data.get("docs", [])[:max_results]:
                cover_id = doc.get("cover_i")
                books.append({
                    "title": doc.get("title", ""),
                    "author": ", ".join(doc.get("author_name", [])),
                    "year": doc.get("first_publish_year"),
                    "cover_url": f"https://covers.openlibrary.org/b/id/{cover_id}-M.jpg" if cover_id else None,
                    "url": f"https://openlibrary.org{doc.get('key', '')}" if doc.get("key") else None,
                })
            return books
    except Exception:
        pass
    return []


def fetch_esco_info(skill: str) -> Dict[str, Any]:
    return {}


def fetch_onet_info(skill: str) -> Dict[str, Any]:
    return {}


def fetch_roadmap_for_skill(skill: str) -> Dict[str, Any]:
    return {"skill": skill, "roadmaps": [], "prerequisites": [], "related": []}


def enrich_skill(skill: str) -> Dict[str, Any]:
    return {}
