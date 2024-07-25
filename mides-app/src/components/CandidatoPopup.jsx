import React from 'react';

const CandidatoPopup = ({ candidato }) => {
  return (
    <div className="popup">
      <h2>{candidato.nombre} {candidato.apellido}</h2>
      <ul>
        <li>Área: {candidato.area}</li>
        <li>Apoyo: {candidato.apoyo}</li>
        <li>Habilidad: {candidato.habilidad}</li>
        <li>Turno: {candidato.turno}</li>
        <li>Tipo de discapacidad: {candidato.tipoDiscapacidad}</li>
        <li>Motivo de desempleo: {candidato.motivoDesempleo}</li>
        <li>Ayuda técnica: {candidato.ayudaTecnica}</li>
        {/* Agrega más campos según sea necesario */}
      </ul>
    </div>
  );
};

export default CandidatoPopup;