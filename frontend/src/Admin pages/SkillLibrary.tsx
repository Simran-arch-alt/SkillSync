import { useState } from "react";
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

import { initialSkills } from "../data/skills";
import type { Skill } from "../data/skills";

const SkillLibrary = () => {

  const [openEdit, setOpenEdit] = useState(false);

  const [skills, setSkills] = useState<Skill[]>(initialSkills);

  const [search, setSearch] = useState("");

  const [categoryFilter, setCategoryFilter] = useState("All");

  const [statusFilter, setStatusFilter] = useState("All");

  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [selectedSkill, setSelectedSkill] =
    useState<Skill | null>(null);

  const [anchorEl, setAnchorEl] =
    useState<null | HTMLElement>(null);

  const [openAddDialog, setOpenAddDialog] =
    useState(false);

  const [openConfirmDialog, setOpenConfirmDialog] =
    useState(false);

  const menuOpen = Boolean(anchorEl);

  
  const filteredSkills = skills.filter((skill) => {

    const matchesSearch =
      skill.name
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "All" ||
      skill.category === categoryFilter;

    const matchesStatus =
      statusFilter === "All" ||
      skill.status === statusFilter;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesStatus
    );

  });

  // Menu
  

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
    skill: Skill
  ) => {

    setAnchorEl(event.currentTarget);

    setSelectedSkill(skill);

  };

  const handleMenuClose = () => {

    setAnchorEl(null);

  };

 
  // Add Skill
  

  const handleAddSkill = (
    newSkill: Skill
  ) => {

    setSkills((prev) => [
      ...prev,
      newSkill,
    ]);

  };


  // Update Weight
  

  const handleWeightChange = (
    id: number,
    newWeight: number
  ) => {

    setSkills((prev) =>
      prev.map((skill) =>
        skill.id === id
          ? {
              ...skill,
              weight: newWeight,
            }
          : skill
      )
    );

  };

  const handleUpdateSkill = (updatedSkill: Skill) => {
    setSkills((prev) =>
      prev.map((skill) =>
        skill.id === updatedSkill.id
          ? updatedSkill
          : skill
      )
    );
    setOpenEdit(false);
  };


 
  // Enable / Disable
  

  const handleToggleStatus = () => {

    if (!selectedSkill) return;

    setSkills((prev) =>
      prev.map((skill) =>
        skill.id === selectedSkill.id
          ? {
              ...skill,
              status:
                skill.status === "Active"
                  ? "Inactive"
                  : "Active",
            }
          : skill
      )
    );

  };

  const handleEditSkill = () => {
    setOpenEdit(true);
  };

  const handleDeleteSkill = () => {

    if (!selectedSkill) return;

    setSkills((prev) =>
      prev.filter(
        (skill) =>
          skill.id !== selectedSkill.id
      )
    );

    setOpenConfirmDialog(false);

  };

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

        <Nav />

        <Box sx={{ p: 4 }}>

          <SkillHeader />

          <SkillStats
            skills={skills}
          />

          <Box sx={{ mt: 3 }}>

            <SkillToolbar
              search={search}
              setSearch={setSearch}

              categoryFilter={categoryFilter}
              setCategoryFilter={
                setCategoryFilter
              }

              statusFilter={statusFilter}
              setStatusFilter={
                setStatusFilter
              }

              onAddSkill={() =>
                setOpenAddDialog(true)
              }
            />

          </Box>

          <Box sx={{ mt: 3 }}>

            <SkillTable
              skills={filteredSkills}

              page={page}

              rowsPerPage={rowsPerPage}

              onPageChange={(_, newPage) =>
                setPage(newPage)
              }

              onRowsPerPageChange={(event) => {

                setRowsPerPage(
                  parseInt(
                    event.target.value
                  )
                );

                setPage(0);

              }}

              onWeightChange={
                handleWeightChange
              }

              onMenuOpen={
                handleMenuOpen
              }
            />

          </Box>

        </Box>

      </Box>

      {/* Action Menu */}

      <SkillActionMenu
        anchorEl={anchorEl}

        open={menuOpen}

        onClose={handleMenuClose}

        onEdit={handleEditSkill}

        onToggleStatus={
          handleToggleStatus
        }

        onDelete={() => {

          setOpenConfirmDialog(true);

        }}
      />

      {/* Delete Dialog */}

      <ConfirmDialog
        open={openConfirmDialog}

        title="Delete Skill"

        message="Are you sure you want to delete this skill?"

        confirmText="Delete"

        onClose={() =>
          setOpenConfirmDialog(false)
        }

        onConfirm={
          handleDeleteSkill
        }
      />

      {/* Add Skill */}

      <AddSkillDialog
        open={openAddDialog}

        onClose={() =>
          setOpenAddDialog(false)
        }

        onAddSkill={
          handleAddSkill
        }
      />

      {/* Edit Skill */}
      <EditSkillDialog
        open={openEdit}
        skill={selectedSkill}
        onSave={handleUpdateSkill}
        onClose={() =>
          setOpenEdit(false)
        }
      />

    </Box>

  );

};

export default SkillLibrary;