import {
  Box,
  Chip,
  IconButton,
  Paper,
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
import type { JobRole } from "../../data/jobRoles";



interface JobRolesTableProps {
  roles: JobRole[];

  page: number;

  rowsPerPage: number;

  onPageChange: (
    event: unknown,
    newPage: number
  ) => void;

  onRowsPerPageChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;

  onMenuOpen: (
    event: React.MouseEvent<HTMLButtonElement>,
    role: JobRole
  ) => void;
}

const JobRolesTable = ({
  roles,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onMenuOpen,
}: JobRolesTableProps) => {
  return (
    <CardContainer>
      <TableContainer component={Paper} elevation={0}>
        <Table>

          <TableHead>
            <TableRow>

              <TableCell>
                <strong>Job Role</strong>
              </TableCell>

              <TableCell>
                <strong>Category</strong>
              </TableCell>

              <TableCell>
                <strong>Required Skills</strong>
              </TableCell>

              <TableCell>
                <strong>Students</strong>
              </TableCell>

              <TableCell>
                <strong>Status</strong>
              </TableCell>

              <TableCell align="center">
                <strong>Actions</strong>
              </TableCell>

            </TableRow>
          </TableHead>

          <TableBody>

            {roles
              .slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
              )
              .map((role) => (
                <TableRow
                  hover
                  key={role.id}
                >

                  {/* Job Role */}

                  <TableCell>

                    <Typography fontWeight={600}>
                      {role.name}
                    </Typography>

                  </TableCell>

                  {/* Category */}

                  <TableCell>

                    {role.category}

                  </TableCell>

                  {/* Required Skills */}

                  <TableCell>

                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                      }}
                    >
                      {role.requiredSkills.map((skill) => (
                        <Chip
                          key={skill}
                          label={skill}
                          size="small"
                          sx={{
                            bgcolor: "#E0F2F1",
                            color: "#0F766E",
                          }}
                        />
                      ))}
                    </Box>

                  </TableCell>

                  {/* Students */}

                  <TableCell>

                    {role.students}

                  </TableCell>

                  {/* Status */}

                  <TableCell>

                    <Chip
                      label={role.status}
                      color={
                        role.status === "Active"
                          ? "success"
                          : "error"
                      }
                    />

                  </TableCell>

                  {/* Action */}

                  <TableCell align="center">

                    <IconButton
                      onClick={(event) =>
                        onMenuOpen(event, role)
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
        count={roles.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 20]}
      />
    </CardContainer>
  );
};

export default JobRolesTable;