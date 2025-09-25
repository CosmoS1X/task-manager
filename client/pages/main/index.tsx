import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks';

function MainPage() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <div className="card shadow bg-white rounded-3">
            <div className="card-body p-5">
              <div className="display-4 fw-bold mb-4">{t('views.main.title')}</div>
              <p className="lead">{t('views.main.description')}</p>
              {!isAuthenticated && <p className="lead">{t('views.main.registration')}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
