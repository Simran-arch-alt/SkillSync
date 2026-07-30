import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";


interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmText: string;

  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmDialog = ({
  open,
  title,
  message,
  confirmText,
  onClose,
  onConfirm,
}: ConfirmDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper:{
        sx: {
          borderRadius: 3,
          width: 420,
        },
      },
    }}
    >
      {/* Dialog Heading */}
      <DialogTitle
        sx={{
          fontWeight: "bold",
          color: "#0F172A",
        }}
      >
        {title}
      </DialogTitle>

      {/* Dialog Message */}
      <DialogContent>
        <DialogContentText
          sx={{
            color: "#64748B",
            lineHeight: 1.8,
          }}
        >
          {message}
        </DialogContentText>
      </DialogContent>

      {/* Buttons */}
      <DialogActions sx={{ px: 3, pb: 3 }}>
        {/* Cancel Button */}
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            borderColor: "#CBD5E1",
            color: "#475569",
            textTransform: "none",
            borderRadius: 2,
          }}
        >
          Cancel
        </Button>

        {/* Confirm Button */}
        <Button
          variant="contained"
          onClick={onConfirm}
          sx={{
            bgcolor: "#DC2626",
            textTransform: "none",
            borderRadius: 2,

            "&:hover": {
              bgcolor: "#B91C1C",
            },
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;