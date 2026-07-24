import { useState, useEffect } from "react";
import {
  Box,
  CardContent,
  Typography,
  CircularProgress,
} from "@mui/material";

import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PsychologyIcon from "@mui/icons-material/Psychology";
import DescriptionIcon from "@mui/icons-material/Description";

import CardContainer from "../Common/CardContainer";
import { getAdminStats, getAllUsers } from "../../services/adminService";

const ReportsStats = () => {
  const [stats, setStats] = useState<{ title: string; value: string; icon: React.ReactNode }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [adminStats, usersData] = await Promise.all([
          getAdminStats(),
          getAllUsers(1, 1),
        ]);
        setStats([
          {
            title: "Total Users",
            value: String(adminStats.totalUsers),
            icon: <PeopleAltIcon sx={{ fontSize: 40, color: "#119DA4" }} />,
          },
          {
            title: "Total Jobs",
            value: String(adminStats.totalJobs),
            icon: <AssessmentIcon sx={{ fontSize: 40, color: "#3B82F6" }} />,
          },
          {
            title: "Students",
            value: String(adminStats.totalStudents),
            icon: <PsychologyIcon sx={{ fontSize: 40, color: "#F59E0B" }} />,
          },
          {
            title: "Remote Jobs",
            value: String(adminStats.remoteJobs),
            icon: <DescriptionIcon sx={{ fontSize: 40, color: "#16A34A" }} />,
          },
        ]);
      } catch {
        console.error("Failed to fetch report stats");
      }
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) {
    return <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}><CircularProgress /></Box>;
  }

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
          <CardContent>
            {item.icon}

            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                mt: 2,
                color: "#0F172A",
              }}
            >
              {item.value}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "#64748B",
                mt: 1,
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

export default ReportsStats;
