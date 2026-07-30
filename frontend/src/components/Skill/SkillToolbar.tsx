import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

import CardContainer from "../Common/CardContainer";

interface SkillToolbarProps {
  // Search text
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;

  // Category Filter
  categoryFilter: string;
  setCategoryFilter: React.Dispatch<React.SetStateAction<string>>;

  // Status Filter
  statusFilter: string;
  setStatusFilter: React.Dispatch<React.SetStateAction<string>>;

  // Open Add Skill Dialog
  onAddSkill: () => void;
}

const SkillToolbar = ({
  search,
  setSearch,
  categoryFilter,
  setCategoryFilter,
  statusFilter,
  setStatusFilter,
  onAddSkill,
}: SkillToolbarProps) => {
  return (
    <CardContainer>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        {/* Left Side */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            flex: 1,
          }}
        >
          {/* ================= Search ================= */}

          <TextField
            placeholder="Search Skills..."
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ minWidth: 250 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* ================= Category Filter ================= */}

          <FormControl
            size="small"
            sx={{ minWidth: 220 }}
          >
            <InputLabel>Category</InputLabel>

            <Select
              label="Category"
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(e.target.value)
              }
            >
              <MenuItem value="All">All</MenuItem>

              <MenuItem value="Frontend">
                Frontend
              </MenuItem>

              <MenuItem value="Backend">
                Backend
              </MenuItem>

              <MenuItem value="DevOps">
                DevOps
              </MenuItem>

              <MenuItem value="Data Science">
                Data Science
              </MenuItem>

              <MenuItem value="Database">
                Database
              </MenuItem>

              <MenuItem value="Cloud">
                Cloud
              </MenuItem>
            </Select>
          </FormControl>

          {/* ================= Status Filter ================= */}

          <FormControl
            size="small"
            sx={{ minWidth: 180 }}
          >
            <InputLabel>Status</InputLabel>

            <Select
              label="Status"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
            >
              <MenuItem value="All">All</MenuItem>

              <MenuItem value="Active">
                Active
              </MenuItem>

              <MenuItem value="Inactive">
                Inactive
              </MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* ================= Add Skill Button ================= */}

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddSkill}
          sx={{
            bgcolor: "#119DA4",
            textTransform: "none",
            px: 3,
            py: 1,
            borderRadius: 2,
            fontWeight: "bold",

            "&:hover": {
              bgcolor: "#0F766E",
            },
          }}
        >
          Add Skill
        </Button>
      </Box>
    </CardContainer>
  );
};

export default SkillToolbar;