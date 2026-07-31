require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Job = require('../models/Job');

const CATEGORY_SKILLS = {
  'backend_developer': [
    'rest api', 'git', 'ci/cd', 'unit testing', 'postgresql', 'mongodb',
    'redis', 'authentication', 'microservices', 'linux', 'shell scripting',
    'api design', 'docker compose', 'agile', 'scrum', 'oauth', 'jwt',
    'message queues', 'logging', 'error handling', 'performance optimization',
  ],
  'frontend_developer': [
    'git', 'rest api', 'responsive design', 'state management', 'testing',
    'webpack', 'vite', 'accessibility', 'performance optimization', 'npm',
    'eslint', 'prettier', 'agile', 'cross-browser compatibility', 'bootstrap',
    'tailwind css', 'debugging',
  ],
  'data_scientist': [
    'pandas', 'numpy', 'data visualization', 'matplotlib', 'seaborn',
    'feature engineering', 'a/b testing', 'data cleaning', 'deep learning',
    'nlp', 'git', 'statistics', 'hypothesis testing', 'model deployment',
    'mlops', 'data pipelines', 'experimentation', 'jupyter notebooks',
  ],
  'devops_engineer': [
    'ci/cd', 'terraform', 'ansible', 'monitoring', 'prometheus', 'grafana',
    'shell scripting', 'networking', 'security', 'helm', 'linux administration',
    'yaml', 'python', 'git', 'jenkins', 'github actions', 'infrastructure as code',
    'logging', 'cloud migration',
  ],
  'data_analyst': [
    'sql', 'excel', 'tableau', 'power bi', 'data visualization', 'statistics',
    'python', 'data cleaning', 'pandas', 'numpy', 'communication',
    'presentation skills', 'data warehousing', 'etl', 'critical thinking',
    'reporting', 'dashboard design',
  ],
  'machine_learning_engineer': [
    'python', 'pytorch', 'tensorflow', 'mlops', 'model deployment',
    'docker', 'kubernetes', 'data pipelines', 'feature engineering',
    'experimentation', 'a/b testing', 'git', 'linux', 'aws',
    'distributed computing', 'optimization', 'statistics', 'nlp',
    'computer vision', 'ci/cd',
  ],
  'cybersecurity_analyst': [
    'network security', 'vulnerability assessment', 'incident response',
    'firewalls', 'siem', 'penetration testing', 'risk assessment',
    'security policies', 'compliance', 'security auditing', 'threat intelligence',
    'forensics', 'encryption', 'identity management', 'security monitoring',
  ],
  'cloud_engineer': [
    'terraform', 'docker', 'kubernetes', 'ci/cd', 'linux', 'networking',
    'security', 'python', 'bash', 'monitoring', 'infrastructure as code',
    'cloud migration', 'yaml', 'git', 'helm', 'prometheus', 'grafana',
  ],
  'software_developer': [
    'git', 'agile', 'rest api', 'sql', 'testing', 'ci/cd', 'docker',
    'design patterns', 'code review', 'linux', 'shell scripting', 'debugging',
    'object oriented programming', 'data structures', 'algorithms',
  ],
  'full_stack_developer': [
    'git', 'rest api', 'sql', 'docker', 'ci/cd', 'testing',
    'responsive design', 'agile', 'npm', 'debugging', 'authentication',
    'state management', 'api design', 'linux',
  ],
  'data_engineer': [
    'python', 'sql', 'etl pipelines', 'spark', 'hadoop', 'airflow',
    'data warehouse', 'docker', 'git', 'linux', 'cloud platforms',
    'data modeling', 'data governance', 'streaming', 'kafka',
  ],
  'ai_engineer': [
    'python', 'deep learning', 'nlp', 'computer vision', 'llm',
    'pytorch', 'tensorflow', 'docker', 'kubernetes', 'git', 'rest api',
    'model deployment', 'data pipelines', 'mlops', 'rag', 'langchain',
    'vector databases', 'fine tuning',
  ],
  'uncategorized': [
    'git', 'problem solving', 'communication', 'teamwork', 'time management',
  ],
};

const KEYWORD_SKILLS = {
  'react': ['react', 'jsx', 'react hooks', 'virtual dom'],
  'angular': ['angular', 'typescript', 'rxjs', 'angular cli'],
  'vue': ['vue', 'vuex', 'vue router'],
  'node': ['node.js', 'express', 'npm'],
  'django': ['django', 'python', 'orm'],
  'spring': ['spring boot', 'spring mvc', 'spring data'],
  'aws': ['aws', 's3', 'ec2', 'lambda', 'cloudformation'],
  'azure': ['azure', 'azure devops', 'azure functions'],
  'gcp': ['gcp', 'google cloud', 'bigquery'],
  'docker': ['docker', 'docker compose', 'containerization'],
  'kubernetes': ['kubernetes', 'k8s', 'helm'],
  'python': ['python', 'pip', 'virtualenv'],
  'java': ['java', 'jvm', 'maven', 'gradle'],
  'javascript': ['javascript', 'es6', 'async/await'],
  'typescript': ['typescript', 'type definitions'],
  'sql': ['sql', 'relational databases', 'query optimization'],
  'nosql': ['nosql', 'mongodb', 'cassandra', 'dynamodb'],
  'machine learning': ['machine learning', 'scikit-learn', 'model evaluation'],
  'deep learning': ['deep learning', 'neural networks', 'cnn', 'rnn'],
  'data': ['data analysis', 'data visualization', 'statistics'],
  'security': ['security', 'vulnerability assessment', 'encryption'],
  'cloud': ['cloud computing', 'iaas', 'paas', 'saas'],
  'devops': ['devops', 'ci/cd', 'automation'],
  'full stack': ['full stack', 'frontend', 'backend', 'rest api'],
  'frontend': ['frontend', 'react', 'angular', 'vue', 'html', 'css'],
  'backend': ['backend', 'server-side', 'api', 'database'],
  'mobile': ['mobile development', 'ios', 'android', 'react native'],
  'rust': ['rust', 'systems programming'],
  'go': ['go', 'golang', 'concurrency'],
  'kotlin': ['kotlin', 'android development'],
  'swift': ['swift', 'ios development'],
  '.net': ['.net', 'c#', 'asp.net'],
  'scala': ['scala', 'functional programming'],
  'terraform': ['terraform', 'infrastructure as code', 'hcl'],
  'jenkins': ['jenkins', 'ci/cd', 'pipeline'],
  'tableau': ['tableau', 'data visualization', 'dashboard'],
  'power bi': ['power bi', 'dax', 'power query'],
  'excel': ['excel', 'spreadsheets', 'vba'],
  'kafka': ['kafka', 'streaming', 'message broker'],
  'spark': ['spark', 'pyspark', 'big data'],
  'airflow': ['airflow', 'data pipelines', 'scheduling'],
};

function getKeywordSkills(title) {
  const titleLower = title.toLowerCase();
  const matched = [];
  for (const [keyword, skills] of Object.entries(KEYWORD_SKILLS)) {
    if (titleLower.includes(keyword)) {
      matched.push(...skills);
    }
  }
  return matched;
}

async function run() {
  try {
    await connectDB();

    const jobs = await Job.find().lean();
    console.log(`Loaded ${jobs.length} jobs from MongoDB.`);

    let updatedCount = 0;
    let totalAdded = 0;

    for (const job of jobs) {
      const existingSkills = new Set((job.skills || []).map(s => s.toLowerCase().trim()));
      const newSkills = [];

      // Category-based enrichment
      const catSkills = CATEGORY_SKILLS[job.role_category] || CATEGORY_SKILLS['uncategorized'];
      for (const skill of catSkills) {
        if (!existingSkills.has(skill)) {
          newSkills.push(skill);
          existingSkills.add(skill);
        }
      }

      // Keyword-based enrichment from job title
      const keywordSkills = getKeywordSkills(job.job_title);
      for (const skill of keywordSkills) {
        if (!existingSkills.has(skill)) {
          newSkills.push(skill);
          existingSkills.add(skill);
        }
      }

      if (newSkills.length > 0) {
        await Job.updateOne(
          { _id: job._id },
          { $push: { skills: { $each: newSkills } } }
        );
        updatedCount++;
        totalAdded += newSkills.length;
      }
    }

    console.log(`Updated ${updatedCount} jobs.`);
    console.log(`Added ${totalAdded} total new skills.`);
    console.log(`Average skills added per job: ${(totalAdded / updatedCount).toFixed(1)}`);

    // Show summary of role skill counts
    const enriched = await Job.aggregate([
      { $group: { _id: '$role_category', count: { $sum: 1 }, avgSkills: { $avg: { $size: '$skills' } }, totalUnique: { $addToSet: { $cond: [{ $isArray: '$skills' }, '$skills', []] } } } },
      { $sort: { count: -1 } },
    ]);

    console.log('\nRole category summary after enrichment:');
    for (const r of enriched) {
      const unique = [...new Set((r.totalUnique || []).flat().filter(Boolean))];
      console.log(`  ${r._id}: ${r.count} jobs, avg ${r.avgSkills.toFixed(1)} skills/job, ${unique.length} unique skills`);
    }

  } catch (err) {
    console.error('Error:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    console.log('\nDone. MongoDB connection closed.');
  }
}

run();
