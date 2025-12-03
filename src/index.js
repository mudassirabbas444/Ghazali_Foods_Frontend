import React from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { API_CONFIG } from './constants';

// Log API configuration on app start
console.log('🚀 App Starting...');
console.log('📡 API Configuration:', API_CONFIG);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    <ToastContainer
      position="top-center"
      autoClose={3000}
      hideProgressBar={true}
      newestOnTop={true}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable={false}
      pauseOnHover
      theme="light"
      style={{ display: 'none' }}
    />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
