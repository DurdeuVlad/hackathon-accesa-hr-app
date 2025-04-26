import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import {
    CssBaseline,
    Box,
    AppBar,
    Toolbar,
    Typography,
    Button,
    Container,
    Card,
    Grid,
    CssBaseline,
    Avatar,
    AppBar,
    Toolbar,
    IconButton
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import {
    Work as WorkIcon,
    AssessmentOutlined as AssessmentIcon,
    SpeedOutlined as SpeedIcon,
    PersonSearchOutlined as PersonSearchIcon,
    Dashboard as DashboardIcon,
    Business as BusinessIcon,
    Person as PersonIcon,
    Settings as SettingsIcon
} from '@mui/icons-material';
import theme from './CommonTheme';
    IconButton,
    Grid,
    Container,
    Avatar,
    Card
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import SpeedIcon from '@mui/icons-material/Speed';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import theme from './CommonTheme';

function Home({
                  onNavigateToLogin,
                  onNavigateToMatchCV,
                  onNavigateToJobMatching,
                  onNavigateToJobDetail,
                  onNavigateToJobList,
                  onNavigate
              }) {
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
            <Box
                sx={{
                    minHeight: '100vh',
                    width: '100vw',
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: 'background.default',
                    m: 0,
                    p: 0,
                    overflow: 'hidden',
                    position: 'fixed',
                    inset: 0
                }}
            >
                {/* Top Navigation */}
                <AppBar
                    position="static"
                    sx={{
                        width: '100%',
                        boxShadow: 'none',
                        background: 'linear-gradient(90deg, #1e40af 0%, #3b82f6 100%)',
                        color: '#ffffff',
                        borderRadius: 0
                    }}
                >
                    <Box sx={{ width: '100%' }}>
                        <Toolbar sx={{
                            justifyContent: 'space-between',
                            width: '100%',
                            pl: { xs: 1, sm: 2 },
                            pr: { xs: 1, sm: 2 }
                        }}>
                            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                                DevMatch
                            </Typography>

                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button color="inherit" startIcon={<DashboardIcon />} onClick={() => onNavigate('dashboard')} sx={{ display: { xs: 'none', md: 'flex' }, borderRadius: 0 }}>
                                    Dashboard
                                </Button>
                                <Button color="inherit" startIcon={<BusinessIcon />} onClick={() => onNavigate('joblist')} sx={{ display: { xs: 'none', md: 'flex' }, borderRadius: 0 }}>
                                    Jobs
                                </Button>
                                <Button color="inherit" startIcon={<PersonIcon />} onClick={() => onNavigate('profile')} sx={{ display: { xs: 'none', md: 'flex' }, borderRadius: 0 }}>
                                    Profile
                                </Button>
                                <IconButton color="inherit" onClick={() => onNavigate('settings')} sx={{ borderRadius: 0 }}>
                                    <SettingsIcon />
                                </IconButton>
                            </Box>
                        </Toolbar>
                    </Box>
                </AppBar>

                <Box sx={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
                    {/* Hero Section */}
                    <Box sx={{ background: '#2351cc', color: 'white', py: 6, textAlign: 'center' }}>
                        <Container maxWidth="lg">
                            <Typography component="h1" gutterBottom fontWeight="bold" sx={{ fontSize: '2.5rem' }}>
                    <Toolbar
                        sx={{
                            justifyContent: 'space-between',
                            px: { xs: 1, sm: 2 }
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            DevMatch
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                color="inherit"
                                startIcon={<DashboardIcon />}
                                onClick={() => onNavigate('dashboard')}
                                sx={{ display: { xs: 'none', md: 'flex' }, borderRadius: 0 }}
                            >
                                Dashboard
                            </Button>
                            <Button
                                color="inherit"
                                startIcon={<BusinessIcon />}
                                onClick={() => onNavigate('joblist')}
                                sx={{ display: { xs: 'none', md: 'flex' }, borderRadius: 0 }}
                            >
                                Jobs
                            </Button>
                            <Button
                                color="inherit"
                                startIcon={<PersonIcon />}
                                onClick={() => onNavigate('profile')}
                                sx={{ display: { xs: 'none', md: 'flex' }, borderRadius: 0 }}
                            >
                                Profile
                            </Button>
                            <IconButton
                                color="inherit"
                                onClick={() => onNavigate('settings')}
                                sx={{ borderRadius: 0 }}
                            >
                                <SettingsIcon />
                            </IconButton>
                        </Box>
                    </Toolbar>
                </AppBar>

                <Box sx={{ flex: 1, overflow: 'auto' }}>
                    {/* Hero Section */}
                    <Box
                        sx={{
                            background: '#2351cc',
                            color: 'white',
                            py: 6,
                            textAlign: 'center'
                        }}
                    >
                        <Container maxWidth="lg">
                            <Typography
                                component="h1"
                                gutterBottom
                                fontWeight="bold"
                                sx={{ fontSize: '2.5rem' }}
                            >
                                AI-Powered Recruitment Assistant
                            </Typography>
                            <Typography variant="h6" sx={{ mb: 2, opacity: 0.9 }}>
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

                                        borderColor: 'white'
                                    }
                                }}
                            >
                                Login
                            </Button>
                        </Container>
                    </Box>

                    {/* Benefits Section */}
 
                    <Grid container spacing={6} justifyContent="center" sx={{ width: '100%' , mt: 8, mb: 8 }}>
                        {[{
                            icon: <SpeedIcon sx={{ fontSize: 36 }} />,
                            title: 'Reduce screening time',
                            text: 'Process hundreds of CVs in minutes instead of hours.'
                        }, {
                            icon: <AssessmentIcon sx={{ fontSize: 36 }} />,
                            title: 'Precise Matching',
                            text: 'Evaluates skills (30%), industry (10%), and job fit (60%).'
                        }, {
                            icon: <PersonSearchIcon sx={{ fontSize: 36 }} />,
                            title: 'Discover hidden talent',
                            text: 'Uncover candidates often overlooked in manual screening.'
                        }, {
                            icon: <WorkIcon sx={{ fontSize: 36 }} />,
                            title: 'Data-driven Decisions',
                            text: 'Detailed reports on how each candidate fits the job.'
                        }].map((item, index) => (

                    <Grid
                        container
                        spacing={6}
                        justifyContent="center"
                        sx={{ width: '100%', mt: 8, mb: 8 }}
                    >
                        {[
                            {
                                icon: <SpeedIcon sx={{ fontSize: 36 }} />,
                                title: 'Reduce screening time',
                                text: 'Process hundreds of CVs in minutes instead of hours.'
                            },
                            {
                                icon: <AssessmentIcon sx={{ fontSize: 36 }} />,
                                title: 'Precise Matching',
                                text: 'Evaluates skills (30%), industry (10%), and job fit (60%).'
                            },
                            {
                                icon: <PersonSearchIcon sx={{ fontSize: 36 }} />,
                                title: 'Discover hidden talent',
                                text: 'Uncover candidates often overlooked in manual screening.'
                            },
                            {
                                icon: <WorkOutlineIcon sx={{ fontSize: 36 }} />,
                                title: 'Data-driven Decisions',
                                text: 'Detailed reports on how each candidate fits the job.'
                            }
                        ].map((item, index) => (

                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        borderRadius: 5,
                                        textAlign: 'center',
                                        py: 4,
                                        px: 2,
                                        background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)',
                                        boxShadow: '0 6px 18px rgba(0,0,0,0.1)',
                                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-10px)',

                                            boxShadow: '0 12px 24px rgba(0,0,0,0.2)',

                                            boxShadow: '0 12px 24px rgba(0,0,0,0.2)'

                                        }
                                    }}
                                >
                                    <Avatar
                                        sx={{
                                            bgcolor: 'primary.light',
                                            color: 'primary.dark',
                                            width: 70,
                                            height: 70,

                                            margin: '0 auto 20px',

                                            margin: '0 auto 20px'

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

                    {/* Buttons Section */}
                    <Container maxWidth="lg">
                        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2, my: 4 }}>

                    {/* Buttons Section */}
                    <Container maxWidth="lg">
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                flexWrap: 'wrap',
                                gap: 2,
                                my: 4
                            }}
                        >

                            <Button variant="contained" onClick={onNavigateToLogin} sx={{ fontWeight: 'bold' }}>
                                Login
                            </Button>
                            <Button variant="outlined" onClick={onNavigateToMatchCV} sx={{ fontWeight: 'bold' }}>
                                Match CV
                            </Button>
                            <Button variant="contained" onClick={onNavigateToJobMatching} sx={{ fontWeight: 'bold' }}>
                                Job Matching
                            </Button>
                            <Button variant="outlined" onClick={onNavigateToJobDetail} sx={{ fontWeight: 'bold' }}>
                                Job Detail
                            </Button>
                            <Button variant="contained" onClick={onNavigateToJobList} sx={{ fontWeight: 'bold' }}>
                                Job List
                            </Button>
                        </Box>
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}
export default Home;