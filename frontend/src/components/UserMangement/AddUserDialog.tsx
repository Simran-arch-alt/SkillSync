import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
} from "@mui/material";

import type  { User } from "../../data/users";

interface AddUserDialogProps {
  open: boolean;
  onClose: () => void;
  onAddUser: (user: User) => void;
}

const AddUserDialog = ({
  open,
  onClose,
  onAddUser,
}: AddUserDialogProps) => {
  /* ----------------------------
      Form States
  ----------------------------- */

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [careerGoal, setCareerGoal] = useState("");
  const [qualification, setQualification] = useState("");
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");

  /* ----------------------------
      Add User
  ----------------------------- */

  const handleAddUser = () => {
    // Simple validation
    if (
      !name ||
      !email ||
      !careerGoal ||
      !qualification
    ) {
      return;
    }

    const newUser: User = {
      id: Date.now(),

      name,

      email,

      careerGoal,

      qualifications: qualification,

      completion: 0,

      cvUploaded: false,

      status,

      lastLogin: "Never",
    };

    onAddUser(newUser);

    // Clear form
    setName("");
    setEmail("");
    setCareerGoal("");
    setQualification("");
    setStatus("Active");

    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
          },
        },
      }}
    >
      {/* Title */}
      <DialogTitle
        sx={{
          fontWeight: "bold",
        }}
      >
        Add New User
      </DialogTitle>

      {/* Form */}
      <DialogContent>
        <Stack spacing={2} 
        sx={{ mt: 1 }}>
          {/* Name */}
          <TextField
            label="Full Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            fullWidth
          />

          {/* Email */}
          <TextField
            label="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            fullWidth
          />

          {/* Career Goal */}
          <TextField
            label="Career Goal"
            value={careerGoal}
            onChange={(e) =>
              setCareerGoal(e.target.value)
            }
            fullWidth
          />

          {/* Qualification */}
          <TextField
            label="Qualification"
            value={qualification}
            onChange={(e) =>
              setQualification(e.target.value)
            }
            fullWidth
          />

          {/* Status */}
          <TextField
            select
            label="Account Status"
            value={status}
            onChange={(e) =>
              setStatus(
                e.target.value as
                  | "Active"
                  | "Inactive"
              )
            }
            fullWidth
          >
            <MenuItem value="Active">
              Active
            </MenuItem>

            <MenuItem value="Inactive">
              Inactive
            </MenuItem>
          </TextField>
        </Stack>
      </DialogContent>

      {/* Buttons */}
      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            textTransform: "none",
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleAddUser}
          sx={{
            bgcolor: "#119DA4",
            textTransform: "none",

            "&:hover": {
              bgcolor: "#19647E",
            },
          }}
        >
          Add User
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUserDialog;