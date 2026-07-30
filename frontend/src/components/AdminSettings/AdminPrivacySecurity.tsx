import { Box } from "@mui/material";

import Sidebar from "../../components/UserMangement/sidebar";
import Nav from "../../components/Nav/Nav";

import PrivacySettingsCard from "../../components/AdminSettings/PrivacySettingsCard";
import LoginSessionCard from "../../components/AdminSettings/LoginSessionCard";

const AdminPrivacySecurity = () => {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#F8FAFC",
      }}
    >
      <Sidebar />

      <Box sx={{ flexGrow: 1 }}>
        <Nav />

        <Box sx={{ p: 4 }}>
          <PrivacySettingsCard />

          <Box sx={{ mt: 3 }}>
            <LoginSessionCard />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminPrivacySecurity;