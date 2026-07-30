"""
Adds synthetic rows for underrepresented role categories so each has >= 200.
Appends to the existing CSV with descriptions, then regenerates descriptions.
"""

import csv
import random

INPUT_CSV = r"C:\Users\LEGION\Desktop\SkillSync-main\SkillSync-main\jobs_dataset_with_desc.csv"
OUTPUT_CSV = r"C:\Users\LEGION\Desktop\SkillSync-main\SkillSync-main\jobs_dataset_with_desc.csv"
TARGET_PER_CATEGORY = 200

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
    "Northrop Grumman", "Raytheon", "Lockheed Martin", "Boeing",
    "JPMorgan", "Bank of America", "Wells Fargo", "Capital One",
]

CITIES = [
    "San Francisco, CA", "New York, NY", "Seattle, WA", "Austin, TX",
    "Boston, MA", "Chicago, IL", "Los Angeles, CA", "Denver, CO",
    "Atlanta, GA", "Portland, OR", "Dallas, TX", "Houston, TX",
    "Miami, FL", "San Diego, CA", "Washington, DC", "Palo Alto, CA",
    "Mountain View, CA", "Cupertino, CA", "Sunnyvale, CA", "Raleigh, NC",
    "Arlington, VA", "Baltimore, MD", "Phoenix, AZ", "Minneapolis, MN",
]

TITLE_TEMPLATES = {
    "web_developer": [
        "{seniority} Web Developer", "{seniority} Web Engineer",
        "Web Programmer", "{seniority} Website Developer",
        "Web Application Developer",
    ],
    "network_engineer": [
        "{seniority} Network Engineer", "{seniority} Network Administrator",
        "Network Architect", "{seniority} Network Operations Engineer",
        "Infrastructure Network Engineer",
    ],
    "systems_engineer": [
        "{seniority} Systems Engineer", "{seniority} Systems Administrator",
        "Infrastructure Engineer", "{seniority} IT Systems Engineer",
        "Systems Architect",
    ],
    "security_analyst": [
        "{seniority} Security Analyst", "{seniority} Information Security Analyst",
        "Security Operations Analyst", "{seniority} Threat Analyst",
        "Security Compliance Analyst",
    ],
    "ai_engineer": [
        "{seniority} AI Engineer", "{seniority} Artificial Intelligence Engineer",
        "AI Specialist", "{seniority} AI/ML Engineer",
        "AI Solutions Engineer",
    ],
    "platform_engineer": [
        "{seniority} Platform Engineer", "{seniority} Platform Architect",
        "Internal Tools Engineer", "{seniority} Developer Experience Engineer",
        "Platform Infrastructure Engineer",
    ],
    "mlops_engineer": [
        "{seniority} MLOps Engineer", "{seniority} ML Infrastructure Engineer",
        "Model Deployment Engineer", "{seniority} ML Platform Engineer",
        "ML DevOps Engineer",
    ],
}

ROLE_SKILL_AFFINITY = {
    "web_developer": ["javascript", "typescript", "html", "css", "react",
        "angular", "node.js", "git", "rest api", "aws", "sql",
        "python", "php", "graphql"],
    "network_engineer": ["linux", "aws", "azure", "docker", "kubernetes",
        "python", "git", "ci/cd", "terraform", "ansible"],
    "systems_engineer": ["linux", "python", "aws", "azure", "docker",
        "kubernetes", "git", "sql", "terraform", "ansible", "ci/cd"],
    "security_analyst": ["python", "linux", "aws", "azure",
        "docker", "kubernetes", "git", "sql", "rest api"],
    "ai_engineer": ["python", "machine learning", "deep learning",
        "tensorflow", "pytorch", "pandas", "numpy", "scikit-learn",
        "sql", "docker", "kubernetes", "aws", "git", "nlp", "rest api"],
    "platform_engineer": ["python", "go", "aws", "azure", "gcp",
        "docker", "kubernetes", "terraform", "ci/cd", "git",
        "linux", "rest api", "graphql"],
    "mlops_engineer": ["python", "docker", "kubernetes", "aws", "azure",
        "terraform", "ci/cd", "jenkins", "linux", "git",
        "machine learning", "tensorflow", "pytorch"],
}

SENIORITY_LEVELS = [
    ("junior", 1), ("", 3), ("mid", 2), ("senior", 4),
    ("lead", 1), ("staff", 1), ("principal", 1), ("manager", 1),
]

DESCRIPTION_TEMPLATES = [
    "We are looking for a talented {title} to join our team at {company}.",
    "{company} is seeking a skilled {title} to support our growing infrastructure.",
    "An exciting opportunity for a {title} has opened at {company}.",
    "Join {company} as a {title} and make an impact on critical systems.",
]

RESPONSIBILITIES = {
    "web_developer": [
        "Build and maintain responsive websites and web applications.",
        "Collaborate with designers to implement pixel-perfect interfaces.",
        "Ensure cross-browser compatibility and web performance optimization.",
    ],
    "network_engineer": [
        "Design, configure, and maintain network infrastructure.",
        "Monitor network performance and troubleshoot connectivity issues.",
        "Implement network security policies and disaster recovery plans.",
    ],
    "systems_engineer": [
        "Manage and maintain server infrastructure and operating systems.",
        "Automate system administration tasks using scripting.",
        "Ensure system reliability, security, and performance.",
    ],
    "security_analyst": [
        "Monitor security events and respond to incidents.",
        "Conduct vulnerability assessments and security audits.",
        "Develop and enforce security policies and procedures.",
    ],
    "ai_engineer": [
        "Develop and deploy AI models for production use cases.",
        "Design and implement NLP and computer vision solutions.",
        "Optimize model performance and scalability.",
    ],
    "platform_engineer": [
        "Build and maintain internal developer platforms and tools.",
        "Design CI/CD pipelines and improve developer workflows.",
        "Ensure platform reliability, scalability, and observability.",
    ],
    "mlops_engineer": [
        "Build and maintain ML infrastructure and deployment pipelines.",
        "Automate model training, evaluation, and deployment workflows.",
        "Monitor model performance and manage model versioning.",
    ],
}


def generate_rows(role_cat, count):
    rows = []
    for _ in range(count):
        seniority = random.choices(
            [s for s, _ in SENIORITY_LEVELS],
            weights=[w for _, w in SENIORITY_LEVELS], k=1
        )[0]
        template = random.choice(TITLE_TEMPLATES.get(role_cat, ["{seniority} Developer"]))
        if seniority:
            title = template.replace("{seniority}", seniority.capitalize())
        else:
            title = template.replace("{seniority} ", "")

        company = random.choice(TECH_COMPANIES)
        location = random.choice(CITIES)
        is_remote = random.choices(["yes", "no", "yes"], weights=[6, 2, 2])[0]

        pool = ROLE_SKILL_AFFINITY.get(role_cat, ["python", "sql"])
        num = random.choices([3, 4, 5, 6, 7, 8], weights=[5, 10, 25, 25, 15, 10])[0]
        skills = sorted(random.sample(pool, min(num, len(pool))))
        skills_str = ", ".join(skills)

        opener = random.choice(DESCRIPTION_TEMPLATES).format(title=title, company=company)
        resp = random.sample(RESPONSIBILITIES.get(role_cat, RESPONSIBILITIES["web_developer"]), k=3)
        desc = opener + "\n\nKey Responsibilities:\n"
        for r in resp:
            desc += f"  - {r}\n"
        desc += f"\nThe ideal candidate will have experience with {', '.join(skills[:4])}."
        if len(skills) > 4:
            desc += f" Additional knowledge of {skills[-1]} is a plus."

        rows.append({
            "job_title": title,
            "company": company,
            "location": location,
            "is_remote": is_remote,
            "role_category": role_cat,
            "seniority_level": seniority,
            "is_aggregator": "no",
            "skills_str": skills_str,
            "job_description": desc,
        })
    return rows


def main():
    with open(INPUT_CSV, "r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        existing = list(reader)

    fieldnames = list(existing[0].keys()) if existing else []
    counts = {}
    for row in existing:
        cat = row["role_category"]
        counts[cat] = counts.get(cat, 0) + 1

    print("Current distribution:")
    for cat, cnt in sorted(counts.items(), key=lambda x: x[1]):
        print(f"  {cat}: {cnt}")

    needy = {cat: (TARGET_PER_CATEGORY - counts.get(cat, 0))
             for cat in TITLE_TEMPLATES
             if counts.get(cat, 0) < TARGET_PER_CATEGORY}

    if not needy:
        print("All categories already at or above target.")
        return

    total_new = sum(needy.values())
    print(f"\nNeed {total_new} additional rows:")
    for cat, need in needy.items():
        print(f"  {cat}: +{need}")

    for cat, need in needy.items():
        new_rows = generate_rows(cat, need)
        existing.extend(new_rows)
        print(f"  Added {need} {cat} rows")

    with open(OUTPUT_CSV, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(existing)

    print(f"\nSaved {len(existing)} rows to {OUTPUT_CSV}")
    for cat in sorted(set(list(counts.keys()) + list(TITLE_TEMPLATES.keys()))):
        cnt = sum(1 for r in existing if r["role_category"] == cat)
        print(f"  {cat}: {cnt}")


if __name__ == "__main__":
    main()
