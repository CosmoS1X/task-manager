export type User = {
  id: number,
  firstName: string,
  lastName: string,
  email: string,
  createdAt: string,
};

export type Credentials = {
  email: string,
  password: string,
};

export type EntitiesUnion = User;
export type TableNamesUnion = 'users';
export type ColNamesUnion = 'id' | 'fullName' | 'email' | 'createdAt';
