import {
  Avatar,
  Box,
  Divider,
  Typography,
} from "@mui/material";

import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import PsychologyIcon from "@mui/icons-material/Psychology";
import EditIcon from "@mui/icons-material/Edit";

import CardContainer from "../Common/CardContainer";

// Mock recent activities
const activities = [
  {
    id: 1,
    title: "New student registered",
    description: "Krijan Sharma created an account.",
    time: "5 mins ago",
    icon: <PersonAddAlt1Icon />,
    color: "#3B82F6",
  },
  {
    id: 2,
    title: "CV Uploaded",
    description: "Hari Smith uploaded her CV.",
    time: "20 mins ago",
    icon: <UploadFileIcon />,
    color: "#16A34A",
  },
  {
    id: 3,
    title: "New Skill Added",
    description: "Docker was added to the Skill Library.",
    time: "1 hour ago",
    icon: <PsychologyIcon />,
    color: "#F59E0B",
  },
  {
    id: 4,
    title: "Profile Updated",
    description: "Alex updated personal information.",
    time: "3 hours ago",
    icon: <EditIcon />,
    color: "#119DA4",
  },
];

const RecentActivity = () => {
  return (
    <CardContainer>
      {/* Card Title */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          color: "#0F172A",
          mb: 3,
        }}
      >
        Recent Activity
      </Typography>

      {/* Activity List */}
      {activities.map((activity, index) => (
        <Box key={activity.id}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              py: 2,
            }}
          >
            {/* Activity Icon */}
            <Avatar
              sx={{
                bgcolor: activity.color,
                width: 44,
                height: 44,
              }}
            >
              {activity.icon}
            </Avatar>

            {/* Activity Details */}
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                sx={{
                  fontWeight: 600,
                }}
              >
                {activity.title}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                {activity.description}
              </Typography>
            </Box>

            {/* Time */}
            <Typography
              variant="caption"
              color="text.secondary"
            >
              {activity.time}
            </Typography>
          </Box>

          {/* Divider except after last item */}
          {index !== activities.length - 1 && (
            <Divider />
          )}
        </Box>
      ))}
    </CardContainer>
  );
};

export default RecentActivity;