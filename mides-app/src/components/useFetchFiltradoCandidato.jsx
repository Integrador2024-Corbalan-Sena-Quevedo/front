import { useState} from 'react';


const useFetchFiltradoCandidato = ()=> {

    const [messageFetchCandidato, setMessageFetchCandidato] =  useState('');
    const token = localStorage.getItem('token');
    const usuario = localStorage.getItem('user');


    const enviarFiltros = async (filtros) => {
        try {
          
          
          const filtrosSeleccionados = filtros.map(filtro => ({
            name: filtro.name,
            subFiltros: filtro.subFiltros,
          }));
          
          const datos = {
            filtros: filtrosSeleccionados
          };
       
          
<<<<<<< Updated upstream
          const response = await fetch('http://midesuy-env.eba-bjxi9i8c.us-east-1.elasticbeanstalk.com/filtro/candidatos', {
=======
          const response = await fetch('http://mides-web.s3-website-us-east-1.amazonaws.com/filtro/candidatos', {
>>>>>>> Stashed changes
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

    

    
<<<<<<< Updated upstream
      const response = await fetch(`http://midesuy-env.eba-bjxi9i8c.us-east-1.elasticbeanstalk.com/actualizar/candidato`, {
=======
      const response = await fetch(`http://mides-web.s3-website-us-east-1.amazonaws.com/actualizar/candidato`, {
>>>>>>> Stashed changes
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({candidatoId:candidatoId, campo:campo, userName:usuario, datoAct:datoAct, datoAnt:datoAnt, lista:lista, subLista:subLista})
      });

      return response;
    } catch (error) {
      console.error('Error:', error);
      setMessageFetchCandidato('Error al actualizar');
      return response;
    }
  };


  const eliminarDatoLista = async (candidatoId, lista, subLista, idAEliminar) => {

   
    try {
<<<<<<< Updated upstream
      const response = await fetch(`http://midesuy-env.eba-bjxi9i8c.us-east-1.elasticbeanstalk.com/actualizar/eliminarSubLista`, {
=======
      const response = await fetch(`http://mides-web.s3-website-us-east-1.amazonaws.com/actualizar/eliminarSubLista`, {
>>>>>>> Stashed changes
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({candidatoId:candidatoId,userName:usuario, lista:lista, subLista:subLista, id:idAEliminar})
      });

      return response;
  
    } catch (error) {
      console.error('Error:', error);
      return error;
    }
  };

  const actualizarCandidato = async (candidadtoId) => {
    try {
<<<<<<< Updated upstream
      const response = await fetch(`http://midesuy-env.eba-bjxi9i8c.us-east-1.elasticbeanstalk.com/filtro/unCandidato`, {
=======
      const response = await fetch(`http://mides-web.s3-website-us-east-1.amazonaws.com/filtro/unCandidato`, {
>>>>>>> Stashed changes
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

  const traerIdiomas = async () => {
    try {
<<<<<<< Updated upstream
      const response = await fetch(`http://midesuy-env.eba-bjxi9i8c.us-east-1.elasticbeanstalk.com/actualizar/idiomasAll`, {
=======
      const response = await fetch(`http://mides-web.s3-website-us-east-1.amazonaws.com/actualizar/idiomasAll`, {
>>>>>>> Stashed changes
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      if (!response.ok) {
        throw new Error('Error al obtener los idiomas');
      }
      
      const idiomas = await response.json();
      return idiomas
    } catch (error) {
      console.error('Error al obtener los idiomas', error);
    }


    
  }

  const agregarALista = async (candidatoId, lista, subLista, id) => {
    try {
<<<<<<< Updated upstream
      const response = await fetch(`http://midesuy-env.eba-bjxi9i8c.us-east-1.elasticbeanstalk.com/actualizar/agregarSubLista`, {
=======
      const response = await fetch(`http://mides-web.s3-website-us-east-1.amazonaws.com/actualizar/agregarSubLista`, {
>>>>>>> Stashed changes
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({candidatoId:candidatoId, userName:usuario, lista:lista, subLista:subLista, id:id}), 
      });

      return response;

    } catch (error) {
      console.error('Error al agregar', error);
      return error
    }
  };

  
   

    return{
      messageFetchCandidato, enviarFiltros, actualizarCampo, eliminarDatoLista, agregarALista, actualizarCandidato, traerIdiomas
    }

}
export default useFetchFiltradoCandidato;