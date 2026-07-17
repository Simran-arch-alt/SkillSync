import { useState, useEffect } from 'react';
import { Box, LinearProgress, Typography, CircularProgress } from '@mui/material';
import CardContainer from '../Common/CardContainer';
import { getTopSkills } from '../../services/dashboardService';

const TopSkills = () => {
  const [topSkills, setTopSkills] = useState<{ id: number; name: string; percentage: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const skills = await getTopSkills(5);
        if (skills.length > 0) {
          const maxCount = skills[0].count;
          setTopSkills(skills.map((s, i) => ({
            id: i,
            name: s.skill,
            percentage: Math.round((s.count / maxCount) * 100),
          })));
        }
      } catch {
        console.error('Failed to fetch top skills');
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>;
  }

  return (
    <CardContainer>
      <Typography variant="h6" sx={{ fontWeight: "bold", color: "#0F172A", mb: 3 }}>Top Skills</Typography>
      {topSkills.map((skill) => (
        <Box key={skill.id} sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography sx={{ fontWeight: 600 }}>{skill.name}</Typography>
            <Typography variant="body2" color="text.secondary">{skill.percentage}%</Typography>
          </Box>
          <LinearProgress variant="determinate" value={skill.percentage} sx={{ height: 10, borderRadius: 10, bgcolor: "#E2E8F0", "& .MuiLinearProgress-bar": { bgcolor: "#119DA4", borderRadius: 10 } }} />
        </Box>
      ))}
    </CardContainer>
  );
};

export default TopSkills;
