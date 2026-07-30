import {Box, Typography} from "@mui/material";

const Header = () => {
    return (
        <Box
        sx={{
            display:'flex',
            justifyContent:'space-between',
            alignItems:"center",
            mb:4,
            flexWrap:'wrap',
            gap:2,
        }}>
            <Box>
                <Typography variant="h4"
                sx={{
                    fontWeight:700,
                    color:'#0e7075',

                }}>
                    My {" "}
                    <Typography variant="h4" component="span"
                    sx={{
                        fontWeight:700,
                        color:'#0e7075',
                    }}>
                        Skill Profile
                    </Typography>
                </Typography>
                <Typography sx={{
                    color:'#64742B',
                    mt:1,
                }}>
                    Review the skills extracted from your resume and add any missing skills to improve career recommendations.
                </Typography>
            </Box>

           


        </Box>
    );
};
export default Header;