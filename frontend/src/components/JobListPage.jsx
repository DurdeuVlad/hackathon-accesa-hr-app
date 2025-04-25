import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    TextField,
    InputAdornment,
    Select,
    MenuItem,
    Grid,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Stack,
    Container,
    Paper,
    IconButton,
    Tooltip,
    CircularProgress,
    Fade,
    Avatar,
    CssBaseline
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import {
    Search,
    Add,
    Delete,
    Edit,
    Visibility,
    WarningAmber,
    Business,
    CalendarToday,
    FilterList,
    Sort,
    BookmarkBorder,
    Bookmark,
    Person
} from '@mui/icons-material';
import NavBar from './TopNavBar';
import theme from './CommonTheme';
const JobListPage = ({ onBack, onNavigate }) => {
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [jobToDelete, setJobToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterIndustry, setFilterIndustry] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [sortOrder, setSortOrder] = useState('newest');
    const [savedJobs, setSavedJobs] = useState([]);

    useEffect(() => {
        setTimeout(() => {
            const mockJobs = [
                {
                    id: "job1",
                    jobTitle: "Mid-Level Frontend Developer",
                    industry: "Technology",
                    company: "TechCorp Solutions",
                    location: "San Francisco, CA",
                    description: "Develop and maintain responsive web applications using React and modern JavaScript frameworks. Work with a team of designers and backend developers to create seamless user experiences.",
                    technicalSkills: [
                        { skill: "React", weight: 40 },
                        { skill: "JavaScript", weight: 30 },
                        { skill: "CSS", weight: 20 },
                        { skill: "HTML", weight: 10 }
                    ],
                    createdAt: new Date(2023, 11, 10),
                    applicants: 12
                },
                {
                    id: "job2",
                    jobTitle: "Senior Machine Learning Engineer",
                    industry: "Banking",
                    company: "FinTech Innovations",
                    location: "New York, NY",
                    description: "Design and implement machine learning solutions for financial data analysis and fraud detection. Collaborate with data scientists to develop predictive models and deploy them in a production environment.",
                    technicalSkills: [
                        { skill: "Python", weight: 35 },
                        { skill: "TensorFlow", weight: 35 },
                        { skill: "SQL", weight: 20 },
                        { skill: "AWS", weight: 10 }
                    ],
                    createdAt: new Date(2023, 11, 15),
                    applicants: 8
                },
                {
                    id: "job3",
                    jobTitle: "DevOps Engineer",
                    industry: "Healthcare",
                    company: "MediTech Systems",
                    location: "Boston, MA",
                    description: "Manage and improve our CI/CD pipelines, implement infrastructure as code, and ensure high availability of our healthcare applications. Work closely with development teams to streamline deployment processes.",
                    technicalSkills: [
                        { skill: "Docker", weight: 30 },
                        { skill: "Kubernetes", weight: 30 },
                        { skill: "AWS", weight: 25 },
                        { skill: "Terraform", weight: 15 }
                    ],
                    createdAt: new Date(2023, 11, 5),
                    applicants: 15
                },
                {
                    id: "job4",
                    jobTitle: "Full Stack Developer",
                    industry: "E-commerce",
                    company: "ShopWave",
                    location: "Remote",
                    description: "Build and enhance features for our e-commerce platform. Work on both frontend and backend components using modern technologies to create seamless shopping experiences for millions of users.",
                    technicalSkills: [
                        { skill: "React", weight: 25 },
                        { skill: "Node.js", weight: 25 },
                        { skill: "PostgreSQL", weight: 25 },
                        { skill: "Redis", weight: 25 }
                    ],
                    createdAt: new Date(2023, 11, 12),
                    applicants: 22
                }
            ];
            setJobs(mockJobs);
            setIsLoading(false);
        }, 1200);
    }, []);

    const confirmDelete = (jobId, event) => {
        event.stopPropagation();
        setJobToDelete(jobId);
        setShowDeleteConfirm(true);
    };

    const deleteJob = () => {
        setJobs(jobs.filter(job => job.id !== jobToDelete));
        setShowDeleteConfirm(false);
        setJobToDelete(null);
    };

    const toggleSaveJob = (jobId, event) => {
        event.stopPropagation();
        if (savedJobs.includes(jobId)) {
            setSavedJobs(savedJobs.filter(id => id !== jobId));
        } else {
            setSavedJobs([...savedJobs, jobId]);
        }
    };

    const processedJobs = jobs
        .filter(job => {
            const matchesTerm = job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.company.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesIndustry = filterIndustry === '' ||
                job.industry.toLowerCase() === filterIndustry.toLowerCase();
            return matchesTerm && matchesIndustry;
        })
        .sort((a, b) => {
            if (sortOrder === 'newest') {
                return new Date(b.createdAt) - new Date(a.createdAt);
            } else if (sortOrder === 'oldest') {
                return new Date(a.createdAt) - new Date(b.createdAt);
            } else if (sortOrder === 'alphabetical') {
                return a.jobTitle.localeCompare(b.jobTitle);
            }
            return 0;
        });

    const uniqueIndustries = [...new Set(jobs.map(job => job.industry))];

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    const getRandomColor = (industry) => {
        const colors = {
            'Technology': '#3b82f6',
            'Banking': '#10b981',
            'Healthcare': '#ef4444',
            'E-commerce': '#f59e0b'
        };
        return colors[industry] || '#6366f1';
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
                    title="Job Listings"
                    currentPage="joblist"
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
                        width: '100%'
                    }}>
                        <Container maxWidth={false} sx={{ textAlign: 'center', px: 4 }}>
                            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                                DevMatch Job Listings
                            </Typography>
                            <Typography variant="h6" sx={{ opacity: 0.9, mx: 'auto', maxWidth: 700 }}>
                                Find the perfect match for your technical positions
                            </Typography>

                            <Box sx={{
                                display: 'flex',
                                gap: 2,
                                flexWrap: 'wrap',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mt: 4  // Added top margin
                            }}>
                                <TextField
                                    placeholder="Search for jobs, skills, or companies..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    sx={{
                                        bgcolor: 'white',
                                        borderRadius: 2,
                                        width: { xs: '100%', sm: 320 },
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': {
                                                borderColor: 'white',
                                            },
                                        },
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Search color="primary" />
                                            </InputAdornment>
                                        )
                                    }}
                                />

                                <Tooltip title="Toggle filters">
                                    <Button
                                        variant="contained"
                                        onClick={() => setShowFilters(!showFilters)}
                                        sx={{
                                            bgcolor: showFilters ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.2)',
                                            color: 'white',
                                            '&:hover': { bgcolor: 'rgba(255,255,255,0.4)' },
                                        }}
                                        startIcon={<FilterList />}
                                    >
                                        Filters
                                    </Button>
                                </Tooltip>

                                <Button
                                    variant="contained"
                                    startIcon={<Add />}
                                    sx={{
                                        bgcolor: '#10b981',
                                        '&:hover': { bgcolor: '#059669' },
                                    }}
                                    onClick={() => console.log("Adding new job")}
                                >
                                    Add New Job
                                </Button>
                            </Box>
                        </Container>
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
                    </Box>
                    <Container maxWidth={false} sx={{ py: 4, px: { xs: 2, sm: 4 } }}>
                        {/* Filter Section */}
                        <Fade in={showFilters}>
                            <Paper sx={{ mb: 4, p: 3, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                                <Typography variant="h6" fontWeight={600} mb={2}>Filter Options</Typography>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <Typography variant="subtitle2" mb={1}>Industry</Typography>
                                        <Select
                                            value={filterIndustry}
                                            onChange={(e) => setFilterIndustry(e.target.value)}
                                            displayEmpty
                                            fullWidth
                                            size="small"
                                        >
                                            <MenuItem value="">All Industries</MenuItem>
                                            {uniqueIndustries.map((industry, index) => (
                                                <MenuItem key={index} value={industry}>{industry}</MenuItem>
                                            ))}
                                        </Select>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={4}>
                                        <Typography variant="subtitle2" mb={1}>Sort By</Typography>
                                        <Select
                                            value={sortOrder}
                                            onChange={(e) => setSortOrder(e.target.value)}
                                            fullWidth
                                            size="small"
                                        >
                                            <MenuItem value="newest">Newest First</MenuItem>
                                            <MenuItem value="oldest">Oldest First</MenuItem>
                                            <MenuItem value="alphabetical">Alphabetical</MenuItem>
                                        </Select>
                                    </Grid>
                                    <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'flex-end' }}>
                                        <Button
                                            variant="outlined"
                                            onClick={() => {
                                                setFilterIndustry('');
                                                setSortOrder('newest');
                                                setSearchTerm('');
                                            }}
                                            fullWidth
                                        >
                                            Clear All Filters
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Fade>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="subtitle1" fontWeight={500}>
                                {isLoading ? 'Loading jobs...' : `${processedJobs.length} job${processedJobs.length !== 1 ? 's' : ''} found`}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Sort fontSize="small" color="action" />
                                <Typography variant="body2" color="text.secondary">
                                    Sorted by: {sortOrder === 'newest' ? 'Newest' : sortOrder === 'oldest' ? 'Oldest' : 'A-Z'}
                                </Typography>
                            </Box>
                        </Box>
                        {isLoading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            processedJobs.length > 0 ? (
                                <Grid container spacing={3}>
                                    {processedJobs.map(job => (
                                        <Grid item xs={12} key={job.id}>
                                            <Card
                                                sx={{
                                                    borderRadius: 2,
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                                    transition: 'all 0.2s ease-in-out',
                                                    cursor: 'pointer',
                                                    '&:hover': {
                                                        transform: 'translateY(-4px)',
                                                        boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
                                                    }
                                                }}
                                                onClick={() => onNavigate('jobdetail')}
                                            >
                                                <CardContent sx={{ p: 3 }}>
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={12} md={8}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                                <Avatar
                                                                    sx={{ bgcolor: getRandomColor(job.industry) }}
                                                                >
                                                                    {job.company.charAt(0)}
                                                                </Avatar>
                                                                <Box>
                                                                    <Typography variant="h5" fontWeight={600} color="#1e3a8a">{job.jobTitle}</Typography>
                                                                    <Typography variant="subtitle1">{job.company}</Typography>
                                                                </Box>
                                                            </Box>

                                                            <Box sx={{ display: 'flex', gap: 3, mt: 2, flexWrap: 'wrap' }}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    <Business fontSize="small" color="action" />
                                                                    <Typography variant="body2" color="text.secondary">{job.industry}</Typography>
                                                                </Box>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    <CalendarToday fontSize="small" color="action" />
                                                                    <Typography variant="body2" color="text.secondary">Posted: {formatDate(job.createdAt)}</Typography>
                                                                </Box>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    <Person fontSize="small" color="action" />
                                                                    <Typography variant="body2" color="text.secondary">{job.applicants} applicants</Typography>
                                                                </Box>
                                                            </Box>

                                                            <Typography variant="body1" sx={{ mt: 2, color: '#374151' }}>
                                                                {job.description.length > 200 ?
                                                                    `${job.description.substring(0, 200)}...` :
                                                                    job.description
                                                                }
                                                            </Typography>

                                                            <Stack direction="row" spacing={1} flexWrap="wrap" mt={2}>
                                                                {job.technicalSkills.map((skill, idx) => (
                                                                    <Chip
                                                                        key={idx}
                                                                        label={`${skill.skill} (${skill.weight}%)`}
                                                                        sx={{
                                                                            bgcolor: '#dbeafe',
                                                                            color: '#1e40af',
                                                                            fontWeight: 500,
                                                                            borderRadius: '4px',
                                                                            mb: 1
                                                                        }}
                                                                        size="small"
                                                                    />
                                                                ))}
                                                            </Stack>
                                                        </Grid>

                                                        <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                                <Tooltip title={savedJobs.includes(job.id) ? "Remove from saved" : "Save job"}>
                                                                    <IconButton onClick={(e) => toggleSaveJob(job.id, e)}>
                                                                        {savedJobs.includes(job.id) ?
                                                                            <Bookmark color="primary" /> :
                                                                            <BookmarkBorder />
                                                                        }
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </Box>

                                                            <Box sx={{ display: 'flex', gap: 1, mt: { xs: 2, md: 0 }, justifyContent: { xs: 'flex-start', md: 'flex-end' }, flexWrap: 'wrap' }}>
                                                                <Button
                                                                    variant="outlined"
                                                                    startIcon={<Visibility />}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        onNavigate('jobdetail');
                                                                    }}
                                                                >
                                                                    View
                                                                </Button>
                                                                <Button
                                                                    variant="outlined"
                                                                    startIcon={<Edit />}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        console.log("Edit", job.id);
                                                                    }}
                                                                >
                                                                    Edit
                                                                </Button>
                                                                <Button
                                                                    variant="outlined"
                                                                    color="error"
                                                                    startIcon={<Delete />}
                                                                    onClick={(e) => confirmDelete(job.id, e)}
                                                                >
                                                                    Delete
                                                                </Button>
                                                            </Box>
                                                        </Grid>
                                                    </Grid>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : (
                                <Paper sx={{ p: 5, borderRadius: 2, textAlign: 'center', bgcolor: 'white' }}>
                                    <WarningAmber sx={{ fontSize: 64, color: '#9ca3af' }} />
                                    <Typography variant="h5" fontWeight={600} color="#4b5563" mt={2}>No jobs found</Typography>
                                    <Typography variant="body1" color="#6b7280" mt={1} mb={3}>
                                        {searchTerm || filterIndustry ? 'Try a different search or filter' : 'Create your first job posting'}
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        startIcon={<Add />}
                                        onClick={() => console.log("Adding new job")}
                                    >
                                        Add New Job
                                    </Button>
                                </Paper>
                            )
                        )}
                    </Container>
                    <Dialog
                        open={showDeleteConfirm}
                        onClose={() => setShowDeleteConfirm(false)}
                        PaperProps={{
                            sx: { borderRadius: 2, p: 1 }
                        }}
                    >
                        <DialogTitle sx={{ fontWeight: 600 }}>Confirm Deletion</DialogTitle>
                        <DialogContent>
                            <Typography>Are you sure you want to delete this job? This action cannot be undone.</Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={deleteJob}
                            >
                                Delete Job
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default JobListPage;