import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded';
import CardContainer from '../Common/CardContainer';
import { getProfile, getSkills } from '../../services/studentService';

const ProfileStrengthCard = () => {
  const [checkmarkItems, setCheckmarkItems] = useState([
    { text: "Resume skills imported", checked: false },
    { text: "At least 8 skills added", checked: false },
    { text: "Profile saved", checked: false },
  ]);
  const [strength, setStrength] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      let completed = 0;
      let items = [...checkmarkItems];

      try {
        const profile = await getProfile() as any;
        const user = profile?.user || profile;
        if (user?.name || user?.email) {
          items[2] = { ...items[2], checked: true };
          completed++;
        }
      } catch {}

      try {
        const skills = await getSkills();
        if (Array.isArray(skills)) {
          if (skills.length > 0) {
            items[0] = { ...items[0], checked: true };
            completed++;
          }
          if (skills.length >= 8) {
            items[1] = { ...items[1], checked: true };
            completed++;
          }
        }
      } catch {}

      setCheckmarkItems(items);
      setStrength(Math.round((completed / 3) * 100));
    };
    fetchData();
  }, []);

  return (
    <CardContainer>
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A', textAlign: 'center', mb: 3 }}>
        Profile Strength
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', mb: 4 }}>
        <CircularProgress variant="determinate" value={100} size={140} thickness={5.5} sx={{ color: '#F1F5F9', position: 'absolute' }} />
        <CircularProgress variant="determinate" value={strength} size={140} thickness={5.5} sx={{ color: '#0F766E', strokeLinecap: 'round' }} />
        <Box sx={{ position: 'absolute', textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A' }}>{strength}%</Typography>
          <Typography variant="caption" sx={{ color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>strength</Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, borderTop: '1px solid #F1F5F9', pt: 3 }}>
        {checkmarkItems.map((item, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {item.checked ? (
              <CheckCircleOutlineRoundedIcon sx={{ color: '#0F766E', fontSize: 20 }} />
            ) : (
              <RadioButtonUncheckedRoundedIcon sx={{ color: '#CBD5E1', fontSize: 20 }} />
            )}
            <Typography variant="body2" sx={{ color: item.checked ? '#0F172A' : '#64748B', fontWeight: item.checked ? 600 : 400 }}>
              {item.text}
            </Typography>
          </Box>
        ))}
      </Box>
    </CardContainer>
  );
};

export default ProfileStrengthCard;
