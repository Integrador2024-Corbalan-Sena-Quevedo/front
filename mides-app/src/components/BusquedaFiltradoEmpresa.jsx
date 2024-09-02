import React, { useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.css'
import '../styles/TableMatch.css'
import '../styles/BusquedaConFiltros.css';
import { Modal, Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';

import editLogo from "../img/edit.png"
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


const BusquedaConFiltrosEmpleos = () => {
  const [filtros, setFiltros] = useState([]);
  const [nuevoFiltro, setNuevoFiltro] = useState('');
  const [subFiltro, setSubFiltro] = useState('');
  const [empleos, setEmpelos] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [selectedSubLista, setselectedSubLista] = useState('');
  const [selectedEmpleo, setSelectedEmpleo] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showSelect, setShowSelect] = useState(false);
  const [editable, setEditable] = useState(false);
  const [campoEditable, setCampoEditable] = useState('');
  const [selectedEmpleoCombo, setSelectedEmpleoCombo] = useState(-1);
  const [selectedEmpresa, setSelectedEmpresa] = useState(null);
  const [selectedLista, setSelectedLista] = useState('');
  const [empresaEditable, setEmpresaEditable] = useState(null);
  const [showAgregarALista, setShowAgregarALista] = useState(false);
  const [empresaAgregarALista, setEmpresaAgregarALista] = useState(null);
  const [abrirAgregarALista, setAbrirAgregarALista] = useState('');

  const [messageFetchCandidato, setMessageFetchCandidato] =  useState('');
  const token = localStorage.getItem('token');
  const usuario = localStorage.getItem('user');

  const inputRef = useRef(null);

  const [idAEliminar, setIdAEliminar] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false); 
  const [estadoSelect, setEstadoSelect]= useState(null);
  const [nombreAEliminar, setNombreAEliminar]= useState(null);
  const [selectedListaElim, setSelectedListaElim] = useState('');
  const [selectedSubListaElim, setSelectedSubListaElim] = useState('');
  const [posAElim, setPosAElim] = useState(null);



  const eliminarDeLista = async (lista, sublista, idAEliminar, nombreAEliminar, pos) => {
    
    setIdAEliminar(idAEliminar);
    setNombreAEliminar(nombreAEliminar);
    setSelectedListaElim(lista);
    setSelectedSubListaElim(sublista);
    setPosAElim(pos);
    setIsConfirming(true); 
    
    
  };

  const handleConfirm = async () => {
    setIsConfirming(false); 
    const response = await eliminarDatoLista(`${selectedEmpresa.id}`,`${selectedEmpleo.id}`,  selectedListaElim, selectedSubListaElim, `${idAEliminar}`, nombreAEliminar, `${posAElim}`);
    handleBlur();
    if (response.status != 200) {
      alert('Error al eliminar');
    } else {
      alert('Eliminado correctamente');
      actualizarLista(selectedEmpresa.id, "Eliminacion-Agregacion", selectedSubListaElim);
      
    }

     
  };

  const handleCancel = () => {
    setIsConfirming(false);

  };

  const ConfirmPopUp = ({show, onHide, eliminar, selectedSubLista}) => {
    
    return (
      <Modal show = {show} onHide={onHide}>
        <Modal.Header closeButton className='modalHeder'>
        <Modal.Title className='titulosListas'>Eliminar un {selectedSubLista}</Modal.Title>
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

  const showSelectAgregar = (candidato, selectAbrir)=>{
    setShowAgregarALista(true);
    setEmpresaAgregarALista(candidato);
    setAbrirAgregarALista(selectAbrir);
  }

  const handleBlurAgregarALista = () => {
    setShowAgregarALista(false);
    setEmpresaAgregarALista(null);
    setAbrirAgregarALista('');

  }




  const handleEditable = (empresa, campo) => {
    
    setEditable(true);
    setEmpresaEditable(empresa);
    setCampoEditable(campo);
  }

  const eliminarDatoLista = async (empresaId, empleoId, lista, subLista, idAEliminar, nombreAEliminar, posAElim) => {

    
    try {
      const response = await fetch(`http://midesuy-env.eba-bjxi9i8c.us-east-1.elasticbeanstalk.com/actualizar/eliminarSubListaEmpresa`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({empresaId:empresaId,empleoId:empleoId, userName:usuario, lista:lista, subLista:subLista, id:idAEliminar, nombreAEliminar:nombreAEliminar, posAElim:posAElim})
      });

      return response;
  
    } catch (error) {
      console.error('Error:', error);
      return error;
    }
  };

  

  const actualizarCampo = async (empresaId, empleoId, campo, datoAct, datoAnt, lista, subLista) => {
    try {

      

      
      const response = await fetch(`http://midesuy-env.eba-bjxi9i8c.us-east-1.elasticbeanstalk.com/actualizar/empresa`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({empresaId:empresaId, empleoId:empleoId, userName:usuario, campo:campo, datoAct:datoAct, datoAnt:datoAnt, lista:lista, subLista:subLista})
      });

      if (!response.ok) {
        throw new Error('Error al actualizar');
      }
      setMessageFetchCandidato('Actulizacion existosa');

      return response;
    } catch (error) {
      console.error('Error:', error);
      setMessageFetchCandidato('Error al actualizar');
      return response;
    }
  };

  const guardarCampo = async (lista, subLista, datoAnt) =>{
    
    const nuevoValor = inputRef.current.value;
    
    
    const response = await actualizarCampo(`${selectedEmpresa.id}`, `${selectedEmpleo.id}`, campoEditable, nuevoValor, datoAnt, lista, subLista);
    alert(messageFetchCandidato);
    
    handleBlur();
    
    actualizarLista(nuevoValor, lista, subLista);
    setShowPopup(true);
    
  }

  const agregarALista = async (empresaId, empleoId, lista, subLista, id) => {
    try {
      const response = await fetch(`http://midesuy-env.eba-bjxi9i8c.us-east-1.elasticbeanstalk.com/actualizar/agregarASubListaEmpresa`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({empresaId:empresaId, empleoId:empleoId, userName:usuario, lista:lista, subLista:subLista, id:id}), 
      });

      return response;

    } catch (error) {
      console.error('Error al agregar', error);
      return error
    }
  };

  const guardarAgregarALista = async (lista, subLista) => {
    const nuevoValor = inputRef.current.value;

      

      
    const response = await agregarALista(`${empresaAgregarALista.id}`,`${selectedEmpleo.id}`, lista, subLista, nuevoValor);
    handleBlur();
    handleBlurAgregarALista();
    if (!response.ok) {
      alert('Error al agregar');
    }else{
      alert('Agregado correctamente');
      actualizarLista(empresaAgregarALista.id, "Eliminacion-Agregacion", subLista);
      //setShowPopup(true);
    }
  }

  const actualizarUnaEmpresa = async (empresaId) => {
    
    try {
      const response = await fetch(`http://midesuy-env.eba-bjxi9i8c.us-east-1.elasticbeanstalk.com/filtro/unaEmpresa`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(empresaId), 
      });
      if (!response.ok) {
        throw new Error('Error al obtener empresa');
      }
      const candidato = await response.json();
      return candidato;
    } catch (error) {
      console.error('Error al obtener la empresa', error);
    }


    
  }

  const actualizarLista = async (nuevoValor, lista, subLista) =>{
    let empresaActualizado = null;
    let empleoActualizado = null;

    

    if (lista == "Eliminacion-Agregacion") {
      const respuesta = await actualizarUnaEmpresa(nuevoValor);

      empresaActualizado = {
        ...respuesta
      }

      empleoActualizado = empresaActualizado["empleo"].find((item) => item.id === selectedEmpleo.id);

      
    }else{
      if (lista == "" && subLista == "") {
        
        empresaActualizado = {
          ...selectedEmpresa, 
          [campoEditable] : nuevoValor,
        };
      }else{
        
        if (lista != "" && subLista == "") {
          if (lista == "empleo") {
            
            empresaActualizado = {
              ...selectedEmpresa, 
              [lista]: selectedEmpresa[lista].map((item, index)=>
                item.id === selectedEmpleo.id ? {...item, 
                  [campoEditable] : nuevoValor
                } : item
              )
            };
            empleoActualizado = empresaActualizado[lista].find((item) => item.id === selectedEmpleo.id);
            
          }else{
            
            if(lista == 'telefonos'){
              empresaActualizado = {
                ...selectedEmpresa,
                [lista]: 
                  selectedEmpresa[lista].map((item, index) => 
                    index === 0 ? { ...item, [campoEditable]: nuevoValor } : item
                  )
                }
            }else{
              empresaActualizado = {
                ...selectedEmpresa,
                [lista]: {
                  ...selectedEmpresa[lista],
                  [campoEditable]: nuevoValor,
                }
              };
            }
          }
        }else{
          
          if(subLista == "conocimientosEspecificosEmpleo"){
            empresaActualizado = {
              ...selectedEmpresa, 
              [lista]: 
              selectedEmpresa[lista].map((item, index)=>
                item.id === selectedEmpleo.id ? {...item,
                  [subLista]: {
                    ...item[subLista],
                    [campoEditable] :nuevoValor,
                  }
                } : item
              )
            };
            empleoActualizado = empresaActualizado[lista].find((item) => item.id === selectedEmpleo.id);
          }else{
            
              const partes = campoEditable.split("-");
              const largo = partes.length;
            if (subLista == "tareas") {
              
              
  
              
  
              if (lista == "empleo" && subLista == "tareas") {
                
                
                const indexpos = partes[0];
                const nombreCampo = partes[1];
  
                const indexPos = Number(indexpos);
              
  
                
                empresaActualizado = {
                  ...selectedEmpresa, 
                  [lista]: 
                    selectedEmpresa[lista].map((item, index) =>
                      item.id === selectedEmpleo.id ? {
                        ...item,
                        [subLista]: item[subLista].map((item2, index2) =>
                          indexPos === index2 ? {
                            ...item2,
                            [nombreCampo]: nuevoValor
                          } : item2
                        )
                      } : item
                    )
                };
                empleoActualizado = empresaActualizado[lista].find((item) => item.id === selectedEmpleo.id);
                
              }
              
            }else{
              
                if (lista == "tareas" && subLista == "detalleTarea") {
                   
                  
  
                  const posTarea = partes[0];
                  const posdetalle = partes[1];
                  const idDetalle = partes[2];
  
                  const postarea = Number(posTarea);
                  const posDetalle = Number(posdetalle);
  
  
                  
  
                  empresaActualizado = {
                    ...selectedEmpresa, 
                    ["empleo"]: 
                      selectedEmpresa["empleo"].map((item, index) =>
                        item.id === selectedEmpleo.id ? {
                          ...item,
                          [lista]: item[lista].map((item2, index2) =>
                            postarea === index2 ? {
                              ...item2,
                              [subLista] : item2[subLista].map((item3, index3)=>
                                posDetalle === index3 ? {
                                  ...item3,
                                  ["detalle"] : nuevoValor
                                } : item3
                              )
                            } : item2
                          )
                        } : item
                      )
                  };
                  empleoActualizado = empresaActualizado["empleo"].find((item) => item.id === selectedEmpleo.id);
                  
                }
            }
          }
            
        }
      }

    }

    




    
    
    const listaActualizada = empresas.map(empresa =>
      empresa === selectedEmpresa ? empresaActualizado : empresa
    );

    
    
    setSelectedEmpresa(empresaActualizado);
    setEmpresas(listaActualizada); 
    if (empleoActualizado != null) {
      setSelectedEmpleo(empleoActualizado);
      const todosLosEmpleos = listaActualizada.flatMap(empresa => empresa.empleo);
      setEmpelos(todosLosEmpleos);
    }
    
    
    
  }

  


  const handleBlur = () => {
    
    setEditable(false);
    setEmpresaEditable(null);
    setCampoEditable("");
  }

  
  const handleSelectShow = (empleo) => {
    setShowSelect(true);
    setSelectedEmpleoCombo(empleo.id);
    encontrarEmpresa(empleo);
  };

  const encontrarEmpresa = (empleo) => {

    for(const empresa of empresas){
      const empresaEncontrada = empresa.empleo.find(emp => emp.id === empleo.id);
      if (empresaEncontrada) {
        setSelectedEmpresa(empresa);
        break;
      }
    }
  }

  const handleShowPopup = (e, empleo) => {
      const [lista, subLista] = e.target.value.split('|');
      setShowPopup(true);
      setSelectedLista(lista);
      setselectedSubLista(subLista);
      setSelectedEmpleo(empleo);
      setEstadoSelect(e);
    };
  
      const handleClosePopup = () => {
      setShowPopup(false);
      setShowSelect(false);
     };

     const handleCandidato = (candidato) => {
      setselectedEmpleo(candidato);
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
   

    
    fetch('http://midesuy-env.eba-bjxi9i8c.us-east-1.elasticbeanstalk.com/filtro/empleos', {
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
         
         const todosLosEmpleos = resultados.flatMap(empresa => empresa.empleo);

         setEmpelos(todosLosEmpleos);

         setEmpresas(resultados);
   })
    .catch(error => {
      console.error('Error:', error);
    });
  };

  const mostrarEstructura = () => {


    if(selectedEmpleo && selectedEmpresa){

      if (selectedLista == "" && selectedSubLista == "") {

        return(
          <ListaPopup show={showPopup} onHide={handleClosePopup} nombreLista={"Datos principales de Empresa para el empleo"} nombreEmpleo={selectedEmpleo.nombrePuesto}>
            {
              <div>
                {
                  <ul className='ulEditable'>
                    <li>
                    <button onClick={()=>handleEditable(selectedEmpresa, 'nombre')}>
                      <img src={editLogo} alt="Edit"/>
                    </button>
                      <strong>Nombre: </strong>
                      <span>{selectedEmpresa.nombre}</span>
                      { editable && empresaEditable === selectedEmpresa && campoEditable === 'nombre' && (

                              <div>
                                <Form.Control
                                 type="text"
                                  placeholder="Ingrese un nuevo valor"
                                  autoFocus
                                  ref={inputRef}
                                  />
                                <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpresa.nombre)}>OK</button>
                                <button onClick={handleBlur}>Cancelar</button>
                              </div>
                        )}
                    </li>
                    <li>
                    <button onClick={()=>handleEditable(selectedEmpresa, 'ramaEconomica')}>
                      <img src={editLogo} alt="Edit"/>
                    </button>
                      <strong>Rama Económica: </strong>
                      <span>{selectedEmpresa.ramaEconomica}</span>
                      { editable && empresaEditable === selectedEmpresa && campoEditable === 'ramaEconomica' && (

                              <div>
                                <Form.Control
                                 type="text"
                                  placeholder="Ingrese un nuevo valor"
                                  autoFocus
                                  ref={inputRef}
                                  />
                                <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpresa.ramaEconomica)}>OK</button>
                                <button onClick={handleBlur}>Cancelar</button>
                              </div>
                        )}
                    </li>
                    <li>
                    <button onClick={()=>handleEditable(selectedEmpresa, 'rut')}>
                      <img src={editLogo} alt="Edit"/>
                    </button>
                      <strong>Rut: </strong>
                      <span>{selectedEmpresa.rut}</span>
                      { editable && empresaEditable === selectedEmpresa && campoEditable === 'rut' && (

                              <div>
                                <Form.Control
                                 type="text"
                                  placeholder="Ingrese un nuevo valor"
                                  autoFocus
                                  ref={inputRef}
                                  />
                                <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpresa.rut)}>OK</button>
                                <button onClick={handleBlur}>Cancelar</button>
                              </div>
                        )}
                    </li>
                    <li>
                    <button onClick={()=>handleEditable(selectedEmpresa, 'personaReferencia')}>
                      <img src={editLogo} alt="Edit"/>
                    </button>
                      <strong>Persona de referencia: </strong>
                      <span>{selectedEmpresa.personaReferencia}</span>
                      { editable && empresaEditable === selectedEmpresa && campoEditable === 'personaReferencia' && (

                              <div>
                                <Form.Control
                                 type="text"
                                  placeholder="Ingrese un nuevo valor"
                                  autoFocus
                                  ref={inputRef}
                                  />
                                <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpresa.personaReferencia)}>OK</button>
                                <button onClick={handleBlur}>Cancelar</button>
                              </div>
                        )}
                    </li>
                    <li>
                    <button onClick={()=>handleEditable(selectedEmpresa, 'cvsEnviados')}>
                      <img src={editLogo} alt="Edit"/>
                    </button>
                      <strong>CVS Enviados: </strong>
                      <span>{selectedEmpresa.cvsEnviados}</span>
                      { editable && empresaEditable === selectedEmpresa && campoEditable === 'cvsEnviados' && (

                              <div>
                                <Form.Control
                                 type="text"
                                  placeholder="Ingrese un nuevo valor"
                                  autoFocus
                                  ref={inputRef}
                                  />
                                <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpresa.cvsEnviados)}>OK</button>
                                <button onClick={handleBlur}>Cancelar</button>
                              </div>
                        )}
                    </li>
                    <li>
                    <button onClick={()=>handleEditable(selectedEmpresa, 'actividadEconomica')}>
                      <img src={editLogo} alt="Edit"/>
                    </button>
                      <strong>Actividad Economica: </strong>
                      <span>{selectedEmpresa.actividadEconomica}</span>
                      { editable && empresaEditable === selectedEmpresa && campoEditable === 'actividadEconomica' && (

                              <div>
                                <Form.Control
                                 type="text"
                                  placeholder="Ingrese un nuevo valor"
                                  autoFocus
                                  ref={inputRef}
                                  />
                                <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpresa.actividadEconomica)}>OK</button>
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
      }else{

        if (selectedLista != "" && selectedSubLista == "") {
          switch (selectedLista) {

            case "datosAdicionalesEmpresa":
              return(
                <ListaPopup show={showPopup} onHide={handleClosePopup} nombreLista={'Datos adicionales de empresa para el empleo'} nombreEmpleo={selectedEmpleo.nombrePuesto}>
                  {
                    <div>
                      {
                        <ul className='ulEditable'>
                          <li>
                          <button onClick={()=>handleEditable(selectedEmpresa, 'empleadosContratadosConDiscapacidad')}>
                            <img src={editLogo} alt="Edit"/>
                          </button>
                            <strong>Empleados contratados con discapacidad: </strong>
                            <span>{selectedEmpresa[selectedLista].empleadosContratadosConDiscapacidad}</span>
                            { editable && empresaEditable === selectedEmpresa && campoEditable === 'empleadosContratadosConDiscapacidad' && (

                              <div>
                                <Form.Control
                                 type="text"
                                  placeholder="Ingrese un nuevo valor"
                                  autoFocus
                                  ref={inputRef}
                                  />
                                <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpresa[selectedLista].empleadosContratadosConDiscapacidad)}>OK</button>
                                <button onClick={handleBlur}>Cancelar</button>
                              </div>
                              )}
                          </li>
                          <li>
                          <button onClick={()=>handleEditable(selectedEmpresa, 'empresaDesierta')}>
                            <img src={editLogo} alt="Edit"/>
                          </button>
                            <strong>Empresa desierta: </strong>
                            <span>{selectedEmpresa[selectedLista].empresaDesierta}</span>
                            { editable && empresaEditable === selectedEmpresa && campoEditable === 'empresaDesierta' && (

                              <div>
                                <Form.Control
                                 type="text"
                                  placeholder="Ingrese un nuevo valor"
                                  autoFocus
                                  ref={inputRef}
                                  />
                                <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpresa[selectedLista].empresaDesierta)}>OK</button>
                                <button onClick={handleBlur}>Cancelar</button>
                              </div>
                              )}
                          </li>
                          <li>
                          <button onClick={()=>handleEditable(selectedEmpresa, 'empresaSinRespuesta')}>
                            <img src={editLogo} alt="Edit"/>
                          </button>
                            <strong>Empresa sin respuesta: </strong>
                            <span>{selectedEmpresa[selectedLista].empresaSinRespuesta}</span>
                            { editable && empresaEditable === selectedEmpresa && campoEditable === 'empresaSinRespuesta' && (

                              <div>
                                <Form.Control
                                 type="text"
                                  placeholder="Ingrese un nuevo valor"
                                  autoFocus
                                  ref={inputRef}
                                  />
                                <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpresa[selectedLista].empresaSinRespuesta)}>OK</button>
                                <button onClick={handleBlur}>Cancelar</button>
                              </div>
                              )}

                          </li>
                          <li>
                          <button onClick={()=>handleEditable(selectedEmpresa, 'fechaRespuesta')}>
                            <img src={editLogo} alt="Edit"/>
                          </button>
                            <strong>Fecha respuesta: </strong> 
                            <span>{selectedEmpresa[selectedLista].fechaRespuesta != null ? `${selectedEmpresa[selectedLista].fechaRespuesta[2]}/${selectedEmpresa[selectedLista].fechaRespuesta[1]}/${selectedEmpresa[selectedLista].fechaRespuesta[0]}` : ""} </span>
                            { editable && empresaEditable === selectedEmpresa && campoEditable === 'fechaRespuesta' && (

                              <div>
                                <Form.Control
                                 type="date"
                                  placeholder="Ingrese un nuevo valor"
                                  autoFocus
                                  ref={inputRef}
                                  />
                                <button onClick={() => guardarCampo(selectedLista, selectedSubLista, '')}>OK</button>
                                <button onClick={handleBlur}>Cancelar</button>
                              </div>
                              )}  
                          </li>
                          <li>
                          <button onClick={()=>handleEditable(selectedEmpresa, 'tuvoEmpleadosConDiscapacidad')}>
                            <img src={editLogo} alt="Edit"/>
                          </button>
                            <strong>Tuvo empleados con discapacidad: </strong>
                            <span>{selectedEmpresa[selectedLista].tuvoEmpleadosConDiscapacidad}</span>
                            { editable && empresaEditable === selectedEmpresa && campoEditable === 'tuvoEmpleadosConDiscapacidad' && (

                              <div>
                                <Form.Control
                                 type="text"
                                  placeholder="Ingrese un nuevo valor"
                                  autoFocus
                                  ref={inputRef}
                                  />
                                <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpresa[selectedLista].tuvoEmpleadosConDiscapacidad)}>OK</button>
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
              break;
            case "direccion":
              return(
                <ListaPopup show={showPopup} onHide={handleClosePopup} nombreLista={'Dirección de empresa para el empleo'} nombreEmpleo={selectedEmpleo.nombrePuesto}>
                  {
                    <div>
                      {
                        <ul className='ulEditable'>
                          <li>
                          <button onClick={()=>handleEditable(selectedEmpresa, 'apartamento')}>
                            <img src={editLogo} alt="Edit"/>
                          </button>
                            <strong>Apartamento: </strong>
                            <span>{selectedEmpresa[selectedLista].apartamento}</span>
                            { editable && empresaEditable === selectedEmpresa && campoEditable === 'apartamento' && (

                              <div>
                                <Form.Control
                                 type="text"
                                  placeholder="Ingrese un nuevo valor"
                                  autoFocus
                                  ref={inputRef}
                                  />
                                <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpresa[selectedLista].apartamento)}>OK</button>
                                <button onClick={handleBlur}>Cancelar</button>
                              </div>
                              )}
                          </li>
                          <li>
                          <button onClick={()=>handleEditable(selectedEmpresa, 'numeroPuerta')}>
                            <img src={editLogo} alt="Edit"/>
                          </button>
                            <strong>Número de puerta: </strong> 
                            <span>{selectedEmpresa[selectedLista].numeroPuerta} </span> 
                            { editable && empresaEditable === selectedEmpresa && campoEditable === 'numeroPuerta' && (

                              <div>
                                <Form.Control
                                 type="text"
                                  placeholder="Ingrese un nuevo valor"
                                  autoFocus
                                  ref={inputRef}
                                  />
                                <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpresa[selectedLista].numeroPuerta)}>OK</button>
                                <button onClick={handleBlur}>Cancelar</button>
                              </div>
                              )} 
                          </li>
                          <li>
                          <button onClick={()=>handleEditable(selectedEmpresa, 'calle')}>
                            <img src={editLogo} alt="Edit"/>
                          </button>
                            <strong>Calle: </strong>
                            <span>{selectedEmpresa[selectedLista].calle}</span>
                            { editable && empresaEditable === selectedEmpresa && campoEditable === 'calle' && (

                              <div>
                                <Form.Control
                                 type="text"
                                  placeholder="Ingrese un nuevo valor"
                                  autoFocus
                                  ref={inputRef}
                                  />
                                <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpresa[selectedLista].calle)}>OK</button>
                                <button onClick={handleBlur}>Cancelar</button>
                              </div>
                              )} 
                          </li>
                          <li>
                          <button onClick={()=>handleEditable(selectedEmpresa, 'esquinaUno')}>
                            <img src={editLogo} alt="Edit"/>
                          </button>
                            <strong>Esquina uno: </strong> 
                            <span>{selectedEmpresa[selectedLista].esquinaUno} </span> 
                            { editable && empresaEditable === selectedEmpresa && campoEditable === 'esquinaUno' && (

                              <div>
                                <Form.Control
                                 type="text"
                                  placeholder="Ingrese un nuevo valor"
                                  autoFocus
                                  ref={inputRef}
                                  />
                                <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpresa[selectedLista].esquinaUno)}>OK</button>
                                <button onClick={handleBlur}>Cancelar</button>
                              </div>
                              )}  
                          </li>
                          <li>
                          <button onClick={()=>handleEditable(selectedEmpresa, 'calleIncluida')}>
                            <img src={editLogo} alt="Edit"/>
                          </button>
                            <strong>Calle incluida: </strong>
                            <span>{selectedEmpresa[selectedLista].calleIncluida}</span>
                            { editable && empresaEditable === selectedEmpresa && campoEditable === 'calleIncluida' && (

                              <div>
                                <Form.Control
                                 type="text"
                                  placeholder="Ingrese un nuevo valor"
                                  autoFocus
                                  ref={inputRef}
                                  />
                                <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpresa[selectedLista].calleIncluida)}>OK</button>
                                <button onClick={handleBlur}>Cancelar</button>
                              </div>
                              )} 

                          </li>
                          <li>
                          <button onClick={()=>handleEditable(selectedEmpresa, 'esquinaDos')}>
                            <img src={editLogo} alt="Edit"/>
                          </button>
                            <strong>Esquina dos: </strong>
                            <span>{selectedEmpresa[selectedLista].esquinaDos}</span>
                            { editable && empresaEditable === selectedEmpresa && campoEditable === 'esquinaDos' && (

                              <div>
                                <Form.Control
                                 type="text"
                                  placeholder="Ingrese un nuevo valor"
                                  autoFocus
                                  ref={inputRef}
                                  />
                                <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpresa[selectedLista].esquinaDos)}>OK</button>
                                <button onClick={handleBlur}>Cancelar</button>
                              </div>
                              )} 
                          </li>
                          <li>
                          <button onClick={()=>handleEditable(selectedEmpresa, 'departamento')}>
                            <img src={editLogo} alt="Edit"/>
                          </button>
                            <strong>Departamento: </strong>
                            <span>{selectedEmpresa[selectedLista].departamento}</span>
                            { editable && empresaEditable === selectedEmpresa && campoEditable === 'departamento' && (

                              <div>
                                <Form.Control
                                 type="text"
                                  placeholder="Ingrese un nuevo valor"
                                  autoFocus
                                  ref={inputRef}
                                  />
                                <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpresa[selectedLista].departamento)}>OK</button>
                                <button onClick={handleBlur}>Cancelar</button>
                              </div>
                              )} 
                          </li>
                          <li>
                          <button onClick={()=>handleEditable(selectedEmpresa, 'localidad')}>
                            <img src={editLogo} alt="Edit"/>
                          </button>
                            <strong>Localidad: </strong> 
                            <span>{selectedEmpresa[selectedLista].localidad} </span> 
                            { editable && empresaEditable === selectedEmpresa && campoEditable === 'localidad' && (

                              <div>
                                <Form.Control
                                 type="text"
                                  placeholder="Ingrese un nuevo valor"
                                  autoFocus
                                  ref={inputRef}
                                  />
                                <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpresa[selectedLista].localidad)}>OK</button>
                                <button onClick={handleBlur}>Cancelar</button>
                              </div>
                              )}  
                          </li>
                          <li>
                          <button onClick={()=>handleEditable(selectedEmpresa, 'kilometro')}>
                            <img src={editLogo} alt="Edit"/>
                          </button>
                            <strong>Kilometro: </strong> 
                            <span>{selectedEmpresa[selectedLista].kilometro} </span>  
                            { editable && empresaEditable === selectedEmpresa && campoEditable === 'kilometro' && (

                              <div>
                                <Form.Control
                                 type="text"
                                  placeholder="Ingrese un nuevo valor"
                                  autoFocus
                                  ref={inputRef}
                                  />
                                <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpresa[selectedLista].kilometro)}>OK</button>
                                <button onClick={handleBlur}>Cancelar</button>
                              </div>
                              )} 
                          </li>
                          <li>
                          <button onClick={()=>handleEditable(selectedEmpresa, 'observacionesDireccion')}>
                            <img src={editLogo} alt="Edit"/>
                          </button>
                            <strong>Observaciones dirección: </strong> 
                            <span>{selectedEmpresa[selectedLista].observacionesDireccion} </span> 
                            { editable && empresaEditable === selectedEmpresa && campoEditable === 'observacionesDireccion' && (

                              <div>
                                <Form.Control
                                 type="text"
                                  placeholder="Ingrese un nuevo valor"
                                  autoFocus
                                  ref={inputRef}
                                  />
                                <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpresa[selectedLista].observacionesDireccion)}>OK</button>
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
              break;
            
            case "emails":
              return(
                <ListaPopup show={showPopup} onHide={handleClosePopup} nombreLista={'Emails de empresa para el empleo'} nombreEmpleo={selectedEmpleo.nombrePuesto}>
                  {
                    <div>
                      {
                        <ul className='ulEditable'>
                            
                            {
                               selectedEmpresa[selectedLista] && Object.values(selectedEmpresa[selectedLista]).map((item, index) => (
                                <li key={index} className='fondoAnim'>
                                  <button onClick={()=>handleEditable(selectedEmpresa, item.id)}>
                                    <img src={editLogo} alt="Edit"/>
                                  </button>
                                  <button className="eliminar" onClick={()=>eliminarDeLista(selectedLista, selectedSubLista, item.id)}>X</button>
                                  <strong>{item.email}</strong>
                                  { editable && empresaEditable === selectedEmpresa && campoEditable === item.id && (

                                    <div>
                                      <Form.Control
                                        type="text"
                                        placeholder="Ingrese el nuevo valor"
                                        autoFocus
                                        ref={inputRef}
                                        />
                                      <button onClick={() => guardarCampo(selectedLista, selectedSubLista, item.email)}>OK</button>
                                      <button onClick={handleBlur}>Cancelar</button>
                                  </div>
                                  )} 
                                </li>
                              ))
                            }
                        </ul>
                      }
                    </div>
                  }
                </ListaPopup>
              );

              break;
            
              case "encuestaEmpresa":
                return(
                  <ListaPopup show={showPopup} onHide={handleClosePopup} nombreLista={'Encuesta de empresa para el empleo'} nombreEmpleo={selectedEmpleo.nombrePuesto}>
                    {
                      <div>
                        {
                          <ul className='ulEditable'>
                             <li>
                              <button onClick={()=>handleEditable(selectedEmpresa, 'idEncuesta')}>
                                <img src={editLogo} alt="Edit"/>
                              </button>
                              <strong>Id encuesta: </strong> 
                              <span>{selectedEmpresa[selectedLista].idEncuesta} </span>
                              { editable && empresaEditable === selectedEmpresa && campoEditable === 'idEncuesta' && (

                              <div>
                                <Form.Control
                                 type="text"
                                  placeholder="Ingrese un nuevo valor"
                                  autoFocus
                                  ref={inputRef}
                                  />
                                <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpresa[selectedLista].idEncuesta)}>OK</button>
                                <button onClick={handleBlur}>Cancelar</button>
                              </div>
                              )}    
                            </li>
                            <li>
                              <button onClick={()=>handleEditable(selectedEmpresa, 'calificacionEncuesta')}>
                                <img src={editLogo} alt="Edit"/>
                              </button>
                              <strong>Calificacion encuesta: </strong>
                              <span>{selectedEmpresa[selectedLista].calificacionEncuesta}</span>
                              { editable && empresaEditable === selectedEmpresa && campoEditable === 'calificacionEncuesta' && (

                              <div>
                                <Form.Control
                                 type="text"
                                  placeholder="Ingrese un nuevo valor"
                                  autoFocus
                                  ref={inputRef}
                                  />
                                <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpresa[selectedLista].calificacionEncuesta)}>OK</button>
                                <button onClick={handleBlur}>Cancelar</button>
                              </div>
                              )} 
                            </li>
                            <li>
                            <button onClick={()=>handleEditable(selectedEmpresa, 'comentarios')}>
                                <img src={editLogo} alt="Edit"/>
                              </button>
                              <strong>Comentarios: </strong> 
                              <span>{selectedEmpresa[selectedLista].comentarios} </span>
                              { editable && empresaEditable === selectedEmpresa && campoEditable === 'comentarios' && (

                              <div>
                                <Form.Control
                                 type="text"
                                  placeholder="Ingrese un nuevo valor"
                                  autoFocus
                                  ref={inputRef}
                                  />
                                <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpresa[selectedLista].comentarios)}>OK</button>
                                <button onClick={handleBlur}>Cancelar</button>
                              </div>
                              )}  
                            </li>
                            <li>
                            <button onClick={()=>handleEditable(selectedEmpresa, 'fechaDeCreacion')}>
                                <img src={editLogo} alt="Edit"/>
                              </button>
                              <strong>Fecha de creacion: </strong>
                              <span>{selectedEmpresa[selectedLista].fechaDeCreacion[2]}/{selectedEmpresa[selectedLista].fechaDeCreacion[1]}/{selectedEmpresa[selectedLista].fechaDeCreacion[0]} </span>
                              { editable && empresaEditable === selectedEmpresa && campoEditable === 'fechaDeCreacion' && (

                              <div>
                                <Form.Control
                                 type="text"
                                  placeholder="Ingrese un nuevo valor"
                                  autoFocus
                                  ref={inputRef}
                                  />
                                <button onClick={() => guardarCampo(selectedLista, selectedSubLista, '')}>OK</button>
                                <button onClick={handleBlur}>Cancelar</button>
                              </div>
                              )} 
                            </li>
                            <li>
                            <button onClick={()=>handleEditable(selectedEmpresa, 'observaciones')}>
                                <img src={editLogo} alt="Edit"/>
                              </button>
                              <strong>Observaciones: </strong>
                              <span>{selectedEmpresa[selectedLista].observaciones}</span>
                              { editable && empresaEditable === selectedEmpresa && campoEditable === 'observaciones' && (

                              <div>
                                <Form.Control
                                 type="text"
                                  placeholder="Ingrese un nuevo valor"
                                  autoFocus
                                  ref={inputRef}
                                  />
                                <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpresa[selectedLista].observaciones)}>OK</button>
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
                break;
              
                case "empleo":
                  return(
                    <ListaPopup show={showPopup} onHide={handleClosePopup} nombreLista={'Datos adicionales del empleo'} nombreEmpleo={selectedEmpleo.nombrePuesto}>
                      {
                        <div>
                          {
                            <ul className='ulEditable'>
                               <li>
                               <button onClick={()=>handleEditable(selectedEmpresa, 'cargaHorariaSemanal')}>
                                <img src={editLogo} alt="Edit"/>
                              </button>
                                <strong>Carga Horaria Semanal: </strong> 
                                <span>{selectedEmpleo.cargaHorariaSemanal} </span>
                                { editable && empresaEditable === selectedEmpresa && campoEditable === 'cargaHorariaSemanal' && (

                              <div>
                                <Form.Control
                                 type="text"
                                  placeholder="Ingrese un nuevo valor"
                                  autoFocus
                                  ref={inputRef}
                                  />
                                <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpleo.cargaHorariaSemanal)}>OK</button>
                                <button onClick={handleBlur}>Cancelar</button>
                              </div>
                              )}   
                              </li>
                              <li>
                              <button onClick={()=>handleEditable(selectedEmpresa, 'cargaHorariaTipo')}>
                                <img src={editLogo} alt="Edit"/>
                              </button>
                                <strong>Carga Horaria Tipo: </strong>
                                <span>{selectedEmpleo.cargaHorariaTipo}</span>
                                { editable && empresaEditable === selectedEmpresa && campoEditable === 'cargaHorariaTipo' && (

                              <div>
                                <Form.Control
                                 type="text"
                                  placeholder="Ingrese un nuevo valor"
                                  autoFocus
                                  ref={inputRef}
                                  />
                                <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpleo.cargaHorariaTipo)}>OK</button>
                                <button onClick={handleBlur}>Cancelar</button>
                              </div>
                              )} 
                              </li>
                              <li>
                              <button onClick={()=>handleEditable(selectedEmpresa, 'categoria')}>
                                <img src={editLogo} alt="Edit"/>
                              </button>
                                <strong>Categoria: </strong> 
                                <span>{selectedEmpleo.categoria} </span> 
                                { editable && empresaEditable === selectedEmpresa && campoEditable === 'categoria' && (

                              <div>
                                <Form.Control
                                 type="text"
                                  placeholder="Ingrese un nuevo valor"
                                  autoFocus
                                  ref={inputRef}
                                  />
                                <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpleo.categoria)}>OK</button>
                                <button onClick={handleBlur}>Cancelar</button>
                              </div>
                              )}  
                              </li>
                              <li>
                              <button onClick={()=>handleEditable(selectedEmpresa, 'categoriaLibretaConducir')}>
                                <img src={editLogo} alt="Edit"/>
                              </button>
                                <strong>Categoria Libreta Conducir: </strong>
                                <span>{selectedEmpleo.categoriaLibretaConducir} </span>
                                { editable && empresaEditable === selectedEmpresa && campoEditable === 'categoriaLibretaConducir' && (

                              <div>
                                <Form.Control
                                 type="text"
                                  placeholder="Ingrese un nuevo valor"
                                  autoFocus
                                  ref={inputRef}
                                  />
                                <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpleo.categoriaLibretaConducir)}>OK</button>
                                <button onClick={handleBlur}>Cancelar</button>
                              </div>
                              )} 
                              </li>
                              <li>
                              <button onClick={()=>handleEditable(selectedEmpresa, 'codigo')}>
                                <img src={editLogo} alt="Edit"/>
                              </button>
                                <strong>Codigo: </strong>
                                <span>{selectedEmpleo.codigo}</span>
                                { editable && empresaEditable === selectedEmpresa && campoEditable === 'codigo' && (

                              <div>
                                <Form.Control
                                 type="text"
                                  placeholder="Ingrese un nuevo valor"
                                  autoFocus
                                  ref={inputRef}
                                  />
                                <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpleo.codigo)}>OK</button>
                                <button onClick={handleBlur}>Cancelar</button>
                              </div>
                              )} 
                              </li>
                              <li>
                              <button onClick={()=>handleEditable(selectedEmpresa, 'companeros')}>
                                <img src={editLogo} alt="Edit"/>
                              </button>
                                <strong>Compañeros: </strong>
                                <span>{selectedEmpleo.companeros}</span>
                                { editable && empresaEditable === selectedEmpresa && campoEditable === 'companeros' && (

                              <div>
                                <Form.Control
                                 type="text"
                                  placeholder="Ingrese un nuevo valor"
                                  autoFocus
                                  ref={inputRef}
                                  />
                                <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpleo.companeros)}>OK</button>
                                <button onClick={handleBlur}>Cancelar</button>
                              </div>
                              )} 
                              </li>
                              <li>
                              <button onClick={()=>handleEditable(selectedEmpresa, 'contratoATermino')}>
                                <img src={editLogo} alt="Edit"/>
                              </button>
                                <strong>Contrato a termino: </strong>
                                <span>{selectedEmpleo.contratoATermino}</span>
                                { editable && empresaEditable === selectedEmpresa && campoEditable === 'contratoATermino' && (

                              <div>
                                <Form.Control
                                 type="text"
                                  placeholder="Ingrese un nuevo valor"
                                  autoFocus
                                  ref={inputRef}
                                  />
                                <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpleo.contratoATermino)}>OK</button>
                                <button onClick={handleBlur}>Cancelar</button>
                              </div>
                              )} 
                              </li>
                              <li>
                              <button onClick={()=>handleEditable(selectedEmpresa, 'departamento')}>
                                <img src={editLogo} alt="Edit"/>
                              </button>
                                <strong>Departamento: </strong>
                                <span>{selectedEmpleo.departamento}</span>
                                { editable && empresaEditable === selectedEmpresa && campoEditable === 'departamento' && (

                              <div>
                                <Form.Control
                                 type="text"
                                  placeholder="Ingrese un nuevo valor"
                                  autoFocus
                                  ref={inputRef}
                                  />
                                <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpleo.departamento)}>OK</button>
                                <button onClick={handleBlur}>Cancelar</button>
                              </div>
                              )} 
                              </li>
                              
                              <li>
                              <button onClick={()=>handleEditable(selectedEmpresa, 'detalleSalarial')}>
                                <img src={editLogo} alt="Edit"/>
                              </button>
                                <strong>Detalle Salarial: </strong>
                                <span>{selectedEmpleo.detalleSalarial}</span>
                                { editable && empresaEditable === selectedEmpresa && campoEditable === 'detalleSalarial' && (

                              <div>
                                <Form.Control
                                 type="text"
                                  placeholder="Ingrese un nuevo valor"
                                  autoFocus
                                  ref={inputRef}
                                  />
                                <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpleo.detalleSalarial)}>OK</button>
                                <button onClick={handleBlur}>Cancelar</button>
                              </div>
                              )} 
                              </li>
                              <li>
                              <button onClick={()=>handleEditable(selectedEmpresa, 'diasDeSemanaParaCubrirPuesto')}>
                                <img src={editLogo} alt="Edit"/>
                              </button>
                                <strong>Dias de semana para cubrir puesto: </strong>
                                <span>{selectedEmpleo.diasDeSemanaParaCubrirPuesto}</span>
                                { editable && empresaEditable === selectedEmpresa && campoEditable === 'diasDeSemanaParaCubrirPuesto' && (

                              <div>
                                <Form.Control
                                 type="text"
                                  placeholder="Ingrese un nuevo valor"
                                  autoFocus
                                  ref={inputRef}
                                  />
                                <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpleo.diasDeSemanaParaCubrirPuesto)}>OK</button>
                                <button onClick={handleBlur}>Cancelar</button>
                              </div>
                              )}
                              </li>
                              <li>
                              <button onClick={()=>handleEditable(selectedEmpresa, 'diasDeSemanaParaCubrirPuestoOtro')}>
                                <img src={editLogo} alt="Edit"/>
                              </button>
                                <strong>Dias de semana para cubrir puesto otro: </strong>
                                <span>{selectedEmpleo.diasDeSemanaParaCubrirPuestoOtro}</span>
                                { editable && empresaEditable === selectedEmpresa && campoEditable === 'diasDeSemanaParaCubrirPuestoOtro' && (

                              <div>
                                <Form.Control
                                 type="text"
                                  placeholder="Ingrese un nuevo valor"
                                  autoFocus
                                  ref={inputRef}
                                  />
                                <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpleo.diasDeSemanaParaCubrirPuestoOtro)}>OK</button>
                                <button onClick={handleBlur}>Cancelar</button>
                              </div>
                              )}
                              </li>
                              <li>
                              <button onClick={()=>handleEditable(selectedEmpresa, 'disponibilidadHoraria')}>
                                <img src={editLogo} alt="Edit"/>
                              </button>
                                <strong>Disponibilidad Horaria: </strong>
                                <span>{selectedEmpleo.disponibilidadHoraria}</span>
                                { editable && empresaEditable === selectedEmpresa && campoEditable === 'disponibilidadHoraria' && (

                              <div>
                                <Form.Control
                                 type="text"
                                  placeholder="Ingrese un nuevo valor"
                                  autoFocus
                                  ref={inputRef}
                                  />
                                <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpleo.disponibilidadHoraria)}>OK</button>
                                <button onClick={handleBlur}>Cancelar</button>
                              </div>
                              )}
                              </li>
                              <li>
                              <button onClick={()=>handleEditable(selectedEmpresa, 'edadPreferente')}>
                                <img src={editLogo} alt="Edit"/>
                              </button>
                                <strong>Edad preferente: </strong>
                                <span>{selectedEmpleo.edadPreferente}</span>
                                { editable && empresaEditable === selectedEmpresa && campoEditable === 'edadPreferente' && (

                              <div>
                                <Form.Control
                                 type="text"
                                  placeholder="Ingrese un nuevo valor"
                                  autoFocus
                                  ref={inputRef}
                                  />
                                <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpleo.edadPreferente)}>OK</button>
                                <button onClick={handleBlur}>Cancelar</button>
                              </div>
                              )}
                              </li>
                              <li>
                              <button onClick={()=>handleEditable(selectedEmpresa, 'experienciaPrevia')}>
                                <img src={editLogo} alt="Edit"/>
                              </button>
                                <strong>Experiencia previa: </strong>
                                <span>{selectedEmpleo.experienciaPrevia}</span>
                                { editable && empresaEditable === selectedEmpresa && campoEditable === 'experienciaPrevia' && (

                              <div>
                                <Form.Control
                                 type="text"
                                  placeholder="Ingrese un nuevo valor"
                                  autoFocus
                                  ref={inputRef}
                                  />
                                <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpleo.experienciaPrevia)}>OK</button>
                                <button onClick={handleBlur}>Cancelar</button>
                              </div>
                              )}
                              </li>
                              <li>
                              <button onClick={()=>handleEditable(selectedEmpresa, 'formacionAcademica')}>
                                <img src={editLogo} alt="Edit"/>
                              </button>
                                <strong>Formación académica: </strong>
                                <span>{selectedEmpleo.formacionAcademica}</span>
                                
                              { editable && empresaEditable === selectedEmpresa && campoEditable === 'formacionAcademica' &&(
                                <div >
                                    <div>
                                      <strong>Cambiar Formación académica:</strong>
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
                                  <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpleo.formacionAcademica)}>OK</button>
                                  <button onClick={handleBlur}>Cancelar</button>
                                </div>
                              )}
                              </li>
                              <li>
                              <button onClick={()=>handleEditable(selectedEmpresa, 'implicaDesplazamientos')}>
                                <img src={editLogo} alt="Edit"/>
                              </button>
                                <strong>Implica desplazamientos: </strong>
                                <span>{selectedEmpleo.implicaDesplazamientos}</span>
                                { editable && empresaEditable === selectedEmpresa && campoEditable === 'implicaDesplazamientos' && (

                              <div>
                                <Form.Control
                                 type="text"
                                  placeholder="Ingrese un nuevo valor"
                                  autoFocus
                                  ref={inputRef}
                                  />
                                <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpleo.implicaDesplazamientos)}>OK</button>
                                <button onClick={handleBlur}>Cancelar</button>
                              </div>
                              )}
                              </li>
                              <li>
                              <button onClick={()=>handleEditable(selectedEmpresa, 'libretaConducir')}>
                                <img src={editLogo} alt="Edit"/>
                              </button>
                                <strong>Libreta conducir: </strong>
                                <span>{selectedEmpleo.libretaConducir}</span>
                                { editable && empresaEditable === selectedEmpresa && campoEditable === 'libretaConducir' && (

                              <div>
                                <Form.Control
                                 type="text"
                                  placeholder="Ingrese un nuevo valor"
                                  autoFocus
                                  ref={inputRef}
                                  />
                                <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpleo.libretaConducir)}>OK</button>
                                <button onClick={handleBlur}>Cancelar</button>
                              </div>
                              )}
                              </li>
                              <li>
                              <button onClick={()=>handleEditable(selectedEmpresa, 'localidades')}>
                                <img src={editLogo} alt="Edit"/>
                              </button>
                                <strong>Localidades: </strong>
                                <span>{selectedEmpleo.localidades}</span>
                                { editable && empresaEditable === selectedEmpresa && campoEditable === 'localidades' && (

                              <div>
                                <Form.Control
                                 type="text"
                                  placeholder="Ingrese un nuevo valor"
                                  autoFocus
                                  ref={inputRef}
                                  />
                                <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpleo.localidades)}>OK</button>
                                <button onClick={handleBlur}>Cancelar</button>
                              </div>
                              )}
                              </li>
                              <li>
                              <button onClick={()=>handleEditable(selectedEmpresa, 'nombrePuesto')}>
                                <img src={editLogo} alt="Edit"/>
                              </button>
                                <strong>Nombre puesto: </strong>
                                <span>{selectedEmpleo.nombrePuesto}</span>
                                { editable && empresaEditable === selectedEmpresa && campoEditable === 'nombrePuesto' && (

                              <div>
                                <Form.Control
                                 type="text"
                                  placeholder="Ingrese un nuevo valor"
                                  autoFocus
                                  ref={inputRef}
                                  />
                                <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpleo.nombrePuesto)}>OK</button>
                                <button onClick={handleBlur}>Cancelar</button>
                              </div>
                              )}
                              </li>
                              <li>
                              <button onClick={()=>handleEditable(selectedEmpresa, 'nroPuestosDisponible')}>
                                <img src={editLogo} alt="Edit"/>
                              </button>
                                <strong>Nro puestos disponibles: </strong>
                                <span>{selectedEmpleo.nroPuestosDisponible}</span>
                                { editable && empresaEditable === selectedEmpresa && campoEditable === 'nroPuestosDisponible' && (

                              <div>
                                <Form.Control
                                 type="text"
                                  placeholder="Ingrese un nuevo valor"
                                  autoFocus
                                  ref={inputRef}
                                  />
                                <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpleo.nroPuestosDisponible)}>OK</button>
                                <button onClick={handleBlur}>Cancelar</button>
                              </div>
                              )}
                              </li>
                              <li>
                              <button onClick={()=>handleEditable(selectedEmpresa, 'plazoContrato')}>
                                <img src={editLogo} alt="Edit"/>
                              </button>
                                <strong>Plazo contrato: </strong>
                                <span>{selectedEmpleo.plazoContrato}</span>
                                { editable && empresaEditable === selectedEmpresa && campoEditable === 'plazoContrato' && (

                              <div>
                                <Form.Control
                                 type="text"
                                  placeholder="Ingrese un nuevo valor"
                                  autoFocus
                                  ref={inputRef}
                                  />
                                <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpleo.plazoContrato)}>OK</button>
                                <button onClick={handleBlur}>Cancelar</button>
                              </div>
                              )}
                              </li>
                              <li>
                              <button onClick={()=>handleEditable(selectedEmpresa, 'rangoDeEdad')}>
                                <img src={editLogo} alt="Edit"/>
                              </button>
                                <strong>Rango de edad: </strong>
                                <span>{selectedEmpleo.rangoDeEdad}</span>
                                { editable && empresaEditable === selectedEmpresa && campoEditable === 'rangoDeEdad' && (

                              <div>
                                <Form.Control
                                 type="text"
                                  placeholder="Ingrese un nuevo valor"
                                  autoFocus
                                  ref={inputRef}
                                  />
                                <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpleo.rangoDeEdad)}>OK</button>
                                <button onClick={handleBlur}>Cancelar</button>
                              </div>
                              )}
                              </li>
                              <li>
                              <button onClick={()=>handleEditable(selectedEmpresa, 'remuneracionOfrecida')}>
                                <img src={editLogo} alt="Edit"/>
                              </button>
                                <strong>Remuneracion ofrecida: </strong>
                                <span>{selectedEmpleo.remuneracionOfrecida}</span>
                                { editable && empresaEditable === selectedEmpresa && campoEditable === 'rangremuneracionOfrecidaoDeEdad' && (

                              <div>
                                <Form.Control
                                 type="text"
                                  placeholder="Ingrese un nuevo valor"
                                  autoFocus
                                  ref={inputRef}
                                  />
                                <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpleo.remuneracionOfrecida)}>OK</button>
                                <button onClick={handleBlur}>Cancelar</button>
                              </div>
                              )}
                              </li>
                              <li>
                              <button onClick={()=>handleEditable(selectedEmpresa, 'ritmoImpuesto')}>
                                <img src={editLogo} alt="Edit"/>
                              </button>
                                <strong>Ritmo impuesto: </strong>
                                <span>{selectedEmpleo.ritmoImpuesto}</span>
                                { editable && empresaEditable === selectedEmpresa && campoEditable === 'ritmoImpuesto' && (

                              <div>
                                <Form.Control
                                 type="text"
                                  placeholder="Ingrese un nuevo valor"
                                  autoFocus
                                  ref={inputRef}
                                  />
                                <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpleo.ritmoImpuesto)}>OK</button>
                                <button onClick={handleBlur}>Cancelar</button>
                              </div>
                              )}
                              </li>
                              <li>
                              <button onClick={()=>handleEditable(selectedEmpresa, 'subordinados')}>
                                <img src={editLogo} alt="Edit"/>
                              </button>
                                <strong>Subordinados: </strong>
                                <span>{selectedEmpleo.subordinados}</span>
                                { editable && empresaEditable === selectedEmpresa && campoEditable === 'subordinados' && (

                              <div>
                                <Form.Control
                                 type="text"
                                  placeholder="Ingrese un nuevo valor"
                                  autoFocus
                                  ref={inputRef}
                                  />
                                <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpleo.subordinados)}>OK</button>
                                <button onClick={handleBlur}>Cancelar</button>
                              </div>
                              )}
                              </li>
                              <li>
                              <button onClick={()=>handleEditable(selectedEmpresa, 'supervisores')}>
                                <img src={editLogo} alt="Edit"/>
                              </button>
                                <strong>Supervisores: </strong>
                                <span>{selectedEmpleo.supervisores}</span>
                                { editable && empresaEditable === selectedEmpresa && campoEditable === 'supervisores' && (

                              <div>
                                <Form.Control
                                 type="text"
                                  placeholder="Ingrese un nuevo valor"
                                  autoFocus
                                  ref={inputRef}
                                  />
                                <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpleo.supervisores)}>OK</button>
                                <button onClick={handleBlur}>Cancelar</button>
                              </div>
                              )}
                              </li>
                              <li>
                              <button onClick={()=>handleEditable(selectedEmpresa, 'tiempoDeExperienciaMinima')}>
                                <img src={editLogo} alt="Edit"/>
                              </button>
                                <strong>Tiempo de experiencia minima: </strong>
                                <span>{selectedEmpleo.tiempoDeExperienciaMinima}</span>
                                { editable && empresaEditable === selectedEmpresa && campoEditable === 'tiempoDeExperienciaMinima' && (

                              <div>
                                <Form.Control
                                 type="text"
                                  placeholder="Ingrese un nuevo valor"
                                  autoFocus
                                  ref={inputRef}
                                  />
                                <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpleo.tiempoDeExperienciaMinima)}>OK</button>
                                <button onClick={handleBlur}>Cancelar</button>
                              </div>
                              )}
                              </li>
                              <li>
                              <button onClick={()=>handleEditable(selectedEmpresa, 'tipoRemuneracion')}>
                                <img src={editLogo} alt="Edit"/>
                              </button>
                                <strong>Tipo remuneracion: </strong>
                                <span>{selectedEmpleo.tipoRemuneracion}</span>
                                { editable && empresaEditable === selectedEmpresa && campoEditable === 'tipoRemuneracion' && (

                              <div>
                                <Form.Control
                                 type="text"
                                  placeholder="Ingrese un nuevo valor"
                                  autoFocus
                                  ref={inputRef}
                                  />
                                <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpleo.tipoRemuneracion)}>OK</button>
                                <button onClick={handleBlur}>Cancelar</button>
                              </div>
                              )}
                              </li>
                              <li>
                              <button onClick={()=>handleEditable(selectedEmpresa, 'tipoRemuneracionOtro')}>
                                <img src={editLogo} alt="Edit"/>
                              </button>
                                <strong>Tipo remuneracion otro: </strong>
                                <span>{selectedEmpleo.tipoRemuneracionOtro}</span>
                                { editable && empresaEditable === selectedEmpresa && campoEditable === 'tipoRemuneracionOtro' && (

                              <div>
                                <Form.Control
                                 type="text"
                                  placeholder="Ingrese un nuevo valor"
                                  autoFocus
                                  ref={inputRef}
                                  />
                                <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpleo.tipoRemuneracionOtro)}>OK</button>
                                <button onClick={handleBlur}>Cancelar</button>
                              </div>
                              )}
                              </li>
                              <li>
                              <button onClick={()=>handleEditable(selectedEmpresa, 'trabajoAlExterior')}>
                                <img src={editLogo} alt="Edit"/>
                              </button>
                                <strong>Trabajo al exterior: </strong>
                                <span>{selectedEmpleo.trabajoAlExterior}</span>
                                { editable && empresaEditable === selectedEmpresa && campoEditable === 'trabajoAlExterior' && (

                              <div>
                                <Form.Control
                                 type="text"
                                  placeholder="Ingrese un nuevo valor"
                                  autoFocus
                                  ref={inputRef}
                                  />
                                <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpleo.trabajoAlExterior)}>OK</button>
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
                  break;  
              
                case "telefonos":
                  return(
                    <ListaPopup show={showPopup} onHide={handleClosePopup} nombreLista={'Telefonos de empresa para el empleo'} nombreEmpleo={selectedEmpleo.nombrePuesto}>
                      {
                        <div>
                          {
                            <ul className='ulEditable'>
                                {
                                  selectedEmpresa[selectedLista] && Object.values(selectedEmpresa[selectedLista]).map((item, index) => (
                                    <ul key={index}>
                                      <li>
                                      <button onClick={()=>handleEditable(selectedEmpresa, 'numeroUno')}>
                                        <img src={editLogo} alt="Edit"/>
                                      </button>
                                        <strong>Número uno: </strong>
                                        <span >{item.numeroUno}</span>
                                        { editable && empresaEditable === selectedEmpresa && campoEditable === 'numeroUno' && (

                                          <div>
                                            <Form.Control
                                            type="text"
                                              placeholder="Ingrese un nuevo valor"
                                              autoFocus
                                              ref={inputRef}
                                              />
                                            <button onClick={() => guardarCampo(selectedLista, selectedSubLista, item.numeroUno)}>OK</button>
                                            <button onClick={handleBlur}>Cancelar</button>
                                          </div>
                                        )}
                                      </li>
                                      <li>
                                      <button onClick={()=>handleEditable(selectedEmpresa, 'duenioUno')}>
                                        <img src={editLogo} alt="Edit"/>
                                      </button>
                                        <strong>Duenio uno: </strong>
                                        <span >{item.duenioUno}</span>
                                        { editable && empresaEditable === selectedEmpresa && campoEditable === 'duenioUno' && (

                                          <div>
                                            <Form.Control
                                            type="text"
                                              placeholder="Ingrese un nuevo valor"
                                              autoFocus
                                              ref={inputRef}
                                              />
                                            <button onClick={() => guardarCampo(selectedLista, selectedSubLista, item.duenioUno)}>OK</button>
                                            <button onClick={handleBlur}>Cancelar</button>
                                          </div>
                                        )}
                                      </li>
                                      <li>
                                      <button onClick={()=>handleEditable(selectedEmpresa, 'numeroDos')}>
                                        <img src={editLogo} alt="Edit"/>
                                      </button>
                                        <strong>Número dos: </strong>
                                        <span >{item.numeroDos}</span>
                                        { editable && empresaEditable === selectedEmpresa && campoEditable === 'numeroDos' && (

                                          <div>
                                            <Form.Control
                                            type="text"
                                              placeholder="Ingrese un nuevo valor"
                                              autoFocus
                                              ref={inputRef}
                                              />
                                            <button onClick={() => guardarCampo(selectedLista, selectedSubLista, item.numeroDos)}>OK</button>
                                            <button onClick={handleBlur}>Cancelar</button>
                                          </div>
                                        )}
                                      </li>
                                      <li>
                                      <button onClick={()=>handleEditable(selectedEmpresa, 'duenioDos')}>
                                        <img src={editLogo} alt="Edit"/>
                                      </button>
                                        <strong>Duenio dos: </strong>
                                        <span >{item.duenioDos}</span>
                                        { editable && empresaEditable === selectedEmpresa && campoEditable === 'duenioDos' && (

                                          <div>
                                            <Form.Control
                                            type="text"
                                              placeholder="Ingrese un nuevo valor"
                                              autoFocus
                                              ref={inputRef}
                                              />
                                            <button onClick={() => guardarCampo(selectedLista, selectedSubLista, item.duenioDos)}>OK</button>
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
                  break;   
            
              

          
            default:
              break;
          }

        }else{

          

          switch (selectedSubLista) {

            case "conocimientosEspecificosEmpleo":
              return(
                <ListaPopup show={showPopup} onHide={handleClosePopup} nombreLista={'Conocimientos para el empleo'} nombreEmpleo={selectedEmpleo.nombrePuesto} selectedEmpresa={selectedEmpresa}>
                      {
                        <div>
                          {
                            <ul className='ulEditable'>
                               <li>
                               <button onClick={()=>handleEditable(selectedEmpresa, 'computacion')}>
                                  <img src={editLogo} alt="Edit"/>
                                </button>
                                <strong>Computacion: </strong> 
                                <span>{selectedEmpleo[selectedSubLista].computacion} </span> 
                                { editable && empresaEditable === selectedEmpresa && campoEditable === 'computacion' && (

                                          <div>
                                            <Form.Control
                                            type="text"
                                              placeholder="Ingrese un nuevo valor"
                                              autoFocus
                                              ref={inputRef}
                                              />
                                            <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpleo[selectedSubLista].computacion)}>OK</button>
                                            <button onClick={handleBlur}>Cancelar</button>
                                          </div>
                                        )} 
                              </li>
                              <li>
                              <button onClick={()=>handleEditable(selectedEmpresa, 'otrosComputacion')}>
                                  <img src={editLogo} alt="Edit"/>
                                </button>
                                <strong>Otros computacion: </strong>
                                <span>{selectedEmpleo[selectedSubLista].otrosComputacion}</span>
                                { editable && empresaEditable === selectedEmpresa && campoEditable === 'otrosComputacion' && (

                                          <div>
                                            <Form.Control
                                            type="text"
                                              placeholder="Ingrese un nuevo valor"
                                              autoFocus
                                              ref={inputRef}
                                              />
                                            <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpleo[selectedSubLista].otrosComputacion)}>OK</button>
                                            <button onClick={handleBlur}>Cancelar</button>
                                          </div>
                                        )} 
                              </li>
                              <li>
                              <button onClick={()=>handleEditable(selectedEmpresa, 'idiomaCompetenciaYrequisito')}>
                                  <img src={editLogo} alt="Edit"/>
                                </button>
                                <strong>Idioma Competencia y requisito: </strong>
                                <span>{selectedEmpleo[selectedSubLista].idiomaCompetenciaYrequisito}</span>
                                { editable && empresaEditable === selectedEmpresa && campoEditable === 'idiomaCompetenciaYrequisito' && (

                                          <div>
                                            <Form.Control
                                            type="text"
                                              placeholder="Ingrese un nuevo valor"
                                              autoFocus
                                              ref={inputRef}
                                              />
                                            <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpleo[selectedSubLista].idiomaCompetenciaYrequisito)}>OK</button>
                                            <button onClick={handleBlur}>Cancelar</button>
                                          </div>
                                        )} 
                              </li>
                              <li>
                              <button onClick={()=>handleEditable(selectedEmpresa, 'idiomas')}>
                                  <img src={editLogo} alt="Edit"/>
                                </button>
                                <strong>Idiomas: </strong> 
                                <span>{selectedEmpleo[selectedSubLista].idiomas}</span>
                                { editable && empresaEditable === selectedEmpresa && campoEditable === 'idiomas' && (

                                          <div>
                                            <Form.Control
                                            type="text"
                                              placeholder="Ingrese un nuevo valor"
                                              autoFocus
                                              ref={inputRef}
                                              />
                                            <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpleo[selectedSubLista].idiomas)}>OK</button>
                                            <button onClick={handleBlur}>Cancelar</button>
                                          </div>
                                        )}   
                              </li>
                              
                              <li>
                              <button onClick={()=>handleEditable(selectedEmpresa, 'lee')}>
                                  <img src={editLogo} alt="Edit"/>
                                </button>
                                <strong>Lee: </strong>
                                <span>{selectedEmpleo[selectedSubLista].lee}</span>
                                { editable && empresaEditable === selectedEmpresa && campoEditable === 'lee' && (

                                          <div>
                                            <Form.Control
                                            type="text"
                                              placeholder="Ingrese un nuevo valor"
                                              autoFocus
                                              ref={inputRef}
                                              />
                                            <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpleo[selectedSubLista].lee)}>OK</button>
                                            <button onClick={handleBlur}>Cancelar</button>
                                          </div>
                                        )} 
                              </li>
                              <li>
                              <button onClick={()=>handleEditable(selectedEmpresa, 'ingles')}>
                                  <img src={editLogo} alt="Edit"/>
                                </button>
                                <strong>Ingles: </strong>
                                <span>{selectedEmpleo[selectedSubLista].ingles} </span>
                                { editable && empresaEditable === selectedEmpresa && campoEditable === 'ingles' && (

                                          <div>
                                            <Form.Control
                                            type="text"
                                              placeholder="Ingrese un nuevo valor"
                                              autoFocus
                                              ref={inputRef}
                                              />
                                            <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpleo[selectedSubLista].ingles)}>OK</button>
                                            <button onClick={handleBlur}>Cancelar</button>
                                          </div>
                                        )} 
                              </li>
                              <li>
                              <button onClick={()=>handleEditable(selectedEmpresa, 'nivelIdiomasRequeridosEscrituraIngles')}>
                                  <img src={editLogo} alt="Edit"/>
                                </button>
                                <strong>Nivel Requeridos Escritura Ingles: </strong>
                                <span>{selectedEmpleo[selectedSubLista].nivelIdiomasRequeridosEscrituraIngles}</span>
                                { editable && empresaEditable === selectedEmpresa && campoEditable === 'nivelIdiomasRequeridosEscrituraIngles' && (

                                          <div>
                                            <Form.Control
                                            type="text"
                                              placeholder="Ingrese un nuevo valor"
                                              autoFocus
                                              ref={inputRef}
                                              />
                                            <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpleo[selectedSubLista].nivelIdiomasRequeridosEscrituraIngles)}>OK</button>
                                            <button onClick={handleBlur}>Cancelar</button>
                                          </div>
                                        )} 
                              </li>
                              <li>
                              <button onClick={()=>handleEditable(selectedEmpresa, 'nivelIdiomasRequeridosHablaIngles')}>
                                  <img src={editLogo} alt="Edit"/>
                                </button>
                                <strong>Nivel requeridos habla ingles: </strong>
                                <span>{selectedEmpleo[selectedSubLista].nivelIdiomasRequeridosHablaIngles}</span>
                                { editable && empresaEditable === selectedEmpresa && campoEditable === 'nivelIdiomasRequeridosHablaIngles' && (

                                          <div>
                                            <Form.Control
                                            type="text"
                                              placeholder="Ingrese un nuevo valor"
                                              autoFocus
                                              ref={inputRef}
                                              />
                                            <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpleo[selectedSubLista].nivelIdiomasRequeridosHablaIngles)}>OK</button>
                                            <button onClick={handleBlur}>Cancelar</button>
                                          </div>
                                        )} 
                              </li>
                              <li>
                              <button onClick={()=>handleEditable(selectedEmpresa, 'nivelIdiomasRequeridosLecturaIngles')}>
                                  <img src={editLogo} alt="Edit"/>
                                </button>
                                <strong>Nivel requeridos lectura ingles: </strong>
                                <span>{selectedEmpleo[selectedSubLista].nivelIdiomasRequeridosLecturaIngles}</span>
                                { editable && empresaEditable === selectedEmpresa && campoEditable === 'nivelIdiomasRequeridosLecturaIngles' && (

                                          <div>
                                            <Form.Control
                                            type="text"
                                              placeholder="Ingrese un nuevo valor"
                                              autoFocus
                                              ref={inputRef}
                                              />
                                            <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpleo[selectedSubLista].nivelIdiomasRequeridosLecturaIngles)}>OK</button>
                                            <button onClick={handleBlur}>Cancelar</button>
                                          </div>
                                        )} 
                              </li>
                              <li>
                              <button onClick={()=>handleEditable(selectedEmpresa, 'portgues')}>
                                  <img src={editLogo} alt="Edit"/>
                                </button>
                                <strong>Portgues: </strong>
                                <span>{selectedEmpleo[selectedSubLista].portgues}</span>
                                { editable && empresaEditable === selectedEmpresa && campoEditable === 'portgues' && (

                                          <div>
                                            <Form.Control
                                            type="text"
                                              placeholder="Ingrese un nuevo valor"
                                              autoFocus
                                              ref={inputRef}
                                              />
                                            <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpleo[selectedSubLista].portgues)}>OK</button>
                                            <button onClick={handleBlur}>Cancelar</button>
                                          </div>
                                        )} 
                              </li>
                              <li>
                              <button onClick={()=>handleEditable(selectedEmpresa, 'nivelIdiomasRequeridosEscrituraPortugues')}>
                                  <img src={editLogo} alt="Edit"/>
                                </button>
                                <strong>Nivel requeridos escritura portugues: </strong>
                                <span>{selectedEmpleo[selectedSubLista].nivelIdiomasRequeridosEscrituraPortugues}</span>
                                { editable && empresaEditable === selectedEmpresa && campoEditable === 'nivelIdiomasRequeridosEscrituraPortugues' && (

                                          <div>
                                            <Form.Control
                                            type="text"
                                              placeholder="Ingrese un nuevo valor"
                                              autoFocus
                                              ref={inputRef}
                                              />
                                            <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpleo[selectedSubLista].nivelIdiomasRequeridosEscrituraPortugues)}>OK</button>
                                            <button onClick={handleBlur}>Cancelar</button>
                                          </div>
                                        )} 
                              </li>
                              <li>
                              <button onClick={()=>handleEditable(selectedEmpresa, 'nivelIdiomasRequeridosHablaPortugues')}>
                                  <img src={editLogo} alt="Edit"/>
                                </button>
                                <strong>Nivel requeridos habla portugues: </strong>
                                <span>{selectedEmpleo[selectedSubLista].nivelIdiomasRequeridosHablaPortugues}</span>
                                { editable && empresaEditable === selectedEmpresa && campoEditable === 'nivelIdiomasRequeridosHablaPortugues' && (

                                          <div>
                                            <Form.Control
                                            type="text"
                                              placeholder="Ingrese un nuevo valor"
                                              autoFocus
                                              ref={inputRef}
                                              />
                                            <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpleo[selectedSubLista].nivelIdiomasRequeridosHablaPortugues)}>OK</button>
                                            <button onClick={handleBlur}>Cancelar</button>
                                          </div>
                                        )} 
                              </li>
                              
                              <li>
                              <button onClick={()=>handleEditable(selectedEmpresa, 'nivelIdiomasRequeridosLecturaPortugues')}>
                                  <img src={editLogo} alt="Edit"/>
                                </button>
                                <strong>Nivel idiomas requeridos lectura portugues: </strong>
                                <span>{selectedEmpleo[selectedSubLista].nivelIdiomasRequeridosLecturaPortugues}</span>
                                { editable && empresaEditable === selectedEmpresa && campoEditable === 'nivelIdiomasRequeridosLecturaPortugues' && (

                                          <div>
                                            <Form.Control
                                            type="text"
                                              placeholder="Ingrese un nuevo valor"
                                              autoFocus
                                              ref={inputRef}
                                              />
                                            <button onClick={() => guardarCampo(selectedLista, selectedSubLista, selectedEmpleo[selectedSubLista].nivelIdiomasRequeridosLecturaPortugues)}>OK</button>
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
              
              break;
            
              case "tareas":
                return(
                  <ListaPopup show={showPopup} onHide={handleClosePopup} nombreLista={'Tareas para el empleo'} nombreEmpleo={selectedEmpleo.nombrePuesto} selectedEmpresa={selectedEmpresa}>
                    {
                      <div>
                        {
                          <div className='ulEditable'> 
                            {
                                selectedEmpleo[selectedSubLista] && Object.values(selectedEmpleo[selectedSubLista]).map((item, index) => (
                                  <ul >

                                    <section className='fondoAnim'>
                                      <section className='tituloTareas'>
                                        <strong >{index == 0 ? "Tareas Esenciales" : "Tareas No Esenciales"}</strong>
                                      </section>
                                      
                                    <section>
                                    <button onClick={()=>handleEditable(selectedEmpresa, `${index}-nombre`)}>
                                      <img src={editLogo} alt="Edit"/>
                                    </button>
                                      <strong>Nombre: </strong>
                                      <span>{item.nombre}</span>
                                      { editable && empresaEditable === selectedEmpresa && campoEditable === `${index}-nombre` && (

                                          <div>
                                            <Form.Control
                                            type="text"
                                              placeholder="Ingrese un nuevo valor"
                                              autoFocus
                                              ref={inputRef}
                                              />
                                            <button onClick={() => guardarCampo(selectedLista, selectedSubLista, item.nombre)}>OK</button>
                                            <button onClick={handleBlur}>Cancelar</button>
                                          </div>
                                        )} 
                                    </section>
                                    <section>
                                    <button onClick={()=>handleEditable(selectedEmpresa, `${index}-otras`)}>
                                      <img src={editLogo} alt="Edit"/>
                                    </button>
                                      <strong>Otras: </strong>
                                      <span>{item.otras}</span>
                                      { editable && empresaEditable === selectedEmpresa && campoEditable === `${index}-otras` && (

                                          <div>
                                            <Form.Control
                                            type="text"
                                              placeholder="Ingrese un nuevo valor"
                                              autoFocus
                                              ref={inputRef}
                                              />
                                            <button onClick={() => guardarCampo(selectedLista, selectedSubLista, item.otras)}>OK</button>
                                            <button onClick={handleBlur}>Cancelar</button>
                                          </div>
                                        )} 
                                    </section>
                                    <section>
                                      <strong>Datalle de tareas: </strong>
                                        {
                                          item["detalleTarea"] && Object.values(item["detalleTarea"]).map((unDetalle, pos) => (
                                            <ul key={pos}>
                                              <li>
                                                <button onClick={()=>handleEditable(selectedEmpresa, `${index}-${pos}-${unDetalle.id}`)}>
                                                  <img src={editLogo} alt="Edit"/>
                                                </button>
                                                <button className="eliminar" onClick={()=>eliminarDeLista(selectedSubLista, "detalleTarea", unDetalle.id, unDetalle.detalle, index)}>X</button>

                                                <span>{unDetalle.detalle}</span>
                                                { editable && empresaEditable === selectedEmpresa && campoEditable === `${index}-${pos}-${unDetalle.id}` && (

                                                  <div>
                                                    <Form.Control
                                                    type="text"
                                                      placeholder="Ingrese un nuevo valor"
                                                      autoFocus
                                                      ref={inputRef}
                                                      />
                                                    <button onClick={() => guardarCampo(selectedSubLista, "detalleTarea" , unDetalle.detalle)}>OK</button>
                                                    <button onClick={handleBlur}>Cancelar</button>
                                                  </div>
                                                )}
                                              </li>
                                            </ul>
                                          ))
                                        }  
                                        {showAgregarALista &&  empresaAgregarALista == selectedEmpresa && abrirAgregarALista === index &&(
                          
                                                  <div>
                                                    <div>
                                                      <strong>Agregar nuevo Detalle:</strong>
                                                        </div>
                                                            <Form.Control
                                                              type="text"
                                                              placeholder="Ingrese un nuevo valor"
                                                              autoFocus
                                                              ref={inputRef}
                                                                />

                                                    <button onClick={() => guardarAgregarALista(index, "detalleTarea")}>OK</button>
                                                    <button onClick={handleBlurAgregarALista}>Cancelar</button>
                                                  </div>                       
                                                )}
                                                {!showAgregarALista && (
                                                <button className='agregar' onClick={() => showSelectAgregar(selectedEmpresa, index)}>Agregar Detalle</button>
                                                )} 
                                    </section>
                                     
                                    </section>
                                    
                                  </ul>
                                ))
                            }
                            
                       
                          </div>
                              
                        }
                      </div>
                    }
        
                  </ListaPopup>
                );
                break;   
          
            default:
              break;
          }
          

        }

      }

      
    }

      
  }

  const ListaPopup = ({ show, onHide, nombreLista, nombreEmpleo, children, selectedEmpresa}) => {
    // const datos = lista[sub];
    
    return (
      <Modal show = {show} onHide={onHide} dialogClassName="custom-modal">
        <Modal.Header closeButton className='modalHeder'>
        <Modal.Title className='titulosListas'>{nombreLista} de {nombreEmpleo}</Modal.Title>
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
        <h3>Filtrado de empresas </h3>
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
          <option value="" disabled>Empresa</option>
          <option value="nombreEmpresa">Nombre de empresa</option>
          <option value="actividad_economica">Actividad economica</option>
          <option value="rama_economica">Rama economica</option>
          <option value="rut">Rut</option>
          <option value="" disabled>Empleos</option>
          <option value="formacion_Academica">Formación académica</option>

          <option value="departamento">Departamento</option>
          <option value="nombre_puesto">Nombre del puesto</option>


        </select>
        
        {nuevoFiltro === 'rut' && (
          <input type='number' value={subFiltro} onChange={manejarCambioSubFiltro}/>
        )}
        
        {nuevoFiltro === 'nombreEmpresa' && (
          <input type='text' value={subFiltro} onChange={manejarCambioSubFiltro}/>
        )}
        {nuevoFiltro === 'actividad_economica' && (
          <input type='text' value={subFiltro} onChange={manejarCambioSubFiltro}/>
        )}
        {nuevoFiltro === 'rama_economica' && (
          <input type='text' value={subFiltro} onChange={manejarCambioSubFiltro}/>
        )}
        
        {nuevoFiltro === 'nombre_puesto' && (
          <input type='text' value={subFiltro} onChange={manejarCambioSubFiltro}/>
        )}
        {nuevoFiltro === 'formacion_Academica' && (
          <select value={subFiltro} onChange={manejarCambioSubFiltro}>
            <option value="">Seleccionar una formación...</option>
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
        <button onClick={manejarAgregarFiltro}>Agregar Filtro</button>
          </div>
          <button className='buttonEnviar' onClick={enviarFiltros}>Obtener</button>
        <div>
        
      <div className="result">
        {/* ... */}
        <h4>Resultados</h4>

    <table>
            <thead>
              <tr>
                  <th>Empleo</th>
                  <th>Formación</th>
                  {/* <th>Edad Preferente</th> */}
                  <th>Departamento</th>   
                  <th>Cantidad de puestos</th>           
                  <th>Acciones</th>
              </tr>
            </thead>

          <tbody>
              {empleos.map((empleo) => (
                  <tr key={empleo.id}>
                      <td>{empleo.nombrePuesto}</td>
                      <td className="wrap-text">{empleo.formacionAcademica}</td>
                      {/* <td>{empleo.edadPreferente}</td> */}                      
                      <td>{empleo.departamento}</td>
                      <td>{empleo.nroPuestosDisponible}</td>
                      <td>
                          <span class="masDetalles" onClick={() => handleSelectShow(empleo)}>Mas detalles</span>
                          {showSelect && selectedEmpleoCombo === empleo.id && (
                            <div className="selectContainer">
                              <select className="selectDropdown" onChange={(e) => handleShowPopup(e, empleo)}>
                                  <option value="">Seleccionar...</option>
                                  <option disabled value="">Datos de los empelos</option>
                                  <option value="empleo|">Datos adicionales del empelo</option>
                                  <option value="empleo|conocimientosEspecificosEmpleo">Requisitos</option>
                                  <option value="empleo|tareas">Tareas</option>
                                  <option disabled value="">Datos de las empresas</option>
                                  <option value="|">Empresa</option>
                                  <option value="datosAdicionalesEmpresa|">Datos adicionales</option>
                                  <option value="direccion|">Direccion</option>
                                  <option value="emails|">Emails</option>
                                  <option value="encuestaEmpresa|">Encuenta</option>
                                  <option value="telefonos|">Telefonos</option>
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
            selectedSubLista={selectedSubListaElim}>
          
        </ConfirmPopUp>
        )                   
      } 
      </div>

    </div>
    </div>
    </div>
  );


};

export default BusquedaConFiltrosEmpleos;
