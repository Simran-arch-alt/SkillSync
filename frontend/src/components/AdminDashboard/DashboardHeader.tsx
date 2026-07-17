import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { getMe } from "../../services/authService";

const DashboardHeader = () => {
  const [adminName, setAdminName] = useState("Administrator");

  useEffect(() => {
    getMe()
      .then((data: any) => {
        const user = data.user || data;
        if (user?.name) setAdminName(user.name);
      })
      .catch(() => {});
  }, []);

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
        Welcome back, {adminName}! Here's an overview of your SkillSync
        platform, including user activity, skills, and system performance.
      </Typography>
    </Box>
  );
};

export default DashboardHeader;