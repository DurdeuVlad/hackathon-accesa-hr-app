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
    Rating
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';

import {
    Work as WorkIcon,
    InsertDriveFile as InsertDriveFileIcon,
    Person as PersonIcon,
    ArrowForward as ArrowForwardIcon,
    ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import { getJobScores } from './jobService';
import NavBar from './TopNavBar';
import theme from './CommonTheme';

const JobMatching = ({ onBack, onNavigate, jobId = 'demo-job-123' }) => {
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [displayLimit, setDisplayLimit] = useState(5);
    const [jobDetails, setJobDetails] = useState({
        title: "Senior Frontend Developer",
        company: "TechCorp Solutions",
        description: "Experienced developer proficient in modern JavaScript frameworks, specifically React and Redux. Should have strong UI/UX sensibilities and experience with responsive design.",
        requirements: ["React.js", "JavaScript", "Redux", "HTML/CSS", "Responsive Design"]
    });
    useEffect(() => {
        setLoading(true);
        getJobScores(jobId).then((res) => {
            const mockData = [
                ...res,
                { cvName: "CV-Elena.pdf", score: 68 },
                { cvName: "CV-Mihai.pdf", score: 63 },
                { cvName: "CV-Adrian.pdf", score: 58 },
                { cvName: "CV-Maria.pdf", score: 51 },
                { cvName: "CV-Alex.pdf", score: 47 },
                { cvName: "CV-Ioana.pdf", score: 43 },
                { cvName: "CV-Cristian.pdf", score: 39 }
            ];
            const enhancedScores = mockData.map(score => ({
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

    const handleShowMore = () => {
        setDisplayLimit(prevLimit => prevLimit + 5);
    };
    const displayedScores = scores.slice(0, displayLimit);
    const hasMoreResults = displayLimit < scores.length;
    const matchedJobsCount = scores.filter(score => score.score >= 80).length;
    const totalJobsCount = scores.length;
    const matchPercentage = totalJobsCount ? Math.round((matchedJobsCount / totalJobsCount) * 100) : 0;
    const getScoreColor = (score) => {
        if (score >= 80) return '#10b981';
        if (score >= 60) return '#f59e0b';
        return '#ef4444';
    };
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{
                minHeight: '100vh',
                width: '100vw',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'background.default',
                margin: 0,
                padding: 0,
                overflow: 'hidden',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
            }}>
                <NavBar
                    showBackButton={true}
                    onBack={onBack}
                    onNavigate={onNavigate}
                    title="Job Matching Results"
                    currentPage="jobmatching"
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
                        width: '100%'
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

                        <Container maxWidth="lg">
                            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                                CV-Job Matching Results
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{
                                    opacity: 0.9,
                                    maxWidth: 700,
                                    textAlign: 'center',
                                    mx: 'auto'
                                }}
                            >
                                See how well your CV matches with job requirements
                            </Typography>
                        </Container>
                    </Box>

                    <Container maxWidth="lg" sx={{ mb: 6 }}>
                        {loading ? (
                            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="50vh">
                                <CircularProgress size={60} thickness={4} />
                                <Typography variant="h6" sx={{ mt: 3 }}>
                                    Analyzing matches...
                                </Typography>
                            </Box>
                        ) : (
                            <Grid container spacing={4} justifyContent="center">
                                <Grid item xs={12} md={4}>
                                    <Box sx={{ position: 'sticky', top: 20 }}>
                                        <Card sx={{
                                            borderRadius: 3,
                                            mb: 4,
                                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                                            overflow: 'visible',
                                            borderTop: '4px solid #3b82f6'
                                        }}>
                                            <CardContent sx={{ p: 3 }}>
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

                                                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                                    Job Description
                                                </Typography>
                                                <Typography variant="body2" paragraph>
                                                    {jobDetails.description}
                                                </Typography>

                                                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                                    Required Skills
                                                </Typography>
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2}}>
                                                    {jobDetails.requirements.map((skill, index) => (
                                                        <Chip
                                                            key={index}
                                                            label={skill}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: 'primary.light',
                                                                color: 'primary.dark',
                                                                fontWeight: 500
                                                            }}
                                                        />
                                                    ))}
                                                </Box>
                                            </CardContent>
                                        </Card>

                                        <Card sx={{
                                            borderRadius: 3,
                                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                                            overflow: 'visible'
                                        }}>
                                            <CardContent sx={{ p: 3 }}>
                                                <Typography variant="h6" fontWeight="bold" gutterBottom>
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
                                                        {matchedJobsCount} of {totalJobsCount} CVs have strong matches
                                                    </Typography>
                                                </Box>

                                                <Divider sx={{ my: 2 }} />

                                                <Typography variant="body2" color="text.secondary" textAlign="center">
                                                    Scroll down to view detailed match analysis for each CV
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} md={8}>
                                    <Box sx={{ maxWidth: 900, mx: 'auto' }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                            <Typography variant="h6" fontWeight="bold">
                                                CV Match Results
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Showing {displayedScores.length} of {scores.length} results
                                            </Typography>
                                        </Box>

                                        {displayedScores.map((score, index) => (
                                            <Card
                                                key={index}
                                                sx={{
                                                    mb: 3,
                                                    borderRadius: 3,
                                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                                                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                                    '&:hover': {
                                                        transform: 'translateY(-4px)',
                                                        boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)',
                                                    },
                                                    borderLeft: `4px solid ${getScoreColor(score.score)}`
                                                }}
                                            >
                                                <CardContent sx={{ p: 3 }}>
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={12} sm={8}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <Avatar
                                                                    variant="rounded"
                                                                    sx={{
                                                                        bgcolor: 'primary.light',
                                                                        color: 'primary.dark',
                                                                        mr: 2
                                                                    }}
                                                                >
                                                                    <InsertDriveFileIcon />
                                                                </Avatar>
                                                                <Box>
                                                                    <Typography variant="h6" fontWeight="bold">
                                                                        {score.cvName}
                                                                    </Typography>
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                                                        <PersonIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                                                                        <Typography variant="body2" color="text.secondary">
                                                                            Candidate {index + 1}
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                            </Box>

                                                            <Box sx={{ mt: 3, pl: 2 }}>
                                                                <Grid container spacing={2}>
                                                                    <Grid item xs={4}>
                                                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                                                            Technical Match
                                                                        </Typography>
                                                                        <Rating
                                                                            value={score.details.technicalMatch / 20}
                                                                            readOnly
                                                                            precision={0.5}
                                                                            size="small"
                                                                        />
                                                                    </Grid>
                                                                    <Grid item xs={4}>
                                                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                                                            Experience
                                                                        </Typography>
                                                                        <Rating
                                                                            value={score.details.experienceMatch / 20}
                                                                            readOnly
                                                                            precision={0.5}
                                                                            size="small"
                                                                        />
                                                                    </Grid>
                                                                    <Grid item xs={4}>
                                                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                                                            Education
                                                                        </Typography>
                                                                        <Rating
                                                                            value={score.details.educationMatch / 20}
                                                                            readOnly
                                                                            precision={0.5}
                                                                            size="small"
                                                                        />
                                                                    </Grid>
                                                                </Grid>
                                                            </Box>
                                                        </Grid>

                                                        <Grid item xs={12} sm={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                                            <Box sx={{ position: 'relative', display: 'inline-flex', mb: 1 }}>
                                                                <CircularProgress
                                                                    variant="determinate"
                                                                    value={100}
                                                                    size={80}
                                                                    thickness={4}
                                                                    sx={{ color: 'rgba(0, 0, 0, 0.08)' }}
                                                                />
                                                                <CircularProgress
                                                                    variant="determinate"
                                                                    value={score.score}
                                                                    size={80}
                                                                    thickness={4}
                                                                    sx={{
                                                                        color: getScoreColor(score.score),
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
                                                                        {score.score}%
                                                                    </Typography>
                                                                </Box>
                                                            </Box>

                                                            <Chip
                                                                label={score.score >= 80 ? "Strong Match" : score.score >= 60 ? "Good Match" : "Partial Match"}
                                                                sx={{
                                                                    bgcolor: score.score >= 80 ? 'success.light' : score.score >= 60 ? 'warning.light' : 'error.light',
                                                                    color: score.score >= 80 ? 'success.dark' : score.score >= 60 ? 'warning.dark' : 'error.dark',
                                                                    fontWeight: 'bold',
                                                                    mb: 2
                                                                }}
                                                                size="small"
                                                            />

                                                            <Button
                                                                variant="outlined"
                                                                size="small"
                                                                endIcon={<ArrowForwardIcon />}
                                                                sx={{ fontSize: '0.8rem' }}
                                                            >
                                                                View Details
                                                            </Button>
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
                                                        px: 4,
                                                        py: 1,
                                                        borderRadius: 2,
                                                        fontWeight: 500
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

export default JobMatching;