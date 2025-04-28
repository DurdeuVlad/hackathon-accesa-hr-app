import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Container,
    Grid,
    Card,
    CardContent,
    CssBaseline,
    MenuItem,
    Select,
    FormControl,
    Paper,
    CircularProgress,
    Alert
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import NavBar from './TopNavBar';
import theme from './CommonTheme';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts';
import { FilterAlt, Business, CalendarMonth } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Colors for charts
const COLORS = ['#ef4444', '#facc15', '#22c55e'];

function StatisticsPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetchStatistics();
    }, []);

    const fetchStatistics = async () => {
        try {
            setLoading(true);
            setError('');

            const API_URL = "http://localhost:8080";
            const response = await fetch(`${API_URL}/statistics`);
            console.log(response)

            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Error Response:', errorText);
                throw new Error(`Error fetching statistics: ${response.status}`);
            }

            const data = await response.json();
            console.log('Statistics data:', data);
            setStats(data);
        } catch (err) {
            console.error('Failed to fetch statistics:', err);
            setError(`Failed to load statistics: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Transform score distribution data for pie chart
    const getScoreDistributionData = () => {
        if (!stats || !stats.scoreDistribution) return [];

        return Object.entries(stats.scoreDistribution).map(([range, count]) => ({
            name: range,
            value: count
        }));
    };

    // Transform top jobs data for bar chart
    const getTopJobsData = () => {
        if (!stats || !stats.topJobsByAvgScore) return [];

        return stats.topJobsByAvgScore.map(job => ({
            job: job.title,
            score: Math.round(job.avgScore)
        }));
    };

    // Create data for score components bar chart
    const getScoreComponentsData = () => {
        if (!stats || !stats.topJobsByAvgScore || !stats.avgScoreComponents) return [];

        const avgComponents = stats.avgScoreComponents;

        // For simplicity, we'll just show average score components
        return [
            {
                job: 'Average',
                technical: Math.round(avgComponents.tech),
                industry: Math.round(avgComponents.industry),
                jd: Math.round(avgComponents.jd)
            }
        ];
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
                    title="Statistics Dashboard"
                    currentPage="statisticspage"
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
                        width: '100%',
                        mb: 4
                    }}>
                        <Container maxWidth={false} sx={{ px: { xs: 2, md: 6 } }}>
                            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom textAlign="center">
                                Recruitment Analytics Dashboard
                            </Typography>
                            <Typography variant="h6" sx={{ opacity: 0.9, textAlign: 'center' }}>
                                Track performance metrics and match statistics for your recruitment process
                            </Typography>
                        </Container>
                    </Box>

                    <Container maxWidth="xl" sx={{ px: { xs: 2, md: 6 }, pb: 6 }}>
                        {loading ? (
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10 }}>
                                <CircularProgress size={60} thickness={4} />
                                <Typography variant="h6" sx={{ mt: 3 }}>
                                    Loading statistics...
                                </Typography>
                            </Box>
                        ) : error ? (
                            <Alert severity="error" sx={{ my: 4 }}>
                                {error}
                            </Alert>
                        ) : stats ? (
                            <>
                                <Box sx={{
                                    maxWidth: '1100px',
                                    mx: 'auto',
                                    mb: 5,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    gap: 2
                                }}>
                                    <Paper
                                        elevation={1}
                                        sx={{
                                            flex: 1,
                                            borderRadius: 2,
                                            overflow: 'hidden',
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                            }
                                        }}
                                    >
                                    </Paper>

                                    <Paper
                                        elevation={1}
                                        sx={{
                                            flex: 1,
                                            borderRadius: 2,
                                            overflow: 'hidden',
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                            }
                                        }}
                                    >
                                    </Paper>

                                    <Paper
                                        elevation={1}
                                        sx={{
                                            flex: 1,
                                            borderRadius: 2,
                                            overflow: 'hidden',
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                            }
                                        }}
                                    >
                                    </Paper>
                                </Box>

                                <Box sx={{ maxWidth: '1500px', mx: 'auto', mb: 5 }}>
                                    <Grid container spacing={4} justifyContent="center">
                                        <Grid item xs={12} sm={6} md={4}>
                                            <Card sx={{
                                                height: '100%',
                                                borderRadius: 3,
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-4px)',
                                                    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)',
                                                }
                                            }}>
                                                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                                                    <Typography variant="h5" color="text.secondary" gutterBottom>CVs Processed</Typography>
                                                    <Typography variant="h2" fontWeight="bold" color="primary.dark" sx={{ my: 2 }}>
                                                        {stats.totalCVs}
                                                    </Typography>
                                                    <Typography variant="body1" color="text.secondary">
                                                        Total CVs in database
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <Card sx={{
                                                height: '100%',
                                                borderRadius: 3,
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-4px)',
                                                    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)',
                                                }
                                            }}>
                                                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                                                    <Typography variant="h5" color="text.secondary" gutterBottom>Job Descriptions</Typography>
                                                    <Typography variant="h2" fontWeight="bold" color="primary.dark" sx={{ my: 2 }}>
                                                        {stats.totalJobs}
                                                    </Typography>
                                                    <Typography variant="body1" color="text.secondary">
                                                        Active job postings
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <Card sx={{
                                                height: '100%',
                                                borderRadius: 3,
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-4px)',
                                                    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)',
                                                }
                                            }}>
                                                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                                                    <Typography variant="h5" color="text.secondary" gutterBottom>Average Match Score</Typography>
                                                    <Typography variant="h2" fontWeight="bold" color="primary.dark" sx={{ my: 2 }}>
                                                        {stats.avgMatchScore}%
                                                    </Typography>
                                                    <Typography variant="body1" color="text.secondary">
                                                        Across all evaluations
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </Grid>
                                </Box>

                                <Box sx={{ maxWidth: '1500px', mx: 'auto' }}>
                                    <Grid container spacing={4} justifyContent="center">
                                        <Grid item xs={12} md={12} lg={6}>
                                            <Card sx={{
                                                borderRadius: 3,
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                                transition: 'box-shadow 0.2s ease',
                                                '&:hover': {
                                                    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)',
                                                },
                                                minWidth: '100%'
                                            }}>
                                                <CardContent sx={{ p: 4 }}>
                                                    <Typography variant="h5" fontWeight="bold" gutterBottom textAlign="center">
                                                        Score Distribution
                                                    </Typography>
                                                    <Box sx={{
                                                        height: 400,
                                                        pt: 2,
                                                        mx: 'auto',
                                                        width: '100%',
                                                        minWidth: { xs: '300px', sm: '400px', md: '600px' }
                                                    }}>
                                                        <ResponsiveContainer width="100%" height="100%">
                                                            <PieChart margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
                                                                <Pie
                                                                    data={getScoreDistributionData()}
                                                                    dataKey="value"
                                                                    nameKey="name"
                                                                    cx="50%"
                                                                    cy="50%"
                                                                    outerRadius={120}
                                                                    innerRadius={60}
                                                                    paddingAngle={2}
                                                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                                    labelLine={true}
                                                                    fontSize={16}
                                                                >
                                                                    {getScoreDistributionData().map((entry, index) => (
                                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                                    ))}
                                                                </Pie>
                                                                <RechartsTooltip formatter={(value) => [`${value} CVs`, 'Count']} />
                                                                <Legend verticalAlign="bottom" height={36} />
                                                            </PieChart>
                                                        </ResponsiveContainer>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Grid>

                                        <Grid item xs={12} md={12} lg={6}>
                                            <Card sx={{
                                                borderRadius: 3,
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                                transition: 'box-shadow 0.2s ease',
                                                '&:hover': {
                                                    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)',
                                                },
                                                minWidth: '100%'
                                            }}>
                                                <CardContent sx={{ p: 4 }}>
                                                    <Typography variant="h5" fontWeight="bold" gutterBottom textAlign="center">
                                                        Top 5 Jobs by Match Score
                                                    </Typography>
                                                    <Box sx={{ height: 400, pt: 2, width: '100%' }}>
                                                        <ResponsiveContainer width="100%" height="100%">
                                                            <BarChart
                                                                data={getTopJobsData()}
                                                                layout="vertical"
                                                                margin={{ left: 20, right: 40, top: 20, bottom: 20 }}
                                                            >
                                                                <XAxis type="number" domain={[0, 100]} />
                                                                <YAxis dataKey="job" type="category" width={160} tick={{ fontSize: 14 }} />
                                                                <RechartsTooltip formatter={(value) => [`${value}%`, 'Match Score']} />
                                                                <Bar dataKey="score" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={35} />
                                                            </BarChart>
                                                        </ResponsiveContainer>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Card sx={{
                                                borderRadius: 3,
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                                transition: 'box-shadow 0.2s ease',
                                                '&:hover': {
                                                    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)',
                                                },
                                                width: '100%'
                                            }}>
                                                <CardContent sx={{ p: 4 }}>
                                                    <Typography variant="h5" fontWeight="bold" gutterBottom textAlign="center">
                                                        Average Score Breakdown
                                                    </Typography>
                                                    <Box sx={{ height: 400, width: '101%', mx: 'auto' }}>
                                                        <ResponsiveContainer width="100%" height="100%">
                                                            <BarChart
                                                                data={getScoreComponentsData()}
                                                                margin={{ left: 20, right: 40, top: 40, bottom: 20 }}
                                                            >
                                                                <XAxis dataKey="job" tick={{ fontSize: 16 }} />
                                                                <YAxis domain={[0, 100]} tick={{ fontSize: 14 }} />
                                                                <RechartsTooltip formatter={(value) => [`${value}%`, '']} />
                                                                <Legend
                                                                    verticalAlign="top"
                                                                    height={36}
                                                                    wrapperStyle={{ paddingBottom: "20px" }}
                                                                />
                                                                <Bar
                                                                    dataKey="technical"
                                                                    name="Technical Skills"
                                                                    fill="#3b82f6"
                                                                    barSize={40}
                                                                />
                                                                <Bar
                                                                    dataKey="industry"
                                                                    name="Industry Knowledge"
                                                                    fill="#f59e0b"
                                                                    barSize={40}
                                                                />
                                                                <Bar
                                                                    dataKey="jd"
                                                                    name="Job Description Match"
                                                                    fill="#10b981"
                                                                    barSize={40}
                                                                />
                                                            </BarChart>
                                                        </ResponsiveContainer>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </>
                        ) : (
                            <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ my: 8 }}>
                                No statistics data available
                            </Typography>
                        )}
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default StatisticsPage;