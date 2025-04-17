import { useState, useRef, useEffect } from 'react';
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
    InputLabel
} from '@mui/material';
import {
    Add,
    Delete,
    UploadFile,
    CheckCircle,
    ErrorOutline,
    FileUpload,
    InsertDriveFile,
    RemoveCircle,
    Business,
    Description,
    Code,
    KeyboardArrowRight,
    FileCopy,
    ArrowBack,
    SaveAlt,
    ArrowForward,
    Build,
    Tune,
    BarChart
} from '@mui/icons-material';

const JobDetailPage = ({ onBack }) => {
    const userId = "user123";
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [jobDescription, setJobDescription] = useState({
        jobTitle: "",
        industry: "",
        company: "",
        location: "",
        description: "",
        technicalSkills: []
    });
    const [newSkill, setNewSkill] = useState("");
    const [newWeight, setNewWeight] = useState(30);
    const [cvFiles, setCvFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const fileInputRef = useRef(null);
    const [industries, setIndustries] = useState([
        'Technology', 'Healthcare', 'Finance', 'Education',
        'E-commerce', 'Manufacturing', 'Telecommunications', 'Banking'
    ]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setJobDescription(prev => ({ ...prev, [name]: value }));
    };

    const handleAddSkill = () => {
        if (!newSkill.trim()) return;

        // Check if we can accommodate the new weight
        const currentTotal = jobDescription.technicalSkills.reduce((sum, skill) => sum + skill.weight, 0);
        if (currentTotal + newWeight > 100) {
            setErrorMessage(`Cannot add skill. Total weight exceeds 100%. Adjust existing skills first.`);
            setTimeout(() => setErrorMessage(""), 3000);
            return;
        }

        setJobDescription(prev => ({
            ...prev,
            technicalSkills: [...prev.technicalSkills, { skill: newSkill, weight: newWeight }]
        }));
        setNewSkill("");
        setNewWeight(30);
    };

    const handleRemoveSkill = (index) => {
        setJobDescription(prev => ({
            ...prev,
            technicalSkills: prev.technicalSkills.filter((_, i) => i !== index)
        }));
    };

    const handleWeightChange = (index, value) => {
        const updated = [...jobDescription.technicalSkills];
        updated[index].weight = value;
        setJobDescription(prev => ({ ...prev, technicalSkills: updated }));
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        const validFiles = files.filter(file => file.type === 'application/pdf' ||
            file.type === 'application/msword' ||
            file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        if (validFiles.length > 0) {
            setCvFiles(prev => [...prev, ...validFiles]);
        } else {
            setErrorMessage("Please upload only PDF or Word documents");
            setTimeout(() => setErrorMessage(""), 3000);
        }
    };

    const handleFileInputChange = (e) => {
        const files = Array.from(e.target.files);
        setCvFiles(prev => [...prev, ...files]);
    };

    const handleRemoveFile = (index) => {
        setCvFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleNextStep = () => {
        // Validate current step
        if (activeStep === 0) {
            if (!jobDescription.jobTitle || !jobDescription.industry || !jobDescription.description || !jobDescription.company) {
                setErrorMessage("Please fill all required fields");
                setTimeout(() => setErrorMessage(""), 3000);
                return;
            }
        } else if (activeStep === 1) {
            if (jobDescription.technicalSkills.length === 0) {
                setErrorMessage("Please add at least one technical skill");
                setTimeout(() => setErrorMessage(""), 3000);
                return;
            }

            const totalWeight = jobDescription.technicalSkills.reduce((sum, skill) => sum + skill.weight, 0);
            if (totalWeight !== 100) {
                setErrorMessage(`Total skill weight should be 100%. Current total: ${totalWeight}%`);
                setTimeout(() => setErrorMessage(""), 5000);
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
            if (cvFiles.length === 0) {
                setErrorMessage("Please upload at least one CV");
                setTimeout(() => setErrorMessage(""), 3000);
                return;
            }

            setLoading(true);

            const jobWithUser = {
                ...jobDescription,
                userId: userId,
                createdAt: new Date()
            };

            const data = new FormData();
            data.append('job', JSON.stringify(jobWithUser));
            cvFiles.forEach((file) => data.append('cvs', file));

            // Simulate upload with delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Simulate upload
            console.log("Job data to be sent:", jobWithUser);
            console.log("CV files to be sent:", cvFiles);

            setLoading(false);
            setSuccessMessage("Job description and CVs uploaded successfully!");
            setTimeout(() => setSuccessMessage(""), 3000);
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
        { label: 'Technical Skills', icon: <Code /> },
        { label: 'Upload CVs', icon: <FileUpload /> }
    ];

    return (
        <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', pb: 6 }}>
            {/* Header */}
            <Box sx={{
                background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                color: 'white',
                py: 5,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                mb: 4
            }}>
                <Container maxWidth="lg">
                    <Button
                        onClick={onBack}
                        variant="contained"
                        startIcon={<ArrowBack />}
                        sx={{
                            mb: 2,
                            bgcolor: 'rgba(255,255,255,0.2)',
                            '&:hover': {
                                bgcolor: 'rgba(255,255,255,0.3)'
                            }
                        }}
                    >
                        Back
                    </Button>
                    <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                        Job Matching
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 700 }}>
                        Find the perfect candidate by creating a job description and uploading CVs to match
                    </Typography>
                </Container>
            </Box>

            <Container maxWidth="lg">
                {/* Alert Messages */}
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

                {/* Stepper */}
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

                {/* Step 1: Job Information */}
                {activeStep === 0 && (
                    <Card sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', mb: 4, borderTop: '4px solid #3b82f6' }}>
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Avatar sx={{ bgcolor: '#dbeafe', mr: 2 }}><Description sx={{ color: '#2563eb' }} /></Avatar>
                                <Typography variant="h5" color="#1e3a8a" fontWeight="bold">Job Details</Typography>
                            </Box>

                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="jobTitle"
                                        label="Job Title"
                                        value={jobDescription.jobTitle}
                                        onChange={handleInputChange}
                                        fullWidth
                                        required
                                        variant="outlined"
                                        placeholder="e.g. Senior Frontend Developer"
                                        sx={{ mb: 3 }}
                                    />

                                    <FormControl fullWidth sx={{ mb: 3 }}>
                                        <InputLabel id="industry-label">Industry *</InputLabel>
                                        <Select
                                            labelId="industry-label"
                                            name="industry"
                                            value={jobDescription.industry}
                                            onChange={handleInputChange}
                                            required
                                            label="Industry"
                                        >
                                            {industries.map(industry => (
                                                <MenuItem key={industry} value={industry}>{industry}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        name="company"
                                        label="Company"
                                        value={jobDescription.company}
                                        onChange={handleInputChange}
                                        fullWidth
                                        required
                                        variant="outlined"
                                        placeholder="e.g. TechCorp Solutions"
                                        sx={{ mb: 3 }}
                                    />

                                    <TextField
                                        name="location"
                                        label="Location"
                                        value={jobDescription.location}
                                        onChange={handleInputChange}
                                        fullWidth
                                        variant="outlined"
                                        placeholder="e.g. Remote, New York, NY"
                                        sx={{ mb: 3 }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        name="description"
                                        label="Job Description"
                                        value={jobDescription.description}
                                        onChange={handleInputChange}
                                        fullWidth
                                        required
                                        multiline
                                        minRows={4}
                                        maxRows={8}
                                        variant="outlined"
                                        placeholder="Describe the job responsibilities, requirements, and any other relevant information..."
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                )}

                {/* Step 2: Technical Skills */}
                {activeStep === 1 && (
                    <Card sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', mb: 4, borderTop: '4px solid #3b82f6' }}>
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

                            <Box>
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

                {/* Step 3: CV Upload */}
                {activeStep === 2 && (
                    <Card sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', mb: 4, borderTop: '4px solid #3b82f6' }}>
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <Avatar sx={{ bgcolor: '#dbeafe', mr: 2 }}><FileUpload sx={{ color: '#2563eb' }} /></Avatar>
                                <Typography variant="h5" color="#1e3a8a" fontWeight="bold">Upload CVs</Typography>
                            </Box>

                            <Typography variant="body1" color="text.secondary" paragraph>
                                Upload the CV files you want to match against this job description.
                                The system will analyze each CV and rank candidates based on their match to the job requirements.
                            </Typography>

                            <Box
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                sx={{
                                    border: '2px dashed #bfdbfe',
                                    borderRadius: 2,
                                    p: 5,
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    backgroundColor: isDragging ? '#eff6ff' : 'inherit',
                                    transition: 'all 0.2s ease',
                                    '&:hover': { borderColor: '#93c5fd', backgroundColor: '#f8fafc' }
                                }}
                            >
                                <input
                                    type="file"
                                    multiple
                                    ref={fileInputRef}
                                    onChange={handleFileInputChange}
                                    accept=".pdf,.doc,.docx"
                                    hidden
                                />
                                <UploadFile sx={{ fontSize: 64, color: '#60a5fa', mb: 2 }} />
                                <Typography variant="h6" color="#1e3a8a" fontWeight={500}>Drag and drop CV files here</Typography>
                                <Typography variant="body1" color="#4b5563">or <span style={{ color: '#3b82f6', fontWeight: 600 }}>browse files</span></Typography>
                                <Typography variant="caption" color="#6b7280" mt={1} display="block">Accepted formats: PDF, DOC, DOCX</Typography>
                            </Box>

                            {/* Files List */}
                            {cvFiles.length > 0 && (
                                <Box mt={4}>
                                    <Typography variant="subtitle1" color="#1e3a8a" display="flex" alignItems="center" gap={1} fontWeight={500} mb={2}>
                                        <CheckCircle sx={{ color: '#10b981' }} /> Uploaded Files ({cvFiles.length})
                                    </Typography>
                                    <Grid container spacing={2}>
                                        {cvFiles.map((file, index) => (
                                            <Grid item xs={12} sm={6} key={index}>
                                                <Paper sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    p: 2,
                                                    borderRadius: 2,
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                                    border: '1px solid #e5e7eb',
                                                    '&:hover': { boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }
                                                }}>
                                                    <Avatar
                                                        variant="rounded"
                                                        sx={{
                                                            bgcolor: '#eff6ff',
                                                            color: '#3b82f6',
                                                            mr: 2
                                                        }}
                                                    >
                                                        <InsertDriveFile />
                                                    </Avatar>
                                                    <Box flex={1}>
                                                        <Typography fontWeight={500} color="#111827" noWrap>
                                                            {file.name}
                                                        </Typography>
                                                        <Typography fontSize={12} color="#6b7280">
                                                            {(file.size / 1024).toFixed(2)} KB
                                                        </Typography>
                                                    </Box>
                                                    <IconButton
                                                        onClick={() => handleRemoveFile(index)}
                                                        sx={{ '&:hover': { backgroundColor: '#fee2e2' } }}
                                                        size="small"
                                                    >
                                                        <RemoveCircle sx={{ color: '#ef4444' }} />
                                                    </IconButton>
                                                </Paper>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Navigation Buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                    <Button
                        variant="outlined"
                        onClick={onBack}
                        startIcon={<ArrowBack />}
                        sx={{ visibility: activeStep === 0 ? 'hidden' : 'visible' }}
                    >
                        Cancel
                    </Button>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        {activeStep > 0 && (
                            <Button
                                variant="outlined"
                                onClick={handlePreviousStep}
                                startIcon={<ArrowBack />}
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
                                }}
                            >
                                {loading ? 'Saving...' : 'Save and Process'}
                            </Button>
                        )}
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default JobDetailPage;