{/*am facut asta ca sa vad cum arata doar*/}
export const getJobScores = async (jobId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { cvName: "CV-Ana.pdf", score: 91 },
                { cvName: "CV-Gabriel.pdf", score: 82 },
                { cvName: "CV-Radu.pdf", score: 74 },
            ]);
        }, 1000);
    });
};
