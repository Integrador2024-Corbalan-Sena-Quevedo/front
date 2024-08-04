import React, { useState } from 'react';
import '../styles/FileUpload.css'

import { Button } from 'bootstrap';

import uploadIcon from "../img/upload.png"

const FileUpload = () => {
  const token = localStorage.getItem('token');
  const [file, setFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const [selectedOptionTypeFile, setSelectedOptionTypeFile] = useState('');



  const handleFileChange = (e) => {
    console.log(e.target.files[0].name)
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

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', selectedOptionTypeFile);

    try {
      const response = await fetch('http://localhost:8080/upload-csv', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: formData
      })

      console.log(response)
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
            <button type="sumbit" className="btn-attachment">Enviar</button>
        </form>
        {uploadMessage && <p id="upload-message">{uploadMessage}</p>}
    </div>
  );
};

export default FileUpload;