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
        setIsViewModalOpen(true);
    };
 

    const handleFollowSave = async() => {
        if (selectedFollow) {
            const updatedFollow = {...selectedFollow, detalles: [...selectedFollow.detalles, followText]};
            
            console.log(updatedFollow)
            try {
                const response = await fetch(`http://localhost:8080/updateSeguimiento`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(updatedFollow)
                });

                if (!response.ok) {
                    throw new Error('Error al actualizar el seguimiento');
                }

                setFollows(prevFollows => prevFollows.map(follow => 
                    follow.seguimientoId === selectedFollow.seguimientoId ? updatedFollow : follow
                ));
                setSelectedFollow(updatedFollow);
            } catch (error) {
                console.error('Error:', error);
            }
        }
        setIsFollowModalOpen(false);
        setFollowText("");
    };

    const handleNew = (follow) => {
        setSelectedFollow(follow);
        setIsFollowModalOpen(true);
    };


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
                >
                    <h2>Seguimientos</h2>
                    <button className="follow-button" onClick={() => setIsViewModalOpen(false)}>Cerrar</button>
                    <ul>
                        {Array.isArray(selectedFollow.detalles) ? selectedFollow.detalles.map((detalle, index) => (
                            <li key={index}>{detalle}</li>
                        )) : <li>No hay seguimientos</li>}
                    </ul>
                </Modal>
            )}
            <Modal
                isOpen={isFollowModalOpen}
                onRequestClose={() => setIsFollowModalOpen(false)}
                contentLabel="Nuevo Seguimiento"
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