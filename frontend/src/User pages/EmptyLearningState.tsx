import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import { useNavigate } from "react-router-dom";

const EmptyLearningState: React.FC = () => {
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
          No Learning Roadmap Yet
        </Typography>

        <Typography
          sx={{
            color: "#64748B",
            fontSize: "1rem",
            lineHeight: 1.8,
            mb: 4,
          }}
        >
         Complete an alignment analysis and generate your roadmap to receive personalized learning recommendations.
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

export default EmptyLearningState;