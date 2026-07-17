import { useState, useEffect } from 'react';
import { Box, Typography, Chip, CircularProgress } from '@mui/material';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import CardContainer from '../Common/CardContainer';
import { getTopSkills } from '../../services/dashboardService';
import { getSkills } from '../../services/studentService';

const SuggestedSkillsCard = () => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const topSkills = await getTopSkills(15);
        const userSkills = await getSkills().catch(() => []);
        const userSkillSet = new Set((Array.isArray(userSkills) ? userSkills : []).map((s: string) => s.toLowerCase()));
        const suggested = topSkills
          .filter(s => !userSkillSet.has(s.skill.toLowerCase()))
          .slice(0, 7)
          .map(s => s.skill);
        setSuggestions(suggested);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSuggestions();
  }, []);

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

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <CircularProgress size={24} />
        </Box>
      ) : (
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
          {suggestions.length === 0 && (
            <Typography variant="body2" sx={{ color: '#94A3B8' }}>
              Add more skills to get suggestions
            </Typography>
          )}
        </Box>
      )}
    </CardContainer>
  );
};

export default SuggestedSkillsCard;
