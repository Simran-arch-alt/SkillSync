import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Chip,
  Collapse,
  IconButton,
  Divider,
  Link,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SchoolIcon from '@mui/icons-material/School';
import BuildIcon from '@mui/icons-material/Build';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Nav/Sidebar';
import Nav from '../components/Nav/Nav';
import { getSkills } from '../services/studentService';
import { searchJobs } from '../services/jobService';
import { getAdvancedRecommendations, getSkillCurriculum } from '../services/recommendationService';
import type { SkillCurriculumDetail } from '../services/recommendationService';

const ACRONYMS = new Set(['aws', 'azure', 'css', 'html', 'sql', 'api', 'cli', 'json', 'xml', 'rest', 'ai', 'ml', 'ui', 'crud', 'ide', 'i/o', 'nosql']);
const SPECIAL = new Map([
  ['javascript', 'JavaScript'],
  ['typescript', 'TypeScript'],
  ['node js', 'Node.js'],
  ['nodejs', 'Node.js'],
  ['react', 'React'],
  ['angular', 'Angular'],
  ['power bi', 'Power BI'],
  ['c++', 'C++'],
  ['c#', 'C#'],
  ['.net', '.NET'],
]);

const capSkill = (s: string): string => {
  const lower = s.toLowerCase().trim();
  if (SPECIAL.has(lower)) return SPECIAL.get(lower)!;
  if (ACRONYMS.has(lower)) return lower.toUpperCase();
  return lower.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

interface PhaseSkill {
  name: string;
  curriculum: SkillCurriculumDetail | null;
}

interface RoadmapStep {
  phase: string;
  title: string;
  description: string;
  type: 'mastered' | 'learning';
  duration: string;
  skills: PhaseSkill[];
}

const LearningRoadmap: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [roadmapSteps, setRoadmapSteps] = useState<RoadmapStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [jobNotFound, setJobNotFound] = useState(false);

  const selectedRole = location.state?.roleTitle;
  const selectedJobId = location.state?.jobId;
  const from = location.state?.from;
  const pythonLearningPath: string[] = location.state?.learningPath || [];
  const pythonLearningPathDetails: SkillCurriculumDetail[] = location.state?.learningPathDetails || [];

  useEffect(() => {
    if (!selectedRole) {
      generateGeneralRoadmap();
      return;
    }
    fetchRoadmap();
  }, [selectedRole, selectedJobId]);

  const enrichSkills = async (skillNames: string[]): Promise<PhaseSkill[]> => {
    const detailMap = new Map<string, SkillCurriculumDetail>();
    for (const d of pythonLearningPathDetails) {
      detailMap.set(d.skill.toLowerCase(), d);
    }
    return Promise.all(
      skillNames.map(async (name) => {
        const existing = detailMap.get(name.toLowerCase());
        if (existing) return { name, curriculum: existing };
        try {
          const curriculum = await getSkillCurriculum(name);
          return { name, curriculum };
        } catch {
          return { name, curriculum: null };
        }
      })
    );
  };

  const generateGeneralRoadmap = async () => {
    try {
      const { skills: userSkills } = await getSkills();
      let adv: any = { learningPath: [], ruleRecommendations: [], learningPathDetails: [] };
      try {
        adv = await getAdvancedRecommendations(userSkills);
      } catch {}

      const dagPath: string[] = adv.learningPath || [];
      const recommendations = adv.ruleRecommendations || [];
      const allDetails: SkillCurriculumDetail[] = adv.learningPathDetails || [];

      const detailMap = new Map<string, SkillCurriculumDetail>();
      for (const d of allDetails) detailMap.set(d.skill.toLowerCase(), d);

      const steps: RoadmapStep[] = [];

      if (userSkills.length > 0) {
        steps.push({
          phase: 'Phase 1',
          title: 'Skills You Already Have',
          description: `${userSkills.length} skills in your profile.`,
          type: 'mastered',
          duration: 'Ready now',
          skills: userSkills.map((s: string) => ({ name: s, curriculum: null })),
        });
      }

      if (dagPath.length > 0) {
        const perPhase = Math.ceil(dagPath.length / 3);
        for (let i = 0; i < Math.min(3, Math.ceil(dagPath.length / perPhase)); i++) {
          const phaseSkills = dagPath.slice(i * perPhase, (i + 1) * perPhase);
          const enriched = await enrichSkills(phaseSkills);
          const totalHours = enriched.reduce((s, ps) => s + (ps.curriculum?.total_hours || 0), 0);
          steps.push({
            phase: `Phase ${steps.length + 1}`,
            title: `Learn ${phaseSkills.slice(0, 2).join(', ')}${phaseSkills.length > 2 ? ' & more' : ''}`,
            description: `${phaseSkills.length} skill${phaseSkills.length > 1 ? 's' : ''} · ~${totalHours}h of material`,
            type: 'learning',
            duration: `${phaseSkills.length * 2} Weeks`,
            skills: enriched,
          });
        }
      } else if (recommendations.length > 0) {
        for (const rec of recommendations.slice(0, 3)) {
          const missing = rec.requiredMissing || rec.required_missing || [];
          if (missing.length > 0) {
            const enriched = await enrichSkills(missing);
            const totalHours = enriched.reduce((s, ps) => s + (ps.curriculum?.total_hours || 0), 0);
            steps.push({
              phase: `Phase ${steps.length + 1}`,
              title: `Target: ${rec.role || rec.title}`,
              description: `${missing.length} skills needed · ~${totalHours}h of material`,
              type: 'learning',
              duration: `${missing.length * 2} Weeks`,
              skills: enriched,
            });
          }
        }
      } else {
        steps.push({
          phase: 'Getting Started',
          title: 'Explore a Career Path',
          description: 'Go to Job Roles to select a target role and generate a personalized roadmap.',
          type: 'learning',
          duration: '',
          skills: [],
        });
      }

      setRoadmapSteps(steps);
    } catch (err) {
      console.error('Failed to generate roadmap:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoadmap = async () => {
    try {
      const { skills: userSkills } = await getSkills();
      const userSkillSet = new Set(userSkills.map((s: string) => s.toLowerCase()));

      let jobSkills: string[] = [];

      if (selectedJobId) {
        const jobRes = await searchJobs({ keyword: selectedRole }, 1, 200);
        const matchedJob = jobRes.jobs?.find(
          (j: any) => j._id === selectedJobId || j.job_title === selectedRole
        );
        if (matchedJob) jobSkills = matchedJob.skills || [];
      }

      if (jobSkills.length === 0) {
        const jobRes = await searchJobs({ keyword: selectedRole }, 1, 200);
        const matchedJob = jobRes.jobs?.find((j: any) => j.job_title === selectedRole);
        if (matchedJob) jobSkills = matchedJob.skills || [];
      }

      if (jobSkills.length === 0) {
        if (pythonLearningPath.length > 0) {
          const enriched = await enrichSkills(pythonLearningPath);
          const totalHours = enriched.reduce((s, ps) => s + (ps.curriculum?.total_hours || 0), 0);
          const perPhase = Math.ceil(enriched.length / 3);
          const steps: RoadmapStep[] = [];
          for (let i = 0; i < Math.min(3, Math.ceil(enriched.length / perPhase)); i++) {
            const phaseSkills = enriched.slice(i * perPhase, (i + 1) * perPhase);
            const phaseHours = phaseSkills.reduce((s, ps) => s + (ps.curriculum?.total_hours || 0), 0);
            steps.push({
              phase: `Phase ${steps.length + 1}`,
              title: `Learn ${phaseSkills.slice(0, 2).map(p => capSkill(p.name)).join(', ')}${phaseSkills.length > 2 ? ' & more' : ''}`,
              description: `From AI recommendations · ~${phaseHours}h of material`,
              type: 'learning',
              duration: `${phaseSkills.length * 2} Weeks`,
              skills: phaseSkills,
            });
          }
          setRoadmapSteps(steps);
          setLoading(false);
          return;
        }
        setJobNotFound(true);
        setLoading(false);
        return;
      }

      const mastered = jobSkills.filter((s) => userSkillSet.has(s.toLowerCase()));
      const missing = jobSkills.filter((s) => !userSkillSet.has(s.toLowerCase()));

      const steps: RoadmapStep[] = [];

      if (mastered.length > 0) {
        steps.push({
          phase: 'Phase 1',
          title: 'Mastered Skills',
          description: `You already have ${mastered.length} of the required skills for ${selectedRole}.`,
          type: 'mastered',
          duration: 'Ready now',
          skills: mastered.map((s) => ({ name: s, curriculum: null })),
        });
      }

      if (missing.length > 0) {
        const orderedMissing = pythonLearningPath.length > 0
          ? pythonLearningPath.filter((s) => missing.includes(s))
          : [];
        const effectiveMissing = orderedMissing.length > 0 ? orderedMissing : missing;
        const enriched = await enrichSkills(effectiveMissing);
        const totalHours = enriched.reduce((s, ps) => s + (ps.curriculum?.total_hours || 0), 0);

        const skillsPerPhase = Math.ceil(effectiveMissing.length / 3);
        const phases = Math.min(3, Math.ceil(effectiveMissing.length / skillsPerPhase));

        for (let i = 0; i < phases; i++) {
          const phaseSkills = enriched.slice(i * skillsPerPhase, (i + 1) * skillsPerPhase);
          const phaseHours = phaseSkills.reduce((s, ps) => s + (ps.curriculum?.total_hours || 0), 0);
          const weeksNeeded = phaseSkills.length * 2;
          steps.push({
            phase: `Phase ${steps.length + 1}`,
            title: `Learn ${phaseSkills.length > 2 ? phaseSkills.slice(0, 2).map(p => capSkill(p.name)).join(', ') + ' & more' : phaseSkills.map(p => capSkill(p.name)).join(' & ')}`,
            description: orderedMissing.length > 0
              ? `Prerequisite-based · ~${phaseHours}h of material`
              : `Acquire ${phaseSkills.length} skill${phaseSkills.length > 1 ? 's' : ''} · ~${phaseHours}h of material`,
            type: 'learning',
            duration: `${weeksNeeded} Weeks`,
            skills: phaseSkills,
          });
        }
      }

      setRoadmapSteps(steps);
    } catch (err) {
      console.error('Failed to fetch roadmap:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const totalSkillsToLearn = roadmapSteps
    .filter((s) => s.type === 'learning')
    .reduce((sum, s) => sum + s.skills.length, 0);

  const totalHours = roadmapSteps
    .filter((s) => s.type === 'learning')
    .reduce((sum, s) => sum + s.skills.reduce((h, ps) => h + (ps.curriculum?.total_hours || 0), 0), 0);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F8FAFC' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1 }}>
        <Nav />

        <Box sx={{ flexGrow: 1, p: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => {
              if (selectedRole) {
                navigate('/alignment-results', { state: { roleTitle: selectedRole, jobId: selectedJobId, from } });
              } else {
                navigate('/job-roles');
              }
            }}
            sx={{ mb: 3, color: '#119DA4', fontWeight: 'bold', textTransform: 'none' }}
          >
            {selectedRole ? 'Back to Alignment Results' : 'Back'}
          </Button>

          <Paper sx={{ p: 4, borderRadius: 4, mb: 4, border: '1px solid #E2E8F0' }}>
            <Typography variant="h4" sx={{ color: '#0F172A', fontWeight: 'bold' }}>
              Learning Roadmap
            </Typography>
            <Typography sx={{ mt: 1, color: '#64748B' }}>
              {selectedRole
                ? `Personalized roadmap for <strong>${selectedRole}</strong>`
                : 'General skill development path based on your profile'}
            </Typography>
            {roadmapSteps.length > 0 && (
              <Box sx={{ display: 'flex', gap: 3, mt: 2, flexWrap: 'wrap' }}>
                <Chip label={`${roadmapSteps.length} Phases`} sx={{ bgcolor: '#E0F2FE', color: '#0369A1', fontWeight: 'bold' }} />
                <Chip label={`${totalSkillsToLearn} Skills to Learn`} sx={{ bgcolor: '#FEF3C7', color: '#B45309', fontWeight: 'bold' }} />
                {totalHours > 0 && (
                  <Chip label={`~${totalHours}h of Material`} sx={{ bgcolor: '#EDE9FE', color: '#6D28D9', fontWeight: 'bold' }} />
                )}
              </Box>
            )}
          </Paper>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          ) : jobNotFound ? (
            <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
              <Typography>Job role not found. Please go back and select a role.</Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/job-roles')}
                sx={{ mt: 2, bgcolor: '#119DA4', textTransform: 'none', fontWeight: 'bold', borderRadius: 2 }}
              >
                Browse Job Roles
              </Button>
            </Paper>
          ) : roadmapSteps.length > 0 ? (
            roadmapSteps.map((step, index) => {
              const isExpanded = expandedIndex === index;
              const isMastered = step.type === 'mastered';
              const borderColor = isMastered ? '#16A34A' : '#119DA4';

              return (
                <Paper
                  key={step.phase + index}
                  sx={{
                    mb: 2,
                    borderRadius: 3,
                    borderLeft: `6px solid ${borderColor}`,
                    boxShadow: isExpanded ? 4 : 1,
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': { boxShadow: 3 },
                  }}
                  onClick={() => handleExpand(index)}
                >
                  <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                        <Typography
                          sx={{
                            bgcolor: borderColor,
                            color: '#fff',
                            fontWeight: 'bold',
                            px: 1.5,
                            py: 0.3,
                            borderRadius: 1,
                            fontSize: '0.8rem',
                          }}
                        >
                          {step.phase}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#0F172A' }}>
                          {step.title}
                        </Typography>
                      </Box>
                      <Typography sx={{ color: '#64748B', mt: 0.5, fontSize: '0.85rem' }}>
                        {step.description}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Chip
                        label={step.duration}
                        sx={{
                          bgcolor: isMastered ? '#DCFCE7' : '#E0F2FE',
                          color: isMastered ? '#166534' : '#0369A1',
                          fontWeight: 'bold',
                        }}
                      />
                      <IconButton size="small" sx={{ color: '#119DA4' }}>
                        {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </Box>
                  </Box>

                  <Collapse in={isExpanded} timeout={300}>
                    <Divider />
                    <Box sx={{ p: 3 }} onClick={(e) => e.stopPropagation()}>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {step.skills.map((ps) => (
                          <Chip
                            key={ps.name}
                            label={capSkill(ps.name)}
                            onClick={() => navigate(`/skill/${encodeURIComponent(ps.name.toLowerCase())}`)}
                            sx={{
                              bgcolor: isMastered ? '#DCFCE7' : '#FEF3C7',
                              color: isMastered ? '#166534' : '#92400E',
                              fontWeight: 600,
                              cursor: 'pointer',
                              border: `1px solid ${isMastered ? '#86EFAC' : '#FCD34D'}`,
                              '&:hover': { bgcolor: isMastered ? '#BBF7D0' : '#FDE68A', boxShadow: 2 },
                            }}
                          />
                        ))}
                      </Box>

                      {!isMastered && (
                        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                          <Button
                            variant="contained"
                            onClick={() => navigate('/my-skill-profile')}
                            sx={{ bgcolor: '#119DA4', textTransform: 'none', fontWeight: 'bold', borderRadius: 2, '&:hover': { bgcolor: '#0e7075' } }}
                          >
                            Update Skills
                          </Button>
                          <Button
                            variant="outlined"
                            onClick={() => navigate('/job-roles')}
                            sx={{ borderColor: '#119DA4', color: '#119DA4', textTransform: 'none', fontWeight: 'bold', borderRadius: 2, '&:hover': { borderColor: '#0e7075', bgcolor: 'rgba(17, 157, 164, 0.05)' } }}
                          >
                            View Other Roles
                          </Button>
                        </Box>
                      )}
                    </Box>
                  </Collapse>
                </Paper>
              );
            })
          ) : (
            <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
              <Typography>No roadmap available. Add skills to your profile first.</Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/my-skill-profile')}
                sx={{ mt: 2, bgcolor: '#119DA4', textTransform: 'none', fontWeight: 'bold', borderRadius: 2 }}
              >
                Go to Skill Profile
              </Button>
            </Paper>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default LearningRoadmap;
