import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import './App.css';

import theme from './components/CommonTheme';
import TopNavBar from './components/TopNavBar';
import Home from './components/Home';
import Login from './components/Login';
import MatchCV from './components/MatchCV';
import JobMatching from './components/JobMatching';
import JobMatchesResults from './components/JobMatchesResults';
import JobDetailPage from './components/JobDetailPage';
import JobListPage from './components/JobListPage';

function App() {
    const [currentPage, setCurrentPage] = useState('home');
    const [previousPage, setPreviousPage] = useState('home');
    const [searchType, setSearchType] = useState('jobs-to-cv');
    const [currentCvId, setCurrentCvId] = useState('');
    const [currentCvName, setCurrentCvName] = useState('');

    const handleNavigate = (page, data = {}) => {
        setPreviousPage(currentPage);
        setCurrentPage(page);

        if (data.searchType) setSearchType(data.searchType);
        if (data.cvId) setCurrentCvId(data.cvId);
        if (data.cvName) setCurrentCvName(data.cvName);
    };

    const handleBack = (fromPage) => {
        switch (fromPage) {
            case 'matchcv':
                setCurrentPage('home');
                break;
            case 'jobmatching':
            case 'jobmatches':
                setCurrentPage('matchcv');
                break;
            default:
                setCurrentPage(previousPage);
        }
    };

    // expose global navigation if needed
    window.navigateToPage = handleNavigate;

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />

            {currentPage === 'home' && (
                <Home
                    onNavigateToLogin={() => handleNavigate('login')}
                    onNavigateToMatchCV={() => handleNavigate('matchcv')}
                    onNavigateToJobMatching={() => handleNavigate('jobmatching')}
                    onNavigateToJobDetail={() => handleNavigate('jobdetail')}
                    onNavigateToJobList={() => handleNavigate('joblist')}
                />
            )}

            {currentPage === 'login' && (
                <>
                    <TopNavBar
                        showBackButton
                        onBack={() => handleBack('login')}
                        onNavigate={handleNavigate}
                        title="Login"
                        currentPage="login"
                    />
                    <Login
                        onBack={() => handleBack('login')}
                        onNext={() => handleNavigate('home')}
                    />
                </>
            )}

            {currentPage === 'matchcv' && (
                <>
                    <TopNavBar
                        showBackButton
                        onBack={() => handleBack('matchcv')}
                        onNavigate={handleNavigate}
                        title="Match CV"
                        currentPage="matchcv"
                    />
                    <MatchCV
                        onBack={() => handleBack('matchcv')}
                        onNavigate={(page, data) => {
                            if (data.searchType === 'cv-to-jobs') {
                                handleNavigate('jobmatches', {
                                    searchType: data.searchType,
                                    cvId: data.cvId || 'default-cv-001',
                                    cvName: data.cvName || 'Your CV',
                                });
                            } else if (data.searchType === 'jobs-to-cv') {
                                handleNavigate('jobmatching', { searchType: data.searchType });
                            } else {
                                handleNavigate(page, data);
                            }
                        }}
                    />
                </>
            )}

            {currentPage === 'jobmatching' && (
                <>
                    <TopNavBar
                        showBackButton
                        onBack={() => handleBack('jobmatching')}
                        onNavigate={handleNavigate}
                        title="Job Matching"
                        currentPage="jobmatching"
                    />
                    <JobMatching
                        onBack={() => handleBack('jobmatching')}
                        onNavigate={handleNavigate}
                        jobId="123"
                    />
                </>
            )}

            {currentPage === 'jobmatches' && (
                <>
                    <TopNavBar
                        showBackButton
                        onBack={() => handleBack('jobmatches')}
                        onNavigate={handleNavigate}
                        title="Job Matches"
                        currentPage="jobmatches"
                    />
                    <JobMatchesResults
                        onBack={() => handleBack('jobmatches')}
                        onNavigate={handleNavigate}
                        cvId={currentCvId}
                        cvName={currentCvName}
                    />
                </>
            )}

            {currentPage === 'jobdetail' && (
                <>
                    <TopNavBar
                        showBackButton
                        onBack={() => handleBack('jobdetail')}
                        onNavigate={handleNavigate}
                        title="Job Detail"
                        currentPage="jobdetail"
                    />
                    <JobDetailPage
                        onBack={() => handleBack('jobdetail')}
                        onNavigate={handleNavigate}
                        jobId="123"
                    />
                </>
            )}

            {currentPage === 'joblist' && (
                <>
                    <TopNavBar
                        showBackButton
                        onBack={() => handleBack('joblist')}
                        onNavigate={handleNavigate}
                        title="Job List"
                        currentPage="joblist"
                    />
                    <JobListPage
                        onBack={() => handleBack('joblist')}
                        onNavigate={handleNavigate}
                    />
                </>
            )}
        </ThemeProvider>
    );
}

export default App;
