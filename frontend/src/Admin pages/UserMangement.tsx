import { useState, useEffect } from "react";
import { Box } from "@mui/material";

import Sidebar from "../components/UserMangement/sidebar";
import Nav from "../components/Nav/Nav";

import UserStats from "../components/UserMangement/UserStats";
import UserToolbar from "../components/UserMangement/UserToolbar";
import UserTable from "../components/UserMangement/UserTable";

import Useractionmenu from "../components/UserMangement/Useractionmenu";
import ConfirmDialog from "../components/UserMangement/ConfirmDialog";
import AddUserDialog from "../components/UserMangement/AddUserDialog";

import UserHeader from "../components/UserMangement/Userheader";
import { getAllUsers, deleteUser, toggleUserStatus } from "../services/adminService";

interface User {
  id: string;
  name: string;
  email: string;
  careerGoal: string;
  qualifications: string;
  completion: number;
  cvUploaded: boolean;
  status: "Active" | "Inactive";
  lastLogin: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [dialogType, setDialogType] = useState<"suspend" | "delete" | "activate">("suspend");
  const [search, setSearch] = useState("");
  const [careerFilter, setCareerFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { users: apiUsers } = await getAllUsers(1, 100);
      const mapped: User[] = (apiUsers || []).map((u: any) => ({
        id: u._id,
        name: u.name,
        email: u.email,
        careerGoal: u.role === 'admin' ? 'Administrator' : 'Student',
        qualifications: u.university || u.degree || 'N/A',
        completion: Math.min(100, (u.skills?.length || 0) * 10 + 20),
        cvUploaded: !!u.resume,
        status: u.status === 'suspended' ? 'Inactive' : 'Active',
        lastLogin: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A',
      }));
      setUsers(mapped);
    } catch {
      console.error('Failed to fetch users');
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: User) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) || user.email.toLowerCase().includes(search.toLowerCase());
    const matchesCareer = careerFilter === "All" || user.careerGoal === careerFilter;
    const matchesStatus = statusFilter === "All" || user.status === statusFilter;
    return matchesSearch && matchesCareer && matchesStatus;
  });

  const handleAddUser = (newUser: any) => {
    const mapped: User = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      careerGoal: newUser.role === 'admin' ? 'Administrator' : 'Student',
      qualifications: newUser.university || newUser.degree || 'N/A',
      completion: Math.min(100, (newUser.skills?.length || 0) * 10 + 20),
      cvUploaded: !!newUser.resume,
      status: newUser.status === 'suspended' ? 'Inactive' : 'Active',
      lastLogin: newUser.createdAt ? new Date(newUser.createdAt).toLocaleDateString() : 'N/A',
    };
    setUsers((prev) => [...prev, mapped]);
  };

  const handleSuspendUser = async () => {
    if (!selectedUser) return;
    try {
      const { user } = await toggleUserStatus(selectedUser.id);
      setUsers((prev) => prev.map((u) => u.id === selectedUser.id
        ? { ...u, status: user.status === 'suspended' ? 'Inactive' : 'Active' }
        : u
      ));
    } catch {
      console.error('Failed to suspend user');
    }
    setOpenConfirmDialog(false);
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      await deleteUser(selectedUser.id);
      setUsers((prev) => prev.filter((user) => user.id !== selectedUser.id));
    } catch {
      console.error('Failed to delete user');
    }
    setOpenConfirmDialog(false);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F8FAFC" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1 }}>
        <Nav />
        <Box sx={{ p: 4 }}>
          <UserHeader />
          <UserStats users={users} />
          <Box sx={{ mt: 4 }}>
            <UserToolbar search={search} setSearch={setSearch} careerFilter={careerFilter} setCareerFilter={setCareerFilter} statusFilter={statusFilter} setStatusFilter={setStatusFilter} onAddUser={() => setOpenAddDialog(true)} />
          </Box>
          <Box sx={{ mt: 4 }}>
            <UserTable users={filteredUsers} page={page} rowsPerPage={rowsPerPage} onPageChange={(_, newPage) => setPage(newPage)} onRowsPerPageChange={(event) => { setRowsPerPage(parseInt(event.target.value)); setPage(0); }} onMenueOpen={handleMenuOpen} />
          </Box>
        </Box>
        <Useractionmenu anchorEl={anchorEl} open={openMenu} onClose={handleMenuClose} userStatus={selectedUser?.status} onSuspend={() => { setDialogType(selectedUser?.status === "Inactive" ? "activate" : "suspend"); setOpenConfirmDialog(true); }} onDelete={() => { setDialogType("delete"); setOpenConfirmDialog(true); }} />
        <ConfirmDialog open={openConfirmDialog} title={dialogType === "suspend" ? "Suspend Account" : dialogType === "activate" ? "Activate Account" : "Delete Account"} message={dialogType === "suspend" ? "Are you sure you want to suspend this account?" : dialogType === "activate" ? "Are you sure you want to activate this account?" : "Are you sure you want to delete this account?"} confirmText={dialogType === "suspend" ? "Suspend" : dialogType === "activate" ? "Activate" : "Delete"} onClose={() => setOpenConfirmDialog(false)} onConfirm={dialogType === "delete" ? handleDeleteUser : handleSuspendUser} />
        <AddUserDialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} onAddUser={handleAddUser} />
      </Box>
    </Box>
  );
};

export default UserManagement;
