import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  
  Typography,
} from "@mui/material";
import  {Stack} from "@mui/material";

import BadgeIcon from "@mui/icons-material/Badge";
import EmailIcon from "@mui/icons-material/Email";
import BusinessIcon from "@mui/icons-material/Business";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

import CardContainer from "../Common/CardContainer";

const AdminProfileCard = () => {
  return (
    <CardContainer>
      {/* Main Layout */}
      <Box sx={{
        display:"flex",
        flexDirection:"row",
        gap:2,
        
        alignItems:"center"}}
        >
        {/* Left Side - Avatar */}
        <Box sx={{ textAlign: "center" }}>
          <Avatar
            sx={{
              width: 120,
              height: 120,
              bgcolor: "#119DA4",
              fontSize: 42,
              fontWeight: "bold",
              mx: "auto",
            }}
          >
            A
          </Avatar>

          <Button
            variant="outlined"
            startIcon={<PhotoCameraIcon />}
            sx={{
              mt: 2,
              textTransform: "none",
              borderRadius: 2,
            }}
          >
            Change Photo
          </Button>
        </Box>

        {/* Right Side */}
        <Box sx={{ flex: 1 }}>
          {/* Name */}
          <Typography
          sx={{
            variant:"h5",
            fontWeight:"bold",
            color:"#0F172A"}}
          >
            System Administrator
          </Typography>

          {/* Email */}
          <Typography
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            admin@skillsync.com
          </Typography>

          <Divider sx={{ my: 3 }} />

          {/* Information */}
          <Stack spacing={2}>
            <Box sx={{ display: "flex", flexDirection: "row", spacing: 2, alignItems: "center" ,gap:1}}>
              <BadgeIcon color="primary" />

              <Typography>
                <strong>Role:</strong> </Typography>
                <Typography>
                Administrator
              </Typography>

              <Chip
                label="Active"
                color="success"
                size="small"
            
              />
            </Box>

            <Box sx={{ display: "flex", flexDirection: "row", spacing: 2, alignItems: "center",gap:1 }}>
              <BusinessIcon color="primary" />

              <Typography>
                <strong>Department:</strong>
                </Typography>
                <Typography>
                IT Administration
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "row", spacing: 2, alignItems: "center",gap:1 }}>
              <EmailIcon color="primary" />

              <Typography>
                <strong>Email:</strong>
                </Typography>
                <Typography>
                admin@skillsync.com
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "row", spacing: 2, alignItems: "center",gap:1 }}>
              <AccessTimeIcon color="primary" />

              <Typography>
                <strong>Last Login:</strong></Typography>
                <Typography>
                 Today • 9:45 AM
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Box>
    </CardContainer>
  );
};

export default AdminProfileCard;