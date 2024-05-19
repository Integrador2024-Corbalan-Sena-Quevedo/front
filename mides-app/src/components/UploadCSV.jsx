import React, { useState } from 'react';
import '../styles/FileUpload.css'

import { Button } from 'bootstrap';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');


  const handleFileChange = (e) => {
    console.log(e.target.files[0].name)
    setUploadMessage(e.target.files[0].name)
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setUploadMessage("Seleccione un archivo")
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8080/upload-csv', {
        method: 'POST',
        body: formData,
      })

      console.log(response)
      if(response.status === 200){
       const data = await response.text()
        setUploadMessage(data)
        setFile(null);
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
    <div class="upload-container">
        <h1>Subir archivo CSV</h1>
        <form id="csv-upload-form" onSubmit={handleSubmit}>
            <label for="csv-file-input" class="file-input-label" onClick={handleLabelClick}>
                <img src="src\img\upload.png" alt="Logo" class="upload-icon" />
            </label>
            <input type="file" id="csv-file-input" accept=".csv" onChange={handleFileChange} style={{ display: 'none' }} />
            <button type="sumbit" class="btn-attachment">Enviar</button>
        </form>
        {uploadMessage && <p id="upload-message">{uploadMessage}</p>}
    </div>
  );
};

export default FileUpload;