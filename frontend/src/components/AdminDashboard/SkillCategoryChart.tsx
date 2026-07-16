import { Typography } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";

import CardContainer from "../Common/CardContainer";



const skillCategories = [
  {
    id: 0,
    value: 35,
    label: "Programming",
    color: "#119DA4",
  },
  {
    id: 1,
    value: 25,
    label: "Frontend",
    color: "#3B82F6",
  },
  {
    id: 2,
    value: 15,
    label: "Backend",
    color: "#8B5CF6",
  },
  {
    id: 3,
    value: 15,
    label: "AI / ML",
    color: "#F59E0B",
  },
  {
    id: 4,
    value: 10,
    label: "DevOps",
    color: "#16A34A",
  },
];

const SkillCategoryChart = () => {
  return (
    <CardContainer>

      {/* Card Title */}

      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          color: "#0F172A",
          mb: 3,
        }}
      >
        Skill Categories
      </Typography>

      {/* Pie Chart */}

      <PieChart
        height={320}
        series={[
          {
            data: skillCategories,
            innerRadius: 55,
            outerRadius: 100,
            paddingAngle: 3,
            cornerRadius: 6,
          },
        ]}
      />

    </CardContainer>
  );
};

export default SkillCategoryChart;