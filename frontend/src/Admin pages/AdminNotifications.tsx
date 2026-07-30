import { useState, useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";

import Sidebar from "../components/UserMangement/sidebar";
import Nav from "../components/Nav/Nav";

import NotificationHeader from "../components/AdminNotification/NotificationHeader";
import NotificationCard from "../components/AdminNotification/NotificationCard";

import request from "../services/api";

interface Notification {
  _id: string;
  title: string;
  description: string;
  type: "user" | "skill" | "report" | "system";
  read: boolean;
  createdAt: string;
}

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await request<{ notifications: Notification[]; unreadCount: number }>("/notifications");
      setNotifications(res.notifications);
    } catch {
      console.error("Failed to fetch notifications");
    }
    setLoading(false);
  };

  const handleMarkAllRead = async () => {
    try {
      await request("/notifications/read-all", { method: "PUT" });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {
      console.error("Failed to mark all as read");
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F8FAFC" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1 }}>
        <Nav />
        <Box sx={{ p: 4 }}>
          <NotificationHeader onMarkAllRead={handleMarkAllRead} />
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}><CircularProgress /></Box>
          ) : notifications.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 8, color: "#64748B" }}>
              No notifications yet.
            </Box>
          ) : (
            notifications.map((n) => (
              <NotificationCard
                key={n._id}
                title={n.title}
                description={n.description}
                time={new Date(n.createdAt).toLocaleDateString()}
                type={n.type}
                unread={!n.read}
              />
            ))
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminNotifications;
