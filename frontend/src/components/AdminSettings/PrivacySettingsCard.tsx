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

import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import SaveIcon from "@mui/icons-material/Save";

import CardContainer from "../Common/CardContainer";
import CustomSnackbar from "../Common/CustomSnackbar";

const PrivacySettingsCard = () => {
  const [showEmail, setShowEmail] = useState(true);

  const [allowContact, setAllowContact] = useState(true);

  const [profileVisible, setProfileVisible] =
    useState(false);

  const [securityAlerts, setSecurityAlerts] =
    useState(true);

  const [snackbarOpen, setSnackbarOpen] =
    useState(false);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSave = () => {
    console.log({
      showEmail,
      allowContact,
      profileVisible,
      securityAlerts,
    });

    setSnackbarOpen(true);
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
        <PrivacyTipIcon color="primary" />

        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "#0F172A",
          }}
        >
          Privacy Settings
        </Typography>
      </Box>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 3 }}
      >
        Manage your privacy preferences and
        visibility across the SkillSync platform.
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Stack spacing={2}>
        <FormControlLabel
          control={
            <Switch
              checked={showEmail}
              onChange={(e) =>
                setShowEmail(
                  e.target.checked
                )
              }
            />
          }
          label="Show Email Address"
        />

        <FormControlLabel
          control={
            <Switch
              checked={allowContact}
              onChange={(e) =>
                setAllowContact(
                  e.target.checked
                )
              }
            />
          }
          label="Allow Students to Contact Admin"
        />

        <FormControlLabel
          control={
            <Switch
              checked={profileVisible}
              onChange={(e) =>
                setProfileVisible(
                  e.target.checked
                )
              }
            />
          }
          label="Profile Visibility"
        />

        <FormControlLabel
          control={
            <Switch
              checked={securityAlerts}
              onChange={(e) =>
                setSecurityAlerts(
                  e.target.checked
                )
              }
            />
          }
          label="Receive Security Alerts"
        />
      </Stack>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mt: 4,
        }}
      >
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          sx={{
            bgcolor: "#119DA4",
            textTransform: "none",
            fontWeight: 600,
            px: 3,

            "&:hover": {
              bgcolor: "#0F766E",
            },
          }}
        >
          Save Preferences
        </Button>
      </Box>

      <CustomSnackbar
        open={snackbarOpen}
        message="Privacy settings updated successfully!"
        severity="success"
        onClose={handleSnackbarClose}
      />
    </CardContainer>
  );
};

export default PrivacySettingsCard;