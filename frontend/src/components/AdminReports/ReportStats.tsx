import {
  Box,
  CardContent,
  Typography,
} from "@mui/material";

import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PsychologyIcon from "@mui/icons-material/Psychology";
import DescriptionIcon from "@mui/icons-material/Description";

import CardContainer from "../Common/CardContainer";

const ReportsStats = () => {
  const stats = [
    {
      title: "Total Users",
      value: "1,248",
      icon: <PeopleAltIcon sx={{ fontSize: 40, color: "#119DA4" }} />,
    },
    {
      title: "Reports Generated",
      value: "286",
      icon: <AssessmentIcon sx={{ fontSize: 40, color: "#3B82F6" }} />,
    },
    {
      title: "Skills Assessed",
      value: "542",
      icon: <PsychologyIcon sx={{ fontSize: 40, color: "#F59E0B" }} />,
    },
    {
      title: "CV Uploaded",
      value: "1,075",
      icon: <DescriptionIcon sx={{ fontSize: 40, color: "#16A34A" }} />,
    },
  ];

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