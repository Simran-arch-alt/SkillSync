import Box from '@mui/material/Box';
import{Typography} from '@mui/material';
import Sidebar from '../components/Nav/Sidebar';
import {List,
   
}from "@mui/material";

import Nav from '../components/Nav/Nav';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';



import {LinearProgress, CircularProgress, Chip, Divider, Button} from "@mui/material";



import {useNavigate} from 'react-router-dom';
import {useState} from 'react';
interface Activity {
    id: number;
    type: 'view' | 'skill' | 'course';
    text: string;
    time: string;
}

const Dashboard=() =>{
    const navigate = useNavigate();
    
    const recommendedRoles = [
        { title: 'Frontend Developer', percent: 78, change: '+5%',color:'#e5981c' },
        { title: 'DevOps Specialist', percent: 72, change: '+3%', color:'#e5981c' },
        { title: 'Data Scientist', percent: 65, change: '+8%', color:'#e5981c' },
    ];

    const skillGaps = [
        { name: 'Kubernetes', level: 'critical' },
        { name: 'Terraform', level: 'critical' },
        { name: 'AWS Lambda', level: 'recommended' },
        { name: 'Prometheus', level: 'recommended' },
        { name: 'GraphQL', level: 'optional' },
        { name: 'TypeScript', level: 'optional' },
    ];

    const [recentActivity] = useState<Activity[]>([
        { id: 1, type: 'view', text: 'Viewed Frontend Developer role', time: '2 hours ago' },
        { id: 2, type: 'skill', text: 'Added JavaScript to profile', time: '5 hours ago' },
        { id: 3, type: 'course', text: 'Completed React course', time: '1 day ago' },
        { id: 4, type: 'view', text: 'Viewed Data Scientist role', time: '1 day ago' },
    ]);
    
    const profilePercent = 35;
    
    const handleViewDetails = (role: { title: string; percent: number; change: string; color: string }) => {
        navigate('/alignment-results', {
            state: {
                roleTitle: role.title,
                from: 'dashboard',
            },
        });
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F8FAFC' }}>
            <Sidebar />
            <Box sx={{ flexGrow: 1 }}>
                <Nav />
                <Box sx={{ p: 4 }}>
                    <Box sx={{ bgcolor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 3, p: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: 3 }}>
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1E3A5F' }}>
                                Welcome back,{' '}
                                <Typography component="span" sx={{ color: '#119DA4', fontWeight: 'bold', fontSize: 'inherit' }}>
                                    krishnaa Khaitu!
                                </Typography>
                            </Typography>
                            <Typography sx={{ mt: 1, color: '#64748B' }}>Let's continue building your career path</Typography>
                        </Box>
                        <Box sx={{ width: 320 }}>
                            <Typography variant="h6" sx={{ color: '#1E3A5F', mb: 0, fontWeight: 'bold' }}>Profile Completion</Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, color: '#64748B' }}>
                                <Typography variant="body2">Progress</Typography>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1E3A5F' }}>{profilePercent}%</Typography>
                            </Box>
                            <LinearProgress variant="determinate" value={profilePercent} sx={{ height: 10, borderRadius: 10, bgcolor: '#E2E8F0', '& .MuiLinearProgress-bar': { backgroundColor: '#19647E', borderRadius: 10 } }} />
                        </Box>
                    </Box>
                </Box>

                <Box sx={{ p: 4, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 3 }}>
                    {recommendedRoles.map((r) => (
                        <Box key={r.title} sx={{ bgcolor: '#FFFFFF', p: 3, borderRadius: 2, border: '1px solid #E2E8F0', boxShadow: 3, transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 } }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#0F172A' }}>{r.title}</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                                    <CircularProgress variant="determinate" value={r.percent} size={90} thickness={5} sx={{ color: r.color, bgcolor: 'transparent' }} />
                                    <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#0F172A' }}>{r.percent}%</Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <Typography sx={{ color: '#718096', fontWeight: 600 }}>{r.change}</Typography>
                                    <Button variant="outlined" onClick={() => handleViewDetails(r)} sx={{ mt: 2, color: '#119DA4', borderColor: '#119DA4', transition: 'all 0.3s ease', '&:hover': { borderColor: '#119DA4', bgcolor: 'rgba(17, 157, 164, 0.1)', transform: 'translateY(-3px)', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' } }}>
                                        View Details
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    ))}
                </Box>

                <Box sx={{ p: 4, display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 3 }}>
                    <Box sx={{ bgcolor: '#FFFFFF', p: 3, borderRadius: 2, minHeight: 180, border: '1px solid #E2E8F0', boxShadow: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#0F172A' }}>Skill Gap Summary</Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {skillGaps.map((s) => {
                                const color = s.level === 'critical' ? '#ef4444' : s.level === 'recommended' ? '#119DA4' : '#ffc857';
                                return <Chip key={s.name} label={s.name} sx={{ bgcolor: 'transparent', border: `1px solid ${color}`, color: '#0F172A', mr: 1, mb: 1 }} />;
                            })}
                        </Box>
                        <Divider sx={{ my: 2, bgcolor: '#E2E8F0' }} />
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <Box sx={{ width: 12, height: 12, bgcolor: '#ef4444', borderRadius: 2 }} />
                            <Typography sx={{ color: '#64748B' }}>Critical</Typography>
                            <Box sx={{ width: 12, height: 12, bgcolor: '#119DA4', borderRadius: 2, ml: 2 }} />
                            <Typography sx={{ color: '#64748B' }}>Recommended</Typography>
                            <Box sx={{ width: 12, height: 12, bgcolor: '#ffc857', borderRadius: 2, ml: 2 }} />
                            <Typography sx={{ color: '#64748B' }}>Optional</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ bgcolor: '#FFFFFF', p: 3, borderRadius: 2, border: '1px solid #E2E8F0', boxShadow: 3, minHeight: 180 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#0F172A' }}>Recent Activity</Typography>
                        <List>
                            {recentActivity.map((a, idx) => (
                                <Box key={idx}>
                                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', py: 1 }}>
                                        <Box sx={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(15, 118, 110, 0.08)', borderRadius: 2 }}>
                                            {a.type === 'view' && <RemoveRedEyeIcon sx={{ color: '#4B3F72' }} />}
                                            {a.type === 'skill' && <TrendingUpIcon sx={{ color: '#119DA4' }} />}
                                            {a.type === 'course' && <CheckCircleIcon sx={{ color: '#ffc857' }} />}
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography sx={{ color: '#0F172A' }}>{a.text}</Typography>
                                            <Typography sx={{ color: '#64748B', fontSize: 12 }}>{a.time}</Typography>
                                        </Box>
                                    </Box>
                                    {idx < recentActivity.length - 1 && <Divider sx={{ bgcolor: '#E2E8F0' }} />}
                                </Box>
                            ))}
                        </List>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Dashboard;
