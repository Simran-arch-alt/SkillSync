import {Box, Typography, Button,Paper, Avatar,
    
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import Divider from '@mui/material/Divider';
import  CloudUploadOutlinedIcon  from '@mui/icons-material/CloudUploadOutlined';
import {useNavigate} from 'react-router-dom';



const CvUpload =() =>{
    const navigate =useNavigate();
    return(
       <Box sx={{
            minHeight:'100vh',
            bgcolor:'#F8FAFC',
            display:'flex',
            justifyContent:'center',
            alignItems:'center'
        }}>
            <Paper elevation ={0}
            sx={{
                width :"80%",
                maxWidth:900,
                bgcolor:'#FFFFFF',
                borderRadius:5,
                p:6,

            }}>
                <Typography variant="h4" 
            sx=
            {{color:"#1E293B",
            fontWeight :'bold',
            textAlign:'center'}}>
                Initialize your SkillSync Profile
            </Typography>
            
            <Typography sx ={{
                color:'#0F172A',
                textAlign :'center',
                mt:2,
                lineHeight:1.8
            }}>
                Complete your academic profile and upload your latest Cv to unlock personalized dashboard insights,skill tracking, and career recommendations.
            </Typography>
    
            {/*step1 */}


            <Box
  sx={{
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    mt: 6,
    mb: 6,
    gap: 4,
  }}
>

  {/* Step 1 */}
  <Box sx={{ textAlign: "center" }}>
    <Box
      sx={{
        width: 45,
        height: 45,
        borderRadius: "50%",
        bgcolor: "#119DA4",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontWeight: "bold",
        margin: "0 auto",
      }}
    >
        <Avatar sx={{
            width:40,
            height:40,
            bgcolor:'#19647E',
        }}>
            <CheckIcon/>

        </Avatar>
    
    </Box>

    <Typography
      sx={{
        color: "#18181B",
        mt: 1,
        fontWeight: "bold",
      }}
    >
      Academic Info
    </Typography>
  </Box>

  {/* Line */}
  <Box
    sx={{
      width: 100,
      height: 2,
      bgcolor: "#19647E",
      mt: 3,
    }}
  />

  {/* Step 2 */}
  <Box sx={{ textAlign: "center" }}>
    <Box
      sx={{
        width: 45,
        height: 45,
        borderRadius: "50%",
        bgcolor:'#119DA4',
    
        color: "#FFFFFF",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "0 auto",
        fontWeight:'bold',
        boxShadow:'0 0 0 2px rgba(17, 157, 164, 0.7)',
      }}
    >
        
      2
    </Box>

    <Typography
      sx={{
        color: "#18181B",
        mt: 1,
        fontWeight:'bold',

      }}
    >
      Upload CV
    </Typography>
  </Box>
  </Box>
  <Box
  sx={{
    border: "2px dashed #CBD5E1",
    borderRadius: 4,
    p: 8,
    textAlign: "center",
    bgcolor: "#FAFAFA",
    cursor: "pointer",
    transition: "0.3s",

    "&:hover": {
      borderColor: "#119DA4",
      bgcolor: "#F8FAFC",
    },
  }}
>
    <CloudUploadOutlinedIcon
        sx={{fontSize:80,
            color:'#94A3B8',
        }}/>
  <Typography
    sx={{
      fontSize: 60,
      mb: 2,
    }}
  >
    
  </Typography>

  <Typography
    variant="h6"
    sx={{
      fontWeight: 600,
      color: "#18181B",
    }}
  >
    Drag  and drop your CV/Resume here, or click to browse files
  </Typography>


  <Typography
    sx={{
      mt: 2,
      color: "#94A3B8",
      fontSize: 14,
    }}
  >
    Supports PDF, DOCX • Max 5MB
  </Typography>
</Box>

<Box sx={{
    bgcolor:'#F8FAFC',
    justifyContent:'center',
    alignItems:'center',
    mt:2,
    borderRadius:4,
    height:50,
    

}}>
    <Typography variant ="h6"
    sx={{
        color:'#1E293B',
        fontSize:12,
        textAlign:'center',

    }}>
        <RadioButtonUncheckedIcon sx={{color:'#119DA4', fullvariant:'filled',
            fontSize:12,
        }}/>
        Your Cv is processed locally. SkillSync's AI parser extracts role titles, tehcnlogies and project
        experiences to automatically map your qualification coverage against target role requirements.
        </Typography>
       
</Box>
<Divider
  sx={{
    my: 4,
    borderColor: "#E2E8F0",
  }}
/>
<Box sx={{
    display:'flex',
    alignItems:'center',
    justifyContent:'space-between',
    mt:4,

}}>
    <Button variant="contained"
    onClick ={() => navigate('/cv-scanner')}
    sx={{
        bgcolor:'#FFFFFF',
        color:'#119DA4',
        py:1.5,
        borderRadius:2,
        fontWeight:'bold',
        width:'20%',
        mt:2,
        border:'2px solid #119DA4',
        



    }}>
        Back

    </Button>


    <Button variant="contained"
    onClick ={() =>{
      localStorage.setItem('profileCompleted', 'true');
navigate('/dashboard')}
    }
       

    sx={{
        bgcolor:'#119DA4',
        color:'#FFFFFF',
        py:1.5,
        borderRadius:2,
        fontWeight:'bold',
        width:'20%',
        mt:2,

        



    }}>
        Continue

    </Button>

    </Box>



            
            </Paper>
            </Box>




        
    )
}
export default CvUpload;