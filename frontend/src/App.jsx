import { useState } from 'react'
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import './App.css'
import Login from './components/Login'
import MatchCV from './components/MatchCV'
import Home from './components/Home'
import JobMatching from './components/JobMatching';
import JobDetailPage from './components/JobDetailPage';
import JobListPage from './components/JobListPage';
import StatisticsPage from "./components/StatisticsPage.jsx";
import theme from './components/CommonTheme'; // Import the correct theme path

function App() {
    const [currentPage, setCurrentPage] = useState('home')
    const [previousPage, setPreviousPage] = useState('home')
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [selectedCvId, setSelectedCvId] = useState(null);

    const handleNavigate = (page, score = null, jobId = null) => {
        setPreviousPage(currentPage);
        if (score) setSelectedCvId(score);
        if (jobId) setSelectedJobId(jobId);
        setCurrentPage(page);
    };


    return (
        <>
            {currentPage === 'home' && (
                <Home
                    onNavigateToLogin={() => handleNavigate('login')}
                    onNavigateToMatchCV={() => handleNavigate('matchcv')}
                />
            )}

            {currentPage === 'login' && (
                <Login
                    onBack={() => setCurrentPage(previousPage)}
                    onNext={() => handleNavigate('home')}
                />
            )}

            {currentPage === 'matchcv' && (
                <MatchCV
                    onBack={() => setCurrentPage(previousPage)}
                    onNavigate={handleNavigate}
                />
            )}

            {currentPage === 'jobmatching' && (
                <JobMatching
                    onBack={() => setCurrentPage('matchcv')}
                    onNavigate={handleNavigate}
                    jobId="123"
                />
            )}

            {currentPage === 'jobdetail' && (
                <JobDetailPage
                    onBack={() => setCurrentPage(previousPage)}
                    onNavigate={handleNavigate}
                    jobId="123"
                />
            )}

            {currentPage === 'joblist' && (
                <JobListPage
                    onBack={() => setCurrentPage(previousPage)}
                    onNavigate={handleNavigate}
                />
            )}

            {currentPage === 'statisticspage' && (
                <StatisticsPage
                    onBack={() => setCurrentPage('home')}
                />
            )}



            {currentPage === 'home' && (
                <>
                    <div style={{ marginTop: '30px', display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => handleNavigate('login')}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#2196f3',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Go to Login Page
                        </button>

                        <button
                            onClick={() => handleNavigate('matchcv')}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#2196f3',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Go to Match CV Page
                        </button>

                        <button
                            onClick={() => handleNavigate('jobmatching')}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#2196f3',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Go to Job Matching Page
                        </button>

                        <button
                            onClick={() => handleNavigate('jobdetail')}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#2196f3',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Go to Job Detail Page
                        </button>

                        <button
                            onClick={() => handleNavigate('joblist')}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#2196f3',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Go to Job List Page
                        </button>

                        <button
                            onClick={() => handleNavigate('statisticspage')}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#2196f3',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                            >
                            Go to Statistics Page
                        </button>

                    </div>
                </>
            )}
        </>
    )
}

export default App