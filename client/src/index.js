import React from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ToastContainer draggable pauseOnHover closeOnClick newestOnTop={false} autoClose={3000} position="top-right" />
    <App />
  </React.StrictMode>
);

