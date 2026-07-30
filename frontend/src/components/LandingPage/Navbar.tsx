import { AppBar, Toolbar, Box, Button, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';


const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeSection, setActiveSection] = useState<string>('why-choose');

  const sections = ['why-choose', 'how-it-works', 'about-us'];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;
      let current = sections[0];

      sections.forEach((sectionId) => {
        const section = document.getElementById(sectionId);
        if (section && section.offsetTop <= scrollPosition) {
          current = sectionId;
        }
      });

      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getNavButtonSx = (sectionId: string) => ({
    fontWeight: 600,
    color: activeSection === sectionId ? '#19647E' : '#64748B',
    backgroundColor: activeSection === sectionId ? 'rgba(25, 100, 126, 0.1)' : 'transparent',
    borderRadius: 2,
    px: 1.5,
    '&:hover': {
      color: '#19647E',
      backgroundColor: 'rgba(25, 100, 126, 0.08)',
    },
  });
  

  // Smooth scroll helper with offset (navbar height)
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 80; // approximate height of sticky navbar
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - navbarHeight,
        behavior: 'smooth',
      });
    }
  };

  return (
    <AppBar
      position="sticky"
      color="transparent"
      elevation={0}
      sx={{
        backgroundColor: '#FFFAFC',
        borderBottom: '1px solid #E2E8F0',
        width: '100%',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', flexWrap: 'wrap', py: 1, px: { xs: 2, md: 4 } }}>
        {/* Logo area – click to scroll to top */}
        <Box
          sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <AutoGraphIcon
            sx={{
              fontSize: 36,
              color: '#19647E',
              filter: 'drop-shadow(0 0 3px rgba(25, 100, 126, 0.25))',
            }}
          />
          <Box>
            <Box
              component="span"
              sx={{
                fontSize: '1.9rem',
                fontWeight: 800,
                
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: '#000000',
              }}
            >
              Skill
            
            </Box>
            <Box
              component="span"
              sx={{
                fontSize: '1.9rem',
                fontWeight: 800,
                
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: '#19647E',
              }}
            >
              Sync
            
            </Box>




            <Box
              component="div"
              sx={{
                fontSize: '0.7rem',
                fontWeight: 500,
                color: '#64748B',
                letterSpacing: '0.3px',
              }}
            >
              Build the gap. Build your future.
            </Box>
          </Box>
        </Box>

        {/* Navigation links and buttons */}
        <Box
          sx={{
            display: 'flex',
            gap: isMobile ? 2 : 3,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Button
            onClick={() => scrollToSection('why-choose')}
            sx={getNavButtonSx('why-choose')}
          >
            Features
          </Button>
          <Button
            onClick={() => scrollToSection('how-it-works')}
            sx={getNavButtonSx('how-it-works')}
          >
            How it works
          </Button>
          <Button
            onClick={() => scrollToSection('about-us')}
            sx={getNavButtonSx('about-us')}
          >
            About Us
          </Button>
          <Button
            variant="outlined"
            component={RouterLink}
            to="/login"
            sx={{
              borderColor: '#19647E',
              color: '#19647E',
              borderRadius: 40,
              px: 3,
              py: 0.8,
              fontWeight: 600,
              transition: 'all 0.2s',
              '&:hover': {

              borderColor: '#119DA4',
                bgcolor: 'rgba(17, 157, 164, 0.1)',
                transform: 'translateY(-3px)',
              },
            }}



              
          >
            Log in
          </Button>
          <Button
            variant="contained"
            component={RouterLink}
            to="/login"
            sx={{
              bgcolor: '#19647E',
              borderRadius: 40,
              px: 3,
              py: 0.8,
              fontWeight: 600,
              boxShadow: '0 4px 14px rgba(58, 216, 237, 0.28)',
              transition: 'all 0.2s',
              '&:hover': { bgcolor: '#19647E', transform: 'translateY(-2px)', boxShadow: '0 8px 20px rgba(58, 216, 237, 0.35)' },
            }}
          >
            Get Started
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;