import React from 'react'
import ReactDOM from 'react-dom/client'
import FileUpload from './components/UploadCSV'
import Login from './components/Login'
import Menu from './components/Menu'

const App = () => {
  const components = {
    'Subir archvio': <FileUpload />,
    'Componente 2': <Login />,
  };

  return (
    <div>
      <Menu
        items={['Subir archvio', 'Componente 2']}
        components={components}
      />
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>,
)
