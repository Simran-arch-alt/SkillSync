import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
} from "@mui/material";

import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PsychologyIcon from "@mui/icons-material/Psychology";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SettingsIcon from "@mui/icons-material/Settings";

interface NotificationCardProps {
  title: string;
  description: string;
  time: string;
  type: "user" | "skill" | "report" | "system";
  unread?: boolean;
}

const NotificationCard = ({
  title,
  description,
  time,
  type,
  unread = false,
}: NotificationCardProps) => {
  const getIcon = () => {
    switch (type) {
      case "user":
        return <PersonAddIcon sx={{ color: "#3B82F6" }} />;

      case "skill":
        return <PsychologyIcon sx={{ color: "#10B981" }} />;

      case "report":
        return <AssessmentIcon sx={{ color: "#8B5CF6" }} />;

      case "system":
        return <SettingsIcon sx={{ color: "#F59E0B" }} />;

      default:
        return <NotificationsIcon sx={{ color: "#119DA4" }} />;
    }
  };

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid #E2E8F0",
        mb: 2,
        transition: "0.25s",

        "&:hover": {
          borderColor: "#119DA4",
          transform: "translateY(-2px)",
          boxShadow: "0 8px 20px rgba(17,157,164,0.12)",
        },
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box sx={{ display: "flex", gap: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                bgcolor: "#F8FAFC",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {getIcon()}
            </Box>

            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: "#1E293B",
                }}
              >
                {title}
              </Typography>

              <Typography
                sx={{
                  color: "#64748B",
                  mt: 0.5,
                }}
              >
                {description}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  color: "#94A3B8",
                }}
              >
                {time}
              </Typography>
            </Box>
          </Box>

          {unread && (
            <Chip
              label="Unread"
              size="small"
              sx={{
                bgcolor: "#DCFCE7",
                color: "#15803D",
                fontWeight: 600,
              }}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default NotificationCard;