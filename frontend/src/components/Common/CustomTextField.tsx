import { useState } from "react";
import {
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

interface CustomTextFieldProps {
  label: string;
  placeholder?: string;
  value?: string;
  type?: "text" | "password" | "email";
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomTextField = ({
  label,
  placeholder,
  value,
  type = "text",
  onChange,
}: CustomTextFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  return (
    <TextField
      fullWidth
      size="small"
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      type={
        isPassword
          ? showPassword
            ? "text"
            : "password"
          : type
      }
      slotProps={{
        input: isPassword
          ? {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >
                    {showPassword ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }
          : {},
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: 2,
          backgroundColor: "#F8FAFC",

          "& fieldset": {
            borderColor: "#CBD5E1",
          },

          "&:hover fieldset": {
            borderColor: "#119DA4",
          },

          "&.Mui-focused fieldset": {
            borderColor: "#119DA4",
          },
        },
      }}
    />
  );
};

export default CustomTextField;