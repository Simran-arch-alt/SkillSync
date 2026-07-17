import { useState, useEffect } from 'react';
import { Typography, CircularProgress, Box } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import CardContainer from '../Common/CardContainer';
import { getCategories } from '../../services/dashboardService';

const COLORS = ['#119DA4', '#3B82F6', '#8B5CF6', '#F59E0B', '#16A34A', '#EF4444', '#EC4899', '#6366F1'];

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
    return <CardContainer><Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box></CardContainer>;
  }

  return (
    <CardContainer>
      <Typography variant="h6" sx={{ fontWeight: "bold", color: "#0F172A", mb: 3 }}>Job Categories</Typography>
      <PieChart height={320} series={[{ data: chartData, innerRadius: 55, outerRadius: 100, paddingAngle: 3, cornerRadius: 6 }]} />
    </CardContainer>
  );
};

export default SkillCategoryChart;
