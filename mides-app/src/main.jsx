import React from 'react'
import ReactDOM from 'react-dom/client'
import FileUpload from './components/UploadCSV'
import Login from './components/Login'
import Menu from './components/Menu'
import Home from './components/Home'
import Logout from './components/Logout'
import { JobMatch } from './components/JobMatch'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

const App = () => {
  const components = {
    'Subir archivo': <FileUpload />,
    'Home': <Home />,
    'Match': <JobMatch/>,
    'Logout': <Logout />
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/menu" element={<Menu items={['Home', 'Subir archivo','Match','Logout']} components={components} />}>
          <Route index element={<Navigate to="home" />} />
          <Route path="home" element={<Home />} />
          <Route path="subirarchivo" element={<FileUpload />} />
          <Route path="logout" element={<Logout />} />
        </Route>
        <Route path="/uploadCSV" element={<FileUpload />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
