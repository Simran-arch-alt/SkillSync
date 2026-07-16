import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Nav/Sidebar';
import Nav from '../components/Nav/Nav';

const roadmapData = {
  "Frontend Developer": [
    {
      title: "Learn TypeScript",
      duration: "2 Weeks",
      description: "Understand static typing and interfaces.",
    },
    {
      title: "Redux Toolkit",
      duration: "1 Week",
      description: "Learn state management for React.",
    },
    {
      title: "Unit Testing",
      duration: "2 Weeks",
      description: "Write tests using Jest and React Testing Library.",
    },
    {
      title: "Performance Optimization",
      duration: "1 Week",
      description: "Improve rendering and loading speed.",
    },
  ],

  "Data Scientist": [
    {
      title: "Deep Learning",
      duration: "3 Weeks",
      description: "Learn neural networks and TensorFlow.",
    },
    {
      title: "Computer Vision",
      duration: "2 Weeks",
      description: "Image classification and object detection.",
    },
    {
      title: "NLP",
      duration: "2 Weeks",
      description: "Text analysis and language models.",
    },
  ],

  "DevOps Specialist": [
    {
      title: "Kubernetes",
      duration: "2 Weeks",
      description: "Learn container orchestration.",
    },
    {
      title: "CI/CD Pipelines",
      duration: "2 Weeks",
      description: "Automate build and deployment processes.",
    },
    {
      title: "Infrastructure as Code",
      duration: "2 Weeks",
      description: "Learn Terraform and automation tools.",
    },
  ],

  "Cybersecurity Analyst": [
    {
      title: "Incident Response",
      duration: "2 Weeks",
      description: "Handle and investigate security incidents.",
    },
    {
      title: "Penetration Testing",
      duration: "3 Weeks",
      description: "Learn ethical hacking techniques.",
    },
    {
      title: "SIEM Tools",
      duration: "2 Weeks",
      description: "Monitor security events effectively.",
    },
  ],

  "Cloud Engineer": [
    {
      title: "AWS Fundamentals",
      duration: "2 Weeks",
      description: "Learn AWS core services.",
    },
    {
      title: "Azure Administration",
      duration: "2 Weeks",
      description: "Manage Azure resources.",
    },
    {
      title: "Infrastructure Automation",
      duration: "3 Weeks",
      description: "Automate cloud deployments.",
    },
  ],

  "ML Engineer": [
    {
      title: "Deep Learning",
      duration: "3 Weeks",
      description: "Build neural network models.",
    },
    {
      title: "Computer Vision",
      duration: "2 Weeks",
      description: "Work with image datasets.",
    },
    {
      title: "Model Optimization",
      duration: "2 Weeks",
      description: "Improve model accuracy and performance.",
    },
  ],
};

const LearningRoadmap: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedRole =
    location.state?.roleTitle || 'Selected Role';

  const roleRoadmap =
    roadmapData[selectedRole as keyof typeof roadmapData] || [];

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: '#F8FAFC',
      }}
    >

      <Sidebar />
      <Box
        sx={{
          flexGrow: 1,
        }}
      >
        <Nav />

      <Box
        sx={{
          flexGrow: 1,
          p: 4,
        }}
      >
        {/* Back Button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/alignment-results',{
            state: {
                roleTitle: selectedRole,
            },
          })}
          sx={{
            mb: 3,
            color: '#119DA4',
            fontWeight: 'bold',
            textTransform: 'none',
          }}
        >
          Back to Alignment Results
        </Button>

        {/* Header */}
        <Paper
          sx={{
            p: 4,
            borderRadius: 4,
            mb: 4,
            border: '1px solid #E2E8F0',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: '#0F172A',
              fontWeight: 'bold',
            }}
          >
            Learning Roadmap
          </Typography>

          <Typography
            sx={{
              mt: 1,
              color: '#64748B',
            }}
          >
            Personalized roadmap for{' '}
            <strong>{selectedRole}</strong>
          </Typography>
        </Paper>

        {/* Roadmap Cards */}
        {roleRoadmap.length > 0 ? (
          roleRoadmap.map((step, index) => (
            <Paper
              key={step.title}
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 3,
                borderLeft: '6px solid #119DA4',
                boxShadow: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: '#119DA4',
                  fontWeight: 'bold',
                }}
              >
                Phase {index + 1}
              </Typography>

              <Typography
                sx={{
                  mt: 1,
                  fontWeight: 'bold',
                  color: '#0F172A',
                }}
              >
                {step.title}
              </Typography>

              <Typography
                sx={{
                  color: '#64748B',
                  mt: 1,
                }}
              >
                {step.description}
              </Typography>

              <Typography
                sx={{
                  mt: 2,
                  color: '#119DA4',
                  fontWeight: 'bold',
                }}
              >
                Duration: {step.duration}
              </Typography>
            </Paper>
          ))
        ) : (
          <Paper
            sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: 3,
            }}
          >
            <Typography>
              No roadmap available for this role.
            </Typography>
          </Paper>
        )}
      </Box>
    </Box>
    </Box>
  );
};

export default LearningRoadmap;