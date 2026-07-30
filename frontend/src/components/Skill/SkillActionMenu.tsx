import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import BlockIcon from "@mui/icons-material/Block";
import DeleteIcon from "@mui/icons-material/Delete";

interface SkillActionMenuProps {
  // Position of the menu
  anchorEl: HTMLElement | null;

  // Whether the menu is open
  open: boolean;

  // Close the menu
  onClose: () => void;

  // Edit selected skill
  onEdit: () => void;

  // Enable/Disable selected skill
  onToggleStatus: () => void;

  // Delete selected skill
  onDelete: () => void;
}

const SkillActionMenu = ({
  anchorEl,
  open,
  onClose,
  onEdit,
  onToggleStatus,
  onDelete,
}: SkillActionMenuProps) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
    >
      {/* Edit Skill */}

      <MenuItem
        onClick={() => {
          onEdit();
          onClose();
        }}
      >
        <ListItemIcon>
          <EditIcon fontSize="small" />
        </ListItemIcon>

        <ListItemText>
          Edit Skill
        </ListItemText>
      </MenuItem>

      {/* Enable / Disable */}

      <MenuItem
        onClick={() => {
          onToggleStatus();
          onClose();
        }}
      >
        <ListItemIcon>
          <BlockIcon fontSize="small" />
        </ListItemIcon>

        <ListItemText>
          Enable / Disable
        </ListItemText>
      </MenuItem>

      {/* Delete Skill */}

      <MenuItem
        onClick={() => {
          onDelete();
          onClose();
        }}
      >
        <ListItemIcon>
          <DeleteIcon
            fontSize="small"
            color="error"
          />
        </ListItemIcon>

        <ListItemText
          sx={{
            color: "error.main",
          }}
        >
          Delete Skill
        </ListItemText>
      </MenuItem>
    </Menu>
  );
};

export default SkillActionMenu;