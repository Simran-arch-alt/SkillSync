import React from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/UserMangement/sidebar";

import PersonIcon from "@mui/icons-material/Person";
import NotificationIcon from "@mui/icons-material/Notifications";
import LockIcon from "@mui/icons-material/Lock";

import { ArrowForwardIos as ArrowForwardIosIcon } from "@mui/icons-material";

const AdminSettings: React.FC = () => {
  const navigate = useNavigate();
  const gotoAdminNotificationsSettings = () => navigate("/admin/notifications/settings");

  const cardStyle = {
    bgcolor: "#FFFFFF",
    p: 3,
    borderRadius: 3,
    mb: 3,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: 3,
    cursor: "pointer",
    transition: "all 0.3s ease",
    "&:hover": {
      bgcolor: "rgba(17,157,164,0.06)",
      transform: "translateX(-3px)",
      boxShadow: "0 0px 20px rgba(17,157,164,0.18)",
    },
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#F8FAFC",
      }}
    >
      <Sidebar />

      <Box
        sx={{
          flexGrow: 1,
          p: 4,
        }}
      >
        <Typography variant="h4" fontWeight="bold" sx={{ color: "#0e7075" }} mb={1}>
          Admin Settings
        </Typography>

        <Typography
          sx={{
            color: "#94A3B8",
            mb: 4,
          }}
        >
          Manage your administrator account and system preferences.
        </Typography>

        {/* Profile */}
        <Box sx={cardStyle} onClick={() => navigate("/admin-profile")}>
          <Box>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <PersonIcon sx={{ color: "#119DA4" }} />
              <Typography fontWeight="bold" color="#1E3A5F">
                Profile
              </Typography>
            </Box>

            <Typography color="#94A3B8">
              Update your personal information and preferences.
            </Typography>
          </Box>

          <ArrowForwardIosIcon sx={{ color: "#94A3B8" }} />
        </Box>

        {/* Notifications */}
        <Box
          sx={cardStyle}
          onClick={gotoAdminNotificationsSettings}
        >
          <Box>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <NotificationIcon sx={{ color: "#119DA4" }} />
              <Typography fontWeight="bold" color="#1E3A5F">
                Notifications
              </Typography>
            </Box>

            <Typography color="#94A3B8">
              Manage how you receive updates and alerts.
            </Typography>
          </Box>

          <ArrowForwardIosIcon sx={{ color: "#94A3B8" }} />
        </Box>

        {/* Privacy */}
        <Box
          sx={cardStyle}
          onClick={() => navigate("/admin/privacy-security")}
        >
          <Box>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <LockIcon sx={{ color: "#119DA4" }} />
              <Typography fontWeight="bold" color="#1E3A5F">
                Privacy & Security
              </Typography>
            </Box>

            <Typography color="#94A3B8">
              Manage your privacy settings and security preferences.
            </Typography>
          </Box>

          <ArrowForwardIosIcon sx={{ color: "#94A3B8" }} />
        </Box>

        {/* Appearance */}
        

      
        </Box>
      </Box>
    
  );
};

export default AdminSettings;