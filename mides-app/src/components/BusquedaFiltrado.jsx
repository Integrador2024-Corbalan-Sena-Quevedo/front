import React, { useState, useRef, useEffect } from 'react';
import useFetchFiltradoCandidato from './useFetchFiltradoCandidato';
import 'bootstrap/dist/css/bootstrap.css'
import '../styles/TableMatch.css'
import '../styles/BusquedaConFiltros.css';
import { Modal, Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import editLogo from "../img/edit.png"
import PdfModal from './PdfModal';

import { VscDebugBreakpointLogUnverified } from 'react-icons/vsc';



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


const BusquedaConFiltros = ({ onAddCandidate,showAddButton  }) => {
  const {enviarFiltros, actualizarCampo, eliminarDatoLista, agregarALista, actualizarCandidato, traerIdiomas}= useFetchFiltradoCandidato();

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
  const [idiomas, setIdiomas] = useState([]);

  const handleSelectCandidate = (candidato) => {
    if (onAddCandidate) {
      onAddCandidate(candidato); 
    }
  };
  const [editable, setEditable] = useState(false);
  const [candidatoEditable, setCandidatoEditable] = useState(null);
  const [campoEditable, setCampoEditable] = useState('');
  const [showSelectAgregarALista, setShowSelectAgregarALista] = useState(false);
  const [candidatoAgregarALista, setCandidadtoAgregarALista] = useState(null);
  const [selectAbrir, setSelectAbrir] = useState(null);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const inputRef = useRef(null);
  const selectRefAgregarALista = useRef(null); 

  
  useEffect(() => {
   const fetchIdioma = async () =>{
    const idiomasResp = await traerIdiomas();
    const idiomas = Object.values(idiomasResp);
    setIdiomas(idiomas)
   };
   fetchIdioma()
},[] )
 

  

  const actualizarListaCandidatos = async (nuevoValor, lista, subLista) =>{
    
    let candidatoActualizado = null;
    
    if (subLista == "datosPrincipalesCandidato") {
      candidatoActualizado = {
            ...SelectedCandidato, [campoEditable]: nuevoValor,
          };
      
    }else{
      if (lista != '' && subLista !='') {


      
        if (subLista == "experienciaLaboral" || subLista == "discapacidad" || subLista == "idioma" || subLista == "candidatoIdiomas") {
          
          const respuesta = await actualizarCandidato(SelectedCandidato.id);
              
              
          candidatoActualizado = {
            ...respuesta
          } 
          
        }else{
          candidatoActualizado = {
            ...SelectedCandidato,
            [lista]: {
              ...SelectedCandidato[subLista],
              [campoEditable]: nuevoValor, 
            }
          };
  
        }
  
         
      }else{
  
        if (subLista =='encuestaCandidato') {
          if (campoEditable === 'fechaCreacion' || campoEditable === 'fechaFinalizacion') {
                
            const partesFecha = nuevoValor.split('-');
            const año = parseInt(partesFecha[0]);
            const mes = parseInt(partesFecha[1]); 
            const dia = parseInt(partesFecha[2]);
        
            
            const nuevaFecha = [año, mes, dia, 0, 0]; 
  
            if (campoEditable === 'fechaCreacion') {
  
              candidatoActualizado = {
                  ...SelectedCandidato,
                  [subLista]: {
                      ...SelectedCandidato[subLista],
                      [campoEditable]: nuevaFecha, 
                  }
              };
            }else{
              if (campoEditable === 'fechaFinalizacion') {
  
                candidatoActualizado = {
                    ...SelectedCandidato,
                    [subLista]: {
                        ...SelectedCandidato[subLista],
                        [campoEditable]: nuevaFecha, 
                    }
                };
              }
            }
            
          } 
        }
        if(subLista =='emails'){
          if (subLista =='emails') {
            const respuesta = await actualizarCandidato(SelectedCandidato.id);
              
              
              candidatoActualizado = {
                ...respuesta
              }
            }
            
        }else{
  
          if(subLista !='' && lista == ''){
            if (subLista == "apoyos" || subLista == "ayudaTecnicas" || subLista == "prestaciones" || subLista == "areas") {
              
  
              const respuesta = await actualizarCandidato(SelectedCandidato.id);
              
              
              candidatoActualizado = {
                ...respuesta
              }
              
              
            }else{
              
            if(subLista == 'telefonos'){
              candidatoActualizado = {
                ...SelectedCandidato,
                [subLista]: 
                  SelectedCandidato[subLista].map((item, index) => 
                    index === 0 ? { ...item, [campoEditable]: nuevoValor } : item
                  )
                }
            }else{
              candidatoActualizado = {
                ...SelectedCandidato,
                [subLista]: {
                  ...SelectedCandidato[subLista],
                  [campoEditable]: nuevoValor,
                }
              };
             }  
  
            }
         } else{
          if (lista == "experienciaLaboral") {
          
            const respuesta = await actualizarCandidato(SelectedCandidato.id);
                
                
            candidatoActualizado = {
              ...respuesta
            } 
          }
          
         }
        } 
      }

    }
    
    
    
    

    
    
    const listaActualizada = candidatos.map(candidato =>
      candidato === SelectedCandidato ? candidatoActualizado : candidato
    );


    setCandidatos(listaActualizada); 
    setSelectedCandidato(candidatoActualizado);
    
  }


  const showSelectAgregar = (candidato, selectAbrir)=>{
    setShowSelectAgregarALista(true);
    setCandidadtoAgregarALista(candidato);
    setSelectAbrir(selectAbrir);
  }

  const handleBlurAgregarALista = () => {
    setShowSelectAgregarALista(false);
    setCandidadtoAgregarALista(null);
  }
  

  const guardarAgregarALista = async (lista, sublista) => {
    const nuevoValor = selectRefAgregarALista.current.value;
    const response = await agregarALista(`${SelectedCandidato.id}`, lista, sublista, nuevoValor);
    handleBlur();
    handleBlurAgregarALista();
    if (!response.ok) {
      alert('Error al agregar');
    }else{
      alert('Agregado correctamente');
      actualizarListaCandidatos(nuevoValor, sublista, lista);
      setShowPopup(true);
    }

    

  
    
    
  }

 

  const handleBlur = () => {
    setEditable(false);
    setCandidatoEditable(null);
    setCampoEditable('');
  }

  const handleEditable = (candidato, campo) => {
    setEditable(true);
    setCandidatoEditable(candidato);
    setCampoEditable(campo);
  }


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

  

  const guardarCampo = async (lista, subLista, datoAnt) =>{
    
    const nuevoValor = inputRef.current.value;
    const response = await actualizarCampo(`${SelectedCandidato.id}`, campoEditable, nuevoValor, datoAnt, lista, subLista);
    handleBlur();
    if (!response.ok) {
      alert('Error al actualizar');
    }else{
      alert('Actualizado correctamente');
      
      actualizarListaCandidatos(nuevoValor, lista, subLista);
      setShowPopup(true);
    }
    

    
  }

  const [idAEliminar, setIdAEliminar] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false); 
  const [estadoSelect, setEstadoSelect]= useState(null);
  const [nombreAEliminar, setNombreAEliminar]= useState(null);


  const eliminarDeLista = async (lista, sublista, idAEliminar, nombreAEliminar) => {
    
    setIdAEliminar(idAEliminar);
    setNombreAEliminar(nombreAEliminar)
    setSelectedRama(lista);
    setSelectedNombreLista(sublista);
    
    setIsConfirming(true); 
    
    
  };

  const handleConfirm = async () => {
    setIsConfirming(false); 
    const response = await eliminarDatoLista(`${SelectedCandidato.id}`, selectedRama, selectedNombreLista, `${idAEliminar}`);
    handleBlur();
    if (response.status != 200) {
      alert('Error al eliminar');
    } else {
      alert('Eliminado correctamente');
      actualizarListaCandidatos(idAEliminar, selectedNombreLista, selectedRama);
      
    }

    handleShowPopup(estadoSelect, SelectedCandidato);
  };

  const handleCancel = () => {
    setIsConfirming(false); 
    handleShowPopup(estadoSelect, SelectedCandidato);
  };

  const ConfirmPopUp = ({show, onHide, eliminar, nombreEliminar}) => {
    
    return (
      <Modal show = {show} onHide={onHide}>
        <Modal.Header closeButton className='modalHeder'>
        <Modal.Title className='titulosListas'>Eliminar a {nombreEliminar}</Modal.Title>
        </Modal.Header>
        <Modal.Body className='modalBody'>
        <div>
          <h3>¿Estás seguro de que deseas eliminar?</h3>
        </div>
        </Modal.Body>
        <Modal.Footer>
        <Button variant="primary" onClick={eliminar}>
          Aceptar
        </Button>
        <Button variant="primary" onClick={onHide}>
          Cancelar
        </Button>
        
        </Modal.Footer>

      </Modal>
    );

    
  };

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
      setEstadoSelect(e);

    };
  
      const handleClosePopup = () => {
      setShowPopup(false);
      setShowSelect(false);
      handleBlur();
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

  const obtenerCandidados = async () => {
    const response = await enviarFiltros(filtros);
    const resultados = Object.values(response);
    setCandidatos(resultados);
  };

  
  

  const mostrarEstructura = () => {


    if(SelectedCandidato){

      if (selectedRama == 'educacion') {
        return(
          <ListaPopup show={showPopup} onHide={handleClosePopup} nombreLista={'Educacion'} nombreCandidato={SelectedCandidato.nombre}>
            {
              <div>
                {
                  <ul className='ulEditable'>
                    <li>
                      <button onClick={()=>handleEditable(SelectedCandidato, 'aniosEducacion')}>
                          <img src={editLogo} alt="Edit"/>
                      </button>
                      <strong>Años de educación: </strong>
                      <span>{SelectedCandidato[selectedRama].aniosEducacion}</span>  
                        { editable && candidatoEditable === SelectedCandidato && campoEditable === 'aniosEducacion' && (

                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese texto aquí"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo('', selectedRama, SelectedCandidato[selectedRama].aniosEducacion)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        )}     
                    </li>
                    <li>
                      <button onClick={()=>handleEditable(SelectedCandidato, 'deseaParticiparEnAlgunaInstitucion')}>
                          <img src={editLogo} alt="Edit"/>
                      </button>
                      <strong>Desea participar en alguna institución: </strong>
                      <span>{SelectedCandidato[selectedRama].deseaParticiparEnAlgunaInstitucion}</span> 
                      { editable && candidatoEditable === SelectedCandidato && campoEditable === 'deseaParticiparEnAlgunaInstitucion' &&(

                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese texto aquí"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo('', selectedRama, SelectedCandidato[selectedRama].deseaParticiparEnAlgunaInstitucion)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        )} 
                    </li>
                    <li>
                      <button onClick={()=>handleEditable(SelectedCandidato, 'deseoDeOtrasInstituciones')}>
                          <img src={editLogo} alt="Edit"/>
                      </button>
                      <strong>Deseo de otras instituciones: </strong>
                      <span>{SelectedCandidato[selectedRama].deseoDeOtrasInstituciones}</span>  
                      { editable && candidatoEditable === SelectedCandidato && campoEditable === 'deseoDeOtrasInstituciones' && (

                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese texto aquí"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo('', selectedRama, SelectedCandidato[selectedRama].deseoDeOtrasInstituciones)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        )} 
                    </li>
                    <li>
                      <button onClick={()=>handleEditable(SelectedCandidato, 'educacionNoFormal')}>
                          <img src={editLogo} alt="Edit"/>
                      </button>
                      <strong>Educación no formal: </strong>
                      <span>{SelectedCandidato[selectedRama].educacionNoFormal}</span> 
                      { editable && candidatoEditable === SelectedCandidato && campoEditable === 'educacionNoFormal' && (

                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese texto aquí"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo('', selectedRama, SelectedCandidato[selectedRama].educacionNoFormal)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        )} 
                    </li>
                    <li>
                      <button onClick={()=>handleEditable(SelectedCandidato, 'nivelEducativo')}>
                          <img src={editLogo} alt="Edit"/>
                      </button>

                      <strong>Nivel educativo: </strong>
                      <span>{SelectedCandidato[selectedRama].nivelEducativo}</span>
                      { editable && candidatoEditable === SelectedCandidato && campoEditable === 'nivelEducativo' &&(
                          <div >
                            <div>
                              <strong>Cambiar nivel educativo:</strong>
                            </div>
                          <select class="form-select" ref={inputRef}>
                            <option value="">Seleccionar...</option>
                            <option value="SIN_INSTRUCCION">SIN INSTRUCCION</option>
                            <option value="PREESCOLAR">PREESCOLAR</option>
                            <option value="PRIMARIA_INCOMPLETA">PRIMARIA INCOMPLETA</option>
                            <option value="PRIMARIA_COMPLETA">PRIMARIA COMPLETA</option>
                            <option value="CICLO_BASICO_INCOMPLETO">CICLO BASICO INCOMPLETO</option>
                            <option value="CICLO_BASICO_COMPLETO">CICLO BASICO COMPLETO</option>
                            <option value="BACHILLERATO_INCOMPLETO">BACHILLERATO INCOMPLETO</option>
                            <option value="BACHILLERATO_COMPLETO">BACHILLERATO COMPLETO</option>
                            <option value="EDUCACION_TECNICA_INCOMPLETA">EDUCACION TECNICA INCOMPLETA</option>
                            <option value="EDUCACION_TECNICA_COMPLETA">EDUCACION TECNICA COMPLETA</option>
                            <option value="EDUCACION_MILITAR_INCOMPLETA">EDUCACION MILITAR INCOMPLETA</option>
                            <option value="EDUCACION_MILITAR_COMPLETA">EDUCACION MILITAR COMPLETA</option>
                            <option value="EDUCACION_POLICIAL_INCOMPLETA">EDUCACION POLICIAL INCOMPLETA</option>
                            <option value="EDUCACION_POLICIAL_COMPLETA">EDUCACION POLICIAL COMPLETA</option>
                            <option value="TERCIARIA_NO_UNIVERSITARIA_INCOMPLETA">TERCIARIA NO UNIVERSITARIA INCOMPLETA</option>
                            <option value="TERCIARIA_NO_UNIVERSITARIA_COMPLETA">TERCIARIA NO UNIVERSITARIA COMPLETA</option>
                            <option value="UNIVERSIDAD_O_SIMILAR_INCOMPLETA">UNIVERSIDAD O SIMILAR INCOMPLETA</option>
                            <option value="UNIVERSIDAD_O_SIMILAR_COMPLETA">UNIVERSIDAD O SIMILAR COMPLETA</option>
                          </select> 
                          <button onClick={() => guardarCampo('', selectedRama, SelectedCandidato[selectedRama].nivelEducativo)}>OK</button>
                          <button onClick={handleBlur}>Cancelar</button>
                        </div>
                        )}
                    </li>
                    <li>
                    <button onClick={()=>handleEditable(SelectedCandidato, 'nombreInstitucion')}>
                          <img src={editLogo} alt="Edit"/>
                      </button>
                      <strong>Nombre institución: </strong>
                      <span>{SelectedCandidato[selectedRama].nombreInstitucion}</span> 
                      { editable && candidatoEditable === SelectedCandidato && campoEditable === 'nombreInstitucion' && (

                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese texto aquí"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo('', selectedRama, SelectedCandidato[selectedRama].nombreInstitucion)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        )}
                    </li>
                    <li>
                    <button onClick={()=>handleEditable(SelectedCandidato, 'participacionInstitucion')}>
                          <img src={editLogo} alt="Edit"/>
                      </button>
                      <strong>Participacion institución: </strong>
                      <span>{SelectedCandidato[selectedRama].participacionInstitucion}</span>
                      { editable && candidatoEditable === SelectedCandidato && campoEditable === 'participacionInstitucion' &&(

                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese texto aquí"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo('', selectedRama, SelectedCandidato[selectedRama].participacionInstitucion)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        )}
                    </li>
                    <li>
                    <button onClick={()=>handleEditable(SelectedCandidato, 'razonDejaEstudios')}>
                          <img src={editLogo} alt="Edit"/>
                      </button>
                      <strong>Razon por la que deja estudios: </strong>
                      <span>{SelectedCandidato[selectedRama].razonDejaEstudios}</span> 
                      { editable && candidatoEditable === SelectedCandidato && campoEditable === 'razonDejaEstudios' && (

                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese texto aquí"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo('', selectedRama, SelectedCandidato[selectedRama].razonDejaEstudios)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        )}
                    </li>
                    <li>
                    <button onClick={()=>handleEditable(SelectedCandidato, 'situacionActual')}>
                          <img src={editLogo} alt="Edit"/>
                      </button>
                      <strong>Situacion actual: </strong>
                      <span>{SelectedCandidato[selectedRama].situacionActual}</span> 
                      { editable && candidatoEditable === SelectedCandidato && campoEditable === 'situacionActual' && (

                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese texto aquí"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo('', selectedRama, SelectedCandidato[selectedRama].situacionActual)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        )}
                    </li>
                    
                    <li>
                      <strong>Instituciones deseo: </strong>
                      <ul>
                        {
                          SelectedCandidato[selectedRama][selectedNombreLista] && Object.values(SelectedCandidato[selectedRama][selectedNombreLista]).map((item, index) => (
                          <li key={index} className='fondoAnim'>
                            <button className='eliminar' onClick={()=>eliminarDeLista(selectedRama, selectedNombreLista, item.id, item.tipo)}>
                                  X
                            </button>
                            <strong>{item.tipo}</strong>
                          </li>
                          ))
                          
                        }
                        
                        {showSelectAgregarALista &&  candidatoAgregarALista == SelectedCandidato &&(
                          <div >
                            <div>
                              <strong>Agregar nueva instituciones deseo:</strong>
                            </div>
                          <select class="form-select" ref={selectRefAgregarALista}>
                            <option value="">Seleccionar...</option>
                            <option value="EDUCATIVA">EDUCATIVA</option>
                            <option value="RECREATIVA">RECREATIVA</option>
                            <option value="REHABILITACION">REHABILITACION</option>
                            <option value="OTRA">OTRA</option>
                          </select>

                          
                          <button onClick={() => guardarAgregarALista(selectedRama, selectedNombreLista)}>OK</button>
                          <button onClick={handleBlurAgregarALista}>X</button>

                          
                        </div>

                        
                        )}
                        {!showSelectAgregarALista &&(
                        <button onClick={() => showSelectAgregar(SelectedCandidato, '')}>Agregar</button>
                        )

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
                  <ul className='ulEditable'>
                    <li>
                      <button onClick={()=>handleEditable(SelectedCandidato, 'diasDeLaSemana')}>
                          <img src={editLogo} alt="Edit"/>
                      </button>
                      <strong>Días de la semana: </strong>
                      <span>{SelectedCandidato[selectedRama].diasDeLaSemana}</span>  
                      { editable && candidatoEditable === SelectedCandidato && campoEditable === 'diasDeLaSemana' && (

                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese texto aquí"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo('', selectedRama, SelectedCandidato[selectedRama].diasDeLaSemana)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        ) }
                    </li>
                    <li>
                    <button onClick={()=>handleEditable(SelectedCandidato, 'horasSemanales')}>
                          <img src={editLogo} alt="Edit"/>
                      </button>
                      <strong>Horas semanales: </strong>
                      <span>{SelectedCandidato[selectedRama].horasSemanales}</span> 
                      { editable && candidatoEditable === SelectedCandidato && campoEditable === 'horasSemanales' && (

                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese texto aquí"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo('', selectedRama, SelectedCandidato[selectedRama].horasSemanales)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        )}
                    </li>
                    <li>
                    <button onClick={()=>handleEditable(SelectedCandidato, 'otroDepartamento')}>
                          <img src={editLogo} alt="Edit"/>
                      </button>
                      <strong>Otro departamento: </strong>
                      <span>{SelectedCandidato[selectedRama].otroDepartamento}</span>  
                      { editable && candidatoEditable === SelectedCandidato && campoEditable === 'otroDepartamento' && (

                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese texto aquí"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo('', selectedRama, SelectedCandidato[selectedRama].otroDepartamento)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        )}
                    </li>
                    <li>
                      <strong>Turnos: </strong>
                      <ul>
                        {
                          SelectedCandidato[selectedRama][selectedNombreLista] && Object.values(SelectedCandidato[selectedRama][selectedNombreLista]).map((item, index) => (
                          <li key={index} className='fondoAnim'>
                            <button className='eliminar' onClick={()=>eliminarDeLista(selectedRama, selectedNombreLista, item.id, item.turno)}>
                                  X
                            </button>
                            <strong>{item.turno}</strong>
                          </li>
                          ))
                        }
                        {showSelectAgregarALista &&  candidatoAgregarALista == SelectedCandidato &&(
                          
                          <div >
                            <div>
                              <strong>Agregar nuevo turno:</strong>
                            </div>
                          
                          <select class="form-select" ref={selectRefAgregarALista}>

                            <option value="">Seleccionar...</option>
                            <option value="TARDE">TARDE</option>
                            <option value="MANIANA">MAÑANA</option>
                            <option value="NOCHE">NOCHE</option>
                            <option value="INDIFERENTE">INDIFERENTE</option>
                            <option value="ROTATIVO">ROTATIVO</option>
                          </select>

                          
                          <button onClick={() => guardarAgregarALista(selectedRama, selectedNombreLista)}>OK</button>
                          <button onClick={handleBlurAgregarALista}>Cancelar</button>

                          
                        </div>                       
                        )}
                        {!showSelectAgregarALista && (
                        <button onClick={() => showSelectAgregar(SelectedCandidato, '')}>Agregar</button>


                        )

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
                    <ul className='ulEditable'>
                      <li>
                      <button onClick={()=>handleEditable(SelectedCandidato, 'creadaPor')}>
                          <img src={editLogo} alt="Edit"/>
                      </button>
                        <strong>Creada por: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].creadaPor}</span> 
                        { editable && candidatoEditable === SelectedCandidato && campoEditable === 'creadaPor' && (

                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese un nuevo valor"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo(selectedRama, selectedNombreLista, SelectedCandidato[selectedNombreLista].creadaPor)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        )}
                      </li>
                      <li>
                      <button onClick={()=>handleEditable(SelectedCandidato, 'estado')}>
                          <img src={editLogo} alt="Edit"/>
                      </button>
                        <strong>Estado: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].estado}</span> 
                        { editable && candidatoEditable === SelectedCandidato && campoEditable === 'estado' && (

                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese el nuevo valor"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo(selectedRama, selectedNombreLista, SelectedCandidato[selectedNombreLista].estado)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        )}
                      </li>
                      <li>
                      <button onClick={()=>handleEditable(SelectedCandidato, 'idFlow')}>
                          <img src={editLogo} alt="Edit"/>
                      </button>
                        <strong>Id Flow: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].idFlow}</span> 
                        { editable && candidatoEditable === SelectedCandidato && campoEditable === 'idFlow' && (

                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese el nuevo valor"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo(selectedRama, selectedNombreLista, SelectedCandidato[selectedNombreLista].idFlow)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        )}
                      </li>
                      <li>
                      <button onClick={()=>handleEditable(SelectedCandidato, 'idFlowAFAM')}>
                          <img src={editLogo} alt="Edit"/>
                      </button>
                        <strong>id Flow AFAM: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].idFlowAFAM}</span>  
                        { editable && candidatoEditable === SelectedCandidato && campoEditable === 'idFlowAFAM' && (

                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese el nuevo valor"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo(selectedRama, selectedNombreLista, SelectedCandidato[selectedNombreLista].idFlowAFAM)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        )}
                      </li>
                      <li>
                      <button onClick={()=>handleEditable(SelectedCandidato, 'fechaCreacion')}>
                          <img src={editLogo} alt="Edit"/>
                      </button>
                        <strong>Fecha de creación: </strong>
                        <span>{SelectedCandidato[selectedNombreLista]['fechaCreacion'][2]}/{SelectedCandidato[selectedNombreLista]['fechaCreacion'][1]}/{SelectedCandidato[selectedNombreLista]['fechaCreacion'][0]} </span>  

                        { editable && candidatoEditable === SelectedCandidato && campoEditable === 'fechaCreacion'&& (

                          <div>
                            <Form.Control
                              type="date"
                              placeholder="Ingrese una fecha de creacion"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo('', selectedNombreLista, '')}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        )}
                      </li>
                      <li>
                      <button onClick={()=>handleEditable(SelectedCandidato, 'fechaFinalizacion')}>
                          <img src={editLogo} alt="Edit"/>
                      </button>
                        <strong>Fecha de finalización: </strong>
                        <span>{SelectedCandidato[selectedNombreLista]['fechaFinalizacion'][2]}/{SelectedCandidato[selectedNombreLista]['fechaFinalizacion'][1]}/{SelectedCandidato[selectedNombreLista]['fechaFinalizacion'][0]}</span>

                        { editable && candidatoEditable === SelectedCandidato && campoEditable === 'fechaFinalizacion' && (

                          <div>
                            <Form.Control
                              type="date"
                              placeholder="Ingrese una fecha de finalizacion"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo('', selectedNombreLista, '')}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        ) }
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
                    <ul className='ulEditable'>
                      <li>
                      <button onClick={()=>handleEditable(SelectedCandidato, 'atencionMedica')}>
                          <img src={editLogo} alt="Edit"/>
                      </button>
                        <strong>Atención médica: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].atencionMedica}</span>
                        { editable && candidatoEditable === SelectedCandidato && campoEditable === 'atencionMedica' && (

                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese el nuevo valor"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo(selectedRama, selectedNombreLista, SelectedCandidato[selectedNombreLista].atencionMedica)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        )}
                      </li>
                      <li>
                      <button onClick={()=>handleEditable(SelectedCandidato, 'carnetSalud')}>
                          <img src={editLogo} alt="Edit"/>
                      </button>
                        <strong>Carnet salud: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].carnetSalud}</span>
                        { editable && candidatoEditable === SelectedCandidato && campoEditable === 'carnetSalud' && (

                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese el nuevo valor"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo(selectedRama, selectedNombreLista, SelectedCandidato[selectedNombreLista].carnetSalud)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        )}
                      </li>
                      <li>
                      <button onClick={()=>handleEditable(SelectedCandidato, 'medicamento')}>
                          <img src={editLogo} alt="Edit"/>
                      </button>
                        <strong>Medicamento: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].medicamento}</span>
                        { editable && candidatoEditable === SelectedCandidato && campoEditable === 'medicamento' && (

                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese el nuevo valor"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo(selectedRama, selectedNombreLista, SelectedCandidato[selectedNombreLista].medicamento)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        )}
                      </li>
                      
                      <li>
                      <button onClick={()=>handleEditable(SelectedCandidato, 'cualesMedicamentos')}>
                          <img src={editLogo} alt="Edit"/>
                      </button>
                        <strong>Cuáles medicamentos: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].cualesMedicamentos}</span>
                        { editable && candidatoEditable === SelectedCandidato && campoEditable === 'cualesMedicamentos' && (

                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese el nuevo valor"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo(selectedRama, selectedNombreLista, SelectedCandidato[selectedNombreLista].cualesMedicamentos)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        )}
                      </li>
                      
                      <li>
                      <button onClick={()=>handleEditable(SelectedCandidato, 'saludMental')}>
                          <img src={editLogo} alt="Edit"/>
                      </button>
                        <strong>Salud mental: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].saludMental}</span>
                        { editable && candidatoEditable === SelectedCandidato && campoEditable === 'saludMental' && (

                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese el nuevo valor"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo(selectedRama, selectedNombreLista, SelectedCandidato[selectedNombreLista].saludMental)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        )}
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
                    <ul className='ulEditable'>
                      {
                        Object.values(SelectedCandidato[selectedNombreLista]).map((item, index) => (
                        <ul key={index}>
                          <li>
                          <button onClick={()=>handleEditable(SelectedCandidato, 'duenioUno')}>
                              <img src={editLogo} alt="Edit"/>
                          </button>
                            <strong>Dueño uno: </strong>
                            <span >{item.duenioUno}</span>
                            { editable && candidatoEditable === SelectedCandidato && campoEditable === 'duenioUno' && (

                              <div>
                                <Form.Control
                                  type="text"
                                  placeholder="Ingrese el nuevo valor"
                                  autoFocus
                                  ref={inputRef}
                                  />
                                <button onClick={() => guardarCampo(selectedRama, selectedNombreLista, item.duenioUno)}>OK</button>
                                <button onClick={handleBlur}>Cancelar</button>
                            </div>
                            )}
                          </li>
                          <li>
                          <button onClick={()=>handleEditable(SelectedCandidato, 'numeroUno')}>
                              <img src={editLogo} alt="Edit"/>
                          </button>
                            <strong>Número uno: </strong>
                            <span >{item.numeroUno}</span>
                            { editable && candidatoEditable === SelectedCandidato && campoEditable === 'numeroUno' && (

                              <div>
                                <Form.Control
                                  type="text"
                                  placeholder="Ingrese el nuevo valor"
                                  autoFocus
                                  ref={inputRef}
                                  />
                                <button onClick={() => guardarCampo(selectedRama, selectedNombreLista, item.numeroUno)}>OK</button>
                                <button onClick={handleBlur}>Cancelar</button>
                            </div>
                            )}
                          </li> 
                          <li>
                          <button onClick={()=>handleEditable(SelectedCandidato, 'duenioDos')}>
                              <img src={editLogo} alt="Edit"/>
                          </button>
                            <strong>Dueño dos: </strong>
                            <span >{item.duenioDos}</span>
                            { editable && candidatoEditable === SelectedCandidato && campoEditable === 'duenioDos' && (

                              <div>
                                <Form.Control
                                  type="text"
                                  placeholder="Ingrese el nuevo valor"
                                  autoFocus
                                  ref={inputRef}
                                  />
                                <button onClick={() => guardarCampo(selectedRama, selectedNombreLista, item.duenioDos)}>OK</button>
                                <button onClick={handleBlur}>Cancelar</button>
                            </div>
                            )}
                          </li>
                          <li>
                          <button onClick={()=>handleEditable(SelectedCandidato, 'numeroDos')}>
                              <img src={editLogo} alt="Edit"/>
                          </button>
                            <strong>Número dos: </strong>
                            <span >{item.numeroDos}</span>
                            { editable && candidatoEditable === SelectedCandidato && campoEditable === 'numeroDos' && (

                              <div>
                                <Form.Control
                                  type="text"
                                  placeholder="Ingrese el nuevo valor"
                                  autoFocus
                                  ref={inputRef}
                                  />
                                <button onClick={() => guardarCampo(selectedRama, selectedNombreLista, item.numeroDos)}>OK</button>
                                <button onClick={handleBlur}>Cancelar</button>
                            </div>
                            )}
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
                    <ul className='ulEditable'>
                      <li>
                      <button onClick={()=>handleEditable(SelectedCandidato, 'descripcion')}>
                          <img src={editLogo} alt="Edit"/>
                      </button>
                        <strong>Descripción: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].descripcion}</span>
                        { editable && candidatoEditable === SelectedCandidato && campoEditable === 'descripcion' && (

                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese el nuevo valor"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo(selectedRama, selectedNombreLista, SelectedCandidato[selectedNombreLista].descripcion)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        )}
                      </li>
                      <li>
                      <button onClick={()=>handleEditable(SelectedCandidato, 'autonomia_en_transporte_publico')}>
                          <img src={editLogo} alt="Edit"/>
                      </button>
                        <strong>Autonomía en transporte público: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].autonomia_en_transporte_publico}</span>
                        { editable && candidatoEditable === SelectedCandidato && campoEditable === 'autonomia_en_transporte_publico' && (

                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese el nuevo valor"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo(selectedRama, selectedNombreLista, SelectedCandidato[selectedNombreLista].autonomia_en_transporte_publico)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        )}
                      </li>
                      
                      <li>
                      <button onClick={()=>handleEditable(SelectedCandidato, 'excel')}>
                          <img src={editLogo} alt="Edit"/>
                      </button>
                        <strong>Excel: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].excel}</span>
                        { editable && candidatoEditable === SelectedCandidato && campoEditable === 'excel' && (

                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese el nuevo valor"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo(selectedRama, selectedNombreLista, SelectedCandidato[selectedNombreLista].excel)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        )}
                      </li>
                      <li>
                      <button onClick={()=>handleEditable(SelectedCandidato, 'imagen_personal')}>
                          <img src={editLogo} alt="Edit"/>
                      </button>
                        <strong>Imagen personal: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].imagen_personal}</span>
                        { editable && candidatoEditable === SelectedCandidato && campoEditable === 'imagen_personal' && (

                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese el nuevo valor"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo(selectedRama, selectedNombreLista, SelectedCandidato[selectedNombreLista].imagen_personal)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        )}
                      </li>
                      <li>
                      <button onClick={()=>handleEditable(SelectedCandidato, 'internet')}>
                          <img src={editLogo} alt="Edit"/>
                      </button>
                        <strong>Internet: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].internet}</span>
                        { editable && candidatoEditable === SelectedCandidato && campoEditable === 'internet' && (

                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese el nuevo valor"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo(selectedRama, selectedNombreLista, SelectedCandidato[selectedNombreLista].internet)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        )}
                      </li>
                      <li>
                      <button onClick={()=>handleEditable(SelectedCandidato, 'lsu')}>
                          <img src={editLogo} alt="Edit"/>
                      </button>
                        <strong>lsu: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].lsu}</span>
                        { editable && candidatoEditable === SelectedCandidato && campoEditable === 'lsu' && (

                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese el nuevo valor"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo(selectedRama, selectedNombreLista, SelectedCandidato[selectedNombreLista].lsu)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        )}
                      </li>
                      <li>
                      <button onClick={()=>handleEditable(SelectedCandidato, 'manejo_de_dinero')}>
                          <img src={editLogo} alt="Edit"/>
                      </button>
                        <strong>Manejo de dinero: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].manejo_de_dinero}</span>
                        { editable && candidatoEditable === SelectedCandidato && campoEditable === 'manejo_de_dinero' && (

                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese el nuevo valor"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo(selectedRama, selectedNombreLista, SelectedCandidato[selectedNombreLista].manejo_de_dinero)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        )}
                      </li>
                      <li>
                      <button onClick={()=>handleEditable(SelectedCandidato, 'power_point')}>
                          <img src={editLogo} alt="Edit"/>
                      </button>
                        <strong>Power point: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].power_point}</span>
                        { editable && candidatoEditable === SelectedCandidato && campoEditable === 'power_point' && (

                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese el nuevo valor"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo(selectedRama, selectedNombreLista, SelectedCandidato[selectedNombreLista].power_point)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        )}
                      </li>
                      <li>
                      <button onClick={()=>handleEditable(SelectedCandidato, 'word')}>
                          <img src={editLogo} alt="Edit"/>
                      </button>
                        <strong>Word: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].word}</span>
                        { editable && candidatoEditable === SelectedCandidato && campoEditable === 'word' && (

                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese el nuevo valor"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo(selectedRama, selectedNombreLista, SelectedCandidato[selectedNombreLista].word)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        )}
                      </li>
                      <li>
                      <button onClick={()=>handleEditable(SelectedCandidato, 'otrasHabilidades')}>
                          <img src={editLogo} alt="Edit"/>
                      </button>
                        <strong>Otras Habilidades: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].otrasHabilidades}</span>
                        { editable && candidatoEditable === SelectedCandidato && campoEditable === 'otrasHabilidades' && (

                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese el nuevo valor"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo(selectedRama, selectedNombreLista, SelectedCandidato[selectedNombreLista].otrasHabilidades)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        )}
                      </li>
                      
                    </ul>
                  }
                </div>
               } 
          </ListaPopup>
        );
      }



      if(selectedNombreLista == 'direccion'){
        return(
          <ListaPopup show={showPopup} onHide={handleClosePopup} nombreLista={'Direccion'} nombreCandidato={SelectedCandidato.nombre}>
              {
                <div>
                  {
                    <ul className='ulEditable'>
                      <li>
                      <button onClick={()=>handleEditable(SelectedCandidato, 'apartamento')}>
                          <img src={editLogo} alt="Edit"/>
                      </button>
                        <strong>Apartamento: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].apartamento}</span>
                        { editable && candidatoEditable === SelectedCandidato && campoEditable === 'apartamento' && (

                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese el nuevo valor"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo(selectedRama, selectedNombreLista, SelectedCandidato[selectedNombreLista].apartamento)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        )}
                      </li>
                      <li>
                      <button onClick={()=>handleEditable(SelectedCandidato, 'calle')}>
                          <img src={editLogo} alt="Edit"/>
                      </button>
                        <strong>Calle: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].calle}</span>
                        { editable && candidatoEditable === SelectedCandidato && campoEditable === 'calle' && (

                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese el nuevo valor"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo(selectedRama, selectedNombreLista, SelectedCandidato[selectedNombreLista].calle)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        )}
                      </li>
                      <li>
                      <button onClick={()=>handleEditable(SelectedCandidato, 'calleIncluida')}>
                          <img src={editLogo} alt="Edit"/>
                      </button>
                        <strong>Calle Incluida: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].calleIncluida}</span>
                        { editable && candidatoEditable === SelectedCandidato && campoEditable === 'calleIncluida' && (

                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese el nuevo valor"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo(selectedRama, selectedNombreLista, SelectedCandidato[selectedNombreLista].calleIncluida)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        )}
                      </li>
                      <li>
                      <button onClick={()=>handleEditable(SelectedCandidato, 'departamento')}>
                          <img src={editLogo} alt="Edit"/>
                      </button>
                        <strong>Departamento: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].departamento}</span>
                        { editable && candidatoEditable === SelectedCandidato && campoEditable === 'departamento' && (

                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese el nuevo valor"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo(selectedRama, selectedNombreLista, SelectedCandidato[selectedNombreLista].departamento)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        )}
                      </li>
                      <li>
                      <button onClick={()=>handleEditable(SelectedCandidato, 'esquinaUno')}>
                          <img src={editLogo} alt="Edit"/>
                      </button>
                        <strong>Esquina Uno: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].esquinaUno}</span>
                        { editable && candidatoEditable === SelectedCandidato && campoEditable === 'esquinaUno' && (

                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese el nuevo valor"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo(selectedRama, selectedNombreLista, SelectedCandidato[selectedNombreLista].esquinaUno)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        )}
                      </li>
                      <li>
                      <button onClick={()=>handleEditable(SelectedCandidato, 'esquinaDos')}>
                          <img src={editLogo} alt="Edit"/>
                      </button>
                        <strong>Esquina Dos: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].esquinaDos}</span>
                        { editable && candidatoEditable === SelectedCandidato && campoEditable === 'esquinaDos' && (

                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese el nuevo valor"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo(selectedRama, selectedNombreLista, SelectedCandidato[selectedNombreLista].esquinaDos)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        )}
                      </li>
                      <li>
                      <button onClick={()=>handleEditable(SelectedCandidato, 'kilometro')}>
                          <img src={editLogo} alt="Edit"/>
                      </button>
                        <strong>Kilómetro: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].kilometro}</span>
                        { editable && candidatoEditable === SelectedCandidato && campoEditable === 'kilometro' && (

                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese el nuevo valor"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo(selectedRama, selectedNombreLista, SelectedCandidato[selectedNombreLista].kilometro)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        )}
                      </li>
                      <li>
                      <button onClick={()=>handleEditable(SelectedCandidato, 'localidad')}>
                          <img src={editLogo} alt="Edit"/>
                      </button>
                        <strong>Localidad: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].localidad}</span>
                        { editable && candidatoEditable === SelectedCandidato && campoEditable === 'localidad' && (

                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese el nuevo valor"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo(selectedRama, selectedNombreLista, SelectedCandidato[selectedNombreLista].localidad)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        )}
                      </li>
                      <li>
                      <button onClick={()=>handleEditable(SelectedCandidato, 'numeroPuerta')}>
                          <img src={editLogo} alt="Edit"/>
                      </button>
                        <strong>Número de puerta: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].numeroPuerta}</span>
                        { editable && candidatoEditable === SelectedCandidato && campoEditable === 'numeroPuerta' && (

                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese el nuevo valor"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo(selectedRama, selectedNombreLista, SelectedCandidato[selectedNombreLista].numeroPuerta)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        )}
                      </li>
                      <li>
                      <button onClick={()=>handleEditable(SelectedCandidato, 'observacionesDireccion')}>
                          <img src={editLogo} alt="Edit"/>
                      </button>
                        <strong>Observaciones Dirección: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].observacionesDireccion}</span>
                        { editable && candidatoEditable === SelectedCandidato && campoEditable === 'observacionesDireccion' && (

                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese el nuevo valor"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo(selectedRama, selectedNombreLista, SelectedCandidato[selectedNombreLista].observacionesDireccion)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        )}
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
                <ul className='ulEditable'>
                  {
                    Object.values(SelectedCandidato[selectedNombreLista]).map((item, index) => (
                      <li key={index} className='fondoAnim'>
                        <button onClick={()=>handleEditable(SelectedCandidato, item.id)}>
                          <img src={editLogo} alt="Edit"/>
                        </button>
                        <button className="eliminar" onClick={()=>eliminarDeLista(selectedNombreLista, "", item.id, item.email)}>X</button>
                        <strong>{item.email}</strong>
                        { editable && candidatoEditable === SelectedCandidato && campoEditable === item.id && (

                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese el nuevo valor"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo('', selectedNombreLista, item.email)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        )} 
                      </li>
                    ))
                  }
                  {showSelectAgregarALista &&  candidatoAgregarALista == SelectedCandidato &&(
                          <div >
                            <strong>Agregar nuevo email</strong>
                            <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese el nuevo valor"
                              autoFocus
                              ref={selectRefAgregarALista}
                              />
                         </div>
                          <button onClick={() => guardarAgregarALista(selectedNombreLista, "")}>OK</button>
                          <button onClick={handleBlurAgregarALista}>Cancelar</button>

                          
                        </div>

                        
                        )}
                       { !editable && !showSelectAgregarALista &&(
                        <button onClick={() => showSelectAgregar(SelectedCandidato, '')}>Agregar</button>


                       )

                       }
                  
                </ul>
              
               } 
          </ListaPopup>
        );
      }

      if(selectedNombreLista == 'datosPrincipalesCandidato'){
        return(
          <ListaPopup show={showPopup} onHide={handleClosePopup} nombreLista={'Datos Principales'} nombreCandidato={SelectedCandidato.nombre} handleEditable={handleEditable} handleBlur = {handleBlur} >
          {
            <div>
              {
                <ul className='ulEditable'>
                  <li>
                    <button onClick={()=>handleEditable(SelectedCandidato, 'nombre')}>
                      <img src={editLogo} alt="Edit"/>
                    </button>
                    <strong>Nombre: </strong>
                    <span>{SelectedCandidato.nombre}</span> 
                    { editable && candidatoEditable === SelectedCandidato && campoEditable === 'nombre' && (

                      <div>
                        <Form.Control
                          type="text"
                          placeholder="Ingrese texto aquí"
                          autoFocus
                          ref={inputRef}
                          />
                        <button onClick={() => guardarCampo(selectedRama, selectedNombreLista, SelectedCandidato.nombre)}>OK</button>
                        <button onClick={handleBlur}>Cancelar</button>
                     </div>
                    )}     
                  </li>
                  <li>
                  <button onClick={()=>handleEditable(SelectedCandidato, 'apellido')}>
                      <img src={editLogo} alt="Edit"/>
                    </button>
                    <strong>Apellido: </strong>
                    <span>{SelectedCandidato.apellido}</span>  
                    { editable && candidatoEditable === SelectedCandidato && campoEditable === 'apellido' && (
                      <div>
                        <Form.Control
                          type="text"
                          placeholder="Ingrese texto aquí"
                          autoFocus
                          ref={inputRef}
                          />
                        <button onClick={() => guardarCampo(selectedRama, selectedNombreLista, SelectedCandidato.apellido)}>OK</button>
                        <button onClick={handleBlur}>Cancelar</button>
                     </div>
                    )}  
                  </li>
                  <li>
                  <button onClick={()=>handleEditable(SelectedCandidato, 'documento')}>
                      <img src={editLogo} alt="Edit"/>
                  </button>
                    <strong>Documento: </strong>
                    <span>{SelectedCandidato.documento}</span>  
                    { editable && candidatoEditable === SelectedCandidato && campoEditable === 'documento' && (
                      <div>
                        <Form.Control
                          type="text"
                          placeholder="Ingrese texto aquí"
                          autoFocus
                          ref={inputRef}
                          />
                        <button onClick={() => guardarCampo(selectedRama, selectedNombreLista, SelectedCandidato.documento)}>OK</button>
                        <button onClick={handleBlur}>Cancelar</button>
                     </div>
                    )}  
                  </li>
                  <li>
                  <button onClick={()=>handleEditable(SelectedCandidato, 'tipoDocumento')}>
                      <img src={editLogo} alt="Edit"/>
                  </button>
                    <strong>Tipo Documento: </strong>
                    <span>{SelectedCandidato.tipoDocumento}</span>  
                    { editable && candidatoEditable === SelectedCandidato && campoEditable === 'tipoDocumento' && (
                      <div>
                        <Form.Control
                          type="text"
                          placeholder="Ingrese texto aquí"
                          autoFocus
                          ref={inputRef}
                          />
                        <button onClick={() => guardarCampo(selectedRama, selectedNombreLista, SelectedCandidato.tipoDocumento)}>OK</button>
                        <button onClick={handleBlur}>Cancelar</button>
                     </div>
                    )}  
                  </li>
                  <li>
                  <button onClick={()=>handleEditable(SelectedCandidato, 'fecha_de_nacimiento')}>
                      <img src={editLogo} alt="Edit"/>
                  </button>
                    <strong>Nacimiento: </strong>
                    <span>{SelectedCandidato.fecha_de_nacimiento}</span> 
                    { editable && candidatoEditable === SelectedCandidato && campoEditable === 'fecha_de_nacimiento' && (
                      <div>
                        <Form.Control
                          type="date"
                          placeholder="Ingrese texto aquí"
                          autoFocus
                          ref={inputRef}
                          />
                        <button onClick={() => guardarCampo(selectedRama, selectedNombreLista,SelectedCandidato.fecha_de_nacimiento)}>OK</button>
                        <button onClick={handleBlur}>Cancelar</button>
                     </div>
                    )}  
                  </li>
                  <li>
                  <button onClick={()=>handleEditable(SelectedCandidato, 'sexo')}>
                      <img src={editLogo} alt="Edit"/>
                  </button>
                    <strong>Sexo: </strong>
                    <span>{SelectedCandidato.sexo}</span> 
                    { editable && candidatoEditable === SelectedCandidato && campoEditable === 'sexo' && (
                      <div>
                        <Form.Control
                          type="text"
                          placeholder="Ingrese texto aquí"
                          autoFocus
                          ref={inputRef}
                          />
                        <button onClick={() => guardarCampo(selectedRama, selectedNombreLista, SelectedCandidato.sexo)}>OK</button>
                        <button onClick={handleBlur}>Cancelar</button>
                     </div>
                    )}  
                  </li>
                  <li>
                  <button onClick={()=>handleEditable(SelectedCandidato, 'identidadGenero')}>
                      <img src={editLogo} alt="Edit"/>
                  </button>
                    <strong>Identidad de género: </strong>
                    <span>{SelectedCandidato.identidadGenero}</span> 
                    { editable && candidatoEditable === SelectedCandidato && campoEditable === 'identidadGenero' && (
                      <div>
                        <Form.Control
                          type="text"
                          placeholder="Ingrese texto aquí"
                          autoFocus
                          ref={inputRef}
                          />
                        <button onClick={() => guardarCampo(selectedRama, selectedNombreLista, SelectedCandidato.identidadGenero)}>OK</button>
                        <button onClick={handleBlur}>Cancelar</button>
                     </div>
                    )}  
                  </li>
                  <li>
                  <button onClick={()=>handleEditable(SelectedCandidato, 'estadoCivil')}>
                      <img src={editLogo} alt="Edit"/>
                  </button>
                    <strong>Estado Civil: </strong>
                    <span>{SelectedCandidato.estadoCivil}</span> 
                    { editable && candidatoEditable === SelectedCandidato && campoEditable === 'estadoCivil' && (
                      <div>
                        <Form.Control
                          type="text"
                          placeholder="Ingrese texto aquí"
                          autoFocus
                          ref={inputRef}
                          />
                        <button onClick={() => guardarCampo(selectedRama, selectedNombreLista, SelectedCandidato.estadoCivil)}>OK</button>
                        <button onClick={handleBlur}>Cancelar</button>
                     </div>
                    )}  
                  </li>
                </ul>
              }
            </div>
           } 
      </ListaPopup>

        );


      }

      

      if(selectedNombreLista == 'datosAdicionalesCandidato'){


        return(
          <ListaPopup show={showPopup} onHide={handleClosePopup} nombreLista={'Datos Adicionales'} nombreCandidato={SelectedCandidato.nombre} handleEditable={handleEditable} handleBlur = {handleBlur} >
              {
                <div>
                  {
                    <ul className='ulEditable'>
                      <li>
                        <button onClick={()=>handleEditable(SelectedCandidato, 'autorizacionDarDatos')}>
                          <img src={editLogo} alt="Edit"/>
                        </button>
                        <strong>Autorización a brindar datos: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].autorizacionDarDatos}</span> 
                        { editable && candidatoEditable === SelectedCandidato && campoEditable === 'autorizacionDarDatos' && (

                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese texto aquí"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo(selectedRama, selectedNombreLista, SelectedCandidato[selectedNombreLista].autorizacionDarDatos)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        )}     
                      </li>
                      <li>
                      <button onClick={()=>handleEditable(SelectedCandidato, 'cantHijos')}>
                          <img src={editLogo} alt="Edit"/>
                        </button>
                        <strong>Cantidad de hijos: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].cantHijos}</span>  
                        { editable && candidatoEditable === SelectedCandidato && campoEditable === 'cantHijos' && (
                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese texto aquí"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo(selectedRama, selectedNombreLista, SelectedCandidato[selectedNombreLista].cantHijos)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        )}  
                      </li>
                      <li>
                      <button onClick={()=>handleEditable(SelectedCandidato, 'conduce')}>
                          <img src={editLogo} alt="Edit"/>
                      </button>
                        <strong>Conduce: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].conduce}</span>  
                        { editable && candidatoEditable === SelectedCandidato && campoEditable === 'conduce' && (
                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese texto aquí"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo(selectedRama, selectedNombreLista, SelectedCandidato[selectedNombreLista].conduce)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        )}  
                      </li>
                      <li>
                      <button onClick={()=>handleEditable(SelectedCandidato, 'tipoLibreta')}>
                          <img src={editLogo} alt="Edit"/>
                      </button>
                        <strong>Tipo de libreta de conducir: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].tipoLibreta}</span> 
                        { editable && candidatoEditable === SelectedCandidato && campoEditable === 'tipoLibreta' && (
                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese texto aquí"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo(selectedRama, selectedNombreLista,SelectedCandidato[selectedNombreLista].tipoLibreta)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        )}  
                      </li>
                      <li>
                      <button onClick={()=>handleEditable(SelectedCandidato, 'cuidados')}>
                          <img src={editLogo} alt="Edit"/>
                      </button>
                        <strong>Cuidados: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].cuidados}</span> 
                        { editable && candidatoEditable === SelectedCandidato && campoEditable === 'cuidados' && (
                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese texto aquí"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo(selectedRama, selectedNombreLista, SelectedCandidato[selectedNombreLista].cuidados)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        )}  
                      </li>
                      <li>
                      <button onClick={()=>handleEditable(SelectedCandidato, 'enviaCV')}>
                          <img src={editLogo} alt="Edit"/>
                      </button>
                        <strong>Envía CV: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].enviaCV}</span> 
                        { editable && candidatoEditable === SelectedCandidato && campoEditable === 'enviaCV' && (
                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese texto aquí"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo(selectedRama, selectedNombreLista, SelectedCandidato[selectedNombreLista].enviaCV)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        )}  
                      </li>
                      <li>
                      <button onClick={()=>handleEditable(SelectedCandidato, 'grupoFamiliar')}>
                          <img src={editLogo} alt="Edit"/>
                      </button>
                        <strong>Grupo familiar: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].grupoFamiliar}</span>   
                        { editable && candidatoEditable === SelectedCandidato && campoEditable === 'grupoFamiliar' && (
                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese texto aquí"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo(selectedRama, selectedNombreLista, SelectedCandidato[selectedNombreLista].grupoFamiliar)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        )} 
                      </li>
                      <li>
                      <button onClick={()=>handleEditable(SelectedCandidato, 'hijos')}>
                          <img src={editLogo} alt="Edit"/>
                      </button>
                        <strong>Hijos: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].hijos}</span>  
                        { editable && candidatoEditable === SelectedCandidato && campoEditable === 'hijos' && (
                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese texto aquí"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo(selectedRama, selectedNombreLista, SelectedCandidato[selectedNombreLista].hijos)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        )} 
                      </li>
                      <li>
                      <button onClick={()=>handleEditable(SelectedCandidato, 'infomacionPersonal')}>
                          <img src={editLogo} alt="Edit"/>
                      </button>
                        <strong>Información personal: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].infomacionPersonal}</span> 
                        { editable && candidatoEditable === SelectedCandidato && campoEditable === 'infomacionPersonal' && (
                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese texto aquí"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo(selectedRama, selectedNombreLista, SelectedCandidato[selectedNombreLista].infomacionPersonal)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        )} 
                      </li>
                      <li>
                      <button onClick={()=>handleEditable(SelectedCandidato, 'registoEnCNHD')}>
                          <img src={editLogo} alt="Edit"/>
                      </button>
                        <strong>Registro en CNHD: </strong>
                        <span>{SelectedCandidato[selectedNombreLista].registoEnCNHD}</span> 
                        { editable && candidatoEditable === SelectedCandidato && campoEditable === 'registoEnCNHD' && (
                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese texto aquí"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo(selectedRama, selectedNombreLista, SelectedCandidato[selectedNombreLista].registoEnCNHD)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        )} 
                      </li>
                      
                    </ul>
                  }
                </div>
               } 
          </ListaPopup>
        );
      }
      

      if (selectedRama == '') {
        switch (selectedNombreLista) {
          case "apoyos":
            return(
              <ListaPopup show={showPopup} onHide={handleClosePopup} nombreLista={selectedNombreLista} nombreCandidato={SelectedCandidato.nombre}>
                  {
                    <ul className='ulEditable'>
                      {
                        Object.values(SelectedCandidato[selectedNombreLista]).map((item, index) => (
                          <li key={index} className='fondoAnim'>
                          <button className='eliminar' onClick={()=>eliminarDeLista(selectedNombreLista, "", item.id, item.nombre)}>
                                X
                          </button>
                          <strong>{item.nombre}</strong>
                        </li>
                        ))
                      }
                      {showSelectAgregarALista &&  candidatoAgregarALista == SelectedCandidato && selectAbrir === selectedNombreLista &&(
                        
                        <div >
                          <div>
                            <strong>Agregar un nuevo apoyo:</strong>
                          </div>
                        
                        <select class="form-select" ref={selectRefAgregarALista}>
                          <option value="">Seleccionar...</option>
                          <option value="Ninguna de las anteriores">Ninguna de las anteriores</option>
                          <option value="Visión">Visión</option>
                          <option value="Audición">Audición</option>
                          <option value="Escribir">Escribir</option>
                          <option value="Postura sentado">Postura sentado</option>
                          <option value="Conocimiento numérico">Conocimiento numérico</option>
                          <option value="Desplazamientos">Desplazamientos</option>
                          <option value="Movilidad y destreza de miembros superiores">Movilidad y destreza de miembros superiores</option>
                          <option value="Movilidad en el cuello y tronco">Movilidad en el cuello y tronco</option>
                          <option value="Leer">Leer</option>
                          <option value="Comprensión verbal">Comprensión verbal</option>
                          <option value="Aprendizaje / razonamiento">Aprendizaje / razonamiento</option>
                          <option value="Fuerza y esfuerzo físico">Fuerza y esfuerzo físico</option>
                          <option value="Otras posturas">Otras posturas</option>
                          <option value="Otros">Otros</option>
                          <option value="Hablar / Expresión">Hablar / Expresión</option>
                          <option value="Movilidad de los miembros inferiores">Movilidad de los miembros inferiores</option>
                          <option value="Postura de pie">Postura de pie</option>
                        </select>

                        
                        <button onClick={() => guardarAgregarALista(selectedNombreLista, '')}>OK</button>
                        <button onClick={handleBlurAgregarALista}>Cancelar</button>

                        
                      </div>                       
                      )}
                      {!showSelectAgregarALista && (
                      <button onClick={() => showSelectAgregar(SelectedCandidato, selectedNombreLista)}>Agregar</button>
                      )

                      }
                      
                      
                      
                    </ul>
                  
                   } 
              </ListaPopup>
            );
            
            break;
          case "areas" :
            return(
              <ListaPopup show={showPopup} onHide={handleClosePopup} nombreLista={selectedNombreLista} nombreCandidato={SelectedCandidato.nombre}>
                  {
                    <ul className='ulEditable'>
                      {
                        Object.values(SelectedCandidato[selectedNombreLista]).map((item, index) => (
                          <li key={index} className='fondoAnim'>
                          <button className='eliminar' onClick={()=>eliminarDeLista(selectedNombreLista, "", item.id, item.nombre)}>
                                X
                          </button>
                          <strong>{item.nombre}</strong>
                        </li>
                        ))
                      }
                      {showSelectAgregarALista &&  candidatoAgregarALista == SelectedCandidato && selectAbrir === selectedNombreLista &&(
                        
                        <div >
                          <div>
                            <strong>Agregar una nueva area:</strong>
                          </div>
                        
                        <select class="form-select" ref={selectRefAgregarALista}>

                            <option value="">Seleccionar...</option>
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
                            <option value="Otras">Otras</option>
                            <option value="Artes y artesanía">Artes y artesanía</option>
                            <option value="Informática">Informática</option>
                            <option value="Administración">Administración</option>
                            <option value="Gastronomía">Gastronomía</option>
                            <option value="Otros">Otros</option>
                            <option value="Agraria (Jardinería, Paisajismo, Áreas Verdes, etc.)">Agraria (Jardinería, Paisajismo, Áreas Verdes, etc.)</option>
                            <option value="Madera y muebles">Madera y muebles</option>
                            <option value="Auxiliar docente">Auxiliar docente</option>
                          </select>

                        
                        <button onClick={() => guardarAgregarALista(selectedNombreLista, '')}>OK</button>
                        <button onClick={handleBlurAgregarALista}>Cancelar</button>

                        
                      </div>                       
                      )}
                      {!showSelectAgregarALista && (
                      <button onClick={() => showSelectAgregar(SelectedCandidato, selectedNombreLista)}>Agregar</button>


                      )

                      } 
                    </ul>
                  
                   } 
              </ListaPopup>
            );

            break;
          case "ayudaTecnicas":
            return(
              <ListaPopup show={showPopup} onHide={handleClosePopup} nombreLista={selectedNombreLista} nombreCandidato={SelectedCandidato.nombre}>
                  {
                    <ul className='ulEditable'>
                      {
                        Object.values(SelectedCandidato[selectedNombreLista]).map((item, index) => (
                          <li key={index} className='fondoAnim'>
                          <button className='eliminar' onClick={()=>eliminarDeLista(selectedNombreLista, "", item.id, item.nombre)}>
                                X
                          </button>
                          <strong>{item.nombre}</strong>
                        </li>
                        ))
                      }
                      {showSelectAgregarALista &&  candidatoAgregarALista == SelectedCandidato && selectAbrir === selectedNombreLista &&(
                        
                        <div >
                          <div>
                            <strong>Agregar ayuda tecnica:</strong>
                          </div>
                        
                        <select class="form-select" ref={selectRefAgregarALista}>

                            <option value="">Seleccionar...</option>
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

                        
                        <button onClick={() => guardarAgregarALista(selectedNombreLista, '')}>OK</button>
                        <button onClick={handleBlurAgregarALista}>Cancelar</button>

                        
                      </div>                       
                      )}
                      {!showSelectAgregarALista && (
                      <button onClick={() => showSelectAgregar(SelectedCandidato, selectedNombreLista)}>Agregar</button>


                      )

                      } 
                    </ul>
                  
                   } 
              </ListaPopup>
            );

            break;
          case "prestaciones":
            return(
              <ListaPopup show={showPopup} onHide={handleClosePopup} nombreLista={selectedNombreLista} nombreCandidato={SelectedCandidato.nombre}>
                  {
                    <ul className='ulEditable'>
                      {
                        Object.values(SelectedCandidato[selectedNombreLista]).map((item, index) => (
                          <li key={index} className='fondoAnim'>
                          <button className='eliminar' onClick={()=>eliminarDeLista(selectedNombreLista, "", item.id, item.nombre)}>
                                X
                          </button>
                          <strong>{item.nombre}</strong>
                        </li>
                        ))
                      }
                      {showSelectAgregarALista &&  candidatoAgregarALista == SelectedCandidato && selectAbrir === selectedNombreLista &&(
                        
                        <div >
                          <div>
                            <strong>Agregar una prestación:</strong>
                          </div>
                        
                        <select class="form-select" ref={selectRefAgregarALista}>
                          <option value="">Seleccionar...</option>
                          <option value="Pensión a la vejez - BPS">Pensión a la vejez - BPS</option>
                          <option value="Asistencia a la vejez">Asistencia a la vejez</option>
                          <option value="Tarjeta Uruguay Social (TUS)">Tarjeta Uruguay Social (TUS)</option>
                          <option value="Pensión de BPS por discapacidad">Pensión de BPS por discapacidad</option>
                          <option value="Jubilación BPS">Jubilación BPS</option>
                          <option value="Asignaciones Familiares   - Plan de Equidad (AFAM-PE)">Asignaciones Familiares - Plan de Equidad (AFAM-PE)</option>
                          <option value="Pensión de BPS por invalidez">Pensión de BPS por invalidez</option>
                          <option value="Jubilación de otras cajas">Jubilación de otras cajas</option>
                        </select>
                        <button onClick={() => guardarAgregarALista(selectedNombreLista, '')}>OK</button>
                        <button onClick={handleBlurAgregarALista}>Cancelar</button> 
                      </div>                 
                      )}
                      {!showSelectAgregarALista && (
                      <button onClick={() => showSelectAgregar(SelectedCandidato, selectedNombreLista)}>Agregar</button>


                      )

                      } 
                    </ul>
                  
                   } 
              </ListaPopup>
            );

            break; 
        
          default:
            break;
        }
        return(
          <ListaPopup show={showPopup} onHide={handleClosePopup} nombreLista={selectedNombreLista} nombreCandidato={SelectedCandidato.nombre}>
              {
                <ul className='ulEditable'>
                  {
                    Object.values(SelectedCandidato[selectedNombreLista]).map((item, index) => (
                      <li key={index} >{item.nombre}</li>
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
                <ul className='ulEditable'>
                  <li>
                      <button onClick={()=>handleEditable(SelectedCandidato, 'descripcionSituacionLaboral')}>
                          <img src={editLogo} alt="Edit"/>
                      </button>
                    <strong>Descripción situación laboral: </strong>
                    <span>{SelectedCandidato[selectedRama].descripcionSituacionLaboral}</span>
                    { editable && candidatoEditable === SelectedCandidato && campoEditable === 'descripcionSituacionLaboral' && (
                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese texto aquí"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo(selectedRama, selectedNombreLista, SelectedCandidato[selectedRama].descripcionSituacionLaboral)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        )} 
                  </li>
                  <li>
                  <button onClick={()=>handleEditable(SelectedCandidato, 'experienciaLaboral')}>
                          <img src={editLogo} alt="Edit"/>
                      </button>
                    <strong>Experiencia laboral: </strong>
                    <span>{SelectedCandidato[selectedRama].experienciaLaboral}</span>
                    { editable && candidatoEditable === SelectedCandidato && campoEditable === 'experienciaLaboral' && (
                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese texto aquí"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo(selectedRama, selectedNombreLista, SelectedCandidato[selectedRama].experienciaLaboral)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        ) } 
                  </li>
                  <li>
                  <button onClick={()=>handleEditable(SelectedCandidato, 'inicioTrabajo')}>
                          <img src={editLogo} alt="Edit"/>
                      </button>
                    <strong>Inicio trabajo: </strong>
                    <span>{SelectedCandidato[selectedRama].inicioTrabajo}</span>
                    { editable && candidatoEditable === SelectedCandidato && campoEditable === 'inicioTrabajo' && (
                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese texto aquí"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo(selectedRama, selectedNombreLista, SelectedCandidato[selectedRama].inicioTrabajo)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        )} 
                  </li>
                  <li>
                  <button onClick={()=>handleEditable(SelectedCandidato, 'finTrabajo')}>
                          <img src={editLogo} alt="Edit"/>
                      </button>
                    <strong>Fin trabajo: </strong>
                    <span>{SelectedCandidato[selectedRama].finTrabajo}</span>
                    { editable && candidatoEditable === SelectedCandidato && campoEditable === 'finTrabajo'&&(
                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese texto aquí"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo(selectedRama, selectedNombreLista, SelectedCandidato[selectedRama].finTrabajo)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        )} 
                  </li>
                  <li>
                  <button onClick={()=>handleEditable(SelectedCandidato, 'finTrabajo')}>
                          <img src={editLogo} alt="Edit"/>
                      </button>
                    <strong>Puesto actual: </strong>
                    <span>{SelectedCandidato[selectedRama].puestoActual}</span>
                    { editable && candidatoEditable === SelectedCandidato && campoEditable === 'finTrabajo' && (
                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese texto aquí"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo(selectedRama, selectedNombreLista, SelectedCandidato[selectedRama].puestoActual)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        )} 
                  </li>
                  <li>
                  <button onClick={()=>handleEditable(SelectedCandidato, 'situacionLaboral')}>
                          <img src={editLogo} alt="Edit"/>
                      </button>
                    <strong>Situación laboral: </strong>
                    <span>{SelectedCandidato[selectedRama].situacionLaboral}</span>
                    { editable && candidatoEditable === SelectedCandidato && campoEditable === 'situacionLaboral' && (
                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese texto aquí"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo(selectedRama, selectedNombreLista, SelectedCandidato[selectedRama].situacionLaboral)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        )} 
                  </li>
                  <li>
                  <button onClick={()=>handleEditable(SelectedCandidato, 'tareas')}>
                          <img src={editLogo} alt="Edit"/>
                      </button>
                    <strong>Tareas: </strong>
                    <span>{SelectedCandidato[selectedRama].tareas}</span>
                    { editable && candidatoEditable === SelectedCandidato && campoEditable === 'tareas' && (
                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese texto aquí"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo(selectedRama, selectedNombreLista, SelectedCandidato[selectedRama].tareas)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        )} 
                  </li>
                  <li>
                  <button onClick={()=>handleEditable(SelectedCandidato, 'tipoDeTrabajoOtros')}>
                          <img src={editLogo} alt="Edit"/>
                      </button>
                    <strong>Tipo de trabajo otros: </strong>
                    <span>{SelectedCandidato[selectedRama].tipoDeTrabajoOtros}</span>
                    { editable && candidatoEditable === SelectedCandidato && campoEditable === 'tipoDeTrabajoOtros' && (
                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese texto aquí"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo(selectedRama, selectedNombreLista, SelectedCandidato[selectedRama].tipoDeTrabajoOtros)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        )} 
                  </li>
                  <li>
                  <button onClick={()=>handleEditable(SelectedCandidato, 'situacitipoTrabajoonLaboral')}>
                          <img src={editLogo} alt="Edit"/>
                      </button>
                    <strong>Tipo trabajo: </strong>
                    <span>{SelectedCandidato[selectedRama].situacitipoTrabajoonLaboral}</span>
                    { editable && candidatoEditable === SelectedCandidato && campoEditable === 'situacitipoTrabajoonLaboral' && (
                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese texto aquí"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo(selectedRama, selectedNombreLista, SelectedCandidato[selectedRama].situacitipoTrabajoonLaboral)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        )}
                  </li>
                  <li>
                  <button onClick={()=>handleEditable(SelectedCandidato, 'trabajoAlgunaVez')}>
                          <img src={editLogo} alt="Edit"/>
                      </button>
                    <strong>Trabajó alguna vez: </strong>
                    <span>{SelectedCandidato[selectedRama].trabajoAlgunaVez}</span>
                    { editable && candidatoEditable === SelectedCandidato && campoEditable === 'trabajoAlgunaVez' && (
                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese texto aquí"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo(selectedRama, selectedNombreLista, SelectedCandidato[selectedRama].trabajoAlgunaVez)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        )}
                  </li>
                  <li>
                  <button onClick={()=>handleEditable(SelectedCandidato, 'ultimoPuesto')}>
                          <img src={editLogo} alt="Edit"/>
                      </button>
                    <strong>Último puesto: </strong>
                    <span>{SelectedCandidato[selectedRama].ultimoPuesto}</span>
                    { editable && candidatoEditable === SelectedCandidato && campoEditable === 'ultimoPuesto' && (
                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese texto aquí"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo(selectedRama, selectedNombreLista, SelectedCandidato[selectedRama].ultimoPuesto)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                        )}
                  </li>
                  <li>
                      <strong>Motivos de desempleo: </strong>
                      <ul>
                        { 
                          SelectedCandidato[selectedRama]['motivosDesempleo'] && Object.values(SelectedCandidato[selectedRama]['motivosDesempleo']).map((item, index) => (
                            <li key={index} className='fondoAnim'>
                            <button className='eliminar' onClick={()=>eliminarDeLista(selectedRama, 'motivosDesempleo', item.id, item.motivo)}>
                                  X
                            </button>
                            <strong>{item.motivo}</strong>
                          </li>
                          ))
                        }
                        {showSelectAgregarALista &&  candidatoAgregarALista == SelectedCandidato && selectAbrir === 'motivosDesempleo' &&(
                          
                          <div >
                            <div>
                              <strong>Agregar nuevo desempleo:</strong>
                            </div>
                          
                          <select class="form-select" ref={selectRefAgregarALista}>

                              <option value="">Seleccionar...</option>
                              <option value="PROBLEMAS_CON_COMPANIERO">PROBLEMAS_CON_COMPANIERO</option>
                              <option value="HACERES_HOGAR_CUIDADOS_PERSONAS">HACERES_HOGAR_CUIDADOS_PERSONAS</option>
                              <option value="REMUNERACION_BAJA">REMUNERACION_BAJA</option>
                              <option value="SALUD">SALUD</option>
                              <option value="ACCESIBILIDAD">ACCESIBILIDAD</option>
                              <option value="DISCRIMINACION">DISCRIMINACION</option>
                              <option value="FALTA_INTERES">FALTA_INTERES</option>
                              <option value="DESPIDO_NO_RENOVACION">DESPIDO_NO_RENOVACION</option>
                            
                          </select>
                          
                          <button onClick={() => guardarAgregarALista(selectedRama, 'motivosDesempleo')}>OK</button>
                          <button onClick={handleBlurAgregarALista}>Cancelar</button>

                          
                        </div>                       
                        )}
                        {!showSelectAgregarALista && (
                        <button onClick={() => showSelectAgregar(SelectedCandidato, 'motivosDesempleo')}>Agregar</button>


                        )

                        }   
                      </ul>
                  </li>
                  <li>
                      <strong>Actitudes: </strong>
                      <ul>
                        { 
                          SelectedCandidato[selectedRama]['actitudes'] && Object.values(SelectedCandidato[selectedRama]['actitudes']).map((item, index) => (
                            <li key={index} className='fondoAnim'>
                            <button className='eliminar' onClick={()=>eliminarDeLista(selectedRama, 'actitudes', item.id, item.nombre)}>
                                  X
                            </button>
                            <strong>{item.nombre}</strong>
                          </li>
                          ))
                        }
                        {showSelectAgregarALista &&  candidatoAgregarALista == SelectedCandidato && selectAbrir === 'actitudes' &&(
                          
                          <div >
                            <div>
                              <strong>Agregar nueva actitud:</strong>
                            </div>
                          
                          <select class="form-select" ref={selectRefAgregarALista}>

                            <option value="">Seleccionar...</option>
                            <option value="Variedad de situaciones / Adaptabilidad">Variedad de situaciones / Adaptabilidad</option>
                            <option value="Responsabilidad">Responsabilidad</option>
                            <option value="Atención / Concentración">Atención / Concentración</option>
                            <option value="Relaciones interpersonales">Relaciones interpersonales</option>
                            <option value="Autonomía / Iniciativa">Autonomía / Iniciativa</option>
                            <option value="Ninguna de las anteriores">Ninguna de las anteriores</option>
                          </select>

                          
                          <button onClick={() => guardarAgregarALista(selectedRama, 'actitudes')}>OK</button>
                          <button onClick={handleBlurAgregarALista}>Cancelar</button>

                          
                        </div>                       
                        )}
                        {!showSelectAgregarALista && (
                        <button onClick={() => showSelectAgregar(SelectedCandidato, 'actitudes')}>Agregar</button>


                        )

                        }
                      </ul>
                  </li>
                  <li>
                      <strong>Gustos laborales: </strong>
                      <ul>
                        { 
                          SelectedCandidato[selectedRama]['gustosLaborales'] && Object.values(SelectedCandidato[selectedRama]['gustosLaborales']).map((item, index) => (
                            <li key={index} className='fondoAnim'>
                            <button className='eliminar' onClick={()=>eliminarDeLista(selectedRama, 'gustosLaborales', item.id, item.gusto)}>
                                  X
                            </button>
                            <strong>{item.gusto}</strong>
                          </li>
                          ))
                        }
                        {showSelectAgregarALista &&  candidatoAgregarALista == SelectedCandidato && selectAbrir === 'gustosLaborales' &&(
                          
                          <div >
                            <div>
                              <strong>Agregar nuevo gusto laboral:</strong>
                            </div>
                          
                          <select class="form-select" ref={selectRefAgregarALista}>

                            <option value="">Seleccionar...</option>
                            <option value="REMUNERACION">REMUNERACION</option>
                            <option value="CARGA_HORARIA">CARGA_HORARIA</option>
                            <option value="ACCESIBILIDAD">ACCESIBILIDAD</option>
                            <option value="TAREAS_QUE_DESEMPENIABA">TAREAS_QUE_DESEMPENIABA</option>
                            <option value="HABIA_CAFE">HABIA_CAFE</option>
                            <option value="RELACIONAMIENTO_LABORAL">RELACIONAMIENTO_LABORAL</option>
                          </select>

                          
                          <button onClick={() => guardarAgregarALista(selectedRama, 'gustosLaborales')}>OK</button>
                          <button onClick={handleBlurAgregarALista}>Cancelar</button>

                          
                        </div>                       
                        )}
                        {!showSelectAgregarALista && (
                        <button onClick={() => showSelectAgregar(SelectedCandidato, 'gustosLaborales')}>Agregar</button>


                        )

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
              <ul className='ulEditable'>
                {
                  SelectedCandidato[selectedRama] && Object.values(SelectedCandidato[selectedRama]).map((item, index) => (
                    
                      
                      <li className='fondoAnim' >
                        <section>
                          <button className="eliminar" onClick={()=>eliminarDeLista(selectedRama, selectedNombreLista, item.id, item[selectedNombreLista].nombre)}>X</button>
                          <strong>{item[selectedNombreLista].nombre}</strong>
                        </section>
                        <section>
                        <button onClick={()=>handleEditable(SelectedCandidato, item.id)}>
                          <img src={editLogo} alt="Edit"/>
                        </button>
                        <span>Nivel: {item.nivel}</span>
                        </section>
                        
                        { editable && candidatoEditable === SelectedCandidato && campoEditable === item.id && (
                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese texto aquí"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo(selectedNombreLista,selectedRama, item.id)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                    )}
                        
                      </li>
                  ))
                }
                {showSelectAgregarALista &&  candidatoAgregarALista == SelectedCandidato && selectAbrir === 'idioma' &&(
                          
                          <div >
                            <div>
                              <strong>Agregar nuevo idioma</strong>
                            </div>
                            
                          
                          <select class="form-select" ref={selectRefAgregarALista}>

                            <option value="">Seleccionar...</option>
                            
                              {idiomas.map((item, index) =>
                                <option value={item.nombre}>{item.nombre}</option>
                              )
                            }
                            
                            
                          </select>

                          
                          <button onClick={() => guardarAgregarALista(selectedRama, 'idioma')}>OK</button>
                          <button onClick={handleBlurAgregarALista}>Cancelar</button>

                          
                        </div>                       
                        )}
                        {!showSelectAgregarALista && (
                        <button onClick={() => showSelectAgregar(SelectedCandidato, 'idioma')}>Agregar</button>


                        )

                        }

              </ul>
              
            }

          </ListaPopup>
        );

      }

      if (selectedRama == 'discapacidad') {
        
        return(
          <ListaPopup show={showPopup} onHide={handleClosePopup} nombreLista={'Tipos de discapacidades'} nombreCandidato={SelectedCandidato.nombre}>
              {
                <div>
                  <ul className='ulEditable'>
                    <li>
                      <button onClick={()=>handleEditable(SelectedCandidato, 'diagnostico')}>
                          <img src={editLogo} alt="Edit"/>
                      </button>
                    <strong>Diagnóstico: </strong>
                    <span>{SelectedCandidato[selectedRama].diagnostico}</span>
                    
                    { editable && candidatoEditable === SelectedCandidato && campoEditable === 'diagnostico' && (
                          <div>
                            <Form.Control
                              type="text"
                              placeholder="Ingrese texto aquí"
                              autoFocus
                              ref={inputRef}
                              />
                            <button onClick={() => guardarCampo('', selectedRama, SelectedCandidato[selectedRama].diagnostico)}>OK</button>
                            <button onClick={handleBlur}>Cancelar</button>
                         </div>
                    )}
                    </li>
                    
                  </ul>
                  <h5>Tipos de discapacidades: </h5>
                  {
                    <ul className='ulEditable'>
                      {
                        SelectedCandidato[selectedRama][selectedNombreLista] && Object.values(SelectedCandidato[selectedRama][selectedNombreLista]).map((item, index) => (   
                          <li className='fondoAnim' key={index}>
                            <button onClick={()=>handleEditable(SelectedCandidato, item.id)}>
                              <img src={editLogo} alt="Edit"/>
                            </button>
                            <button className="eliminar" onClick={()=>eliminarDeLista(selectedRama, selectedNombreLista, item.id, item.nombre)}>X</button>
                            <strong>{item.nombre}:</strong>
                            <span>{item.descripcion}</span>
                          </li>
                            ))
                      }
                      {showSelectAgregarALista &&  candidatoAgregarALista == SelectedCandidato && selectAbrir === selectedNombreLista &&(
                          
                          <div >
                            <div>
                              <strong>Agregar nuevo tipo de discapacidad: </strong>
                            </div>
                          
                          <select class="form-select" ref={selectRefAgregarALista}>

                            <option value="">Seleccionar...</option>
                            <option value="PSIQUICA">PSIQUICA</option>
                            <option value="VER">VER</option>
                            <option value="VISCERAL">VISCERAL</option>
                            <option value="OIR">OIR</option>
                            <option value="FISICO-MOTORAS">FISICO-MOTORAS</option>
                            <option value="INTELECTUAL">INTELECTUAL</option>
                          </select>


                          
                          <button onClick={() => guardarAgregarALista(selectedRama, selectedNombreLista)}>OK</button>
                          <button onClick={handleBlurAgregarALista}>Cancelar</button>

                          
                        </div>                       
                        )}
                        {!showSelectAgregarALista && (
                        <button onClick={() => showSelectAgregar(SelectedCandidato, selectedNombreLista)}>Agregar</button>


                        )

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
    
    
    
    return (
      <Modal show = {show} onHide={onHide} dialogClassName="custom-modal">
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
          <option value="mayores a">Mayor o igual a [edad]</option>
          <option value="menores a">Menor o igual a [edad]</option>
          <option value="departamento">Departamento</option>
          <option value="libreta_Conducir">Libreta de conducir</option>
          <option value="idioma">Idioma</option>
          <option value="nivel_Educativo">Nivel educativo</option>
          <option value="tipo_discapicidad">Tipo de discapacidad</option>
          <option value="documento">Documento</option>
          <option value="Registro Nacional de Persona con Discapacidad">Registro Nacional de Persona con Discapacidad</option>
          <option value="Area">Área</option>
          <option value="Apoyo">Apoyo</option>
          <option value="Habilidad">Habilidad</option>
          <option value="Turno">Turno</option>
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
          <input className = "inputText" type='text' value={subFiltro} onChange={manejarCambioSubFiltro}/>
        )}
        {nuevoFiltro === 'idioma' && (
          <select value={subFiltro} onChange={manejarCambioSubFiltro}>
            <option value="">Seleccionar Idioma...</option>
            {idiomas.map((item, index) =>
                <option value={item.nombre}>{item.nombre}</option>
              )
            }
          </select>
        )}
        {nuevoFiltro === 'nivel_Educativo' && (
          <select value={subFiltro} onChange={manejarCambioSubFiltro}>
            <option value="">Seleccionar un nivel...</option>
            <option value="SIN_INSTRUCCION">SIN INSTRUCCION</option>
            <option value="PREESCOLAR">PREESCOLAR</option>
            <option value="PRIMARIA_INCOMPLETA">PRIMARIA INCOMPLETA</option>
            <option value="PRIMARIA_COMPLETA">PRIMARIA COMPLETA</option>
            <option value="CICLO_BASICO_INCOMPLETO">CICLO BASICO INCOMPLETO</option>
            <option value="CICLO_BASICO_COMPLETO">CICLO BASICO COMPLETO</option>
            <option value="BACHILLERATO_INCOMPLETO">BACHILLERATO INCOMPLETO</option>
            <option value="BACHILLERATO_COMPLETO">BACHILLERATO COMPLETO</option>
            <option value="EDUCACION_TECNICA_INCOMPLETA">EDUCACION TECNICA INCOMPLETA</option>
            <option value="EDUCACION_TECNICA_COMPLETA">EDUCACION TECNICA COMPLETA</option>
            <option value="EDUCACION_MILITAR_INCOMPLETA">EDUCACION MILITAR INCOMPLETA</option>
            <option value="EDUCACION_MILITAR_COMPLETA">EDUCACION MILITAR COMPLETA</option>
            <option value="EDUCACION_POLICIAL_INCOMPLETA">EDUCACION POLICIAL INCOMPLETA</option>
            <option value="EDUCACION_POLICIAL_COMPLETA">EDUCACION POLICIAL COMPLETA</option>
            <option value="TERCIARIA_NO_UNIVERSITARIA_INCOMPLETA">TERCIARIA NO UNIVERSITARIA INCOMPLETA</option>
            <option value="TERCIARIA_NO_UNIVERSITARIA_COMPLETA">TERCIARIA NO UNIVERSITARIA COMPLETA</option>
            <option value="UNIVERSIDAD_O_SIMILAR_INCOMPLETA">UNIVERSIDAD O SIMILAR INCOMPLETA</option>
            <option value="UNIVERSIDAD_O_SIMILAR_COMPLETA">UNIVERSIDAD O SIMILAR COMPLETA</option>
          </select>
        )}
        {nuevoFiltro === 'departamento' && (
          <select value={subFiltro} onChange={manejarCambioSubFiltro}>
            <option value="">Seleccionar Departamento...</option>
            <option value="Artigas">Artigas</option>
            <option value="Canelones">Canelones</option>
            <option value="Cerro Largo">Cerro Largo</option>
            <option value="Colonia">Colonia</option>
            <option value="Durazno">Durazno</option>
            <option value="Flores">Flores</option>
            <option value="Florida">Florida</option>
            <option value="Lavalleja">Lavalleja</option>
            <option value="Maldonado">Maldonado</option>
            <option value="Montevideo">Montevideo</option>
            <option value="Paysandu">Paysandú</option>
            <option value="Río Negro">Río Negro</option>
            <option value="Rivera">Rivera</option>
            <option value="Rocha">Rocha</option>
            <option value="Salto">Salto</option>
            <option value="San José">San José</option>
            <option value="Soriano">Soriano</option>
            <option value="Tacuarembo">Tacuarembó</option>
            <option value="Treinta y Tres">Treinta y Tres</option>
          </select>
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
          <button className='buttonEnviar' onClick={obtenerCandidados}>Obtener Candidatos</button>
        <div>
        
      <div className="result">
        {/* ... */}
        <h4>Resultados</h4>

    <table>
          <thead>
              <tr>
                {showAddButton && <th>Agregar</th>}
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Documento</th>
                  <th>Documento tipo</th>
                  <th>Nacimiento</th>
                  <th>Sexo</th>
                  <th>Tipo de discapacidad</th>
                  <th>Acciones</th>
              </tr>
          </thead>
          <tbody>
              {candidatos.map((candidato) => (
                  <tr key={candidato.id}>
                        {showAddButton && (
                          <td>
                              <button className='button-add-candidate' onClick={() => handleSelectCandidate(candidato)}>
                                  Agregar
                              </button>
                          </td>
                      )}
                      <td>{candidato.nombre}</td>
                      <td>{candidato.apellido}</td>
                      <td onClick={() => handleCIClick(candidato.id, candidato.nombre, candidato.apellido, candidato.documento)} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>
                          {candidato.documento}
                      </td>
                      <td>{candidato.tipoDocumento}</td>
                      <td>{candidato.fecha_de_nacimiento}</td>
                      <td>{candidato.sexo}</td>
                      <td>{candidato.discapacidad.tipoDiscapacidades ?.map((tipo) => tipo.nombre) .join(', ')} </td>
                      
                      <td>
                          <span className="masDetalles" onClick={() => handleSelectShow(candidato)}>Más detalles</span>
                          {showSelect && selectedCandidadoCombo === candidato.id && (
                            <div className="selectContainer">
                              <select className="selectDropdown" onChange={(e) => handleShowPopup(e, candidato)}>
                                  <option value="">Seleccionar...</option>
                                  <option value="|datosPrincipalesCandidato">Datos Principales</option>
                                  <option value="|apoyos">Apoyos</option>
                                  <option value="|ayudaTecnicas">Ayudas Técnicas</option>
                                  <option value="experienciaLaboral|">Experiencia Laboral</option>
                                  <option value="|areas">Áreas</option>
                                  <option value="|prestaciones">Prestaciones</option>
                                  <option value="discapacidad|tipoDiscapacidades">Discapacidades</option>
                                  <option value="|datosAdicionalesCandidato">Datos Adicionales</option>
                                  <option value="candidatoIdiomas|idioma">Idiomas</option>
                                  <option value="|direccion">Dirección</option>
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
      <div>
      {isConfirming &&(
        <ConfirmPopUp 
            show={isConfirming} 
            onHide={handleCancel}
            eliminar={handleConfirm}
            nombreEliminar={nombreAEliminar}>
          
        </ConfirmPopUp>
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
