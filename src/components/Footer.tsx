import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-dark text-light text-center">
      <div className="container py-3">
        <p className="lead mb-0">
          &copy;
          {' '}
          <a className="link-light text-decoration-none" href="https://github.com/CosmoS1X" target="_blank" rel="noreferrer">Cosmo</a>
          {', '}
          {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
