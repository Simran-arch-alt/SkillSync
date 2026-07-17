import { useState, useEffect } from "react";
import { Box } from "@mui/material";

import Sidebar from "../components/UserMangement/sidebar";
import Nav from "../components/Nav/Nav";

import SkillHeader from "../components/Skill/Skillheader";
import SkillStats from "../components/Skill/SkillStats";
import SkillToolbar from "../components/Skill/SkillToolbar";
import SkillTable from "../components/Skill/SkillTable";
import SkillActionMenu from "../components/Skill/SkillActionMenu";
import AddSkillDialog from "../components/Skill/AddSkillDialog";
import ConfirmDialog from "../components/UserMangement/ConfirmDialog";
import EditSkillDialog from "../components/Skill/EditSkillDialog";

import { getTopSkills } from "../services/dashboardService";

interface Skill {
  name: string;
  id: number;
  category: "Frontend" | "Backend" | "DevOps" | "Database" | "DataScience" | "Cloud";
  weight: number;
  assignedUsers: number;
  status: "Active" | "Inactive";
}

const categoryMap: Record<string, Skill["category"]> = {
  javascript: "Frontend", typescript: "Frontend", react: "Frontend", angular: "Frontend", vue: "Frontend", html: "Frontend", css: "Frontend",
  python: "DataScience", "machine learning": "DataScience", "data science": "DataScience", tensorflow: "DataScience", "scikit-learn": "DataScience", "deep learning": "DataScience", pandas: "DataScience", numpy: "DataScience",
  java: "Backend", "node.js": "Backend", express: "Backend", django: "Backend", flask: "Backend", "rest api": "Backend", spring: "Backend",
  docker: "DevOps", kubernetes: "DevOps", "ci/cd": "DevOps", jenkins: "DevOps", terraform: "DevOps", aws: "Cloud", azure: "Cloud", gcp: "Cloud", linux: "DevOps", git: "DevOps",
  sql: "Database", mysql: "Database", postgresql: "Database", mongodb: "Database", redis: "Database",
};

const SkillLibrary = () => {
  const [openEdit, setOpenEdit] = useState(false);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const menuOpen = Boolean(anchorEl);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const topSkills = await getTopSkills(50);
        const mapped: Skill[] = topSkills.map((s, i) => ({
          name: s.skill,
          id: i,
          category: categoryMap[s.skill.toLowerCase()] || "Backend",
          weight: Math.min(5, Math.ceil(s.count / 10)),
          assignedUsers: s.count,
          status: "Active" as const,
        }));
        setSkills(mapped);
      } catch {
        console.error("Failed to fetch skills");
      }
    };
    fetchSkills();
  }, []);

  const filteredSkills = skills.filter((skill) => {
    const matchesSearch = skill.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "All" || skill.category === categoryFilter;
    const matchesStatus = statusFilter === "All" || skill.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, skill: Skill) => { setAnchorEl(event.currentTarget); setSelectedSkill(skill); };
  const handleMenuClose = () => setAnchorEl(null);
  const handleAddSkill = (newSkill: Skill) => setSkills((prev) => [...prev, newSkill]);
  const handleWeightChange = (id: number, newWeight: number) => setSkills((prev) => prev.map((skill) => skill.id === id ? { ...skill, weight: newWeight } : skill));
  const handleUpdateSkill = (updatedSkill: Skill) => { setSkills((prev) => prev.map((skill) => skill.id === updatedSkill.id ? updatedSkill : skill)); setOpenEdit(false); };
  const handleToggleStatus = () => { if (!selectedSkill) return; setSkills((prev) => prev.map((skill) => skill.id === selectedSkill.id ? { ...skill, status: skill.status === "Active" ? "Inactive" : "Active" } : skill)); };
  const handleEditSkill = () => setOpenEdit(true);
  const handleDeleteSkill = () => { if (!selectedSkill) return; setSkills((prev) => prev.filter((skill) => skill.id !== selectedSkill.id)); setOpenConfirmDialog(false); };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F8FAFC" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1 }}>
        <Nav />
        <Box sx={{ p: 4 }}>
          <SkillHeader />
          <SkillStats skills={skills} />
          <Box sx={{ mt: 3 }}>
            <SkillToolbar search={search} setSearch={setSearch} categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter} statusFilter={statusFilter} setStatusFilter={setStatusFilter} onAddSkill={() => setOpenAddDialog(true)} />
          </Box>
          <Box sx={{ mt: 3 }}>
            <SkillTable skills={filteredSkills} page={page} rowsPerPage={rowsPerPage} onPageChange={(_, newPage) => setPage(newPage)} onRowsPerPageChange={(event) => { setRowsPerPage(parseInt(event.target.value)); setPage(0); }} onWeightChange={handleWeightChange} onMenuOpen={handleMenuOpen} />
          </Box>
        </Box>
      </Box>
      <SkillActionMenu anchorEl={anchorEl} open={menuOpen} onClose={handleMenuClose} onEdit={handleEditSkill} onToggleStatus={handleToggleStatus} onDelete={() => setOpenConfirmDialog(true)} />
      <ConfirmDialog open={openConfirmDialog} title="Delete Skill" message="Are you sure you want to delete this skill?" confirmText="Delete" onClose={() => setOpenConfirmDialog(false)} onConfirm={handleDeleteSkill} />
      <AddSkillDialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} onAddSkill={handleAddSkill} />
      <EditSkillDialog open={openEdit} skill={selectedSkill} onSave={handleUpdateSkill} onClose={() => setOpenEdit(false)} />
    </Box>
  );
};

export default SkillLibrary;
