import {
  Box,
  LinearProgress,
  Typography,
} from "@mui/material";

import CardContainer from "../Common/CardContainer";


const topSkills = [
  {
    id: 1,
    name: "Python",
    percentage: 95,
  },
  {
    id: 2,
    name: "React",
    percentage: 90,
  },
  {
    id: 3,
    name: "JavaScript",
    percentage: 85,
  },
  {
    id: 4,
    name: "SQL",
    percentage: 75,
  },
  {
    id: 5,
    name: "Docker",
    percentage: 68,
  },
];

const TopSkills = () => {
  return (
    <CardContainer>
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          color: "#0F172A",
          mb: 3,
        }}
      >
        Top Skills
      </Typography>

      {topSkills.map((skill) => (
        <Box
          key={skill.id}
          sx={{
            mb: 3,
          }}
        >
          {/* Skill Name & Percentage */}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Typography
              sx={{
                fontWeight: 600,
              }}
            >
              {skill.name}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              {skill.percentage}%
            </Typography>
          </Box>

          {/* Progress Bar */}

          <LinearProgress
            variant="determinate"
            value={skill.percentage}
            sx={{
              height: 10,
              borderRadius: 10,

              bgcolor: "#E2E8F0",

              "& .MuiLinearProgress-bar": {
                bgcolor: "#119DA4",
                borderRadius: 10,
              },
            }}
          />
        </Box>
      ))}
    </CardContainer>
  );
};

export default TopSkills;