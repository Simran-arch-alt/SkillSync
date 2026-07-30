import { useState } from "react";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

interface PasswordFieldProps {
  label: string;
}

const PasswordInfoForm = ({ label }: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextField
      fullWidth
      size="small"
      label={label}
      type={showPassword ? "text" : "password"}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: 2,
          backgroundColor: "#F8FAFC",
          "& fieldset": { borderColor: "#CBD5E1" },
          "&:hover fieldset": { borderColor: "#14B8A6" },
          "&.Mui-focused fieldset": { borderColor: "#14B8A6" },
        },
      }}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
};

export default PasswordInfoForm;