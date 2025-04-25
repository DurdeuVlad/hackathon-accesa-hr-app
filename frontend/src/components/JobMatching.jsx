import React, { useEffect, useState } from 'react';
import {
    Container, Typography, Box, CircularProgress, Grid, CssBaseline,
    Card, CardContent, Chip, Avatar, Divider, Rating, Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
    InsertDriveFile as InsertDriveFileIcon,
    Person as PersonIcon,
    Work as WorkIcon
} from '@mui/icons-material';
import { ThemeProvider } from '@mui/material/styles';
import { getJobScores } from './jobService';
import NavBar from './TopNavBar';
import theme from './CommonTheme';

const JobMatching = ({ onBack, onNavigate, jobId = 'demo-job-123' }) => {
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [jobDetails, setJobDetails] = useState({
        title: "Senior Frontend Developer",
        company: "TechCorp Solutions",
        description: "Experienced developer proficient in modern JavaScript frameworks, specifically React and Redux. Should have strong UI/UX sensibilities and experience with responsive design.",
        requirements: ["React.js", "JavaScript", "Redux", "HTML/CSS", "Responsive Design"]
    });

    useEffect(() => {
        setLoading(true);
        getJobScores(jobId).then((res) => {
            const enhancedScores = res.map(score => ({
                ...score,
                details: {
                    technicalMatch: Math.floor(70 + Math.random() * 30),
                    experienceMatch: Math.floor(60 + Math.random() * 40),
                    educationMatch: Math.floor(50 + Math.random() * 50)
                }
            }));
            enhancedScores.sort((a, b) => b.score - a.score);
            setScores(enhancedScores);
            setLoading(false);
        });
    }, [jobId]);

    const getScoreColor = (score) => {
        if (score >= 80) return '#10b981';
        if (score >= 60) return '#f59e0b';
        return '#ef4444';
    };

    const matchedJobsCount = scores.filter(score => score.score >= 80).length;
    const totalJobsCount = scores.length;
    const matchPercentage = totalJobsCount ? Math.round((matchedJobsCount / totalJobsCount) * 100) : 0;

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <NavBar showBackButton={true} onBack={onBack} title="Job Matching Results" currentPage="jobmatching" />
            <Container maxWidth="lg" sx={{ py: 4 }}>
                {/* Job Info */}
                <Card sx={{ mb: 4 }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                                <WorkIcon />
                            </Avatar>
                            <Box>
                                <Typography variant="h6" fontWeight="bold">
                                    {jobDetails.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {jobDetails.company}
                                </Typography>
                            </Box>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <Typography align="center" fontWeight="bold" gutterBottom>Job Description</Typography>
                        <Typography align="center" paragraph>{jobDetails.description}</Typography>
                        <Typography align="center" fontWeight="bold">Required Skills</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                            {jobDetails.requirements.map((skill, index) => (
                                <Chip key={index} label={skill} color="primary" variant="outlined" />
                            ))}
                        </Box>
                    </CardContent>
                </Card>


                <Card sx={{ mb: 4 }}>
                    <CardContent>
                        <Typography variant="h6" fontWeight="bold" align="center" gutterBottom>
                            Match Overview
                        </Typography>
                        <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
                            <Box position="relative" display="inline-flex">
                                <CircularProgress variant="determinate" value={100} size={120} thickness={4} sx={{ color: '#e5e7eb' }} />
                                <CircularProgress variant="determinate" value={matchPercentage} size={120} thickness={4} sx={{ color: getScoreColor(matchPercentage), position: 'absolute', left: 0 }} />
                                <Box sx={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Typography variant="h5" fontWeight="bold">{matchPercentage}%</Typography>
                                </Box>
                            </Box>
                        </Box>
                        <Typography align="center">{matchedJobsCount} of {totalJobsCount} CVs have strong matches</Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="body2" color="text.secondary" align="center">
                            Scroll down to view detailed match analysis for each CV
                        </Typography>
                    </CardContent>
                </Card>


                <Typography variant="h6" fontWeight="bold" mb={3}>CV Match Results</Typography>
                {scores.map((score, index) => (
                    <Card key={index} sx={{ mb: 3, borderRadius: 4, px: 2, py: 3, borderLeft: `4px solid ${getScoreColor(score.score)}` }}>
                        <Grid container spacing={2} alignItems="center" justifyContent="center">
                            <Grid item xs={12} md={9}>
                                <Box display="flex" alignItems="center" gap={2}>
                                    <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.dark' }}>
                                        <InsertDriveFileIcon />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6" fontWeight="bold">{score.cvName}</Typography>
                                        <Typography variant="body2" color="text.secondary">Candidate {index + 1}</Typography>
                                    </Box>
                                </Box>
                                <Box display="flex" gap={4} mt={2}>
                                    <Box>
                                        <Typography fontSize={13}>Technical Match</Typography>
                                        <Rating value={score.details.technicalMatch / 20} precision={0.5} readOnly size="small" />
                                    </Box>
                                    <Box>
                                        <Typography fontSize={13}>Experience</Typography>
                                        <Rating value={score.details.experienceMatch / 20} precision={0.5} readOnly size="small" />
                                    </Box>
                                    <Box>
                                        <Typography fontSize={13}>Education</Typography>
                                        <Rating value={score.details.educationMatch / 20} precision={0.5} readOnly size="small" />
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Box display="flex" flexDirection="column" alignItems="center">
                                    <Box position="relative" display="inline-flex" mb={1}>
                                        <CircularProgress variant="determinate" value={100} size={72} thickness={4} sx={{ color: '#e5e7eb' }} />
                                        <CircularProgress variant="determinate" value={score.score} size={72} thickness={4} sx={{ color: getScoreColor(score.score), position: 'absolute', left: 0 }} />
                                        <Box sx={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Typography variant="subtitle1" fontWeight="bold">{score.score}%</Typography>
                                        </Box>
                                    </Box>
                                    <Chip
                                        label={score.score >= 80 ? 'Strong Match' : score.score >= 60 ? 'Good Match' : 'Partial Match'}
                                        size="small"
                                        sx={{ mt: 1, fontWeight: 'bold', bgcolor: '#dcfce7', color: '#166534' }}
                                    />
                                </Box>
                            </Grid>
                        </Grid>

                        <Accordion sx={{ mt: 3, bgcolor: 'transparent', boxShadow: 'none', border: '1px solid #ccc', borderRadius: 2 }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ justifyContent: 'center' }}>
                                <Typography fontWeight="bold" textAlign="center" width="100%">View More Details</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={4} justifyContent="center">
                                    <Grid item xs={12} md={5.5}>
                                        <Card sx={{ bgcolor: '#e0f2ff', p: 2, mb: 2 }}>
                                            <Typography variant="h6" fontWeight="bold" textAlign="center">Job Info</Typography>
                                            <Typography>Title: Frontend Developer</Typography>
                                            <Typography>Industry: Tech</Typography>
                                            <Typography>Description:</Typography>
                                            <Typography paragraph>
                                                Looking for a skilled React developer with experience in modern JS frameworks.
                                            </Typography>
                                        </Card>

                                        <Card sx={{ bgcolor: '#e0f2ff', p: 2 }}>
                                            <Typography variant="subtitle2" fontWeight="bold" textAlign="center">Required Skills:</Typography>
                                            <Box sx={{ mt: 1 }}>
                                                <Typography>React - 40%</Typography>
                                                <Typography>JavaScript - 30%</Typography>
                                                <Typography>Redux - 30%</Typography>
                                            </Box>
                                        </Card>
                                    </Grid>

                                    <Grid item xs={12} md={5.5}>
                                        <Card sx={{ bgcolor: '#e0f2ff', p: 2 }}>
                                            <Typography variant="h6" fontWeight="bold" textAlign="center">Candidate Info</Typography>
                                            <Typography>File: {score.cvName}</Typography>
                                            <Typography>Uploaded: 2025-04-01</Typography>
                                            <Typography variant="subtitle2">Extracted Skills:</Typography>
                                            <Box display="flex" justifyContent="center" flexWrap="wrap" gap={1} mt={1}>
                                                {['React', 'JavaScript', 'Node.js'].map((skill, i) => (
                                                    <Chip key={i} label={skill} color="primary" size="small" />
                                                ))}
                                            </Box>
                                        </Card>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Divider sx={{ my: 2 }} />
                                        <Typography variant="h6" fontWeight="bold" textAlign="center">Explanation</Typography>
                                        <Typography textAlign="center">This candidate scored {score.score}% matching the job requirements for {jobId}.</Typography>
                                    </Grid>
                                </Grid>
                            </AccordionDetails>
                        </Accordion>

                    </Card>
                ))}
            </Container>
        </ThemeProvider>
    );
};

export default JobMatching;