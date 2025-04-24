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
    Search as SearchIcon,
    FileCopy as FileCopyIcon,
    Delete as DeleteIcon,
    Description as DescriptionIcon,
    Info as InfoIcon,
    ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import NavBar from './TopNavBar';
import theme from './CommonTheme';

function MatchCV({ onBack, onNavigate }) {
    const [files, setFiles] = useState([]);
    const [isDragActive, setIsDragActive] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadComplete, setUploadComplete] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

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

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleRemoveFile = (index) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const handleSearch = () => {
        if (files.length === 0) {
            setError('Please upload at least one CV file first.');
            return;
        }

        setError('');
        setUploading(true);
        setTimeout(() => {
            setUploading(false);
            setUploadComplete(true);
            setTimeout(() => {
                console.log('Navigating to job matching with files:', files);
                onNavigate('jobmatching');
            }, 1500);
        }, 2000);
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
                    onBack={onBack}
                    onNavigate={onNavigate}
                    title="Match CV to Jobs"
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
                                Find the Perfect Job Match
                            </Typography>
                            <Typography variant="h6" sx={{ opacity: 0.9, margin: '0 auto', maxWidth: 700 }}>
                                Upload your CV to discover job opportunities that match your skills and experience
                            </Typography>
                        </Container>
                    </Box>

                    <Container maxWidth={false} sx={{ mb: 6, px: { xs: 2, sm: 4 } }}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%'
                        }}>
                            {/* Upload Area */}
                            <Card
                                elevation={0}
                                sx={{
                                    borderRadius: 4,
                                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                                    mb: 4,
                                    overflow: 'visible',
                                    borderTop: '4px solid #3b82f6',
                                    width: '100%',
                                    maxWidth: '700px'
                                }}
                            >
                                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                                    <Typography variant="h5" fontWeight="bold" color="primary.dark" mb={3}>
                                        Upload Your CV
                                    </Typography>

                                    {error && (
                                        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                                            {error}
                                        </Alert>
                                    )}

                                    {uploadComplete && (
                                        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                                            CV uploaded successfully! Redirecting to job matches...
                                        </Alert>
                                    )}

                                    {uploading && (
                                        <Box sx={{ mb: 3 }}>
                                            <Typography variant="body2" mb={1}>
                                                Uploading and analyzing your CV...
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
                                            multiple
                                        />
                                        <CloudUploadIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                                        <Typography variant="h6" color="primary.dark" fontWeight={500} mb={1}>
                                            Drag & drop CV files here
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary" mb={2}>
                                            or <span style={{ color: '#3b82f6', fontWeight: 500 }}>click to browse</span> files
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Accepts PDF, DOC, DOCX (max 5MB per file)
                                        </Typography>
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
                                </CardContent>
                            </Card>
                            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', maxWidth: '700px', mb: 5 }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    startIcon={<SearchIcon />}
                                    endIcon={<ArrowForwardIcon />}
                                    onClick={handleSearch}
                                    disabled={files.length === 0 || uploading || uploadComplete}
                                    sx={{
                                        py: 1.5,
                                        px: 4,
                                        fontWeight: 'bold',
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
                                    {uploading ? 'Processing...' : 'Find Job Matches'}
                                </Button>
                            </Box>
                            <Card
                                sx={{
                                    borderRadius: 4,
                                    bgcolor: '#f0f9ff',
                                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                                    width: '100%',
                                    maxWidth: '900px',
                                    mb: 4
                                }}
                            >
                                <CardContent sx={{ p: 4, flex: 1 }}>
                                    <Typography variant="h5" fontWeight="bold" color="primary.dark" mb={3}>
                                        How It Works
                                    </Typography>

                                    <List>
                                        <ListItem alignItems="flex-start" sx={{ px: 0, py: 1.5 }}>
                                            <ListItemIcon>
                                                <Avatar
                                                    sx={{
                                                        bgcolor: 'primary.main',
                                                        width: 36,
                                                        height: 36,
                                                        color: 'white',
                                                        fontSize: '1rem',
                                                        fontWeight: 'bold'
                                                    }}
                                                >
                                                    1
                                                </Avatar>
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="Upload Your CV"
                                                secondary="Upload your CV in PDF, DOC, or DOCX format. We support multiple files."
                                                primaryTypographyProps={{
                                                    fontWeight: 600,
                                                    color: 'primary.dark',
                                                    gutterBottom: true
                                                }}
                                            />
                                        </ListItem>

                                        <ListItem alignItems="flex-start" sx={{ px: 0, py: 1.5 }}>
                                            <ListItemIcon>
                                                <Avatar
                                                    sx={{
                                                        bgcolor: 'primary.main',
                                                        width: 36,
                                                        height: 36,
                                                        color: 'white',
                                                        fontSize: '1rem',
                                                        fontWeight: 'bold'
                                                    }}
                                                >
                                                    2
                                                </Avatar>
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="AI Analysis"
                                                secondary="Our advanced AI system analyzes your CV, extracting key skills, experience, and qualifications to find the best matches."
                                                primaryTypographyProps={{
                                                    fontWeight: 600,
                                                    color: 'primary.dark',
                                                    gutterBottom: true
                                                }}
                                            />
                                        </ListItem>

                                        <ListItem alignItems="flex-start" sx={{ px: 0, py: 1.5 }}>
                                            <ListItemIcon>
                                                <Avatar
                                                    sx={{
                                                        bgcolor: 'primary.main',
                                                        width: 36,
                                                        height: 36,
                                                        color: 'white',
                                                        fontSize: '1rem',
                                                        fontWeight: 'bold'
                                                    }}
                                                >
                                                    3
                                                </Avatar>
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="View Results"
                                                secondary="Get a ranked list of job matches with detailed compatibility scores and recommendations."
                                                primaryTypographyProps={{
                                                    fontWeight: 600,
                                                    color: 'primary.dark',
                                                    gutterBottom: true
                                                }}
                                            />
                                        </ListItem>
                                    </List>


                                    <Box
                                        sx={{
                                            mt: 4,
                                            p: 3,
                                            bgcolor: 'white',
                                            borderRadius: 3,
                                            border: '1px solid #e5e7eb'
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                                            <InfoIcon sx={{ color: 'primary.main' }} />
                                            <Box>
                                                <Typography variant="subtitle2" fontWeight="bold" color="primary.dark" gutterBottom>
                                                    Pro Tip
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    For best results, ensure your CV is up-to-date with relevant skills and experiences clearly listed. Our AI can detect patterns and match them to the right opportunities.
                                                </Typography>
                                            </Box>
                                        </Box>
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