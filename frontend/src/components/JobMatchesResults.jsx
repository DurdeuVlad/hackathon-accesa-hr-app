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
    KeyboardArrowUp as KeyboardArrowUpIcon
} from '@mui/icons-material';
import NavBar from './TopNavBar';
import theme from './CommonTheme';
import {useNavigate} from 'react-router-dom'

const getJobMatches = (cvId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    jobId: 'job-001',
                    title: 'Senior Frontend Developer',
                    company: 'TechCorp Solutions',
                    location: 'București, RO',
                    type: 'Full-time',
                    salary: '€5,000 - €7,000 / month',
                    score: 92,
                    description: 'Experienced developer proficient in modern JavaScript frameworks, specifically React and Redux. Should have strong UI/UX sensibilities and experience with responsive design.',
                    requirements: ['React.js', 'JavaScript', 'Redux', 'HTML/CSS', 'Responsive Design'],
                    matchDetails: {
                        skillsMatch: 94,
                        experienceMatch: 90,
                        educationMatch: 85
                    }
                },
                {
                    jobId: 'job-002',
                    title: 'Full Stack Developer',
                    company: 'Digital Nexus',
                    location: 'Cluj-Napoca, RO',
                    type: 'Full-time',
                    salary: '€4,500 - €6,500 / month',
                    score: 85,
                    description: 'Looking for a skilled developer who can work on both frontend and backend technologies. Experience with React, Node.js and MongoDB required.',
                    requirements: ['React.js', 'Node.js', 'MongoDB', 'JavaScript', 'RESTful APIs'],
                    matchDetails: {
                        skillsMatch: 88,
                        experienceMatch: 83,
                        educationMatch: 90
                    }
                },
                {
                    jobId: 'job-003',
                    title: 'UI/UX Developer',
                    company: 'Creative Solutions',
                    location: 'Timișoara, RO',
                    type: 'Full-time',
                    salary: '€4,000 - €5,500 / month',
                    score: 80,
                    description: 'Join our creative team to build beautiful and intuitive user interfaces. Strong focus on responsive design and user experience.',
                    requirements: ['HTML/CSS', 'JavaScript', 'UI/UX Design', 'Figma', 'Responsive Design'],
                    matchDetails: {
                        skillsMatch: 85,
                        experienceMatch: 80,
                        educationMatch: 75
                    }
                },
                {
                    jobId: 'job-004',
                    title: 'React Native Developer',
                    company: 'MobileApp Tech',
                    location: 'București, RO',
                    type: 'Remote',
                    salary: '€4,800 - €6,800 / month',
                    score: 78,
                    description: 'Develop cross-platform mobile applications using React Native. Experience with mobile app development and state management required.',
                    requirements: ['React Native', 'JavaScript', 'Redux', 'Mobile Development', 'iOS/Android'],
                    matchDetails: {
                        skillsMatch: 80,
                        experienceMatch: 75,
                        educationMatch: 82
                    }
                },
                {
                    jobId: 'job-005',
                    title: 'JavaScript Developer',
                    company: 'WebTech Solutions',
                    location: 'Iași, RO',
                    type: 'Hybrid',
                    salary: '€3,800 - €5,200 / month',
                    score: 72,
                    description: 'Looking for a JavaScript developer to join our growing team. Work on diverse web applications with modern frameworks.',
                    requirements: ['JavaScript', 'HTML/CSS', 'Vue.js', 'REST APIs', 'Git'],
                    matchDetails: {
                        skillsMatch: 75,
                        experienceMatch: 70,
                        educationMatch: 80
                    }
                },
                {
                    jobId: 'job-006',
                    title: 'Frontend Team Lead',
                    company: 'Enterprise Solutions',
                    location: 'București, RO',
                    type: 'Full-time',
                    salary: '€7,000 - €9,000 / month',
                    score: 68,
                    description: 'Lead a team of frontend developers working on enterprise-level applications. Strong leadership and technical skills required.',
                    requirements: ['React.js', 'Team Leadership', 'JavaScript', 'Project Management', 'Code Reviews'],
                    matchDetails: {
                        skillsMatch: 70,
                        experienceMatch: 65,
                        educationMatch: 85
                    }
                }
            ]);
        }, 1500);
    });
};

const JobMatchesResults = ({ cvId = 'default-cv-001', cvName = 'Your CV' }) => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [displayLimit, setDisplayLimit] = useState(5);
    const [expandedJobId, setExpandedJobId] = useState(null);
    const [cvDetails, setCvDetails] = useState({
        name: cvName,
        uploadedAt: new Date().toISOString(),
    });

    useEffect(() => {
        setLoading(true);
        getJobMatches(cvId).then((res) => {
            setJobs(res);
            setLoading(false);
        });
    }, [cvId]);

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
                                                <Chip label="React.js" size="small" sx={{
                                                    bgcolor: '#e6f0ff',
                                                    color: '#3b82f6',
                                                    borderRadius: '16px'
                                                }} />
                                                <Chip label="JavaScript" size="small" sx={{
                                                    bgcolor: '#e6f0ff',
                                                    color: '#3b82f6',
                                                    borderRadius: '16px'
                                                }} />
                                                <Chip label="HTML/CSS" size="small" sx={{
                                                    bgcolor: '#e6f0ff',
                                                    color: '#3b82f6',
                                                    borderRadius: '16px'
                                                }} />
                                                <Chip label="UI/UX" size="small" sx={{
                                                    bgcolor: '#e6f0ff',
                                                    color: '#3b82f6',
                                                    borderRadius: '16px'
                                                }} />
                                                <Chip label="Responsive Design" size="small" sx={{
                                                    bgcolor: '#e6f0ff',
                                                    color: '#3b82f6',
                                                    borderRadius: '16px'
                                                }} />
                                            </Box>

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
                                                            <Typography variant="body1">Frontend Development</Typography>
                                                            <Typography variant="body1" fontWeight="medium">95%</Typography>
                                                        </Box>
                                                        <Box sx={{ width: '100%', height: 8, bgcolor: '#e5e7eb', borderRadius: 4 }}>
                                                            <Box
                                                                sx={{
                                                                    height: '100%',
                                                                    borderRadius: 4,
                                                                    width: '95%',
                                                                    bgcolor: '#10b981'
                                                                }}
                                                            />
                                                        </Box>
                                                    </Box>
                                                    <Box>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                            <Typography variant="body1">Full Stack Development</Typography>
                                                            <Typography variant="body1" fontWeight="medium">88%</Typography>
                                                        </Box>
                                                        <Box sx={{ width: '100%', height: 8, bgcolor: '#e5e7eb', borderRadius: 4 }}>
                                                            <Box
                                                                sx={{
                                                                    height: '100%',
                                                                    borderRadius: 4,
                                                                    width: '88%',
                                                                    bgcolor: '#3b82f6'
                                                                }}
                                                            />
                                                        </Box>
                                                    </Box>
                                                    <Box>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                            <Typography variant="body1">UI/UX Design</Typography>
                                                            <Typography variant="body1" fontWeight="medium">82%</Typography>
                                                        </Box>
                                                        <Box sx={{ width: '100%', height: 8, bgcolor: '#e5e7eb', borderRadius: 4 }}>
                                                            <Box
                                                                sx={{
                                                                    height: '100%',
                                                                    borderRadius: 4,
                                                                    width: '82%',
                                                                    bgcolor: '#3b82f6'
                                                                }}
                                                            />
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </CardContent>
                                    </Card>
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
                                                        <Grid item xs={12} sm={7} sx={{ pr: 5 }}>
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
                                                                                {job.location}
                                                                            </Typography>
                                                                        </Box>
                                                                    </Grid>
                                                                    <Grid item xs={12} sm={6}>
                                                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                            <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                                                            <Typography variant="body2" color="text.secondary">
                                                                                {job.type}
                                                                            </Typography>
                                                                        </Box>
                                                                    </Grid>
                                                                    <Grid item xs={12}>
                                                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                            <SalaryIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                                                            <Typography variant="body2" color="text.secondary">
                                                                                {job.salary}
                                                                            </Typography>
                                                                        </Box>
                                                                    </Grid>
                                                                </Grid>
                                                            </Box>

                                                            <Typography variant="body2" sx={{ mt: 2, mb: 2, textAlign: 'left' }}>
                                                                {job.description}
                                                            </Typography>

                                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                                                                {job.requirements.map((skill, idx) => (
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

                                                            <Box sx={{ mt: 3, p: 2, pb: 3, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 2, width: '100%', position: 'relative', display: 'flex', flexDirection: 'row' }}>
                                                                <Box sx={{ flex: 1 }}>
                                                                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                                                        Job Match Details
                                                                    </Typography>
                                                                    <Grid container spacing={2}>
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
                                                                                Experience
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
                                                                                Education
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

                                                                <Box sx={{
                                                                    display: 'flex',
                                                                    flexDirection: 'column',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    ml: 2,
                                                                    mr: 2,
                                                                    minWidth: '100px'
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
                                                                </Box>
                                                            </Box>
                                                            <Collapse in={expandedJobId === job.jobId} timeout="auto" unmountOnExit>
                                                                <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 2, width: '100%' }}>
                                                                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                                                        Job Details
                                                                    </Typography>
                                                                </Box>
                                                            </Collapse>
                                                            <Button
                                                                variant="outlined"
                                                                size="small"
                                                                onClick={() => toggleJobDetails(job.jobId)}
                                                                endIcon={expandedJobId === job.jobId ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                                sx={{
                                                                    mt: 2,
                                                                    borderRadius: 2,
                                                                    textTransform: 'none',
                                                                    float: 'left',
                                                                }}
                                                            >
                                                                {expandedJobId === job.jobId ? 'Hide Details' : 'View Details'}
                                                            </Button>
                                                        </Grid>
                                                        <Grid item xs={12} sm={5} sx={{
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            pr: 3,
                                                        }}>
                                                        </Grid>
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