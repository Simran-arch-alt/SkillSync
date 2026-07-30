import { useState, useEffect } from "react";
import { Typography, CircularProgress, Box } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";

import CardContainer from "../Common/CardContainer";
import request from "../../services/api";

interface Trend {
  month: string;
  year: number;
  count: number;
}

const RegistrationChart = () => {
  const [months, setMonths] = useState<string[]>([]);
  const [counts, setCounts] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await request<{ trends: Trend[] }>("/admin/registration-trends");
        setMonths(res.trends.map((t) => t.month));
        setCounts(res.trends.map((t) => t.count));
      } catch {
        console.error("Failed to fetch registration trends");
      }
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <CardContainer>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#0F172A", mb: 3 }}>
          User Registration Trend
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}><CircularProgress /></Box>
      </CardContainer>
    );
  }

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
            data: months.length > 0 ? months : ["No Data"],
          },
        ]}
        series={[
          {
            data: counts.length > 0 ? counts : [0],
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
