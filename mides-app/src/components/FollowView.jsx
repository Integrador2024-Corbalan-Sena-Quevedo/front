import React, { useState, useEffect } from "react";
import Modal from 'react-modal';

const FollowView = () => {
    const [follows, setFollows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isFollowModalOpen, setIsFollowModalOpen] = useState(false);
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
                console.log(data);
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
        console.log(follow)
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
            
            console.log(newDetalle)
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

    return (
        <>
            <h2>Lista de Seguimientos</h2>
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
                        {follows.map(follow => (
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
                                <td className="td"><strong>{follow.fechaIngresoEmpleado}</strong></td>
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
                <div className="modal-content">
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
                    <button className="follow-button" onClick={() => setIsFollowModalOpen(false)}>Cerrar</button>
                    <button className="follow-button-save" onClick={handleFollowSave}>Guardar Seguimiento</button>
                </div>
            </Modal>
        </>
    );
};

export default FollowView;