import { Box, Typography, Container, Grid, IconButton, Divider } from '@mui/material';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#19647E', // matches navbar/hero
        color: '#e2e8f0',
        pt: 6,
        pb: 3,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand column */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <AutoGraphIcon sx={{ fontSize: 32, color: '#FFFFFF' }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFFFFF' }}>
                SkillSync
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2, color: '#94a3b8' }}>
              Build the gap. Build your future.
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <EmailIcon sx={{ fontSize: 18 }} /> support@skillsync.com
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <PhoneIcon sx={{ fontSize: 18 }} /> +1 (555) 123-4567
            </Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOnIcon sx={{ fontSize: 18 }} /> Kathmandu, Nepal
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#ffffff', mb: 2 }}>
              Quick Links
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0 }}>
              <li><Typography component="a" href="#" sx={{ color: '#94a3b8', textDecoration: 'none', '&:hover': { color: '#38bdf8' }, display: 'inline-block', py: 0.5 }}>Features</Typography></li>
              <li><Typography component="a" href="#" sx={{ color: '#94a3b8', textDecoration: 'none', '&:hover': { color: '#38bdf8' }, display: 'inline-block', py: 0.5 }}>How it works</Typography></li>
              <li><Typography component="a" href="#" sx={{ color: '#94a3b8', textDecoration: 'none', '&:hover': { color: '#38bdf8' }, display: 'inline-block', py: 0.5 }}>About Us</Typography></li>
              <li><Typography component="a" href="#" sx={{ color: '#94a3b8', textDecoration: 'none', '&:hover': { color: '#38bdf8' }, display: 'inline-block', py: 0.5 }}>Contact</Typography></li>
            </Box>
          </Grid>

          {/* Resources */}
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#ffffff', mb: 2 }}>
              Resources
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0 }}>
              <li><Typography component="a" href="#" sx={{ color: '#94a3b8', textDecoration: 'none', '&:hover': { color: '#38bdf8' }, display: 'inline-block', py: 0.5 }}>Career Paths</Typography></li>
              <li><Typography component="a" href="#" sx={{ color: '#94a3b8', textDecoration: 'none', '&:hover': { color: '#38bdf8' }, display: 'inline-block', py: 0.5 }}>Skill Assessment</Typography></li>
              <li><Typography component="a" href="#" sx={{ color: '#94a3b8', textDecoration: 'none', '&:hover': { color: '#38bdf8' }, display: 'inline-block', py: 0.5 }}>Blog</Typography></li>
              <li><Typography component="a" href="#" sx={{ color: '#94a3b8', textDecoration: 'none', '&:hover': { color: '#38bdf8' }, display: 'inline-block', py: 0.5 }}>FAQ</Typography></li>
            </Box>
          </Grid>

          {/* Legal & Social */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#ffffff', mb: 2 }}>
              Follow Us
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
              <IconButton href="#" sx={{ color: '#FFFFFF', }}aria-label="Facebook">
                <FacebookIcon />
              </IconButton>
              <IconButton href="#" sx={{ color: '#FFFFFF', }} aria-label="Twitter">
                <TwitterIcon />
              </IconButton>
              <IconButton href="#" sx={{ color: '#FFFFFF', }} aria-label="LinkedIn">
                <LinkedInIcon />
              </IconButton>
              <IconButton href="#" sx={{ color: '#FFFFFF', }} aria-label="GitHub">
                <GitHubIcon />
              </IconButton>
            </Box>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
              Subscribe to our newsletter
            </Typography>
            <Box sx={{ display: 'flex', mt: 1 }}>
              <Box
                component="input"
                type="email"
                placeholder="Your email"
                sx={{
                  flex: 1,
                  p: 1,
                  borderRadius: '30px 0 0 30px',
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.875rem',
                  backgroundColor: '#FFFFFF',
                  color: '#000000',
                }}
              />
              <Box
                component="button"
                sx={{
                  bgcolor: '#FFA900',
                  border: 'none',
                  borderRadius: '0 30px 30px 0',
                  px: 2,
                  cursor: 'pointer',
                  color: '#fff',
                  fontWeight: 600,
                  '&:hover': { bgcolor: '#2563eb' },
                }}
              >
                Subscribe
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.1)' }} />

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>
            © {currentYear} SkillSync. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;