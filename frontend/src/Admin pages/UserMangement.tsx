import { useState } from "react";
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
import { users as initialUsers } from "../data/users";
import type { User } from "../data/users";

const UserManagement = () => {

const [users, setUsers] = useState<User[]>(initialUsers);
const[ dialogType, setDialogType] = useState<"suspend" | "delete">("suspend");

const [search, setSearch] = useState("");

const [careerFilter, setCareerFilter] = useState("All");

const [statusFilter, setStatusFilter] = useState("All");

const [page, setPage] = useState(0);

const [rowsPerPage, setRowsPerPage] = useState(5);
// Dialog states

const [openAddDialog, setOpenAddDialog] = useState(false);
const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

const [selectedUser, setSelectedUser] = useState<User | null>(null);

const [anchorEl, setAnchorEl] =
useState<null | HTMLElement>(null);

const openMenu = Boolean(anchorEl);

const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    user: User
) => {

    setAnchorEl(event.currentTarget);

    setSelectedUser(user);

};

const handleMenuClose = () => {

    setAnchorEl(null);

};

const filteredUsers = users.filter((user) => {

    const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());

    const matchesCareer =
        careerFilter === "All" ||
        user.careerGoal === careerFilter;

    const matchesStatus =
        statusFilter === "All" ||
        user.status === statusFilter;

        

    return (
        matchesSearch &&
        matchesCareer &&
        matchesStatus
    );

});

const handleAddUser = (newUser: User) => {

    setUsers((prev) => [...prev, newUser]);

};

const handleSuspendUser = () => {

    if (!selectedUser) return;

    setUsers((prev) =>
        prev.map((user) =>
            user.id === selectedUser.id
                ? {
                      ...user,
                      status: "Inactive",
                  }
                : user
        )
    );

    setOpenConfirmDialog(false);

};

const handleDeleteUser = () => {

    if (!selectedUser) return;

    setUsers((prev) =>
        prev.filter(
            (user) => user.id !== selectedUser.id
        )
    );

    setOpenConfirmDialog(false);

};

return (
  <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F8FAFC" }}>
    {/* Left Sidebar */}
    <Sidebar />
    
    

    {/* Main Content */}
    <Box sx={{ flexGrow: 1 }}>
      <Nav />

      <Box sx={{ p: 4 }}>
        <UserHeader/>
      


      <UserStats users={users} />
      <Box sx={{mt:4}}>

      <UserToolbar
    search={search}
    setSearch={setSearch}

    careerFilter={careerFilter}
    setCareerFilter={setCareerFilter}

    statusFilter={statusFilter}
    setStatusFilter={setStatusFilter}

    onAddUser={() => setOpenAddDialog(true)}
/>
</Box>

<Box sx={{mt:4}}>

<UserTable
    users={filteredUsers}

    page={page}
    rowsPerPage={rowsPerPage}

    onPageChange={(_, newPage) => setPage(newPage)}

    onRowsPerPageChange={(event) => {
        setRowsPerPage(parseInt(event.target.value));
        setPage(0);
    }}

    onMenueOpen={handleMenuOpen}
/>
</Box>
</Box>


<Useractionmenu
    anchorEl={anchorEl}
    open={openMenu}

    onClose={handleMenuClose}

   

    onSuspend={() => {
      setDialogType("suspend");
        setOpenConfirmDialog(true);
    }}

    onDelete={() => {
      setDialogType("delete");
        setOpenConfirmDialog(true);
    }}
/>

<ConfirmDialog
    open={openConfirmDialog}

    title={dialogType === "suspend" ? "Suspend Account" : "Delete Account"}

    message={dialogType === "suspend" ? "Are you sure you want to suspend this account?" : "Are you sure you want to delete this account?"}

    confirmText={dialogType === "suspend" ? "Suspend" : "Delete"}
    onClose={() => setOpenConfirmDialog(false)}

    onConfirm={handleSuspendUser}
/>

<AddUserDialog
    open={openAddDialog}

    onClose={() => setOpenAddDialog(false)}

    onAddUser={handleAddUser}
/>
      </Box>
    </Box>
  
);
};

export default UserManagement;
