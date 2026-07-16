import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import type { JobRole } from "../../data/jobRoles";

interface JobRoleActionMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  selectedRole: JobRole | null;

  onClose: () => void;
onEdit: (role: JobRole) => void;
 onDelete: (role: JobRole) => void;
}

const JobRoleActionMenu = ({
  anchorEl,
  open,
  selectedRole,
  onClose,
 
  onEdit,
 
  onDelete,
}: JobRoleActionMenuProps) => {
  if (!selectedRole) return null;

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
    >
      

      <MenuItem
        onClick={() => {
          onEdit(selectedRole);
          onClose();
        }}
      >
        <ListItemIcon>
          <EditIcon fontSize="small" />
        </ListItemIcon>

        <ListItemText>
          Edit
        </ListItemText>
      </MenuItem>

     

      <MenuItem
        onClick={() => {
          onDelete(selectedRole);
          onClose();
        }}
        sx={{ color: "error.main" }}
      >
        <ListItemIcon>
          <DeleteIcon color="error" fontSize="small" />
        </ListItemIcon>

        <ListItemText>
          Delete
        </ListItemText>
      </MenuItem>
    </Menu>
  );
};

export default JobRoleActionMenu;