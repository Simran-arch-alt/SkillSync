import { Box, Typography, Button, Stack } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ExploreIcon from '@mui/icons-material/Explore';
import { Link as RouterLink } from 'react-router-dom';

const Hero = () => {
  return (
    <Box
      sx={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8FAFC', // matches navbar
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
      }}
    >
      {/* Glowing orb for depth */}
      

      {/* Centered content – no side containers */}
      <Box
        sx={{
          textAlign: 'center',
          maxWidth: '900px',
          width: '100%',
          px: { xs: 2, sm: 4 }, // small padding only on very small screens to avoid touching edges
          position: 'relative',
          zIndex: 1,
          mx: 'auto',
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '2.5rem', md: '4.2rem' },
            fontWeight: 800,
            lineHeight: 1.2,
            mb: 2,
            letterSpacing: '-0.02em',
            color: '#000000',
            textShadow: '0 2px 10px rgba(41, 208, 211, 0.3)',
          }}
        >
          Bridge the Gap Between{' '}
          <Box
            component="span"
            sx={{
              background:' #119DA4',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              textShadow: 'none',
            }}
          >
            Your Skills & Industry Demands
          </Box>
        </Typography>

        <Typography
          variant="h6"
          sx={{
            color: '#000000',
            fontSize: { xs: '1rem', md: '1.25rem' },
            fontWeight: 400,
            maxWidth: '650px',
            mx: 'auto',
            mb: 5,
          }}
        >
          AI-powered skill analysis and career recommendations for IT students and fresh graduates.
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}  sx={{justifyContent:'center'}}>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            component={RouterLink}
            to="/login"
            sx={{
              bgcolor: '#FFA9000',
              px: 5,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 700,
              borderRadius: '50px',
              boxShadow: '0 8px 20px rgba(199, 204, 67, 0.4)',
              '&:hover': {
                bgcolor: '#FFB800',
                transform: 'translateY(-3px)',
                boxShadow: '0 15px 30px rgba(199, 204, 67, 0.6)',
              },
            }}
          >
            Analyze Your Skills 
          </Button>
          <Button
            variant="outlined"
            size="large"
            endIcon={<ExploreIcon />}
            component={RouterLink}
            to="/login"
            sx={{
              borderColor: '#119DA4',
              color: '#000000',
              px: 5,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: '50px',
              '&:hover': {
                borderColor: '#119DA4',
                bgcolor: 'rgba(17, 157, 164, 0.1)',
                transform: 'translateY(-3px)',
              },
            }}
          >
            Explore Careers
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default Hero;