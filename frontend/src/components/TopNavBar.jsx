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
    Business,
    Person,
    Settings
} from '@mui/icons-material';

const TopNavBar = ({ showBackButton, onBack, onNavigate, title, currentPage, fullWidth = false }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
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

                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            color="inherit"
                            startIcon={<Dashboard />}
                            onClick={() => onNavigate('dashboard')}
                            sx={{
                                fontWeight: currentPage === 'dashboard' ? 700 : 400,
                                display: isMobile ? 'none' : 'flex',
                                borderBottom: currentPage === 'dashboard'
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
                            onClick={() => onNavigate('joblist')}
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
                        <Button
                            color="inherit"
                            startIcon={<Person />}
                            onClick={() => onNavigate('profile')}
                            sx={{
                                fontWeight: currentPage === 'profile' ? 700 : 400,
                                display: isMobile ? 'none' : 'flex',
                                borderBottom: currentPage === 'profile'
                                    ? '3px solid white'
                                    : 'none',
                                borderRadius: 0,
                                paddingBottom: '2px'
                            }}
                        >
                            Profile
                        </Button>
                        <IconButton
                            color="inherit"
                            onClick={() => onNavigate('settings')}
                            sx={{
                                borderRadius: 0,
                                padding: '8px'
                            }}
                        >
                            <Settings />
                        </IconButton>
                    </Box>
                </Toolbar>
            </Box>
        </AppBar>
    );
};

export default TopNavBar;