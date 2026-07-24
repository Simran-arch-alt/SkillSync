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
import {useState, useEffect} from 'react';
import { getSkills } from '../services/studentService';
import { getTopRecommendedJobs, getTopSkills } from '../services/dashboardService';
import type { TopRecommendation } from '../services/dashboardService';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import { useAuth } from '../contexts/AuthContext';

interface Activity {
    id: number;
    type: 'view' | 'skill' | 'course';
    text: string;
    time: string;
}

interface SkillGap {
    name: string;
    level: 'critical' | 'recommended' | 'optional';
}

const Dashboard=() =>{
    const navigate = useNavigate();
    const { user } = useAuth();
    const [userSkills, setUserSkills] = useState<string[]>([]);
    const [recommendedRoles, setRecommendedRoles] = useState<TopRecommendation[]>([]);
    const [loadingRoles, setLoadingRoles] = useState(true);
    const [skillGaps, setSkillGaps] = useState<SkillGap[]>([]);
    const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
    const [profilePercent, setProfilePercent] = useState(0);

    const userName = user?.name || 'User';

    useEffect(() => {
        const fetchData = async () => {
            let completed = 0;
            let total = 6;
            if (user?.name) completed++;
            if (user?.email) completed++;
            if (user?.university) completed++;
            if (user?.degree) completed++;

            try {
                const { skills } = await getSkills();
                if (Array.isArray(skills) && skills.length > 0) {
                    completed++;
                    setUserSkills(skills);
                }
                setProfilePercent(Math.round((completed / total) * 100));
            } catch {
                setProfilePercent(Math.round((completed / total) * 100));
            }

            const activities: Activity[] = [];
            let actId = 1;
            if (user?.name) {
                activities.push({ id: actId++, type: 'skill' as const, text: `Profile created for ${user.name}`, time: 'Account created' });
            }
            if (user?.university) {
                activities.push({ id: actId++, type: 'view' as const, text: `University: ${user.university}`, time: 'Profile detail' });
            }
            if (user?.degree) {
                activities.push({ id: actId++, type: 'course' as const, text: `Degree: ${user.degree}`, time: 'Profile detail' });
            }
            setRecentActivity(activities);

            try {
                const roles = await getTopRecommendedJobs();
                setRecommendedRoles(roles.filter(r => r.score > 0));
            } catch {
                setRecommendedRoles([]);
            } finally {
                setLoadingRoles(false);
            }

            try {
                const topSkills = await getTopSkills(10);
                const userSkillsArr = await getSkills().catch(() => ({ skills: [] as string[] }));
                const userSkillSet = new Set((Array.isArray(userSkillsArr.skills) ? userSkillsArr.skills : []).map((s: string) => s.toLowerCase()));
                const gaps: SkillGap[] = topSkills
                    .filter(s => !userSkillSet.has(s.skill.toLowerCase()))
                    .slice(0, 6)
                    .map((s, i) => ({
                        name: s.skill,
                        level: i < 2 ? 'critical' : i < 4 ? 'recommended' : 'optional' as 'critical' | 'recommended' | 'optional',
                    }));
                setSkillGaps(gaps);
            } catch {
                setSkillGaps([]);
            }
        };
        fetchData();
    }, [user]);
    
    const handleViewDetails = (role: TopRecommendation) => {
        navigate('/alignment-results', {
            state: {
                roleTitle: role.job,
                jobId: role.jobId,
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
                                    {userName}!
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

                {loadingRoles ? (
                    <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress />
                    </Box>
                ) : recommendedRoles.length > 0 ? (
                    <Box sx={{ p: 4, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 3 }}>
                        {recommendedRoles.map((r) => {
                            const scoreColor = r.score >= 70 ? '#19647E' : r.score >= 40 ? '#e5981c' : '#ef4444';
                            return (
                                <Box key={r.jobId} sx={{ bgcolor: '#FFFFFF', p: 3, borderRadius: 2, border: '1px solid #E2E8F0', boxShadow: 3, transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 } }}>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#0F172A' }}>{r.job}</Typography>
                                    <Typography sx={{ color: '#64748B', fontSize: 14 }}>{r.company}{r.location ? ` - ${r.location}` : ''}</Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                                        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                                            <CircularProgress variant="determinate" value={r.score} size={90} thickness={5} sx={{ color: scoreColor, bgcolor: 'transparent' }} />
                                            <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#0F172A' }}>{r.score}%</Typography>
                                            </Box>
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography sx={{ color: '#718096', fontWeight: 600, fontSize: 13 }}>
                                                {r.matchedSkills.length} skills match
                                            </Typography>
                                            <Button variant="outlined" onClick={() => handleViewDetails(r)} sx={{ mt: 2, color: '#119DA4', borderColor: '#119DA4', transition: 'all 0.3s ease', '&:hover': { borderColor: '#119DA4', bgcolor: 'rgba(17, 157, 164, 0.1)', transform: 'translateY(-3px)', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' } }}>
                                                View Details
                                            </Button>
                                        </Box>
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>
                ) : (
                    <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                            <CloudUploadOutlinedIcon sx={{ fontSize: 80, color: '#94A3B8' }} />
                            <Typography variant="h6" sx={{ color: '#64748B', mt: 2 }}>
                                Upload your CV to get personalized career recommendations
                            </Typography>
                            <Button variant="contained" onClick={() => navigate('/cv-upload')} sx={{ mt: 3, bgcolor: '#119DA4', '&:hover': { bgcolor: '#0e8a91' } }}>
                                Upload CV
                            </Button>
                        </Box>
                    </Box>
                )}

                <Box sx={{ p: 4, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 3 }}>
                    <Box sx={{ bgcolor: '#FFFFFF', p: 3, borderRadius: 2, minHeight: 180, border: '1px solid #E2E8F0', boxShadow: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#0F172A' }}>Your Skills</Typography>
                        {userSkills.length > 0 ? (
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                {userSkills.map((skill) => (
                                    <Chip key={skill} label={skill} sx={{ bgcolor: '#DFF7F6', color: '#0F766E', fontWeight: 500, border: '1px solid #119DA4' }} />
                                ))}
                            </Box>
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 3 }}>
                                <Typography sx={{ color: '#94A3B8' }}>No skills yet. Upload your CV to extract skills.</Typography>
                                <Button variant="outlined" onClick={() => navigate('/cv-upload')} sx={{ mt: 2, color: '#119DA4', borderColor: '#119DA4', '&:hover': { borderColor: '#0e8a91', bgcolor: 'rgba(17,157,164,0.05)' } }}>
                                    Upload CV
                                </Button>
                            </Box>
                        )}
                    </Box>
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
