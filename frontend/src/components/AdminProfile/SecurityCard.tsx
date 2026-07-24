import { useState } from "react";

import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";

import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CustomSnackbar from "../Common/CustomSnackbar";

import CardContainer from "../Common/CardContainer";
import request from "../../services/api";

const SecurityCard = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      alert("New password must be at least 6 characters.");
      return;
    }

    setSaving(true);
    try {
      await request("/auth/change-password", {
        method: "PUT",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      setSnackbarMsg("Password changed successfully!");
      setSnackbarOpen(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setSnackbarMsg(err.message || "Failed to change password");
      setSnackbarOpen(true);
    }
    setSaving(false);
  };

  return (
    <CardContainer>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 3,
        }}
      >
        <LockIcon color="primary" />

        <Typography variant="h6" sx={{
          fontWeight:"bold",}}
        >
          Account Security
        </Typography>
      </Box>

      <TextField
        fullWidth
        label="Current Password"
        type={showCurrent ? "text" : "password"}
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        margin="normal"
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowCurrent(!showCurrent)}>
                  {showCurrent ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      <TextField
        fullWidth
        label="New Password"
        type={showNew ? "text" : "password"}
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        margin="normal"
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowNew(!showNew)}>
                  {showNew ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      <TextField
        fullWidth
        label="Confirm Password"
        type={showConfirm ? "text" : "password"}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        margin="normal"
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mt: 4,
        }}
      >
        <Button
          variant="contained"
          onClick={handleChangePassword}
          disabled={saving}
          sx={{
            bgcolor: "#119DA4",
            textTransform: "none",
            fontWeight: "bold",
            "&:hover": {
              bgcolor: "#0F766E",
            },
          }}
        >
          {saving ? 'Changing...' : 'Change Password'}
        </Button>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <CustomSnackbar
          open={snackbarOpen}
          message={snackbarMsg}
          severity={snackbarMsg.includes('Failed') ? 'error' : 'success'}
          onClose={handleSnackbarClose}
        />
      </Box>
    </CardContainer>
  );
};

export default SecurityCard;
