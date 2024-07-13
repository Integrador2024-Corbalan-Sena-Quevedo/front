import React, { useState } from 'react';
import '../styles/BusquedaConFiltros.css';


const Filtro = ({ filtro, onRemoveFiltro, onRemoveSubFiltro }) => {
  return (
    <div className="filtro">
      <label>
        {filtro.name}
      </label>
      <button onClick={() => onRemoveFiltro(filtro.name)}>X</button>
      <ul>
        {filtro.subFiltros.map((subFiltro, index) => (
          <li key={index}>
            {subFiltro}
            <button onClick={() => onRemoveSubFiltro(filtro.name, subFiltro)}>X</button>
          </li>
        ))}
      </ul>
    </div>
  );
};


const BusquedaConFiltros = () => {
  const [filtros, setFiltros] = useState([]);
  const [nuevoFiltro, setNuevoFiltro] = useState('');
  const [subFiltro, setSubFiltro] = useState('');
  const [candidatos, setCandidatos] = useState([]);

  const manejarAgregarFiltro = () => {
    if (nuevoFiltro) {
      
      let filtroExistente = filtros.find(filtro => filtro.name === nuevoFiltro);

      if (filtroExistente) {
        
        if (subFiltro && !filtroExistente.subFiltros.includes(subFiltro)) {
          let nuevosFiltros = filtros.map(filtro => 
            filtro.name === nuevoFiltro 
              ? { ...filtro, subFiltros: [...filtro.subFiltros, subFiltro] }
              : filtro
          );
          setFiltros(nuevosFiltros);
        }
      } else {
        
        const nuevoFiltroObjeto = subFiltro 
          ? { name: nuevoFiltro, selected: true, subFiltros: [subFiltro] }
          : { name: nuevoFiltro, selected: true, subFiltros: [] };
        
        setFiltros([...filtros, nuevoFiltroObjeto]);
      }

      
      setNuevoFiltro('');
      setSubFiltro('');
    }
  };

  const manejarEliminarFiltro = (nombreFiltro) => {
    setFiltros(filtros.filter(filtro => filtro.name !== nombreFiltro));
  };

  const manejarEliminarSubFiltro = (nombreFiltro, nombreSubFiltro) => {
    let nuevosFiltros = filtros.map(filtro => 
      filtro.name === nombreFiltro 
        ? { ...filtro, subFiltros: filtro.subFiltros.filter(subFiltro => subFiltro !== nombreSubFiltro) }
        : filtro
    );
    setFiltros(nuevosFiltros);
  };

  const manejarCambioNuevoFiltro = (e) => {
    setNuevoFiltro(e.target.value);
  };

  const manejarCambioSubFiltro = (e) => {
    setSubFiltro(e.target.value);
  };

  const enviarFiltros = async() => {
    const filtrosSeleccionados = filtros.map(filtro => ({
      name: filtro.name,
      subFiltros: filtro.subFiltros,
      
      }))
    
    const datos = {
      filtros: filtrosSeleccionados
    };
    console.log(JSON.stringify(datos));

    
    const response = await fetch('http://localhost:8080/filtro/candidatos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datos)
    })
    //console.log(response);

    const algo = await response.json();
    console.log(algo);

  //   .then(response => response.json())
  //   .then(candidatos=> {
  //     const resultados = Object.values(candidatos);
  //        resultados.forEach(key => {
           
  //          console.log("Nombre: "+ key.nombre);
  //          console.log("Apellido: "+ key.apellido);
           
  //         });
        
  //       console.log("Cantidad: "+ resultados.length);
  //       debugger
  //        setCandidatos(resultados);
  //  })
  //   .catch(error => {
  //     console.error('Error:', error);
  //   });
  };

  return (
    <div className="contenedor">
      <div>
        <h3>Filtros</h3>
        {filtros.map(filtro => (
          <Filtro
            key={filtro.name}
            filtro={filtro}
            onRemoveFiltro={manejarEliminarFiltro}
            onRemoveSubFiltro={manejarEliminarSubFiltro}
          />
        ))}
      </div>

      <div className="agregar-filtro">
        <select value={nuevoFiltro} onChange={manejarCambioNuevoFiltro}>
          <option value="">Seleccionar filtro...</option>
          <option value="documento">Documento</option>
          <option value="Area">Área</option>
          <option value="Apoyo">Apoyo</option>
          <option value="Habilidad">Habilidad</option>
          <option value="Turno">Turno</option>
          <option value="tipo_discapicidad">Tipo de discapacidad</option>
          <option value="motivo_desempleo">Motivo de desempleo</option>
          <option value="ayuda_tecnica">Ayuda Técnica</option>
        </select>
        {nuevoFiltro === 'documento' && (
          <input type='text' value={subFiltro} onChange={manejarCambioSubFiltro}/>
        )}
        {nuevoFiltro === 'Area' && (
          <select value={subFiltro} onChange={manejarCambioSubFiltro}>
            <option value="">Seleccionar Área...</option>
            <option value="Diseño Gráfico">Diseño Gráfico</option>
            <option value="Ventas">Ventas</option>
            <option value="Servicio doméstico">Servicio doméstico</option>
            <option value="Electrotecnia y electrónica">Electrotecnia y electrónica</option>
            <option value="Salud y cuidado a personas">Salud y cuidado a personas</option>
            <option value="Telefonista">Telefonista</option>
            <option value="Limpieza">Limpieza</option>
            <option value="Reponedor">Reponedor</option>
            <option value="Sanitaria">Sanitaria</option>
            <option value="Seguridad">Seguridad</option>
            <option value="Cadetería">Cadetería</option>
            <option value="Recepcionista">Recepcionista</option>
            <option value="Comunicaciones">Comunicaciones</option>
            <option value="Marítima y pesca">Marítima y pesca</option>
            <option value="Metal - mecánica">Metal - mecánica</option>
            <option value="Atención al público">Atención al público</option>
            <option value="Tapizado">Tapizado</option>
            <option value="Hotelería y turismo">Hotelería y turismo</option>
            <option value="Construcción">Construcción</option>
            <option value="Artes y artesanía">Artes y artesanía</option>
            <option value="Informática">Informática</option>
            <option value="Administración">Administración</option>
            <option value="Gastronomía">Gastronomía</option>
            <option value="Madera y muebles">Madera y muebles</option>
            <option value="Agraria (Jardinería">Agraria (Jardinería)</option>
            <option value="Auxiliar docente">Auxiliar docente</option>
          </select>
        )}
        {nuevoFiltro === 'Apoyo' && (
          <select value={subFiltro} onChange={manejarCambioSubFiltro}>
            <option value="">Seleccionar Apoyo...</option>
            <option value="" disabled>Cognitivos</option>
            <option value="Leer">Leer</option>
            <option value="Escribir">Escribir</option>
            <option value="Conocimiento numérico">Conocimiento numérico</option>
            <option value="Comprensión verbal">Comprensión verbal</option>
            <option value="Aprendizaje / razonamiento">Aprendizaje / razonamiento</option>
            <option value="" disabled>Físicos</option>
            <option value="Postura sentado">Postura sentado</option>
            <option value="Movilidad y destreza de miembros superiores">Movilidad y destreza de miembros superiores</option>
            <option value="Movilidad en el cuello y tronco">Movilidad en el cuello y tronco</option>
            <option value="Otras posturas">Otras posturas</option>
            <option value="Otros">Otros</option>
            <option value="Postura de pie">Postura de pie</option>
            <option value="Desplazamientos">Desplazamientos</option>
            <option value="Fuerza y esfuerzo físico">Fuerza y esfuerzo físico</option>
            <option value="Movilidad de los miembros inferiores">Movilidad de los miembros inferiores</option>
            <option value="" disabled>Sensoriales</option>
            <option value="Visión">Visión</option>
            <option value="Audición">Audición</option>
            <option value="Hablar / Expresión">Hablar / Expresión</option>
          </select>
        )}
        {nuevoFiltro === 'Habilidad' && (
          <select value={subFiltro} onChange={manejarCambioSubFiltro}>
            <option value="">Seleccionar Habilidad...</option>
            <option value="excel">Excel</option>
            <option value="imagen_personal">Imagen Personal</option>
            <option value="internet">Internet</option>
            <option value="manejo_de_dinero">Manejo de dinero</option>
            <option value="power_point">PowerPoint</option>
            <option value="word">Word</option>
            <option value="autonomia_en_transporte_publico">Autonomia en el transporte publico</option>
          </select>
        )}
        {nuevoFiltro === 'Turno' && (
          <select value={subFiltro} onChange={manejarCambioSubFiltro}>
            <option value="">Seleccionar Turno...</option>
            <option value="TARDE">TARDE</option>
            <option value="MANIANA">MAÑANA</option>
            <option value="NOCHE">NOCHE</option>
            <option value="INDIFERENTE">INDIFERENTE</option>
            <option value="ROTATIVO">ROTATIVO</option>
          </select>
        )}
        {nuevoFiltro === 'tipo_discapicidad' && (
          <select value={subFiltro} onChange={manejarCambioSubFiltro}>
            <option value="">Seleccionar tipo de discapacidad...</option>
            <option value="PSIQUICA">PSIQUICA</option>
            <option value="VER">VER</option>
            <option value="VISCERAL">VISCERAL</option>
            <option value="OIR">OIR</option>
            <option value="FISICO-MOTORAS">FISICO-MOTORAS</option>
            <option value="INTELECTUAL">INTELECTUAL</option>
          </select>
        )}
        {nuevoFiltro === 'motivo_desempleo' && (
          <select value={subFiltro} onChange={manejarCambioSubFiltro}>
            <option value="">Seleccionar motivo de desempleo...</option>
            <option value="LLEGABA_TARDE">LLEGABA_TARDE</option>
            <option value="PROBLEMAS_CON_COMPANIERO">PROBLEMAS_CON_COMPANIERO</option>
            <option value="HACERES_HOGAR_CUIDADOS_PERSONAS">HACERES_HOGAR_CUIDADOS_PERSONAS</option>
            <option value="REMUNERACION_BAJA">REMUNERACION_BAJA</option>
            <option value="SALUD">SALUD</option>
            <option value="ACCESIBILIDAD">ACCESIBILIDAD</option>
            <option value="DISCRIMINACION">DISCRIMINACION</option>
            <option value="FALTA_INTERES">FALTA_INTERES</option>
            <option value="DESPIDO_NO_RENOVACION">DESPIDO_NO_RENOVACION</option>
          </select>
        )}
        {nuevoFiltro === 'ayuda_tecnica' && (
          <select value={subFiltro} onChange={manejarCambioSubFiltro}>
            <option value="">Seleccionar ayuda técnica...</option>
            <option value="Bastón Blanco">Bastón Blanco</option>
            <option value="Bastón Verde">Bastón Verde</option>
            <option value="Bastones canadienses">Bastones canadienses</option>
            <option value="Almohadón antiéscaras">Almohadón antiéscaras</option>
            <option value="Calzado ortopédico">Calzado ortopédico</option>
            <option value="Lupa">Lupa</option>
            <option value="Coche postural infantil">Coche postural infantil</option>
            <option value="Violín">Violín</option>
            <option value="Audífonos">Audífonos</option>
            <option value="Colchón anti escaras">Colchón anti escaras</option>
            <option value="Bastón de 3 ó 4 puntos">Bastón de 3 ó 4 puntos</option>
            <option value="Bulto pañal infantil grande">Bulto pañal infantil grande</option>
            <option value="Bulto pañal infantil chico">Bulto pañal infantil chico</option>
            <option value="Silla de ruedas">Silla de ruedas</option>
            <option value="Andador infantil con ruedas">Andador infantil con ruedas</option>
            <option value="Filtros Solares">Filtros Solares</option>
            <option value="Bulto pañal adulto chico">Bulto pañal adulto chico</option>
            <option value="Andador adulto sin ruedas">Andador adulto sin ruedas</option>
            <option value="Coche postural adulto">Coche postural adulto</option>
            <option value="Guinche">Guinche</option>
            <option value="Bastón de 1 punto">Bastón de 1 punto</option>
            <option value="Bulto pañal adulto mediano">Bulto pañal adulto mediano</option>
            <option value="Otros">Otros</option>
            <option value="Prótesis">Prótesis</option>
            <option value="Bulto pañal infantil mediano">Bulto pañal infantil mediano</option>
            <option value="Bulto pañal adulto grande">Bulto pañal adulto grande</option>
            <option value="Andador infantil sin ruedas">Andador infantil sin ruedas</option>
            <option value="Andador adulto con ruedas">Andador adulto con ruedas</option>
            <option value="Bastón de rastreo">Bastón de rastreo</option>
            <option value="Silla para bañarse y evacuar">Silla para bañarse y evacuar</option>
          </select>
        )}
        <button onClick={manejarAgregarFiltro}>Agregar Filtro</button>
      </div>
      <button onClick={enviarFiltros}>Enviar Filtros</button>
      <div>
        <h3>Resultados</h3>
        <ul>
          {candidatos.map(candidato => (
            <li key={candidato.id}>
              {candidato.nombre} ({candidato.apellido})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BusquedaConFiltros;
