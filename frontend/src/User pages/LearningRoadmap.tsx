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
  LinearProgress,
  Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Nav/Sidebar';
import Nav from '../components/Nav/Nav';
import { getSkills } from '../services/studentService';

interface RoadmapStep {
  jobId: string;
  title: string;
  company: string;
  location: string;
  isRemote: boolean;
  roleCategory: string;
  seniorityLevel: string;
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  duration: string;
}

const LearningRoadmap: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [roadmapSteps, setRoadmapSteps] = useState<RoadmapStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const selectedRole = location.state?.roleTitle || 'Selected Role';

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const userSkills = await getSkills();
        const skillsArray = Array.isArray(userSkills) ? userSkills : [];

        if (skillsArray.length === 0) {
          setLoading(false);
          return;
        }

        const res = await fetch('/api/recommendations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ skills: skillsArray }),
        });
        const json = await res.json();
        if (json.success && json.data?.recommendations) {
          const steps: RoadmapStep[] = json.data.recommendations.slice(0, 5).map((rec: any) => ({
            jobId: rec.jobId || '',
            title: rec.job,
            company: rec.company || 'Various Companies',
            location: rec.location || 'Not specified',
            isRemote: rec.is_remote || false,
            roleCategory: rec.role_category || '',
            seniorityLevel: rec.seniority_level || '',
            score: rec.score || 0,
            matchedSkills: rec.matchedSkills || [],
            missingSkills: rec.missingSkills || [],
            duration: `${rec.missingSkills?.length ? rec.missingSkills.length * 2 : 4} Weeks`,
          }));
          setRoadmapSteps(steps);
        }
      } catch (err) {
        console.error('Failed to fetch roadmap:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmap();
  }, []);

  const handleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const totalSkillsToLearn = roadmapSteps.reduce((sum, s) => sum + s.missingSkills.length, 0);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F8FAFC' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1 }}>
        <Nav />

        <Box sx={{ flexGrow: 1, p: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/alignment-results', { state: { roleTitle: selectedRole } })}
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
          ) : roadmapSteps.length > 0 ? (
            roadmapSteps.map((step, index) => {
              const isExpanded = expandedIndex === index;
              const totalRequired = step.matchedSkills.length + step.missingSkills.length;
              const progress = totalRequired > 0 ? Math.round((step.matchedSkills.length / totalRequired) * 100) : 0;

              return (
                <Paper
                  key={step.jobId || step.title}
                  sx={{
                    mb: 2,
                    borderRadius: 3,
                    borderLeft: '6px solid #119DA4',
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
                            bgcolor: '#119DA4',
                            color: '#fff',
                            fontWeight: 'bold',
                            px: 1.5,
                            py: 0.3,
                            borderRadius: 1,
                            fontSize: '0.8rem',
                          }}
                        >
                          Phase {index + 1}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#0F172A' }}>
                          {step.title}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 2, mt: 1, color: '#64748B', fontSize: '0.85rem' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <BusinessCenterOutlinedIcon sx={{ fontSize: 16 }} />
                          {step.company}
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <LocationOnOutlinedIcon sx={{ fontSize: 16 }} />
                          {step.isRemote ? 'Remote' : step.location}
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <WorkOutlineIcon sx={{ fontSize: 16 }} />
                          {step.seniorityLevel || 'Mid Level'}
                        </Box>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ textAlign: 'right', minWidth: 120 }}>
                        <Typography sx={{ color: '#64748B', fontSize: '0.75rem' }}>Match Score</Typography>
                        <Typography sx={{ fontWeight: 'bold', color: progress >= 50 ? '#16A34A' : '#EA580C', fontSize: '1.1rem' }}>
                          {Math.round(step.score)}%
                        </Typography>
                      </Box>
                      <IconButton size="small" sx={{ color: '#119DA4' }}>
                        {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </Box>
                  </Box>

                  <Collapse in={isExpanded} timeout={300}>
                    <Divider />
                    <Box sx={{ p: 3 }} onClick={(e) => e.stopPropagation()}>
                      <Box sx={{ mb: 3 }}>
                        <Typography sx={{ color: '#64748B', fontWeight: 'bold', mb: 1 }}>
                          Overall Progress
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <LinearProgress
                            variant="determinate"
                            value={progress}
                            sx={{
                              flex: 1,
                              height: 10,
                              borderRadius: 5,
                              bgcolor: '#E5E7EB',
                              '& .MuiLinearProgress-bar': {
                                bgcolor: progress >= 70 ? '#16A34A' : progress >= 40 ? '#F59E0B' : '#EF4444',
                                borderRadius: 5,
                              },
                            }}
                          />
                          <Typography sx={{ fontWeight: 'bold', color: '#0F172A', minWidth: 45 }}>
                            {progress}%
                          </Typography>
                        </Box>
                        <Typography sx={{ color: '#64748B', mt: 0.5, fontSize: '0.8rem' }}>
                          {step.matchedSkills.length} of {totalRequired} required skills · Est. {step.duration}
                        </Typography>
                      </Box>

                      {step.matchedSkills.length > 0 && (
                        <Box sx={{ mb: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                            <CheckCircleOutlineIcon sx={{ color: '#16A34A', fontSize: 20 }} />
                            <Typography sx={{ fontWeight: 'bold', color: '#16A34A' }}>
                              Skills You Already Have ({step.matchedSkills.length})
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {step.matchedSkills.map((skill) => (
                              <Chip
                                key={skill}
                                label={skill}
                                sx={{
                                  bgcolor: '#DCFCE7',
                                  color: '#166534',
                                  fontWeight: 500,
                                  border: '1px solid #86EFAC',
                                }}
                              />
                            ))}
                          </Box>
                        </Box>
                      )}

                      {step.missingSkills.length > 0 && (
                        <Box sx={{ mb: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                            <HighlightOffIcon sx={{ color: '#DC2626', fontSize: 20 }} />
                            <Typography sx={{ fontWeight: 'bold', color: '#DC2626' }}>
                              Skills to Learn ({step.missingSkills.length})
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {step.missingSkills.map((skill) => (
                              <Chip
                                key={skill}
                                label={skill}
                                sx={{
                                  bgcolor: '#FEE2E2',
                                  color: '#991B1B',
                                  fontWeight: 500,
                                  border: '1px solid #FCA5A5',
                                }}
                              />
                            ))}
                          </Box>
                        </Box>
                      )}

                      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <Button
                          variant="contained"
                          onClick={() => navigate('/job-roles')}
                          sx={{
                            bgcolor: '#119DA4',
                            textTransform: 'none',
                            fontWeight: 'bold',
                            borderRadius: 2,
                            '&:hover': { bgcolor: '#0e7075' },
                          }}
                        >
                          View Job Details
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() => navigate('/my-skill-profile')}
                          sx={{
                            borderColor: '#119DA4',
                            color: '#119DA4',
                            textTransform: 'none',
                            fontWeight: 'bold',
                            borderRadius: 2,
                            '&:hover': { borderColor: '#0e7075', bgcolor: 'rgba(17, 157, 164, 0.05)' },
                          }}
                        >
                          Update Skills
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
