import { Box, Typography, Button } from '@mui/material';
import Paper from '@mui/material/Paper';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import Switch from '@mui/material/Switch';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import CustomSnackbar from '../components/Common/CustomSnackbar';

const Notifications = () => {
  const navigate = useNavigate();

  const [skillGapAlert, setSkillGapAlert] = useState(true);
  const [marketTrendAlert, setMarketTrendAlert] = useState(true);

  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [urgentAlerts, setUrgentAlerts] = useState(false);

  // Corrected state naming layout
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleSave = () => {
    // 1. Open the custom snackbar layout notification immediately
    setOpenSnackbar(true);

    // 2. Wait 1.5 seconds for the toast animation to display before redirecting
    setTimeout(() => {
      navigate('/settings');
    }, 1500);
  };

  const handleCancel = () => {
    navigate('/settings');
  };

  return (
    <Box sx={{
      display: 'flex', 
      minHeight: '100vh',
      bgcolor: '#F1F5F9',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Paper elevation={0} sx={{  
        color: '#1E293B',
        bgcolor: '#FFFFFF',
        borderRadius: 5,
        p: 6,
        width: '100%',
        maxWidth: 1000,
        boxShadow: 3,
      }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', alignItems: 'center', color: '#119da4' }}>
          Notifications
        </Typography>
        <Typography sx={{ color: '#1E293B', mt: 0.5, mb: 3 }}>
          Control how and when you receive notifications.
        </Typography>

        {/* Skill Gap Section */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: 2, fontSize: 18 }}>
              Skill Gap Analysis Alerts
            </Typography>
            <Typography variant="body2">
              Notify me immediately when a new skill gap analysis is available for my profile.
            </Typography>
          </Box>
          <Switch
            checked={skillGapAlert}
            onChange={(e) => setSkillGapAlert(e.target.checked)}
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': { color: '#119da4' },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#119da4' },
            }}
          />
        </Box>
                         
        {/* Market Trends Section */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mt: 2, fontSize: 18 }}>
              Market Trend Updates
            </Typography>
            <Typography variant="body2">
              Notify me immediately when a new market trend update is available.
            </Typography>
          </Box>
          <Switch
            checked={marketTrendAlert}
            onChange={(e) => setMarketTrendAlert(e.target.checked)}
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': { color: '#119da4' },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#119da4' },
            }}
          />
        </Box>

        <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#1E293B', mt: 4, fontSize: 18 }}>
          Delivery Channels
        </Typography>

        {/* Channels Outline Box */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          mt: 2,
          border: '1px solid #E2E8F0', // Cleaned up harsh dark border to standard slate outline
          borderRadius: 2,
          p: 2
        }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={weeklyDigest}
                onChange={(e) => setWeeklyDigest(e.target.checked)}
                sx={{ color: '#119da4', '&.Mui-checked': { color: '#119da4' } }}
              />
            }
            label="Weekly career digest report"
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={urgentAlerts}
                onChange={(e) => setUrgentAlerts(e.target.checked)}
                sx={{ color: '#119da4', '&.Mui-checked': { color: '#119da4' } }}
              />
            }
            label="Urgent system profile alerts"
          />
        </Box>

        {/* Action Button Strip */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 5 }}>
          <Button 
            variant="contained"
            onClick={handleCancel}
            sx={{
              bgcolor: '#FFFFFF',
              py: 1.5,
              borderRadius: 2,
              fontWeight: 'bold',
              color: '#000000',
              border: '2px solid #119da4',
              width: '20%',
              textTransform: 'none',
              '&:hover': { bgcolor: '#F8FAFC' }
            }}
          >
            Back
          </Button>

          <Button 
            variant="contained"
            onClick={handleSave}
            sx={{
              bgcolor: '#FFA900',
              py: 1.5,
              borderRadius: 2,
              fontWeight: 'bold',
              color: '#FFFFFF',
              border: '2px solid #ffc857',
              width: '20%',
              textTransform: 'none',
              '&:hover': { bgcolor: '#E09600' }
            }}
          >
            Save Changes
          </Button>
        </Box>
      </Paper>

      {/* Cleaned up, type-correct Snackbar Component configuration */}
      <CustomSnackbar
        open={openSnackbar}
        message="Notification settings saved successfully!"
        severity="success"
        onClose={() => setOpenSnackbar(false)}
      />
    </Box>
  );
};

export default Notifications;