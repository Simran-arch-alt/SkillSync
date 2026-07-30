import { Box, CardContent, Typography } from "@mui/material";

import PsychologyIcon from "@mui/icons-material/Psychology";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CategoryIcon from "@mui/icons-material/Category";
import TuneIcon from "@mui/icons-material/Tune";

import CardContainer from "../Common/CardContainer";

import type { Skill } from "../../data/skills";

interface SkillStatsProps {
  skills: Skill[];
}

const SkillStats = ({ skills }: SkillStatsProps) => {
  
  // Total number of skills
  const totalSkills = skills.length;

  // Count active skills
  const activeSkills = skills.filter(
    (skill) => skill.status === "Active"
  ).length;

  // Count unique categories
  const totalCategories = new Set(
    skills.map((skill) => skill.category)
  ).size;

  // Calculate average weight
  const averageWeight =
    skills.length > 0
      ? (
          skills.reduce(
            (sum, skill) => sum + skill.weight,
            0
          ) / skills.length
        ).toFixed(2)
      : "0.00";

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
      {/* Total Skills */}

      <CardContainer>
        <CardContent>
          <PsychologyIcon
            sx={{
              fontSize: 40,
              color: "#119DA4",
            }}
          />

          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              mt: 2,
            }}
          >
            {totalSkills}
          </Typography>

          <Typography color="text.secondary">
            Total Skills
          </Typography>
        </CardContent>
      </CardContainer>

      {/* Active Skills */}

      <CardContainer>
        <CardContent>
          <CheckCircleIcon
            sx={{
              fontSize: 40,
              color: "#22C55E",
            }}
          />

          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              mt: 2,
            }}
          >
            {activeSkills}
          </Typography>

          <Typography color="text.secondary">
            Active Skills
          </Typography>
        </CardContent>
      </CardContainer>

      {/* Categories */}

      <CardContainer>
        <CardContent>
          <CategoryIcon
            sx={{
              fontSize: 40,
              color: "#F59E0B",
            }}
          />

          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              mt: 2,
            }}
          >
            {totalCategories}
          </Typography>

          <Typography color="text.secondary">
            Categories
          </Typography>
        </CardContent>
      </CardContainer>

      {/* Average Weight */}

      <CardContainer>
        <CardContent>
          <TuneIcon
            sx={{
              fontSize: 40,
              color: "#6366F1",
            }}
          />

          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              mt: 2,
            }}
          >
            {averageWeight}
          </Typography>

          <Typography color="text.secondary">
            Average Weight
          </Typography>
        </CardContent>
      </CardContainer>
    </Box>
  );
};

export default SkillStats;