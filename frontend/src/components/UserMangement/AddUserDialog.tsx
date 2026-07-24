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

import { register } from "../../services/authService";

interface AddUserDialogProps {
  open: boolean;
  onClose: () => void;
  onAddUser: (user: any) => void;
}

const AddUserDialog = ({
  open,
  onClose,
  onAddUser,
}: AddUserDialogProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [university, setUniversity] = useState("");
  const [degree, setDegree] = useState("");
  const [error, setError] = useState("");

  const handleAddUser = async () => {
    if (!name || !email || !password) {
      setError("Name, email, and password are required.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      const result = await register({ name, email, password, university, degree });
      onAddUser(result.user);

      setName("");
      setEmail("");
      setPassword("");
      setUniversity("");
      setDegree("");
      setError("");
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to create user");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: { borderRadius: 3 },
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: "bold" }}>Add New User</DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {error && (
            <TextField
              error
              value={error}
              variant="standard"
              fullWidth
              slotProps={{ input: { readOnly: true } }}
              sx={{ "& .MuiInput-root": { color: "error.main" } }}
            />
          )}
          <TextField label="Full Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
          <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
          <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth helperText="Minimum 6 characters" />
          <TextField label="University" value={university} onChange={(e) => setUniversity(e.target.value)} fullWidth />
          <TextField label="Degree" value={degree} onChange={(e) => setDegree(e.target.value)} fullWidth />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant="outlined" sx={{ textTransform: "none" }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleAddUser}
          sx={{
            bgcolor: "#119DA4",
            textTransform: "none",
            "&:hover": { bgcolor: "#19647E" },
          }}
        >
          Add User
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUserDialog;
