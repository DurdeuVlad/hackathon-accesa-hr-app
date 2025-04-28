import { useState, useRef } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    Container,
    CssBaseline,
    Card,
    CardContent,
    Alert,
    LinearProgress,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Avatar,
    ToggleButtonGroup,
    ToggleButton,
    Tooltip
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import {
    CloudUpload as CloudUploadIcon,
    FileCopy as FileCopyIcon,
    Delete as DeleteIcon,
    Description as DescriptionIcon,
    WorkOutline as WorkIcon,
    Person as PersonIcon,
    ArrowForward as ArrowForwardIcon,
    CompareArrows as CompareArrowsIcon
} from '@mui/icons-material';
import NavBar from './TopNavBar';
import theme from './CommonTheme';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from "../context/AppContext.jsx";

function MatchCV({ onBack, onNavigate }) {
    const navigate = useNavigate();
    const [isDragActive, setIsDragActive] = useState(false);
    const [uploading, setUploading] = useState(false);
    const { state, dispatch } = useAppContext();
    const files = state.matchCVFiles;
    const [uploadComplete, setUploadComplete] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);
    const [searchMode, setSearchMode] = useState('cv-to-jobs'); // 'cv-to-jobs' sau 'jobs-to-cv'
    const API_URL = "http://localhost:8080";

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragActive(true);
    };

    const handleDragLeave = () => {
        setIsDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragActive(false);
        setError('');

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const droppedFiles = Array.from(e.dataTransfer.files);

            const validFiles = droppedFiles.filter(file => {
                const fileType = file.type;
                return fileType === 'application/pdf' ||
                    fileType === 'application/msword' ||
                    fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            });

            if (validFiles.length !== droppedFiles.length) {
                setError('Some files are not in PDF, DOC, or DOCX format.');
            }

            if (validFiles.length > 0) {
                dispatch({ type: 'SET_MATCH_CV_FILES', payload: [...files, ...validFiles] });
            }
        }
    };

    const handleFileInputChange = (e) => {
        setError('');
        if (e.target.files && e.target.files.length > 0) {
            const selectedFiles = Array.from(e.target.files);

            const validFiles = selectedFiles.filter(file => {
                const fileType = file.type;
                return fileType === 'application/pdf' ||
                    fileType === 'application/msword' ||
                    fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            });

            if (validFiles.length !== selectedFiles.length) {
                setError('Some files are not in PDF, DOC, or DOCX format.');
            }

            if (validFiles.length > 0) {
                dispatch({ type: 'SET_MATCH_CV_FILES', payload: [...files, ...validFiles] });
            }
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleRemoveFile = (index) => {
        dispatch({ type: 'SET_MATCH_CV_FILES', payload: files.filter((_, i) => i !== index) });
    };

    //permite duplicate momentan
    const uploadCVToBackend = async (file, userId) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const url = userId ?
                `${API_URL}/cvs?userId=${encodeURIComponent(userId)}` :
                `${API_URL}/cvs`;

            const response = await fetch(url, {
                method: 'POST',
                body: formData,
            });

            console.log(response);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to upload CV');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error uploading CV:', error);
            throw error;
        }
    };

    const uploadCVForJobMatching = async (file, jobId) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('jobId', jobId);

            const response = await fetch(`${API_URL}/processcv`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to process CV');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error processing CV:', error);
            throw error;
        }
    };

    const findMatchingJobs = async (file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${API_URL}/searchjobsforcv`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to find matching jobs');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error finding matching jobs:', error);
            throw error;
        }
    };

    const handleSearch = async () => {
        if (files.length === 0) {
            setError('Please upload at least one file first.');
            return;
        }

        setError('');
        setUploading(true);

        try {
            const userId = state.user?.id || null;

            if (searchMode === 'cv-to-jobs') {
                const results = [];

                for (const file of files) {
                    try {
                        const uploadResult = await uploadCVToBackend(file, userId);
                        console.log('CV uploaded:', uploadResult);

                        const effectiveUserId = uploadResult.userId || userId;

                        const matchingJobs = await findMatchingJobs(file);
                        console.log('Matching jobs:', matchingJobs);

                        results.push({
                            file: file.name,
                            uploadResult,
                            matchingJobs,
                            userId: effectiveUserId
                        });
                    } catch (fileError) {
                        console.error(`Error processing file ${file.name}:`, fileError);
                        results.push({
                            file: file.name,
                            error: fileError.message
                        });
                    }
                }

                dispatch({ type: 'SET_JOB_MATCH_RESULTS', payload: results });

            } else {
                const jobId = 'job_1'; //traba modificat

                if (!jobId) {
                    setError('Please select a job first.');
                    setUploading(false);
                    return;
                }

                const results = [];
                for (const file of files) {
                    try {
                        const matchResult = await uploadCVForJobMatching(file, jobId);
                        results.push({
                            file: file.name,
                            matchResult
                        });
                    } catch (fileError) {
                        console.error(`Error processing file ${file.name}:`, fileError);
                        results.push({
                            file: file.name,
                            error: fileError.message
                        });
                    }
                }

                dispatch({ type: 'SET_CV_MATCH_RESULTS', payload: results });
            }

            setUploadComplete(true);

            // FIXED: Use the navigate function from useNavigate instead of calling useNavigate directly
            setTimeout(() => {
                if (searchMode === 'cv-to-jobs') {
                    // Try to use onNavigate prop if available, otherwise use navigate
                    if (typeof onNavigate === 'function') {
                        onNavigate('jobmatchesresults');
                    } else {
                        navigate('/jobmatchesresults');
                    }
                } else {
                    if (typeof onNavigate === 'function') {
                        onNavigate('jobmatching');
                    } else {
                        navigate('/jobmatching');
                    }
                }
            }, 1000);

        } catch (error) {
            console.error('Error during search process:', error);
            setError(`Failed to process: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };

    const handleSearchModeChange = (event, newMode) => {
        if (newMode !== null) {
            setSearchMode(newMode);
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' bytes';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        else return (bytes / 1048576).toFixed(1) + ' MB';
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
                    title="Match & Find"
                    currentPage="matchcv"
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
                        mb: 4,
                        textAlign: 'center',
                        width: '100%'
                    }}>
                        <Container maxWidth={false}>
                            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                                {searchMode === 'cv-to-jobs' ? 'Find Perfect Job Matches' : 'Find Ideal Candidates'}
                            </Typography>
                            <Typography variant="h6" sx={{ opacity: 0.9, margin: '0 auto', maxWidth: 700 }}>
                                {searchMode === 'cv-to-jobs'
                                    ? 'Upload your CV to discover job opportunities that match your skills'
                                    : 'Upload job description to find candidates that match your requirements'}
                            </Typography>
                        </Container>
                    </Box>

                    <Container maxWidth="md" sx={{ mb: 6, px: { xs: 2, sm: 4 } }}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%'
                        }}>
                            {/* Main Upload Card */}
                            <Card
                                elevation={0}
                                sx={{
                                    borderRadius: 4,
                                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
                                    mb: 4,
                                    overflow: 'visible',
                                    borderTop: '4px solid #3b82f6',
                                    width: '100%'
                                }}
                            >
                                <CardContent sx={{ p: 4 }}>
                                    <Typography variant="h5" fontWeight="bold" color="primary.dark" textAlign="center" mb={3}>
                                        {searchMode === 'cv-to-jobs'
                                            ? 'Upload Your CV'
                                            : 'Upload Job Description'}
                                    </Typography>

                                    {error && (
                                        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                                            {error}
                                        </Alert>
                                    )}

                                    {uploadComplete && (
                                        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                                            {searchMode === 'cv-to-jobs'
                                                ? 'CV uploaded successfully! Finding job matches...'
                                                : 'Job description uploaded! Finding matching candidates...'}
                                        </Alert>
                                    )}

                                    {uploading && (
                                        <Box sx={{ mb: 3 }}>
                                            <Typography variant="body2" mb={1} textAlign="center">
                                                {searchMode === 'cv-to-jobs'
                                                    ? 'Analyzing CV and finding job matches...'
                                                    : 'Analyzing job requirements and finding candidates...'}
                                            </Typography>
                                            <LinearProgress color="primary" />
                                        </Box>
                                    )}

                                    <Box
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        onClick={handleButtonClick}
                                        sx={{
                                            border: isDragActive ? '2px dashed #3b82f6' : '2px dashed #93c5fd',
                                            borderRadius: 3,
                                            p: 5,
                                            textAlign: 'center',
                                            cursor: 'pointer',
                                            backgroundColor: isDragActive ? 'rgba(219, 234, 254, 0.4)' : 'white',
                                            transition: 'all 0.2s ease',
                                            width: '100%',
                                            '&:hover': {
                                                borderColor: '#3b82f6',
                                                backgroundColor: 'rgba(239, 246, 255, 0.7)',
                                            }
                                        }}
                                    >
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileInputChange}
                                            style={{ display: 'none' }}
                                            accept=".pdf,.doc,.docx"
                                            multiple={searchMode === 'cv-to-jobs'}
                                        />
                                        <CloudUploadIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                                        <Typography variant="h6" color="primary.dark" fontWeight={500} mb={1}>
                                            {searchMode === 'cv-to-jobs'
                                                ? 'Drag & drop your CV here'
                                                : 'Drag & drop job description here'}
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary" mb={2}>
                                            or <span style={{ color: '#3b82f6', fontWeight: 500 }}>click to browse</span> files
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Accepts PDF, DOC, DOCX (max 5MB per file)
                                        </Typography>
                                    </Box>

                                    {/* Modern Toggle Mode Section */}
                                    <Box sx={{
                                        mt: 4,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        flexDirection: 'column'
                                    }}>
                                        <Typography variant="h6" fontWeight="600" mb={3} color="text.primary">
                                            Choose Your Search Direction
                                        </Typography>

                                        <Box sx={{
                                            width: '100%',
                                            maxWidth: '600px',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            position: 'relative',
                                            mb: 2
                                        }}>
                                            <Box sx={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '50%',
                                                bgcolor: '#dbeafe',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                zIndex: 1,
                                                boxShadow: '0 0 15px rgba(59, 130, 246, 0.2)',
                                                border: '2px solid white'
                                            }}>
                                                <CompareArrowsIcon sx={{ color: '#1e40af' }} />
                                            </Box>

                                            <Box sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                width: '100%',
                                                gap: 2
                                            }}>
                                                <Card
                                                    onClick={() => setSearchMode('cv-to-jobs')}
                                                    sx={{
                                                        flex: 1,
                                                        borderRadius: 4,
                                                        p: 3.5,
                                                        cursor: 'pointer',
                                                        border: searchMode === 'cv-to-jobs'
                                                            ? '2px solid #3b82f6'
                                                            : '1px solid #e5e7eb',
                                                        boxShadow: searchMode === 'cv-to-jobs'
                                                            ? '0 8px 20px rgba(59, 130, 246, 0.15)'
                                                            : '0 4px 6px rgba(0, 0, 0, 0.03)',
                                                        transition: 'all 0.2s ease',
                                                        backgroundColor: searchMode === 'cv-to-jobs'
                                                            ? '#f0f9ff'
                                                            : 'white',
                                                        '&:hover': {
                                                            transform: 'translateY(-2px)',
                                                            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
                                                            borderColor: '#93c5fd'
                                                        },
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        textAlign: 'center'
                                                    }}
                                                >
                                                    <Avatar
                                                        sx={{
                                                            bgcolor: searchMode === 'cv-to-jobs' ? '#3b82f6' : '#dbeafe',
                                                            width: 60,
                                                            height: 60,
                                                            mb: 2
                                                        }}
                                                    >
                                                        <PersonIcon sx={{
                                                            fontSize: 32,
                                                            color: searchMode === 'cv-to-jobs' ? 'white' : '#3b82f6'
                                                        }} />
                                                    </Avatar>
                                                    <Typography variant="h6" fontWeight="600" mb={1}>
                                                        CV → Jobs
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Find job opportunities that match your CV
                                                    </Typography>
                                                </Card>

                                                <Card
                                                    onClick={() => setSearchMode('jobs-to-cv')}
                                                    sx={{
                                                        flex: 1,
                                                        borderRadius: 4,
                                                        p: 3.5,
                                                        cursor: 'pointer',
                                                        border: searchMode === 'jobs-to-cv'
                                                            ? '2px solid #3b82f6'
                                                            : '1px solid #e5e7eb',
                                                        boxShadow: searchMode === 'jobs-to-cv'
                                                            ? '0 8px 20px rgba(59, 130, 246, 0.15)'
                                                            : '0 4px 6px rgba(0, 0, 0, 0.03)',
                                                        transition: 'all 0.2s ease',
                                                        backgroundColor: searchMode === 'jobs-to-cv'
                                                            ? '#f0f9ff'
                                                            : 'white',
                                                        '&:hover': {
                                                            transform: 'translateY(-2px)',
                                                            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
                                                            borderColor: '#93c5fd'
                                                        },
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        textAlign: 'center'
                                                    }}
                                                >
                                                    <Avatar
                                                        sx={{
                                                            bgcolor: searchMode === 'jobs-to-cv' ? '#3b82f6' : '#dbeafe',
                                                            width: 60,
                                                            height: 60,
                                                            mb: 2
                                                        }}
                                                    >
                                                        <WorkIcon sx={{
                                                            fontSize: 32,
                                                            color: searchMode === 'jobs-to-cv' ? 'white' : '#3b82f6'
                                                        }} />
                                                    </Avatar>
                                                    <Typography variant="h6" fontWeight="600" mb={1}>
                                                        Job → CVs
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Find candidates that match your job requirements
                                                    </Typography>
                                                </Card>
                                            </Box>
                                        </Box>
                                    </Box>

                                    {files.length > 0 && (
                                        <Box mt={4} width="100%">
                                            <Typography variant="subtitle1" fontWeight="bold" mb={2} display="flex" alignItems="center" justifyContent="center">
                                                <FileCopyIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }}/>
                                                Selected Files ({files.length})
                                            </Typography>

                                            <Paper
                                                variant="outlined"
                                                sx={{
                                                    borderRadius: 2,
                                                    overflow: 'hidden',
                                                    border: '1px solid #e5e7eb',
                                                    width: '100%'
                                                }}
                                            >
                                                <List sx={{ py: 0 }}>
                                                    {files.map((file, index) => (
                                                        <Box key={index}>
                                                            {index > 0 && <Divider />}
                                                            <ListItem
                                                                sx={{
                                                                    py: 1.5,
                                                                    '&:hover': {
                                                                        bgcolor: 'rgba(59, 130, 246, 0.04)'
                                                                    }
                                                                }}
                                                                secondaryAction={
                                                                    <Button
                                                                        edge="end"
                                                                        aria-label="delete"
                                                                        onClick={() => handleRemoveFile(index)}
                                                                        color="error"
                                                                        size="small"
                                                                        startIcon={<DeleteIcon />}
                                                                    >
                                                                        Remove
                                                                    </Button>
                                                                }
                                                            >
                                                                <ListItemIcon>
                                                                    <DescriptionIcon sx={{ color: 'primary.main' }} />
                                                                </ListItemIcon>
                                                                <ListItemText
                                                                    primary={file.name}
                                                                    secondary={formatFileSize(file.size)}
                                                                    primaryTypographyProps={{
                                                                        fontWeight: 500,
                                                                        color: 'text.primary'
                                                                    }}
                                                                />
                                                            </ListItem>
                                                        </Box>
                                                    ))}
                                                </List>
                                            </Paper>
                                        </Box>
                                    )}

                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                                        <Button
                                            variant="contained"
                                            size="large"
                                            endIcon={<ArrowForwardIcon />}
                                            onClick={handleSearch}
                                            disabled={files.length === 0 || uploading || uploadComplete}
                                            sx={{
                                                py: 1.5,
                                                px: 5,
                                                fontWeight: 'bold',
                                                borderRadius: 3,
                                                bgcolor: 'primary.main',
                                                boxShadow: '0 4px 14px rgba(59, 130, 246, 0.3)',
                                                '&:hover': {
                                                    bgcolor: 'primary.dark',
                                                    boxShadow: '0 6px 20px rgba(59, 130, 246, 0.4)',
                                                },
                                                '&.Mui-disabled': {
                                                    bgcolor: '#e0e0e0',
                                                    color: '#9e9e9e',
                                                },
                                            }}
                                        >
                                            {uploading
                                                ? 'Processing...'
                                                : searchMode === 'cv-to-jobs'
                                                    ? 'Find Jobs'
                                                    : 'Find Candidates'}
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Box>
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default MatchCV;