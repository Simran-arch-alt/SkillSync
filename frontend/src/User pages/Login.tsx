import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  Container,
  
  FormLabel,
} from '@mui/material';
import{ToggleButton,
  ToggleButtonGroup} from '@mui/material';

import { Visibility, VisibilityOff, AutoGraph } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

const dashboardColors = {
  primary: '#119DA4',
  primaryDark: '#19647E',
};

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('student');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (role ==='student') {
        if(username === 'student' && password === 'student123') {
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('role', 'student');
             
       const profileCompleted = localStorage.getItem('profileCompleted');

        if (profileCompleted === 'true') {
          navigate('/dashboard');
        } else {
          navigate('/cv-scanner');
        }
      } else {
        setError('Invalid username or password');
      }
    } else if (role === 'admin') {
      if(username === 'admin' && password === 'admin123') {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('role', 'admin');
        navigate('/admin-dashboard');
      }
      else {
        setError('Invalid username or password');
      }
    }
      setLoading(false);
    }, 1000);
  }
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#F8FAFC',
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
            boxShadow: 3,
            
            border: '1px solid #119DA4',
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
                backgroundcolor:'#1E3A5F',
                
                opacity: 0.95,
                pointerEvents: 'none',
              }}
            />
            <AutoGraph sx={{ fontSize: 70, color: dashboardColors.primary, mb: 2, position: 'relative', zIndex: 1 }} />
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, position: 'relative', zIndex: 1 }}>
              SkillSync
            </Typography>
            <Typography sx={{ maxWidth: 320, color: '#cbd5e1', fontSize: '1.1rem', lineHeight: 1.7, position: 'relative', zIndex: 1 }}>
              Track. Grow. Succeed. Build your next IT career with AI-guided skills and opportunities.
            </Typography>
          </Box>

          <Box
            sx={{
              backgroundColor: '#119DA4',
              boxShadow: 3,
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
                boxShadow: '3',
              }}
            >
              <Typography sx={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 800, color: '#000000', mb: 1 }}>
                Welcome Back
              </Typography>

              <Typography sx={{ textAlign: 'center', color: '#94A3B8', mb: 4 }}>
                Sign in to continue to SkillSync
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}


              <Box sx={{ mb: 3 }}>
  <FormLabel
    sx={{
      color: "#64748B",
      fontWeight: 600,
      mb: 1,
      display: "block",
    }}
  >
    Login As
  </FormLabel>

 
<ToggleButtonGroup
  value={role}
  exclusive
  onChange={(_, value) => {
    if (value) setRole(value);
  }}
  fullWidth
  sx={{
    mb: 3,
    "& .MuiToggleButton-root": {
      py: 1.2,
      fontWeight: 600,
      textTransform: "none",
      color: "#64748B",
      borderColor: "rgba(148,163,184,0.25)",
      "&.Mui-selected": {
        color: "#FFFFFF",
        backgroundColor: dashboardColors.primary,
        "&:hover": {
          backgroundColor: dashboardColors.primaryDark,
        },
      },
    },
  }}
>
  <ToggleButton value="student">
     Student
  </ToggleButton>

  <ToggleButton value="admin">
     Admin
  </ToggleButton>
</ToggleButtonGroup>
</Box>


              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      color: '#000000',
                      '& fieldset': { borderColor: 'rgba(148,163,184,0.25)' },
                      '&:hover fieldset': { borderColor: dashboardColors.primary },
                      '&.Mui-focused fieldset': { borderColor: dashboardColors.primary },
                    },
                    '& .MuiInputLabel-root': { color: '#94A3B8' },
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      color: '#000000',
                      '& fieldset': { borderColor: 'rgba(148,163,184,0.25)' },
                      '&:hover fieldset': { borderColor: dashboardColors.primary },
                      '&.Mui-focused fieldset': { borderColor: dashboardColors.primary },
                    },
                    '& .MuiInputLabel-root': { color: '#94A3B8' },
                  }}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: '#94A3B8' }}>
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <FormControlLabel
                    control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} sx={{ color: dashboardColors.primary }} />}
                    label={<Typography sx={{ color: '#94A3B8', fontSize: '0.9rem' }}>Remember me</Typography>}
                  />
                  <Typography component={Link} to="/forgot-password" sx={{ color: dashboardColors.primary, textDecoration: 'none', fontSize: '0.85rem' }}>
                    Forgot password?
                  </Typography>
                </Box>

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
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>

              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                  Don't have an account?{' '}
                  <Typography component={Link} to="/signup" sx={{ color: dashboardColors.primary, textDecoration: 'none', fontWeight: 600 }}>
                    Create an account
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

export default Login;