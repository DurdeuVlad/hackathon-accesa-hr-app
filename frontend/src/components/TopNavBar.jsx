import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Box,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    ArrowBack,
    Dashboard,
    Business
} from '@mui/icons-material';

const TopNavBar = ({ showBackButton, onBack, onNavigate, title, currentPage }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleDashboardClick = () => {
        if (typeof onNavigate === 'function') {
            onNavigate('home');
        }
    };

    const handleJobsClick = () => {
        if (typeof onNavigate === 'function') {
            onNavigate('joblist');
        }
    };

    const isLoginPage = currentPage === 'login';
    return (
        <AppBar
            position="static"
            sx={{
                width: '100%',
                boxShadow: 'none',
                background: 'linear-gradient(90deg, #1e40af 0%, #3b82f6 100%)',
                color: '#ffffff',
                borderRadius: 0,
                zIndex: 1100
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    margin: 0,
                    padding: 0
                }}
            >
                <Toolbar sx={{
                    justifyContent: 'space-between',
                    width: '100%',
                    pl: { xs: 1, sm: 2 },
                    pr: { xs: 1, sm: 2 }
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {showBackButton && (
                            <IconButton
                                color="inherit"
                                edge="start"
                                onClick={onBack}
                                sx={{ mr: 2 }}
                            >
                                <ArrowBack />
                            </IconButton>
                        )}
                        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                            {title}
                        </Typography>
                    </Box>
                    {!isLoginPage && (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                color="inherit"
                                startIcon={<Dashboard />}
                                onClick={handleDashboardClick}
                                sx={{
                                    fontWeight: currentPage === 'home' ? 700 : 400,
                                    display: isMobile ? 'none' : 'flex',
                                    borderBottom: currentPage === 'home'
                                        ? '3px solid white'
                                        : 'none',
                                    borderRadius: 0,
                                    paddingBottom: '2px'
                                }}
                            >
                                Dashboard
                            </Button>
                            <Button
                                color="inherit"
                                startIcon={<Business />}
                                onClick={handleJobsClick}
                                sx={{
                                    fontWeight: currentPage === 'joblist' ? 700 : 400,
                                    display: isMobile ? 'none' : 'flex',
                                    borderBottom: currentPage === 'joblist'
                                        ? '3px solid white'
                                        : 'none',
                                    borderRadius: 0,
                                    paddingBottom: '2px'
                                }}
                            >
                                Jobs
                            </Button>
                        </Box>
                    )}
                </Toolbar>
            </Box>
        </AppBar>
    );
};

export default TopNavBar;