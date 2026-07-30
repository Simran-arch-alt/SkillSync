import { Box, Divider, Typography } from "@mui/material";
import PasswordInfoForm from "./PasswordInfoForm"; // Points directly to the file above

const PasswordSection = () => {
  return (
    <Box sx={{ mt: 5 }}>
      <Divider sx={{ mb: 3 }}>
        <Typography
          sx={{
            fontWeight: 700,
            color: "#64748B",
            fontSize: 13,
            letterSpacing: 1,
          }}
        >
          CHANGE PASSWORD
        </Typography>
      </Divider>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <PasswordInfoForm label="Current Password" />
        <PasswordInfoForm label="New Password" />
        <PasswordInfoForm label="Confirm New Password" />
      </Box>
    </Box>
  );
};

export default PasswordSection;