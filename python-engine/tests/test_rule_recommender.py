import pytest
import pandas as pd
from rule_recommender import (
    normalize_text,
    parse_skill_list,
    load_job_dataset,
    RuleEngine,
    LearningPathGenerator,
    JobRole,
    SAMPLE_DATA,
)


class TestNormalizeText:
    def test_lowercase(self):
        assert normalize_text("PYTHON") == "python"

    def test_strips_special_chars(self):
        assert normalize_text("Node.js!") == "node js"

    def test_collapses_whitespace(self):
        assert normalize_text("  hello   world  ") == "hello world"

    def test_handles_none(self):
        assert normalize_text(None) == ""

    def test_handles_nan(self):
        assert normalize_text(float('nan')) == ""


class TestParseSkillList:
    def test_basic_parse(self):
        assert parse_skill_list("python, sql, docker") == ['docker', 'python', 'sql']

    def test_empty_string(self):
        assert parse_skill_list("") == []

    def test_none_input(self):
        assert parse_skill_list(None) == []

    def test_single_skill(self):
        assert parse_skill_list("python") == ["python"]

    def test_deduplicates(self):
        assert parse_skill_list("python, Python, PYTHON") == ["python"]


class TestLoadJobDataset:
    def test_loads_sample_data_when_no_csv(self):
        df = load_job_dataset("/nonexistent/path.csv")
        assert len(df) == len(SAMPLE_DATA)
        assert 'skills' in df.columns

    def test_skills_are_lists(self):
        df = load_job_dataset("/nonexistent/path.csv")
        for skills in df['skills']:
            assert isinstance(skills, list)

    def test_role_category_filled(self):
        df = load_job_dataset("/nonexistent/path.csv")
        assert df['role_category'].notna().all()


class TestRuleEngine:
    def setup_method(self):
        self.df = load_job_dataset("/nonexistent/path.csv")
        self.engine = RuleEngine(self.df)

    def test_builds_roles(self):
        assert len(self.engine.roles) > 0

    def test_roles_have_required_skills(self):
        for role in self.engine.roles:
            assert isinstance(role.required_skills, list)
            assert isinstance(role.preferred_skills, list)

    def test_evaluate_returns_results(self):
        result = self.engine.evaluate(["python", "sql"])
        assert 'rules_evaluated' in result
        assert 'rules' in result
        assert result['rules_evaluated'] > 0

    def test_evaluate_sorts_by_score(self):
        result = self.engine.evaluate(["python", "sql"])
        scores = [r['match_score'] for r in result['rules']]
        assert scores == sorted(scores, reverse=True)

    def test_evaluate_with_no_matching_skills(self):
        result = self.engine.evaluate(["cooking", "baking"])
        for rule in result['rules']:
            assert rule['match_score'] == 0.0


class TestJobRole:
    def test_match_against_full_match(self):
        role = JobRole(role_id='test', title='Test', required_skills=['python', 'sql'])
        result = role.match_against({'python', 'sql'})
        assert result['match_score'] == 1.0
        assert result['required_missing'] == []

    def test_match_against_partial_match(self):
        role = JobRole(role_id='test', title='Test', required_skills=['python', 'sql', 'java'])
        result = role.match_against({'python', 'sql'})
        assert 0 < result['match_score'] < 1.0
        assert 'java' in result['required_missing']

    def test_match_against_no_match(self):
        role = JobRole(role_id='test', title='Test', required_skills=['rust', 'go'])
        result = role.match_against({'python', 'sql'})
        assert result['match_score'] == 0.0


class TestLearningPathGenerator:
    def setup_method(self):
        self.gen = LearningPathGenerator()

    def test_graph_is_dag(self):
        import networkx as nx
        assert nx.is_directed_acyclic_graph(self.gen.graph)

    def test_generate_path_empty_when_all_known(self):
        known = list(self.gen.graph.nodes)
        path = self.gen.generate_path(known)
        assert path == []

    def test_generate_path_orders_prereqs(self):
        path = self.gen.generate_path([], ['machine learning'])
        assert 'python basics' in path
        assert 'statistics' in path
        ml_idx = path.index('machine learning')
        py_idx = path.index('python basics')
        assert py_idx < ml_idx

    def test_generate_path_with_target_skills(self):
        path = self.gen.generate_path([], ['docker', 'aws'])
        assert 'python basics' in path
        assert 'docker' in path
        assert 'aws' in path

    def test_generate_path_skips_known_skills(self):
        path = self.gen.generate_path(['python basics'], ['docker'])
        assert 'python basics' not in path
        assert 'docker' in path
