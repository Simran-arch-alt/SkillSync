import {
  Avatar,
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import CardContainer from "../Common/CardContainer";



const recentUsers = [
  {
    id: 1,
    name: "Krijan Sharma",
    email: "krijan@example.com",
    careerGoal: "Frontend Developer",
    status: "Active",
  },
  {
    id: 2,
    name: "Hari Smith",
    email: "hari@example.com",
    careerGoal: "Data Scientist",
    status: "Active",
  },
  {
    id: 3,
    name: "Alex Brown",
    email: "alex@example.com",
    careerGoal: "ML Engineer",
    status: "Inactive",
  },
  {
    id: 4,
    name: "Eva shrestha",
    email: "eva@example.com",
    careerGoal: "DevOps Engineer",
    status: "Active",
  },
];

const RecentUsers = () => {
  return (
    <CardContainer>

      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          mb: 3,
          color: "#0F172A",
        }}
      >
        Recently Registered Users
      </Typography>

      <TableContainer>

        <Table size="small">

          <TableHead>

            <TableRow>

              <TableCell>
                <strong>User</strong>
              </TableCell>

              <TableCell>
                <strong>Career Goal</strong>
              </TableCell>

              <TableCell>
                <strong>Status</strong>
              </TableCell>

            </TableRow>

          </TableHead>

          <TableBody>

            {recentUsers.map((user) => (

              <TableRow key={user.id} hover>

                <TableCell>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >

                    <Avatar
                      sx={{
                        bgcolor: "#119DA4",
                      }}
                    >
                      {user.name.charAt(0)}
                    </Avatar>

                    <Box>

                      <Typography sx={{
                        fontWeight: 600
                      }}>
                        {user.name}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {user.email}
                      </Typography>

                    </Box>

                  </Box>

                </TableCell>

                <TableCell>

                  {user.careerGoal}

                </TableCell>

                <TableCell>

                  <Chip
                    label={user.status}
                    color={
                      user.status === "Active"
                        ? "success"
                        : "error"
                    }
                    size="small"
                  />

                </TableCell>

              </TableRow>

            ))}

          </TableBody>

        </Table>

      </TableContainer>

    </CardContainer>
  );
};

export default RecentUsers;