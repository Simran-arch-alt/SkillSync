import { Box, Typography, Grid, Container, Paper } from '@mui/material';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StarIcon from '@mui/icons-material/Star';

const AboutUs = () => {
  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background: '#F8FAFC', 
      }}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: 6,
            background: '#FFFFFF', 
            border: '1px solid #E2E8F0', 
            boxShadow: 3,
            
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)', // Gentle modern lift
              borderColor: '#E2E8F0', // Subtle border highlight
              
              // Expands the soft shadow subtly as the card rises
              boxShadow: '0px 20px 40px rgba(0, 0, 0, 0.05), 0px 1px 5px rgba(0, 0, 0, 0.02)',
            },
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 800,
              textAlign: 'center',
              letterSpacing: '-0.02em',
              mb: 3,
              background: '#19647E',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color:"#19647E"
            }}
          >
            ABOUT US
          </Typography>

          <Typography
            sx={{
              fontSize: '1rem',
              lineHeight: 1.6,
              color: '#64748B', 
              textAlign: 'center',
              maxWidth: '900px',
              mx: 'auto',
              mb: 2,
             
            }}
          >
            SkillSync means bridging the gap between your skills & industry demands. SkillSync was born from a
            simple observation: many talented IT graduates struggle to find their first job because they lack
            awareness of current industry skill requirements. Our platform uses AI to analyze your existing skills,
            compare them with real‑world job roles, and generate a personalized learning roadmap.
          </Typography>

          <Grid container spacing={5} alignItems="center">
            {/* Left: Illustration with hover pop */}
            
            <Grid item xs={12} md={7}>
              {/* Mission */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  mb: 3,
                  p: 2,
                  borderRadius: 3,
                  transition: 'transform 0.2s, background 0.2s',
                  '&:hover': {
                    transform: 'translateX(6px)',
                    background: 'rgba(5B, 130, 246, 0.04)', 
                  },
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 3,
                    background: 'rgba(5B, 130, 246, 0.08)',
                    border: '1px solid rgba(5B, 130, 246, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow:3,
                  }}
                >
                  <EmojiEmotionsIcon sx={{ color: '#19647E', fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A', mb: 0.5, fontSize: '1.1rem' }}>
                    Our Mission
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748B', lineHeight: 1.5 }}>
                    Empower IT students and fresh graduates with AI‑driven clarity.
                  </Typography>
                </Box>
              </Box>

              {/* Vision */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  mb: 3,
                  p: 2,
                  borderRadius: 3,
                  transition: 'transform 0.2s, background 0.2s',
                  '&:hover': {
                    transform: 'translateX(6px)',
                    background: 'rgba(5B, 130, 246, 0.04)',
                   
                  },
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 3,
                    background: 'rgba(5B, 130, 246, 0.08)',
                    border: '1px solid rgba(5B, 130, 246, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                     boxShadow:3,
                  }}
                >
                  <VisibilityIcon sx={{ color: '#FFA900', fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A', mb: 0.5, fontSize: '1.1rem' }}>
                    Our Vision
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748B', lineHeight: 1.5 }}>
                    A world where every tech professional transitions seamlessly from learning to thriving.
                  </Typography>
                </Box>
              </Box>

              {/* Values */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  p: 2,
                  borderRadius: 3,
                  transition: 'transform 0.2s, background 0.2s',
                  '&:hover': {
                    transform: 'translateX(6px)',
                    background: 'rgba(5B, 130, 246, 0.04)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 3,
                    background: 'rgba(5B, 130, 246, 0.08)',
                    border: '1px solid rgba(5B, 130, 246, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: 3
                  }}
                >
                  <StarIcon sx={{ color: '#333D6D', fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#0F172A', mb: 1, fontSize: '1.1rem' }}>
                    Our Values
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {['Integrity', 'Excellence', 'Innovation', 'Sustainability'].map((value) => (
                      <Typography
                        key={value}
                        variant="body2"
                        sx={{
                          bgcolor: '#F1F5F9', 
                          border: '1px solid #E2E8F0',
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 30,
                          color: '#475569',
                          fontWeight: 600,
                          fontSize: '0.75rem'
                        }}
                      >
                        {value}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default AboutUs;