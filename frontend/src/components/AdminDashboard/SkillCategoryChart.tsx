import { useState, useEffect } from 'react';
import { Typography, CircularProgress, Box } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import { getCategories } from '../../services/dashboardService';

const COLORS = ['#119DA4', '#6366F1', '#F59E0B', '#16A34A', '#EF4444', '#EC4899', '#8B5CF6', '#0EA5E9'];

const SkillCategoryChart = () => {
  const [chartData, setChartData] = useState<{ id: number; value: number; label: string; color: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getCategories();
        setChartData(categories.slice(0, 8).map((c, i) => ({
          id: i,
          value: c.count,
          label: c.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          color: COLORS[i % COLORS.length],
        })));
      } catch {
        console.error('Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 4, borderRadius: 4, border: "1px solid #E2E8F0", bgcolor: "#FFFFFF", boxShadow: "0 4px 20px rgba(0,0,0,0.04)", display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 4,
        border: "1px solid #E2E8F0",
        bgcolor: "#FFFFFF",
        boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700, color: "#0F172A", mb: 0.5 }}>
        Job Categories
      </Typography>
      <Typography variant="body2" sx={{ color: "#94A3B8", mb: 2 }}>
        Distribution across role types
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
        <PieChart
          width={320}
          height={260}
          series={[{
            data: chartData,
            innerRadius: 50,
            outerRadius: 95,
            paddingAngle: 2,
            cornerRadius: 6,
            highlightScope: { fade: "global", highlight: "item" },
            faded: { innerRadius: 45, additionalRadius: -5, color: "gray" },
          }]}
        />
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mt: 2, justifyContent: "center" }}>
        {chartData.map((item) => (
          <Box key={item.id} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: item.color }} />
            <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 500 }}>{item.label} ({item.value})</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default SkillCategoryChart;
