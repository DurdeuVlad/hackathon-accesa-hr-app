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
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Alert,
    Snackbar
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';

import {
    Work as WorkIcon,
    InsertDriveFile as InsertDriveFileIcon,
    Person as PersonIcon,
    ExpandMore as ExpandMoreIcon,
    InfoOutlined as InfoOutlinedIcon
} from '@mui/icons-material';
import NavBar from './TopNavBar';
import theme from './CommonTheme';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from "../context/AppContext.jsx";
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const JobMatching = ({ jobId = 'demo-job-123' }) => {
    const navigate = useNavigate();
    const { state } = useAppContext();
    const jobDescription = state.jobDescription;

    const [scores, setScores] = useState([]);
    const [allCVs, setAllCVs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingCVs, setProcessingCVs] = useState(false);
    const [error, setError] = useState(null);
    const [displayLimit, setDisplayLimit] = useState(5);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
    const [jobDetails, setJobDetails] = useState({
        title: "",
        company: "",
        description: "",
        requirements: []
    });

    // Initialize job details from context
    useEffect(() => {
        if (jobDescription && jobDescription.jobTitle) {
            setJobDetails({
                title: jobDescription.jobTitle,
                company: jobDescription.company || "Company",
                description: jobDescription.description || "No description available",
                requirements: jobDescription.technicalSkills?.map(skill => skill.skill) || []
            });
        }
    }, [jobDescription]);

    // Fetch all CVs from database
    useEffect(() => {
        const fetchCVs = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_BASE_URL}/cvs`);
                if (response.data && Array.isArray(response.data)) {
                    setAllCVs(response.data);
                    setNotification({
                        open: true,
                        message: `Successfully fetched ${response.data.length} CVs from database`,
                        severity: 'success'
                    });
                } else {
                    setAllCVs([]);
                    setNotification({
                        open: true,
                        message: 'No CVs found in database',
                        severity: 'info'
                    });
                }
            } catch (err) {
                console.error("Error fetching CVs:", err);
                setError("Failed to fetch CVs from database.");
                setNotification({
                    open: true,
                    message: 'Failed to fetch CVs from database',
                    severity: 'error'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchCVs();
    }, []);

    // processAllCVs function with fixed file creation
    const processAllCVs = async () => {
        if (!jobDescription || !jobDescription.id) {
            setError("No job selected. Please select a job first.");
            setNotification({
                open: true,
                message: 'No job selected. Please select a job first.',
                severity: 'error'
            });
            return;
        }

        if (allCVs.length === 0) {
            setError("No CVs found to process.");
            setNotification({
                open: true,
                message: 'No CVs found to process.',
                severity: 'error'
            });
            return;
        }

        setProcessingCVs(true);
        setScores([]);

        const results = [];
        let processedCount = 0;

        for (const cv of allCVs) {
            try {
                // Skip if no content
                if (!cv.contentText) {
                    console.warn(`Skipping CV ${cv.id} - no content available`);
                    continue;
                }

                // Create form data to send CV file
                const formData = new FormData();
                formData.append('jobId', jobDescription.id);
                console.log(jobDescription.id)

                // Create a text file with the CV content instead of trying to make a DOCX
                // The server just needs to extract text, so a .txt file works best
                let filename = cv.fileName || `cv_${cv.id}`;

                // Make sure the filename has a .txt extension
                if (filename.toLowerCase().endsWith('.docx')) {
                    filename = filename.substring(0, filename.length - 5) + '.txt';
                } else if (filename.toLowerCase().endsWith('.doc')) {
                    filename = filename.substring(0, filename.length - 4) + '.txt';
                } else if (!filename.toLowerCase().endsWith('.txt')) {
                    filename = filename + '.txt';
                }

                // Create a proper text file - TextExtractor can handle .txt files properly
                const file = new File([cv.contentText], filename, { type: 'text/plain' });
                formData.append('file', file);

                // Call the process CV endpoint
                const response = await axios.post(`${API_BASE_URL}/processcv`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (response.data && response.data.result) {
                    const scoreData = response.data.result;

                    // Build a result object
                    const result = {
                        cvId: cv.id,
                        cvName: cv.fileName || "Unknown CV",
                        score: scoreData.score || 0,
                        details: {
                            technicalMatch: scoreData.techScore || 0,
                            experienceMatch: scoreData.industryScore || 0, // Using industry score as proxy for experience
                            educationMatch: scoreData.jdScore || 0 // Using JD score as proxy for education
                        },
                        extractedSkills: cv.techSkills || [],
                        explanation: scoreData.explanation || "",
                        uploadedAt: cv.uploadedAt || new Date().toISOString()
                    };

                    results.push(result);
                }

                processedCount++;
                if (processedCount % 5 === 0) {
                    setNotification({
                        open: true,
                        message: `Processed ${processedCount}/${allCVs.length} CVs`,
                        severity: 'info'
                    });
                }
            } catch (err) {
                console.error(`Error processing CV ${cv.id}:`, err);
            }
        }

        // Sort by score (highest first)
        results.sort((a, b) => b.score - a.score);
        setScores(results);
        setProcessingCVs(false);

        setNotification({
            open: true,
            message: `Completed processing ${results.length} CVs`,
            severity: 'success'
        });
    };

    const handleShowMore = () => {
        setDisplayLimit(prevLimit => prevLimit + 5);
    };

    const handleCloseNotification = () => {
        setNotification({ ...notification, open: false });
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
                    onBack={() => navigate(-1)}
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
                    <Snackbar
                        open={notification.open}
                        autoHideDuration={6000}
                        onClose={handleCloseNotification}
                        message={notification.message}
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    >
                        <Alert
                            onClose={handleCloseNotification}
                            severity={notification.severity}
                            sx={{ width: '100%' }}
                        >
                            {notification.message}
                        </Alert>
                    </Snackbar>

                    <Box sx={{
                        background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                        color: 'white',
                        py: 5,
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                        mb: 4,
                        textAlign: 'center',
                        width: '100%'
                    }}>
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
                                See how well CVs match with job requirements
                            </Typography>
                        </Container>
                    </Box>

                    <Container maxWidth="lg" sx={{ mb: 6, px: { xs: 2, md: 3 } }}>
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
                                    Loading CVs from database...
                                </Typography>
                            </Box>
                        ) : (
                            <>
                                <Card sx={{
                                    borderRadius: 2,
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                    overflow: 'hidden',
                                    mb: 4
                                }}>
                                    <CardContent sx={{ p: 0 }}>
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            p: 3,
                                            bgcolor: '#fff'
                                        }}>
                                            <Avatar sx={{ bgcolor: '#dbeafe', mr: 2 }}>
                                                <WorkIcon sx={{ color: '#3b82f6' }} />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="h6" fontWeight="bold" color="#1e293b">
                                                    {jobDetails.title}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {jobDetails.company}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Divider />

                                        <Box sx={{ p: 3 }}>
                                            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                                                Job Description
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" paragraph>
                                                {jobDetails.description}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ px: 3, pb: 3 }}>
                                            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                                                Required Skills
                                            </Typography>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                {jobDetails.requirements.map((skill, index) => (
                                                    <Chip
                                                        key={index}
                                                        label={skill}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: '#dbeafe',
                                                            color: '#1e40af',
                                                            fontWeight: 500
                                                        }}
                                                    />
                                                ))}
                                            </Box>
                                        </Box>

                                        <Divider />

                                        <Box sx={{ p: 3, textAlign: 'center' }}>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                {allCVs.length} CVs available in database
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={processAllCVs}
                                                disabled={processingCVs || allCVs.length === 0}
                                                sx={{ mt: 1 }}
                                            >
                                                {processingCVs ? 'Processing...' : 'Process All CVs'}
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>

                                {processingCVs ? (
                                    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" my={8}>
                                        <CircularProgress size={60} thickness={4} />
                                        <Typography variant="h6" sx={{ mt: 3 }}>
                                            Processing CVs against job requirements...
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                            This may take a few moments
                                        </Typography>
                                    </Box>
                                ) : scores.length > 0 ? (
                                    <>
                                        <Card sx={{
                                            borderRadius: 2,
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                            mb: 4
                                        }}>
                                            <CardContent>
                                                <Typography variant="h6" fontWeight="bold" color="#1e293b" gutterBottom>
                                                    Match Overview
                                                </Typography>

                                                <Box display="flex" justifyContent="center" alignItems="center" sx={{ my: 4 }}>
                                                    <Box position="relative" display="flex" justifyContent="center" alignItems="center">
                                                        <CircularProgress
                                                            variant="determinate"
                                                            value={100}
                                                            size={150}
                                                            thickness={5}
                                                            sx={{ color: 'rgba(0, 0, 0, 0.08)' }}
                                                        />
                                                        <CircularProgress
                                                            variant="determinate"
                                                            value={matchPercentage}
                                                            size={150}
                                                            thickness={5}
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
                                                            <Typography variant="h4" fontWeight="bold" color="#1e293b">
                                                                {matchPercentage}%
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                Match Rate
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </Box>

                                                <Box sx={{ textAlign: 'center', mb: 2 }}>
                                                    <Typography variant="body1" color="#4b5563">
                                                        {matchedJobsCount} of {totalJobsCount} CVs have strong matches
                                                    </Typography>
                                                </Box>

                                                <Divider sx={{ my: 3 }} />

                                                <Typography variant="body2" color="text.secondary" textAlign="center">
                                                    Scroll down to view detailed match analysis for each CV
                                                </Typography>
                                            </CardContent>
                                        </Card>

                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                            <Typography variant="h6" fontWeight="bold" color="#1e293b">
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
                                                    width: '100%',
                                                    mb: 3,
                                                    borderRadius: 2,
                                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
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
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                <Avatar
                                                                    variant="rounded"
                                                                    sx={{
                                                                        bgcolor: '#dbeafe',
                                                                        color: '#3b82f6',
                                                                        mr: 2
                                                                    }}
                                                                >
                                                                    <InsertDriveFileIcon />
                                                                </Avatar>
                                                                <Box>
                                                                    <Typography variant="h6" fontWeight="bold" color="#1e293b">
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

                                                            <Box sx={{ mt: 3 }}>
                                                                <Grid container spacing={2} justifyContent="center" textAlign="center">
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
                                                                            JD Match
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
                                                                        justifyContent: 'center'
                                                                    }}
                                                                >
                                                                    <Typography variant="h6" fontWeight="bold" color="#1e293b">
                                                                        {score.score.toFixed(1)}%
                                                                    </Typography>
                                                                </Box>
                                                            </Box>

                                                            <Chip
                                                                label={score.score >= 80 ? "Strong Match" : score.score >= 60 ? "Good Match" : "Partial Match"}
                                                                sx={{
                                                                    bgcolor: score.score >= 80 ? '#dcfce7' : score.score >= 60 ? '#fef9c3' : '#fee2e2',
                                                                    color: score.score >= 80 ? '#166534' : score.score >= 60 ? '#854d0e' : '#b91c1c',
                                                                    fontWeight: 'medium',
                                                                    mb: 2
                                                                }}
                                                                size="small"
                                                            />
                                                        </Grid>
                                                    </Grid>

                                                    <Accordion sx={{ mt: 3, bgcolor: 'transparent', boxShadow: 'none', border: '1px solid #e5e7eb', borderRadius: 2 }}>
                                                        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ justifyContent: 'center' }}>
                                                            <Typography fontWeight="medium" textAlign="center" width="100%" color="#4b5563">
                                                                View More Details
                                                            </Typography>
                                                        </AccordionSummary>

                                                        <AccordionDetails sx={{ p: 0 }}>
                                                            <Box sx={{ width: '100%', px: 3, py: 2 }}>
                                                                <Card sx={{ bgcolor: '#f0f9ff', p: 3, mb: 2, width: '100%', borderRadius: 2, boxShadow: 'none' }}>
                                                                    <Typography variant="h6" fontWeight="bold" textAlign="center" color="#1e293b">
                                                                        Job Info
                                                                    </Typography>
                                                                    <Typography align="center">Title: {jobDetails.title}</Typography>
                                                                    <Typography align="center">Industry: {jobDescription?.industry || "Not specified"}</Typography>
                                                                    <Typography align="center">Description:</Typography>
                                                                    <Typography align="center" paragraph>
                                                                        {jobDetails.description.substring(0, 150)}
                                                                        {jobDetails.description.length > 150 ? "..." : ""}
                                                                    </Typography>
                                                                </Card>

                                                                <Card sx={{ bgcolor: '#f0f9ff', p: 3, mb: 2, width: '100%', borderRadius: 2, boxShadow: 'none' }}>
                                                                    <Typography variant="h6" fontWeight="bold" textAlign="center" color="#1e293b">
                                                                        Candidate Info
                                                                    </Typography>
                                                                    <Typography align="center">File: {score.cvName}</Typography>
                                                                    <Typography align="center">Uploaded: {new Date(score.uploadedAt).toLocaleDateString()}</Typography>
                                                                    <Typography variant="subtitle2" align="center">Extracted Skills:</Typography>
                                                                    <Box display="flex" justifyContent="center" flexWrap="wrap" gap={1} mt={1}>
                                                                        {score.extractedSkills && score.extractedSkills.length > 0 ? (
                                                                            score.extractedSkills.map((skill, i) => (
                                                                                <Chip key={i} label={skill} color="primary" size="small" />
                                                                            ))
                                                                        ) : (
                                                                            <Typography variant="body2" color="text.secondary">
                                                                                No skills extracted
                                                                            </Typography>
                                                                        )}
                                                                    </Box>
                                                                </Card>

                                                                <Card sx={{ bgcolor: '#f0f9ff', p: 3, mb: 2, width: '100%', borderRadius: 2, boxShadow: 'none' }}>
                                                                    <Typography variant="subtitle2" fontWeight="bold" textAlign="center" color="#1e293b">
                                                                        Required Skills:
                                                                    </Typography>
                                                                    <Box sx={{ mt: 1, textAlign: 'center' }}>
                                                                        {jobDescription && jobDescription.technicalSkills && jobDescription.technicalSkills.length > 0 ? (
                                                                            jobDescription.technicalSkills.map((skill, i) => (
                                                                                <Typography key={i}>{skill.skill} - {skill.weight}%</Typography>
                                                                            ))
                                                                        ) : (
                                                                            <Typography variant="body2" color="text.secondary">
                                                                                No required skills specified
                                                                            </Typography>
                                                                        )}
                                                                    </Box>
                                                                </Card>

                                                                <Card sx={{ bgcolor: '#f0f9ff', p: 3, width: '100%', borderRadius: 2, boxShadow: 'none' }}>
                                                                    <Typography variant="h6" fontWeight="bold" textAlign="center" color="#1e293b">
                                                                        Explanation
                                                                    </Typography>
                                                                    <Typography>
                                                                        {score.explanation || `This candidate scored ${score.score.toFixed(1)}% matching the job requirements.`}
                                                                    </Typography>
                                                                </Card>
                                                            </Box>
                                                        </AccordionDetails>
                                                    </Accordion>
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
                                    </>
                                ) : (
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
                                            No CV matches found
                                        </Typography>
                                        <Typography variant="body2" color="#6b7280">
                                            Click the "Process All CVs" button above to analyze CVs against this job
                                        </Typography>
                                    </Card>
                                )}
                            </>
                        )}
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default JobMatching;