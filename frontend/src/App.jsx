import { useState } from 'react'
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import './App.css'
import Login from './components/Login'
import MatchCV from './components/MatchCV'
import Home from './components/Home'
import JobMatching from './components/JobMatching';
import JobMatchesResults from './components/JobMatchesResults';
import JobDetailPage from './components/JobDetailPage';
import JobListPage from './components/JobListPage';
import StatisticsPage from './components/StatisticsPage';
import theme from './components/CommonTheme';


function App() {
    const [currentPage, setCurrentPage] = useState('home')
    const [previousPage, setPreviousPage] = useState('home')
    const [searchType, setSearchType] = useState('jobs-to-cv')
    const [currentCvId, setCurrentCvId] = useState('')
    const [currentCvName, setCurrentCvName] = useState('')

    const handleNavigate = (page, data) => {
        setPreviousPage(currentPage);
        setCurrentPage(page);
        if (data) {
            if (data.searchType) {
                setSearchType(data.searchType);
            }
            if (data.cvId) {
                setCurrentCvId(data.cvId);
            }
            if (data.cvName) {
                setCurrentCvName(data.cvName);
            }
        }
    };

    window.navigateToPage = (page) => {
        handleNavigate(page);
    };

    const handleBack = (currentPageName) => {
        if (currentPageName === 'matchcv') {
            setCurrentPage('home');
        } else if (currentPageName === 'jobmatching') {
            setCurrentPage('matchcv');
        } else if (currentPageName === 'jobmatches' || currentPageName === 'jobmatchesresults') {
            setCurrentPage('matchcv');
        } else if (currentPageName === 'statisticspage') {
            setCurrentPage('home');
        } else {
            setCurrentPage(previousPage);
        }
    };
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {currentPage === 'home' && (
                <>
                    <Home
                        onNavigateToLogin={() => handleNavigate('login')}
                        onNavigateToMatchCV={() => handleNavigate('matchcv')}
                    />
                    <div style={{ marginTop: '30px', display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button onClick={() => handleNavigate('login')}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#2196f3',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}>
                            Go to Login Page
                        </button>
                        <button onClick={() => handleNavigate('matchcv')}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#2196f3',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}>
                            Go to Match CV Page
                        </button>
                        <button onClick={() => handleNavigate('jobmatching')}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#2196f3',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}>
                            Go to Job Matching Page
                        </button>
                        <button onClick={() => handleNavigate('jobmatchesresults')}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#2196f3',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}>
                            Go to Job Matches Results Page
                        </button>
                        <button onClick={() => handleNavigate('jobdetail')}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#2196f3',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}>
                            Go to Job Detail Page
                        </button>
                        <button onClick={() => handleNavigate('joblist')}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#2196f3',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}>
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

            {currentPage === 'login' && (
                <Login
                    onBack={() => handleBack('login')}
                    onNext={() => handleNavigate('home')}
                />
            )}

            {currentPage === 'matchcv' && (
                <MatchCV
                    onBack={() => handleBack('matchcv')}
                    onNavigate={(page, data) => {
                        if (data && data.searchType) {
                            if (data.searchType === 'cv-to-jobs') {
                                handleNavigate('jobmatchesresults', {
                                    searchType: data.searchType,
                                    cvId: data.cvId || 'default-cv-001',
                                    cvName: data.cvName || 'Your CV'
                                });
                            } else {
                                handleNavigate('jobmatching', {
                                    searchType: data.searchType
                                });
                            }
                        } else {
                            handleNavigate(page);
                        }
                    }}
                />
            )}
            {currentPage === 'jobmatching' && (
                <JobMatching
                    onBack={() => handleBack('jobmatching')}
                    onNavigate={handleNavigate}
                    jobId="123"
                />
            )}
            {currentPage === 'jobmatchesresults' && (
                <JobMatchesResults
                    onBack={() => handleBack('jobmatchesresults')}
                    onNavigate={handleNavigate}
                    cvId={currentCvId}
                    cvName={currentCvName}
                />
            )}
            {currentPage === 'jobdetail' && (
                <JobDetailPage
                    onBack={() => handleBack('jobdetail')}
                    onNavigate={handleNavigate}
                    jobId="123"
                />
            )}
            {currentPage === 'joblist' && (
                <JobListPage
                    onBack={() => handleBack('joblist')}
                    onNavigate={handleNavigate}
                />
            )}
            {currentPage === 'statisticspage' && (
                <StatisticsPage
                    onBack={() => handleBack('statisticspage')}
                />
            )}
            {currentPage === 'statisticspage' && (
                <StatisticsPage
                    onBack={() => handleBack('statisticspage')}
                    onNavigate={handleNavigate}
                />
            )}
        </ThemeProvider>
    )
}

export default App