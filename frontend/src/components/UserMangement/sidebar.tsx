import { Box, Typography, List, ListItemButton, ListItemText } from "@mui/material";

import {
  AutoGraph,
} from "@mui/icons-material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import WorkIcon from "@mui/icons-material/Work";
import BarChartIcon from "@mui/icons-material/BarChart";

import PsychologyIcon from "@mui/icons-material/Psychology";

import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";


import { useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
    const location =useLocation();
    
    const activeStyle={
        bgcolor:'rgba(124,58,237,0.1)',
        borderLeft:'4px solid #FFFFFF',
    };

  
  const goToAdminDashboard = () => navigate("/admin-dashboard");
  const goToUserManagement = () => navigate("/user-management");
  const goToSkillLibrary = () => navigate("/skill-library");
  const goToAdminJobRoles = () => navigate("/admin/job-roles");
  const goToReports = () => navigate("/reports");
  
  const handleLogout = () => navigate("/login");
  const goToAdminSettings = () => navigate("/admin/settings");



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

      <List sx={{ px: 1, flexGrow: 1, display: "flex", flexDirection: "column", gap: 0.5 }}>
        <ListItemButton
          onClick={goToAdminDashboard}
          sx={{
            gap: 2,
            py: 1.2,
            borderRadius: 2,
            ...(location.pathname === "/admin-dashboard" ? activeStyle : {}),
          }}
        >
          <DashboardIcon sx={{ color: "#FFFFFF" }} />
          <ListItemText primary="Dashboard" />
        </ListItemButton>

        <ListItemButton
          onClick={goToUserManagement}
          sx={{
            gap: 2,
            py: 1.2,
            borderRadius: 2,
            ...(location.pathname === "/user-management" ? activeStyle : {}),
          }}
        >
          <PersonIcon sx={{ color: "#FFFFFF" }} />
          <ListItemText primary="User Management" />
        </ListItemButton>

        <ListItemButton
          onClick={goToSkillLibrary}
          sx={{
            gap: 2,
            py: 1.2,
            borderRadius: 2,
            ...(location.pathname === "/skill-library" ? activeStyle : {}),
          }}
        >
          <PsychologyIcon sx={{ color: "#FFFFFF" }} />
          <ListItemText primary="Skill Library" />
        </ListItemButton>

        <ListItemButton
          onClick={goToAdminJobRoles}
          sx={{
            gap: 2,
            py: 1.2,
            borderRadius: 2,
            ...(location.pathname === "/admin/job-roles" ? activeStyle : {}),
          }}
        >
          <WorkIcon sx={{ color: "#FFFFFF" }} />
          <ListItemText primary="Job Roles" />
        </ListItemButton>

        <ListItemButton
          onClick={goToReports}
          sx={{
            gap: 2,
            py: 1.2,
            borderRadius: 2,
            ...(location.pathname === "/reports" ? activeStyle : {}),
          }}
        >
          <BarChartIcon sx={{ color: "#FFFFFF" }} />
          <ListItemText primary="Reports & Analytics" />
        </ListItemButton>

        

      <ListItemButton
          onClick={goToAdminSettings}
          sx={{
            gap: 2,
            py: 1.2,
            borderRadius: 2,
            ...(location.pathname === "/admin/settings" ? activeStyle : {}),
          }}
        >
          <SettingsIcon sx={{ color: "#FFFFFF" }} />
          <ListItemText primary="Settings" />
        </ListItemButton>
        </List>






      {/* System Exit Utility Row */}
      <Box sx={{ p: 1, mb: 2 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            gap: 2,
            py: 1.2,
            borderRadius: 2,
            color: "#FF8A8A",
            "&:hover": { bgcolor: "rgba(239, 68, 68, 0.1)" },
          }}
        >
          <LogoutIcon sx={{ color: "#FF8A8A" }} />
          <ListItemText primary="Logout" sx={{ fontWeight: "bold" }} />
        </ListItemButton>
      </Box>
    </Box>
  );
};

export default Sidebar;