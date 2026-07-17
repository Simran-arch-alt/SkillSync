import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Container,
  Alert,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff, AutoGraph } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/authService';

const dashboardColors = {
  primary: '#119DA4',
  primaryDark: '#19647E',
};

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await register({ name, email, password });
      navigate('/login');
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:'#F8FAFC',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        px: { xs: 2, md: 3 },
        py: { xs: 2, md: 3 },
      }}
    >
      <Container maxWidth={false} disableGutters sx={{ width: '100%', maxWidth: 1240 }}>
        <Box
          sx={{
            borderRadius: 6,
            overflow: 'hidden',
            boxShadow: '0 30px 80px rgba(0,0,0,0.55), 0 0 42px rgba(17,157,164,0.18)',
            border: '1px solid rgba(17,157,164,0.18)',
            minHeight: { xs: 'auto', md: 660 },
            width: '100%',
            backgroundColor: '#06131A',
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          }}
        >
          <Box
            sx={{
              position: 'relative',   
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-start',
              minHeight: { xs: 'auto', md: 660 },
              p: { xs: 4, md: 6 },
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                inset: 'auto -18% -14% -18%',
                height: 230,
                backgroundColor:'#1E3A5F',
                filter: 'blur(18px)',
                opacity: 0.95,
                pointerEvents: 'none',
              }}
            />
            <AutoGraph sx={{ fontSize: 70, color: dashboardColors.primary, mb: 2, position: 'relative', zIndex: 1 }} />
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, position: 'relative', zIndex: 1 }}>
              SkillSync
            </Typography>
            <Typography
              sx={{
                maxWidth: 320,
                color: '#cbd5e1',
                fontSize: '1.1rem',
                lineHeight: 1.7,
                position: 'relative',
                zIndex: 1,
              }}
            >
              Create your account and start your next IT career journey with AI-guided skills and opportunities.
            </Typography>
          </Box>

          <Box
            sx={{
              background:
  '#119DA4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: { xs: 'auto', md: 660 },
              p: { xs: 3, md: 5 },
            }}
          >
            <Paper
              elevation={0}
              sx={{
                width: '100%',
                maxWidth: '470px',
                p: { xs: 3, md: 5 },
                borderRadius: 4,
                background: '#FFFFFF',
                border: '1px solid rgba(17,157,164,0.24)',
                boxShadow: '0 18px 45px rgba(0,0,0,0.45), 0 0 22px rgba(17,157,164,0.12)',
              }}
            >
              <Typography
                sx={{
                  textAlign: 'center',
                  fontSize: '1.8rem',
                  fontWeight: 800,
                  color: '#000000',
                  mb: 1,
                }}
              >
                Create Account
              </Typography>

              <Typography sx={{ textAlign: 'center', color: '#7c838e', mb: 4 }}>
                Join SkillSync and start your journey
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      color: '#000000',
                      '& fieldset': { borderColor: 'rgba(148,163,184,0.25)' },
                      '&:hover fieldset': { borderColor: dashboardColors.primary },
                      '&.Mui-focused fieldset': { borderColor: dashboardColors.primary },
                    },
                    '& .MuiInputLabel-root': { color: '#7c838e' },
                  }}
                />

                <TextField
                  fullWidth
                  label="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      color: '#000000',
                      '& fieldset': { borderColor: 'rgba(148,163,184,0.25)' },
                      '&:hover fieldset': { borderColor: dashboardColors.primary },
                      '&.Mui-focused fieldset': { borderColor: dashboardColors.primary },
                    },
                    '& .MuiInputLabel-root': { color: '#7c838e' },
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      color: '#000000',
                      '& fieldset': { borderColor: 'rgba(148,163,184,0.25)' },
                      '&:hover fieldset': { borderColor: dashboardColors.primary },
                      '&.Mui-focused fieldset': { borderColor: dashboardColors.primary },
                    },
                    '& .MuiInputLabel-root': { color: '#7c838e' },
                  }}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{ color: '#7c838e' }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Confirm Password"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      color: '#000000',
                      '& fieldset': { borderColor: 'rgba(148,163,184,0.25)' },
                      '&:hover fieldset': { borderColor: dashboardColors.primary },
                      '&.Mui-focused fieldset': { borderColor: dashboardColors.primary },
                    },
                    '& .MuiInputLabel-root': { color: '#7c838e' },
                  }}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{ color: '#7c838e' }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    bgcolor: dashboardColors.primary,
                    py: 1.5,
                    borderRadius: 50,
                    fontWeight: 600,
                    transition: 'all 0.2s',
                    boxShadow: '0 0 8px rgba(17,157,164,0.5)',
                    '&:hover': {
                      bgcolor: dashboardColors.primaryDark,
                      transform: 'translateY(-3px)',
                      boxShadow: '0 0 20px rgba(17,157,164,0.8)',
                    },
                  }}
                >
                  Create Account
                </Button>
              </form>

              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                  Already have an account?{' '}
                  <Typography
                    component={Link}
                    to="/login"
                    sx={{ color: dashboardColors.primary, textDecoration: 'none', fontWeight: 600 }}
                  >
                    Sign In
                  </Typography>
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Signup;