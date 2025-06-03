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
  Wildcard = '*',
}

export default Endpoints;
