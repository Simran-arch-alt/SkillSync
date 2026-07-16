import {Box, Typography, TextField, Button,Paper,
    
} from '@mui/material';
import{useNavigate} from 'react-router-dom';

const CvScanner =() =>{
    const navigate =useNavigate();
    return (
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
                boxShadow:3,

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
      1
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
      width: '100vh',
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
        border: "2px solid #CBD5E1",
        color: "#64748B",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "0 auto",
      }}
    >
      2
    </Box>

    <Typography
      sx={{
        color: "#18181B",
        mt: 1,

      }}
    >
      Upload CV
    </Typography>
  </Box>
  </Box>

  <Typography  sx={{
    color:'#0F172A',
    fontWeight:'normal',
    mb:2,
    mt:2,
  }}>
  IT/Specialization/Stream
  </Typography>

  <TextField 
  placeholder="e.g. Software Engineering, Data Science, Cybersecurity..."
  fullWidth
  variant="outlined"
  sx={{
    width :'90%',
    bgcolor:'#F8FAFC',
    borderRadius:2,
    height:60,
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },



    boxShadow:3

  }}>
  
  </TextField>
  <Typography sx={{
    color:'#0F172A',
    fontWeight:'normal',
    mb:2,
    mt:2,

  }}>
    Current Status /Qualification

  </Typography>
  <TextField 
  placeholder="e.g. Final year, Graduate, Postgraduate ..."
  fullWidth
  variant="outlined"
  sx={{
    width :'90%',
    bgcolor:'#F8FAFC',
    borderRadius:2,
    height:60,
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
    boxShadow:3
  }}>


  </TextField>
  <Box sx={{
    display:'flex',
    justifyContent:'space-between',
    mt:3,
  }}>

  <Button type="Back"
  onClick ={()=> navigate('/login')}
  fullWidth variant="contained"
  sx={{
    bgcolor:'#FFFFFF',
    py:1.5,
    borderRadius:2,
    fontWeight:'bold',
    width:'20%',
    mt:2,
    display:'flex',
    color:"#119DA4",
    border:'2px solid #119DA4',


  }}>Back
    </Button>

    <Button type="Next"
    onClick ={()=> navigate('/cv-upload')}
    fullWidth variant="contained"
    sx={{
        bgcolor:'#119DA4',
        py:1.5,
        borderRadius:2,
        fontWeight:'bold',
        width:'20%',
        mt:2,
        display:'flex',
    }}>
        Next
    </Button>
    </Box>

  





            </Paper>

            








        </Box>
    )
}
export default CvScanner;