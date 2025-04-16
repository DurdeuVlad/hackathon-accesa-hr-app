import React from 'react';
import {
    Box,
    Typography,
    Button,
    Container,
    AppBar,
    Toolbar,
    Card,
    CardContent,
    Grid,
    CssBaseline,
    Stack
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import WorkIcon from '@mui/icons-material/Work';
import SearchIcon from '@mui/icons-material/Search';
import AssessmentIcon from '@mui/icons-material/Assessment';
import DescriptionIcon from '@mui/icons-material/Description';
import SpeedIcon from '@mui/icons-material/Speed';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';

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

function Home({ onNavigateToLogin, onNavigateToMatchCV }) {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}>

                {/* App Bar / Header */}
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                            Accesa HR CV Parser
                        </Typography>
                    </Toolbar>
                </AppBar>

                {/*sectiunea de inceput*/}
                <Box
                    sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        py: 8,
                        textAlign: 'center',
                    }}
                >
                    <Container maxWidth="md">
                        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
                            AI-Powered Recruitment Assistant
                        </Typography>
                        <Typography variant="h5" paragraph sx={{ mb: 4 }}>
                            Streamline recruitment by automatically matching CVs to job requirements
                        </Typography>
                        <Stack direction="row" spacing={2} justifyContent="center">
                            <Button
                                variant="outlined"
                                size="large"
                                onClick={onNavigateToLogin}
                                sx={{
                                    color: 'white',
                                    borderColor: 'white',
                                    fontWeight: 'bold',
                                    px: 4,
                                    py: 1.5,
                                    '&:hover': {
                                        bgcolor: 'rgba(255,255,255,0.1)',
                                        borderColor: 'white',
                                    },
                                }}
                            >
                                Login
                            </Button>
                        </Stack>
                    </Container>
                </Box>
                {/*sectiunea de beneficii*/}
                <Container maxWidth="lg" sx={{ my: 8 }}>
                    <Typography variant="h4" component="h2" textAlign="center" gutterBottom sx={{ mb: 6, color: 'primary.dark' }}>
                        Optimize your recruitment process
                    </Typography>

                    <Grid container spacing={4} justifyContent="center">
                        <Grid item xs={12} md={3}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
                                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                                    <SpeedIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                                    <Typography gutterBottom variant="h5" component="h3">
                                        Reduce screening time
                                    </Typography>
                                    <Typography>
                                        Process hundreds of CVs in minutes instead of hours or days.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
                                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                                    <AssessmentIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                                    <Typography gutterBottom variant="h5" component="h3">
                                        Precise Matching
                                    </Typography>
                                    <Typography>
                                        The algorithm evaluates technical skills (30%), industry knowledge (10%), and job fit (60%).
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
                                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                                    <PersonSearchIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                                    <Typography gutterBottom variant="h5" component="h3">
                                        Discover hidden talent
                                    </Typography>
                                    <Typography>
                                        Uncover candidates that might be overlooked in manual screening.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
                                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                                    <WorkIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                                    <Typography gutterBottom variant="h5" component="h3">
                                        Data-driven Decisions
                                    </Typography>
                                    <Typography>
                                        Get detailed reports explaining why a candidate matches the job requirements.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
                {/*sectiunea despre cum functioneaza*/}
                <Box sx={{ bgcolor: '#bbdefb', py: 8 }}>
                    <Container maxWidth="lg">
                        <Typography variant="h4" component="h2" textAlign="center" gutterBottom sx={{ mb: 6, color: 'primary.dark' }}>
                            How it works?
                        </Typography>

                        <Grid container spacing={5} justifyContent="center">
                            <Grid item xs={12} md={6}>
                                <Box sx={{ p: 2 }}>
                                    <Typography variant="h5" gutterBottom sx={{ color: 'primary.dark', fontWeight: 'bold' }}>
                                        1. Upload documents
                                    </Typography>
                                    <Typography paragraph>
                                        Upload candidate CVs (PDF, DOC, DOCX) and the job description or project you're looking to fill.
                                    </Typography>

                                    <Typography variant="h5" gutterBottom sx={{ color: 'primary.dark', fontWeight: 'bold', mt: 4 }}>
                                        2. Automated analysis
                                    </Typography>
                                    <Typography paragraph>
                                        Our AI algorithm extracts relevant information and analyzes compatibility based on multiple criteria.
                                    </Typography>

                                    <Typography variant="h5" gutterBottom sx={{ color: 'primary.dark', fontWeight: 'bold', mt: 4 }}>
                                        3. Actionable results
                                    </Typography>
                                    <Typography paragraph>
                                        Get a ranking of candidates, with compatibility scores and detailed explanations, allowing you to focus on the most promising candidates.
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}
export default Home;
