import React, { useEffect, useState } from 'react';
import {  useNavigate } from "react-router-dom";
import '../styles/ListaOperadores.css';

const ListaOperadores = () => {
  const [operadores, setOperadores] = useState([]);
  const [error, setError] = useState('');
  let navigate = useNavigate();

  const fetchOperadores = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:8080/operadores', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOperadores(data);
      } else {
        console.error('Error al obtener la lista de operadores:', response.status);
        setError('No se pudo obtener la lista de operadores');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Ocurrió un error al obtener la lista de operadores');
    }
  };

  useEffect(() => {
    fetchOperadores();
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:8080/operadores/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setOperadores(operadores.filter(operator => operator.id !== id));
      } else {
        console.error('Error al eliminar el operador:', response.status);
        setError('No se pudo eliminar el operador');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Ocurrió un error al eliminar el operador');
    }
  };

  const handleChangeRole = async (id, newRole) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:8080/operadores/${id}/rol`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newRole)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setOperadores(operadores.map(operator => operator.id === id ? updatedUser : operator));
      } else {
        console.error('Error al cambiar el rol del operador:', response.status);
        setError('No se pudo cambiar el rol del operador');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Ocurrió un error al cambiar el rol del operador');
    }
  };

  

  return (
<div className="operator-list-container">
    <h2>Lista de Operadores</h2>
    {error && <p className="error">{error}</p>}
    <table className="operator-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Usuario</th>
          <th>Rol</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {operadores.map((operator, index) => (
          <tr key={index}>
            <td>{operator.name}</td>
            <td>{operator.username}</td>
            <td>
              <select 
                onChange={(e) => handleChangeRole(operator.id, e.target.value)} 
                value={operator.rol}
              >
                <option value="OPERADOR_LABORAL_NOVATO">Operador Laboral Novato</option>
                <option value="OPERADOR_LABORAL_SUPERIOR">Operador Laboral Superior</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </td>
            <td>
              <button onClick={() => handleDelete(operator.id)}>Eliminar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
      
    </div>
  );
};

export default ListaOperadores;