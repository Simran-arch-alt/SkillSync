import { useState } from "react";

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

const LoginSessionCard = () => {
  const [twoFactor, setTwoFactor] =
    useState(false);

  const [openDialog, setOpenDialog] =
    useState(false);

  const [snackbarOpen, setSnackbarOpen] =
    useState(false);

  const handleLogoutAllDevices = () => {
    setOpenDialog(false);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <CardContainer>
      {/* Header */}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 3,
        }}
      >
        <SecurityIcon color="primary" />

        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "#0F172A",
          }}
        >
          Login & Session
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Stack spacing={3}>
        {/* Current Device */}

        <Box>
          <Typography
            variant="subtitle2"
            color="text.secondary"
          >
            Current Device
          </Typography>

          <Typography fontWeight={600}>
            Windows 11 • Google Chrome
          </Typography>
        </Box>

        {/* Last Login */}

        <Box>
          <Typography
            variant="subtitle2"
            color="text.secondary"
          >
            Last Login
          </Typography>

          <Typography fontWeight={600}>
            11 July 2026 • 09:30 AM
          </Typography>
        </Box>

        {/* Two Factor */}

        <Box>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={{ mb: 1 }}
          >
            Two-Factor Authentication
          </Typography>

          <FormControlLabel
            control={
              <Switch
                checked={twoFactor}
                onChange={(e) =>
                  setTwoFactor(
                    e.target.checked
                  )
                }
              />
            }
            label={
              twoFactor
                ? "Enabled"
                : "Disabled"
            }
          />
        </Box>
      </Stack>

      {/* Logout Button */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mt: 4,
        }}
      >
        <Button
          variant="outlined"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={() =>
            setOpenDialog(true)
          }
          sx={{
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Logout All Devices
        </Button>
      </Box>

      {/* Confirmation Dialog */}

      <ConfirmDialog
        open={openDialog}
        title="Logout All Devices"
        message="Are you sure you want to log out from all active devices?"
        
        onClose={() =>
          setOpenDialog(false)
        }
        onConfirm={
          handleLogoutAllDevices
        }
      />

      {/* Success Snackbar */}

      <CustomSnackbar
        open={snackbarOpen}
        message="Logged out from all devices successfully!"
        severity="success"
        onClose={
          handleSnackbarClose
        }
      />
    </CardContainer>
  );
};

export default LoginSessionCard;