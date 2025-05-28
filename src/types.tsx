export type Credentials = {
  email: string;
  password: string;
};

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
};

export type Status = {
  id: number;
  name: string;
  createdAt: string;
};

export type EntityMap = {
  users: User;
  statuses: Status;
};

export type TableNamesUnion = keyof EntityMap;

type ColumnMap = {
  users: Array<keyof User | 'fullName'>;
  statuses: Array<keyof Status>;
};

export type TableColumns<T extends TableNamesUnion> = ColumnMap[T];

export type TableRows<T extends TableNamesUnion> = EntityMap[T][];
