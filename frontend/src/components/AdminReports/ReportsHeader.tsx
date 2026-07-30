import { Box, Typography } from "@mui/material";

const ReportsHeader = () => {
  return (
    <Box
      sx={{
        mb: 4,
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          color: "#0e7075",
          mb: 1,
        }}
      >
        Reports & Analytics
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: "#64748B",
          maxWidth: "700px",
          lineHeight: 1.7,
        }}
      >
        Monitor platform performance, analyze user engagement, evaluate skill
        trends, and generate detailed reports to support data-driven decisions.
      </Typography>
    </Box>
  );
};

export default ReportsHeader;