import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LogoutIcon from '@mui/icons-material/Logout';

const TopNavBar = ({
                       showBackButton = false,
                       onBack,
                       onNavigate,
                       onLogout,
                       title = "Accesa HR CV Parser",
                       currentPage
                   }) => {
    const handleNavigation = (page) => {
        if (onNavigate) {
            onNavigate(page);
        }
    };

    return (
        <AppBar position="static">
            <Toolbar>
                {/*buton de a merge inapoi*/}
                {showBackButton && (
                    <IconButton
                        color="inherit"
                        edge="start"
                        aria-label="back"
                        onClick={onBack}
                        sx={{ mr: 2 }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                )}
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    {title}
                </Typography>

                {/* link ca s apot naviga */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {currentPage !== 'matchcv' && (
                        <Button
                            color="inherit"
                            onClick={() => handleNavigation('matchcv')}
                        >
                            Match CV
                        </Button>
                    )}

                    {currentPage !== 'jobmatching' && (
                        <Button
                            color="inherit"
                            onClick={() => handleNavigation('jobmatching')}
                        >
                            Job Management
                        </Button>
                    )}

                    {currentPage !== 'stats' && (
                        <Button
                            color="inherit"
                            onClick={() => handleNavigation('stats')}
                        >
                            Stats
                        </Button>
                    )}

                    {/* buton de logout care inca nu exitsa urmeaza prieteni*/}
                    {onLogout && (
                        <IconButton
                            color="inherit"
                            onClick={onLogout}
                            sx={{ ml: 2 }}
                            aria-label="logout"
                        >
                            <LogoutIcon />
                        </IconButton>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default TopNavBar;