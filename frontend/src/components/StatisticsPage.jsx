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
    Paper
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import NavBar from './TopNavBar';
import theme from './CommonTheme';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts';
import { FilterAlt, Business, CalendarMonth } from '@mui/icons-material';

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

function StatisticsPage({ onBack, onNavigate }) {
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
                        {/* Filters */}
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
                                <FormControl fullWidth>
                                    <Select
                                        displayEmpty
                                        value=""
                                        renderValue={() => (
                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1.5,
                                                py: 1,
                                                px: 1.5
                                            }}>
                                                <Business sx={{ color: 'primary.main' }} />
                                                <Typography sx={{ fontWeight: 500 }}>Job Title</Typography>
                                            </Box>
                                        )}
                                        sx={{
                                            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                            fontSize: '1rem',
                                            height: '56px'
                                        }}
                                    >
                                        <MenuItem value="">All Jobs</MenuItem>
                                        <MenuItem value="Frontend">Frontend Developer</MenuItem>
                                        <MenuItem value="Java">Java Engineer</MenuItem>
                                        <MenuItem value="Data">Data Analyst</MenuItem>
                                        <MenuItem value="DevOps">DevOps Engineer</MenuItem>
                                    </Select>
                                </FormControl>
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
                                <FormControl fullWidth>
                                    <Select
                                        displayEmpty
                                        value=""
                                        renderValue={() => (
                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1.5,
                                                py: 1,
                                                px: 1.5
                                            }}>
                                                <FilterAlt sx={{ color: 'primary.main' }} />
                                                <Typography sx={{ fontWeight: 500 }}>Industry</Typography>
                                            </Box>
                                        )}
                                        sx={{
                                            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                            fontSize: '1rem',
                                            height: '56px'
                                        }}
                                    >
                                        <MenuItem value="">All Industries</MenuItem>
                                        <MenuItem value="Tech">Technology</MenuItem>
                                        <MenuItem value="Finance">Finance</MenuItem>
                                        <MenuItem value="Healthcare">Healthcare</MenuItem>
                                        <MenuItem value="Education">Education</MenuItem>
                                    </Select>
                                </FormControl>
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
                                <FormControl fullWidth>
                                    <Select
                                        displayEmpty
                                        value=""
                                        renderValue={() => (
                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1.5,
                                                py: 1,
                                                px: 1.5
                                            }}>
                                                <CalendarMonth sx={{ color: 'primary.main' }} />
                                                <Typography sx={{ fontWeight: 500 }}>Date Range</Typography>
                                            </Box>
                                        )}
                                        sx={{
                                            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                                            fontSize: '1rem',
                                            height: '56px'
                                        }}
                                    >
                                        <MenuItem value="">All Time</MenuItem>
                                        <MenuItem value="30d">Last 30 Days</MenuItem>
                                        <MenuItem value="7d">Last 7 Days</MenuItem>
                                        <MenuItem value="90d">Last 90 Days</MenuItem>
                                    </Select>
                                </FormControl>
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
                                            <Typography variant="h2" fontWeight="bold" color="primary.dark" sx={{ my: 2 }}>120</Typography>
                                            <Typography variant="body1" color="text.secondary">
                                                +12% from previous period
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
                                            <Typography variant="h2" fontWeight="bold" color="primary.dark" sx={{ my: 2 }}>34</Typography>
                                            <Typography variant="body1" color="text.secondary">
                                                +5 new jobs this month
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
                                            <Typography variant="h2" fontWeight="bold" color="primary.dark" sx={{ my: 2 }}>76%</Typography>
                                            <Typography variant="body1" color="text.secondary">
                                                +3% improvement from last month
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Box>

                        <Box sx={{ maxWidth: '1500px', mx: 'auto' }}>
                            <Grid container spacing={4} justifyContent="center">
                                {/* First Row: Two charts side by side */}
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
                                                            data={scoreDistribution}
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
                                                            {scoreDistribution.map((entry, index) => (
                                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip formatter={(value) => [`${value} CVs`, 'Count']} />
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
                                                        data={topJobs}
                                                        layout="vertical"
                                                        margin={{ left: 20, right: 40, top: 20, bottom: 20 }}
                                                    >
                                                        <XAxis type="number" domain={[0, 100]} />
                                                        <YAxis dataKey="job" type="category" width={160} tick={{ fontSize: 14 }} />
                                                        <Tooltip formatter={(value) => [`${value}%`, 'Match Score']} />
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
                                                Average Score Breakdown per Job
                                            </Typography>
                                            <Box sx={{ height: 400, width: '100%', mx: 'auto' }}>
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart
                                                        data={scoreBreakdown}
                                                        margin={{ left: 20, right: 40, top: 40, bottom: 20 }}
                                                    >
                                                        <XAxis dataKey="job" tick={{ fontSize: 16 }} />
                                                        <YAxis domain={[0, 100]} tick={{ fontSize: 14 }} />
                                                        <Tooltip formatter={(value) => [`${value}%`, '']} />
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
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default StatisticsPage;