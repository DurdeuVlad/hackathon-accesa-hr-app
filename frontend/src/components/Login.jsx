import { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    CssBaseline,
    InputAdornment,
    IconButton,
    Link,
    Container
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import {
    Visibility,
    VisibilityOff
} from '@mui/icons-material';
import theme from './CommonTheme';
import NavBar from './TopNavBar';

function Login({ onNext, onBack }) {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Login attempt with:', formData);
        if (onNext) onNext();
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box
                sx={{
                    minHeight: '100vh',
                    width: '100vw',
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: '#f0f9ff',
                    margin: 0,
                    padding: 0,
                    overflow: 'hidden',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                }}
            >
                {/* Top Navigation Bar */}
                <NavBar
                    showBackButton={true}
                    onBack={onBack}
                    title="Sign In"
                    currentPage="login"
                />

                {/* Full width login form */}
                <Box
                    sx={{
                        flex: 1,
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        py: 4,
                        overflow: 'auto'
                    }}
                >
                    <Container
                        maxWidth={false}
                        disableGutters
                        sx={{
                            width: '100%',
                            px: { xs: 2, sm: 4, md: 6 }
                        }}
                    >
                        <Paper
                            elevation={3}
                            sx={{
                                p: { xs: 3, sm: 5 },
                                borderRadius: 3,
                                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                                bgcolor: 'white',
                                position: 'relative',
                                overflow: 'hidden',
                                width: '100%',
                                maxWidth: '900px',
                                mx: 'auto'
                            }}
                        >
                            {/* Decorative element */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '4px',
                                    background: 'linear-gradient(90deg, #3b82f6 0%, #1e40af 100%)'
                                }}
                            />

                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    width: '100%'
                                }}
                            >
                                <Typography
                                    component="h1"
                                    variant="h4"
                                    sx={{
                                        mb: 1,
                                        fontWeight: 700,
                                        color: 'text.primary'
                                    }}
                                >
                                    Welcome Back
                                </Typography>

                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                    textAlign="center"
                                    sx={{ mb: 4 }}
                                >
                                    Sign in to access the CV matching platform
                                </Typography>

                                <Box
                                    component="form"
                                    onSubmit={handleSubmit}
                                    sx={{
                                        width: '100%',
                                        maxWidth: '600px',
                                        mx: 'auto'
                                    }}
                                >
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="username"
                                        label="Username"
                                        name="username"
                                        autoComplete="username"
                                        autoFocus
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                        sx={{
                                            mb: 3,
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2
                                            }
                                        }}
                                    />

                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        autoComplete="current-password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        variant="outlined"
                                        sx={{
                                            mb: 4,
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2
                                            }
                                        }}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowPassword}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                    />

                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                                        <Link href="#" variant="body2" sx={{ color: 'primary.main' }}>
                                            Forgot password?
                                        </Link>
                                    </Box>

                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        sx={{
                                            py: 1.5,
                                            fontWeight: 600,
                                            fontSize: '1rem',
                                            bgcolor: 'primary.main',
                                            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                                            '&:hover': {
                                                bgcolor: 'primary.dark',
                                                boxShadow: '0 6px 16px rgba(59, 130, 246, 0.4)',
                                            }
                                        }}
                                    >
                                        Sign In
                                    </Button>
                                </Box>
                            </Box>
                        </Paper>
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default Login;