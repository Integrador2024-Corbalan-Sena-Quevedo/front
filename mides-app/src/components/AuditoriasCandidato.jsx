import React, { useState, useEffect } from 'react';

const AuditoriasCandidato = () => {
  const token = localStorage.getItem('token');
  const [audits, setAudits] = useState([])

  

  useEffect(() => {
    const traerAuditoriasCandidato = async () => {
        try {
          const response = await fetch(`http://mides-web.s3-website-us-east-1.amazonaws.com/auditoriasCandidatos/obtener`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
          });
          if (!response.ok) {
            throw new Error('Error al auditorias de candidatos');
          }
          
          const audiResp = await response.json();
          const audi = Object.values(audiResp);
          setAudits(audi);
    
        } catch (error) {
          console.error('Error al auditorias de candidatos', error);
        }
      }

    traerAuditoriasCandidato();
  }, []);

  return (
    <div>
      <h2>Auditorías de Candidato</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Campo</th>
            <th>Dato Actual</th>
            <th>Dato Anterior</th>
            <th>Fecha de Cambio</th>
            <th>Tipo</th>
            <th>Candidato</th>
            <th>Usuario que Editó</th>
          </tr>
        </thead>
        <tbody>
          {audits.map((audit) => (
            <tr key={audit.id}>
              <td>{audit.campo}</td>
              <td>{audit.datoAct}</td>
              <td>{audit.datoAnt}</td>
              <td>{audit.fechaCambio}</td>
              <td>{audit.tipo}</td>
              <td>{audit.candidato.documento}</td>
              <td>{audit.usuario.name}</td>
              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditoriasCandidato;
