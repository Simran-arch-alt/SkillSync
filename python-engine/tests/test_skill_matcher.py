from skill_matcher import extract_skills, SKILL_PATTERNS


def test_extract_skills_from_text():
    text = "I have experience with Python, SQL, and machine learning"
    skills = extract_skills(text)
    assert 'python' in skills
    assert 'sql' in skills
    assert 'machine learning' in skills


def test_extract_skills_returns_list():
    skills = extract_skills("nothing here")
    assert isinstance(skills, list)


def test_extract_skills_case_insensitive():
    text = "PYTHON and Javascript and Docker"
    skills = extract_skills(text)
    assert 'python' in skills
    assert 'javascript' in skills
    assert 'docker' in skills


def test_extract_skills_empty_text():
    skills = extract_skills("")
    assert skills == []


def test_extract_skills_no_match():
    skills = extract_skills("I like cats and dogs")
    assert skills == []


def test_extract_skills_partial_match():
    text = "I use typescript and angular"
    skills = extract_skills(text)
    assert 'typescript' in skills
    assert 'angular' in skills


def test_skill_patterns_defined():
    assert isinstance(SKILL_PATTERNS, dict)
    assert 'python' in SKILL_PATTERNS
    assert 'javascript' in SKILL_PATTERNS
    assert 'docker' in SKILL_PATTERNS


def test_extract_skills_data_science_text():
    text = "Data science expert with pandas, machine learning"
    skills = extract_skills(text)
    assert 'pandas' in skills
    assert 'machine learning' in skills
