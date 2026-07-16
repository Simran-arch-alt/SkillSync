import { Box, Typography,Button, Paper } from "@mui/material";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Nav/Sidebar";
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import{useNavigate} from 'react-router-dom';
import Nav from "../components/Nav/Nav";




const roleData={

    "Frontend Developer":{
        score:78,
        matchedSkills:[
            "HTML5",
            "CSS",
            "React",
            "JavaScript",
            "Git",
            "Responsive Design"],
            gaps:[
                "Redux Toolkit",
                "TypeScript",
                "Unit Testing",
                "Web Performance Optimization",
            ]


        
    },

    "DevOps Specialist":{
        score:62,
        matchedSkills:[
            "Linux System Basics",
            "Git",
            "Networking Infrastructure",
           "Docker Containers",
           "shell Scripting"],
        gaps:[
            "Kubernetes",
            "CI/CD Pipelines",
            "Cloud Services Architecture",
            "Infrastructure as Code",
        ]
    },
    "Data Scientist":{
        score:85,
        matchedSkills:[
            "Python",
            "Pandas",
            "NumPy",
            "Scikit-learn",
            "TensorFlow"
        ],
        gaps:[
            "Deep Learning",
            "Natural Language Processing",
            "Computer Vision",
        ]
    },
    'Cybersecurity Analyst':{
        score:70,
        matchedSkills:[
            "Network Security",
            "Vulnerability Assessment",
            "Git Core Frameworks"],
        gaps:[
            "Incident Response",
            "Penetration Testing",
            "Security Information and Event Management (SIEM)"
        ]
    },


    "Cloud Engineer":{
        score:69,
        matchedSkills:[
            "Linux System Basics",
            "Git",
            "Networking Infrastructure",
            "Virtualization",

        ],
        gaps:[
            "AWS  cloud Services architecture",
            "Azure Administration",
            "Cloud Security Controls",
            "Infrastructure Automation"
        
        ],
    },
        "ML Engineer":{
            score:75,
            matchedSkills:[
                "Python",
                "Machine Learning Algorithms",
                "Data Preprocessing",
                "SQL Databases"],
                gaps:[
                    'Deep Learning',
                    'Natural Language Processing',
                    'Computer Vision',
                    'model Optimization'
                
                ]




}
}

const AlignmentResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
 
  const from =location.state?.from;
  console.log("from:", from);

  const selectedRole = location.state?.roleTitle ;
  const data= roleData[selectedRole as keyof typeof roleData]

  const handleBack =() =>{
  if (from === "dashboard") {
    navigate("/dashboard");
  } else if (from === "job-roles") {
    navigate("/job-roles");
  }

}


  return (
    <Box sx={{ display: "flex", minHeight: "100vh",bgcolor:"#F8FAFC" }}>
        <Sidebar />
        <Box sx={{flexGrow:1}}>
        <Nav/>

        



        <Box sx={{ flexGrow: 1, px: { xs: 2, md: 3, xl: 4 }, py: { xs: 3, md: 4 } }}>
            
            <Typography variant="h4"
      sx={{ fontWeight: 800, color: '#0F172A'}}
      >
        <Button
  startIcon={<ArrowBackIcon />}
  onClick={() => {handleBack()}}
  sx={{
    mb: 2,
    color: '#119DA4',
    fontWeight: 'bold',
    textTransform: 'none',
    '&:hover': {
      backgroundColor: 'rgba(17, 157, 164, 0.08)',
    },
  }}
>
  
</Button>

        AI Skill Alignment Analysis
      </Typography>
      

      <Typography sx={{ mt: 2,mb:3 }}>
        Comparing your skills against:
        <strong> {selectedRole}</strong>
      </Typography>

        <Paper
  sx={{
    p: { xs: 2, sm: 3, md: 4 },
    mb: 3,
    borderRadius: 4,
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    boxShadow: 3,
  }}
>
  {/* Header Row */}
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 3,
      mb: 5,
    }}
  >
    {/* Role Info */}
    <Box>
      <Typography
        variant="h5"
        
        sx={{ color: "#0F172A",
            fontWeight: "bold",
         }}
      >
        {selectedRole}
      </Typography>

      <Typography
        sx={{
          color: "#64748B",
          mt: 1,
        }}
      >
        {data?.matchedSkills.length} matched · {data?.gaps.length} gaps
        identified
      </Typography>
    </Box>

    {/* Circular Progress */}
    <Box
      sx={{
        position: "relative",
        display: "inline-flex",
      }}
    >
      <CircularProgress
        variant="determinate"
        value={data?.score || 0}
        size={140}
        thickness={5}
        color="success"
      />

      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="h4"
          
          sx={{ color: "#0F172A",
              fontWeight: "bold", 

          }}
        >
          {data?.score}%
        </Typography>

        <Typography
          variant="caption"
          sx={{ color: "#64748B" }}
        >
          Match
        </Typography>
      </Box>
    </Box>
  </Box>

  {/* Qualification Strength */}
  <Box sx={{ mb: 5 }}>
    <Typography
      sx={{
        fontWeight: "bold",
        color: "#64748B",
        mb: 1,
      }}
    >
      Qualification Strength
    </Typography>

    <Box
      sx={{
        width: "100%",
        height: 10,
        bgcolor: "#E5E7EB",
        borderRadius: 10,
      }}
    >
      <Box
        sx={{
          width: `${data?.score || 0}%`,
          height: "100%",
          bgcolor: "#119DA4",
          borderRadius: 10,
        }}
      />
    </Box>
    <Typography
      sx={{
        mt: 1,
        color: "#119DA4",
        fontWeight: "bold",
      }}
    >
      Strong - {data?.score}%
    </Typography>
  </Box>

  {/* Skills Section */}
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: {
        xs: "1fr",
        md: "1fr 1fr",
      },
      gap: 4,
    }}
  >
    {/* Matched Skills */}
    <Box>
      <Typography
        variant="h6"
       
        sx={{
          color: "#0F172A",
           fontWeight:"bold",
          mb: 2,
        }}
      >
         Matched Skills ({data?.matchedSkills.length})
      </Typography>

      {data?.matchedSkills.map((skill) => (
        <Box
          key={skill}
          sx={{
            p: 1.5,
            mb: 1.5,
            borderRadius: 2,
            bgcolor: "#DCFCE7",
            border: "1px solid #86EFAC",
            color: "#166534",
          }}
        >
          {skill}
        </Box>
      ))}
    </Box>

    {/* Skill Gaps */}
    <Box>
      <Typography
        variant="h6"
        
        sx={{
          color: "#0F172A",
          mb: 2,
          fontWeight:"bold",
        }}
      >
         Skill Gaps ({data?.gaps.length})
      </Typography>

      {data?.gaps.map((gap) => (
        <Box
          key={gap}
          sx={{
            p: 1.5,
            mb: 1.5,
            borderRadius: 2,
            bgcolor: "#FEF3C7",
            border: "1px solid #FCD34D",
            color: "#B45309",
          }}
        >
          {gap}
        </Box>
      ))}
    </Box>
  </Box>

  {/* Bottom Button */}
  <Box
    sx={{
      display: "flex",
      justifyContent: "flex-end",
      mt: 5,
    }}
  >
    <Button
      variant="contained"
      onClick ={() => navigate("/learning-roadmap",{
        state:{
            roleTitle: selectedRole,
            from:from,
        },
        })
      }
      sx={{
        borderRadius: 3,
        px: 4,
        py: 1.5,
        background:
          "linear-gradient(135deg,#19647E,#119DA4)",
        textTransform: "none",
        fontWeight: "bold",
      }}
    >
      Generate Learning Roadmap
    </Button>
  </Box>
</Paper>
</Box>
</Box>
</Box>








  );

};

export default AlignmentResults;