import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import {
  AutoGraph,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";

const dashboardColors = {
  primary: "#119DA4",
  primaryDark: "#19647E",
};

const ResetPassword = () => {
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");

    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (newPassword.length < 8) {
      setError(
        "Password must be at least 8 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Later this becomes:
    // await axios.post("/reset-password")

    setSuccess(true);

    setTimeout(() => {
      navigate("/login");
    }, 2500);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F8FAFC",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={4}
          sx={{
            p: 5,
            borderRadius: 5,
            border: "1px solid rgba(17,157,164,.2)",
          }}
        >
          <Box textAlign="center" mb={4}>
            <AutoGraph
              sx={{
                fontSize: 60,
                color: dashboardColors.primary,
              }}
            />

            <Typography
              variant="h4"
              fontWeight={700}
              mt={2}
            >
              Reset Password
            </Typography>

            <Typography
              color="text.secondary"
              mt={1}
            >
              Create a new secure password for your
              SkillSync account.
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Password updated successfully.
              Redirecting to login...
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="New Password"
              type={
                showNewPassword
                  ? "text"
                  : "password"
              }
              value={newPassword}
              onChange={(e) =>
                setNewPassword(e.target.value)
              }
              sx={{ mb: 3 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowNewPassword(
                          !showNewPassword
                        )
                      }
                    >
                      {showNewPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              sx={{ mb: 4 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                    >
                      {showConfirmPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{
                py: 1.5,
                borderRadius: 10,
                bgcolor: dashboardColors.primary,
                "&:hover": {
                  bgcolor:
                    dashboardColors.primaryDark,
                },
              }}
            >
              Update Password
            </Button>
          </form>

          <Typography
            align="center"
            mt={4}
          >
            <Link
              to="/login"
              style={{
                textDecoration: "none",
                color: dashboardColors.primary,
                fontWeight: 600,
              }}
            >
              ← Back to Login
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default ResetPassword;