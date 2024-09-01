import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import FileUpload from './components/UploadCSV';
import Login from './components/Login';
import Menu from './components/Menu';
import Home from './components/Home';
import Logout from './components/Logout';
import { JobMatch } from './components/JobMatch';
import PrivateRoute from './components/PrivateRoute';
import Register from './components/Register';

const App = () => {
  const token = localStorage.getItem('token');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={token ? <Navigate to="/menu/home" replace /> : <Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/menu/*" element={<PrivateRoute />} />
      </Routes>
    </BrowserRouter>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);