import React from 'react';
import LangSwitcher from './LangSwitcher';

export default function Footer() {
  return (
    <footer className="bg-dark text-light text-center">
      <div className="container py-3">
        <div className="d-flex align-items-center justify-content-between">
          <p className="lead mb-0">
            &copy;
            {' '}
            <a className="link-light text-decoration-none" href="https://github.com/CosmoS1X" target="_blank" rel="noreferrer">Cosmo</a>
            {', '}
            {new Date().getFullYear()}
          </p>
          <LangSwitcher />
        </div>
      </div>
    </footer>
  );
}
