import { Box, Avatar, IconButton, Typography } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
interface AvatarSectionProps {
  name: string;
  image?: string;
}

const AvatarSection = ({ name, image }: AvatarSectionProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 3,
        mt: 4,
        mb: 4,
      }}
    >
      <Box sx={{ position: "relative" }}>
        <Avatar
          src={image}
          sx={{
            width: 80,
            height: 80,
            bgcolor: "#22C7A9",
            fontWeight: 700,
            fontSize: 34,
          }}
        >
          {!image && name.charAt(0).toUpperCase()}
        </Avatar>

        <IconButton
          sx={{
            position: "absolute",
            bottom: 0,
            right: -5,
            bgcolor: "#10B981",
            color: "#fff",
            width: 28,
            height: 28,
            "&:hover": {
              bgcolor: "#059669",
            },
          }}
        >
          <CameraAltIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box>
        <Typography sx={{ fontWeight: 700 }}>
          {name}
        </Typography>

        <Typography
          sx={{
            color: "#10B981",
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          Change Image
        </Typography>
      </Box>
    </Box>
  );
};

export default AvatarSection;