import {
  Avatar,
  Box,
  Chip,
  IconButton,
  LinearProgress,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";

import MoreVertIcon from "@mui/icons-material/MoreVert";

import CardContainer from "../Common/CardContainer";

import type { User} from "../../data/users";





interface UserTableProps {
  users: User[];

  page: number;

  rowsPerPage: number;

  onPageChange: (
    event: unknown,
    newPage: number
  ) => void;

  onRowsPerPageChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;

 

  onMenueOpen:(
    event: React.MouseEvent<HTMLButtonElement>,
    user: User
  ) => void;
  
}

const UserTable = ({
  users,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onMenueOpen,
}: UserTableProps) => {
  return (
    <CardContainer>
      

      <TableContainer component={Paper} elevation={0}>
        <Table>

          

          <TableHead>
            <TableRow>

              <TableCell>
                <strong>User</strong>
              </TableCell>

              <TableCell>
                <strong>Email</strong>
              </TableCell>

              <TableCell>
                <strong>Career Goal</strong>
              </TableCell>

              <TableCell>
                <strong>Qualification</strong>
              </TableCell>

              <TableCell>
                <strong>Progress</strong>
              </TableCell>
              <TableCell>
                <strong>CV Status</strong>
              </TableCell>



              <TableCell>
                <strong>Status</strong>
              </TableCell>

              <TableCell>
                <strong>Last Login</strong>
              </TableCell>

              <TableCell align="center">
                <strong>Actions</strong>
              </TableCell>

            </TableRow>
          </TableHead>


          <TableBody>

           

            {users
              .slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
              )
              .map((user) => (
                <TableRow
                  hover
                  key={user.id}
                >
                 

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
                        bgcolor: "#0F766E",
                        color: "#FFFFFF",
                        fontWeight: "bold",

                      }}>
                        {user.name.charAt(0).toUpperCase()}
                      </Avatar>

      
                        <Typography
                        sx={{
                          fontWeight:"bold"}}
                        >
                          {user.name}
                        </Typography>
                        </Box>
                        </TableCell>

                  <TableCell>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          {user.email}
                        </Typography>
                      

                  

                  </TableCell>

                  {/* Career Goal */}

                  <TableCell>

                    {user.careerGoal}

                  </TableCell>


                  <TableCell>
                    {user.qualifications}
                  </TableCell>


                  {/* Progress */}

                  <TableCell>

                    <Box sx={{ width: 180 }}>

                      <LinearProgress
                        variant="determinate"
                        value={user.completion}
                        sx={{
                          height: 8,
                          borderRadius: 10,
                        }}
                      />

                      <Typography
                        variant="body2"
                        sx={{ mt: 1 }}
                      >
                        {user.completion}%
                      </Typography>

                    </Box>

                  </TableCell>
                  <TableCell>

    <Chip
        label={user.cvUploaded ? "Uploaded" : "Not Uploaded"}
        color={user.cvUploaded ? "success" : "default"}
        size="small"
    />

</TableCell>



                  {/* Status */}

                  <TableCell>

                    <Chip
                      label={user.status}

                      color={
                        user.status === "Active"
                          ? "success"
                          : "error"
                      }
                    />

                  </TableCell>


                  <TableCell>
                    {user.lastLogin}
                  </TableCell>

                  {/* Action Button */}

                  <TableCell align="center">

                    <IconButton
                      onClick={(event) =>
                        onMenueOpen(event, user)
                      }
                    >
                      <MoreVertIcon />
                    </IconButton>

                  </TableCell>

                </TableRow>
              ))}

          </TableBody>

        </Table>
      </TableContainer>

      
      <TablePagination
        component="div"

        count={users.length}

        page={page}

        rowsPerPage={rowsPerPage}

        onPageChange={onPageChange}

        onRowsPerPageChange={onRowsPerPageChange}

        rowsPerPageOptions={[5, 10, 20]}
      />

    </CardContainer>
  );
};

export default UserTable;