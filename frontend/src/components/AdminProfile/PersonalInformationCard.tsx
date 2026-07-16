import { useState } from "react";

import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";

import CardContainer from "../Common/CardContainer";
import CustomSnackbar from "../Common/CustomSnackbar";
import { useNavigate } from "react-router-dom";

const PersonalInformationCard = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();
  

  const [fullName, setFullName] = useState("System Administrator");

  const [email, setEmail] = useState("admin@skillsync.com");

  const [phone, setPhone] = useState("+977 98XXXXXXXX");

  const [department, setDepartment] = useState("IT Administration");
  
  const handleSnackbarClose=() => {
    setSnackbarOpen(false);
  }

  

  const handleSave = () => {
    console.log({
      fullName,
      email,
      phone,
      department,
    });
    setSnackbarOpen(true);
    setTimeout(() => {
      navigate('/admin/settings');
    }, 2000);

  };

  return (
    <CardContainer>
      {/* Card Title */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          color: "#0F172A",
          mb: 3,
        }}
      >
        Personal Information
      </Typography>

      {/* Form */}
      <Grid container spacing={3}>
        {/* Full Name */}
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Full Name"
            fullWidth
            value={fullName}
            onChange={(e) =>
              setFullName(e.target.value)
            }
          />
        </Grid>

        {/* Email */}
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Email"
            fullWidth
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />
        </Grid>

        {/* Phone */}
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Phone Number"
            fullWidth
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value)
            }
          />
        </Grid>

        {/* Department */}
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            label="Department"
            fullWidth
            value={department}
            onChange={(e) =>
              setDepartment(e.target.value)
            }
          />
        </Grid>
      </Grid>

      {/* Save Button */}
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
          Save Changes
        </Button>


      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
               

                <CustomSnackbar

                    open={snackbarOpen}
                    message="Profile Updated succesfully!"
                    severity="success"
                    onClose={handleSnackbarClose}
                    />
                    </Box>
                   


    </CardContainer>
  );
};

export default PersonalInformationCard;