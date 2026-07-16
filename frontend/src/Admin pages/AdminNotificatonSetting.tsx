import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
 Switch,
  Button,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/UserMangement/sidebar";
import CustomSnackbar from "../components/Common/CustomSnackbar";

const AdminNotificationSettings: React.FC = () => {
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] =useState(false);

  const [settings, setSettings] = useState({
    email: true,
    registration: true,
    skillLibrary: true,
    reports: true,
    security: true,
    maintenance: false,
    emailDelivery: true,
    inApp: true,
    sms: false,
  });
 
  const handleSave =() =>{
    setSnackbarOpen (true);
    setTimeout(() => {
      navigate('/admin/settings');
    }, 2000);


  }
  const handleSnackbarClose=() => {
    setSnackbarOpen(false);
  }

  const handleSwitch =
    (field: keyof typeof settings) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSettings({
        ...settings,
        [field]: event.target.checked,
      });
    };

  return (
    <Box display="flex" minHeight="100vh" bgcolor="#F8FAFC">
      <Sidebar />

      <Box flex={1} p={4} >
        <Typography variant="h4"
        sx={{ fontWeight: "bold", color: "#0e7075" }} mb={1}>
        
          Notification Settings
        </Typography>

        <Typography color="#64748B" mb={4}>
          Control how and when you receive administrator notifications.
        </Typography>

        <Paper sx={{ p: 4, borderRadius: 3 }}>

          {/* Email */}
          <Box display="flex" justifyContent="space-between">
            <Box>
              <Typography fontWeight="bold">
                Email Notifications
              </Typography>

              <Typography color="#64748B">
                Receive important notifications via email.
              </Typography>
            </Box>

            <Switch
              checked={settings.email}
              onChange={handleSwitch("email")}
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Registration */}
          <Box display="flex" justifyContent="space-between">
            <Box>
              <Typography fontWeight="bold">
                User Registration Alerts
              </Typography>

              <Typography color="#64748B">
                Notify when a new student creates an account.
              </Typography>
            </Box>

            <Switch
              checked={settings.registration}
              onChange={handleSwitch("registration")}
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Skill Library */}
          <Box display="flex" justifyContent="space-between">
            <Box>
              <Typography fontWeight="bold">
                Skill Library Updates
              </Typography>

              <Typography color="#64748B">
                Notify when skills are added, edited or removed.
              </Typography>
            </Box>

            <Switch
              checked={settings.skillLibrary}
              onChange={handleSwitch("skillLibrary")}
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Reports */}
          <Box display="flex" justifyContent="space-between">
            <Box>
              <Typography fontWeight="bold">
                Reports & Analytics
              </Typography>

              <Typography color="#64748B">
                Notify when reports are generated.
              </Typography>
            </Box>

            <Switch
              checked={settings.reports}
              onChange={handleSwitch("reports")}
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Security */}
          <Box display="flex" justifyContent="space-between">
            <Box>
              <Typography fontWeight="bold">
                Security Alerts
              </Typography>

              <Typography color="#64748B">
                Notify about suspicious logins and security events.
              </Typography>
            </Box>

            <Switch
              checked={settings.security}
              onChange={handleSwitch("security")}
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Maintenance */}
          <Box display="flex" justifyContent="space-between">
            <Box>
              <Typography fontWeight="bold">
                System Maintenance
              </Typography>

              <Typography color="#64748B">
                Receive scheduled maintenance notifications.
              </Typography>
            </Box>

            <Switch
              checked={settings.maintenance}
              onChange={handleSwitch("maintenance")}
            />
          </Box>

         

          <Box
            mt={5}
            display="flex"
            justifyContent="space-between"
          >
            <Button
              variant="outlined"
              onClick={() => navigate("/admin/settings")}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={handleSave}
              sx={{
                bgcolor: "#119DA4",
                "&:hover": {
                  bgcolor: "#0E7F84",
                },
              }}
            >
              Save Changes
            </Button>
           
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
               

                <CustomSnackbar

                    open={snackbarOpen}
                    message="Notification settings saved succesfully!"
                    severity="success"
                    onClose={handleSnackbarClose}
                    />
                    </Box>
                   


          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default AdminNotificationSettings;