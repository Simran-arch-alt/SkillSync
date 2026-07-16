import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { AutoGraph } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";

const dashboardColors = {
  primary: "#119DA4",
  primaryDark: "#19647E",
};

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Backend API will go here later
    // await axios.post("/forgot-password", { email });

    setSuccess(true);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F8FAFC",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: { xs: 2, md: 3 },
        py: { xs: 2, md: 3 },
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={4}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 5,
            border: "1px solid rgba(17,157,164,.2)",
          }}
        >
          <Box textAlign="center" mb={4}>
            <AutoGraph
              sx={{
                fontSize: 65,
                color: dashboardColors.primary,
                mb: 2,
              }}
            />

            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                mb: 1,
              }}
            >
              Forgot Password
            </Typography>

            <Typography
              sx={{
                color: "#64748B",
              }}
            >
              Enter your email address and we'll help you
              reset your password.
            </Typography>
          </Box>

          {!success ? (
            <>
              {error && (
                <Alert
                  severity="error"
                  sx={{ mb: 3 }}
                >
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Email Address"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  sx={{ mb: 3 }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    bgcolor: dashboardColors.primary,
                    py: 1.5,
                    borderRadius: 10,
                    fontWeight: 600,
                    "&:hover": {
                      bgcolor:
                        dashboardColors.primaryDark,
                    },
                  }}
                >
                  Send Reset Link
                </Button>
              </form>
            </>
          ) : (
            <Box
              sx={{
                textAlign: "center",
              }}
            >
              <Alert
                severity="success"
                sx={{ mb: 3 }}
              >
                Reset link generated successfully!
              </Alert>

              <Typography
                sx={{
                  color: "#64748B",
                  mb: 3,
                }}
              >
                A reset link has been sent to your email
                address. Please check your inbox and follow
                the instructions to reset your password.
              </Typography>

              <Typography
                sx={{
                  fontWeight: 700,
                  color: "#119DA4",
                  mb: 4,
                }}
              >
                {email}
              </Typography>

              <Typography
                sx={{
                  color: "#64748B",
                  mb: 4,
                }}
              >
                
              </Typography>

              <Button
                fullWidth
                variant="contained"
                onClick={() =>
                  navigate("/reset-password")
                }
                sx={{
                  bgcolor: dashboardColors.primary,
                  py: 1.5,
                  borderRadius: 10,
                  fontWeight: 600,
                  "&:hover": {
                    bgcolor:
                      dashboardColors.primaryDark,
                  },
                }}
              >
                Continue (Demo)
              </Button>
            </Box>
          )}

          <Typography
            align="center"
            sx={{ mt: 4 }}
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

export default ForgotPassword;