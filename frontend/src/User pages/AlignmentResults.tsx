import { Box, Typography, Button, Paper, CircularProgress } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Nav/Sidebar";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Nav from "../components/Nav/Nav";
import { useState, useEffect } from "react";
import { getSkills } from "../services/studentService";

interface AlignmentData {
  score: number;
  matchedSkills: string[];
  gaps: string[];
}

const AlignmentResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [alignmentData, setAlignmentData] = useState<AlignmentData | null>(null);
  const [loading, setLoading] = useState(true);

  const from = location.state?.from;
  const selectedRole = location.state?.roleTitle;

  useEffect(() => {
    const fetchAlignment = async () => {
      try {
        const userSkills = await getSkills();
        const skillsArray = Array.isArray(userSkills) ? userSkills : [];

        let roleName = selectedRole;

        if (!roleName && skillsArray.length > 0) {
          const recRes = await fetch('/api/recommendations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ skills: skillsArray }),
          });
          const recJson = await recRes.json();
          if (recJson.success && recJson.data?.recommendations?.length > 0) {
            roleName = recJson.data.recommendations[0].job;
            setAlignmentData({
              score: Math.round(recJson.data.recommendations[0].score),
              matchedSkills: recJson.data.recommendations[0].matchedSkills || [],
              gaps: recJson.data.recommendations[0].missingSkills || [],
            });
            setLoading(false);
            return;
          }
        }

        if (!roleName) {
          setLoading(false);
          return;
        }

        const res = await fetch('/api/jobs?limit=200');
        const json = await res.json();
        if (json.success && json.data?.jobs) {
          const matchingJob = json.data.jobs.find((j: any) => j.job_title === roleName);
          if (matchingJob && matchingJob.skills) {
            const jobSkills = matchingJob.skills.map((s: string) => s.toLowerCase());
            const userSkillsLower = skillsArray.map((s: string) => s.toLowerCase());
            const matched = jobSkills.filter((s: string) => userSkillsLower.includes(s));
            const gaps = jobSkills.filter((s: string) => !userSkillsLower.includes(s));
            const score = jobSkills.length > 0 ? Math.round((matched.length / jobSkills.length) * 100) : 0;
            setAlignmentData({
              score,
              matchedSkills: matched.map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)),
              gaps: gaps.map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)),
            });
            setLoading(false);
            return;
          }
        }

        const recRes = await fetch('/api/recommendations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ skills: skillsArray }),
        });
        const recJson = await recRes.json();
        if (recJson.success && recJson.data?.recommendations) {
          const match = recJson.data.recommendations.find((r: any) => r.job === roleName);
          if (match) {
            setAlignmentData({
              score: Math.round(match.score),
              matchedSkills: match.matchedSkills || [],
              gaps: match.missingSkills || [],
            });
          }
        }
      } catch (err) {
        console.error('Failed to fetch alignment:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlignment();
  }, [selectedRole]);

  const data = alignmentData;

  const handleBack = () => {
    if (from === "dashboard") navigate("/dashboard");
    else if (from === "job-roles") navigate("/job-roles");
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F8FAFC" }}>
        <Sidebar />
        <Box sx={{ flexGrow: 1 }}>
          <Nav />
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <CircularProgress />
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F8FAFC" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1 }}>
        <Nav />

        <Box sx={{ flexGrow: 1, px: { xs: 2, md: 3, xl: 4 }, py: { xs: 3, md: 4 } }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A' }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
              sx={{ mb: 2, color: '#119DA4', fontWeight: 'bold', textTransform: 'none', '&:hover': { backgroundColor: 'rgba(17, 157, 164, 0.08)' } }}
            />
            AI Skill Alignment Analysis
          </Typography>

          <Typography sx={{ mt: 2, mb: 3 }}>
            Comparing your skills against: <strong>{selectedRole}</strong>
          </Typography>

          <Paper sx={{ p: { xs: 2, sm: 3, md: 4 }, mb: 3, borderRadius: 4, background: "#FFFFFF", border: "1px solid #E2E8F0", boxShadow: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 3, mb: 5 }}>
              <Box>
                <Typography variant="h5" sx={{ color: "#0F172A", fontWeight: "bold" }}>{selectedRole}</Typography>
                <Typography sx={{ color: "#64748B", mt: 1 }}>
                  {data?.matchedSkills.length} matched · {data?.gaps.length} gaps identified
                </Typography>
              </Box>
              <Box sx={{ position: "relative", display: "inline-flex" }}>
                <CircularProgress variant="determinate" value={data?.score || 0} size={140} thickness={5} color="success" />
                <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                  <Typography variant="h4" sx={{ color: "#0F172A", fontWeight: "bold" }}>{data?.score}%</Typography>
                  <Typography variant="caption" sx={{ color: "#64748B" }}>Match</Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ mb: 5 }}>
              <Typography sx={{ fontWeight: "bold", color: "#64748B", mb: 1 }}>Qualification Strength</Typography>
              <Box sx={{ width: "100%", height: 10, bgcolor: "#E5E7EB", borderRadius: 10 }}>
                <Box sx={{ width: `${data?.score || 0}%`, height: "100%", bgcolor: "#119DA4", borderRadius: 10 }} />
              </Box>
              <Typography sx={{ mt: 1, color: "#119DA4", fontWeight: "bold" }}>Strong - {data?.score}%</Typography>
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 4 }}>
              <Box>
                <Typography variant="h6" sx={{ color: "#0F172A", fontWeight: "bold", mb: 2 }}>
                  Matched Skills ({data?.matchedSkills.length})
                </Typography>
                {data?.matchedSkills.map((skill) => (
                  <Box key={skill} sx={{ p: 1.5, mb: 1.5, borderRadius: 2, bgcolor: "#DCFCE7", border: "1px solid #86EFAC", color: "#166534" }}>
                    {skill}
                  </Box>
                ))}
              </Box>
              <Box>
                <Typography variant="h6" sx={{ color: "#0F172A", mb: 2, fontWeight: "bold" }}>
                  Skill Gaps ({data?.gaps.length})
                </Typography>
                {data?.gaps.map((gap) => (
                  <Box key={gap} sx={{ p: 1.5, mb: 1.5, borderRadius: 2, bgcolor: "#FEF3C7", border: "1px solid #FCD34D", color: "#B45309" }}>
                    {gap}
                  </Box>
                ))}
              </Box>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 5 }}>
              <Button
                variant="contained"
                onClick={() => navigate("/learning-roadmap", { state: { roleTitle: selectedRole, from } })}
                sx={{ borderRadius: 3, px: 4, py: 1.5, background: "linear-gradient(135deg,#19647E,#119DA4)", textTransform: "none", fontWeight: "bold" }}
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
