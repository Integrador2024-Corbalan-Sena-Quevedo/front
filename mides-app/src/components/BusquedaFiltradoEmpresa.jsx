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

  const inputRef = useRef(null);

  const handleEditable = (empresa, campo) => {
    console.log('Llegue')
    setEditable(true);
    setEmpresaEditable(empresa);
    setCampoEditable(campo);
  }

  const guardarCampo = async (lista, subLista, datoAnt) =>{
    debugger
    const nuevoValor = inputRef.current.value;
    console.log('Nuevo Valor: '+nuevoValor);
    console.log('Nombre de cabezal a editar: '+campoEditable);
    console.log('Nombre del candidato: '+empresaEditable.nombre);
    console.log('Nuevo lista: '+lista);
    console.log('Nuevo subLista: '+subLista);
    console.log('Dato anteriror: '+datoAnt);
    
    //const response = await actualizarCampo(`${SelectedCandidato.id}`, campoEditable, nuevoValor, datoAnt, lista, subLista);
    

    handleBlur();
    //actualizarListaCandidatos(nuevoValor, lista, subLista);
    //setShowPopup(true);
  }

  const handleBlur = () => {
    console.log('Estoy');
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
    console.log(JSON.stringify(datos));

    
    fetch('http://localhost:8080/filtro/empleos', {
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

        console.log(resultados);

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
                            <span>{selectedEmpresa[selectedLista].fechaRespuesta[2]}/{selectedEmpresa[selectedLista].fechaRespuesta[1]}/{selectedEmpresa[selectedLista].fechaRespuesta[0]} </span>
                            { editable && empresaEditable === selectedEmpresa && campoEditable === 'fechaRespuesta' && (

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
            case "dirreccion":
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
                                <li key={index}>
                                  <strong>{item.email}</strong>
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
                                <strong>Formacion academica: </strong>
                                <span>{selectedEmpleo.formacionAcademica}</span>
                                { editable && empresaEditable === selectedEmpresa && campoEditable === 'formacionAcademica' && (

                              <div>
                                <Form.Control
                                 type="text"
                                  placeholder="Ingrese un nuevo valor"
                                  autoFocus
                                  ref={inputRef}
                                  />
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

          debugger

          switch (selectedSubLista) {

            case "conocimientosEspecificosEmpleo":
              return(
                <ListaPopup show={showPopup} onHide={handleClosePopup} nombreLista={'Conocimientos para el empleo'} nombreEmpleo={selectedEmpleo.nombrePuesto}>
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
                  <ListaPopup show={showPopup} onHide={handleClosePopup} nombreLista={'Tareas para el empleo'} nombreEmpleo={selectedEmpleo.nombrePuesto}>
                    {
                      <div>
                        {
                          <div>
                            {
                                selectedEmpleo[selectedSubLista] && Object.values(selectedEmpleo[selectedSubLista]).map((item, index) => (
                                  <ul className='ulEditable'>
                                    <section>
                                    <button onClick={()=>handleEditable(selectedEmpresa, `${index}|nombre`)}>
                                      <img src={editLogo} alt="Edit"/>
                                    </button>
                                      <strong>Nombre: </strong>
                                      <span>{item.nombre}</span>
                                      { editable && empresaEditable === selectedEmpresa && campoEditable === `${index}|nombre` && (

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
                                    <button onClick={()=>handleEditable(selectedEmpresa, `${index}|otras`)}>
                                      <img src={editLogo} alt="Edit"/>
                                    </button>
                                      <strong>Otras: </strong>
                                      <span>{item.otras}</span>
                                      { editable && empresaEditable === selectedEmpresa && campoEditable === `${index}|otras` && (

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
                                                <button onClick={()=>handleEditable(selectedEmpresa, `${index}|${pos}|${unDetalle.id}`)}>
                                                  <img src={editLogo} alt="Edit"/>
                                                </button>
                                                <span>{unDetalle.detalle}</span>
                                                { editable && empresaEditable === selectedEmpresa && campoEditable === `${index}|${pos}|${unDetalle.id}` && (

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

  const ListaPopup = ({ show, onHide, nombreLista, nombreEmpleo, children}) => {
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
          <option value="departamento">Departamento</option>
          <option value="edad_preferente">Preferencia de edad</option>
          <option value="nombre_puesto">Nombre del puesto</option>


        </select>
        
        {nuevoFiltro === 'rut' && (
          <input type='number' value={subFiltro} onChange={manejarCambioSubFiltro}/>
        )}
        {nuevoFiltro === 'edad_preferente' && (
          <input type='number' value={subFiltro} onChange={manejarCambioSubFiltro}/>
        )}
        {nuevoFiltro === 'nombreEmpresa' && (
          <input type='text' value={subFiltro} onChange={manejarCambioSubFiltro}/>
        )}
        {nuevoFiltro === 'departamento' && (
          <input type='text' value={subFiltro} onChange={manejarCambioSubFiltro}/>
        )}
        {nuevoFiltro === 'nombre_puesto' && (
          <input type='text' value={subFiltro} onChange={manejarCambioSubFiltro}/>
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
                  <th>Localidad</th>
                  <th>Edad Preferente</th>
                  <th>Cantidad de puestos</th>
                  <th>Acciones</th>
              </tr>
          </thead>
          <tbody>

              {empleos.map((empleo) => (
                  <tr key={empleo.id}>
                      <td>{empleo.nombrePuesto}</td>
                      <td>{empleo.localidades}</td>
                      <td>{empleo.edadPreferente}</td>
                      <td>{empleo.nroPuestosDisponible}</td>
                      <td>
                          <span class="masDetalles" onClick={() => handleSelectShow(empleo)}>Mas detalles</span>
                          {showSelect && selectedEmpleoCombo === empleo.id && (
                            <div className="selectContainer">
                              <select className="selectDropdown" onChange={(e) => handleShowPopup(e, empleo)}>
                                  <option value="">Seleccionar...</option>
                                  <option disabled value="">Datos de las empelos</option>
                                  <option value="empleo|">Datos adicionales del empelo</option>
                                  <option value="empleo|conocimientosEspecificosEmpleo">Requisitos</option>
                                  <option value="empleo|tareas">Tareas</option>
                                  <option disabled value="">Datos de las empresas</option>
                                  <option value="|">Empresa</option>
                                  <option value="datosAdicionalesEmpresa|">Datos adicionales</option>
                                  <option value="dirreccion|">Direccion</option>
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

    </div>
    </div>
    </div>
  );


};

export default BusquedaConFiltrosEmpleos;