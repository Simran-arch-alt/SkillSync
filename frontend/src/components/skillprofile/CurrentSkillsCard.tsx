import {
  Box,
  Chip,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CardContainer from "../Common/CardContainer";

export interface Skill {
  id: number;
  name: string;
  source: "Resume" | "Added";
}

interface CurrentSkillsCardProps {
  skills: Skill[];
  onDeleteSkill: (id: number) => void;
}

const CurrentSkillsCard = ({
  skills,
  onDeleteSkill,
}: CurrentSkillsCardProps) => {
  return (
    <CardContainer>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography
          variant="h6"
          sx={{
          fontWeight:700,
          color:"#0F172A"}}
        >
          Current Skills
        </Typography>

       
        <Chip
          label={`${skills.length} Skills`}
          sx={{
            bgcolor: "#D1FAE5",
            color: "#047857",
            fontWeight: 600,
          }}
        />
      </Box>

      {/* Skills */}
      <Stack spacing={1}>
        {skills.map((skill) => (
          <Box
            key={skill.id}
            sx={{
            display:"flex",
            justifyContent:"space-between",
            alignItems:"center",
              p: 1.2,
              borderRadius: 2,
              transition: ".2s",
              "&:hover": {
                bgcolor: "#F8FAFC",
              },
            }}
          >
            <Box sx={{
              display:"flex",
              alignItems:"center",
              gap:2
            }}
            >
              <Chip
                label={skill.source}
                size="small"
                sx={{
                  width: 75,
                  fontWeight: 600,

                  bgcolor:
                    skill.source === "Resume"
                      ? "#DFF7F6"
                      : "#FFF4E5",

                  color:
                    skill.source === "Resume"
                      ? "#0F766E"
                      : "#B45309",
                }}
              />

              <Typography sx={{
                fontWeight:500,
                color:"#0F172A",
              }}
                
              >
                {skill.name}
              </Typography>
            </Box>

            <IconButton
              size="small"
              onClick={() => onDeleteSkill(skill.id)}
            >
              <CloseRoundedIcon
                sx={{
                  color: "#94A3B8",
                  "&:hover": {
                    color: "#EF4444",
                  },
                }}
              />
            </IconButton>
          </Box>
        ))}
      </Stack>

      <Divider sx={{ my: 3 }} />

      {/* Legend */}
      <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        <Box>
          <Chip
            label="Resume"
            size="small"
            sx={{
              bgcolor: "#DFF7F6",
              color: "#0F766E",
              fontWeight: 600,
            }}
          />

          <Typography
            variant="caption"
            sx={{
            color:"text.secondary",
            display:"block",
            mt:1
        }}
          >
            Extracted from Resume
          </Typography>
        </Box>

        <Box>
          <Chip
            label="Added"
            size="small"
            sx={{
              bgcolor: "#FFF4E5",
              color: "#B45309",
              fontWeight: 600,
            }}
          />

          <Typography
            variant="caption"
            sx={{
            color:"text.secondary",
            display:"block",
            mt:1
            }}
          >
            Manually Added
          </Typography>
        </Box>
      </Box>
    </CardContainer>
  );
};

export default CurrentSkillsCard;