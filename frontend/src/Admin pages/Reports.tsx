import { useState } from "react";
import { Box, Grid } from "@mui/material";

import Sidebar from "../components/UserMangement/sidebar";
import Nav from "../components/Nav/Nav";

import ReportsHeader from "../components/AdminReports/ReportsHeader";
import ReportsToolbar from "../components/AdminReports/ReportsToolbar";
import ReportsStats from "../components/AdminReports/ReportStats";
import RegistrationChart from "../components/AdminReports/RegistrationChart";

import SkillDistributionChart from "../components/AdminReports/SkillDistributionChart";


const Reports = () => {
  const [dateRange, setDateRange] = useState("30 Days");
  const [reportType, setReportType] = useState("All Reports");

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
          <ReportsHeader />

          

          <Box sx={{ mt: 4 }}>
            {/* Statistics */}
            <ReportsStats />
          </Box>

          {/* Registration Chart */}
          <Box sx={{ mb: 4 }}>
            <RegistrationChart />
          </Box>

          {/* Pie Chart + Bar Chart */}
          <Grid container spacing={3} sx={{ mb: 4 }}>

            <Grid size={{ xs: 12, md: 12 }}>
              <SkillDistributionChart />
            </Grid>
          </Grid>
          {/* Toolbar */}
          <ReportsToolbar
            dateRange={dateRange}
            setDateRange={setDateRange}
            reportType={reportType}
            setReportType={setReportType}
          />

         
        </Box>
      </Box>
    </Box>
  );
};

export default Reports;