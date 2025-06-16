enum Endpoints {
  Login = '/api/login',
  Logout = '/api/logout',
  Users = '/api/users',
  User = '/api/users/:id',
  CheckEmail = '/api/check-email',
  CheckAuth = '/api/check-auth',
}

export const getUserPath = (id: number) => `${Endpoints.Users}/${id}`;
export const getCheckEmailQueryString = (email: string) => `${Endpoints.CheckEmail}?email=${email}`;

export default Endpoints;
