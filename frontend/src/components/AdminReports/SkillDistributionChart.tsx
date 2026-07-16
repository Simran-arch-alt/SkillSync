import { Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";

import CardContainer from "../Common/CardContainer";


const categories = [
  "Programming",
  "Frontend",
  "Backend",
  "Database",
  "AI / ML",
  "DevOps",
];

const totalSkills = [45, 32, 28, 20, 18, 15];

const SkillDistributionChart = () => {
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
        Skill Distribution
      </Typography>

      <BarChart
        layout="horizontal"
        yAxis={[
          {
            scaleType: "band",
            data: categories,
          },
        ]}
        series={[
          {
            data: totalSkills,
            label: "Skills",
            color: "#119DA4",
          },
        ]}
        height={350}
        margin={{
          left: 90,
          right: 20,
          top: 20,
          bottom: 30,
        }}
      />
    </CardContainer>
  );
};

export default SkillDistributionChart;