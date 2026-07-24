import { Avatar, Box, Button, Chip, Divider, Typography, CircularProgress } from '@mui/material';
import { Stack } from '@mui/material';
import BadgeIcon from '@mui/icons-material/Badge';
import EmailIcon from '@mui/icons-material/Email';
import BusinessIcon from '@mui/icons-material/Business';
import SchoolIcon from '@mui/icons-material/School';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CardContainer from '../Common/CardContainer';

interface UserProfile {
  name?: string;
  email?: string;
  role?: string;
  status?: string;
  university?: string;
  degree?: string;
  graduationYear?: number;
}

interface AdminProfileCardProps {
  user: UserProfile | null;
  loading: boolean;
}

const AdminProfileCard = ({ user, loading }: AdminProfileCardProps) => {
  if (loading) {
    return <CardContainer><Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box></CardContainer>;
  }

  return (
    <CardContainer>
      <Box sx={{ display: "flex", flexDirection: "row", gap: 3, alignItems: "center" }}>
        <Box sx={{ textAlign: "center" }}>
          <Avatar sx={{ width: 120, height: 120, bgcolor: "#119DA4", fontSize: 42, fontWeight: "bold", mx: "auto" }}>
            {user?.name?.charAt(0)?.toUpperCase() || 'A'}
          </Avatar>
          <Button variant="outlined" startIcon={<PhotoCameraIcon />} sx={{ mt: 2, textTransform: "none", borderRadius: 2 }}>
            Change Photo
          </Button>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "#0F172A" }}>
              {user?.name || 'Administrator'}
            </Typography>
            <Chip
              label={user?.status === 'suspended' ? 'Suspended' : 'Active'}
              color={user?.status === 'suspended' ? 'error' : 'success'}
              size="small"
            />
          </Box>
          <Typography color="text.secondary" sx={{ mb: 2 }}>{user?.email || ''}</Typography>
          <Divider sx={{ my: 2 }} />
          <Stack spacing={1.5}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <BadgeIcon color="primary" fontSize="small" />
              <Typography variant="body2"><strong>Role:</strong> {user?.role === 'admin' ? 'Administrator' : 'Student'}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <BusinessIcon color="primary" fontSize="small" />
              <Typography variant="body2"><strong>University:</strong> {user?.university || 'Not specified'}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <SchoolIcon color="primary" fontSize="small" />
              <Typography variant="body2"><strong>Degree:</strong> {user?.degree || 'Not specified'}</Typography>
            </Box>
            {user?.graduationYear && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CalendarTodayIcon color="primary" fontSize="small" />
                <Typography variant="body2"><strong>Graduation Year:</strong> {user.graduationYear}</Typography>
              </Box>
            )}
          </Stack>
        </Box>
      </Box>
    </CardContainer>
  );
};

export default AdminProfileCard;
