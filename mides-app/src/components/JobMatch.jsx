import React, { useState, useEffect } from "react";
import '../styles/JobMatch.css';
import stylesModal from '../styles/Modal.module.css';
import '../styles/TableMatch.css'
import useFetchJobs from "./useFetchJobs";
import Candidato from './Candidate';
import Modal from 'react-modal';
import BusquedaConFiltros from "./BusquedaFiltrado";

Modal.setAppElement('#root');

const JobMatch = () => {
    const { jobs, jobsActives,loading, messageFetchJobs, fetchCandidates, fetchCandidatesIA, fetchSendEmailToCompany } = useFetchJobs();

    const [candidatesMap, setCandidatesMap] = useState({});
    const [commentsIAMap, setCommentsIAMap] = useState({});
    const [currentJobId, setCurrentJobId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isIAModalOpen, setIsIAModalOpen] = useState(false);
    const [isTaskDetailsModalOpen, setIsTaskDetailsModalOpen] = useState(false);
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const [isLoanding, setIsLoanding] = useState(false);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [taskDetailsEssential, setTaskDetailsEssential] = useState([]);
    const [taskDetailsNotEssential, setTaskDetailsNotEssential] = useState([]);
    const [popupJobId, setPopupJobId] = useState(null);
    const [isAddingCandidate, setIsAddingCandidate] = useState(false);

    const handleAddCandidate = (newCandidate) => {
        setCandidatesMap(prevMap => ({
            ...prevMap,
            [currentJobId]: [...(prevMap[currentJobId] || []), newCandidate]
        }));
        setIsAddingCandidate(false);
    };

    const handleFetchCandidates = async (jobId) => {
        setIsLoanding(true)
        const candidatesList = await fetchCandidates(jobId);
        setCandidatesMap(previousCandidatesMap  => ({
            ...previousCandidatesMap ,
            [jobId]: candidatesList
        }));
        setIsLoanding(false)
    };

    const handleFetchCandidatesIA = async (jobId) => {
        setIsLoanding(true)
        const candidatesList = candidatesMap[jobId] || [];
        const response = await fetchCandidatesIA(jobId, candidatesList);
        setCommentsIAMap(previousCandidatesMap => ({
            ...previousCandidatesMap,
            [jobId]: response.split('\n')
        }));
        setIsLoanding(false)
    };

    const handleFetchSendEmail = async (job) => {
        setIsSendingEmail(true);
        
        const emailEmpresa = job.correoEmpresa;
      
        const companyId = job.empresaId;
        const candidatesList = candidatesMap[job.id] || [];
        const jobId = job.id;
        const response = await fetchSendEmailToCompany(companyId,emailEmpresa, candidatesList, jobId)
        setIsSendingEmail(false)
        setIsPopupVisible(true);
        setPopupJobId(job.id);
        setTimeout(() => {
            setPopupJobId(null)
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
       
        setIsTaskDetailsModalOpen(true)
    }

    const openModalComment = (jobId) => {
        setCurrentJobId(jobId);
        setIsIAModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsAddingCandidate(false);
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



    return (
        <div>
            <h2>Match sugerido entre candidatos y empleos</h2>
            <table>
                <thead>
                    <tr>
                        <th className="th">Empleo</th>
                        <th className="th">Empresa</th>
                        <th className="th">Educación minima</th>
                        <th className="th">Tareas</th>
                        <th className="th">Candidatos</th>
                        <th className="th">Sugerencias</th>
                        <th className="th">Postulaciónes</th>
                    </tr>
                </thead>
                <tbody>
                    {jobsActives.map(job => (
                        <tr key={job.id}>
                            <td className="td"> <strong>{job.nombrePuesto}</strong></td>
                            <td className="td"> <strong>{job.empresaNombre}</strong></td>
                            <td className="td educacion-minima-column"> <strong>{job.nivelEducativo}</strong></td>
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
                                <button className="button" onClick={() => handleFetchCandidates(job.id)} disabled={isLoanding} >
                                    Sugerir candidatos
                                </button>
                                <button className="button" onClick={() => handleFetchCandidatesIA(job.id)} disabled={isLoanding} >
                                    Sugerir con IA
                                </button>
                            </td>
                            <td className="td">
                                <button className="button" onClick={() => handleFetchSendEmail(job)} disabled={isSendingEmail} >
                                Postular
                                </button>
                                {popupJobId === job.id && (
                                    <div className="popup">
                                        Correo enviado
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Lista de Candidatos"
                className={stylesModal.modal}
                overlayClassName={stylesModal.overlay}
            >
                <h2>Lista de Candidatos</h2>
                <button  className={stylesModal.matchButtonClose} onClick={closeModal}>Cerrar</button>
                <div>
                    {candidatesMap[currentJobId]?.length > 0 ? (
                        candidatesMap[currentJobId].map(candidate => (
                            <Candidato
                                key={candidate.id}
                                candidato={candidate}
                                onRemove={() => handleRemoveCandidate(candidate.id, currentJobId)}
                            />
                        ))
                    ) : (
                        <p className="text-no-candidate-disponible">No hay candidatos disponibles.</p>
                    )}
                </div>
                <button className={stylesModal.matchButtonAdd} onClick={() => setIsAddingCandidate(true)} >
                    Agregar candidato manualmente
                </button>
                {isAddingCandidate && (
                    <Modal
                        isOpen={isAddingCandidate}
                        onRequestClose={closeModal}
                        contentLabel="Agregar Candidato"
                        className={stylesModal.largeModal}
                        overlayClassName={stylesModal.largeOverlay}
                    >
                        <BusquedaConFiltros onAddCandidate={handleAddCandidate} showAddButton={true} />
                    </Modal>
                )}
            </Modal>
            <Modal
                isOpen={isIAModalOpen}
                onRequestClose={closeIAModal}
                contentLabel="Comentarios de la IA"
                className={stylesModal.modal}
                overlayClassName={stylesModal.overlay}
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
                className={stylesModal.modal}
                overlayClassName={stylesModal.overlay}
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
        </div>
    );
}

export { JobMatch}
