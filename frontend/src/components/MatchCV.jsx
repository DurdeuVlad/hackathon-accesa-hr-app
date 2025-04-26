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
    Avatar
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

function MatchCV({ onBack, onNavigate }) {
    const [files, setFiles] = useState([]);
    const [isDragActive, setIsDragActive] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadComplete, setUploadComplete] = useState(false);
    const [error, setError] = useState('');
    const [searchMode, setSearchMode] = useState('cv-to-jobs'); // 'cv-to-jobs' or 'jobs-to-cv'
    const fileInputRef = useRef(null);
    const [searchMode, setSearchMode] = useState('cv-to-jobs');

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
                setFiles(prev => [...prev, ...validFiles]);
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
                setFiles(prev => [...prev, ...validFiles]);
            }
        }
    };

    const handleButtonClick = () => fileInputRef.current.click();

    const handleRemoveFile = (idx) => {
        setFiles(files.filter((_, i) => i !== idx));
    };

    const runSearch = () => {
        if (!files.length) {
            setError('Please upload at least one file first.');
            return;
        }
        setError('');
        setUploading(true);
        setTimeout(() => {
            setUploading(false);
            setUploadComplete(true);
            setTimeout(() => {
                onNavigate(searchMode === 'cv-to-jobs' ? 'jobmatchesresults' : 'jobmatching');
            }, 1000);
        }, 1500);
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' bytes';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        else return (bytes / 1048576).toFixed(1) + ' MB';
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box
                sx={{
                    position: 'fixed',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: 'background.default',
                }}
            >
                <NavBar
                    showBackButton
                    onBack={onBack}
                    onNavigate={onNavigate}
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
                            <Typography variant="h6" sx={{ opacity: 0.9, mx: 'auto', maxWidth: 700 }}>
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
                                            ? 'Drag & drop your CV files here'
                                            : 'Drag & drop job description files here'}
                                    </Typography>
                                    <Typography variant="body1" mb={2}>
                                        or <strong style={{ color: '#3b82f6' }}>click to browse</strong>
                                    </Typography>
                                    <Typography variant="caption">
                                        Accepts PDF, DOC, DOCX (max 5MB per file)
                                    </Typography>
                                </Box>

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
