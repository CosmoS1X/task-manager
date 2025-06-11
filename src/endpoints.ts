enum Endpoints {
  Home = '/',
  Login = '/login',
  SignUp = '/signup',
  Users = '/users',
  UserEdit = '/users/:id/edit',
  Statuses = '/statuses',
  NewStatus = '/statuses/new',
  EditStatus = '/statuses/:id/edit',
  Labels = '/labels',
  NewLabel = '/labels/new',
  EditLabel = '/labels/:id/edit',
  Tasks = '/tasks',
  NewTask = '/tasks/new',
  EditTask = '/tasks/:id/edit',
  ShowTask = '/tasks/:id',
  NotFound = '/not-found',
  Wildcard = '*',
}

export const getEditRoute = (endpoint: string, id: number) => `${endpoint}/${id}/edit`;

export default Endpoints;
