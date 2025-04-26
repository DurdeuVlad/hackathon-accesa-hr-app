import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Card,
    Typography,
    TextField,
    InputAdornment,
    Select,
    MenuItem,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    CircularProgress,
    Avatar,
    CssBaseline,
    FormControl,
    InputLabel,
    Divider,
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
    Person,
    BookmarkBorder,
    Bookmark,
    Close as CloseIcon,
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
    const [sortOrder, setSortOrder] = useState('newest');
    const [savedJobs, setSavedJobs] = useState([]);

    useEffect(() => {
        setTimeout(() => {
            const mockJobs = [
                {
                    id: "job1",
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
                    id: "job2",
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
                },
                {
                    id: "job3",
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
                    id: "job4",
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

    const clearFilters = () => {
        setFilterIndustry('');
        setSortOrder('newest');
        setSearchTerm('');
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
                />

                <Box sx={{
                    width: '100%',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'auto',
                    mt: 0,
                }}>
                    <Box sx={{
                        background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                        color: 'white',
                        py: 3,
                        width: '100%',
                        mb: 3,
                    }}>
                        <Box sx={{ width: '100%', maxWidth: '1600px', margin: '0 auto', px: 3 }}>
                            <Typography variant="h4" component="h1" fontWeight="bold" textAlign="center" sx={{ mb: 1 }}>
                                Job Listings
                            </Typography>
                            <Typography variant="h6" textAlign="center" sx={{ opacity: 0.9 }}>
                                Manage your job postings and find the perfect candidate match
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{
                        flex: 1,
                        px: { xs: 2, sm: 3 },
                        width: '100%',
                        maxWidth: '1400px',
                        margin: '0 auto'
                    }}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: { xs: 'flex-start', sm: 'center' },
                            justifyContent: 'space-between',
                            gap: 2,
                            mb: 2
                        }}>
                            <TextField
                                placeholder="Search jobs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                size="small"
                                sx={{
                                    flex: 1,
                                    maxWidth: { xs: '100%', sm: '300px' },
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 1,
                                    }
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search fontSize="small" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: searchTerm && (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setSearchTerm('')}
                                                edge="end"
                                                size="small"
                                                aria-label="clear search"
                                            >
                                                <CloseIcon fontSize="small" />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />

                            <Box sx={{
                                display: 'flex',
                                gap: 2,
                                alignItems: 'center',
                                width: { xs: '100%', sm: 'auto' }
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
                                    <Typography variant="body2" sx={{ mr: 1, color: 'text.secondary', display: { xs: 'none', md: 'block' } }}>
                                        Sort By
                                    </Typography>
                                    <FormControl size="small" sx={{ minWidth: 100, width: { xs: '100%', sm: 'auto' } }}>
                                        <InputLabel id="industry-filter-label">Industry</InputLabel>
                                        <Select
                                            labelId="industry-filter-label"
                                            value={filterIndustry}
                                            onChange={(e) => setFilterIndustry(e.target.value)}
                                            label="Industry"
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 300
                                                    }
                                                }
                                            }}
                                        >
                                            <MenuItem value="">All Industries</MenuItem>
                                            {uniqueIndustries.map((industry, index) => (
                                                <MenuItem key={index} value={industry}>{industry}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
                                    <Typography variant="body2" sx={{ mr: 1, color: 'text.secondary', display: { xs: 'none', md: 'block' } }}>
                                        Sort By
                                    </Typography>
                                    <FormControl size="small" sx={{ minWidth: 120, width: { xs: '100%', sm: 'auto' } }}>
                                        <InputLabel id="sort-order-label">Newest First</InputLabel>
                                        <Select
                                            labelId="sort-order-label"
                                            value={sortOrder}
                                            onChange={(e) => setSortOrder(e.target.value)}
                                            label="Newest First"
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 300
                                                    }
                                                }
                                            }}
                                        >
                                            <MenuItem value="newest">Newest First</MenuItem>
                                            <MenuItem value="oldest">Oldest First</MenuItem>
                                            <MenuItem value="alphabetical">Alphabetical (A-Z)</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>

                                {/* Add Job Button */}
                                <Button
                                    variant="contained"
                                    startIcon={<Add />}
                                    color="success"
                                    size="small"
                                    onClick={() => onNavigate('jobdetail')}
                                    sx={{
                                        whiteSpace: 'nowrap',
                                        ml: { xs: 0, sm: 1 },
                                        mt: { xs: 0, sm: 0 }
                                    }}
                                >
                                    Add New Job
                                </Button>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                            <Typography variant="body2" color="text.secondary">
                                {processedJobs.length} jobs found
                            </Typography>
                            {(searchTerm || filterIndustry !== '') && (
                                <Button
                                    size="small"
                                    onClick={clearFilters}
                                    sx={{
                                        color: 'primary.main',
                                        textTransform: 'none',
                                        minWidth: 'auto',
                                        p: '2px 6px',
                                        fontSize: '0.75rem'
                                    }}
                                >
                                    Clear filters
                                </Button>
                            )}
                        </Box>

                        {isLoading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <Box>
                                {processedJobs.length > 0 ? (
                                    processedJobs.map(job => (
                                        <Card
                                            key={job.id}
                                            sx={{
                                                cursor: 'pointer',
                                                mb: 2,
                                                transition: 'all 0.2s ease',
                                                borderRadius: 1,
                                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                                '&:hover': {
                                                    boxShadow: '0 3px 6px rgba(0,0,0,0.15)',
                                                    transform: 'translateY(-2px)'
                                                }
                                            }}
                                            onClick={() => onNavigate('jobdetail')}
                                        >
                                            <Box sx={{ p: 2 }}>
                                                {/* Job Title and Company */}
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'flex-start',
                                                    justifyContent: 'space-between'
                                                }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Avatar
                                                            sx={{
                                                                bgcolor: getRandomColor(job.industry),
                                                                width: 40,
                                                                height: 40,
                                                                mr: 1.5
                                                            }}
                                                        >
                                                            {job.company.charAt(0)}
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="h6" color="primary.main" fontWeight={600}>
                                                                {job.jobTitle}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {job.company}
                                                            </Typography>
                                                        </Box>
                                                    </Box>

                                                    <IconButton
                                                        onClick={(e) => toggleSaveJob(job.id, e)}
                                                        size="small"
                                                        sx={{ mt: 0.5 }}
                                                    >
                                                        {savedJobs.includes(job.id) ?
                                                            <Bookmark color="primary" /> :
                                                            <BookmarkBorder />
                                                        }
                                                    </IconButton>
                                                </Box>

                                                <Typography
                                                    variant="body2"
                                                    color="text.primary"
                                                    sx={{
                                                        mt: 2,
                                                        lineHeight: 1.5,
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden'
                                                    }}
                                                >
                                                    {job.description}
                                                </Typography>

                                                <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {job.technicalSkills.map((skill, idx) => (
                                                        <Chip
                                                            key={idx}
                                                            label={`${skill.skill} (${skill.weight}%)`}
                                                            size="small"
                                                            sx={{
                                                                fontSize: '0.7rem',
                                                                height: 24,
                                                                bgcolor: '#e0f2fe',
                                                                color: '#0369a1',
                                                            }}
                                                        />
                                                    ))}
                                                </Box>
                                            </Box>

                                            <Divider />

                                            <Box sx={{
                                                p: 1.5,
                                                bgcolor: '#fafafa',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                flexWrap: 'wrap'
                                            }}>
                                                <Box sx={{
                                                    display: 'flex',
                                                    gap: { xs: 1.5, md: 3 },
                                                    flexWrap: 'wrap'
                                                }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Business fontSize="small" sx={{ mr: 0.5, color: 'text.secondary', fontSize: 16 }} />
                                                        <Typography variant="body2" color="text.secondary">
                                                            {job.industry}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <CalendarToday fontSize="small" sx={{ mr: 0.5, color: 'text.secondary', fontSize: 16 }} />
                                                        <Typography variant="body2" color="text.secondary">
                                                            Posted: {formatDate(job.createdAt)}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Person fontSize="small" sx={{ mr: 0.5, color: 'text.secondary', fontSize: 16 }} />
                                                        <Typography variant="body2" color="text.secondary">
                                                            {job.applicants} applicants
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                <Box sx={{
                                                    display: 'flex',
                                                    gap: 1,
                                                    mt: { xs: 1, sm: 0 }
                                                }}>
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        startIcon={<Visibility fontSize="small" />}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onNavigate('jobdetail');
                                                        }}
                                                        sx={{ fontSize: '0.75rem', py: 0.5 }}
                                                    >
                                                        View
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        startIcon={<Edit fontSize="small" />}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            console.log("Edit", job.id);
                                                        }}
                                                        sx={{ fontSize: '0.75rem', py: 0.5 }}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        size="small"
                                                        startIcon={<Delete fontSize="small" />}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            confirmDelete(job.id, e);
                                                        }}
                                                        sx={{ fontSize: '0.75rem', py: 0.5 }}
                                                    >
                                                        Delete
                                                    </Button>
                                                </Box>
                                            </Box>
                                        </Card>
                                    ))
                                ) : (
                                    <Box
                                        sx={{
                                            p: 3,
                                            borderRadius: 2,
                                            textAlign: 'center',
                                            mt: 2,
                                            bgcolor: 'background.paper',
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                        }}
                                    >
                                        <WarningAmber sx={{ fontSize: 40, color: '#9ca3af' }} />
                                        <Typography variant="h6" fontWeight={600} color="#4b5563" mt={1}>
                                            No jobs found
                                        </Typography>
                                        <Typography variant="body2" color="#6b7280" mt={1} mb={2}>
                                            {searchTerm || filterIndustry ? 'Try a different search or filter' : 'Create your first job posting'}
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            startIcon={<Add />}
                                            onClick={() => onNavigate('jobdetail')}
                                            size="small"
                                        >
                                            Add New Job
                                        </Button>
                                    </Box>
                                )}
                            </Box>
                        )}
                    </Box>
                </Box>

                <Dialog
                    open={showDeleteConfirm}
                    onClose={() => setShowDeleteConfirm(false)}
                    PaperProps={{ sx: { borderRadius: 2, p: 1 } }}
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
        </ThemeProvider>
    );
};

export default JobListPage;