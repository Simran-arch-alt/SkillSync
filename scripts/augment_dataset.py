import csv
import random
import re

INPUT_CSV = r"C:\Users\LEGION\Desktop\SkillSync-main\SkillSync-main\jobs_dataset_skills_final.csv"
OUTPUT_CSV = r"C:\Users\LEGION\Desktop\SkillSync-main\SkillSync-main\jobs_dataset_augmented.csv"
TARGET_ROWS = 10000

TECH_COMPANIES = [
    "Google", "Microsoft", "Amazon", "Meta", "Apple", "Netflix", "Spotify",
    "Uber", "Airbnb", "Twitter", "LinkedIn", "Salesforce", "Adobe", "Intel",
    "IBM", "Oracle", "Cisco", "Dell", "HPE", "SAP", "Accenture", "Capgemini",
    "Infosys", "TCS", "Wipro", "HCL", "Tech Mahindra", "Cognizant",
    "JP Morgan Chase", "Goldman Sachs", "Bloomberg", "Palantir", "Stripe",
    "Square", "PayPal", "Shopify", "Twilio", "Datadog", "Snowflake",
    "Databricks", "Coinbase", "Robinhood", "Nvidia", "AMD", "Qualcomm",
    "Atlassian", "GitLab", "HashiCorp", "Elastic", "MongoDB", "Red Hat",
    "VMware", "Splunk", "ServiceNow", "Workday", "DocuSign", "Zoom",
    "Slack", "Dropbox", "Okta", "CrowdStrike", "Cloudflare", "Fastly",
]

CITIES = [
    "San Francisco, CA", "New York, NY", "Seattle, WA", "Austin, TX",
    "Boston, MA", "Chicago, IL", "Los Angeles, CA", "Denver, CO",
    "Atlanta, GA", "Portland, OR", "Dallas, TX", "Houston, TX",
    "Miami, FL", "San Diego, CA", "Washington, DC", "Palo Alto, CA",
    "Mountain View, CA", "Cupertino, CA", "Sunnyvale, CA", "Raleigh, NC",
]

TITLE_TEMPLATES = {
    "backend_developer": [
        "{seniority} Backend Developer", "{seniority} Backend Engineer",
        "Backend Software Engineer", "Server-Side Developer",
        "{seniority} API Developer", "Backend Systems Engineer",
    ],
    "frontend_developer": [
        "{seniority} Frontend Developer", "{seniority} Frontend Engineer",
        "UI Developer", "Frontend Software Engineer",
        "{seniority} Web Developer", "React Developer",
    ],
    "full_stack_developer": [
        "{seniority} Full Stack Developer", "{seniority} Full Stack Engineer",
        "Full Stack Software Engineer", "Web Developer",
    ],
    "data_scientist": [
        "{seniority} Data Scientist", "{seniority} Data Science Engineer",
        "Applied Scientist", "Research Scientist",
    ],
    "data_analyst": [
        "{seniority} Data Analyst", "Business Intelligence Analyst",
        "{seniority} Analytics Engineer", "Reporting Analyst",
    ],
    "data_engineer": [
        "{seniority} Data Engineer", "{seniority} Data Pipeline Engineer",
        "Big Data Engineer", "ETL Developer",
    ],
    "machine_learning_engineer": [
        "{seniority} Machine Learning Engineer", "{seniority} ML Engineer",
        "AI Engineer", "Deep Learning Engineer",
    ],
    "cloud_engineer": [
        "{seniority} Cloud Engineer", "{seniority} Cloud Architect",
        "Cloud Solutions Engineer", "DevOps Cloud Engineer",
    ],
    "cybersecurity_analyst": [
        "{seniority} Security Analyst", "{seniority} Cybersecurity Engineer",
        "SOC Analyst", "Information Security Engineer",
    ],
    "devops_engineer": [
        "{seniority} DevOps Engineer", "{seniority} Site Reliability Engineer",
        "Platform Engineer", "Release Engineer",
    ],
    "software_engineer": [
        "{seniority} Software Engineer", "{seniority} Software Developer",
        "Software Development Engineer", "Generalist Software Engineer",
    ],
    "other": [
        "{seniority} Technical Support Engineer", "{seniority} Solutions Engineer",
        "Systems Administrator", "IT Support Specialist",
    ],
}

ROLE_CATEGORIES = list(TITLE_TEMPLATES.keys())

SENIORITY_LEVELS = [
    ("junior", 1), ("", 3), ("mid", 2), ("senior", 4),
    ("lead", 1), ("staff", 1), ("principal", 1), ("manager", 1),
]

SKILL_WEIGHTS = {
    "python": 0.9, "java": 0.8, "javascript": 0.8, "c++": 0.5, "go": 0.4,
    "rust": 0.2, "typescript": 0.6, "sql": 0.8, "html": 0.6, "css": 0.6,
    "react": 0.6, "angular": 0.4, "node.js": 0.5, "django": 0.3, "flask": 0.3,
    "spring": 0.3, "aws": 0.7, "azure": 0.5, "gcp": 0.3, "docker": 0.6,
    "kubernetes": 0.5, "git": 0.7, "linux": 0.5, "excel": 0.4, "tableau": 0.4,
    "pandas": 0.4, "machine learning": 0.5, "deep learning": 0.3,
    "tensorflow": 0.4, "pytorch": 0.3, "rest api": 0.5, "graphql": 0.2,
    "power bi": 0.3, "scikit-learn": 0.3, "numpy": 0.4, "spark": 0.3,
    "kafka": 0.2, "mongodb": 0.4, "postgresql": 0.4, "redis": 0.2,
    "ci/cd": 0.3, "terraform": 0.3, "ansible": 0.2, "jenkins": 0.2,
}

ROLE_SKILL_AFFINITY = {
    "backend_developer": ["python", "java", "go", "rust", "sql", "node.js",
        "aws", "docker", "kubernetes", "git", "linux", "rest api", "spring",
        "django", "flask", "mongodb", "postgresql", "redis", "kafka", "ci/cd"],
    "frontend_developer": ["javascript", "typescript", "react", "angular",
        "html", "css", "git", "rest api", "graphql", "aws"],
    "full_stack_developer": ["python", "java", "javascript", "typescript",
        "react", "angular", "html", "css", "sql", "node.js", "git",
        "docker", "aws", "rest api", "mongodb", "postgresql"],
    "data_scientist": ["python", "sql", "machine learning", "deep learning",
        "tensorflow", "pytorch", "pandas", "numpy", "scikit-learn",
        "spark", "aws", "git", "tableau", "excel"],
    "data_analyst": ["python", "sql", "excel", "tableau", "power bi",
        "pandas", "numpy", "aws", "git"],
    "data_engineer": ["python", "sql", "java", "scala", "spark", "kafka",
        "aws", "azure", "docker", "kubernetes", "git", "linux",
        "mongodb", "postgresql", "airflow"],
    "machine_learning_engineer": ["python", "machine learning", "deep learning",
        "tensorflow", "pytorch", "pandas", "numpy", "scikit-learn",
        "sql", "docker", "kubernetes", "aws", "git", "linux",
        "spark", "kafka", "rest api"],
    "cloud_engineer": ["aws", "azure", "gcp", "docker", "kubernetes",
        "terraform", "ansible", "ci/cd", "jenkins", "linux",
        "python", "git", "rest api"],
    "cybersecurity_analyst": ["python", "linux", "aws", "azure",
        "docker", "kubernetes", "git", "sql"],
    "devops_engineer": ["docker", "kubernetes", "aws", "azure", "gcp",
        "terraform", "ansible", "ci/cd", "jenkins", "linux",
        "python", "git", "rest api"],
    "software_engineer": ["python", "java", "c++", "go", "javascript",
        "typescript", "sql", "git", "linux", "aws", "docker",
        "rest api", "react", "node.js"],
    "other": ["python", "sql", "excel", "git", "linux", "aws", "docker"],
}

def pick_skills_for_role(role_category):
    pool = ROLE_SKILL_AFFINITY.get(role_category, [])
    if not pool:
        return random.sample(list(SKILL_WEIGHTS.keys()), random.randint(3, 8))

    num = random.choices([3, 4, 5, 6, 7, 8, 9, 10], weights=[5, 10, 20, 25, 20, 10, 5, 5])[0]
    chosen = set()
    weights = [SKILL_WEIGHTS.get(s, 0.5) for s in pool]
    total = sum(weights)
    probs = [w / total for w in weights]

    while len(chosen) < min(num, len(pool)):
        skill = random.choices(pool, weights=probs, k=1)[0]
        chosen.add(skill)

    return sorted(chosen)


def generate_row(seed_row=None):
    if seed_row and random.random() < 0.3:
        role_cat = seed_row["role_category"]
    else:
        role_cat = random.choices(ROLE_CATEGORIES, weights=[
            12, 10, 3, 14, 7, 4, 13, 9, 8, 5, 13, 2
        ])[0]

    seniority = random.choices(
        [s for s, _ in SENIORITY_LEVELS],
        weights=[w for _, w in SENIORITY_LEVELS],
        k=1
    )[0]

    templates = TITLE_TEMPLATES.get(role_cat, ["{seniority} Developer"])
    template = random.choice(templates)
    if seniority:
        title = template.replace("{seniority}", seniority.capitalize())
    else:
        title = template.replace("{seniority} ", "")

    company = random.choice(TECH_COMPANIES)
    location = random.choice(CITIES)
    is_remote = random.choices(["yes", "no", "yes"], weights=[6, 2, 2])[0]
    seniority_level = seniority
    is_aggregator = "no"

    skills = pick_skills_for_role(role_cat)
    skills_str = ", ".join(skills)

    return {
        "job_title": title,
        "company": company,
        "location": location,
        "is_remote": is_remote,
        "role_category": role_cat,
        "seniority_level": seniority_level,
        "is_aggregator": is_aggregator,
        "skills_str": skills_str,
    }


def main():
    with open(INPUT_CSV, "r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        real_rows = list(reader)

    print(f"Loaded {len(real_rows)} real rows from {INPUT_CSV}")

    all_rows = list(real_rows)
    needed = TARGET_ROWS - len(all_rows)

    if needed <= 0:
        print(f"Already have {len(all_rows)} rows, no augmentation needed.")
        return

    print(f"Generating {needed} synthetic rows...")

    while len(all_rows) < TARGET_ROWS:
        seed = random.choice(real_rows) if random.random() < 0.5 else None
        row = generate_row(seed)
        all_rows.append(row)

        if len(all_rows) % 1000 == 0:
            print(f"  Generated {len(all_rows) - len(real_rows)} / {needed}")

    fieldnames = [
        "job_title", "company", "location", "is_remote",
        "role_category", "seniority_level", "is_aggregator", "skills_str",
    ]

    with open(OUTPUT_CSV, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(all_rows)

    print(f"Saved {len(all_rows)} rows to {OUTPUT_CSV}")
    print(f"  Real: {len(real_rows)}")
    print(f"  Synthetic: {needed}")


if __name__ == "__main__":
    main()
