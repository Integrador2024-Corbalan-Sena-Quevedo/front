import  { useState } from 'react';
import '../styles/FileUpload.css'


import uploadIcon from "../img/upload.png"

const FileUpload = () => {
  const token = localStorage.getItem('token');
  const [file, setFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const [selectedOptionTypeFile, setSelectedOptionTypeFile] = useState('');
  const [isSubmit, setIsSubmit] = useState(false);



  const handleFileChange = (e) => {
  
    setUploadMessage(e.target.files[0].name)
    setFile(e.target.files[0]);
  };

  const handleTypeFileChange = (e) => {
    setSelectedOptionTypeFile(e.target.value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setUploadMessage("Seleccione un archivo")
      return;
    }

    if (!selectedOptionTypeFile) {
      setUploadMessage("Seleccione un tipo");
      return;
    }

    setIsSubmit(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', selectedOptionTypeFile);


    try {
    
      const response = await fetch('http://midesuy-env.eba-bjxi9i8c.us-east-1.elasticbeanstalk.com/upload-csv', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

     
      if(response.status === 200){
       const data = await response.text()
        setUploadMessage(data)
        setFile(null);
        setSelectedOptionTypeFile('');
        document.getElementById('csv-file-input').value = '';
      }else{
        const data = await response.text()
        setUploadMessage(data)
      }
    } catch (error) {
      console.error('Error al enviar el archivo:', error);
    }
    finally {
      setIsSubmit(false); // Volver a habilitar el botón después de completar la carga
    }
  };

  const handleLabelClick = () => {
    document.getElementById('csv-file-input').value = ''; 
    setUploadMessage('');
  };

  return (
    <div className="upload-container">
        <h1>Subir archivo CSV</h1>
        <form id="csv-upload-form" onSubmit={handleSubmit}>
        <label htmlFor="csv-file-input" className="file-input-label" onClick={handleLabelClick}>
                <img src={uploadIcon} alt="Logo" className="upload-icon" />
            </label>
            
            <input type="file" id="csv-file-input" accept=".csv" onChange={handleFileChange} style={{ display: 'none' }} />
            <select className="styled-select" value={selectedOptionTypeFile} onChange={handleTypeFileChange}>
              <option value="">Seleccione un tipo</option>
              <option value="CANDIDATE">Candidato</option>
              <option value="COMPANY">Empresa</option>
            </select>
            <button type="sumbit" className="btn-attachment" disabled={isSubmit}>Enviar</button>
        </form>
        {uploadMessage && <p id="upload-message">{uploadMessage}</p>}    
    </div>
  );
};

export default FileUpload;