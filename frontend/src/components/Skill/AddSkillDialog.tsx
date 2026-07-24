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
  Slider,
  Stack,
  TextField,
} from "@mui/material";

import type { Skill } from "../../data/skills";

interface AddSkillDialogProps {
  open: boolean;

  onClose: () => void;

  onAddSkill: (skill: Skill) => void;
}

const AddSkillDialog = ({
  open,
  onClose,
  onAddSkill,
}: AddSkillDialogProps) => {

  // ===============================
  // Form States
  // ===============================

  const [skillName, setSkillName] = useState("");

  const [category, setCategory] =
    useState<Skill["category"]>("Frontend");

  const [weight, setWeight] = useState(0.8);

  const [status, setStatus] =
    useState<Skill["status"]>("Active");

  // ===============================
  // Add Skill
  // ===============================

  const handleSubmit = () => {

    // Basic validation
    if (!skillName.trim()) return;

    const newSkill: Skill = {

      id: String(Date.now()),

      name: skillName,

      category,

      weight,

      assignedUsers: 0,

      status,
    };

    onAddSkill(newSkill);

    // Reset form

    setSkillName("");

    setCategory("Frontend");

    setWeight(0.8);

    setStatus("Active");

    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      {/* Dialog Title */}

      <DialogTitle
        sx={{
          fontWeight: "bold",
        }}
      >
        Add New Skill
      </DialogTitle>

      {/* Dialog Body */}

      <DialogContent>

        <Stack
          spacing={3}
          sx={{ mt: 2 }}
        >
          {/* Skill Name */}

          <TextField
            label="Skill Name"
            placeholder="Example: React"
            value={skillName}
            onChange={(e) =>
              setSkillName(e.target.value)
            }
            fullWidth
          />

          {/* Category */}

          <FormControl fullWidth>

            <InputLabel>
              Category
            </InputLabel>

            <Select
              label="Category"
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value as Skill["category"]
                )
              }
            >
              <MenuItem value="Frontend">
                Frontend
              </MenuItem>

              <MenuItem value="Backend">
                Backend
              </MenuItem>

              <MenuItem value="DevOps">
                DevOps
              </MenuItem>

              <MenuItem value="Data Science">
                Data Science
              </MenuItem>

              <MenuItem value="Database">
                Database
              </MenuItem>

              <MenuItem value="Cloud">
                Cloud
              </MenuItem>

            </Select>

          </FormControl>

          {/* Importance Weight */}

          <div>

            <InputLabel
              sx={{
                mb: 2,
              }}
            >
              Importance Weight
            </InputLabel>

            <Slider
              value={weight}
              min={0}
              max={1}
              step={0.05}

              valueLabelDisplay="auto"

              onChange={(_, value) =>
                setWeight(value as number)
              }
            />

          </div>

          {/* Status */}

          <FormControl fullWidth>

            <InputLabel>
              Status
            </InputLabel>

            <Select
              label="Status"
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value as Skill["status"]
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

      {/* Buttons */}

      <DialogActions>

        <Button
          onClick={onClose}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            bgcolor: "#119DA4",

            "&:hover": {
              bgcolor: "#0F766E",
            },
          }}
        >
          Add Skill
        </Button>

      </DialogActions>

    </Dialog>
  );
};

export default AddSkillDialog;