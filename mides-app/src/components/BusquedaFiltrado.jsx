import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css'
import '../styles/TableMatch.css'
import '../styles/BusquedaConFiltros.css';
import { Modal, Button } from 'react-bootstrap';
import editLogo from "../img/edit.png"
import PdfModal from './PdfModal';



const Filtro = ({ filtro, onRemoveFiltro, onRemoveSubFiltro }) => {
  return (
    <div className="filtro">
      <label>
        {filtro.name}
      </label>
      <button onClick={() => onRemoveFiltro(filtro.name)}>X</button>
      <ul>
        {filtro.subFiltros.map((subFiltro, index) => (
          <li key={index} className='subFiltro'>
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
  const [selectedNombreLista, setSelectedNombreLista] = useState('');
  const [SelectedCandidato, setSelectedCandidato] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showSelect, setShowSelect] = useState(false);
  const [selectedCandidadoCombo, setSelectedCandidadoCombo] = useState(-1);
  const [selectedRama, setSelectedRama] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfExist, setPdfExist] = useState(false);
  const token = localStorage.getItem('token');
  const [candidatoDTO, setCandidatoDTO] = useState(null);

  const handleSelectShow = (candidato) => {
    setShowSelect(true);
    setSelectedCandidadoCombo(candidato.id);


  };

  const handleShowPopup = (e, candidato) => {
      const [rama, nombre] = e.target.value.split('|');
      setShowPopup(true);
      setSelectedNombreLista(nombre);
      setSelectedCandidato(candidato);
      setSelectedRama(rama);

    };
  
      const handleClosePopup = () => {
      setShowPopup(false);
      setShowSelect(false);
     };

     const handleCandidato = (candidato) => {
      setSelectedCandidato(candidato);
    };

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
    const token = localStorage.getItem('token');
 
    
    const filtrosSeleccionados = filtros.map(filtro => ({
      name: filtro.name,
      subFiltros: filtro.subFiltros,
      
      }))
    
    const datos = {
      filtros: filtrosSeleccionados
    };
    console.log(JSON.stringify(datos));

    
    fetch('http://localhost:8080/filtro/candidatos', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      
      body: JSON.stringify(datos)
    })
    
    
     
    .then(response => response.json())
    .then(candidatos=> {
      
      const resultados = Object.values(candidatos);
         
        
        console.log("Cantidad: "+ resultados.length);
        
         setCandidatos(resultados);
   })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  const handleCIClick = async (candidatoId, nombre, apellido, documento) => {

    const candidatoDTO = {
      candidatoId: candidatoId,
      nombre: nombre,
      apellido: apellido,
      documento: documento
    }

    setCandidatoDTO(candidatoDTO);

    try {
        const response = await fetch('http://localhost:8080/getCv', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(candidatoDTO)
        });

        if (!response.ok) {
          if (response.status === 404) {
              setPdfExist(false);
              setPdfUrl(null);
          } else {
              throw new Error('Error fetching PDF');
          }
      } else {
          const binary = await response.blob();
          const url = URL.createObjectURL(binary);
          setPdfUrl(url);
          setPdfExist(true);
      }
      setIsModalOpen(true);
  } catch (error) {
      console.error('Error fetching PDF:', error);
      setPdfExist(false);
      setPdfUrl(null);
  }
};

  const mostrarEstructura = () => {


    if(SelectedCandidato){

      if (selectedRama == 'educacion') {
        return(
          <ListaPopup show={showPopup} onHide={handleClosePopup} nombreLista={'Educacion'} nombreCandidato={SelectedCandidato.nombre}>
            {
              <div>
                {
                  <ul>
                    <li>
                      <strong>Años de educacion: </strong>
                      <span>{SelectedCandidato[selectedRama].aniosEducacion}</span>
                    </li>
                    <li>
                      <strong>Desea participar en alguna institucion: </strong>
                      <span>{SelectedCandidato[selectedRama].deseaParticiparEnAlgunaInstitucion}</span>
                    </li>
                    <li>
                      <strong>Deseo de otras instituciones: </strong>
                      <span>{SelectedCandidato[selectedRama].deseoDeOtrasInstituciones}</span>
                    </li>
                    <li>
                      <strong>Educacion no formal: </strong>
                      <span>{SelectedCandidato[selectedRama].educacionNoFormal}</span>
                    </li>
                    <li>
                      <strong>Nivel educativo: </strong>
                      <span>{SelectedCandidato[selectedRama].nivelEducativo}</span>
                    </li>
                    <li>
                      <strong>Nombre institucion: </strong>
                      <span>{SelectedCandidato[selectedRama].nombreInstitucion}</span>
                    </li>
                    <li>
                      <strong>Participacion institucion: </strong>
                      <span>{SelectedCandidato[selectedRama].participacionInstitucion}</span>
                    </li>
                    <li>
                      <strong>Razon por la que deja estudios: </strong>
                      <span>{SelectedCandidato[selectedRama].razonDejaEstudios}</span>
                    </li>
                    <li>
                      <strong>Situacion actual: </strong>
                      <span>{SelectedCandidato[selectedRama].situacionActual}</span>
                    </li>
                    
                    <li>
                      <strong>Instituciones deseo: </strong>
                      <ul>
                        {
                          SelectedCandidato[selectedRama][selectedNombreLista] && Object.values(SelectedCandidato[selectedRama][selectedNombreLista]).map((item, index) => (
                          <li key={index}>{item.tipo}</li>
                          ))
                        }
                      </ul>
                    </li>
                    
                  </ul>
                }
              </div>
            }

          </ListaPopup>
        );
      }

      if (selectedRama == 'disponibilidadHoraria') {
        return(
          <ListaPopup show={showPopup} onHide={handleClosePopup} nombreLista={'Disponibilidad Horaria'} nombreCandidato={SelectedCandidato.nombre}>
            {
              <div>
                {
                  <ul>
                    <li>
                      <strong>Dias de la semana: </strong>
                      <span>{SelectedCandidato[selectedRama].diasDeLaSemana}</span>
                    </li>
                    <li>
                      <strong>Horas semanales: </strong>
                      <span>{SelectedCandidato[selectedRama].horasSemanales}</span>
                    </li>
                    <li>
                      <strong>Otro departamento: </strong>
                      <span>{SelectedCandidato[selectedRama].otroDepartamento}</span>
                    </li>
                    <li>
                      <strong>Turnos: </strong>
                      <ul>
                        {
                          SelectedCandidato[selectedRama][selectedNombreLista] && Object.values(SelectedCandidato[selectedRama][selectedNombreLista]).map((item, index) => (
                          <li key={index}>{item.turno}</li>
                          ))
                        }
                      </ul>
                    </li>
                    
                  </ul>
                }
              </div>
            }

          </ListaPopup>
        );
      }

      if(selectedNombreLista == 'encuestaCandidato'){
        return(
          <ListaPopup show={showPopup} onHide={handleClosePopup} nombreLista={'Datos de la encuesta'} nombreCandidato={SelectedCandidato.nombre}>
              {
                <div>
                  {
                    <ul>
                      <li>
                        <strong>Creada por: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].creadaPor}</span>
                      </li>
                      <li>
                        <strong>Estado: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].estado}</span>
                      </li>
                      <li>
                        <strong>Id Flow: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].idFlow}</span>
                      </li>
                      <li>
                        <strong>id Flow AFAM: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].idFlowAFAM}</span>
                      </li>
                      <li>
                        <strong>Fecha de creación: </strong>
                        <span>{SelectedCandidato[selectedNombreLista]['fechaCreacion'][2]}/{SelectedCandidato[selectedNombreLista]['fechaCreacion'][1]}/{SelectedCandidato[selectedNombreLista]['fechaCreacion'][0]} </span>
                      </li>
                      <li>
                        <strong>Fecha de finalización: </strong>
                        <span>{SelectedCandidato[selectedNombreLista]['fechaFinalizacion'][2]}/{SelectedCandidato[selectedNombreLista]['fechaFinalizacion'][1]}/{SelectedCandidato[selectedNombreLista]['fechaFinalizacion'][0]}</span>
                      </li>
                      
                      
                      
                    </ul>
                  }
                </div>
               } 
          </ListaPopup>
        );
      }

      if(selectedNombreLista == 'salud'){
        return(
          <ListaPopup show={showPopup} onHide={handleClosePopup} nombreLista={'Salud'} nombreCandidato={SelectedCandidato.nombre}>
              {
                <div>
                  {
                    <ul>
                      <li>
                        <strong>Atención médica: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].atencionMedica}</span>
                      </li>
                      <li>
                        <strong>Carnet salud: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].carnetSalud}</span>
                      </li>
                      <li>
                        <strong>Medicamento: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].medicamento}</span>
                      </li>
                      
                      <li>
                        <strong>Cuales medicamentos: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].cualesMedicamentos}</span>
                      </li>
                      
                      <li>
                        <strong>Salud mental: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].saludMental}</span>
                      </li>
                      
                       
                      
                    </ul>
                  }
                </div>
               } 
          </ListaPopup>
        );
      }

      if(selectedNombreLista == 'telefonos'){
        return(
          <ListaPopup show={showPopup} onHide={handleClosePopup} nombreLista={'Telefonos'} nombreCandidato={SelectedCandidato.nombre}>
              {
                <div>
                  {
                    <ul>
                      {
                        Object.values(SelectedCandidato[selectedNombreLista]).map((item, index) => (
                        <ul key={index}>
                          <li>
                            <strong>Duenio uno: </strong>
                            <span >{item.duenioUno}</span>
                          </li>
                          <li>
                            <strong>Número uno: </strong>
                            <span >{item.numeroUno}</span>
                          </li> 
                          <li>
                            <strong>Duenio dos: </strong>
                            <span >{item.duenioDos}</span>
                          </li>
                          <li>
                            <strong>Número dos: </strong>
                            <span >{item.numeroDos}</span>
                          </li>
                        </ul>
                        ))
                      }
                      
                       
                    </ul>
                  }
                </div>
               } 
          </ListaPopup>
        );
      }

      if(selectedNombreLista == 'habilidad'){
        return(
          <ListaPopup show={showPopup} onHide={handleClosePopup} nombreLista={'Habilidades'} nombreCandidato={SelectedCandidato.nombre}>
              {
                <div>
                  {
                    <ul>
                      <li>
                        <strong>Descripción: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].descripcion}</span>
                      </li>
                      <li>
                        <strong>Autonomia en transporte público: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].autonomia_en_transporte_publico}</span>
                      </li>
                      
                      <li>
                        <strong>Excel: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].excel}</span>
                      </li>
                      <li>
                        <strong>Imagen personal: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].imagen_personal}</span>
                      </li>
                      <li>
                        <strong>Internet: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].internet}</span>
                      </li>
                      <li>
                        <strong>lsu: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].lsu}</span>
                      </li>
                      <li>
                        <strong>Manejo de dinero: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].manejo_de_dinero}</span>
                      </li>
                      <li>
                        <strong>Power point: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].power_point}</span>
                      </li>
                      <li>
                        <strong>Word: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].word}</span>
                      </li>
                      <li>
                        <strong>Otras Habilidades: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].otrasHabilidades}</span>
                      </li>
                      
                    </ul>
                  }
                </div>
               } 
          </ListaPopup>
        );
      }



      if(selectedNombreLista == 'dirreccion'){
        return(
          <ListaPopup show={showPopup} onHide={handleClosePopup} nombreLista={'Direccion'} nombreCandidato={SelectedCandidato.nombre}>
              {
                <div>
                  {
                    <ul>
                      <li>
                        <strong>Apartamento: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].apartamento}</span>
                      </li>
                      <li>
                        <strong>Calle: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].calle}</span>
                      </li>
                      <li>
                        <strong>Calle Incluida: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].calleIncluida}</span>
                      </li>
                      <li>
                        <strong>Departamento: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].departamento}</span>
                      </li>
                      <li>
                        <strong>Esquina Uno: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].esquinaUno}</span>
                      </li>
                      <li>
                        <strong>Esquina Dos: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].esquinaDos}</span>
                      </li>
                      <li>
                        <strong>Kilometro: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].kilometro}</span>
                      </li>
                      <li>
                        <strong>Localidad: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].localidad}</span>
                      </li>
                      <li>
                        <strong>Numero de puerta: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].numeroPuerta}</span>
                      </li>
                      <li>
                        <strong>Observaciones Direccion: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].observacionesDireccion}</span>
                      </li>
                      
                    </ul>
                  }
                </div>
               } 
          </ListaPopup>
        );
      }

      if (selectedNombreLista == 'emails') {
        return(
          <ListaPopup show={showPopup} onHide={handleClosePopup} nombreLista={'Emails'} nombreCandidato={SelectedCandidato.nombre}>
              {
                <ul>
                  {
                    Object.values(SelectedCandidato[selectedNombreLista]).map((item, index) => (
                      <li key={index}>{item.email}</li>
                    ))
                  }
                </ul>
              
               } 
          </ListaPopup>
        );
      }

      

      if(selectedNombreLista == 'datosAdicionalesCandidato'){
        


        return(
          <ListaPopup show={showPopup} onHide={handleClosePopup} nombreLista={'Datos Adicionales'} nombreCandidato={SelectedCandidato.nombre}>
              {
                <div>
                  {
                    <ul className='ulEditable'>
                      <li>
                        <button onclick="handleClick()">
                          <img src={editLogo} alt="Edit"/>
                        </button>
                        <strong>Autorizacion a brindar datos: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].autorizacionDarDatos}</span>
                      </li>
                      <li>
                      <button onclick="handleClick()">
                          <img src={editLogo} alt="Edit"/>
                      </button>
                        <strong>Cantidad de hijos: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].cantHijos}</span>
                      </li>
                      <li>
                      <button onclick="handleClick()">
                          <img src={editLogo} alt="Edit"/>
                      </button>
                        <strong>Conduce: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].conduce}</span>
                      </li>
                      <li>
                      <button onclick="handleClick()">
                          <img src={editLogo} alt="Edit"/>
                      </button>
                        <strong>Tipo de libreta de conducir: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].tipoLibreta}</span>
                      </li>
                      <li>
                      <button onclick="handleClick()">
                          <img src={editLogo} alt="Edit"/>
                      </button>
                        <strong>Cuidados: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].cuidados}</span>
                      </li>
                      <li>
                      <button onclick="handleClick()">
                          <img src={editLogo} alt="Edit"/>
                      </button>
                        <strong>Envia CV: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].enviaCV}</span>
                      </li>
                      <li>
                      <button onclick="handleClick()">
                          <img src={editLogo} alt="Edit"/>
                      </button>
                        <strong>Grupo familiar: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].grupoFamiliar}</span>
                      </li>
                      <li>
                      <button onclick="handleClick()">
                          <img src={editLogo} alt="Edit"/>
                      </button>
                        <strong>Hijos: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].hijos}</span>
                      </li>
                      <li>
                      <button onclick="handleClick()">
                          <img src={editLogo} alt="Edit"/>
                      </button>
                        <strong>Informacion personal: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].infomacionPersonal}</span>
                      </li>
                      <li>
                      <button onclick="handleClick()">
                          <img src={editLogo} alt="Edit"/>
                      </button>
                        <strong>Registro en CNHD: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].registoEnCNHD}</span>
                      </li>
                      
                    </ul>
                  }
                </div>
               } 
          </ListaPopup>
        );
      }
      

      if (selectedRama == '') {
        return(
          <ListaPopup show={showPopup} onHide={handleClosePopup} nombreLista={selectedNombreLista} nombreCandidato={SelectedCandidato.nombre}>
              {
                <ul>
                  {
                    Object.values(SelectedCandidato[selectedNombreLista]).map((item, index) => (
                      <li key={index}>{item.nombre}</li>
                    ))
                  }
                </ul>
              
               } 
          </ListaPopup>
        );
      }
      
      if (selectedRama == 'experienciaLaboral') {
        return(
          <ListaPopup show={showPopup} onHide={handleClosePopup} nombreLista={'Experiencia laboral'} nombreCandidato={SelectedCandidato.nombre}>
              {
                <ul>
                  <li>
                    <strong>Descripcion situacion laboral: </strong>
                    <span>{SelectedCandidato[selectedRama].descripcionSituacionLaboral}</span>
                  </li>
                  <li>
                    <strong>Experiencia laboral: </strong>
                    <span>{SelectedCandidato[selectedRama].experienciaLaboral}</span>
                  </li>
                  <li>
                    <strong>Inicio trabajo: </strong>
                    <span>{SelectedCandidato[selectedRama].inicioTrabajo}</span>
                  </li>
                  <li>
                    <strong>Fin trabajo: </strong>
                    <span>{SelectedCandidato[selectedRama].finTrabajo}</span>
                  </li>
                  <li>
                    <strong>Puesto actual: </strong>
                    <span>{SelectedCandidato[selectedRama].puestoActual}</span>
                  </li>
                  <li>
                    <strong>Situacion laboral: </strong>
                    <span>{SelectedCandidato[selectedRama].situacionLaboral}</span>
                  </li>
                  <li>
                    <strong>Tareas: </strong>
                    <span>{SelectedCandidato[selectedRama].tareas}</span>
                  </li>
                  <li>
                    <strong>Tipo de trabajo otros: </strong>
                    <span>{SelectedCandidato[selectedRama].tipoDeTrabajoOtros}</span>
                  </li>
                  <li>
                    <strong>Tipo trabajo: </strong>
                    <span>{SelectedCandidato[selectedRama].situacitipoTrabajoonLaboral}</span>
                  </li>
                  <li>
                    <strong>Trabajo alguna vez: </strong>
                    <span>{SelectedCandidato[selectedRama].trabajoAlgunaVez}</span>
                  </li>
                  <li>
                    <strong>Ultimo puesto: </strong>
                    <span>{SelectedCandidato[selectedRama].ultimoPuesto}</span>
                  </li>
                  <li>
                      <strong>Motivos de desempleo: </strong>
                      <ul>
                        { 
                          SelectedCandidato[selectedRama]['motivosDesempleo'] && Object.values(SelectedCandidato[selectedRama]['motivosDesempleo']).map((item, index) => (
                            <li key={index}>{item.motivo}</li>
                          ))
                        }
                      </ul>
                  </li>
                  <li>
                      <strong>Actitudes: </strong>
                      <ul>
                        { 
                          SelectedCandidato[selectedRama]['actitudes'] && Object.values(SelectedCandidato[selectedRama]['actitudes']).map((item, index) => (
                            <li key={index}>{item.nombre}</li>
                          ))
                        }
                      </ul>
                  </li>
                  <li>
                      <strong>Gustos laborales: </strong>
                      <ul>
                        { 
                          SelectedCandidato[selectedRama]['gustosLaborales'] && Object.values(SelectedCandidato[selectedRama]['gustosLaborales']).map((item, index) => (
                            <li key={index}>{item.gusto}</li>
                          ))
                        }
                      </ul>
                  </li>
                  
                </ul>
               
              }
          </ListaPopup>
        );
      }

      if(selectedRama == 'candidatoIdiomas'){
        return(
          <ListaPopup show={showPopup} onHide={handleClosePopup} nombreLista={'Idiomas'} nombreCandidato={SelectedCandidato.nombre}>
            {
              SelectedCandidato[selectedRama] && Object.values(SelectedCandidato[selectedRama]).map((item, index) => (
                <ul key={index}>
                  <strong>{item[selectedNombreLista].nombre}</strong>
                  <li>{item.nivel}</li>
                </ul>
              ))
            }

          </ListaPopup>
        );

      }

      if (selectedRama == 'discapacidad') {
        
        return(
          <ListaPopup show={showPopup} onHide={handleClosePopup} nombreLista={'Tipos de discapacidades'} nombreCandidato={SelectedCandidato.nombre}>
              {
                <div>
                  <p>Diagnostico: {SelectedCandidato[selectedRama].diagnostico}</p>
                  <h5>Tipo de discapacidades: </h5>
                  {
                    <ul>
                      
                      {
                        SelectedCandidato[selectedRama][selectedNombreLista] && Object.values(SelectedCandidato[selectedRama][selectedNombreLista]).map((item, index) => (   
                          <li className='unCandidato' key={index}>{item.nombre}: {item.descripcion}</li>
                            ))
                      }
                      
                    </ul>
                  }
                </div>
              }
          </ListaPopup>

        );

      }
      
    }

      
  }

  const ListaPopup = ({ show, onHide, nombreLista, nombreCandidato, children}) => {
    // const datos = lista[sub];
    
    return (
      <Modal show = {show} onHide={onHide}>
        <Modal.Header closeButton className='modalHeder'>
        <Modal.Title className='titulosListas'>{nombreLista} de {nombreCandidato}</Modal.Title>
        </Modal.Header>
        <Modal.Body className='modalBody'>
          {children}
        </Modal.Body>
        <Modal.Footer>
        
        <Button variant="primary" onClick={onHide}>
          Cerrar
        </Button>
        
        </Modal.Footer>

      </Modal>
    );
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
          <option value="mayores a">Mayores a...(edad)</option>
          <option value="menores a">Menores a...(edad)</option>
          <option value="Area">Área</option>
          <option value="Apoyo">Apoyo</option>
          <option value="Habilidad">Habilidad</option>
          <option value="Turno">Turno</option>
          <option value="tipo_discapicidad">Tipo de discapacidad</option>
          <option value="motivo_desempleo">Motivo de desempleo</option>
          <option value="ayuda_tecnica">Ayuda Técnica</option>
        </select>
        {nuevoFiltro === 'mayores a' && (
          <input type='number' value={subFiltro} onChange={manejarCambioSubFiltro}/>
        )}
        {nuevoFiltro === 'menores a' && (
          <input type='number' value={subFiltro} onChange={manejarCambioSubFiltro}/>
        )}
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
          <button className='buttonEnviar' onClick={enviarFiltros}>Obtener Candidatos</button>
        <div>
        
      <div className="result">
        {/* ... */}
        <h4>Resultados</h4>

    <table>
          <thead>
              <tr>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Documento</th>
                  <th>Documento tipo</th>
                  <th>Nacimiento</th>
                  <th>Sexo</th>
                  <th>Estado Civil</th>
                  <th>Acciones</th>
              </tr>
          </thead>
          <tbody>
              {candidatos.map((candidato) => (
                  <tr key={candidato.id}>
                      <td>{candidato.nombre}</td>
                      <td>{candidato.apellido}</td>
                      <td onClick={() => handleCIClick(candidato.id, candidato.nombre, candidato.apellido, candidato.documento)} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>
                          {candidato.documento}
                      </td>
                      <td>{candidato.tipoDocumento}</td>
                      <td>{candidato.fecha_de_nacimiento}</td>
                      <td>{candidato.sexo}</td>
                      <td>{candidato.estadoCivil}</td>
                      <td>
                          <span className="masDetalles" onClick={() => handleSelectShow(candidato)}>Mas detalles</span>
                          {showSelect && selectedCandidadoCombo === candidato.id && (
                            <div className="selectContainer">
                              <select className="selectDropdown" onChange={(e) => handleShowPopup(e, candidato)}>
                                  <option value="">Seleccionar...</option>
                                  <option value="|apoyos">Apoyos</option>
                                  <option value="|ayudaTecnicas">Ayudas Técnicas</option>
                                  <option value="experienciaLaboral|">Experiencia Laboral</option>
                                  <option value="|areas">Áreas</option>
                                  <option value="|prestaciones">Prestaciones</option>
                                  <option value="discapacidad|tipoDiscapacidades">Discapacidades</option>
                                  <option value="|datosAdicionalesCandidato">Datos Adicionales</option>
                                  <option value="candidatoIdiomas|idioma">Idiomas</option>
                                  <option value="|dirreccion">Dirección</option>
                                  <option value="disponibilidadHoraria|turnos">Disponibilidad Horaria</option>
                                  <option value="educacion|institucionesDeseo">Educación</option>
                                  <option value="|emails">Emails</option>
                                  <option value="|encuestaCandidato">Encuesta</option>
                                  <option value="|habilidad">Habilidades</option>
                                  <option value="|salud">Salud</option>
                                  <option value="|telefonos">Teléfonos</option>
                              </select>
                            </div>
                          )}
                      </td>
                  </tr>
              ))}
          </tbody>
    </table>
        <div>
          {showPopup && (
              mostrarEstructura()
            ) 
          }
      </div>

    </div>
    </div>
      <PdfModal
          show={isModalOpen}
          onHide={() => setIsModalOpen(false)}
          pdfUrl={pdfUrl}
          candidatoDTO={candidatoDTO}
      />
    </div>
  );


};

export default BusquedaConFiltros;
