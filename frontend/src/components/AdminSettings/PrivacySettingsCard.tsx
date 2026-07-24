import { useState, useEffect } from "react";

import {
  Box,
  Button,
  Divider,
  FormControlLabel,
  Stack,
  Switch,
  Typography,
  CircularProgress,
} from "@mui/material";

import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import SaveIcon from "@mui/icons-material/Save";

import CardContainer from "../Common/CardContainer";
import CustomSnackbar from "../Common/CustomSnackbar";
import request from "../../services/api";

interface PrivacySettings {
  showEmail: boolean;
  allowContact: boolean;
  profileVisibility: boolean;
  securityAlerts: boolean;
}

const PrivacySettingsCard = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showEmail, setShowEmail] = useState(true);
  const [allowContact, setAllowContact] = useState(true);
  const [profileVisible, setProfileVisible] = useState(false);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await request<{ settings: { privacy: PrivacySettings } }>("/admin/settings");
        const p = res.settings.privacy;
        setShowEmail(p.showEmail);
        setAllowContact(p.allowContact);
        setProfileVisible(p.profileVisibility);
        setSecurityAlerts(p.securityAlerts);
      } catch {
        console.error("Failed to fetch privacy settings");
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await request("/admin/settings", {
        method: "PUT",
        body: JSON.stringify({
          privacy: {
            showEmail,
            allowContact,
            profileVisibility: profileVisible,
            securityAlerts,
          },
        }),
      });
      setSnackbarOpen(true);
    } catch {
      console.error("Failed to save privacy settings");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <CardContainer>
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}><CircularProgress /></Box>
      </CardContainer>
    );
  }

  return (
    <CardContainer>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
        <PrivacyTipIcon color="primary" />
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#0F172A" }}>
          Privacy Settings
        </Typography>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Manage your privacy preferences and visibility across the SkillSync platform.
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Stack spacing={2}>
        <FormControlLabel
          control={<Switch checked={showEmail} onChange={(e) => setShowEmail(e.target.checked)} />}
          label="Show Email Address"
        />
        <FormControlLabel
          control={<Switch checked={allowContact} onChange={(e) => setAllowContact(e.target.checked)} />}
          label="Allow Students to Contact Admin"
        />
        <FormControlLabel
          control={<Switch checked={profileVisible} onChange={(e) => setProfileVisible(e.target.checked)} />}
          label="Profile Visibility"
        />
        <FormControlLabel
          control={<Switch checked={securityAlerts} onChange={(e) => setSecurityAlerts(e.target.checked)} />}
          label="Receive Security Alerts"
        />
      </Stack>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={saving}
          sx={{ bgcolor: "#119DA4", textTransform: "none", fontWeight: 600, px: 3, "&:hover": { bgcolor: "#0F766E" } }}
        >
          {saving ? 'Saving...' : 'Save Preferences'}
        </Button>
      </Box>

      <CustomSnackbar open={snackbarOpen} message="Privacy settings updated successfully!" severity="success" onClose={handleSnackbarClose} />
    </CardContainer>
  );
};

export default PrivacySettingsCard;
