import { Box, Typography, Container, Paper } from '@mui/material';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import TimelineIcon from '@mui/icons-material/Timeline';

const WhyChooseSection = () => {
  // Balanced palette using sophisticated primary colors
  const features = [
    {
      title: 'Skill Gap Analysis',
      description: 'Identify missing technical skills by comparing your current capabilities with industry requirements',
      icon: <AnalyticsIcon sx={{ fontSize: 42, color: '#19647E' }} />, // Vibrant Blue
      accentColor: '#19C1D9',
    },
    {
      title: 'Career Matching',
      description: 'Find your ideal IT career path with personalized recommendation based on your skills, interests, and market demand',
      icon: <PersonSearchIcon sx={{ fontSize: 42, color: '#4B3F72' }} />, // Soft Violet
      accentColor: '#8B5CF6',
    },
    {
      title: 'Learning Roadmap',
      description: 'Step-by-step skill progression using directed acyclic graphs to optimize your learning path and track your progress.',
      icon: <TimelineIcon sx={{ fontSize: 42, color: '#FFC857' }} />, // Cyan
      accentColor: '#FFC857',
    },
  ];

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background: '#F8FAFC', // Changed to soft slate background so white cards pop
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>
        {/* Heading */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            sx={{
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 800,
              color: '#000000',
              mb: 1.5,
              letterSpacing: '-0.02em'
            }}
          >
            Why Choose{' '}
            <Box
              component="span"
              sx={{
                background:'#119DA4',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              SkillSync?
            </Box>
          </Typography>
          <Typography
            sx={{
              color: '#64748B',
              maxWidth: '600px',
              mx: 'auto',
              fontSize: '1.05rem',
            }}
          >
            Comprehensive tools to guide your journey from student to professional
          </Typography>
        </Box>

        {/* Horizontal flex row */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            gap: 4,
            justifyContent: 'center',
            alignItems: 'stretch',
          }}
        >
          {features.map((feature, idx) => (
            <Paper
              key={idx}
              elevation={0}
              sx={{
                flex: 1,
                minWidth: { lg: '280px' },
                p: 4,
                textAlign: 'center',
                boxShadow:3,
                borderRadius: 4,
                bgcolor: '#FFFFFF', // Clean human-made white card background
                border: '1px solid #E2E8F0', // Clean fine outer border
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  borderColor: feature.accentColor, // Border subtly shifts to accent color on hover
                  boxShadow: '0 12px 20px -5px rgba(15, 23, 42, 0.04), 0 8px 16px -6px rgba(15, 23, 42, 0.04)', // Organic natural shadow
                },
              }}
            >
              {/* Modern Icon wrapper styling */}
              <Box 
                sx={{ 
                  mb: 3,
                  display: 'inline-flex',
                  p: 1.5,
                  borderRadius: 3,
                  
                  boxShadow:3,// Light shadow for depth
                }}
              >
                {feature.icon}
              </Box>
              
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#0F172A', mb: 1.5, fontSize: '1.25rem' }}>
                {feature.title}
              </Typography>
              
              <Typography sx={{ color: '#64748B', fontSize: '0.95rem', lineHeight: 1.6 }}>
                {feature.description}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default WhyChooseSection;