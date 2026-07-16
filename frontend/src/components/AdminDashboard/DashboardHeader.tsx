import { Box, Typography } from "@mui/material";

const DashboardHeader = () => {
  return (
    <Box
      sx={{
        mb: 4,
      }}
    >
      {/* Main Heading */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          color: "#0e7075",
          mb: 1,
        }}
      >
        Dashboard
      </Typography>

      {/* Subtitle */}
      <Typography
        variant="body1"
        sx={{
          color: "#64748B",
        }}
      >
        Welcome back, Administrator! Here's an overview of your SkillSync
        platform, including user activity, skills, and system performance.
      </Typography>
    </Box>
  );
};

export default DashboardHeader;