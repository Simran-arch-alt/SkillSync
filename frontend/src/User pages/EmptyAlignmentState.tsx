import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import { useNavigate } from "react-router-dom";

const EmptyAlignmentState: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "75vh",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          maxWidth: 650,
          width: "100%",
          p: 6,
          borderRadius: 4,
          textAlign: "center",
        }}
      >
        <AssessmentOutlinedIcon
          sx={{
            fontSize: 80,
            color: "#119DA4",
            mb: 2,
          }}
        />

        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "#1E3A5F",
            mb: 2,
          }}
        >
          No Alignment Analysis Yet
        </Typography>

        <Typography
          sx={{
            color: "#64748B",
            fontSize: "1rem",
            lineHeight: 1.8,
            mb: 4,
          }}
        >
          You haven't analyzed a target job role yet.
          <br />
          Select a job role first to compare your current skills with
          industry requirements and generate your personalized
          alignment report.
        </Typography>

        <Button
          variant="contained"
          onClick={() => navigate("/job-roles")}
          sx={{
            bgcolor: "#119DA4",
            px: 4,
            py: 1.3,
            borderRadius: 3,
            textTransform: "none",
            fontSize: "1rem",
            "&:hover": {
              bgcolor: "#0E8389",
            },
          }}
        >
          Explore Job Roles
        </Button>
      </Paper>
    </Box>
  );
};

export default EmptyAlignmentState;