import { useState, useEffect } from 'react';
import { Avatar, Box, Button, Chip, Divider, Typography, CircularProgress } from '@mui/material';
import { Stack } from '@mui/material';
import BadgeIcon from '@mui/icons-material/Badge';
import EmailIcon from '@mui/icons-material/Email';
import BusinessIcon from '@mui/icons-material/Business';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CardContainer from '../Common/CardContainer';
import { getMe } from '../../services/authService';

const AdminProfileCard = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe().then(setUser).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <CardContainer><Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box></CardContainer>;
  }

  return (
    <CardContainer>
      <Box sx={{ display: "flex", flexDirection: "row", gap: 2, alignItems: "center" }}>
        <Box sx={{ textAlign: "center" }}>
          <Avatar sx={{ width: 120, height: 120, bgcolor: "#119DA4", fontSize: 42, fontWeight: "bold", mx: "auto" }}>
            {user?.name?.charAt(0) || 'A'}
          </Avatar>
          <Button variant="outlined" startIcon={<PhotoCameraIcon />} sx={{ mt: 2, textTransform: "none", borderRadius: 2 }}>
            Change Photo
          </Button>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#0F172A" }}>
            {user?.name || 'Administrator'}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>{user?.email || 'admin@skillsync.com'}</Typography>
          <Divider sx={{ my: 3 }} />
          <Stack spacing={2}>
            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1 }}>
              <BadgeIcon color="primary" />
              <Typography><strong>Role:</strong></Typography>
              <Typography>{user?.role === 'admin' ? 'Administrator' : 'Student'}</Typography>
              <Chip label="Active" color="success" size="small" />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1 }}>
              <BusinessIcon color="primary" />
              <Typography><strong>University:</strong></Typography>
              <Typography>{user?.university || 'Not specified'}</Typography>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1 }}>
              <EmailIcon color="primary" />
              <Typography><strong>Email:</strong></Typography>
              <Typography>{user?.email || 'N/A'}</Typography>
            </Box>
          </Stack>
        </Box>
      </Box>
    </CardContainer>
  );
};

export default AdminProfileCard;
