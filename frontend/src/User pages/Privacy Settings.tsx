import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Switch,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CustomSnackbar from "../components/Common/CustomSnackbar";

const PrivacySettings = () => {
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [recruiterVisibility, setRecruiterVisibility] = useState(true);
  const [aiData, setAiData] = useState(false);
  const [searchability, setSearchability] = useState(true);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const enabledCount = [
    recruiterVisibility,
    aiData,
    searchability,
  ].filter(Boolean).length;

  const handleSave = () => {
    // Set dynamic context message and trigger the snackbar display
    setSnackbarMessage("Privacy settings saved successfully!");
    setOpenSnackbar(true);

    // Provide a small animation window delay before layout navigation reroute
    setTimeout(() => {
      navigate('/settings');
    }, 1500);
  };

  const handleCancel = () => {
    setRecruiterVisibility(true);
    setAiData(false);
    setSearchability(true);
    navigate('/settings');
  };

  const handleDelete = () => {
    setOpenDeleteDialog(false);
    
    // Trigger the warning/confirmation feedback on successful submission
    setSnackbarMessage("Account deletion request submitted.");
    setOpenSnackbar(true);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F8FAFC",
        p: 4,
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          color: "#19647e",
          mb: 3,
        }}
      >
        Privacy Settings
      </Typography>

      <Paper
        sx={{
          p: 4,
          borderRadius: 4,
          border: "1px solid #E2E8F0",
        }}
      >
        {/* Privacy Status */}
        <Box
          sx={{
            mb: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontWeight: "bold",
                color: "#0F172A",
              }}
            >
              Privacy Status
            </Typography>

            <Typography
              sx={{
                color: "#64748B",
                mt: 0.5,
              }}
            >
              Review and manage how your information is shared.
            </Typography>
          </Box>

          <Chip
            label={`${enabledCount}/3 Privacy Features Enabled`}
            color="success"
          />
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Section Header */}
        <Typography
          sx={{
            fontWeight: "bold",
            color: "#0F172A",
            mb: 1,
          }}
        >
          Data & Resume Privacy
        </Typography>

        <Typography
          sx={{
            color: "#64748B",
            mb: 4,
          }}
        >
          Manage how your profile, resume, and activity data are shared across
          the platform.
        </Typography>

        {/* Recruiter Visibility */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: 2,
          }}
        >
          <Box>
            <Typography sx={{ fontWeight: "bold" }}>
              Recruiter Visibility
            </Typography>

            <Typography color="text.secondary">
              Allow verified employers to view your profile.
            </Typography>
          </Box>

          <Switch
            checked={recruiterVisibility}
            onChange={(e) =>
              setRecruiterVisibility(e.target.checked)
            }
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': { color: '#19647e' },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#19647e' },
            }}
          />
        </Box>

        <Divider />

        {/* AI Optimization */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: 2,
          }}
        >
          <Box>
            <Typography sx={{ fontWeight: "bold" }}>
              AI Optimization Data
            </Typography>

            <Typography color="text.secondary">
              Allow anonymized usage data to improve recommendations.
            </Typography>
          </Box>

          <Switch
            checked={aiData}
            onChange={(e) =>
              setAiData(e.target.checked)
            }
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': { color: '#19647e' },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#19647e' },
            }}
          />
        </Box>

        <Divider />

        {/* Searchability */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: 2,
          }}
        >
          <Box>
            <Typography sx={{ fontWeight: "bold" }}>
              Profile Searchability
            </Typography>

            <Typography color="text.secondary">
              Appear in public talent directories.
            </Typography>
          </Box>

          <Switch
            checked={searchability}
            onChange={(e) =>
              setSearchability(e.target.checked)
            }
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': { color: '#19647e' },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#19647e' },
            }}
          />
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Delete Account */}
        <Button
          color="error"
          onClick={() => setOpenDeleteDialog(true)}
          sx={{
            textTransform: "none",
            fontWeight: "bold",
          }}
        >
          Delete Account & Clear Profile History
        </Button>

        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            mt: 4,
          }}
        >
          <Button
            variant="outlined"
            onClick={handleCancel}
            sx={{ textTransform: 'none', color: '#64748B', borderColor: '#CBD5E1' }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              bgcolor: "#FFA900",
              borderRadius: 2,
              px: 4,
              textTransform: 'none',
              fontWeight: 'bold',
              '&:hover': { bgcolor: '#E09600' }
            }}
          >
            Save Changes
          </Button>
        </Box>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>
          Delete Account?
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            This action cannot be undone. Your profile,
            uploaded resume, and history will be permanently
            removed.
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={handleDelete}
            sx={{ textTransform: 'none', fontWeight: 'bold' }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Fully Configured Dynamic Custom Snackbar Component */}
      <CustomSnackbar
        open={openSnackbar}
        message={snackbarMessage}
        severity="success"
        onClose={() => setOpenSnackbar(false)}
      />
    </Box>
  );
};

export default PrivacySettings;