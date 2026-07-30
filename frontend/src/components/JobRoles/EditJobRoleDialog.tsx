import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Stack,
  FormGroup,
  Checkbox,
  Box,

} from "@mui/material";

import type { JobRole } from "../../data/jobRoles";

interface EditJobRoleDialogProps {
  open: boolean;
  jobRole: JobRole | null;
  onClose: () => void;
  onSave: (jobRole: JobRole) => void;
}

const categories = [
  "Web Development",
  "AI & ML",
  "Cloud Computing",
  "Mobile Development",
  "Cyber Security",
];

const availableSkills = [
  "HTML",
  "CSS",
  "JavaScript",
  "React",
  "TypeScript",
  "Node.js",
  "Python",
  "SQL",
  "TensorFlow",
  "Docker",
  "Kubernetes",
  "AWS",
];

const EditJobRoleDialog = ({
  open,
  jobRole,
  onClose,
  onSave,
}: EditJobRoleDialogProps) => {

  const [name, setName] = useState("");

  const [category, setCategory] = useState<JobRole["category"]>("Web Development");

  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);

  const [status, setStatus] =
    useState<"Active" | "Inactive">("Active");

  useEffect(() => {

    if (jobRole) {

      setName(jobRole.name);

      setCategory(jobRole.category);

      setRequiredSkills(jobRole.requiredSkills);

      setStatus(jobRole.status);

    }

  }, [jobRole]);

  const handleSkillToggle = (skill: string) => {

    setRequiredSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    );

  };

  const handleSave = () => {

    if (!jobRole) return;

    onSave({
      ...jobRole,
      name,
      category,
      requiredSkills,
      status,
    });

  };

  return (

  <Dialog
    open={open}
    onClose={onClose}
    fullWidth
    maxWidth="md"
  >
    <DialogTitle>Edit Job Role</DialogTitle>

    <DialogContent>
      <Stack spacing={3} mt={1}>
        {/* Job Role Name */}
        <TextField
          label="Job Role Name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Category */}
        <TextField
          select
          label="Category"
          fullWidth
          value={category}
          onChange={(e) =>
            setCategory(
              e.target.value as JobRole["category"]
            )
          }
        >
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </TextField>

        {/* Required Skills */}
        <Box>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            mb={1}
          >
            Required Skills
          </Typography>

          <FormGroup>
            {availableSkills.map((skill) => (
              <FormControlLabel
                key={skill}
                control={
                  <Checkbox
                    checked={requiredSkills.includes(skill)}
                    onChange={() =>
                      handleSkillToggle(skill)
                    }
                  />
                }
                label={skill}
              />
            ))}
          </FormGroup>
        </Box>

        {/* Status */}
        <Box>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            mb={1}
          >
            Status
          </Typography>

          <RadioGroup
            row
            value={status}
            onChange={(e) =>
              setStatus(
                e.target.value as JobRole["status"]
              )
            }
          >
            <FormControlLabel
              value="Active"
              control={<Radio />}
              label="Active"
            />

            <FormControlLabel
              value="Inactive"
              control={<Radio />}
              label="Inactive"
            />
          </RadioGroup>
        </Box>
      </Stack>
    </DialogContent>

    <DialogActions sx={{ px: 3, pb: 2 }}>
      <Button
        onClick={onClose}
        variant="outlined"
      >
        Cancel
      </Button>

      <Button
        variant="contained"
        onClick={handleSave}
        sx={{
          bgcolor: "#119DA4",
          "&:hover": {
            bgcolor: "#0F8B92",
          },
        }}
      >
        Save Changes
      </Button>
    </DialogActions>
  </Dialog>
);
}
export default EditJobRoleDialog;