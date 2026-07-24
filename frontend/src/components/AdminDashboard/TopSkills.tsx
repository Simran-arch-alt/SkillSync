import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { getTopSkills } from '../../services/dashboardService';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const barColors = ['#119DA4', '#6366F1', '#F59E0B', '#16A34A', '#EF4444'];
const badgeColors = ['#E0F2FE', '#EEF2FF', '#FEF3C7', '#DCFCE7', '#FEE2E2'];
const badgeTextColors = ['#0369A1', '#4338CA', '#92400E', '#166534', '#991B1B'];

const TopSkills = () => {
  const [topSkills, setTopSkills] = useState<{ id: number; name: string; percentage: number; count: number }[]>([]);
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
            count: s.count,
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
    return (
      <Box sx={{ p: 4, borderRadius: 4, border: "1px solid #E2E8F0", bgcolor: "#FFFFFF", boxShadow: "0 4px 20px rgba(0,0,0,0.04)", display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 4,
        borderRadius: 4,
        border: "1px solid #E2E8F0",
        bgcolor: "#FFFFFF",
        boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
        <EmojiEventsIcon sx={{ color: "#F59E0B", fontSize: 24 }} />
        <Typography variant="h6" sx={{ fontWeight: 700, color: "#0F172A" }}>
          Top Skills in Demand
        </Typography>
      </Box>
      <Typography variant="body2" sx={{ color: "#94A3B8", mb: 4 }}>
        Most requested skills across all job postings
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {topSkills.map((skill, i) => (
          <Box key={skill.id}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: badgeColors[i],
                    color: badgeTextColors[i],
                    fontWeight: 800,
                    fontSize: "0.75rem",
                  }}
                >
                  {i + 1}
                </Box>
                <Typography sx={{ fontWeight: 600, color: "#0F172A", fontSize: "0.95rem" }}>
                  {skill.name}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: "#64748B", fontWeight: 600 }}>
                {skill.count} jobs · {skill.percentage}%
              </Typography>
            </Box>
            <Box
              sx={{
                height: 10,
                borderRadius: 10,
                bgcolor: "#F1F5F9",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  height: "100%",
                  width: `${skill.percentage}%`,
                  borderRadius: 10,
                  background: `linear-gradient(90deg, ${barColors[i]}, ${barColors[i]}CC)`,
                  transition: "width 0.8s ease",
                }}
              />
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default TopSkills;
