import React, { useState, useEffect } from "react";
import Modal from 'react-modal';

const FollowView = () => {
    const [follows, setFollows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isFollowModalOpen, setIsFollowModalOpen] = useState(false);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [searchCandidate, setSearchCandidate] = useState("");
    const [filteredCandidates, setFilteredCandidates] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [selectedFollow, setSelectedFollow] = useState(null);
    const [followText, setFollowText] = useState("");
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('user')

    const fetchAllFollow = async () => {
        try {
            const response = await fetch('http://localhost:8080/allSeguimientos', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
            
                setFollows(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllFollow();
        
    }, []);

    const handleView = (follow) => {
        setSelectedFollow(follow);
       
        setIsViewModalOpen(true);
    };
 

    const handleFollowSave = async() => {
        if (selectedFollow) {
            const fechaDetalle = new Date().toISOString().split('T')[0];

            const newDetalle = {
                detalle: followText,
                operadorLaboral: username,
                fechaDetalle: fechaDetalle,
                seguimientoId: selectedFollow.seguimientoId
            };
            
         
            try {
                const response = await fetch(`http://localhost:8080/updateSeguimiento`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(newDetalle)
                });


                if (!response.ok) {
                    throw new Error('Error al actualizar el seguimiento');
                }
    
                // Actualizar el estado local sin reemplazar todos los detalles
                setFollows(prevFollows => prevFollows.map(follow =>
                    follow.seguimientoId === selectedFollow.seguimientoId
                        ? { ...follow, detalles: [...follow.detalles, newDetalle] }
                        : follow
                ));
                setSelectedFollow(prevFollow => ({
                    ...prevFollow,
                    detalles: [...prevFollow.detalles, newDetalle]
                }));
            } catch (error) {
                console.error('Error:', error);
            }
        }
        setIsFollowModalOpen(false);
        setFollowText("");
        fetchAllFollow()
    };

    const handleNew = (follow) => {
        setSelectedFollow(follow);
        setIsFollowModalOpen(true);
    };


    const FollowDetailCard = ({ detalle}) => (
        <div className="follow-detail-card">
            <p><strong>Detalle:</strong> {detalle.detalle || "N/A"}</p>
            <p><strong>Operador Laboral:</strong> {detalle.operadorLaboral || "N/A"}</p>
            <p><strong>Fecha:</strong> {detalle.fechaDetalle? new Date(detalle.fechaDetalle).toLocaleDateString() : "N/A"}</p>
        </div>
    );

    const handleSearchChange = (e) => {
        setSearchCandidate(e.target.value);
    };

    const handleCandidateSelect = (candidate) => {
        setSelectedFollow(candidate);
        setIsSearchModalOpen(false);
    };

    useEffect(() => {
        const filtered = follows.filter(follow =>
            follow.nombreEmpleado.toLowerCase().includes(searchCandidate.toLowerCase()) ||
            follow.documentoEmpleado.toLowerCase().includes(searchCandidate.toLowerCase())
        );
        setSearchResults(filtered);
    }, [searchCandidate, follows]);

    const handleShowAll = () => {
        setSelectedFollow(null);
    };

    const formatDate = (dateArray) => {
        if (Array.isArray(dateArray) && dateArray.length === 3) {
            const [year, month, day] = dateArray;
            const formattedMonth = month.toString().padStart(2, '0');
            const formattedDay = day.toString().padStart(2, '0');
            return `${year}-${formattedMonth}-${formattedDay}`;
        }
        return dateArray;
    };

    return (
        <>
            <h2>Lista de Seguimientos</h2>
            <button className="follow-button-save" onClick={() => setIsSearchModalOpen(true)} >Buscar Candidato</button>
            <button className="follow-button-save" onClick={handleShowAll}>Mostrar Todos</button>
            {isLoading ? (
                <p>Cargando...</p>
            ) : (
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
                            <th className="th">Seguimiento</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(selectedFollow ? [selectedFollow] : follows).map(follow => (
                            <tr key={follow.seguimientoId}>
                                <td className="td"><strong>{follow.nombreEmpresa}</strong></td>
                                <td className="td"><strong>{follow.nombreEmpleo}</strong></td>
                                <td className="td"><strong>{follow.operadorLaboral}</strong></td>
                                <td className="td"><strong>{follow.tramite}</strong></td>
                                <td className="td"><strong>{follow.documentoEmpleado}</strong></td>
                                <td className="td"><strong>{follow.nombreEmpleado}</strong></td>
                                <td className="td"><strong>{follow.discapacidades}</strong></td>
                                <td className="td"><strong>{follow.telefonoEmpleado}</strong></td>
                                <td className="td"><strong>{follow.nombreEncargado}</strong></td>
                                <td className="td"><strong>{follow.emailEncargado}</strong></td>
                                <td className="td"><strong>{follow.localidad}</strong></td>
                                <td className="td"><strong>{formatDate(follow.fechaIngresoEmpleado)}</strong></td>
                                <td className="td">
                                    <button className="follow-button" onClick={() => handleView(follow)}>Ver</button>
                                    <button className="follow-button" onClick={() => handleNew(follow)}>Nuevo</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {selectedFollow && (
                <Modal
                    isOpen={isViewModalOpen}
                    onRequestClose={() => setIsViewModalOpen(false)}
                    contentLabel="Ver Seguimientos"
                    className="view-modal"
                    ariaHideApp={false}
                >
                    <div className="modal-header">
                    <h2>Seguimientos</h2>
                    <button className="close-button" onClick={() => setIsViewModalOpen(false)}>✖</button>
                    </div>
                    <div className="modal-content-follow-view">
                    {Array.isArray(selectedFollow.detalles) && selectedFollow.detalles.length > 0 ? (
                        selectedFollow.detalles.map((detalle, index) => (
                        <FollowDetailCard
                            key={index}
                            detalle={detalle}
                        />
                        ))
                    ) : (
                        <p>No hay seguimientos</p>
                    )}
                    </div>
                </Modal>
             )}
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
                    isOpen={isSearchModalOpen}
                    onRequestClose={() => setIsSearchModalOpen(false)}
                    contentLabel="Buscar Candidato"
                    className="candidate-modal"
                >
                    <div className="modal-header">
                        <h2>Buscar Candidato</h2>
                        <button onClick={() => setIsSearchModalOpen(false)}>Cerrar</button>
                    </div>
                    <input 
                        type="text" 
                        placeholder="Buscar por CI o Nombre/Apellido" 
                        value={searchCandidate} 
                        onChange={handleSearchChange} 
                        className="search-input"
                    />
                    <ul className="Follow-ul">
                        {searchResults.map(candidate => (
                            <li key={candidate.seguimientoId} onClick={() => handleCandidateSelect(candidate)}>
                                {candidate.nombreEmpleado} | {candidate.documentoEmpleado}
                            </li>
                        ))}
                    </ul>
                </Modal>
        </>
    );
};

export default FollowView;