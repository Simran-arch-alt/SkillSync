import {
  Box,
  Chip,
  IconButton,
  Paper,
  Slider,
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

import type { Skill } from "../../data/skills";

interface SkillTableProps {
  // Skills after filtering
  skills: Skill[];

  // Pagination
  page: number;
  rowsPerPage: number;

  onPageChange: (
    event: unknown,
    newPage: number
  ) => void;

  onRowsPerPageChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;

  // Update Skill Weight
  onWeightChange: (
    id: string,
    newWeight: number
  ) => void;

  // Open Action Menu
  onMenuOpen: (
    event: React.MouseEvent<HTMLButtonElement>,
    skill: Skill
  ) => void;
}

const SkillTable = ({
  skills,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onWeightChange,
  onMenuOpen,
}: SkillTableProps) => {
  return (
    <CardContainer>
      <TableContainer
        component={Paper}
        elevation={0}
      >
        <Table>

          
          <TableHead>

            <TableRow>

              <TableCell>
                <strong>Skill</strong>
              </TableCell>

              <TableCell>
                <strong>Category</strong>
              </TableCell>

              <TableCell width={260}>
                <strong>Importance Weight</strong>
              </TableCell>

              <TableCell>
                <strong>Assigned Users</strong>
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

            {skills
              .slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
              )
              .map((skill) => (

                <TableRow
                  hover
                  key={skill.id}
                >

                  {/* Skill Name */}

                  <TableCell>

                    <Typography
                      sx={{
                        fontWeight: 600,
                      }}
                    >
                      {skill.name}
                    </Typography>

                  </TableCell>

                  {/* Category */}

                  <TableCell>

                    <Chip
                      label={skill.category}
                      color="primary"
                      variant="outlined"
                    />

                  </TableCell>

                  {/* Weight Slider */}

                  <TableCell>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >

                      <Slider
                        value={skill.weight}
                        min={0}
                        max={1}
                        step={0.05}
                        valueLabelDisplay="auto"

                        onChange={(_, value) =>
                          onWeightChange(
                            skill.id,
                            value as number
                          )
                        }

                        sx={{
                          width: 150,
                        }}
                      />

                      <Typography>

                        {skill.weight.toFixed(2)}

                      </Typography>

                    </Box>

                  </TableCell>

                  {/* Assigned Users */}

                  <TableCell>

                    {skill.assignedUsers}

                  </TableCell>

                  {/* Status */}

                  <TableCell>

                    <Chip
                      label={skill.status}
                      color={
                        skill.status === "Active"
                          ? "success"
                          : "error"
                      }
                    />

                  </TableCell>

                  {/* Action Button */}

                  <TableCell align="center">

                    <IconButton
                      onClick={(event) =>
                        onMenuOpen(event, skill)
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

        count={skills.length}

        page={page}

        rowsPerPage={rowsPerPage}

        onPageChange={onPageChange}

        onRowsPerPageChange={onRowsPerPageChange}

        rowsPerPageOptions={[5, 10, 20]}
      />
    </CardContainer>
  );
};

export default SkillTable;