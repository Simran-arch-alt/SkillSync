import { Box, Typography, Button, Paper, CircularProgress, Chip, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SchoolIcon from '@mui/icons-material/School';
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Nav/Sidebar";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Nav from "../components/Nav/Nav";
import { useState, useEffect } from "react";
import { getSkills } from "../services/studentService";

import {searchJobs,getJobById, getRolesSummary } from "../services/jobService";
import { getAdvancedRecommendations } from "../services/recommendationService";
import type { RuleRecommendation } from "../services/recommendationService";
import type { RoleSummary } from "../services/jobService";

const SKILL_DESCRIPTIONS: Record<string, string> = {
  'python': 'High-level programming language widely used for web development, data analysis, AI, and automation.',
  'java': 'Object-oriented programming language used for enterprise applications, Android development, and backend systems.',
  'javascript': 'Core language of the web, used for interactive frontend and backend (Node.js) development.',
  'typescript': 'Typed superset of JavaScript that compiles to plain JavaScript, adding static type checking.',
  'c++': 'High-performance language used for system software, game engines, and performance-critical applications.',
  'c#': 'Microsoft\'s language for .NET ecosystem, used for desktop apps, games (Unity), and web services.',
  'react': 'Frontend library for building dynamic user interfaces with reusable components and virtual DOM.',
  'angular': 'TypeScript-based frontend framework by Google for building scalable single-page applications.',
  'vue': 'Progressive JavaScript framework for building UIs with a focus on simplicity and flexibility.',
  'node.js': 'JavaScript runtime for building scalable server-side applications and APIs.',
  'express': 'Minimal Node.js web framework for building RESTful APIs and web applications.',
  'django': 'High-level Python web framework emphasizing rapid development and clean, pragmatic design.',
  'flask': 'Lightweight Python web framework with flexibility and minimal boilerplate for small to medium apps.',
  'spring': 'Java framework for building enterprise-grade applications with dependency injection and MVC.',
  'aws': 'Amazon\'s cloud platform offering compute, storage, database, and machine learning services.',
  'azure': 'Microsoft\'s cloud platform with services for computing, analytics, storage, and networking.',
  'gcp': 'Google\'s cloud platform providing infrastructure, data analytics, and machine learning tools.',
  'docker': 'Containerization platform that packages applications with dependencies for consistent deployment.',
  'kubernetes': 'Container orchestration platform for automating deployment, scaling, and management.',
  'sql': 'Standard language for managing and querying relational databases like MySQL, PostgreSQL, and SQL Server.',
  'mongodb': 'NoSQL document database with flexible schema design for modern applications.',
  'postgresql': 'Advanced open-source relational database with strong ACID compliance and extensibility.',
  'mysql': 'Popular open-source relational database management system used in web applications.',
  'redis': 'In-memory data structure store used as cache, message broker, and database for fast data access.',
  'git': 'Distributed version control system for tracking changes in source code during development.',
  'machine learning': 'Field of AI focused on building systems that learn and improve from data without explicit programming.',
  'deep learning': 'Subset of machine learning using neural networks with many layers for complex pattern recognition.',
  'tensorflow': 'Google\'s open-source ML framework for building and deploying neural networks at scale.',
  'pytorch': 'Facebook\'s open-source ML framework with dynamic computation graphs, popular in research.',
  'pandas': 'Python library for data manipulation and analysis with DataFrame structures.',
  'numpy': 'Python library for numerical computing with multi-dimensional arrays and mathematical functions.',
  'tableau': 'Data visualization tool for creating interactive dashboards and business intelligence reports.',
  'power bi': 'Microsoft\'s business analytics tool for interactive visualizations and BI insights.',
  'etl': 'Extract, Transform, Load processes for moving and transforming data between systems.',
  'spark': 'Unified analytics engine for large-scale data processing with in-memory computing.',
  'airflow': 'Platform for programmatically authoring, scheduling, and monitoring workflows.',
  'terraform': 'Infrastructure-as-code tool for provisioning and managing cloud resources declaratively.',
  'jenkins': 'Automation server for CI/CD pipelines, building, testing, and deploying code.',
  'rest api': 'Architectural style for designing networked applications using HTTP requests.',
  'graphql': 'Query language for APIs that lets clients request exactly the data they need.',
  'linux': 'Open-source operating system kernel used widely in servers, cloud, and embedded systems.',
  'kotlin': 'Modern JVM language with concise syntax, fully interoperable with Java, official for Android.',
  'swift': 'Apple\'s programming language for iOS, macOS, watchOS, and tvOS application development.',
  'go': 'Statically typed language by Google designed for concurrency, performance, and simplicity.',
  'rust': 'Systems language focused on safety, speed, and memory management without garbage collection.',
  'scikit-learn': 'Python library for classical machine learning algorithms including classification and regression.',
  'nlp': 'Natural Language Processing — AI subfield for understanding, generating, and processing human language.',
  'computer vision': 'AI field enabling machines to interpret and process visual information from the world.',
  'microservices': 'Architectural style structuring applications as loosely coupled, independently deployable services.',
  'ci/cd': 'Continuous Integration and Continuous Delivery practices for automated testing and deployment.',
  'agile': 'Iterative software development methodology emphasizing flexibility, collaboration, and customer feedback.',
};


interface AlignmentData {
  score: number;
  matchedSkills: string[];
  gaps: string[];
}

const AlignmentResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [alignmentData, setAlignmentData] = useState<AlignmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [ruleRecs, setRuleRecs] = useState<RuleRecommendation[]>([]);
  const [learningPath, setLearningPath] = useState<string[]>([]);
  const [learningPathDetails, setLearningPathDetails] = useState<any[]>([]);
  const [roles, setRoles] = useState<RoleSummary[]>([]);
  const [roleLoading, setRoleLoading] = useState(false);

  const from = location.state?.from;
  const selectedRole = location.state?.roleTitle;
  const selectedJobId = location.state?.jobId;

  useEffect(() => {
    loadRoles();
  }, [selectedRole]);

  useEffect(() => {
    if (selectedRole && roles.length > 0) {
      runAlignment(selectedRole, selectedJobId);
    } else if (selectedRole && roles.length === 0) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [selectedRole, selectedJobId, roles]);


  const runAlignment = async (role: string, jobId?: string) => {
    setLoading(true);
    try {
      const { skills: skillsArray } = await getSkills();
      const userSkillsLower = skillsArray.map((s: string) => s.toLowerCase());

      try {
        const adv = await getAdvancedRecommendations(skillsArray);
        setRuleRecs(adv.ruleRecommendations || []);
        setLearningPath(adv.learningPath || []);
        setLearningPathDetails(adv.learningPathDetails || []);
      } catch {
        // advanced endpoint optional; fall through
      }

      const roleSummary = roles.find((r) => r.title === role);
      let roleSkills: string[] = [];

      if (roleSummary && roleSummary.allSkills && roleSummary.allSkills.length > 0) {
        roleSkills = roleSummary.allSkills.map((s: string) => s.toLowerCase());
      } else if (roleSummary && roleSummary.skills.length > 0) {
        roleSkills = roleSummary.skills.map((s: string) => s.toLowerCase());
      }

      if (roleSkills.length === 0 && jobId) {
        try {
          const jobRes = await getJobById(jobId);
          if (jobRes.job?.skills) {
            roleSkills = jobRes.job.skills.map((s: string) => s.toLowerCase());
          }
        } catch {}
      }

      if (roleSkills.length === 0 && role) {
        const jobRes = await searchJobs({ keyword: role }, 1, 200);
        const matchedJob = jobRes.jobs?.find((j: any) => j.job_title === role);
        if (matchedJob?.skills) {
          roleSkills = matchedJob.skills.map((s: string) => s.toLowerCase());
        }
      }

      if (roleSkills.length > 0) {
        const matched = roleSkills.filter((s: string) => userSkillsLower.includes(s));
        const gaps = roleSkills.filter((s: string) => !userSkillsLower.includes(s));
        const score = roleSkills.length > 0 ? Math.round((matched.length / roleSkills.length) * 100) : 0;
        setAlignmentData({
          score,
          matchedSkills: matched.map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)),
          gaps: gaps.map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)),
        });
        setLoading(false);
        return;
      }
    } catch (err) {
      console.error('Failed to fetch alignment:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRole = (role: string) => {
    navigate(`/alignment-results`, { state: { roleTitle: role, from: "alignment" }, replace: true });
  };

  const loadRoles = async () => {
    setRoleLoading(true);
    try {
      const res = await getRolesSummary();
      setRoles(res.roles);
    } catch (err) {
      console.error('Failed to load roles:', err);
    } finally {
      setRoleLoading(false);
    }
  };

  const data = alignmentData;

  const handleBack = () => {
    if (selectedRole) {
      navigate("/alignment-results", { replace: true });
    } else {
      navigate("/job-roles");
    }
  };

  if (!selectedRole) {
    return (
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F8FAFC" }}>
        <Sidebar />
        <Box sx={{ flexGrow: 1 }}>
          <Nav />
          <Box sx={{ p: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
              <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/job-roles")} sx={{ color: '#119DA4', fontWeight: 'bold', textTransform: 'none' }}>Back</Button>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A' }}>AI Skill Alignment Analysis</Typography>
            </Box>
            <Typography sx={{ color: '#64748B', mb: 3, fontSize: '1.1rem' }}>
              Select a job role to compare your current skills against industry requirements.
            </Typography>
            {roleLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>
            ) : roles.length === 0 ? (
              <Typography sx={{ color: '#64748B' }}>No roles available.</Typography>
            ) : (
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
                {roles.map((role) => (
                  <Paper
                    key={role.title}
                    onClick={() => handleSelectRole(role.title)}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      cursor: 'pointer',
                      border: '1px solid #E2E8F0',
                      transition: 'all 0.2s',
                      '&:hover': { borderColor: '#119DA4', boxShadow: 3, transform: 'translateY(-2px)' },
                    }}
                  >
                    <Typography sx={{ fontWeight: 600, color: '#0F172A', mb: 0.5 }}>{role.title}</Typography>
                    <Typography sx={{ color: '#64748B', fontSize: '0.85rem', mb: 1.5 }}>{role.description}</Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {role.skills.slice(0, 4).map((s) => (
                        <Chip key={s} label={s} size="small" sx={{ fontSize: '0.7rem', bgcolor: '#F0F9FF', color: '#0369A1' }} />
                      ))}
                      {role.skills.length > 4 && (
                        <Chip label={`+${role.skills.length - 4}`} size="small" sx={{ fontSize: '0.7rem', bgcolor: '#F1F5F9', color: '#475569' }} />
                      )}
                    </Box>
                  </Paper>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F8FAFC" }}>
        <Sidebar />
        <Box sx={{ flexGrow: 1 }}>
          <Nav />
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <CircularProgress />
          </Box>
        </Box>
      </Box>
    );
  }
 
    return (
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F8FAFC" }}>
        <Sidebar />
        <Box sx={{ flexGrow: 1 }}>
        <Nav />

        <Box sx={{ flexGrow: 1, px: { xs: 2, md: 3, xl: 4 }, py: { xs: 3, md: 4 } }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A' }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
              sx={{ mb: 2, color: '#119DA4', fontWeight: 'bold', textTransform: 'none', '&:hover': { backgroundColor: 'rgba(17, 157, 164, 0.08)' } }}
            />
            AI Skill Alignment Analysis
          </Typography>

          <Typography sx={{ mt: 2, mb: 3 }}>
            Comparing your skills against: <strong>{selectedRole}</strong>
          </Typography>

          <Paper sx={{ p: { xs: 2, sm: 3, md: 4 }, mb: 3, borderRadius: 4, background: "#FFFFFF", border: "1px solid #E2E8F0", boxShadow: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 3, mb: 5 }}>
              <Box>
                <Typography variant="h5" sx={{ color: "#0F172A", fontWeight: "bold" }}>{selectedRole}</Typography>
                <Typography sx={{ color: "#64748B", mt: 1 }}>
                  {data?.matchedSkills?.length || 0} matched · {data?.gaps?.length || 0} gaps identified
                </Typography>
              </Box>
              <Box sx={{ position: "relative", display: "inline-flex" }}>
                <CircularProgress variant="determinate" value={data?.score || 0} size={140} thickness={5} color="success" />
                <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                  <Typography variant="h4" sx={{ color: "#0F172A", fontWeight: "bold" }}>{data?.score}%</Typography>
                  <Typography variant="caption" sx={{ color: "#64748B" }}>Match</Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ mb: 5 }}>
              <Typography sx={{ fontWeight: "bold", color: "#64748B", mb: 1 }}>Qualification Strength</Typography>
              <Box sx={{ width: "100%", height: 10, bgcolor: "#E5E7EB", borderRadius: 10 }}>
                <Box sx={{ width: `${data?.score || 0}%`, height: "100%", bgcolor: "#119DA4", borderRadius: 10 }} />
              </Box>
              <Typography sx={{ mt: 1, color: "#119DA4", fontWeight: "bold" }}>Strong - {data?.score}%</Typography>
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 4 }}>
              <Box>
                <Typography variant="h6" sx={{ color: "#0F172A", fontWeight: "bold", mb: 2 }}>
                  Matched Skills ({data?.matchedSkills?.length || 0})
                </Typography>
                {data?.matchedSkills?.map((skill) => (
                  <Box key={skill} sx={{ p: 1.5, mb: 1.5, borderRadius: 2, bgcolor: "#DCFCE7", border: "1px solid #86EFAC", color: "#166534" }}>
                    {skill}
                  </Box>
                ))}
              </Box>
              <Box>
                <Typography variant="h6" sx={{ color: "#0F172A", mb: 2, fontWeight: "bold" }}>
                  Skill Gaps ({data?.gaps?.length || 0})
                </Typography>
                {data?.gaps?.map((gap) => {
                  const gapLower = gap.toLowerCase();
                  const desc = SKILL_DESCRIPTIONS[gapLower] || `${gap} is a valuable skill for this role.`;
                  return (
                    <Accordion
                      key={gap}
                      disableGutters
                      sx={{
                        mb: 1.5,
                        borderRadius: '8px !important',
                        bgcolor: "#FFFBEB",
                        border: "1px solid #FCD34D",
                        boxShadow: 'none',
                        '&:before': { display: 'none' },
                      }}
                    >
                      <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#B45309' }} />}>
                        <Typography sx={{ fontWeight: 600, color: '#B45309' }}>{gap}</Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ pt: 0 }}>
                        <Typography sx={{ color: '#92400E', fontSize: '0.9rem', mb: 2 }}>
                          {desc}
                        </Typography>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<SchoolIcon />}
                          onClick={() => navigate(`/skill/${encodeURIComponent(gap.toLowerCase())}`)}
                          sx={{
                            borderColor: '#119DA4',
                            color: '#119DA4',
                            textTransform: 'none',
                            fontWeight: 600,
                            '&:hover': { borderColor: '#19647E', bgcolor: 'rgba(17,157,164,0.08)' },
                          }}
                        >
                          See Learning Materials
                        </Button>
                      </AccordionDetails>
                    </Accordion>
                  );
                })}
              </Box>
            </Box>

            {ruleRecs.length > 0 && (
              <Box sx={{ mt: 5 }}>
                <Typography variant="h6" sx={{ color: "#0F172A", fontWeight: "bold", mb: 2 }}>
                  Career Role Recommendations
                </Typography>
                {ruleRecs.slice(0, 3).map((r: any, i: number) => (
                  <Paper key={i} sx={{ p: 2, mb: 1.5, borderRadius: 2, bgcolor: "#F0F9FF", border: "1px solid #BAE6FD" }}>
                    <Typography sx={{ fontWeight: "bold", color: "#0369A1" }}>{r.role || r.title}</Typography>
                    <Typography sx={{ color: "#475569", fontSize: "0.9rem", mt: 0.5 }}>{r.recommendation}</Typography>
                    <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}>
                      {(r.requiredMissing || r.required_missing || []).length > 0 && (
                        <Chip label={`${(r.requiredMissing || r.required_missing || []).length} missing`} size="small" color="warning" variant="outlined" />
                      )}
                      <Chip label={`${Math.round((r.matchScore || r.match_score || 0) * 100)}%`} size="small" color="primary" variant="outlined" />
                    </Box>
                  </Paper>
                ))}
              </Box>
            )}

            {learningPath.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ color: "#0F172A", fontWeight: "bold", mb: 1 }}>
                  Recommended Learning Path
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {learningPath.map((skill, i) => (
                    <Chip key={skill} label={`${i + 1}. ${skill}`} sx={{ bgcolor: "#FEF3C7", color: "#92400E", fontWeight: 500 }} />
                  ))}
                </Box>
              </Box>
            )}

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 5 }}>
              <Button
                variant="contained"
                onClick={() => navigate("/learning-roadmap", { state: { roleTitle: selectedRole, jobId: selectedJobId, from, learningPath, learningPathDetails } })}
                sx={{ borderRadius: 3, px: 4, py: 1.5, background: "linear-gradient(135deg,#19647E,#119DA4)", textTransform: "none", fontWeight: "bold" }}
              >
                Generate Learning Roadmap
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default AlignmentResults;
