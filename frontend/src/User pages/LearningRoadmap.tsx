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
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Nav/Sidebar';
import Nav from '../components/Nav/Nav';
import { getSkills } from '../services/studentService';
import { searchJobs } from '../services/jobService';

interface RoadmapStep {
  phase: string;
  title: string;
  description: string;
  skills: string[];
  type: 'mastered' | 'learning';
  duration: string;
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

  useEffect(() => {
    if (!selectedRole) {
      navigate('/job-roles');
      return;
    }

    const fetchRoadmap = async () => {
      try {
        const { skills: userSkills } = await getSkills();
        const userSkillSet = new Set(userSkills.map((s) => s.toLowerCase()));

        let jobSkills: string[] = [];
        let jobCompany = '';

        if (selectedJobId) {
          const jobRes = await searchJobs({ keyword: selectedRole }, 1, 200);
          const matchedJob = jobRes.jobs?.find(
            (j: any) => j._id === selectedJobId || j.job_title === selectedRole
          );
          if (matchedJob) {
            jobSkills = matchedJob.skills || [];
            jobCompany = matchedJob.company || '';
          }
        }

        if (jobSkills.length === 0) {
          const jobRes = await searchJobs({ keyword: selectedRole }, 1, 200);
          const matchedJob = jobRes.jobs?.find(
            (j: any) => j.job_title === selectedRole
          );
          if (matchedJob) {
            jobSkills = matchedJob.skills || [];
            jobCompany = matchedJob.company || '';
          }
        }

        if (jobSkills.length === 0) {
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
            title: 'Current Qualifications',
            description: `You already have ${mastered.length} of ${jobSkills.length} required skills for ${selectedRole}${jobCompany ? ' at ' + jobCompany : ''}.`,
            skills: mastered,
            type: 'mastered',
            duration: 'Ready now',
          });
        }

        if (missing.length > 0) {
          const skillsPerPhase = Math.ceil(missing.length / 3);
          const phases = Math.min(3, Math.ceil(missing.length / skillsPerPhase));

          for (let i = 0; i < phases; i++) {
            const phaseSkills = missing.slice(i * skillsPerPhase, (i + 1) * skillsPerPhase);
            const weeksNeeded = phaseSkills.length * 2;
            steps.push({
              phase: `Phase ${steps.length + 1}`,
              title: `Learn ${phaseSkills.length > 2 ? phaseSkills.slice(0, 2).join(', ') + ' & more' : phaseSkills.join(' & ')}`,
              description: `Acquire ${phaseSkills.length} skill${phaseSkills.length > 1 ? 's' : ''} needed for ${selectedRole}.`,
              skills: phaseSkills,
              type: 'learning',
              duration: `${weeksNeeded} Weeks`,
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
    fetchRoadmap();
  }, [selectedRole, selectedJobId, navigate]);

  const handleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const totalSkillsToLearn = roadmapSteps
    .filter((s) => s.type === 'learning')
    .reduce((sum, s) => sum + s.skills.length, 0);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F8FAFC' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1 }}>
        <Nav />

        <Box sx={{ flexGrow: 1, p: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/alignment-results', { state: { roleTitle: selectedRole, jobId: selectedJobId, from } })}
            sx={{ mb: 3, color: '#119DA4', fontWeight: 'bold', textTransform: 'none' }}
          >
            Back to Alignment Results
          </Button>

          <Paper sx={{ p: 4, borderRadius: 4, mb: 4, border: '1px solid #E2E8F0' }}>
            <Typography variant="h4" sx={{ color: '#0F172A', fontWeight: 'bold' }}>
              Learning Roadmap
            </Typography>
            <Typography sx={{ mt: 1, color: '#64748B' }}>
              Personalized roadmap for <strong>{selectedRole}</strong>
            </Typography>
            {roadmapSteps.length > 0 && (
              <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
                <Chip label={`${roadmapSteps.length} Phases`} sx={{ bgcolor: '#E0F2FE', color: '#0369A1', fontWeight: 'bold' }} />
                <Chip label={`${totalSkillsToLearn} Skills to Learn`} sx={{ bgcolor: '#FEF3C7', color: '#B45309', fontWeight: 'bold' }} />
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
                  key={step.phase}
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
                        {step.skills.map((skill) => (
                          <Chip
                            key={skill}
                            label={skill}
                            sx={{
                              bgcolor: isMastered ? '#DCFCE7' : '#FEF3C7',
                              color: isMastered ? '#166534' : '#92400E',
                              fontWeight: 500,
                              border: `1px solid ${isMastered ? '#86EFAC' : '#FCD34D'}`,
                            }}
                          />
                        ))}
                      </Box>

                      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                        {!isMastered && (
                          <Button
                            variant="contained"
                            onClick={() => navigate('/my-skill-profile')}
                            sx={{
                              bgcolor: '#119DA4',
                              textTransform: 'none',
                              fontWeight: 'bold',
                              borderRadius: 2,
                              '&:hover': { bgcolor: '#0e7075' },
                            }}
                          >
                            Update Skills
                          </Button>
                        )}
                        <Button
                          variant="outlined"
                          onClick={() => navigate('/job-roles')}
                          sx={{
                            borderColor: '#119DA4',
                            color: '#119DA4',
                            textTransform: 'none',
                            fontWeight: 'bold',
                            borderRadius: 2,
                            '&:hover': { borderColor: '#0e7075', bgcolor: 'rgba(17, 157, 164, 0.05)' },
                          }}
                        >
                          View Other Roles
                        </Button>
                      </Box>
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
