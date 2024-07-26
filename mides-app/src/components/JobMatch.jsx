import React, { useState, useEffect } from "react";
import '../styles/JobMatch.css';
import '../styles/Modal.css';
import '../styles/TableMatch.css'
import useFetchJobs from "./useFetchJobs";
import Candidato from './Candidate';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const JobMatch = () => {
    const { jobs, loading, messageFetchJobs, fetchCandidates, fetchCandidatesIA, fetchSendEmailToCompany } = useFetchJobs();

    const [candidatesMap, setCandidatesMap] = useState({});
    const [commentsIAMap, setCommentsIAMap] = useState({});
    const [currentJobId, setCurrentJobId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isIAModalOpen, setIsIAModalOpen] = useState(false);
    const [isTaskDetailsModalOpen, setIsTaskDetailsModalOpen] = useState(false);
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [taskDetailsEssential, setTaskDetailsEssential] = useState([]);
    const [taskDetailsNotEssential, setTaskDetailsNotEssential] = useState([]);

    const handleFetchCandidates = async (jobId) => {
        const candidatesList = await fetchCandidates(jobId);
        setCandidatesMap(previousCandidatesMap  => ({
            ...previousCandidatesMap ,
            [jobId]: candidatesList
        }));
    };

    const handleFetchCandidatesIA = async (jobId) => {
        const candidatesList = candidatesMap[jobId] || [];
        const response = await fetchCandidatesIA(jobId, candidatesList);
        setCommentsIAMap(previousCandidatesMap => ({
            ...previousCandidatesMap,
            [jobId]: response.split('\n')
        }));
    };

    const handleFetchSendEmail = async (job) => {
        setIsSendingEmail(true);
        
        const emailEmpresa = job.correoEmpresa;
        console.log(emailEmpresa)
        const companyId = job.empresaId;
        const candidatesList = candidatesMap[job.id] || [];
        const response = await fetchSendEmailToCompany(companyId,emailEmpresa, candidatesList)
        console.log(response)
        setIsSendingEmail(false)
        setIsPopupVisible(true);
        setTimeout(() => {
            setIsPopupVisible(false);
        }, 3000);
    }

    const handleRemoveCandidate = (candidateId, jobId) => {
        setCandidatesMap(previousCandidatesMap => ({
            ...previousCandidatesMap,
            [jobId]: previousCandidatesMap[jobId].filter(candidate => candidate.id !== candidateId)
        }));
    };

    const openModal = (jobId) => {
        setCurrentJobId(jobId);
        setIsModalOpen(true);
    };

    const openModalTaskDetails = (job) => {
        setTaskDetailsEssential(job.tareas[0]?.detalleTarea || [])
        setTaskDetailsNotEssential(job.tareas[1]?.detalleTarea || [])
        console.log(taskDetailsEssential)
        setIsTaskDetailsModalOpen(true)
    }

    const openModalComment = (jobId) => {
        setCurrentJobId(jobId);
        setIsIAModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const closeIAModal = () => {
        setIsIAModalOpen(false);
    };

    const closeModalTaskDetails = () => {
        setIsTaskDetailsModalOpen(false);
    };

    if (loading) {
        return <div>Cargando...</div>;
    }
    if (messageFetchJobs) {
        return <div>Error: {messageFetchJobs}</div>;
    }

    return (
        <div>
            <h2>Match sugerido entre candidatos y empleos</h2>
            <table>
                <thead>
                    <tr>
                        <th className="th">Empleo</th>
                        <th className="th">Empresa</th>
                        <th className="th">Tareas</th>
                        <th className="th">Candidatos</th>
                        <th className="th">Sugerencias</th>
                        <th className="th">Postulaciónes</th>
                    </tr>
                </thead>
                <tbody>
                    {jobs.map(job => (
                        <tr key={job.id}>
                            <td className="td"> <strong>{job.nombrePuesto}</strong></td>
                            <td className="td"> <strong>{job.empresaNombre}</strong></td>
                            <td className="td">
                            <button className="button" onClick={() => openModalTaskDetails(job)}>
                                    Ver tareas
                            </button>
                            </td>
                            <td className="td">
                                <button className="button" onClick={() => openModal(job.id)}>
                                    Ver lista prefiltro
                                </button>
                                <button className="button" onClick={() => openModalComment(job.id)}>
                                    Ver sugerencia de IA
                                </button>
                            </td>
                            <td className="td">
                                <button className="button" onClick={() => handleFetchCandidates(job.id)}>
                                    Sugerir candidatos
                                </button>
                                <button className="button" onClick={() => handleFetchCandidatesIA(job.id)}>
                                    Sugerir con IA
                                </button>
                            </td>
                            <td className="td">
                                <button className="button" onClick={() => handleFetchSendEmail(job)} disabled={isSendingEmail} >
                                Postular
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Lista de Candidatos"
                className="modal"
                overlayClassName="overlay"
            >
                <h2>Lista de Candidatos</h2>
                <button onClick={closeModal}>Cerrar</button>
                <div>
                    {candidatesMap[currentJobId]?.map(candidate => (
                        <Candidato key={candidate.id} candidato={candidate} onRemove={() => handleRemoveCandidate(candidate.id, currentJobId)} />
                    ))}
                </div>
            </Modal>
            <Modal
                isOpen={isIAModalOpen}
                onRequestClose={closeIAModal}
                contentLabel="Comentarios de la IA"
                className="modal"
                overlayClassName="overlay"
            >
                <h2>Comentarios de la IA</h2>
                <button onClick={closeIAModal}>Cerrar</button>
                <div className="comments-ia">
                    {commentsIAMap[currentJobId]?.map((comment, index) => (
                        <p key={index}>{comment}</p>
                    ))}
                </div>
            </Modal>
            <Modal
                isOpen={isTaskDetailsModalOpen}
                onRequestClose={closeModalTaskDetails}
                contentLabel="Detalles de Tareas"
                className="modal"
                overlayClassName="overlay"
            >
                <h2>Detalles de Tareas</h2>
                <button onClick={closeModalTaskDetails}>Cerrar</button>
                <div className="task-container">
                    <div className="task-list">
                        <h3>Tareas Esenciales</h3>
                        <ul>
                            {Array.isArray(taskDetailsEssential) && taskDetailsEssential.map((task, index) => (
                                <li key={index}>{task.detalle}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="task-list">
                        <h3>Tareas No Esenciales</h3>
                        <ul>
                            {Array.isArray(taskDetailsNotEssential) && taskDetailsNotEssential.map((task, index) => (
                                <li key={index}>{task.detalle}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </Modal>
            {isPopupVisible && (
                <div className="popup">
                    Correo enviado
                </div>
            )}
        </div>
    );
}

export {
    JobMatch
}