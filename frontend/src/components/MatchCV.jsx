import { useState, useRef } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    Container,
    CssBaseline
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SearchIcon from '@mui/icons-material/Search';
import TopNavBar from './TopNavBar';

const theme = createTheme({
    palette: {
        primary: {
            main: '#2196f3',
            light: '#64b5f6',
            dark: '#1976d2',
        },
        background: {
            default: '#e3f2fd',
        },
    },
});

function MatchCV({ onBack, onNavigate }) {
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);
    const [isDragActive, setIsDragActive] = useState(false);

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

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const droppedFile = e.dataTransfer.files[0];
            setFile(droppedFile);
            console.log('File dropped:', droppedFile.name);
        }
    };

    const handleFileInputChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            console.log('File selected:', e.target.files[0].name);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleSearch = () => {
        if (file) {
            console.log('Searching for matches with file:', file.name);
        } else {
            alert('Please upload a CV first');
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <div>
                <TopNavBar
                    showBackButton={true}
                    onBack={onBack}
                    onNavigate={onNavigate}
                    title="Match CV"
                    currentPage="matchcv"
                />

                <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
                    <Typography
                        variant="h4"
                        component="h1"
                        align="center"
                        sx={{
                            mb: 5,
                            fontWeight: 'bold',
                            color: 'primary.dark'
                        }}
                    >
                        Find the Perfect Match for Your CV
                    </Typography>

                    <Paper
                        elevation={3}
                        sx={{
                            p: 2,
                            mb: 4,
                            borderRadius: 2,
                            textAlign: 'center'
                        }}
                    >
                        <Box
                            sx={{
                                p: 5,
                                border: isDragActive ? '3px dashed #1976d2' : '3px dashed #90caf9',
                                borderRadius: 2,
                                bgcolor: isDragActive ? 'rgba(33, 150, 243, 0.1)' : 'white',
                                transition: 'all 0.3s',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                '&:hover': {
                                    border: '3px dashed #1976d2',
                                    bgcolor: 'rgba(33, 150, 243, 0.05)',
                                }
                            }}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={handleButtonClick}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileInputChange}
                                style={{ display: 'none' }}
                                accept=".pdf,.doc,.docx"
                            />
                            <CloudUploadIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                            <Typography variant="h5" component="h2" sx={{ mb: 1 }}>
                                Drag and drop CV
                            </Typography>
                            <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
                                or click to browse files
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Accepts PDF, DOC, DOCX (max 5MB)
                            </Typography>

                            {file && (
                                <Box
                                    sx={{
                                        mt: 2,
                                        p: 2,
                                        bgcolor: 'rgba(100, 181, 246, 0.2)',
                                        borderRadius: 1,
                                        width: '100%',
                                        maxWidth: '400px'
                                    }}
                                >
                                    <Typography variant="body2">
                                        <strong>Selected file:</strong> {file.name}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Paper>

                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<SearchIcon />}
                            onClick={handleSearch}
                            disabled={!file}
                            sx={{
                                py: 1.5,
                                px: 4,
                                fontWeight: 'bold',
                                background: 'linear-gradient(45deg, #2196F3 30%, #64B5F6 90%)',
                                boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #1976D2 30%, #2196F3 90%)',
                                },
                                '&.Mui-disabled': {
                                    background: '#e0e0e0',
                                    color: '#9e9e9e',
                                },
                            }}
                        >
                            Search
                        </Button>
                    </Box>
                </Container>
            </div>
        </ThemeProvider>
    );
}

export default MatchCV;