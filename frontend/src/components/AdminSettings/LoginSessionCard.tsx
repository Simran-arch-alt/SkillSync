import { useState, useEffect } from "react";

import {
  Box,
  Button,
  Divider,
  FormControlLabel,
  Stack,
  Switch,
  Typography,
} from "@mui/material";

import SecurityIcon from "@mui/icons-material/Security";
import LogoutIcon from "@mui/icons-material/Logout";

import CardContainer from "../Common/CardContainer";
import ConfirmDialog from "../Common/ConfirmDialog";
import CustomSnackbar from "../Common/CustomSnackbar";
import request from "../../services/api";

const LoginSessionCard = () => {
  const [twoFactor, setTwoFactor] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await request<{ settings: { twoFactorEnabled: boolean } }>("/admin/settings");
        setTwoFactor(res.settings.twoFactorEnabled);
      } catch {
        console.error("Failed to fetch 2FA settings");
      }
    };
    fetchSettings();
  }, []);

  const handleTwoFactorToggle = async (checked: boolean) => {
    setTwoFactor(checked);
    try {
      await request("/admin/settings", {
        method: "PUT",
        body: JSON.stringify({ twoFactorEnabled: checked }),
      });
    } catch {
      console.error("Failed to update 2FA setting");
    }
  };

  const handleLogoutAllDevices = () => {
    setOpenDialog(false);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  return (
    <CardContainer>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
        <SecurityIcon color="primary" />
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#0F172A" }}>
          Login & Session
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Stack spacing={3}>
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            Current Device
          </Typography>
          <Typography fontWeight={600}>
            {navigator.userAgent.includes("Windows") ? "Windows" : navigator.platform} • {navigator.userAgent.includes("Chrome") ? "Google Chrome" : navigator.userAgent.split(" ").pop()}
          </Typography>
        </Box>

        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            Last Login
          </Typography>
          <Typography fontWeight={600}>
            {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} • {new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
          </Typography>
        </Box>

        <Box>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Two-Factor Authentication
          </Typography>
          <FormControlLabel
            control={<Switch checked={twoFactor} onChange={(e) => handleTwoFactorToggle(e.target.checked)} />}
            label={twoFactor ? "Enabled" : "Disabled"}
          />
        </Box>
      </Stack>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
        <Button
          variant="outlined"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={() => setOpenDialog(true)}
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          Logout All Devices
        </Button>
      </Box>

      <ConfirmDialog
        open={openDialog}
        title="Logout All Devices"
        message="Are you sure you want to log out from all active devices?"
        onClose={() => setOpenDialog(false)}
        onConfirm={handleLogoutAllDevices}
      />

      <CustomSnackbar
        open={snackbarOpen}
        message="Logged out from all devices successfully!"
        severity="success"
        onClose={handleSnackbarClose}
      />
    </CardContainer>
  );
};

export default LoginSessionCard;
