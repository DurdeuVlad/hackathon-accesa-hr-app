import React, { useEffect, useState, useRef } from 'react';
import {
    Box, Container, Typography, Card, CardContent, List, ListItem, ListItemText, Divider, CircularProgress, Alert, Button, CssBaseline, Chip, Grid
} from '@mui/material';
import { CloudUpload as CloudUploadIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { ThemeProvider } from '@mui/material/styles';
import NavBar from './TopNavBar';
import theme from './CommonTheme';

import { db } from '../FirebaseInit.js';
import { collection, getDocs, orderBy, query, deleteDoc, doc } from 'firebase/firestore';

const CVListPage = () => {
    const [cvs, setCvs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [isDragActive, setIsDragActive] = useState(false);
    const fileInputRef = useRef(null);

    const cvsCollection = collection(db, 'cvs');

    const fetchCvs = async () => {
        setLoading(true);
        try {
            const q = query(cvsCollection, orderBy('uploadedAt', 'desc'));
            const snapshot = await getDocs(q);
            setCvs(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
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

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to upload CV');
            }

            await fetchCvs();
        } catch (err) {
            console.error('Error uploading CV:', err);
            setError('Upload failed: ' + err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async id => {
        setError('');
        try {
            await deleteDoc(doc(db, 'cvs', id));
            fetchCvs();
        } catch (err) {
            console.error(err);
            setError('Delete failed.');
        }
    };

    const handleDragOver = e => { e.preventDefault(); setIsDragActive(true); };
    const handleDragLeave = () => setIsDragActive(false);
    const handleDrop = e => { e.preventDefault(); setIsDragActive(false); Array.from(e.dataTransfer.files).forEach(uploadFile); };
    const handleFileSelect = e => Array.from(e.target.files).forEach(uploadFile);

    const parseName = (text) => {
        const match = text.match(/^(.+?)\s(?:Technical Skills|Professional Skills)/);
        return match ? match[1].trim() : 'Unnamed';
    };

    const parseSkills = (text) => {
        const match = text.match(/Professional Skills (.*?) Foreign Languages/);
        if (!match) return [];
        return match[1].split(/[-,]/).map(s => s.trim()).filter(s => s);
    };

    const parseCertifications = (text) => {
        const match = text.match(/Certifications - (.*?) Project Experience/);
        if (!match) return [];
        return match[1].split(/[-,]/).map(s => s.trim()).filter(s => s);
    };

    const parseSnippet = (text) => {
        const snippet = text.substring(0, 300);
        return snippet.length === 300 ? snippet + '...' : snippet;
    };

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

                        {uploading && <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}><CircularProgress /></Box>}

                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress size={60} /></Box>
                        ) : (
                            <Card sx={{ borderRadius: 3 }}>
                                <CardContent>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>Uploaded CVs</Typography>
                                    <List>
                                        {cvs.length === 0
                                            ? <Typography color="text.secondary">No CVs available.</Typography>
                                            : cvs.map((cv, idx) => (
                                                <React.Fragment key={cv.id}>
                                                    {idx > 0 && <Divider sx={{ my: 1 }} />}
                                                    <ListItem alignItems="flex-start">
                                                        <Grid container spacing={2} alignItems="flex-start">
                                                            <Grid item xs={12} md={10}>
                                                                <Typography variant="h6" fontWeight="bold" color="primary.main">{parseName(cv.contentText)}</Typography>
                                                                <Typography variant="body2" color="text.secondary">Uploaded: {cv.uploadedAt?.toDate().toLocaleString()}</Typography>
                                                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{parseSnippet(cv.contentText)}</Typography>
                                                                <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                                    {parseSkills(cv.contentText).map((skill, i) => <Chip key={i} label={skill} color="primary" size="small" />)}
                                                                    {parseCertifications(cv.contentText).map((cert, i) => <Chip key={`cert-${i}`} label={cert} color="secondary" size="small" />)}
                                                                </Box>
                                                            </Grid>
                                                            <Grid item xs={12} md={2} sx={{ display: 'flex', justifyContent: { md: 'flex-end', xs: 'flex-start' }, alignItems: 'center' }}>
                                                                <Button variant="outlined" color="error" size="small" startIcon={<DeleteIcon />} onClick={() => handleDelete(cv.id)}>
                                                                    Delete
                                                                </Button>
                                                            </Grid>
                                                        </Grid>
                                                    </ListItem>
                                                </React.Fragment>
                                            ))}
                                    </List>
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
