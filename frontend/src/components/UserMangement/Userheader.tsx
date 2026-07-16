import { Box, Typography } from "@mui/material";

const UserHeader = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 4,
        flexWrap: "wrap",
        gap: 2,
      }}
    >
      <Box>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: "#0e7075",
          }}
        >
          User Management
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: "#64748B",
            mt: 1,
          }}
        >
          Manage student accounts, track progress, and maintain platform health.
        </Typography>
      </Box>
    </Box>
  );
};

export default UserHeader;