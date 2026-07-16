import { Box, CardContent, Typography } from "@mui/material";

import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PsychologyIcon from "@mui/icons-material/Psychology";
import WorkIcon from "@mui/icons-material/Work";
import DescriptionIcon from "@mui/icons-material/Description";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

import CardContainer from "../Common/CardContainer";

// Dashboard statistics
const stats = [
  {
    title: "Total Users",
    value: 900,
    growth: "+12% this month",
    icon: <PeopleAltIcon sx={{ fontSize: 42, color: "#119DA4" }} />,
  },
  {
    title: "Total Skills",
    value: 158,
    growth: "+8 new skills",
    icon: <PsychologyIcon sx={{ fontSize: 42, color: "#3B82F6" }} />,
  },
  {
    title: "Job Roles",
    value: 25,
    growth: "+2 this month",
    icon: <WorkIcon sx={{ fontSize: 42, color: "#F59E0B" }} />,
  },
  {
    title: "CV Uploads",
    value: 600,
    growth: "+35 uploads",
    icon: <DescriptionIcon sx={{ fontSize: 42, color: "#16A34A" }} />,
  },
];

const DashboardStats = () => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2,1fr)",
          lg: "repeat(4,1fr)",
        },
        gap: 3,
        mb: 4,
      }}
    >
      {stats.map((item) => (
        <CardContainer key={item.title}>
          <CardContent sx={{ p: 0 }}>

            {/* Top Section */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              {item.icon}

              <TrendingUpIcon
                sx={{
                  color: "#16A34A",
                }}
              />
            </Box>

            {/* Statistic */}
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: "#0F172A",
              }}
            >
              {item.value}
            </Typography>

            {/* Card Title */}
            <Typography
              sx={{
                color: "#64748B",
                mt: 0.5,
              }}
            >
              {item.title}
            </Typography>

            
            
          </CardContent>
        </CardContainer>
      ))}
    </Box>
  );
};

export default DashboardStats;