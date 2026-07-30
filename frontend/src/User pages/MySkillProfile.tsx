import { useState, useEffect } from 'react';
import { Box, Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';

import Sidebar from '../components/Nav/Sidebar';
import Nav from '../components/Nav/Nav';
import ProfileHeader from '../components/skillprofile/Header';
import CurrentSkillsCard from '../components/skillprofile/CurrentSkillsCard';
import AddSkillsCard from '../components/skillprofile/AddSkillsCard';
import ProfileStrengthCard from '../components/skillprofile/ProfileStrengthCard';
import SuggestedSkillsCard from '../components/skillprofile/SuggestedSkillsCard';
import CustomSnackbar from '../components/Common/CustomSnackbar';

import type { Skill } from '../components/skillprofile/CurrentSkillsCard';
import { getSkills, addSkills, removeSkills } from '../services/studentService';
import { useAuth } from '../contexts/AuthContext';

const MySkillProfile = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const [currentSkills, setCurrentSkills] = useState<Skill[]>([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const { skills, resumeSkills } = await getSkills();
        const resumeSet = new Set(resumeSkills);
        setCurrentSkills(
          skills.map((name: string, i: number) => ({
            id: i + 1,
            name,
            source: (resumeSet.has(name) ? 'Resume' : 'Added') as 'Resume' | 'Added',
          }))
        );
      } catch {
        // fallback
      }
    };
    fetchSkills();
  }, []);

  const handleDeleteSkill = async (id: number) => {
    const skill = currentSkills.find((s) => s.id === id);
    if (!skill) return;
    const prev = currentSkills;
    setCurrentSkills((prev) => prev.filter((s) => s.id !== id));
    try {
      await removeSkills([skill.name]);
    } catch {
      setCurrentSkills(prev);
      setSnackbarMessage('Failed to remove skill');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleAddSkill = async (skillName: string) => {
    if (currentSkills.some((s) => s.name.toLowerCase() === skillName.toLowerCase())) {
      setSnackbarMessage('Skill already exists');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
    const newSkill: Skill = { id: Date.now(), name: skillName, source: 'Added' };
    const prev = currentSkills;
    setCurrentSkills((prev) => [...prev, newSkill]);
    try {
      await addSkills([skillName]);
    } catch {
      setCurrentSkills(prev);
      setSnackbarMessage('Failed to add skill');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSave = async () => {
    setSnackbarMessage('Profile saved successfully!');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
    await refreshUser();
    setTimeout(() => navigate('/dashboard'), 2000);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F8FAFC' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Nav />
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <ProfileHeader />
            <Button
              variant="contained"
              onClick={handleSave}
              sx={{ bgcolor: '#0F766E', color: '#FFFFFF', textTransform: 'none', fontWeight: 600, px: 3, py: 1, borderRadius: 2, '&:hover': { bgcolor: '#0D645D' } }}
            >
              Save Profile
            </Button>
          </Box>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 7, lg: 7.5 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <CurrentSkillsCard skills={currentSkills} onDeleteSkill={handleDeleteSkill} />
                <AddSkillsCard onAddSkill={handleAddSkill} />
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 5, lg: 4.5 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <ProfileStrengthCard skills={currentSkills} />
                <SuggestedSkillsCard />
                <CustomSnackbar open={snackbarOpen} message={snackbarMessage} severity={snackbarSeverity} onClose={() => setSnackbarOpen(false)} />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default MySkillProfile;
