import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Endpoints from '@/endpoints';
import Header from './Header';
import Footer from './Footer';
import {
  MainPage,
  NotFoundPage,
  SignUpPage,
  LoginPage,
  UsersPage,
  StatusesPage,
  LabelsPage,
  TasksPage,
} from '../pages';

export default function App() {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100 bg-light">
        <Header />
        <main className="container wrapper flex-grow-1">
          <Routes>
            <Route path={Endpoints.Home} element={<MainPage />} />
            <Route path={Endpoints.SignUp} element={<SignUpPage />} />
            <Route path={Endpoints.Login} element={<LoginPage />} />
            <Route path={Endpoints.Users} element={<UsersPage />} />
            <Route path={Endpoints.Statuses} element={<StatusesPage />} />
            <Route path={Endpoints.Labels} element={<LabelsPage />} />
            <Route path={Endpoints.Tasks} element={<TasksPage />} />
            <Route path={Endpoints.Wildcard} element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
