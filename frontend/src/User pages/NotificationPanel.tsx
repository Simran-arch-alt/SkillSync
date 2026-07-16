import React from "react";
import {
  Menu,
  Box,
  Typography,
  Divider,
  Button,
} from "@mui/material";

interface NotificationPanelProps {
  anchorEl: null | HTMLElement;
  open: boolean;
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({
  anchorEl,
  open,
  onClose,
}) => {
  const notifications = [
    {
      color: "#22C55E",
      message:
        "Your alignment score for Frontend Developer increased by 5%!",
      time: "2 mins ago",
    },
    {
      color: "#A855F7",
      message:
        "Python was successfully added to your profile stack.",
      time: "1 hour ago",
    },
    {
      color: "#3B82F6",
      message:
        "New learning path module available for Kubernetes.",
      time: "5 hours ago",
    },
  ];

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 420,
          borderRadius: 4,
          mt: 1,
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
          }}
        >
          Notifications
        </Typography>

        <Typography
          sx={{
            color: "#94A3B8",
            cursor: "pointer",
            fontWeight: 500,
          }}
        >
          Mark all as read
        </Typography>
      </Box>

      <Divider />

      {/* Notifications */}
      {notifications.map((item, index) => (
        <Box key={index}>
          <Box
            sx={{
              p: 3,
              display: "flex",
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                bgcolor: item.color,
                mt: 1,
                flexShrink: 0,
              }}
            />

            <Box>
              <Typography
                sx={{
                  fontSize: "1.05rem",
                  color: "#0F172A",
                }}
              >
                {item.message}
              </Typography>

              <Typography
                sx={{
                  color: "#94A3B8",
                  mt: 1,
                }}
              >
                {item.time}
              </Typography>
            </Box>
          </Box>

          {index !== notifications.length - 1 && (
            <Divider />
          )}
        </Box>
      ))}

      <Divider />

      {/* Footer */}
      <Box
        sx={{
          p: 2,
          textAlign: "center",
        }}
      >
        <Button
          sx={{
            textTransform: "none",
            fontSize: "1rem",
            color: "#4F46E5",
            fontWeight: 500,
          }}
        >
          View All Notifications
        </Button>
      </Box>
    </Menu>
  );
};

export default NotificationPanel;