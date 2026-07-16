import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded';
import CardContainer from '../Common/CardContainer';

const ProfileStrengthCard = () => {
  const checkmarkItems = [
    { text: "Resume skills imported", checked: true },
    { text: "At least 8 skills added", checked: false },
    { text: "Profile saved", checked: false }
  ];

  return (
    <CardContainer>
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A', textAlign: 'center', mb: 3 }}>
        Profile Strength
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', mb: 4 }}>
        <CircularProgress
          variant="determinate"
          value={100}
          size={140}
          thickness={5.5}
          sx={{ color: '#F1F5F9', position: 'absolute' }}
        />
        <CircularProgress
          variant="determinate"
          value={62}
          size={140}
          thickness={5.5}
          sx={{
            color: '#0F766E',
            strokeLinecap: 'round',
          }}
        />
        <Box sx={{ position: 'absolute', textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A' }}>
            62%
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748B', textTransform: 'uppercase', fontWeight: 600 }}>
            strength
          </Typography>
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