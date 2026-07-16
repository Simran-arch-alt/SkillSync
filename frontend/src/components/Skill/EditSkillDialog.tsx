
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Slider,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Stack,
} from "@mui/material";
import {useState,useEffect} from "react";
import type { Skill } from "../../data/skills";

interface EditSkillDialogProps {
  open: boolean;
  onClose: () => void;
  skill: Skill | null;
  onSave:(skill: Skill) => void;
}

const EditSkillDialog = ({
  open,
  skill,
  onClose,
  onSave,
}: EditSkillDialogProps) => {
    const [skillName, setSkillName] = useState("");
    const [category, setCategory] = useState<Skill["category"]>("Frontend");
    const [weight, setWeight] = useState(1);
    const [status, setStatus] = useState<"Active" | "Inactive">("Active");

    useEffect(() => {
        if (skill) {
            setSkillName(skill.name);
            setCategory(skill.category);
            setWeight(skill.weight);
            setStatus(skill.status);
        }
    }, [skill]);
 
  const handleSave = () => {
   if(!skill)return;
    onSave({
       ...skill,
      name: skillName,
      category,
      weight,
      status,
    });

    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Edit Skill</DialogTitle>

      <DialogContent>

        <Stack spacing={3} mt={1}>

          <TextField
            label="Skill Name"
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
            fullWidth
          />

          <TextField
            select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value as Skill["category"])}
            fullWidth
          >
            <MenuItem value="Frontend">Frontend</MenuItem>
            <MenuItem value="Backend">Backend</MenuItem>
            <MenuItem value="Database">Database</MenuItem>
            <MenuItem value="DevOps">DevOps</MenuItem>
            <MenuItem value="Data Science">Data Science</MenuItem>
          </TextField>

          <div>
            <Typography gutterBottom>
              Importance Weight
            </Typography>

            <Slider
              value={weight}
              min={1}
              max={5}
              step={0.5}
              valueLabelDisplay="auto"
              onChange={(_, value) =>
                setWeight(value as number)
              }
            />
          </div>

          <div>
            <Typography gutterBottom>
              Status
            </Typography>

            <RadioGroup
              row
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as Skill["status"])
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

          </div>

        </Stack>

      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSave}
        >
          Save Changes
        </Button>

      </DialogActions>
    </Dialog>
  );
};

export default EditSkillDialog;