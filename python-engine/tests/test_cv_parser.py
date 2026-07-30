from cv_parser import extract_skills, SKILL_PATTERNS


def test_extract_skills_from_text():
    text = "Experienced in Python, React, and AWS cloud services"
    skills = extract_skills(text)
    assert 'python' in skills
    assert 'react' in skills
    assert 'aws' in skills


def test_extract_skills_returns_sorted():
    skills = extract_skills("docker kubernetes python sql")
    assert skills == sorted(skills)


def test_extract_skills_returns_unique():
    text = "python python PYTHON Python"
    skills = extract_skills(text)
    assert skills.count('python') == 1


def test_extract_skills_case_insensitive():
    text = "DJANGO and TensorFlow and PyTorch"
    skills = extract_skills(text)
    assert 'django' in skills
    assert 'tensorflow' in skills
    assert 'pytorch' in skills


def test_extract_skills_empty_text():
    skills = extract_skills("")
    assert skills == []


def test_extract_skills_no_match():
    skills = extract_skills("I like pizza and cats")
    assert skills == []


def test_skill_patterns_defined():
    assert isinstance(SKILL_PATTERNS, dict)
    assert 'python' in SKILL_PATTERNS
    assert 'javascript' in SKILL_PATTERNS
    assert 'docker' in SKILL_PATTERNS


def test_extract_skills_data_science_text():
    text = "Data science expert with pandas, numpy, scikit-learn, and machine learning"
    skills = extract_skills(text)
    assert 'pandas' in skills
    assert 'numpy' in skills
    assert 'machine learning' in skills
