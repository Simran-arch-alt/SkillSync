import sys
import json
import os
import re

SKILL_PATTERNS = {
    'python': r'\bpython\b',
    'java': r'\bjava\b',
    'javascript': r'\bjavascript\b',
    'c++': r'\bc\+\+\b',
    'c#': r'\bc\#\b',
    'typescript': r'\btypescript\b',
    'go': r'\bgo\b',
    'rust': r'\brust\b',
    'sql': r'\bsql\b',
    'html': r'\bhtml\b',
    'css': r'\bcss\b',
    'react': r'\breact\b',
    'angular': r'\bangular\b',
    'vue': r'\bvue\b',
    'node.js': r'\bnode\.?(js)?\b',
    'django': r'\bdjango\b',
    'flask': r'\bflask\b',
    'spring': r'\bspring\b',
    'aws': r'\baws\b',
    'azure': r'\bazure\b',
    'gcp': r'\bgcp\b',
    'docker': r'\bdocker\b',
    'kubernetes': r'\bkubernetes\b',
    'git': r'\bgit\b',
    'linux': r'\blinux\b',
    'excel': r'\bexcel\b',
    'tableau': r'\btableau\b',
    'pandas': r'\bpandas\b',
    'numpy': r'\bnumpy\b',
    'machine learning': r'\bmachine learning\b',
    'deep learning': r'\bdeep learning\b',
    'tensorflow': r'\btensorflow\b',
    'pytorch': r'\bpytorch\b',
    'rest api': r'\brest api\b',
    'power bi': r'\bpower bi\b',
    'mongodb': r'\bmongodb\b',
    'postgresql': r'\bpostgresql\b',
    'mysql': r'\bmysql\b',
    'redis': r'\bredis\b',
    'express': r'\bexpress\b',
    'next.js': r'\bnext\.?js\b',
    'keras': r'\bkeras\b',
    'scikit-learn': r'\bscikit[- ]learn\b',
    'data science': r'\bdata science\b',
    'data analysis': r'\bdata analysis\b',
    'data engineering': r'\bdata engineering\b',
    'etl': r'\betl\b',
    'spark': r'\bspark\b',
    'hadoop': r'\bhadoop\b',
    'airflow': r'\bairflow\b',
}


def extract_skills(text):
    text_lower = text.lower()
    found = []
    for skill_name, pattern in SKILL_PATTERNS.items():
        if re.search(pattern, text_lower):
            found.append(skill_name)
    return sorted(set(found))


def extract_text_from_pdf(filepath):
    import fitz
    doc = fitz.open(filepath)
    text = ''
    for page in doc:
        text += page.get_text()
    doc.close()
    return text


def extract_text_from_docx(filepath):
    import docx
    doc = docx.Document(filepath)
    text = '\n'.join([para.text for para in doc.paragraphs])
    return text


if __name__ == '__main__':
    filepath = ''
    for i in range(len(sys.argv)):
        if sys.argv[i] == '--file' and i + 1 < len(sys.argv):
            filepath = sys.argv[i + 1]

    if not filepath or not os.path.exists(filepath):
        print(json.dumps({'error': 'File not found', 'file': filepath}))
        sys.exit(1)

    ext = os.path.splitext(filepath)[1].lower()
    text = ''

    if ext == '.pdf':
        text = extract_text_from_pdf(filepath)
    elif ext in ('.docx', '.doc'):
        text = extract_text_from_docx(filepath)
    else:
        print(json.dumps({'error': f'Unsupported file type: {ext}'}))
        sys.exit(1)

    skills = extract_skills(text)
    print(json.dumps({'skills': skills, 'textLength': len(text)}))
