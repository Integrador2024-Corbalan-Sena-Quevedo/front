import React, { useState, useEffect } from 'react';

const AuditoriasEmpresa = () => {
  const token = localStorage.getItem('token');
  const [audits, setAudits] = useState([]);
  const [empleos, setEmpleos]= useState([]);

  useEffect(() =>{

    const fetchJobs = async () => {
        try{
            const response = await fetch('http://mides-web.s3-website-us-east-1.amazonaws.com/empleos',{
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            if(response.status === 200){
                const data = await response.json()
                setEmpleos(data)
            }
            else{
                const data = await response.text()
            }
        
        } catch (error) {
            
        }
    };
    
        fetchJobs();

  }, []);

  

  useEffect(() => {
    const traerAuditoriasEmpresas = async () => {
        try {
          const response = await fetch(`http://mides-web.s3-website-us-east-1.amazonaws.com/auditoriasEmpresas/obtener`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
          });
          if (!response.ok) {
            throw new Error('Error al auditorias de Empresas');
          }
          
          const audiResp = await response.json();
          const audi = Object.values(audiResp);
          setAudits(audi);
        } catch (error) {
          console.error('Error al auditorias de Empresas', error);
        }
      }

      traerAuditoriasEmpresas();
  }, []);

  


  const obtenerEmpresa = (id, dato) => {
    debugger
    const empleo = empleos.find(objeto => objeto.empresaId === id);
    debugger
    switch (dato) {
        case "nombre":
            return empleo.empresaNombre;
            break;
        case "puesto":
            return empleo.nombrePuesto;
            break;

        default: 
            return null
            break;
    }

    
  }

 

  return (
    <div>
      <h2>Auditorías de Empresas</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Campo</th>
            <th>Dato Actual</th>
            <th>Dato Anterior</th>
            <th>Fecha de Cambio</th>
            <th>Tipo</th>
            <th>Empresa</th>
            <th>Nombre puesto</th>
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
              
              <td>{typeof audit.empresa === 'object' ? audit.empresa.nombre : obtenerEmpresa(audit.empresa, "nombre")}</td>
              <td>{typeof audit.empresa === 'object' ? audit.empresa.empleo.nombrePuesto : obtenerEmpresa(audit.empresa, "puesto")}</td>
              <td>{audit.usuario.name}</td>

              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditoriasEmpresa;