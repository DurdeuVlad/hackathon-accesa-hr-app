import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Box,
    CircularProgress,
    Grid,
    CssBaseline,
    Card,
    CardContent,
    Chip,
    Avatar,
    Button,
    Divider,
    Rating,
    Collapse,
    Alert
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import {
    Work as WorkIcon,
    LocationOn as LocationIcon,
    AccessTime as AccessTimeIcon,
    MonetizationOn as SalaryIcon,
    Business as BusinessIcon,
    ExpandMore as ExpandMoreIcon,
    KeyboardArrowDown as KeyboardArrowDownIcon,
    KeyboardArrowUp as KeyboardArrowUpIcon,
    InfoOutlined as InfoOutlinedIcon
} from '@mui/icons-material';
import NavBar from './TopNavBar';
import theme from './CommonTheme';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from "../context/AppContext.jsx";
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const JobMatchesResults = () => {
    const navigate = useNavigate();
    const { state } = useAppContext();
    const uploadedFiles = state.matchCVFiles || [];

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [displayLimit, setDisplayLimit] = useState(5);
    const [expandedJobId, setExpandedJobId] = useState(null);
    const [cvDetails, setCvDetails] = useState({
        name: uploadedFiles.length > 0 ? uploadedFiles[0].name : 'Your CV',
        uploadedAt: new Date().toISOString(),
        skills: []
    });

    useEffect(() => {
        const processCV = async () => {
            if (!uploadedFiles || uploadedFiles.length === 0) {
                setError("No CV files available. Please upload a CV first.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const file = uploadedFiles[0]; // Take the first CV file
                let response;

                if (file.type === 'from-database' && file.contentText) {
                    // 📄 CV selected from database, use text
                    const formData = new FormData();
                    formData.append('cvText', file.contentText);

                    response = await axios.post(`${API_BASE_URL}/searchjobsforcv/bytext`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                } else {
                    // 📎 CV uploaded manually, use file
                    const formData = new FormData();
                    formData.append('file', file);

                    response = await axios.post(`${API_BASE_URL}/searchjobsforcv`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                }


                if (response.data && Array.isArray(response.data)) {
                    // Transform the API response to match our component's expected data structure
                    const transformedJobs = response.data.map(job => ({
                        jobId: job.jobTitle.replace(/\s+/g, '-').toLowerCase() + '-' + Math.random().toString(36).substring(2, 7),
                        title: job.jobTitle,
                        company: job.company || 'Unknown Company',
                        industry: job.industry,
                        location: 'Remote',
                        type: 'Full-time',
                        salary: 'Competitive',
                        score: Math.round(job.matchScore),
                        description: job.explanation.split('\n')[0] || 'No description available',
                        requirements: job.explanation.split('\n')
                            .filter(line => line.includes(':') && line.includes('%'))
                            .map(line => line.split(':')[0].trim())
                            .filter(Boolean),
                        matchDetails: {
                            skillsMatch: Math.round(job.techScore),
                            experienceMatch: Math.round(job.industryScore),
                            educationMatch: Math.round(job.jdScore)
                        }
                    }));

                    setJobs(transformedJobs);
                } else {
                    setJobs([]);
                    setError("No matching jobs found or unexpected API response format.");
                }
            } catch (err) {
                console.error("Error fetching job matches:", err);
                setError("Failed to fetch job matches. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        processCV();
    }, [uploadedFiles]);

    const handleShowMore = () => {
        setDisplayLimit(prevLimit => prevLimit + 5);
    };

    const toggleJobDetails = (jobId) => {
        setExpandedJobId(expandedJobId === jobId ? null : jobId);
    };

    const displayedJobs = jobs.slice(0, displayLimit);
    const hasMoreResults = displayLimit < jobs.length;

    const matchedJobsCount = jobs.filter(job => job.score >= 80).length;
    const totalJobsCount = jobs.length;
    const matchPercentage = totalJobsCount ? Math.round((matchedJobsCount / totalJobsCount) * 100) : 0;

    const getScoreColor = (score) => {
        if (score >= 80) return '#10b981';
        if (score >= 60) return '#f59e0b';
        return '#ef4444';
    };

    const getMatchLabel = (score) => {
        if (score >= 80) return "Strong Match";
        if (score >= 60) return "Good Match";
        return "Partial Match";
    };

    // Extract skills from job matches for display in CV card
    useEffect(() => {
        if (jobs.length > 0) {
            const extractedSkills = new Set();
            jobs.forEach(job => {
                if (job.requirements && Array.isArray(job.requirements)) {
                    job.requirements.forEach(skill => {
                        if (skill && skill.length > 0) {
                            extractedSkills.add(skill.trim());
                        }
                    });
                }
            });

            setCvDetails(prev => ({
                ...prev,
                skills: Array.from(extractedSkills).slice(0, 5) // Take top 5 skills
            }));
        }
    }, [jobs]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{
                minHeight: '100vh',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'background.default',
                margin: 0,
                padding: 0,
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                overflow: 'hidden',
            }}>
                <NavBar
                    showBackButton={true}
                    onBack={() => navigate(-1)}
                    title="Job Matches for Your CV"
                    currentPage="jobmatches"
                    fullWidth={true}
                />
                <Box sx={{
                    width: '100%',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'auto'
                }}>
                    <Box sx={{
                        background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                        color: 'white',
                        py: 5,
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                        mb: 4,
                        textAlign: 'center',
                        width: '100%',
                        position: 'relative',
                        overflow: 'visible'
                    }}>
                        <Box sx={{
                            position: 'absolute',
                            top: -100,
                            right: -100,
                            width: 300,
                            height: 300,
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)'
                        }} />
                        <Box sx={{
                            position: 'absolute',
                            bottom: -50,
                            left: '30%',
                            width: 200,
                            height: 200,
                            borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)'
                        }} />

                        <Container maxWidth="lg" sx={{ px: { xs: 2, md: 6 } }}>
                            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                                Job Matches for Your CV
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{
                                    opacity: 0.9,
                                    textAlign: 'center',
                                    mx: 'auto'
                                }}
                            >
                                Discover job opportunities that match your skills and experience
                            </Typography>
                        </Container>
                    </Box>
                    <Container maxWidth="lg" sx={{ px: { xs: 2, md: 4 }, mb: 6 }}>
                        {error && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, p: 2, bgcolor: '#fff9db', borderRadius: 2, border: '1px solid #ffd43b' }}>
                                <InfoOutlinedIcon sx={{ color: '#f59f00', mr: 1 }} />
                                <Typography color="#664d03">
                                    {error}
                                </Typography>
                            </Box>
                        )}

                        {loading ? (
                            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="50vh">
                                <CircularProgress size={60} thickness={4} />
                                <Typography variant="h6" sx={{ mt: 3 }}>
                                    Finding job matches...
                                </Typography>
                            </Box>
                        ) : (
                            <Grid container spacing={4} justifyContent="center">
                                <Grid item xs={12} md={10} lg={8} sx={{ mx: 'auto' }}>
                                    <Card sx={{
                                        borderRadius: 3,
                                        mb: 4,
                                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                                        overflow: 'visible',
                                        borderTop: '4px solid #3b82f6',
                                        width: '100%',
                                    }}>
                                        <CardContent sx={{ p: 3 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                                                    <WorkIcon />
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="h6" fontWeight="bold">
                                                        {cvDetails.name}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Uploaded: {new Date(cvDetails.uploadedAt).toLocaleDateString()}
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            <Divider sx={{ my: 2 }} />

                                            <Typography variant="subtitle2" fontWeight="bold" mb={2}>
                                                Your Top Skills
                                            </Typography>

                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                                                {cvDetails.skills.length > 0 ? (
                                                    cvDetails.skills.map((skill, index) => (
                                                        <Chip
                                                            key={index}
                                                            label={skill}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: '#e6f0ff',
                                                                color: '#3b82f6',
                                                                borderRadius: '16px'
                                                            }}
                                                        />
                                                    ))
                                                ) : (
                                                    <Typography variant="body2" color="text.secondary">
                                                        No skills extracted from your CV
                                                    </Typography>
                                                )}
                                            </Box>

                                            {jobs.length > 0 && (
                                                <>
                                                    <Typography variant="subtitle2" fontWeight="bold" mb={2}>
                                                        Job Category Matches
                                                    </Typography>

                                                    <Box sx={{ mb: 3 }}>
                                                        <Box sx={{
                                                            mb: 2,
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            gap: 1.5
                                                        }}>
                                                            <Box>
                                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                                    <Typography variant="body1">Technical Skills</Typography>
                                                                    <Typography variant="body1" fontWeight="medium">
                                                                        {Math.round(jobs.reduce((sum, job) => sum + job.matchDetails.skillsMatch, 0) / jobs.length)}%
                                                                    </Typography>
                                                                </Box>
                                                                <Box sx={{ width: '100%', height: 8, bgcolor: '#e5e7eb', borderRadius: 4 }}>
                                                                    <Box
                                                                        sx={{
                                                                            height: '100%',
                                                                            borderRadius: 4,
                                                                            width: `${Math.round(jobs.reduce((sum, job) => sum + job.matchDetails.skillsMatch, 0) / jobs.length)}%`,
                                                                            bgcolor: '#10b981'
                                                                        }}
                                                                    />
                                                                </Box>
                                                            </Box>
                                                            <Box>
                                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                                    <Typography variant="body1">Industry Experience</Typography>
                                                                    <Typography variant="body1" fontWeight="medium">
                                                                        {Math.round(jobs.reduce((sum, job) => sum + job.matchDetails.experienceMatch, 0) / jobs.length)}%
                                                                    </Typography>
                                                                </Box>
                                                                <Box sx={{ width: '100%', height: 8, bgcolor: '#e5e7eb', borderRadius: 4 }}>
                                                                    <Box
                                                                        sx={{
                                                                            height: '100%',
                                                                            borderRadius: 4,
                                                                            width: `${Math.round(jobs.reduce((sum, job) => sum + job.matchDetails.experienceMatch, 0) / jobs.length)}%`,
                                                                            bgcolor: '#3b82f6'
                                                                        }}
                                                                    />
                                                                </Box>
                                                            </Box>
                                                            <Box>
                                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                                    <Typography variant="body1">Job Description Match</Typography>
                                                                    <Typography variant="body1" fontWeight="medium">
                                                                        {Math.round(jobs.reduce((sum, job) => sum + job.matchDetails.educationMatch, 0) / jobs.length)}%
                                                                    </Typography>
                                                                </Box>
                                                                <Box sx={{ width: '100%', height: 8, bgcolor: '#e5e7eb', borderRadius: 4 }}>
                                                                    <Box
                                                                        sx={{
                                                                            height: '100%',
                                                                            borderRadius: 4,
                                                                            width: `${Math.round(jobs.reduce((sum, job) => sum + job.matchDetails.educationMatch, 0) / jobs.length)}%`,
                                                                            bgcolor: '#3b82f6'
                                                                        }}
                                                                    />
                                                                </Box>
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                </>
                                            )}
                                        </CardContent>
                                    </Card>

                                    {jobs.length > 0 ? (
                                        <>
                                            <Card sx={{
                                                borderRadius: 3,
                                                mb: 4,
                                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                                                overflow: 'visible',
                                                width: '100%',
                                            }}>
                                                <CardContent sx={{ p: 3 }}>
                                                    <Typography variant="h6" fontWeight="bold" gutterBottom textAlign="center">
                                                        Match Overview
                                                    </Typography>
                                                    <Box display="flex" justifyContent="center" alignItems="center" sx={{ my: 4 }}>
                                                        <Box position="relative" display="flex" justifyContent="center" alignItems="center">
                                                            <CircularProgress
                                                                variant="determinate"
                                                                value={100}
                                                                size={120}
                                                                thickness={4}
                                                                sx={{ color: 'rgba(0, 0, 0, 0.08)' }}
                                                            />
                                                            <CircularProgress
                                                                variant="determinate"
                                                                value={matchPercentage}
                                                                size={120}
                                                                thickness={4}
                                                                sx={{
                                                                    color: getScoreColor(matchPercentage),
                                                                    position: 'absolute',
                                                                    left: 0,
                                                                }}
                                                            />
                                                            <Box
                                                                sx={{
                                                                    position: 'absolute',
                                                                    display: 'flex',
                                                                    flexDirection: 'column',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    width: '100%'
                                                                }}
                                                            >
                                                                <Typography variant="h5" fontWeight="bold">
                                                                    {matchPercentage}%
                                                                </Typography>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    Match Rate
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </Box>

                                                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                                                        <Typography variant="body2" fontWeight="medium">
                                                            {matchedJobsCount} of {totalJobsCount} jobs have strong matches
                                                        </Typography>
                                                    </Box>

                                                    <Divider sx={{ my: 2 }} />

                                                    <Typography variant="body2" color="text.secondary" textAlign="center">
                                                        Scroll down to view detailed job matches for your CV
                                                    </Typography>
                                                </CardContent>
                                            </Card>

                                            <Box sx={{ width: '100%' }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                                    <Typography variant="h6" fontWeight="bold">
                                                        Job Matches
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Showing {displayedJobs.length} of {jobs.length} results
                                                    </Typography>
                                                </Box>

                                                {displayedJobs.map((job) => (
                                                    <Card
                                                        key={job.jobId}
                                                        sx={{
                                                            mb: 3,
                                                            borderRadius: 3,
                                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                                                            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                                            '&:hover': {
                                                                transform: 'translateY(-4px)',
                                                                boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)',
                                                            },
                                                            borderLeft: `4px solid ${getScoreColor(job.score)}`
                                                        }}
                                                    >
                                                        <CardContent sx={{ p: 3 }}>
                                                            <Grid container spacing={2}>
                                                                <Grid item xs={12} sm={8} sx={{ pr: 2 }}>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                        <Avatar
                                                                            variant="rounded"
                                                                            sx={{
                                                                                bgcolor: 'primary.light',
                                                                                color: 'primary.dark',
                                                                                mr: 2
                                                                            }}
                                                                        >
                                                                            <BusinessIcon />
                                                                        </Avatar>
                                                                        <Box sx={{ textAlign: 'left' }}>
                                                                            <Typography variant="h6" fontWeight="bold">
                                                                                {job.title}
                                                                            </Typography>
                                                                            <Typography variant="body2" color="text.secondary">
                                                                                <span style={{ fontWeight: 500 }}>Company: </span>{job.company}
                                                                            </Typography>
                                                                        </Box>
                                                                    </Box>

                                                                    <Box sx={{ mt: 2, ml: 0.5 }}>
                                                                        <Grid container spacing={1}>
                                                                            <Grid item xs={12} sm={6}>
                                                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                                    <LocationIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                                                                    <Typography variant="body2" color="text.secondary">
                                                                                        {job.location || 'Remote'}
                                                                                    </Typography>
                                                                                </Box>
                                                                            </Grid>
                                                                            <Grid item xs={12} sm={6}>
                                                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                                    <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                                                                    <Typography variant="body2" color="text.secondary">
                                                                                        {job.type || 'Full-time'}
                                                                                    </Typography>
                                                                                </Box>
                                                                            </Grid>
                                                                            <Grid item xs={12}>
                                                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                                    <BusinessIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                                                                    <Typography variant="body2" color="text.secondary">
                                                                                        Industry: {job.industry || 'Technology'}
                                                                                    </Typography>
                                                                                </Box>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </Box>

                                                                    <Typography variant="body2" sx={{ mt: 2, mb: 2, textAlign: 'left' }}>
                                                                        {job.description}
                                                                    </Typography>

                                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                                                                        {job.requirements && job.requirements.map((skill, idx) => (
                                                                            <Chip
                                                                                key={idx}
                                                                                label={skill}
                                                                                size="small"
                                                                                sx={{
                                                                                    bgcolor: 'primary.light',
                                                                                    color: 'primary.dark',
                                                                                    fontWeight: 500,
                                                                                    fontSize: '0.75rem'
                                                                                }}
                                                                            />
                                                                        ))}
                                                                    </Box>

                                                                    <Box sx={{ mt: 3, p: 2, pb: 3, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 2, width: '100%', position: 'relative' }}>
                                                                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                                                            Job Match Details
                                                                        </Typography>
                                                                        <Grid container spacing={2} justifyContent="center" alignItems="center">
                                                                            <Grid item xs={4}>
                                                                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                                                                    Skills Match
                                                                                </Typography>
                                                                                <Rating
                                                                                    value={job.matchDetails.skillsMatch / 20}
                                                                                    readOnly
                                                                                    precision={0.5}
                                                                                    size="small"
                                                                                />
                                                                                <Typography variant="body2">
                                                                                    {job.matchDetails.skillsMatch}%
                                                                                </Typography>
                                                                            </Grid>
                                                                            <Grid item xs={4}>
                                                                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                                                                    Industry
                                                                                </Typography>
                                                                                <Rating
                                                                                    value={job.matchDetails.experienceMatch / 20}
                                                                                    readOnly
                                                                                    precision={0.5}
                                                                                    size="small"
                                                                                />
                                                                                <Typography variant="body2">
                                                                                    {job.matchDetails.experienceMatch}%
                                                                                </Typography>
                                                                            </Grid>
                                                                            <Grid item xs={4}>
                                                                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                                                                    JD Match
                                                                                </Typography>
                                                                                <Rating
                                                                                    value={job.matchDetails.educationMatch / 20}
                                                                                    readOnly
                                                                                    precision={0.5}
                                                                                    size="small"
                                                                                />
                                                                                <Typography variant="body2">
                                                                                    {job.matchDetails.educationMatch}%
                                                                                </Typography>
                                                                            </Grid>

                                                                        </Grid>
                                                                    </Box>
                                                                </Grid>
                                                                <Box
                                                                    sx={{
                                                                        display: 'flex',
                                                                        justifyContent: 'center',
                                                                        alignItems: 'center',
                                                                        flexDirection: 'column',
                                                                        width: '100%',
                                                                        height: '100%',
                                                                    }}
                                                                >
                                                                    <Grid item xs={12} sm={4} sx={{
                                                                        display: 'flex',
                                                                        flexDirection: 'column',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                    }}>
                                                                        <Box sx={{
                                                                            position: 'relative',
                                                                            display: 'inline-flex',
                                                                            mb: 1
                                                                        }}>
                                                                            <CircularProgress
                                                                                variant="determinate"
                                                                                value={100}
                                                                                size={80}
                                                                                thickness={4}
                                                                                sx={{ color: 'rgba(0, 0, 0, 0.08)' }}
                                                                            />
                                                                            <CircularProgress
                                                                                variant="determinate"
                                                                                value={job.score}
                                                                                size={80}
                                                                                thickness={4}
                                                                                sx={{
                                                                                    color: getScoreColor(job.score),
                                                                                    position: 'absolute',
                                                                                    left: 0,
                                                                                }}
                                                                            />
                                                                            <Box
                                                                                sx={{
                                                                                    top: 0,
                                                                                    left: 0,
                                                                                    bottom: 0,
                                                                                    right: 0,
                                                                                    position: 'absolute',
                                                                                    display: 'flex',
                                                                                    alignItems: 'center',
                                                                                    justifyContent: 'center',
                                                                                }}
                                                                            >
                                                                                <Typography variant="h6" fontWeight="bold">
                                                                                    {job.score}%
                                                                                </Typography>
                                                                            </Box>
                                                                        </Box>

                                                                        <Chip
                                                                            label={getMatchLabel(job.score)}
                                                                            sx={{
                                                                                bgcolor: job.score >= 80 ? 'success.light' : job.score >= 60 ? 'warning.light' : 'error.light',
                                                                                color: job.score >= 80 ? 'success.dark' : job.score >= 60 ? 'warning.dark' : 'error.dark',
                                                                                fontWeight: 600
                                                                            }}
                                                                        />
                                                                    </Grid>
                                                                </Box>
                                                                </Grid>
                                                        </CardContent>
                                                    </Card>
                                                ))}

                                                {hasMoreResults && (
                                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                                        <Button
                                                            variant="outlined"
                                                            onClick={handleShowMore}
                                                            startIcon={<ExpandMoreIcon />}
                                                            sx={{
                                                                borderRadius: 2,
                                                                px: 4,
                                                                py: 1,
                                                                textTransform: 'none',
                                                            }}
                                                        >
                                                            Show More Results
                                                        </Button>
                                                    </Box>
                                                )}
                                            </Box>
                                        </>
                                    ) : !loading && (
                                        <Card
                                            sx={{
                                                p: 4,
                                                textAlign: 'center',
                                                borderRadius: 2,
                                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                                bgcolor: '#fff',
                                                mb: 4
                                            }}
                                        >
                                            <Typography
                                                variant="h6"
                                                color="#4b5563"
                                                fontWeight="medium"
                                                gutterBottom
                                                sx={{ mb: 1.5 }}
                                            >
                                                No job matches found
                                            </Typography>
                                            <Typography variant="body2" color="#6b7280">
                                                We couldn't find any jobs that match your CV. Try uploading a different CV or check back later.
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                onClick={() => navigate('/matchcv')}
                                                sx={{ mt: 3 }}
                                            >
                                                Upload a Different CV
                                            </Button>
                                        </Card>
                                    )}
                                </Grid>
                            </Grid>
                        )}
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default JobMatchesResults;