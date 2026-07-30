"""
Usage:
  1. Set your RAPIDAPI_KEY below or as env var
  2. python scripts/fetch_job_descriptions.py

Fetches real job descriptions from JSearch and enriches your CSV.
"""

import csv
import os
import time
import requests
import json

INPUT_CSV = r"C:\Users\LEGION\Desktop\SkillSync-main\SkillSync-main\jobs_dataset_augmented.csv"
OUTPUT_CSV = r"C:\Users\LEGION\Desktop\SkillSync-main\SkillSync-main\jobs_dataset_with_desc.csv"

# Get from https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch
RAPIDAPI_KEY = os.getenv("971d08748bmshcb0d24f4b4388e8p106616jsna3ef3374600f", "971d08748bmshcb0d24f4b4388e8p106616jsna3ef3374600f")

SEARCH_URL = "https://jsearch.p.rapidapi.com/search"
HEADERS = {
    "x-rapidapi-host": "jsearch.p.rapidapi.com",
    "x-rapidapi-key": RAPIDAPI_KEY,
}

ROLE_QUERIES = {
    "backend_developer": "backend developer",
    "frontend_developer": "frontend developer",
    "full_stack_developer": "full stack developer",
    "data_scientist": "data scientist",
    "data_analyst": "data analyst",
    "data_engineer": "data engineer",
    "machine_learning_engineer": "machine learning engineer",
    "cloud_engineer": "cloud engineer",
    "cybersecurity_analyst": "cybersecurity analyst",
    "devops_engineer": "devops engineer",
    "software_engineer": "software engineer",
}

def search_jobs(query, num_pages=3):
    descriptions = []
    for page in range(1, num_pages + 1):
        params = {
            "query": query,
            "page": page,
            "num_pages": 1,
            "country": "us",
        }
        try:
            resp = requests.get(SEARCH_URL, headers=HEADERS, params=params, timeout=15)
            if resp.status_code == 429:
                print(f"  Rate limited. Waiting 10s...")
                time.sleep(10)
                continue
            resp.raise_for_status()
            data = resp.json().get("data", [])
            for job in data:
                desc = job.get("job_description", "").strip()
                if desc and len(desc) > 50:
                    descriptions.append({
                        "job_title": job.get("job_title", ""),
                        "company": job.get("employer_name", ""),
                        "description": desc,
                    })
            print(f"  Page {page}: got {len(data)} jobs")
            time.sleep(0.5)
        except Exception as e:
            print(f"  Error on page {page}: {e}")
    return descriptions


def main():
    if RAPIDAPI_KEY == "YOUR_KEY_HERE":
        print("ERROR: Set your RAPIDAPI_KEY first!")
        print("  Option 1: Edit this file and replace YOUR_KEY_HERE")
        print("  Option 2: $env:RAPIDAPI_KEY = 'your_key'")
        return

    print("Fetching job descriptions from JSearch...")
    all_descriptions = {}
    for role, query in ROLE_QUERIES.items():
        print(f"\n{role} ({query})...")
        results = search_jobs(query)
        for r in results:
            key = (r["job_title"].lower(), r["company"].lower())
            if key not in all_descriptions:
                all_descriptions[key] = r["description"]
        print(f"  Total unique so far: {len(all_descriptions)}")

    print(f"\nFetched {len(all_descriptions)} unique descriptions total.")

    print(f"\nReading {INPUT_CSV}...")
    with open(INPUT_CSV, "r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    matched = 0
    for row in rows:
        key = (row["job_title"].strip().lower(), row["company"].strip().lower())
        if key in all_descriptions:
            row["job_description"] = all_descriptions[key]
            matched += 1
        else:
            row["job_description"] = ""

    fieldnames = list(rows[0].keys()) if rows else []
    if "job_description" not in fieldnames:
        fieldnames.append("job_description")

    with open(OUTPUT_CSV, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"Matched {matched} / {len(rows)} rows with real descriptions.")
    print(f"Saved to {OUTPUT_CSV}")


if __name__ == "__main__":
    main()
