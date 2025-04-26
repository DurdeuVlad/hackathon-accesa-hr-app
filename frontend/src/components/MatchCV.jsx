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
    ToggleButtonGroup,
    ToggleButton,
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import {
    CloudUpload as CloudUploadIcon,
    FileCopy as FileCopyIcon,
    Delete as DeleteIcon,
    Description as DescriptionIcon,
    WorkOutline as WorkIcon,
    Person as PersonIcon,
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
    const [searchMode, setSearchMode] = useState('cv-to-jobs'); // 'cv-to-jobs' or 'jobs-to-cv'
    const fileInputRef = useRef(null);

    const validFileTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return `${bytes} bytes`;
        if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / 1048576).toFixed(1)} MB`;
    };

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
        const dropped = Array.from(e.dataTransfer.files);
        const valid = dropped.filter(f => validFileTypes.includes(f.type));
        if (valid.length < dropped.length) {
            setError('Some files are not in PDF, DOC, or DOCX format.');
        }
        if (valid.length) {
            setFiles(prev => [...prev, ...valid]);
        }
    };

    const handleFileInputChange = (e) => {
        setError('');
        const selected = Array.from(e.target.files || []);
        const valid = selected.filter(f => validFileTypes.includes(f.type));
        if (valid.length < selected.length) {
            setError('Some files are not in PDF, DOC, or DOCX format.');
        }
        if (valid.length) {
            setFiles(prev => [...prev, ...valid]);
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

    const handleSearchModeChange = (_, mode) => {
        if (mode) {
            setSearchMode(mode);
        }
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

                <Box sx={{ flex: 1, overflow: 'auto' }}>
                    {/* Header */}
                    <Box
                        sx={{
                            background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                            color: 'white',
                            py: 5,
                            textAlign: 'center',
                        }}
                    >
                        <Container>
                            <Typography variant="h4" fontWeight="bold" gutterBottom>
                                {searchMode === 'cv-to-jobs' ? 'Find Perfect Job Matches' : 'Find Ideal Candidates'}
                            </Typography>
                            <Typography variant="h6" sx={{ opacity: 0.9, mx: 'auto', maxWidth: 700 }}>
                                {searchMode === 'cv-to-jobs'
                                    ? 'Upload your CV to discover job opportunities that match your skills'
                                    : 'Upload job description to find candidates that match your requirements'}
                            </Typography>
                        </Container>
                    </Box>

                    {/* Upload & Mode Toggle */}
                    <Container sx={{ my: 6 }}>
                        <Card sx={{ borderRadius: 4, boxShadow: 3 }}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="h5" fontWeight="bold" mb={3}>
                                    {searchMode === 'cv-to-jobs' ? 'Upload Your CV' : 'Upload Job Description'}
                                </Typography>

                                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                                {uploadComplete && (
                                    <Alert severity="success" sx={{ mb: 3 }}>
                                        {searchMode === 'cv-to-jobs'
                                            ? 'CV uploaded successfully! Redirecting to matches...'
                                            : 'Job description uploaded successfully! Redirecting...'}
                                    </Alert>
                                )}
                                {uploading && (
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="body2" mb={1}>
                                            {searchMode === 'cv-to-jobs'
                                                ? 'Uploading and analyzing your CV...'
                                                : 'Uploading and analyzing job description...'}
                                        </Typography>
                                        <LinearProgress />
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
                                        cursor: 'pointer',
                                        bgcolor: isDragActive ? 'rgba(219,234,254,0.4)' : 'white',
                                        transition: '0.2s',
                                    }}
                                >
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileInputChange}
                                        accept=".pdf,.doc,.docx"
                                        multiple
                                        style={{ display: 'none' }}
                                    />
                                    <CloudUploadIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                                    <Typography variant="h6" fontWeight={500} mb={1}>
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

                                {files.length > 0 && (
                                    <>
                                        <Box sx={{ mt: 4, textAlign: 'center' }}>
                                            <FileCopyIcon sx={{ mr: 1, color: 'primary.main' }} />
                                            <Typography variant="subtitle1" component="span" fontWeight="bold">
                                                Selected Files ({files.length})
                                            </Typography>
                                        </Box>
                                        <List sx={{ maxWidth: 600, mx: 'auto', mt: 2 }}>
                                            {files.map((file, i) => (
                                                <div key={i}>
                                                    {i > 0 && <Divider />}
                                                    <ListItem
                                                        secondaryAction={
                                                            <Button
                                                                onClick={() => handleRemoveFile(i)}
                                                                color="error"
                                                                size="small"
                                                                startIcon={<DeleteIcon />}
                                                            >
                                                                Remove
                                                            </Button>
                                                        }
                                                    >
                                                        <ListItemIcon>
                                                            <DescriptionIcon color="primary" />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={file.name}
                                                            secondary={formatFileSize(file.size)}
                                                        />
                                                    </ListItem>
                                                </div>
                                            ))}
                                        </List>
                                    </>
                                )}

                                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
                                    <ToggleButtonGroup
                                        value={searchMode}
                                        exclusive
                                        onChange={handleSearchModeChange}
                                        aria-label="search mode"
                                    >
                                        <ToggleButton value="cv-to-jobs" aria-label="CV to Jobs">
                                            <PersonIcon sx={{ mr: 1 }} />
                                            CV → Jobs
                                        </ToggleButton>
                                        <ToggleButton value="jobs-to-cv" aria-label="Jobs to CV">
                                            <WorkIcon sx={{ mr: 1 }} />
                                            Jobs → CVs
                                        </ToggleButton>
                                    </ToggleButtonGroup>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        endIcon={<ArrowForwardIcon />}
                                        onClick={runSearch}
                                        disabled={!files.length || uploading || uploadComplete}
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
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default MatchCV;
