import { Box, Typography } from "@mui/material";
import CustomTextField from "../Common/CustomTextField";

interface PersonalInfoFormProps {
  name?: string;
  email?: string;
  onNameChange?: (value: string) => void;
  onEmailChange?: (value: string) => void;
}

const PersonalInfoForm = ({ name, email, onNameChange, onEmailChange }: PersonalInfoFormProps) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 3 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#334155" }}>
        Personal Information
      </Typography>
      <CustomTextField label="Full Name" placeholder="Enter your full name" value={name} onChange={(e) => onNameChange?.(e.target.value)} />
      <CustomTextField label="Email Address" placeholder="Enter your email" value={email} onChange={(e) => onEmailChange?.(e.target.value)} />
    </Box>
  );
};

export default PersonalInfoForm;