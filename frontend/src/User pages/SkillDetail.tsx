import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Button, CircularProgress, Chip, Grid, Link,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SchoolIcon from '@mui/icons-material/School';
import BuildIcon from '@mui/icons-material/Build';
import YouTubeIcon from '@mui/icons-material/YouTube';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import Sidebar from '../components/Nav/Sidebar';
import Nav from '../components/Nav/Nav';
import { getSkillResources } from '../services/recommendationService';
import type { SkillResources } from '../services/recommendationService';

const ACRONYMS = new Set(['aws', 'azure', 'css', 'html', 'sql', 'api', 'cli', 'json', 'xml', 'rest', 'ai', 'ml', 'ui', 'crud', 'ide', 'i/o', 'nosql']);
const SPECIAL = new Map([
  ['javascript', 'JavaScript'],
  ['typescript', 'TypeScript'],
  ['node js', 'Node.js'],
  ['nodejs', 'Node.js'],
  ['react', 'React'],
  ['angular', 'Angular'],
  ['power bi', 'Power BI'],
  ['c++', 'C++'],
  ['c#', 'C#'],
  ['.net', '.NET'],
]);
const capSkill = (s: string): string => {
  const lower = s.toLowerCase().trim();
  if (SPECIAL.has(lower)) return SPECIAL.get(lower)!;
  if (ACRONYMS.has(lower)) return lower.toUpperCase();
  return lower.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

const SkillDetail: React.FC = () => {
  const { skillName } = useParams<{ skillName: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<SkillResources | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!skillName) return;
    setLoading(true);
    getSkillResources(skillName)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [skillName]);

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const cur = data?.curriculum;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F8FAFC' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1 }}>
        <Nav />
        <Box sx={{ p: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{ mb: 3, color: '#119DA4', fontWeight: 'bold', textTransform: 'none' }}
          >
            Back
          </Button>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>
          ) : !data ? (
            <Typography>Skill not found.</Typography>
          ) : (
            <>
              <Paper sx={{ p: 4, borderRadius: 4, mb: 4, border: '1px solid #E2E8F0' }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A' }}>
                  {capSkill(data.skill)}
                </Typography>
                {cur && (
                  <Box sx={{ display: 'flex', gap: 2, mt: 1.5, flexWrap: 'wrap' }}>
                    <Chip label={`${cur.total_hours}h`} sx={{ bgcolor: '#EDE9FE', color: '#6D28D9', fontWeight: 'bold' }} />
                    <Chip label={capSkill(cur.difficulty)} sx={{ bgcolor: '#F0F9FF', color: '#0369A1', fontWeight: 'bold' }} />
                  </Box>
                )}
              </Paper>

              <Grid container spacing={3}>
                {cur?.sub_topics && cur.sub_topics.length > 0 && (
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 3, borderRadius: 3, height: '100%', border: '1px solid #E2E8F0' }}>
                      <Typography sx={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#0F172A', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SchoolIcon /> Documentation & Materials
                      </Typography>
                      {cur.sub_topics.map((t, i) => (
                        <Box key={i} sx={{ py: 1, borderBottom: i < cur.sub_topics.length - 1 ? '1px solid #E2E8F0' : 'none' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography sx={{ fontWeight: 500, color: '#334155' }}>{capSkill(t.name)}</Typography>
                            <Typography sx={{ fontSize: '0.8rem', color: '#94A3B8' }}>{t.hours}h</Typography>
                          </Box>
                          {t.resource?.url && (
                            <Link href={t.resource.url} target="_blank" underline="hover" sx={{ fontSize: '0.85rem', color: '#119DA4' }}>
                              {t.resource.title || 'Open Resource'} &rarr;
                            </Link>
                          )}
                        </Box>
                      ))}
                    </Paper>
                  </Grid>
                )}

                {cur?.practice_projects && cur.practice_projects.length > 0 && (
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 3, borderRadius: 3, height: '100%', border: '1px solid #E2E8F0' }}>
                      <Typography sx={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#0F172A', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BuildIcon /> Practice Projects
                      </Typography>
                      {cur.practice_projects.map((p, i) => (
                        <Box key={i} sx={{ py: 1.5, borderBottom: i < cur.practice_projects.length - 1 ? '1px solid #E2E8F0' : 'none' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography sx={{ fontWeight: 600, color: '#0F172A' }}>{p.name}</Typography>
                            <Chip label={capSkill(p.difficulty)} size="small" sx={{ bgcolor: '#FEF3C7', color: '#92400E', fontWeight: 500 }} />
                          </Box>
                          {p.description && (
                            <Typography sx={{ fontSize: '0.85rem', color: '#64748B' }}>{p.description}</Typography>
                          )}
                        </Box>
                      ))}
                    </Paper>
                  </Grid>
                )}

                {data.youtube_videos && data.youtube_videos.length > 0 && (
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 3, borderRadius: 3, height: '100%', border: '1px solid #E2E8F0' }}>
                      <Typography sx={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#0F172A', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <YouTubeIcon sx={{ color: '#FF0000' }} /> YouTube Tutorials
                      </Typography>
                      {data.youtube_videos.map((v, i) => (
                        <Box key={i} sx={{ py: 1.5, borderBottom: i < data.youtube_videos.length - 1 ? '1px solid #E2E8F0' : 'none' }}>
                          <Link href={v.url} target="_blank" underline="hover" sx={{ fontWeight: 600, color: '#0F172A', display: 'block', mb: 0.3 }}>
                            {v.title}
                          </Link>
                          <Box sx={{ display: 'flex', gap: 2, fontSize: '0.8rem', color: '#64748B' }}>
                            <span>{v.author}</span>
                            {v.length > 0 && <span>{formatDuration(v.length)}</span>}
                          </Box>
                        </Box>
                      ))}
                    </Paper>
                  </Grid>
                )}

                {data.books && data.books.length > 0 && (
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 3, borderRadius: 3, height: '100%', border: '1px solid #E2E8F0' }}>
                      <Typography sx={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#0F172A', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MenuBookIcon sx={{ color: '#B45309' }} /> Books
                      </Typography>
                      <Grid container spacing={2}>
                        {data.books.map((b, i) => (
                          <Grid size={{ xs: 12, sm: 6 }} key={i}>
                            <Box sx={{ display: 'flex', gap: 1.5 }}>
                              {b.cover_url && (
                                <Box component="img" src={b.cover_url} alt={b.title}
                                  sx={{ width: 50, height: 75, borderRadius: 1, objectFit: 'cover', flexShrink: 0 }}
                                />
                              )}
                              <Box>
                                <Link href={b.url || '#'} target="_blank" underline="hover" sx={{ fontWeight: 600, color: '#0F172A', fontSize: '0.85rem' }}>
                                  {b.title}
                                </Link>
                                <Typography sx={{ fontSize: '0.8rem', color: '#64748B' }}>
                                  {b.author}{b.year ? ` (${b.year})` : ''}
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default SkillDetail;
