import {Box, Typography, Button,Paper, Avatar, Alert, Snackbar,
    
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import Divider from '@mui/material/Divider';
import  CloudUploadOutlinedIcon  from '@mui/icons-material/CloudUploadOutlined';
import {useNavigate} from 'react-router-dom';
import {useState, useRef} from 'react';
import { uploadResume } from '../services/studentService';



const CvUpload =() =>{
    const navigate =useNavigate();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError('File size must be less than 5MB');
                return;
            }
            const ext = file.name.split('.').pop()?.toLowerCase();
            if (!['pdf', 'docx', 'doc'].includes(ext || '')) {
                setError('Only PDF, DOCX, and DOC files are allowed');
                return;
            }
            setSelectedFile(file);
            setError('');
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setError('Please select a file first');
            return;
        }
        setUploading(true);
        setError('');
        try {
            await uploadResume(selectedFile);
            setSuccess(true);
            localStorage.setItem('profileCompleted', 'true');
            setTimeout(() => navigate('/dashboard'), 1500);
        } catch (err: any) {
            setError(err.message || 'Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleDropZoneClick = () => {
        fileInputRef.current?.click();
    };

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
  <input
    type="file"
    accept=".pdf,.docx,.doc"
    ref={fileInputRef}
    style={{ display: 'none' }}
    onChange={handleFileSelect}
  />
  <Box
  onClick={handleDropZoneClick}
  sx={{
    border: "2px dashed #CBD5E1",
    borderRadius: 4,
    p: 8,
    textAlign: "center",
    bgcolor: selectedFile ? "#F0FDF4" : "#FAFAFA",
    cursor: "pointer",
    transition: "0.3s",
    borderColor: selectedFile ? "#22C55E" : undefined,

    "&:hover": {
      borderColor: "#119DA4",
      bgcolor: "#F8FAFC",
    },
  }}
>
    <CloudUploadOutlinedIcon
        sx={{fontSize:80,
            color: selectedFile ? '#22C55E' : '#94A3B8',
        }}/>
  {selectedFile ? (
    <>
      <Typography variant="h6" sx={{ fontWeight: 600, color: '#22C55E', mt: 2 }}>
        {selectedFile.name}
      </Typography>
      <Typography sx={{ mt: 1, color: '#64748B', fontSize: 14 }}>
        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
      </Typography>
    </>
  ) : (
    <>
      <Typography variant="h6" sx={{ fontWeight: 600, color: '#18181B' }}>
        Drag and drop your CV/Resume here, or click to browse files
      </Typography>
      <Typography sx={{ mt: 2, color: '#94A3B8', fontSize: 14 }}>
        Supports PDF, DOCX • Max 5MB
      </Typography>
    </>
  )}
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
    onClick ={handleUpload}
    disabled={uploading}

    sx={{
        bgcolor:'#119DA4',
        color:'#FFFFFF',
        py:1.5,
        borderRadius:2,
        fontWeight:'bold',
        width:'20%',
        mt:2,
        '&.Mui-disabled': { bgcolor: '#94A3B8', color: '#FFFFFF' },
    }}>
        {uploading ? 'Uploading...' : 'Continue'}

    </Button>

    </Box>

    {error && (
        <Typography sx={{ color: '#ef4444', textAlign: 'center', mt: 2 }}>
            {error}
        </Typography>
    )}
    <Snackbar open={success} autoHideDuration={2000} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity="success" sx={{ width: '100%' }}>
            CV uploaded successfully! Redirecting to dashboard...
        </Alert>
    </Snackbar>
            
            </Paper>
            </Box>





        
    )
}
export default CvUpload;