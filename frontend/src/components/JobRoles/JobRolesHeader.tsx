import { Box, Typography } from "@mui/material";

const JobRolesHeader = () => {
  return (
    <Box
      sx={{
        mb: 4,
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          color: "#0e7075",
          mb: 1,
        }}
      >
        Job Roles
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: "#64748B",
          maxWidth: "700px",
          lineHeight: 1.7,
        }}
      >
        Manage career roles, define required skills, and organize job profiles
        to support accurate skill gap analysis and personalized career
        recommendations.
      </Typography>
    </Box>
  );
};

export default JobRolesHeader;