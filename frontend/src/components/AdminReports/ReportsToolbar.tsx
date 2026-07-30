import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TableChartIcon from "@mui/icons-material/TableChart";

import CardContainer from "../Common/CardContainer";

interface ReportsToolbarProps {
  dateRange: string;
  setDateRange: React.Dispatch<React.SetStateAction<string>>;

  reportType: string;
  setReportType: React.Dispatch<React.SetStateAction<string>>;
}

const ReportsToolbar = ({
  dateRange,
  setDateRange,
  reportType,
  setReportType,
}: ReportsToolbarProps) => {
  return (
    <CardContainer>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        {/* Filters */}

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <FormControl
            size="small"
            sx={{ minWidth: 180 }}
          >
            <InputLabel>Date Range</InputLabel>

            <Select
              label="Date Range"
              value={dateRange}
              onChange={(e) =>
                setDateRange(e.target.value)
              }
            >
              <MenuItem value="7 Days">Last 7 Days</MenuItem>
              <MenuItem value="30 Days">Last 30 Days</MenuItem>
              <MenuItem value="90 Days">Last 90 Days</MenuItem>
              <MenuItem value="1 Year">Last 1 Year</MenuItem>
            </Select>
          </FormControl>

          <FormControl
            size="small"
            sx={{ minWidth: 200 }}
          >
            <InputLabel>Report Type</InputLabel>

            <Select
              label="Report Type"
              value={reportType}
              onChange={(e) =>
                setReportType(e.target.value)
              }
            >
              <MenuItem value="All Reports">
                All Reports
              </MenuItem>

              <MenuItem value="User Report">
                User Report
              </MenuItem>

              <MenuItem value="Skill Report">
                Skill Report
              </MenuItem>

              <MenuItem value="Career Report">
                Career Report
              </MenuItem>

              <MenuItem value="CV Report">
                CV Report
              </MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Export Buttons */}

        <Box
          sx={{
            display: "flex",
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            startIcon={<PictureAsPdfIcon />}
            sx={{
              textTransform: "none",
              borderColor: "#DC2626",
              color: "#DC2626",
              fontWeight: 600,
            }}
          >
            Export PDF
          </Button>

          <Button
            variant="contained"
            startIcon={<TableChartIcon />}
            sx={{
              bgcolor: "#0F766E",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                bgcolor: "#115E59",
              },
            }}
          >
            Export Excel
          </Button>
        </Box>
      </Box>
    </CardContainer>
  );
};

export default ReportsToolbar;