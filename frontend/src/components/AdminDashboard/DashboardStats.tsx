import { useState, useEffect } from 'react';
import { Box, CardContent, Typography, CircularProgress } from '@mui/material';

import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PsychologyIcon from '@mui/icons-material/Psychology';
import WorkIcon from '@mui/icons-material/Work';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

import CardContainer from '../Common/CardContainer';
import { getAdminStats } from '../../services/adminService';
import { getTopSkills } from '../../services/dashboardService';

const DashboardStats = () => {
  const [stats, setStats] = useState([
    { title: "Total Users", value: 0, growth: "", icon: <PeopleAltIcon sx={{ fontSize: 42, color: "#119DA4" }} /> },
    { title: "Total Skills", value: 0, growth: "", icon: <PsychologyIcon sx={{ fontSize: 42, color: "#3B82F6" }} /> },
    { title: "Job Roles", value: 0, growth: "", icon: <WorkIcon sx={{ fontSize: 42, color: "#F59E0B" }} /> },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [adminStats, topSkills] = await Promise.all([
          getAdminStats(),
          getTopSkills(100),
        ]);
        setStats([
          { title: "Total Users", value: adminStats.totalUsers, growth: `${adminStats.totalStudents} students`, icon: <PeopleAltIcon sx={{ fontSize: 42, color: "#119DA4" }} /> },
          { title: "Unique Skills", value: topSkills.length, growth: "in job market", icon: <PsychologyIcon sx={{ fontSize: 42, color: "#3B82F6" }} /> },
          { title: "Job Roles", value: adminStats.totalJobs, growth: `${adminStats.remoteJobs} remote`, icon: <WorkIcon sx={{ fontSize: 42, color: "#F59E0B" }} /> },
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
    return <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2,1fr)", lg: "repeat(3,1fr)" }, gap: 3, mb: 4 }}>
      {stats.map((item) => (
        <CardContainer key={item.title}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              {item.icon}
              <TrendingUpIcon sx={{ color: "#16A34A" }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#0F172A" }}>{item.value}</Typography>
            <Typography sx={{ color: "#64748B", mt: 0.5 }}>{item.title}</Typography>
            {item.growth && <Typography variant="body2" sx={{ color: "#16A34A", mt: 0.5 }}>{item.growth}</Typography>}
          </CardContent>
        </CardContainer>
      ))}
    </Box>
  );
};

export default DashboardStats;
