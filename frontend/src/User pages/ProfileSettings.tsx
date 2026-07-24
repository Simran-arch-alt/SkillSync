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
import { useAuth } from "../contexts/AuthContext";

const ProfileSettings = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [university, setUniversity] = useState("");
  const [degree, setDegree] = useState("");
  const [graduationYear, setGraduationYear] = useState("");

  useEffect(() => {
    getProfile().then((profile: any) => {
      const user = profile?.user || profile;
      setUserName(user?.name || "");
      setUserEmail(user?.email || "");
      setUniversity(user?.university || "");
      setDegree(user?.degree || "");
      setGraduationYear(user?.graduationYear ? String(user.graduationYear) : "");
    }).catch(() => {});
  }, []);

  const handleSave = async () => {
    try {
      const updates: any = { name: userName };
      if (university) updates.university = university;
      if (degree) updates.degree = degree;
      if (graduationYear) updates.graduationYear = parseInt(graduationYear, 10);
      const res = await updateProfile(updates);
      const updated = (res as any)?.user || res;
      if (updated) setUser(updated as any);
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
            <PersonalInfoForm
              name={userName}
              email={userEmail}
              onNameChange={setUserName}
              onEmailChange={setUserEmail}
            />
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 3 }}>
              <Box>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <label style={{ fontSize: 14, fontWeight: 600, color: '#334155', display: 'block', marginBottom: 8 }}>University</label>
                    <input
                      type="text"
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      placeholder="e.g. Tribhuvan University"
                      style={{ width: '100%', padding: '14px 16px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <label style={{ fontSize: 14, fontWeight: 600, color: '#334155', display: 'block', marginBottom: 8 }}>Degree</label>
                    <input
                      type="text"
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                      placeholder="e.g. B.Sc. Computer Science"
                      style={{ width: '100%', padding: '14px 16px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <label style={{ fontSize: 14, fontWeight: 600, color: '#334155', display: 'block', marginBottom: 8 }}>Graduation Year</label>
                    <input
                      type="number"
                      value={graduationYear}
                      onChange={(e) => setGraduationYear(e.target.value)}
                      placeholder="e.g. 2025"
                      min={1950}
                      max={2100}
                      style={{ width: '100%', padding: '14px 16px', borderRadius: 8, border: '1px solid #CBD5E1', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
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
