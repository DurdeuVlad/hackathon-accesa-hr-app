import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
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
import CVListPage from './components/CVListPage';



function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/matchcv" element={<MatchCV />} />
                <Route path="/jobmatching" element={<JobMatching />} />
                <Route path="/jobmatchesresults" element={<JobMatchesResults />} />
                <Route path="/jobdetail" element={<JobDetailPage />} />
                <Route path="/joblist" element={<JobListPage />} />
                <Route path="/statisticspage" element={<StatisticsPage />} />
                <Route path="/cvlist" element={<CVListPage />} />

            </Routes>
        </ThemeProvider>
    );
}

export default App