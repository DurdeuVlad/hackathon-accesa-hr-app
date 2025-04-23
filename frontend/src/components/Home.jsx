import React from 'react';
import {
    Box,
    Typography,
    Button,
    Container,
    Card,
    CardContent,
    Grid,
    CssBaseline,
    Stack,
    Avatar,
    Paper
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import {
    Work as WorkIcon,
    Search as SearchIcon,
    AssessmentOutlined as AssessmentIcon,
    DescriptionOutlined as DescriptionIcon,
    SpeedOutlined as SpeedIcon,
    PersonSearchOutlined as PersonSearchIcon,
    ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import theme from './CommonTheme'; // Updated import path

function Home({ onNavigateToLogin, onNavigateToMatchCV }) {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}>
                {/* Hero Section */}
                <Box
                    sx={{
                        background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                        color: 'white',
                        py: 10,
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                        <Grid container justifyContent="center">
                            <Grid item xs={12} md={8}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
                                        AI-Powered Recruitment Assistant
                                    </Typography>
                                    <Typography variant="h5" paragraph sx={{ mb: 4, opacity: 0.9 }}>
                                        Streamline recruitment by automatically matching CVs to job requirements
                                    </Typography>
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
                                </Box>
                            </Grid>
                        </Grid>

                    </Container>
                </Box>

                {/* Benefits Section */}
                <Container maxWidth="lg" sx={{ my: 8 }}>
                    <Typography variant="h4" component="h2" textAlign="center" gutterBottom sx={{ mb: 6, color: 'primary.dark' }}>
                        Optimize your recruitment process
                    </Typography>

                    <Grid container spacing={4} justifyContent="center">
                        <Grid item xs={12} sm={6} md={3}>
                            <Card sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                borderRadius: 2,
                                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
                                }
                            }}>
                                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                                    <Avatar sx={{
                                        width: 64,
                                        height: 64,
                                        bgcolor: '#dbeafe',
                                        color: 'primary.main',
                                        mx: 'auto',
                                        mb: 2
                                    }}>
                                        <SpeedIcon sx={{ fontSize: 36 }} />
                                    </Avatar>
                                    <Typography gutterBottom variant="h5" component="h3" sx={{ fontWeight: 600 }}>
                                        Reduce screening time
                                    </Typography>
                                    <Typography>
                                        Process hundreds of CVs in minutes instead of hours or days.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <Card sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                borderRadius: 2,
                                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
                                }
                            }}>
                                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                                    <Avatar sx={{
                                        width: 64,
                                        height: 64,
                                        bgcolor: '#dbeafe',
                                        color: 'primary.main',
                                        mx: 'auto',
                                        mb: 2
                                    }}>
                                        <AssessmentIcon sx={{ fontSize: 36 }} />
                                    </Avatar>
                                    <Typography gutterBottom variant="h5" component="h3" sx={{ fontWeight: 600 }}>
                                        Precise Matching
                                    </Typography>
                                    <Typography>
                                        The algorithm evaluates technical skills (30%), industry knowledge (10%), and job fit (60%).
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <Card sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                borderRadius: 2,
                                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
                                }
                            }}>
                                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                                    <Avatar sx={{
                                        width: 64,
                                        height: 64,
                                        bgcolor: '#dbeafe',
                                        color: 'primary.main',
                                        mx: 'auto',
                                        mb: 2
                                    }}>
                                        <PersonSearchIcon sx={{ fontSize: 36 }} />
                                    </Avatar>
                                    <Typography gutterBottom variant="h5" component="h3" sx={{ fontWeight: 600 }}>
                                        Discover hidden talent
                                    </Typography>
                                    <Typography>
                                        Uncover candidates that might be overlooked in manual screening.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <Card sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                borderRadius: 2,
                                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
                                }
                            }}>
                                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                                    <Avatar sx={{
                                        width: 64,
                                        height: 64,
                                        bgcolor: '#dbeafe',
                                        color: 'primary.main',
                                        mx: 'auto',
                                        mb: 2
                                    }}>
                                        <WorkIcon sx={{ fontSize: 36 }} />
                                    </Avatar>
                                    <Typography gutterBottom variant="h5" component="h3" sx={{ fontWeight: 600 }}>
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

                {/* How It Works Section */}
                <Box sx={{ bgcolor: '#f0f9ff', py: 8 }}>
                    <Container maxWidth="lg">
                        <Typography variant="h4" component="h2" textAlign="center" gutterBottom sx={{ mb: 6, color: 'primary.dark' }}>
                            How it works
                        </Typography>

                        <Grid container spacing={5} alignItems="center">
                            <Grid item xs={12} md={6}>
                                <Box sx={{ p: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                        <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>1</Avatar>
                                        <Typography variant="h5" gutterBottom sx={{ color: 'primary.dark', fontWeight: 'bold', m: 0 }}>
                                            Upload documents
                                        </Typography>
                                    </Box>
                                    <Typography paragraph sx={{ ml: 7, color: 'text.secondary' }}>
                                        Upload candidate CVs (PDF, DOC, DOCX) and the job description or project you're looking to fill.
                                    </Typography>

                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                        <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>2</Avatar>
                                        <Typography variant="h5" gutterBottom sx={{ color: 'primary.dark', fontWeight: 'bold', m: 0 }}>
                                            Automated analysis
                                        </Typography>
                                    </Box>
                                    <Typography paragraph sx={{ ml: 7, color: 'text.secondary' }}>
                                        Our AI algorithm extracts relevant information and analyzes compatibility based on multiple criteria.
                                    </Typography>

                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                        <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>3</Avatar>
                                        <Typography variant="h5" gutterBottom sx={{ color: 'primary.dark', fontWeight: 'bold', m: 0 }}>
                                            Actionable results
                                        </Typography>
                                    </Box>
                                    <Typography paragraph sx={{ ml: 7, color: 'text.secondary' }}>
                                        Get a ranking of candidates, with compatibility scores and detailed explanations, allowing you to focus on the most promising candidates.
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default Home;