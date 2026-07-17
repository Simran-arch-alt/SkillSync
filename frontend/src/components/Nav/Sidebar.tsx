import { Box, Typography, List, ListItemButton, ListItemText } from "@mui/material";

import {
  AutoGraph,
} from "@mui/icons-material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import WorkIcon from "@mui/icons-material/Work";
import AssessmentIcon from "@mui/icons-material/Assessment";
import MapIcon from "@mui/icons-material/Map";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

import { useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
    const location =useLocation();
    
    const activeStyle={
        bgcolor:'rgba(124,58,237,0.1)',
        borderLeft:'4px solid #FFFFFF',
    };

  const goHome = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    navigate("/login");
  };
  const goToDashboard = () => navigate("/dashboard");
  const goToSkillProfile = () => navigate("/my-skill-profile");
  const goToSettings = () => navigate("/settings");
  const goToJobRoles = () => navigate("/job-roles");
  const goToAlignmentResults = () => navigate("/alignment-results");
  const goToLearningRoadmap = () => navigate("/learning-roadmap", { state: { roleTitle: 'My Role' } });


  return (
    <Box
      sx={{
        width: 250,
        bgcolor: "#19647E",
        color: "#FFFFFF",
        borderRight: "1px solid #E2E8F0",
        flexShrink: 0,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          p: 3,
        }}
      >
        <AutoGraph sx={{ fontSize: 30, color: "#FFFFFF" }} />

        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            color: "#FFFFFF",
          }}
        >
          SkillSync
        </Typography>
      </Box>

      <List>
        <ListItemButton
          onClick={goToDashboard}
          sx={{
            gap: 2,
            py: 1.5,
            borderRadius: 2,
            ...(location.pathname === "/dashboard" ? activeStyle : {}),

          }}
        >
          <DashboardIcon sx={{ color: "#FFFFFF" }} />
          <ListItemText primary="Dashboard" />
        </ListItemButton>

        <ListItemButton
          onClick={goToSkillProfile}
          sx={{
            gap: 2,
            py: 1.5,
            borderRadius: 2,
            ...(location.pathname === "/my-skill-profile" ? activeStyle : {}),
          }}

        >
          <PersonIcon sx={{ color: "#FFFFFF" }} />
          <ListItemText primary="My Skill Profile" />
        </ListItemButton>

        <ListItemButton
          onClick={goToJobRoles}
          sx={{
            gap: 2,
            py: 1.5,
            borderRadius: 2,
            ...(location.pathname === "/job-roles" ? activeStyle : {}),
          }}
        >
          <WorkIcon sx={{ color: "#FFFFFF" }} />
          <ListItemText primary="Job Roles" />
        </ListItemButton>

        <ListItemButton
          onClick={goToAlignmentResults}
          sx={{
            gap: 2,
            py: 1.5,
            borderRadius: 2,
            ...(location.pathname === "/alignment-results" ? activeStyle : {}),
          }}
        >
          <AssessmentIcon sx={{ color: "#FFFFFF" }} />
          <ListItemText primary="Alignment Results" />
        </ListItemButton>

        <ListItemButton
        onClick={goToLearningRoadmap}
          sx={{
            gap: 2,
            py: 1.5,
            borderRadius: 2,
            ...(location.pathname === "/learning-roadmap" ? activeStyle : {}),
          }}
        >
          <MapIcon sx={{ color: "#FFFFFF" }} />
          <ListItemText primary="Learning Roadmap" />
        </ListItemButton>

        <ListItemButton
          onClick={goToSettings}
          sx={{
            gap: 2,
            py: 1.5,
            borderRadius: 2,
            ...(location.pathname === "/settings" ? activeStyle : {}),
          }}
        >
          <SettingsIcon sx={{ color: "#FFFFFF" }} />
          <ListItemText primary="Settings" />
        </ListItemButton>

        <ListItemButton
          onClick={goHome}
          sx={{
            gap: 2,
            py: 1.5,
            borderRadius: 2,
            mt: 40,
            ...(location.pathname === "/logout" ? activeStyle : {}),
          }}
        >
          <LogoutIcon sx={{ color: "#ef4444" }} />
          <ListItemText
            primary="Logout"
            sx={{ color: "#ef4444" }}
          />
        </ListItemButton>
      </List>
    </Box>
  );
};

export default Sidebar;