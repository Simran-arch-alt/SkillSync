import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import CardContainer from '../Common/CardContainer';

const SuggestedSkillsCard = () => {
  const suggestions = ["TypeScript", "PostgreSQL", "Kubernetes", "AWS", "GraphQL", "Redis", "Terraform"];

  return (
    <CardContainer>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <AutoAwesomeRoundedIcon sx={{ color: '#6366F1', fontSize: 18 }} />
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A' }}>
          Suggested Skills
        </Typography>
      </Box>
      <Typography variant="body2" sx={{ color: '#64748B', mb: 2.5 }}>
        Based on your current stack
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
        {suggestions.map((skill) => (
          <Chip
            key={skill}
            label={`+ ${skill}`}
            clickable
            sx={{
              fontWeight: 600,
              bgcolor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              color: '#334155',
              '&:hover': {
                bgcolor: '#F8FAFC',
                borderColor: '#CBD5E1'
              }
            }}
          />
        ))}
      </Box>
    </CardContainer>
  );
};

export default SuggestedSkillsCard;