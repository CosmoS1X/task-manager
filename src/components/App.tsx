import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import ProtectedLayout from './ProtectedLayout';
import Endpoints from '@/endpoints';
import Header from './Header';
import Footer from './Footer';
import {
  MainPage,
  NotFoundPage,
  SignUpPage,
  LoginPage,
  UsersPage,
  EditUserPage,
  StatusesPage,
  NewStatusPage,
  EditStatusPage,
  LabelsPage,
  NewLabelPage,
  EditLabelPage,
  TasksPage,
  NewTaskPage,
  EditTaskPage,
  ShowTaskPage,
} from '../pages';

export default function App() {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100 bg-light">
        <Header />
        <main className="container wrapper flex-grow-1">
          <Routes>
            <Route element={<ProtectedLayout />}>
              {/* protected routes */}
              <Route path={Endpoints.Users} element={<UsersPage />} />
              <Route path={Endpoints.UserEdit} element={<EditUserPage />} />
              <Route path={Endpoints.Statuses} element={<StatusesPage />} />
              <Route path={Endpoints.NewStatus} element={<NewStatusPage />} />
              <Route path={Endpoints.EditStatus} element={<EditStatusPage />} />
              <Route path={Endpoints.Labels} element={<LabelsPage />} />
              <Route path={Endpoints.NewLabel} element={<NewLabelPage />} />
              <Route path={Endpoints.EditLabel} element={<EditLabelPage />} />
              <Route path={Endpoints.Tasks} element={<TasksPage />} />
              <Route path={Endpoints.NewTask} element={<NewTaskPage />} />
              <Route path={Endpoints.EditTask} element={<EditTaskPage />} />
              <Route path={Endpoints.ShowTask} element={<ShowTaskPage />} />
            </Route>
            {/* public routes */}
            <Route path={Endpoints.Home} element={<MainPage />} />
            <Route path={Endpoints.SignUp} element={<SignUpPage />} />
            <Route path={Endpoints.Login} element={<LoginPage />} />
            <Route path={Endpoints.Wildcard} element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
        <ToastContainer newestOnTop />
      </div>
    </BrowserRouter>
  );
}
