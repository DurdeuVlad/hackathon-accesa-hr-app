import React from 'react';
import {
    Box,
    Typography,
    Button,
    Container,
    Card,
    Grid,
    CssBaseline,
    Avatar,
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import {
    Work as WorkIcon,
    AssessmentOutlined as AssessmentIcon,
    SpeedOutlined as SpeedIcon,
    PersonSearchOutlined as PersonSearchIcon,
} from '@mui/icons-material';
import theme from './CommonTheme';

function Home({ onNavigateToLogin }) {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{
                minHeight: '100vh',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'background.default',
                margin: 0,
                padding: 0,
            }}>
                <Box sx={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Hero Section - header lat pe tot ecranul */}
                    <Box sx={{
                        background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
                        color: 'white',
                        py: 8,
                        textAlign: 'center',
                        width: '100vw',
                        marginLeft: 'calc(-50vw + 50%)',
                        marginRight: 'calc(-50vw + 50%)',
                        boxSizing: 'border-box',
                    }}>
                        <Container maxWidth="xl">
                            <Typography component="h1" gutterBottom fontWeight="bold" sx={{ fontSize: { xs: '2rem', md: '3rem' } }}>
                                AI-Powered Recruitment Assistant
                            </Typography>
                            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, maxWidth: '900px', mx: 'auto' }}>
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
                        </Container>
                    </Box>
                    <Container maxWidth="xl" sx={{ mt: 8, mb: 8 }}>
                        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} justifyContent="center">
                            {[{
                                icon: <SpeedIcon sx={{ fontSize: 30 }} />,
                                title: 'Reduce screening time',
                                text: 'Process hundreds of CVs in minutes instead of hours.'
                            }, {
                                icon: <AssessmentIcon sx={{ fontSize: 30 }} />,
                                title: 'Precise Matching',
                                text: 'Evaluates skills (30%), industry (10%), and job fit (60%).'
                            }, {
                                icon: <PersonSearchIcon sx={{ fontSize: 30 }} />,
                                title: 'Discover hidden talent',
                                text: 'Uncover candidates often overlooked in manual screening.'
                            }, {
                                icon: <WorkIcon sx={{ fontSize: 30 }} />,
                                title: 'Data-driven Decisions',
                                text: 'Detailed reports on how each candidate fits the job.'
                            }].map((item, index) => (
                                <Grid item xs={12} sm={6} lg={3} key={index}>
                                    <Card
                                        sx={{
                                            height: '100%',
                                            borderRadius: 3,
                                            textAlign: 'center',
                                            py: 3,
                                            px: 2,
                                            background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)',
                                            boxShadow: '0 6px 18px rgba(0,0,0,0.1)',
                                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            '&:hover': {
                                                transform: 'translateY(-10px)',
                                                boxShadow: '0 12px 24px rgba(0,0,0,0.2)',
                                            }
                                        }}
                                    >
                                        <Avatar
                                            sx={{
                                                bgcolor: 'primary.light',
                                                color: 'primary.dark',
                                                width: 60,
                                                height: 60,
                                                margin: '0 auto 16px',
                                            }}
                                        >
                                            {item.icon}
                                        </Avatar>
                                        <Typography variant="h6" fontWeight={600} gutterBottom>
                                            {item.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {item.text}
                                        </Typography>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Container>
                    <Box sx={{
                        bgcolor: '#f0f9ff',
                        py: 8,
                        width: '100vw',
                        marginLeft: 'calc(-50vw + 50%)',
                        marginRight: 'calc(-50vw + 50%)',
                    }}>
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
                    <Box sx={{ height: '100px' }}></Box>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default Home;