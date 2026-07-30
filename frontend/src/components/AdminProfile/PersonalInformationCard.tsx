import { useState, useEffect } from 'react';
import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CardContainer from '../Common/CardContainer';
import CustomSnackbar from '../Common/CustomSnackbar';
import request from '../../services/api';

interface UserProfile {
  name?: string;
  email?: string;
  university?: string;
  degree?: string;
  graduationYear?: number;
}

interface PersonalInformationCardProps {
  user: UserProfile | null;
  onSaved: () => void;
}

const PersonalInformationCard = ({ user, onSaved }: PersonalInformationCardProps) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [university, setUniversity] = useState('');
  const [degree, setDegree] = useState('');
  const [graduationYear, setGraduationYear] = useState('');

  useEffect(() => {
    if (user) {
      setFullName(user.name || '');
      setEmail(user.email || '');
      setUniversity(user.university || '');
      setDegree(user.degree || '');
      setGraduationYear(user.graduationYear ? String(user.graduationYear) : '');
    }
  }, [user]);

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const body: Record<string, any> = { name: fullName, email, university, degree };
      if (graduationYear) body.graduationYear = Number(graduationYear);
      await request('/auth/me', { method: 'PUT', body: JSON.stringify(body) });
      setSnackbarMsg('Profile updated successfully!');
      setSnackbarOpen(true);
      onSaved();
    } catch (err: any) {
      setSnackbarMsg(err.message || 'Failed to update profile');
      setSnackbarOpen(true);
    }
    setSaving(false);
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
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField label="Graduation Year" fullWidth type="number" value={graduationYear} onChange={(e) => setGraduationYear(e.target.value)} />
        </Grid>
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
        <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave} disabled={saving} sx={{ bgcolor: "#119DA4", textTransform: "none", fontWeight: 600, px: 3, "&:hover": { bgcolor: "#0F766E" } }}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <CustomSnackbar open={snackbarOpen} message={snackbarMsg} severity={snackbarMsg.includes('Failed') ? 'error' : 'success'} onClose={handleSnackbarClose} />
      </Box>
    </CardContainer>
  );
};

export default PersonalInformationCard;
