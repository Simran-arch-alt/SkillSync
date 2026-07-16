import { Box, Typography, Button } from "@mui/material";
import DoneAllIcon from "@mui/icons-material/DoneAll";

const NotificationHeader = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: {
          xs: "flex-start",
          sm: "center",
        },
        flexDirection: {
          xs: "column",
          sm: "row",
        },
        gap: 2,
        mb: 4,
      }}
    >
      {/* Left Side */}
      <Box>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "#0e7075",
            mb: 0.5,
          }}
        >
          Notifications
        </Typography>

        <Typography
          sx={{
            color: "#64748B",
            fontSize: "0.95rem",
          }}
        >
          Stay updated with important system activities and administrator alerts.
        </Typography>
      </Box>

      {/* Right Side */}
      <Button
        variant="contained"
        startIcon={<DoneAllIcon />}
        sx={{
          bgcolor: "#119DA4",
          color: "#FFFFFF",
          textTransform: "none",
          fontWeight: 600,
          px: 3,
          py: 1.2,
          borderRadius: 2,
          boxShadow: "none",
          "&:hover": {
            bgcolor: "#0F8B92",
            boxShadow: "0 4px 12px rgba(17,157,164,0.25)",
          },
        }}
      >
        Mark All as Read
      </Button>
    </Box>
  );
};

export default NotificationHeader;