import { useState } from 'react'
import './App.css'
import Login from './components/Login'
import MatchCV from './components/MatchCV'
import Home from './components/Home'
import JobMatching from './components/JobMatching';
import JobDetailPage from './components/JobDetailPage';
import JobListPage from './components/JobListPage';

function App() {
    const [currentPage, setCurrentPage] = useState('home')
    const [previousPage, setPreviousPage] = useState('home')
    const handleNavigate = (page) => {
        setPreviousPage(currentPage);
        setCurrentPage(page);
    };

    return (
        <>
            {currentPage === 'home' && (
                <Home
                    onNavigateToLogin={() => handleNavigate('login')}
                    onNavigateToMatchCV={() => handleNavigate('matchcv')}
                    onNavigateToJobMatching={() => handleNavigate('jobmatching')}
                    onNavigateToJobDetail={() => handleNavigate('jobdetail')}
                    onNavigateToJobList={() => handleNavigate('joblist')}
                    onNavigate={handleNavigate}
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
                    </div>
                </>
            )}
        </>
    )
}

export default App