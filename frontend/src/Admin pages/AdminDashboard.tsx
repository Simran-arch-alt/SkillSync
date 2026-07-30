import { Box, Grid } from "@mui/material";

import Sidebar from "../components/UserMangement/sidebar";
import Nav from "../components/Nav/Nav";

import DashboardHeader from "../components/AdminDashboard/DashboardHeader";
import DashboardStats from "../components/AdminDashboard/DashboardStats";
import UserGrowthChart from "../components/AdminDashboard/UserGrowthChart";
import SkillCategoryChart from "../components/AdminDashboard/SkillCategoryChart";


import TopSkills from "../components/AdminDashboard/TopSkills";

const Dashboard = () => {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#F8FAFC",
      }}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box sx={{ flexGrow: 1 }}>

        <Nav />

        <Box sx={{ p: 4 }}>

          {/* Header */}
          <DashboardHeader />

          {/* Statistics Cards */}
          <DashboardStats />

          {/* Charts */}
          <Grid container spacing={3} sx={{ mb: 3 }}>

            <Grid size={{ xs: 12, md: 6 }}>
              <UserGrowthChart />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <SkillCategoryChart />
            </Grid>

          </Grid>

          {/* Activity + Top Skills */}
          <Grid container spacing={3} sx={{ mb: 3 }}>

            <Grid size={{ xs: 12, md: 12 }}>
              <TopSkills />
            </Grid>

          </Grid>

       

        </Box>

      </Box>
    </Box>
  );
};

export default Dashboard;