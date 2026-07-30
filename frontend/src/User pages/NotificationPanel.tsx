import React, { useEffect, useState } from "react";
import {
  Menu,
  Box,
  Typography,
  Divider,
  Button,
  CircularProgress,
} from "@mui/material";
import request from "../services/api";

interface Notification {
  _id: string;
  title: string;
  description: string;
  type: "user" | "skill" | "report" | "system";
  read: boolean;
  createdAt: string;
}

interface NotificationPanelProps {
  anchorEl: null | HTMLElement;
  open: boolean;
  onClose: () => void;
}

const typeColors: Record<string, string> = {
  user: "#3B82F6",
  skill: "#A855F7",
  report: "#22C55E",
  system: "#F59E0B",
};

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({
  anchorEl,
  open,
  onClose,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setLoading(true);
      request<{ notifications: Notification[]; unreadCount: number }>(
        "/students/notifications"
      )
        .then((res) => setNotifications(res.notifications.slice(0, 10)))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [open]);

  const handleMarkAllRead = async () => {
    try {
      await request("/students/notifications/read-all", { method: "PUT" });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {}
  };

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
      <Box
        sx={{
          p: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Notifications
        </Typography>
        <Typography
          sx={{
            color: "#94A3B8",
            cursor: "pointer",
            fontWeight: 500,
            "&:hover": { color: "#4F46E5" },
          }}
          onClick={handleMarkAllRead}
        >
          Mark all as read
        </Typography>
      </Box>

      <Divider />

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress size={24} />
        </Box>
      ) : notifications.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 6, color: "#94A3B8" }}>
          No notifications yet.
        </Box>
      ) : (
        notifications.map((item, index) => (
          <Box key={item._id}>
            <Box sx={{ p: 3, display: "flex", gap: 2 }}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  bgcolor: typeColors[item.type] || "#94A3B8",
                  mt: 1,
                  flexShrink: 0,
                  opacity: item.read ? 0.4 : 1,
                }}
              />
              <Box>
                <Typography
                  sx={{
                    fontSize: "1.05rem",
                    color: "#0F172A",
                    fontWeight: item.read ? 400 : 600,
                  }}
                >
                  {item.title}
                </Typography>
                <Typography sx={{ fontSize: "0.9rem", color: "#475569", mt: 0.5 }}>
                  {item.description}
                </Typography>
                <Typography sx={{ color: "#94A3B8", mt: 1, fontSize: "0.8rem" }}>
                  {timeAgo(item.createdAt)}
                </Typography>
              </Box>
            </Box>
            {index !== notifications.length - 1 && <Divider />}
          </Box>
        ))
      )}

      <Divider />

      <Box sx={{ p: 2, textAlign: "center" }}>
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
