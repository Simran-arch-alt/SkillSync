import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";


import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";


interface UserActionMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  userStatus?: "Active" | "Inactive";
  onSuspend: () => void;
  onDelete: () => void;
}

const UserActionMenu = ({
  anchorEl,
  open,
  onClose,
  userStatus = "Active",
  onSuspend,
  onDelete,
}: UserActionMenuProps) => {
  const isSuspended = userStatus === "Inactive";
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}

      // Position the menu under the action button
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}

      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}

      slotProps={{
        paper: {
          sx: {
            minWidth: 220,
            borderRadius: 3,
            border: "1px solid #E2E8F0",
            boxShadow: 4,
        },
    },
      }}
    >
    
      

      
      <MenuItem
        onClick={() => {
          onSuspend();
          onClose();
        }}
      >
        <ListItemIcon>
          {isSuspended ? (
            <CheckCircleIcon fontSize="small" sx={{ color: "#22C55E" }} />
          ) : (
            <BlockIcon fontSize="small" sx={{ color: "#F59E0B" }} />
          )}
        </ListItemIcon>

        <ListItemText primary={isSuspended ? "Activate Account" : "Suspend Account"} />
      </MenuItem>

      <MenuItem
        onClick={() => {
          onDelete();
          onClose();
        }}
      >
        <ListItemIcon>
          <DeleteIcon
            fontSize="small"
            sx={{ color: "#DC2626" }}
          />
        </ListItemIcon>

        <ListItemText primary="Delete User" />
      </MenuItem>
    </Menu>
  );
};

export default UserActionMenu;