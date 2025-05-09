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
    Business, EditDocument, DocumentScanner, HomeMax, HomeWork
} from '@mui/icons-material';
import { BarChart } from "@mui/icons-material";
import {useNavigate} from 'react-router-dom';

const TopNavBar = ({ showBackButton, onBack, onNavigate, title, currentPage }) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleDashboardClick = () => {
        if (typeof onNavigate === 'function') {
            onNavigate('home');
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
                                startIcon={<HomeWork />}
                                onClick={() => navigate('/')}
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
                                Home
                            </Button>
                            <Button
                                color="inherit"
                                startIcon={<DocumentScanner />}
                                onClick={() => navigate('/matchcv')}
                                sx={{
                                    fontWeight: currentPage === 'matchcv' ? 700 : 400,
                                    display: isMobile ? 'none' : 'flex',
                                    borderBottom: currentPage === 'home'
                                        ? '3px solid white'
                                        : 'none',
                                    borderRadius: 0,
                                    paddingBottom: '2px'
                                }}
                            >
                                Match
                            </Button>
                            <Button
                                color="inherit"
                                startIcon={<Business />}
                                onClick={() => navigate('/joblist')}
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
                                startIcon={<EditDocument />}
                                onClick={() => navigate('/cvlist')}
                                sx={{
                                    fontWeight: currentPage === 'cvlist' ? 700 : 400,
                                    display: isMobile ? 'none' : 'flex',
                                    borderBottom: currentPage === 'cvlist'
                                        ? '3px solid white'
                                        : 'none',
                                    borderRadius: 0,
                                    paddingBottom: '2px'
                                }}
                            >
                                CVs
                            </Button>
                            <Button
                                color="inherit"
                                startIcon={<BarChart />}
                                onClick={() => navigate('/statisticspage')}
                                sx={{
                                    fontWeight: currentPage === 'statisticspage' ? 700 : 400,
                                    display: isMobile ? 'none' : 'flex',
                                    borderBottom: currentPage === 'statisticspage'
                                        ? '3px solid white'
                                        : 'none',
                                    borderRadius: 0,
                                    paddingBottom: '2px'
                                }}
                            >
                                Statistics
                            </Button>
                        </Box>
                    )}
                </Toolbar>
            </Box>
        </AppBar>
    );
};

export default TopNavBar;