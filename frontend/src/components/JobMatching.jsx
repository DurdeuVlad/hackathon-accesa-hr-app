import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Grid,
  CssBaseline,
  Card,
  CardContent,
  Chip,
  Avatar,
  Button,
  Divider,
  Rating,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import {
  Work as WorkIcon,
  InsertDriveFile as InsertDriveFileIcon,
  ArrowForward as ArrowForwardIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import { getJobScores } from './jobService';
import NavBar from './TopNavBar';
import theme from './CommonTheme';

const JobMatching = ({ onBack, onNavigate, jobId = 'demo-job-123' }) => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayLimit, setDisplayLimit] = useState(5);
  const [jobDetails] = useState({
    title: "Senior Frontend Developer",
    company: "TechCorp Solutions",
    description:
      "Experienced developer proficient in modern JavaScript frameworks, specifically React and Redux. Should have strong UI/UX sensibilities and experience with responsive design.",
    requirements: ["React.js", "JavaScript", "Redux", "HTML/CSS", "Responsive Design"]
  });

  useEffect(() => {
    setLoading(true);
    getJobScores(jobId).then((res) => {
      const mockData = [
        ...res,
        { cvName: "CV-Elena.pdf", score: 68 },
        { cvName: "CV-Mihai.pdf", score: 63 },
        { cvName: "CV-Adrian.pdf", score: 58 },
        { cvName: "CV-Maria.pdf", score: 51 },
        { cvName: "CV-Alex.pdf", score: 47 },
        { cvName: "CV-Ioana.pdf", score: 43 },
        { cvName: "CV-Cristian.pdf", score: 39 }
      ];
      const enhanced = mockData.map(item => ({
        ...item,
        details: {
          technicalMatch: Math.floor(70 + Math.random() * 30),
          experienceMatch: Math.floor(60 + Math.random() * 40),
          educationMatch: Math.floor(50 + Math.random() * 50)
        }
      })).sort((a, b) => b.score - a.score);
      setScores(enhanced);
      setLoading(false);
    });
  }, [jobId]);

  const handleShowMore = () => setDisplayLimit(l => l + 5);

  const displayedScores = scores.slice(0, displayLimit);
  const hasMoreResults = displayLimit < scores.length;
  const matchedJobsCount = scores.filter(s => s.score >= 80).length;
  const totalJobsCount = scores.length;
  const matchPercentage = totalJobsCount
    ? Math.round((matchedJobsCount / totalJobsCount) * 100)
    : 0;

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
        overflow: 'hidden'
      }}>
        <NavBar
          showBackButton
          onBack={onBack}
          onNavigate={onNavigate}
          title="Job Matching Results"
          currentPage="jobmatching"
        />
        <Box sx={{
          flex: 1,
          overflow: 'auto'
        }}>
          <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{
              position: 'relative',
              background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
              color: 'white',
              py: 5,
              mb: 4,
              textAlign: 'center',
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
              <Avatar sx={{
                bgcolor: 'primary.main',
                width: 56,
                height: 56,
                mx: 'auto',
                mb: 2
              }}>
                <WorkIcon sx={{ fontSize: 32 }} />
              </Avatar>
              <Typography variant="h4" fontWeight="bold">
                {jobDetails.title}
              </Typography>
              <Typography variant="subtitle1">
                {jobDetails.company}
              </Typography>
            </Box>

            {/* Match Overview */}
            <Card sx={{ mb: 4, borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" align="center" gutterBottom>
                  Match Overview
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <Box sx={{ position: 'relative' }}>
                    <CircularProgress
                      variant="determinate" value={100}
                      size={120} thickness={4}
                      sx={{ color: 'rgba(0,0,0,0.08)' }}
                    />
                    <CircularProgress
                      variant="determinate" value={matchPercentage}
                      size={120} thickness={4}
                      sx={{
                        color: getScoreColor(matchPercentage),
                        position: 'absolute',
                        left: 0
                      }}
                    />
                    <Box sx={{
                      position: 'absolute', inset: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <Typography variant="h5" fontWeight="bold">
                        {matchPercentage}%
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Typography align="center" gutterBottom>
                  {matchedJobsCount} of {totalJobsCount} CVs have strong matches
                </Typography>
              </CardContent>
            </Card>

            {/* CV Match Results */}
            <Typography variant="h6" fontWeight="bold" mb={3}>
              CV Match Results
            </Typography>
            {displayedScores.map((score, idx) => (
              <Card
                key={idx}
                sx={{
                  mb: 3,
                  borderRadius: 3,
                  borderLeft: `4px solid ${getScoreColor(score.score)}`
                }}
              >
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={9}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.dark' }}>
                          <InsertDriveFileIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight="bold">
                            {score.cvName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Candidate {idx + 1}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 4, mt: 2 }}>
                        <Box>
                          <Typography fontSize={13}>Technical</Typography>
                          <Rating
                            value={score.details.technicalMatch / 20}
                            precision={0.5}
                            readOnly
                            size="small"
                          />
                        </Box>
                        <Box>
                          <Typography fontSize={13}>Experience</Typography>
                          <Rating
                            value={score.details.experienceMatch / 20}
                            precision={0.5}
                            readOnly
                            size="small"
                          />
                        </Box>
                        <Box>
                          <Typography fontSize={13}>Education</Typography>
                          <Rating
                            value={score.details.educationMatch / 20}
                            precision={0.5}
                            readOnly
                            size="small"
                          />
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={3} sx={{ textAlign: 'center' }}>
                      <Box sx={{ position: 'relative', display: 'inline-flex', mb: 1 }}>
                        <CircularProgress
                          variant="determinate"
                          value={100}
                          size={72}
                          thickness={4}
                          sx={{ color: '#e5e7eb' }}
                        />
                        <CircularProgress
                          variant="determinate"
                          value={score.score}
                          size={72}
                          thickness={4}
                          sx={{
                            color: getScoreColor(score.score),
                            position: 'absolute',
                            left: 0
                          }}
                        />
                        <Box sx={{
                          position: 'absolute', inset: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {score.score}%
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
                        label={
                          score.score >= 80
                            ? 'Strong Match'
                            : score.score >= 60
                            ? 'Good Match'
                            : 'Partial Match'
                        }
                        size="small"
                        sx={{ fontWeight: 500, mt: 1 }}
                      />
                    </Grid>
                  </Grid>

                  {/* Accordion Details */}
                  <Accordion sx={{ mt: 3 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography fontWeight="bold">View More Details</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box sx={{ px: 2 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          Job Info
                        </Typography>
                        <Typography>Title: {jobDetails.title}</Typography>
                        <Typography>Description: {jobDetails.description}</Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle1" fontWeight="bold">
                          Candidate Info
                        </Typography>
                        <Typography>File: {score.cvName}</Typography>
                        <Typography>Uploaded: 2025-04-01</Typography>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                </CardContent>
              </Card>
            ))}

            {hasMoreResults && (
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Button
                  variant="outlined"
                  onClick={handleShowMore}
                  startIcon={<ExpandMoreIcon />}
                  sx={{ borderRadius: 2, px: 4, py: 1 }}
                >
                  Show More Results
                </Button>
              </Box>
            )}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default JobMatching;
