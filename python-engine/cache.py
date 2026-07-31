import time
from typing import Any, Dict, Optional

from config import Config

try:
    from pymongo import MongoClient
    from pymongo.errors import ConnectionFailure

    _MONGO_CLIENT: Optional[MongoClient] = None
    _MONGO_AVAILABLE = False

    try:
        _MONGO_CLIENT = MongoClient(Config.MONGO_URI, serverSelectionTimeoutMS=2000)
        _MONGO_CLIENT.admin.command("ping")
        _MONGO_AVAILABLE = True
    except (ConnectionFailure, Exception):
        _MONGO_CLIENT = None
        _MONGO_AVAILABLE = False
except ImportError:
    _MONGO_CLIENT = None
    _MONGO_AVAILABLE = False


_MEMORY_CACHE: Dict[str, Dict[str, Any]] = {}
_MEMORY_TTL = Config.CACHE_TTL


def _mem_get(key: str):
    entry = _MEMORY_CACHE.get(key)
    if not entry:
        return None
    if time.time() - entry.get("ts", 0) > _MEMORY_TTL:
        _MEMORY_CACHE.pop(key, None)
        return None
    return entry.get("value")


def _mem_set(key: str, value: Any):
    _MEMORY_CACHE[key] = {"ts": time.time(), "value": value}


def _mongo_get(collection: str, key: str):
    if not _MONGO_AVAILABLE or _MONGO_CLIENT is None:
        return None
    try:
        db = _MONGO_CLIENT[Config.MONGO_DB_NAME]
        doc = db[collection].find_one({"_id": key})
        if doc and time.time() - doc.get("ts", 0) <= _MEMORY_TTL:
            return doc.get("value")
    except Exception:
        pass
    return None


def _mongo_set(collection: str, key: str, value: Any):
    if not _MONGO_AVAILABLE or _MONGO_CLIENT is None:
        return
    try:
        db = _MONGO_CLIENT[Config.MONGO_DB_NAME]
        db[collection].replace_one(
            {"_id": key},
            {"_id": key, "ts": time.time(), "value": value},
            upsert=True,
        )
    except Exception:
        pass


def cache_get(collection: str, key: str):
    val = _mongo_get(collection, key)
    if val is not None:
        _mem_set(f"{collection}:{key}", val)
        return val
    return _mem_get(f"{collection}:{key}")


def cache_set(collection: str, key: str, value: Any):
    _mem_set(f"{collection}:{key}", value)
    _mongo_set(collection, key, value)


def is_mongo_connected():
    return _MONGO_AVAILABLE
