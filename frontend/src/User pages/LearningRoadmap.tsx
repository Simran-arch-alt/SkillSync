import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Nav/Sidebar';
import Nav from '../components/Nav/Nav';
import { useState, useEffect } from 'react';
import { getSkills } from '../services/studentService';

interface RoadmapStep {
  title: string;
  duration: string;
  description: string;
}

const LearningRoadmap: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [roadmapSteps, setRoadmapSteps] = useState<RoadmapStep[]>([]);
  const [loading, setLoading] = useState(true);

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
            title: rec.job,
            duration: `${rec.missingSkills?.length ? rec.missingSkills.length * 2 : 4} Weeks`,
            description: rec.missingSkills?.length
              ? `Learn ${rec.missingSkills.join(', ')} to improve your match score from ${Math.round(rec.score)}% to 100%.`
              : `You already match this role well (${Math.round(rec.score)}%). Focus on advanced skills.`,
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
          </Paper>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          ) : roadmapSteps.length > 0 ? (
            roadmapSteps.map((step, index) => (
              <Paper key={step.title} sx={{ p: 3, mb: 3, borderRadius: 3, borderLeft: '6px solid #119DA4', boxShadow: 2 }}>
                <Typography variant="h6" sx={{ color: '#119DA4', fontWeight: 'bold' }}>
                  Phase {index + 1}
                </Typography>
                <Typography sx={{ mt: 1, fontWeight: 'bold', color: '#0F172A' }}>
                  {step.title}
                </Typography>
                <Typography sx={{ color: '#64748B', mt: 1 }}>
                  {step.description}
                </Typography>
                <Typography sx={{ mt: 2, color: '#119DA4', fontWeight: 'bold' }}>
                  Duration: {step.duration}
                </Typography>
              </Paper>
            ))
          ) : (
            <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
              <Typography>No roadmap available. Add skills to your profile first.</Typography>
            </Paper>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default LearningRoadmap;
