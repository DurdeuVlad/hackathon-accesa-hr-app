import { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Container,
    Paper,
    CssBaseline,
    InputAdornment,
    IconButton,
    Avatar
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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
            <Container component="main" maxWidth="xs">
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '100vh',
                    }}
                >
                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{
                            mb: 4,
                            fontWeight: 'bold',
                            color: 'primary.main',
                            textAlign: 'center'
                        }}
                    >
                        Accesa HR CV Application
                    </Typography>

                    <Paper
                        elevation={3}
                        sx={{
                            padding: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            backgroundColor: 'white',
                            borderRadius: 2,
                            width: '100%'
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
                            Login
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
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
                                sx={{ mb: 2 }}
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
                                sx={{ mb: 3 }}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{
                                    mt: 2,
                                    py: 1.5,
                                    fontWeight: 'bold',
                                    background: 'linear-gradient(45deg, #2196F3 30%, #64B5F6 90%)',
                                    boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
                                    '&:hover': {
                                        background: 'linear-gradient(45deg, #1976D2 30%, #2196F3 90%)',
                                    }
                                }}
                            >
                                Log In
                            </Button>
                        </Box>
                    </Paper>
                    {onBack && (
                        <Button
                            startIcon={<ArrowBackIcon />}
                            onClick={onBack}
                            sx={{
                                mt: 3,
                                color: 'primary.main',
                                fontWeight: 'bold'
                            }}
                        >
                            Back to Home
                        </Button>
                    )}
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default Login;
