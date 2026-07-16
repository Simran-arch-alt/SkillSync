import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import Sidebar from "../components/Nav/Sidebar";
import Nav from "../components/Nav/Nav";

import CardContainer from "../components/Common/CardContainer";
import CustomSnackbar from "../components/Common/CustomSnackbar";

import Header from "../components/Profilesettings/header";
import AvatarSection from "../components/Profilesettings/AvatarSection";
import PersonalInfoForm from "../components/Profilesettings/PersonalInfoForm";
import PasswordSection from "../components/Profilesettings/PasswordSection";
import ActionButtons from "../components/Profilesettings/ActionButtons";


const ProfileSettings = () => {
  const navigate = useNavigate();

  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleSave = () => {
    setOpenSnackbar(true);

    

    setTimeout(() => {
      navigate("/settings");
    }, 1500);
  };

  const handleCancel = () => {
    navigate("/settings");
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#F1F5F9",
      }}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Nav />

        <Box
          sx={{
            p: 4,
          }}
        >
          <CardContainer>
            <Header />

            <AvatarSection name="krishnaa Khaitu" />

            <PersonalInfoForm/>

            <PasswordSection />

           

            <ActionButtons
              onCancel={handleCancel}
              onSave={handleSave}
            />
          </CardContainer>
        </Box>
      </Box>

      <CustomSnackbar
        open={openSnackbar}
        onClose={() => setOpenSnackbar(false)}
        message="Profile updated successfully!"
        severity="success"
      />
    </Box>
  );
};

export default ProfileSettings;
