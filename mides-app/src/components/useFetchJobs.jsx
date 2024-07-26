import { useState, useEffect } from 'react';

const useFetchJobs = () => {
    const [jobs, setJobs] = useState([])
    const [candidates, setCandidates ] = useState([])
    const [loading, setLoading] = useState(true);
    const [messageFetchJobs, setMessageFetchJobs] =  useState('')
    
    useEffect(() => {
    
        const fetchJobs = async () => {
            try{
                const response = await fetch('http://localhost:8080/empleos')
                if(response.status === 200){
                    const data = await response.json()
                    setJobs(data)
                    setLoading(false);
                }
                else{
                const data = await response.text()
                setMessageFetchJobs(data)
                }
            
            } catch (error) {
                
            }
        };
        
            fetchJobs();
    }, []);
        

    const fetchCandidates = async (jobId) => {

       try{
            const response = await fetch('http://localhost:8080/preFilto',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(jobId)
            })
            if(response.status === 200){
                const data = await response.json()
                setLoading(false);
                return data
            }
            else{
                const data = await response.text()
                setMessageFetchJobs(data)
                return [];
            }
       } catch (error) {
        
    }
     
    }

    const fetchCandidatesIA = async (jobId, candidates) => {
        try{ 
            const candidateIds = candidates.map(candidate => candidate.id);
            console.log(candidateIds)
            const response = await fetch('http://localhost:8080/filtroIA',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ empleoId: jobId, candidatosId:candidateIds })
            })
            if(response.status === 200){
                const data = await response.text()
                setLoading(false);
                return data
            }
            else {
                const errorText = await response.text();
                setMessageFetchJobs(errorText);
                return { candidatesListIA: [], comments: [] };
            }
        } catch (error) {
           
        }      

    }

    const fetchSendEmailToCompany = async (companyId, companyMail, candidates) => {
        try {
            const candidateIds = candidates.map(candidate => candidate.id);
            const response = await fetch('http://localhost:8080/sendEmail',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({candidatosId: candidateIds, empresaId: companyId, empresaMail:companyMail })
            })
            console.log(response)
            if(response.status === 200){
                const data = await response.text()
                setLoading(false);
                return data
            }
            else {
                const errorText = await response.text();
                setMessageFetchJobs(errorText);
                return {};
            }
            
        } catch (error) {
            
        }
    }
         
    return { jobs, loading, messageFetchJobs, fetchCandidates, fetchCandidatesIA, fetchSendEmailToCompany };
}

export default useFetchJobs;