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
import WorkIcon from "@mui/icons-material/Work";
import DownloadIcon from "@mui/icons-material/Download";

import CardContainer from "../Common/CardContainer";

interface JobRolesToolbarProps {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;

  categoryFilter: string;
  setCategoryFilter: React.Dispatch<React.SetStateAction<string>>;

  statusFilter: string;
  setStatusFilter: React.Dispatch<React.SetStateAction<string>>;

  onAddRole: () => void;
}

const JobRolesToolbar = ({
  search,
  setSearch,
  categoryFilter,
  setCategoryFilter,
  statusFilter,
  setStatusFilter,
  onAddRole,
}: JobRolesToolbarProps) => {
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
        {/* Filters */}

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            flex: 1,
          }}
        >
          <TextField
            placeholder="Search job roles..."
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ minWidth: 260 }}
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

          <FormControl
            size="small"
            sx={{ minWidth: 200 }}
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
              <MenuItem value="Web Development">
                Web Development
              </MenuItem>
              <MenuItem value="AI & ML">
                AI & ML
              </MenuItem>
              <MenuItem value="Cloud Computing">
                Cloud Computing
              </MenuItem>
              <MenuItem value="Cyber Security">
                Cyber Security
              </MenuItem>
              <MenuItem value="Mobile Development">
                Mobile Development
              </MenuItem>
            </Select>
          </FormControl>

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
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Buttons */}

        <Box
          sx={{
            display: "flex",
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            sx={{
              textTransform: "none",
              borderColor: "#0F766E",
              color: "#0F766E",
              fontWeight: 600,
            }}
          >
            Export
          </Button>

          <Button
            variant="contained"
            startIcon={<WorkIcon />}
            onClick={onAddRole}
            sx={{
              bgcolor: "#0F766E",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                bgcolor: "#115E59",
              },
            }}
          >
            Add Job Role
          </Button>
        </Box>
      </Box>
    </CardContainer>
  );
};

export default JobRolesToolbar;