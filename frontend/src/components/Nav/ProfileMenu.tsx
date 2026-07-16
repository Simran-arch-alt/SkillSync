import { useState } from "react";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import {
  AccountCircle,
  Logout,
  Settings,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

interface ProfileMenuProps {
  name: string;
  email: string;
  role: "student" | "admin";
}

const ProfileMenu = ({
  name,
  email,
  role,
}: ProfileMenuProps) => {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] =
    useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleOpen = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleClose();

    if (role === "admin") {
      navigate("/admin-profile");
    } else {
      navigate("/profile");
    }
  };

  const handleSettings = () => {
    handleClose();

    if (role === "admin") {
      navigate("/admin/settings");
    } else {
      navigate("/settings");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("role");

    navigate("/login");
  };

  return (
    <>
      <IconButton onClick={handleOpen}>
        <Avatar
          sx={{
            bgcolor: "#119DA4",
            width: 42,
            height: 42,
            fontWeight: 700,
          }}
        >
          {name.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 6,
          sx: {
            width: 280,
            mt: 1,
            borderRadius: 3,
          },
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 2,
          }}
        >
          <Typography
            fontWeight={700}
          >
            {name}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            {email}
          </Typography>

          <Typography
            sx={{
              mt: 1,
              color: "#119DA4",
              fontWeight: 600,
              textTransform: "capitalize",
            }}
          >
            {role}
          </Typography>
        </Box>

        <Divider />

        <MenuItem onClick={handleProfile}>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>

          {role === "admin"
            ? "Admin Profile"
            : "My Profile"}
        </MenuItem>

        <MenuItem onClick={handleSettings}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>

          Account Settings
        </MenuItem>

        <Divider />

        <MenuItem
          onClick={handleLogout}
          sx={{
            color: "error.main",
          }}
        >
          <ListItemIcon>
            <Logout color="error" />
          </ListItemIcon>

          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default ProfileMenu;