import { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

const initialState = {
    paginationIndex: 0,
    jobFilters: {
        searchTerm: '',
        filterIndustry: '',
        sortOrder: 'newest',
    },
    uploadedCVs: [],
    jobDescription: {
        jobTitle: '',
        industry: '',
        company: '',
        location: '',
        description: '',
        technicalSkills: [],
    },
    matchCVFiles: [],
};

function reducer(state, action) {
    switch (action.type) {
        case 'SET_PAGINATION':
            return { ...state, paginationIndex: action.payload };
        case 'SET_FILTERS':
            return { ...state, jobFilters: { ...state.jobFilters, ...action.payload } };
        case 'SET_UPLOADED_CVS':
            return { ...state, uploadedCVs: action.payload };
        case 'SET_JOB_DESCRIPTION':
            return { ...state, jobDescription: { ...state.jobDescription, ...action.payload } };
        case 'SET_MATCH_CV_FILES':
            return { ...state, matchCVFiles: action.payload };
        default:
            return state;
    }
}

export const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};