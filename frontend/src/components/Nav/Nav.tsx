import React, { useEffect, useState } from "react";
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
import { useAuth } from "../../contexts/AuthContext";
import request from "../../services/api";

const Nav: React.FC = () => {
  const [anchorEl, setAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();

  const currentUser = {
    name: user?.name || "",
    email: user?.email || "",
    role: (user?.role || "student") as "admin" | "student",
  };

  useEffect(() => {
    if (currentUser.role === "student") {
      request<{ notifications: unknown[]; unreadCount: number }>(
        "/students/notifications"
      )
        .then((res) => setUnreadCount(res.unreadCount))
        .catch(() => {});
    }
  }, [currentUser.role]);

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
              badgeContent={unreadCount}
              color="error"
              max={99}
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
