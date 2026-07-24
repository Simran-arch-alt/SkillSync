import { useState, useEffect } from "react";
import { Typography, CircularProgress, Box } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";

import CardContainer from "../Common/CardContainer";
import { getCategories } from "../../services/dashboardService";

const SkillDistributionChart = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [values, setValues] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const cats = await getCategories();
        setCategories(cats.map((c) => c.category));
        setValues(cats.map((c) => c.count));
      } catch {
        console.error("Failed to fetch categories");
      }
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <CardContainer>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#0F172A", mb: 3 }}>
          Skill Distribution
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
        Skill Distribution
      </Typography>

      <BarChart
        layout="horizontal"
        yAxis={[
          {
            scaleType: "band",
            data: categories.length > 0 ? categories : ["No Data"],
          },
        ]}
        series={[
          {
            data: values.length > 0 ? values : [0],
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
