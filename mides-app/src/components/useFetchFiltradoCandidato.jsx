import { useState} from 'react';


const useFetchFiltradoCandidato = ()=> {

    const [messageFetchCandidato, setMessageFetchCandidato] =  useState('');
    const token = localStorage.getItem('token');


    const enviarFiltros = async (filtros) => {
        try {
          
          
          const filtrosSeleccionados = filtros.map(filtro => ({
            name: filtro.name,
            subFiltros: filtro.subFiltros,
          }));
          
          const datos = {
            filtros: filtrosSeleccionados
          };
          console.log(JSON.stringify(datos));
          
          const response = await fetch('http://localhost:8080/filtro/candidatos', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
          });
          
          if (!response.ok) {
            throw new Error('Respuesta incorrecta');
          }
          
          const candidatos = await response.json();
          return candidatos;
        } catch (error) {
          console.error('Error:', error);
        }
      };


    const actualizarCampo = async (candidatoId, campo, datoAct, datoAnt, lista, subLista) => {
    try {

      console.log(JSON.stringify(candidatoId, campo, datoAct, datoAnt, lista, subLista))

      console.log(token);
      const response = await fetch(`http://localhost:8080/actualizar/candidato`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({candidatoId:candidatoId, campo:campo, datoAct:datoAct, datoAnt:datoAnt, lista:lista, subLista:subLista})
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


  const eliminarDatoLista = async (candidatoId, lista, subLista, idAEliminar) => {

    console.log(token);
    try {
      const response = await fetch(`http://localhost:8080/actualizar/eliminarSubLista`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({candidatoId:candidatoId, lista:lista, subLista:subLista, id:idAEliminar})
      });
  
      if (response.status === 200) {
        console.log('Correcto');
        return setMessageFetchCandidato('Eliminado correctamente');
      } else {
        console.error('Error');
        return setMessageFetchCandidato('Error al eliminar');
      }
    } catch (error) {
      console.error('Error:', error);
      return setMessageFetchCandidato('Error al eliminar');
    }
  };

  const actualizarCandidato = async (candidadtoId) => {
    debugger
    try {
      const response = await fetch(`http://localhost:8080/filtro/unCandidato`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(candidadtoId), 
      });
      if (!response.ok) {
        throw new Error('Error al actualizar candidato');
      }
      const candidato = await response.json();
      return candidato;
    } catch (error) {
      console.error('Error al obtener el candidato', error);
    }


    
  }

  const agregarALista = async (candidatoId, lista, subLista, id) => {
    

    try {
      const response = await fetch(`http://localhost:8080/actualizar/agregarSubLista`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({candidatoId:candidatoId, lista:lista, subLista:subLista, id:id}), 
      });

      if (response.ok) {
        const result = await response.text();
        return setMessageFetchCandidato(result);
      } else {
        return setMessageFetchCandidato('Error al agregar');
      }
    } catch (error) {
      console.error('Error al agregar', error);
      return setMessageFetchCandidato('Error al agregar');
    }
  };

  
   

    return{
        enviarFiltros, actualizarCampo, messageFetchCandidato, eliminarDatoLista, agregarALista, actualizarCandidato
    }

}
export default useFetchFiltradoCandidato;