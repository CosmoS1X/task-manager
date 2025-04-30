import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import cn from 'classnames';
import Routes from '@/endpoints';

export default function Header() {
  const linkClasses = cn('nav-link', 'px-2', 'link-dark');

  return (
    <header className="bg-white mb-4">
      <div className="container">
        <nav className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3">
          <Link to={Routes.Home} className="col-md-3 mb-2 mb-md-0 text-dark text-decoration-none fs-4">
            <i className="bi bi-card-checklist" />
            {' '}
            Task Manager
          </Link>
          <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
            <li><NavLink to={Routes.Users} className={linkClasses}>Users</NavLink></li>
            <li><NavLink to={Routes.Statuses} className={linkClasses}>Statuses</NavLink></li>
            <li><NavLink to={Routes.Labels} className={linkClasses}>Labels</NavLink></li>
            <li><NavLink to={Routes.Tasks} className={linkClasses}>Tasks</NavLink></li>
          </ul>
          <div className="col-md-3 text-end">
            <Link to={Routes.Login} className="btn btn-outline-primary me-2">Login</Link>
            <Link to={Routes.SignUp} className="btn btn-primary">Sign-up</Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
