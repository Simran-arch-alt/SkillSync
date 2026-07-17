import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Box,
} from "@mui/material";
import { Notifications } from "@mui/icons-material";
import NotificationPanel from "../../User pages/NotificationPanel";
import ProfileMenu from "./ProfileMenu";
import{ useNavigate } from "react-router-dom";
import { getMe } from "../../services/authService";

const Nav: React.FC = () => {
  const [anchorEl, setAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const role =
    localStorage.getItem("role") || "student";

  const [currentUser, setCurrentUser] = React.useState({
    name: "",
    email: "",
    role: role as "admin" | "student",
  });

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    getMe()
      .then((data: any) => {
        const user = data.user || data;
        setCurrentUser({
          name: user.name || "",
          email: user.email || "",
          role: (user.role as "admin" | "student") || role,
        });
      })
      .catch(() => {});
  }, [role]);

  const handleOpenNotifications = (
  event: React.MouseEvent<HTMLElement>
) => {
  if (currentUser.role === "admin") {
    navigate("/admin/notifications");
  } else {
    setAnchorEl(event.currentTarget);
  }
};
    

  const handleCloseNotifications = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: "#F8FAFC",
        borderBottom: "1px solid #E2E8F0",
        boxShadow: "none",
      }}
    >
      <Toolbar>

        <Box sx={{ flexGrow: 1 }} />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          {/* Notifications */}
          <IconButton
            onClick={(event) => handleOpenNotifications(event)}
          >
            <Badge
              badgeContent={3}
              color="error"
            >
              <Notifications
                sx={{
                  color: "#119DA4",
                }}
              />
            </Badge>
          </IconButton>

          <NotificationPanel
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseNotifications}
          />

          {/* Profile Menu */}
          <ProfileMenu
            name={currentUser.name}
            email={currentUser.email}
            role={currentUser.role}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Nav;