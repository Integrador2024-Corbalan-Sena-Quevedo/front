import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import useFetchJobs from "./useFetchJobs";
import  "../styles/Follow.css"

Modal.setAppElement("#root");

const Follow = () => {
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('user')
  const [olValues, setOlValues] = useState({});
  const { jobs, jobsActives, fetchAllCandidates, removeJobFromActives} = useFetchJobs();
  const [candidates, setCandidates] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [isFollowModalOpen, setIsFollowModalOpen] = useState(false);
  const [followText, setFollowText] = useState('');
  const [followData, setFollowData] = useState({});
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentFollowCandidateId, setCurrentFollowCandidateId] = useState(null);
  const [searchCandidate, setSearchCandidate] = useState('');




  const handleInputChange = (e, id) => {
    const { name, value } = e.target;
    setOlValues(prevState => ({
      ...prevState,
      [`${name}${id}`]: value
    }));
  };

  const handleSave = async (id) => {

    const seguimientoDTO = {
      empresaId: jobsActives.find(job => job.id === id).empresaId,
      empleoId: jobsActives.find(job => job.id === id).id,
      nombreEmpresa: jobsActives.find(job => job.id === id).empresaNombre,
      nombreEmpleo: jobsActives.find(job => job.id === id).nombrePuesto,
      operadorLaboral: username,
      tramite: jobsActives.find(job => job.id === id).idEncuesta,
      documentoEmpleado: olValues[`documento${id}`],
      nombreEmpleado: olValues[`nombre${id}`],
      discapacidades: olValues[`discapacidades${id}`],
      nombreEncargado: olValues[`encargado${id}`],
      emailEncargado: olValues[`mailEncargado${id}`],
      fechaIngresoEmpleado: olValues[`fechaIngreso${id}`],
      localidad: jobsActives.find(job => job.id === id).localidad,
      detalles: followData[olValues[`candidateId${id}`]] || [],
      telefonoEmpleado: "091732443"
    };
    
    
    try {
      const response = await fetch('http://midesuy-env.eba-bjxi9i8c.us-east-1.elasticbeanstalk.com/newSeguimiento', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(seguimientoDTO)
      });

      if (!response.ok) {
        throw new Error('Error al guardar el seguimiento');
      }else{
        removeJobFromActives(id);
      }

    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleFetchCandidates = async (jobId) => {
    const candidates = await fetchAllCandidates();
    setCandidates(Object.values(candidates));
    setSelectedJobId(jobId);
    setIsModalOpen(true);
  };

  const handleCandidateSelect = (candidate) => {
    const tiposDiscapacidades = candidate.discapacidad.tipoDiscapacidades.map(tipo => tipo.nombre).join(', ');
    setOlValues(prevState => ({
      ...prevState,
      [`documento${selectedJobId}`]: candidate.documento,
      [`nombre${selectedJobId}`]: candidate.nombre,
      [`discapacidades${selectedJobId}`]: tiposDiscapacidades,
      [`telefonos${selectedJobId}`]: candidate.telefonos.map(telefono => telefono.numeroUno),
      [`candidateId${selectedJobId}`]: candidate.id
    }));
    setIsModalOpen(false);
  };

  const handleNew = (jobId) => {
    setSelectedJobId(jobId);
    setCurrentFollowCandidateId(olValues[`candidateId${jobId}`]);
    setIsFollowModalOpen(true);
  };

  const handleFollowSave = () => {
    setFollowData(prevState => ({
      ...prevState,
      [currentFollowCandidateId]: [
        ...(prevState[currentFollowCandidateId] || []),
        followText
      ]
    }));
    setIsFollowModalOpen(false);
    setFollowText('');
  };

  const handleView = (jobId) => {
    setCurrentFollowCandidateId(olValues[`candidateId${jobId}`]);
    setIsViewModalOpen(true);
  };

  const filteredCandidates = candidates.filter(candidate =>
    candidate.documento.toLowerCase().includes(searchCandidate.toLowerCase())||
    candidate.nombre.toLowerCase().includes(searchCandidate.toLowerCase()) ||
    candidate.apellido.toLowerCase().includes(searchCandidate.toLowerCase())
  );

  


  return (
    <>
    <h2>Asignar candidato a empleo</h2>
      <table className="follow-table">
        <thead>
          <tr>
            <th className="th">Empresa</th>
            <th className="th">Empleo</th>
            <th className="th">OL</th>
            <th className="th">Trámite</th>
            <th className="th">Documento</th>
            <th className="th">Nombre</th>
            <th className="th">Discapacidades</th>
            <th className="th">Télefono</th>
            <th className="th">Encargado</th>
            <th className="th">Mail encargado</th>
            <th className="th">Localidad</th>
            <th className="th">Fecha Ingreso</th>
            <th className="th">Detalle</th>
            <th className="th"></th>
          </tr>
        </thead>
        <tbody>
          {jobsActives.map(job => (
            <tr key={job.id}>
              <td className="td"><strong>{job.empresaNombre}</strong></td>
              <td className="td"><strong>{job.nombrePuesto}</strong></td>
              <td className="td"><strong>{username}</strong></td>
              <td className="td"><strong>{job.idEncuesta}</strong></td>
              <td className="td">
                <button className="follow-button" onClick={() => handleFetchCandidates(job.id)}>buscar</button>
                <strong>{olValues[`documento${job.id}`] || ''}</strong>
              </td>
              <td className="td"><strong>{olValues[`nombre${job.id}`] || ''}</strong></td>
              <td className="td"><strong>{olValues[`discapacidades${job.id}`] || ''}</strong></td>
              <td className="td"><strong>{olValues[`telefonos${job.id}`] || ''}</strong></td>
              <td className="td">
                <input
                  className="bold-input"  
                  type="text"
                  name="encargado"
                  value={olValues[`encargado${job.id}`] || ''}
                  onChange={(e) => handleInputChange(e, job.id)}
                />
              </td>
              <td className="td">
                <input
                  className="bold-input" 
                  type="text"
                  name="mailEncargado"
                  value={olValues[`mailEncargado${job.id}`] || ''}
                  onChange={(e) => handleInputChange(e, job.id)}
                />
              </td>
              <td className="td"><strong>{job.localidad}</strong></td>
              <td className="td">
                <input
                  type="date"
                  name="fechaIngreso"
                  value={olValues[`fechaIngreso${job.id}`] || ''}
                  onChange={(e) => handleInputChange(e, job.id)}
                />
              </td>
              <td className="td">
                <button className="follow-button" onClick={() => handleView(job.id)}>Ver</button>
                <button className="follow-button" onClick={() => handleNew(job.id)} disabled={!olValues[`candidateId${job.id}`]}>Nuevo</button>
              </td>
              <td className="td">
                <button  className="follow-button" onClick={() => handleSave(job.id)}>Guardar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Seleccionar Candidato"
        className="candidate-modal"
      >
          <div className="modal-header">
            <h2>Seleccionar Candidato</h2>
            <button onClick={() => setIsModalOpen(false)}>Cerrar</button>
         </div>
         <input 
            type="text" 
            placeholder="Buscar por CI o Nombre/Apellido" 
            value={searchCandidate} 
            onChange={(e) => setSearchCandidate(e.target.value)} 
            className="search-input"
          />
        <ul className="Follow-ul">
          {filteredCandidates.map(candidate => (
            <li key={candidate.id} onClick={() => handleCandidateSelect(candidate)}>
              {candidate.nombre +" "+ candidate.apellido} | {candidate.documento}
            </li>
          ))}
        </ul>
      </Modal>

      <Modal
        isOpen={isFollowModalOpen}
        onRequestClose={() => setIsFollowModalOpen(false)}
        contentLabel="Nuevo Seguimiento"
        className="follow-modal"
      >
        <h2>Nuevo Seguimiento</h2>
        <textarea
          value={followText}
          onChange={(e) => setFollowText(e.target.value)}
          rows="4"
          cols="50"
        />
        <div className="follow-modal-buttons">
          <button className="follow-button-save" onClick={() => setIsFollowModalOpen(false)}>Cerrar</button>
          <button className="follow-button-save" onClick={handleFollowSave}>Guardar Seguimiento</button>
        </div>
      </Modal>

      <Modal
        isOpen={isViewModalOpen}
        onRequestClose={() => setIsViewModalOpen(false)}
        contentLabel="Ver Seguimientos"
        className="view-modal"
      >
        <h2>Seguimientos</h2>
        <button className="follow-button" onClick={() => setIsViewModalOpen(false)}>Cerrar</button>
        <ul className="Follow-ul">
          {Array.isArray(followData[currentFollowCandidateId]) ? followData[currentFollowCandidateId].map((follow, index) => (
            <li key={index}>{follow}</li>
          )) : <li>No hay seguimientos</li>}
        </ul>
      </Modal>
     </>
   );
 }
    


export default Follow;
