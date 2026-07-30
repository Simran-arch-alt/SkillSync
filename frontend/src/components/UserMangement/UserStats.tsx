import { Box, Typography, CardContent } from "@mui/material";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import DescriptionIcon from "@mui/icons-material/Description";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BlockIcon from "@mui/icons-material/Block";

import CardContainer from "../Common/CardContainer";
import type { User } from "../../data/users";

// ==============================
// Props Interface
// ==============================
interface UserStatsProps {
  users: User[];
}

const UserStats = ({ users }: UserStatsProps) => {
  // ==============================
  // Calculate statistics
  // ==============================

  const totalUsers = users.length;

  const activeUsers = users.filter(
    (user) => user.status === "Active"
  ).length;

  const suspendedUsers = users.filter(
    (user) => user.status === "Inactive"
  ).length;

  const uploadedCV = users.filter(
    (user) => user.cvUploaded
  ).length;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2,1fr)",
          lg: "repeat(4,1fr)",
        },
        gap: 3,
        mb: 3,
      }}
    >
      
      <CardContainer>
        
        <CardContent>
          <PeopleAltIcon
            sx={{
              fontSize: 40,
              color: "#119DA4",
              mb: 1,
              
            }}
          />

          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
            }}
          >
            {totalUsers}
          </Typography>

          <Typography color="text.secondary">
            Total Users
          </Typography>
        </CardContent>
        
      </CardContainer>

      
      <CardContainer>
        <CardContent>
          <CheckCircleIcon
            sx={{
              fontSize: 40,
              color: "#16A34A",
              mb: 1,
            }}
          />

          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
            }}
          >
            {activeUsers}
          </Typography>

          <Typography color="text.secondary">
            Active Users
          </Typography>
        </CardContent>
      </CardContainer>

   
      <CardContainer>
        <CardContent>
          <BlockIcon
            sx={{
              fontSize: 40,
              color: "#DC2626",
              mb: 1,
            }}
          />

          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
            }}
          >
            {suspendedUsers}
          </Typography>

          <Typography color="text.secondary">
            Suspended Users
          </Typography>
        </CardContent>
      </CardContainer>

      <CardContainer>
        <CardContent>
          <DescriptionIcon
            sx={{
              fontSize: 40,
              color: "#F59E0B",
              mb: 1,
            }}
          />

          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
            }}
          >
            {uploadedCV}
          </Typography>

          <Typography color="text.secondary">
            Uploaded CVs
          </Typography>
        </CardContent>
      </CardContainer>
    </Box>
  );
};

export default UserStats;