/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import debug from 'debug';

// const log = debug('client:log');
const errorLog = debug('client:error');

interface ApiResponse {
  message: string;
}

function App() {
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    axios.get<ApiResponse>('/api/hello')
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((error) => {
        errorLog('Error fetching data: ', error);
        setMessage('Failed to fetch message from server');
      });
  }, []);

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card mt-5">
            <div className="card-header bg-primary text-white">
              <h1 className="h3 mb-0">React + Express with TypeScript</h1>
            </div>
            <div className="card-body">
              <div className="alert alert-info">
                <p className="mb-0">
                  Server says:
                  {' '}
                  <strong>{message}</strong>
                </p>
              </div>
              <button
                type="button"
                className="btn btn-primary me-2"
                // eslint-disable-next-line no-alert
                onClick={() => alert('Bootstrap работает!')}
              >
                <i className="bi bi-house" />
                Проверить Bootstrap
              </button>
              <div className="dropdown mt-3">
                <button
                  className="btn btn-secondary dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton"
                  data-bs-toggle="dropdown"
                >
                  Пример dropdown
                </button>
                <ul className="dropdown-menu">
                  <li><a className="dropdown-item" href="#">Action</a></li>
                  <li><a className="dropdown-item" href="#">Another action</a></li>
                  <li><a className="dropdown-item" href="#">Something else</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
