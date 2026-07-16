import { Typography } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";

import CardContainer from "../Common/CardContainer";

// Mock Data
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
];

const users = [120, 180, 260, 340, 480, 690, 920];

const UserGrowthChart = () => {
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
        User Growth
      </Typography>

      {/* Line Chart */}

      <LineChart
        xAxis={[
          {
            scaleType: "point",
            data: months,
          },
        ]}
        series={[
          {
            data: users,
            label: "Users",
            color: "#119DA4",
            curve: "monotoneX",
          },
        ]}
        height={320}
        margin={{
          left: 50,
          right: 20,
          top: 20,
          bottom: 40,
        }}
      />

    </CardContainer>
  );
};

export default UserGrowthChart;