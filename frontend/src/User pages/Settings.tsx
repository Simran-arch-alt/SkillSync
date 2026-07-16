import React from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Nav/Sidebar";

import PersonIcon from "@mui/icons-material/Person";
import NotificationIcon from "@mui/icons-material/Notifications";
import LockIcon from "@mui/icons-material/Lock";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const Settings: React.FC = () => {
  const navigate = useNavigate();

  const cardStyle = {
    bgcolor: "#FFFFFF",
    p: 3,
    borderRadius: 3,
    mb: 3,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: 3,
    "&:hover": {
      bgcolor: "rgba(17, 157, 164, 0.06)",
      transform: "translateX(-3px)",
      boxShadow: "0 0px 20px rgba(17, 157, 164, 0.18)",
    },
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F8FAFC" }}>
      <Sidebar />

      <Box sx={{ flexGrow: 1, p: 4, color: "#0e7075" }}>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Settings
        </Typography>

        <Typography sx={{ color: "#94A3B8", mt: 0.5, mb: 4 }}>
          Manage your account, notifications, and preferences.
        </Typography>

        {/* Profile */}
        <Box sx={cardStyle} onClick={() => navigate("/profile")}>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <PersonIcon sx={{ color: "#119DA4", fontSize: "1.5rem" }} />

              <Typography
                variant="h6"
                sx={{ color: "#1E3A5F", fontWeight: "bold" }}
              >
                Profile
              </Typography>
            </Box>

            <Typography variant="body2" sx={{ color: "#94A3B8" }}>
              Update your personal information and preferences.
            </Typography>
          </Box>

          <ArrowForwardIosIcon
            sx={{
              color: "#94A3B8",
              fontSize: "1.1rem",
            }}
          />
        </Box>

        {/* Notifications */}
        <Box sx={cardStyle} onClick={() => navigate("/notifications")}>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <NotificationIcon
                sx={{ color: "#119DA4", fontSize: "1.5rem" }}
              />

              <Typography
                variant="h6"
                sx={{ color: "#1E3A5F", fontWeight: "bold" }}
              >
                Notifications
              </Typography>
            </Box>

            <Typography variant="body2" sx={{ color: "#94A3B8" }}>
              Manage how you receive updates and alerts.
            </Typography>
          </Box>

          <ArrowForwardIosIcon
            sx={{
              color: "#94A3B8",
              fontSize: "1.1rem",
            }}
          />
        </Box>

        {/* Privacy */}
        <Box sx={cardStyle} onClick={() => navigate("/privacy-settings")}>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <LockIcon sx={{ color: "#119DA4", fontSize: "1.5rem" }} />

              <Typography
                variant="h6"
                sx={{ color: "#1E3A5F", fontWeight: "bold" }}
              >
                Privacy & Security
              </Typography>
            </Box>

            <Typography variant="body2" sx={{ color: "#94A3B8" }}>
              Manage your privacy settings and security preferences.
            </Typography>
          </Box>

          <ArrowForwardIosIcon
            sx={{
              color: "#94A3B8",
              fontSize: "1.1rem",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Settings;