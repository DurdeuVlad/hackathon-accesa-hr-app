import { useState, useRef } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    TextField,
    Avatar,
    Slider,
    LinearProgress,
    Alert,
    Stack,
    Stepper,
    Step,
    StepLabel,
    IconButton,
    Grid,
    Container,
    Paper,
    Divider,
    Chip,
    Tooltip,
    MenuItem,
    Select,
    CircularProgress,
    FormControl,
    InputLabel,
    CssBaseline
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import {
    Add,
    Delete,
    CheckCircle,
    ErrorOutline,
    Business,
    Description,
    Code,
    KeyboardArrowRight,
    ArrowBack,
    SaveAlt,
    ArrowForward,
    Build,
    Tune,
    BarChart
} from '@mui/icons-material';
import theme from './CommonTheme';
import NavBar from './TopNavBar';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import {useNavigate} from "react-router-dom";
import {useAppContext} from "../context/AppContext.jsx";

const JobDetailPage = ({ onBack, onNavigate }) => {
    const navigate = useNavigate();
    const userId = "user123";
    const [activeStep, setActiveStep] = useState(0);
    const { state, dispatch } = useAppContext();
    const jobDescription = state.jobDescription;
    const [loading, setLoading] = useState(false);
    const [newSkill, setNewSkill] = useState("");
    const [newWeight, setNewWeight] = useState(30);
    const [successMessage, setSuccessMessage] = useState("");
    const [uploadCompleted, setUploadCompleted] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [industries, setIndustries] = useState([
        'Technology', 'Healthcare', 'Finance', 'Education',
        'E-commerce', 'Manufacturing', 'Telecommunications', 'Banking'
    ]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        dispatch({ type: 'SET_JOB_DESCRIPTION', payload: { [name]: value } });
    };

    const handleAddSkill = () => {
        if (!newSkill.trim()) return;

        const currentTotal = jobDescription.technicalSkills.reduce((sum, skill) => sum + skill.weight, 0);
        if (currentTotal + newWeight > 100) {
            setErrorMessage(`Cannot add skill. Total weight exceeds 100%. Adjust existing skills first.`);
            setTimeout(() => setErrorMessage(""), 3000);
            return;
        }

        dispatch({
            type: 'SET_JOB_DESCRIPTION',
            payload: { technicalSkills: [...jobDescription.technicalSkills, { skill: newSkill, weight: newWeight }] }
        });
        setNewSkill("");
        setNewWeight(30);
    };

    const handleRemoveSkill = (index) => {
        dispatch({
            type: 'SET_JOB_DESCRIPTION',
            payload: { technicalSkills: jobDescription.technicalSkills.filter((_, i) => i !== index) }
        });
    };

    const handleWeightChange = (index, value) => {
        const updated = [...jobDescription.technicalSkills];
        updated[index].weight = value;
        dispatch({
            type: 'SET_JOB_DESCRIPTION',
            payload: { technicalSkills: updated }
        });
    };

    const handleNextStep = () => {
        if (activeStep === 0) {
            if (!jobDescription.jobTitle || !jobDescription.industry || !jobDescription.description || !jobDescription.company) {
                setErrorMessage("Please fill all required fields");
                setTimeout(() => setErrorMessage(""), 3000);
                return;
            }
        }

        setActiveStep((prevStep) => prevStep + 1);
    };

    const handlePreviousStep = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const handleSave = async () => {
        try {
            const totalWeight = jobDescription.technicalSkills.reduce((sum, skill) => sum + skill.weight, 0);
            if (totalWeight !== 100) {
                setErrorMessage(`Total skill weight should be 100%. Current total: ${totalWeight}%`);
                setTimeout(() => setErrorMessage(""), 5000);
                return;
            }

            setLoading(true);

            const jobWithUser = {
                ...jobDescription,
                userId: userId,
                createdAt: new Date()
            };

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Log information (simulation)
            console.log("Job data to be sent:", jobWithUser);

            setLoading(false);
            setSuccessMessage("Job description saved successfully!");
            setUploadCompleted(true);

            setTimeout(() => {
                navigate('/joblist');
            }, 3000);
        } catch (error) {
            setLoading(false);
            console.error("Error saving data:", error);
            setErrorMessage("Error saving data. Please try again.");
            setTimeout(() => setErrorMessage(""), 3000);
        }
    };

    const remainingWeight = 100 - jobDescription.technicalSkills.reduce((sum, skill) => sum + skill.weight, 0);

    const steps = [
        { label: 'Job Information', icon: <Business /> },
        { label: 'Technical Skills', icon: <Code /> }
    ];

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
                    title=" Job Detail Page"
                    currentPage="jobdetail"
                />
                <Box sx={{
                    width: '100%',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'auto'
                }}>
                    {uploadCompleted && (
                        <Box
                            sx={{
                                width: '100%',
                                height: '100%',
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                bgcolor: '#f0fdf4',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                zIndex: 1000,
                                p: 4
                            }}
                        >
                            <CheckCircle sx={{ fontSize: 80, color: '#10b981', mb: 2 }} />
                            <Typography variant="h4" fontWeight="bold" color="#10b981">
                                Job Uploaded Successfully!
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                                Redirecting to Job List...
                            </Typography>
                        </Box>
                    )}

                    {/* Header */}
                    <Box sx={{
                        background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                        color: 'white',
                        py: 5,
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                        width: '100%'
                    }}>
                        <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                                Job Matching
                            </Typography>
                            <Typography variant="h6" sx={{ opacity: 0.9, mx: 'auto', maxWidth: 700 }}>
                                Find the perfect candidate by creating a detailed job description
                            </Typography>
                        </Container>
                    </Box>

                    <Container maxWidth="lg" sx={{ my: 4, pb: 6 }}>
                        <Box sx={{ mb: 4 }}>

                            {successMessage && (
                                <Alert
                                    severity="success"
                                    icon={<CheckCircle />}
                                    sx={{ mb: 2, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: 2 }}
                                >
                                    {successMessage}
                                </Alert>
                            )}
                            {errorMessage && (
                                <Alert
                                    severity="error"
                                    icon={<ErrorOutline />}
                                    sx={{ mb: 2, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: 2 }}
                                >
                                    {errorMessage}
                                </Alert>
                            )}
                        </Box>

                        <Box mb={4}>
                            <Stepper activeStep={activeStep} alternativeLabel>
                                {steps.map((step, index) => (
                                    <Step key={step.label}>
                                        <StepLabel StepIconProps={{
                                            icon: index <= activeStep ? (
                                                <Avatar sx={{
                                                    bgcolor: index === activeStep ? '#1e40af' : '#3b82f6',
                                                    width: 30,
                                                    height: 30
                                                }}>
                                                    {step.icon}
                                                </Avatar>
                                            ) : (
                                                index + 1
                                            )
                                        }}>
                                            {step.label}
                                        </StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        </Box>

                        {activeStep === 0 && (
                            <Card sx={{
                                borderRadius: 2,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                mb: 4,
                                borderTop: '4px solid #3b82f6',
                                minHeight: '600px',
                                transition: 'all 0.3s ease'
                            }}>
                                <CardContent sx={{ p: 4 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                        <Avatar sx={{ bgcolor: '#dbeafe', mr: 2 }}><Description sx={{ color: '#2563eb' }} /></Avatar>
                                        <Typography variant="h5" color="#1e3a8a" fontWeight="bold">Job Details</Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', flexDirection: 'column', mb: 4, gap: 3 }}>
                                        {/*Job Title and Company */}
                                        <Box sx={{ display: 'flex', gap: 3 }}>
                                            <TextField
                                                name="jobTitle"
                                                label="Job Title *"
                                                value={jobDescription.jobTitle}
                                                onChange={handleInputChange}
                                                fullWidth
                                                required
                                                variant="outlined"
                                                placeholder="e.g. Senior Frontend Developer"
                                                size="medium"
                                                InputProps={{
                                                    sx: {
                                                        height: '56px',
                                                    }
                                                }}
                                            />
                                            <TextField
                                                name="company"
                                                label="Company *"
                                                value={jobDescription.company}
                                                onChange={handleInputChange}
                                                fullWidth
                                                required
                                                variant="outlined"
                                                placeholder="e.g. TechCorp Solutions"
                                                size="medium"
                                                InputProps={{
                                                    sx: {
                                                        height: '56px',
                                                    }
                                                }}
                                            />
                                        </Box>

                                        {/* Industry and Location */}
                                        <Box sx={{ display: 'flex', gap: 3 }}>
                                            <TextField
                                                name="industry"
                                                label="Industry *"
                                                value={jobDescription.industry}
                                                onChange={handleInputChange}
                                                fullWidth
                                                required
                                                variant="outlined"
                                                placeholder="e.g. Automotive"
                                                size="medium"
                                                InputProps={{
                                                    sx: {
                                                        height: '56px',
                                                    }
                                                }}
                                            />
                                            <TextField
                                                name="location"
                                                label="Location"
                                                value={jobDescription.location}
                                                onChange={handleInputChange}
                                                fullWidth
                                                variant="outlined"
                                                placeholder="e.g. Remote, New York, NY"
                                                size="medium"
                                                InputProps={{
                                                    sx: {
                                                        height: '56px',
                                                    }
                                                }}
                                            />
                                        </Box>
                                    </Box>

                                    <Box>
                                        {/* Avatar and title row */}
                                        <Box display="flex" alignItems="center" mb={2}>
                                            <Avatar sx={{ bgcolor: '#dbeafe', mr: 2 }}>
                                                <Description sx={{ color: '#2563eb' }} />
                                            </Avatar>
                                            <Typography variant="h6" color="#1e3a8a" fontWeight="bold">
                                                Job Description
                                            </Typography>
                                        </Box>

                                        {/* TextField with multi-line content */}
                                        <TextField
                                            name="description"
                                            value={jobDescription.description}
                                            onChange={handleInputChange}
                                            fullWidth
                                            multiline
                                            rows={10}
                                            variant="outlined"
                                            placeholder="Enter detailed job description here including responsibilities, requirements, and any other relevant information..."
                                            InputProps={{
                                                sx: {
                                                    height: '240px', // Fixed height
                                                    alignItems: 'flex-start',
                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: '#e5e7eb',
                                                    },
                                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                                        borderColor: '#3b82f6',
                                                    },
                                                }
                                            }}
                                        />
                                    </Box>
                                </CardContent>
                            </Card>
                        )}

                        {activeStep === 1 && (
                            <Card sx={{
                                borderRadius: 2,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                mb: 4,
                                borderTop: '4px solid #3b82f6',
                                minHeight: '600px',
                                transition: 'all 0.3s ease'
                            }}>
                                <CardContent sx={{ p: 4 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                        <Avatar sx={{ bgcolor: '#dbeafe', mr: 2 }}><Code sx={{ color: '#2563eb' }} /></Avatar>
                                        <Typography variant="h5" color="#1e3a8a" fontWeight="bold">Technical Skills</Typography>
                                    </Box>

                                    <Box mb={4}>
                                        <Typography variant="subtitle1" fontWeight={500} gutterBottom>Add Technical Skills</Typography>
                                        <Typography variant="body2" color="text.secondary" mb={3}>
                                            Define the technical skills required for this position and assign weights to each skill.
                                            The total weight should add up to 100%.
                                        </Typography>

                                        <Grid container spacing={2} alignItems="center">
                                            <Grid item xs={12} sm={5}>
                                                <TextField
                                                    label="Skill Name"
                                                    value={newSkill}
                                                    onChange={(e) => setNewSkill(e.target.value)}
                                                    fullWidth
                                                    placeholder="e.g. React, Python, AWS"
                                                    variant="outlined"
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={5}>
                                                <Box sx={{ px: 2 }}>
                                                    <Typography id="weight-slider" gutterBottom>
                                                        Weight: {newWeight}%
                                                    </Typography>
                                                    <Slider
                                                        value={newWeight}
                                                        onChange={(e, value) => setNewWeight(value)}
                                                        aria-labelledby="weight-slider"
                                                        min={5}
                                                        max={100}
                                                        step={5}
                                                        marks
                                                        sx={{ color: '#3b82f6' }}
                                                    />
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} sm={2}>
                                                <Button
                                                    variant="contained"
                                                    startIcon={<Add />}
                                                    onClick={handleAddSkill}
                                                    fullWidth
                                                    disabled={!newSkill.trim() || remainingWeight < newWeight}
                                                    sx={{
                                                        bgcolor: '#3b82f6',
                                                        '&:hover': { bgcolor: '#2563eb' },
                                                        height: '56px'
                                                    }}
                                                >
                                                    Add
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Box>

                                    <Divider sx={{ my: 3 }} />

                                    {/* Skills list */}
                                    <Box sx={{ minHeight: '200px' }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                            <Typography variant="subtitle1" fontWeight={500}>
                                                Added Skills
                                            </Typography>
                                            <Chip
                                                label={`Remaining: ${remainingWeight}%`}
                                                color={remainingWeight === 0 ? "success" : "primary"}
                                                sx={{ fontWeight: 'bold' }}
                                            />
                                        </Box>

                                        {jobDescription.technicalSkills.length === 0 ? (
                                            <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#f9fafb', borderRadius: 2 }}>
                                                <Typography color="text.secondary">No skills added yet.</Typography>
                                            </Paper>
                                        ) : (
                                            <Box>
                                                {jobDescription.technicalSkills.map((skill, index) => (
                                                    <Paper key={index} sx={{
                                                        p: 2,
                                                        mb: 2,
                                                        borderRadius: 2,
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                                        border: '1px solid #e5e7eb'
                                                    }}>
                                                        <Grid container alignItems="center" spacing={2}>
                                                            <Grid item xs={12} sm={4}>
                                                                <Typography fontWeight={500}>{skill.skill}</Typography>
                                                            </Grid>
                                                            <Grid item xs={12} sm={6}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                    <Box sx={{ flexGrow: 1, mr: 1 }}>
                                                                        <LinearProgress
                                                                            variant="determinate"
                                                                            value={skill.weight}
                                                                            sx={{
                                                                                height: 10,
                                                                                borderRadius: 5,
                                                                                bgcolor: '#e5e7eb',
                                                                                '& .MuiLinearProgress-bar': {
                                                                                    bgcolor: '#3b82f6',
                                                                                }
                                                                            }}
                                                                        />
                                                                    </Box>
                                                                    <Typography variant="body2" fontWeight={500}>
                                                                        {skill.weight}%
                                                                    </Typography>
                                                                </Box>
                                                            </Grid>
                                                            <Grid item xs={12} sm={2} sx={{ textAlign: 'right' }}>
                                                                <IconButton
                                                                    onClick={() => handleRemoveSkill(index)}
                                                                    color="error"
                                                                    size="small"
                                                                    sx={{ '&:hover': { bgcolor: '#fee2e2' } }}
                                                                >
                                                                    <Delete />
                                                                </IconButton>
                                                            </Grid>
                                                        </Grid>
                                                    </Paper>
                                                ))}
                                            </Box>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        )}

                        <Box sx={{ position: 'relative', mt: 4 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Button
                                    variant="outlined"
                                    onClick={onBack}
                                    startIcon={<ArrowBack />}
                                    sx={{
                                        visibility: activeStep === 0 ? 'hidden' : 'visible',
                                        width: '100px',
                                        position: 'absolute',
                                        left: 0
                                    }}
                                >
                                    Cancel
                                </Button>

                                <Box sx={{
                                    display: 'flex',
                                    gap: 2,
                                    position: 'absolute',
                                    right: 0
                                }}>
                                    {activeStep > 0 && (
                                        <Button
                                            variant="outlined"
                                            onClick={handlePreviousStep}
                                            startIcon={<ArrowBack />}
                                            sx={{
                                                width: '120px',
                                            }}
                                        >
                                            Previous
                                        </Button>
                                    )}

                                    {activeStep < steps.length - 1 ? (
                                        <Button
                                            variant="contained"
                                            onClick={handleNextStep}
                                            endIcon={<ArrowForward />}
                                            sx={{
                                                bgcolor: '#3b82f6',
                                                '&:hover': { bgcolor: '#2563eb' },
                                                width: '100px',
                                            }}
                                        >
                                            Next
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            onClick={handleSave}
                                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveAlt />}
                                            disabled={loading}
                                            sx={{
                                                bgcolor: '#10b981',
                                                '&:hover': { bgcolor: '#059669' },
                                                width: '180px',
                                                transition: 'background-color 0.3s ease'
                                            }}
                                        >
                                            {loading ? 'Saving...' : 'Save Job'}
                                        </Button>
                                    )}
                                </Box>
                            </Box>
                        </Box>
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default JobDetailPage;