import { useState, useEffect } from 'react';

const useFetchJobs = () => {
    const [jobs, setJobs] = useState([])
    const [jobsActives, setJobsActives] = useState([]);
    const [candidates, setCandidates ] = useState([])
    const [loading, setLoading] = useState(true);
    const [messageFetchJobs, setMessageFetchJobs] =  useState('')
    const token = localStorage.getItem('token');
    const [filtros, setFiltros] = useState([]);
    
    useEffect(() => {
        const fetchJobs = async () => {
            try{
                const response = await fetch('http://localhost:8080/empleos',{
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })
                if(response.status === 200){
                    const data = await response.json()
                    setJobs(data)
                    const activeJobs = data.filter(job => job.activo === 0);                   
                    setJobsActives(activeJobs);
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
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${token}`,
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
            
            const response = await fetch('http://localhost:8080/filtroIA',{
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
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
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({candidatosId: candidateIds, empresaId: companyId, empresaMail:companyMail })
            })
        
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

    const fetchAllCandidates = async () => {
        const response = await fetch('http://localhost:8080/filtro/candidatos',{
        method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({})
        })
        if(response.status === 200){
            const data = await response.json()
            return data
        }
     
    }

    const removeJobFromActives = (id) => {
        setJobsActives(prevJobs => prevJobs.filter(job => job.id !== id));
      };
         
    return { jobs, jobsActives,loading, messageFetchJobs, fetchCandidates, fetchCandidatesIA, fetchSendEmailToCompany, fetchAllCandidates, removeJobFromActives };
}

export default useFetchJobs;