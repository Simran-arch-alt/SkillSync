import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { getMe } from "../../services/authService";

const DashboardHeader = () => {
  const [adminName, setAdminName] = useState("Administrator");

  useEffect(() => {
    getMe()
      .then((data: any) => {
        if (data?.name) setAdminName(data.name);
      })
      .catch(() => {});
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  return (
    <Box
      sx={{
        mb: 4,
        p: { xs: 3, md: 4 },
        borderRadius: 4,
        background: "linear-gradient(135deg, #0e7075 0%, #119DA4 50%, #19647E 100%)",
        color: "#FFFFFF",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 8px 32px rgba(17, 157, 164, 0.3)",
        "&::before": {
          content: '""',
          position: "absolute",
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.08)",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: -80,
          right: 60,
          width: 160,
          height: 160,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.05)",
        },
      }}
    >
      <Typography
        variant="body1"
        sx={{
          fontWeight: 500,
          opacity: 0.85,
          mb: 0.5,
          fontSize: "1rem",
          letterSpacing: 0.5,
        }}
      >
        {greeting}
      </Typography>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 800,
          mb: 1,
          fontSize: { xs: "1.6rem", md: "2rem" },
          textShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        Welcome back, {adminName}!
      </Typography>
      <Typography
        variant="body2"
        sx={{
          opacity: 0.8,
          maxWidth: 600,
          lineHeight: 1.6,
          fontSize: "0.9rem",
        }}
      >
        Here's what's happening on your SkillSync platform today.
      </Typography>
    </Box>
  );
};

export default DashboardHeader;
