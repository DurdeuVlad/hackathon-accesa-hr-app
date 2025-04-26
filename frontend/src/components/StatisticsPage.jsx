import {
    Box, Typography, Container, Grid, Card, CardContent, CssBaseline, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import NavBar from './TopNavBar';
import theme from './CommonTheme';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const scoreDistribution = [
    { name: '0–50%', value: 4 },
    { name: '51–75%', value: 9 },
    { name: '76–100%', value: 7 },
];

const topJobs = [
    { job: 'Frontend Developer', score: 91 },
    { job: 'Java Engineer', score: 89 },
    { job: 'Data Analyst', score: 85 },
    { job: 'DevOps Engineer', score: 83 },
    { job: 'UI/UX Designer', score: 81 },
];

const scoreBreakdown = [
    { job: 'Frontend Dev', technical: 80, industry: 70, jd: 85 },
    { job: 'Java Engineer', technical: 90, industry: 75, jd: 88 },
    { job: 'Data Analyst', technical: 75, industry: 65, jd: 82 },
];

const COLORS = ['#ef4444', '#facc15', '#22c55e'];

function StatisticsPage({ onBack }) {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <NavBar showBackButton={true} onBack={onBack} title="Statistics" currentPage="statistics" />
            <Container maxWidth="lg" sx={{ py: 4 }}>

                {/* Filters */}
                <Grid container spacing={2} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={4}>
                        <FormControl fullWidth>
                            <InputLabel id="filter-job">Job Title</InputLabel>
                            <Select labelId="filter-job" label="Job Title" defaultValue="">
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="Frontend">Frontend Developer</MenuItem>
                                <MenuItem value="Java">Java Engineer</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <FormControl fullWidth>
                            <InputLabel id="filter-range">Date Range</InputLabel>
                            <Select labelId="filter-range" label="Date Range" defaultValue="">
                                <MenuItem value="">All Time</MenuItem>
                                <MenuItem value="30d">Last 30 Days</MenuItem>
                                <MenuItem value="7d">Last 7 Days</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                {/* KPI Cards */}
                <Grid container spacing={4} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" color="text.secondary">CVs Processed</Typography>
                                <Typography variant="h4" fontWeight="bold">120</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" color="text.secondary">Job Descriptions</Typography>
                                <Typography variant="h4" fontWeight="bold">34</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" color="text.secondary">Average Match Score</Typography>
                                <Typography variant="h4" fontWeight="bold">76%</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Charts */}
                <Grid container spacing={4}>
                    {/* Pie Chart - Score Distribution */}
                    <Grid item xs={12} md={6}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    Score Distribution
                                </Typography>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={scoreDistribution}
                                            dataKey="value"
                                            nameKey="name"
                                            outerRadius={80}
                                            label
                                        >
                                            {scoreDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Bar Chart - Top 5 Jobs */}
                    <Grid item xs={12} md={6}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    Top 5 Jobs by Match Score
                                </Typography>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={topJobs}>
                                        <XAxis dataKey="job" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="score" fill="#3b82f6" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Bar Chart - Score Breakdown */}
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    Average Score Breakdown per Job
                                </Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={scoreBreakdown}>
                                        <XAxis dataKey="job" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="technical" fill="#3b82f6" name="Technical" />
                                        <Bar dataKey="industry" fill="#f59e0b" name="Industry" />
                                        <Bar dataKey="jd" fill="#10b981" name="JD Match" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </ThemeProvider>
    );
}

export default StatisticsPage;