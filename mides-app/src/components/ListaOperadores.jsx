import React, { useEffect, useState } from 'react';
import {  useNavigate } from "react-router-dom";
import '../styles/ListaOperadores.css';

const ListaOperadores = () => {
  const [operadores, setOperadores] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const operadoresPorPagina = 7;
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
    
        const listaOrdenada = data.sort((a, b) => a.name.localeCompare(b.name));
        setOperadores(listaOrdenada);
        
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

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Obtener los operadores de la página actual
  const indexOfLastOperator = currentPage * operadoresPorPagina;
  const indexOfFirstOperator = indexOfLastOperator - operadoresPorPagina;
  const currentOperators = operadores.slice(indexOfFirstOperator, indexOfLastOperator);

  // Calcular el número total de páginas
  const totalPages = Math.ceil(operadores.length / operadoresPorPagina);

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
          {currentOperators.map((operator, index) => (
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
    <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => paginate(i + 1)}
            className={currentPage === i + 1 ? 'active' : ''}
          >
            {i + 1}
          </button>
        ))}
      </div>
      
    </div>
  );
};

export default ListaOperadores;