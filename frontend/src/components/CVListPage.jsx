// Enhanced CVListPage.jsx: correctly fetch CVs from Firebase after uploading, add instantly new items and fix delete button layout

import React, { useEffect, useState, useRef } from 'react';
import {
    Box, Container, Typography, Card, CardContent, List, ListItem, Divider, CircularProgress, Alert, Button, CssBaseline, Chip, Grid, Fade
} from '@mui/material';
import { CloudUpload as CloudUploadIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { ThemeProvider } from '@mui/material/styles';
import NavBar from './TopNavBar';
import theme from './CommonTheme';
import { db } from '../FirebaseInit';
import { collection, getDocs, orderBy, query, deleteDoc, doc } from 'firebase/firestore';

const CVListPage = () => {
    const [cvs, setCvs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [isDragActive, setIsDragActive] = useState(false);
    const [page, setPage] = useState(0);
    const cvsPerPage = 5;
    const fileInputRef = useRef(null);

    const fetchCvs = async () => {
        setLoading(true);
        try {
            const cvsCollection = collection(db, 'cvs');
            const q = query(cvsCollection, orderBy('uploadedAt', 'desc'));
            const snapshot = await getDocs(q);
            const fetchedCvs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCvs(fetchedCvs);
        } catch (err) {
            console.error(err);
            setError('Failed to load CVs.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCvs();
    }, []);

    const uploadFile = async (file) => {
        setUploading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('userId', 'placeholder-user-123');

            const response = await fetch('http://localhost:8080/cvs', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to upload CV');
            }

            const newCV = {
                id: result.cvId,
                fileName: result.fileName,
                contentText: result.cvText,
                uploadedAt: { toDate: () => new Date(result.uploadedAt) }
            };

            setCvs(prev => [newCV, ...prev]);
            setPage(0);

        } catch (err) {
            console.error('Error uploading CV:', err);
            setError('Upload failed: ' + err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, 'cvs', id));
            fetchCvs();
        } catch (err) {
            console.error('Error deleting CV:', err);
            setError('Delete failed: ' + err.message);
        }
    };

    const handleDragOver = e => { e.preventDefault(); setIsDragActive(true); };
    const handleDragLeave = () => setIsDragActive(false);
    const handleDrop = e => { e.preventDefault(); setIsDragActive(false); Array.from(e.dataTransfer.files).forEach(uploadFile); };
    const handleFileSelect = e => Array.from(e.target.files).forEach(uploadFile);

    const paginatedCvs = cvs.slice(page * cvsPerPage, (page + 1) * cvsPerPage);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ minHeight: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', bgcolor: 'background.default', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
                <NavBar showBackButton onBack={() => window.history.back()} title="CV Library" currentPage="cvlist" />

                <Box sx={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
                    <Box sx={{ background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', color: 'white', py: 5 }}>
                        <Container maxWidth="lg">
                            <Typography variant="h4" fontWeight="bold" textAlign="center">CV Library</Typography>
                            <Typography variant="h6" sx={{ opacity: 0.9, textAlign: 'center' }}>Upload and manage your CVs</Typography>
                        </Container>
                    </Box>

                    <Box sx={{ flex: 1, px: { xs: 2, sm: 3 }, width: '100%', maxWidth: '1400px', margin: '0 auto', pb: 6, pt: 4 }}>
                        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                        <Card sx={{ mb: 4, borderRadius: 3 }}>
                            <CardContent>
                                <Box onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={() => fileInputRef.current.click()}
                                     sx={{ border: isDragActive ? '2px dashed #3b82f6' : '2px dashed #93c5fd', borderRadius: 2, p: 5, textAlign: 'center', cursor: 'pointer', backgroundColor: isDragActive ? 'rgba(219,234,254,0.4)' : 'white' }}>
                                    <input ref={fileInputRef} type="file" hidden accept=".pdf,.doc,.docx,.txt" multiple onChange={handleFileSelect} />
                                    <CloudUploadIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
                                    <Typography variant="h6">Drag & drop CVs here or click to browse</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Accepts PDF, Word, or Text files</Typography>
                                </Box>
                            </CardContent>
                        </Card>

                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress size={60} /></Box>
                        ) : (
                            <Card sx={{ borderRadius: 3 }}>
                                <CardContent>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>Uploaded CVs</Typography>
                                    <List>
                                        {paginatedCvs.length === 0
                                            ? <Typography color="text.secondary">No CVs available.</Typography>
                                            : paginatedCvs.map((cv) => (
                                                <Fade in timeout={500} key={cv.id}>
                                                    <ListItem alignItems="flex-start">
                                                        <Grid container spacing={2} alignItems="center">
                                                            <Grid item xs={10}>
                                                                <Typography variant="h6" fontWeight="bold" color="primary.main">
                                                                    {cv.fileName || 'Unnamed'}
                                                                </Typography>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    Uploaded: {new Date(cv.uploadedAt.toDate ? cv.uploadedAt.toDate() : cv.uploadedAt).toLocaleString()}
                                                                </Typography>
                                                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{cv.contentText?.substring(0, 300)}...</Typography>
                                                            </Grid>
                                                            <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                                                <Button
                                                                    variant="outlined"
                                                                    color="error"
                                                                    size="small"
                                                                    startIcon={<DeleteIcon />}
                                                                    onClick={() => handleDelete(cv.id)}
                                                                >
                                                                    Delete
                                                                </Button>
                                                            </Grid>
                                                        </Grid>
                                                    </ListItem>
                                                </Fade>
                                            ))}
                                    </List>

                                    {cvs.length > cvsPerPage && (
                                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, gap: 2 }}>
                                            <Button variant="outlined" onClick={() => setPage(page - 1)} disabled={page === 0}>Previous</Button>
                                            <Button variant="outlined" onClick={() => setPage(page + 1)} disabled={(page + 1) * cvsPerPage >= cvs.length}>Next</Button>
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default CVListPage;