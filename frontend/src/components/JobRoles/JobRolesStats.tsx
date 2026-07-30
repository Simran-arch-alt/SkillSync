import {
  Box,
  CardContent,
  Typography,
} from "@mui/material";

import WorkIcon from "@mui/icons-material/Work";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import GroupsIcon from "@mui/icons-material/Groups";
import PsychologyIcon from "@mui/icons-material/Psychology";

import CardContainer from "../Common/CardContainer";

const JobRolesStats = () => {
  const stats = [
    {
      title: "Total Job Roles",
      value: "24",
      icon: (
        <WorkIcon
          sx={{
            fontSize: 40,
            color: "#119DA4",
          }}
        />
      ),
    },
    {
      title: "Active Roles",
      value: "20",
      icon: (
        <CheckCircleIcon
          sx={{
            fontSize: 40,
            color: "#16A34A",
          }}
        />
      ),
    },
    {
      title: "Students Interested",
      value: "486",
      icon: (
        <GroupsIcon
          sx={{
            fontSize: 40,
            color: "#3B82F6",
          }}
        />
      ),
    },
    {
      title: "Avg. Required Skills",
      value: "8",
      icon: (
        <PsychologyIcon
          sx={{
            fontSize: 40,
            color: "#F59E0B",
          }}
        />
      ),
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
                mt: 2,
                fontWeight: "bold",
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

export default JobRolesStats;