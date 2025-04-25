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
    Container,
    Paper,
    IconButton,
    CircularProgress,
    Avatar,
    CssBaseline,
    FormControl,
    InputLabel,
    Tooltip,
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

    // Filter and sort jobs
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
                bgcolor: '#f8fafc',
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
                    overflow: 'auto',
                    pt: 0,
                    mt: 0,
                }}>
                    {/* Search and filter bar*/}
                    <Box sx={{
                        background: '#4f46e5',
                        width: '100%',
                        py: 1.5,
                        px: 2,
                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                    }}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            alignItems: { xs: 'stretch', md: 'center' },
                            justifyContent: 'space-between',
                            gap: 1,
                            width: '100%',
                            maxWidth: '1200px',
                            mx: 'auto',
                        }}>
                            <Typography variant="h6" color="white" fontWeight="bold">
                                DevMatch Job Listings
                            </Typography>

                            <Box sx={{
                                display: 'flex',
                                gap: 1,
                                alignItems: 'center',
                                flexWrap: { xs: 'wrap', md: 'nowrap' },
                            }}>
                                {/* Search Field */}
                                <TextField
                                    placeholder="Search jobs..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    size="small"
                                    sx={{
                                        bgcolor: 'white',
                                        borderRadius: 1,
                                        width: { xs: '100%', md: '200px' },
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: 'transparent',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: 'transparent',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: 'transparent',
                                            },
                                        },
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
                                                >
                                                    <CloseIcon fontSize="small" />
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />

                                {/* Industry Filter */}
                                <FormControl
                                    size="small"
                                    sx={{
                                        minWidth: 120,
                                        bgcolor: 'white',
                                        borderRadius: 1,
                                    }}
                                >
                                    <InputLabel id="industry-filter-label">Industry</InputLabel>
                                    <Select
                                        labelId="industry-filter-label"
                                        value={filterIndustry}
                                        onChange={(e) => setFilterIndustry(e.target.value)}
                                        label="Industry"
                                    >
                                        <MenuItem value="">All Industries</MenuItem>
                                        {uniqueIndustries.map((industry, index) => (
                                            <MenuItem key={index} value={industry}>{industry}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                {/* Sort By */}
                                <FormControl
                                    size="small"
                                    sx={{
                                        minWidth: 140,
                                        bgcolor: 'white',
                                        borderRadius: 1,
                                    }}
                                >
                                    <InputLabel id="sort-order-label">Sort By</InputLabel>
                                    <Select
                                        labelId="sort-order-label"
                                        value={sortOrder}
                                        onChange={(e) => setSortOrder(e.target.value)}
                                        label="Sort By"
                                    >
                                        <MenuItem value="newest">Newest First</MenuItem>
                                        <MenuItem value="oldest">Oldest First</MenuItem>
                                        <MenuItem value="alphabetical">A-Z</MenuItem>
                                    </Select>
                                </FormControl>

                                {/* Add Job Button */}
                                <Button
                                    variant="contained"
                                    startIcon={<Add />}
                                    size="small"
                                    sx={{
                                        bgcolor: '#34d399',
                                        color: 'white',
                                        '&:hover': { bgcolor: '#10b981' },
                                        whiteSpace: 'nowrap',
                                        textTransform: 'none',
                                    }}
                                    onClick={() => onNavigate('jobdetail')}
                                >
                                    Add
                                </Button>
                            </Box>
                        </Box>
                    </Box>

                    {/* Main job listings */}
                    <Box
                        sx={{
                            flex: 1,
                            pt: 0,
                            px: { xs: 2, md: 3 },
                            pb: 2,
                            overflow: 'auto',
                        }}
                    >
                        {/* Results count */}
                        <Box sx={{
                            py: 1,
                            display: 'flex',
                            alignItems: 'center',
                            color: 'text.secondary',
                            fontSize: '0.875rem',
                        }}>
                            {processedJobs.length} jobs found
                            {(searchTerm || filterIndustry) && (
                                <Button
                                    size="small"
                                    onClick={clearFilters}
                                    sx={{
                                        ml: 1,
                                        color: 'primary.main',
                                        textTransform: 'none',
                                        p: 0,
                                    }}
                                >
                                    Clear filters
                                </Button>
                            )}
                        </Box>

                        {/* Job Listings */}
                        {isLoading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <Box sx={{ mt: 0 }}>
                                {processedJobs.length > 0 ? (
                                    processedJobs.map(job => (
                                        <Card
                                            key={job.id}
                                            sx={{
                                                mb: 2,
                                                borderRadius: 1,
                                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                                cursor: 'pointer',
                                                height: 280,
                                                '&:hover': {
                                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                                },
                                                position: 'relative',
                                                overflow: 'hidden'
                                            }}
                                            onClick={() => onNavigate('jobdetail')}
                                        >
                                            {/* Bookmark button - absolute positioned */}
                                            <Tooltip title={savedJobs.includes(job.id) ? "Remove from saved" : "Save job"}>
                                                <IconButton
                                                    onClick={(e) => toggleSaveJob(job.id, e)}
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 8,
                                                        right: 8,
                                                        zIndex: 1,
                                                    }}
                                                    size="small"
                                                >
                                                    {savedJobs.includes(job.id) ?
                                                        <Bookmark color="primary" fontSize="small" /> :
                                                        <BookmarkBorder fontSize="small" />
                                                    }
                                                </IconButton>
                                            </Tooltip>

                                            <CardContent sx={{
                                                p: 3,
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column'
                                            }}>
                                                {/* Job Title and Company */}
                                                <Box sx={{ mb: 2 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                        <Avatar
                                                            sx={{
                                                                bgcolor: getRandomColor(job.industry),
                                                                width: 40,
                                                                height: 40,
                                                                mr: 2,
                                                                fontSize: '1rem',
                                                            }}
                                                        >
                                                            {job.company.charAt(0)}
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="h6" color="primary.dark" fontWeight={600} sx={{ fontSize: '1.1rem', lineHeight: 1.3 }}>
                                                                {job.jobTitle}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {job.company}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </Box>

                                                {/* Job metadata - industry and date */}
                                                <Box sx={{ display: 'flex', mb: 2, gap: 2 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Business fontSize="small" sx={{ mr: 0.5, color: 'text.secondary', fontSize: 18 }} />
                                                        <Typography variant="body2" color="text.secondary">
                                                            {job.industry}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <CalendarToday fontSize="small" sx={{ mr: 0.5, color: 'text.secondary', fontSize: 18 }} />
                                                        <Typography variant="body2" color="text.secondary">
                                                            Posted: {formatDate(job.createdAt)}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Person fontSize="small" sx={{ mr: 0.5, color: 'text.secondary', fontSize: 18 }} />
                                                        <Typography variant="body2" color="text.secondary">
                                                            {job.applicants} applicants
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                {/* Job Description */}
                                                <Box sx={{ mb: 2, height: 80, overflow: 'hidden', textAlign: 'left' }}>
                                                    <Typography variant="h6" color="text.primary" sx={{
                                                        fontSize: '0.875rem',
                                                        lineHeight: 1.5,
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 4,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden'
                                                    }}>
                                                        {job.description}
                                                    </Typography>
                                                </Box>

                                                {/* Skills */}
                                                <Box sx={{ height: 32, overflow: 'hidden', mb: 2 }}>
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
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

                                                {/* Action Buttons */}
                                                <Box sx={{
                                                    display: 'flex',
                                                    justifyContent: 'flex-end',
                                                    mt: 'auto', // Push to bottom
                                                    gap: 1
                                                }}>
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        startIcon={<Visibility fontSize="small" />}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onNavigate('jobdetail');
                                                        }}
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
                                                    >
                                                        Delete
                                                    </Button>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <Paper sx={{ p: 3, borderRadius: 2, textAlign: 'center', mt: 3 }}>
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
                                    </Paper>
                                )}
                            </Box>
                        )}
                    </Box>
                </Box>

                {/* Delete confirmation dialog */}
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