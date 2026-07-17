import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import Sidebar from '../components/Nav/Sidebar';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
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

const dashboardColors = {
  primary: '#119DA4',
  primaryDark: '#19647E',
};

interface JobRole {
  title: string;
  description: string;
  label: string;
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
  labelBg: string;
  labelColor: string;
  category: 'tech' | 'management' | 'data';
}

const categoryIcons: Record<string, { icon: ReactNode; bg: string; color: string }> = {
  frontend_developer: { icon: <CodeIcon />, bg: 'rgba(17, 157, 164, 0.08)', color: '#119DA4' },
  backend_developer: { icon: <StorageIcon />, bg: 'rgba(25, 100, 126, 0.08)', color: '#19647E' },
  data_scientist: { icon: <QueryStatsIcon />, bg: 'rgba(30, 58, 95, 0.08)', color: '#1E3A5F' },
  cybersecurity: { icon: <SecurityIcon />, bg: 'rgba(255, 200, 87, 0.18)', color: '#ffc857' },
  cloud_engineer: { icon: <CloudQueueIcon />, bg: 'rgba(17, 157, 164, 0.08)', color: '#119DA4' },
  ml_engineer: { icon: <PrecisionManufacturingIcon />, bg: 'rgba(17, 157, 164, 0.08)', color: '#119DA4' },
};

const defaultIcon = { icon: <CodeIcon />, bg: 'rgba(17, 157, 164, 0.08)', color: '#119DA4' };

interface ApiJob {
  _id: string;
  job_title: string;
  company: string;
  location: string;
  role_category: string;
  skills: string[];
}

const JobRoles = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [apiJobs, setApiJobs] = useState<ApiJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/jobs?limit=100')
      .then(r => r.json())
      .then(json => {
        if (json.success && json.data?.jobs) {
          setApiJobs(json.data.jobs);
        }
      })
      .catch(() => setApiJobs([]))
      .finally(() => setLoading(false));
  }, []);

  const roles: JobRole[] = apiJobs.map(job => {
    const cat = categoryIcons[job.role_category] || defaultIcon;
    return {
      title: job.job_title,
      description: `${job.company} - ${job.location || 'Remote'}`,
      label: job.skills.length > 3 ? 'High Demand' : 'Available',
      icon: cat.icon,
      iconBg: cat.bg,
      iconColor: cat.color,
      labelBg: '#DCFCE7',
      labelColor: '#15803D',
      category: 'tech' as const,
    };
  });

  const filteredRoles = roles.filter((role) => {
    const matchesSearch =
      role.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = roleFilter === 'all' || role.category === roleFilter;
    return matchesSearch && matchesFilter;
  });

  const handleFilterChange = (event: SelectChangeEvent) => {
    setRoleFilter(event.target.value);
  };

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
              onChange={handleFilterChange}
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
              {filteredRoles.length} roles
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
          {filteredRoles.map((role) => (
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

        {filteredRoles.length === 0 && (
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
