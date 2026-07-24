import { useState } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";

interface AddJobRoleDialogProps {
  open: boolean;
  onClose: () => void;
  onAddRole: (data: { name: string; category: string; skills: string }) => void;
}

const AddJobRoleDialog = ({
  open,
  onClose,
  onAddRole,
}: AddJobRoleDialogProps) => {
  const [role, setRole] = useState("");
  const [category, setCategory] = useState("Web Development");
  const [skills, setSkills] = useState("");

  const handleSubmit = () => {
    if (!role || !category || !skills) return;

    onAddRole({ name: role, category, skills });

    setRole("");
    setCategory("Web Development");
    setSkills("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Add Job Role</DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <TextField
            label="Job Role"
            fullWidth
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />

          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>

            <Select
              label="Category"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
            >
              <MenuItem value="Web Development">
                Web Development
              </MenuItem>

              <MenuItem value="AI & ML">
                AI & ML
              </MenuItem>

              <MenuItem value="Cloud Computing">
                Cloud Computing
              </MenuItem>

              <MenuItem value="Cyber Security">
                Cyber Security
              </MenuItem>

              <MenuItem value="Mobile Development">
                Mobile Development
              </MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Required Skills"
            helperText="Separate each skill with a comma"
            fullWidth
            value={skills}
            onChange={(e) =>
              setSkills(e.target.value)
            }
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            bgcolor: "#0F766E",
            "&:hover": {
              bgcolor: "#115E59",
            },
          }}
        >
          Add Role
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddJobRoleDialog;
