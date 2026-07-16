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

import type { JobRole } from "../../data/jobRoles";

interface AddJobRoleDialogProps {
  open: boolean;
  onClose: () => void;
  onAddRole: (role: JobRole) => void;
}

const AddJobRoleDialog = ({
  open,
  onClose,
  onAddRole,
}: AddJobRoleDialogProps) => {
  const [role, setRole] = useState("");
  const [category, setCategory] = useState<JobRole["category"]>("Web Development");
  const [skills, setSkills] = useState("");
  const [students, setStudents] = useState(0);
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");

  const handleSubmit = () => {
    if (!role || !category || !skills) return;

    onAddRole({
      id: Date.now(),
      name: role,
      category,
      requiredSkills: skills
        .split(",")
        .map((skill) => skill.trim()),
      students,
      status,
    });

    setRole("");
    setCategory("Web Development");
    setSkills("");
    setStudents(0);
    setStatus("Active");

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

          <TextField
            label="Interested Students"
            type="number"
            fullWidth
            value={students}
            onChange={(e) =>
              setStudents(Number(e.target.value))
            }
          />

          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>

            <Select
              label="Status"
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value as
                    | "Active"
                    | "Inactive"
                )
              }
            >
              <MenuItem value="Active">
                Active
              </MenuItem>

              <MenuItem value="Inactive">
                Inactive
              </MenuItem>
            </Select>
          </FormControl>
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