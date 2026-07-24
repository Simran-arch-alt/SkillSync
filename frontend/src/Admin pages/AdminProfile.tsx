import { useState, useEffect, useCallback } from "react";
import { Box, Grid } from "@mui/material";

import Sidebar from "../components/UserMangement/sidebar";
import Nav from "../components/Nav/Nav";

import AdminProfileHeader from "../components/AdminProfile/AdminHeader";
import AdminProfileCard from "../components/AdminProfile/AdminProfileCard";
import PersonalInformationCard from "../components/AdminProfile/PersonalInformationCard";
import SecurityCard from "../components/AdminProfile/SecurityCard";

import { getMe } from "../services/authService";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  university?: string;
  degree?: string;
  graduationYear?: number;
  skills?: string[];
  createdAt?: string;
}

const AdminProfile = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const data = await getMe();
      setUser(data as unknown as UserProfile);
    } catch {
      console.error("Failed to fetch user profile");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F8FAFC" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1 }}>
        <Nav />
        <Box sx={{ p: 4 }}>
          <AdminProfileHeader />

          <Box sx={{ mb: 4 }}>
            <AdminProfileCard user={user} loading={loading} />
          </Box>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, lg: 7 }}>
              <PersonalInformationCard user={user} onSaved={fetchUser} />
            </Grid>
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
