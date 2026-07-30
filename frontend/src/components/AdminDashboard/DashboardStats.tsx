import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PsychologyIcon from '@mui/icons-material/Psychology';
import WorkIcon from '@mui/icons-material/Work';
import PublicIcon from '@mui/icons-material/Public';

import { getAdminStats } from '../../services/adminService';
import { getTopSkills } from '../../services/dashboardService';

const statConfigs = [
  {
    title: "Total Users",
    icon: PeopleAltIcon,
    iconBg: "rgba(17, 157, 164, 0.1)",
    iconColor: "#119DA4",
    borderColor: "#119DA4",
  },
  {
    title: "Unique Skills",
    icon: PsychologyIcon,
    iconBg: "rgba(99, 102, 241, 0.1)",
    iconColor: "#6366F1",
    borderColor: "#6366F1",
  },
  {
    title: "Job Roles",
    icon: WorkIcon,
    iconBg: "rgba(245, 158, 11, 0.1)",
    iconColor: "#F59E0B",
    borderColor: "#F59E0B",
  },
  {
    title: "Remote Jobs",
    icon: PublicIcon,
    iconBg: "rgba(22, 163, 74, 0.1)",
    iconColor: "#16A34A",
    borderColor: "#16A34A",
  },
];

const DashboardStats = () => {
  const [values, setValues] = useState<number[]>([0, 0, 0, 0]);
  const [subtexts, setSubtexts] = useState<string[]>(['', '', '', '']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [adminStats, topSkills] = await Promise.all([
          getAdminStats(),
          getTopSkills(100),
        ]);
        setValues([
          adminStats.totalUsers,
          topSkills.length,
          adminStats.totalJobs,
          adminStats.remoteJobs,
        ]);
        setSubtexts([
          `${adminStats.totalStudents} students`,
          'in job market',
          `${adminStats.onsiteJobs} on-site`,
          `${Math.round((adminStats.remoteJobs / Math.max(adminStats.totalJobs, 1)) * 100)}% of total`,
        ]);
      } catch {
        console.error('Failed to fetch admin stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2,1fr)", lg: "repeat(4,1fr)" }, gap: 3, mb: 4 }}>
      {statConfigs.map((config, i) => {
        const Icon = config.icon;
        return (
          <Box
            key={config.title}
            sx={{
              p: 3,
              borderRadius: 4,
              bgcolor: "#FFFFFF",
              border: "1px solid #E2E8F0",
              borderLeft: `4px solid ${config.borderColor}`,
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
              transition: "transform 0.25s ease, box-shadow 0.25s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
              },
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: config.iconBg,
                }}
              >
                <Icon sx={{ fontSize: 26, color: config.iconColor }} />
              </Box>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 0.5, fontSize: { xs: "1.8rem", md: "2.2rem" }, color: "#0F172A" }}>
              {values[i].toLocaleString()}
            </Typography>
            <Typography sx={{ fontWeight: 600, fontSize: "0.9rem", color: "#64748B" }}>
              {config.title}
            </Typography>
            <Typography sx={{ fontSize: "0.78rem", mt: 0.5, color: "#94A3B8" }}>
              {subtexts[i]}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default DashboardStats;
