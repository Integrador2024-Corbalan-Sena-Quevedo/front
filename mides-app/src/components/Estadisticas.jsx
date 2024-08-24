import React, { useEffect, useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Estadisticas = () => {
  const [dataOperadoresPorRol, setOperadoresPorRol] = useState([]);
  const [dataEmpleosEnMontevideo, setEmpleosEnMontevideo] = useState([]);
  const [dataEmpleosFormacion, setEmpleosFormacion] = useState([]);
  const [dataEmpleosCargaHoraria, setEmpleosCargaHoraria] = useState([]);
  const [dataEntrevistas, setEntrevistas] = useState([]);
  const [dataEntrevistasGenero, setEntrevistasGenero] = useState([]);
  const [dataCandidatosEdad, setCandidatosEdad] = useState([]);
  const [dataCandidatosDiscapacidad, setCandidatosDiscapacidad] = useState([]);
  const [dataCandidatosEducacion, setCandidatosEducacion] = useState([]);
  const [dataCandidatosCargaHoraria, setCandidatosCargaHoraria] = useState([]);
  const [dataCandidatosTrabajando, setCandidatosTrabajando] = useState([]);
  const [selectedStatCandidato, setSelectedStatCandidato] = useState('candidatoGenero'); 
  const [selectedStatEmpleo, setSelectedStatEmpleo] = useState('empleosDepartamento'); 

  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA336A', '#FF9999', '#FF6666', '#CCCC00', '#CC00CC', '#9900CC',
    '#FF5733', '#C70039', '#900C3F', '#581845', '#2ECC71', '#AF7AC5', '#5499C7', '#F4D03F', '#E74C3C', '#45B39D'
  ];

  const CustomLegend = ({ data, colors, title }) => (
    <div style={{ marginTop: '20px' }}>
      <h4>{title}</h4>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {data.map((entry, index) => (
          <li key={`item-${index}`} style={{ marginBottom: '5px', display: 'flex', alignItems: 'center' }}>
            <div style={{ backgroundColor: colors[index % colors.length], width: '20px', height: '20px', marginRight: '10px' }}></div>
            <span>{entry.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  useEffect(() => {
    fetchCantidadOperadoresPorRol();
    fetchEmpleosEnMontevideo();
    fetchEmpleosFormacion();
    fetchEmpleosCargaHoraria();
    fetchEntrevistas();
    fetchEntrevistasPorGenero();
    fetchCandidatosEdad();
    fetchCandidatosDiscapacidad();
    fetchCandidatosEducacion();
    fetchCandidatosHoras();
    fetchCandidatosTrabajando();
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
          carga: key,
          cantidad: data[key]
      }));
      setEmpleosCargaHoraria(transformedData);
  } catch (error) {
      console.error('Error al obtener los empleos:', error);
  }
};

const fetchEntrevistas = async () => {
  const token = localStorage.getItem('token');
  try {
      const response = await fetch('http://localhost:8080/estadisticas/entrevistasPorAnio', {
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
      console.log(data);
      const transformedData = Object.keys(data).map(key => ({
          anio: key,
          cantidad: data[key]
      }));
      setEntrevistas(transformedData);
  } catch (error) {
      console.error('Error al obtener las entrevistas:', error);
  }
};


const fetchEntrevistasPorGenero = async () => {
  const token = localStorage.getItem('token');
  try {
      const response = await fetch('http://localhost:8080/estadisticas/entrevistasPorGenero', {
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
      console.log(data);
      const transformedData = Object.keys(data).map(key => ({
          genero: key,
          cantidad: data[key]
      }));
      setEntrevistasGenero(transformedData);
  } catch (error) {
      console.error('Error al obtener las entrevistas:', error);
  }
};

const fetchCandidatosEdad = async () => {
  const token = localStorage.getItem('token');
  try {
      const response = await fetch('http://localhost:8080/estadisticas/candidatosPorEdad', {
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
      console.log(data);
      const transformedData = Object.keys(data).map(key => ({
          edad: key,
          cantidad: data[key]
      }));
      setCandidatosEdad(transformedData);
  } catch (error) {
      console.error('Error al obtener los candidatos:', error);
  }
};

const fetchCandidatosDiscapacidad = async () => {
  const token = localStorage.getItem('token');
  try {
      const response = await fetch('http://localhost:8080/estadisticas/candidatosPorDiscapacidad', {
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
      console.log(data);
      const transformedData = Object.keys(data).map(key => ({
          discapacidad: key,
          cantidad: data[key]
      }));
      setCandidatosDiscapacidad(transformedData);
  } catch (error) {
      console.error('Error al obtener los candidatos:', error);
  }
};

const fetchCandidatosEducacion = async () => {
  const token = localStorage.getItem('token');
  try {
      const response = await fetch('http://localhost:8080/estadisticas/candidatosNivelFormacion', {
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
      console.log(data);
      const transformedData = Object.keys(data).map(key => ({
          nivelEducativo: key,
          cantidad: data[key]
      }));
      setCandidatosEducacion(transformedData);
  } catch (error) {
      console.error('Error al obtener los candidatos:', error);
  }
};

const fetchCandidatosHoras = async () => {
  const token = localStorage.getItem('token');
  try {
      const response = await fetch('http://localhost:8080/estadisticas/candidatosCargaHoraria', {
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
      console.log(data);
      const transformedData = Object.keys(data).map(key => ({
          horas: key,
          cantidad: data[key]
      }));
      setCandidatosCargaHoraria(transformedData);
  } catch (error) {
      console.error('Error al obtener los candidatos:', error);
  }
};


const fetchCandidatosTrabajando = async () => {
  const token = localStorage.getItem('token');
  try {
      const response = await fetch('http://localhost:8080/estadisticas/candidatosTrabajando', {
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
      console.log(data);
      const transformedData = Object.keys(data).map(key => ({
          empleados: key,
          cantidad: data[key]
      }));
      setCandidatosTrabajando(transformedData);
  } catch (error) {
      console.error('Error al obtener los candidatos:', error);
  }
};



  return (
    <div>
      <h2>Estadísticas de Empleo</h2>

      
      
      <div>
  <h3>Entrevistas por año</h3>
  <ResponsiveContainer width="100%" height={400}>
    <BarChart data={dataEntrevistas}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="anio" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="cantidad" fill="#8884d8">
        {dataEntrevistas.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
</div>


<select onChange={(e) => setSelectedStatCandidato(e.target.value)}>
        
        <option value="candidatoGenero">Distribución de candidatos por género</option>
        <option value="candidatoEdad">Distribución de candidatos por edad</option>
        <option value="candidatoDiscapacidad">Distribución de candidatos por discapacidad</option>
        <option value="candidatoEducacion">Distribución de candidatos por nivel educativo</option>
        <option value="candidatoHoras">Distribución de candidatos por disposición de carga horaria</option>
        <option value="candidatoTrabajando">Distribución de candidatos empleados</option>
  
      </select>

      <div style={{ width: '100%', height: 400 }}>
       

        {selectedStatCandidato === 'candidatoGenero' && (
          <>
            <h3>Distribución de candidatos por género</h3>
            <ResponsiveContainer>
              <PieChart>
                <Pie dataKey="cantidad" data={dataEntrevistasGenero} nameKey="genero" cx="50%" cy="50%" outerRadius={100} fill="#8884d8"   label={(entry) => `${entry.name}: ${entry.value}`}>
                  {
                    dataEntrevistasGenero.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))
                  }
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            
          </>
        )}

{selectedStatCandidato === 'candidatoEdad' && (
          <>
            <h3>Distribución de candidatos por edad</h3>
            <ResponsiveContainer>
              <PieChart>
                <Pie dataKey="cantidad" data={dataCandidatosEdad} nameKey="edad" cx="50%" cy="50%" outerRadius={100} fill="#8884d8"   label={(entry) => `${entry.name}: ${entry.value}`}>
                  {
                    dataCandidatosEdad.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))
                  }
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          
          </>
        )}

{selectedStatCandidato === 'candidatoDiscapacidad' && (
          <>
            <h3>Distribución de candidatos por discapacidad</h3>
            <ResponsiveContainer>
              <PieChart>
                <Pie dataKey="cantidad" data={dataCandidatosDiscapacidad} nameKey="discapacidad" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label={(entry) => `${entry.name}: ${entry.value}`}>
                  {
                    dataCandidatosDiscapacidad.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))
                  }
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
           
          </>
        )}

{selectedStatCandidato === 'candidatoEducacion' && (
          <>
            <h3>Distribución de candidatos por nivel educativo</h3>
            <ResponsiveContainer>
              <PieChart>
                <Pie dataKey="cantidad" data={dataCandidatosEducacion} nameKey="nivelEducativo" cx="50%" cy="50%" outerRadius={100} fill="#8884d8"  label={(entry) => `${entry.name}: ${entry.value}`}>
                  {
                    dataCandidatosEducacion.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))
                  }
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
           
          </>
        )}

{selectedStatCandidato === 'candidatoHoras' && (
          <>
            <h3>Distribución de candidatos por disposición de carga horaria</h3>
            <ResponsiveContainer>
              <PieChart>
                <Pie dataKey="cantidad" data={dataCandidatosCargaHoraria} nameKey="horas" cx="50%" cy="50%" outerRadius={100} fill="#8884d8"   label={(entry) => `${entry.name}: ${entry.value}`}>
                  {
                    dataCandidatosCargaHoraria.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))
                  }
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          
          </>
        )}

        
{selectedStatCandidato === 'candidatoTrabajando' && (
          <>
            <h3>Distribución de candidatos empleados</h3>
            <ResponsiveContainer>
              <PieChart>
                <Pie dataKey="cantidad" data={dataCandidatosTrabajando} nameKey="empleados" cx="50%" cy="50%" outerRadius={100} fill="#8884d8"   label={(entry) => `${entry.name}: ${entry.value}`}>
                  {
                    dataCandidatosTrabajando.map((entry, index) => (
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


      <select onChange={(e) => setSelectedStatEmpleo(e.target.value)}>
        
        <option value="empleosDepartamento">Distribución de empleos por departamento</option>
        <option value="empleosFormacion">Distribución de empleos por formación académica</option>
        <option value="empleosCargaHoraria">Distribución de empleos por carga horaria</option>
      </select>

      <div style={{ width: '100%', height: 400 }}>
       

        {selectedStatEmpleo === 'empleosDepartamento' && (
          <>
            <h3>Distribución de empleos por departamento</h3>
            <ResponsiveContainer>
              <PieChart>
                <Pie dataKey="cantidad" data={dataEmpleosEnMontevideo} nameKey="departamento" cx="50%" cy="50%" outerRadius={100} fill="#8884d8"   label={(entry) => `${entry.name}: ${entry.value}`}>
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

        {selectedStatEmpleo === 'empleosFormacion' && (
          <>
            <h3>Distribución de empleos por formación académica requerida</h3>
            <ResponsiveContainer>
              <PieChart>
                <Pie dataKey="cantidad" data={dataEmpleosFormacion} nameKey="formacion" cx="50%" cy="50%" outerRadius={100} fill="#8884d8"   label={(entry) => `${entry.name}: ${entry.value}`}>
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

{selectedStatEmpleo === 'empleosCargaHoraria' && (
          <>
            <h3>Distribución de empleos por carga horaria</h3>
            <ResponsiveContainer>
              <PieChart>
                <Pie dataKey="cantidad" data={dataEmpleosCargaHoraria} nameKey="carga" cx="50%" cy="50%" outerRadius={100} fill="#8884d8"   label={(entry) => `${entry.name}: ${entry.value}`}>
                  {
                    dataEmpleosCargaHoraria.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length] }  />
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