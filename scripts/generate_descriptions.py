"""
Generates realistic job descriptions from job title + skills.
No API key needed. Works for all rows instantly.
"""

import csv
import random

INPUT_CSV = r"C:\Users\LEGION\Desktop\SkillSync-main\SkillSync-main\jobs_dataset_augmented.csv"
OUTPUT_CSV = r"C:\Users\LEGION\Desktop\SkillSync-main\SkillSync-main\jobs_dataset_with_desc.csv"

OPENERS = [
    "We are looking for a talented {title} to join our growing team.",
    "{company} is hiring a {title} to help build and scale our platform.",
    "We are seeking an experienced {title} to drive key technical initiatives.",
    "An exciting opportunity for a {title} has opened at {company}.",
    "{company} is looking for a skilled {title} to join our engineering team.",
    "We have an immediate opening for a {title} at {company}.",
    "{company} is seeking a motivated {title} to contribute to our mission.",
    "Join {company} as a {title} and work on impactful projects.",
]

RESPONSIBILITIES = {
    "backend_developer": [
        "Design and implement scalable RESTful APIs and microservices.",
        "Optimize database queries and ensure system reliability.",
        "Collaborate with frontend teams to integrate user-facing elements.",
        "Participate in code reviews and maintain high code quality standards.",
        "Troubleshoot and resolve production issues in a timely manner.",
    ],
    "frontend_developer": [
        "Build responsive and accessible user interfaces using modern frameworks.",
        "Collaborate with UX designers to implement pixel-perfect designs.",
        "Optimize application performance and ensure cross-browser compatibility.",
        "Write clean, maintainable, and well-tested frontend code.",
        "Contribute to the component library and design system.",
    ],
    "full_stack_developer": [
        "Develop and maintain both client-side and server-side code.",
        "Design and implement end-to-end features across the stack.",
        "Ensure seamless integration between frontend and backend systems.",
        "Participate in architectural decisions and technology selection.",
        "Write unit and integration tests for both frontend and backend.",
    ],
    "data_scientist": [
        "Analyze large datasets to extract actionable business insights.",
        "Build and validate predictive models using machine learning techniques.",
        "Design experiments and A/B tests to measure business impact.",
        "Communicate findings to stakeholders through visualizations and reports.",
        "Develop data pipelines and ensure data quality and consistency.",
    ],
    "data_analyst": [
        "Create dashboards and reports to track key business metrics.",
        "Perform exploratory data analysis to identify trends and patterns.",
        "Collaborate with cross-functional teams to define data requirements.",
        "Clean and transform raw data for analysis and reporting.",
        "Present data-driven recommendations to stakeholders.",
    ],
    "data_engineer": [
        "Design and build scalable data pipelines and ETL processes.",
        "Manage and optimize data warehouse infrastructure.",
        "Ensure data quality, reliability, and availability across systems.",
        "Implement monitoring and alerting for data pipeline health.",
        "Collaborate with data scientists to productionize ML models.",
    ],
    "machine_learning_engineer": [
        "Develop and deploy machine learning models to production.",
        "Optimize model performance and scalability for real-time inference.",
        "Build feature engineering pipelines and manage model lifecycle.",
        "Stay current with latest ML research and incorporate relevant techniques.",
        "Collaborate with product teams to identify ML-driven opportunities.",
    ],
    "cloud_engineer": [
        "Design and manage cloud infrastructure on major cloud providers.",
        "Implement infrastructure as code using Terraform or CloudFormation.",
        "Set up monitoring, alerting, and incident response systems.",
        "Optimize cloud costs while maintaining performance and reliability.",
        "Automate deployment processes and improve CI/CD pipelines.",
    ],
    "cybersecurity_analyst": [
        "Monitor security events and respond to incidents promptly.",
        "Conduct vulnerability assessments and penetration testing.",
        "Develop and enforce security policies and best practices.",
        "Perform threat hunting and analyze security logs.",
        "Collaborate with engineering teams to remediate security findings.",
    ],
    "devops_engineer": [
        "Build and maintain CI/CD pipelines for automated deployments.",
        "Manage containerized applications using Docker and Kubernetes.",
        "Implement monitoring, logging, and alerting solutions.",
        "Automate infrastructure provisioning and configuration management.",
        "Ensure high availability and disaster recovery for production systems.",
    ],
    "software_engineer": [
        "Develop and maintain production software systems.",
        "Write clean, well-documented code following best practices.",
        "Participate in agile ceremonies and contribute to sprint planning.",
        "Debug and resolve complex technical issues across the stack.",
        "Mentor junior engineers and contribute to team growth.",
    ],
    "other": [
        "Provide technical support and troubleshooting for internal systems.",
        "Document processes and create knowledge base articles.",
        "Collaborate with vendors and manage third-party integrations.",
        "Assist in system upgrades and maintenance activities.",
        "Monitor system performance and respond to alerts.",
    ],
}

REQUIREMENTS_PREFIX = [
    "The ideal candidate will have experience with",
    "Required qualifications include proficiency in",
    "We are looking for someone with strong knowledge of",
    "Candidates should have hands-on experience with",
    "The successful applicant will have expertise in",
]

BONUS_SKILLS = [
    "experience with Agile methodologies",
    "strong problem-solving and analytical skills",
    "excellent written and verbal communication skills",
    "a bachelor's degree in Computer Science or related field",
    "the ability to work independently and as part of a team",
    "experience working in a fast-paced startup environment",
    "a passion for continuous learning and professional growth",
    "strong attention to detail and organizational skills",
]


def generate_description(title, company, role_cat, skills):
    opener = random.choice(OPENERS).format(title=title, company=company)
    resp = random.sample(RESPONSIBILITIES.get(role_cat, RESPONSIBILITIES["other"]), k=min(3, len(RESPONSIBILITIES.get(role_cat, RESPONSIBILITIES["other"]))))
    skills_text = ", ".join(skills[:5])
    if len(skills) > 5:
        skills_text += f", and {skills[-1]}"
    req_prefix = random.choice(REQUIREMENTS_PREFIX)
    bonus = random.choice(BONUS_SKILLS)

    desc = f"{opener}\n\n"
    desc += "Key Responsibilities:\n"
    for r in resp:
        desc += f"  - {r}\n"
    desc += f"\n{req_prefix} {skills_text}. {bonus}."
    return desc


def main():
    print(f"Reading {INPUT_CSV}...")
    with open(INPUT_CSV, "r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    print(f"Generating descriptions for {len(rows)} rows...")
    for row in rows:
        skills = [s.strip() for s in row["skills_str"].split(",") if s.strip()]
        desc = generate_description(
            title=row["job_title"],
            company=row["company"],
            role_cat=row["role_category"],
            skills=skills,
        )
        row["job_description"] = desc

    fieldnames = list(rows[0].keys())
    with open(OUTPUT_CSV, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"Saved {len(rows)} rows with descriptions to {OUTPUT_CSV}")
    print(f"Sample description:\n")
    print(rows[0]["job_description"][:300])


if __name__ == "__main__":
    main()
