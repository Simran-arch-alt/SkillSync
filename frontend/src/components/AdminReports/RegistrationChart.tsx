import { Typography } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";

import CardContainer from "../Common/CardContainer";



const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
];

const registrations = [45, 62, 78, 95, 120, 145, 168];

const RegistrationChart = () => {
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
        User Registration Trend
      </Typography>

      <LineChart
        xAxis={[
          {
            scaleType: "point",
            data: months,
          },
        ]}
        series={[
          {
            data: registrations,
            label: "Registrations",
            color: "#119DA4",
          },
        ]}
        height={320}
        margin={{
          left: 50,
          right: 20,
          top: 20,
          bottom: 30,
        }}
      />
    </CardContainer>
  );
};

export default RegistrationChart;