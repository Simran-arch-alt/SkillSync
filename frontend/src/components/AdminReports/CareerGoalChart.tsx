import { Typography } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";

import CardContainer from "../Common/CardContainer";// ======================================


const careerGoals = [
  {
    id: 0,
    value: 35,
    label: "Software Engineer",
    color: "#119DA4",
  },
  {
    id: 1,
    value: 20,
    label: "Data Scientist",
    color: "#3B82F6",
  },
  {
    id: 2,
    value: 18,
    label: "Frontend Developer",
    color: "#8B5CF6",
  },
  {
    id: 3,
    value: 15,
    label: "DevOps Engineer",
    color: "#F59E0B",
  },
  {
    id: 4,
    value: 12,
    label: "Cloud Engineer",
    color: "#16A34A",
  },
];

const CareerGoalChart = () => {
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
        Career Goal Distribution
      </Typography>

      <PieChart
        height={320}
        series={[
          {
            data: careerGoals,
            innerRadius: 60,
            outerRadius: 105,
            paddingAngle: 3,
            cornerRadius: 5,
          },
        ]}
      />
    </CardContainer>
  );
};

export default CareerGoalChart;