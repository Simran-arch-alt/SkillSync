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

const SecurityCard = () => {

  // ==========================
  // Password States
  // ==========================

  const [currentPassword, setCurrentPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  // Show / Hide Password

  const [showCurrent, setShowCurrent] = useState(false);

  const [showNew, setShowNew] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  // Change Password


  const handleChangePassword = () => {

    if (newPassword !== confirmPassword) {

      alert("Passwords do not match.");

      return;

    }
    console.log({
      currentPassword,
      newPassword,

    });
    setSnackbarOpen(true);

  };

  return (

    <CardContainer>

      {/* Title */}

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

      {/* Current Password */}

      <TextField
        fullWidth
        label="Current Password"
        type={showCurrent ? "text" : "password"}
        value={currentPassword}
        onChange={(e) =>
          setCurrentPassword(e.target.value)
        }
        margin="normal"
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">

                <IconButton
                  onClick={() =>
                    setShowCurrent(!showCurrent)
                  }
                >
                  {showCurrent
                    ? <VisibilityOff />
                    : <Visibility />}
                </IconButton>

              </InputAdornment>
            ),
          },
        }}
      />

      {/* New Password */}

      <TextField
        fullWidth
        label="New Password"
        type={showNew ? "text" : "password"}
        value={newPassword}
        onChange={(e) =>
          setNewPassword(e.target.value)
        }
        margin="normal"
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">

                <IconButton
                  onClick={() =>
                    setShowNew(!showNew)
                  }
                >
                  {showNew
                    ? <VisibilityOff />
                    : <Visibility />}
                </IconButton>

              </InputAdornment>
            ),
          },
        }}
      />

      {/* Confirm Password */}

      <TextField
        fullWidth
        label="Confirm Password"
        type={showConfirm ? "text" : "password"}
        value={confirmPassword}
        onChange={(e) =>
          setConfirmPassword(e.target.value)
        }
        margin="normal"
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">

                <IconButton
                  onClick={() =>
                    setShowConfirm(!showConfirm)
                  }
                >
                  {showConfirm
                    ? <VisibilityOff />
                    : <Visibility />}
                </IconButton>

              </InputAdornment>
            ),
          },
        }}
      />

      {/* Button */}

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
          sx={{
            bgcolor: "#119DA4",
            textTransform: "none",
            fontWeight: "bold",

            "&:hover": {
              bgcolor: "#0F766E",
            },
          }}
        >
          Change Password
        </Button>

      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
  <CustomSnackbar
    open={snackbarOpen}
    message="Password changed successfully!"
    severity="success"
    onClose={handleSnackbarClose}
  />
</Box>

    </CardContainer>

  );

};

export default SecurityCard;