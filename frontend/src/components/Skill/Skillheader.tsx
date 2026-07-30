 import {Box,Typography} from "@mui/material";
 const SkillHeader = () => {
  return (
    
 <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 4,
        flexWrap: "wrap",
        gap: 2,
      }}
    >
       
       
        
      <Box>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: "#0e7075",
          }}
        >
        Skill Library
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: "#64748B",
            mt: 1,
          }}
        >
          Browse and manage available skills for students.
        </Typography>
      </Box>
    </Box>
   
  );
};

export default SkillHeader;
