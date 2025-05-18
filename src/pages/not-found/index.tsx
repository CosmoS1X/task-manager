import React from 'react';

function NotFoundPage() {
  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <div className="card shadow bg-white rounded-3">
            <div className="card-body p-5 text-center">
              <h1 className="card-title">404</h1>
              <h2 className="card-text">Requested page not found</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
