import React from 'react';
import '../styles/Candidate.css';

const Candidate = ({ candidato, onRemove  }) => {
    return (
        <div className="candidato">
            <strong>{candidato.nombre} {candidato.apellido}</strong>
            <p><span className="campo">Documento:</span> {candidato.documento}</p>
            <p><span className="campo">Fecha de Nacimiento:</span> {candidato.fechaDeNacimiento}</p>
            <p><span className="campo">Sexo:</span> {candidato.sexo}</p>
            <p><span className="campo">Dirección:</span> {candidato.dirreccion.calle}, {candidato.dirreccion.localidad}</p>
            <p><span className="campo">Educación:</span> {candidato.educacion.nivelEducativo}</p>
            <p><span className="campo">Situación Laboral:</span> {candidato.experienciaLaboral.descripcionSituacionLaboral}</p>
            {/* Agrega más campos según necesites */}
            <button onClick={() => onRemove(candidato.id)}>X</button>
        </div>
    );
};

export default Candidate;