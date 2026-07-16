import { Box, Grid } from "@mui/material";

// Layout Components
import Sidebar from "../components/UserMangement/sidebar";
import Nav from "../components/Nav/Nav";

// Profile Components
import AdminProfileHeader from "../components/AdminProfile/AdminHeader";
import AdminProfileCard from "../components/AdminProfile/AdminProfileCard";
import PersonalInformationCard from "../components/AdminProfile/PersonalInformationCard";
import SecurityCard from "../components/AdminProfile/SecurityCard";




const AdminProfile = () => {

  return (
    // Main Layout
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#F8FAFC",
      }}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Right Side */}
      <Box sx={{ flexGrow: 1 }}>

        {/* Top Navigation */}
        <Nav />

        {/* Page Content */}
        <Box sx={{ p: 4 }}>

          {/* Header */}
          <AdminProfileHeader />

          {/* Profile Card */}
          <Box sx={{ mb: 4 }}>
            <AdminProfileCard />
          </Box>

          {/* Personal Information + Security */}
          <Grid container spacing={3} sx={{ mb: 4 }}>

            {/* Left Card */}
            <Grid size={{ xs: 12, lg: 7 }}>
              <PersonalInformationCard />
            </Grid>

            {/* Right Card */}
            <Grid size={{ xs: 12, lg: 5 }}>
              <SecurityCard />
            </Grid>

          </Grid>

          

        </Box>
      </Box>
    </Box>
  );
};

export default AdminProfile;