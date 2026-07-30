import { Typography } from "@mui/material";

const Header = () => {
  return (
    <>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          color: "#0F172A",
        }}
      >
        Profile Settings
      </Typography>

      <Typography
        sx={{
          mt: 1,
          color: "#64748B",
          fontSize: 14,
        }}
      >
        Update your personal information, contact email and login credentials.
      </Typography>
    </>
  );
};

export default Header;