import { useState, useEffect } from "react";
import { Box } from "@mui/material";

import Sidebar from "../components/UserMangement/sidebar";
import Nav from "../components/Nav/Nav";

import JobRolesHeader from "../components/JobRoles/JobRolesHeader";
import JobRolesToolbar from "../components/JobRoles/JobRolesToolbar";
import JobRolesTable from "../components/JobRoles/JobRolesTable";

import AddJobRoleDialog from "../components/JobRoles/AddJobRoleDialog";
import JobRoleActionMenu from "../components/JobRoles/JobRoleActionMenu";
import ConfirmDialog from "../components/Common/ConfirmDialog";
import EditJobRoleDialog from "../components/JobRoles/EditJobRoleDialog";

import request from "../services/api";
import type { JobRole } from "../data/jobRoles";

interface ApiJob {
  _id: string;
  job_title: string;
  role_category?: string;
  skills?: string[];
}

interface JobsResponse {
  jobs: ApiJob[];
}

const AdminJobRoles = () => {
  const [roles, setRoles] = useState<JobRole[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedRole, setSelectedRole] = useState<JobRole | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await request<JobsResponse>("/jobs?limit=200");
      const mapped: JobRole[] = res.jobs.map((j) => ({
        id: j._id,
        name: j.job_title,
        category: (j.role_category?.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || "General") as JobRole["category"],
        requiredSkills: j.skills || [],
        students: 0,
        status: "Active" as const,
      }));
      setRoles(mapped);
    } catch {
      console.error("Failed to fetch jobs");
    }
  };

  const filteredRoles = roles.filter((role) => {
    const matchesSearch = role.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "All" || role.category === categoryFilter;
    const matchesStatus = statusFilter === "All" || role.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handlePageChange = (_: unknown, newPage: number) => setPage(newPage);
  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => { setRowsPerPage(Number(event.target.value)); setPage(0); };
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, role: JobRole) => { setAnchorEl(event.currentTarget); setSelectedRole(role); };
  const handleMenuClose = () => setAnchorEl(null);
  const handleAddRole = (newRole: JobRole) => setRoles((prev) => [...prev, newRole]);

  const handleUpdateJobRole = (updatedRole: JobRole) => {
    setRoles((prev) => prev.map((role) => role.id === updatedRole.id ? updatedRole : role));
    setOpenEditDialog(false);
  };

  const handleDeleteRole = async () => {
    if (!selectedRole) return;
    try {
      await request(`/admin/jobs/${selectedRole.id}`, { method: "DELETE" });
      setRoles((prev) => prev.filter((role) => role.id !== selectedRole.id));
    } catch {
      console.error("Failed to delete job");
    }
    setOpenDeleteDialog(false);
    setSelectedRole(null);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F8FAFC" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1 }}>
        <Nav />
        <Box sx={{ p: 4 }}>
          <JobRolesHeader />
          <Box sx={{ mt: 4 }}>
            <JobRolesToolbar search={search} setSearch={setSearch} categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter} statusFilter={statusFilter} setStatusFilter={setStatusFilter} onAddRole={() => setOpenAddDialog(true)} />
          </Box>
          <Box sx={{ mt: 3 }}>
            <JobRolesTable roles={filteredRoles} page={page} rowsPerPage={rowsPerPage} onPageChange={handlePageChange} onRowsPerPageChange={handleRowsPerPageChange} onMenuOpen={handleMenuOpen} />
          </Box>
          <AddJobRoleDialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} onAddRole={handleAddRole} />
          <JobRoleActionMenu anchorEl={anchorEl} open={Boolean(anchorEl)} selectedRole={selectedRole} onClose={handleMenuClose} onEdit={() => { if (!selectedRole) return; setOpenEditDialog(true); handleMenuClose(); }} onDelete={() => { setOpenDeleteDialog(true); handleMenuClose(); }} />
          <EditJobRoleDialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} jobRole={selectedRole} onSave={handleUpdateJobRole} />
          <ConfirmDialog open={openDeleteDialog} title="Delete Job Role" message={`Are you sure you want to delete "${selectedRole?.name}"?`} onClose={() => setOpenDeleteDialog(false)} onConfirm={handleDeleteRole} />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminJobRoles;
