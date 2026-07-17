import { useState, useEffect } from 'react';
import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CardContainer from '../Common/CardContainer';
import CustomSnackbar from '../Common/CustomSnackbar';
import { useNavigate } from 'react-router-dom';
import { getMe } from '../../services/authService';

const PersonalInformationCard = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [university, setUniversity] = useState('');
  const [degree, setDegree] = useState('');

  useEffect(() => {
    getMe().then((user) => {
      setFullName(user?.name || '');
      setEmail(user?.email || '');
      setUniversity((user as any)?.university || '');
      setDegree((user as any)?.degree || '');
    }).catch(() => {});
  }, []);

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleSave = () => {
    console.log({ fullName, email, university, degree });
    setSnackbarOpen(true);
    setTimeout(() => navigate('/admin/settings'), 2000);
  };

  return (
    <CardContainer>
      <Typography variant="h6" sx={{ fontWeight: "bold", color: "#0F172A", mb: 3 }}>Personal Information</Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField label="Full Name" fullWidth value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField label="Email" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField label="University" fullWidth value={university} onChange={(e) => setUniversity(e.target.value)} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField label="Degree" fullWidth value={degree} onChange={(e) => setDegree(e.target.value)} />
        </Grid>
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
        <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave} sx={{ bgcolor: "#119DA4", textTransform: "none", fontWeight: 600, px: 3, "&:hover": { bgcolor: "#0F766E" } }}>
          Save Changes
        </Button>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <CustomSnackbar open={snackbarOpen} message="Profile Updated successfully!" severity="success" onClose={handleSnackbarClose} />
      </Box>
    </CardContainer>
  );
};

export default PersonalInformationCard;
