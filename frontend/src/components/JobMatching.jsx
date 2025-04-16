import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    CircularProgress,
    Grid,
    CssBaseline
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { getJobScores } from './jobService';
import TopNavBar from './TopNavBar';

const theme = createTheme({
    palette: {
        primary: {
            main: '#2196f3',
            light: '#64b5f6',
            dark: '#1976d2',
        },
        background: {
            default: '#e3f2fd',
        }
    },
});

const JobMatching = ({ onBack, onNavigate, jobId = 'demo-job-123' }) => {
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getJobScores(jobId).then((res) => {
            setScores(res);
            setLoading(false);
        });
    }, [jobId]);

    const matchedJobsCount = scores.filter(score => score.score >= 80).length;
    const totalJobsCount = scores.length;
    const matchPercentage = totalJobsCount ? (matchedJobsCount / totalJobsCount) * 100 : 0;

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <div>
                <TopNavBar
                    showBackButton={true}
                    onBack={onBack}
                    onNavigate={onNavigate}
                    title="Job Matching"
                    currentPage="jobmatching"
                />

                <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
                    <Typography variant="h4" align="center" fontWeight="bold" color="primary.main" gutterBottom>
                        Job Matched CV
                    </Typography>

                    {/* Un cerc pentru statistica potrivirii */}
                    <Box display="flex" justifyContent="center" alignItems="center" sx={{ mb: 4 }}>
                        <Box position="relative" width="120px" height="120px">
                            <svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                                <circle
                                    cx="60"
                                    cy="60"
                                    r="50"
                                    stroke="#d3d3d3"
                                    strokeWidth="8"
                                    fill="none"
                                />
                                <circle
                                    cx="60"
                                    cy="60"
                                    r="50"
                                    stroke={matchPercentage > 80 ? "#4caf50" : matchPercentage > 40 ? "#ff9800" : "#f44336"}
                                    strokeWidth="8"
                                    fill="none"
                                    strokeDasharray={`${matchPercentage * Math.PI * 2} ${Math.PI * 2}`}
                                    strokeDashoffset={`-25`}
                                    transform="rotate(-90 60 60)"
                                />
                                <text x="50%" y="50%" alignmentBaseline="middle" textAnchor="middle" fontSize="16" fill="#000">
                                    {Math.round(matchPercentage)}%
                                </text>
                            </svg>
                        </Box>
                    </Box>

                    {/* Lista cu joburile care se potrivesc */}
                    {loading ? (
                        <Box display="flex" justifyContent="center" alignItems="center" minHeight="30vh">
                            <CircularProgress color="primary" />
                        </Box>
                    ) : (
                        <Box sx={{ maxHeight: 600, overflowY: 'auto' }}>
                            <Grid container spacing={3}>
                                {scores.map((score, index) => (
                                    <Grid item xs={12} sm={6} md={4} key={index}>
                                        <Paper elevation={4} sx={{
                                            p: 3,
                                            borderRadius: 3,
                                            background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                                            boxShadow: '0 3px 6px rgba(33, 150, 243, 0.2)'
                                        }}>
                                            <Typography variant="h6" fontWeight="bold" color="primary.dark">
                                                {score.cvName || 'No CV Name Available'}
                                            </Typography>
                                            <Typography variant="body2" sx={{ mt: 1 }}>
                                                <strong>Description:</strong> {score.jobDescription || 'No description available'}
                                            </Typography>
                                            <Typography variant="body1" sx={{ mt: 1 }}>
                                                <strong>Matching score:</strong> {score.score}%
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    )}
                </Container>
            </div>
        </ThemeProvider>
    );
};

export default JobMatching;