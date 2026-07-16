import {
  Box,
  Typography,
  Container,
  Paper,
  Chip,
} from '@mui/material';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const HowItWorksSection = () => {
  const steps = [
    {
      number: '01',
      title: 'Build Your Skill Profile',
      description:
        'Add your current technical skills, interests, experience level, and education. Our system builds a comprehensive profile of your capabilities.',
      icon: <DescriptionOutlinedIcon sx={{ fontSize: 28 }} />,
      features: ['Add technical skills', 'Select proficiency level', 'Add interests & experience'],
      glow: '#4B3F72', // Clean Indigo-Blue
    },
    {
      number: '02',
      title: 'Explore IT Career Paths',
      description:
        'Browse through various IT job roles, see required skills, and select the ones that match your aspirations and goals.',
      icon: <WorkOutlineOutlinedIcon sx={{ fontSize: 28 }} />,
      features: ['Explore job roles', 'View skill requirements', 'Select your target roles'],
      glow: '#FFC857', // Soft Violet
    },
    {
      number: '03',
      title: 'Get Personalized Analysis',
      description:
        'Our AI compares your profile with industry demands, shows skill gaps, and generates a custom learning roadmap.',
      icon: <TrendingUpOutlinedIcon sx={{ fontSize: 28 }} />,
      features: ['AI-powered analysis', 'Learning roadmap', 'Track progress'],
      glow: '#119DA4', 
    },
  ];

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background: '#F8FAFC', // Changed to soft slate light background
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>
        {/* TOP LABEL */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2.5 }}>
          <Chip
            label="3 SIMPLE STEPS"
            sx={{
              color: '#FFFFFF', // Distinct premium brand color
              backgroundColor: '#FFA900',
              border: '1px solid rgba(255, 200, 87, 0.2)',
              fontWeight: 800,
              letterSpacing: '0.05em',
              fontSize: '0.75rem',
              px: 1,
            }}
          />
        </Box>

        {/* HEADING */}
        <Box sx={{ textAlign: 'center', mb: 10 }}>
          <Typography
            sx={{
              fontSize: { xs: '2.2rem', md: '2.8rem' },
              fontWeight: 800,
              lineHeight: 1.2,
              color: '#0F172A',
              mb: 1.5,
              letterSpacing: '-0.02em',
            }}
          >
            How it{' '}
            <Box
              component="span"
              sx={{
                background: '#119DA4',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Works
            </Box>
          </Typography>
          <Typography
            sx={{
              color: '#64748B',
              fontSize: '1.05rem',
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            Get your personalized skill gap analysis in 3 simple steps
          </Typography>
        </Box>

        {/* HORIZONTAL FLEX ROW */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            gap: 4,
            justifyContent: 'center',
            alignItems: 'stretch',
          }}
        >
          {steps.map((step, idx) => (
            <Box
              key={idx}
              sx={{
                position: 'relative',
                flex: 1,
                minWidth: { lg: '280px' },
                '&:hover .step-number-badge': {
                  borderColor: step.glow,
                  color: step.glow,
                  boxShadow: `0 4px 12px ${step.glow}15`,
                }
              }}
            >
              {/* TOP NUMBER CIRCLE */}
              <Box
                className="step-number-badge"
                sx={{
                  position: 'absolute',
                  top: -24,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: 10,
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#64748B',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  boxShadow: '0 4px 6px -1px rgba(15, 23, 42, 0.05)',
                  transition: 'all 0.25s ease',
                }}
              >
                {step.number}
              </Box>

              {/* CARD */}
              <Paper
                elevation={0}
                sx={{
                  width: '100%',
                  height: '100%',
                  pt: 5,
                  p: 4,
                  borderRadius: '20px',
                  background: '#FFFFFF', // Pure clean human-made background
                  border: '1px solid #E2E8F0',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow:3,
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    borderColor: step.glow,
                    boxShadow: '0 16px 24px -8px rgba(15, 23, 42, 0.04), 0 8px 16px -8px rgba(15, 23, 42, 0.04)',
                  },
                }}
              >
                {/* ICON */}
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '14px',
                    background: `${step.glow}0A`, // Clear fine tinted background 
                    border: `1px solid ${step.glow}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: step.glow,
                    mb: 3,
                    mt: 1,
                    alignSelf: 'center'
                  }}
                >
                  {step.icon}
                </Box>

                {/* TITLE */}
                <Typography
                  sx={{
                    color: '#0F172A',
                    fontWeight: 800,
                    fontSize: '1.3rem',
                    lineHeight: 1.3,
                    mb: 1.5,
                    textAlign: 'center'
                  }}
                >
                  {step.title}
                </Typography>

                {/* DESCRIPTION */}
                <Typography
                  sx={{
                    color: '#64748B',
                    fontSize: '0.9rem',
                    lineHeight: 1.6,
                    mb: 4,
                    textAlign: 'center',
                    flexGrow: 1
                  }}
                >
                  {step.description}
                </Typography>

                {/* FEATURES */}
                <Box sx={{ mt: 'auto' }}>
                  {step.features.map((feature, i) => (
                    <Box
                      key={i}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.2,
                        mb: 1.2,
                        background: '#F8FAFC', // Soft interior field rows
                        border: '1px solid #F1F5F9',
                        borderRadius: '10px',
                        px: 1.5,
                        py: 1,
                      }}
                    >
                      <CheckCircleIcon
                        sx={{ color: step.glow, fontSize: 16 }}
                      />
                      <Typography
                        sx={{
                          color: '#334155',
                          fontSize: '0.825rem',
                          fontWeight: 600
                        }}
                      >
                        {feature}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default HowItWorksSection;