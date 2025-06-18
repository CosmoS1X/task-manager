enum Endpoints {
  Login = '/api/login',
  Logout = '/api/logout',
  Users = '/api/users',
  User = '/api/users/:id',
  CheckEmail = '/api/check-email',
  CheckAuth = '/api/check-auth',
  Statuses = '/api/statuses',
  Status = '/api/statuses/:id',
  Labels = '/api/labels',
  Label = '/api/labels/:id',
}

export const getUserPath = (id: number) => `${Endpoints.Users}/${id}`;
export const getStatusPath = (id: number) => `${Endpoints.Statuses}/${id}`;
export const getLabelPath = (id: number) => `${Endpoints.Labels}/${id}`;
export const getCheckEmailQueryString = (email: string) => `${Endpoints.CheckEmail}?email=${email}`;

export default Endpoints;
