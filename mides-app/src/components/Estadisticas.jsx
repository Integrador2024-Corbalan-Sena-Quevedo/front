import React, { useEffect, useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Estadisticas = () => {
  const [dataOperadoresPorRol, setOperadoresPorRol] = useState([]);
  const [dataEmpleosEnMontevideo, setEmpleosEnMontevideo] = useState([]);
  const [dataEmpleosFormacion, setEmpleosFormacion] = useState([]);
  const [dataEmpleosCargaHoraria, setEmpleosCargaHoraria] = useState([]);
  const [selectedStat, setSelectedStat] = useState('operadoresPorRol'); // Estado para manejar la selección

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA336A', '#FF9999', '#FF6666', '#CCCC00', '#CC00CC', '#9900CC'];

  useEffect(() => {
    fetchCantidadOperadoresPorRol();
    fetchEmpleosEnMontevideo();
    fetchEmpleosFormacion();
    fetchEmpleosCargaHoraria();
  }, []);
  
  const fetchCantidadOperadoresPorRol = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('http://localhost:8080/estadisticas/operadoresPorRol', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const transformedData = Object.keys(data).map(key => ({
            rol: key,
            cantidad: data[key]
        }));
        setOperadoresPorRol(transformedData);
    } catch (error) {
        console.error('Error al obtener datos de operadores por rol:', error);
    }
};

const fetchEmpleosEnMontevideo= async () => {
  const token = localStorage.getItem('token');
  try {
      const response = await fetch('http://localhost:8080/estadisticas/empleosDepartamento', {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          }
      });

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const transformedData = Object.keys(data).map(key => ({
          departamento: key,
          cantidad: data[key]
      }));
      setEmpleosEnMontevideo(transformedData);
  } catch (error) {
      console.error('Error al obtener los empleos:', error);
  }
};


const fetchEmpleosFormacion = async () => {
  const token = localStorage.getItem('token');
  try {
      const response = await fetch('http://localhost:8080/estadisticas/empleosNivelFormacion', {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          }
      });

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const transformedData = Object.keys(data).map(key => ({
          formacion: key,
          cantidad: data[key]
      }));
      setEmpleosFormacion(transformedData);
  } catch (error) {
      console.error('Error al obtener los empleos:', error);
  }
};

const fetchEmpleosCargaHoraria = async () => {
  const token = localStorage.getItem('token');
  try {
      const response = await fetch('http://localhost:8080/estadisticas/empleosCargaHoraria', {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          }
      });

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const transformedData = Object.keys(data).map(key => ({
          formacion: key,
          cantidad: data[key]
      }));
      setEmpleosCargaHoraria(transformedData);
  } catch (error) {
      console.error('Error al obtener los empleos:', error);
  }
};

  return (
    <div>
      <h2>Estadísticas de Empleo</h2>

      <select onChange={(e) => setSelectedStat(e.target.value)}>
        <option value="operadoresPorRol">Distribución de Operadores por Rol</option>
        <option value="empleosDepartamento">Distribución de Empleos por Departamento</option>
        <option value="empleosFormacion">Distribución de Empleos por Formación Académica</option>
        <option value="empleosCargaHoraria">Distribución de Empleos por Carga Horaria</option>
      </select>

      <div style={{ width: '100%', height: 400 }}>
        {selectedStat === 'operadoresPorRol' && (
          <>
            <h3>Distribución de operadores por rol</h3>
            <ResponsiveContainer>
              <PieChart>
                <Pie dataKey="cantidad" data={dataOperadoresPorRol} nameKey="rol" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                  {
                    dataOperadoresPorRol.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))
                  }
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </>
        )}

        {selectedStat === 'empleosDepartamento' && (
          <>
            <h3>Distribución de empleos por departamento</h3>
            <ResponsiveContainer>
              <PieChart>
                <Pie dataKey="cantidad" data={dataEmpleosEnMontevideo} nameKey="departamento" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                  {
                    dataEmpleosEnMontevideo.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))
                  }
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </>
        )}

        {selectedStat === 'empleosFormacion' && (
          <>
            <h3>Distribución de empleos por formación académica requerida</h3>
            <ResponsiveContainer>
              <PieChart>
                <Pie dataKey="cantidad" data={dataEmpleosFormacion} nameKey="formacion" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                  {
                    dataEmpleosFormacion.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))
                  }
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </>
        )}

{selectedStat === 'empleosCargaHoraria' && (
          <>
            <h3>Distribución de empleos por carga horaria</h3>
            <ResponsiveContainer>
              <PieChart>
                <Pie dataKey="cantidad" data={dataEmpleosCargaHoraria} nameKey="formacion" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                  {
                    dataEmpleosCargaHoraria.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))
                  }
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </>
        )}
      </div>
    </div>
  );
};

export default Estadisticas;