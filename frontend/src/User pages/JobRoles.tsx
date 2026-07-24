import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import Sidebar from '../components/Nav/Sidebar';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import Nav from '../components/Nav/Nav';

import CodeIcon from '@mui/icons-material/Code';
import StorageIcon from '@mui/icons-material/Storage';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import SecurityIcon from '@mui/icons-material/Security';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import SearchIcon from '@mui/icons-material/Search';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { getJobs } from '../services/jobService';
import type { Job } from '../services/jobService';

const dashboardColors = {
  primary: '#119DA4',
  primaryDark: '#19647E',
};

interface JobRole {
  id: string;
  title: string;
  description: string;
  label: string;
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
  labelBg: string;
  labelColor: string;
  category: 'tech' | 'management' | 'data';
  skills: string[];
}

const categoryIcons: Record<string, { icon: ReactNode; bg: string; color: string }> = {
  frontend_developer: { icon: <CodeIcon />, bg: 'rgba(17, 157, 164, 0.08)', color: '#119DA4' },
  backend_developer: { icon: <StorageIcon />, bg: 'rgba(25, 100, 126, 0.08)', color: '#19647E' },
  full_stack_developer: { icon: <CodeIcon />, bg: 'rgba(17, 157, 164, 0.08)', color: '#119DA4' },
  software_engineer: { icon: <CodeIcon />, bg: 'rgba(17, 157, 164, 0.08)', color: '#119DA4' },
  web_developer: { icon: <CodeIcon />, bg: 'rgba(17, 157, 164, 0.08)', color: '#119DA4' },
  data_scientist: { icon: <QueryStatsIcon />, bg: 'rgba(30, 58, 95, 0.08)', color: '#1E3A5F' },
  data_analyst: { icon: <QueryStatsIcon />, bg: 'rgba(30, 58, 95, 0.08)', color: '#1E3A5F' },
  data_engineer: { icon: <StorageIcon />, bg: 'rgba(30, 58, 95, 0.08)', color: '#1E3A5F' },
  machine_learning_engineer: { icon: <PrecisionManufacturingIcon />, bg: 'rgba(17, 157, 164, 0.08)', color: '#119DA4' },
  ai_engineer: { icon: <PrecisionManufacturingIcon />, bg: 'rgba(17, 157, 164, 0.08)', color: '#119DA4' },
  mlops_engineer: { icon: <PrecisionManufacturingIcon />, bg: 'rgba(17, 157, 164, 0.08)', color: '#119DA4' },
  cybersecurity_analyst: { icon: <SecurityIcon />, bg: 'rgba(255, 200, 87, 0.18)', color: '#ffc857' },
  security_analyst: { icon: <SecurityIcon />, bg: 'rgba(255, 200, 87, 0.18)', color: '#ffc857' },
  cloud_engineer: { icon: <CloudQueueIcon />, bg: 'rgba(17, 157, 164, 0.08)', color: '#119DA4' },
  devops_engineer: { icon: <CloudQueueIcon />, bg: 'rgba(17, 157, 164, 0.08)', color: '#119DA4' },
  platform_engineer: { icon: <CloudQueueIcon />, bg: 'rgba(17, 157, 164, 0.08)', color: '#119DA4' },
  systems_engineer: { icon: <StorageIcon />, bg: 'rgba(25, 100, 126, 0.08)', color: '#19647E' },
  network_engineer: { icon: <CloudQueueIcon />, bg: 'rgba(17, 157, 164, 0.08)', color: '#119DA4' },
};

const defaultIcon = { icon: <CodeIcon />, bg: 'rgba(17, 157, 164, 0.08)', color: '#119DA4' };

const categoryMap: Record<string, 'tech' | 'management' | 'data'> = {
  frontend_developer: 'tech',
  backend_developer: 'tech',
  full_stack_developer: 'tech',
  software_engineer: 'tech',
  web_developer: 'tech',
  devops_engineer: 'tech',
  platform_engineer: 'tech',
  systems_engineer: 'tech',
  network_engineer: 'tech',
  cloud_engineer: 'tech',
  cybersecurity_analyst: 'management',
  security_analyst: 'management',
  data_scientist: 'data',
  data_analyst: 'data',
  data_engineer: 'data',
  machine_learning_engineer: 'data',
  ai_engineer: 'data',
  mlops_engineer: 'data',
  other: 'tech',
};

const JobRoles = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [apiJobs, setApiJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getJobs(1, 1000)
      .then((res) => {
        setApiJobs(res.jobs);
      })
      .catch(() => setApiJobs([]))
      .finally(() => setLoading(false));
  }, []);

  const roles: JobRole[] = apiJobs
    .filter((job) => {
      if (roleFilter !== 'all') {
        const mappedCategory = categoryMap[job.role_category];
        if (mappedCategory !== roleFilter) return false;
      }
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      return (
        job.job_title.toLowerCase().includes(term) ||
        job.company.toLowerCase().includes(term) ||
        job.skills.some((s) => s.toLowerCase().includes(term))
      );
    })
    .map((job) => {
      const cat = categoryIcons[job.role_category] || defaultIcon;
      return {
        id: job._id,
        title: job.job_title,
        description: `${job.company} - ${job.location || 'Remote'}`,
        label: job.skills.length > 3 ? 'High Demand' : 'Available',
        icon: cat.icon,
        iconBg: cat.bg,
        iconColor: cat.color,
        labelBg: '#DCFCE7',
        labelColor: '#15803D',
        category: categoryMap[job.role_category] || 'tech',
        skills: job.skills,
      };
    })
    .sort((a, b) => {
      if (!searchTerm.trim()) return 0;
      const term = searchTerm.toLowerCase();
      const aExactTitle = a.title.toLowerCase() === term ? 0 : a.title.toLowerCase().startsWith(term) ? 1 : a.title.toLowerCase().includes(term) ? 2 : 4;
      const bExactTitle = b.title.toLowerCase() === term ? 0 : b.title.toLowerCase().startsWith(term) ? 1 : b.title.toLowerCase().includes(term) ? 2 : 4;
      if (aExactTitle !== bExactTitle) return aExactTitle - bExactTitle;
      const aSkill = a.skills.some((s) => s.toLowerCase().includes(term)) ? 3 : 4;
      const bSkill = b.skills.some((s) => s.toLowerCase().includes(term)) ? 3 : 4;
      return aSkill - bSkill;
    });

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F8FAFC',
     
     }}>
      <Sidebar/>
      <Box sx={{flexGrow:1}}>
      <Nav/>
      

      <Box sx={{ flexGrow: 1, px: { xs: 2, md: 3, xl: 4 }, py: { xs: 3, md: 4 } }}>
        <Paper
          elevation={0}
          sx={{
            bgcolor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: 4,
            p: { xs: 2.5, md: 4 },
            boxShadow: 3,
            mb: 4,
          }}
        >
          <Stack spacing={2} sx={{ mb: 3, textAlign: { xs: 'left', md: 'center' } }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0e7075' }}>
              Explore Target Job Roles
            </Typography>
            <Typography sx={{ color: '#64748B', maxWidth: 820, mx: 'auto', lineHeight: 1.7 }}>
              Select a career track to analyse your current skill alignment and generate a personalized roadmap.
            </Typography>
          </Stack>

          <Box
            sx={{
              display: 'flex',
              alignItems: { xs: 'stretch', md: 'center' },
              gap: 2,
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ position: 'relative', flex: '1 1 420px', maxWidth: 560 }}>
              <SearchIcon
                sx={{
                  position: 'absolute',
                  left: 18,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94A3B8',
                  zIndex: 1,
                }}
              />
              <Box
                component="input"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search job roles"
                type="text"
                sx={{
                  width: '100%',
                  height: 48,
                  borderRadius: 999,
                  border: '1px solid #E2E8F0',
                  bgcolor: '#F8FAFC',
                  color: '#0F172A',
                  pl: 6,
                  pr: 2,
                  fontFamily: 'inherit',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                  '&::placeholder': {
                    color: '#94A3B8',
                    opacity: 1,
                  },
                  '&:hover': {
                    borderColor: '#CBD5E1',
                  },
                  '&:focus': {
                  borderColor: dashboardColors.primary,
                  boxShadow: '0 0 0 4px rgba(17, 157, 164, 0.08)',
                  },
                }}
              />
            </Box>

            <Select
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value as string)}
              size="medium"
              sx={{
                minWidth: 160,
                borderRadius: 999,
                bgcolor: '#F8FAFC',
                color: '#0F172A',
                fontWeight: 600,
                height: 48,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#E2E8F0',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#CBD5E1',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: dashboardColors.primary,
                },
              }}
            >
              <MenuItem value="all">All Roles</MenuItem>
              <MenuItem value="tech">High Demand</MenuItem>
              <MenuItem value="management">Growth Sector</MenuItem>
              <MenuItem value="data">Emerging</MenuItem>
            </Select>

            <Typography variant="body2" sx={{ color: '#94A3B8', fontWeight: 600, alignSelf: 'center' }}>
              {loading ? 'Searching...' : `${roles.length} roles`}
            </Typography>
          </Box>
        </Paper>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '2fr',
              md: 'repeat(3, minmax(0, 1fr))',
              xl: 'repeat(3, minmax(0, 1fr))',
              
            },
            gap: 2.5,
          }}
        >
          {roles.map((role) => (
            <Card
              key={role.title}
              elevation={0}
              sx={{
                borderRadius: 4,
                border: '1px solid #E2E8F0',
                boxShadow: '0 8px 24px rgba(15, 23, 42, 0.05)',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3,
                },
              }}
            >
              <CardContent sx={{ p: 2.75, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2.5 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 3,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: role.iconBg,
                      color: role.iconColor,
                    }}
                  >
                    {role.icon}
                  </Box>

                  <Chip
                    label={role.label}
                    size="small"
                    sx={{
                      bgcolor: role.labelBg,
                      color: role.labelColor,
                      fontWeight: 700,
                      borderRadius: 999,
                      height: 32,
                    }}
                  />
                </Box>

                <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', mb: 1.25, fontSize: '1.05rem' }}>
                  {role.title}
                </Typography>

                <Typography sx={{ color: '#64748B', lineHeight: 1.7, fontSize: '0.95rem', flexGrow: 1 }}>
                  {role.description}
                </Typography>

                <Button onClick={() =>
                  navigate("/alignment-results",{
                    state:{
                      roleTitle: role.title,
                      jobId: role.id,
                      from: "job-roles",
                    },
                    
                  })
                }
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    mt: 2.5,
                    alignSelf: 'flex-end',
                    color: dashboardColors.primary,
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    px: 0,
                    '&:hover': {
                      backgroundColor: 'transparent',
                      color: dashboardColors.primaryDark,
                    },
                  }}
                >
                  Analyse Alignment
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>

        {roles.length === 0 && (
          <Paper
            elevation={0}
            sx={{
              mt: 4,
              p: 4,
              borderRadius: 4,
              border: '1px dashed #CBD5E1',
              bgcolor: '#FFFFFF',
              textAlign: 'center',
            }}
          >
            <Typography variant="h6" sx={{ color: '#0F172A', mb: 1 }}>
              No roles found
            </Typography>
            <Typography sx={{ color: '#64748B' }}>
              Try a different search term or clear the filter.
            </Typography>
          </Paper>
        )}
      </Box>
    </Box>
    </Box>
  );
};

export default JobRoles;
