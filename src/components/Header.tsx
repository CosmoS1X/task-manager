import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import Endpoints from '@/endpoints';
import useAuth from '@/hooks/useAuth';
import Button from './Button';

export default function Header() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const linkClasses = cn('nav-link', 'px-2', 'link-dark');

  const handleLogout = async () => {
    await logout();
    navigate(Endpoints.Login, { replace: true });
  };

  return (
    <header className="bg-white mb-4">
      <div className="container">
        <nav className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3">
          <Link to={Endpoints.Home} className="col-md-3 mb-2 mb-md-0 text-dark text-decoration-none fs-4">
            <i className="bi bi-card-checklist" />
            {' '}
            {t('appName')}
          </Link>
          {isAuthenticated && (
            <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
              <li><NavLink to={Endpoints.Users} className={linkClasses}>{t('navbar.users')}</NavLink></li>
              <li><NavLink to={Endpoints.Statuses} className={linkClasses}>{t('navbar.statuses')}</NavLink></li>
              <li><NavLink to={Endpoints.Labels} className={linkClasses}>{t('navbar.labels')}</NavLink></li>
              <li><NavLink to={Endpoints.Tasks} className={linkClasses}>{t('navbar.tasks')}</NavLink></li>
            </ul>
          )}
          <div className="col-md-3 text-end">
            {isAuthenticated
              ? <Button variant="outline-primary" onClick={handleLogout}>{t('buttons.signOut')}</Button>
              : (
                <>
                  <Link to={Endpoints.Login} className="btn btn-outline-primary me-2">{t('navbar.signIn')}</Link>
                  <Link to={Endpoints.SignUp} className="btn btn-primary">{t('navbar.signUp')}</Link>
                </>
              )}
          </div>
        </nav>
      </div>
    </header>
  );
}
