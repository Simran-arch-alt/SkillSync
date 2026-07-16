import  { useState } from "react";
import {
  Typography,
  TextField,
  Autocomplete,
  
} from "@mui/material";

import CardContainer from "../Common/CardContainer";
import CheckIcon from "@mui/icons-material/Check";
import IconButton from "@mui/material/IconButton";

interface SkillOption {
  name: string;
  category: string;
}

interface AddSkillsCardProps {
  onAddSkill: (skillName: string) => void;
}

const SKILL_LIBRARY: SkillOption[] = [
  { name: "TypeScript", category: "Frontend" },
  { name: "JavaScript", category: "Frontend" },
  { name: "React", category: "Frontend" },
  { name: "Vue.js", category: "Frontend" },
  { name: "Angular", category: "Frontend" },

  { name: "Node.js", category: "Backend" },
  { name: "Python", category: "Backend" },
  { name: "Go", category: "Backend" },

  { name: "PostgreSQL", category: "Database" },
  { name: "MongoDB", category: "Database" },

  { name: "Docker", category: "DevOps" },
  { name: "Kubernetes", category: "DevOps" },
  { name: "Terraform", category: "DevOps" },

  { name: "AWS", category: "Cloud" },
];

const AddSkillsCard = ({ onAddSkill }: AddSkillsCardProps) => {
  const [inputValue, setInputValue] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<SkillOption | null>(null);

  return (
    <CardContainer>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          color: "#0F172A",
          mb: 1,
        }}
      >
        Add Skills
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: "#64748B",
          mb: 2,
        }}
      >
        Search and add new skills to improve your profile.
      </Typography>

     <Autocomplete
  options={SKILL_LIBRARY}
  value={selectedSkill}
  inputValue={inputValue}
  getOptionLabel={(option) => option.name}
  groupBy={(option) => option.category}
  openOnFocus

  onInputChange={(_, value) => {
    setInputValue(value);
  }}

  onChange={(_, value) => {
   setSelectedSkill(value);

    if (value) {
      setInputValue(value.name);
     

      
    }
  }}

  renderInput={(params) => (
  <TextField
    {...params}
    placeholder="Search skills..."
    fullWidth
    size="small"
    InputProps={{
      ...params.InputProps,
      endAdornment: (
        <>
          {selectedSkill && (
            <IconButton
              color="success"
              onClick={() => {
                onAddSkill(selectedSkill.name);
                setSelectedSkill(null);
                setInputValue("");
              }}
            >
              <CheckIcon />
            </IconButton>
          )}

          {params.InputProps.endAdornment}
        </>
      ),
    }}
  />
)}/>
      <Typography
        variant="caption"
        sx={{
          display: "block",
          mt: 2,
          color: "#94A3B8",
        }}
      >
        Select a skill from the list to add it to your profile.
      </Typography>
    </CardContainer>
  );
};

export default AddSkillsCard;