import { Box } from "@mui/material";

// Layout
import Sidebar from "../components/UserMangement/sidebar";
import Nav from "../components/Nav/Nav";

// Components
import NotificationHeader from "../components/AdminNotification/NotificationHeader";
import NotificationList from "../components/AdminNotification/NotificationList";

const AdminNotifications = () => {
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
        {/* Top Navigation */}
        <Nav />

        {/* Page Content */}
        <Box
          sx={{
            p: 4,
          }}
        >
          {/* Header */}
          <NotificationHeader />

          {/* Notification List */}
          <NotificationList />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminNotifications;