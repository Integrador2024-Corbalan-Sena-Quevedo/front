import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import "../styles/PdfModal.css";
import uploadIcon from "../img/upload.png"


const PdfModal = ({ show, onHide, pdfUrl, candidatoDTO}) => {
    const [file, setFile] = useState(null);
    const [localPdfUrl, setLocalPdfUrl] = useState(pdfUrl);
    const [uploading, setUploading] = useState(false);
    const token = localStorage.getItem('token');
    const [uploadMessage, setUploadMessage] = useState('');

    useEffect(() => {
        setLocalPdfUrl(pdfUrl);
    }, [pdfUrl]);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        setUploadMessage(event.target.files[0].name);
        
    };

    useEffect(() => {
        if (!show) {
            setFile(null);
            setUploadMessage('');
        }
    }, [show]);

    const handleUpload = async () => {

        if (!file) {
            setUploadMessage("Seleccione un archivo")
            return;
          }
            setUploading(true)
            try {
                const data = new FormData();
                data.append('file', file)
                data.append('candidatoId', candidatoDTO.candidatoId)

                const response = await fetch('http://midesuy-env.eba-bjxi9i8c.us-east-1.elasticbeanstalk.com/uploadCV', {
                    method:"POST",
                    headers:{
                        'Authorization' : `Bearer ${token}`
                    },
                    body: data
                })
                
                if (response.ok) {
                    const url = URL.createObjectURL(file);
                    setLocalPdfUrl(url)
                    setFile(null);
                    setUploadMessage('');
                }else {
                    setUploadMessage('Error al subir el archivo');
                }

            } catch (error) {
                console.error('Network error:', error);
            }
            finally {
                setUploading(false);
            }
    };

    const onDeletePdf = async () => {
       
        try {
            const response = await fetch('http://midesuy-env.eba-bjxi9i8c.us-east-1.elasticbeanstalk.com/deleteCv', {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(candidatoDTO.candidatoId)
            });
    
            if (response.ok) {
                setLocalPdfUrl(null);
            } else {
                console.error(`Error: ${response.status} ${response.statusText}`);
                const errorResponse = await response.json();
                console.error('Error response:', errorResponse);
                setUploadMessage('Error al borrar el archivo')
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    };

    return (
        <Modal show={show} onHide={onHide} dialogClassName="custom-modal-size">
            <Modal.Header closeButton>
                <Modal.Title>CV del Candidato</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {localPdfUrl ? (
                    <>
                        <iframe src={localPdfUrl} width="900px" height="490px" title="CV Viewer" />
                        <Button variant="danger" onClick={onDeletePdf} disabled={uploading}>
                            Borrar PDF
                        </Button>
                    </>
                ) : (
                    <div className="upload-container-cv">
                        <label htmlFor="file-input" className="upload-label">
                            <img src={uploadIcon} alt="Upload" className="upload-icon-cv" />
                        </label>
                        <input type="file" id="file-input" accept="application/pdf" onChange={handleFileChange} />
                        <Button variant="primary" onClick={handleUpload} disabled={!file || uploading}>
                            {uploading ? 'Subiendo...' : 'Subir PDF'}
                        </Button>
                        {uploadMessage && <p id="upload-message">{uploadMessage}</p>}
                    </div>
                )
                }
               
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};


export default PdfModal;