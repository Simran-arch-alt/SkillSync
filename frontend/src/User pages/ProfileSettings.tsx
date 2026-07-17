import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Sidebar from "../components/Nav/Sidebar";
import Nav from "../components/Nav/Nav";

import CardContainer from "../components/Common/CardContainer";
import CustomSnackbar from "../components/Common/CustomSnackbar";

import Header from "../components/Profilesettings/header";
import AvatarSection from "../components/Profilesettings/AvatarSection";
import PersonalInfoForm from "../components/Profilesettings/PersonalInfoForm";
import PasswordSection from "../components/Profilesettings/PasswordSection";
import ActionButtons from "../components/Profilesettings/ActionButtons";

import { getProfile, updateProfile } from "../services/studentService";

const ProfileSettings = () => {
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    getProfile().then((profile: any) => {
      const user = profile?.user || profile;
      setUserName(user?.name || "");
      setUserEmail(user?.email || "");
    }).catch(() => {});
  }, []);

  const handleSave = async () => {
    try {
      await updateProfile({ name: userName } as any);
    } catch {}
    setOpenSnackbar(true);
    setTimeout(() => navigate("/settings"), 1500);
  };

  const handleCancel = () => navigate("/settings");

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F1F5F9" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Nav />
        <Box sx={{ p: 4 }}>
          <CardContainer>
            <Header />
            <AvatarSection name={userName || "User"} />
            <PersonalInfoForm name={userName} email={userEmail} onNameChange={setUserName} onEmailChange={setUserEmail} />
            <PasswordSection />
            <ActionButtons onCancel={handleCancel} onSave={handleSave} />
          </CardContainer>
        </Box>
      </Box>
      <CustomSnackbar open={openSnackbar} onClose={() => setOpenSnackbar(false)} message="Profile updated successfully!" severity="success" />
    </Box>
  );
};

export default ProfileSettings;
