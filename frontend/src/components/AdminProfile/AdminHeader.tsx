import { Box, Typography } from "@mui/material";

const AdminProfileHeader = () => {
  return (
    <Box
      sx={{
        mb: 4, // Adds space below the header
      }}
    >
      {/* Page Title */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          color: "#0e7075",
          mb: 1,
        }}
      >
        Admin Profile
      </Typography>

      {/* Short Description */}
      <Typography
        variant="body1"
        sx={{
          color: "#64748B",
          maxWidth: 700,
        }}
      >
        View and manage your administrator account information, update personal
        details, and maintain account security settings.
      </Typography>
    </Box>
  );
};

export default AdminProfileHeader;