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
  Tasks = '/tasks',
  Wildcard = '*',
}

export default Endpoints;
