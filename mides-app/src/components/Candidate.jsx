import React from 'react';
import '../styles/Candidate.css';

const Candidate = ({ candidato, onRemove  }) => {
    const tieneSeguimiento = candidato.seguimientos && candidato.seguimientos.length > 0;

    return (
         <div className={`candidato ${tieneSeguimiento ? 'seguimiento' : ''}`}>
            <strong>{candidato.nombre} {candidato.apellido}</strong>
            <p><span className="campo">Documento:</span> {candidato.documento}</p>
            <p><span className="campo">Fecha de Nacimiento:</span> {candidato.fecha_de_nacimiento}</p>
            <p><span className="campo">Sexo:</span> {candidato.sexo}</p>
            <p><span className="campo">Dirección:</span> {candidato.direccion.calle}, {candidato.direccion.localidad}</p>
            <p><span className="campo">Educación:</span> {candidato.educacion.nivelEducativo}</p>
            <p><span className="campo">Situación Laboral:</span> {candidato.experienciaLaboral.descripcionSituacionLaboral}</p>
            <button onClick={() => onRemove(candidato.id)}>X</button>
        </div>
    );
};

export default Candidate;