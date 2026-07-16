import {Box, 
    Button,

    FormControl,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    TextField,

}from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";

import CardContainer from "../Common/CardContainer";

interface UserToolbarProps {
    // current search text
    search:string,

    //function to update search text
    setSearch:React.Dispatch<React.SetStateAction<string>>,

    careerFilter:string,

    setCareerFilter:React.Dispatch<React.SetStateAction<string>>,

    statusFilter:string,
    setStatusFilter:React.Dispatch<React.SetStateAction<string>>,

    //function to open Add user dialog
    onAddUser:() => void;
}

const UserToolbar=({
    search,
    setSearch,
    careerFilter,
    setCareerFilter,
    statusFilter,
    setStatusFilter,
    onAddUser,
}:UserToolbarProps) => {
    return (
        <CardContainer>
            <Box
                sx={{   
                    display:'flex',
                    justifyContent:'space-between',
                    alignItems:'center',
                    flexWrap:'wrap',
                    gap:2,  
                    mt:2,
                }}
                >
                    <Box sx={{
                        display:'flex',
                        flexWrap:'wrap',
                        gap:2,
                        flex:1,
                        mt:3,
                    }}>
                        <TextField

                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        size="small"
                        sx={{ minWidth: 260 }}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            },
                        }}
                        />  
                        <FormControl
                        size="small"
                        sx={{ minWidth: 220 }}
                        >
                            <InputLabel>Career Goal</InputLabel>    
                            <Select
                            label="Career Goal"
                            value={careerFilter}
                            onChange={(e) => setCareerFilter(e.target.value)}
                            >   
                            <MenuItem value="All">All</MenuItem>
                            <MenuItem value="Software Engineer">Software Engineer</MenuItem>
                            <MenuItem value="Frontend Developer">Frontend Developer</MenuItem>
                            <MenuItem value="Data Scientist">Data Scientist</MenuItem>
                            <MenuItem value="ML Engineer">ML Engineer</MenuItem>
                            <MenuItem value="DevOps Specialist">DevOps Specialist</MenuItem>
                            <MenuItem value="Cloud Engineer">Cloud Engineer</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl
                        size="small"
                        sx={{ minWidth: 220 }}
                        >
                            <InputLabel>Status</InputLabel>    
                            <Select 
                            label="Status"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            >
                            <MenuItem value="All">All</MenuItem>
                            <MenuItem value="Active">Active</MenuItem>
                            <MenuItem value="Inactive">Inactive</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>  
                    <Button
                    variant="contained"
                    startIcon={<PersonAddAlt1Icon />}
                    onClick={onAddUser}
                    sx={{
                        bgcolor: '#0F766E',
                        color: '#FFFFFF',
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 3,
                        py: 1,
                        borderRadius: 2,
                        '&:hover': { bgcolor: '#0D645D' }
                    }}
                    >
                    Add User
                    </Button>
            </Box>
                    
        </CardContainer>
    );
} ;
export default UserToolbar;

