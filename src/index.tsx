import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap-icons/font/bootstrap-icons.css';
import App from './components/App';

const mountNode = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(mountNode);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
